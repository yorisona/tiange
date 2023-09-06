<script src="./index.tsx"></script>
<style lang="less" scoped>
.related-public-contract-container {
  .tip-field {
    .tip {
      padding: 10px 16px;
      background-color: #fff7f3;
      color: #ff7a36;
      display: flex;
      align-items: center;
      .icon {
        width: 20px;
        height: 20px;
        font-size: 14px;
      }
      .tip-content {
        margin-left: 4px;
        font-size: 12px;
      }
    }
  }
  .table-field {
    .el-table-container {
      display: block;
    }
  }
  .query-field {
    display: flex;
    align-items: center;
    padding: 18px 24px;
    .company-name[label] {
      display: flex;
      align-items: center;
      &::before {
        flex-shrink: 0;
        color: var(--text-second-color);
        content: attr(label) '\ff1a';
      }
    }
    /deep/ .el-checkbox {
      .el-checkbox__label {
        padding-left: 6px;
      }
      .el-checkbox__input {
        margin-top: -2px;
      }
      .el-checkbox__inner {
        width: 12px;
        height: 12px;
        &:after {
          top: 1px;
          left: 4px;
        }
      }
    }
    /deep/.el-select {
      //   .el-input-group__prepend {
      //     color: #a4b2c2;
      //     padding-right: 0;
      //     background-color: white;
      //   }
      .el-input__prefix {
        left: 11px;
        font-size: 14px;
        padding-top: 1px;
      }
    }
  }
  .table-field {
    padding: 0 24px;
  }
}
</style>
