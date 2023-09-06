/** 店播 成本结算 step2 after */
import { computed, defineComponent, inject, ref, SetupContext, watch } from '@vue/composition-api';
import type { Ref } from '@vue/composition-api';
import Step2Layout from '@/modules/settlement/component/step2.cost.layout.vue';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import {
  AdjustInfo,
  Settlement,
  SettlementIncomeType,
  SettlementStep,
  ShopLiveCostSettlementAfterForm,
  TaxAmountInfo,
} from '@/types/tiange/finance/settlement';
import { useDebounceFn } from '@vueuse/core';
import { downloadFileFromBlob, wait as AwaitFn } from '@/utils/func';
import { saveSettlementCostDataService } from '@/services/finance/settlement';
import { Decimal2String } from '@/utils/string';
import { LiveProject } from '@/types/tiange/live.project';
import { ElForm } from 'element-ui/types/form';
import Decimal from 'decimal.js';
import TopCard from '@/modules/settlement/component/top.card.vue';
import { calcTotalAdjustAmount } from './utils';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import { getToken } from '@/utils/token';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

const JWT_TOKEN = getToken();

const getPositiveRateNumber = (value: string) => {
  return (/100(?:\.0{0,2})?|(?:[1-9]?\d)(?:\.\d{0,2})?/u.exec(
    value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
  ) ?? [''])[0];
};

const getPositivePriceNumber = (value: string) => {
  const result = (/(?:0|[1-9]\d{0,5})(?:\.\d{0,2})?/u.exec(
    value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
  ) ?? [''])[0];
  return result;
};

export const commonForm = (ctx: SetupContext) => {
  /** 下载文件 */
  const downloadFileHandler = (urlString: string, filename = '') => {
    fetch(urlString).then(async response => {
      const result = response.clone();
      try {
        const data = await result.json();
        ctx.root.$message.error(data.message);
      } catch {
        if (response.status === 200) {
          const data = await response.blob();

          const default_filename = 'kol_schedule.xlsx';
          const download_name = filename !== '' ? filename : default_filename;
          downloadFileFromBlob(data, download_name);
        } else {
          ctx.root.$message.error('下载失败');
        }
      }
    });
  };
  return { downloadFileHandler };
};

const getValidAdjustInfoList = (data: ShopLiveCostSettlementAfterForm) => {
  if (data.adjust_info && data.adjust_info?.length >= 1) {
    const adjust_info_list = data.adjust_info.filter(el => el.adjust_reason || el.adjust_amount);
    if (adjust_info_list.length > 0) {
      return adjust_info_list;
    }
  }
  return [];
};

// 总结算金额 = 主播服务费 + 机构服务费
const calcShopLiveCostTotalAmountAfter = (
  kol_service_amount: string,
  company_service_amount: string,
  adjust_info: AdjustInfo[] | undefined,
) => {
  /** 总 手工调账金额 */
  const total_adjust_amount = calcTotalAdjustAmount(adjust_info);

  const total_salary = new Decimal(kol_service_amount !== '' ? kol_service_amount : '0').add(
    company_service_amount !== '' ? company_service_amount : '0',
  );

  return total_salary.add(total_adjust_amount).toFixed(2).toString();
};

