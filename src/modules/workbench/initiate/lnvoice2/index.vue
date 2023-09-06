<script src="./index.tsx"></script>
<style lang="less">
@import './index.less';
</style>
<style lang="less" scoped>
/deep/ .common-input,
.common-select {
  width: 266px !important;
  margin-right: 18px !important;
}
.charge-company {
  /deep/ .el-form .el-form-item {
    width: auto;
    .contract-type-div {
      display: flex;
      .el-input__count .el-input__count-inner {
        margin-top: -2px;
      }
      .content_type-explain {
        padding-top: 3px;
        .el-button.el-button--mini,
        .el-button.el-button--mini.is-round {
          border: none;
          padding: 0 8px;
        }
      }
    }
  }
}

/deep/ .el-form-item:nth-child(3n) {
  margin-right: 0 !important;
}
</style>
