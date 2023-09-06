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
        <el-form
          :model="marketForm"
          ref="formRef"
          :rules="rules"
          label-position="top"
          size="mini"
          label-width="106px"
        >
          <div class="line-box">
            <el-form-item class="mgb-18" label="选择月份" prop="month">
              <el-select v-model="marketForm.month">
                <el-option
                  v-for="(item, key) in months"
                  :label="item.label"
                  :value="item.value"
                  :key="key"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="line-box">
            <el-form-item class="mgb-18" label="净销比例" prop="net_sales_rate">
              <el-input
                maxlength="6"
                v-model.trim="marketForm.net_sales_rate"
                @input="value => inputAmount('net_sales_rate', value)"
                placeholder=""
              >
                <span slot="append">%</span>
              </el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="tips">
          注意：预设的净销比例将作为默认数据自动填写到指定月份的日报中，
          如果预设值不符合实际情况可以在日报中直接修改。
        </div>
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
