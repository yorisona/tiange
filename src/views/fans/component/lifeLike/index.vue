<template>
  <div id="radar-chart"></div>
</template>

<script>
// import echarts from 'echarts';
import * as echarts from 'echarts';
import { noDataOption } from '@/const/optionChart';

export default {
  name: 'radarChart',
  props: ['radarChartData', 'radarChartNameData'],
  data() {
    return {
      radarChart: null,
      isMounted: false,
      total: 0,
      percentage: [],
      noDataOption,
    };
  },
  watch: {
    radarChartData(val) {
      if (this.isMounted) {
        if (val.length > 0) {
          this.initRadarChart();
        } else {
          this.initNoDataShow();
        }
      }
    },
  },
  methods: {
    initRadarChart() {
      this.total = 0;
      this.percentage = [];
      this.radarChartData.forEach(item => {
        this.total += item;
      });
      this.radarChartData.forEach(item => {
        this.percentage.push(((item / this.total) * 100).toFixed(2) + '%');
      });
      this.radarChartNameData.forEach((item, index) => {
        item.name = item.name + '(' + this.percentage[index] + ')';
      });
      this.radarChart = echarts.init(document.getElementById('radar-chart'));
      this.radarChart.clear();
      this.radarChart.setOption({
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, .8)',
          textStyle: {
            color: '#666',
            fontSize: 12,
          },
        },
        radar: {
          radius: '78%',
          indicator: this.radarChartNameData,
        },
        series: [
          {
            type: 'radar',
            symbol: 'circle',
            areaStyle: {
              color: 'rgba(24, 144, 255, .4)',
            },
            lineStyle: {
              color: '#5C82FF',
            },
            itemStyle: {
              color: '#fff',
              borderColor: '#5C82FF',
            },
            data: [
              {
                value: this.radarChartData,
                name: '生活偏好',
              },
            ],
          },
        ],
      });
    },
    initNoDataShow() {
      this.radarChart = echarts.init(document.getElementById('radar-chart'));
      this.radarChart.clear();
      this.radarChart.setOption(this.noDataOption);
    },
    reszieChart() {
      this.radarChart.resize();
    },
  },
  mounted() {
    this.isMounted = true;
    if (this.radarChartData.length > 0) {
      this.initRadarChart();
    } else {
      this.initNoDataShow();
    }
    window.addEventListener('resize', this.reszieChart);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.reszieChart);
  },
};
</script>
<style lang="scss" scoped>
#radar-chart {
  width: 100%;
  height: 326px;
}
</style>
