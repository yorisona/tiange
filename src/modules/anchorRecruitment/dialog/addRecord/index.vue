<script src="./index.tsx"></script>
<style lang="less" scoped>
.recruitment-record-dialog {
  /deep/ .el-form {
    padding: 20px 24px 32px;
    .el-form-item {
      margin-bottom: 0 !important;
      margin-right: 0 !important;
      .el-form-item__label {
        color: var(--text-third-color);
        font-size: 12px;
      }
      .el-input-group__append {
        padding: 0 10px;
        background-color: #f9f9f9;
        color: var(--text-third-color);
      }
    }
    .radio-field {
      .el-form-item__label {
        height: 18px !important;
        line-height: 18px !important;
      }
    }
    .cooperation_cost_describe_field {
      .el-textarea__inner {
        height: 28px;
      }
    }
    .el-radio-group {
      margin-top: -2px;
      .el-radio .el-radio__input {
        padding-top: 1px;
      }
    }

    .el-textarea__inner {
      height: 80px;
      line-height: 18px;
    }
  }
  .recruitment-result {
    margin-top: 24px;
  }
  .two-columns {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 24px;
    row-gap: 16px;
  }
  .title {
    color: var(--text-color);
    font-size: 12px;
    position: relative;
    &:before {
      content: '';
      background-color: var(--theme-color);
      width: 3px;
      height: 12px;
      border-radius: 1px;
      position: absolute;
      left: 0;
      top: 2.5px;
    }
    span {
      margin-left: 7px;
      font-weight: 600;
    }
  }
}
</style>
