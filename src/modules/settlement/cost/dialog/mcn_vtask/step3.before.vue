<!--
 * @Brief: v任务- 第三步 - 生成结算单之前
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-06-03 09:40:49
-->
<template>
  <SettlementStep2Layout class="tg-cost-mcn-vtask-step3-before-container" topHeightType="default">
    <template #top>
      <top-card :amount="`${settlement.total_settle_amount.toString()}`" type="default"></top-card>
    </template>

    <template #left>
      <card-layout :padding="[0]">
        <template #title>
          <span>成本信息</span>
        </template>
        <!-- <template #desc>
          <span>结算金额 =（机构成本+ 手工调账）</span>
        </template> -->
        <template>
          <section class="expenditure-cost-list">
            <section
              v-for="(company, index) in settlement.json_data.company_info_list"
              :key="index"
              class="expenditure-cost-list-row"
            >
              <div class="cost-company-info">
                <div class="cost-company-name">{{ company.company_name }}</div>
                <div class="cost-list-company-operator">
                  <tg-button type="link" @click="downKolDataFile(company)">下载</tg-button>
                  <span class="kol-data">达人数据</span>
                </div>
              </div>
              <section class="settlement-amount-info">
                <span class="label">结算金额：</span>
                <span class="value">{{ `${formatAmount(settlementAmount(company))} 元` }}</span>
              </section>
              <section class="commission-info">
                <span class="label">机构成本：</span>
                <div class="commission-info-detail">
                  <div class="commission-amount">{{ `${formatAmount(company.zccb)} 元` }}</div>
                  <!-- <div class="commission-amount-desc">
                    {{
                      `总收入 ${formatAmount(company.yssr)}元，总支出 ${formatAmount(
                        company.yszc,
                      )}元，退款金额 ${formatAmount(company.tkje)}元，机构扣点 ${
                        company.jgkd
                      }%，税点 ${company.sd}%`
                    }}
                  </div> -->
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
    <template #bottom>
      <!-- <card-layout> -->
      <!-- <template #title>
          <span>文件</span>
        </template> -->
      <!-- <template> -->
      <section class="tg-cost-mcn-taobao-files">
        <span class="titles">V任务收入文件下载：</span>
        <div>
          <div class="line-clamp-1 uploaded-file" style="flex-shrink: 0">
            <FileItem
              :showPreview="false"
              :key="10001"
              :filepath="settlement.income_file"
              @remove="onRemoveFile(index)"
              :readonly="true"
            />
          </div>
        </div>
      </section>
      <!-- </template> -->
      <!-- </card-layout> -->
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
