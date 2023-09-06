<script src="./index.tsx"></script>
<style lang="less" scoped>
.line {
  background-color: #ffffff;
  padding: 14px 18px 0 18px;
  div {
    height: 1px;
    background-color: #e5e5e5;
  }
}

.tabs {
  display: flex;
  flex-direction: column;

  .tg-tabs {
    border-bottom: solid 1px #e5e5e5;
  }

  /deep/ .radio-box {
    background-color: #ffffff;
    padding: 18px 18px 0 18px;

    .el-radio .el-radio__label {
      color: var(--text-color);
    }
  }
}

.initiate-box {
  display: flex;
  align-items: center;
  height: 56px;
  background-color: #ffffff;
  padding: 0 18px;
  margin-bottom: 10px;
}

/deep/ .el-form-item {
  width: 274px;
}
</style>
