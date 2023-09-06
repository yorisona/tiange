<!--
 * @Brief: 淘宝cps - 第二步 - 生成结算单之后
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-06-03 13:51:03
-->
<template>
  <SettlementStep2Layout
    :amount="formatAmount(total_settlement_amount)"
    class="tg-cost-mcn-taobao-step2-after-container"
  >
    <template #top>
      <top-card
        :amount="total_settlement_amount"
        :name="dataForm.companyInfo.company_name"
        type="value1"
        :tax_rate_disabled="false"
        :tax_rate="dataForm.tax_rate"
        :invoice_type="dataForm.invoice_type"
        @taxRateChanged="taxRateChanged"
        @invoiceTypeChanged="invoiceTypeChangedHandler"
        @valueChange="taxValueChangeHandler"
      ></top-card>
    </template>

    <template #left>
      <CardLayout :padding="[0]">
        <template #title>
          <span>成本信息</span>
        </template>
        <!-- <template #desc>
          <span>提成 = 主播总收入 * 提成比例</span>
        </template> -->
        <template>
          <div class="expenditure-cost-info">
            <div class="expenditure-cost-info-list">
              <div class="expenditure-cost-info-list-row">
                <div class="cost-list-company">
                  <div>
                    <span class="label">机构：</span>
                    <span class="value">{{ dataForm.companyInfo.company_name }}</span>
                  </div>
                  <div class="cost-list-company-operator">
                    <tg-button type="link" @click="downKolDataFile">下载</tg-button>
                    <span class="kol-data">{{ `主播数据(共${cloneSettlement.kol_count}人)` }}</span>
                  </div>
                </div>
                <div class="commission">
                  <span class="label">提成比例：</span>
                  <el-input
                    size="small"
                    placeholder="0.00"
                    v-model="dataForm.companyInfo.tcbl"
                    @input="commissionInput"
                  >
                    <template slot="append">%</template>
                  </el-input>
                  <span class="label">原始收入</span>
                  <span class="origin-income">{{
                    `${formatAmount(dataForm.companyInfo.yssr)} 元`
                  }}</span>
                </div>
                <div class="expenditure-cost-summary">
                  <span class="label">提成：</span>
                  <span class="value">{{ `${formatAmount(dataForm.companyInfo.zccb)} 元` }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </CardLayout>
    </template>
    <template #right>
      <el-form @submit.native.prevent size="small">
        <TgAdjustAccountForm
          v-if="ShowAdjustInfo"
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
      <tg-mask-loading :visible="saveLoading" content="正在保存，请稍候..." />
    </template>
  </SettlementStep2Layout>
</template>

<script src="./step2.after.ts"></script>
<style lang="less">
@import './step2.after.less';
</style>
