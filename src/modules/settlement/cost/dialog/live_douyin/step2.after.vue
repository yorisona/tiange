<template>
  <Step2Layout
    class="settlement-step2-shoplive-after"
    :amount="total_amount_str"
    :douyinLiveSelf="true"
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
          <span>{{ DataForm.company_name }}</span>
        </template>
        <template>
          <div class="amount-info-list" style="padding-top: 0px">
            <div v-for="(item, itemIdx) in feeNameTypes" :key="itemIdx">
              <div v-if="item.type !== 9 && amountDetail(item.type)">
                <div class="input-row mgt-24">
                  <span class="label">{{ item.name }}：</span>
                  <el-input
                    placeholder="填写成本"
                    :value="income_amount(item.type)"
                    @input="val => onIncomeAmountChanged(val, item.type)"
                    style="width: 240px; margin: 0 32px 0 0"
                    :disabled="item.type === 8 && isYuFengCompany && DataForm.business_type !== 8"
                  >
                    <template slot="append">元</template>
                  </el-input>
                  <tg-button
                    v-if="item.type === 8 && isYuFengCompany && DataForm.business_type !== 8"
                    type="link"
                    @click="downDetail()"
                    >下载明细</tg-button
                  >
                  <!-- <tg-button type="link" @click="downPitFeeDetail">下载明细</tg-button> -->
                </div>
                <div>
                  <el-input
                    :value="remark(item.type)"
                    type="textarea"
                    placeholder="请输入收入说明"
                    :maxlength="50"
                    resize="none"
                    @input="val => remarkChanged(val, item.type)"
                    v-if="remark(item.type) || item.type === 6 || item.type === 15"
                    style="width: 360px; height: 80px; margin-left: 80px; margin-top: 12px"
                  ></el-input>
                </div>
              </div>
              <div v-if="item.type === 9 && amountDetail(item.type)">
                <div class="input-row mgt-18">
                  <div
                    class="label"
                    style="height: 28px; line-height: 28px; align-self: flex-start"
                  >
                    {{ item.name }}：
                  </div>
                  <div class="AnchorListBlock" ref="root" style="width: 600px">
                    <el-form
                      ref="formRef"
                      :model="DataForm"
                      @submit.native.prevent
                      size="mini"
                      label-width="76px"
                    >
                      <div style="height: 145px">
                        <template>
                          <div class="OneItem">
                            <div style="height: 28px; line-height: 28px">
                              <div style="display: inline-block; margin-left: 12px">
                                <span style="font-weight: 600"
                                  >{{ company_kol_service_amount_str }} 元</span
                                >
                              </div>
                            </div>
                            <div
                              style="
                                height: 28px;
                                line-height: 28px;
                                display: flex;
                                justify-content: space-between;
                              "
                            >
                              <div>
                                <div class="label" style="width: 82px">主播服务费：</div>
                                <span class="name-bold">{{ kol_service_amount_str }} 元</span>
                              </div>

                              <div style="display: inline-block; float: right">
                                <tg-button
                                  type="link"
                                  @click="downloadKolServiceFeeFile('主播费用清单.xlsx')"
                                  >下载<span style="color: var(--text-second-color)"
                                    >主播费用清单</span
                                  ></tg-button
                                >&nbsp;&nbsp;
                                <tg-button
                                  type="link"
                                  @click="downloadKolScheduleFile('主播排班明细.xlsx')"
                                  >下载<span style="color: var(--text-second-color)"
                                    >主播排班明细</span
                                  ></tg-button
                                >
                              </div>
                            </div>
                            <div style="height: 28px; line-height: 28px; margin-left: 6px">
                              <div class="label" style="width: 100px">服务费收取方式：</div>
                              <el-input
                                placeholder=""
                                v-model="service_fee_value"
                                class="input-with-select"
                                style="width: 280px"
                                size="small"
                                @input="CompanyServiceRateInput"
                              >
                                <el-select
                                  popper-class="el-select-popper-mini"
                                  v-model="DataForm.company_service_type"
                                  slot="prepend"
                                  placeholder="请选择"
                                  style="width: 120px"
                                  size="mini"
                                >
                                  <el-option label="抽成服务费" value="1"></el-option>
                                  <el-option label="固定费用" value="2"></el-option>
                                </el-select>
                                <div slot="append">
                                  <span v-if="DataForm.company_service_type === '1'">%</span
                                  ><span v-else>元</span>
                                </div>
                              </el-input>
                            </div>
                            <div style="display: inline-block; height: 28px; line-height: 28px">
                              <div class="label" style="width: 82px">机构服务费：</div>
                              <span class="name-bold">{{
                                company_service_amount_str || '0.00'
                              }}</span>
                            </div>
                          </div>
                        </template>
                      </div>
                    </el-form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </CardLayout>
    </template>

    <template #right>
      <div>
        <el-form @submit.native.prevent size="small" label-width="68px">
          <TgAdjustAccountForm
            v-if="ShowAdjustInfo"
            ExtendItem="LiveDouyinSelfAfter"
            :ExtendItemSelectOptions="selectedAllCompanyList"
            :adjust_info="DataForm.adjust_info"
            @dataChange="onAdjustAccountDataChange"
            :height="380"
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
@import '~@/styles/utils/index.less';
.settlement-step2-shoplive-after {
  .adjust-account-content {
    .el-select,
    .el-input {
      width: 198px;
    }
  }
  .cost-info {
    .amount-info-list {
      font-size: 12px;
      padding: 6px 0 18px 0;
      .input-row {
        display: flex;
        align-items: center;
        .el-input__inner {
          height: 28px;
          line-height: 26px;
          font-size: 12px;
        }
        .el-input-group__append {
          font-size: 12px;
        }
      }
      .el-textarea {
        .el-textarea__inner {
          width: 360px;
          height: 80px;
          line-height: 26px;
          font-size: 12px;
        }
      }
      .label {
        width: 80px;
        text-align: right;
        color: var(--text-second-color);
      }
    }
  }
  .AnchorListBlock {
    margin-top: 0px;
    height: 122px;
  }

  .settlement-left-block {
    overflow-y: auto;
  }

  .shoplive-form-item {
    display: flex;
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }

  .el-input-group__append {
    padding: 0 12px;
    text-align: center;
  }

  .OneItem {
    padding: 0 0 18px 0;

    font-size: 12px;
    .label {
      color: var(--text-second-color);
      font-size: 12px;
      width: fit-content;
      text-align: right;
      display: inline-block;
    }
    .name-bold {
      color: var(--text-color);
      font-size: 14px;
      font-weight: 600;
    }
    .input-with-select {
      .el-input-group__prepend {
        width: 110px;
        .el-select {
          padding-left: 6px;
        }
      }
      .el-input__inner {
        line-height: 26px !important;
        height: 28px !important;
        color: var(--text-color);
        font-size: 12px;
      }
    }
  }

  // 骨架屏
  .one-item-skeleton-screen {
    display: grid;
    grid-template-areas:
      'a1 . .'
      'b1 . .'
      'c1 c2 c3'
      'd1 . .';
    row-gap: 12px;
    column-gap: 4px;
    .pd(18px 0);
    border-top: 1px dashed rgba(164, 178, 194, 0.3);
    > .skeleton-screen-item {
      height: 32px;
      display: flex;
      @color1: fade(#6a7b92, 20);
      @color2: fade(#6a7b92, 10);
      > .skeleton-screen-item-label {
        height: 18px;
        .mgr(12px);
        background-image: linear-gradient(to right, @color1 0%, @color2 50%, @color1 100%);
        animation-duration: 30s;
        animation-iteration-count: infinite;
        animation-name: skeleton-screen-loading;
        animation-timing-function: linear;
        transition: 0.3s;
      }
      > .skeleton-screen-item-content {
        height: 18px;
        background-image: linear-gradient(to right, @color1 0%, @color2 50%, @color1 100%);
        animation-duration: 30s;
        animation-iteration-count: infinite;
        animation-name: skeleton-screen-loading;
        animation-timing-function: linear;
        transition: 0.3s;
      }
      &.a1 {
        grid-area: a1;
        .pdl(24px);
        > .skeleton-screen-item-label {
          width: 40px;
        }
        > .skeleton-screen-item-content {
          width: 40px;
        }
      }
      &.b1 {
        grid-area: b1;
        > .skeleton-screen-item-label {
          width: 64px;
        }
        > .skeleton-screen-item-content {
          width: 164px;
        }
      }
      &.c1 {
        grid-area: c1;
        .pdl(24px);
        > .skeleton-screen-item-label {
          width: 40px;
        }
        > .skeleton-screen-item-content {
          width: 164px;
        }
      }
      &.c2 {
        grid-area: c2;
        .pdl(19px);
        > .skeleton-screen-item-label {
          width: 45px;
        }
        > .skeleton-screen-item-content {
          width: 150px;
        }
      }
      &.c3 {
        grid-area: c3;
        > .skeleton-screen-item-label {
          width: 64px;
        }
        > .skeleton-screen-item-content {
          width: 60px;
        }
      }
      &.d1 {
        grid-area: d1;
        .pdl(24px);
        > .skeleton-screen-item-label {
          width: 40px;
        }
        > .skeleton-screen-item-content {
          width: 60px;
        }
      }
    }
  }
}

.el-popover.kol-tips-popper {
  line-height: 24px;
  font-size: 12px;
  padding: 10px 18px 8px 18px;
}

@keyframes skeleton-screen-loading {
  0% {
    background-position: -400px 0;
  }

  100% {
    background-position: 400px 0;
  }
}

.settlement-step2-shoplive-after .el-input {
  color: var(--text-color);
}
</style>
