<template>
  <div class="data-center-list" v-loading="loading">
    <el-table
      v-if="list.length > 0"
      :data="list"
      border
      :cell-style="{ height: '32px', padding: 0 }"
      :header-cell-style="{
        background: '#ffffff',
        height: '36px !important',
        color: 'var(--text-color)',
        fontSize: '12px',
        padding: 0,
        fontWeight: 'bold',
        borderBottom: '1px solid var(--table-border-color)',
      }"
    >
      <el-table-column label="指标" width="180" fixed>
        <template slot="header">
          <div class="header-price list-title-box-one">
            <p class="date">数据指标</p>
            <p class="title">{{ list[0][0][0] }}</p>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="slash">{{ scope.row[0][1] }}</div>
        </template>
      </el-table-column>

      <template v-for="(item, index) in list[0]">
        <el-table-column :key="index" :min-width="getWidth(item)" align="center" v-if="index > 0">
          <template slot="header">
            <div>
              {{ item[0] }}
            </div>
          </template>
          <template slot-scope="scope">
            <div class="cell-price">
              {{ scope.row[index][1] === null ? '--' : scope.row[index][1] }}
            </div>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div v-else class="empty-img">
      <empty-common detail-text="暂无数据"></empty-common>
    </div>
  </div>
</template>
<script src="./index.ts"></script>
<style lang="less">
@import './index.less';
</style>
<style lang="less" scoped>
/deep/ .el-table thead > tr > th,
.el-table tbody > tr > td {
  border-right: 1px solid var(--table-border-color);
}
/deep/.el-table th div {
  padding: 0px !important;
  text-align: center;
  height: 20px;
  line-height: 20px;
  color: var(--text-color);
}
/deep/ .el-table--border td,
.el-table--border th,
.el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
  border-right: 1px solid var(--table-border-color);
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
  margin-top: 0px;
  /deep/ .list-title-box-one {
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
</style>
