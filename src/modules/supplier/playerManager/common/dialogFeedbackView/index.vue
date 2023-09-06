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
    display: flex;
    flex-direction: column;
    row-gap: 18px;
    .label {
      font-size: 12px;
      color: #6a7b92;
    }
    .text {
      color: var(--text-color);
      line-height: 18px;
      padding-top: 12px;
    }
    .images {
      display: flex;
      flex-wrap: wrap;
      gap: 18px;
      padding-top: 12px;
      img {
        display: block;
        width: 90px;
        height: 90px;
        background: #ffffff;
        border: 1px solid rgba(164, 178, 194, 0.5);
        border-radius: 2px;
      }
    }
    .videos {
      display: flex;
      flex-wrap: wrap;
      .video {
        width: 250px;
        .link-url {
          width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--text-color);
          font-size: 14px;
        }
        svg {
          margin-right: 5px;
          font-size: 16px;
        }
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
  .file-tips {
    font-size: 12px;
    color: var(--text-third-color);
    line-height: 1;
    margin-top: 6px;
  }
  .videos {
    padding-top: 12px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 8px;
    grid-column-gap: 12px;
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
