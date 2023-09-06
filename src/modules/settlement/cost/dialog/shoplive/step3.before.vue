<template>
  <SettlementStep3Layout class="settlement-step3-shoplive-before" topHeightType="default">
    <template #top>
      <top-card :amount="`${settlement.total_settle_amount}`" type="default"></top-card>
    </template>
    <!-- 抖音店播 佣金 -->
    <template #left>
      <CardLayout :padding="18">
        <template #title>主播工资</template>
        <template #desc>
          <div style="cursor: pointer; line-height: 14px; height: 14px; margin-left: -6px">
            <el-popover
              :offset="130"
              popper-class="kol-tips-popper"
              placement="bottom"
              trigger="hover"
            >
              <div>
                <div style="color: var(--text-color); font-weight: 600">时薪工资</div>
                <div style="color: var(--text-second-color)">主播工资 = 单价 * 时长</div>
                <div style="color: var(--text-color); font-weight: 600">底薪/提成（取高的）</div>
                <div style="color: var(--text-second-color)">
                  主播工资 = 底薪和（净销额）*提成比例取高的
                </div>
                <div style="color: var(--text-color); font-weight: 600">底薪+提成</div>
                <div style="color: var(--text-second-color)">
                  主播工资 = 底薪 + （净销额）*提成比例
                </div>
              </div>
              <template slot="reference">
                <tg-icon style="font-size: 14px" name="ico-question"></tg-icon>
              </template>
            </el-popover>
          </div>
        </template>

        <section class="company-list">
          <div v-for="(company, index) in company_data" :key="index">
            <div class="company">
              <span class="company-name">{{ company.company_name }}</span>
              <span class="company-tag">{{ getTagName(company.fwfsqfs) }}</span>
            </div>
            <div class="company-total-cost-info">
              <div class="company-label">总费用：</div>
              <div>
                <div class="cost-summary">
                  {{ Decimal2String(new Decimal(company.jszje ? company.jszje : 0)) }} 元
                </div>
                <div class="cost-detail">{{ cost_desc(company) }}</div>
              </div>
            </div>
            <div class="company-kol-num-info">
              <div class="company-label">主播数量：</div>
              <div>
                <div class="num-summary">{{ company.kol_salary_infos.length }} 名</div>
                <div class="num-list">
                  <span
                    ><tg-button
                      type="link"
                      @click="getKolCostFile(company.company_id, company.company_name)"
                      >下载</tg-button
                    ><span style="color: var(--text-second-color)">主播费用清单</span></span
                  >
                  <span class="mgl-16"
                    ><tg-button
                      type="link"
                      @click="getKolScheduleFile(company.company_id, company.company_name)"
                      >下载</tg-button
                    ><span style="color: var(--text-second-color)">主播排班明细</span></span
                  >
                </div>
              </div>
            </div>
          </div>
        </section>
      </CardLayout>
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
  .company-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 18px;
    font-size: 12px;
    .company {
      display: flex;
      align-items: center;
      .company-name {
        color: var(--text-color);
        font-weight: 600;
        margin-right: 6px;
        font-size: 14px;
      }
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
    .company-total-cost-info {
      margin-top: 18px;
      display: flex;
      .cost-summary {
        color: var(--text-color);
        font-weight: 600;
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

    .company-label {
      width: 70px;
      text-align: right;
      color: var(--text-second-color);
    }
    > div {
      border-bottom: 1px dashed rgba(var(--text-third-rgb-color), 0.3);
      padding: 18px 0;
      &:first-of-type {
        padding-top: 0;
      }
      &:nth-child(2) {
        padding-top: 0;
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
