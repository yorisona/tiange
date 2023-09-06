<!--
 * @Author: 肖槿
 * @Date: 2021-07-06 16:32:35
 * @Description: MCN页面
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-07-16 17:24:21
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\mcn\index.vue
-->
<template>
  <div class="data-taobao-center-collect flex-auto tg-card">
    <div class="collect-select">
      <select-date @selectDate="selectDate"></select-date>
      <data-switch @checkATab="handleCheckTab" :index="activeIndex" />
    </div>
    <div style="width: 100%; height: 10px; background: rgb(246, 246, 246)" />
    <template v-if="activeIndex === 0">
      <data-center-list
        v-loading="tableLoading"
        :list="dataList"
        :current-date-type="selectedDateType"
        class="center-list-min-height"
      />
      <div class="related-project" style="margin-top: 16px">
        <div class="related-project-title">
          <head-lines title="相关项目" />
          <el-input
            size="mini"
            placeholder="项目名称/编码"
            style="width: 182px"
            @keypress.native.enter="onEnterPressSearch"
            @click.native="onEnterPressSearch"
            suffix-icon="el-icon-search"
            v-model="project_id"
          >
          </el-input>
        </div>
        <related-project :list="project_list_filter" @viewDetail="viewDetail"></related-project>
      </div>
    </template>
    <data-center-chart
      :chartLoading="chartLoading"
      :summary-data="summaryData"
      :gmv-data="gmvData"
      :gmv-rate-data="gmvRateData"
      :operating-data="operatingData"
      :session-data="sessionData"
      :liver-num-data="liverNumData"
      v-if="activeIndex === 1"
    />
  </div>
</template>
<script src="./index.ts"></script>
<style lang="less">
.data-taobao-center-collect {
  .collect-select {
    height: 64px;
    display: flex;
    padding: 0 16px;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    flex: 0 0 68px;
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
