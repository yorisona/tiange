<template>
  <div>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible="visible"
      :isAppendToBody="true"
      :isfooter="true"
      class="customer-dialog tg-dialog-vcenter-new advance-detail-dialog payment-detail-dialog"
      width="948px"
      @close="emitClose"
    >
      <template #title> <span>对外付款申请</span> </template>
      <div class="detail-wrapper">
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
              <p class="label">业务类型：</p>
              <div class="value">
                {{ info.cooperation_type === 2 ? '区域店播' : businessType(info.business_type) }}
              </div>
            </div>
            <div class="line right">
              <p class="label">项目：</p>
              <div class="value">{{ info.project_name }}</div>
            </div>
            <div v-if="info.business_type !== 5" class="line left">
              <p class="label">品牌：</p>
              <div class="value line-clamp-1">{{ info.brand_name }}</div>
            </div>
            <div :class="['line', info.business_type === 5 ? 'left' : 'right']">
              <p class="label">付款金额：</p>
              <div class="value">{{ numberFormat(info.transfer_amount, 2) }}</div>
            </div>
            <div class="line left">
              <p class="label">供应商：</p>
              <div class="value line-clamp-1">{{ info.collecting_company }}</div>
            </div>
            <div class="line left">
              <p class="label">票款方式：</p>
              <div v-if="info.pay_invoice_type === 1" class="value">先票后款</div>
              <div v-else class="value">先款后票</div>
            </div>
            <div class="line left">
              <p class="label">是否已回款：</p>
              <div v-if="info.is_back === 1" class="value">是</div>
              <div v-else-if="info.is_back === 0" class="value">否</div>
              <div v-else>--</div>
            </div>
            <div v-if="info.is_back === 1" class="line left">
              <p class="label">收款编号：</p>
              <div v-if="info.achievement_uid" class="value">{{ info.achievement_uid }}</div>
              <div v-else>--</div>
            </div>
            <div class="line left">
              <p class="label">成本类别：</p>
              <div v-if="info.approval_detail.expense_type_biz_code" class="value">
                {{ getExpenseTypeStr(info.approval_detail.expense_type_biz_code) }}
              </div>
              <div v-else>--</div>
            </div>
            <div class="line left">
              <p class="label">是否已签合同：</p>
              <div v-if="info.is_contract_signed === 1" class="value">是</div>
              <div v-else-if="info.is_contract_signed === 0" class="value">否</div>
              <div v-else class="value">--</div>
            </div>
            <div class="line left" v-if="info.is_contract_signed === 1">
              <p class="label">合同单号：</p>
              <div>{{ info.contract_uid }}</div>
            </div>
            <div class="line left">
              <p class="label">收款方式：</p>
              <div v-if="info.level_three_types === 3" class="value">对公账户</div>
              <div v-else class="value">对公支付宝</div>
            </div>
            <div class="line right">
              <p class="label">客户经理：</p>
              <div class="value">
                {{ info.customer_manager_name ? info.customer_manager_name : '--' }}
              </div>
            </div>
            <div class="line">
              <p class="label">付款事由：</p>
              <div class="value line-value">{{ info.pay_reason }}</div>
            </div>
            <div v-if="info.is_back === 0" class="line" style="height: auto; margin-bottom: 24px">
              <p class="label">关联审批单：</p>
              <div class="value line-value">
                {{ info.borrowing && info.borrowing ? info.borrowing : '--' }}
              </div>
            </div>
            <div class="line-block"></div>
            <p class="table-title">结算单明细：</p>
            <div class="settlement-wrapper">
              <div class="table-header">
                <p class="item settlement-num">结算单编号</p>
                <p class="item">结算金额</p>
                <p class="item">已付金额</p>
                <p class="item">待付金额</p>
                <p class="item">本次支付金额</p>
              </div>
              <div v-for="(item, key) in info.settlements" :key="key" class="table-body">
                <div class="item settlement-num">{{ item.settlement_uid }}</div>
                <div class="item">{{ numberFormat(item.settlement_amount, 2) }}</div>
                <div class="item">{{ numberFormat(item.paid_amount, 2) }}</div>
                <div class="item">{{ numberFormat(item.pending_amount, 2) }}</div>
                <div class="item">{{ numberFormat(item.pay_amount, 2) }}</div>
              </div>
            </div>
            <p
              v-if="info.pay_invoice_type === 1 && info.invoice_info_list.length > 0"
              class="table-title"
            >
              发票明细：
            </p>
            <div
              v-if="info.pay_invoice_type === 1 && info.invoice_info_list.length > 0"
              class="invoice-detail"
            >
              <div class="table-header">
                <p class="item invoice-settle">关联结算单号</p>
                <p class="item buyer">购买方</p>
                <p class="item seller">销售方</p>
                <p class="item invoice-no">发票号码</p>
                <p class="item invoice-date">开票日期</p>
                <p class="item invoice-amount">发票金额</p>
                <p class="item invoice-amount">发票核销金额</p>
                <p class="item invoice-point">税率</p>
                <p class="item tax-amount">税额</p>
                <p class="item no-tax">不含税金额</p>
                <p class="item invoice-type">发票类型</p>
                <p class="item invoice-attachment">发票附件</p>
              </div>
              <div v-for="(item, key) in info.invoice_info_list" :key="key" class="table-body">
                <div class="item invoice-settle">{{ item.settlement_uid }}</div>
                <div class="item buyer">{{ item.buyer_name }}</div>
                <div class="item seller">{{ item.seller_name }}</div>
                <div class="item invoice-no">{{ item.invoice_number }}</div>
                <div class="item invoice-date">
                  {{ moment(item.invoice_date * 1000).format('YYYY.MM.DD') }}
                </div>
                <div class="item invoice-amount">{{ numberFormat(item.total_amount, 2) }}</div>
                <div class="item invoice-amount">
                  {{ numberFormat(item.write_amount_by_this_settlement, 2) }}
                </div>
                <div class="item invoice-point">{{ item.tax_rate }}%</div>
                <div class="item tax-amount">{{ numberFormat(item.tax_amount, 2) }}</div>
                <div class="item no-tax">{{ numberFormat(item.tax_excluded_amount, 2) }}</div>
                <div class="item invoice-type">
                  <span v-if="item.invoice_type === 1">销售发票</span>
                  <span v-else>采购发票</span>
                </div>

                <div class="item invoice-attachment">
                  <img
                    class="invoice-img"
                    :src="item.invoice_pic_url + `?Authorization=${Auth}`"
                    @click="downloadBtnClick(item.invoice_pic_url)"
                  />
                </div>
              </div>
            </div>

            <div class="line" style="height: auto; margin-bottom: 18px">
              <p class="label">备注：</p>
              <div class="value line-value">{{ info.remark ? info.remark : '--' }}</div>
            </div>
            <div class="line" style="height: auto">
              <p class="label">附件：</p>
              <div class="value line-value">
                <template v-if="info.attachment && info.attachment.length > 0">
                  <Appendix :list="info.attachment" />
                </template>
                <span v-else>--</span>
              </div>
            </div>
          </div>
        </div>
        <div class="right-wrapper">
          <h5 class="right-wrapper-title">审批进度</h5>
          <WorkbenchTimeLine
            :step-status="info.approval_status"
            :items="info.approval_flow_detail"
          />
        </div>
      </div>
      <template #footer>
        <tg-button type="default" @click="emitClose">取消</tg-button>
        <div class="div-default-btn" v-if="info.approval_status === 1" @click="handleSubmit">
          撤销
        </div>
        <div
          class="div-default-btn"
          v-if="info.approval_status === 3 && info.project_id"
          @click="reSubmit"
        >
          重新提交
        </div>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在提交，请稍候..." />
    <payment-dialog
      v-if="edit"
      :visible.sync="edit"
      :data="paymentData"
      :info="info"
      :projectType="projectType"
      @dialog:reClose="reClose"
      @dialog:close="edit = false"
      :edit="edit"
    ></payment-dialog>
  </div>
</template>
<script src="./detail.ts"></script>

<style lang="less" scoped>
@import '../advance/detail.less';
@import './detail.less';
</style>
