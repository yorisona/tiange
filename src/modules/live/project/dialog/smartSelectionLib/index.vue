<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-smart-selection-lib-page-container {
  padding: 18px 18px 24px;
  height: 440px;
  overflow-y: auto;
  overflow-x: hidden;
  /deep/ .el-form {
    .el-form-item {
      margin-right: 0;
    }
  }
  .header {
    font-weight: 600;
    align-items: center;
    display: flex;
    color: var(--text-color);
    &:before {
      content: '';
      width: 3px;
      height: 12px;
      background: #2877ff;
      margin-right: 6px;
      border-radius: 1px;
    }
    &.selection-goods {
      margin-top: 24px;
    }
  }
  .add-way-radio-group {
    margin-top: 16px;
  }
  .custion-selection-list {
    margin-left: 18px;
    .custom-selection-item {
      display: grid;
      grid-auto-flow: column;
      align-items: center;
      margin-bottom: 12px;
      column-gap: 12px;
      .icon.ico-common-shanchu-linear {
        font-size: 16px;
        color: #c1c1c1;
        cursor: pointer;
        &[disabled] {
          cursor: not-allowed;
          color: #d8d8d8;
        }
        //d8d8d8
      }
    }
  }
}
</style>
