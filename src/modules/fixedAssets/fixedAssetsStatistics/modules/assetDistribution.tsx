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
    data: {
      type: Array as PropType<{ key: string; value: number }[]>,
      default: () => [],
    },
    id: {
      type: Number,
      default: 1,
    },
    distributionType: {
      type: Number,
      default: 1,
    },
  },
  components: {
    BaseEcharts,
    Empty,
  },
  setup(props, ctx) {
    const baseOptions = ref<any>({
      title: {
        show: false,
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params: any) {
          const color = params.color; // 获取当前扇形区域的颜色
          const value = params.value;
          const percent = params.percent;
          const name = params.name;

          // 标题name
          const nameLine =
            '<div style="font-weight: 400;color:#19232D;margin-bottom:12px;font-size: 14px;">' +
            (name.length > 10 ? name.substr(0, 10) + '...' : name) +
            '</div>';

          // 使用 CSS 添加颜色圆球，并根据需要调整圆球的样式和大小
          const circle =
            '<span style="display:inline-block;margin-right:5px;width:10px;height:10px;border-radius:50%;background-color:' +
            color +
            '"></span>';

          // 第一行显示 "颜色 资产名称: **"
          const firstLine =
            '<div style="display:flex; align-items: baseline;color:#888888;font-size:12px;margin-bottom:6px;">' +
            circle +
            `<span>资产${props.distributionType === 1 ? '数量' : '金额'}: ` +
            `<span style="color:#19232D;">${value}</span>` +
            '</div>';

          // 第二行显示 "占比: **%"
          const secondLine =
            '<span style="margin-left:15px;color:#888888;font-size:12px;">占比: ' +
            `<span style="color:#19232D;font-size:12px;">${percent}</span>` +
            '</span>' +
            `%`;
          return nameLine + firstLine + secondLine;
        },
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        height: '88%',
        tooltip: {
          show: true,
        },
        formatter: function (name: string) {
          return name.length > 8 ? name.substr(0, 8) + '...' : name;
        },
        // data: data.legendData,
        pageIconSize: [14, 10],
      },
      series: [
        {
          name: '姓名',
          type: 'pie',
          radius: '80%',
          center: ['38%', '50%'],
          data: [],
          label: {
            normal: {
              show: true,
              overflow: 'truncate',
              color: '#606974',
              edgeDistance: '10%',
              width: 65,
            },
          },
          labelLine: {
            length: 10,
            length2: 10,
            minTurnAngle: 90, // 设置最小的扇区角度
          },
          minShowLabelAngle: 10, // 最小的显示标签的角度
          // 引导线显示的个数
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    });
    const methods = {
      reloadData() {
        baseOptions.value.series[0].data =
          props.data?.map(v => ({
            value: props.distributionType === 1 ? v.value : v.value / 100,
            name: v.key,
          })) ?? [];
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
