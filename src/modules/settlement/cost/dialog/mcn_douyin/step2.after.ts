import { defineComponent, ref, inject, Ref, computed, onMounted } from '@vue/composition-api';
import SettlementStep2Layout from '@/modules/settlement/component/step2.cost.layout';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import {
  AdjustInfo,
  MCNCostFormForDouyinAfter,
  SetlementCostTypeMap,
  Settlement,
  SettlementIncomeType,
  SettlementOneStepOperationEnum,
  SettlementStep,
  TaxAmountInfo,
} from '@/types/tiange/finance/settlement';
import { deepClone } from '@/utils/tools';
import Decimal from 'decimal.js';
import { Decimal2String, formatAmountWithoutPrefix } from '@/utils/string';
import { saveSettlementCostDataService } from '@/services/finance/settlement';
import {
  default_put_company_name,
  pit_fee_detail_url,
  put_detail_url,
} from '@/modules/settlement/component/use/uilts';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
// import { commonForm } from '@/modules/settlement/cost/dialog/shoplive/utils';
import { BusinessTypeEnum } from '@/types/tiange/common';
import TopCard from '@/modules/settlement/component/top.card.vue';

export default defineComponent({
  components: {
    SettlementStep2Layout,
    TgAdjustAccountForm,
    CardLayout,
    TopCard,
  },
  setup(props, ctx) {
    // const { downloadFileHandler } = commonForm(ctx);

    const saveLoading = ref<boolean>(false);
    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);

    const feeNameTypes = computed(() => {
      const names: { type: SettlementIncomeType; name: string }[] = [];
      SetlementCostTypeMap.forEach((value, key) => {
        names.push({
          type: key,
          name: value,
        });
      });
      return names;
    });

    const DataForm = ref<MCNCostFormForDouyinAfter>({
      adjust_info: settlement.value?.adjust_info ?? [],
      invoice_type: settlement.value?.invoice_type || undefined,
      tax_amount: settlement.value?.tax_amount ? `${settlement.value.tax_amount}` : '',
      tax_rate:
        settlement.value?.tax_rate === undefined || settlement.value?.tax_rate === null
          ? '0'
          : `${settlement.value.tax_rate}`,
      tax_included_amount: settlement.value?.tax_included_amount
        ? `${settlement.value.tax_included_amount}`
        : '',
      tax_excluded_amount: settlement.value?.tax_excluded_amount
        ? `${settlement.value.tax_excluded_amount}`
        : '',
      amount_info_list: settlement.value?.json_data?.amount_info_list ?? [],
    });

    const originDataForm = ref<MCNCostFormForDouyinAfter>(
      deepClone(DataForm.value) as MCNCostFormForDouyinAfter,
    );

    /** 总结算金额 */
    const total_amount = computed(() => {
      let totalAmount: Decimal = new Decimal(0);
      DataForm.value.adjust_info?.forEach(item => {
        let adjust_amount = item.adjust_amount ? item.adjust_amount : 0;
        adjust_amount = isNaN(Number(adjust_amount)) ? 0 : adjust_amount;
        totalAmount = new Decimal(adjust_amount).add(totalAmount);
      });
      DataForm.value.amount_info_list?.forEach(item => {
        let amount = item.amount ? item.amount : 0;
        amount = isNaN(Number(amount)) ? 0 : amount;
        totalAmount = new Decimal(amount).add(totalAmount);
      });
      return totalAmount.toFixed(2);
    });

    const total_amount_str = computed(() => Decimal2String(new Decimal(total_amount.value)));

    const isYuFengCompany = computed(
      () => settlement.value?.company_name === default_put_company_name,
    );

    const methods = {
      prev: () => {
        if (methods.isModified()) {
          methods.saveSettlementDataRequest(SettlementOneStepOperationEnum.prev);
        } else {
          ctx.emit('prev');
        }
      },
      next: () => {
        methods.saveSettlementDataRequest();
      },
      isTypeIn: () => {
        if (DataForm.value.adjust_info?.find(item => item.adjust_amount || item.adjust_reason)) {
          return true;
        }
        return false;
      },
      checkDataForSave: () => {
        // if (!methods.isTypeIn()) {
        //   ctx.root.$message.warning('至少填写一个结算项');
        //   return false;
        // }

        let income_ok = true;
        let income_error_message = '';
        DataForm.value.amount_info_list?.forEach(element => {
          const not_complete = !element.amount;
          if (not_complete) {
            income_ok = false;
            switch (element.type) {
              case SettlementIncomeType.put:
                income_error_message = '请完善投放成本数据信息';
                break;
              case SettlementIncomeType.talent_cost: {
                income_error_message = '请完善达人成本数据信息';
                break;
              }
              case SettlementIncomeType.pit_fee:
                income_error_message = '请完善坑位费数据信息';
                break;
              case SettlementIncomeType.shangguang:
                income_error_message = '请完善商广成本数据信息';
                break;
              case SettlementIncomeType.xingtu:
                income_error_message = '请完善星图成本数据信息';
                break;
              case SettlementIncomeType.other:
                income_error_message = '请完善其他成本数据信息';
                break;
              default:
                break;
            }
          }
          if (!income_ok) {
            return;
          }
        });
        if (!income_ok) {
          ctx.root.$message.warning(income_error_message);
          return false;
        }

        if (DataForm.value.adjust_info?.find(item => isNaN(Number(item.adjust_amount)))) {
          ctx.root.$message.warning('请输入正确的调整金额');
          return false;
        }

        if (
          DataForm.value.adjust_info?.find(
            item => Number(item.adjust_amount) === 0 && item.adjust_amount,
          )
        ) {
          ctx.root.$message.warning('调整金额不能为0');
          return false;
        }
        if (
          DataForm.value.adjust_info?.find(
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
      taxRateChanged: (value: string) => {
        DataForm.value.tax_rate = value;
      },
      invoiceTypeChangedHandler: (val: number) => {
        DataForm.value.invoice_type = val;
        DataForm.value.tax_rate = val !== 2 ? 0 : DataForm.value.tax_rate;
      },
      taxValueChangeHandler: (item: TaxAmountInfo) => {
        DataForm.value.tax_included_amount = item.tax_included_amount?.toString() ?? '';
        DataForm.value.tax_excluded_amount = item.tax_excluded_amount?.toString() ?? '';
        DataForm.value.tax_amount = item.tax_amount?.toString() ?? '';
        DataForm.value.invoice_type = item.invoice_type;
        DataForm.value.tax_rate =
          item.invoice_type !== 2 ? '0' : item.tax_rate || DataForm.value.tax_rate;
      },
      onAdjustAccountDataChange: (adjust_info: AdjustInfo[]) => {
        DataForm.value.adjust_info = adjust_info;
      },
      isModified: () => {
        const originData = JSON.stringify(originDataForm.value);
        const newData = JSON.stringify(DataForm.value);

        if (originData !== newData) {
          return true;
        } else {
          return false;
        }
      },
      confirmBeforeClose: async () => {
        return methods.isModified();
      },
      saveBeforeClose: () => {
        return methods.saveSettlementDataRequest(SettlementOneStepOperationEnum.close);
      },
      saveSettlementDataRequest: async (
        operationEnum: SettlementOneStepOperationEnum = SettlementOneStepOperationEnum.next,
      ) => {
        if (!(DataForm.value?.invoice_type || DataForm.value?.invoice_type === 0)) {
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
        const params: any = {
          id: settlement.value?.id,
          step:
            operationEnum === SettlementOneStepOperationEnum.next
              ? SettlementStep.step_three
              : SettlementStep.step_two,
          total_settle_amount: total_amount.value,
          adjust_info: DataForm.value.adjust_info?.filter((item: AdjustInfo) => {
            return item.adjust_amount || item.adjust_reason;
          }),
          invoice_type: DataForm.value.invoice_type,
          tax_amount: DataForm.value.tax_amount,
          tax_rate: DataForm.value.tax_rate === '' ? '0' : DataForm.value.tax_rate ?? '0',
          tax_included_amount: DataForm.value.tax_included_amount,
          tax_excluded_amount: DataForm.value.tax_excluded_amount,
          json_data: {
            amount_info_list: DataForm.value.amount_info_list,
          },
        };
        saveLoading.value = true;
        const res = await saveSettlementCostDataService(params, BusinessTypeEnum.mcn);
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
      amountDetail: (type: SettlementIncomeType) => {
        return DataForm.value.amount_info_list.find(el => el.type === type);
      },
      downDetail: (type: SettlementIncomeType) => {
        if (type === SettlementIncomeType.pit_fee) {
          window.open(pit_fee_detail_url(settlement.value?.id, settlement.value?.company_id, 2));
        } else if (type === SettlementIncomeType.put) {
          const detail = methods.amountDetail(type);
          const ids_str = (detail?.kol_ids ?? []).join(',');
          window.open(
            put_detail_url(
              ids_str,
              settlement.value?.start_date ?? 0,
              settlement.value?.end_date ?? 0,
            ),
          );
        }

        // const url = methods.amountDetail(SettlementIncomeType.pit_fee)?.file;
        // if (url) {
        //   downloadFileHandler(url);
        // }
      },
      income_amount: (type: SettlementIncomeType) => {
        return methods.amountDetail(type)?.amount;
      },
      remark: (type: SettlementIncomeType) => {
        return methods.amountDetail(type)?.remark;
      },
      file: (type: SettlementIncomeType) => {
        return methods.amountDetail(type)?.file;
      },
      onIncomeAmountChanged: (val: string, type: SettlementIncomeType) => {
        const result = (/(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?/u.exec(
          val.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
        ) ?? [''])[0];
        const detail = methods.amountDetail(type);
        if (detail) {
          detail.amount = result;
        }
      },
      remarkChanged: (val: string, type: SettlementIncomeType) => {
        const detail = methods.amountDetail(type);
        if (detail) {
          detail.remark = val;
        }
      },
      formatAmountWithoutPrefix,
    };

    onMounted(() => {
      originDataForm.value = deepClone(DataForm.value) as MCNCostFormForDouyinAfter;
    });
    return {
      feeNameTypes,
      saveLoading,
      DataForm,
      total_amount,
      settlement,
      total_amount_str,
      isYuFengCompany,
      ...methods,
    };
  },
});
