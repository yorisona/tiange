import { computed, defineComponent, h, inject, Ref, ref } from '@vue/composition-api';
import SettlementStep3Layout from '@/modules/settlement/component/step3.layout.vue';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import { wait } from '@/utils/func';
import {
  Settlement,
  SettlementStep,
  SettlementStep3MakettingFrm,
  SettlementStep3MakettingParams,
  SettlementSubmitParams,
} from '@/types/tiange/finance/settlement';
import { ElForm } from 'element-ui/types/form';
import { FormRule } from '@/types/vendor/form';
import Decimal from 'decimal.js';
// import { ElFormRef, validate } from '@/utils/form';
import { SaveSettlementStep3Marketing, SubmitSettlementStep3 } from '@/services/finance/settlement';
import { Decimal2String } from '@/utils/string';
import { HttpRequestOptions } from 'element-ui/types/upload';
import { uploadFileService } from '@/services/file';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { set, get } from '@vueuse/core';
import TopCard from '@/modules/settlement/component/top.card.vue';
import { Loading } from 'element-ui';
import { GetContractUid } from '@/services/contract';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import use from '@/modules/customer/contract/list/use';
import { ContractSettlement } from '@/types/tiange/contract';
import moment from 'moment';

type FormRules = {
  [prop in keyof SettlementStep3MakettingFrm]?: FormRule<SettlementStep3MakettingFrm[prop]>[];
};

