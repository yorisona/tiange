<!--
 * @Brief: 淘宝cps - 第三步 - 生成结算单之前
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-06-03 09:40:49
-->
<template>
  <SettlementStep2Layout class="tg-cost-mcn-taobao-step3-before-container" topHeightType="default">
    <template #top>
      <top-card :amount="`${settlement.total_settle_amount.toString()}`" type="default"></top-card>
    </template>

    <template #left>
      <card-layout :padding="[0]">
        <template #title>
          <span>成本信息</span>
        </template>
        <!-- <template #desc>
          <span>支出成本 = 主播总收入 * 提成比例</span>
        </template> -->
        <template>
          <section class="expenditure-cost-list">
            <section
              v-for="(company, index) in settlement.json_data.company_info_list"
              :key="index"
              class="expenditure-cost-list-row"
            >
              <div class="cost-company-name">{{ company.company_name }}</div>
              <section class="commission-info">
                <span class="label">提成：</span>
                <div class="commission-info-detail">
                  <div class="commission-amount">{{ `${formatAmount(company.zccb)} 元` }}</div>
                  <div class="commission-amount-desc">
                    {{ `总收入 ${company.yssr} 元，提成比例 ${company.tcbl}%` }}
                  </div>
                </div>
              </section>
              <section v-if="adjustInfo(company.company_name).length" class="adjust-info">
                <div class="adjust-info-flex">
                  <span class="label">手工调账：</span>
                  <div class="adjust-info-list">
                    <div
                      v-for="(item, idx) in adjustInfo(company.company_name)"
                      :key="idx"
                      class="adjust-info-list-row"
                    >
                      <span>{{ `${idx + 1}.` }}&nbsp;</span>
                      <div class="adjust-row-detail">
                        <div>{{ `调整金额：${formatAmount(item.adjust_amount)} 元` }}</div>
                        <div class="line-clamp-1">{{ `调整原因：${item.adjust_reason}` }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </section>
          </section>
        </template>
      </card-layout>
    </template>
    <template #right>
      <card-layout>
        <template #title>
          <span>文件</span>
        </template>
        <template>
          <section class="tg-cost-mcn-taobao-files">
            <span class="titles">淘宝CPS收入文件下载</span>
            <div class="mgt-12">
              <div class="line-clamp-1 uploaded-file" style="flex-shrink: 0">
                <tg-button class="uploaded-file-btn" type="link">
                  <tg-icon
                    class="uploaded-file-btn-icon"
                    :name="getFileIcon(settlement.income_file)"
                  ></tg-icon>
                  <span style="max-width: 300px" class="line-clamp-1">{{
                    basename(getFileName(settlement.income_file))
                  }}</span>
                </tg-button>
                <tg-button
                  class="uploaded-file-download"
                  @click="downloadFile(settlement.income_file)"
                  target="_blank"
                  type="link"
                  style="flex-shrink: 0"
                  >下载</tg-button
                >
              </div>
            </div>
          </section>
        </template>
      </card-layout>
    </template>
    <template #button>
      <tg-button @click="prev">上一步</tg-button>
      <tg-button type="primary" @click="next">生成结算单</tg-button>
    </template>
    <template #mask>
      <tg-mask-loading :visible="saveLoading" content="正在生成结算单，请稍候..." />
    </template>
  </SettlementStep2Layout>
</template>

<script src="./step3.before.ts"></script>
<style lang="less">
@import './step3.before.less';
</style>
