<template>
  <Step2Layout :amount="total_settle_amount">
    <template #top>
      <top-card
        :amount="total_settle_amount"
        type="value1"
        :tax_rate_disabled="false"
        :tax_rate="TaxDataForm.tax_rate"
        :invoice_type="TaxDataForm.invoice_type"
        @invoiceTypeChanged="invoiceTypeChangedHandler"
        @taxRateChanged="taxRateChanged"
        @valueChange="taxValueChangeHandler"
      ></top-card>
    </template>
    <template #left>
      <CardLayout>
        <template #title>成本信息</template>
        <!-- <template #desc>支出=实际填写支出</template> -->
        <div class="marketing-cost-form">
          <el-form
            :model="step2Frm"
            :rules="step2FrmRules"
            size="mini"
            label-width="62px"
            ref="step2FrmRef"
          >
            <el-form-item prop="company_id" label="供应商：" style="margin-right: 0 !important">
              <el-select
                v-model="company_name"
                filterable
                remote
                reserve-keyword
                placeholder="请输入并选择公司名称"
                :remote-method="getAllCompanyName"
                @change="onCompanyIdChange"
                popper-class="markting-cost-step2-supplierSelect el-select-popper-mini"
                style="width: 186px"
              >
                <el-option
                  v-for="(item, index) in allCompanyName"
                  :key="index"
                  :label="item.company_name"
                  :value="item.company_id"
                >
                  <span>{{ item.company_name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="支出：" style="margin-right: 0 !important" class="text-item">
              <div>{{ spend_amount }} 元</div>
            </el-form-item>
            <el-form-item label="支出：" prop="spend_amount" style="margin-right: 0 !important">
              <el-input
                placeholder="0.00"
                v-model="step2Frm.spend_amount"
                @input="inputSpendAmount"
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
  </Step2Layout>
</template>

<script src="./step2.ts"></script>

<style lang="less" scoped>
/deep/.step2-content-two {
  grid-template-rows: 118px 350px 0px !important;
}
/deep/ .el-form-item--mini .el-form-item__content {
  line-height: 28px;
  color: var(--text-color);
  font-size: 12px;
}
// .markting-cost-step2-supplierSelect {
//   width: 187px;
// }
</style>
