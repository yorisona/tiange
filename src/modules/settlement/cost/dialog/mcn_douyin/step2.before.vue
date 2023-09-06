<!--
 * @Brief: 结算数据-拆分前
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-12-07 10:03:34
-->
<template>
  <SettlementStep2Layout class="tg-cost-mcn-douyin-step2-before-container" topHeightType="default">
    <template #top>
      <top-card :amount="`${total_settlement_amount.toString()}`" type="default"></top-card>
    </template>

    <template #left>
      <div class="left-content">
        <div>
          <div class="add-settlement-detail-container">
            <tg-button
              icon="ico-btn-add"
              type="primary"
              @click="addSettlementDetail"
              size="mini"
              :disabled="dataForm.company_info_list.length >= 6"
              >新增结算明细</tg-button
            >
          </div>
          <div style="margin-top: 2px">
            <CostDetail
              style="margin-bottom: 16px"
              :isKolVerifyApproved="true"
              v-for="(income, incomeIdx) in dataForm.company_info_list"
              :key="incomeIdx"
              :feeDetail="income"
              :disabledTypeList="selectedIncomeTypeList"
              @delSettlementDetail="delSettlementDetail(incomeIdx)"
            ></CostDetail>
          </div>
        </div>
      </div>
    </template>
    <template #right>
      <el-form @submit.native.prevent size="small">
        <TgAdjustAccountForm
          :height="470"
          ExtendItem="supplier"
          :adjust_info="dataForm.adjustInfo"
          :ExtendItemSelectOptions="selectedCompanyList"
          @dataChange="onAdjustAccountDataChange"
        />
      </el-form>
    </template>
    <template #button>
      <tg-button @click="prev">上一步</tg-button>
      <tg-button type="primary" @click="next">下一步</tg-button>
    </template>
    <template #mask>
      <tg-mask-loading :visible="loading" :content="loadingText" />
    </template>
  </SettlementStep2Layout>
</template>

<script src="./step2.before.ts"></script>

<style lang="less">
@charset 'utf-8';

.tg-cost-mcn-douyin-step2-before-container {
  .add-settlement-detail-container {
    padding: 16px 16px;
  }
  .left-content {
    overflow-y: overlay;
    flex-grow: 1;
    border-radius: 2px;
    border: 1px solid rgba(var(--tip-icon-rgb-color), 0.3);
  }
}
</style>
