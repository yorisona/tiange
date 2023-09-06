<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-02-14 14:02:41
-->
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
      <template #title>收入结算</template>
      <div class="settlement-detail-content">
        <component :is="data_component" :readonly="true" ref="stepCompRef" />
      </div>
      <template #footer v-if="CanIEdit && !is_confirmed && !readonly && !is_unity_settlement">
        <tg-button @click="confirmRefuseReason">不通过</tg-button>
        <tg-button type="primary" @click="confirm">{{
          settlement && settlement.settlement_type === 8 ? '确认结算' : '确认并提交'
        }}</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="confirmLoading" content="正在提交确认，请稍候..." />
    <tg-mask-loading :visible="refuseLoading" content="正在提交，请稍候..." />
    <RefuseDialog ref="refustDialogRef" @refuse="refuse" />
  </div>
</template>

<script src="./project.confirm.ts"></script>

<style lang="less">
@charset 'utf-8';

.settlement-detail-content {
  .step2-cost-layout-content-right > .card-layout {
    height: inherit;
  }
  .step2-cost-layout {
    > .step2-cost-layout-content {
      grid-template-rows: 24px 486px;
    }
  }
}
</style>
