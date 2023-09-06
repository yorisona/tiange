<template>
  <div class="tg-page-container tg-customer-list-page">
    <tg-card class="flex-none" :padding="[6, 0, 0, 0]">
      <tg-tabs :tabs="tabs" v-model="checkedTab" @change="onTabChange" bottom />
    </tg-card>
    <component class="flex-auto tg-tab-pane-wrapper" :is="checkedTab" />
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less">
@import './index.less';
</style>
