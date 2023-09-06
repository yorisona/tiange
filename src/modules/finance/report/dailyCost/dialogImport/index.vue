<script src="./index.tsx"></script>
<style lang="less" scoped>
.dialog-import {
  padding: 12px 24px 24px 24px;
  /deep/ .tg-tabs {
    border-bottom: solid 1px #e3e8ec;
  }
  .content {
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
        font-size: 12px;
      }
      .file-list {
        display: flex;
        flex-direction: column;
      }
      .download {
        font-size: 12px;
        color: var(--text-third-color);
        &:hover {
          color: var(--theme-color);
        }
      }
    }

    .artificial {
      min-height: 300px;
      /deep/ .el-form--label-top .el-form-item__label {
        color: var(--text-second-color);
      }
      .artificial-item {
        margin-top: 14px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-column-gap: 20px;
      }
    }
  }
}
</style>
