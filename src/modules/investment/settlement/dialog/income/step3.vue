<template>
  <SettlementStep3Layout class="tg-income-investment-settlement-step3-container">
    <template #top>
      <top-card
        :is_cost="false"
        :amount="settlementDetail.total_settle_amount.toString()"
        :taxed="settlementDetail.is_include_tax"
        :invoice_type="settlementDetail.invoice_type"
        :name="settlementDetail.company_name"
        name_desc="客户："
        :tax_rate="settlementDetail.tax_rate.toString()"
        type="value2"
        :tax_rate_disabled="true"
      ></top-card>
    </template>
    <template #left>
      <card-layout :padding="[0]">
        <template #title>
          <span v-if="isAmountInfoList">结算详情</span>
          <span v-else>坑位费</span>
        </template>
        <div class="investment-settlement-step3-detail" v-if="isAmountInfoList">
          <template>
            <div v-if="json_data" style="padding: 0 0 18px">
              <div
                class="settlement-goods-info"
                style="background: transparent; padding-left: 16px"
              >
                <div>{{ typeMap.get(amountInfoList[0].type) }}：</div>
                <div>
                  <div class="goods-info-code line-clamp-1">
                    {{
                      `${formatAmountWithoutPrefix(
                        amountInfoList[0] ? amountInfoList[0].amount : 0,
                      )} 元`
                    }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="investment-settlement-step3-detail" v-else>
          <template>
            <div v-if="json_data" style="padding: 0 0 18px">
              <div class="settlement-goods-info">
                <div class="goods-info-label">
                  <tg-icon
                    class="godos-info-icon"
                    name="ico-icon_tongyong_tishi_mianxing-01"
                  ></tg-icon>
                  <div>商品：</div>
                </div>
                <div>
                  <div class="goods-info-code line-clamp-1">
                    {{ json_data.product_code ? json_data.product_code : '--' }}
                  </div>
                  <div class="line-clamp-2 goods-info-name">
                    {{ json_data.product_name ? json_data.product_name : '--' }}
                  </div>
                </div>
              </div>
              <div v-if="merchants_project" class="investment-project-income">
                <div class="income-label">招商项目结算收入</div>
                <div class="income-value">
                  {{
                    `${formatAmountWithoutPrefix(
                      merchants_project ? merchants_project.income_amount : 0,
                    )} 元`
                  }}
                </div>
              </div>
              <div v-if="execute_project" class="execute-project-income">
                <div class="income-label">
                  {{ `${execute_project ? execute_project.project_name : '--'}项目结算收入` }}
                </div>
                <div class="income-value">
                  {{
                    `${formatAmountWithoutPrefix(
                      execute_project ? execute_project.income_amount : 0,
                    )} 元`
                  }}
                </div>
              </div>
            </div>
          </template>
        </div>
      </card-layout>
    </template>
    <template #right>
      <CardLayout>
        <template #title>手工调账</template>
        <div class="adjust-info-content">
          <div class="adjust-info-total">
            <div class="adjust-info-total-lbl">
              调账&nbsp;{{ settlementDetail.adjust_info.length }}&nbsp;笔
            </div>
            <div class="adjust-info-total-amount">
              <strong>{{ adjustTotalAmount() }} &nbsp;元</strong>
            </div>
          </div>
          <div class="adjust-info-line"></div>
          <div class="adjust-info-list">
            <template v-for="(item, itemIndex) in settlementDetail.adjust_info">
              <div class="adjust-info-item" :key="itemIndex">
                <span class="number">{{ itemIndex + 1 }}.&nbsp;</span>
                <div>
                  <div class="income-project">{{ adjustProjectDesc(item) }}</div>
                  <div class="project-income-info">
                    <span>调整金额：</span>
                    <span>{{ formatAmountWithoutPrefix(item.adjust_amount) }} 元</span>
                    <span>；调整原因：</span>
                    <span>{{ item.adjust_reason }}</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </CardLayout>
    </template>

    <template #files>
      <div style="border-bottom: 1px solid rgba(164, 178, 194, 0.3); margin-top: 18px"></div>
      <div class="upload-form">
        <div v-if="!readonly" class="upload-box">
          <p class="upload-title"><span class="star">*</span>结算单</p>
          <tg-upload
            action="/api/resources/upload_file"
            :data="{ type: 'settlement' }"
            :beforeUpload="beforeUpload"
            :success="successHandle"
            :disabled="isFileUploaderDisabled"
            :show-file-list="false"
          >
            <tg-button size="medium" icon="ico-btn-upload" :disabled="isFileUploaderDisabled"
              >上传文件</tg-button
            >
          </tg-upload>
          <span class="file-tips">
            支持 .docx .pdf .jpg .png .xlsx, 最多上传5个文件(单个文件大小不超过30M)
          </span>
        </div>
        <div class="file-list-box">
          <upload-file-list v-if="!readonly" v-model="settlement_files" />
          <Appendix v-else :list="settlement_files" />
        </div>
      </div>
    </template>

    <template #button v-if="!readonly">
      <tg-button @click="prev">上一步</tg-button>
      <tg-button type="primary" @click="next">生成结算单</tg-button>
    </template>
    <template #mask>
      <tg-mask-loading :visible="loading" :content="loadingText" />
    </template>
  </SettlementStep3Layout>
</template>

<script src="./step3.ts"></script>
<style lang="less">
@import '~@/styles/utils/index.less';
.tg-income-investment-settlement-step3-container {
  .adjust-info-content {
    > .adjust-info-total {
      > .adjust-info-total-lbl {
        .fc(var(--default-font-size), var(--text-third-color));
        line-height: 16px;
      }
      > .adjust-info-total-amount {
        .mgt(6px);
        .fc(var(--small-font-size), var(--text-color));
        line-height: 18px;
      }
    }
    > .adjust-info-line {
      .brd-t(1px; dashed; rgba(var(--tip-icon-rgb-color), 0.3));
      .mg(12px 0);
    }
    > .adjust-info-list {
      display: grid;
      row-gap: 12px;
      > .adjust-info-item {
        display: flex;
        line-height: 16px;
        font-size: 12px;
        .number {
          flex-shrink: 0;
          // min-width: 20px;
          color: var(--text-color);
        }
        .income-project {
          color: var(--text-color);
        }
        .project-income-info {
          margin-top: 6px;
          color: var(--text-second-color);
        }
      }
    }
  }
  .investment-settlement-step3-detail {
    .investment-project-income,
    .execute-project-income {
      margin: 18px 18px 0;
      .income-label {
        color: var(--text-second-color);
      }
      .income-value {
        color: var(--text-color);
        font-weight: 600;
      }
    }
    .settlement-goods-info {
      display: flex;
      background-color: #f7fafe;
      padding: 10px 12px 8px 10px;
      font-size: 12px;
      .goods-info-label {
        color: var(--text-second-color);
        flex-shrink: 0;
        display: flex;
        .godos-info-icon {
          font-size: 20px;
          position: relative;
          top: -1px;
          margin-right: 4px;
        }
      }
      .goods-info-code {
        color: var(--text-second-color);
      }
      .goods-info-name {
        color: var(--text-color);
        font-weight: 600;
      }
    }
  }
  .upload-form {
    margin-top: 18px;
    .upload-box {
      display: flex;
      .upload-title {
        margin-right: 5px;
        line-height: 28px;
        .star {
          color: var(--error-color);
        }
      }
      .file-tips {
        margin-left: 12px;
        margin-top: 8px;
        font-size: 12px;
        color: var(--text-third-color);
      }
      /deep/.el-loading-spinner {
        .circular {
          width: 20px;
          height: 20px;
          margin-top: 10px;
        }
      }
    }
    .file-list-box {
      margin-top: 10px;
      width: auto;
    }
  }

  .upload-file-list {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
    .file-item {
      width: 360px;
      .file-name {
        flex: none;
        max-width: 300px;
      }
    }
  }
}
</style>
