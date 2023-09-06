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
  }
  /deep/ .el-form {
    .el-form-item {
      margin-bottom: 18px;
    }
  }
  .dialog-content {
    padding: 0px;
    margin: 0 10px;
    .swiper-container {
      width: 100%;
      height: 564px;
      .swiper-slide {
        padding: 32px 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .img {
      max-width: 562px;
      max-height: 100%;
    }
  }
  .upload-btn {
    width: 120px;
    height: 120px;
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
      width: 120px;
      height: 120px;
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
    .video {
      display: flex;
      align-items: center;
      color: var(--text-color);
      svg {
        margin-left: 7px;
        cursor: pointer;
      }
    }
  }
  .my-button-disabled {
    color: #ddd;
  }
  .pagenation {
    text-align: center;
    height: 20px;
    & span {
      position: relative;
      top: -10px;
    }
  }
}
</style>
