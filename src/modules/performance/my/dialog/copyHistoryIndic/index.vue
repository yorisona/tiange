<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-copy-history-indic-page-container {
  .content {
    padding: 24px 24px 12px;
    .content-list {
      overflow: overlay;
      height: 300px;
      .content-items {
        margin-top: 12px;
        height: 264px;
        overflow: overlay;
        .content-item {
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          // height: 14px;
          // line-height: 14px;
          .content-label {
            flex-shrink: 0;
            font-size: 14px;
            line-height: 16px;
          }
          &:first-of-type {
            margin-top: 0;
          }
        }
      }
    }
  }
  .footer {
    padding: 0 24px;
    position: relative;
    background: #f4f8ff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 50px;
    line-height: 50px;
    .selectedLabel {
      position: absolute;
      left: 24px;
      color: var(--text-color);
    }
  }
  /deep/ .el-checkbox {
    .el-checkbox__label {
      color: var(--text-color);
      font-weight: 400;
    }
  }
}
</style>
