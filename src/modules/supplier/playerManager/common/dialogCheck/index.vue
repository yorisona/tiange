<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-dialog-classic {
  display: flex;
  align-items: center;
  justify-content: center;
  /deep/ .el-dialog {
    padding: 0;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
  .dialog-content {
    padding: 24px 32px;
    height: 150px;
  }
  /deep/ .el-textarea__inner {
    height: 100px;
    font-size: 12px;
    color: var(--text-color);
  }
}
</style>
