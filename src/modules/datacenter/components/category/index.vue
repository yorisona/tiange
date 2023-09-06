<template>
  <div :style="this.styles || 'height: 300px; width: 100%'" v-loading="loading">
    <base-echarts v-if="pieData.length > 0" :options="baseOptions"></base-echarts>
    <Empty v-else />
  </div>
</template>

<script>
import BaseEcharts from '../baseEcharts/chart';
import Empty from '../empty/index.vue';
import { barPieLoopColors } from '@/utils/format';
// import formatData from '@/utils/formatData';
// const { tranNumber } = formatData;

export default {
  name: 'BasePie',
  components: {
    BaseEcharts,
    Empty,
  },
  props: {
    title: {
      type: Object,
      default: () => ({
        text: '',
      }),
    },
    loading: {
      type: Boolean,
      default: true,
    },
    pieData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    formatterModal: {
      type: Function,
      default: null,
    },
    styles: {
      type: String,
      default: '',
    },
    legend: {
      type: Object,
      default: () => ({
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        type: 'scroll',
        bottom: -5,
      }),
    },
    seriesOpt: {
      type: Object,
      default: () => ({
        radius: ['45%', '65%'],
      }),
    },
  },
  data() {
    // const legend = this.legend;
    const values = this.pieData ? this.pieData.map(v => v.value) : [];
    const names = this.pieData ? this.pieData.map(v => v.name) : [];
    return {
      baseOptions: {
        xAxis: {
          type: 'category',
          data: names,
          axisLine: {
            lineStyle: {
              color: '#4D343F4C',
              width: 1, //这里是为了突出显示加上的
            },
          },
        },
        color: barPieLoopColors,
        yAxis: {
          type: 'value',
          name: '销量占比(%)',
          axisLine: {
            lineStyle: {
              color: '#4D343F4C',
              width: 1, //这里是为了突出显示加上的
            },
          },
        },
        series: [
          {
            data: values,
            type: 'bar',
            showBackground: true,
            barWidth: '25',
            label: {
              show: true,
              position: 'top',
              formatter: v => v.value + '%',
            },
          },
        ],
        grid: {
          left: '20',
          right: '4%',
          bottom: '2',
          top: '50',
          containLabel: true,
        },
      },
    };
  },
  watch: {
    pieData: {
      handler() {
        this.init();
      },
      deep: true,
    },
  },
  methods: {
    init() {
      try {
        const names = this.pieData.map(v => v.name);
        const values = this.pieData.map(v => v.value);
        this.baseOptions = {
          ...this.baseOptions,
          xAxis: {
            type: 'category',
            data: names,
            axisLabel: {
              color: '#606974',
            },
            axisLine: {
              lineStyle: {
                color: '#343f4c4d',
                width: 1, //这里是为了突出显示加上的
              },
            },
          },
          color: barPieLoopColors,
          yAxis: {
            type: 'value',
            name: '销量占比(%)',
            nameTextStyle: {
              color: '#606974',
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              color: '#606974',
            },
            axisLine: {
              lineStyle: {
                color: '#343f4c4d',
                width: 1, //这里是为了突出显示加上的
              },
            },
          },
          series: [
            {
              data: values,
              type: 'bar',
              showBackground: true,
              backgroundStyle: {
                color: 'rgba(240,240,240,0.7)',
              },
              barWidth: '25',
              label: {
                show: true,
                position: 'top',
                formatter: v => v.value + '%',
              },
            },
          ],
          grid: {
            left: '5',
            right: '4%',
            bottom: '2',
            top: '50',
            containLabel: true,
          },
        };
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="less">
.tooltip-wrapper {
  width: 100%;
  height: 100%;
  /* margin-left: -5%;
  margin-bottom: -5%;*/
  padding: 8px 10px;
  background: rgba(255, 255, 255, 1);
  /*box-shadow: 0px 2px 8px 0px rgba(11, 14, 33, 0.13);*/
  border-radius: 6px;
  .tooptip-title {
    color: var(--text-color);
    font-size: 14px;
  }
  .right {
    font-size: 14px;
    color: #343f4c;
    font-weight: 600;
    line-height: 24px;
  }
  .p-row {
    margin-top: 3px;
    color: #606974;
    font-size: 12px;
    font-weight: normal;
    line-height: 28px;
    .left {
      margin-right: 5px;
    }
  }
}
</style>
