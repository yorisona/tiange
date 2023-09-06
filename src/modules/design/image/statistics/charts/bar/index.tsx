import { defineComponent, onBeforeMount, PropType, ref, watch } from '@vue/composition-api';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import Empty from '@/modules/datacenter/components/empty/index.vue';
import { formatAmount } from '@/utils/string';
import { AxisUnit } from '@/modules/finance/managementDashboard/type';

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
      type: Array as PropType<{ data: []; balanceChange?: [] }[]>,
      default: () => [{ data: [] }],
    },
    yUnit: {
      type: String as PropType<AxisUnit>,
      default: () => AxisUnit.yuan,
    },
    yLabel: {
      type: String,
      default: '',
    },
  },
  components: {
    BaseEcharts,
    Empty,
  },
  setup(props, ctx) {
    /*const unit = computed(() => {
      return props.yUnit;
    });*/
    const baseOptions = ref({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: 'var(--text-des-color)',
          },
        },
        formatter(params: any[]) {
          // console.log(params);
          const title = params[0].axisValue;
          let listItem = '';
          // for (let i = 0; i < params.length + 1; i++) {
          const element = params[0];
          const item = `<span style="font-weight: 400; color: var(--text-color);">${formatAmount(
            element.data.value,
            'None',
            true,
          )} 单</span>`;
          listItem += `
              <div style="font-size: 12px; line-height: 16px;">
                <span style="background: ${element.color}; display: inline-block; width: 8px; height: 8px; border-radius: 4px;"></span><span style="display: inline-block; margin-left: 6px; font-weight: 400; color: #606974;">${props.yLabel}：</span>${item}
              </div>
              `;
          // }

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
        right: 9,
        top: 0,
        itemGap: 24,
        itemWidth: 12,
      },
      grid: {
        left: 63,
        right: 31,
        bottom: 28,
        top: 72,
        containLabel: false,
      },
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
          color: 'var(--text-second-color)',
        },
      },
      yAxis: [
        {
          type: 'value',
          name: props.yLabel || '',
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
            padding: [0, 28, 8, 0],
          },
          axisLabel: {
            formatter(value: any) {
              /*if (unit.value === AxisUnit.wan) {
                if (value) {
                  return parseInt(value, 10) / 10000;
                }
              }*/
              return value;
            },
          },
        },
      ],
      series: props.series ?? [],
    });
    const methods = {
      reloadData() {
        // baseOptions.value.yAxis[0].name = '单位：' + unit.value;
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
          <empty />
        )}
      </div>
    );
  },
});
