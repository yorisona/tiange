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
import { getAmountFormatUnion } from '@/modules/management/use';
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
    const unit = computed(() => {
      return props.yUnit;
    });
    const baseTextStyle = {
      color: '#5A5A5A',
      // borderWidth: 0.5,
      // borderColor: '#D8D8D8',
      // borderRadius: 3,
      interval: 0,
      padding: [4, 6],
      height: 10,
      width: 100,
      overflow: 'truncate',
      hideOverlap: false,
      backgroundColor: 'transparent',
    };
    const defaultLabelStyle = {
      ...baseTextStyle,
      // color: '#5A5A5A',
      // borderColor: '#D8D8D8',
      backgroundColor: 'transparent',
      color: '#2877ff',
      borderColor: '#4E8FFF',
    };
    // const hoverLabelStyle = {
    //   ...baseTextStyle,
    // color: '#2877ff',
    // borderColor: '#4E8FFF',
    //   backgroundColor: '#E9F1FF',
    // };
    // const computedShowZoom = computed(() => props.showZoom);
    // const computedTrendList = computed(() => props.trendList);
    // const tooltipMaps = [
    //   {
    //     key: 'net_profit',
    //     label: '净利润：',
    //     color: '#FFBD3B',
    //     type: 'money',
    //   },
    //   {
    //     key: 'income',
    //     label: '营收：',
    //     color: '#2877FF',
    //     type: 'money',
    //   },
    //   {
    //     key: 'net_profit_rate',
    //     label: '净利润率：',
    //     color: '#FF7F00',
    //     type: 'rate',
    //   },
    //   {
    //     key: 'avg_labor_profit',
    //     label: '人均产值：',
    //     type: 'money',
    //   },
    // ];
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
          for (let i = 0; i < params.length; i++) {
            const tooltipEl = params[i];
            // const trendItem = computedTrendList.value[params[0]?.dataIndex] as any;
            const element = {
              data: tooltipEl.value * 100,
              color: tooltipEl.color,
              seriesName: tooltipEl.seriesName,
            };
            const item = `<span style="font-weight: 400; color: var(--text-color);"><span style="font-weight: 600">${
              getAmountFormatUnion(element.data).amountStr
            }</span>${
              getAmountFormatUnion(element.data).unit ? getAmountFormatUnion(element.data).unit : ''
            }
            </span>`;
            listItem += `
            <div style="font-size: 12px; line-height: 16px; margin-top: ${
              i > 0 ? '12px' : 0
            };display: flex; align-items: center;">
              <span style="background: ${
                element.color
              }; display: inline-block; width: 6px; height: 6px; border-radius: 4px;"></span><span style="display: inline-block; margin-left: 6px; font-weight: 400; color: #888888;">${
              element.seriesName
            }：</span>${item}
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
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 0,
          end: 50,
          xAxisIndex: [0, 1],
          singleAxisIndex: [0],
          minValueSpan: 8,
          handleSize: 0,
          brushSelect: false,
          zoomLock: true,
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
      legend: {
        show: true,
        // data: props.xData ?? [],
        right: 10,
        top: -4,
        itemGap: 20,
        itemWidth: 20,
        // data: ['利润', '营收'],
      },
      grid: {
        left: 43,
        right: 12,
        bottom: 58,
        top: 38,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        triggerEvent: true,
        // boundaryGap: false,
        data:
          props.xData?.map((el: any) => {
            return { value: el, textStyle: { ...defaultLabelStyle } };
          }) ?? [],
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
        axisLabel: defaultLabelStyle,
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
            padding: [0, 28, 10, 0],
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
      ],
      series: props.series ?? [],
    });
    const methods = {
      reloadData() {
        baseOptions.value.yAxis[0].name = '单位：' + unit.value;
        baseOptions.value.series = props.series ?? [];
        baseOptions.value.xAxis.data =
          props.xData.map(el => ({
            value: el,
            textStyle: { ...defaultLabelStyle },
          })) ?? [];
      },
      // onMousemove: (_: any, params: any) => {
      //   const { componentType, value, dataIndex } = params || {};
      //   if (componentType === 'xAxis' && value) {
      //     const model = baseOptions.value.xAxis.data[dataIndex];
      //     model.textStyle = hoverLabelStyle;
      //   }
      // },
      // onMouseout: (_: any, params: any) => {
      //   const { componentType, value, dataIndex } = params || {};
      //   if (componentType === 'xAxis' && value) {
      //     const model = baseOptions.value.xAxis.data[dataIndex];
      //     model.textStyle = defaultLabelStyle;
      //   }
      // },
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
    const onSelectClick = (params: any) => {
      const { componentType } = params || {};
      if (componentType === 'xAxis') {
        ctx.emit('selectClick', params);
      }
    };
    return {
      onSelectClick,
      baseOptions,
      ...methods,
    };
  },
  render() {
    return (
      <div style="width: 100%;" v-loading={this.loading}>
        {(this.xData?.length ?? 0) > 0 ? (
          <base-echarts
            options={this.baseOptions}
            onSelectClick={this.onSelectClick}
            // on-mousemove={this.onMousemove}
            // on-mouseout={this.onMouseout}
          ></base-echarts>
        ) : (
          <empty chartHeight={200} />
        )}
      </div>
    );
  },
});
