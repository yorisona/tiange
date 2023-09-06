<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-datacenter-goods-follow-up-page-container {
  padding: 18px 24px 32px;
  /deep/ .el-form {
    .el-form-item {
      margin-right: 0;
      margin-bottom: 18px;
      .el-form-item__label {
        &:before {
          display: none;
        }
      }
      &.mini-item {
        //margin-bottom: 12px;
        .el-form-item__content {
          .el-radio,
          .el-checkbox,
          .el-radio-group,
          .el-radio .el-radio__label,
          .el-checkbox .el-checkbox__label {
            height: 18px;
            line-height: 18px;
          }
        }
        .el-radio,
        .el-checkbox {
          display: flex;
        }
      }
      .el-radio-group {
        display: grid;
        column-gap: 32px;
        grid-auto-flow: column;
        grid-auto-columns: min-content;
      }
    }
  }
  .follow-up-field {
    .el-form-item {
      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
  .dash-line {
    margin: 24px 0 18px;
    border-bottom: 1px dashed #e5e5e5;
  }
  .feedback-field {
    .el-form-item {
      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
  .display-flex {
    display: flex;
    .el-form-item {
      flex: 1 0;
      &:last-of-type {
        margin-left: 12px;
      }
    }
  }
}
</style>
