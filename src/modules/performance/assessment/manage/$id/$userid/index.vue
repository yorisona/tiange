<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-page-container {
  .page-content {
    background-color: white;
    padding: 16px 16px 34px 16px;
    flex: 1;
    overflow: auto;
    min-width: 1260px;
  }

  .form-box {
    background-color: white;
    display: flex;
    align-items: center;
    padding-bottom: 30px;

    .el-form {
      flex: 1;

      .el-form-item {
        margin-bottom: 0;
      }
    }
  }

  /deep/ .table {
    margin-top: 24px;

    .el-table__body tr {
      &:hover > td {
        background-color: transparent;
      }

      & > td {
        &:hover {
          background-color: var(--table-current-row-bg-color);
        }
      }
    }

    .upload-file-list {
      width: 100%;

      .file-item {
        margin-top: 8px;
      }
    }

    .upload-file-list .file-item {
      display: grid;
      width: 100%;
      grid-template-columns: auto 1fr;
      grid-row-gap: 4px;

      .upload-file-download {
        grid-column-start: 2;
      }
    }
  }
}
</style>
