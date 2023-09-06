import moment from 'moment';
/** 业务结算 提交 阶段 */
import { computed, defineComponent, h, inject, Ref, ref, watch } from '@vue/composition-api';
import SettlementStep3Layout from '@/modules/settlement/component/step3.layout.vue';
import { HttpRequestOptions } from 'element-ui/types/upload';
import { uploadFileService } from '@/services/file';
import { sleep } from '@/utils/func';
import {
  saveSettlementDataService,
  submitSettlementDataService,
} from '@/services/finance/settlement';
import {
  Settlement,
  SettlementSubmitParams,
  SettlementShopLiveDataForm,
  SettlementDataUnionParams,
  SettlementStep,
} from '@/types/tiange/finance/settlement';
import { Decimal2String, formatAmountWithoutPrefix } from '@/utils/string';
import Decimal from 'decimal.js';
import { BusinessTypeEnum } from '@/types/tiange/common';
import { AsyncConfirm } from '@/use/asyncConfirm';
import lodash from '@/utils/lodash/custom';
import TopCard from '@/modules/settlement/component/top.card.vue';
import { Loading } from 'element-ui';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import { GetContractUid } from '@/services/contract';
import { ElForm } from 'element-ui/types/form';
import { ContractSettlement } from '@/types/tiange/contract';
const { debounce } = lodash;

