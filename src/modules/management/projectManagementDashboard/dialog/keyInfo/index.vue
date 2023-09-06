<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-key-info-page-container {
  padding: 16px 0 0;
  // height: 412px;
  overflow: hidden;
  .input-field {
    padding: 0 16px;
    position: relative;
    /deep/ .el-textarea {
      .el-textarea__inner {
        height: 94px;
        background: #f7f7f7;
        border-radius: 5px;
      }
    }
    .add-btn {
      right: 28px;
      bottom: 8px;
      position: absolute;
      font-size: 12px;
    }
  }
  .middle-line {
    margin: 18px 16px 0;
    height: 1px;
    border-top: 1px dashed var(--border-line-color);
    // padding: 0 16px;
  }
  .key-info-list {
    margin-top: 12px;
    height: 262px;
    overflow: overlay;
    padding: 0 16px;
    .key-info-item {
      padding: 12px 0;
      border-top: 1px dashed var(--border-line-color);
      &:first-of-type {
        border: none;
        padding-top: 0;
      }
      &:last-of-type {
        padding-bottom: 24px;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          display: flex;
          color: var(--text-third-color);
          align-content: center;
          .name {
            flex-shrink: 0;
          }
          .time {
            margin-left: 12px;
          }
        }
        .icon {
          flex-shrink: 0;
          cursor: pointer;
          color: var(--text-four-color);
          font-size: 16px;
          &:hover {
            color: var(--theme-color);
          }
        }
      }
      .content {
        margin-top: 4px;
      }
    }
    /deep/ .empty-container {
      > img {
        width: 118px !important;
        height: 64px !important;
        margin-bottom: 8px !important;
      }
      > div {
        font-size: var(--default-font-size) !important;
      }
    }
  }
}
</style>
