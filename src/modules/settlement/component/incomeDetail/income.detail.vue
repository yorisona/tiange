<!--
 * @Brief: 结算明细
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-11-25 14:34:30
-->
<template>
  <div class="tg-component-income-detail">
    <div class="tg-component-income-detail-header">
      <el-select
        popper-class="el-select-popper-mini"
        :value="dataForm.type"
        clearable
        placeholder="选择结算方式"
        @change="incomeTypeChanged"
        size="mini"
        style="width: 146px"
      >
        <el-option
          v-for="item in incomeOptions"
          :label="item.label"
          :value="item.value"
          :key="item.value"
          :disabled="itemDisabled(item.value)"
        ></el-option>
      </el-select>
      <div class="desc">{{ desc }}</div>
    </div>
    <div v-if="current" class="tg-component-income-detail-content">
      <component :is="current" ref="currentRef" :feeDetail="dataForm"></component>
    </div>
    <tg-icon
      class="del-button"
      name="ico-frm-delete"
      hoverName="ico-frm-delete-active"
      @click="delSettlementDetail"
    ></tg-icon>
  </div>
</template>

<script src="./income.detail.ts"></script>

<style lang="less">
.tg-component-income-detail {
  margin-left: 16px;
  margin-right: 16px;
  border-radius: 2px;
  position: relative;
  background-color: rgba(var(--tip-icon-rgb-color), 0.09);
  .el-input__inner,
  .tg-btn.tg-btn-default {
    color: var(--text-color);
  }
  .tg-component-income-detail-header {
    display: flex;
    padding: 16px 12px;
    align-items: center;
    .desc {
      margin-left: 12px;
      font-size: 12px;
      color: var(--text-third-color);
    }
  }
  .tg-component-income-detail-content {
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
