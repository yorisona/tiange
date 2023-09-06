<!--
 * @Author: 葶苧
 * @Date: 2021-04-07 16:34:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-12 14:15:30
 * @Description: 营销业务-项目管理-成本安排表
-->
<template>
  <tg-card
    class="marketing-project-cost-schedule-should flex-auto"
    @rect:update="onRectUpdate"
    v-bind="cardProps"
  >
    <div class="cost-headers">
      <div class="cost-headers-sumary">
        <!-- <tg-button class="payment-btn" type="primary" icon="ico-btn-add" @click="showPaymentDialog"
          >付款申请</tg-button
        > -->
        <span class="cost-headers-sumary-label">应付金额：</span
        ><span class="cost-headers-sumary-value">{{
          costSchedule ? moneyFormat(costSchedule.stat_info.payable) : '--'
        }}</span>
        <span class="cost-headers-sumary-label">已核销金额：</span
        ><span class="cost-headers-sumary-value">{{
          costSchedule ? moneyFormat(costSchedule.stat_info.write_off) : '--'
        }}</span>
        <span class="cost-headers-sumary-label">未核销金额：</span
        ><span class="cost-headers-sumary-value">{{
          costSchedule ? moneyFormat(costSchedule.stat_info.not_write_off) : '--'
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
    ></CostRegister>
    <RebatesRegister
      :style="rebatesRegisterVisible ? undefined : 'display: none'"
      :editRebate="editRebate"
      :visible.sync="rebatesRegisterVisible"
      @save="costListSaved"
    ></RebatesRegister>
    <CostInvoice
      :style="costInvoiceVisible ? undefined : 'display: none'"
      :visible.sync="costInvoiceVisible"
      :invoices="invoices"
    ></CostInvoice>
    <PayCertificate
      :style="payCertificateVisible ? undefined : 'display: none'"
      :visible.sync="payCertificateVisible"
      :pay_certificate_pic="payCertificatePic"
    ></PayCertificate>
    <CostVTask
      :style="costVTaskVisible ? undefined : 'display: none'"
      :visible.sync="costVTaskVisible"
      :vtasks="vtasks"
    ></CostVTask>
    <apply-detail ref="applyDetailRef" v-if="customerVisible" @close="applyDetailClose" />
    <application-detail
      ref="applicationDetailRef"
      v-if="applicationDetailVisible"
      @close="applicationDetailClose"
    ></application-detail>
    <refund-detail
      v-if="refundVisible"
      :visible="refundVisible"
      :approval="approval"
      @close="refundDetailClose"
      :commitAgainVisible="false"
    ></refund-detail>
    <tg-mask-loading :visible="deleteLoading" content="  正在删除，请稍候..." />
    <first-step ref="firstStepRef" @submit="costListSaved" />
    <payment-dialog
      v-if="paymentDialogVisible"
      :visible.sync="paymentDialogVisible"
      :data="paymentData"
      @dialog:close="paymentDialogVisible = false"
    ></payment-dialog>
  </tg-card>
</template>

<script src="./index.tsx"></script>

<style lang="less">
@import './index.less';
.marketing-project-cost-schedule-should {
  .reverse-div {
    display: inline-block;
    margin-bottom: 0;
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
}
</style>
