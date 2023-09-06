<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-dialog-classic {
  /deep/ .el-dialog__header {
    padding-top: 0;
  }
  /deep/ .el-dialog {
    padding: 0;
  }
  /deep/ .el-dialog__footer {
    padding: 0;
  }
  /deep/ .el-form-item__label {
    line-height: 1;
    padding-bottom: 6px;
    font-size: 12px;
    .tip {
      font-size: 12px;
      color: #a4b2c2;
      padding-left: 6px;
    }
  }
  /deep/ .el-form {
    .el-form-item {
      margin-bottom: 18px;
    }
  }
  .dialog-content {
    padding: 24px 24px;
    /deep/ .el-date-editor {
      width: 100%;
    }
    .line-box {
      display: flex;
      column-gap: 18px;
      .el-form-item {
        flex: 1;
      }
    }
    .jiesuanbox {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 18px;
    }
    .jianlibox {
      display: flex;
      flex-direction: column;
    }
    .el-select {
      width: 100%;
    }
    .first {
      display: flex;
      align-items: center;
      column-gap: 12px;
      /deep/ .el-form-item {
        width: 150px;
      }
    }
  }
  .upload-btn {
    width: 90px;
    height: 90px;
    border: dashed 1px rgba(164, 178, 194, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    i {
      font-size: 28px;
      width: 28px;
      height: 28px;
      display: block;
      margin-bottom: 8px;
    }
    font-size: 12px;
    color: var(--text-second-color);
  }
  .file-list {
    display: flex;
    column-gap: 18px;

    .file {
      width: 90px;
      height: 90px;
      position: relative;

      img {
        width: 100%;
        height: 100%;
      }

      .icon {
        position: absolute;
        right: -7px;
        top: -7px;
        width: 14px;
        height: 14px;
        cursor: pointer;
        font-size: 14px;
      }
    }
  }
  .jianli-upload {
    display: flex;
    align-items: center;
    column-gap: 12px;
  }
  .file-tips {
    flex: 1;
    font-size: 12px;
    color: var(--text-third-color);
    line-height: 1.2;
  }
  .videos {
    padding-top: 12px;
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    overflow: hidden;
    .video {
      display: flex;
      align-items: center;
      color: var(--text-color);
      overflow: hidden;
      height: 18px;
      line-height: 18px;
      span {
        flex: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      svg {
        margin-left: 7px;
        cursor: pointer;
      }
    }
  }
}
</style>
