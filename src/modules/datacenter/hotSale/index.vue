<template>
  <div class="tg-hot-sale-page">
    <tg-card :padding="[16]" @rect:update="onTopCardRectUpdate">
      <el-form
        class="filter-form flex-form"
        size="mini"
        :show-message="false"
        :inline="true"
        label-width="60px"
        @submit.native.prevent
      >
        <el-form-item label="项目名称：">
          <el-input
            style="width: 192px"
            clearable
            placeholder="请输入项目名称"
            v-model="queryForm.project_name"
            v-key-enter="onQuerySearchClick"
          />
        </el-form-item>
        <el-form-item>
          <tg-button type="primary" @click="onQuerySearchClick">查询</tg-button>
          <tg-button class="mgl-8" @click="onQueryResetClick">重置</tg-button>
        </el-form-item>
      </el-form>
    </tg-card>
    <tg-card
      class="mgt-10 flex-auto"
      :padding="[16, 16, 0, 16]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <el-table stripe :data="list" v-loading="loading" v-bind="tableProps">
        <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
        <template #empty>
          <empty-common detail-text="暂无数据"></empty-common>
        </template>
      </el-table>
      <el-pagination
        v-if="total > 0"
        :current-page.sync="queryForm.page_num"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryForm.num"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
      />
    </tg-card>
  </div>
</template>

<script src="./index.ts"></script>

<style scoped lang="less"></style>
