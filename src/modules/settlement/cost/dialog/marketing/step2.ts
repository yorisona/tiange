import { computed, defineComponent, inject, ref } from '@vue/composition-api';
import type { Ref } from '@vue/composition-api';
import {
  saveSettlementCostDataService,
  SaveSettlementCostStep2Marketing,
} from '@/services/finance/settlement';
import type {
  AdjustInfo,
  Settlement,
  SettlementCostStep2MakettingFrm,
  SettlementCostStep2MakettingParams,
  TaxAmountInfo,
} from '@/types/tiange/finance/settlement';
import { SettlementStep } from '@/types/tiange/finance/settlement';
import type { ElForm } from 'element-ui/types/form';
import Step2Layout from '@/modules/settlement/component/step2.layout';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import AdjustAccount from '@/modules/settlement/component/AdjustAccount.vue';
import { wait as AwaitFn, wait } from '@/utils/func';
import { Decimal } from 'decimal.js';
import type { FormRule } from '@/types/vendor/form';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import { ElFormRef, validate } from '@/utils/form';
import { Decimal2String } from '@/utils/string';
import TopCard from '@/modules/settlement/component/top.card.vue';
import { getCompanyNameAndId } from '@/api/medium';
import { MarketingProjectDetail } from '@/types/tiange/marketing/project';
import { LiveProject } from '@/types/tiange/live.project';
import { CommonBusinessProjectDetail } from '@/types/tiange/commonBusiness/project';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

type FormRules = {
  [prop in keyof SettlementCostStep2MakettingFrm]?: FormRule<
    SettlementCostStep2MakettingFrm[prop]
  >[];
};

const emptyOrZero = (str: string) =>
  [null, undefined, 'undefined', 'null', '', '-', '-.'].includes(str) ? '0.00' : str;

