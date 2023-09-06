<template>
  <div class="tg-marketing-project-page">
    <tg-card class="flex-none" :padding="[16, 0, 4, 16]" @rect:update="onTopCardRectUpdate">
      <el-form size="mini" :show-message="false" label-width="60px">
        <div class="filter-form-div">
          <div class="filter-form-item" style="min-width: 324px">
            <el-form-item label="项目搜索：">
              <el-input
                clearable
                :placeholder="`请输入${search_value_type}`"
                v-model="queryForm.search_value"
                class="input-with-select"
                @keypress.enter.native="reload"
                style="min-width: 244px"
              >
                <el-select
                  popper-class="el-select-popper-mini"
                  placeholder="请选择"
                  v-model="queryForm.search_type"
                  style="width: 100px; padding-left: 6px"
                  slot="prepend"
                >
                  <el-option label="项目名称" :value="1" />
                  <el-option label="客户名称" :value="2" />
                  <el-option label="项目编号" :value="3" />
                  <el-option label="客户经理" :value="4" />
                  <el-option label="执行AE" :value="5" />
                </el-select>
              </el-input>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="项目阶段：">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="queryForm.cooperation_status"
                placeholder=""
                style="width: 100%"
              >
                <el-option label="全部" value="" />
                <el-option label="确定合作" :value="2" />
                <el-option label="执行项目" :value="3" />
                <el-option label="执行结束" :value="4" />
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="合作类型：">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="queryForm.cooperation_type"
                placeholder=""
                style="width: 100%"
              >
                <el-option label="全部" value="" />
                <el-option label="直播" :value="1" />
                <el-option label="视频" :value="2" />
                <el-option label="图文" :value="3" />
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
      :padding="[12, 16, 0]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <tg-button-line v-if="Permission.canAdd">
        <tg-button type="primary" icon="ico-btn-add" @click="toggleProjectModalVisible(true)"
          >新增项目</tg-button
        >
      </tg-button-line>
      <el-table
        border
        stripe
        :class="Permission.canAdd ? 'mgt-12' : 'mgt-4'"
        v-if="Permission.canViewList"
        :data="data"
        v-bind="tableProps"
        @row-click="onRowClick"
      >
        <el-table-column v-for="(col, colIndex) in columns" v-bind="col" :key="colIndex" />
        <template #empty>
          <empty-common detail-text="暂无记录"></empty-common>
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
        v-if="total > 0 && Permission.canViewList"
      />
    </tg-card>
    <MarketingProjectDialog
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
