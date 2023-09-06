<script src="./index.tsx"></script>
<style lang="less" scoped>
.dialog-container {
  padding: 24px;
  .header {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    border-bottom: solid 1px #e5e5e5;
    .title {
      font-weight: 600;
      color: var(--text-color);
    }
    .description {
      margin-top: 17px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      span {
        display: block;
      }
      .label,
      .time {
        font-size: 12px;
        color: var(--text-third-color);
      }
      .empty {
        flex: 1;
      }
      .form {
        background: #f2f7ff;
        border-radius: 2px;
        color: var(--theme-color);
        padding: 2px 6px;
      }
      .el-icon-time {
        margin-right: 5px;
      }
    }
  }
  .content {
    padding: 14px 0 16px 0;
    line-height: 20px;
    text-indent: 2em;
  }
  .source {
    color: var(--theme-color);
  }
}
</style>
