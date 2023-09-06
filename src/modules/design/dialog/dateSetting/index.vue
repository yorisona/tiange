<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-date-setting-container {
  /deep/ .el-form {
    padding: 18px 24px 32px;
    .el-form-item {
      .el-form-item__error {
        margin-top: 2px;
      }
      &.flex-item {
        .el-form-item__label {
          height: 18px;
          line-height: 18px;
        }
        .el-form-item__content {
          display: flex;
          flex-direction: column;
        }
      }
      .el-form-item__label {
        color: var(--text-third-color);
        font-size: 12px;
      }
      &:last-of-type {
        margin-bottom: 0;
      }
      .el-checkbox {
        width: 100%;
        margin-left: 0;
        margin-right: 0;
        height: 18px;
        line-height: 18px;
        &.is-disabled {
          cursor: not-allowed;
          .el-checkbox__label {
            color: var(--text-color);
          }
        }
        .el-checkbox__label {
          font-size: 12px;
          font-weight: 400;
        }
        .el-checkbox__input .el-checkbox__inner {
          width: 12px;
          height: 12px;
          &:after {
            height: 5px;
            width: 2px;
            left: 4px;
            top: 2px;
          }
        }
      }
    }
  }
  .message {
    padding: 0 12px;
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    color: #ff7a36;
    background-color: #fff7f3;
    display: flex;
    align-items: center;
    .icon {
      width: 20px;
      height: 20px;
      margin-right: 4px;
      color: #fb8500;
    }
  }
}
</style>
