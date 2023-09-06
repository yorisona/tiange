<!--
 * @Author: 肖槿
 * @Date: 2022-02-17 14:50:32
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-02-19 15:45:14
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\components\empty\index.vue
-->
<template>
  <div
    class="empty-chart"
    style="margin-top: 0; padding-top: 20px"
    :style="{ height: chartHeightNum + 'px' }"
  >
    <empty-common detail-text="暂无数据" :img-height="100" :img-width="150"></empty-common>
  </div>
</template>
<script>
export default {
  name: 'empty',
  props: {
    /** 高度 */
    chartHeight: {
      required: false,
      type: Number,
      default: 250,
    },
  },
  data() {
    return {
      chartHeightNum: 250,
    };
  },
  created() {
    this.chartHeightNum = this.chartHeight ? this.chartHeight : this.chartHeightNum;
  },
};
</script>
<style scoped lang="less">
.empty-chart {
  width: 100%;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .empty-text {
    color: var(--text-des-color);
    margin-top: -25px;
  }
}
</style>
