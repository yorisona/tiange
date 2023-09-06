<template>
  <div class="payment-detail-dialog advance-detail-dialog">
    <div class="detail-wrapper" v-if="info !== undefined">
      <div class="left-wrapper">
        <div class="left-header">
          <div class="line left">
            <p class="label">申请人：</p>
            <div class="value">{{ info.username }}</div>
          </div>
          <div class="line right">
            <p class="label">申请部门：</p>
            <div class="value">{{ info.create_department }}</div>
          </div>
          <div class="line left">
            <p class="label">发起时间：</p>
            <div class="value">{{ info.gmt_create.replace(/-/g, '.') }}</div>
          </div>
          <div class="line right">
            <p class="label">审批编号：</p>
            <div class="value">{{ info.approval_uid }}</div>
            <span v-if="info.approval_status === 1" class="status">审批中</span>
            <span v-else-if="info.approval_status === 2" class="status success">审批通过</span>
            <span v-else-if="info.approval_status === 3" class="status error">审批失败</span>
            <span v-else class="status revoke">已撤销</span>
          </div>
        </div>
        <div class="left-body">
          <div class="line left">
            <p class="label">公司名称：</p>
            <div class="value">{{ info.approval_detail.company_name }}</div>
          </div>
          <div class="line right">
            <p class="label">项目名称：</p>
            <div class="value">{{ info.approval_detail.project_name }}</div>
          </div>
          <div class="line left">
            <p class="label">店铺名称：</p>
            <div class="value line-clamp-1">{{ info.approval_detail.shop_name }}</div>
          </div>
          <div :class="['line', 'left']">
            <p class="label">店铺类目：</p>
            <div class="value">{{ info.approval_detail.category_name }}</div>
          </div>
          <div class="line left">
            <p class="label">开始时间：</p>
            <div class="value line-clamp-1">{{ info.approval_detail.start_date }}</div>
          </div>
          <div class="line left">
            <p class="label">结束时间：</p>
            <div class="value">{{ info.approval_detail.end_date }}</div>
          </div>
          <div class="line left">
            <p class="label">结算周期：</p>
            <div class="value">
              {{ SettlementCycleTypeMap.get(info.approval_detail.settlement_cycle_type) }}
            </div>
          </div>
          <div class="line left">
            <p class="label">客户经理：</p>
            <div class="value">{{ info.approval_detail.customer_manager_name }}</div>
          </div>
          <div class="line left">
            <p class="label">项目经理：</p>
            <div class="value">{{ info.approval_detail.project_manager_name }}</div>
          </div>
          <div class="line left">
            <p class="label">所属部门：</p>
            <div>{{ info.approval_detail.department_name }}</div>
          </div>
          <div class="line-block"></div>
          <p class="table-title">项目预估明细：</p>
          <div class="settlement-wrapper">
            <div class="table-header">
              <p class="item settlement-num">时间</p>
              <p class="item">GMV</p>
              <p class="item">营收</p>
              <p class="item">成本</p>
            </div>
            <div
              v-for="(item, key) in info.approval_detail.estimated_data.estimated_data_list"
              :key="key"
              class="table-body"
            >
              <div class="item settlement-num">{{ item.date }}</div>
              <div class="item">{{ formatData.formatPriceFormYuan(item.gmv, 2, true) }}</div>
              <div class="item">{{ formatData.formatPriceFormYuan(item.income, 2, true) }}</div>
              <div class="item">{{ formatData.formatPriceFormYuan(item.cost, 2, true) }}</div>
            </div>
            <div class="table-body">
              <div class="item settlement-num">合计</div>
              <div class="item">
                {{
                  formatData.formatPriceFormYuan(
                    info.approval_detail.estimated_data.total_gmv,
                    2,
                    true,
                  )
                }}
              </div>
              <div class="item">
                {{
                  formatData.formatPriceFormYuan(
                    info.approval_detail.estimated_data.total_income,
                    2,
                    true,
                  )
                }}
              </div>
              <div class="item">
                {{
                  formatData.formatPriceFormYuan(
                    info.approval_detail.estimated_data.total_cost,
                    2,
                    true,
                  )
                }}
              </div>
            </div>
          </div>
          <div class="line" style="height: auto; margin-bottom: 24px">
            <p class="label">备注：</p>
            <div class="value line-value">
              {{ info.approval_detail.remark ? info.approval_detail.remark : '--' }}
            </div>
          </div>
          <div class="line" style="height: auto">
            <p class="label">附件：</p>
            <div class="value line-value">
              <template v-if="info.approval_detail.attachment_url">
                <Appendix :list="[info.approval_detail.attachment_url]" />
              </template>
              <span v-else>--</span>
            </div>
          </div>
        </div>
      </div>
      <div class="right-wrapper">
        <h5 class="right-wrapper-title">审批进度</h5>
        <WorkbenchTimeLine :step-status="info.approval_status" :items="info.approval_flow_detail" />
      </div>
    </div>
  </div>
</template>
<script src="./detail.ts"></script>

<style lang="less" scoped>
@import '../advance/detail.less';
@import './detail.less';
</style>
