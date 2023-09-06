<!--
 * @Author: 肖槿
 * @Date: 2022-02-19 14:48:32
 * @Description:
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-06 14:18:02
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\components\baseMap\chart.vue
-->
<template>
  <div id="myChartChina" :style="{ height: '620px' }"></div>
</template>
<script>
// import echarts from 'echarts';
// import china from 'echarts/map/json/china.json';
import * as echarts from 'echarts';
import china from '@/assets/echarts/china.json';
const ChinaJSON = new Promise(resolve => setTimeout(() => resolve(china), 3000)).then(() => {
  echarts.registerMap('china', china);
});
export default {
  props: {
    mapData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      chart: null,
      myChartChina: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      ChinaJSON.then(() => this.drawLine());
      // this.drawLine();
    });
  },

  methods: {
    async updateData(_data) {
      if (location) {
        ChinaJSON.then(console.log);
        console.log('data', _data);
        return;
      }
      await ChinaJSON();
      const optionMap = {
        tooltip: {
          formatter: function (params) {
            return `${params.data.name}：${params.data.value}%`;
          },
        },
        selectedMode: 'single',
        visualMap: {
          min: 0,
          show: false,
          max: Math.max(...this.mapData.map(item => item.value)),
          inRange: {
            color: ['rgba(40,119,255,0.10)', '#2877FF'],
          },
        },
        series: [
          {
            name: '',
            type: 'map',
            mapType: 'china',
            top: '20',
            left: '70',
            zoom: 1,
            itemStyle: {
              normal: {
                borderColor: 'rgba(255, 255, 255,1)',
              },
              emphasis: {
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                shadowColor: 'rgba(60,82,105,0.3)',
                areaColor: '#8ECFFF',
              },
            },
            showLegendSymbol: true,
            label: {
              normal: {
                show: true,
              },
              emphasis: {
                show: true,
              },
            },
            data: this.mapData,
          },
        ],
      };

      this.myChartChina.setOption(optionMap);
    },
    drawLine() {
      const myChartContainer = document.getElementById('myChartChina');
      const myChartChina = echarts.init(myChartContainer);
      this.myChartChina = myChartChina;
      // 绘制图表
      const optionMap = {
        tooltip: {
          formatter: function (params) {
            return `${params.data.name}：${params.data.value}%`;
          },
        },
        visualMap: {
          min: 0,
          show: false,
          max: Math.max(...this.mapData.map(item => item.value)),
          inRange: {
            color: ['rgba(40,119,255,0.10)', '#2877FF'],
          },
        },
        series: [
          {
            name: '',
            type: 'map',
            mapType: 'china',
            top: '80',
            left: '100',
            zoom: 1.05,
            itemStyle: {
              normal: {
                borderColor: 'rgba(255, 255, 255,1)',
              },
              emphasis: {
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                shadowColor: 'rgba(60,82,105,0.3)',
                areaColor: '#8ECFFF',
              },
            },
            showLegendSymbol: true,
            label: {
              normal: {
                show: true,
              },
              emphasis: {
                show: true,
              },
            },
            data: this.mapData,
          },
        ],
      };

      this.myChartChina.setOption(optionMap);
      window.onresize = function () {
        myChartChina.resize();
      };
    },
  },
};
</script>
<style lang="less" scoped>
.chart {
  flex: 1;
  width: 100%;
  height: 100%;
}
</style>
