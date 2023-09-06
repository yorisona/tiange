<template>
  <div class="data-center-list" v-loading="loading">
    <el-table
      v-if="list.length > 0"
      :data="list"
      border
      :cell-style="{ height: '32px  !important', padding: 0 }"
      :span-method="tableSpanMethod"
      :header-cell-style="{
        background: '#ffffff',
        height: '36px !important',
        color: 'var(--text-color)',
        fontSize: '16px',
        padding: 0,
        fontWeight: 500,
        borderBottom: '1px solid var(--table-border-color) ',
      }"
    >
      <el-table-column label="指标" width="156" fixed>
        <template slot="header">
          <div class="header-price list-title-box">
            <p class="date">{{ currentDateType === 1 ? '月份' : '日期' }}</p>
            <p class="title">指标</p>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="slash">{{ scope.row.数据指标 }}</div>
        </template>
      </el-table-column>

      <el-table-column
        :className="is_rest(index) ? 'rest' : ''"
        v-for="(item, index) in dateList[0]"
        :key="index"
        :label="index"
        width="151"
      >
        <template slot="header">
          <div
            style="
              width: 150px;
              text-align: center;
              color: var(--text-color);
              line-height: 20px;
              font-size: 14px;
            "
          >
            {{ index }}
          </div>
        </template>
        <template slot-scope="scope">
          <div class="cell-price" v-if="!is_rest(scope.column.label)">
            {{
              scope.row.数据指标.includes('人')
                ? numberFormat(scope.row[index], 0)
                : scope.row.数据指标.includes('元') ||
                  scope.row.数据指标.includes('小时') ||
                  scope.row.数据指标.includes('倍数') ||
                  scope.row.数据指标.includes('秒')
                ? numberFormat(scope.row[index], 2)
                : scope.row[index]
            }}
          </div>
          <div
            v-else
            style="
              font-size: 56px;
              color: var(--text-third-color);
              text-align: center;
              font-weight: 600;
            "
          >
            休
          </div>
        </template>
      </el-table-column>

      <el-table-column label="合计" width="151" fixed="right" align="right">
        <template slot="header">
          <div class="header-price total" style="font-size: 14px">合计</div>
        </template>
        <template slot-scope="scope">
          <div class="cell-price-max">
            {{
              scope.row.数据指标.includes('人')
                ? numberFormat(scope.row.合计, 0)
                : scope.row.数据指标.includes('元') ||
                  scope.row.数据指标.includes('小时') ||
                  scope.row.数据指标.includes('倍数') ||
                  scope.row.数据指标.includes('秒')
                ? numberFormat(scope.row.合计, 2)
                : scope.row.合计
            }}
          </div>
        </template>
      </el-table-column>
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
</style>
