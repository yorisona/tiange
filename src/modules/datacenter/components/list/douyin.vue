<template>
  <div class="data-center-list" v-loading="loading">
    <el-table
      :data="list"
      border
      :cell-style="{ height: '32px !important', padding: 0, fontSize: '12px' }"
      :header-cell-style="{
        background: '#ffffff',
        height: '36px !important',
        color: 'var(--text-color)',
        fontSize: '12px',
        padding: 0,
        fontWeight: 500,
        borderBottom: '1px solid #ebeef5',
      }"
    >
      <el-table-column label="指标" width="170">
        <template slot="header">
          <div class="header-price list-title-box">
            <p class="date">指标</p>
            <p class="title">日期</p>
          </div>
        </template>
        <template slot-scope="scope">
          <div>
            <span class="slash" style="margin-left: 10px">{{
              scope.row.weeK_str || scope.row.month_str
            }}</span>
            <span style="color: var(--text-second-color)">{{ scope.row.day_str }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
      <template #empty>
        <empty-common detail-text="暂无数据"></empty-common>
      </template>
    </el-table>
  </div>
</template>
<script src="./douyin.ts"></script>
<style lang="less">
@import './index.less';
</style>
<style lang="less" scoped>
/deep/ .el-table thead > tr > th,
.el-table tbody > tr > td {
  border-right: 1px solid var(--table-border-color);
}
/deep/.el-table th div {
  padding: 0px 12px !important;
  text-align: center;
  color: var(--text-color);
}
/deep/ .el-table--border td,
.el-table--border th,
.el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
  border-right: 1px solid var(--table-border-color);
  color: var(--text-color);
}
/deep/ .el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid var(--table-border-color);
}
/deep/ .el-table .el-table__body td.el-table__cell {
  text-align: right;
  color: var(--text-color);
}
/deep/ .el-table .el-table__body td.el-table__cell:first-child .cell {
  text-align: left;
}
/deep/ .el-table thead .el-table__cell:first-child .cell {
  padding: 0px !important;
  height: 35px !important;
  text-align: left;
}
.data-center-list {
  /deep/ .list-title-box {
    padding: 0px !important;
    height: 35px;
    line-height: 35px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-color);
  }
  .slash {
    font-size: 12px;
    color: var(--text-color);
    font-weight: 600;
  }
}
/deep/ .el-table .el-table__body .el-table__row:last-child {
  background: #f6f6f6 !important;
  .el-table__cell {
    background: #f6f6f6 !important;
    font-weight: 600;
  }
}
</style>