export default defineComponent({
  name: 'TgSettlementDataForm',
  components: {
    SettlementStep3Layout,
    TopCard,
  },
  props: {},
  setup(props, ctx) {
    /** 总结算金额 */
    const total_amount = ref('0.00');
    const saveLoading = ref(false);
    const format_total_amout = computed(() => Decimal2String(new Decimal(total_amount.value)));
    const injectSettlement =
      inject<Ref<Settlement | undefined>>('settlement') ?? ref<undefined>(undefined);
    const isTaobaoShopLiveType = computed(
      () => injectSettlement.value?.business_type === BusinessTypeEnum.taobao,
    );
    const newProject = JSON.stringify(inject('project3in1', { cooperation_type: 0 }));
    const jsonProject = JSON.parse(newProject);
    const cooperation_type = ref(
      jsonProject.value?.cooperation_type === 2 ||
        inject('cooperation_type', {
          value: 1,
        }).value === 2
        ? 2
        : 1,
    );

    const elFormRef = ref<ElForm | undefined>(undefined);

    let loading: any;
    const startLoading = () => {
      // 使用Element loading-start 方法
      loading = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)',
      });
    };
    const DisplayForm = ref({
      id: -1,
      service_amount: '',
      marketing_advertising_amount: '',
      commission: '',
      recommend_amount: '',
      total_duration: '',
      total_live_num: '',
      record_count: 0,
      company_name: '--',
      business_type: 3,
    });

    const DataForm = ref<
      SettlementShopLiveDataForm & { cooperation_link_contract_id: number | undefined }
    >({
      adjust_info: [],
      refund_rate: '',
      commission_rate: '',
      unit_price: '',
      recommend_file: '',
      settlement_files: [],
      tax_amount: '0',
      tax_rate: '',
      is_include_tax: 0,
      invoice_type: undefined,
      tax_included_amount: '0',
      tax_excluded_amount: '0',
      service_amount: '',
      marketing_advertising_amount: '',
      cooperation_link_contract_id: undefined,
      seal_type: null,
      business_type: 3,
      commission: '',
    });

    const uploadedFileList = ref<any[]>([]);
    const { business_type } = useProjectBaseInfo();
    const prev = async () => {
      if (isEditModeChanged.value) {
        const payload: SettlementDataUnionParams = {
          id: DisplayForm.value.id,
          step: SettlementStep.step_three,
          contract_id: DataForm.value.cooperation_link_contract_id,
          seal_type: DataForm.value.seal_type || null,
        };
        const settlement_files = DataForm.value.settlement_files
          ? DataForm.value.settlement_files
          : [];

        payload.settlement_files = settlement_files;

        saveLoading.value = true;
        const [{ data: response }, _] = await Promise.all([
          await saveSettlementDataService(
            payload,
            isTaobaoShopLiveType.value
              ? BusinessTypeEnum.taobao
              : business_type.value || E.project.BusinessType.douyin,
          ),
          await sleep(200),
        ]);
        saveLoading.value = false;
        if (response.success) {
          ctx.emit('prev', response.data);
        } else {
          ctx.root.$message.error(response.message);
        }
      } else {
        ctx.emit('prev');
      }
    };
    const next = async () => {
      if (!isTaobaoShopLiveType.value) {
        elFormRef.value?.validate(valid => {
          if (valid) {
            onSaveHandler();
          }
        });
      } else {
        onSaveHandler();
      }
    };

    /** 删除已上传的文件 */
    const handleRemoveFileClick = (index: number) => {
      uploadedFileList.value.splice(index, 1);
    };

    /** 结算单 文件上传 */
    const uploadFileHandler = async (value: HttpRequestOptions) => {
      const file = value.file;
      if (file.size > 50 * 1024 * 1024) {
        ctx.root.$message.error('上传文件大小不能超过 50MB!');
        return;
      }
      startLoading(); // 开启加载
      const formData = new FormData();
      const filename = value.file.name;
      formData.append('file', value.file, filename);
      formData.append('type', 'settlement');

      /** 上传文件service */
      const res = await uploadFileService(formData);
      const result = res.data;
      loading.close(); // 关闭加载
      if (result.success) {
        const fileItem: any = result.data.source || '';
        ctx.root.$message.success('上传成功');
        uploadedFileList.value.push(fileItem);
      } else {
        ctx.root.$message.error(result.message ?? '上传失败，稍后重试');
      }
    };

    watch(
      () => uploadedFileList.value,
      () => {
        DataForm.value.settlement_files = uploadedFileList.value;
      },
      {
        deep: true,
      },
    );

    /** 点击保存 */
    const submit = async (jump_next = true) => {
      if (saveLoading.value) {
        return;
      }
      if (injectSettlement.value === undefined) {
        return;
      }

      const settlement_files = DataForm.value.settlement_files
        ? DataForm.value.settlement_files
        : [];

      if (injectSettlement.value.is_estimate === 0 && settlement_files.length === 0) {
        ctx.root.$message.warning('请上传结算单扫描件');
        return;
      }
      if (injectSettlement.value.is_estimate === 0 && !DataForm.value.seal_type) {
        ctx.root.$message.warning('请选择是否盖章');
        return;
      }
      if (
        (DataForm.value.seal_type === 2 || !isTaobaoShopLiveType.value) &&
        !DataForm.value.cooperation_link_contract_id &&
        !injectSettlement.value.is_estimate
      ) {
        ctx.root.$message.warning('请选择合同');
        return;
      }
      const result = await AsyncConfirm(ctx, {
        title: '确定提交结算单吗？',
        content: () =>
          h('div', [
            h('div', '提交后将无法修改结算信息，确定要将结算单'),
            h('div', '提交给财务确认吗?'),
          ]),
        confirmText: '确定',
        cancelText: '取消',
      });

      if (!result) {
        return;
      }

      const payload: SettlementSubmitParams = {
        id: DisplayForm.value.id,
        contract_id: DataForm.value.cooperation_link_contract_id,
        seal_type: DataForm.value.seal_type || null,
      };

      // if (injectSettlement.value.is_estimate === 0) {
      payload.settlement_files = settlement_files;
      // }

      saveLoading.value = true;
      const [{ data: res }, _] = await Promise.all([
        await submitSettlementDataService(payload),
        await sleep(200),
      ]);
      saveLoading.value = false;

      if (res.success) {
        if (jump_next) {
          ctx.root.$message.success('提交成功');
          ctx.emit('submit:success');
        }
      } else {
        ctx.root.$message.error(res.message ?? '提交失败');
      }
      return res;
    };

    /** 保存 */
    const onSaveHandler = debounce(submit, 200);

    const live_file_str = ref('');
    const recommend_file_str = ref('');
    /** 抖音店播 订单文件 */
    const order_file_str = ref('');
    /** 佣金 展示  */
    const commission_str = ref('');

    const recommend_amount_str = computed(
      () =>
        formatAmountWithoutPrefix(
          DisplayForm.value.recommend_amount && DisplayForm.value.recommend_amount !== ''
            ? DisplayForm.value.recommend_amount
            : '0.00',
        ) + ' 元',
    );
    const total_adjust_amount = ref('0');
    const commission_formula_str = ref('');

    /** 服务费 */
    const service_amount_str = computed(
      () =>
        formatAmountWithoutPrefix(
          DisplayForm.value.service_amount && DisplayForm.value.service_amount !== ''
            ? DisplayForm.value.service_amount
            : '0.00',
        ) + ' 元',
    );

    const raw_settlement_files = ref<string[]>([]);
    const old_contract_id = ref<any>(undefined);
    const old_seal_type = ref<number | null>(null);
    const RawFillForm = ref<Settlement | undefined>(undefined);
    /** 填充表单数据 */
    const fillForm = (data?: Settlement) => {
      if (data) {
        RawFillForm.value = data;
        DataForm.value.adjust_info = data.adjust_info;
        if (DataForm.value.adjust_info) {
          const _adjust_info_amount = DataForm.value.adjust_info
            .reduce(
              (sum, item) =>
                new Decimal(
                  item.adjust_amount && item.adjust_amount !== '' ? item.adjust_amount : '0',
                ).add(sum),
              new Decimal('0'),
            )
            .toFixed(2)
            .toString();

          total_adjust_amount.value = formatAmountWithoutPrefix(_adjust_info_amount);
        }

        /** 佣金计算公式 */
        if (isTaobaoShopLiveType.value) {
          commission_formula_str.value = `${formatAmountWithoutPrefix(
            data.recommend_amount ?? '0',
          )} * (1 - ${data.refund_rate}%) * ${data.commission_rate}%`;
        } else {
          commission_formula_str.value = `${formatAmountWithoutPrefix(
            data.sale_amount ?? '0.00',
          )} * ${data.commission_rate}%`;
        }
        commission_str.value = formatAmountWithoutPrefix(data.commission ?? '0') + ' 元';

        DisplayForm.value.id = data.id;

        DisplayForm.value.recommend_amount = data.recommend_amount.toString();
        DisplayForm.value.service_amount = data.service_amount.toString();
        DisplayForm.value.marketing_advertising_amount = data.marketing_advertising_amount
          ? data.marketing_advertising_amount.toString()
          : '';
        DisplayForm.value.commission = data.commission.toString();
        DisplayForm.value.record_count = data.record_count;
        DisplayForm.value.company_name = data.company_name ? data.company_name : '--';
        cooperation_type.value = data.cooperation_type
          ? data.cooperation_type
          : cooperation_type.value;
        DataForm.value.sale_amount = data.sale_amount.toString();
        DataForm.value.tax_amount = `${data.tax_amount ?? 0}`;
        DataForm.value.tax_rate = String(`${data.tax_rate ?? 6}`);
        DataForm.value.is_include_tax = data.is_include_tax === 0 ? 0 : 1;
        DataForm.value.invoice_type = data.invoice_type;
        DataForm.value.tax_excluded_amount = `${data.tax_excluded_amount ?? 0}`;
        DataForm.value.tax_included_amount = `${data.tax_included_amount ?? 0}`;
        DataForm.value.service_amount = data.service_amount.toString();
        DataForm.value.marketing_advertising_amount = data.marketing_advertising_amount
          ? data.marketing_advertising_amount.toString()
          : '';
        DataForm.value.seal_type = data.seal_type;
        DataForm.value.commission = data.commission.toString();
        DataForm.value.business_type = data.business_type ?? null;
        if (data.live_file) {
          live_file_str.value = data.live_file;
        }
        if (data.recommend_file) {
          recommend_file_str.value = data.recommend_file;
        }
        if (data.order_file) {
          order_file_str.value = data.order_file;
        }
        if (data.settlement_files) {
          raw_settlement_files.value = JSON.parse(JSON.stringify(data.settlement_files)) || [];
          DataForm.value.settlement_files = JSON.parse(JSON.stringify(data.settlement_files)) || [];
          uploadedFileList.value = JSON.parse(JSON.stringify(data.settlement_files)) || [];
        }
        DataForm.value.cooperation_link_contract_id = data.contract_id || undefined;
        old_contract_id.value = data.contract_id || undefined;
        old_seal_type.value = data.seal_type || null;
        total_amount.value = `${data.total_settle_amount}`;
      }
      return true;
    };

    /** 保存并退出 */
    const Step3SaveBeforeClose = async () => {
      const payload: SettlementDataUnionParams = {
        id: DisplayForm.value.id,
        contract_id: DataForm.value.cooperation_link_contract_id,
        step: SettlementStep.step_three,
        seal_type: DataForm.value.seal_type || null,
      };
      const settlement_files = DataForm.value.settlement_files
        ? DataForm.value.settlement_files
        : [];

      payload.settlement_files = settlement_files;

      saveLoading.value = true;
      const [{ data: response }, _] = await Promise.all([
        await saveSettlementDataService(
          payload,
          isTaobaoShopLiveType.value
            ? BusinessTypeEnum.taobao
            : business_type.value || E.project.BusinessType.douyin,
        ),
        await sleep(200),
      ]);
      saveLoading.value = false;
      if (response.success) {
        return true;
      } else {
        ctx.root.$message.error(response.message);
        return false;
      }
    };

    /** 保存并退出 */
    const saveBeforeClose = async () => {
      return await Step3SaveBeforeClose();
    };

    /** 表单有数据变化 */
    const isEditModeChanged = computed(
      () =>
        old_seal_type.value !== DataForm.value.seal_type ||
        old_contract_id.value !== DataForm.value.cooperation_link_contract_id ||
        JSON.stringify(raw_settlement_files.value) !==
          JSON.stringify(DataForm.value.settlement_files),
    );

    const confirmBeforeClose = async () => {
      return isEditModeChanged.value;
    };

    const contract_id_list = ref<ContractSettlement[]>([]);
    // 关联客户合同输入值获取
    const { project_id } = useProjectBaseInfo();
    const getContract = async (kw?: string) => {
      const res = await GetContractUid({
        company_name: kw,
        only_main: 0,
        project_id: project_id.value,
        contract_status: 2,
        partner_type: 1,
        settlement_start_date: injectSettlement.value
          ? moment(injectSettlement?.value.start_date * 1000).format('YYYY-MM-DD')
          : undefined,
        settlement_end_date: injectSettlement.value
          ? moment(injectSettlement?.value.end_date * 1000).format('YYYY-MM-DD')
          : undefined,
      });
      if (res.data.success) {
        contract_id_list.value = res.data.data.data;
      } else {
        contract_id_list.value = [];
      }
    };
    getContract('');
    // const cooperation_link_contract_id = ref<any>(undefined);
    // 选择关联框架合同
    const selectContractUidChange = (val: any) => {
      DataForm.value.cooperation_link_contract_id = val;
    };
    return {
      RawFillForm,
      Decimal2String,
      cooperation_type,
      contract_id_list,
      getContract,
      // cooperation_link_contract_id,
      selectContractUidChange,
      confirmBeforeClose,
      isTaobaoShopLiveType,
      saveBeforeClose,
      commission_formula_str,
      total_adjust_amount,
      formatAmountWithoutPrefix,
      commission_str,
      DisplayForm,
      DataForm,
      live_file_str,
      order_file_str,
      recommend_file_str,
      service_amount_str,
      recommend_amount_str,
      fillForm,
      uploadFileHandler,
      total_amount,
      format_total_amout,
      saveLoading,
      handleRemoveFileClick,
      prev,
      next,
      uploadedFileList,
      injectSettlement,
      elFormRef,
    };
  },
});
