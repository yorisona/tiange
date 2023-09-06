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
  /deep/ .el-form {
    .el-form-item {
      margin-bottom: 18px;
    }
  }
  .dialog-content {
    padding: 16px 0 18px 18px;
    .el-select {
      width: 100%;
    }
  }
  .upload-btn {
    width: 90px;
    height: 90px;
    border: dashed 1px rgba(164, 178, 194, 0.5);
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    i {
      font-size: 28px;
      width: 28px;
      height: 28px;
      display: block;
      margin-bottom: 0;
    }
    font-size: 12px;
    color: var(--text-second-color);
  }
  .file-list {
    margin-top: 6px;
    display: flex;
    flex-wrap: wrap;
    column-gap: 12px;
    row-gap: 12px;
    .file {
      width: 90px;
      height: 90px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        border-radius: 2px;
      }
      .icon {
        position: absolute;
        right: -7px;
        top: -7px;
        width: 16px;
        height: 16px;
        cursor: pointer;
        font-size: 16px;
        color: #d1d8e0;
        &:hover {
          color: #f04b4b !important;
        }
      }
    }
  }
  .file-tips {
    font-size: 12px;
    color: var(--text-third-color);
    margin-left: 8px;
    line-height: 1;
    margin-top: 6px;
  }
  .upload-video {
    margin-top: 3px;
    width: 105px;
    height: 30px;
    /deep/.el-loading-spinner .circular {
      height: 20px;
      width: 20px;
      margin-top: 10px;
    }
  }
  .videos {
    .video {
      display: flex;
      align-items: center;
      color: var(--text-color);
      height: 24px;
      margin-top: 12px;
      svg {
        margin-right: 6px;
        cursor: pointer;
        font-size: 16px;
      }
      .video-name {
        max-width: 450px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .delete-icon {
        width: 16px;
        height: 16px;
        margin-left: 6px;
        cursor: pointer;
        color: #d1d8e0;
        line-height: 1;
        &:hover {
          color: #f04b4b !important;
        }
      }
    }
    .label {
      .tip {
      }
    }
  }
}
</style>
