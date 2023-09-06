<template>
  <SettlementStep2Layout
    class="settlement-step2-shoplive"
    :amount="formatted_total_amount"
    :incomeType="cooperation_type === 2 ? 2 : 3"
    v-loading="uploadLoading"
  >
    <!-- 淘宝店播 服务费 -->
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
        @valueChange="taxValueChangeHandler"
      ></top-card>
    </template>
    <template #left>
      <div>
        <el-form @submit.native.prevent :model="DataForm" size="mini" label-width="54px">
          <div class="service-fee-block">
            <div class="header">
              <span class="label">服务费</span>
              <span class="desc">服务费 = 单价 * 时长</span>
            </div>
            <div style="padding: 0 18px">
              <el-form-item label="服务费：" class="mgt-16 text-item">
                <span style="color: var(--text-color); font-weight: 600; line-height: 20px">{{
                  service_amount_str
                }}</span>
              </el-form-item>
              <el-form-item label="单价：" class="mgt-12">
                <el-input
                  @input="UnitPriceInput"
                  placeholder="0.00"
                  maxlength="12"
                  v-model.trim="DataForm.unit_price"
                  ><span slot="append">元/时</span></el-input
                >
              </el-form-item>
              <el-form-item label="总时长：" class="mgt-12">
                <span style="color: var(--text-color); font-size: 12px"
                  >{{ DisplayForm.total_live_num }}场 {{ DisplayForm.total_duration }}小时</span
                >
              </el-form-item>
            </div>
            <div class="footer" v-if="cooperation_type !== 2">
              <!-- 下载原始数据 -->
              <tg-button type="link" @click="downloadShopLiveTimeFile">下载原始数据</tg-button>
            </div>
          </div>
        </el-form>
      </div>
    </template>

    <!-- 淘宝店播 佣金 -->
    <template #center>
      <div>
        <el-form @submit.native.prevent :model="DataForm" size="mini" label-width="68px">
          <div class="commission-block">
            <div class="header">
              <span class="label">佣金</span>
              <span class="desc">佣金 = 种草金额 * (1-退货率) * 佣金比例</span>
            </div>
            <div style="padding: 0 18px">
              <el-form-item label="佣金：" class="mgt-16 text-item">
                <span style="color: var(--text-color); font-weight: 600; line-height: 20px">{{
                  commission_str
                }}</span>
              </el-form-item>
              <el-form-item label="佣金比例：" class="mgt-12">
                <el-input
                  @input="CommissionRateInput"
                  maxlength="6"
                  placeholder="0.00"
                  v-model.trim="DataForm.commission_rate"
                  ><span slot="append">%</span></el-input
                >
              </el-form-item>
              <el-form-item label="退货率：" class="mgt-12">
                <el-input
                  @input="RefundRateInput"
                  maxlength="6"
                  placeholder="0.00"
                  v-model.trim="DataForm.refund_rate"
                  ><span slot="append">%</span></el-input
                >
              </el-form-item>
              <el-form-item label="种草金额：" class="mgt-12">
                <span style="color: var(--text-color); font-size: 12px">{{
                  recommend_amount_str
                }}</span>
              </el-form-item>
            </div>
            <div class="footer" v-if="cooperation_type !== 2">
              <!-- 下载原始数据 -->
              <tg-button
                v-if="DataForm.recommend_file"
                type="link"
                @click="downloadFileHandler(DataForm.recommend_file)"
                >下载原始数据</tg-button
              >
              <el-tooltip
                v-else
                style="display: inline-block"
                content="上传数据后支持下载"
                placement="top"
                effect="light"
              >
                <tg-button :disabled="true" type="link">下载原始数据</tg-button>
              </el-tooltip>
              <el-upload
                style="margin: 0 18px; display: inline-block"
                action="/"
                :multiple="false"
                :show-file-list="false"
                :http-request="uploadFileHandler"
              >
                <tg-button type="link">上传数据</tg-button>
              </el-upload>
              <tg-button type="link" @click="downloadTemplateHandler">下载模版</tg-button>
            </div>
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
      <div class="newtbfooter">
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
          v-if="DataForm.recommend_file"
          style="
            margin: 0 9px;
            display: inline-block;
            border-left: 1px solid rgba(164, 178, 194, 0.3);
            padding-left: 9px;
            display: inline-block;
          "
          type="link"
          @click="downloadFileHandler(DataForm.recommend_file)"
          >下载原始数据</tg-button
        >
        <el-tooltip v-else content="上传数据后支持下载" placement="top" effect="light">
          <tg-button
            style="
              margin: 0 9px;
              display: inline-block;
              border-left: 1px solid rgba(164, 178, 194, 0.3);
              padding-left: 9px;
              display: inline-block;
            "
            :disabled="true"
            type="link"
            >下载原始数据</tg-button
          >
        </el-tooltip>
      </div>
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

<script src="./step2.taobao.ts"></script>

<style lang="less">
.settlement-step2-shoplive {
  .el-form .text-item.el-form-item--mini .el-form-item__content > span {
    padding: 0;
  }
  .step2-content-three {
    grid-template-rows: 118px 350px 0px !important;
    .adjust-account-content {
      grid-template-rows: 44px 246px !important;
    }
    .commission-block,
    .service-fee-block {
      height: 350px;
    }
  }
  .commission-block {
    border: 1px solid rgba(164, 178, 194, 0.3);
    border-radius: 2px;
    height: 320px;
    position: relative;

    .el-form .el-form-item__label {
      padding-right: 12px;
    }
  }

  .service-fee-block {
    border: 1px solid rgba(164, 178, 194, 0.3);
    border-radius: 2px;
    height: 320px;
    position: relative;

    .el-form .el-form-item__label {
      padding-right: 0;
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
  .newtbfooter {
    width: 100%;
    text-align: left;
    height: 18px;
    line-height: 18px;
    margin-bottom: 0px;
    margin-top: 5px;
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
