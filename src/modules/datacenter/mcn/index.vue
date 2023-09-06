<!--
 * @Author: 肖槿
 * @Date: 2021-07-06 16:32:35
 * @Description: MCN页面
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-07-16 17:24:21
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\mcn\index.vue
-->
<template>
  <div class="data-center-collect flex-auto tg-card">
    <tg-tabs class="flex-none" :tabs="tabs" v-model="checkedTab" @change="onTabChange" bottom />
    <dou-yin v-if="activetabIndex === '抖音日报'" />
    <dou-yin-session v-if="activetabIndex === '抖音月报'" />
    <tao-bao v-if="activetabIndex === '淘宝日报'" />
  </div>
</template>
<script src="./index.ts"></script>
<style lang="less">
.data-center-collect {
  .collect-select {
    height: 64px;
    display: flex;
    padding: 0 16px;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    flex: 0 0 60px;
  }
  .related-project-title {
    height: 48px;
    padding-left: 18px;
    display: flex;
    align-items: center;
    margin-bottom: 6px;
  }
  .center-list-min-height {
    margin-top: 16px;
  }
}
</style>
