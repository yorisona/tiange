/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-06-02 16:32:09
 */
/** 旭日图 */
import { defineComponent, onBeforeMount, PropType, ref, watch } from '@vue/composition-api';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import Empty from '@/modules/datacenter/components/empty/index.vue';
import { formatAmount } from '@/utils/string';

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    series: {
      type: Object as PropType<{ data: [] }>,
      default: () => {},
    },
    popoverTitle: {
      type: String,
      default: '',
    },
    legend: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    BaseEcharts,
    Empty,
  },
  setup(props, ctx) {
    const baseOptions = ref({
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: 'var(--text-des-color)',
          },
        },
        formatter(params: any) {
          // console.log(params);
          const element = params;
          const title = element.name;
          return `
              <div style="margin: 8px;">
                <div style="color: var(--text-color); font-weight: 400; line-height: 18px;">${
                  props.popoverTitle
                }</div>
                <div style="margin-top: 18px;">
                <div style="font-size: 12px; line-height: 16px; margin-top: 0;">
                    <span style="background: ${
                      element.color
                    }; display: inline-block; width: 8px; height: 8px; border-radius: 4px;"></span><span style="display: inline-block; margin-left: 6px; font-weight: 400; color: #606974;">${title}：</span><span style="font-weight: 400; color: var(--text-color);">${formatAmount(
            element.value,
            'None',
            true,
          )} 单</span>
                  </div>
                </div>
              </div>
            `;
        },
      },
      label: {
        fontSize: 12,
      },
      legend: {
        show: props.legend,
        // left: 'right',
        type: 'scroll',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 16,
        padding: 0,
        right: 0,
        top: 40,
        bottom: 50,
        icon: 'rect',
        fontSize: 12,
        orient: 'vertical',
        itemStyle: {
          borderWidth: 0,
          lineHeight: 16,
        },
      },
      series: {
        title: '1122',
        type: 'pie',
        center: props.legend ? ['44%', '50%'] : ['50%', '50%'],
        radius: ['45.13%', '73.51%'],
        itemStyle: {
          // borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: !props.legend
          ? {}
          : {
              position: 'center',
              formatter: () => {
                return '日常开播妆';
              },
            },
        inactiveBorderColor: 'white',
        data: [],
      },
    });
    const methods = {
      reloadData() {
        const options = baseOptions.value;
        baseOptions.value.series = { ...options.series, ...props.series };
      },
    };
    onBeforeMount(() => {
      methods.reloadData();
    });
    watch(
      () => props.series,
      () => {
        methods.reloadData();
      },
    );
    return {
      baseOptions,
      ...methods,
    };
  },
  render() {
    return (
      <div v-loading={this.loading}>
        {(this.series.data?.length ?? 0) > 0 ? (
          <base-echarts
            style={{
              display: 'flex',
              justifyContent: 'center',
              height: '360px',
              width: this.legend ? '670px' : '100%',
            }}
            options={this.baseOptions}
          ></base-echarts>
        ) : (
          <empty />
        )}
      </div>
    );
  },
});
