<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-03-28 16:05:27
-->
<template>
  <div class="data-center-collect">
    <div class="flex-auto tg-card">
      <div class="title">
        <div class="font">{{ projectName }}</div>
      </div>
      <div class="collect-select">
        <select-date @selectDate="selectDate"></select-date>
      </div>
      <div
        v-if="activeIndex === 0 && isDouyinData"
        style="padding: 6px 18px 12px 18px; color: #5392ff"
      >
        小店GMV包含直播GMV和橱窗GMV
      </div>
      <template v-if="activeIndex === 0">
        <data-center-list
          :list="dataList"
          :restDates="restDates"
          class="center-list-min-height"
          :current-date-type="selectedDateType"
        ></data-center-list>
      </template>
      <data-center-chart v-if="activeIndex === 1"></data-center-chart>
    </div>
  </div>
</template>

<script src="./index.ts"></script>
<style lang="less" scoped>
.data-center-collect {
  height: 100%;
  .center-list-min-height {
    min-height: 400px;
  }
  .collect-select {
    height: 64px;
    display: flex;
    padding: 0 18px;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  }
  .title {
    height: 40px;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    margin-top: 6px;
    .font {
      border-left: 3px solid rgba(var(--theme-rgb-color), 0.9);
      height: 13px;
      font-size: 12px;
      color: var(--text-color);
      line-height: 13px;
      font-weight: 600;
      margin: 17px 18px 16px;
      padding-left: 6px;
    }
  }
  .related-project-title {
    height: 48px;
    padding-left: 18px;
    display: flex;
    align-items: center;
    .title {
      font-size: 12px;
      height: 13px;
      line-height: 13px;
      padding-left: 6px;
      color: var(--text-color);
      font-weight: 600;
      border-left: 2px solid var(--theme-color);
      margin-right: 18px;
    }
  }
}
</style>
