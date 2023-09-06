import { computed, defineComponent, inject, Ref, ref } from '@vue/composition-api';
import { formatAmount } from '@/utils/string';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import SettlementStep2Layout from '@/modules/settlement/component/step2.cost.layout';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import {
  AdjustInfo,
  KOLInfo,
  Settlement,
  SettlementStep,
  TaxAmountInfo,
} from '@/types/tiange/finance/settlement';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import Decimal from 'decimal.js';
import { useDebounceFn } from '@vueuse/core';
import { BusinessTypeEnum } from '@/types/tiange/common';
import { saveSettlementCostDataService } from '@/services/finance/settlement';
import { parse, wait as AwaitFn } from '@/utils/func';
import { getToken } from '@/utils/token';
import TopCard from '@/modules/settlement/component/top.card.vue';
import { deepClone } from '@/utils/tools';

const getPositiveRateNumber = (value: string) => {
  return (/100(?:\.0{0,2})?|(?:[1-9]?\d)(?:\.\d{0,2})?/u.exec(
    value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
  ) ?? [''])[0];
};

const getPositivePriceNumber = (value: string) => {
  const result = (/(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?/u.exec(
    value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
  ) ?? [''])[0];
  return result;
};

/** 手工调整金额 计算 */
const calcTotalAdjustAmount = (adjust_info: AdjustInfo[] | undefined) => {
  const adjust_info_list = adjust_info ? adjust_info : [];

  const total_adjust_amount = (
    adjust_info_list.length > 0
      ? adjust_info_list.reduce(
          (sum, item) =>
            new Decimal(
              item.adjust_amount && !['', '-', '.', '-.'].includes(item.adjust_amount)
                ? item.adjust_amount
                : '0',
            ).add(sum),
          new Decimal('0'),
        )
      : new Decimal('0')
  ).toString();
  return total_adjust_amount;
};

const calcTotalAmount = (
  adjust_info: AdjustInfo[] | undefined,
  total_cost_amount: string | undefined,
) => {
  /** 总 手工调账金额 */
  const total_adjust_amount = calcTotalAdjustAmount(adjust_info);

  return new Decimal(total_cost_amount && total_cost_amount !== '' ? total_cost_amount : '0.00')
    .add(total_adjust_amount)
    .toFixed(2)
    .toString();
};

/** 支出成本计算
 * 支出成本 = （收入-支出-退款）*（1-机构扣点%+税点%）
 */
// const calcTotalCostAmount = (
//   income_amount: string | undefined,
//   cost_amount: string | undefined,
//   refund_amount: string | undefined,
//   company_tax_rate: string | undefined,
//   tax_rate: string | undefined,
// ) => {
//   const income_value = new Decimal(income_amount && income_amount !== '' ? income_amount : '0');
//   const cost_value = new Decimal(cost_amount && cost_amount !== '' ? cost_amount : '0');
//   const refund_value = new Decimal(refund_amount && refund_amount !== '' ? refund_amount : '0');

//   const company_tax_value = new Decimal(
//     company_tax_rate && company_tax_rate !== '' ? company_tax_rate : '0',
//   );
//   const tax_rate_value = new Decimal(tax_rate && tax_rate !== '' ? tax_rate : '0');

//   const remain_amount = income_value.sub(cost_value).sub(refund_value);

//   const rate = new Decimal(100).sub(company_tax_value).add(tax_rate_value).div(100);

//   return remain_amount.mul(rate).toFixed(2).toString();
// };

interface MCNVtaskSubmitData extends TaxAmountInfo {
  id: number;
  company_id: number;
  total_settle_amount: string;
  adjust_info: AdjustInfo[];
  step?: SettlementStep;
  formal_json_data: KOLInfo[];
  spend_amount: string;
}

interface CostMCNVTaskStep2Form extends TaxAmountInfo {
  original_income_amount: string;
  original_spend_amount: string;
  company_name: string;
  adjust_info: AdjustInfo[];
  kol_list: KOLInfo[];
}

export default defineComponent({
  name: 'Step2MCNVTask',
  components: {
    SettlementStep2Layout,
    TgAdjustAccountForm,
    CardLayout,
    TopCard,
  },
  setup(props, ctx) {
    const saveLoading = ref(false);
    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);

    const DataForm = ref<CostMCNVTaskStep2Form>({
      original_income_amount: '0',
      original_spend_amount: '0',
      company_name: '',
      adjust_info: [],
      kol_list: [],
      invoice_type: undefined,
      tax_amount: '',
      tax_rate: '',
      tax_included_amount: '',
      tax_excluded_amount: '',
    });

    const adjustInfo = ref<AdjustInfo[]>([
      {
        adjust_amount: '',
        adjust_reason: '',
      },
    ]);

    /** 支出成本 */
    const total_cost_amount = computed(() => {
      let amount = new Decimal(0);
      DataForm.value.kol_list.forEach(el => {
        const left = new Decimal(el.income_amount ? el.income_amount : 0)
          .sub(el.spend_amount ? el.spend_amount : 0)
          .sub(el.tkje ? el.tkje : 0);
        const right = new Decimal(100)
          .sub(new Decimal(el.jgkd ? el.jgkd : 0))
          .add(new Decimal(el.sd ? el.sd : 0))
          .div(new Decimal(100));

        amount = amount.add(left.mul(right));
      });
      return amount.toString();
    });

    const total_amount = computed(() =>
      calcTotalAmount(DataForm.value.adjust_info, total_cost_amount.value),
    );
    const total_amount_str = computed(() => new Decimal(total_amount.value).toString());

    const methods = {
      onAdjustAccountDataChange: (adjust_info: AdjustInfo[]) => {
        DataForm.value.adjust_info = adjust_info;
      },
      formatAmount,
    };

    const TaxRateInput = (value: string, kol: KOLInfo) => {
      const result = getPositiveRateNumber(value);
      kol.sd = result;
    };

    const CompanyTaxRateInput = (value: string, kol: KOLInfo) => {
      const result = getPositiveRateNumber(value);
      kol.jgkd = result;
    };

    const RefundAmountInput = (value: string, kol: KOLInfo) => {
      const result = getPositivePriceNumber(value);
      kol.tkje = result;
    };

    const RawFillForm = ref<Settlement | undefined>(undefined);
    const kol_user_count = ref(0);

    /** 初始化 */
    const RawDataForm = ref<CostMCNVTaskStep2Form>({
      original_income_amount: '0',
      original_spend_amount: '0',
      company_name: '',
      adjust_info: [],
      kol_list: [],
      invoice_type: undefined,
      tax_amount: '',
      tax_rate: '',
      tax_included_amount: '',
      tax_excluded_amount: '',
    });

    /** 表单有数据变化 */
    const isEditModeChanged = computed(() => {
      return JSON.stringify(RawDataForm.value) !== JSON.stringify(DataForm.value);
    });

    const getDefaultEmptyString = (value: string | number | undefined) => {
      if (value === '0' || value === 0) {
        return '0.00';
      } else if (!value || value === '') {
        return '';
      } else {
        return new Decimal(value?.toString()).toFixed(2).toString();
      }
    };

    const ShowAdjustInfo = ref(false);
    const fillForm = (data: Settlement) => {
      RawFillForm.value = data;
      ShowAdjustInfo.value = true;

      kol_user_count.value = data.kol_count ?? 0;

      DataForm.value.original_income_amount = data.original_income_amount;
      DataForm.value.original_spend_amount = data.original_spend_amount;
      DataForm.value.company_name = data.company_name;
      DataForm.value.adjust_info = data.adjust_info;
      DataForm.value.kol_list = deepClone(data.formal_json_data) as KOLInfo[];

      DataForm.value.tax_amount = getDefaultZero(data.tax_amount ?? 0);
      DataForm.value.invoice_type = data.invoice_type;
      DataForm.value.tax_rate = `${data.tax_rate ? data.tax_rate : '0'}`;
      DataForm.value.tax_excluded_amount = getDefaultEmptyString(data.tax_excluded_amount ?? '');
      DataForm.value.tax_included_amount = getDefaultEmptyString(data.tax_included_amount ?? '');

      RawDataForm.value.original_income_amount = data.original_income_amount;
      RawDataForm.value.original_spend_amount = data.original_spend_amount;
      RawDataForm.value.company_name = data.company_name;
      RawDataForm.value.adjust_info = parse(data.adjust_info);
      RawDataForm.value.kol_list = deepClone(data.formal_json_data) as KOLInfo[];

      RawDataForm.value.tax_amount = getDefaultZero(data.tax_amount ?? 0);
      RawDataForm.value.invoice_type = data.invoice_type;
      RawDataForm.value.tax_rate = `${data.tax_rate ? data.tax_rate : '0'}`;
      RawDataForm.value.tax_excluded_amount = getDefaultEmptyString(data.tax_excluded_amount ?? '');
      RawDataForm.value.tax_included_amount = getDefaultEmptyString(data.tax_included_amount ?? '');
    };

    const getDefaultZero = (value: string | number | undefined) => {
      if (!value || value === '') {
        return '0.00';
      }
      if (value === '0') {
        return '0.00';
      } else {
        return new Decimal(value.toString()).toFixed(2).toString();
      }
    };

    const getSubmitData = (data: CostMCNVTaskStep2Form) => {
      const id = RawFillForm.value?.id ?? -1;
      const payload: MCNVtaskSubmitData = {
        id: id,
        total_settle_amount: total_amount.value,
        adjust_info: data.adjust_info,
        company_id: RawFillForm.value?.company_id ?? -1,
        formal_json_data: data.kol_list,
        invoice_type: data.invoice_type,
        tax_amount: data.tax_amount,
        tax_rate: data.tax_rate,
        tax_included_amount: data.tax_included_amount,
        tax_excluded_amount: data.tax_excluded_amount,
        spend_amount: total_cost_amount.value,
      };
      return payload;
    };

    const company_name = computed(() => RawFillForm.value?.company_name);

    const getValidAdjustInfoList = (data: CostMCNVTaskStep2Form) => {
      if (data.adjust_info && data.adjust_info?.length >= 1) {
        const adjust_info_list = data.adjust_info.filter(
          el => el.adjust_reason || el.adjust_amount,
        );
        if (adjust_info_list.length > 0) {
          return adjust_info_list.map(el => {
            return el;
          });
        }
      }
      return [];
    };

    const checkFormData = (jump_next = true) => {
      if (new Decimal(total_cost_amount.value).lessThan(0)) {
        return '支出成本错误';
      }

      const form_adjust_info_list = ref<AdjustInfo[]>([]);

      if (DataForm.value.adjust_info && DataForm.value.adjust_info?.length >= 1) {
        const adjust_info_list = DataForm.value.adjust_info.filter(
          el => el.kol_name || el.adjust_reason || el.adjust_amount,
        );
        if (adjust_info_list.some(el => /^(?:\+|-)?0?(?:\.0{0,2})?$/u.test(el.adjust_amount))) {
          return '请输入正确的调整金额';
        }
        if (adjust_info_list.some(el => el.adjust_amount === '0')) {
          ctx.root.$message.error('调整金额不能为0');
          return '调整金额不能为0';
        }
        if (
          !adjust_info_list.every(
            el =>
              el.adjust_amount &&
              el.adjust_amount !== '' &&
              el.adjust_amount !== '-' &&
              el.adjust_reason,
          )
        ) {
          return '请完善手工调账信息';
        }

        if (adjust_info_list.length > 0) {
          form_adjust_info_list.value = adjust_info_list;
        }
      }
      if (
        jump_next &&
        form_adjust_info_list.value &&
        form_adjust_info_list.value.length === 0 &&
        ['0', '0.0', '0.00'].includes(total_amount.value ?? '0')
      ) {
        return '至少填写一项结算项';
      }
      if (jump_next && new Decimal(total_amount.value ?? '0').lte('0')) {
        return '总结算金额必须大于0';
      }
      return;
    };

    const getPostResponse = async (payload: MCNVtaskSubmitData) => {
      saveLoading.value = true;
      const [{ data: response }] = await AwaitFn(
        500,
        saveSettlementCostDataService(payload, BusinessTypeEnum.mcn),
      );
      saveLoading.value = false;

      return response;
    };

    const kolDataUrl = computed(() => {
      if (company_name.value) {
        const url = `/api/settlement/download_settlement_kol_data?settlement_id=${
          settlement.value?.id
        }&company_name=${DataForm.value.company_name}&Authorization=${getToken()}`;
        return url;
      } else {
        return '';
      }
    });

    /** 提交数据 */
    const submit = async (jump_next = true) => {
      if (saveLoading.value) {
        return;
      }

      const err_msg = checkFormData(jump_next);
      if (err_msg) {
        ctx.root.$message.error(err_msg);
        return;
      }

      if (!(DataForm.value?.invoice_type || DataForm.value?.invoice_type === 0)) {
        ctx.root.$message.warning('请选择发票类型');
        return;
      }
      const payload = getSubmitData(DataForm.value);
      payload.step = jump_next ? SettlementStep.step_three : SettlementStep.step_two;
      payload.adjust_info = getValidAdjustInfoList(DataForm.value);
      const response = await getPostResponse(payload);

      if (response.success) {
        if (jump_next) {
          ctx.emit('next', response.data);
        }
      } else {
        ctx.root.$message.error(response.message ?? '保存失败');
      }
      return response;
    };

    /** 保存 */
    const onSaveHandler = useDebounceFn(submit, 200);

    const confirmBeforeClose = async () => {
      return isEditModeChanged.value;
    };

    const saveBeforeClose = async () => {
      const jump_next = false;
      const response = await submit(jump_next);
      if (response) {
        return response.success;
      } else {
        return false;
      }
    };

    const prev = async () => {
      if (isEditModeChanged.value) {
        const jump_next = false;
        const response = await submit(jump_next);
        if (response) {
          if (response.success) {
            ctx.emit('prev', response.data);
          } else {
            ctx.root.$message.warning(response.message);
          }
        }
      } else {
        ctx.emit('prev');
      }
    };

    const next = () => {
      // if (isEditModeChanged.value) {
      onSaveHandler();
      /* } else {
        const jump_next = true;
        const err_msg = checkFormData(jump_next);
        if (err_msg) {
          ctx.root.$message.error(err_msg);
          return;
        } else {
          ctx.emit('next', RawFillForm.value);
        }
      }*/
    };
    const invoiceTypeChangedHandler = (val: number) => {
      DataForm.value.invoice_type = val;
      DataForm.value.tax_rate = val !== 2 ? '0' : DataForm.value.tax_rate;
    };
    const taxValueChangeHandler = (item: TaxAmountInfo) => {
      DataForm.value.tax_included_amount = item.tax_included_amount?.toString() ?? '';
      DataForm.value.tax_excluded_amount = item.tax_excluded_amount?.toString() ?? '';
      DataForm.value.tax_amount = item.tax_amount?.toString() ?? '';
      DataForm.value.invoice_type = item.invoice_type;
      DataForm.value.tax_rate =
        item.invoice_type !== 2 ? '0' : item.tax_rate || DataForm.value.tax_rate;
    };

    const taxRateChanged = (value: string) => {
      DataForm.value.tax_rate = value;
    };

    return {
      invoiceTypeChangedHandler,
      taxRateChanged,
      taxValueChangeHandler,
      kolDataUrl,
      DataForm,
      adjustInfo,
      ...methods,
      ShowAdjustInfo,

      total_cost_amount,
      total_amount,
      total_amount_str,
      kol_user_count,
      saveLoading,

      next,
      prev,
      saveBeforeClose,
      onSaveHandler,
      fillForm,
      CompanyTaxRateInput,
      TaxRateInput,
      RefundAmountInput,
      confirmBeforeClose,
    };
  },
});
