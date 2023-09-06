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
      <template #title> <span>退款申请</span> </template>
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
              <div class="value">
                {{ info.approval_uid }}
              </div>
              <span v-if="info.approval_status === 1" class="status">审批中</span>
              <span v-else-if="info.approval_status === 2" class="status success">审批通过</span>
              <span v-else-if="info.approval_status === 3" class="status error">审批失败</span>
              <span v-else class="status revoke">已撤销</span>
            </div>
          </div>
          <div class="left-body">
            <div class="line left">
              <p class="label">项目：</p>
              <div class="value">{{ info.project_name }}</div>
            </div>

            <div class="line right">
              <p class="label">收款编号：</p>
              <div class="value">
                {{
                  info.achievement_uid ||
                  (info.approval_detail ? info.approval_detail.deposit_received_uid : '')
                }}
              </div>
            </div>
            <div class="line left">
              <p class="label">退款金额：</p>
              <div class="value">{{ numberFormat(info.refund_amount, 2) }}</div>
            </div>
            <div class="line right">
              <p class="label">退款方式：</p>
              <div v-if="info.level_three_types === 1" class="value">V任务</div>
              <div v-else-if="info.level_three_types === 2" class="value">支付宝</div>
              <div v-else-if="info.level_three_types === 3" class="value">对公账户</div>
              <div v-else class="value">银行卡</div>
            </div>
            <template v-if="info.level_three_types === 1">
              <div class="line left">
                <p class="label">旺旺名：</p>
                <div class="value">{{ info.refund_way_detail.wangwang_name }}</div>
              </div>
              <div class="line right">
                <p class="label">V任务ID：</p>
                <div class="value">{{ info.refund_way_detail.v_task_id }}</div>
              </div>
            </template>
            <template v-else-if="info.level_three_types === 2">
              <div class="line left">
                <p class="label right">收款人：</p>
                <div class="value">{{ info.refund_way_detail.name }}</div>
              </div>
              <div class="line right">
                <p class="label">支付宝账号：</p>
                <div class="value">{{ info.refund_way_detail.account }}</div>
              </div>
            </template>
            <template v-else-if="info.level_three_types === 3">
              <div class="line left">
                <p class="label right">公司名称：</p>
                <div class="value line-clamp-1">
                  {{ info.refund_way_detail.company_name }}
                </div>
              </div>
              <div class="line right">
                <p class="label">银行账号：</p>
                <div class="value">{{ info.refund_way_detail.bank_card_number }}</div>
              </div>
              <div class="line left">
                <p class="label right">开户支行：</p>
                <div class="value line-clamp-1">
                  {{ info.refund_way_detail.bank_of_deposit }}
                </div>
              </div>
            </template>
            <template v-else>
              <div class="line left">
                <p class="label right">卡号：</p>
                <div class="value">{{ info.refund_way_detail.bank_card_number }}</div>
              </div>
              <div class="line right">
                <p class="label">户名：</p>
                <div class="value">{{ info.refund_way_detail.bank_account }}</div>
              </div>
              <div class="line left">
                <p class="label right">开户行：</p>
                <div class="value">{{ info.refund_way_detail.bank_of_deposit }}</div>
              </div>
            </template>
            <div class="line" style="height: auto; margin-bottom: 24px">
              <p class="label">退款事由：</p>
              <div class="value line-value">{{ info.refund_reason }}</div>
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
    <refund-dialog
      v-if="edit"
      @dialog:close="edit = false"
      @dialog:reClose="reClose"
      :visible="edit"
      :row="refundRow"
      :edit="edit"
      :info="info"
    />
  </div>
</template>

<script src="./detail.ts"></script>

<style lang="less" scoped>
@import '~@/modules/workbench/initiate/advance/detail.less';
</style>
