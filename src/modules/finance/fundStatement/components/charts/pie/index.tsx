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
          // let listItem = '';
          // for (let i = 0; i < params.length + 1; i++) {
          //   const element = params[i] ?? {
          //     data: props.series[0].balanceChange?.[params[0]?.dataIndex],
          //     color: '#ffffff',
          //     seriesName: '变动',
          //   };
          //   const item = `<span style="font-weight: 400; color: var(--text-color);">¥ ${formatAmount(
          //     element.data,
          //     'None',
          //   )}</span>`;
          //   listItem += `
          //     <div style="font-size: 12px; line-height: 16px; margin-top: ${i > 0 ? '12px' : 0};">
          //       <span style="background: ${
          //         element.color
          //       }; display: inline-block; width: 8px; height: 8px; border-radius: 4px;"></span><span style="display: inline-block; margin-left: 6px; font-weight: 400; color: #606974;">${
          //     element.seriesName
          //   }：</span>${item}
          //     </div>
          //     `;
          // }
          return `
              <div style="margin: 8px;">
                <div style="color: var(--text-color); font-weight: 400; line-height: 18px;">可用余额</div>
                <div style="margin-top: 18px;">
                <div style="font-size: 12px; line-height: 16px; margin-top: 0;">
                    <span style="background: ${
                      element.color
                    }; display: inline-block; width: 8px; height: 8px; border-radius: 4px;"></span><span style="display: inline-block; margin-left: 6px; font-weight: 400; color: #606974;">${title}：</span><span style="font-weight: 400; color: var(--text-color);">¥ ${formatAmount(
            element.value,
            'None',
          )}</span>
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
        bottom: '0',
        left: 'center',
        type: 'scroll',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 18,
        icon: 'circle',
        itemStyle: {
          borderWidth: 0,
        },
      },
      series: {
        type: 'pie',
        center: ['50%', 130],
        radius: ['41.82%', '65.36%'],
        itemStyle: {
          // borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
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
      <div style="width: 100%;" v-loading={this.loading}>
        {(this.series.data?.length ?? 0) > 0 ? (
          <base-echarts
            style="display: flex; justify-content: center;"
            options={this.baseOptions}
          ></base-echarts>
        ) : (
          <empty />
        )}
      </div>
    );
  },
});
