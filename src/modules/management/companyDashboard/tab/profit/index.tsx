import { computed, defineComponent, ref } from '@vue/composition-api';
import { statusColor, getIncreaseColor, getIncreateRateNode } from '@/modules/management/use';
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
      getIncreaseColor,
      getAmountFormatUnion,
      getIncreateRateNode,
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
    const { trend } = this.computedProfitData as any;
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
        <div class="chart-title">利润走势</div>
        <div class="chart-field">
          <dualAxisPlot
            showZoom={false}
            key={trendList + this.lineType}
            trendList={trendList}
            class="dashboard-chart border"
            yUnits={this.yUnits}
            rightAxisType={this.lineType === 'net_profit_rate' ? 'ratio' : 'money'}
            style="height: 329px;"
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