export default defineComponent({
  name: 'TgCostSettlementDataForm',
  components: {
    Step2Layout,
    TgAdjustAccountForm,
    CardLayout,
    TopCard,
  },
  props: {},
  setup(props, ctx) {
    const saveLoading = ref(false);
    const project =
      inject<Ref<LiveProject | undefined>>('project') ?? ref<LiveProject | undefined>(undefined);

    const { downloadFileHandler } = commonForm(ctx);

    /** 表单引用 */
    const formRef = ref<null | ElForm>(null);
    // const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);

    const DataForm = ref<ShopLiveCostSettlementAfterForm>({
      kol_name: '',
      company_name: '',
      adjust_info: [],
      invoice_type: undefined,
      company_service_type: '1',
      company_service_rate: '',
      company_service_amount: '',
      kol_service_amount: '',
      tax_amount: '',
      tax_rate: '',
      tax_included_amount: '',
      tax_excluded_amount: '',
      json_data: {
        amount_info_list: [],
      },
    });
    const amountDetail = (type: SettlementIncomeType) => {
      return DataForm.value.json_data
        ? DataForm.value.json_data.amount_info_list?.find(el => el.type === type)
        : null;
    };
    // 服务费收取方式 输入框值
    const service_fee_value = ref('');

    // 机构服务费
    const company_service_amount_value = computed(() => {
      if (DataForm.value.company_service_type === '1') {
        return new Decimal(service_fee_value.value || 0)
          .div(100)
          .mul(DataForm.value.kol_service_amount || 0)
          .toFixed(2);
      } else {
        return service_fee_value.value || 0;
      }
    });

    const company_service_amount_str = computed(() => {
      return Decimal2String(new Decimal(DataForm.value.company_service_amount || 0));
    });

    const kol_service_amount_str = computed(() => {
      return Decimal2String(new Decimal(DataForm.value.kol_service_amount || 0));
    });
    let old_company_service_amount: any = DataForm.value.company_service_amount;
    watch(
      () => DataForm.value.company_service_type,
      () => {
        if (DataForm.value.company_service_type === '1') {
          old_company_service_amount = DataForm.value.company_service_amount;
          service_fee_value.value = DataForm.value.company_service_rate;
        } else if (DataForm.value.company_service_type === '2') {
          service_fee_value.value = old_company_service_amount || '';
          DataForm.value.company_service_amount = old_company_service_amount || '0';
        }
      },
    );

    watch(
      () => [service_fee_value.value],
      newVal => {
        if (newVal) {
          if (DataForm.value.company_service_type === '1') {
            DataForm.value.company_service_rate = service_fee_value.value;
          } else {
            old_company_service_amount = service_fee_value.value;
          }
          DataForm.value.company_service_amount = company_service_amount_value.value.toString();
        }
      },
    );

    /** 总结算金额 */
    const total_amount = computed(() =>
      calcShopLiveCostTotalAmountAfter(
        DataForm.value.kol_service_amount,
        DataForm.value.company_service_amount,
        DataForm.value.adjust_info,
      ),
    );
    const total_amount_str = computed(() => Decimal2String(new Decimal(total_amount.value)));

    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);

    const getKolScheduleFile = (settlement_id: string, company_id: string) => {
      const url = `/api/settlement/download_kol_schedule?company_id=${company_id}&settlement_id=${settlement_id}&Authorization=${JWT_TOKEN}`;
      return url;
    };

    /** 下载排班 */
    const downloadKolScheduleFile = (filename: string) => {
      const settlement_id = settlement.value ? settlement.value.id.toString() : '-1';

      const url = getKolScheduleFile(
        settlement_id,
        RawFillForm.value?.company_id.toString() ?? '-1',
      );
      downloadFileHandler(url, filename);
    };

    /** 下载主播费用明显 */
    const downloadKolServiceFeeFile = (filename: string) => {
      const settlement_id = settlement.value ? settlement.value.id.toString() : '-1';
      const company_id = RawFillForm.value?.company_id.toString() ?? '-1';

      const fwf =
        DataForm.value.company_service_amount !== '' ? DataForm.value.company_service_amount : 0;
      const adjust_sum = calcTotalAdjustAmount(DataForm.value.adjust_info);

      const url = `/api/settlement/download_company_salary?adjust_sum=${adjust_sum}&fwf=${fwf}&company_id=${company_id}&settlement_id=${settlement_id}&Authorization=${JWT_TOKEN}`;

      downloadFileHandler(url, filename);
    };

    const RawFillForm = ref<Settlement | undefined>(undefined);

    /** 初始化 */
    const RawDataForm = ref<ShopLiveCostSettlementAfterForm>({
      kol_name: '',
      company_name: '',
      adjust_info: [],
      invoice_type: undefined,
      company_service_type: '1',
      company_service_rate: '',
      company_service_amount: '',
      kol_service_amount: '',
      tax_amount: '',
      tax_rate: '',
      tax_included_amount: '',
      tax_excluded_amount: '',
      json_data: {
        amount_info_list: [],
      },
    });
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
    const getDefaultEmptyString = (value: string | number | undefined) => {
      if (value === '0' || value === 0) {
        return '0.00';
      } else if (!value || value === '') {
        return '';
      } else {
        return new Decimal(value?.toString()).toFixed(2).toString();
      }
    };
    /** 填充进行时 */
    const fill_form_loading = ref(false);

    const schedule_file_list = ref<{ name: string; url: string }[]>([]);

    const loadFormData = (data: Settlement) => {
      DataForm.value.company_name = data.company_name || '';
      if (
        data.json_data &&
        data.json_data.amount_info_list &&
        data.json_data.amount_info_list.length > 0
      ) {
        DataForm.value.json_data = JSON.parse(JSON.stringify(data.json_data));
        const anchor_detail: any = amountDetail(9);
        if (anchor_detail) {
          DataForm.value.company_service_amount = getDefaultZero(
            anchor_detail.company_service_amount?.toString() || '0',
          );
          DataForm.value.kol_service_amount = anchor_detail.kol_service_amount?.toString() || '0';
          DataForm.value.company_service_type =
            Number(anchor_detail.company_service_type) === 2 ? '2' : '1';
          DataForm.value.company_service_rate =
            anchor_detail.company_service_rate?.toString() ?? '';
        }
      } else {
        DataForm.value.company_service_amount = getDefaultZero(
          data.company_service_amount?.toString() || '0',
        );
        DataForm.value.kol_service_amount = data.kol_service_amount?.toString() || '0';
        DataForm.value.company_service_type = Number(data.company_service_type === 2) ? '2' : '1';
        DataForm.value.company_service_rate = data.company_service_rate?.toString() ?? '';
        DataForm.value.json_data = {
          amount_info_list: [
            {
              type: 9,
            },
          ],
        };
      }

      DataForm.value.kol_salary_infos = data.kol_salary_infos || [];
      DataForm.value.tax_amount = getDefaultZero(data.tax_amount ?? 0);
      DataForm.value.invoice_type = data.invoice_type;
      DataForm.value.tax_rate = `${data.tax_rate ? data.tax_rate : '0'}`;
      DataForm.value.tax_excluded_amount = getDefaultEmptyString(data.tax_excluded_amount ?? '');
      DataForm.value.tax_included_amount = getDefaultEmptyString(data.tax_included_amount ?? '');
      DataForm.value.adjust_info = JSON.parse(JSON.stringify(data.adjust_info));
      RawDataForm.value.adjust_info = JSON.parse(JSON.stringify(data.adjust_info));

      service_fee_value.value =
        DataForm.value.company_service_type === '2'
          ? String(DataForm.value.company_service_amount)
          : String(DataForm.value.company_service_rate);
      RawDataForm.value = JSON.parse(JSON.stringify(DataForm.value));
    };
    const ShowAdjustInfo = ref(false);
    /** 填充表单数据 */
    const fillForm = (data: Settlement) => {
      RawFillForm.value = data;

      ShowAdjustInfo.value = true;

      loadFormData(data);
    };

    /** 手工调账数据变更 */
    const onAdjustAccountDataChange = (adjust_info: AdjustInfo[]) => {
      DataForm.value.adjust_info = adjust_info;
    };

    const getSubmitData = (data: ShopLiveCostSettlementAfterForm) => {
      const id = RawFillForm.value?.id ?? -1;
      const amount_info_list: any = [];
      const company_service_rate: any =
        data.company_service_type === '1' ? data.company_service_rate : null;
      DataForm.value.json_data?.amount_info_list.map((item: any) => {
        if (item.type === 9) {
          item = {
            type: 9,
            company_service_amount: data.company_service_amount,
            company_service_type: data.company_service_type,
            company_service_rate: company_service_rate,
            kol_service_amount: data.kol_service_amount,
          };
          amount_info_list.push(item);
        } else {
          amount_info_list.push(item);
        }
      });

      const payload: any = {
        id: id,
        total_settle_amount: total_amount.value,
        invoice_type: data.invoice_type,
        tax_amount: data.tax_amount,
        tax_rate: data.tax_rate === '' ? '0' : data.tax_rate ?? '0',
        tax_included_amount: data.tax_included_amount,
        tax_excluded_amount: data.tax_excluded_amount,
        json_data: {
          amount_info_list: amount_info_list,
        },
      };
      return payload;
    };

    const checkFormData = (jump_next = true) => {
      const form_adjust_info_list = ref<AdjustInfo[]>([]);

      if (DataForm.value.adjust_info && DataForm.value.adjust_info?.length >= 1) {
        const adjust_info_list = DataForm.value.adjust_info.filter(
          el => el.adjust_reason || el.adjust_amount,
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
            el => el.adjust_amount !== '' && el.adjust_amount !== '-' && el.adjust_reason,
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

    const clearValidate = () => {
      setTimeout(() => {
        formRef.value?.clearValidate?.();
      }, 100);
    };
    const { business_type } = useProjectBaseInfo();
    /** 提交数据 */
    const submit = async (jump_next = true, without_check = false) => {
      if (saveLoading.value) {
        return;
      }
      if (!project.value) {
        return;
      }
      const new_business_type =
        business_type.value ||
        project.value.business_type ||
        DataForm.value.business_type ||
        E.project.BusinessType.douyin;
      const result = await new Promise(resolve => {
        formRef.value?.validate(valid => resolve(valid));
      });

      if (!result) {
        return;
      }

      if (!without_check) {
        const err_msg = checkFormData(jump_next);
        if (err_msg) {
          ctx.root.$message.error(err_msg);
          return;
        }
      }

      const payload = getSubmitData(DataForm.value);
      payload.step = jump_next ? SettlementStep.step_three : SettlementStep.step_two;
      payload.adjust_info = getValidAdjustInfoList(DataForm.value);

      saveLoading.value = true;
      const [{ data: response }] = await AwaitFn(
        500,
        saveSettlementCostDataService(payload, new_business_type),
      );
      saveLoading.value = false;

      if (response.success) {
        if (jump_next) {
          ctx.emit('next', response.data);
        }
        clearValidate();
      } else {
        ctx.root.$message.error(response.message ?? '保存失败');
      }
      return response;
    };

    /** 保存 */
    const onSaveHandler = useDebounceFn(submit, 200);

    const prev = async () => {
      if (isEditModeChanged.value) {
        const jump_next = false;
        const without_check = true; // 产品要求 第二步 返回上一步 不检查数据
        const response = await submit(jump_next, without_check);
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
      if (!(DataForm.value?.invoice_type || DataForm.value?.invoice_type === 0)) {
        ctx.root.$message.warning('请选择发票类型');
        return;
      }
      if (isEditModeChanged.value) {
        onSaveHandler();
      } else {
        const jump_next = true;
        const err_msg = checkFormData(jump_next);
        if (err_msg) {
          ctx.root.$message.error(err_msg);
          return;
        } else {
          ctx.emit('next', RawFillForm.value);
        }
      }
    };

    /** 表单有数据变化 */
    const isEditModeChanged = computed(() => {
      return JSON.stringify(RawDataForm.value) !== JSON.stringify(DataForm.value);
    });

    const confirmBeforeClose = async () => {
      return isEditModeChanged.value;
    };

    const saveBeforeClose = async () => {
      const jump_next = false;
      const without_check = true; // 产品要求 第二步 返回上一步 不检查数据

      const response = await submit(jump_next, without_check);
      if (response) {
        return response.success;
      } else {
        return false;
      }
    };

    const invoiceTypeChangedHandler = (val: number) => {
      DataForm.value.invoice_type = val;
      DataForm.value.tax_rate = val !== 2 ? '0' : DataForm.value.tax_rate;
    };

    // 服务费抽成比率
    const CompanyServiceRateInput = (value: string) => {
      const result =
        DataForm.value.company_service_type === '1'
          ? getPositiveRateNumber(value)
          : getPositivePriceNumber(value);

      service_fee_value.value = result;
    };

    const taxValueChangeHandler = (item: TaxAmountInfo) => {
      DataForm.value.invoice_type = item.invoice_type || DataForm.value.invoice_type;
      DataForm.value.tax_rate =
        item.invoice_type !== 2 ? '0' : item.tax_rate + '' || DataForm.value.tax_rate;
      DataForm.value.tax_included_amount = item.tax_included_amount?.toString() ?? '';
      DataForm.value.tax_excluded_amount = item.tax_excluded_amount?.toString() ?? '';
      DataForm.value.tax_amount = item.tax_amount?.toString() ?? '';
    };
    const taxRateChanged = (value: string) => {
      DataForm.value.tax_rate = value;
    };

    return {
      formRef,
      schedule_file_list,
      total_amount_str,
      ShowAdjustInfo,
      service_fee_value,
      company_service_amount_value,
      company_service_amount_str,
      kol_service_amount_str,

      CompanyServiceRateInput,

      taxRateChanged,
      invoiceTypeChangedHandler,
      taxValueChangeHandler,
      downloadKolScheduleFile,
      downloadKolServiceFeeFile,

      total_amount,
      DataForm,
      saveLoading,
      fill_form_loading,
      onAdjustAccountDataChange,
      onSaveHandler,
      fillForm,
      prev,
      next,
      confirmBeforeClose,
      saveBeforeClose,
    };
  },
});
