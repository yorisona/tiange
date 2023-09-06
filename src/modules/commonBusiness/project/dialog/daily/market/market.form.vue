<!--
 * @Brief: 通用业务->项目管理->项目详情->日报数据 mcn业务弹框
 * @Author: 棠棣
 * @Date: 2021-05-18 10:49
-->
<template>
  <div class="tg-common-business-market-form-dialog tg-dialog-vcenter">
    <el-dialog
      class="tg-dialog-classic"
      width="440px"
      :visible="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :wrapperClosable="false"
      @close="onCloseBtnClick"
    >
      <template #title>{{ title }}</template>
      <div class="dialog-content">
        <el-form ref="formRef" label-position="top" size="mini" label-width="106px">
          <div class="line-box">
            <el-form-item class="mgb-18" label="到账金额">
              <el-input
                maxlength="18"
                v-model.trim="marketForm.income_amount"
                @input="value => inputAmount('income_amount', value)"
                placeholder="0.00"
              >
                <span slot="append">元</span>
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template #footer style="height: 50px">
        <tg-button @click="onCloseBtnClick">取消</tg-button>
        <tg-button type="primary" @click="onSaveBtnClick">保存</tg-button>
      </template>
    </el-dialog>
  </div>
</template>
<script src="./market.form.ts"></script>
<style lang="less">
@import './market.form.less';
</style>
