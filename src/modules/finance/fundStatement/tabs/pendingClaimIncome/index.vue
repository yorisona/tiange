<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-07-14 18:17:52
-->
<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-finance-pending-claim-income-container {
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
        width: 270px;
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
  /deep/ .el-date-editor .el-range-separator {
    width: 12%;
    min-width: 20px;
  }
}
</style>
