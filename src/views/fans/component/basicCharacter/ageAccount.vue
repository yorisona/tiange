<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-05-26 17:46:53
-->
<template>
  <div id="age-chart"></div>
</template>

<script>
// import echarts from 'echarts';
import * as echarts from 'echarts';
import { noDataOption } from '@/const/optionChart';

export default {
  name: 'ageChart',
  props: ['ageChartData'],
  data() {
    return {
      ageChart: null,
      isMounted: false,
      noDataOption,
    };
  },
  watch: {
    ageChartData(val) {
      if (this.isMounted) {
        if (val.length > 0) {
          this.initAgeChart();
        } else {
          this.initNoDataShow();
        }
      }
    },
  },
  methods: {
    initAgeChart() {
      this.ageChart = echarts.init(document.getElementById('age-chart'));
      this.ageChart.clear();
      this.ageChart.setOption({
        color: ['#5C82FF', '#4DCDB1', '#ffb980', '#b6a2de', '#ffbf40'],
        legend: {
          bottom: '14',
          data: [
            { name: '65后', icon: 'pin' },
            { name: '75后', icon: 'pin' },
            { name: '85后', icon: 'pin' },
            { name: '95后', icon: 'pin' },
            { name: '未知', icon: 'pin' },
          ],
          itemWidth: 16,
          itemHeight: 8,
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, .8)',
          textStyle: {
            color: '#666',
          },
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '60%'],
            center: ['50%', '50%'],
            hoverOffset: 2,
            data: this.ageChartData,
          },
        ],
      });
    },
    initNoDataShow() {
      this.ageChart = echarts.init(document.getElementById('age-chart'));
      this.ageChart.clear();
      this.ageChart.setOption(this.noDataOption);
    },
    resizeChart() {
      this.ageChart.resize();
    },
  },
  mounted() {
    this.isMounted = true;
    if (this.ageChartData.length > 0) {
      this.initAgeChart();
    } else {
      this.initNoDataShow();
    }
    window.addEventListener('resize', this.resizeChart);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart);
  },
};
</script>
<style lang="scss" scoped>
#age-chart {
  width: 100%;
  height: 326px;
}
</style>
