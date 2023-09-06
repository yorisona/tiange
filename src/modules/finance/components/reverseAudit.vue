<template>
  <div>
    <el-dialog
      class="tg-dialog-classic tg-dialog-vcenter-new tg-reverse-audit-dialog"
      :visible="visible"
      :close-on-click-modal="false"
      @close="close"
      width="440px"
    >
      <template #title>单据冲销</template>
      <div
        class="tg-reverse-audit-dialog-content"
        :style="{
          paddingBottom: is_pass === 0 ? '24px' : '8px',
        }"
      >
        <el-form class="el-form-vertical" label-position="top" :show-message="false" size="mini">
          <div class="reverse-reason-label">冲销原因</div>
          <div class="reverse-reason-content">
            {{ reverse_reason }}
          </div>
          <el-form-item
            label="是否通过"
            prop="is_pass"
            style="margin-top: 18px"
            class="sp-form-item"
            required
          >
            <div style="width: 100%">
              <el-radio-group v-model="is_pass">
                <el-radio :label="1">通过</el-radio>
                <el-radio :label="0">不通过</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-input
            type="textarea"
            placeholder="请输入不通过原因"
            v-show="is_pass === 0"
            v-model.trim="reverse_back_reason"
            clearable
            :maxlength="100"
            show-word-limit
          />
          <el-form-item
            v-if="shouldAccoiuntPeriod"
            label="账期时间"
            prop="accountDate"
            style="margin-top: 18px"
            class="sp-form-item"
          >
            <!-- <div style="width: 100%"> -->
            <el-date-picker
              style="width: 100%"
              v-model="accountDate"
              type="month"
              placeholder="请选择账期时间"
              format="yyyy.MM"
              value-format="yyyy-MM"
              :editable="false"
              :picker-options="pickerOptions"
              @change="onAccountDateChange"
            ></el-date-picker>
            <!-- </div> -->
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <tg-button @click="onRefuse">取消</tg-button>
        <tg-button type="primary" @click="onConfirm" :disabled="isConfirmBtnDisabled"
          >提交</tg-button
        >
      </template>
    </el-dialog>
    <billPeriod
      ref="billPeriodRef"
      :saveLoading="billPeriodSaveLoading"
      @save="onBillPeriodHaandler"
    ></billPeriod>
  </div>
</template>

<script src="./reverseAudit.ts"></script>

<style lang="less">
@import '~@/styles/utils/index.less';
.tg-reverse-audit-dialog {
  .tg-reverse-audit-dialog-content {
    padding-top: 24px;
    padding-right: 24px;
    padding-left: 24px;
  }

  .el-textarea > textarea {
    width: 392px;
    height: 76px;
    resize: none;
  }

  .reverse-reason-label {
    height: 16px;
    .fc(12px, var(--text-second-color));
    line-height: 16px;
  }
  .reverse-reason-content {
    padding: 12px;
    .bgc(rgba(var(--tip-icon-rgb-color), 0.1));
    .brdr(2px);
    .fc(14px, var(--text-color));
    line-height: 22px;
    .mgt(6px);
  }
}
</style>
