<template>
  <div class="tg-customer-list-company-list-page flex-auto">
    <tg-card :padding="[16, 16, 4, 16]" @rect:update="onTopCardRectUpdate">
      <el-form
        size="mini"
        :show-message="false"
        label-width="60px"
        @submit.native.prevent="onFilterFormSubmit"
      >
        <div class="filter-form-div">
          <div class="filter-form-item">
            <el-form-item label="公司名称：">
              <el-input
                v-key-enter="reload"
                clearable
                placeholder="请输入公司名称"
                v-model="filterForm.company_name"
              />
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="审核状态：">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="filterForm.verify_status"
                style="width: 100%"
              >
                <el-option value label="全部" />
                <el-option
                  :label="opt.label"
                  :value="opt.value"
                  :key="opt.value"
                  v-for="opt in companyVerifyStatusFilter"
                />
              </el-select>
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
    <tg-card
      class="mgt-10"
      :class="cardFlexClass"
      :padding="[10, 16, 0, 16]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <tg-button-line
        class="flex-none"
        :style="{ padding: hasRightAddCompany ? ' 0 0 10px' : ' 0 0 4px' }"
      >
        <tg-button
          type="primary"
          icon="ico-btn-add"
          @click="onCreateBtnClickNew"
          v-if="hasRightAddCompany"
          >新增公司</tg-button
        >
        <!--
        <tg-button
          type="default"
          icon="ico-btn-export"
          @click="exportCompany"
          v-if="hasRightExportCompany"
          >导出</tg-button
        >
        -->
      </tg-button-line>
      <el-table
        stripe
        class="customer-table"
        v-loading="loading"
        :data="data"
        v-bind="tableProps"
        @selection-change="onSelectionChange"
        @row-click="onRowClick"
      >
        <template #empty>
          <empty-common detail-text="暂无公司数据"></empty-common>
        </template>
        <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
      </el-table>
      <el-pagination
        v-if="data.length > 0"
        class="flex-none"
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
        :current-page="filterForm.page_num"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="filterForm.num"
        :total="total"
        layout="total, prev, pager, next, sizes, jumper"
      />
    </tg-card>
    <formDrawer ref="formDrawerRef" @form:submit:success="reload" />
  </div>
</template>

<script src="./list.tsx"></script>

<style lang="less">
@import './list.less';
.customer-table {
  a {
    font-size: 12px;
  }
}
</style>
