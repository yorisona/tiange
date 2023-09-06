<script src="./index.tsx"></script>
<style lang="less" scoped>
.dialog-container {
  .header-box {
    margin-bottom: 10px;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 12px 18px 16px;
    justify-content: space-between;
  }
  .form-box {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  /deep/ .el-form-item {
    margin-bottom: 0;
    .el-form-item__label {
    }
  }
  /* 时间选择 */
  .date-box {
    width: 100%;
    padding: 0 18px 32px;
    display: flex;
    justify-content: space-between;
    .date-picker-item {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      margin: 0;
    }
  }
  /* 穿梭框 */
  .content {
    width: 100%;
    padding: 0 18px 12px;
  }
  .transfer-header {
    font-size: 12px;
    color: var(--text-color);
    display: grid;
    grid-template-columns: 1fr 48px 1fr;
    grid-column-gap: 12px;
    font-weight: 400;
    padding: 12px 0 6px 0;
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
          color: var(--text-color);
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
        border-color: var(--border-line-color);
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
      margin-bottom: 0;
    }
  }
}
</style>
