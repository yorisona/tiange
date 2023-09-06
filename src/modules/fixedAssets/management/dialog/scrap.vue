<script src="./scrap.tsx"></script>
<style lang="less" scoped>
.form-wrap {
  padding: 18px 2px 18px 18px;
  .file-box {
    max-height: 60px;
    overflow-y: auto;
  }
  .el-form-item {
    margin-bottom: 18px;
  }
  /deep/.el-form-item__content {
    display: flex;
  }
  .flex-align {
    display: flex;
    align-items: center;
  }
  .upload-file-list {
    flex-direction: row;
    column-gap: 16px;
    flex-wrap: wrap;
  }
  .detail-box {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .edit-table {
    // max-height: 250px;
    overflow: auto;
    width: 100%;
    .add-btn {
      width: 100%;
      height: 32px;
      color: #2877ff;
      text-align: center;
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
  }
}
</style>
