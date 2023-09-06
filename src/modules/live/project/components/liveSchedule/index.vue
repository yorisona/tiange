<template>
  <div class="tg-project-live-schedule">
    <div class="live-operator-row">
      <div class="live-operator-row-left">
        <div class="date-switch" v-if="liveDisplayType === 'calendar'">
          <div class="btn-circle" @click="onPrevMonth">
            <tg-icon name="ico-arrow-left"></tg-icon>
          </div>
          <span class="live-date">{{ currentTitle }}</span>
          <div class="btn-circle" @click="onNextMonth">
            <tg-icon name="ico-arrow-right"></tg-icon>
          </div>
        </div>
        <div class="date-select" v-else>
          <span class="label">查询日期：</span>
          <el-date-picker
            v-model="selectDates"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            size="mini"
            :editable="false"
          >
          </el-date-picker>
        </div>
        <div class="live-operator">
          <tg-button v-if="live_display_save" type="primary" @click="CopyLiveScheduleHandler"
            >复制排期</tg-button
          >
          <tg-button
            v-if="live_display_save"
            class="mgl-12"
            icon="ico-btn-add"
            type="primary"
            @click="AddLiveDisplayHandler"
            >新增场次</tg-button
          >
          <tg-button class="mgl-12" type="primary" @click="onDownloadScheduleClick"
            >下载主播排期</tg-button
          >
        </div>
      </div>
      <div class="live-operator-row-right">
        <el-popover placement="bottom-end" trigger="hover" :open-delay="300">
          <tg-button slot="reference" type="link" class="abnormal-tip-btn">
            <tg-icon name="ico-question"></tg-icon>
          </tg-button>
          <div class="abnormal-tip">
            <div class="abnormal-tip-title">以下情况直播场次将以橙色标注</div>
            <div class="mgt-12 abnormal-tip-row">1、场次未完成主播排班</div>
            <div class="mgt-12 abnormal-tip-row">2、已过直播结束时间仍未录入直播数据</div>
          </div>
        </el-popover>
        <span class="mgl-6" style="color: var(--text-third-color); font-size: 12px"
          >异常提醒说明</span
        >
        <TgBtnCapsule
          class="btn-capsule mgl-18"
          :value="liveDisplayType === 'calendar' ? 'left' : 'right'"
          @click="onCapsuleClick"
        >
          <template #left>日历</template>
          <template #right>列表</template>
        </TgBtnCapsule>
      </div>
    </div>
    <calendar
      v-if="liveDisplayType === 'calendar'"
      :displayDate="displayDate"
      ref="CalendarRef"
    ></calendar>
    <live-list v-else :start_date="start_date" :end_date="end_date" ref="LiveListRef"></live-list>
    <CopyScheduleForm
      :visible.sync="CopyScheduleFormVisible"
      @succeed="handleCopyScheduleSucceedAction"
    ></CopyScheduleForm>
    <!-- 新增场次 -->
    <liveDisplayAddDialog
      :visible="liveDisplayAddDialogVisible"
      :project_id="project_id"
      :business_type="business_type"
      :studioInfo="studioInfo"
      @succeed="handleSaveSucceedAction"
      @closeAction="handleCloseAction"
    />
    <downloadSchedule ref="downloadScheduleRef"></downloadSchedule>
  </div>
</template>
<script src="./index.ts"></script>
<style lang="less">
@import './index.less';
.btn-capsule {
  height: 28px;
  line-height: 28px;
}
</style>
