<script src="./index.tsx"></script>
<style lang="less" scoped>
.launch-container {
  padding: 0 0 28px 0;
  /deep/ .el-input__icon {
    line-height: 28px !important;
  }
  /deep/ .el-input > input {
    border-color: var(--border-line-color);
  }
  .content {
    padding: 0 18px;
  }
  /deep/.tg-tabs {
    border-bottom: solid 1px var(--border-line-div-color);
    .tg-tabs-header {
    }
  }
  .transfer-header {
    font-size: 14px;
    color: var(--text-color);
    display: grid;
    grid-template-columns: 1fr 48px 1fr;
    grid-column-gap: 12px;
    font-weight: 400;
    padding: 18px 0 12px 0;
  }
  /deep/ .transfer-box {
    height: 350px;
    .el-transfer {
      height: 100%;
      font-size: 12px;
      display: grid;
      grid-template-columns: 1fr 48px 1fr;
      grid-column-gap: 12px;

      .el-transfer-panel {
        width: 100%;
      }
      .el-transfer__buttons {
        padding: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;

        i {
          display: none;
        }
        .el-button {
          padding: 0 12px;
          font-size: 12px;
          border-radius: 2px;
          span {
            font-size: 12px;
          }
          &:first-of-type {
            margin-bottom: 16px;
          }
        }
        .el-button[disabled] {
          background: white;
          border: 1px solid #e3e8ec;
          color: var(--text-second-color);
          font-weight: 400;
        }
      }
      .el-transfer-panel {
        display: flex;
        flex-direction: column;
        .el-transfer-panel__header {
          background-color: transparent;
          border-bottom-color: transparent;
        }
        .el-transfer-panel__body {
          flex: 1;
          display: flex;
          flex-direction: column;
          .el-checkbox-group {
            flex: 1;
          }
        }
      }
    }
    .el-transfer-panel__filter {
      margin: 0 15px;
      .el-input__inner {
        border-radius: 2px;
        padding-left: 36px;
        height: 28px !important;
        line-height: 26px !important;
      }
    }

    .el-checkbox__label {
      font-size: 12px;
    }
  }
  /deep/ .el-checkbox-group {
    margin-top: 18px;
    .el-checkbox {
      height: 14px;
      line-height: 14px;
      margin-top: 14px;
      .el-checkbox__input {
        top: 0;
        .el-checkbox__inner {
          &:after {
            left: 5px;
            top: 2px;
          }
        }
      }
      .el-checkbox__label {
        line-height: 14px;
        padding-left: 21px;
        font-weight: 400;
      }
      &:first-of-type {
        margin-top: 0;
      }
    }
  }
  /deep/ .el-checkbox {
    .el-checkbox__input {
      .el-checkbox__inner {
        &:after {
          left: 5px;
          top: 2px;
        }
      }
    }
  }
  /deep/ .launch-score-form {
    margin-top: 12px;
    padding: 0 18px;
    .el-form-item {
      margin-bottom: 10px;
      margin-right: 0;
    }
  }
}
</style>
