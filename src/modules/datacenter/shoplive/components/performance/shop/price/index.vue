<script src="./scrollbar.js"></script>
<script src="./index.tsx"></script>
<style scoped lang="less">
.pirce-pie {
  position: relative;
  .table-main {
    flex: auto;
    ::-webkit-scrollbar {
      /*    width: 6px;
      height: 6px; // 纵向滚动条 必写*/
      cursor: pointer;
    }
    /deep/.table {
      display: inline-block;
      width: calc(100% - 16px);
      .el-table__header th,
      .el-table__row td {
        padding: 8px 11px;
        font-size: 12px !important;
        & .cell {
          padding: 0;
        }
      }
    }
  }
  .pie-main {
    display: flex;
    column-gap: 18px;
    justify-content: center;
    .pie {
      width: 580px;
      display: inline-block;
      padding: 0 0 18px;
    }
  }
  .hide {
    display: none;
  }
}
</style>
