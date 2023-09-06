<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-01-21 13:14:34
-->
<template>
  <SettlementStep2Layout
    :leftItemExpand="true"
    class="tg-income-investment-settlement-step2-container"
  >
    <template #top>
      <top-card
        :amount="total_amount"
        type="value1"
        :is_cost="false"
        :tax_rate_disabled="false"
        :tax_rate="dataForm.tax_rate"
        :invoice_type="dataForm.invoice_type"
        @taxRateChanged="taxRateChanged"
        @invoiceTypeChanged="invoiceTypeChangedHandler"
        @valueChange="taxValueChangeHandler"
      >
      </top-card>
    </template>
    <template #left>
      <CardLayout class="settlement-left-block" element-loading-background="rgba(0, 0, 0, 0.25)">
        <template #title>{{ company_name }}</template>
        <el-form size="small" label-position="top">
          <div style="color: #6a7b92">
            <div>
              <span>商品编码</span>
              <span style="margin-left: 10px; color: var(--text-color)">{{
                dataForm.json_data.product_code
              }}</span>
            </div>
            <div class="mgt-18">
              <span>商品名称</span>
              <span style="margin-left: 10px; color: var(--text-color)">{{
                dataForm.json_data.product_name
              }}</span>
            </div>
          </div>
          <el-form-item label="招商项目结算收入" class="mgt-18">
            <el-input
              @input="val => onMerchantsInputChanged(val)"
              :value="merchants_project.income_amount"
              style="width: 306px"
            ></el-input>
          </el-form-item>
          <el-form-item :label="`${execute_project.project_name}项目结算收入`">
            <el-input
              @input="val => onExecuteInputChanged(val)"
              :value="execute_project.income_amount"
              style="width: 306px"
            ></el-input>
          </el-form-item>
        </el-form>
      </CardLayout>
    </template>
    <template #right>
      <el-form @submit.native.prevent size="small">
        <TgAdjustAccountForm
          ExtendItem="project"
          :ExtendItemSelectOptions="selectedPrjectList"
          :adjust_info="dataForm.adjust_info"
          @dataChange="onAdjustAccountDataChange"
        />
      </el-form>
    </template>
    <template #button>
      <tg-button @click="prev">上一步</tg-button>
      <tg-button type="primary" @click="next">下一步</tg-button>
    </template>
    <template #mask>
      <tg-mask-loading :visible="saveLoading" content="正在保存，请稍候..." />
    </template>
  </SettlementStep2Layout>
</template>
<script src="./step2.ts"></script>
<style lang="less">
@charset 'utf-8';

.tg-income-investment-settlement-step2-container {
  .settlement-left-block {
    .el-form {
      .el-form-item {
        margin-bottom: 18px;
        .el-form-item__label {
          line-height: 18px;
          padding-bottom: 6px;
        }
      }
    }
  }
}
</style>
