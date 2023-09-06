<script src="./index.tsx"></script>
<style lang="less" scoped>
.dialog-container {
  padding: 24px 24px 24px;

  .form-search {
    /deep/ .el-form {
      display: flex;
      align-items: center;
      .el-select,
      .el-input {
        width: 100%;
      }
      .el-form-item {
        display: flex;
        &:first-child {
          margin-left: 0;
          .el-form-item__content {
            width: 160px;
          }
        }
        &:last-child {
          margin-right: 0;
          flex: 1;
          .el-form-item__content {
            width: auto;
          }
        }
        .el-form-item__label {
          white-space: nowrap;
        }
      }
    }
  }

  .form-body {
    height: 60vh;
  }
}
</style>
