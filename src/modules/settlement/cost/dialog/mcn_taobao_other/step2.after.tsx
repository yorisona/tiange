import { computed, defineComponent, inject, onMounted, Ref, ref } from '@vue/composition-api';
import TopCard from '@/modules/settlement/component/top.card.vue';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import SettlementStep2Layout from '@/modules/settlement/component/step2.cost.layout';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import { Decimal2String } from '@/utils/string';
import Decimal from 'decimal.js';
import {
  AdjustInfo,
  MCNIncomeFormForDouyinAfter,
  SetlementIncomeTypeMap,
  Settlement,
  SettlementIncomeType,
  SettlementOneStepOperationEnum,
  SettlementStep,
  TaxAmountInfo,
} from '@/types/tiange/finance/settlement';
import { deepClone } from '@/utils/tools';
import { saveSettlementCostDataService } from '@/services/finance/settlement';
import { BusinessTypeEnum } from '@/types/tiange/common';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';

export default defineComponent({
  components: {
    TopCard,
    CardLayout,
    SettlementStep2Layout,
    TgAdjustAccountForm,
  },
  setup(props, ctx) {
    const saveLoading = ref<boolean>(false);

    const incomeNameTypes = computed(() => {
      const names: { type: SettlementIncomeType; name: string }[] = [];
      SetlementIncomeTypeMap.forEach((value, key) => {
        names.push({
          type: key,
          name: value,
        });
      });
      return names;
    });
    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);
    const DataForm = ref<MCNIncomeFormForDouyinAfter>({
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
    const originDataForm = ref<MCNIncomeFormForDouyinAfter>(
      deepClone(DataForm.value) as MCNIncomeFormForDouyinAfter,
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
    /**
     * 方法对象
     */
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
          switch (element.type) {
            case SettlementIncomeType.other: {
              const not_complete =
                element.amount === undefined || element.amount === null || element.amount === ''
                  ? true
                  : false;
              if (not_complete) {
                income_ok = false;
                income_error_message = '请完善其他收入数据信息';
              }
              break;
            }
            default:
              break;
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
        if (Number(total_amount.value) < 0) {
          ctx.root.$message.warning('总结算金额不能小于0');
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
        DataForm.value.invoice_type = item.invoice_type || DataForm.value.invoice_type;
        DataForm.value.tax_rate =
          item.invoice_type !== 2 ? '0' : item.tax_rate + '' || DataForm.value.tax_rate;
        DataForm.value.tax_included_amount = item.tax_included_amount?.toString() ?? '';
        DataForm.value.tax_excluded_amount = item.tax_excluded_amount?.toString() ?? '';
        DataForm.value.tax_amount = item.tax_amount?.toString() ?? '';
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
        // if (!methods.checkDataForSave() && (settlement.value?.is_include_tax === 0 || settlement.value?.is_include_tax === 1)) {
        //   if (operationEnum === SettlementOneStepOperationEnum.next) {
        //     ctx.emit('next');
        //   }
        //   return;
        // }
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
          is_include_tax: DataForm.value.is_include_tax,
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
    };
    onMounted(() => {
      originDataForm.value = deepClone(DataForm.value) as MCNIncomeFormForDouyinAfter;
    });
    return {
      incomeNameTypes,
      settlement,
      saveLoading,
      DataForm,
      total_amount,
      total_amount_str,
      ...methods,
    };
  },
  render() {
    return (
      <SettlementStep2Layout
        class="settlement-step2-mcn-cost-after-taobao-other"
        amount={this.total_amount_str}
      >
        <top-card
          slot="top"
          amount={this.total_amount}
          type="value1"
          tax_rate_disabled={false}
          tax_rate={this.DataForm.tax_rate}
          invoice_type={this.DataForm.invoice_type}
          on-taxRateChanged={this.taxRateChanged}
          on-invoiceTypeChanged={this.invoiceTypeChangedHandler}
          on-valueChange={this.taxValueChangeHandler}
        ></top-card>
        <card-layout
          slot="left"
          class="settlement-left-block"
          element-loading-background="rgba(0, 0, 0, 0.25)"
        >
          <div slot="title">
            <span>{this.settlement?.company_name || '--'}</span>
          </div>
          <div class="amount-info-list">
            {this.incomeNameTypes.map((item, itemIdx) => {
              return (
                <div key={itemIdx}>
                  {this.amountDetail(item.type) && (
                    <div>
                      <div class="input-row mgb-12">
                        {/* <span class="label label-42">{item.name}</span> */}
                        <span class="label label-42">成本：</span>
                        <el-input
                          placeholder="填写成本"
                          value={this.income_amount(item.type)}
                          on-input={(val: string) => this.onIncomeAmountChanged(val, item.type)}
                          size="mini"
                          style="width: 240px; margin: 0 32px 0 12px"
                        >
                          <fragments slot="append">元</fragments>
                        </el-input>
                      </div>
                      <div>
                        <el-input
                          value={this.remark(item.type)}
                          type="textarea"
                          placeholder="请输入其他成本说明"
                          maxlength="50"
                          resize="none"
                          on-input={(val: string) => this.remarkChanged(val, item.type)}
                          style="width: 360px; height: 80px; margin-left: 54px"
                        ></el-input>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </card-layout>
        <div slot="right">
          <el-form size="small" label-width="68px">
            <tg-adjust-account-form
              adjust_info={this.DataForm.adjust_info}
              on-dataChange={this.onAdjustAccountDataChange}
            />
          </el-form>
        </div>
        <fragments slot="button">
          <tg-button on-click={this.prev}>上一步</tg-button>
          <tg-button type="primary" on-click={this.next}>
            下一步
          </tg-button>
        </fragments>
        <tg-mask-loading slot="mask" visible={this.saveLoading} content="正在保存，请稍候..." />
      </SettlementStep2Layout>
    );
  },
});
