<script src="./index.tsx"></script>
<style lang="less" scoped>
.birthday-range-selection {
  font-size: var(--default-font-size);
  height: var(--default-height);
  border: solid 1px var(--border-line-color);
  padding-right: 6px;
  overflow: hidden;
  position: relative;
  border-radius: 2px;
  .birthday-range-container {
    display: flex;
    position: absolute;
    left: 0;
    top: -1px;
    width: 100%;
    padding-right: 12px;
    height: 100%;
    .el-date-editor {
      flex: 1;
      /deep/.el-input__inner {
        padding-left: 6px !important;
      }
      .el-input__icon {
        width: 20px;
      }
      /deep/ .el-input__suffix .el-input__suffix-inner {
        width: 0 !important;
        .el-input__icon {
          width: 20px;
          margin-left: -18px;
          margin-top: 0;
        }
      }
    }
    > span {
      width: 16px;
      line-height: 28px;
      text-align: center;
    }
  }
  /deep/ span {
    width: auto;
    &.range-separator {
      color: var(--text-third-color);
    }
  }
  /deep/ .el-input--mini {
    padding: 0 !important;
  }

  /deep/ .el-input__inner {
    padding: 2px 0 0 0 !important;
    line-height: 26px;
  }
  /deep/ .el-input__prefix {
    padding: 1px !important;
  }
  /deep/ input {
    display: block;
    flex: 1 0 0;
    border: none;
    outline: none;
    overflow: hidden;
    text-align: center;
    padding: 0 2px;
    color: var(--text-color);
  }
}
</style>

<style lang="less">
.date-picker-202211040958 {
  .el-date-picker__header {
    .el-picker-panel__icon-btn {
      &:nth-of-type(1),
      &:nth-of-type(3) {
        display: none;
      }
    }
    .el-date-picker__header-label {
      &:nth-of-type(1) {
        display: none;
      }
    }
  }
}
</style>
