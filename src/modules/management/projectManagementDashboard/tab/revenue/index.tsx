import { computed, defineComponent, ref } from '@vue/composition-api';
// import icon_check from '@/assets/img/management/icon_check.png';
import {
  statusColor,
  getStatusImg,
  // getIncreaseColor,
  chartItemColor,
  getAmountFormatUnion,
  ratioFormat,
  getIncreateRateNode,
} from '@/modules/management/use';
import dualAxisPlot from '@/modules/management/components/charts/revenue/index.vue';
import icon_legend_line from '@/assets/img/management/icon_legend_line.png';
import { AxisUnit } from '@/modules/finance/managementDashboard/type';
export default defineComponent({
  components: {
    dualAxisPlot,
  },
  props: {
    showZoom: {
      type: Boolean,
      default: () => false,
    },
    revenueData: {
      type: Object,
    },
  },
  setup: (props, ctx) => {
    const barType = ref('income');
    const lineType = ref('goal_income');
    const computedRevenueData = computed(() => props.revenueData);
    const computedShowZoom = computed(() => props.showZoom);
    const methods = {
      statusColor,
      getStatusImg,
      chartItemColor,
      getAmountFormatUnion,
      ratioFormat,
      getIncreateRateNode,
      getIncreaseRateDom: (rate: number | undefined, totalRatio: boolean = false) => {
        // const newVal = rate || 0;
        return methods.getIncreateRateNode(rate, {
          textStyle: totalRatio
            ? {
                color: 'var(--text-color)',
              }
            : undefined,
        });
        // <div class="ratio">
        //   <span class="label">环</span>
        //   <tg-icon
        //     name={
        //       newVal > 0
        //         ? 'ico-icon_tongyong_shangsheng_16_red'
        //         : 'ico-icon_tongyong_xiajiang_16_green'
        //     }
        //   ></tg-icon>
        //   <span class="value" style={`color: ${getIncreaseColor(newVal)}`}>
        //     {Math.abs(newVal)}%
        //   </span>
        // </div>
      },
      getCalculateItemDom: (
        title: string,
        amount: number | undefined,
        rate: number | null,
        increase_rate: number | undefined,
      ) => {
        const amountUnion = getAmountFormatUnion(amount);
        return (
          <div class="calculate-item">
            <div class="header">
              <span>{title}</span>
              <span class="header-value">
                占{' '}
                <span>
                  {methods.ratioFormat(rate)}
                  {/* {rate !== null && rate !== undefined ? rate + '%' : '--'} */}
                </span>
              </span>
            </div>
            <div class="detail">
              <div class="amount">
                <span class="value">{amountUnion.amountStr}</span>
                {amountUnion.unit ? <span class="unit">{amountUnion.unit}</span> : null}
              </div>
              {methods.getIncreaseRateDom(increase_rate, false)}
            </div>
          </div>
        );
      },
    };
    // console.log({
    //   data: props.revenueData,
    // });
    const yUnit = computed(() => {
      const key = barType.value;
      const lineKey = lineType.value;
      const findItem = computedRevenueData.value?.trend?.find((el: any) => {
        const amount = Math.abs(el[key] ?? 0) / 100;
        const line_amount = lineKey === 'goal_income' ? Math.abs(el[lineKey] ?? 0) / 100 : 0;
        return amount > 10000 || line_amount > 10000;
      });
      return findItem ? AxisUnit.wan : AxisUnit.yuan;
    });
    return {
      barType,
      lineType,
      yUnit,
      computedShowZoom,
      computedRevenueData,
      ...methods,
    };
  },
  render() {
    const { overview, trend } = this.computedRevenueData as any;
    const {
      goal_income,
      goal_income_complete_rate,
      // goal_income_increase_rate,
      income,
      income_increase_rate,
      // real_settled_rate,
      received_income,
      not_received_income,
      commission_amount,
      commission_amount_increase_rate,
      commission_amount_percent,
      promote_amount,
      promote_amount_increase_rate,
      promote_amount_percent,
      service_amount,
      service_amount_increase_rate,
      service_amount_percent,
      other_income,
      other_income_increase_rate,
      other_income_percent,
    } = overview || {};
    const goalUnion = this.getAmountFormatUnion(goal_income);
    const incomeUnion = this.getAmountFormatUnion(income);
    const trendList = trend || [];
    return (
      <div class="tg-revenue-container">
        <div class="summary-info">
          <div class="summary-info-left">
            <div class="header">
              <span class="header-name">总营收</span>
              {/*  <span class="settlement-ratio">
                实际结算率：
                <span>
                  {this.ratioFormat(real_settled_rate)}
                  {real_settled_rate === undefined || real_settled_rate === null
                    ? '--'
                    : real_settled_rate + '%'}
                </span>
              </span>*/}
            </div>
            <div class="total-revenue-info">
              <span class="total-revenue">
                {incomeUnion.amountStr}
                {incomeUnion.unit ? <span style="margin-left: 2px">{incomeUnion.unit}</span> : null}
              </span>
              {/* <div class="ratio">
                <span>环</span>
                <tg-icon name="ico-icon_tongyong_shangsheng_16_red"></tg-icon>
                <span>3534%</span>
              </div> */}
              {this.getIncreaseRateDom(income_increase_rate, true)}
            </div>
            <div class="line"></div>
            <div class="receipt-info">
              <div class="has-receipt receipt">
                <span class="label">已到账：</span>
                <span class="value">
                  {this.getAmountFormatUnion(received_income).amountUnitStr}
                </span>
              </div>
              <div class="not-receipt receipt">
                <span class="label">未到账：</span>
                <span class="value">
                  {this.getAmountFormatUnion(not_received_income).amountUnitStr}
                </span>
              </div>
            </div>
          </div>
          <div class="summary-info-right">
            <div class="process-info">
              <div class="process-summary">
                {this.getStatusImg(goal_income_complete_rate)}
                {/* <img src={icon_check} alt="" /> */}
                <div class="process-desc">
                  预算目标：<span class="goal-value">{goalUnion.amountStr}</span>
                  {goalUnion.unit ? <span class="goal-unit">{goalUnion.unit}</span> : null}
                  （进度&nbsp;
                  <span
                    class="process-value"
                    style={`color: ${this.statusColor(goal_income_complete_rate)}`}
                  >
                    {this.ratioFormat(goal_income_complete_rate)}
                  </span>
                  ）
                </div>
              </div>
              <el-progress
                color={this.statusColor(goal_income_complete_rate)}
                define-back-color="#E4E4E4"
                show-text={false}
                stroke-width={12}
                percentage={
                  (goal_income_complete_rate || 0) > 100 ? 100 : goal_income_complete_rate || 0
                }
              ></el-progress>
            </div>
            <div class="calculate">
              <span class="operator">=</span>
              {this.getCalculateItemDom(
                '佣金',
                commission_amount,
                commission_amount_percent,
                commission_amount_increase_rate,
              )}

              <span class="operator">+</span>
              {this.getCalculateItemDom(
                '营销/商广',
                promote_amount,
                promote_amount_percent,
                promote_amount_increase_rate,
              )}

              <span class="operator">+</span>
              {this.getCalculateItemDom(
                '服务费',
                service_amount,
                service_amount_percent,
                service_amount_increase_rate,
              )}

              <span class="operator">+</span>
              {this.getCalculateItemDom(
                '其他',
                other_income,
                other_income_percent,
                other_income_increase_rate,
              )}
            </div>
          </div>
        </div>
        <div class="chart-title">
          <div class="chart-title-name">营收趋势</div>
          {trendList.length > 0 && (
            <div class="chart-tips">
              {E.management.BudgetProcessOption.map(el => (
                <div class={`budget-tag budget-tag-${el.value}`}>{el.label}</div>
              ))}
            </div>
          )}
        </div>
        <div class="chart-field">
          <dualAxisPlot
            trendList={trendList}
            showZoom={false}
            key={trendList + this.lineType + this.barType}
            class="dashboard-chart border"
            yUnit={this.yUnit}
            style="height: 236px;"
            loading={this.profitRatioLoading}
            xData={trendList.map((el: any) => el.date)}
            series={[
              {
                name: '',
                type: 'bar',
                barMaxWidth: 28,
                barMinWidth: 8,
                barGap: '30%',
                barCategoryGap: '45%',
                itemStyle: {
                  // color: '#4FCA50',
                  borderRadius: 2,
                },
                label: {
                  show: this.barType === 'income',
                  position: 'top',
                  formatter: (params: any) => {
                    const { dataIndex } = params;
                    // goal_gmv_complete_rate
                    const goal_income_complete_rate =
                      trendList[dataIndex]?.goal_income_complete_rate;
                    return this.ratioFormat(goal_income_complete_rate, {
                      empty: '',
                    });
                    // return goal_income_complete_rate === null ||
                    //   goal_income_complete_rate === undefined
                    //   ? ''
                    //   : goal_income_complete_rate + '%';
                    // console.log({
                    //   params,
                    // });
                    // return `<div style="color: ${this.statusColor(
                    //   goal_gmv_complete_rate,
                    // )}">${goal_gmv_complete_rate}%</div>`;
                  },
                },
                // label: {
                //   show: true,
                //   position: 'top',
                // },
                data: trendList.map((el: any) => {
                  let value = el[this.barType];
                  value = value !== null && value !== undefined ? value / 100 : null;
                  const goal_income_complete_rate = el.goal_income_complete_rate || 0;
                  return {
                    value: value,
                    itemStyle: {
                      color:
                        this.barType === 'income'
                          ? this.chartItemColor(el.goal_income_complete_rate || 0)
                          : '#2877ff',
                    },
                    label: {
                      color: this.statusColor(goal_income_complete_rate),
                    },
                  };
                }),
              },
              {
                name: this.lineType === 'goal_income' ? '预算目标' : '结算率',
                type: 'line',
                // smooth: true,
                showSymbol: false,
                yAxisIndex: this.lineType === 'goal_income' ? 0 : 1,
                itemStyle: {
                  color: '#FF7F00',
                },
                lineStyle: {
                  width: 3,
                  shadowColor: '#FF7F003d',
                  shadowOffsetX: 0,
                  shadowOffsetY: 11,
                  shadowBlur: 11,
                },
                // stack: 'Total',
                data: trendList.map((el: any) => {
                  const value = el[this.lineType];
                  if (this.lineType === 'settled_rate') return value;
                  return value !== null && value !== undefined ? value / 100 : null;
                }),
              },
            ]}
          ></dualAxisPlot>
          {trendList.length > 0 && (
            <div class="chart-filter">
              <div class="bar-filter">
                <el-radio-group v-model={this.barType}>
                  <el-radio label="income">总营收</el-radio>
                  <el-radio label="commission_amount">佣金</el-radio>
                  <el-radio label="promote_amount">营销/商广</el-radio>
                  <el-radio label="service_amount">服务费</el-radio>
                  <el-radio label="other_income">其他</el-radio>
                </el-radio-group>
              </div>
              <div class="line-filter">
                <img class="line-icon" src={icon_legend_line} alt="" />
                <el-radio-group v-model={this.lineType}>
                  <el-radio label="goal_income">预算目标</el-radio>
                  <el-radio label="settled_rate">结算率</el-radio>
                </el-radio-group>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
});
