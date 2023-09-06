/** 每日明细漏斗图 */
import { defineComponent, onBeforeMount, PropType, ref, watch } from '@vue/composition-api';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import Empty from '@/modules/datacenter/components/empty/index.vue';

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
      // tooltip: {
      //   trigger: 'item',
      //   // borderWidth: 0,
      //   formatter(params: any) {
      //     const data = params.data;
      //     const title = data.name;
      //     const totalAmount = params.treePathInfo?.[0]?.value;
      //     if (!title || !totalAmount) {
      //       return undefined;
      //     }
      //     const radio = new Decimal(data.value ?? 0)
      //       .mul(new Decimal(100))
      //       .div(new Decimal(totalAmount))
      //       .toFixed(2);
      //     const listItem = `
      //       <div style="font-size: 12px; line-height: 16px;">
      //         <span style="display: inline-block; font-weight: 400; color: #606974;">${
      //           item_name.value
      //         }：</span><span style="font-weight: 400; color: var(--text-color);">¥ ${formatAmount(
      //       data.value,
      //       'None',
      //     )}</span>
      //       </div>
      //       <div style="font-size: 12px; line-height: 16px; margin-top: 12px;">
      //         <span style="display: inline-block; font-weight: 400; color: #606974;">占比：</span><span style="font-weight: 400; color: var(--text-color);">${radio}%</span>
      //       </div>
      //       `;

      //     return `
      //       <div style="margin: 8px; text-align: left;">
      //         <div style="color: var(--text-color); font-weight: 400; line-height: 18px;">${
      //           title ? title : '--'
      //         }</div>
      //         <div style="margin-top: 18px;">
      //           ${listItem}
      //         </div>
      //       </div>
      //     `;
      //   },
      // },
      label: {
        fontSize: 10,
      },
      series: [
        {
          name: '漏斗图',
          type: 'funnel',
          left: 0,
          top: 0,
          bottom: 0,
          right: 0,
          width: '65%',
          min: 0,
          max: 100,
          sort: 'descending',
          funnelAlign: 'right',
          minSize: 245,
          maxSize: 360,
          //'ascending'，'descending'，'none'（表示按 data 顺序）
          gap: 8,
          legendHoverLink: false,
          labelLine: {
            //视觉引导线样式
            length: 30,
            lineStyle: {
              width: 2,
              type: 'solid',
            },
          },
          itemStyle: {
            borderColor: '#000',
            borderWidth: 1,
            borderRadius: 4,
            normal: {
              color: function (params: any) {
                //自定义颜色渐变
                const colorList = [
                  {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#007EFF', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#007EFF', // 100% 处的颜色
                      },
                    ],
                    global: false, // 缺省为 false
                  },
                  {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#2490FF', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#2490FF', // 100% 处的颜色
                      },
                    ],
                    global: false, // 缺省为 false
                  },
                  {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#00B0FB', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#00B0FB', // 100% 处的颜色
                      },
                    ],
                    global: false, // 缺省为 false
                  },
                  {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#29BDF3', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#29BDF3', // 100% 处的颜色
                      },
                    ],
                    global: false, // 缺省为 false
                  },
                  {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#3AD0EB', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#3AD0EB', // 100% 处的颜色
                      },
                    ],
                    global: false, // 缺省为 false
                  },
                ];
                return colorList[params.dataIndex];
              },
            },
          },
          emphasis: {
            label: {
              fontSize: 20,
            },
          },
          data: [],
        },
      ],
    });
    const methods = {
      reloadData() {
        //   const options = baseOptions.value;
        baseOptions.value.series[0].data = props.series.data.map((el: any) => {
          return {
            itemStyle: {
              height: 54,
            },
            ...el,
          };
        }) as never[];
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
    const selectClick = (param: any) => {
      ctx.emit('selectParamClick', param);
    };
    return {
      selectClick,
      baseOptions,
      ...methods,
    };
  },
  render() {
    return (
      <div style="width: 100%;" v-loading={this.loading}>
        {(this.series.data?.length ?? 0) > 0 ? (
          <base-echarts options={this.baseOptions} onSelectClick={this.selectClick}></base-echarts>
        ) : (
          <empty />
        )}
      </div>
    );
  },
});
