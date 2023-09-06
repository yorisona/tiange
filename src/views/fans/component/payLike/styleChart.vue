<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-05-26 17:46:53
-->
<template>
  <div id="style-chart"></div>
</template>

<script>
// import echarts from 'echarts';
import * as echarts from 'echarts';
import { noDataOption } from '@/const/optionChart';

export default {
  name: 'styleChart',
  props: ['styleChartData', 'styleNameChartData'],
  data() {
    return {
      styleChart: null,
      isMounted: false,
      noDataOption,
    };
  },
  watch: {
    styleChartData(val) {
      if (this.isMounted) {
        if (val.length > 0) {
          this.initStyleChart();
        } else {
          this.initNoDataShow();
        }
      }
    },
  },
  mounted() {
    this.isMounted = true;
    if (this.styleChartData.length > 0) {
      this.initStyleChart();
    } else {
      this.initNoDataShow();
    }
    window.addEventListener('resize', this.resizeChart);
  },
  methods: {
    initStyleChart() {
      this.styleChart = echarts.init(document.getElementById('style-chart'));
      this.styleChart.clear();
      this.styleChart.setOption({
        color: ['#5C82FF', '#4DCDB1', '#ffb980', '#b6a2de', '#ffbf40'],
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, .8)',
          textStyle: {
            color: '#666',
          },
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
        },
        legend: {
          bottom: 14,
          data: this.styleNameChartData,
          itemWidth: 16,
          itemHeight: 8,
        },
        series: [
          {
            type: 'pie',
            radius: ['36%', '54%'],
            center: ['50%', '47%'],
            hoverOffset: 2,
            data: this.styleChartData,
          },
        ],
      });
    },
    initNoDataShow() {
      this.styleChart = echarts.init(document.getElementById('style-chart'));
      this.styleChart.clear();
      this.styleChart.setOption(this.noDataOption);
    },
    resizeChart() {
      this.styleChart.resize();
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart);
  },
};
</script>
<style lang="scss" scoped>
#style-chart {
  width: 100%;
  height: 340px;
}
</style>
