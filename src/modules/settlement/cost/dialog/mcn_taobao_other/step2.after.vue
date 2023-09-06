<script src="./step2.after.tsx"></script>
<style lang="less" scoped>
.settlement-step2-mcn-cost-after-taobao-other {
  /deep/.step2-cost-layout-content {
    grid-template-rows: 118px 380px !important;
    .adjust-account-content {
      grid-template-rows: 44px 276px !important;
    }
  }
  .settlement-left-block {
    .input-row {
      display: flex;
      align-items: center;
    }
    /deep/ .el-textarea {
      .el-textarea__inner {
        width: 360px;
        height: 80px;
      }
    }
    .label {
      color: var(--text-second-color);
    }
    // .label-84 {
    // width: 84px;
    // }
    .label-42 {
      width: 42px;
      display: inline-block;
      text-align: right;
    }
    .value {
      font-weight: 600;
      color: var(--text-color);
    }
  }
  /deep/ .step2-content-two {
    grid-template-rows: 118px 365px 0px !important;
    .adjust-account-content {
      grid-template-rows: 44px 261px !important;
    }
  }
  height: 541px !important;
  /deep/.step2-layout-content {
    height: 540px !important;
  }
}
</style>
