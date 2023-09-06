<template>
  <div class="tg-live-project-copy-schedule-dialog">
    <el-dialog
      class="customer-dialog tg-dialog-vcenter-new"
      :visible="visible"
      width="440px"
      title="复制排期排班"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="onClose"
    >
      <div class="copy-schedule-dialog-content">
        <el-form :model="DataForm" label-width="60px" size="mini" label-position="top">
          <div class="form-row">
            <el-form-item label="请选择需要复制的时间段">
              <el-date-picker
                :picker-options="pickerOptions"
                clearable
                :editable="false"
                v-model="DataForm.date_range"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
                style="width: 392px"
              />
            </el-form-item>
            <el-form-item label="请选择复制到哪个时间段">
              <div style="display: flex">
                <el-date-picker
                  clearable
                  :editable="false"
                  type="date"
                  v-model="DataForm.start_date"
                  range-separator="~"
                  placeholder="开始日期"
                  format="yyyy.MM.dd"
                  value-format="yyyy-MM-dd"
                  style="width: 204px"
                  @change="ChangeCopyToStartDate"
                />
                <div
                  style="text-align: center; width: 24px; color: var(--text-color); font-size: 12px"
                >
                  ～
                </div>
                <el-date-picker
                  clearable
                  v-model="DataForm.end_date"
                  disabled
                  :editable="false"
                  type="date"
                  range-separator="~"
                  placeholder="结束日期"
                  format="yyyy.MM.dd"
                  value-format="yyyy-MM-dd"
                  style="width: 204px"
                />
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template #footer>
        <tg-button @click="onClose">取消</tg-button>
        <tg-button type="primary" @click="onSave">保存</tg-button>
      </template>
    </el-dialog>
  </div>
</template>
<script src="./CopyScheduleForm.ts"></script>
<style lang="less">
@charset 'utf-8';

.tg-live-project-copy-schedule-dialog {
  .copy-schedule-dialog-content {
    padding: 18px 6px 24px 24px;
  }
}
</style>
