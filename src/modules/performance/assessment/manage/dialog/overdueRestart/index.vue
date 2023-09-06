<script src="./index.tsx"></script>
<style lang="less" scoped>
.overdue-restart-dialog {
  padding: 24px;
  .overdue-restart-grid {
    display: grid;
    grid-template-columns: repeat(2, 368px);
    grid-template-rows: 435px;
    column-gap: 16px;
  }
  .overdue-restart-desc {
    margin-top: 12px;
    color: #ff7a36;
  }
  .left-container,
  .right-container {
    padding: 16px;
    border-radius: 4px;
    border: 1px solid var(--border-line-div-color);
  }

  .left-container {
    .content {
      margin-top: 12px;
      .content-items {
        margin-top: 16px;
        height: 288px;
        overflow: overlay;
        .content-item {
          margin-top: 14px;
          height: 14px;
          line-height: 14px;
          &:first-of-type {
            margin-top: 0;
          }
        }
      }
    }
  }
  .right-container {
    .header {
      display: flex;
      justify-content: space-between;
      .header-selected {
        color: var(--text-third-color);
      }
    }
    .content {
      margin-top: 10px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      margin-right: -8px;
      .content-item {
        padding: 4px 4px 4px 6px;
        background: #f5f7f8;
        color: var(--text-color);
        border-radius: 2px;
        font-size: 12px;
        flex-shrink: 0;
        margin: 8px 8px 0 0px;
        .el-icon-close {
          margin-left: 2px;
          color: var(--text-third-color);
          cursor: pointer;
          &:hover {
            color: #ec1e1e;
          }
        }
      }
    }
  }
  /deep/ .el-checkbox {
    font-size: 12px;
    line-height: 14px;
    height: 14px;
    .el-checkbox__inner {
      width: 12px;
      height: 12px;
      &:after {
        width: 2px;
        height: 5px;
        top: 1px;
        left: 4px;
      }
    }
    .el-checkbox__label {
      color: var(--text-color);
      font-size: 12px;
      line-height: 14px;
      font-weight: 400;
    }
    .el-checkbox__input {
      line-height: 14px;
    }
  }
}
</style>
