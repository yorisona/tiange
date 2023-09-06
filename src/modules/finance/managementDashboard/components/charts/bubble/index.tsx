/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-06-06 17:34:13
 */
/** 气泡图 */
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
import { formatAmount } from '@/utils/string';
import { AxisUnit } from '../../../type';

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    series: {
      type: Array as PropType<{ data: [] }[]>,
      default: () => [{ data: [] }],
    },
    yUnit: {
      type: String as PropType<AxisUnit>,
      default: () => AxisUnit.yuan,
    },
    xUnit: {
      type: String as PropType<AxisUnit>,
      default: () => AxisUnit.yuan,
    },
  },
  components: {
    BaseEcharts,
    Empty,
  },
  setup(props, ctx) {
    const xUnit = computed(() => props.xUnit);
    const yUnit = computed(() => props.yUnit);
    const baseOptions = ref({
      tooltip: {
        trigger: 'item',
        // borderWidth: 0,
        formatter: (params: any) => {
          const { data } = params;
          const [xValue, yValue, gmv, title] = data;
          return `
          <div style="margin: 8px;">
            <div style="color: var(--text-color); font-weight: 400; line-height: 18px;">${
              title ? title : '--'
            }</div>
            <div style="margin-top: 18px;">
              <div style="font-size: 12px; line-height: 16px;">
                <span style="display: inline-block; font-weight: 400; color: #606974;">GMV：</span><span style="font-weight: 400; color: var(--text-color);">¥ ${formatAmount(
                  gmv,
                  'None',
                )}</span>
              </div>
              <div style="font-size: 12px; line-height: 16px; margin-top: 12px;">
                <span style="display: inline-block; font-weight: 400; color: #606974;">成本：</span><span style="font-weight: 400; color: var(--text-color);">¥ ${formatAmount(
                  xValue,
                  'None',
                )}</span>
              </div>
              <div style="font-size: 12px; line-height: 16px; margin-top: 12px;">
                <span style="display: inline-block; font-weight: 400; color: #606974;">利润：</span><span style="font-weight: 400; color: var(--text-color);">¥ ${formatAmount(
                  yValue,
                  'None',
                )}</span>
              </div>
            </div>
          </div>`;
        },
      },
      legend: {
        show: false,
        // data: props.xData ?? [],
        left: 'center',
        bottom: 10,
      },
      grid: {
        left: 72,
        right: 73,
        bottom: 69,
        top: 72,
        containLabel: false,
      },
      xAxis: {
        name: `成本 (${xUnit.value})\n`,
        splitLine: {
          lineStyle: {
            type: [6, 5],
            color: '#F2F2F2',
            cap: 'round',
            dashOffset: 6,
          },
        },
        nameTextStyle: {
          color: '#6A7B92',
          // padding: [0, 0, 30, 0],
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
          formatter(value: any) {
            if (xUnit.value === AxisUnit.wan) {
              if (value) {
                return parseInt(value, 10) / 10000;
              }
            }
            return value;
          },
        },
      },
      yAxis: {
        name: `利润 (${yUnit.value})`,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            type: [6, 5],
            color: '#F2F2F2',
            cap: 'round',
            dashOffset: 6,
          },
        },
        nameTextStyle: {
          padding: [0, 0, 16, 2],
        },
        scale: true,
        axisLabel: {
          formatter(value: any) {
            if (yUnit.value === AxisUnit.wan) {
              if (value) {
                return parseInt(value, 10) / 10000;
              }
            }
            return value;
          },
        },
      },
      series: props.series ?? [],
    });
    const methods = {
      reloadData() {
        baseOptions.value.yAxis.name = `利润 (${yUnit.value})`;
        baseOptions.value.xAxis.name = `成本 (${xUnit.value})\n`;
        baseOptions.value.series = props.series ?? [];
      },
    };
    onBeforeMount(() => {
      methods.reloadData();
    });
    watch([() => props.series], () => {
      methods.reloadData();
    });
    return {
      baseOptions,
      ...methods,
    };
  },
  render() {
    return (
      <div style="width: 100%;" v-loading={this.loading}>
        {(this.series?.length ?? 0) > 0 ? (
          <base-echarts options={this.baseOptions}></base-echarts>
        ) : (
          <empty />
        )}
      </div>
    );
  },
});
