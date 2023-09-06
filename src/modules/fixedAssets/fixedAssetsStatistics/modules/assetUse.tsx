/*
 * @Author       : yunie
 * @Date         : 2022-07-21 15:09:02
 * @LastEditTime : 2022-07-25 13:08:43
 * @FilePath     : \src\modules\datacenter\shoplive\tabs\projectDetail\LineEcharts.tsx
 * @Description  :
 */
/** 折线图 */
import { defineComponent, onBeforeMount, PropType, ref, watch } from '@vue/composition-api';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import Empty from '@/modules/legal/contract/charts/Empty.vue';
import { numberFormat } from '@/utils/formatMoney';
// import { formatAmount } from '@/utils/string';
// import Vue from 'vue';
// import moment from 'moment';

// const VisualToDom = (dom: any) => {
//   return new Vue({
//     el: document.createElement('div'),
//     render: () => dom,
//   }).$el;
// };
export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array as PropType<{ key: string; value: number }[]>,
      default: () => [],
    },
    id: {
      type: Number,
      default: 1,
    },
    subTitle: {
      type: String,
      default: '总数量',
    },
  },
  components: {
    BaseEcharts,
    Empty,
  },
  setup: (props, ctx) => {
    const baseOptions = ref<any>({
      color: ['#2877ff', '#FFBF00'],
      tooltip: {
        trigger: 'item',
        textStyle: {
          color: 'var(--text-color)',
          fontSize: 14,
        },
        formatter: (params: any) => {
          const color = params.color; // 获取当前扇形区域的颜色
          const value = params.value;
          const percent = params.percent;

          // 使用 CSS 添加颜色圆球，并根据需要调整圆球的样式和大小
          const circle =
            '<span style="display:inline-block;margin-right:5px;width:10px;height:10px;border-radius:50%;background-color:' +
            color +
            '"></span>';

          // 第一行显示 "颜色 资产名称: **"
          const firstLine =
            '<div style="display:flex; align-items: baseline;color:#888888;font-size:12px;margin-top:6px;">' +
            circle +
            `<span>闲置数量: ` +
            `<span style="color:#19232D;">${value}</span>` +
            '</div>';

          // 第二行显示 "占比: **%"
          const secondLine =
            '<span style="margin-left:15px;color:#888888;font-size:12px;">占比: ' +
            `<span style="color:#19232D;font-size:12px;">${percent}</span>` +
            '</span>' +
            `%`;
          return firstLine + secondLine;
        },
        // confine: true,
        // position: ['50%', '50%'],
        position: function (pos: any, __: any, dom: any, _: any, size: any) {
          const chart = document.getElementById(`trendChart${props.id}`);
          const innerHeight = window.innerHeight;
          const offsetTop = chart!.getBoundingClientRect().top;

          const viewWidth = size.viewSize[0];
          const domWidth = dom.clientWidth;
          // const padding = 73;

          const domH = offsetTop + pos[1] + dom.clientHeight;
          const distance = innerHeight - domH;
          const offsetY = distance < 0 ? distance - 24 : 0;

          if (viewWidth / 2 >= pos[0]) {
            //其中point为当前鼠标的位置,在左侧
            // return [viewWidth - domWidth - padding, -offsetTop];
            return [pos[0] + 60, pos[1] + offsetY];
          } else {
            //其中point为当前鼠标的位置
            // return [padding, -offsetTop];
            return [pos[0] - domWidth - 60, pos[1] + offsetY];
          }
        },
        // valueFormatter: value => '$' + value.toFixed(2),
      },
      legend: {
        orient: 'vertical',
        top: '20%',
        right: '10%',
        show: true,
      },
      title: {
        text: props.subTitle,
        subtext: '1000',
        subtextStyle: {
          color: '#19232D',
          fontSize: 26,
          fontWeight: 600,
        },
        left: 'center',
        top: '42%',
        textStyle: {
          color: '#19232D',
          fontWeight: '400',
          fontSize: '18px',
        },
      },
      series: [
        {
          // name: '平日甜食占比',
          type: 'pie',
          radius: ['55%', '80%'],
          avoidLabelOverlap: false,
          itemStyle: {
            normal: {
              label: {
                show: false,
              },
              labelLine: {
                show: false,
              },
              borderWidth: 2, // 扇区边框宽度为2px
              borderColor: '#fff', // 扇区边框颜色为白色
              // shadowBlur: 40,
              // shadowColor: "rgba(40, 40, 40,0.5)",
            },
          },
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: false,
              formatter: function (param: any) {
                // return param.percent.toFixed(0) + '%';
                return param.name;
              },
              textStyle: {
                fontSize: '14',
                // fontWeight: 'bold',
                areaColor: 'var(--text-color)',
              },
            },
          },
          labelLine: {
            normal: {
              show: true,
            },
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' },
          ],
        },
      ],
    });
    const methods = {
      reloadData() {
        // 总数量
        const total = props.data?.reduce((a, b) => a + b.value, 0) ?? 0;
        if (props.subTitle === '总数量') {
          baseOptions.value.series[0].data =
            props.data?.map(v => ({
              value: v.value,
              name: v.key,
            })) ?? [];
          baseOptions.value.title.subtext = total;
        } else {
          baseOptions.value.series[0].data =
            props.data?.map(v => ({
              value: v.value / 100,
              name: v.key,
            })) ?? [];
          baseOptions.value.title.subtext = numberFormat(total / 100, 0);
        }

        // title
        baseOptions.value.title.text = props.subTitle;
      },
    };
    onBeforeMount(() => {
      methods.reloadData();
    });
    watch([() => props.data, () => props.subTitle], () => {
      methods.reloadData();
    });
    return {
      baseOptions,
      ...methods,
    };
  },
  render() {
    return (
      <div style="width: 100%;height:100%;" v-loading={this.loading}>
        {this.baseOptions?.series[0]?.data?.length > 0 ? (
          <base-echarts id={`trendChart${this.id}`} options={this.baseOptions}></base-echarts>
        ) : (
          <empty></empty>
        )}
      </div>
    );
  },
});
