<template>
  <div>
    <tg-card :padding="[16, 16, 4, 16]" @rect:update="onTopCardRectUpdate">
      <el-form size="mini" label-width="70px" @submit.native.prevent="onFilterFormSubmit">
        <div class="filter-form-div">
          <div class="filter-form-item" style="min-width: 314px">
            <el-form-item label="项目搜索：">
              <el-input
                placeholder="请输入关键字"
                v-model="filterForm.search_value"
                class="input-with-select"
                style="width: 244px"
              >
                <el-select
                  popper-class="el-select-popper-mini"
                  v-model="filterForm.search_type"
                  slot="prepend"
                  placeholder="请选择"
                  style="width: 100px; padding-left: 6px"
                >
                  <el-option label="项目名称" :value="1"></el-option>
                  <el-option label="项目编码" :value="2"></el-option>
                  <el-option label="客户名称" :value="3"></el-option>
                  <el-option label="结算编号" :value="5"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="结算状态：">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="filterForm.status"
                style="width: 100%"
              >
                <el-option label="全部" value="" />
                <el-option
                  v-for="opt in SettlementStatusOptions"
                  :value="opt.value"
                  :label="opt.label"
                  :key="opt.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="结算周期：">
              <el-date-picker
                v-model="filterForm.month"
                type="month"
                placeholder="选择月"
                style="width: 100%"
                format="yyyy.MM"
                value-format="yyyy-MM"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="filter-form-item" style="min-width: 274px">
            <el-form-item label-width="0">
              <div class="filter-form-item-btn">
                <tg-button type="primary" @click="onSearchClick">查询</tg-button>
                <tg-button class="mgl-12" @click="onResetClick">重置</tg-button>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </tg-card>
    <tg-card
      v-loading="loading"
      class="mgt-12"
      :class="cardFlexClass"
      :padding="[0, 18, 0, 18]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <tg-button-line class="mgt-12">
        <tg-button icon="ico-btn-add" type="primary" @click="onApproveBtnClick"
          >结算单审批</tg-button
        >
      </tg-button-line>
      <el-table stripe border class="mgt-12" :data="data" v-bind="tableProps">
        <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
        <template #empty>
          <empty-common />
        </template>
      </el-table>
      <el-pagination
        v-if="total > 0"
        :current-page.sync="filterForm.page_num"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="filterForm.num"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
      />
      <SettlementDialog ref="settlementRef" @close="onDialogClose"></SettlementDialog>
      <buessiness-settlement
        @success="reload"
        :readonly="onlyCheckDetail"
        ref="BuessinessSettlement"
      />
      <achievement @ok="reload" ref="achievementRef" />
      <reverseOrderDialog ref="reverseOrderDialogRef" />
      <make-invoice-dialog ref="MakeInvoiceDialogRef" :reload="true" @success="reload" />
      <!-- <addSettlementDialog
        ref="addSettlementDialog"
        @added="onSettlementAdded"
        :editData="{}"
      ></addSettlementDialog> -->
      <settlementApprove
        :isMerchant="true"
        :visible.sync="approveVisible"
        @dialog:close="onApproveClose"
      ></settlementApprove>
      <reverseAuditDialog ref="reverseAuditDialogRef" />
      <el-dialog
        class="tg-dialog-classic tg-dialog-vcenter"
        :visible="reasonDialogVisible"
        width="440px"
        @close="onReasonDialogClose"
      >
        <template #title>{{ reasonDialogTitle }}</template>
        <div class="reason-dialog-content">{{ reason }}</div>
      </el-dialog>
    </tg-card>
    <tg-mask-loading :visible="ladingStatus" :content="loadingText" />
  </div>
</template>
<script src="./index.ts"></script>

<style lang="less">
@import './index.less';
</style>

<style lang="less" scoped>
/deep/ .number-div {
  display: flex;
  justify-content: center;

  .number-span {
    width: 140px;
    text-align: left;
    margin-right: -35px;
  }
}
/deep/ .el-table td .operation {
  display: inline-grid;
  grid-auto-flow: column;
  -moz-column-gap: 12px;
  column-gap: 0px !important;
  .line-clamp-1 {
    &:last-child {
      margin-right: 0px;
    }
    margin-right: 12px;
  }
}
/deep/ .el-table {
  a,
  .cell,
  .status {
    font-size: 12px;
  }
  .tg-button {
    margin-right: 10px;
  }
}
</style>
