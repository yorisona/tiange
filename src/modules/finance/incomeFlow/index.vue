<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-07-14 10:40:55
-->
<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-finance-income-detail-container {
  display: flex;
  flex-direction: column;
  .query-field {
    background: white;
    padding: 16px 0 4px 16px;
    /deep/ .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        margin-right: 18px;
        /*width: 290px;*/
        flex-shrink: 0;
        margin-bottom: 12px;
        &:last-of-type {
          margin-right: 0;
        }
        &:last-of-type {
          width: 240px;
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
    .operator {
      .tg-btn-link {
        margin-right: 12px;
        &:last-of-type {
          margin-right: 0;
        }
      }
    }
  }
  .pagination-field {
    padding: 0 18px;
    background: white;
  }
  /deep/ .el-date-editor .el-range-separator {
    width: 12%;
    min-width: 20px;
  }
}
</style>
