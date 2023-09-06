<script src="./index.tsx"></script>
<style lang="less" scoped>
.dialog-container {
  padding: 18px 24px 18px;
  /deep/ .el-form-item {
    .el-form-item__label {
      margin-bottom: 4px;
    }
  }

  .annex {
    width: 100%;
    overflow: hidden;
    line-height: 1.3;
    .tips {
      display: block;
      font-size: 12px;
      color: var(--text-third-color);
      padding-top: 6px;
    }
  }
  /deep/ .upload-file-list {
    .file-item {
      margin-top: 6px;
      width: 100%;
    }
  }
  /deep/.inline {
    .el-form-item__content {
      .handler {
        padding-left: 10px;
        line-height: 28px;
      }
    }
  }
}
</style>
