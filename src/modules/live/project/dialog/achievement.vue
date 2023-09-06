<script src="./achievement.tsx"></script>

<style lang="less">
.achievement-container {
  height: 554px;
  line-height: 1;
  box-sizing: border-box;
  padding: 20px 12px 20px 28px;
  overflow-y: auto;
  overflow-y: overlay;
  .form-block-header {
    margin-bottom: 10px;
    color: var(--text-color);
  }

  /deep/ .el-form-item {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;

      .el-form-item__error {
        padding-top: 1px;
      }
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner,
    .el-select {
      width: 100%;
    }
  }
  .radio-form-item-children {
    border-radius: 4px;
    margin-left: 68px;
    background: #f6f6f6;
    padding: 16px 0 16px 16px;
    margin-right: 16px;
    margin-bottom: 16px;
  }

  .upload-operation {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    .upload-tips {
      line-height: 28px;
      font-size: 12px;
      color: var(--text-third-color);
    }
  }
  .uploaded-list {
    margin-top: 10px;
    display: grid;
    .upload-item {
      display: grid;
      grid-template-columns: max-content 1fr max-content;
      grid-column-gap: 4px;
      align-items: center;
      .attachment-name {
        align-content: center;
        overflow: hidden;
        max-height: 20px;
        line-height: 20px;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
      }
      .clear-uploaded-file {
        cursor: pointer;
      }
      span {
        color: var(--theme-color);
      }
      img {
        width: 14px;
        height: 14px;
      }
    }
  }
}

.achievement-container {
  .mgb0 {
    margin-bottom: 0;
  }
}
</style>
<style lang="less">
.achievement-tsx-dialog {
  .el-dialog__body {
    max-height: 554px;
  }
}
</style>
