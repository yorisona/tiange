<script src="./detail.tsx"></script>
<style lang="less" scoped>
.from-wrap {
  padding: 18px 2px 18px 18px;
  .el-form-item {
    margin-right: 16px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    /deep/.el-form-item__content {
      // margin-bottom: -6px;
      flex: 1;
    }
  }
  .label-start {
    align-items: flex-start;
    /deep/.el-form-item__label {
      margin-top: -5px;
    }
  }
  .file-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    // justify-content: space-between;
    column-gap: 24px;
  }
}
</style>
