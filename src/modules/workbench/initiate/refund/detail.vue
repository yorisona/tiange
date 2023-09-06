<template>
  <el-dialog
    class="customer-dialog workbench-dialog refund-detail-dialog tg-dialog-vcenter"
    :visible="visible"
    :append-to-body="true"
    width="800px"
    :close-on-click-modal="false"
    @close="close"
    v-if="approval !== undefined"
  >
    <template #title><span>退款申请详情</span></template>
    <div style="padding-left: 5px; padding-right: 5px" v-if="approval !== undefined">
      <div class="main-header">
        <div class="from-header-box">
          <div class="from-header">
            <span>申请人:</span>
            <span>{{ approval.username }}</span>
          </div>
          <div class="from-header">
            <span>申请部门:</span>
            <span>{{ approval.create_department }}</span>
          </div>
          <div class="from-header">
            <span>发起时间:</span>
            <span>{{ approval.gmt_create }}</span>
          </div>
          <span class="left_icon">
            <div class="apply-click" v-if="revocationVisiable && commitAgainVisible" @click="again">
              <span>
                <img src="@/assets/img/workbench/toresubmit_icon@2x.png" />
              </span>
              <span class="hover-red">再次提交</span>
            </div>
            <div class="apply-click" @click="exportPdf">
              <span>
                <img src="@/assets/img/workbench/download_pdf_icon@2x.png" />
              </span>
              <span>下载PDF</span>
            </div>
          </span>
        </div>
      </div>
      <tg-block class="title-right">
        <span style="font-size: 16px; color: #333">审批编号:</span>
        <span style="color: var(--text-color); font-weight: 600; font-size: 16px">{{
          approval.approval_uid
        }}</span>
        <span class="mgl-10 color-tag-processing" v-if="approval.approval_status === 1"
          >审批中</span
        >
        <span class="mgl-10 color-tag-success" v-if="approval.approval_status === 2">审批成功</span>
        <span class="mgl-10 color-tag-failure" v-if="approval.approval_status === 3">审批失败</span>
        <span class="mgl-10 color-tag-invalid" v-if="approval.approval_status === 4">已撤销</span>
      </tg-block>
      <tg-block class="main mgt-10">
        <div class="main-middle">
          <div class="uls">
            <ul>
              <li>
                <span class="color-9">退款类型:</span>
                <span v-if="approval.level_two_types === 1">业绩退款</span>
              </li>
              <li>
                <span class="color-9">退款金额:</span>
                <span style="font-weight: 600; color: #ff731e">{{
                  '￥' + approval.refund_amount_str
                }}</span>
              </li>
              <li>
                <span class="color-9">关联业绩:</span>
                <span>{{ approval.achievement_uid }}</span>
              </li>
            </ul>
            <ul>
              <li>
                <span class="color-9">退款方式:</span>
                <span v-if="approval.level_three_types === 1">V任务</span>
                <span v-if="approval.level_three_types === 2">支付宝</span>
                <span v-if="approval.level_three_types === 3">对公银行</span>
              </li>
              <li>
                <p v-if="approval.level_three_types === 1">
                  <span class="color-9">V任务id:</span>
                  <span>{{ approval.refund_way_detail.v_task_id }}</span>
                </p>
                <p v-if="approval.level_three_types === 2">
                  <span class="color-9">姓名:</span>
                  {{ approval.refund_way_detail.name }}
                </p>
                <p v-if="approval.level_three_types === 3">
                  <span class="color-9">银行卡号:</span>
                  {{ approval.refund_way_detail.bank_card_number }}
                </p>
              </li>
              <li>
                <p v-if="approval.level_three_types === 1">
                  <span class="color-9">旺旺号:</span>
                  <span>{{ approval.refund_way_detail.wangwang_name }}</span>
                </p>
                <p v-if="approval.level_three_types === 2">
                  <span class="color-9">账户:</span>
                  {{ approval.refund_way_detail.account }}
                </p>
                <p v-if="approval.level_three_types === 3">
                  <span class="color-9">开户行:</span>
                  {{ approval.refund_way_detail.bank_of_deposit }}
                </p>
              </li>
            </ul>
            <ul>
              <li v-if="approval.level_three_types === 3">
                <span class="color-9">公司名称:</span>
                {{ approval.refund_way_detail.company_name }}
              </li>
              <li>
                <span class="color-9">备注:</span>
                <span class="break-all">{{ approval.remark ? approval.remark : '--' }}</span>
              </li>
            </ul>
          </div>
          <ul class="reason">
            <span class="color-9">退款理由:</span>
            <span class="break-all">{{
              approval.refund_reason ? approval.refund_reason : '--'
            }}</span>
          </ul>
        </div>
      </tg-block>
      <tg-block class="flow">
        <el-form>
          <el-form-item label="审批流程：" label-width="80px">
            <ApprovalFlow />
            <div class="steps" v-if="false">
              <el-steps direction="vertical" :active="1" class="step-username">
                <el-step style="height: 82px">
                  <template #title>
                    <div style="font-size: 14px">申请人</div>
                  </template>
                  <template #description>
                    <div>
                      <span class="color-3">{{ approval.username }}</span>
                      <p class="flow-select">{{ approval.gmt_create_datetime }}</p>
                    </div>
                  </template>
                </el-step>
              </el-steps>
              <el-steps :active="step_status" direction="vertical" class="steps-line">
                <el-step
                  style="height: 82px !important"
                  v-for="(item, index) in approval.approval_stream ? approval.approval_stream : ''"
                  :key="index"
                  class="step-children"
                >
                  <template #title>
                    <span
                      class="size-medium"
                      v-if="item.role_code !== 804 && item.role_code !== 802"
                      >{{ item.role_name }}</span
                    >
                    <!-- 分管副总 -->
                    <span class="size-medium" v-if="item.role_code === 804">{{
                      item.role_name + '（用款金额大于10万元）'
                    }}</span>
                    <!-- 副总经理 -->
                    <span class="size-medium" v-if="item.role_code === 802">{{
                      item.role_name + '（用款金额大于50万元）'
                    }}</span>
                  </template>
                  <template #description>
                    <div>
                      <span
                        class="flow-select"
                        :class="{
                          refuse: item.approval_result === 2 ? 'refuse' : '',
                          'color-3': item.approval_result === 1 ? 'color-3' : '',
                          'last-color': approval.approval_status === 2,
                        }"
                        >审批人:</span
                      >
                      <!-- 已审批 -->
                      <span v-if="item.approval_result">
                        <span
                          v-if="item.approval_result === 1"
                          :class="{
                            'color-3': item.approval_result === 1 ? 'color-3' : 'flow-select',
                            'last-color': approval.approval_status === 2,
                          }"
                          >{{ item.username + '（已同意）' }}</span
                        >
                        <span v-if="item.approval_result === 2" class="flow-select refuse">{{
                          item.username + '（已拒绝）'
                        }}</span>
                      </span>
                      <!-- 未审批 -->
                      <span v-else class="flow-select">{{ item.username }}</span>
                      <p v-if="item.remark !== ''" class="refuse">
                        {{ item.remark ? '理由:' + item.remark : '' }}
                      </p>
                      <p
                        v-if="item.approval_date"
                        :class="{
                          refuse: item.approval_result === 2 ? 'refuse' : '',
                          'last-color': approval.approval_status === 2,
                        }"
                        class="flow-select"
                      >
                        {{ item.approval_date }}
                      </p>
                    </div>
                  </template>
                </el-step>
              </el-steps>
              <el-steps
                direction="vertical"
                :active="1"
                class="step-username revocation"
                v-if="approval.approval_status === 4"
              >
                <el-step style="height: 82px">
                  <template #title><div style="font-size: 14px">申请人</div></template>
                  <template #description
                    ><div>
                      <span class="flow-select revocation-color">{{
                        approval.username + '（已撤销）'
                      }}</span>
                      <p class="flow-select revocation-color">{{ approval.gmt_modified }}</p>
                    </div>
                  </template>
                </el-step>
              </el-steps>
            </div>
          </el-form-item>
        </el-form>
      </tg-block>
    </div>
    <template #footer>
      <tg-button v-if="revocationVisiable && approval.approval_status === 1" @click="revocation"
        >撤销</tg-button
      >
      <tg-button v-if="btnVisiable && approval.approval_status === 1" type="primary" @click="refuse"
        >拒绝</tg-button
      >
      <tg-button v-if="btnVisiable && approval.approval_status === 1" type="primary" @click="agree"
        >同意</tg-button
      >
      <el-dialog
        :visible="approvalDialogVisible"
        class="userinfo-customer-dialog"
        width="460px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="approvalDialogVisible = false"
        :modal="false"
      >
        <template #title>
          <div class="userinfo-customer-dialog-header">拒绝理由</div>
        </template>
        <div class="approval-content">
          <p style="text-align: left; color: var(--text-color); margin-bottom: 10px">填写理由:</p>
          <el-input
            type="textarea"
            :rows="3"
            :maxlength="30"
            placeholder="请输入不超过30个字符"
            style="width: 100%"
            v-model="remark"
          />
        </div>
        <template #footer>
          <div class="userinfo-customer-dialog-footer">
            <el-button size="small" plain @click="approvalDialogVisible = false" class="big-button"
              >取消</el-button
            >
            <el-button
              size="small"
              type="primary"
              @click="handleApprovalSubmitClick"
              class="btn-blue big-button"
              >保存</el-button
            >
          </div>
        </template>
      </el-dialog>
    </template>
  </el-dialog>
</template>

<script src="./detail.ts"></script>

<style lang="less">
@import './detail.less';
</style>
