<template>
  <div>
    <el-dialog
      class="tg-dialog-classic tg-dialog-vcenter-new"
      :class="[dialogClass]"
      :visible="dialogVisible"
      :width="dialogWidth"
      height="660px"
      @close="close"
      lock-scroll
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <template #title>成本结算</template>
      <div class="settlement-detail-content">
        <component :is="data_component" :readonly="true" ref="stepCompRef" />
        <div
          v-if="CanIEdit && !is_confirmed && !readonly && !is_unity_settlement"
          class="account-date-field"
          :class="accountFieldClass"
        >
          <span style="color: var(--text-second-color); font-size: 12px; width: 72px"
            >账期时间：</span
          >
          <el-date-picker
            style="width: 210px"
            v-model="accountDate"
            type="month"
            placeholder="请选择账期时间"
            format="yyyy.MM"
            value-format="yyyy-MM"
            :editable="false"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </div>
      </div>
      <template #footer v-if="CanIEdit && !is_confirmed && !readonly && !is_unity_settlement">
        <tg-button @click="confirmRefuseReason">不通过</tg-button>
        <tg-button type="primary" @click="confirm">确认结算</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="refuseLoading || confirmLoading" content="正在提交，请稍候..." />
    <RefuseDialog ref="refustDialogRef" @refuse="refuse" />
  </div>
</template>

<script src="./detail.ts"></script>

<style lang="less">
@import './detail.less';
.settlement-step3-marketing.step3-layout.marketing-settlement .step3-layout-content {
  height: 510px !important;
}
.marketing-marketing {
  .el-input__inner {
    font-size: 12px;
    color: var(--text-color);
    height: 28px;
    line-height: 26px;
  }
}
</style>
