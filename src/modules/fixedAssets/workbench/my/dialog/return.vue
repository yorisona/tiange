<script src="./return.tsx"></script>
<style lang="less" scoped>
.form-wrap {
  padding: 12px 18px;
  font-size: 12px;
  .columnLabel {
    display: inline-block;
    width: 100%;
    text-align: left;
  }
  .add-btn {
    width: 100%;
    text-align: center;
    height: 32px;
    border: 1px solid var(--table-border-color);
    border-top: none;
    border-radius: unset;
    color: var(--theme-color);
  }
  .ico-btn {
    font-size: 16px;
    color: var(--disabled-color);
    cursor: pointer;
  }
  .edit-table {
    // max-height: 250px;
    // overflow: auto;
    width: 100%;
  }
  .el-form-item {
    margin-bottom: 12px;
    margin-right: 0;
    display: flex;
    /deep/.el-form-item__content {
      flex: 1;
    }
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
