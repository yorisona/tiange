<script src="./index.tsx"></script>
<style lang="less" scoped>
.dialog-container {
  padding: 18px 24px 70px;
  color: var(--text-third-color);
  overflow: auto;
  max-height: 700px;
  /deep/.el-form .el-textarea > textarea {
    line-height: 18px;
    font-size: 12px;
  }
  .footer-box {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    padding: 12px 0;
    background-color: #f4f8ff;
    .tg-btn {
      margin-right: 12px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .imgbox {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    img {
      width: 70px;
      margin-right: 10px;
    }
  }
  .declaration-title {
    font-weight: 600;
    font-size: 12px;
    color: var(--text-color);
    text-align: center;
    margin-bottom: 6px;
  }
  .subTitle {
    color: var(--text-third-color);
    font-weight: 400;
  }
  .dashedBackground {
    background: url('@/assets/images/calendar-bg.jpg') repeat;
    background-size: 11px 11px;
  }
  .declaration {
    font-weight: 400;
    font-size: 12px;
    color: var(--text-color);
    margin-bottom: 16px;
  }
  .header-box {
    display: flex;
    align-items: center;
    margin-bottom: 18px;
    .header-item {
      font-weight: 400;
      font-size: 12px;
      color: var(--text-third-color);
      margin-right: 65px;
      span {
        &:nth-child(2) {
          color: var(--text-color);
        }
      }
    }
  }
  /* 表格 */
  .table-box {
    border-top: 1px solid #e5e5e5;
    border-left: 1px solid #e5e5e5;
    .table-header {
      // display: flex;
      // align-items: center;
      // justify-content: space-between;
      font-weight: 600;
      font-size: 12px;
      color: var(--text-color);
      display: grid;
      grid-template-columns: 48px 228px 128px 195px 164px 48px;
      text-align: center;
      background: #f6f6f6;
      > div {
        border-right: 1px solid #e5e5e5;
        padding: 4px 0;
        border-bottom: 1px solid #e5e5e5;
      }
    }
    .table-body {
      .table-item {
        display: grid;
        grid-template-columns: 48px 228px 128px 195px 164px 48px;
        text-align: center;
        font-weight: 400;
        font-size: 12px;
        color: var(--text-color);
        max-height: 100px;
        overflow-y: auto;
        > div {
          border-right: 1px solid #e5e5e5;
          padding: 8px 8px;
          border-bottom: 1px solid #e5e5e5;
          line-height: 27px;
          display: flex;
          justify-content: center;
          max-height: 100px;
          overflow-y: auto;
          line-height: 18px;
          text-align: left;
          align-items: center;
        }
      }
    }
    .ico-btn {
      cursor: pointer;
      font-size: 14px;
      color: var(--text-third-color);
      &[disabled] {
        color: var(--disabled-color);
      }
    }
    .ico-btn-add {
      color: var(--theme-color);
    }
    .table-add {
      justify-content: center;
      height: 32px;
      line-height: 32px;
      border-right: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
      /deep/.tg-btn.tg-btn-default svg.icon {
        color: var(--theme-color) !important;
      }
      .tg-btn {
        margin-top: 2px;
        width: 200px;
        text-align: center;
        justify-content: center;
        border-color: transparent;
        color: var(--theme-color) !important;
        background-color: transparent !important;
        width: 100%;
      }
    }
    .date-picker {
      /deep/ .el-input__inner {
        padding-right: 0 !important;
      }
    }
  }
  .date-picker-item {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 0;
  }

  /* read */
  .reading {
    .content {
      font-weight: 400;
      font-size: 12px;
      color: var(--text-color);
      margin-bottom: 18px;
      line-height: 18px;
      padding-left: 18px;
    }
  }
}
</style>
