<template>
  <div id="contract-approval" :class="extraClass">
    <tg-block :bodyStyle="{ padding: '0' }">
      <tg-tabs :tabs="tabs" v-model="checkedTab" @change="onTabChange" />
    </tg-block>
    <keep-alive>
      <component class="mgt-10" :is="checkedTab" />
    </keep-alive>
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less">
@import './index.less';
</style>
