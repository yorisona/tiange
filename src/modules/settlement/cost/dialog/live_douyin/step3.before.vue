<template>
  <SettlementStep3Layout class="settlement-step3-shoplive-before" topHeightType="default">
    <template #top>
      <top-card :amount="`${settlement.total_settle_amount}`" type="default"></top-card>
    </template>
    <!-- 抖音店播 佣金 -->
    <template #left>
      <section class="company-list before-customer-list">
        <div
          class="before-customer"
          v-for="(companyName, companyIdx) in company_list"
          :key="companyIdx"
        >
          <!--<div v-if="companyIdx > 0" class="hr"></div>-->
          <div
            class="before-customer-name"
            style="margin-bottom: 4px; margin-top: 10px; font-weight: 600"
          >
            {{ companyName }}
          </div>
          <div
            class="before-income-row mgt-12"
            v-for="(item, itemIdx) in feeNameTypes"
            :key="itemIdx"
            v-show="getDetailByCompany(companyName)"
          >
            <div
              v-if="
                item.type !== 9 &&
                getDetailByCompany(companyName) &&
                amountDetail(item.type, getDetailByCompany(companyName))
              "
              class="before-income-row-detail"
            >
              <span class="label">{{ item.name }}：</span>
              <span class="value"
                >{{ income_amount(item.type, getDetailByCompany(companyName)) }} 元</span
              >
              <tg-button
                class="down-load"
                v-if="
                  item.type === 8 && isYuFengCompany(companyName) && settlement.business_type !== 8
                "
                type="link"
                @click="() => onDownloadPutDetail(item.type, getDetailByCompany(companyName))"
                >下载明细</tg-button
              >
            </div>
            <div
              class="other-desc"
              v-if="item.type !== 1 && remark(item.type, getDetailByCompany(companyName))"
            >
              {{ remark(item.type, getDetailByCompany(companyName)) }}
            </div>
            <div
              v-if="
                item.type === 9 &&
                getDetailByCompany(companyName) &&
                amountDetail(9, getDetailByCompany(companyName))
              "
              class="before-income-row-detail"
            >
              <div class="company-total-cost-info">
                <div style="width: 94px; text-align: right; color: var(--text-second-color)">
                  主播成本：
                </div>
                <div>
                  <div class="cost-summary">
                    {{
                      Decimal2String(
                        new Decimal(
                          amountDetail(9, getDetailByCompany(companyName)).jszje
                            ? amountDetail(9, getDetailByCompany(companyName)).jszje
                            : 0,
                        ),
                      )
                    }}
                    元
                    <span class="company-tag" style="margin-left: 10px">{{
                      getTagName(amountDetail(9, getDetailByCompany(companyName)).fwfsqfs)
                    }}</span>
                  </div>
                  <div class="cost-detail">
                    {{ cost_desc(amountDetail(9, getDetailByCompany(companyName))) }}
                  </div>
                  <div class="company-kol-num-info" style="margin-top: 4px">
                    <div class="company-label">主播数量：</div>
                    <div style="display: flex; justify-content: flex-start">
                      <div class="num-summary">
                        {{
                          amountDetail(9, getDetailByCompany(companyName)).kol_salary_infos.length
                        }}
                        名
                      </div>
                      <div
                        class="num-list"
                        style="margin-top: 0; margin-left: 30px; color: #606266"
                      >
                        <span
                          ><tg-button
                            type="link"
                            @click="
                              getKolCostFile(
                                getDetailByCompany(companyName)[0].company_id,
                                companyName,
                              )
                            "
                            >下载</tg-button
                          ><span style="color: var(--text-second-color)">主播费用清单</span></span
                        >
                        <span class="mgl-16"
                          ><tg-button
                            type="link"
                            @click="
                              getKolScheduleFile(
                                getDetailByCompany(companyName)[0].company_id,
                                companyName,
                              )
                            "
                            >下载</tg-button
                          ><span style="color: var(--text-second-color)">主播排班明细</span></span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="before-adjust-info mgt-12"
            v-if="getAdjustByCompany(companyName) && getAdjustByCompany(companyName).length > 0"
          >
            <div class="mgt-12">
              <span class="label">手工调账：</span>
              <span class="value"
                >{{ formatAmountWithoutPrefix(getAdjustAmountByCompany(companyName)) }} 元</span
              >
            </div>
            <div
              style="margin-left: 80px; margin-top: 4px"
              v-for="(info, infoIdx) in getAdjustByCompany(companyName)"
              :key="infoIdx"
            >
              <div>
                <span
                  class="other-desc"
                  style="margin-left: -10px; width: 80px; text-align: right; display: inline-block"
                >
                  {{
                    info.type === 8 ? '投放成本:' : info.type === 15 ? '营销/商广:' : '其他成本:'
                  }}</span
                >
                <span class="value" style="width: 300px; margin-left: 10px"
                  >{{ formatAmountWithoutPrefix(info.adjust_amount) }} 元
                </span>
              </div>
              <div class="other-desc" style="margin-left: 70px">{{ info.adjust_reason }}</div>
            </div>
          </div>
        </div>
      </section>
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
@charset 'utf-8';

.settlement-step3-shoplive-before {
  .before-customer-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    -moz-column-gap: 18px;
    column-gap: 18px;
    width: 100%;
    padding: 18px 24px;
    overflow-y: overlay;
    border-radius: 2px;
    border: 1px solid rgba(var(--text-third-rgb-color), 0.3);
    .before-customer {
      .hr {
        margin: 18px 0;
        width: 100%;
        height: 1px;
        border-bottom: 1px dashed rgba(var(--text-third-rgb-color), 0.3);
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
        width: 94px;
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
      margin: 4px 0 0 94px;
      color: var(--text-third-color);
    }
    .company-total-cost-info {
      margin-top: 18px;
      display: flex;
      .cost-summary {
        color: var(--text-color);
        font-weight: 600;
        .company-tag {
          border-radius: 10px;
          font-size: 10px;
          display: inline-block;
          height: 18px;
          background: fade(#5e98ff, 10);
          border: 1px solid fade(#5e98ff, 80);
          padding: 0 6px;
          color: #5e98ff;
        }
      }
      .cost-detail {
        margin-top: 4px;
        color: var(--text-third-color);
      }
    }
    .company-kol-num-info {
      margin-top: 16px;
      display: flex;
      .num-summary {
        color: var(--text-color);
        font-weight: 600;
      }
      .num-list {
        margin-top: 4px;
        color: var(--text-third-color);
      }
    }
  }
}

.el-popover.kol-tips-popper {
  line-height: 24px;
  font-size: 12px;
  padding: 10px 18px 8px 18px;
}
</style>
<style lang="less" scoped>
.settlement-step3-shoplive-before {
  /deep/.step2-cost-layout-content {
    grid-template-rows: 24px 414px;
    /*grid-template-columns: 600px !important;*/
    column-gap: 0;
    justify-content: center;
  }
}
</style>
