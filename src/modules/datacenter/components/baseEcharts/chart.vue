<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-05-26 17:46:52
-->
<template>
  <div class="chart" ref="chart"></div>
</template>
<script>
// import echarts from 'echarts';
import * as echarts from 'echarts';
export default {
  props: {
    options: {
      type: Object,
      default: () => {
        return {};
      },
    },
    currentIndex: {
      type: Number,
      default: -1,
    },
  },
  watch: {
    options: {
      handler(value) {
        this.updateOptions(value);
      },
      deep: true,
    },
    currentIndex: {
      handler: function (val) {
        if (val !== -1) {
          this.upAxisPointer();
        }
      },
      deep: true,
    },
  },
  mounted() {
    const { resize, ...chartEvents } = this.$listeners;
    const dom = this.$refs.chart;
    this.chart = echarts.init(dom);
    this.$emit('getChart', this.chart);
    Object.keys(chartEvents).forEach(eventName => {
      this.chart.on(eventName, (...args) => this.$emit(eventName, this.chart, ...args));
    });
    this.updateOptions(this.options);
    window.addEventListener('resize', this.resize);
    // 绑定点击事件
    this.chart.on('click', this.clickFunc);
    //  updateAxisPointer.浮动事件触发
  },
  destroyed() {
    window.removeEventListener('resize', this.resize);
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },
  methods: {
    refresh() {
      const newValue = { ...this.options };
      setTimeout(() => {
        this.chart.setOption(newValue, true);
      }, 10);
    },
    resize(...args) {
      this.chart.resize();
      this.$emit('resize', [this.chart, ...args]);
    },
    updateOptions(value) {
      if (value === null || value === undefined) return;
      this.chart.setOption(value, true);
    },
    clickFunc(param) {
      this.$emit('selectClick', param);
    },
    upAxisPointer() {
      let app = {
        currentIndex: this.currentIndex,
      };
      let dataLen = this.options.series[3].data.length;

      // 取消之前高亮的图形
      if (app.currentIndex > 0) {
        this.chart.dispatchAction({
          type: 'downplay',
          seriesIndex: 3,
          dataIndex: app.currentIndex - 1,
        });
      }

      app.currentIndex = app.currentIndex % dataLen;
      //console.log(app.currentIndex);
      // 高亮当前图形
      this.chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 3,
        dataIndex: app.currentIndex,
      });
      // 显示 tooltip
      this.chart.dispatchAction({
        type: 'showTip',
        seriesIndex: 3,
        dataIndex: app.currentIndex,
      });
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