export default defineComponent({
  components: {
    SettlementStep3Layout,
    CardLayout,
    TopCard,
  },
  setup(props, ctx) {
    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);

    const step3FrmRef = ref<ElForm | null>(null);
    const step3FrmSecondRef = ref<ElForm | null>(null);
    const step3Frm = ref<SettlementStep3MakettingFrm>({
      settlement_files: [],
      contract_id: undefined,
      seal_type: null,
    });
    const contract_uid = ref('');
    let loading: any;
    const startLoading = () => {
      // 使用Element loading-start 方法
      loading = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)',
      });
    };
    const step3FrmRules = ref<FormRules>({
      settlement_files: [
        {
          required: true,
          message: '请上传结算单',
          trigger: 'blur',
        },
      ],
      seal_type: [
        {
          required: true,
          message: '请选择是否盖章',
          trigger: 'change',
        },
      ],
      contract_id: [
        {
          required: true,
          message: '请选择合同',
          trigger: 'change',
        },
      ],
    });
    const originalFrmData = ref<SettlementStep3MakettingFrm>({
      settlement_files: [],
      contract_id: undefined,
    });

    /** 重置表单数据 */
    const resetFrm = () => {
      step3Frm.value.settlement_files = [];
      step3Frm.value.contract_id = undefined;
    };

    /** 重置表单原始数据 */
    const resetOriginalFrmData = () => {
      originalFrmData.value.settlement_files = [];
      originalFrmData.value.contract_id = undefined;
    };

    /** 编辑模式下有数据变化 */
    const isEditModeChanged = computed(
      () => JSON.stringify(get(originalFrmData)) !== JSON.stringify(get(step3Frm)),
    );

    const DataForm = ref<{
      tax_rate: string;
      company_name: string;
      is_include_tax: 0 | 1;
      invoice_type: number | undefined;
    }>({
      company_name: '',
      is_include_tax: 0,
      tax_rate: '',
      invoice_type: undefined,
    });

    /** 填充表单数据 */
    const fillForm = (data: Settlement) => {
      resetFrm();
      resetOriginalFrmData();
      const { ...rest } = data;
      DataForm.value.company_name = rest.company_name;
      DataForm.value.is_include_tax = data.is_include_tax === 0 ? 0 : 1;
      DataForm.value.invoice_type = data.invoice_type;
      DataForm.value.tax_rate = data.tax_rate?.toString() ?? '';

      step3Frm.value.settlement_files = rest.settlement_files.map(el => el);
      step3Frm.value.contract_id = data.contract_id || undefined;
      originalFrmData.value.settlement_files = rest.settlement_files.map(el => el);
      originalFrmData.value.contract_id = data.contract_id || undefined;
      contract_uid.value = data.contract_uid || '';
    };

    /** 总结算金额(计算版本) */
    const amount = computed(() => new Decimal(settlement.value?.total_settle_amount ?? '0'));

    /** 总结算金额(显示版本) */
    const total_settle_amount = computed(() => get(amount).toString());

    /** 保存加载中 */
    const saveLoading = ref(false);

    /** 保存 */
    const saveStep3Data = async (next: boolean) => {
      if (settlement.value === undefined) {
        console.warn('不存在结算数据');
        return;
      }

      /*  const result = await validate(step3FrmRef as Ref<ElFormRef>);
      if (!result) {
        return;
      }
      const result_two = await validate(step3FrmSecondRef as Ref<ElFormRef>);
      if (!result_two) {
        return;
      }*/
      const { settlement_files } = get(step3Frm);

      const payload: SettlementStep3MakettingParams = {
        id: settlement.value.id,
        settlement_files,
        contract_id: step3Frm.value.contract_id,
        step: next ? SettlementStep.step_three : settlement.value.step,
      };

      set(saveLoading, true);
      const [{ data: response }] = await wait(500, SaveSettlementStep3Marketing(payload));
      set(saveLoading, false);

      return response;
    };

    const prev = async () => {
      // 编辑模式但无数据变更 则直接上一步
      // 总结算金额小于等于0 等同于新建无数据
      if (!get(isEditModeChanged)) {
        ctx.emit('prev');
        return;
      }

      const response = await saveStep3Data(false);

      if (response?.success) {
        ctx.root.$message.success('保存成功');
        ctx.emit('prev', response.data);
        return true;
      } else {
        return false;
      }
    };

    const submit = async () => {
      if (settlement.value === undefined) {
        return;
      }
      // settlement.value.is_estimate === 0 &&
      if (step3Frm.value.settlement_files.length === 0) {
        ctx.root.$message.warning('请上传结算单');
        return;
      }
      /* if (
        settlement.value.is_estimate === 0 &&
        (step3Frm.value.seal_type  === undefined || step3Frm.value.seal_type  === '')
      ) {
        ctx.root.$message.warning('请选择是否盖章');
        return;
      }
      if (
        settlement.value.is_estimate === 0 &&
        step3Frm.value.seal_type  === 2 &&
        !step3Frm.value.contract_id
      ) {
        ctx.root.$message.warning('请选择合同');
        return;
      }*/
      const result = await AsyncConfirm(ctx, {
        title: '确定提交结算单吗?',
        content: () =>
          h('div', [
            h('div', '提交后将无法修改结算信息，确定要将结算单'),
            h('div', '提交给财务确认吗?'),
          ]),
      });

      if (!result) {
        return;
      }

      const payload: SettlementSubmitParams = {
        id: settlement.value.id,
        contract_id: step3Frm.value.contract_id,
      };
      // if (settlement.value.is_estimate === 0) {
      payload.settlement_files = step3Frm.value.settlement_files;
      // }

      set(saveLoading, true);
      const [{ data: response }] = await wait(500, SubmitSettlementStep3(payload));
      set(saveLoading, false);

      if (response?.success) {
        ctx.root.$message.success('提交成功');
        ctx.emit('submit:success');
      } else if (response?.success === false) {
        ctx.root.$message.error(response.message ?? '提交失败');
      } else {
        // do nth
      }
    };

    /** 关闭前保存 */
    const saveBeforeClose = async () => {
      const response = await saveStep3Data(false);

      if (response?.success) {
        ctx.root.$message.success('保存成功');
        ctx.emit('next', response.data);
        return true;
      } else {
        return false;
      }
    };

    /** 判断关闭前是否需要弹窗确认 */
    const confirmBeforeClose = async () => get(isEditModeChanged);

    /** 服务费(显示用) */
    const income_amount = computed(() =>
      Decimal2String(new Decimal(settlement.value?.income_amount ?? 0)),
    );

    const adjust_info = computed(() => {
      return (settlement.value?.adjust_info ?? []).map(el => {
        return {
          adjust_amount: Decimal2String(new Decimal(el.adjust_amount)),
          adjust_reason: el.adjust_reason,
        };
      });
    });

    /** 手工调账总额 */
    const adjust_info_amount_total = computed(() => {
      const total = (settlement.value?.adjust_info ?? []).reduce(
        (acc, cur) => Decimal.add(acc, new Decimal(cur.adjust_amount)),
        new Decimal(0),
      );
      return Decimal2String(total);
    });

    const isFileUploaderDisabled = computed(() => step3Frm.value.settlement_files.length >= 5);

    const size_limit = 30 * 1024 * 1024;
    const beforeUpload = async (file: File) => {
      if (file.size > size_limit) {
        ctx.root.$message.error(
          `${file.name} ${(file.size / size_limit).toFixed(2)}MB 请限制在30MB以内`,
        );
        return Promise.reject();
      }
    };

    const uploadFileHandler = async (value: HttpRequestOptions) => {
      const file = value.file;
      if (file.size > 30 * 1024 * 1024) {
        ctx.root.$message.error('上传文件大小不能超过 30MB!');
        return;
      }
      startLoading();
      const formData = new FormData();
      const filename = value.file.name;
      formData.append('file', value.file, filename);
      formData.append('type', 'settlement');

      const res = await uploadFileService(formData);
      loading.close();
      if (res.data.success) {
        step3Frm.value.settlement_files.push(res.data.data.source);
        ctx.root.$message.success('上传成功');
        step3FrmRef.value?.clearValidate();
      } else {
        ctx.root.$message.error(res.data.message ?? '上传失败，稍后重试');
      }
    };

    const onRemoveFile = (index: number) => {
      step3Frm.value.settlement_files.splice(index, 1);
    };

    const contract_id_list = ref<ContractSettlement[]>([]);
    // 关联客户合同输入值获取
    const { project_id } = useProjectBaseInfo();
    const getContract = async (kw?: string) => {
      const res = await GetContractUid({
        company_name: kw,
        only_main: 0,
        cooperation_id: project_id.value,
        contract_status: 2,
        partner_type: 1,
        settlement_start_date: settlement.value
          ? moment(settlement.value.start_date * 1000).format('YYYY-MM-DD')
          : undefined,
        settlement_end_date: settlement.value
          ? moment(settlement.value.end_date * 1000).format('YYYY-MM-DD')
          : undefined,
      });
      if (res.data.success) {
        contract_id_list.value = res.data.data.data;
      } else {
        contract_id_list.value = [];
      }
    };
    getContract('');
    // 选择关联框架合同
    const selectContractUidChange = (val: any) => {
      step3Frm.value.contract_id = val;
    };
    const contractClick = () => {
      const contract = use.useContract('1', ctx);
      contract.contractClick(
        step3Frm.value.contract_id as number,
        true,
        project_id.value || settlement.value?.project_id,
      );
    };
    return {
      contract_id_list,
      getContract,
      selectContractUidChange,
      settlement,
      total_settle_amount,
      amount,
      step3Frm,
      step3FrmRef,
      step3FrmSecondRef,
      step3FrmRules,
      resetFrm,
      prev,
      submit,
      confirmBeforeClose,
      saveBeforeClose,
      saveLoading,
      fillForm,
      income_amount,
      adjust_info,
      adjust_info_amount_total,
      DataForm,
      beforeUpload,
      isFileUploaderDisabled,
      uploadFileHandler,
      onRemoveFile,
      contractClick,
    };
  },
});
