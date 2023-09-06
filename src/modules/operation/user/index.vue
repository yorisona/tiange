<template>
  <div class="tg-page-container tg-operation-user-page">
    <el-card :body-style="{ padding: '0 20px' }" shadow="never">
      <tg-tabs :tabs="tabs" v-model="checkedTab" @change="onTabChange" />
    </el-card>
    <router-view />
  </div>
</template>

<script src="./index.tsx"></script>

<style lang="less">
@import './index.less';
</style>
