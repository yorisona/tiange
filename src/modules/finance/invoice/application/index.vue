<template>
  <div class="finance-invoice-application flex-auto">
    <tg-card :padding="[16, 0, 0, 16]" @rect:update="onTopCardRectUpdate">
      <el-form :model="queryForm" size="mini" label-width="60px">
        <el-form-item label="项目名称：">
          <el-input
            style="width: 245px"
            placeholder="请输入项目名称"
            v-model="queryForm.project_name"
            v-key-enter="reload"
          ></el-input>
        </el-form-item>
        <el-form-item label="公司名称：">
          <el-input
            style="width: 245px"
            placeholder="请输入公司名称"
            v-model="queryForm.company_name"
            v-key-enter="reload"
          ></el-input>
        </el-form-item>
        <el-form-item label="审批编号：">
          <el-input
            style="width: 245px"
            placeholder="请输入审批编号"
            v-model="queryForm.approval_num"
            v-key-enter="reload"
          ></el-input>
        </el-form-item>
        <el-form-item label="发起时间：">
          <el-date-picker
            style="width: 245px"
            v-model="queryForm.start_time"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            class="time-select-box"
          />
        </el-form-item>
        <el-form-item label="发起人：">
          <el-input
            style="width: 245px"
            placeholder="请输入发起人"
            v-model="queryForm.add_by_name"
            v-key-enter="reload"
          ></el-input>
        </el-form-item>
        <el-form-item label="审批状态：">
          <el-select
            popper-class="el-select-popper-mini"
            style="width: 245px"
            v-model="queryForm.approval_status"
          >
            <el-option label="全部" value="" />
            <el-option label="审批中" :value="1" />
            <el-option label="审批成功" :value="2" />
            <el-option label="审批失败" :value="3" />
            <el-option label="已撤销" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="开票状态：">
          <el-select
            popper-class="el-select-popper-mini"
            style="width: 245px"
            v-model="queryForm.invoiced"
          >
            <el-option label="全部" value="" />
            <el-option label="已开票" :value="1" />
            <el-option label="未开票" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label-width="0">
          <div class="filter-form-item-btn">
            <tg-button type="primary" @click="reload">查询</tg-button>
            <tg-button class="mgl-8" @click="reset">重置</tg-button>
          </div>
        </el-form-item>
      </el-form>
    </tg-card>
    <tg-card
      class="mgt-10"
      :padding="[12, 16, 0, 16]"
      @rect:update="onRectUpdate"
      style="flex-grow: 1"
      v-bind="cardProps"
      v-loading="loading"
    >
      <div>
        <tg-button type="primary" icon="ico-fapiao" @click="showMakeInvoiceDailog"
          >开票申请</tg-button
        >
      </div>

      <el-table
        stripe
        border
        class="mgt-12"
        :data="list"
        @row-click.self="onRowClick"
        v-bind="tableProps"
      >
        <el-table-column v-for="(col, index) in invoiceColumns" v-bind="col" :key="index" />
        <template #empty>
          <empty-common detail-text="暂无记录"></empty-common>
        </template>
      </el-table>
      <el-pagination
        v-if="list.length"
        :current-page.sync="queryForm.page_num"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryForm.num"
        layout="total, prev, pager, next, sizes, jumper"
        :total="queryForm.total"
        @current-change="currentPageChange"
        @size-change="pageSizeChange"
      />
    </tg-card>
    <MakeInvoiceDialog ref="MakeInvoiceDialogRef" :reload="true" @success="reload" />
    <invoice-upload ref="InvoiceUploadRef" @success="reload"></invoice-upload>
    <invoices-detail ref="InvoiceDetailDialogRef" />
    <tg-mask-loading :visible="detailLoading" content="努力加载中..." />
    <invoice-red-dialog
      ref="invoiceRedDialogRef"
      :invoice="invoiceRed"
      :isEdit="true"
      @success="reload"
    />
    <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="ImageUrlList" />
    <red-detail ref="RedDetailDialogRef" @success="reload" />
  </div>
</template>

<script src="./index.ts"></script>
<style lang="less" scoped>
.finance-invoice-application {
  /deep/ .number-div {
    display: flex;
    justify-content: center;
    .number-span {
      width: 180px;
      text-align: left;
      margin-right: -40px;
    }
  }
  /deep/ a {
    font-size: 12px;
  }
  /deep/ tr {
    cursor: pointer;
  }
  .table-column-edit {
    display: flex;
    justify-content: space-between;
  }
  /deep/ .status-box {
    display: flex;
    justify-content: center;
    width: 100%;
    padding-left: 10px;
    .point {
      display: inline-block;
      width: 6px;
      height: 6px;
      margin-top: 7px;
      margin-right: 6px;
      border-radius: 50%;
      &.cancel {
        background: rgba(var(--fail-rgb-color), 0.6);
      }
      &.success {
        background: #33ba5d;
      }
      &.waiting {
        background: #ff955f;
      }
      &.failure {
        background: #f04b4b;
      }
    }
    .text {
      width: 60px;
      text-align: left;
    }
  }
}
/deep/ .el-form .el-form-item {
  margin-bottom: 12px;
  display: inline-block;
  width: 304px;
  margin-right: 18px;
}
</style>
