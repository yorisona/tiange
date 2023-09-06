import { computed, defineComponent } from '@vue/composition-api';
import {
  statusColor,
  getIncreaseColor,
  statusStr,
  getStatusImg,
  chartItemColor,
  getAmountFormatUnion,
  ratioFormat,
} from '@/modules/management/use';
import dualAxisPlot from '@/modules/management/components/charts/gmv/index.vue';
import { AxisUnit } from '@/modules/finance/managementDashboard/type';
import moment from 'moment';

export default defineComponent({
  components: {
    dualAxisPlot,
  },
  props: {
    gmvData: {
      type: Object,
    },
    showZoom: {
      type: Boolean,
      default: () => false,
    },
  },
  setup: (props, ctx) => {
    const computedGMVData = computed(() => props.gmvData);
    const computedShowZoom = computed(() => props.showZoom);
    const methods = {
      statusColor,
      getAmountFormatUnion,
      getStatusImg,
      getIncreaseColor,
      chartItemColor,
      statusStr,
    };

    const yUnit = computed(() => {
      const findItem = computedGMVData.value?.trend?.find((el: any) => {
        const gmv = Math.abs(el.gmv ?? 0) / 100;
        const goal_gmv = Math.abs(el.goal_gmv ?? 0) / 100;
        return gmv > 10000 || goal_gmv > 10000;
      });
      return findItem ? AxisUnit.wan : AxisUnit.yuan;
    });
    // console.log({
    //   data: props.gmvData,
    // });
    return {
      yUnit,
      computedGMVData,
      computedShowZoom,
      ...methods,
    };
  },
  render() {
    const { trend } = this.computedGMVData as any;
    const trendList = trend || [];
    return (
      <div class="tg-gmv-container">
        <div class="chart-field">
          <dualAxisPlot
            key={trendList}
            showZoom={this.computedShowZoom}
            showSingleAxis={false}
            trendList={trendList}
            class="dashboard-chart border"
            yUnit={this.yUnit}
            style="height: 229px;"
            loading={this.profitRatioLoading}
            xData={trendList
              .filter((el: any) => el.date)
              .map((item: any) => moment(item.date + '').format('DD日'))}
            series={[
              {
                name: '完成GMV',
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
                  show: true,
                  position: 'top',
                  formatter: (params: any) => {
                    const { dataIndex } = params;
                    const goal_gmv_complete_rate = trendList[dataIndex]?.goal_gmv_complete_rate;
                    return ratioFormat(goal_gmv_complete_rate, {
                      empty: '',
                    });
                  },
                },
                data: trendList.map((el: any) => {
                  let value = el.gmv;
                  value = value !== null && value !== undefined ? value / 100 : null;
                  const goal_gmv_complete_rate = el.goal_gmv_complete_rate || 0;
                  return {
                    value,
                    itemStyle: {
                      color: this.chartItemColor(goal_gmv_complete_rate),
                    },
                    label: {
                      color: this.statusColor(goal_gmv_complete_rate),
                    },
                  };
                }),
              },
              {
                name: '预算目标',
                type: 'line',
                // smooth: true,
                showSymbol: false,
                // yAxisIndex: 1,
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
                  const value = el.goal_gmv;
                  return value !== null && value !== undefined ? value / 100 : null;
                }),
              },
            ]}
          ></dualAxisPlot>
          {trendList.length > 0 && (
            <div class="chart-tips">
              {E.management.BudgetProcessOption.map(el => (
                <div class={`budget-tag budget-tag-${el.value}`}>{el.label}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
});
