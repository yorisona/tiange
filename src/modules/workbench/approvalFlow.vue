<script src="./approvalFlow.tsx"></script>
<style lang="less" scoped>
#steps-exted {
  /deep/.el-steps {
    .el-step__head {
      line-height: 0;
      min-height: 60px;
      height: auto;
      .el-step__icon {
        &.is-text {
          border: none !important;
          background: transparent !important;
          svg.icon {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .el-step__main {
      padding-left: 15px;
      padding-top: 0;
      padding-bottom: 26px;
      .el-step__title {
        height: auto;
        font-weight: 600;
        line-height: 1;
        margin-bottom: 10px;
      }
      .el-step__description {
        .flow-select {
          margin-bottom: 8px;
        }
      }
    }

    .el-step {
      .size-medium {
        color: #5c82ff;
      }
      &.is-vertical {
        .el-step__line {
          top: 18px;
          bottom: 0px;
        }
      }
    }
  }
}
</style>
