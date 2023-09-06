<script src="./anchor.tsx"></script>
<style lang="less" scoped>
.contract-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  /deep/.el-dialog {
    padding: 0 !important;
    .el-dialog__header {
      padding: 0 0 0 20px !important;
    }
    .el-dialog__footer {
      padding: 10px 20px !important;
    }
    .el-form-item__error {
      text-align: left;
    }
  }
  .contract-grid {
    display: grid;
    grid-row-gap: 12px;

    &.column-2 {
      grid-template-columns: repeat(2, 1fr);
    }

    &.column-3 {
      grid-template-columns: repeat(3, 1fr);
    }

    &.column-4 {
      grid-template-columns: repeat(4, 1fr);
    }
    &.column-5 {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  .contract-grid-item {
    display: flex;
    &.contract-grid-columnSpan-2 {
      grid-column-end: span 2;
    }
    &.contract-grid-columnSpan-4 {
      grid-column: ~'1/4';
    }
    &.contract-grid-columnSpan-5 {
      grid-column: ~'1/5';
    }
    font-size: 12px;
    .label {
      color: var(--text-third-color);
    }
    .item {
      margin-right: 10px;
      color: var(--text-color);
    }
  }

  .contract-detail-container {
    background-color: #ffffff;
    flex: 1;
    padding: 0 18px 30px 18px;

    .line {
      height: 1px;
      background: rgba(164, 178, 194, 0.3);
      margin: 18px 0;
    }

    .contract-title-box {
      display: flex;
      align-items: center;
      .contract-title {
        font-size: 14px;
        color: var(--text-color);
        font-weight: 400;
        padding: 18px 0;
      }
      .status {
        margin-left: 18px;
        background: rgba(var(--warning-rgb-color), 0.1);
        border-width: 1px;
        border-style: solid;
        border-radius: 10px;
        padding: 0 6px 0 6px;
        font-size: 12px;
        height: 20px;
        line-height: 19px;
      }
      .status-approval {
        border-color: var(--warning-color);
        color: var(--warning-color);
        background: rgba(var(--warning-rgb-color), 0.1);
      }
      .status-error {
        border-color: var(--error-color);
        color: var(--error-color);
        background: rgba(var(--error-rgb-color), 0.1);
      }
      .status-success {
        border-color: var(--success-color);
        color: var(--success-color);
        background-color: rgba(var(--success-rgb-color), 0.1);
      }
      .status-fail {
        color: var(--fail-color);
        border: 1px solid #c9d0d6;
        background-color: rgba(var(--fail-rgb-color), 0.08);
      }
      .edit {
        margin-left: 18px;
        cursor: pointer;
      }
      .fill {
        flex: 1;
      }
      .operator {
        display: flex;
        column-gap: 10px;
      }
    }

    .grid-annex {
      position: relative;
      grid-template-columns: repeat(auto-fit, 178px);
      grid-column-gap: 30px;
      grid-row-gap: 30px;
      /deep/ .tg-file-card-group {
        .close-btn {
          display: none;
        }
      }
      &.download-hide {
        /deep/ .tg-file-card-download-btn {
          display: none;
        }
      }
      .annex {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 1px solid #ebebeb;
        height: 112px;
        font-size: 12px;
      }
      /deep/ .tg-file-card-filename {
        word-break: break-all;
        text-align: center;
      }
    }

    .annex-upload {
      display: flex;
      flex-direction: column;
      padding: 0 20px;
      align-items: center;
      /deep/ svg {
        font-size: 28px;
        color: var(--text-second-color);
      }
      .text {
        color: var(--text-second-color);
      }
    }
  }
}
</style>
