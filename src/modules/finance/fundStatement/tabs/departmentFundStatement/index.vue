<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-07-14 18:17:52
-->
<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-finance-department-fund-statement-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  .query-field {
    padding: 16px 16px 4px;
    background: white;
    /deep/ .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 280px;
        .el-form-item__label {
          font-size: 12px;
        }
        &:last-of-type {
          width: 148px;
        }
      }
    }
  }
  /deep/ .table-field {
    flex: 1;
    margin-top: 10px;
    background: white;
    padding: 16px;
    overflow: hidden;
  }
  .pagination-field {
    padding: 0 16px;
    background: white;
  }

  // .el-table {
  //   thead > tr > th,
  //   tbody > tr > td {
  //     border-right: 1px solid var(--table-border-color);
  //     border-bottom: 1px solid var(--table-border-color);
  //   }
  // }
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
