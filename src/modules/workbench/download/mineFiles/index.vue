<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-workbench-download-mine-files-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  // .query-field {
  //   padding: 18px 25px 6px;
  //   background: white;
  //   /deep/ .el-form {
  //     display: flex;
  //     flex-wrap: wrap;
  //     .el-form-item {
  //       margin-bottom: 12px;
  //       margin-right: 24px;
  //       width: 252px;
  //       // input {
  //       //   font-size: 12px;
  //       // }
  //       // .el-form-item__label {
  //       //   font-size: 12px;
  //       // }
  //       &:last-of-type {
  //         width: auto;
  //       }
  //     }
  //   }
  // }

  .operator-field {
    // margin-top: 10px;
    background-color: white;
    .operator-items {
      padding: 12px 18px;
    }
  }
  /deep/ .table-field {
    flex: 1;
    background: white;
    padding: 0px 18px 0;
    overflow: hidden;
    .el-table__fixed {
      background-color: transparent;
      bottom: 0;
    }
    // .el-table__fixed-footer-wrapper {
    //   bottom: -11px;
    // }
  }
  .pagination-field {
    padding: 0 18px;
    background: white;
  }
  /deep/ th div {
    font-weight: 400;
  }
  /deep/ tr td {
    .file-status-failed {
      color: var(--error-color);
    }
    .file-status-executing {
      color: rgba(var(--theme-rgb-color), 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      .el-icon-loading {
        font-size: 14px;
        margin-right: 4px;
      }
    }
  }
}
</style>
