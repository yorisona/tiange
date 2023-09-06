<template>
  <div class="tg-live-project-page">
    <tg-card :padding="[16, 0, 4, 16]" @rect:update="onTopCardRectUpdate">
      <el-form size="mini" :show-message="false" inline label-width="60px">
        <el-form-item label="上播日期：">
          <el-date-picker
            style="width: 240px"
            v-model="queryForm.selectDates"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            size="mini"
            :editable="false"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目名称：">
          <el-input
            size="mini"
            placeholder="请输入项目名称"
            v-model="queryForm.project_name"
            v-key-enter="onQuerySearchClick"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="主播花名：">
          <el-input
            size="mini"
            placeholder="请输入主播花名"
            v-model="queryForm.kol_name"
            v-key-enter="onQuerySearchClick"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label-width="0">
          <div class="filter-form-item-btn">
            <tg-button
              type="primary"
              @click="
                () => {
                  disable_export_btn = false;
                  onQuerySearchClick();
                }
              "
              >查询</tg-button
            >
            <tg-button class="mgl-8" @click="onQueryResetClick">重置</tg-button>
          </div>
        </el-form-item>
      </el-form>
    </tg-card>
    <tg-card
      v-loading="loading"
      class="mgt-10"
      :padding="[0, 16, 0, 16]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <tg-button-line class="mgt-12" v-if="Permission.canExport">
        <tg-button
          class="mgl-8"
          icon="ico-btn-export"
          @click="exportBtnClick"
          :disabled="list.length === 0 || disable_export_btn"
          >导出</tg-button
        ></tg-button-line
      >
      <el-table
        stripe
        :class="Permission.canEdit ? 'mgt-12' : 'mgt-12'"
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
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less" scoped>
@import './index.less';
</style>
