<template>
  <Step2Layout
    class="settlement-step2-mcn-after-douyin-cps"
    :amount="total_amount_str"
    :leftItemExpand="true"
  >
    <template #top>
      <top-card
        :amount="total_amount"
        type="value1"
        :tax_rate_disabled="false"
        :tax_rate="DataForm.tax_rate"
        :is_cost="false"
        @taxRateChanged="taxRateChanged"
        :invoice_type="DataForm.invoice_type"
        @invoiceTypeChanged="invoiceTypeChangedHandler"
        @valueChange="taxValueChangeHandler"
      ></top-card>
    </template>
    <template #left>
      <CardLayout class="settlement-left-block" element-loading-background="rgba(0, 0, 0, 0.25)">
        <template #title>
          <div>
            <span>{{ settlement.company_name || (unityData && unityData.company_name) }}</span>
          </div>
        </template>
        <div class="amount-info-list">
          <div v-for="(item, itemIdx) in incomeNameTypes" :key="itemIdx">
            <div
              v-if="
                (item.type === 1 || item.type === 5 || item.type === 6) && amountDetail(item.type)
              "
            >
              <div class="input-row mgb-12">
                <span class="label label-42">{{ item.name }}：</span>
                <el-input
                  placeholder="填写收入"
                  :value="income_amount(item.type)"
                  @input="val => onIncomeAmountChanged(val, item.type)"
                  size="mini"
                  style="width: 240px; margin: 0 32px 0 12px"
                >
                  <template slot="append">元</template>
                </el-input>
                <tg-button v-if="item.type === 1" type="link" @click="downPitFeeDetail"
                  >下载明细</tg-button
                >
                <!-- <tg-button type="link" @click="downPitFeeDetail">下载明细</tg-button> -->
              </div>
              <div>
                <el-input
                  :value="remark(item.type)"
                  type="textarea"
                  placeholder="请输入其他收入说明"
                  :maxlength="50"
                  resize="none"
                  @input="val => remarkChanged(val, item.type)"
                  v-if="item.type === 6"
                  style="width: 360px; height: 80px; margin-left: 54px"
                ></el-input>
              </div>
            </div>
            <div
              v-if="
                amountDetail(item.type) && (item.type === 2 || item.type === 3 || item.type === 4)
              "
            >
              <div>
                <span class="label" :class="item.type === 4 ? 'label-42' : ''"
                  >{{ item.name }}：</span
                >
                <span class="value"
                  >{{ formatAmountWithoutPrefix(income_amount(item.type)) }} 元</span
                >
              </div>
              <div class="douyin-cps-bottom" :class="itemIdx !== 5 ? 'bottom-line' : ''">
                <el-tooltip
                  :disabled="file(item.type) ? true : false"
                  content="上传数据后支持下载"
                  placement="top"
                  effect="light"
                >
                  <tg-button
                    :disabled="file(item.type) ? false : true"
                    type="link"
                    @click="downloadDataFile(item.type)"
                    >下载原始数据</tg-button
                  >
                </el-tooltip>
                <span class="hor-line"></span>
                <el-upload
                  :vlue="file(item.type)"
                  action="/"
                  :multiple="false"
                  :show-file-list="false"
                  :http-request="val => uploadFileHandler(val, item.type)"
                >
                  <tg-button type="link">上传</tg-button>
                </el-upload>
                <span class="hor-line"></span>
                <tg-button @click="downTempFile(item.type)" type="link">下载模板</tg-button>
              </div>
            </div>
          </div>
          <div v-if="unityData && unityData.type === 10">
            <div>
              <el-form size="small" label-position="left" label-width="120px">
                <el-form-item label="总GMV：">
                  <el-input disabled v-model="unityData.total_gmv" style="width: 250px"
                    ><span slot="append">元</span></el-input
                  >
                </el-form-item>
                <template v-if="unityData.version === 2">
                  <el-form-item label="总佣金：">
                    <el-input
                      disabled
                      v-model="unityData.shop_commission_amount"
                      style="width: 250px"
                      ><span slot="append">元</span></el-input
                    >
                  </el-form-item>
                  <el-form-item label="机构佣金：">
                    <el-input disabled v-model="unityData.commission_amount" style="width: 250px"
                      ><span slot="append">元</span></el-input
                    >
                  </el-form-item>
                  <el-form-item label="达人佣金：">
                    <el-input
                      disabled
                      v-model="unityData.kol_commission_amount"
                      style="width: 250px"
                      ><span slot="append">元</span></el-input
                    >
                  </el-form-item>
                  <el-form-item label="技术服务费：">
                    <el-input
                      disabled
                      v-model="unityData.tech_service_fee_amount"
                      style="width: 250px"
                      ><span slot="append">元</span></el-input
                    >
                  </el-form-item>
                </template>

                <el-form-item label="退货率：">
                  <el-input
                    v-model="unityData.refund_rate"
                    @input="refundRateHandler"
                    style="width: 250px"
                  >
                    <span slot="append">%</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="平均佣金比例：">
                  <el-input disabled v-model="unityData.commission_rate" style="width: 250px"
                    ><span slot="append">%</span></el-input
                  >
                </el-form-item>
                <el-form-item label="收入：">
                  <el-input disabled :value="unityData.amount" style="width: 250px"
                    ><span slot="append">元</span></el-input
                  >
                </el-form-item>
                <el-form-item label="订单明细：">
                  <div v-for="files in unityData.file.split(',')" :key="files">
                    <span>{{ files.split('/')[files.split('/').length - 1] }}</span>
                    <tg-button
                      :disabled="file(10) ? false : true"
                      type="link"
                      @click="downloadUnityDataFile(files)"
                      >下载</tg-button
                    >
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </CardLayout>
    </template>
    <template #right>
      <div>
        <el-form @submit.native.prevent size="mini" label-width="68px">
          <TgAdjustAccountForm
            :adjust_info="DataForm.adjust_info"
            @dataChange="onAdjustAccountDataChange"
          />
        </el-form>
      </div>
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
<script src="./step2.after.ts"></script>

<style lang="less">
@import './step2.after.less';
</style>
<style lang="less" scoped>
.settlement-step2-mcn-after-douyin-cps {
  /deep/ .step2-content-two {
    grid-template-rows: 118px 365px 0px !important;
    .adjust-account-content {
      grid-template-rows: 44px 261px !important;
    }
  }
  height: 541px !important;
  /deep/.step2-layout-content {
    height: 540px !important;
  }
}
</style>
