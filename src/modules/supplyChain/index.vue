<template>
  <div class="tg-live-project-page">
    <tg-card :padding="[16, 0, 4, 16]" @rect:update="onTopCardRectUpdate">
      <el-form size="mini" :show-message="false" label-width="60px">
        <div class="filter-form-div">
          <div class="filter-form-item">
            <el-form-item label="项目阶段：">
              <el-select
                v-model="queryForm.project_status"
                class="select"
                popper-class="el-select-popper-mini"
                placeholder=""
                style="width: 100%"
              >
                <el-option label="全部" :value="-1" />
                <el-option label="试播中" :value="ProjectStatusEnum.tryLive" />
                <el-option label="项目执行中" :value="ProjectStatusEnum.execution" />
                <el-option label="区域执行中" :value="ProjectStatusEnum.regionExecution" />
                <el-option label="执行结束" :value="ProjectStatusEnum.executionEnd" />
                <el-option label="已完结" :value="ProjectStatusEnum.finish" />
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item" style="min-width: 324px">
            <el-form-item label="项目搜索：">
              <el-input
                clearable
                :placeholder="`请输入${search_value_type}`"
                v-model="queryForm.search_value"
                class="input-with-select"
                @keypress.enter.native="reload"
                style="width: 244px"
              >
                <el-select
                  popper-class="el-select-popper-mini"
                  placeholder="请选择"
                  v-model="queryForm.search_type"
                  style="width: 100px; padding-left: 6px"
                  class="search-type-block"
                  slot="prepend"
                >
                  <el-option label="项目名称" :value="6" />
                  <el-option label="项目编号" :value="1" />
                  <el-option label="客户名称" :value="2" />
                  <el-option label="品牌名称" :value="3" />
                  <el-option label="客户经理" :value="4" />
                  <el-option label="项目经理" :value="5" />
                  <el-option label="团队成员" :value="8" />
                </el-select>
              </el-input>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label-width="0">
              <div class="filter-form-item-btn">
                <tg-button type="primary" @click="onQuerySearchClick">查询</tg-button>
                <tg-button class="mgl-8" @click="onQueryResetClick">重置</tg-button>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </tg-card>
    <tg-card
      v-loading="loading"
      class="mgt-10"
      :class="cardFlexClass"
      :padding="[0, 16, 0, 16]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <tg-button-line class="mgt-12" v-if="Permission.canEdit">
        <tg-button type="primary" icon="ico-btn-add" @click="dialogProject.show"
          >项目立项</tg-button
        >
        <!--        <tg-button

          type="primary"
          icon="ico-btn-add"
          @click="toggleAddProjectModalVisible(true)"
          >新增项目</tg-button
        >-->
      </tg-button-line>
      <el-table
        border
        stripe
        :class="Permission.canEdit ? 'mgt-12' : 'mgt-16'"
        v-if="Permission.canViewList"
        :data="list"
        v-bind="tableProps"
        @row-click="onRowClick"
      >
        <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
        <template #empty>
          <empty-common detail-text="暂无项目"></empty-common>
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
        v-if="Permission.canViewList && total > 0"
      />
    </tg-card>
    <AddLiveProject :visible="AddProjectVisible" @dialog:close="onAddProjectModalClose" />
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less">
@import './index.less';
</style>
