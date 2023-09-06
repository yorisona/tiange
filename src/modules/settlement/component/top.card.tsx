/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-08-05 16:13:55
 */
import { computed, defineComponent, PropType } from '@vue/composition-api';
import Decimal from 'decimal.js';
import { Decimal2String } from '@/utils/string';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import { get_tax_amount_info } from '@/utils/string';
import { TaxAmountInfo } from '@/types/tiange/finance/settlement';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';

export type TopCardType = 'default' | 'value1' | 'value2';

const TopCard = defineComponent({
  props: {
    /** 总结算金额 */
    amount: {
      type: String,
    },
    name_desc: {
      type: String,
      default: '客户：',
    },
    name: {
      type: String,
    },
    /** default: 只有总结算金额； value1: 可以修改是否含税；value2: 不能修改是否含税 */
    type: {
      type: String as PropType<TopCardType>,
      default: 'default',
    },
    /** 是否含税 1含    0不含  */
    taxed: {
      type: Number,
      default: 0,
    },
    /**  发票类型 专票2、普票1 不开票0 */
    invoice_type: {
      type: Number,
      default: undefined,
    },
    /** 税率 */
    tax_rate: {
      type: String,
      default: '0',
    },
    /** 税率是否可以编辑 */
    tax_rate_disabled: {
      type: Boolean,
      default: false,
    },
    /** 含税金额 */
    tax_included_amount: {
      type: String,
    },
    /** 不含税金额 */
    tax_excluded_amount: {
      type: String,
    },
    /** 税额 */
    tax_amount: {
      type: String,
    },
    /** 税率是否可以编辑 */
    is_cost: {
      type: Boolean,
      default: true,
    },
  },
  name: 'TopCard',
  emits: ['taxRateChanged', 'taxedChanged', 'invoiceTypeChanged', 'valueChange'],
  components: {
    CardLayout,
  },
  setup(props, ctx) {
    const cal_invoice_type = computed(() =>
      props.invoice_type || props.invoice_type === 0 ? props.invoice_type : undefined,
    );
    const cal_tax_rate = computed(() => props.tax_rate);
    const final_amount = computed(() => props.amount ?? '0');
    const format_final_amout = computed(() => Decimal2String(new Decimal(final_amount.value)));
    const getPositiveRateNumber = (value: string, max_value = 100) => {
      const re = new RegExp(`${max_value}(?:\\.0{0,2})?|(?:[1-9]?\\d)(?:\\.\\d{0,2})?`, 'u');
      const result = (re.exec(value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, '')) ??
        [])[0];
      return result === undefined ? '' : result;
    };

    const tax_amount_info = computed(() => {
      if (props.tax_amount && props.tax_excluded_amount && props.tax_included_amount) {
        return {
          tax_amount: props.tax_amount,
          tax_included_amount: props.tax_included_amount,
          tax_excluded_amount: props.tax_excluded_amount,
        };
      }

      const newValue = get_tax_amount_info(
        final_amount.value && final_amount.value !== '' ? final_amount.value : 0,
        (props.is_cost && cal_invoice_type.value === 2) ||
          (!props.is_cost && (cal_invoice_type.value === 2 || cal_invoice_type.value === 1)) ||
          (props.taxed === 1 && cal_invoice_type.value === undefined)
          ? 1
          : 0,
        ((props.is_cost && cal_invoice_type.value === 2) ||
          (!props.is_cost && (cal_invoice_type.value === 2 || cal_invoice_type.value === 1)) ||
          cal_invoice_type.value === undefined) &&
          cal_tax_rate.value &&
          cal_tax_rate.value !== ''
          ? cal_tax_rate.value
          : 0,
      );
      ctx.emit('valueChange', {
        ...newValue,
        tax_rate:
          (props.is_cost && cal_invoice_type.value !== 2) ||
          (!props.is_cost && cal_invoice_type.value === 0)
            ? 0
            : cal_tax_rate.value,
        invoice_type: cal_invoice_type.value,
      } as TaxAmountInfo);
      return newValue;
    });

    return {
      getPositiveRateNumber,
      final_amount,
      cal_invoice_type,
      cal_tax_rate,
      tax_amount_info,
      format_final_amout,
    };
  },
  render() {
    const operator = this.$props.type === 'value1' ? true : false;
    const cardTitleClass = this.type === 'default' ? 'top-card-title default' : 'top-card-title';
    return (
      <div class="tg-top-card">
        {this.$props.type === 'default' ? (
          <div class="tg-top-card-default">
            <span class={cardTitleClass}>总结算金额</span>
            <span class="top-card-amount">￥{this.format_final_amout}</span>
          </div>
        ) : (
          <card-layout padding={[18]}>
            <div slot="title">
              {this.$props.type === 'value1' ? (
                '总结算金额'
              ) : (
                <div class="title-name">
                  <span>{this.$props.name_desc}</span>
                  <span>{this.$props.name}</span>
                </div>
              )}
            </div>
            {this.$props.type === 'value1' ? (
              <div class="top-card-description" slot="desc">
                <div class="top-card-amount">￥{this.format_final_amout}</div>
                {operator ? (
                  <div class="top-card-amount-tax">
                    <span class="amount-label">发票类型</span>
                    <el-select
                      value={
                        this.cal_invoice_type || this.cal_invoice_type === 0
                          ? this.cal_invoice_type
                          : undefined
                      }
                      popper-class="taxed-popper-class el-select-popper-mini"
                      placeholder="请选择"
                      onChange={(val: number) => {
                        this.$emit('invoiceTypeChanged', val);
                      }}
                    >
                      <el-option label="专票" value={2}></el-option>
                      <el-option label="普票" value={1}></el-option>
                      {this.is_cost === false && <el-option label="不开票" value={0}></el-option>}
                    </el-select>
                    <span class="amount-label">税率</span>
                    <el-input
                      disabled={
                        this.$props.tax_rate_disabled ||
                        this.cal_invoice_type === 0 ||
                        (this.is_cost && this.cal_invoice_type === 1)
                      }
                      placeholder="0.00"
                      class="tg-tax-rate"
                      value={this.cal_tax_rate}
                      onInput={(val: string) => {
                        const result = this.getPositiveRateNumber(val, 99.99);
                        // if (Number(result) === 100) {
                        //   result = '10'
                        // }
                        this.$emit('taxRateChanged', result);
                      }}
                    >
                      <span slot="append">%</span>
                    </el-input>
                  </div>
                ) : (
                  ''
                )}
              </div>
            ) : (
              ''
            )}
            <div class="tg-top-card-content">
              <div>
                <div class="content-label">含税金额</div>
                <div class="content-value">
                  ￥{Decimal2String(new Decimal(this.tax_amount_info.tax_included_amount))}
                </div>
              </div>
              {operator ? (
                ''
              ) : (
                <div>
                  <div class="content-label">税率</div>
                  <div class="content-value">
                    {Decimal2String(new Decimal(this.cal_tax_rate ? this.cal_tax_rate : 0))}%
                  </div>
                </div>
              )}
              <div>
                <div class="content-label">不含税金额</div>
                <div class="content-value">
                  ￥{Decimal2String(new Decimal(this.tax_amount_info.tax_excluded_amount))}
                </div>
              </div>
              <div>
                <div class="content-label">税额</div>
                <div class="content-value">
                  ￥{Decimal2String(new Decimal(this.tax_amount_info.tax_amount))}
                </div>
              </div>
            </div>
          </card-layout>
        )}
      </div>
    );
  },
});

export default TopCard;
