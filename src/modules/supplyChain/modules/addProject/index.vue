<script src="./index.tsx"></script>
<style lang="less">
.live-project-addproject-popper {
  .el-tree {
    max-height: 400px;
    overflow: auto;
  }
}
</style>
<style lang="less" scoped>
/deep/.el-popover__reference-wrapper .el-popover__reference .el-input__inner {
  cursor: pointer;
}
.dialog-import {
  height: 500px;
  display: flex;
  flex-direction: column;

  /deep/ .tg-tabs {
    border-bottom: solid 1px #e3e8ec;
  }
  /deep/ .el-form-item__label {
    line-height: 18px !important;
    height: 24px !important;
  }
  .header-title {
    height: 40px;
    background: rgba(255, 122, 54, 0.06);
    width: 100%;
    font-size: 12px;
    color: #ff7a36;
    line-height: 40px;
    padding: 0px 20px;
    /deep/ .ico-warn {
      width: 20px;
      font-size: 16px;
      top: -1px;
      color: #ff7a36;
      height: 20px;
      margin-top: -3px;
      margin-right: 5px;
      vertical-align: middle;
    }
  }
  .content {
    padding: 12px 24px 24px 24px;
    flex: 1;
    overflow: auto;

    .batch {
      min-height: 300px;
      padding-top: 80px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      .asterisk {
        color: #ec1e1e;
      }
      .side {
        padding-top: 6px;
        font-size: 14px;
      }
      .file-list {
        display: flex;
        flex-direction: column;
      }
      .download {
        font-size: 14px;
        color: #a4b2c2;
        &:hover {
          color: var(--theme-color);
        }
      }
    }

    .artificial {
      min-height: 300px;
      .artificial-item {
        margin-top: 14px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-column-gap: 20px;
      }
    }

    .summation {
      border-top: dashed 1px rgba(164, 178, 194, 0.4);
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      color: var(--text-second-color);
      margin-top: 4px;
      padding: 12px 0 24px 0;
      div {
        color: var(--text-second-color);
        font-size: var(--default-font-size);
        span:nth-child(2) {
          color: var(--text-color);
          font-size: var(--small-font-size);
        }
      }
    }
  }

  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    //column-gap: 12px;
    background-color: #f4f8ff;
    padding: 10px 20px;
    .tg-btn {
      min-width: 65px;
    }
  }
}
</style>
