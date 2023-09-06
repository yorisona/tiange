<template>
  <div>
    <SettlementStep2Layout
      class="tg-mcn-settlement-form"
      :incomeType="1"
      :amount="formatAmount(total_settle_amount, 'None')"
    >
      <template #top>
        <top-card
          :amount="`${total_settle_amount.toString()}`"
          type="value1"
          :tax_rate="dataForm.tax_rate"
          :tax_rate_disabled="false"
          :is_cost="false"
          @taxRateChanged="taxRateChanged"
          :invoice_type="dataForm.invoice_type"
          @invoiceTypeChanged="invoiceTypeChangedHandler"
          @valueChange="taxValueChangeHandler"
        ></top-card>
      </template>
      <template #left>
        <CardLayout :padding="[18, 0, 12]">
          <template #title>
            <span>收入信息</span>
          </template>
          <!-- <template v-if="dataForm.settlement_type != 4" #desc>
            <span>{{
              dataForm.settlement_type === 5
                ? '(上传文件中所有收入金额合计)'
                : '(上传文件中所有收入金额按客户合计)'
            }}</span>
          </template> -->
          <template>
            <div class="mcn-settlement-form-income-content">
              <div class="mcn-settlement-form-income-content-info">
                <div class="income-content-info-summary">
                  <span>收入</span>
                  <span> {{ formatAmount(dataForm.income_amount, 'None') }} 元</span>
                </div>
                <div
                  v-if="excelData.length"
                  style="border-bottom: 1px dashed rgba(164, 178, 194, 0.3); margin: 12px 18px 0"
                ></div>
                <div class="income-content-info-list">
                  <div
                    class="income-content-info-list-row"
                    v-for="(item, idx) in excelData"
                    :key="idx"
                    :style="isLastSpecialIncomeData(item, idx) ? 'margin-bottom: 18px' : ''"
                  >
                    <el-tooltip
                      :disabled="isSpecialIncomeData(item)"
                      :open-delay="300"
                      :content="item.name"
                      placement="top"
                      effect="light"
                    >
                      <span
                        class="line-clamp-1"
                        :style="
                          isSpecialIncomeData(item)
                            ? 'max-width: 140px; color: var(--text-second-color);'
                            : 'max-width: 140px'
                        "
                        >{{ item.name }}</span
                      >
                    </el-tooltip>
                    <span :style="item.value.indexOf('-') !== -1 ? 'color: #EC1E1E;' : ''">{{
                      formatAmount(item.value, 'None')
                    }}</span>
                  </div>
                </div>
              </div>
              <div class="mcn-settlement-form-income-content-operator">
                <el-tooltip
                  :disabled="dataForm.income_file ? true : false"
                  content="上传数据后支持下载"
                  placement="top"
                  effect="light"
                >
                  <tg-button
                    :disabled="dataForm.income_file ? false : true"
                    type="link"
                    @click="downloadFile(dataForm.income_file)"
                    >下载原始数据</tg-button
                  >
                </el-tooltip>
                <el-upload
                  v-model="dataForm.income_file"
                  action="/"
                  :multiple="false"
                  :show-file-list="false"
                  :http-request="uploadFileHandler"
                >
                  <tg-button type="link">上传</tg-button>
                </el-upload>
                <tg-button :href="incomeTemplateFile" download="" type="link">下载模板</tg-button>
              </div>
            </div>
          </template>
        </CardLayout>
      </template>
      <template #right>
        <el-form @submit.native.prevent size="small">
          <TgAdjustAccountForm
            v-if="ShowAdjustInfo"
            :adjust_info="dataForm.adjust_info"
            @dataChange="onAdjustAccountDataChange"
          />
        </el-form>
      </template>
      <template #button>
        <tg-button @click="prev">上一步</tg-button>
        <tg-button type="primary" @click="next">下一步</tg-button>
      </template>
    </SettlementStep2Layout>
    <tg-mask-loading
      :visible="saveLoading || uploadLoading"
      :content="uploadLoading ? '正在上传/解析文件，请稍候...' : '正在保存，请稍候...'"
    />
  </div>
</template>

<script src="./step2.mcn.ts"></script>

<style lang="less">
@import './step2.mcn.less';
</style>
<style lang="less" scoped>
.tg-mcn-settlement-form {
  height: 541px !important;
  /deep/.step2-layout-content {
    height: 540px !important;
    grid-template-rows: 118px 360px 0px !important;
    .adjust-account-content {
      grid-template-rows: 44px 256px !important;
    }
  }
}
</style>
