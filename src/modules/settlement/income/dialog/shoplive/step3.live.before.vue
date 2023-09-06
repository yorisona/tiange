<template>
  <SettlementStep3Layout
    class="settlement-step3-shoplive"
    :class="[
      isTaobaoShopLiveType === false && cooperation_type === 1 ? 'settlement-douyin-live' : '',
      injectSettlement.is_estimate === 1 && isTaobaoShopLiveType ? 'is_estimate' : '',
    ]"
    :amount="format_total_amout"
  >
    <template #top>
      <top-card
        :is_cost="false"
        :amount="total_amount"
        :name="DisplayForm.company_name"
        :taxed="DataForm.is_include_tax"
        :invoice_type="DataForm.invoice_type"
        :tax_rate="DataForm.tax_rate"
        type="value2"
      ></top-card>
    </template>
    <template v-if="isTaobaoShopLiveType" #left>
      <div>
        <div class="service-fee-block">
          <div class="header">
            <span class="label">服务费</span>
            <span class="desc">服务费 = 单价 * 时长</span>
          </div>
          <div
            style="
              margin: 18px;
              padding: 0;
              line-height: 18px;
              height: 18px;
              color: var(--text-color);
              font-size: 14px;
              font-weight: 600;
            "
          >
            {{ service_amount_str }}
          </div>
        </div>
      </div>
    </template>
    <!-- 抖音 -->
    <template v-else #left>
      <div>
        <div
          class="commission-block"
          :style="{
            height:
              injectSettlement.is_estimate === 1 && isTaobaoShopLiveType
                ? '350px'
                : isTaobaoShopLiveType === false && cooperation_type === 1
                ? '250px'
                : '220px',
          }"
        >
          <div class="header">
            <span class="label">收入信息</span>
            <!-- <span class="desc">佣金 = 销售金额*佣金比例</span> -->
          </div>
          <div v-if="DataForm.business_type === 8" style="padding: 18px">
            <div
              style="
                margin-top: 12px;
                font-size: 12px;
                color: var(--text-color);
                line-height: 20px;
                height: 20px;
                display: flex;
              "
            >
              <div style="width: 60px; text-align: right; display: inline-block">佣金</div>
              <div
                style="
                  margin-left: 8px;
                  font-weight: 600;
                  font-size: 14px;
                  color: var(--text-color);
                  padding-top: 1px;
                  display: inline-block;
                "
              >
                {{ commission_str }}
              </div>
            </div>
            <div style="display: flex">
              <div
                style="
                  margin-top: 12px;
                  font-size: 12px;
                  color: var(--text-color);
                  line-height: 18px;
                  height: 18px;
                  display: inline-block;
                  width: 60px;
                  text-align: right;
                "
              >
                服务费
              </div>
              <div
                style="
                  margin-top: 12px;
                  font-size: 14px;
                  color: var(--text-color);
                  font-weight: 600;
                  line-height: 20px;
                  height: 20px;
                  display: inline-block;
                  margin-left: 4px;
                "
              >
                &nbsp;{{ Decimal2String(DataForm.service_amount) }} 元
              </div>
            </div>
          </div>
          <div v-else style="padding: 16px 18px">
            <div
              v-if="RawFillForm && RawFillForm.record_count"
              style="
                font-size: 12px;
                height: 16px;
                line-height: 16px;
                margin-bottom: 12px;
                color: var(--text-third-color);
              "
            >
              共 {{ DisplayForm.record_count }} 条记录
            </div>
            <template
              v-if="RawFillForm && (RawFillForm.sale_amount || RawFillForm.commission_rate)"
            >
              <div
                style="
                  color: var(--text-color);
                  height: 18px;
                  line-height: 18px;
                  font-size: 12px;
                  font-weight: 400;
                  margin-bottom: 10px;
                "
              >
                <template v-if="cooperation_type !== 2">合计净销额</template
                ><template v-else>合计销售金额</template
                ><span
                  style="
                    margin-left: 4px;
                    color: var(--text-color);
                    font-style: normal;
                    font-weight: 600;
                    font-size: 14px;
                  "
                  >{{ DataForm.sale_amount }} 元</span
                >
              </div>
              <div
                style="
                  margin-bottom: 4px;
                  font-size: 12px;
                  color: var(--text-color);
                  line-height: 18px;
                  height: 18px;
                "
              >
                佣金
              </div>
              <div
                style="
                  font-size: 12px;
                  color: var(--text-color);
                  line-height: 22px;
                  height: 44px;
                  margin-bottom: 10px;
                "
              >
                = {{ commission_formula_str }} <br />=
                <span style="font-weight: 600; font-size: 14px">{{ commission_str }}</span>
              </div>
            </template>
            <div v-if="RawFillForm && RawFillForm.service_amount" style="display: flex">
              <div
                style="
                  margin-bottom: 10px;
                  font-size: 12px;
                  color: var(--text-color);
                  line-height: 18px;
                  height: 18px;
                  display: inline-block;
                "
              >
                服务费
              </div>
              <div
                style="
                  margin-bottom: 10px;
                  font-size: 14px;
                  color: var(--text-color);
                  font-weight: 600;
                  line-height: 20px;
                  height: 20px;
                  display: inline-block;
                "
              >
                &nbsp;{{ Decimal2String(DataForm.service_amount) }} 元
              </div>
            </div>
            <div
              v-if="RawFillForm && RawFillForm.marketing_advertising_amount"
              style="display: flex"
            >
              <div
                style="
                  margin-bottom: 10px;
                  font-size: 12px;
                  color: var(--text-color);
                  line-height: 18px;
                  height: 18px;
                  display: inline-block;
                  text-align: left;
                "
              >
                营销/商广
              </div>
              <div
                style="
                  font-size: 14px;
                  color: var(--text-color);
                  font-weight: 600;
                  line-height: 20px;
                  height: 20px;
                  display: inline-block;
                  margin-left: 4px;
                "
              >
                &nbsp;{{ Decimal2String(DataForm.marketing_advertising_amount) }} 元
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="isTaobaoShopLiveType" #center>
      <div>
        <div class="commission-block">
          <div class="header">
            <span class="label">佣金</span>
            <span class="desc">佣金 = 种草金额*(1-退货率)*佣金比例</span>
          </div>
          <div style="padding: 18px">
            <div
              style="
                font-size: 12px;
                height: 16px;
                line-height: 16px;
                color: var(--text-third-color);
              "
            >
              共 {{ DisplayForm.record_count }} 条记录
            </div>
            <div
              style="
                margin-top: 6px;
                color: var(--text-color);
                height: 18px;
                line-height: 18px;
                font-size: 12px;
                font-weight: 400;
              "
            >
              合计种草成交金额
              <span
                style="
                  color: var(--text-color);
                  font-style: normal;
                  font-weight: 600;
                  font-size: 14px;
                "
              >
                {{ recommend_amount_str }}</span
              >
            </div>
            <div
              style="
                margin-top: 18px;
                font-size: 12px;
                color: var(--text-color);
                line-height: 18px;
                height: 18px;
              "
            >
              佣金
            </div>
            <div
              style="
                margin-top: 6px;
                font-size: 12px;
                color: var(--text-color);
                line-height: 22px;
                height: 44px;
              "
            >
              = {{ commission_formula_str }} <br />=
              <span style="font-weight: 600; font-size: 14px">{{ commission_str }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #right>
      <div>
        <div
          class="adjust-info-block"
          :style="{
            height:
              injectSettlement.is_estimate === 1 && isTaobaoShopLiveType
                ? '350px'
                : isTaobaoShopLiveType === false && cooperation_type === 1
                ? '250px'
                : '220px',
          }"
        >
          <div class="header">
            <span class="label">手工调账</span>
          </div>
          <div style="overflow: auto; height: 178px">
            <div
              style="
                padding: 0 18px;
                margin-top: 18px;
                font-size: 12px;
                height: 16px;
                line-height: 16px;
                color: var(--text-third-color);
              "
            >
              调账 {{ DataForm.adjust_info.length }} 笔
            </div>
            <div
              style="
                padding: 0 18px;
                margin-top: 6px;
                color: var(--text-color);
                font-size: 14px;
                line-height: 18px;
                height: 18px;
                font-weight: 600;
              "
            >
              共 {{ total_adjust_amount }} 元
            </div>
            <div style="margin-top: 11px; font-size: 12px">
              <div style="padding: 0 18px">
                <div style="border-top: 1px dashed rgba(164, 178, 194, 0.3)"></div>
              </div>
              <div style="padding: 0 18px 18px 18px">
                <div
                  v-for="(item, index) in DataForm.adjust_info"
                  :key="index"
                  style="
                    display: flex;
                    margin-top: 12px;
                    color: var(--text-third-color);
                    line-height: 16px;
                  "
                >
                  <div style="text-align: center; flex-shrink: 0">{{ index + 1 }}.&nbsp;</div>
                  <div>
                    调整金额：{{ formatAmountWithoutPrefix(item.adjust_amount) }} 元；调整原因：{{
                      item.adjust_reason
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #files v-if="injectSettlement.is_estimate !== 1">
      <div class="file-info-block">
        <div style="display: flex" v-if="isTaobaoShopLiveType">
          <div class="file-item" v-if="live_file_str">
            <div class="label">时长文件：</div>
            <div class="fileItem">
              <FileItem
                :showPreview="false"
                :key="10000"
                :filepath="live_file_str"
                :readonly="true"
              />
            </div>
          </div>
          <div class="file-item" v-if="recommend_file_str">
            <div class="label">种草文件：</div>
            <div class="fileItem">
              <FileItem
                :showPreview="false"
                :key="10001"
                :filepath="recommend_file_str"
                :readonly="true"
              />
            </div>
          </div>
        </div>
        <!-- 抖音 -->
        <div class="file-item" v-if="!isTaobaoShopLiveType && order_file_str">
          <div class="label">订单文件：</div>
          <div class="fileItem" v-if="order_file_str">
            <FileItem
              :showPreview="false"
              :key="10002"
              :filepath="order_file_str"
              :readonly="true"
            />
          </div>
        </div>
      </div>
    </template>
    <template #button>
      <tg-button @click="prev">上一步</tg-button>
      <tg-button type="primary" @click="next">生成结算单</tg-button>
    </template>
    <template #mask>
      <tg-mask-loading :visible="saveLoading" content="正在保存，请稍候..." />
    </template>
  </SettlementStep3Layout>
</template>

<script src="./step3.live.before.ts"></script>

<style lang="less">
.settlement-step3-shoplive {
  &.is_estimate {
    .step3-layout-content {
      grid-template-rows: 115px 350px auto !important;
      .service-fee-block,
      .commission-block {
        height: 350px;
      }
    }
  }
  .commission-block {
    border: 1px solid rgba(164, 178, 194, 0.3);
    border-radius: 2px;
    position: relative;
    height: 220px;
  }

  .service-fee-block {
    border: 1px solid rgba(164, 178, 194, 0.3);
    border-radius: 2px;
    position: relative;
    height: 220px;
  }
  .adjust-info-block {
    border: 1px solid rgba(164, 178, 194, 0.3);
    border-radius: 2px;
    position: relative;
    height: 220px;
  }

  .el-form .el-form-item__label {
    padding-right: 0 !important;
    width: 72px;
  }

  .footer {
    width: 100%;
    height: 42px;
    line-height: 42px;
    text-align: center;
    bottom: 0;
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

  // 文件区块
  .file-info-block {
    width: 100%;
    min-width: 620px;
    margin-left: 8px;
    .file-item {
      width: 100%;
      display: flex;
      line-height: 20px;
      height: 20px;
      font-size: 12px;
      color: var(--text-second-color);
      font-weight: 400;
      margin: 12px 0;

      .label {
        width: 72px;
        line-height: 20px;
        height: 20px;
        display: flex;
        flex-shrink: 0;
        color: var(--text-second-color);
        padding-left: 12px;
      }

      .fileItem {
        font-size: 14px;
        color: var(--text-color);
        text-align: left;
        line-height: 20px;
        height: 20px;
        font-weight: 400;

        display: flex;
        margin-bottom: 12px;
        svg {
          float: left;
          width: 16px;
          line-height: 20px;
          height: 16px;
        }
        div {
          float: left;
          padding: 0;
          margin: 0;
        }
      }
    }

    .statements-file-block {
      width: 100%;
      display: flex;
      font-size: 14px;
      color: var(--text-third-color);
      font-weight: 400;

      .label {
        width: 72px;
        line-height: 28px;
        height: 28px;
        font-size: 12px;
        text-align: right;
        // padding-left: 6px;
        // display: flex;
        flex-shrink: 0;
      }

      .statements-file {
        // min-width: 530px;
        flex: 1;
      }

      .fileList {
        margin-top: 12px;
        .fileItem {
          font-size: 12px;
          color: var(--text-color);
          text-align: left;
          line-height: 20px;
          height: 20px;
          font-weight: 400;
          flex-shrink: 0;
          display: flex;
          margin-bottom: 12px;

          &:hover {
            .file-delete-icon {
              visibility: visible;
            }
          }

          .file-delete-icon {
            padding-top: 2px;
            line-height: 20px;
            height: 20px;
            visibility: hidden;
          }

          svg {
            float: left;
            height: 16px;
            width: 16px;
            line-height: 20px;
            margin-top: 2px;
            display: flex;
          }
          div {
            float: left;
            padding: 0;
            margin: 0;
          }
        }
        .tg-btn.tg-btn-default svg.icon {
          color: #6a7b92;
          height: 16px;
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
/deep/ .step3-layout-content.col-2 {
  grid-template-areas:
    '. top top .'
    '. left right .'
    'files files files files';
  grid-template-columns: auto repeat(2, 286px) auto;
}
/deep/ .step3-layout-content-files {
  width: 640px;
  align-items: center;
  margin: 0 auto;
}
/deep/.el-upload .tg-btn {
  width: 107px;
  border-color: var(--border-line-color);
}
.upload-tips {
  display: inline-block;
  margin-left: 6px;
  font-size: 12px;
  color: var(--text-third-color);
  line-height: 28px;
  height: 28px;
  font-weight: 400;
  margin-right: -30px;
}
</style>
