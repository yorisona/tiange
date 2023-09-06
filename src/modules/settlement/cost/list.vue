<template>
  <tg-card
    class="settlement-tab flex-auto"
    @rect:update="onTopCardRectUpdate"
    v-bind="cardProps"
    v-loading="loading"
    :style="{
      paddingBottom: isFromMarketing && data.length < 1 ? '32px !important' : '',
    }"
  >
    <!-- <tg-button-line style="min-height: 12px"> -->
    <div class="search-box" style="padding: 16px 0 4px 0">
      <incomeSearch @search="search" @reload="reload">
        <div slot="searchAfter" class="initiate-box">
          <tg-button
            v-if="CanIUse.createBtn"
            class="mgr-8 mgb-12"
            type="primary"
            @click="onCreateBtnClick"
            :disabled="project === undefined"
            >{{ buttonContent }}</tg-button
          >
          <tg-button
            v-if="CanIUse.createBtn"
            :class="
              (isFromLive ||
                isFromLiveDouyin ||
                isFromLocalLife ||
                isFromCommon ||
                isFromSupplyChain) &&
              CanIUse.auditBtn
                ? 'mgr-8 mgb-12'
                : 'mgb-12'
            "
            type="primary"
            @click="onCreateBtnClick(1)"
            :disabled="project === undefined"
            >暂估结算</tg-button
          >
          <tg-button
            v-if="
              (isFromLive ||
                isFromLiveDouyin ||
                isFromLocalLife ||
                isFromCommon ||
                isFromSupplyChain) &&
              CanIUse.auditBtn
            "
            class="mgb-12"
            @click="onApproveBtnClick()"
            >结算单审批</tg-button
          >
          <div class="reverse-div mgb-12">
            <el-checkbox @change="reload" v-model="isHideReversed" size="small">
              <span>隐藏已冲销数据</span>
            </el-checkbox>
          </div>
        </div></incomeSearch
      >
    </div>
    <!-- </tg-button-line> -->
    <el-table
      stripe
      border
      :data="data"
      v-bind="tableProps"
      @cell-click="row => onViewBtnClick(row)"
      :row-style="({ row }) => rowStyle(row)"
    >
      <el-table-column v-for="(col, colIndex) in columns" v-bind="col" :key="colIndex" />
      <template #empty>
        <empty-common detail-text="暂无成本结算"></empty-common>
      </template>
    </el-table>
    <el-pagination
      :current-page.sync="filterForm.page_num"
      :page-sizes="[10, 20, 50, 100, 200]"
      :page-size="filterForm.num"
      layout="total, prev, pager, next, sizes, jumper"
      :total="total"
      @current-change="onCurrentChange"
      @size-change="onSizeChange"
      v-if="total > 0"
    />
    <el-dialog
      class="tg-dialog-classic tg-dialog-vcenter-new"
      :visible="reasonDialogVisible"
      width="440px"
      @close="onReasonDialogClose"
    >
      <template #title>{{ reasonDialogTitle }}</template>
      <div class="reason-dialog-content">{{ reason }}</div>
    </el-dialog>
    <TgSettlementDialog
      ref="dialogRef"
      @close="onDialogClose"
      @update="onCacheShouldUpdate"
      @outdated="onCacheOutdated"
    />
    <settlement-detail-dialog :readonly="true" ref="settlementDetailDialogRef" />
    <tg-mask-loading :visible="deleteLoading" content="正在删除，请稍候..." />
    <reverseOrderDialog ref="reverseOrderDialogRef" />
    <addSettlementDialog
      ref="addSettlementDialog"
      @added="onSettlementAdded"
      :editData="{}"
    ></addSettlementDialog>
    <payment-dialog
      :visible.sync="paymentDialogVisible"
      :data="paymentData"
      :settlement="paySettlement"
      :projectType="projectType"
      :customerManager="customerManager"
      @save="onPaymentSave"
    ></payment-dialog>
    <invoice-upload ref="InvoiceUploadRef" @success="onInvoiceUploadSuccess"></invoice-upload>
    <tg-mask-loading :visible="reverseLoading" content="正在提交冲销，请稍候..." />
    <tg-mask-loading :visible="reverseAgainLoading" content="正在提交冲销，请稍候..." />
    <tg-mask-loading :visible="isFetchingDetail" content="正在获取详情，请稍候..." />
  </tg-card>
</template>

<script lang="ts">
import setup from './list';

export default setup();
</script>

<style lang="less">
@import './list.less';
.settlement-tab {
  a {
    font-size: 12px;
  }
  .number-div {
    display: flex;
    justify-content: center;
    .number-span {
      width: 140px;
      text-align: left;
      margin-right: -25px;
    }
  }
  .el-table tbody > tr > td {
    padding: 6px 0px !important;
  }
  .search-box .initiate-box .reverse-div {
    display: inline-block;
    margin-left: 18px;
    .el-checkbox__input {
      margin-top: -1px;
      .el-checkbox__inner {
        width: 12px;
        height: 12px;
        &::after {
          top: 1px;
          width: 3px;
          height: 6px;
          left: 4px;
        }
      }
    }
  }
}
</style>
