<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-10-08 15:29:05
-->
<template>
  <div class="tg-live-project-livelist-page">
    <tg-card :padding="0" style="display: flex; flex-direction: column; flex-grow: 1">
      <el-table
        v-loading="loading"
        height="100%"
        stripe
        :data="ShopLiveDataList"
        @row-click="onRowClick"
      >
        <el-table-column v-for="(col, index) in ShopLiveColumns" v-bind="col" :key="index" />
        <template #empty>
          <empty-common detail-text="暂无记录"></empty-common>
        </template>
      </el-table>
      <el-pagination
        :current-page.sync="QueryForm.page_num"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="QueryForm.num"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
      />
    </tg-card>
  </div>
</template>
<script src="./liveList.ts"></script>
<style lang="less">
@import './liveList.less';
</style>
