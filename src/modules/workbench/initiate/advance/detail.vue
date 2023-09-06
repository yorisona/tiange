<template>
  <div>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible="visible"
      :isAppendToBody="true"
      :isfooter="true"
      class="customer-dialog tg-dialog-vcenter-new advance-detail-dialog"
      width="948px"
      @close="emitClose"
    >
      <template #title> <span>垫款申请</span> </template>
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
              <p class="label">客户：</p>
              <div class="value">{{ info.company_name }}</div>
            </div>
            <div class="line right">
              <p class="label">项目：</p>
              <div class="value">{{ info.project_name }}</div>
            </div>
            <div v-if="info.business_type !== 5" class="line left">
              <p class="label">品牌：</p>
              <div class="value">{{ info.brand_name }}</div>
            </div>
            <div :class="['line', info.business_type === 5 ? 'left' : 'right']">
              <p class="label">垫款金额：</p>
              <div class="value">{{ numberFormat(info.borrowing_amount, 2) }}</div>
            </div>
            <div class="line left">
              <p class="label">回款销售额：</p>
              <div class="value">
                {{
                  info.back_amount || info.back_amount === 0
                    ? numberFormat(info.back_amount, 2)
                    : '--'
                }}
              </div>
            </div>
            <div class="line right">
              <p class="label">供应商：</p>
              <div class="value">{{ info.collecting_company }}</div>
            </div>
            <div v-if="info.business_type !== 5" class="line left">
              <p class="label">客户经理：</p>
              <div class="value">
                {{ info.customer_manager_name ? info.customer_manager_name : '--' }}
              </div>
            </div>
            <div class="line" style="height: auto; margin-bottom: 24px">
              <p class="label">垫款事由：</p>
              <div class="value line-value">{{ info.borrowing_reason }}</div>
            </div>
            <div class="line" style="height: auto">
              <p class="label">备注：</p>
              <div class="value line-value">
                {{ info.remark ? info.remark : '--' }}
              </div>
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
        <div v-if="info.approval_status === 1" class="div-default-btn" @click="handleSubmit">
          撤销
        </div>
        <div
          v-if="info.approval_status === 3 && info.project_id"
          class="div-default-btn"
          @click="reSubmit"
        >
          重新提交
        </div>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在提交，请稍候..." />
    <advance-dialog
      v-if="edit"
      :visible="edit"
      @dialog:close="edit = false"
      @dialog:reClose="reClose"
      :edit="edit"
      :info="info"
    />
  </div>
</template>

<script src="./detail.ts"></script>

<style lang="less" scoped>
@import './detail.less';
</style>
