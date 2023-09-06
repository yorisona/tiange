<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-07-19 17:35:30
-->
<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-finance-project-fund-statement-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  .depart-select-box {
    border-radius: 2px;
    border: 1px solid var(--border-line-color);
    padding: 0 10px;
    line-height: 27px;
    height: 28px;
    display: flex;
    justify-content: space-between;
    width: 210px;
    flex: 1;
    font-size: 12px;
    &:hover {
      /deep/ .el-icon-circle-close {
        color: #c0c4cc !important;
      }
      border-color: #5c82ff;
    }
  }
  .query-field {
    padding: 16px 16px 4px;
    background: white;
    /deep/ .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 270px;
        input {
          font-size: 12px;
        }
        .el-form-item__label {
          font-size: 12px;
        }
        &:last-of-type {
          width: auto;
        }
      }
    }
  }
  /deep/ .table-field {
    flex: 1;
    margin-top: 10px;
    background: white;
    padding: 16px 16px 0;
    overflow: hidden;
  }
  .pagination-field {
    padding: 0 16px;
    background: white;
  }
  /deep/ .vxe-table {
    .vxe-header--row {
      .department-fund-statement-group-head-even,
      .department-fund-statement-head-even {
        background-color: #e7fcff !important;
      }
      .department-fund-statement-group-head-odd,
      .department-fund-statement-head-odd {
        background-color: #f0f5ff !important;
      }
    }
    .vxe-body--row {
      .vxe-body--column {
        height: 31px !important;
        font-size: 12px !important;
        & .vxe-cell--label {
          color: var(--text-color);
        }
      }
    }
    .vxe-footer--row {
      .vxe-footer--column {
        height: 31px !important;
        font-size: 12px !important;
        padding: 5px 0;
        background-color: #f5f7fa;
        & .vxe-cell--item {
          color: var(--text-color);
        }
      }
    }
    .vxe-header--column {
      padding-top: 5px !important;
      padding-bottom: 5px !important;
      & .vxe-cell {
        font-size: 12px;
        color: var(--text-color);
      }
    }
  }
  /deep/ th div {
    font-weight: 600;
  }
}
</style>

<style lang="less">
.project-fund-statement-tree-popper {
  max-height: 360px;
  overflow-y: auto;
}
</style>
