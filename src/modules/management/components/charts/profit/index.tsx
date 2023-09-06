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
import { getAmountFormatUnion, getTooltipIncreatRateDomStr, ratioFormat } from '../../../use';
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
    yUnits: {
      type: Array as PropType<AxisUnit[]>,
      default: () => [AxisUnit.yuan, AxisUnit.yuan],
    },
    showZoom: {
      type: Boolean,
      default: () => false,
    },
    trendList: {
      type: Array,
      default: () => [],
    },
    rightAxisType: {
      type: String as PropType<'ratio' | 'money'>,
      default: () => 'ratio',
    },
  },
  components: {
    BaseEcharts,
    Empty,
  },
  setup(props, ctx) {
    const units = computed(() => {
      return props.yUnits;
    });
    const computedShowZoom = computed(() => props.showZoom);
    const computedTrendList = computed(() => props.trendList);
    const tooltipMaps = [
      {
        key: 'net_profit',
        label: '净利润：',
        color: '#FFBD3B',
        type: 'money',
      },
      {
        key: 'income',
        label: '总营收：',
        color: '#2877FF',
        type: 'money',
      },
      {
        key: 'net_profit_rate',
        label: '净利润率：',
        color: '#FF7F00',
        type: 'rate',
      },
      {
        key: 'avg_labor_profit',
        label: '人均产值：',
        type: 'money',
      },
    ];
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
          const title = params[0].axisValue;
          let listItem = '';
          for (let i = 0; i < tooltipMaps.length; i++) {
            const tooltipEl = tooltipMaps[i];
            const trendItem = computedTrendList.value[params[0]?.dataIndex] as any;
            const element = {
              data: trendItem[tooltipEl.key],
              color: tooltipEl.color,
              seriesName: tooltipEl.label,
            };
            const item = `<span style="font-weight: 400; color: var(--text-color);">${
              tooltipEl.type === 'money'
                ? '<span style="font-weight: 600">' +
                  getAmountFormatUnion(element.data).amountStr +
                  '</span>' +
                  '<span>' +
                  (getAmountFormatUnion(element.data).unit || '') +
                  '</span>'
                : '<span style="font-weight: 600; margin-right: 6px">' +
                  ratioFormat(element.data) +
                  '</span>'
              // element.data === null || element.data === undefined
              // ? '--'
              // : '<span style="font-weight: 600; margin-right: 6px">' +
              //   element.data +
              //   '%' +
              //   '</span>'
            }</span>`;
            listItem += `
            <div style="font-size: 12px; line-height: 16px; margin-top: ${
              i > 0 ? '12px' : 0
            };display: flex; align-items: center;">
              <span style="background: ${
                element.color
              }; display: inline-block; width: 6px; height: 6px; border-radius: 4px;"></span><span style="display: inline-block; margin-left: 6px; font-weight: 400; color: #888888;">${
              element.seriesName
            }</span>${item}${
              i === 0 ? getTooltipIncreatRateDomStr(trendItem.net_profit_increase_rate) : ''
            }
            </div>
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
        show: true,
        // data: props.xData ?? [],
        right: 100,
        top: -4,
        itemGap: 20,
        itemWidth: 20,
        data: ['利润', '营收'],
      },
      grid: {
        left: 43,
        right: 60,
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
          name: `单位：${units.value[0]}`,
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
              if (units.value[0] === AxisUnit.wan) {
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
          show: props.rightAxisType === 'ratio' ? true : false,
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
        {
          type: 'value',
          name: `单位：${units.value[1]}`,
          show: props.rightAxisType === 'ratio' ? false : true,
          position: 'right',
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
            padding: [0, 0, 4, 0],
          },
          axisLabel: {
            formatter(value: any) {
              if (units.value[1] === AxisUnit.wan) {
                if (value) {
                  return parseInt(value, 10) / 10000;
                }
              }
              return value;
            },
          },
        },
        // { singleAxisIndex: 2 },
      ],
      series: props.series ?? [],
    });
    const methods = {
      reloadData() {
        const firstData = props.series[0]?.data || [];
        const originSource = firstData.map((el, elIdx) => {
          return [el, props.series[1]?.data[elIdx], props.series[2]?.data[elIdx]];
        });
        methods.getYAxisIndexSeries(props.series, originSource);
        baseOptions.value.yAxis[0].name = '单位：' + units.value[0];
        baseOptions.value.yAxis[2].name = '单位：' + units.value[1];
        baseOptions.value.series = props.series ?? [];
        baseOptions.value.xAxis.data = props.xData ?? [];
        // baseOptions.value.legend.data = props.xData ?? [];
      },
      // 刻度最大值
      yAxisMax(maxValue: any) {
        if (isNaN(maxValue / 1) || maxValue / 1 < 10) {
          return 10;
        }
        const max: any = Math.ceil(maxValue) + '';
        const itemValue: any = Math.ceil(max / 5) + '';
        const mins = Math.ceil(itemValue / Math.pow(10, itemValue.length - 1));
        const item: any = mins * Math.pow(10, itemValue.length - 1) + '';
        // item 需要是5的整数倍
        const res = Math.ceil(item / 5) * 5 * 5;
        return res;
      },
      // 获取y轴 数值，上部分割数，下部分割数
      getYAxisConfig(dataSource: any, serieIndexs = []) {
        // y轴数值
        const yData: any[] = [];
        dataSource.forEach((item: any, index: number) => {
          // if (index > 0) {
          // 第一行数据不取值
          serieIndexs.forEach(serie => {
            yData.push(item[serie] || 0);
          });
          // }
        });
        // 绝对值最大值
        const absMax = yData.reduce((num1, num2) => {
          return Math.abs(num1) > Math.abs(num2) ? Math.abs(num1) : Math.abs(num2);
        }, 0);
        // 间隔值：默认分割段数 5
        const interval = methods.yAxisMax(absMax) / 5;

        // 取最大值
        const max = Math.max(...yData);
        // 取最小值
        const min = Math.min(...yData);
        const topSplitNumber = max > 0 ? Math.ceil(max / interval) : 0;
        const downSplitNumber = min < 0 ? Math.ceil(Math.abs(min) / interval) : 0;
        return {
          interval: interval,
          yData: interval,
          topSplitNumber: topSplitNumber,
          downSplitNumber: downSplitNumber,
        };
      },

      // 获取各y轴对应的serie
      getYAxisIndexSeries(series: any, dataSource: any) {
        const yAxisIndexSeries: Object = {};
        series.forEach((item: any, index: number) => {
          if (!item.yAxisIndex) {
            // 默认y轴
            if (!Object.prototype.hasOwnProperty.call(yAxisIndexSeries, '0')) {
              (yAxisIndexSeries as any)['0'] = [index];
            } else {
              (yAxisIndexSeries as any)['0'].push(index);
            }
          } else if (item.yAxisIndex) {
            const key = item.yAxisIndex + '';
            if (!Object.prototype.hasOwnProperty.call(yAxisIndexSeries, key)) {
              (yAxisIndexSeries as any)[key] = [index];
            } else {
              (yAxisIndexSeries as any)[key].push(index);
            }
          }
        });

        if (Object.keys(yAxisIndexSeries).length > 1) {
          // 存在多条y轴
          methods.splitLineAlign(dataSource, yAxisIndexSeries);
          // yAxisIndexSeries = {
          //     0: [0, 1],
          //     1: [2]
          // }
        }
      },

      // 解决分割线不对齐
      splitLineAlign(dataSource: any, yAxisIndexSeries: any) {
        const applyObj: any = {};
        const topSplitNumbers = [];
        const downSplitNumbers = [];
        for (const key in yAxisIndexSeries) {
          applyObj[key] = methods.getYAxisConfig(dataSource, yAxisIndexSeries[key]);
          topSplitNumbers.push(applyObj[key].topSplitNumber);
          downSplitNumbers.push(applyObj[key].downSplitNumber);
        }
        const topSplitNumber = Math.max(...topSplitNumbers);
        const downSplitNumber = Math.max(...downSplitNumbers);

        for (const key in applyObj) {
          const tempYAxis = (baseOptions.value.yAxis as any)[key];
          if (tempYAxis) {
            tempYAxis['max'] = applyObj[key].interval * topSplitNumber;
            tempYAxis['min'] = applyObj[key].interval * downSplitNumber * -1; // x轴下部分 负数
            // tempYAxis['interval'] = applyObj[key].interval;
            tempYAxis['interval'] =
              topSplitNumber === 0 && downSplitNumber === 0 ? undefined : applyObj[key].interval;
          }
        }
      },
    };
    onBeforeMount(() => {
      methods.reloadData();
    });
    watch(
      [() => props.series, () => props.xData, () => props.yUnits],
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
          <empty chartHeight={200} style="padding-top:0" />
        )}
      </div>
    );
  },
});
