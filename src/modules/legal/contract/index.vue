<template>
  <div class="tg-contract-page flex-auto">
    <tg-card class="flex-none" :padding="[16, 0, 16, 16]" @rect:update="onTopCardRectUpdate">
      <el-form
        class="filter-form flex-form"
        :inline="true"
        size="mini"
        :show-message="false"
        label-width="74px"
      >
        <el-form-item
          label="合同类别："
          class="flex-form-item"
          style="margin-right: 20px; margin-bottom: 12px"
        >
          <el-select
            popper-class="el-select-popper-mini"
            class="select"
            v-model="queryForm.partner_type"
            placeholder="请选择"
          >
            <el-option
              v-for="item in contractTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="业务类型："
          class="flex-form-item"
          style="margin-right: 20px; margin-bottom: 12px"
        >
          <el-select
            popper-class="el-select-popper-mini"
            class="select"
            v-model="queryForm.business_type"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in businessTypeOptions"
              :key="item.value"
              合同搜索
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="签约类型："
          class="flex-form-item"
          style="margin-right: 20px; margin-bottom: 12px"
        >
          <el-select
            popper-class="el-select-popper-mini"
            class="select"
            v-model="queryForm.sign_type"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in saleContractTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="合同状态："
          class="flex-form-item"
          style="margin-right: 20px; margin-bottom: 12px"
        >
          <el-select
            popper-class="el-select-popper-mini"
            class="select"
            v-model="queryForm.contract_status"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in ApprovalStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="合同扫描件："
          class="flex-form-item"
          style="margin-right: 20px; margin-bottom: 12px"
        >
          <el-select
            popper-class="el-select-popper-mini"
            class="select"
            v-model="queryForm.contract_scan_flag"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in ContractScanFlagOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="是否收回："
          class="flex-form-item"
          style="margin-right: 20px; margin-bottom: 12px"
        >
          <el-select
            popper-class="el-select-popper-mini"
            class="select"
            v-model="queryForm.is_recycled"
            clearable
            placeholder="请选择"
          >
            <el-option label="全部" :value="undefined" />
            <el-option label="已收回" :value="1" />
            <el-option label="未收回" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="结束日期：" style="margin-right: 20px; margin-bottom: 12px">
          <el-date-picker
            v-model="queryForm.coop_end_date"
            type="date"
            size="mini"
            placeholder="请选择日期"
            start-placeholder="结束日期"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item
          label="合同搜索："
          class="flex-form-item form-item-group"
          style="margin-right: 20px; margin-bottom: 12px"
        >
          <el-input
            class="contract-input"
            v-model="queryForm.partner_name"
            :placeholder="parther_select_placeholder"
            clearable
            @keypress.enter.native="reload"
          >
            <el-select
              popper-class="el-select-popper-mini"
              v-model="partner_select_type"
              style="width: 110px; padding-left: 6px"
              slot="prepend"
            >
              <el-option :value="1" label="客户名称" />
              <el-option :value="2" label="供应商名称" />
              <el-option :value="3" label="合同编号" />
              <el-option :value="4" label="创建人" />
              <el-option :value="5" label="项目名称" />
              <el-option :value="6" label="项目编号" />
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item
          class="flex-form-item order-100"
          style="margin-right: 20px; margin-bottom: 14px"
        >
          <tg-button type="primary" @click="reload">查询</tg-button>
          <tg-button class="mgl-8" @click="reset">重置</tg-button>
        </el-form-item>
      </el-form>
    </tg-card>
    <!-- [列表] -->
    <tg-card
      class="result-list Customer-contract mgt-10"
      :class="cardFlexClass"
      :padding="[16, 16, 0, 16]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <el-table
        stripe
        border
        v-if="Permission.canViewContractList"
        :data="list"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        :row-style="{ cursor: 'pointer' }"
        height="100%"
      >
        <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
        <!-- 空白页 -->
        <template #empty>
          <empty-common detail-text="暂无合同数据"></empty-common>
        </template>
      </el-table>
      <el-pagination
        v-if="Permission.canViewContractList && list.length"
        :current-page.sync="queryForm.page_num"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="queryForm.num"
        layout="total,prev, pager, next, sizes, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
      />
    </tg-card>
    <review-dialog ref="reviewDialog" @approved="queryContract" />
    <!-- 新增合同复印件 -->
    <add-contract-copy-dialog
      ref="addContractCopyDialogRef"
      @added="queryContract"
      :contractId="contractId"
    />
    <AnnexDialog @dialog:close="onAnnexDialogClose" />
    <tg-mask-loading :visible="approvalLoading" content="正在保存，请稍候..." />
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less">
@import './index.less';
</style>
<style lang="less" scoped>
.filter-form-div .filter-form-item {
  flex: 1;
  min-width: 294px;
}
.filter-form-div .el-form-item {
  margin-right: 0px !important;
}
.el-form-item__content .el-input-group {
  width: 240px;
  vertical-align: top;
}
.el-select--medium {
  width: 240px;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner,
.el-select,
.el-select .el-input,
.el-select .el-input .el-input__inner {
  width: 176px;
}
/*.el-table__fixed,
.el-table__fixed-right {
  background-color: white;
}
/deep/ .el-table__fixed,
.el-table__fixed-right {
  background-color: white;
}*/
</style>
