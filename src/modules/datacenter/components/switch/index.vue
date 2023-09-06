<template>
  <div class="overview-switch">
    <div :class="['base', { active: index === 0 }]" @click="handleCheckBtn(0)">
      <tg-icon name="ico-list" />列表样式
    </div>
    <div :class="['base', { active: index === 1 }]" @click="handleCheckBtn(1)">
      <tg-icon name="ico-chart" />图表样式
    </div>
  </div>
</template>
<script src="./index.ts"></script>
<style lang="less" scoped>
@import './index.less';
</style>
