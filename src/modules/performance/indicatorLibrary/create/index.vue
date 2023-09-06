<script src="./index.tsx"></script>
<style lang="less" scoped>
/deep/ .el-form .el-form-item--mini {
  margin-right: 0 !important;
  &.detail-item,
  &.value-item {
    margin-bottom: 8px;
    .el-form-item__label {
      color: var(--text-third-color);
      height: 28px !important;
      line-height: 28px !important;
    }
  }
  &.value-item {
    .el-form-item__label {
      color: var(--text-second-color) !important;
    }
  }
  .el-form-item__label {
    padding: 0;
    height: 24px;
    line-height: 18px;
    font-size: 12px;
  }
}
.page-content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .content {
    flex: 1;
    overflow-y: auto;
    padding: 18px 18px 30px;
    background-color: white;
    display: flex;
    flex-direction: column;
    //align-items: flex-start;
  }

  .sheng {
    color: var(--text-color);
    font-size: 12px;
    line-height: 28px;
  }
  /deep/ .el-radio {
    .el-radio__label {
      color: var(--text-color);
    }
  }
  /deep/ .el-textarea__inner {
    min-height: 74px !important;
  }
  /deep/ .content-flex {
    display: flex;
    align-items: center;
    .el-form-item__content {
      display: flex;
    }
  }
}
</style>
