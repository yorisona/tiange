/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-06-06 14:54:25
 */
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
import { formatAmount } from '@/utils/string';
import { AxisUnit } from '../../../type';

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
  },
  components: {
    BaseEcharts,
    Empty,
  },
  setup(props, ctx) {
    const unit = computed(() => props.yUnit);
    const baseOptions = ref({
      tooltip: {
        trigger: 'axis',
        formatter(params: any[]) {
          const title = params[0].axisValue;
          let listItem = '';
          for (let i = 0; i < params.length; i++) {
            const element = params[i];
            const currentItem = `
            <div style="font-size: 12px; line-height: 16px; margin-top: ${i !== 0 ? '12px' : 0};">
              <span style="background: ${
                element.color
              }; display: inline-block; width: 8px; height: 8px; border-radius: 4px;"></span><span style="display: inline-block; margin-left: 6px; font-weight: 400; color: #606974;">${
              element.seriesName
            }：</span><span style="font-weight: 400; color: var(--text-color);">¥ ${formatAmount(
              element.data,
              'None',
            )}</span>
            </div>
            `;
            // if (i === params.length - 1) {
            //   listItem = currentItem + listItem;
            // } else {
            listItem += currentItem;
            // }
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
        right: '0',
        top: '0',
        type: 'scroll',
        width: '500px',
        itemGap: 20,
        itemWidth: 20,
      },
      grid: {
        top: 40,
        right: 14,
        bottom: 45,
        left: 81,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: props.xData ?? [],
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
        },
      },
      yAxis: {
        type: 'value',
        name: `单位：${unit.value}`,
        splitLine: {
          //   show: false,
          lineStyle: {
            type: [6, 5],
            color: '#F2F2F2',
            cap: 'round',
            dashOffset: 6,
          },
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
        nameTextStyle: {
          padding: [0, 28, 8, 0],
        },
      },
      series: props.series ?? [],
    });
    const methods = {
      reloadData() {
        baseOptions.value.yAxis.name = `单位：${unit.value}`;
        baseOptions.value.xAxis.data = props.xData ?? [];
        baseOptions.value.series = props.series ?? [];

        // baseOptions.value.legend.data = props.xData ?? [];
      },
    };
    onBeforeMount(() => {
      methods.reloadData();
    });
    watch([() => props.series, () => props.xData], () => {
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
        {(this.xData?.length ?? 0) > 0 ? (
          <base-echarts options={this.baseOptions}></base-echarts>
        ) : (
          <empty />
        )}
      </div>
    );
  },
});
