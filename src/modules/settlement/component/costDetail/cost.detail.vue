<!--
 * @Brief: 结算明细
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-11-25 14:34:30
-->
<template>
  <div
    class="tg-component-cost-detail"
    :style="{
      border:
        dataForm.type === 9 ? '1px solid rgba(164,178,194,.3)' : '0px solid rgba(164,178,194,.3)',
    }"
  >
    <div class="tg-component-cost-detail-header">
      <el-select
        popper-class="el-select-popper-mini"
        :value="dataForm.type"
        clearable
        placeholder="选择结算方式"
        @change="costTypeChanged"
        size="mini"
        style="width: 146px"
      >
        <el-option
          v-for="item in costOptions"
          :label="item.label"
          :value="item.value"
          :key="item.value"
          :disabled="itemDisabled(item.value)"
        ></el-option>
      </el-select>
      <div v-if="!isLiveTbPickNew" class="desc">{{ desc }}</div>
    </div>
    <div v-if="current" class="tg-component-cost-detail-content">
      <slot v-if="dataForm.type === SettlementIncomeType.anchor" name="anchor"></slot>
      <component
        v-else
        :is="current"
        ref="currentRef"
        :feeDetail="dataForm"
        :feeType="2"
        :isLiveDouyin="isLiveDouyinNew"
        :isLiveTbPick="isLiveTbPickNew"
        :isKolVerifyApproved="isKolVerifyApproved"
      ></component>
    </div>
    <tg-icon
      class="del-button"
      name="ico-frm-delete"
      hoverName="ico-frm-delete-active"
      @click="delSettlementDetail"
    ></tg-icon>
  </div>
</template>

<script src="./cost.detail.ts"></script>

<style lang="less">
.tg-component-cost-detail {
  margin-left: 16px;
  margin-right: 16px;
  border-radius: 2px;
  position: relative;
  background-color: rgba(var(--tip-icon-rgb-color), 0.09);
  .tg-component-cost-detail-header {
    display: flex;
    padding: 16px 12px;
    align-items: center;
    .desc {
      margin-left: 12px;
      font-size: 12px;
      color: var(--text-third-color);
    }
  }
  .tg-component-cost-detail-content {
    border-top: 1px solid rgba(var(--tip-icon-rgb-color), 0.15);
  }
  .del-button {
    cursor: pointer;
    position: absolute;
    width: 16px;
    height: 16px;
    right: -8px;
    top: -6px;
  }
}
</style>
