<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-05-26 17:46:53
-->
<template>
  <div id="gender-chart"></div>
</template>

<script>
// import echarts from 'echarts';
import * as echarts from 'echarts';
import { noDataOption } from '@/const/optionChart';

export default {
  name: 'genderChart',
  props: ['genderChartData'],
  data() {
    return {
      genderChart: null,
      isMounted: false,
      noDataOption,
    };
  },
  watch: {
    genderChartData(val) {
      if (this.isMounted) {
        if (val.length > 0) {
          this.initGenderChart();
        } else {
          this.initNoDataShow();
        }
      }
    },
  },
  methods: {
    initGenderChart() {
      this.genderChart = echarts.init(document.getElementById('gender-chart'));
      this.genderChart.clear();
      this.genderChart.setOption({
        color: ['#5C82FF', '#4DCDB1', '#b6a2de'],
        legend: {
          bottom: '14',
          data: [
            { name: '女', icon: 'pin' },
            { name: '男', icon: 'pin' },
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
            data: this.genderChartData,
          },
        ],
      });
    },
    initNoDataShow() {
      this.genderChart = echarts.init(document.getElementById('gender-chart'), {
        width: '100%',
      });
      this.genderChart.clear();
      this.genderChart.setOption(this.noDataOption);
    },
    resizeChart() {
      this.genderChart.resize();
    },
  },
  mounted() {
    this.isMounted = true;
    if (this.genderChartData.length > 0) {
      this.initGenderChart();
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
#gender-chart {
  width: 100%;
  height: 326px;
}
</style>
