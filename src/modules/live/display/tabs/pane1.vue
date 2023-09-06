<!--
 * @Author: 矢车
 * @Date: 2021-01-05 14:18:25
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-29 16:39:13
 * @Description:
-->
<template>
  <div class="tg-live-display-detail-tab-pane1 flex-auto">
    <div v-if="displayDetail.live_status !== 4" class="operator-btn flex-none">
      <div style="display: flex; align-items: center">
        <!-- <a v-if="Permission.canEditAssistantSchedule" @click="setDialogTypeAssistant">运营助理排班</a> -->
        <!-- <a v-if="Permission.canEditStreamerSchedule" @click="setDialogTypeAnchor">主播排班</a> -->
        <tg-button
          icon="ico-add-lite"
          type="primary"
          v-if="Permission.canEditStreamerSchedule"
          @click="setDialogTypeAnchor"
          >主播排班</tg-button
        >
        <tg-button
          style="margin-left: 18px"
          icon="ico-add-lite"
          type="primary"
          v-if="Permission.canEditAssistantSchedule"
          @click="setDialogTypeAssistant"
          >运营助理排班</tg-button
        >
        <div style="margin-left: 24px; color: var(--text-color); font-weight: 600">
          直播时间：{{ live_time }}
        </div>
      </div>
      <div class="calendar-top-right">
        <div class="role-label-group">
          <div class="role-label" v-for="role in roles" :key="role.name">
            <div class="role-color" :style="`background-color: ${role.color}`"></div>
            <div>{{ role.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="tg-page-empty" style="margin: 60px 0" v-if="isEmpty">
      <empty-common detail-text="暂无人员排班~"></empty-common>
    </div>
    <template v-else>
      <div class="flex-auto">
        <TgDayTimeline :schedules="schedules" :time-range="timeRange" />
      </div>
    </template>
    <div class="dialog-sty tg-dialog-vcenter">
      <el-dialog
        :title="dialogTitle"
        :visible.sync="isDialogVisible"
        @open="openDialog"
        :close-on-click-modal="false"
      >
        <anchorArrangeForm
          @childClose="closeDialog"
          :type="dialogType"
          ref="anchorArrangeForm"
          :schedules="schedules"
          :visible="isDialogVisible"
          v-bind="$attrs"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script src="./pane1.ts"></script>

<style lang="scss" scoped>
@import '@/assets/scss/common-system.scss';
@import './pane1.scss';
</style>

<style lang="less">
.tg-live-display-detail-tab-pane1 {
  display: flex;
  flex-direction: column;
  margin-top: 0 !important;
  .empty-grid {
    margin-top: -10px;
    display: grid;
    height: 100%;
    min-height: 100%;
    grid-template-rows: minmax(60px, 1fr) 172px 25px 60px minmax(120px, 2fr);
    grid-template-columns: 1fr auto 1fr;
    justify-content: center;
    align-items: center;
    > .empty-grid-img {
      grid-row-start: 2;
      grid-row-end: 3;
      grid-column-start: 2;
      grid-column-end: 3;
    }
    > .empty-grid-text {
      grid-row-start: 4;
      grid-row-end: 5;
      grid-column-start: 2;
      grid-column-end: 3;
    }
  }
  .calendar-top {
    display: flex;
    justify-content: space-between;
    .hlh(50px, 50px);
    > .calendar-top-left {
      .fc(14px, #333);
      font-weight: 600;
    }
  }
}
</style>
