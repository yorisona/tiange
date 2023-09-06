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
// import emptyCommon from '@/components/empty/emptyCommon.vue';
import emptyImg from '@/assets/images/icon-empty.png';
// import Vue from 'vue';
// const EmptyCommon = Vue.extend(emptyCommon);

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
    showSingleAxis: {
      type: Boolean,
      default: () => true,
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
    const computedShowZoom = computed<boolean>(() => props.showZoom);
    const computedTrendList = computed(() => props.trendList);
    const computedShowSingleAxis = computed(() => props.showSingleAxis);
    const unit = computed(() => {
      return props.yUnit;
    });
    const tooltipMaps = [
      {
        key: 'gmv',
        label: 'GMV：',
        color: '#2877FF',
        type: 'money',
      },
      {
        key: 'goal_gmv',
        label: '预算：',
        color: '#FF7F00',
        type: 'money',
      },
      {
        key: 'goal_gmv_complete_rate',
        label: '进度：',
        type: 'rate',
      },
    ];
    const formatTooltip = (params: any[], type: 'main' | 'single') => {
      // console.log(params, computedTrendList);
      const firstParam = params[0];
      const title = firstParam?.name;
      let listItem = '';
      const trendItem = computedTrendList.value[firstParam?.dataIndex] as any;
      const isSingle = firstParam.axisDim === 'single' || type === 'single';
      if (isSingle) {
        // 单轴线
        // const emptyInstance = new EmptyCommon();
        // emptyInstance.detailText();
        // emptyInstance.$mount();
        const live_comments = trendItem?.live_comments || [];
        const sub_list_item =
          live_comments.length !== 0
            ? live_comments
                .map((el: any, idx: number) => {
                  return `<div style="width: 100%; font-size: 12px; padding: 0 18px 0;">
                  <div style="color: var(--text-third-color); line-height: 18px;">
                    <span>${
                      el.gmt_modified?.replace(/-/g, '.') || '--'
                    }</span><span style="margin-left: 12px">${el.flower_name || '--'}</span>
                  </div>
                  <div style="white-space: normal; color: var(--text-color); margin-top: 4px; word-break: break-all; line-height: 16px;">${
                    el.comment || '--'
                  }</div>
                  ${
                    idx === live_comments.length - 1
                      ? '<div style="padding-bottom: 6px"></div>'
                      : '<div style="border-bottom: 1px dashed #D8D8D8; margin: 12px 0"></div>'
                  }
                </div>`;
                })
                .join('')
            : `<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; padding-bottom: 12px;">
                    <img
                      src=${emptyImg}
                      style="width: 118px; height: 64px; margin-bottom: 4px"
                    />
                    <div style="color: #c1c1c1; font-size: 12px;">暂无批注</div>
                </div>`;
        listItem = `<div style="width: 286px; max-height: 366px; overflow-y: overlay; margin: 0 -18px;">${sub_list_item}</div>`;
      } else {
        // 费双周线
        for (let i = 0; i < tooltipMaps.length; i++) {
          const tooltipEl = tooltipMaps[i];
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
                // element.data === null || element.data === undefined
                // ? '--'
                // : '<span style="font-weight: 600; margin-right: 6px">' +
                //   element.data +
                //   '%' +
                //   '</span>'
                statusStr(element.data)
          }</span>`;
          listItem += `
              <div style="font-size: 12px; line-height: 16px; margin-top: ${
                i > 0 ? '12px' : 0
              };display: flex; align-items: center;">
                <span style="background: ${
                  element.color
                }; display: inline-block; width: 6px; height: 6px; border-radius: 4px;"></span><span style="display: inline-block; margin-left: 6px; font-weight: 400; color: #888888;">${
            element.seriesName
          }</span>${item}${i === 0 ? getTooltipIncreatRateDomStr(trendItem.gmv_increase_rate) : ''}
              </div>
              `;
        }
      }

      return `
              <div style="margin: 8px;">
                <div style="color: var(--text-color); font-weight: 400; line-height: 18px;">${title}</div>
                <div style="margin-top: ${isSingle ? '16px' : '10px'};">
                  ${listItem}
                </div>
              </div>
            `;
    };
    const baseOptions = ref({
      tooltip: {
        trigger: 'axis',
        // enterable: true,
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
        formatter(params: any[]) {
          return formatTooltip(params, 'main');
        },
      },
      legend: {
        show: true,
        // data: props.xData ?? [],
        right: 71,
        top: -2,
        itemGap: 20,
        itemWidth: 20,
        data: ['实际GMV', '预算目标'],
        textStyle: {
          fontSize: 12,
        },
      },
      grid: {
        left: 52,
        right: 6,
        bottom:
          computedShowZoom.value && computedShowSingleAxis.value
            ? 62
            : computedShowZoom.value
            ? 46
            : computedShowSingleAxis.value
            ? 46
            : 18,
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
          singleAxisIndex: [0],
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
      singleAxis: computedShowSingleAxis.value
        ? [
            {
              left: 43,
              right: 6,
              type: 'category',
              name: '场记',

              nameLocation: 'start',
              // boundaryGap: false,
              data: props.xData || [],
              bottom: computedShowZoom.value ? 36 : 20,
              height: 8,
              axisLabel: {
                color: 'var(--text-second-color)',
                fontSize: 11,
                show: false,
              },
              axisLine: {
                show: true,
                lineStyle: {
                  type: [2, 2],
                  dashOffset: -15,
                  bottom: 10,
                  color: 'rgba(52,63,76,0.30)',
                  width: '1',
                },
              },
              axisPointer: {
                show: false,
                label: {
                  show: false,
                },
              },
              axisTick: {
                show: false,
              },
              nameTextStyle: {
                color: 'var(--text-second-color)',
                fontSize: 12,
              },
              nameGap: 10,
              tooltip: {
                trigger: 'item',
                enterable: true,
                borderWidth: 0,
                // axisPointer: {
                //   type: 'cross',
                //   crossStyle: {
                //     color: '#999',
                //   },
                // },
                formatter(params: any) {
                  const componentType = params.componentType;
                  if (componentType === 'singleAxis') return;
                  return formatTooltip([params], 'single');
                },
              },
            },
          ]
        : undefined,
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
          // alignTicks: true,
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
        { singleAxisIndex: 2 },
      ],
      series: props.series ?? [],
    });
    const methods = {
      reloadData() {
        baseOptions.value.yAxis[0].name = '单位：' + unit.value;
        baseOptions.value.series = props.series ?? [];
        baseOptions.value.xAxis.data = props.xData ?? [];
        if (baseOptions.value.singleAxis) {
          baseOptions.value.singleAxis[0].data = props.xData ?? [];
        }
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
