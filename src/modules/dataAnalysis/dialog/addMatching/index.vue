<script src="./index.tsx"></script>
<style lang="less" scoped>
.company-container {
  .time-date-div {
    width: 390px;
    border: 1px solid var(--border-line-color);
    border-radius: 2px;
    /deep/ .el-date-editor {
      width: 180px;
      margin-top: -1px;
      .el-input__inner {
        border-width: 0;
        background: transparent;
        padding-left: 35px;
      }
      .el-input__prefix .el-input__icon {
        padding-top: 0;
        margin-top: 0;
      }
    }
  }
  .lineFeed {
    /deep/ .el-form-item__content {
      margin-left: 10px !important;
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
  .add-btn {
    width: 100%;
    text-align: center;
    height: 32px;
    border: 1px solid var(--table-border-color);
    border-top: none;
    border-radius: unset;
    color: var(--theme-color);
  }
  .ico-btn {
    font-size: 16px;
    color: var(--disabled-color);
    cursor: pointer;
  }
  /deep/ .tpc .el-time-spinner__wrapper {
    width: 100% !important;
  }
  /deep/ .tpc .el-time-spinner__wrapper:nth-of-type(2) {
    display: none !important;
  }
  padding: 24px 6px 16px 16px;

  .brand-table {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr)) 83px;
    grid-gap: -1px -1px;
    overflow: hidden;
    width: 100%;
    /deep/ .el-form-item {
      margin: 0 !important;
      .el-input__inner,
      .el-input {
        width: 100% !important;
      }
    }
    .delete {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      .icon {
        color: #c1c1c1;
        cursor: pointer;
        &:hover {
          color: var(--theme-color);
        }
      }
    }
    & > div {
      box-sizing: border-box;
      /*border: 1px solid #e5e5e5;*/
      border-width: 1px;
      border-style: solid;
      border-color: #e5e5e5;
      border-top-width: 0px;
      border-left-width: 0px;
      padding: 8px 12px;
      overflow: hidden;
      &:nth-child(5n + 1) {
        border-left-width: 1px;
      }
      &:nth-of-type(-n + 5) {
        height: 32px;
        background: #f6f6f6;
        text-align: center;
        font-size: 12px;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        border-top-width: 1px;
        color: var(--text-color);
      }
    }
  }
  /deep/ .upload-file-list {
    .file-item {
      width: 100%;
    }
  }
  /deep/ .brand-table {
    .el-form-item.is-error .el-input__inner,
    .el-form-item.is-error .el-input__inner:focus,
    .el-form-item.is-error .el-textarea__inner,
    .el-form-item.is-error .el-textarea__inner:focus,
    .el-message-box__input input.invalid,
    .el-message-box__input input.invalid:focus {
      border-color: var(--error-color) !important;
    }
  }
  .brand-table-add {
    border: 1px solid #e5e5e5;
    border-top: none;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    cursor: pointer;
    font-size: 12px;
    .tg-btn-link {
      font-size: 12px;
    }
    svg {
      margin-right: 4px;
      color: var(--theme-color);
    }
  }
  .upload-box {
    .tips {
      padding-left: 12px;
      font-size: 12px;
      color: var(--placeholder-color);
    }
    /deep/ .upload-file-list {
      padding-top: 6px;
    }
  }
}
</style>
