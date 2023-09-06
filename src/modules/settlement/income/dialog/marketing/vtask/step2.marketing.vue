<template>
  <SettlementStep2Layout class="settlement-step2-marketing" :amount="total_settle_amount">
    <template #top>
      <top-card
        :amount="total_settle_amount"
        type="value1"
        :tax_rate="TaxDataForm.tax_rate"
        :tax_rate_disabled="false"
        @taxRateChanged="taxRateChanged"
        :is_cost="false"
        :invoice_type="TaxDataForm.invoice_type"
        @invoiceTypeChanged="invoiceTypeChangedHandler"
        @valueChange="taxValueChangeHandler"
      ></top-card>
    </template>
    <template #left>
      <CardLayout>
        <template #title>收入信息</template>
        <!-- <template #desc>收入=实际填写收入</template> -->
        <div>
          <el-form
            :model="step2Frm"
            :rules="step2FrmRules"
            size="mini"
            label-width="56px"
            ref="step2FrmRef"
          >
            <el-form-item label="服务费：" prop="income_amount">
              <el-input
                placeholder="0.00"
                v-model="step2Frm.income_amount"
                @input="inputIncomeAmount"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </CardLayout>
    </template>
    <template #right>
      <el-form size="mini">
        <AdjustAccount
          :height="350"
          v-if="ShowAdjustInfo"
          :adjust_info="step2Frm.adjust_info"
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

<script src="./step2.marketing.ts"></script>

<style lang="less" scoped>
.settlement-step2-marketing {
  /deep/ .step2-content-two {
    grid-template-rows: 118px 350px 0px !important;
  }
}
</style>
