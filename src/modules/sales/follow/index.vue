<template>
  <div class="sales-customer-follow">
    <tg-card class="flex-none" :padding="[10, 18, 4, 18]" @rect:update="onTopCardRectUpdate">
      <el-form
        class="flex-form"
        :inline="true"
        size="small"
        :show-message="false"
        label-width="70px"
        style="margin-top: 8px"
      >
        <el-form-item label="客户意向：" class="flex-form-item" style="margin: 0 20px 14px 0">
          <el-select
            v-model="queryForm.customer_intention"
            class="select"
            placeholder=""
            style="width: 246px; margin-bottom: 0"
          >
            <el-option label="全部" value="" />
            <el-option label="标三" :value="1" />
            <el-option label="方案" :value="2" />
            <el-option label="重点" :value="3" />
            <el-option label="预测" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态：" class="flex-form-item" style="margin: 0 20px 14px 0">
          <el-select
            v-model="queryForm.status"
            class="select"
            placeholder=""
            style="width: 246px; margin-bottom: 0"
          >
            <el-option label="全部" value="" />
            <el-option label="跟进中" :value="0" />
            <el-option label="已合作" :value="2" />
            <el-option label="已关闭" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务类型：" class="flex-form-item" style="margin: 0 20px 14px 0">
          <el-select
            v-model="queryForm.business_type"
            class="select"
            placeholder=""
            style="width: 246px; margin-bottom: 0"
          >
            <el-option label="全部" value="" />
            <el-option
              :key="key"
              :label="item.label"
              :value="item.value"
              v-for="(item, key) in BusinessTypeOptions"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="任务搜索："
          class="flex-form-item form-item-group"
          style="margin: 0 20px 14px 0"
        >
          <el-input
            placeholder="请输入关键字"
            v-model.trim="queryForm.search_value"
            class="input-with-select"
            clearable
            style="width: 246px; margin-bottom: 0"
            @keypress.enter.native="reload"
          >
            <el-select
              placeholder="请选择"
              v-model="queryForm.search_type"
              style="width: 100px; color: var(--text-color)"
              slot="prepend"
            >
              <el-option label="客户经理" value="customer_manager" />
              <el-option label="客户名称" value="customer_name" />
              <el-option label="任务编号" value="mission_no" />
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label=" " class="flex-form-item order-100" style="margin: 0 20px 14px 0">
          <tg-button type="primary" @click="onQuerySearchClick">查询</tg-button>
          <tg-button type="negative" class="mgl-12" @click="onQueryResetClick">重置</tg-button>
        </el-form-item>
      </el-form>
    </tg-card>
    <tg-card
      class="mgt-18"
      :class="cardFlexClass"
      :padding="[12, 18, 18, 18]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <tg-button-line>
        <tg-button
          v-if="permission.sales_add_task_save"
          @click="handleAddLiveDisplayAction"
          type="primary"
          icon="ico-btn-add"
          >新增跟进任务
        </tg-button>
      </tg-button-line>
      <el-table
        stripe
        class="mgt-12"
        :data="list"
        v-loading="loading"
        :cell-style="{ cursor: 'pointer' }"
        v-bind="tableProps"
        @row-click="jumpDetail"
      >
        <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
        <template #empty>
          <empty-common detail-text="暂无跟进任务 "></empty-common>
        </template>
      </el-table>
      <el-pagination
        :current-page.sync="queryForm.page_num"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryForm.num"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
        v-if="total > 0"
      />
    </tg-card>
    <salesFollowAddDialog
      v-if="shouldEditing"
      @succeed="handleSaveSucceedAction"
      @closeAction="handleCloseAction"
    />
  </div>
</template>

<script src="./index.tsx"></script>

<style lang="less">
@import './index.less';
</style>
