<template>
  <div class="tg-contract-page flex-auto">
    <tg-card class="flex-none" :padding="[16, 0, 16, 16]" @rect:update="onTopCardRectUpdate">
      <el-form
        class="filter-form flex-form"
        :inline="true"
        size="mini"
        :show-message="false"
        label-width="84px"
      >
        <el-form-item label="合同搜索：" class="flex-form-item form-item-group">
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
              <el-option :value="5" label="项目名称" />
              <el-option :value="1" label="公司名称" />
              <el-option :value="3" label="合同编号" />
            </el-select>
          </el-input>
        </el-form-item>

        <el-form-item label="业务类型：" class="flex-form-item">
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

        <el-form-item label="合同类别：" class="flex-form-item">
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

        <el-form-item label="签约类型：" class="flex-form-item">
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

        <el-form-item label="结束日期：">
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

        <el-form-item label="费用类型：" class="flex-form-item">
          <el-select
            popper-class="el-select-popper-mini"
            class="select"
            v-model="queryForm.pay_type"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in PayConditionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="是否收回：" class="flex-form-item">
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
        <el-form-item class="flex-form-item order-100" style="margin-bottom: 14px">
          <tg-button type="primary" @click="reload">查询</tg-button>
          <tg-button class="mgl-8" @click="reset">重置</tg-button>
        </el-form-item>
      </el-form>
    </tg-card>
    <!-- [列表] -->
    <tg-card
      class="result-list Customer-contract mgt-12"
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
        <!--<el-table-column label="合同金额" width="180" align="right">
          <template slot="header"> <span style="padding-right: 10px">合同金额</span> </template>
          <template slot-scope="scope">
            <div>{{ scope.row.contractMoney || '&#45;&#45;' }}</div>
          </template>
        </el-table-column>-->
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
  </div>
</template>

<script src="./statisticsContract.ts"></script>

<style lang="less">
@import './index.less';
</style>
<style lang="less" scoped>
.filter-form-div .filter-form-item {
  flex: 1;
  min-width: 294px;
}
.el-form-item__content .el-input-group {
  width: 244px;
  vertical-align: top;
}
.el-select--medium,
.el-select {
  width: 244px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 244px;
}
/deep/ .el-form-item__label {
  width: 60px !important;
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
