<template>
  <div class="tg-common-business-project-page">
    <tg-card :padding="[16, 0, 4, 16]" @rect:update="onTopCardRectUpdate">
      <el-form size="mini" :show-message="false" label-width="60px">
        <div class="filter-form-div">
          <div class="filter-form-item" style="min-width: 324px">
            <el-form-item label="项目搜索：">
              <el-input
                clearable
                :placeholder="`请输入${search_value_type}`"
                v-model="QueryForm.search_value"
                class="input-with-select"
                v-key-enter="onQuerySearchClick"
                style="width: 244px"
              >
                <el-select
                  popper-class="el-select-popper-mini"
                  placeholder="请选择"
                  v-model="QueryForm.search_type"
                  style="width: 100px; padding-left: 6px"
                  class="search-type-block"
                  slot="prepend"
                >
                  <el-option label="项目名称" :value="6" />
                  <el-option label="项目编码" :value="1" />
                  <el-option label="项目经理" :value="5" />
                  <el-option label="创建人" :value="9" />
                  <el-option label="团队成员" :value="8" />
                </el-select>
              </el-input>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="业务平台：">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="QueryForm.platform_type"
                placeholder=""
                style="width: 100%"
              >
                <el-option label="全部" value="" />
                <el-option label="抖音平台" :value="1" />
                <el-option label="淘宝平台" :value="2" />
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="项目类型：">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="QueryForm.mcn_project_type"
                placeholder=""
                style="width: 100%"
              >
                <el-option label="全部" value="" />
                <el-option
                  v-for="item in projectTypeOptions"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="项目阶段：">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="QueryForm.project_status"
                placeholder=""
                style="width: 100%"
              >
                <el-option label="全部" value="" />
                <el-option label="执行中" :value="ProjectStatusEnum.execution" />
                <el-option label="执行结束" :value="ProjectStatusEnum.executionEnd" />
                <el-option label="已完结" :value="ProjectStatusEnum.finish" />
              </el-select>
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
        <tg-button type="primary" icon="ico-btn-add" @click="toggleProjectModalVisible(true)"
          >新增项目</tg-button
        >
      </tg-button-line>
      <el-table
        border
        stripe
        :class="Permission.canEdit ? 'mgt-12' : 'mgt-18'"
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
        v-if="Permission.canViewList && total > 0"
        :current-page.sync="QueryForm.page_num"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="QueryForm.num"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
      />
    </tg-card>
    <CommonBusinessProjectDialog
      :title="ProjectFormTitle"
      :visible="ProjectFormVisible"
      @dialog:close="onProjectFormModalClose"
    />
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less">
@import './index.less';
</style>
