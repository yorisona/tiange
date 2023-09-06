<template>
  <SettlementStep2Layout
    class="settlement-step2-shoplive"
    :amount="formatted_total_amount"
    :incomeType="cooperation_type === 2 ? 2 : 3"
    v-loading="uploadLoading"
  >
    <template #top>
      <top-card
        :amount="total_amount.toString()"
        type="value1"
        :tax_rate="DataForm.tax_rate"
        :tax_rate_disabled="false"
        :is_cost="false"
        @taxRateChanged="taxRateChanged"
        :invoice_type="DataForm.invoice_type"
        @invoiceTypeChanged="invoiceTypeChangedHandler"
        @valueChange="valueChange"
      ></top-card>
    </template>
    <!-- 抖音店播 佣金 -->
    <template #left>
      <div>
        <el-form @submit.native.prevent :model="DataForm" size="mini" label-width="68px">
          <div class="commission-block">
            <div class="header">
              <span class="label">收入信息</span>
              <!-- <span class="desc">佣金=销售金额*佣金比例</span> -->
            </div>
            <div
              v-if="DataForm.business_type === 8"
              style="padding: 0 18px"
              class="selfsettelement"
            >
              <el-form-item label="服务费：" label-width="80px" class="mgt-12" style="width: 248px">
                <el-input
                  @input="ServiceAmountInput"
                  maxlength="12"
                  placeholder="请输入"
                  v-model="DataForm.service_amount"
                  ><span slot="append">元</span></el-input
                >
              </el-form-item>
              <el-form-item
                label="佣金："
                label-width="80px"
                style="width: 248px; margin-bottom: 0px"
              >
                <el-input
                  @input="CommissionAmountInput"
                  maxlength="12"
                  placeholder="请输入"
                  v-model="DataForm.commission"
                  ><span slot="append">元</span></el-input
                >
              </el-form-item>
            </div>
            <div v-else style="padding: 18px 18px 0">
              <el-form-item
                v-if="RawFillForm && RawFillForm.service_amount"
                label="服务费："
                label-width="78px"
              >
                <el-input
                  @input="ServiceAmountInput"
                  maxlength="12"
                  placeholder="请输入"
                  v-model="DataForm.service_amount"
                  ><span slot="append">元</span></el-input
                >
              </el-form-item>
              <template
                v-if="RawFillForm && (RawFillForm.sale_amount || RawFillForm.commission_rate)"
              >
                <el-form-item
                  :label="cooperation_type !== 2 ? '净销额：' : '销售金额：'"
                  label-width="78px"
                >
                  <el-input
                    :disabled="cooperation_type !== 2 ? false : true"
                    @input="SaleAmountInput"
                    maxlength="12"
                    placeholder="0.00"
                    v-model="DataForm.sale_amount"
                    ><span slot="append">元</span></el-input
                  >
                </el-form-item>
                <el-form-item label="佣金比例：" label-width="78px">
                  <el-input
                    @input="CommissionRateInput"
                    maxlength="6"
                    placeholder="请输入"
                    v-model.trim="DataForm.commission_rate"
                    ><span slot="append">%</span></el-input
                  >
                </el-form-item>
              </template>
              <el-form-item
                v-if="RawFillForm && RawFillForm.marketing_advertising_amount"
                label="营销/商广："
                label-width="78px"
              >
                <el-input
                  @input="ExtensionAmountInput"
                  maxlength="12"
                  placeholder="请输入"
                  v-model="DataForm.marketing_advertising_amount"
                  ><span slot="append">元</span></el-input
                >
              </el-form-item>
              <el-form-item
                v-if="RawFillForm && (RawFillForm.sale_amount || RawFillForm.commission_rate)"
                label="佣金："
                label-width="78px"
              >
                <span style="color: var(--text-color); font-weight: 600">{{ commission_str }}</span>
              </el-form-item>
            </div>
            <!--            <div class="footer" v-if="cooperation_type !== 2 && DataForm.business_type !== 8 ">
              &lt;!&ndash; 下载原始数据 &ndash;&gt;
              <tg-button
                v-if="DataForm.order_file"
                type="link"
                @click="downloadFileHandler(DataForm.order_file)"
                >下载原始数据</tg-button
              >
              <el-tooltip
                v-else
                style="display: inline-block"
                content="上传数据后支持下载"
                placement="top"
                effect="light"
              >
                <tg-button type="link" :disabled="true">下载原始数据</tg-button>
              </el-tooltip>
              <el-upload
                style="margin: 0 18px; display: inline-block"
                action="/"
                :multiple="false"
                :show-file-list="false"
                :http-request="uploadFileHandler"
              >
                <tg-button type="link">上传</tg-button>
              </el-upload>
              <tg-button type="link" @click="downloadTemplateHandler">下载模版</tg-button>
            </div>-->
          </div>
        </el-form>
      </div>
    </template>

    <template #right>
      <div>
        <el-form @submit.native.prevent size="small" label-width="68px">
          <TgAdjustAccountForm
            v-if="ShowAdjustInfo"
            :adjust_info="DataForm.adjust_info"
            @dataChange="onAdjustAccountDataChange"
          />
        </el-form>
      </div>
    </template>
    <template #bottom v-if="cooperation_type === 2">
      <div class="newfooter">
        <el-upload
          style="margin: 0 9px 0 0; display: inline-block"
          action="/"
          :multiple="false"
          :show-file-list="false"
          :http-request="uploadFileHandler"
        >
          <tg-button type="link">上传数据</tg-button>
        </el-upload>
        <tg-button
          style="
            border-left: 1px solid rgba(164, 178, 194, 0.3);
            padding-left: 9px;
            display: inline-block;
          "
          type="link"
          @click="downloadTemplateHandler"
          >下载模版</tg-button
        >
        <!-- 下载原始数据 -->
        <tg-button
          v-if="DataForm.order_file"
          type="link"
          style="
            margin: 0 9px;
            display: inline-block;
            border-left: 1px solid rgba(164, 178, 194, 0.3);
            padding-left: 9px;
            display: inline-block;
          "
          @click="downloadFileHandler(DataForm.order_file)"
          >下载原始数据</tg-button
        >
        <el-tooltip
          v-else
          style="
            margin: 0 9px;
            display: inline-block;
            border-left: 1px solid rgba(164, 178, 194, 0.3);
            padding-left: 9px;
            display: inline-block;
          "
          content="上传数据后支持下载"
          placement="top"
          effect="light"
        >
          <tg-button type="link" :disabled="true">下载原始数据</tg-button>
        </el-tooltip>
      </div></template
    >
    <template #button>
      <tg-button @click="prev">上一步</tg-button>
      <tg-button type="primary" @click="next">下一步</tg-button>
    </template>
    <template #mask>
      <tg-mask-loading :visible="saveLoading" content="正在保存，请稍候..." />
    </template>
  </SettlementStep2Layout>
