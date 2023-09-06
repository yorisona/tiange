<template>
  <div class="data-center-collect flex-auto tg-card">
    <div>
      <div class="collect-select">
        <select-date @selectDate="selectDate"></select-date>
        <data-switch @checkATab="handleCheckTab" :index="activeIndex"></data-switch>
      </div>
      <div style="width: 100%; height: 10px; background: rgb(246, 246, 246)" />
    </div>
    <template v-if="activeIndex === 0">
      <data-center-list
        :loading="tableLoading"
        :list="list"
        :current-date-type="currentDateType"
        class="list-min-height"
      ></data-center-list>
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
    <data-center-chart :currentDate="currentDate" v-if="activeIndex === 1"></data-center-chart>
  </div>
</template>
<script src="./index.ts"></script>
<style lang="less" scoped>
.data-center-collect {
  .collect-select {
    height: 60px;
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
  .list-min-height {
    margin-top: 16px;
  }
}
</style>
