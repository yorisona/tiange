<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-06-03 09:40:49
-->
<template>
  <!-- <div class="tg-cost-mcn-vtask-step2-after-container"> -->
  <SettlementStep2Layout class="tg-cost-mcn-vtask-step2-after-container" :amount="total_amount_str">
    <template #top>
      <top-card
        :amount="total_amount_str"
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
          <span>成本信息</span>
        </template>
        <!-- <template #desc>
          <span>机构成本 =所有达人（（收入-支出-退款）＊（1-机构扣点% + 税点%））</span>
        </template> -->
        <template>
          <el-form label-width="60px" size="mini" class="tg-cost-vtask-form" v-model="DataForm">
            <div
              class="inline-form-items"
              style="
                height: 50px;
                align-items: center;
                border-bottom: 1px dashed rgba(164, 178, 194, 0.3);
              "
            >
              <el-form-item label="" style="width: 528px" label-width="0">
                <span class="item-value" style="color: var(--text-color); font-weight: 600">{{
                  DataForm.company_name
                }}</span>
                <span class="mgl-18" style="color: #ff7a36; font-weight: 600"
                  >机构成本 {{ formatAmount(total_cost_amount, 'None') }} 元</span
                >
              </el-form-item>
              <div style="height: 28px; line-height: 28px">
                <tg-button type="link" :href="kolDataUrl" v-if="kolDataUrl" download=""
                  >下载</tg-button
                >
                <span class="kol-data" style="color: var(--text-third-color); font-size: 12px"
                  >达人数据(共{{ DataForm.kol_list ? DataForm.kol_list.length : 0 }}人)</span
                >
              </div>
            </div>

            <div
              v-for="(kol, kol_index) in DataForm.kol_list"
              :key="kol_index"
              style="
                border-bottom: 1px dashed rgba(164, 178, 194, 0.3);
                padding-bottom: 18px;
                padding-top: 8px;
              "
            >
              <div class="inline-form-items" style="margin: 0">
                <el-form-item :label="`达人${kol_index + 1}`">
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                    :content="kol.kol_name"
                    :open-delay="300"
                    :disabled="kol.kol_name.length < 10"
                  >
                    <span slot="reference" class="item-value line-clamp-1" style="width: 158px"
                      >{{ kol.kol_name }}
                    </span>
                  </el-popover>
                </el-form-item>
                <el-form-item label="原始收入">
                  <span class="item-value" style="width: 125px; display: inline-block"
                    >{{ formatAmount(kol.income_amount, 'None') }} 元</span
                  >
                </el-form-item>
                <el-form-item label="原始支出">
                  <span class="item-value">{{ formatAmount(kol.spend_amount, 'None') }} 元</span>
                </el-form-item>
              </div>
              <div class="inline-form-items">
                <el-form-item label="退款金额">
                  <el-input
                    @input="RefundAmountInput($event, kol)"
                    placeholder="0.00"
                    v-model="kol.tkje"
                  >
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="机构税点" class="mgl-12">
                  <el-input
                    @input="CompanyTaxRateInput($event, kol)"
                    placeholder="0.00"
                    maxlength="6"
                    v-model.trim="kol.jgkd"
                  >
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="税点" label-width="40px" style="margin-left: 8px">
                  <el-input
                    @input="TaxRateInput($event, kol)"
                    maxlength="6"
                    placeholder="0.00"
                    v-model.trim="kol.sd"
                  >
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </template>
      </CardLayout>
    </template>
    <template #right>
      <el-form @submit.native.prevent size="small">
        <TgAdjustAccountForm
          v-if="ShowAdjustInfo"
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
  <!-- </div> -->
</template>

<script src="./step2.after.ts"></script>
<style lang="less">
@import './step2.after.less';
</style>
