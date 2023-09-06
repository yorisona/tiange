import { computed, defineComponent, ref } from '@vue/composition-api';
import {
  statusColor,
  getIncreaseColor,
  getIncreateRateNode,
  ratioFormat,
} from '@/modules/management/use';
import dualAxisPlot from '@/modules/management/components/charts/profit/index.vue';
import { getAmountFormatUnion } from '@/modules/management/use';
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
    profitData: {
      type: Object,
    },
    notSupport: {
      type: Boolean,
      default: () => false,
    },
  },
  setup(props, ctx) {
    const lineType = ref<'net_profit_rate' | 'avg_labor_profit'>('net_profit_rate');
    const computedProfitData = computed(() => props.profitData);
    const computedShowZoom = computed(() => props.showZoom);
    const methods = {
      statusColor,
      ratioFormat,
      getIncreateRateNode,
      getIncreaseColor,
      getAmountFormatUnion,
    };
    // console.log({
    //   data: props.profitData,
    // });
    const yUnits = computed(() => {
      const findItem = computedProfitData.value?.trend?.find((el: any) => {
        const net_profit = Math.abs(el.net_profit ?? 0) / 100;
        const income = Math.abs(el.income ?? 0) / 100;
        return net_profit > 10000 || income > 10000;
      });
      const rightFindItem = computedProfitData.value?.trend?.find((el: any) => {
        const avg_labor_profit = Math.abs(el.avg_labor_profit ?? 0) / 100;
        return avg_labor_profit > 10000;
      });
      return [
        findItem ? AxisUnit.wan : AxisUnit.yuan,
        rightFindItem ? AxisUnit.wan : AxisUnit.yuan,
      ];
    });
    return {
      lineType,
      yUnits,
      computedShowZoom,
      computedProfitData,
      ...methods,
    };
  },
  render() {
    const { overview, trend } = this.computedProfitData as any;
    const { net_profit_rate, avg_labor_profit, avg_labor_profit_increase_rate } = overview || {};
    const avg_labor_profit_union = this.getAmountFormatUnion(avg_labor_profit);
    const new_avg_labor_profit_increase_rate = avg_labor_profit_increase_rate || 0;
    const trendList = trend || [];
    if (this.notSupport)
      return (
        <div class="tg-profit-container">
          <div class="empty-no-support">
            <empty-common detail-text="暂无自定义统计数据"></empty-common>
          </div>
        </div>
      );
    return (
      <div class="tg-profit-container">
        <div class="summary-info">
          <div class="profit-ratio">
            <span class="label">净利润率：</span>
            <span class="value">
              {this.ratioFormat(net_profit_rate)}
              {/* {net_profit_rate !== null && net_profit_rate !== undefined
                ? net_profit_rate + '%'
                : '--'} */}
            </span>
          </div>
          <div class="avg-profit">
            <span class="label">人均产值：</span>
            <span class="value">{avg_labor_profit_union.amountStr}</span>
            {avg_labor_profit_union.unit ? (
              <span class="unit">{avg_labor_profit_union.unit}</span>
            ) : null}
          </div>
          {this.getIncreateRateNode(new_avg_labor_profit_increase_rate, {
            textStyle: {
              color: 'var(--text-color)',
            },
          })}
          {/* {(new_avg_labor_profit_increase_rate > 0 || new_avg_labor_profit_increase_rate < 0) && (
            <div class="ratio">
              <span>环</span>
              <tg-icon
                name={
                  new_avg_labor_profit_increase_rate > 0
                    ? 'ico-icon_tongyong_shangsheng_16_red'
                    : 'ico-icon_tongyong_xiajiang_16_green'
                }
              ></tg-icon>
              <span style={`color: ${this.getIncreaseColor(new_avg_labor_profit_increase_rate)}`}>
                {Math.abs(new_avg_labor_profit_increase_rate)}%
              </span>
            </div>
          )} */}
        </div>
        <div class="chart-title">利润走势</div>
        <div class="chart-field">
          <dualAxisPlot
            showZoom={false}
            key={trendList + this.lineType}
            trendList={trendList}
            class="dashboard-chart border"
            yUnits={this.yUnits}
            rightAxisType={this.lineType === 'net_profit_rate' ? 'ratio' : 'money'}
            style="height: 290px;"
            loading={this.profitRatioLoading}
            xData={trendList.map((el: any) => el.date)}
            series={[
              {
                name: '利润',
                type: 'bar',
                barMaxWidth: 28,
                barMinWidth: 8,
                barGap: '30%',
                barCategoryGap: '45%',
                itemStyle: {
                  color: '#FFBD3B',
                  borderRadius: 2,
                },
                // label: {
                //   show: true,
                //   position: 'top',
                // },
                data: trendList.map((el: any) => {
                  const net_profit = el.net_profit;
                  return net_profit !== null && net_profit !== undefined ? net_profit / 100 : null;
                }),
              },
              {
                name: '营收',
                type: 'bar',
                barMaxWidth: 28,
                barMinWidth: 8,
                barGap: '30%',
                barCategoryGap: '45%',
                itemStyle: {
                  color: '#2877FF',
                  borderRadius: 2,
                },
                // label: {
                //   show: true,
                //   position: 'top',
                // },
                data: trendList.map((el: any) => {
                  const income = el.income;
                  return income !== null && income !== undefined ? income / 100 : null;
                }),
              },
              {
                name: this.lineType === 'net_profit_rate' ? '净利润率' : '人均产值',
                type: 'line',
                smooth: true,
                showSymbol: false,
                yAxisIndex: this.lineType === 'net_profit_rate' ? 1 : 2,
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
                  if (this.lineType === 'net_profit_rate') return value;
                  return value !== null && value !== undefined ? value / 100 : null;
                }),
              },
            ]}
          ></dualAxisPlot>
          {trendList.length > 0 && (
            <div class="chart-filter">
              <div class="line-filter">
                <img class="line-icon" src={icon_legend_line} alt="" />
                <el-radio-group v-model={this.lineType}>
                  <el-radio label={'net_profit_rate'}>净利润率</el-radio>
                  <el-radio label={'avg_labor_profit'}>人均产值</el-radio>
                </el-radio-group>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
});
