<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-07-14 18:17:52
-->
<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-finance-fund-daily-report-container {
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
    padding: 16px 0 4px 16px;
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
    .el-table__fixed {
      background-color: transparent;
      bottom: 0;
    }
    // .el-table__fixed-footer-wrapper {
    //   bottom: -11px;
    // }
  }
  .pagination-field {
    padding: 0 16px;
    background: white;
  }
  /deep/ .el-date-editor .el-range-separator {
    width: 12%;
    min-width: 20px;
  }
  /deep/ th div {
    font-weight: 600;
  }
}
</style>

<style lang="less">
.fund-daily-report-tree-popper {
  max-height: 360px;
  overflow-y: auto;
}
</style>
