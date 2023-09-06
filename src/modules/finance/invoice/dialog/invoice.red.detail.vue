<template>
  <div v-if="visible">
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible="visible"
      :isAppendToBody="true"
      :isfooter="true"
      class="customer-dialog tg-dialog-vcenter-new advance-detail-dialog red-detail-dialog"
      width="948px"
      @close="emitClose"
    >
      <template #title> <span>开红票申请详情</span> </template>
      <div class="detail-wrapper">
        <div class="left-wrapper">
          <div class="left-header">
            <div class="line left">
              <p class="label">申请人：</p>
              <div class="value">{{ baseData.username }}</div>
            </div>
            <div class="line right">
              <p class="label">申请部门：</p>
              <div class="value">{{ baseData.create_department }}</div>
            </div>
            <div class="line left">
              <p class="label">发起时间：</p>
              <div class="value">{{ baseData.gmt_create.replace(/-/g, '.') }}</div>
            </div>
            <div class="line right">
              <p class="label">审批编号：</p>
              <div class="value">{{ baseData.approval_uid }}</div>
              <span v-if="baseData.approval_status === 1" class="status">审批中</span>
              <span v-else-if="baseData.approval_status === 2" class="status success"
                >审批通过</span
              >
              <span v-else-if="baseData.approval_status === 3" class="status error">审批失败</span>
              <span v-else class="status revoke">已撤销</span>
            </div>
          </div>
          <div class="left-body">
            <div class="line left">
              <p class="label">开票时间：</p>
              <div class="value">
                {{ moment(baseData.approval_detail.invoice_date * 1000).format('YYYY.MM.DD') }}
              </div>
            </div>
            <div class="line right">
              <p class="label">发票号码：</p>
              <div class="value">{{ baseData.approval_detail.invoice_number }}</div>
            </div>
            <div class="line left">
              <p class="label">发票代码：</p>
              <div class="value">{{ baseData.approval_detail.invoice_code }}</div>
            </div>
            <div class="line right">
              <p class="label">开票金额负数：</p>
              <div class="value">￥{{ baseData.approval_detail.total_amount }}</div>
            </div>
            <div class="line left">
              <p class="label">购买方：</p>
              <div class="value">{{ baseData.approval_detail.buyer_name }}</div>
            </div>
            <div class="line right">
              <p class="label">纳税人识别号：</p>
              <div class="value">{{ baseData.approval_detail.buyer_tax_number }}</div>
            </div>
            <div class="line left">
              <p class="label">业务部门：</p>
              <div class="value">{{ baseData.department_name || '--' }}</div>
            </div>
            <div class="line" style="height: auto">
              <p class="label">红冲原因：</p>
              <div class="value line-value">
                {{ baseData.approval_detail.remark ? baseData.approval_detail.remark : '--' }}
              </div>
            </div>
            <div class="line" style="height: auto">
              <p class="label">是否已认证：</p>
              <div class="value line-value">
                {{ baseData.approval_detail.is_certified ? '是' : '否' }}
              </div>
            </div>
            <div class="line" style="height: auto">
              <p class="label">附件：</p>
              <div class="value line-value">
                <template v-if="baseData.approval_detail.red_invoice_attachment_url">
                  <Appendix :list="[baseData.approval_detail.red_invoice_attachment_url]" />
                </template>
                <span v-else>--</span>
              </div>
            </div>
          </div>
        </div>
        <div class="right-wrapper">
          <h5 class="right-wrapper-title">审批进度</h5>
          <WorkbenchTimeLine
            :step-status="baseData.approval_status"
            :items="baseData.approval_flow_detail"
          />
        </div>
      </div>
      <template #footer>
        <tg-button type="default" @click="emitClose">取消</tg-button>
        <div class="div-default-btn" v-if="baseData.approval_status === 3" @click="reSubmit">
          重新编辑提交
        </div>
      </template>
    </el-dialog>
    <InvoiceRedDialog
      ref="invoiceRedDialogRef"
      :invoice="baseData.approval_detail"
      :isEdit="true"
      @success="reClose"
    />
  </div>
</template>
<script src="./invoice.red.detail.ts"></script>

<style lang="less" scoped>
@import './invoice.red.detail';
</style>
