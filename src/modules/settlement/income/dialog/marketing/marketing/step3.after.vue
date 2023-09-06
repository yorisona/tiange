<script src="./step3.after.tsx"></script>
<style lang="less" scoped>
.settlement-step3-taobao-other-detail {
  padding: 0 10px;
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 140px;
    }
    .empty-text {
      margin-top: -15px;
    }
  }
  .item {
    display: flex;
    margin-bottom: 10px;
    .label {
      color: var(--text-third-color);
      width: 50px;
      text-align: right;
    }
    .detail {
      flex: 1;
      .amount {
        display: flex;
        .fee {
          color: var(--text-color);
          font-weight: 600;
        }
        .download {
          color: var(--theme-color);
          margin-left: 10px;
        }
      }
      .text {
        color: var(--text-third-color);
      }
    }
  }
}
/deep/ .step3-layout-content-files {
  width: 650px;
  .star {
    color: var(--error-color);
  }
  .form-uploaded-file {
    width: 650px;
  }
}

.tg-settlement-submit-form {
  height: 540px !important;
  /deep/.step3-layout-content {
    height: 540px;
    grid-template-rows: 118px 262px auto !important;
  }
  // &.is_estimate {
  //   /deep/.step3-layout-content {
  //     height: 540px;
  //     grid-template-rows: 118px 362px auto !important;
  //   }
  // }
}
/deep/.el-form {
  .el-form-item {
    margin-bottom: 12px;
  }
  .el-form-item__label {
    // height: 32px;
    // line-height: 32px;
    padding-right: 0 !important;
  }

  .el-form-item__content {
    // height: 32px;
    // line-height: 32px;

    // .el-input {
    //   height: 32px;
    //   line-height: 32px;
    // }

    // .el-input__inner {
    //   height: 32px;
    //   line-height: 32px;
    // }
  }
}
.adjust-account-amount {
  font-size: 12px;
  color: var(--text-third-color);
  line-height: 16px;
}
.adjust-account-money {
  margin-top: 6px;
  font-size: 14px;
  color: var(--text-color);
  line-height: 18px;
  font-weight: 600;
}
.content-dash-line {
  border-top: 1px dashed rgba(164, 178, 194, 0.3);
  margin: 12px 0 0;
}
.content-adjust-account-item {
  font-size: 12px;
  color: var(--text-second-color);
  line-height: 16px;
}
.upload-tips {
  width: 500px;
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  margin-left: 6px;
  color: var(--text-third-color);
  margin-top: 0px;
  display: inline-block;
}
</style>
