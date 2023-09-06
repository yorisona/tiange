<template>
  <div class="finance-invoice flex-auto">
    <!-- 搜索区 -->
    <tg-card class="flex-none" :padding="[16, 0, 4, 16]" @rect:update="onTopCardRectUpdate">
      <el-form :model="QueryForm" size="mini" label-width="60px">
        <div class="filter-form-div">
          <div class="filter-form-item">
            <el-form-item label="购买方：">
              <el-input
                placeholder="请输入购买方"
                v-model="QueryForm.buyer_name"
                v-key-enter="reload"
              ></el-input>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="销售方：">
              <el-input
                placeholder="请输入销售方"
                v-model="QueryForm.seller_name"
                v-key-enter="reload"
              ></el-input>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="发票号码：">
              <el-input
                placeholder="请输入关键字"
                v-model="QueryForm.invoice_number"
                v-key-enter="reload"
              ></el-input>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="发票日期：">
              <el-date-picker
                type="month"
                placeholder="请选择日期"
                v-model="QueryForm.invoice_month"
                format="yyyy.MM"
                value-format="yyyy-MM"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="发票类型：">
              <el-select popper-class="el-select-popper-mini" v-model="QueryForm.invoice_type">
                <el-option label="全部" value="" />
                <el-option label="销售发票" value="1" />
                <el-option label="采购发票" value="2" />
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="发票状态：">
              <el-select popper-class="el-select-popper-mini" v-model="QueryForm.invoice_status">
                <el-option label="全部" value="" />
                <el-option label="正常" value="1" />
                <el-option label="作废" value="2" />
                <el-option label="作废审批" value="3" />
                <el-option label="红冲审批" value="4" />
                <el-option label="红冲" value="5" />
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="验真状态：">
              <el-select popper-class="el-select-popper-mini" v-model="QueryForm.is_real">
                <el-option label="全部" value="" />
                <el-option label="已验真" :value="1" />
                <el-option label="未验真" :value="0" />
                <el-option label="验真失败" :value="-1" />
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="核销状态：">
              <el-select popper-class="el-select-popper-mini" v-model="QueryForm.write_off_status">
                <el-option label="全部" value="" />
                <el-option label="已核销" value="2" />
                <el-option label="未核销" value="0" />
                <el-option label="部分核销" value="1" />
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="业务类型：">
              <el-select popper-class="el-select-popper-mini" v-model="QueryForm.business_type">
                <el-option label="全部" value="" />
                <el-option
                  :key="key"
                  :label="item.label"
                  :value="item.value"
                  v-for="(item, key) in BusinessTypeOptions"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="所属部门：">
              <el-popover
                placement="bottom-start"
                width="304"
                trigger="click"
                v-model="treeData.show"
                popper-class="user-serch-popper"
              >
                <div slot="reference" class="repain-select250">
                  <el-input
                    placeholder="请选择部门"
                    readonly
                    style="color: var(--text-des-color)"
                    :value="treeData.input"
                  >
                    <i slot="suffix" class="select-icon el-icon-arrow-down" />
                  </el-input>
                </div>
                <el-tree
                  ref="treeRef"
                  :show-checkbox="true"
                  :check-strictly="true"
                  :data="treeData.data"
                  @check="treeData.check"
                  node-key="department_id"
                  :props="{
                    label: 'name',
                    children: 'sons',
                  }"
                />
              </el-popover>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="所属项目：">
              <el-input
                v-model="QueryForm.project_name"
                placeholder="请输入项目"
                v-key-enter="reload"
              />
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="结算单号：">
              <el-input
                placeholder="请输入结算单编号"
                v-model="QueryForm.settlement_uid"
                v-key-enter="reload"
              ></el-input>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="结算周期：">
              <el-date-picker
                type="month"
                placeholder="请选择日期"
                v-model="QueryForm.settlement_month"
                format="yyyy.MM"
                value-format="yyyy-MM"
              />
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="账期时间：">
              <el-date-picker
                type="month"
                placeholder="请选择日期"
                format="yyyy.MM"
                value-format="yyyy-MM"
                v-model="QueryForm.account_month"
              />
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label-width="0">
              <div class="filter-form-item-btn">
                <tg-button type="primary" @click="reload">查询</tg-button>
                <tg-button class="mgl-8" @click="reset">重置</tg-button>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </tg-card>

    <!-- 列表区域 -->
    <tg-card
      class="mgt-10"
      @rect:update="onRectUpdate"
      style="flex-grow: 1"
      v-bind="cardProps"
      v-loading="loading"
    >
      <div style="position: relative; height: 40px">
        <div
          style="
            line-height: 27px;
            left: 0px;
            margin-top: 12px;
            height: 28px;
            width: 100%;
            position: absolute;
            display: flex;
            align-items: center;
          "
        >
          <el-upload
            v-if="permission.add_invoice"
            :show-file-list="false"
            :headers="InvoiceUploadHeaders"
            :action="InvoiceUploadAPIURL"
            :on-success="InvoiceUploadResponseHandler"
            :before-upload="BeforeInvoiceUploadHandler"
          >
            <tg-button icon="ico-btn-add" size="small" type="primary" style="margin-right: 18px"
              >新增发票</tg-button
            >
          </el-upload>
          <tg-button size="small" :disabled="isDisabled" @click="exportData">导出</tg-button>
          <div class="icon-tipBox">
            <tg-icon name="ico-weibiaoti-11" style="margin-right: 8px; font-size: 14px" />
            <span style="color: var(--text-third-color); font-size: 12px"
              >开票日期为当月的发票如需作废，请走作废流程；开票日期早于当月的发票如需作废，请走开红票流程</span
            >
          </div>
        </div>
      </div>
      <el-table
        stripe
        border
        show-summary
        class="mgt-12"
        :data="DataList"
        v-bind="tableProps"
        :summary-method="summaryMethod"
      >
        <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
        <template #empty>
          <empty-common detail-text="暂无记录"></empty-common>
        </template>
      </el-table>
      <el-pagination
        v-if="DataList.length"
        :current-page.sync="QueryForm.page_num"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="QueryForm.num"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total_count"
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
      />
    </tg-card>
    <invoice-reverse-dialog
      :visible.sync="invoiceReverseDialogVisible"
      :invoice="currentInvoice"
      @success="reverseSuccess"
    >
    </invoice-reverse-dialog>
    <tg-mask-loading :visible="uploadLoading" content="正在上传发票，请稍候..." />
    <el-image-viewer
      cctv="sdfsdfsdf"
      v-if="showViewer"
      :on-close="closeViewer"
      :url-list="ImageUrlList"
    />
    <invoice-red-dialog ref="invoiceRedDialogRef" :invoice="currentInvoice" @success="reload" />
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less">
.finance-invoice {
  .el-table thead > tr > td > .cell,
  .el-table tbody > tr > td > .cell {
    height: 20px;
  }
  flex: auto;
  .tg-btn-link {
    font-size: 12px;
  }
  a {
    font-size: 12px;
  }
  .icon-tipBox {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
  }
  .invoiceImageView {
    width: 16px;
    height: 16px;
    cursor: pointer;
    color: #6a7b92;
  }

  .el-image img {
    max-height: 34px;
  }
  .el-form--inline .el-form-item {
    margin-right: 0;
  }
}
.red {
  color: #ec4141;
}
.finance-invoice-status-popper {
  cursor: pointer;
  border: none;
  box-shadow: 0 1px 10px 0 rgba(47, 56, 72, 0.12);

  .finance-invoice-popper-header {
    display: flex;
    // width: 531px;

    div {
      padding: 0 12px;
      font-size: var(--default-font-size);
      color: var(--text-color);
      font-weight: 600;
      // flex: 1;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: #f5f7f8;
      border-top: 1px solid var(--table-border-color);
      border-left: 1px solid var(--table-border-color);
      border-bottom: 1px solid var(--table-border-color);
    }
  }
  .finance-invoice-popper-row {
    display: flex;
    // width: 531px;
    div {
      // flex: 1;
      padding: 0 12px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      border-left: 1px solid var(--table-border-color);
      border-bottom: 1px solid var(--table-border-color);
    }
  }
}
</style>

<style lang="less" scoped>
.filter-form-div {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(214px, 1fr));
  /*grid-column-gap: 18px;*/
  /deep/ .filter-form-item {
    overflow: hidden !important;
    margin-right: 0;
    .el-input,
    .el-select {
      width: 100%;
    }
    .el-popover__reference-wrapper {
      .el-input__suffix {
        .el-input__suffix-inner {
          width: 25px;
          display: inline-block;
          line-height: 28px;
        }
      }
    }
  }
}
</style>
