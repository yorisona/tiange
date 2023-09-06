<script src="./index.tsx"></script>
<style lang="less" scoped>
.dialog-content {
  padding: 18px 12px 18px 24px;
  /deep/ .el-form {
    .el-form-item__label {
      font-size: 12px;
      line-height: 24px;
    }
    .upload-box {
      .upload-form {
        display: flex;
        align-content: center;
        margin-top: 0;
      }

      .file-tips {
        flex: 1;
        margin-left: 12px;
        font-size: 12px;
        color: var(--text-third-color);
        margin-top: 2px;
      }
    }
  }
}
</style>
