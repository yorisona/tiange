<template>
  <div id="map-chart"></div>
</template>

<script>
// import echarts from 'echarts';
import * as echarts from 'echarts';
import { noDataOption } from '@/const/optionChart';
require('@/assets/china');

export default {
  name: 'mapChart',
  props: ['areaChartData', 'barNameData'],
  data() {
    return {
      mapChart: null,
      isMounted: false,
      noDataOption,
    };
  },
  watch: {
    areaChartData(val) {
      if (this.isMounted) {
        if (val.length > 0) {
          this.initMapChart();
        } else {
          this.initNoDataShow();
        }
      }
    },
  },
  methods: {
    initMapChart() {
      this.mapChart = echarts.init(document.getElementById('map-chart'));
      this.mapChart.clear();
      this.mapChart.setOption({
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, .8)',
          borderWidth: 1,
          borderColor: '#5C82FF',
          textStyle: {
            color: '#666',
          },
          formatter: function (params) {
            if (params.name === '') {
              return null;
            }
            return params.name + ':' + params.value;
          },
        },
        visualMap: {
          show: false,
          inRange: {
            color: ['#e0ffff', '#5C82FF'],
          },
        },
        series: [
          {
            type: 'map',
            map: 'china',
            label: {
              normal: { show: false },
            },
            nameMap: {
              浙江: '杭州市',
              河南: '郑州市',
              广东: '广州市',
              湖北: '武汉市',
              湖南: '长沙市',
              四川: '成都市',
              上海: '上海市',
              北京: '北京市',
              重庆: '重庆市',
              江苏: '南京市',
              天津: '天津市',
              陕西: '西安市',
            },
            itemStyle: {
              areaColor: '#dbe8f6',
              borderWidth: 1,
              borderColor: '#fff',
            },
            emphasis: {
              label: {
                show: false,
              },
              itemStyle: {
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 10,
                borderWidth: 1,
                shadowColor: 'rgba(0, 0, 0, 0.2)',
              },
            },
            roam: false,
            zoom: 1.1,
            data: this.areaChartData,
          },
        ],
      });
    },
    initNoDataShow() {
      this.mapChart = echarts.init(document.getElementById('map-chart'));
      this.mapChart.clear();
      this.mapChart.setOption(this.noDataOption);
    },
    resizeChart() {
      this.mapChart.resize();
    },
  },
  mounted() {
    this.isMounted = true;
    if (this.areaChartData.length > 0) {
      this.initMapChart();
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
#map-chart {
  width: 100%;
  height: 340px;
}
</style>
