<!--
 * @Brief: 店铺代播 - 项目管理 - 项目详情 - 跟踪事项
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2020-12-30 18:28:31
-->

<template>
  <tg-card
    class="tg-live-project-detail-tab-tacking"
    @rect:update="onRectUpdate"
    v-bind="cardProps"
  >
    <div class="btns-line">
      <tg-button
        v-if="Permission.canEdit"
        type="primary"
        icon="ico-btn-add"
        @click="handleAddEventAction"
      >
        新增事项
      </tg-button>
    </div>
    <el-table
      stripe
      v-if="Permission.canViewList"
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
      v-bind="tableProps"
    >
      <el-table-column v-for="(col, colIndex) in columns" v-bind="col" :key="colIndex" />
      <template #empty>
        <empty-common detail-text="暂未添加跟踪事项"></empty-common>
      </template>
    </el-table>
    <trackingEventDialog
      :visible="shouldEditing"
      :track_master_obj="editingTrackMaster"
      :project_id="project_id"
      @closeAction="handleCloseAction"
      @succeed="handleEditingSucceedAction"
    />
  </tg-card>
</template>

<script src="./tracking.ts"></script>

<style lang="less">
.tg-live-project-detail-tab-tacking {
  position: relative;
  padding: 0 18px 18px 18px;

  .btns-line {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    line-height: 32px;
    height: 32px;
    margin: 12px 0;
  }

  .el-table {
    .event_span_header {
      display: block;
      text-align: left;
      padding-left: 0;
    }
  }
  .event-add-button {
    position: absolute;
    top: -45px;
    right: 18px;
    color: var(--theme-color);
    padding-right: 0;
  }
}
</style>
