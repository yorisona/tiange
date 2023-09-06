<script src="./index.tsx"></script>
<style lang="less" scoped>
@import '../../../components/steps/index.less';

.process-container {
  .steps-box {
    // margin-top: 10px;
    min-width: 1260px;
    margin-bottom: 40px;
    column-gap: 0;
    .step {
      cursor: pointer;
      margin-right: 54px;
      .step-target {
        border-color: var(--theme-color);
        flex-direction: column;
        font-size: 14px;
        &.close {
          /*background: #fafafa;*/
          /*color: #a4b2c2;*/
          /*border-color: rgba(var(--theme-rgb-color), 0.3);*/
        }
        &.disabled {
          cursor: not-allowed;
          border: 1px solid var(--border-line-div-color);
        }
        .icon {
          position: absolute;
          right: 2px;
          bottom: 2px;
        }
      }
    }

    .currentEdit {
      .step-target {
        background-color: var(--theme-color);
        color: white;
        font-size: 14px;
      }
    }
  }

  .el-form {
    .process-title {
      display: flex;
      align-items: center;
      margin-bottom: 18px;
      &:before {
        content: ' ';
        display: block;
        width: 3px;
        height: 14px;
        margin-right: 6px;
        background: rgba(var(--theme-rgb-color), 0.9);
        border-radius: 1px;
      }
    }
    /deep/.el-form-item {
      margin-bottom: 24px;
      .el-form-item__label {
        color: var(--text-second-color) !important;
      }
      &.label-bottom-6 {
        .el-form-item__label {
          padding-bottom: 6px;
          line-height: 18px !important;
        }
      }
      &.label-bottom-0 {
        .el-form-item__label {
          padding-bottom: 0;
        }
      }
      &.label-font-14 {
        .el-form-item__label {
          font-size: 14px;
        }
      }
    }
    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }
    .checkbox-items-container {
      display: flex;
      line-height: 28px;
      height: 28px;
      align-items: center;
      /deep/ .el-checkbox {
        .el-checkbox__label {
          padding-left: 6px;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
