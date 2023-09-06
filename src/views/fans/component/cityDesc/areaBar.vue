<template>
  <div id="area-bar-chart"></div>
</template>

<script>
// import echarts from 'echarts';
import * as echarts from 'echarts';
import { noDataOption } from '@/const/optionChart';

export default {
  name: 'areaBarChart',
  props: ['areaChartData', 'barNameData'],
  data() {
    return {
      areaBarChart: null,
      isMounted: false,
      noDataOption,
    };
  },
  watch: {
    areaChartData(val) {
      if (this.isMounted) {
        if (val.length > 0) {
          this.initAreaBarChart();
        } else {
          this.initNodataShow();
        }
      }
    },
  },
  methods: {
    initAreaBarChart() {
      this.areaBarChart = echarts.init(document.getElementById('area-bar-chart'));
      this.areaBarChart.clear();
      this.areaBarChart.setOption({
        color: ['#5C82FF'],
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, .8)',
          textStyle: {
            color: '#333',
            fontSize: 12,
          },
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(147, 177, 251, .2)',
            },
          },
        },
        grid: { x: 50, x2: 45, y: 45, y2: 40 },
        xAxis: {
          type: 'value',
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: 'var(--text-des-color)',
            },
          },
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          type: 'category',
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: 'var(--text-des-color)',
            },
          },
          splitLine: {
            show: true,
            lineStyle: { type: 'dashed' },
          },
          data: this.barNameData,
        },
        series: [
          {
            type: 'bar',
            barMaxWidth: '6px',
            itemStyle: {
              barBorderRadius: 3,
            },
            data: this.areaChartData,
          },
        ],
      });
    },
    initNodataShow() {
      this.areaBarChart = echarts.init(document.getElementById('area-bar-chart'));
      this.areaBarChart.clear();
      this.areaBarChart.setOption(this.noDataOption);
    },
    resizeChart() {
      this.areaBarChart.resize();
    },
  },
  mounted() {
    this.isMounted = true;
    if (this.areaChartData.length > 0) {
      this.initAreaBarChart();
    } else {
      this.initNodataShow();
    }
    window.addEventListener('resize', this.resizeChart);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart);
  },
};
</script>
<style lang="scss" scoped>
#area-bar-chart {
  width: 100%;
  height: 340px;
}
</style>
