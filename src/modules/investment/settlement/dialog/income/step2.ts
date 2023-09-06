import { computed, defineComponent, inject, Ref, ref, onMounted } from '@vue/composition-api';
import SettlementStep2Layout from '@/modules/settlement/component/step2.layout';
import TopCard from '@/modules/settlement/component/top.card.vue';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import {
  AdjustInfo,
  Settlement,
  SettlementOneStepOperationEnum,
  SettlementProjectType,
  SettlementStep,
  TaxAmountInfo,
} from '@/types/tiange/finance/settlement';
import { SaveSettlementDataForm, SaveSettlementDataParams } from '@/types/tiange/investment';
import { deepClone } from '@/utils/tools';
import Decimal from 'decimal.js';
import { SaveMerchantSettlementData } from '@/services/investment';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';

// SaveSettlementDataParams

export default defineComponent({
  components: {
    TopCard,
    CardLayout,
    TgAdjustAccountForm,
    SettlementStep2Layout,
  },
  setup(props, ctx) {
    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);

    const dataForm = ref<SaveSettlementDataForm>({
      json_data: settlement.value?.json_data ?? {
        company_info_list: [],
        product_code: undefined,
        product_name: undefined,
      },
      adjust_info: settlement.value?.adjust_info ?? [],
      invoice_type: settlement.value?.invoice_type || undefined,
      tax_amount: settlement.value?.tax_amount ? `${settlement.value.tax_amount}` : '',
      tax_excluded_amount: settlement.value?.tax_excluded_amount
        ? `${settlement.value.tax_excluded_amount}`
        : '',
      tax_included_amount: settlement.value?.tax_included_amount
        ? `${settlement.value.tax_included_amount}`
        : '',
      tax_rate:
        settlement.value?.tax_rate === undefined || settlement.value?.tax_rate === null
          ? '0'
          : `${settlement.value.tax_rate}`,
    });

    const originDataForm = ref<SaveSettlementDataForm>(
      deepClone(dataForm.value) as SaveSettlementDataForm,
    );

    const company_name = computed(() => {
      return settlement.value?.company_name ? settlement.value?.company_name : '--';
    });

    const merchants_project = computed(() => {
      return dataForm.value.json_data.company_info_list.find(
        el => el.type === SettlementProjectType.merchant_project,
      );
    });
    const execute_project = computed(() => {
      return dataForm.value.json_data.company_info_list.find(
        el => el.type === SettlementProjectType.execute_project,
      );
    });

    const saveLoading = ref<boolean>(false);

    const total_amount = computed(() => {
      let totalAmount: Decimal = new Decimal(0);
      dataForm.value.adjust_info?.forEach(item => {
        let adjust_amount = item.adjust_amount ? item.adjust_amount : 0;
        adjust_amount = isNaN(Number(adjust_amount)) ? 0 : adjust_amount;
        totalAmount = new Decimal(adjust_amount).add(totalAmount);
      });
      dataForm.value.json_data.company_info_list?.forEach(item => {
        let amount = item.income_amount ? item.income_amount : 0;
        amount = isNaN(Number(amount)) ? 0 : amount;
        totalAmount = new Decimal(amount).add(totalAmount);
      });
      return totalAmount.toFixed(2);
    });

    const selectedPrjectList = ref([
      {
        type: SettlementProjectType.execute_project,
        name: '执行项目',
      },
      {
        type: SettlementProjectType.merchant_project,
        name: '招商项目',
      },
    ]);

    const methods = {
      prev: () => {
        if (methods.isModified()) {
          methods.saveSettlementDataRequest(SettlementOneStepOperationEnum.prev);
        } else {
          ctx.emit('prev');
        }
      },
      next: async () => {
        methods.saveSettlementDataRequest();
      },
      confirmBeforeClose: async () => {
        return methods.isModified();
      },
      saveBeforeClose: () => {
        return methods.saveSettlementDataRequest(SettlementOneStepOperationEnum.close);
      },
      taxRateChanged: (value: string) => {
        dataForm.value.tax_rate = value;
      },
      invoiceTypeChangedHandler: (val: number) => {
        dataForm.value.invoice_type = val;
        dataForm.value.tax_rate = val === 0 ? 0 : dataForm.value.tax_rate;
      },
      taxValueChangeHandler: (item: TaxAmountInfo) => {
        dataForm.value.invoice_type = item.invoice_type || dataForm.value.invoice_type;
        dataForm.value.tax_rate =
          item.invoice_type === 0 ? '0' : item.tax_rate + '' || dataForm.value.tax_rate;
        dataForm.value.tax_included_amount = item.tax_included_amount?.toString() ?? '';
        dataForm.value.tax_excluded_amount = item.tax_excluded_amount?.toString() ?? '';
        dataForm.value.tax_amount = item.tax_amount?.toString() ?? '';
      },
      onAdjustAccountDataChange: (adjust_info: AdjustInfo[]) => {
        dataForm.value.adjust_info = adjust_info;
      },
      isModified: () => {
        const originData = JSON.stringify(originDataForm.value);
        const newData = JSON.stringify(dataForm.value);

        if (originData !== newData) {
          return true;
        } else {
          return false;
        }
      },
      getAdjustInputNumber: (value: string) => {
        return (/(?:(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?)?/u.exec(
          value.replace(/[^-.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
        ) ?? [''])[0];
      },
      onMerchantsInputChanged: (val: string) => {
        if (merchants_project.value) {
          merchants_project.value.income_amount = methods.getAdjustInputNumber(val);
        }
      },
      onExecuteInputChanged: (val: string) => {
        if (execute_project.value) {
          execute_project.value.income_amount = methods.getAdjustInputNumber(val);
        }
      },
      checkDataForSave: () => {
        if (dataForm.value.adjust_info?.find(item => isNaN(Number(item.adjust_amount)))) {
          ctx.root.$message.warning('请输入正确的调整金额');
          return false;
        }

        if (
          dataForm.value.adjust_info?.find(
            item => Number(item.adjust_amount) === 0 && item.adjust_amount,
          )
        ) {
          ctx.root.$message.warning('调整金额不能为0');
          return false;
        }
        if (
          dataForm.value.adjust_info?.find(
            item =>
              (!item.adjust_amount && item.adjust_reason) ||
              (item.adjust_amount && !item.adjust_reason),
          )
        ) {
          ctx.root.$message.warning('请完善手工调账信息');
          return false;
        }
        if (Number(total_amount.value) <= 0) {
          ctx.root.$message.warning('总结算金额不能小于等于0');
          return false;
        }
        // if (!methods.isModified()) {
        //   return false;
        // }
        return true;
      },
      saveSettlementDataRequest: async (
        operationEnum: SettlementOneStepOperationEnum = SettlementOneStepOperationEnum.next,
      ) => {
        if (!(settlement.value?.invoice_type || settlement.value?.invoice_type === 0)) {
          ctx.root.$message.warning('请选择发票类型');
          return;
        }
        if (operationEnum === SettlementOneStepOperationEnum.next) {
          if (!methods.checkDataForSave()) {
            return;
          } else if (!methods.isModified()) {
            ctx.emit('next');
            return;
          }
        }

        const params: SaveSettlementDataParams = {
          id: settlement.value?.id,
          step:
            operationEnum === SettlementOneStepOperationEnum.next
              ? SettlementStep.step_three
              : SettlementStep.step_two,
          total_settle_amount: total_amount.value,
          adjust_info:
            dataForm.value.adjust_info?.filter((item: AdjustInfo) => {
              return item.adjust_amount || item.adjust_reason;
            }) ?? [],
          invoice_type: dataForm.value.invoice_type,
          tax_amount: dataForm.value.tax_amount,
          tax_rate: dataForm.value.tax_rate === '' ? '0' : dataForm.value.tax_rate ?? '0',
          tax_included_amount: dataForm.value.tax_included_amount,
          tax_excluded_amount: dataForm.value.tax_excluded_amount,
          json_data: dataForm.value.json_data,
        };
        saveLoading.value = true;
        const res = await SaveMerchantSettlementData(params);
        saveLoading.value = false;
        if (res.data.success) {
          switch (operationEnum) {
            case SettlementOneStepOperationEnum.next:
              ctx.emit('next', res.data.data);
              ctx.root.$message.success('保存成功');
              break;
            case SettlementOneStepOperationEnum.prev:
              ctx.emit('prev', res.data.data);
              break;
            default:
              ctx.root.$message.success('保存成功');
              break;
          }
          return true;
        } else {
          ctx.root.$message.error(res.data.message ?? '保存失败');
          return false;
        }
      },
    };

    onMounted(() => {
      originDataForm.value = deepClone(dataForm.value) as SaveSettlementDataForm;
    });
    return {
      company_name,
      saveLoading,
      total_amount,
      selectedPrjectList,
      dataForm,
      merchants_project,
      execute_project,
      ...methods,
    };
  },
});
