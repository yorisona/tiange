<script src="./application.tsx"></script>
<style lang="less" scoped>
.form-wrap {
  padding: 12px;
  font-size: 12px;
  .columnLabel {
    display: inline-block;
    width: 100%;
    text-align: left;
  }
  .add-btn {
    width: 100%;
    text-align: center;
    border: 1px solid var(--table-border-color);
    border-top: none;
    border-radius: unset;
    height: 32px;
    color: #2877ff;
    color: var(--theme-color);
  }
  .ico-btn {
    font-size: 16px;
    color: var(--disabled-color);
    cursor: pointer;
  }
  .el-form-item {
    // margin-bottom: 0;
    margin-right: 0;
    display: flex;
    align-items: center;
    /deep/.el-form-item__content {
      flex: 1;
    }
  }
  .costBox {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    margin-bottom: 6px;
    .el-radio-group {
      display: inline-flex;
      margin-bottom: 12px;
    }
  }
  .upload-box {
    /deep/ .upload-file-list {
      padding-top: 6px;
    }
  }
  .label {
    display: inline-block;
    margin-bottom: 6px;
  }
  .edit-table {
  }
  .fill-wrap {
    display: flex;
    flex-direction: column;
    align-items: initial;
    /deep/.el-form-item__content {
      flex: 1;
    }
  }
}
</style>
