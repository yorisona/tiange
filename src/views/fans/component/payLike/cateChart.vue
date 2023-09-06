<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-05-26 17:46:53
-->
<template>
  <div id="fan-cate-chart"></div>
</template>

<script>
// import echarts from 'echarts';
import * as echarts from 'echarts';
import { noDataOption } from '@/const/optionChart';

export default {
  name: 'cateChart',
  props: ['cateChartData', 'cateNameChartData'],
  data() {
    return {
      cateChart: null,
      isMounted: false,
      noDataOption,
    };
  },
  watch: {
    cateChartData(val) {
      if (this.isMounted) {
        if (val.length > 0) {
          this.initCateChart();
        } else {
          this.initNoDataShow();
        }
      }
    },
  },
  mounted() {
    this.isMounted = true;
    if (this.cateChartData.length > 0) {
      this.initCateChart();
    } else {
      this.initNoDataShow();
    }
    window.addEventListener('resize', this.resizeChart);
  },
  methods: {
    initCateChart() {
      this.cateChart = echarts.init(document.getElementById('fan-cate-chart'));
      this.cateChart.clear();
      this.cateChart.setOption({
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
          data: this.cateNameChartData,
          itemWidth: 16,
          itemHeight: 8,
        },
        series: [
          {
            type: 'pie',
            radius: ['34%', '52%'],
            center: ['50%', '47%'],
            hoverOffset: 2,
            data: this.cateChartData,
          },
        ],
      });
    },
    initNoDataShow() {
      this.cateChart = echarts.init(document.getElementById('fan-cate-chart'));
      this.cateChart.clear();
      this.cateChart.setOption(this.noDataOption);
    },
    resizeChart() {
      this.cateChart.resize();
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart);
  },
};
</script>
<style lang="scss" scoped>
#fan-cate-chart {
  width: 100%;
  height: 340px;
}
</style>
