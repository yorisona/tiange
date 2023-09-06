<!--
 * @Author: 肖槿
 * @Date: 2022-02-17 14:50:32
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-03-01 19:03:39
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\commodityAnalysis\components\list\index.vue
-->
<script src="./index.tsx"></script>
<style lang="less" scoped>
.comp {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  /deep/.goods-descript {
    line-height: 0;
  }
  .commodity-form {
    padding: 16px 0 4px 16px;
    background-color: #ffffff;
    margin-bottom: 10px;
    /deep/ .el-form-item {
      margin-right: 24px;
    }
  }
  .commodity-filter {
    padding: 12px 16px;
    background-color: #ffffff;
    display: flex;
    font-size: 12px;
    .hot-check {
      margin: 9px 30px 0 0;
      /deep/ .el-radio__input {
        margin-top: -3px;
      }
      /deep/ .el-radio__label {
        font-size: 12px;
      }
      /deep/.el-radio__inner {
        width: 12px;
        height: 12px;
      }
    }
    .export-btn {
      margin-left: auto;
    }
  }

  /deep/.stock_num_item {
    margin-left: 6px;
    color: #a4b2c2;
  }
  .line {
    overflow: hidden;
    flex: 0 0 12px;
  }
  /deep/ .firstcolumn {
    color: var(--text-color);
    font-weight: 600;
  }
  /deep/ .first-row-img {
    display: inline-block;
    width: 80px;
    height: 80px;
    border-radius: 4px;
    cursor: pointer;
  }
  /deep/ .firstcolumn_sort {
    position: relative;
    .firstcolumn {
      margin-right: 10px;
    }
    .caret-wrapper {
      position: absolute;
      right: 0;
      left: 90px;
      transform: rotate(-90deg);
      transform-origin: center center;
    }
  }

  .pagination-box {
    padding: 0px 16px;
    background-color: #ffffff;
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
    .el-table td.el-table__cell,
    .el-table th.el-table__cell.is-leaf {
      border-bottom: none;
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
  padding: 0 16px;
  background-color: #ffffff;
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
    -webkit-box-orient: vertical;
    color: var(--text-color);
    line-height: 18px;
    &:hover {
      color: var(--theme-color);
    }
  }
  td {
    padding: 6px 0 !important;
    .cell,
    a {
      font-size: 12px !important;
    }
  }
  .hot-img {
    width: 42px;
    height: 42px;
    position: absolute;
    right: 30px;
    top: -2px;
  }
}
.dialog-wrapper {
  width: 100%;
  height: 100%;
  img {
    display: block;
    max-height: 90vh;
    max-width: 100%;
  }
}
</style>
