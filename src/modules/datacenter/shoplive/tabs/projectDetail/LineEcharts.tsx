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
import Empty from '@/modules/datacenter/components/empty/index.vue';
import { formatAmount } from '@/utils/string';
// import moment from 'moment';

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
      default: 1,
    },
    xData: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    yData: {
      type: Array as PropType<any[]>,
      default: () => [
        {
          type: 'value',
          name: '观看转化率',
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
          axisPointer: {
            show: false,
          },
          alignTicks: true,
          axisLine: {
            show: false,
          },
          // axisLabel: {
          //   formatter: '{value} 元',
          // },
          nameTextStyle: {
            padding: [0, 12, 12, 6],
            color: '#343F4C',
            fontWeight: '400',
          },
          axisLabel: {
            formatter: (value: any) => {
              return value + '%';
            },
          },
        },
      ],
    },
    tipFormatter: {
      type: Function as PropType<(item: any) => string>,
      default: (params: any) => {
        let res = '';
        // const title = moment(params[0].axisValue).format('MM月DD日');
        res = `<div style="color:var(--text-color);font-size:14px;font-weight:400;text-align: left;line-height: 30px;margin-bottom: 12px">${params[0].axisValue}</div>`;
        let seriesName, color, data, result;
        for (let i = 0; i < params.length; i++) {
          color = params[i].color;
          seriesName = params[i].seriesName;
          data = params[i].data;
          result = i === 0 ? formatAmount(Number(data / 10000 || 0), '¥ ') : Number(data || 0);
          res +=
            '<div style="display: flex;margin-bottom: 10px;height: 20px;line-height: 20px;font-size: 12px;color:#606974;font-weight: 400;">' +
            '<div style="margin:5px;border-radius: 5px;height: 10px;width: 10px;background:' +
            color +
            '"></div>' +
            seriesName +
            '：' +
            '<div style="color: var(--text-color);font-weight: 400;"> ' +
            result +
            ' </div>' +
            '</div>';
        }
        return res;
      },
    },
    series: {
      type: Array as PropType<{ data: [] }[]>,
      default: () => [{ data: [] }],
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
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: 'var(--text-des-color)',
          },
        },
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
            return [pos[0] + 30, pos[1] + offsetY];
          } else {
            //其中point为当前鼠标的位置
            // return [padding, -offsetTop];
            return [pos[0] - domWidth - 30, pos[1] + offsetY];
          }
        },
        formatter: props.tipFormatter,
        textStyle: {
          color: '#343F4C',
          fontSize: 14,
          fontWeight: 'bold',
        },
        extraCssText: 'box-shadow: 1px 2px 8px 0px  rgba(0, 0, 0, 0.26);',
      },
      legend: {
        show: true,
        // data: props.xData ?? [],
        right: 120,
        top: 15,
        type: 'scroll',
        width: 800,
        itemGap: 30,
        itemWidth: 17,
        itemHeight: 14,
      },
      grid: {
        left: 58,
        right: 58,
        bottom: 24,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        data: props.xData ?? [1, 2, 3, 4, 5],
        axisPointer: {
          type: 'line',
          label: {
            show: false,
          },
          lineStyle: {
            type: [6, 5],
            color: '#A4B2C2',
            cap: 'round',
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
        },
      },
      yAxis: props.yData,
      series: [
        {
          name: '观看人数',
          type: 'line',
          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: '#FF7F00',
          },
          lineStyle: {
            width: 3,
            shadowOffsetX: 0,
            shadowOffsetY: 11,
            shadowBlur: 11,
          },
          data: [0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '单UV价值',
          type: 'line',
          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: '#2877FF',
          },
          lineStyle: {
            width: 3,
            shadowOffsetX: 0,
            shadowOffsetY: 11,
            shadowBlur: 11,
          },
          data: [0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '商品曝光点击率',
          type: 'line',
          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: '#4FCA50',
          },
          lineStyle: {
            width: 3,
            shadowOffsetX: 0,
            shadowOffsetY: 11,
            shadowBlur: 11,
          },
          data: [0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '点击成交率',
          type: 'line',
          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: '#9273F8',
          },
          lineStyle: {
            width: 3,
            shadowOffsetX: 0,
            shadowOffsetY: 11,
            shadowBlur: 11,
          },
          data: [0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '曝光成交率',
          type: 'line',
          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: '#FFBF00',
          },
          lineStyle: {
            width: 3,
            shadowOffsetX: 0,
            shadowOffsetY: 11,
            shadowBlur: 11,
          },
          data: [0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '观看成交率',
          type: 'line',
          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: '#FF75C3',
          },
          lineStyle: {
            width: 3,
            shadowOffsetX: 0,
            shadowOffsetY: 11,
            shadowBlur: 11,
          },
          data: [0, 0, 0, 0, 0, 0, 0],
        },
      ] as any[],
    });
    const methods = {
      reloadData() {
        baseOptions.value.xAxis.data = props.xData ?? [];
        baseOptions.value.yAxis = props.yData ?? [];
        baseOptions.value.series = props.series ?? [];

        // baseOptions.value.legend.data = props.xData ?? [];
      },
    };
    onBeforeMount(() => {
      methods.reloadData();
    });
    watch([() => props.series, () => props.xData, () => props.yData], () => {
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
        <base-echarts id={`trendChart${this.id}`} options={this.baseOptions}></base-echarts>
      </div>
    );
  },
});
