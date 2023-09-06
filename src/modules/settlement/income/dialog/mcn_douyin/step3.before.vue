<!--
 * @Brief: 抖系收入结算 - 第三步 - 拆分前
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-11-24 13:09:20
-->
<template>
  <SettlementStep3Layout
    class="settlement-step3-mcn-douyin-before"
    topHeightType="default"
    :leftItemWidth="600"
  >
    <template #top>
      <top-card
        :is_cost="false"
        :amount="`${settlement.total_settle_amount}`"
        type="default"
      ></top-card>
    </template>
    <template #left>
      <div class="before-customer-list">
        <div
          class="before-customer"
          v-for="(company, companyIdx) in company_info"
          :key="companyIdx"
        >
          <div v-if="companyIdx > 0" class="hr"></div>
          <div class="before-customer-name" style="margin-bottom: 4px">
            {{ company.company_name }}
          </div>
          <div
            class="before-income-row mgt-12"
            v-for="(item, itemIdx) in incomeNameTypes"
            :key="itemIdx"
            v-show="amountDetail(item.type, company.amount_info_list)"
          >
            <div class="before-income-row-detail">
              <span class="label">{{ item.name }}：</span>
              <span class="value">{{ income_amount(item.type, company.amount_info_list) }} 元</span>
              <tg-button
                class="down-load"
                v-if="itemIdx === 0"
                type="link"
                @click="() => onDownloadPitFeeDetail(company)"
                >下载明细</tg-button
              >
              <tg-button
                class="down-load"
                v-if="itemIdx <= 3 && itemIdx > 0"
                type="link"
                @click="() => onDownloadDetail(item.type, company.amount_info_list)"
                >下载明细</tg-button
              >
            </div>
            <div
              class="other-desc"
              v-if="itemIdx === 5 && remark(item.type, company.amount_info_list)"
            >
              {{ remark(item.type, company.amount_info_list) }}
            </div>
          </div>
          <div
            class="before-adjust-info mgt-12"
            v-if="company.adjust_info ? company.adjust_info.length : false"
          >
            <div v-for="(info, infoIdx) in company.adjust_info" :key="infoIdx">
              <div class="mgt-12">
                <span class="label">手工调账：</span>
                <span class="value">{{ formatAmountWithoutPrefix(info.adjust_amount) }} 元</span>
              </div>
              <div class="other-desc">{{ info.adjust_reason }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #button v-if="!readonly">
      <tg-button @click="prev">上一步</tg-button>
      <tg-button type="primary" @click="next">生成结算单</tg-button>
    </template>
    <template #mask>
      <tg-mask-loading :visible="saveLoading" content="正在生成结算单，请稍候..." />
    </template>
  </SettlementStep3Layout>
</template>

<script src="./step3.before.ts"></script>
<style lang="less">
@import './step3.before.less';

.settlement-step3-mcn-douyin-before {
  .step2-content-two {
    grid-template-rows: 24px 445px 0px !important;
  }
  .before-customer-list {
    width: 100%;
    padding: 18px 24px;
    overflow-y: overlay;
    border-radius: 2px;
    border: 1px solid rgba(var(--tip-icon-rgb-color), 0.3);
    .before-customer {
      .hr {
        margin: 18px 0;
        width: 552px;
        height: 1px;
        border-bottom: 1px dashed rgba(var(--tip-icon-rgb-color), 0.3);
      }
      .before-customer-name {
        font-weight: 600;
        color: var(--text-color);
      }
      .before-income-row,
      .before-adjust-info {
        font-size: 12px;
        .before-income-row-detail {
          // display: flex;
        }
      }
      .label {
        display: inline-block;
        width: 84px;
        text-align: right;
        color: var(--text-third-color);
      }
      .value {
        display: inline-block;
        width: 122px;
        font-weight: 600;
        color: var(--text-color);
      }
      .down-load {
        margin-left: 12px;
      }
    }
    .other-desc {
      margin: 4px 0 0 84px;
      color: var(--text-third-color);
    }
  }
}
</style>
