<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-07-14 18:17:52
-->
<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-billing-period-container {
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
        width: 246px;
        // input {
        //   font-size: 12px;
        // }
        // .el-form-item__label {
        //   font-size: 12px;
        // }
        &:last-of-type {
          width: auto;
        }
      }
    }
  }

  .operator-field {
    margin-top: 10px;
    background-color: white;
    .operator-items {
      padding: 12px 16px;
    }
  }
  /deep/ .table-field {
    flex: 1;
    background: white;
    padding: 0px 16px 0;
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
    padding: 0 18px;
    background: white;
  }
  /deep/ th div {
    font-weight: 600;
  }
}
</style>
