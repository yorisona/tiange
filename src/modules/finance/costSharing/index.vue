<script src="./index.ts"></script>
<style lang="less" scoped>
@import './index.less';
</style>
<template>
  <div class="finance-cost-import-page flex-auto">
    <tg-card class="flex-none" :padding="[16, 0, 16, 16]" @rect:update="onTopCardRectUpdate">
      <el-form
        class="filter-form flex-form"
        :inline="true"
        size="mini"
        :show-message="false"
        label-width="40px"
      >
        <el-form-item label="日期：" class="flex-form-item flex-form-item-time" label-width="40px">
          <!-- <el-date-picker
            v-model="queryForm.pay_date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            class="time-select-box"
          />-->
          <el-date-picker
            v-model="queryForm.pay_date"
            type="month"
            placeholder="请选择日期"
            size="mini"
            :editable="false"
            format="yyyy.MM"
            value-format="yyyy-MM"
            style="width: 238px"
            class="time-select-box"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="部门：" class="flex-form-item flex-form-item-time">
          <department-select
            placeholder="请选择部门"
            :levelDisabled="deprtmentLevelDisabled"
            :levelHidden="departmentLevelHidden"
            :selectMultiple="true"
            :queryForm="{
              is_contain_goumee: true,
            }"
            style="width: 238px"
            clearable
            v-model="queryForm.feishu_department_id"
          ></department-select>
        </el-form-item>
        <el-form-item class="flex-form-item flex-form-item-time" label="项目：">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="queryForm.project_relevancy_id"
            filterable
            clearable
            class="time-select-box"
            placeholder="请输入名称搜索项目"
            remote
            :remote-method="getProjectIds"
            @change="val => selectProjrctIDChange(val)"
          >
            <el-option
              v-for="item in project_ids"
              :key="item.project_uid"
              :label="item.project_name"
              :value="item.project_uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="flex-form-item flex-form-item-time" label="类别：" label-width="40px">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="queryForm.expense_type_biz_code"
            filterable
            clearable
            class="time-select-box"
            placeholder="请选择类别"
          >
            <el-option
              v-for="item in expense_category_list"
              :key="item.expense_type_biz_code"
              :label="item.expense_type_name"
              :value="item.expense_type_biz_code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="flex-form-item flex-form-item-time" label="人员：" label-width="40px">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="queryForm.modified_by"
            filterable
            clearable
            class="time-select-box"
            placeholder="请输入花名搜索"
            remote
            :remote-method="queryUserList"
          >
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="0" class="flex-form-item order-100" style="margin-right: 20px">
          <tg-button type="primary" @click="searchListClick()">搜索</tg-button>
          <tg-button class="mgl-8" @click="resetDepartment()">重置</tg-button>
          <tg-button v-if="permission.cost_share_edit" class="mgl-8" @click="openCostImport()"
            >导入</tg-button
          >
          <tg-button v-if="permission.cost_share_export" class="mgl-8" @click="exportBtnClick()"
            >导出</tg-button
          >
          <tg-button v-if="permission.cost_share_edit" class="mgl-8" @click="deleteClick('')"
            >删除</tg-button
          >
        </el-form-item>
      </el-form>
    </tg-card>
    <tg-card
      class="mgt-10 flex-auto"
      :padding="[4, 16, 0, 16]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <div v-if="permission.cost_share_edit" class="mgt-12">
        <tg-button type="primary" @click="onNewHandler" icon="ico-btn-add">新增</tg-button>
      </div>
      <el-table
        v-if="permission.cost_share_view"
        stripe
        border
        :data="list"
        :summary-method="summaryMethod"
        v-bind="tableProps"
        v-loading="loading"
        :show-summary="true"
        class="mgt-12"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          :selectable="checkSelect"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column label="日期" min-width="80" align="center">
          <template slot-scope="scope">
            <div class="line-info">
              <p class="clamp-1">
                {{ (scope.row.allocated_time || '').replace(/-/g, '.') | emptyData }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="部门" min-width="180" align="left" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="line-info">
              <p class="clamp-1" style="text-align: left">
                {{ scope.row.multistage_department_name | emptyData }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="项目" min-width="140" align="left" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="line-info">
              <p class="clamp-1" style="text-align: left">
                {{ scope.row.project_name | emptyData }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="人数" width="55" align="right">
          <template slot-scope="scope">
            <div class="line-info">
              <p class="clamp-1" style="text-align: right">
                {{ scope.row.employee_num | emptyData }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="类别" min-width="140" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="line-info">
              <p class="clamp-1">{{ scope.row.expense_type_name | emptyData }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="金额 (元)" min-width="100" align="right">
          <template slot-scope="scope">
            <div class="line-info">
              <p>
                {{ formatAmount(Number(scope.row.allocated_amount || 0), 'None') | emptyData }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="280" align="left" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="line-info">
              <p class="clamp-1" style="text-align: left">
                {{ scope.row.comment | emptyData }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" min-width="138" align="center">
          <template slot-scope="scope">
            <div class="line-info">
              <p class="clamp-1">{{ scope.row.gmt_create | emptyData }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作人员" min-width="80" align="center">
          <template slot-scope="scope">
            <div class="line-info">
              <p class="clamp-1">{{ scope.row.modified_by_name | emptyData }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <div>
              <el-button
                v-if="permission.cost_share_edit"
                type="text"
                class="button-item-padding"
                @click="openEditCost(scope.row)"
                >编辑</el-button
              >
              <el-button
                v-if="permission.cost_share_edit"
                type="text"
                class="button-item-padding"
                @click="deleteClick(scope.row)"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
        <!-- 空白页 -->
        <template #empty>
          <empty-common detail-text="暂无数据"></empty-common>
        </template>
      </el-table>
      <el-pagination
        v-if="total > 0 && permission.cost_share_view"
        :current-page.sync="queryForm.page_num"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryForm.num"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
      />
    </tg-card>
    <CostImport :visiable="cost_import_visiable" @closeAction="hideCostImport"></CostImport>
    <EditCostData
      :costData="select_row"
      :visiable="edit_cost_visiable"
      @closeAction="hideCostImport"
    ></EditCostData>
  </div>
</template>
<style lang="less">
.cb-department-tree-popper-class {
  max-height: 360px;
  overflow: auto;
}
.clamp-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  text-align: center;
}
</style>
