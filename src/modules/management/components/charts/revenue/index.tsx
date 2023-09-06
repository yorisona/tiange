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
import {
  getAmountFormatUnion,
  getTooltipIncreatRateDomStr,
  ratioFormat,
  statusColor,
  statusStr,
} from '../../../use';
// import { AxisUnit } from '../../../type';

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
        key: 'income',
        label: '实际营收：',
        color: '#2877FF',
        type: 'money',
      },
      {
        key: 'goal_income',
        label: '预算目标：',
        color: '#51C84E',
        type: 'money',
      },
      {
        key: 'goal_income_complete_rate',
        label: '目标完成率：',
        color: '#FF7F00',
        type: 'rate',
      },
    ];
    const unit = computed(() => {
      return props.yUnit;
    });
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
          // console.log(params, computedTrendList);
          const title = params[0].axisValue;
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
                  <div style="margin-left: 8px; width: 68px">
                    <span style="color: ${labelColor}">占</span>
                    <span style="color: ${valueColor}">${
                ratioFormat(rate)
                // rate === null || rate === undefined ? '--' : rate + '%'
              }</span>
                  </div>
                  ${no_increase_rate ? '' : getTooltipIncreatRateDomStr(increase_rate)}
                </div>`;
            };
            return `<div style="display: flex; background: #F6F6F6; border-radius: 2px; padding: 6px 12px; font-size: 12px; margin-top: 8px; margin-left: 14px;">
                <div style="flex-shrink: 0; color: ${labelColor}">其中</div>
                <div style="margin-left: 8px;">
                  ${item(
                    '佣金：',
                    originData.commission_amount,
                    originData.commission_amount_percent,
                    originData.commission_amount_increase_rate,
                  )}
                  ${item(
                    '营销/商广：',
                    originData.promote_amount,
                    originData.promote_amount_percent,
                    originData.promote_amount_increase_rate,
                  )}
                  ${item(
                    '服务费：',
                    originData.service_amount,
                    originData.service_amount_percent,
                    originData.service_amount_increase_rate,
                    // true,
                  )}
                  ${item(
                    '其他：',
                    originData.other_income,
                    originData.other_income_percent,
                    originData.other_income_increase_rate,
                    // true,
                  )}
                </div>
              </div>`;
          };
          const settlement_rate = (rate: number) => {
            // const value = rate === undefined || rate === null ? '--' : rate + '%';
            const value = ratioFormat(rate);
            return `<span style="margin-left: 12px; color: var(--text-third-color)">（结算率：<span style="color: var(--text-color); font-weight: 600">${
              value || '--'
            }</span>）</span>`;
          };
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
                <span style="background: ${
                  element.color
                }; display: inline-block; width: 6px; height: 6px; border-radius: 4px;"></span><span style="display: inline-block; margin-left: 6px; font-weight: 400; color: ${labelColor};">${
              element.seriesName
            }</span>${item}${
              i === 0 ? getTooltipIncreatRateDomStr(trendItem.net_profit_increase_rate) : ''
            }
            ${i === 2 ? settlement_rate(trendItem.settled_rate) : ''}
              </div>
              ${i === 0 ? incomeDetail(trendItem) : ''}
              `;
          }

          return `
              <div style="margin: 8px;">
                <div style="color: var(--text-color); font-weight: 400; line-height: 18px;">${title}</div>
                <div style="margin-top: 18px;">
                  ${listItem}
                </div>
              </div>
            `;
        },
      },
      legend: {
        show: false,
        // data: props.xData ?? [],
        right: 71,
        top: 0,
        itemGap: 20,
        itemWidth: 20,
        // data: ['预算目标'],
      },
      grid: {
        left: 43,
        right: 44,
        bottom: computedShowZoom.value ? 46 : 18,
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
