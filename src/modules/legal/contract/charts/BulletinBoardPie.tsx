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
// import { formatAmount } from '@/utils/string';
// import moment from 'moment';

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    // tipFormatter: {
    //   type: Function as PropType<(item: any) => string>,
    //   default: (params: any) => {
    //     let res = '';
    //     // const title = moment(params[0].axisValue).format('MM月DD日');
    //     res = `<div style="color:var(--text-color);font-size:14px;font-weight:400;text-align: left;line-height: 30px;margin-bottom: 12px">${params[0].axisValue}</div>`;
    //     let seriesName, color, data, result;
    //     for (let i = 0; i < params.length; i++) {
    //       color = params[i].color;
    //       seriesName = params[i].seriesName;
    //       data = params[i].data;
    //       result = i === 0 ? formatAmount(Number(data / 10000 || 0), '¥ ') : Number(data || 0);
    //       res +=
    //         '<div style="display: flex;margin-bottom: 10px;height: 20px;line-height: 20px;font-size: 12px;color:#606974;font-weight: 400;">' +
    //         '<div style="margin:5px;border-radius: 5px;height: 10px;width: 10px;background:' +
    //         color +
    //         '"></div>' +
    //         seriesName +
    //         '：' +
    //         '<div style="color: var(--text-color);font-weight: 400;"> ' +
    //         result +
    //         ' </div>' +
    //         '</div>';
    //     }
    //     return res;
    //   },
    // },
    data: {
      type: Array as PropType<{ name: ''; value: '' }[]>,
      default: () => [],
    },
    id: {
      type: Number,
      default: 1,
    },
    // yUnit: {
    //   type: String as PropType<AxisUnit>,
    //   default: () => AxisUnit.yuan,
    // },
  },
  components: {
    BaseEcharts,
    Empty,
  },
  setup(props, ctx) {
    const baseOptions = ref<any>({
      color: ['#1E8DFF', '#FFBF00', '#10C0D3', '#FF8000'],
      title: {
        show: false,
        // text: '平日甜食占比',
        // x: 'center',
        // top: '92%',
        // textStyle: {
        //   color: '#6c6c6c',
        // },
      },
      tooltip: {
        trigger: 'item',
        textStyle: {
          color: 'var(--text-color)',
          fontSize: 14,
        },
        formatter: '{b}: {c} ({d}%)',
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
        x: 0,
        top: 0,
        data: ['蛋糕', '冷饮', '甜筒', '糖果'],
        show: false,
      },
      series: [
        {
          // name: '平日甜食占比',
          type: 'pie',
          radius: ['63%', '93%'],
          avoidLabelOverlap: false,
          itemStyle: {
            normal: {
              label: {
                show: false,
              },
              labelLine: {
                show: false,
              },
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
              show: true,
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
          data: [],
        },
      ],
    });
    const methods = {
      reloadData() {
        // baseOptions.value.legend.data = props.xData ?? [];
        baseOptions.value.series[0].data = props.data ?? [];
      },
    };
    onBeforeMount(() => {
      methods.reloadData();
    });
    watch([() => props.data], () => {
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
