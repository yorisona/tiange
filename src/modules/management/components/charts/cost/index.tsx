/** 折线图 */
import {
  computed,
  defineComponent,
  onBeforeMount,
  PropType,
  ref,
  watch,
} from '@vue/composition-api';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import Empty from '@/modules/datacenter/components/empty/index.vue';
// import { formatAmount } from '@/utils/string';
import { AxisUnit } from '@/modules/finance/managementDashboard/type';
// import { AxisUnit } from '../../../type';
import {
  getAmountFormatUnion,
  getTooltipIncreatRateDomStr,
  ratioFormat,
  statusColor,
  statusStr,
  // statusColor,
  // statusStr,
} from '../../../use';

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    xData: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    series: {
      type: Array as PropType<{ data: [] }[]>,
      default: () => [{ data: [] }],
    },
    yUnit: {
      type: String as PropType<AxisUnit>,
      default: () => AxisUnit.yuan,
    },
    showZoom: {
      type: Boolean,
      default: () => false,
    },
    trendList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    BaseEcharts,
    Empty,
  },
  setup(props, ctx) {
    const computedShowZoom = computed(() => props.showZoom);
    const computedTrendList = computed(() => props.trendList);
    const tooltipMaps = [
      {
        key: 'cost',
        label: '总成本：',
        increaseRateKey: 'cost_increase_rate',
        color: undefined,
        type: 'money',
      },
    ];
    // const tooptipChartItemColor = (type: 0 | 1 | 2 | 3) => {
    //   switch (type) {
    //     case 0:
    //       return '#31CC33';
    //     case 1:
    //       return '#FFA33A';
    //     case 2:
    //       return '#9273F8';
    //     case 3:
    //       return '#F2859E';
    //   }
    // };
    // const topltipAmountDom = (amount: number) => {
    //   const union = getAmountFormatUnion(amount);
    //   return `<div style="color: var(--text-color)">
    //       <span style="font-weight: 600;">${union.amountStr}</span>${
    //     union.unit ? '<span>' + union.unit + '</span>' : ''
    //   }
    //     </div>`;
    // };
    // const chartItemDom = (rate: number, type: 0 | 1 | 2 | 3) => {
    //   let newRate = rate || 0;
    //   newRate = newRate < 0 ? 0 : newRate > 100 ? 100 : newRate;
    //   const color = tooptipChartItemColor(type);
    //   return `<div style="height: 20px; width: 100%; background: #F6F6F6; border-radius: 2px;">
    //     <div style="height: 20px; width: ${newRate}%; background: ${color}; border-radius: 2px;"></div>
    //   </div>`;
    // };
    // const tooitipRateDom = (rate?: number) => {
    //   const newValue = rate === null || rate === undefined ? '--' : rate + '%';
    //   return `<div>
    //       <span style="margin-right: 4px; color: var(--text-third-color)">占营收</span>
    //       <span style="color: var(--text-color); font-weight: 600;">${newValue}</span>
    //     </div>`;
    // };
    // const getUnit = (item: any) => {
    //   const income = item?.income;
    //   return income > 10000 ? AxisUnit.wan : AxisUnit.yuan;
    // };
    const unit = computed(() => {
      return props.yUnit;
    });
    // const tooltipCotnentFormatter = (params: any[]) => {
    // const firstParam = params[0];
    // const trendItem = computedTrendList.value[firstParam?.dataIndex] as any;
    // const listItem = `<div style=" font-size: 12px; margin-top: 12px">
    //   <div style="display: grid; grid-template-columns: 50px 196px 88px 102px auto; height: 180px; align-items: center;">
    //       <div style="display: grid; row-gap: 20px; grid-template-rows: repeat(4, 21px);">
    //         <div styl="color: #343F4C;">主播成本</div>
    //         <div styl="color: #343F4C;">投放成本</div>
    //         <div styl="color: #343F4C;">营销成本</div>
    //         <div styl="color: #343F4C;">人力成本</div>
    //       </div>
    //       <div style="margin-left: 16px; position: relative">
    //         <div style="display: grid; row-gap: 20px;">
    //           ${chartItemDom(trendItem.anchor_cost_percent, 0)}
    //           ${chartItemDom(trendItem.ad_cost_percent, 1)}
    //           ${chartItemDom(trendItem.promote_cost_percent, 2)}
    //           ${chartItemDom(trendItem.labor_cost_percent, 3)}
    //         </div>
    //         <div style="position: absolute; height: 180px; top: -20px; z-index: -1; left: 0; width: 1px; background: #F2F2F2;"></div>
    //         <div style="position: absolute; height: 180px; top: -20px; z-index: -1; left: 25%; border-left: 1px dashed #F2F2F2;"></div>
    //         <div style="position: absolute; height: 180px; top: -20px; z-index: -1; left: 50%; border-left: 1px dashed #F2F2F2;"></div>
    //         <div style="position: absolute; height: 180px; top: -20px; z-index: -1; left: 75%; border-left: 1px dashed #F2F2F2;"></div>
    //         <div style="position: absolute; height: 180px; top: -20px; z-index: -1; right: 0; border-left: 1px dashed #F2F2F2;"></div>
    //       </div>
    //       <div style="display: grid; row-gap: 20px; margin-left: 12px; grid-template-rows: repeat(4, 21px);">
    //         ${topltipAmountDom(trendItem.anchor_cost)}
    //         ${topltipAmountDom(trendItem.ad_cost)}
    //         ${topltipAmountDom(trendItem.promote_cost)}
    //         ${topltipAmountDom(trendItem.labor_cost)}
    //       </div>
    //       <div style="display: grid; row-gap: 20px; margin-left: 12px; grid-template-rows: repeat(4, 21px);">
    //         ${tooitipRateDom(trendItem.anchor_cost_percent)}
    //         ${tooitipRateDom(trendItem.ad_cost_percent)}
    //         ${tooitipRateDom(trendItem.promote_cost_percent)}
    //         ${tooitipRateDom(trendItem.labor_cost_percent)}
    //       </div>
    //       <div style="display: grid; row-gap: 20px; margin-left: 12px; grid-template-rows: repeat(4, 21px);">
    //         <div>${getTooltipIncreatRateDomStr(trendItem.anchor_cost_increase_rate)}</div>
    //         <div>${getTooltipIncreatRateDomStr(trendItem.ad_cost_increase_rate)}</div>
    //         <div>${getTooltipIncreatRateDomStr(trendItem.promote_cost_increase_rate)}</div>
    //         <div>${getTooltipIncreatRateDomStr(trendItem.labor_cost_increase_rate)}</div>
    //       </div>
    //     </div>
    //   </div>`;
    // return listItem;
    // };
    const baseOptions = ref({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
        formatter(params: any[]) {
          const firstParam = params[0];
          const title = firstParam?.axisValue;
          // const trendItem = computedTrendList.value[firstParam?.dataIndex] as any;
          // const listItem = tooltipCotnentFormatter(params);
          let listItem = '';
          const labelColor = '#888888';
          const valueColor = '#19232D';
          const incomeDetail = (originData: any) => {
            const item = (
              name: string,
              amount: number,
              rate: number,
              increase_rate: number,
              no_increase_rate?: boolean,
            ) => {
              return `<div style="display: flex;">
                  <div style="width: 144px">
                    <span style="color: ${labelColor}">${name}</span>
                    <span style="color: ${valueColor}">${
                getAmountFormatUnion(amount).amountUnitStr
              }</span>
                  </div>
                  <div style="margin-left: 8px; width: 92px">
                    <span style="color: ${labelColor}">占营收</span>
                    <span style="color: ${valueColor}">${
                ratioFormat(rate)
                // rate === null || rate === undefined ? '--' : rate + '%'
              }</span>
                  </div>
                  ${no_increase_rate ? '' : getTooltipIncreatRateDomStr(increase_rate)}
                </div>`;
            };
            return `<div style="display: flex; background: #F6F6F6; border-radius: 2px; padding: 6px 12px; font-size: 12px; margin-top: 8px;">
                <div>
                  ${item(
                    '主播成本：',
                    originData.anchor_cost,
                    originData.anchor_cost_percent,
                    originData.anchor_cost_increase_rate,
                  )}
                  ${item(
                    '投放成本：',
                    originData.ad_cost,
                    originData.ad_cost_percent,
                    originData.ad_cost_increase_rate,
                  )}
                  ${item(
                    '营销成本：',
                    originData.promote_cost,
                    originData.promote_cost_percent,
                    originData.promote_cost_increase_rate,
                    // true,
                  )}
                  ${item(
                    '人力成本：',
                    originData.labor_cost,
                    originData.labor_cost_percent,
                    originData.labor_cost_increase_rate,
                    // true,
                  )}
                  ${item(
                    '其他：',
                    originData.other_cost,
                    originData.other_cost_percent,
                    originData.other_cost_increase_rate,
                    // true,
                  )}
                </div>
              </div>`;
          };
          // const settlement_rate = (rate: number) => {
          //   // const value = rate === undefined || rate === null ? '--' : rate + '%';
          //   const value = ratioFormat(rate);
          //   return `<span style="margin-left: 12px; color: var(--text-third-color)">（结算率：<span style="color: var(--text-color); font-weight: 600">${value}</span>）</span>`;
          // };
          for (let i = 0; i < tooltipMaps.length; i++) {
            const tooltipEl = tooltipMaps[i];
            const trendItem = computedTrendList.value[params[0]?.dataIndex] as any;
            const element = {
              data: trendItem[tooltipEl.key],
              color: tooltipEl.color,
              seriesName: tooltipEl.label,
            };
            const item = `<span style="font-weight: 400; color: ${
              i === 2 ? statusColor(element.data) : 'var(--text-color);'
            }">${
              tooltipEl.type === 'money'
                ? '<span style="font-weight: 600">' +
                  getAmountFormatUnion(element.data).amountStr +
                  '</span>' +
                  '<span>' +
                  (getAmountFormatUnion(element.data).unit || '') +
                  '</span>'
                : '<span style="font-weight: 600; margin-right: 6px">' +
                  ratioFormat(element.data) +
                  '</span>' +
                  statusStr(element.data)
              // element.data === null || element.data === undefined
              // ? '--'
              // : '<span style="font-weight: 600; margin-right: 6px">' +
              //   element.data +
              //   '%' +
              //   '</span>' +
            }</span>`;
            listItem += `
              <div style="font-size: 12px; line-height: 16px; margin-top: ${
                i > 0 ? '12px' : 0
              };display: flex; align-items: center;">
                <span style="display: inline-block; font-weight: 400; color: ${labelColor};">${
              element.seriesName
            }</span>${item}${
              tooltipEl.increaseRateKey
                ? getTooltipIncreatRateDomStr(trendItem[tooltipEl.increaseRateKey])
                : ''
            }
              </div>
              ${i === 0 ? incomeDetail(trendItem) : ''}
              `;
          }
          return `
              <div style="margin: 8px;">
                <div style="color: var(--text-color); font-weight: 400; line-height: 18px;">${title}</div>
                <div style="margin-top: 12px;">
                  ${listItem}
                </div>
              </div>
            `;
        },
      },
      legend: {
        show: true,
        // data: props.xData ?? [],
        right: 51,
        top: -4,
        itemGap: 20,
        itemWidth: 20,
        // data: ['预算目标'],
      },
      grid: {
        left: 43,
        right: 54,
        bottom: 18,
        top: 32,
        containLabel: false,
      },
      dataZoom: [
        {
          show: computedShowZoom.value,
          realtime: true,
          start: 0,
          end: computedShowZoom.value ? 70 : 100,
          xAxisIndex: [0, 1],
          // singleAxisIndex: [0],
          minValueSpan: 8,
          // maxValueSpan: 12,
          // top: 'bottom',
          height: 14,
          bottom: 8,
          textStyle: {
            show: false,
            color: 'white',
          },
          showDataShadow: false,
        },
      ],
      // singleAxis: [
      //   {
      //     left: 43,
      //     right: 6,
      //     type: 'category',
      //     // boundaryGap: false,
      //     data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as any[],
      //     bottom: 33,
      //     height: 8,
      //     axisLabel: {
      //       color: 'var(--text-second-color)',
      //       fontSize: 11,
      //       show: false,
      //     },
      //     axisLine: {
      //       show: true,
      //       lineStyle: {
      //         type: [2, 2],
      //         dashOffset: -15,
      //         bottom: 10,
      //         color: 'rgba(52,63,76,0.30)',
      //         width: '1',
      //       },
      //     },
      //     axisPointer: {
      //       label: {
      //         show: false,
      //       },
      //     },
      //     axisTick: {
      //       show: false,
      //     },
      //   },
      // ],
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        data: props.xData ?? [],
        axisPointer: {
          type: 'shadow',
          label: {
            show: false,
          },
          shadowStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(0,156,255,0.02)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(0,156,255,0.15)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#F2F2F2',
          },
        },
        axisLabel: {
          color: '#6A7B92',
          margin: 6,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: `单位：${unit.value}`,
          position: 'left',
          splitLine: {
            //   show: false,
            lineStyle: {
              type: [6, 5],
              color: '#F2F2F2',
              cap: 'round',
              dashOffset: 6,
            },
          },
          alignTicks: true,
          axisLine: {
            show: false,
          },
          // axisLabel: {
          //   formatter: '{value} 元',
          // },
          nameTextStyle: {
            padding: [0, 28, 4, 0],
          },
          axisLabel: {
            formatter(value: any) {
              if (unit.value === AxisUnit.wan) {
                if (value) {
                  return parseInt(value, 10) / 10000;
                }
              }
              return value;
            },
          },
        },
        {
          type: 'value',
          position: 'right',
          alignTicks: true,
          splitLine: {
            lineStyle: {
              type: [6, 5],
              color: '#F2F2F2',
              cap: 'round',
              dashOffset: 6,
            },
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            formatter: '{value}%',
            // rotate: -45,
          },
        },
        // { singleAxisIndex: 2 },
      ],
      series: props.series ?? [],
    });
    const methods = {
      reloadData() {
        baseOptions.value.yAxis[0].name = '单位：' + unit.value;
        baseOptions.value.series = props.series ?? [];
        baseOptions.value.xAxis.data = props.xData ?? [];
        // baseOptions.value.legend.data = props.xData ?? [];
      },
    };
    onBeforeMount(() => {
      methods.reloadData();
    });
    watch(
      [() => props.series, () => props.xData, () => props.yUnit],
      () => {
        methods.reloadData();
      },
      {
        deep: true,
      },
    );
    return {
      baseOptions,
      ...methods,
    };
  },
  render() {
    return (
      <div style="width: 100%;" v-loading={this.loading}>
        {(this.xData?.length ?? 0) > 0 ? (
          <base-echarts options={this.baseOptions}></base-echarts>
        ) : (
          <empty chartHeight={200} />
        )}
      </div>
    );
  },
});