export default defineComponent({
  components: {
    Step2Layout,
    CardLayout,
    AdjustAccount,
    TopCard,
  },

  setup(props, ctx) {
    //isArea
    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);
    // const isAreaCost_list = ref(inject('isAreaCost_list', false));
    // const isAreaCost = computed(() => {
    //   const newproject = JSON.stringify(inject('project3in1', { cooperation_type: 0 }));
    //   const jsonProject = JSON.parse(newproject);
    //   return jsonProject.value?.cooperation_type === 2;
    // });
    const { isFromMarketing } = useProjectBaseInfo();
    const step2FrmRef = ref<ElForm | null>(null);
    const step2Frm = ref<SettlementCostStep2MakettingFrm>({
      spend_amount: '',
      adjust_info: [],
      company_id: '',
    });
    const company_name = ref('');

    const TaxDataForm = ref<TaxAmountInfo>({
      invoice_type: undefined,
      tax_rate: '',
      tax_included_amount: '',
      tax_excluded_amount: '',
      tax_amount: '',
    });
    /** 支出金额显示用 */
    const spend_amount = computed(() =>
      step2Frm.value.spend_amount === ''
        ? '0.00'
        : Decimal2String(new Decimal(emptyOrZero(step2Frm.value.spend_amount))),
    );

    /** 手工调账金额汇总 */
    const adjust_info_amount_total = computed(() =>
      step2Frm.value.adjust_info
        .filter(el => el.adjust_reason !== '' && el.adjust_amount !== '')
        .reduce((acc, cur) => acc.add(new Decimal(emptyOrZero(cur.adjust_amount))), new Decimal(0)),
    );

    /** 表单校验规则 */
    const step2FrmRules = ref<FormRules>({
      company_id: [{ required: true, message: '请选择供应商', trigger: 'change' }],
      spend_amount: [
        {
          validator: (rule, value, callback) => {
            if (value === '') {
              callback();
            } else if (/^\d+(?:\.\d{0,2})?$/u.test(value)) {
              if (!new Decimal(value).eq(0) || !adjust_info_amount_total.value.eq(0)) {
                callback();
              } else {
                callback(new Error('请填写支出或者手工调账'));
              }
            } else {
              callback(new Error('请输入正确的数字'));
            }
          },
          trigger: 'blur',
        },
      ],
    });

    /** 原始数据表单 */
    const originalFrmData = ref<SettlementCostStep2MakettingFrm>({
      spend_amount: '',
      adjust_info: [],
      company_id: '',
    });

    /** 重置表单数据 */
    const resetFrm = () => {
      step2Frm.value.spend_amount = '';
      step2Frm.value.adjust_info = [];
    };

    /** 重置表单原始数据 */
    const resetOriginalFrmData = () => {
      originalFrmData.value.spend_amount = '';
      originalFrmData.value.adjust_info = [];
    };

    const OriginTaxForm = ref<TaxAmountInfo>({
      invoice_type: undefined,
      tax_rate: '',
      tax_included_amount: '',
      tax_excluded_amount: '',
      tax_amount: '',
    });

    /** 编辑模式下有数据变化 */
    const isEditModeChanged = computed(
      () => JSON.stringify(originalFrmData.value) !== JSON.stringify(step2Frm.value),
    );

    const ShowAdjustInfo = ref(false);
    const fillForm = async (data: Settlement) => {
      resetFrm();
      resetOriginalFrmData();

      ShowAdjustInfo.value = true;

      const { spend_amount, adjust_info } = data;
      TaxDataForm.value.invoice_type = data.invoice_type;
      TaxDataForm.value.tax_rate = data.tax_rate ? data.tax_rate.toString() : '0';
      TaxDataForm.value.tax_included_amount = data.tax_included_amount?.toString();
      TaxDataForm.value.tax_excluded_amount = data.tax_excluded_amount?.toString();
      TaxDataForm.value.tax_amount = new Decimal(
        emptyOrZero(data.tax_amount?.toString() ?? '0'),
      ).toFixed(2);
      OriginTaxForm.value.invoice_type = data.invoice_type;
      OriginTaxForm.value.tax_rate = data.tax_rate ? data.tax_rate.toString() : '0';
      OriginTaxForm.value.tax_included_amount = data.tax_included_amount?.toString();
      OriginTaxForm.value.tax_excluded_amount = data.tax_excluded_amount?.toString();
      OriginTaxForm.value.tax_amount = new Decimal(
        emptyOrZero(data.tax_amount?.toString() ?? '0'),
      ).toFixed(2);

      step2Frm.value.spend_amount = `${spend_amount ?? 0}`;
      step2Frm.value.adjust_info = adjust_info.map(el => ({ ...el }));
      step2Frm.value.company_id = data.company_id ? data.company_id.toString() : '';

      originalFrmData.value.company_id = data.company_id ? data.company_id.toString() : '';
      originalFrmData.value.spend_amount = `${spend_amount ?? 0}`;
      originalFrmData.value.adjust_info = adjust_info.map(el => ({ ...el }));

      if (data.company_name) {
        company_name.value = data.company_name;
        await getAllCompanyName(data.company_name);
      }
    };

    /** tax有数据变化 */
    const taxValueHasChange = computed(
      () =>
        JSON.stringify({
          tax_amount: TaxDataForm.value.tax_amount,
          tax_rate: TaxDataForm.value.tax_rate,
          invoice_type: TaxDataForm.value.invoice_type,
        }) !==
        JSON.stringify({
          tax_amount: OriginTaxForm.value.tax_amount,
          tax_rate: OriginTaxForm.value.tax_rate,
          invoice_type: OriginTaxForm.value.invoice_type,
        }),
    );

    /** 总结算金额(计算版本) */
    const amount = computed(() => {
      return Decimal.add(
        new Decimal(emptyOrZero(step2Frm.value.spend_amount ?? '0')),
        step2Frm.value.adjust_info
          .map(el => new Decimal(emptyOrZero(el.adjust_amount ?? '0')))
          .reduce((acc, cur) => acc.add(cur), new Decimal(0)),
      );
    });

    /** 总结算金额(显示版本) */
    const total_settle_amount = computed(() => amount.value.toString());

    /** 输入支出 */
    const inputSpendAmount = (value: string) => {
      const result = /(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?/u.exec(
        value.replace(REG_REMOVE_PREFIX_ZERO, ''),
      ) ?? [''];
      step2Frm.value.spend_amount = result[0];
    };

    /** 手工调账数据变更 */
    const onAdjustAccountDataChange = (adjust_info: AdjustInfo[]) => {
      step2Frm.value.adjust_info = adjust_info.map(el => ({ ...el }));
    };

    /** 保存加载中 */
    const saveLoading = ref(false);

    /** 是否填充了足够的表单项(至少一项) */
    const isFilledFormItemAtLeastOne = computed(
      () =>
        step2Frm.value.spend_amount !== '' ||
        step2Frm.value.adjust_info.filter(el => el.adjust_amount !== '' && el.adjust_reason !== '')
          .length > 0,
    );

    const pre_check = async () => {
      if (!isFilledFormItemAtLeastOne.value) {
        ctx.root.$message.warning('请填写至少一项结算项');
        return false;
      }

      const result = await validate(step2FrmRef as Ref<ElFormRef>);

      if (!result) {
        return false;
      }

      const { adjust_info } = step2Frm.value;

      const filtered_adjust_info = adjust_info.filter(
        el => !(el.adjust_amount === '' && el.adjust_reason === ''),
      );

      if (
        filtered_adjust_info.find(el => el.adjust_reason !== '' && el.adjust_amount === '') !==
        undefined
      ) {
        ctx.root.$message.warning('请输入调整金额');
        return false;
      }

      if (
        filtered_adjust_info.find(
          el => el.adjust_reason !== '' && new Decimal(emptyOrZero(el.adjust_amount) ?? '0').eq(0),
        ) !== undefined
      ) {
        ctx.root.$message.warning('调整金额不能为0');
        return false;
      }

      if (
        filtered_adjust_info.find(el => el.adjust_amount !== '' && el.adjust_reason === '') !==
        undefined
      ) {
        ctx.root.$message.warning('请输入调整原因');
        return false;
      }

      if (amount.value.lte(0)) {
        ctx.root.$message.warning('总结算金额不能小于等于0');
        return false;
      }

      return true;
    };
    const project =
      inject<Ref<MarketingProjectDetail | LiveProject | CommonBusinessProjectDetail | undefined>>(
        'project3in1',
      ) ?? ref(undefined);

    /** 提交数据 */
    const submit = async (payload: any) => {
      if (saveLoading.value) {
        return;
      }
      if (!project.value) {
        return;
      }
      const business_type = Number(project.value.business_type);
      saveLoading.value = true;
      const [{ data: response }] = await AwaitFn(
        500,
        saveSettlementCostDataService(payload, business_type),
      );
      // console.log('steptwo===', JSON.stringify(response));
      saveLoading.value = false;

      if (response.success) {
        ctx.emit('next', response.data);
      } else {
        ctx.root.$message.error(response.message ?? '保存失败');
      }
      return response;
    };

    /** 保存 */
    const saveStep2Data = async (next: boolean) => {
      if (settlement.value === undefined) {
        console.warn('不存在结算数据');
        return;
      }

      if (!isFilledFormItemAtLeastOne.value && next) {
        ctx.root.$message.warning('请填写至少一项结算项');
        return;
      }

      const result = await validate(step2FrmRef as Ref<ElFormRef>);

      if (!result && next) {
        return;
      }

      const { adjust_info, spend_amount } = step2Frm.value;

      const filtered_adjust_info = adjust_info.filter(
        el => !(el.adjust_amount === '' && el.adjust_reason === ''),
      );

      if (
        filtered_adjust_info.find(el => el.adjust_reason !== '' && el.adjust_amount === '') !==
          undefined &&
        next
      ) {
        ctx.root.$message.warning('请输入调整金额');
        return;
      }

      if (
        filtered_adjust_info.find(
          el => el.adjust_reason !== '' && new Decimal(emptyOrZero(el.adjust_amount) ?? '0').eq(0),
        ) !== undefined &&
        next
      ) {
        ctx.root.$message.warning('调整金额不能为0');
        return;
      }

      if (
        filtered_adjust_info.find(el => el.adjust_amount !== '' && el.adjust_reason === '') !==
          undefined &&
        next
      ) {
        ctx.root.$message.warning('请输入调整原因');
        return;
      }

      if (amount.value.lte(0)) {
        ctx.root.$message.warning('总结算金额不能小于等于0');
        return;
      }

      const total_settle_amount = amount.value.toString();

      const payload: SettlementCostStep2MakettingParams = {
        id: settlement.value.id,
        spend_amount: spend_amount === '' ? '0' : spend_amount,
        total_settle_amount,
        adjust_info: filtered_adjust_info,
        step: next ? SettlementStep.step_three : settlement.value.step,
        company_id: step2Frm.value.company_id,
        invoice_type: TaxDataForm.value.invoice_type,
        tax_rate: TaxDataForm.value.tax_rate === '' ? '0' : TaxDataForm.value.tax_rate ?? '0',
        tax_included_amount: TaxDataForm.value.tax_included_amount,
        tax_excluded_amount: TaxDataForm.value.tax_excluded_amount,
        tax_amount: TaxDataForm.value.tax_amount,
      };
      if (isFromMarketing.value) {
        saveLoading.value = true;
        const [{ data: response }] = await wait(500, SaveSettlementCostStep2Marketing(payload));
        saveLoading.value = false;
        return response;
      } else {
        submit(payload);
      }
    };

    /** 上一步 */
    const prev = async () => {
      // 编辑模式但无数据变更 则直接上一步
      if (
        !taxValueHasChange.value &&
        !isEditModeChanged.value &&
        isFilledFormItemAtLeastOne.value
      ) {
        ctx.emit('prev');
        return;
      }

      const response = await saveStep2Data(false);

      if (response?.success) {
        ctx.root.$message.success('保存成功');
        ctx.emit('prev', response.data);
        return true;
      } else {
        return false;
      }
    };

    /** 下一步 */
    const next = async () => {
      const pre_check_result = await pre_check();
      if (!pre_check_result) {
        return;
      }
      if (!(TaxDataForm.value?.invoice_type || TaxDataForm.value?.invoice_type === 0)) {
        ctx.root.$message.warning('请选择发票类型');
        return;
      }
      // 编辑模式但无数据变更 则直接下一步
      if (
        !taxValueHasChange.value &&
        !isEditModeChanged.value &&
        isFilledFormItemAtLeastOne.value
      ) {
        ctx.emit('next');
        return;
      }

      const response = await saveStep2Data(true);

      if (response?.success) {
        ctx.root.$message.success('保存成功');
        ctx.emit('next', response.data);
      } else if (response?.success === false) {
        ctx.root.$message.error(response.message ?? '保存失败');
      } else {
        // do nth
      }
    };

    /** 关闭前保存 */
    const saveBeforeClose = async () => {
      const response = await saveStep2Data(false);

      if (response?.success) {
        ctx.root.$message.success('保存成功');
        ctx.emit('next', response.data);
        return true;
      } else {
        return false;
      }
    };

    /** 判断关闭前是否需要弹窗确认 */
    const confirmBeforeClose = async () => {
      return taxValueHasChange.value || isEditModeChanged.value;
    };

    const invoiceTypeChangedHandler = (val: number) => {
      TaxDataForm.value.invoice_type = val;
      TaxDataForm.value.tax_rate = val !== 2 ? '0' : TaxDataForm.value.tax_rate;
    };
    const taxValueChangeHandler = (item: TaxAmountInfo) => {
      TaxDataForm.value.tax_included_amount = item.tax_included_amount;
      TaxDataForm.value.tax_excluded_amount = item.tax_excluded_amount;
      TaxDataForm.value.invoice_type = item.invoice_type;
      TaxDataForm.value.tax_rate =
        item.invoice_type !== 2 ? '0' : item.tax_rate || TaxDataForm.value.tax_rate;
      TaxDataForm.value.tax_amount = item.tax_amount;
    };

    const taxRateChanged = (tax_rate: string) => {
      TaxDataForm.value.tax_rate = tax_rate;
    };

    /** 所有店铺选项 */
    const allCompanyName = ref<any[]>([]);

    const onCompanyIdChange = (id: string) => {
      step2Frm.value.company_id = id;
    };
    /** 供应商名称 下拉选择 */
    const getAllCompanyName = async (company_name: string) => {
      const { data: response } = await getCompanyNameAndId({ company_name, verify_status: 1 });
      allCompanyName.value = response.success ? response.data : [];
    };

    return {
      allCompanyName,
      getAllCompanyName,
      onCompanyIdChange,
      taxRateChanged,
      taxValueChangeHandler,
      amount,
      ShowAdjustInfo,
      total_settle_amount,
      step2FrmRef,
      step2Frm,
      step2FrmRules,
      originalFrmData,
      spend_amount,
      inputSpendAmount,
      onAdjustAccountDataChange,
      prev,
      next,
      confirmBeforeClose,
      saveBeforeClose,
      saveLoading,
      saveStep2Data,
      fillForm,
      TaxDataForm,
      invoiceTypeChangedHandler,
      company_name,
    };
  },
});