</template>

<script src="./step2.douyin.ts"></script>

<style lang="less">
.settlement-step2-shoplive {
  .step2-content-three {
    grid-template-rows: 118px 350px 0px !important;
    .adjust-account-content {
      grid-template-rows: 44px 246px !important;
    }
    .commission-block {
      height: 350px;
    }
  }
  .commission-block {
    border: 1px solid rgba(164, 178, 194, 0.3);
    border-radius: 2px;
    height: 320px;
    position: relative;
    min-width: 280px;
  }

  .service-fee-block {
    border: 1px solid rgba(164, 178, 194, 0.3);
    border-radius: 2px;
    height: 320px;
    position: relative;
  }

  .selfsettelement {
    .el-form-item__label {
      padding-right: 0 !important;
    }
  }
  .footer {
    width: 100%;
    height: 42px;
    line-height: 42px;
    text-align: center;
    bottom: 0;
    position: absolute;
  }
  .newfooter {
    width: 100%;
    text-align: left;
    height: 18px;
    line-height: 18px;
    margin-bottom: 0px;
    margin-top: 5px;
    position: absolute;
  }

  .header {
    width: 100%;
    height: 40px;
    text-indent: 18px;
    background: rgba(164, 178, 194, 0.09);
    line-height: 40px;

    .label {
      color: var(--text-color);
      font-weight: 600;
      font-size: 14px;
    }
    .desc {
      font-size: 12px;
      color: var(--text-third-color);
      padding-left: 12px;
    }
  }
}
</style>
