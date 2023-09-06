<script src="./index.tsx"></script>

<style lang="less" scoped>
.first-row-img {
  display: inline-block;
  width: 80px;
  height: 80px;
  border-radius: 4px;
  cursor: pointer;
}
/deep/ .first-row-img {
  display: inline-block;
  width: 80px;
  height: 80px;
  border-radius: 4px;
  cursor: pointer;
}
.comp {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  /deep/.goods-div {
    line-height: 0;
  }
  .line {
    overflow: hidden;
    flex: 0 0 12px;
  }
  /deep/ .first_column {
    color: var(--text-color);
    font-weight: 600;
  }

  /deep/ .first_column_sort {
    position: relative;
    .first_column {
      margin-right: 10px;
    }
    .caret-wrapper {
      position: absolute;
      right: 0;
      top: -7px;
      left: 90px;
      transform: rotate(-90deg);
      transform-origin: center center;
    }
  }

  .pagination-box {
    padding: 0 16px;
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
  .new_table {
    /deep/ tbody > tr > td .cell {
      background: red;
    }
  }
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
