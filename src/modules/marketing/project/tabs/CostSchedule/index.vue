<!--
 * @Author: 葶苧
 * @Date: 2021-04-07 16:34:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-12 14:07:27
 * @Description: 营销业务-项目管理-成本安排表
-->
<template>
  <tg-card
    class="marketing-project-cost-schedule flex-none"
    @rect:update="onRectUpdate"
    v-bind="cardProps"
  >
    <div class="cost-headers" style="padding: 12px 0">
      <!-- <div
        class="cost-headers-operations"
        v-if="Permission.canChange && (costRegisterPermission || costRebatePermission)"
      >
        <tg-button
          v-if="costRegisterPermission"
          type="primary"
          icon="ico-btn-add"
          @click="
            () => {
              costRegisterVisible = true;
              editCost = undefined;
            }
          "
          >登记成本</tg-button
        > -->
      <!--        <tg-button-->
      <!--          v-if="Permission.canViewList && costRebatePermission"-->
      <!--          icon="ico-btn-add"-->
      <!--          @click="-->
      <!--            () => {-->
      <!--              rebatesRegisterVisible = true;-->
      <!--              editRebate = undefined;-->
      <!--            }-->
      <!--          "-->
      <!--          >登记返点</tg-button-->
      <!--        >-->
      <!-- </div> -->
      <div class="cost-headers-sumary">
        <span class="cost-headers-sumary-label">登记付款：</span>
        <span class="cost-headers-sumary-value">{{
          costSchedule ? moneyFormat(costSchedule.stat_info.total_pay_amount) : '--'
        }}</span>
        <span class="cost-headers-sumary-label">已付款：</span>
        <span class="cost-headers-sumary-value">{{
          costSchedule ? moneyFormat(costSchedule.stat_info.paid_amount) : '--'
        }}</span>
        <span class="cost-headers-sumary-label">待付款：</span>
        <span class="cost-headers-sumary-value">{{
          costSchedule ? moneyFormat(costSchedule.stat_info.wait_pay_amount) : '--'
        }}</span>
        <span class="cost-headers-sumary-label">已核销金额：</span>
        <span class="cost-headers-sumary-value">{{
          costSchedule ? moneyFormat(costSchedule.stat_info.write_off_amount) : '--'
        }}</span>
        <span class="cost-headers-sumary-label">未核销金额：</span>
        <span class="cost-headers-sumary-value">{{
          costSchedule ? moneyFormat(costSchedule.stat_info.not_write_off_amount) : '--'
        }}</span>
        <div class="reverse-div">
          <el-checkbox @change="reload" v-model="isHideReversed" size="small">
            <span>隐藏已冲销数据</span>
          </el-checkbox>
        </div>
      </div>
    </div>
    <el-table
      stripe
      border
      v-if="Permission.canViewList"
      :data="costDataList"
      :cell-style="{ cursor: 'pointer' }"
      v-loading="loading"
      v-bind="tableProps"
      @row-click.self="onRowClick"
    >
      <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
      <!-- 空白页 -->
      <template #empty>
        <empty-common detail-text="暂无数据"></empty-common>
      </template>
    </el-table>
    <CostRegister
      :style="costRegisterVisible ? undefined : 'display: none'"
      :editCost="editCost"
      :visible.sync="costRegisterVisible"
      @save="costListSaved"
    />
    <RebatesRegister
      :style="rebatesRegisterVisible ? undefined : 'display: none'"
      :editRebate="editRebate"
      :visible.sync="rebatesRegisterVisible"
      @save="costListSaved"
    />
    <CostInvoice
      :style="costInvoiceVisible ? undefined : 'display: none'"
      :visible.sync="costInvoiceVisible"
      :invoices="invoices"
    />
    <PayCertificate
      :style="payCertificateVisible ? undefined : 'display: none'"
      :visible.sync="payCertificateVisible"
      :pay_certificate_pic="payCertificatePic"
    />
    <CostVTask
      :style="costVTaskVisible ? undefined : 'display: none'"
      :visible.sync="costVTaskVisible"
      :vtasks="vtasks"
    />
    <!--    <apply-detail ref="applyDetailRef" v-if="customerVisible" @close="applyDetailClose" />-->

    <PaymentDetailDialog
      v-if="customerVisible"
      :visible="customerVisible"
      :info="approval"
      @dialog:close="applyDetailClose"
    />

    <!--    <application-detail-->
    <!--      ref="applicationDetailRef"-->
    <!--      v-if="applicationDetailVisible"-->
    <!--      @close="applicationDetailClose"-->
    <!--    />-->

    <AdvanceDetailDialog
      v-if="applicationDetailVisible"
      :visible="applicationDetailVisible"
      :info="approval"
      @dialog:close="applicationDetailClose"
    />

    <!--    <refund-detail-->
    <!--      v-if="refundVisible"-->
    <!--      :visible="refundVisible"-->
    <!--      :approval="approval"-->
    <!--      @close="refundDetailClose"-->
    <!--      :commitAgainVisible="false"-->
    <!--    />-->
    <refund-detail-dialog
      v-if="refundVisible"
      :visible="refundVisible"
      :info="approval"
      :isRealPay="true"
      @dialog:close="refundDetailClose"
    />
    <tg-mask-loading :visible="deleteLoading" content="正在删除，请稍候..." />
    <first-step ref="firstStepRef" @submit="costListSaved" />
    <reverseOrderDialog ref="reverseOrderDialogRef" />
    <tg-mask-loading :visible="reverseLoading" content="正在提交冲销，请稍候..." />
    <tg-mask-loading :visible="reverseAgainLoading" content="正在重新提交冲销，请稍候..." />
    <el-dialog
      class="tg-dialog-classic tg-dialog-vcenter-new"
      :visible="reasonDialogVisible"
      width="440px"
      @close="onReasonDialogClose"
    >
      <template #title>{{ reasonDialogTitle }}</template>
      <div class="reason-dialog-content">{{ reason }}</div>
    </el-dialog>
    <pay-refund
      :rawAmount="payRefundAmout"
      :visible.sync="payRefundVisible"
      :costId="payRefundCostId"
      :businessType="payRefundBusinessType"
      @save="onPayRefundSave"
    ></pay-refund>
    <refund-write-off
      type="receive"
      :projectType="2"
      :visible.sync="refundWriteOffVisible"
      :notWriteOffAmount="notRefundWriteOffAmount"
      :invoiceId="refundWriteoffId"
      :costId="refundWriteoffCostId"
      @save="onRefundWriteOffSave"
    ></refund-write-off>
    <LoanfinanceDetailModal
      v-if="loanDetailVisible"
      :visible="loanDetailVisible"
      :detail-data="detail_data"
      @dialog:closerow="onLoanDetailClose"
    />
    <start-pay
      :visible.sync="startPayVisible"
      :cost="startPayCost"
      @save="onStartPaySave"
    ></start-pay>
  </tg-card>
</template>

<script src="./index.ts" />

<style lang="less">
@import './index.less';
.marketing-project-cost-schedule {
  .reverse-div {
    display: inline-block;
    margin-bottom: 12px;
    .el-checkbox__input {
      margin-top: -1px;
      .el-checkbox__inner {
        width: 12px;
        height: 12px;
        &::after {
          top: 1px;
          width: 3px;
          height: 6px;
          left: 3.5px;
        }
      }
    }
  }
  a,
  .status {
    font-size: 12px;
  }
  .ico-frm-delete {
    margin-top: 3px;
  }
}
</style>
