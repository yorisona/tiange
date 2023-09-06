<!--
 * @Author: 肖槿
 * @Date: 2021-07-06 16:32:35
 * @Description: MCN页面
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-25 17:32:58
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\mcn\index.vue
-->
<template>
  <div class="data-douyin-center-collect flex-auto tg-card">
    <div class="collect-select" style="margin-top: 0px">
      <div style="display: flex">
        <select-date @selectDate="selectDate" :isMcnDouyinDaily="true"></select-date>
        <el-select
          popper-class="el-select-popper-mini"
          size="mini"
          v-model="select_project_id"
          style="margin-left: 12px; width: 180px"
        >
          <el-option
            popper-class="el-select-popper-mini"
            v-for="item in project_list"
            :key="item.id"
            :value="item.id"
            :label="item.title"
          />
        </el-select>
      </div>
      <div
        v-if="update_time"
        style="
          font-size: 12px;
          color: var(--text-third-color);
          line-height: 32px;
          height: 32px;
          margin-left: 18px;
        "
      >
        最后更新时间： {{ update_time }}
      </div>
    </div>
    <div style="width: 100%; height: 10px; background: rgb(246, 246, 246)" />
    <div
      style="padding: 0 16px; margin-top: 16px; margin-bottom: 32px; flex-grow: 1; overflow: hidden"
    >
      <tg-daily-data-table
        :showTableData="tableData"
        :totalData="reportData ? reportData.total : {}"
        :editEnabled="false"
      ></tg-daily-data-table>
    </div>
  </div>
</template>
<script src="./index.ts"></script>
<script src="./index.ts"></script>
<style lang="less" scoped>
.data-douyin-center-collect {
  height: calc(100% - 48px);
  .collect-select {
    height: 48px;
    display: flex;
    padding: 0 16px;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    flex: auto 168px;
  }
  .related-project-title {
    height: 48px;
    padding-left: 18px;
    display: flex;
    align-items: center;
    margin-bottom: 6px;
  }
  .center-list-min-height {
    margin-top: 12px;
  }
}
</style>
