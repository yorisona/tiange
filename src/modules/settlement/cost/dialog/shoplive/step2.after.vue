<template>
  <Step2Layout class="settlement-step2-shoplive-after" :amount="total_amount_str">
    <template #top>
      <top-card
        :amount="total_amount"
        type="value1"
        :tax_rate_disabled="false"
        :invoice_type="DataForm.invoice_type"
        @taxRateChanged="taxRateChanged"
        @invoiceTypeChanged="invoiceTypeChangedHandler"
        @valueChange="taxValueChangeHandler"
      ></top-card>
    </template>
    <template #left>
      <CardLayout
        v-loading="fill_form_loading"
        class="settlement-left-block"
        element-loading-background="rgba(0, 0, 0, 0.25)"
      >
        <template #title>成本信息</template>
        <!-- <template #desc>
          <div style="cursor: pointer; line-height: 14px; height: 14px; margin-left: -6px">
            总结算金额 = 主播服务费 + 机构服务费
          </div>
        </template> -->
        <div class="AnchorListBlock" ref="root">
          <el-form
            ref="formRef"
            :model="DataForm"
            @submit.native.prevent
            size="small"
            label-width="76px"
          >
            <div style="height: 195px">
              <template>
                <div class="OneItem">
                  <div style="height: 28px; line-height: 28px">
                    <div style="display: inline-block">
                      <div class="label" style="width: 100px">机构：</div>
                      <span class="name-bold">{{ DataForm.company_name }}</span>
                    </div>
                    <div style="display: inline-block; float: right">
                      <tg-button type="link" @click="downloadKolServiceFeeFile('主播费用清单.xlsx')"
                        >下载<span style="color: var(--text-second-color)"
                          >主播费用清单</span
                        ></tg-button
                      >&nbsp;&nbsp;
                      <tg-button type="link" @click="downloadKolScheduleFile('主播排班明细.xlsx')"
                        >下载<span style="color: var(--text-second-color)"
                          >主播排班明细</span
                        ></tg-button
                      >
                    </div>
                  </div>
                  <div style="margin-top: 12px; height: 28px; line-height: 28px">
                    <div class="label" style="width: 100px">主播服务费：</div>
                    <span class="name-bold">{{ kol_service_amount_str }} 元</span>
                  </div>
                  <div style="margin-top: 12px; height: 28px; line-height: 28px">
                    <div class="label" style="width: 100px">服务费收取方式：</div>
                    <el-input
                      placeholder=""
                      v-model="service_fee_value"
                      class="input-with-select"
                      style="width: 280px"
                      @input="CompanyServiceRateInput"
                    >
                      <el-select
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
                  <div
                    style="display: inline-block; margin-top: 12px; height: 28px; line-height: 28px"
                  >
                    <div class="label" style="width: 100px">机构服务费：</div>
                    <span class="name-bold">{{ company_service_amount_str }}</span>
                  </div>
                </div>
              </template>
            </div>
          </el-form>
        </div>
      </CardLayout>
    </template>

    <template #right>
      <div>
        <el-form @submit.native.prevent size="mini" label-width="68px">
          <TgAdjustAccountForm
            :height="380"
            v-if="ShowAdjustInfo"
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
@import '~@/styles/utils/index.less';
.settlement-step2-shoplive-after {
  .AnchorListBlock {
    margin-top: 0px;
    height: 372px;
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
      font-size: 14px;
      font-weight: 600;
      color: var(--text-color);
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
