<!--
 * @Brief: 抖系收入结算结算数据 - 第二步 - 拆分前
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-11-24 13:08:56
-->
<template>
  <SettlementStep2Layout
    topHeightType="default"
    :leftItemExpand="true"
    class="tg-income-mcn-douyin-step2-before-container"
  >
    <template #top>
      <top-card
        :is_cost="false"
        :amount="`${total_settlement_amount.toString()}`"
        type="default"
      ></top-card>
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
            <IncomeDetail
              style="margin-bottom: 16px"
              v-for="(income, incomeIdx) in dataForm.company_info_list"
              :key="incomeIdx"
              :incomeDetail="income"
              :disabledTypeList="selectedIncomeTypeList"
              @delSettlementDetail="delSettlementDetail(incomeIdx)"
            ></IncomeDetail>
          </div>
        </div>
      </div>
    </template>
    <template #right>
      <el-form @submit.native.prevent size="small">
        <TgAdjustAccountForm
          :height="445"
          ExtendItem="customer"
          :ExtendItemSelectOptions="selectedCompanyList"
          :adjust_info="dataForm.adjustInfo"
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
@import './step2.before.less';
</style>
