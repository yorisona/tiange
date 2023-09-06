<template>
  <div class="center-top-5">
    <div class="list-title">
      <div class="rank">排名</div>
      <div class="name">业务名称</div>
      <div class="amount">金额</div>
    </div>
    <div v-for="(item, index) in list" :key="index" class="list-main">
      <div :class="['rank', { top: index <= 2 }]">{{ index + 1 }}</div>
      <div class="name">{{ item.project_name }}</div>
      <div class="amount">{{ numberMoneyFormat(item.values[0], 2) }}</div>
    </div>
  </div>
</template>
<script src="./index.ts"></script>
<style lang="less" scoped>
@import 'index.less';
</style>
