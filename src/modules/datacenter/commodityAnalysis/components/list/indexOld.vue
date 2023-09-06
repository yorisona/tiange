<!--
 * @Author: 肖槿
 * @Date: 2022-02-17 14:50:32
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-03-01 19:03:39
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\commodityAnalysis\components\list\index.vue
-->
<script src="./indexOld.tsx"></script>
<style lang="less" scoped>
.comp {
  .category-table .el-table--border {
    border-bottom: 1px solid #ebeef5;
  }
  /deep/ .el-table thead > tr > th {
    padding: 6px 12px;
    font-size: 12px;
    .cell {
      padding-left: 0px;
      height: 22px;
      line-height: 22px;
    }
  }
  /deep/ .el-table tbody > tr > td {
    padding: 6px 0px !important;
    font-size: 12px;
    .cell {
      padding-left: 12px;
      line-height: 22px;
      a {
        font-size: 12px !important;
      }
    }
  }
  background-color: #ffffff;
  height: 100%;
  padding: 0 18px;
  overflow-x: hidden;
  overflow-y: auto;
  /deep/.goods-descript {
    line-height: 0;
    margin-top: 6px;
    margin-bottom: 6px;
  }
  .hot-check {
    /deep/.el-checkbox__label {
      color: var(--text-color) !important;
      font-weight: 400;
      font-size: 12px;
    }
    /deep/ .el-radio__label {
      font-size: 12px;
    }
    /deep/.el-radio__inner {
      width: 12px;
      height: 12px;
    }
  }
  .line {
    height: 0px;
    border-bottom: dashed 1px #e3e8ec;
    margin: 21px 0;
  }
  /deep/ .firstcolumn {
    font-size: 12px;
    color: var(--text-color);
    font-weight: 600;
    line-height: 22px;
  }
  /deep/ .first-row-img {
    display: inline-block;
    width: 80px;
    height: 80px;
    border-radius: 4px;
    cursor: pointer;
  }

  .pagination-box {
    padding: 14px 0;
  }
  /deep/ .el-table__body tr.current-row > td {
    background: var(--table-focus-row-bg-color) !important;
  }
  /deep/ .category-table {
    .el-table:before {
      display: none;
    }
    .el-table tr {
      cursor: pointer;
    }
  }
}
.charts-box {
  display: flex;
  flex-direction: column;
  padding: 24px 10px;

  h3 {
    font-size: 14px;
    color: var(--text-color);
    padding-left: 18px;
  }
  .line-chart {
    height: 260px !important;
  }
}

/deep/ .project-table {
  padding-bottom: 32px;
  .el-table--border td,
  .el-table--border th,
  .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
    border-right: 1px solid var(--table-border-color);
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid var(--table-border-color);
  }
  .goods_code {
    font-size: 12px;
  }
  .goods_name {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-height: 18px;
    -webkit-box-orient: vertical;
  }
  td {
    padding: 10px 0 !important;
  }
  .hot-img {
    width: 42px;
    height: 42px;
    position: absolute;
    right: 30px;
    top: -2px;
  }
}
</style>
