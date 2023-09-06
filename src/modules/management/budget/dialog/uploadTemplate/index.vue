<script src="./index.tsx"></script>
<style lang="less" scoped>
.dialog-container {
  padding: 32px 24px 32px 32px;
  &.message {
    padding: 18px 0 24px 0;
  }
  display: flex;
  flex-direction: column;
  justify-content: center;
  .tips-div {
    color: var(--text-third-color);
    font-size: 12px;
    margin-left: 60px;
  }
  /deep/ .el-form .el-form-item--mini:last-child {
    margin-bottom: 8px;
  }
  &.message {
    align-items: center;
    .icon {
      font-size: 48px;
    }

    .title {
      text-align: center;
      font-size: 16px;
      color: var(--text-color);
      line-height: 22px;
      margin: 8px 0;
    }
    .label {
      text-align: center;
      font-size: 12px;
      line-height: 18px;
      color: var(--text-second-color);
      margin-bottom: 2px;
      .fail {
        color: var(--error-color);
      }
    }
    .tips {
      text-align: center;
      font-size: 12px;
      line-height: 18px;
      margin-bottom: 20px;
      color: var(--text-third-color);
    }
    .tg-btn {
      width: 80px;
    }
  }
}
.btns-line {
  display: flex;
  justify-content: center;
  height: 48px;
  line-height: 48px;
  background: #f4f8ff;
  width: 100%;
  .tg-btn {
    margin-top: 10px;
  }
}
.tg-file-item {
  width: 160px;
  margin: 0 0 0 60px;
}
</style>
