<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-page-container {
  color: var(--text-color);
  min-width: 1260px;

  .page-content {
    background-color: white;
    padding: 18px 18px 34px 18px;
    flex: 1;
    overflow: auto;
  }

  .form-box {
    background-color: white;
    display: flex;
    align-items: center;
    padding-bottom: 30px;

    .info {
      flex: 1;
      display: flex;
      align-items: center;
      font-size: var(--small-font-size);
      &:before {
        content: ' ';
        display: block;
        width: 3px;
        height: 14px;
        margin-right: 6px;
        background: rgba(var(--theme-rgb-color), 0.9);
        border-radius: 1px;
      }
    }

    .operator {
      display: flex;
      align-items: center;
      //column-gap: 12px;
      button {
        margin-right: 12px;
      }
      button:last-child {
        margin-right: 0;
      }
    }
  }

  .operator-submit {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;

    & > div:nth-child(1) {
      display: flex;
      flex: 1;
      justify-content: flex-start;
    }
    button,
    .tg-btn {
      margin-right: 12px;
    }
    button:last-child,
    .tg-btn:last-child {
      margin-right: 0;
    }
    /*justify-content: space-between;*/
    //column-gap: 12px;
  }

  .operator {
    .operator-title {
      color: var(--text-third-color);
      span {
        padding-right: 24px;
      }
      b {
        font-weight: normal;
        color: var(--text-color);
      }
    }
  }

  /deep/ .table {
    margin-top: 24px;
    max-width: 100%;

    .el-table__body tr {
      &:hover > td {
        background-color: transparent;
      }

      & > td {
        &:hover {
          background-color: var(--table-current-row-bg-color);
        }
      }
    }

    tbody {
      .el-table__cell {
        padding: 0;
        position: relative;
      }

      .cell {
        padding: 0;
        height: 100%;
        overflow: visible;
      }
    }
    .is-left {
      .cell_per {
        justify-content: flex-start;
        &.placed {
          color: var(--placeholder-color);
          align-items: self-start;
        }
      }
    }

    .is-center {
      .operation {
        display: flex;
        flex-direction: row;
        height: 100%;
        padding: 0 5px;
        justify-content: space-around;
        .cell_per {
          padding: 7px 0;
        }
      }
      .cell_per {
        justify-content: center;
      }
    }

    .is-right {
      .cell_per {
        justify-content: flex-end;
      }
    }

    .cell_per {
      padding: 7px 10px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 100%;
      flex-wrap: wrap;
      word-break: break-all;

      &.disabled {
        z-index: 10;
        /*background-image: url('~@/assets/images/calendar-bg.jpg');*/
        background-color: #f4fbff;
        background-repeat: repeat;
        background-size: 11px 11px;
        cursor: default;
        margin: 0;
        border: none;
      }
    }

    .edit {
      position: absolute;
      left: -2px;
      top: -2px;
      width: calc(100% + 3px);
      height: calc(100% + 3px);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      z-index: 100;
      background-color: #fff;

      .edit-merge {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: 50% 50%;
        align-items: stretch;

        &.no-attachment {
          grid-template-rows: 100%;
        }

        & > div {
        }

        .summary_memo_box {
          padding: 12px;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          border-bottom: 1px solid #dcdfe6;
          border-right: 1px solid #dcdfe6;
          border-left: 1px solid #dcdfe6;
          overflow: hidden;

          .tips {
            color: #c1c1c1;
            word-break: break-all;
            padding-top: 6px;
          }
          .upload-file-list {
            overflow: hidden;
            .file-item {
              width: 100%;
              overflow: hidden;
            }
          }
        }
      }

      &.active {
        z-index: 200;
      }

      .el-input,
      .el-select,
      .el-textarea {
        height: 100%;

        input,
        textarea {
          text-align: left;
          vertical-align: top;
          height: 100%;
          align-content: start;
          font-size: 12px;
          padding: 4px 10px;

          &::placeholder {
            text-align: left;
            vertical-align: top;
          }

          &:focus {
            z-index: 200;
          }
        }
      }
    }

    .upload-file-list {
      width: 100%;

      .file-item {
        margin-top: 8px;
      }
    }

    .view-summary {
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      .content {
        color: var(--text-color);
        padding-bottom: 10px;
      }

      .upload-file-list .file-item {
        display: grid;
        width: 100%;
        grid-template-columns: auto 1fr;
        grid-row-gap: 4px;

        .upload-file-download {
          grid-column-start: 2;
        }
      }
    }

    .weight {
      .el-input-group__append {
        padding: 0 6px;
      }
    }
  }
}
</style>
<style lang="less">
.qrcode-box-2208111613 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 18px;

  .qrcode {
    width: 180px;
    height: 180px;
  }

  .text {
    font-size: 14px;
    color: #6a7b92;
    line-height: 16px;
    padding-top: 24px;
  }
}
</style>
