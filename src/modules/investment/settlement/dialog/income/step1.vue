<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-01-21 10:26:04
-->
<template>
  <div class="tg-income-investment-settlement-step1-container">
    <el-form ref="formRef" :model="dataForm" label-width="70px" size="small">
      <el-form-item label="招商人员">
        <div class="value">{{ merchant_user }}</div>
      </el-form-item>
      <el-form-item
        label="执行场次"
        style="margin: 11px 0"
        prop="shop_live_id"
        :rules="[{ required: true, message: '请选择执行场次', trigger: 'change' }]"
      >
        <el-select v-model="dataForm.shop_live_id" style="width: 328px">
          <el-option
            v-for="live in shop_live_list"
            :label="live.live_title"
            :value="live.id"
            :key="live.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="结算周期">
        <div class="value">{{ settlement_cycle_str }}</div>
      </el-form-item>
    </el-form>
    <div class="bottom-button-line">
      <tg-button @click="prev">取消</tg-button>
      <tg-button type="primary" @click="next">下一步</tg-button>
    </div>
    <tg-mask-loading :visible="saveLoading" content="正在保存，请稍候..." />
  </div>
</template>

<script src="./step1.ts"></script>

<style lang="less">
@charset 'utf-8';

.tg-income-investment-settlement-step1-container {
  .el-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 64px;
    .el-form-item {
      width: 398px;
      margin-bottom: 0;
      .value {
        color: var(--text-color);
      }
    }
    .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
      content: '';
    }
  }
}
</style>
