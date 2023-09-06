<!--
 * @Brief: 结算数据-拆分后
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-12-07 10:03:49
-->

<template>
  <SettlementStep2Layout
    class="tg-cost-mcn-douyin-step2-after-container"
    :amount="total_amount_str"
  >
    <template #top>
      <top-card
        :amount="total_amount"
        type="value1"
        :tax_rate_disabled="false"
        :tax_rate="DataForm.tax_rate"
        :invoice_type="DataForm.invoice_type"
        @taxRateChanged="taxRateChanged"
        @invoiceTypeChanged="invoiceTypeChangedHandler"
        @valueChange="taxValueChangeHandler"
      ></top-card>
    </template>
    <template #left>
      <CardLayout class="cost-info" :padding="[0, 20]">
        <template #title>
          <span>{{ settlement.company_name }}</span>
        </template>
        <template>
          <div class="amount-info-list">
            <div v-for="(item, itemIdx) in feeNameTypes" :key="itemIdx">
              <div v-if="amountDetail(item.type)">
                <div class="input-row mgt-16">
                  <span class="label">{{ item.name }}：</span>
                  <el-input
                    placeholder="填写成本"
                    :value="income_amount(item.type)"
                    @input="val => onIncomeAmountChanged(val, item.type)"
                    style="width: 240px; margin: 0 32px 0 4px"
                    :disabled="item.type === 8 && isYuFengCompany"
                  >
                    <template slot="append">元</template>
                  </el-input>
                  <tg-button
                    v-if="item.type === 1 || (item.type === 8 && isYuFengCompany)"
                    type="link"
                    @click="downDetail(item.type)"
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
                    v-if="remark(item.type)"
                    style="width: 360px; height: 80px; margin-left: 60px; margin-top: 12px"
                  ></el-input>
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
          :adjust_info="DataForm.adjust_info"
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
@charset 'utf-8';

.tg-cost-mcn-douyin-step2-after-container {
  .step2-cost-layout-content {
    grid-template-rows: 118px 380px !important;
    .adjust-account-content {
      grid-template-rows: 44px 276px !important;
    }
  }
  .cost-info {
    .amount-info-list {
      padding: 6px 0 18px 0;
      .input-row {
        display: flex;
        align-items: center;
        line-height: 28px;
        font-size: 12px;
        .el-input,
        .el-input-group--append .el-input__inner {
          line-height: 27px;
          height: 28px;
          font-size: 12px;
        }
        .el-input-group__append {
          line-height: 26px;
          height: 27px;
        }
        .el-input__inner {
          color: var(--text-color);
        }
      }
      .el-textarea {
        .el-textarea__inner {
          width: 360px;
          height: 65px;
          color: var(--text-color);
          line-height: 24px;
          font-size: 12px;
        }
      }
      .label {
        width: 60px;
        text-align: right;
        color: var(--text-second-color);
      }
    }
  }
}
</style>
