<script src="./index.tsx"></script>

<style scoped lang="less">
.pirce-pie {
  position: relative;
  .icon-row {
    position: absolute;
    right: 0;
    top: -31px;
    width: 55px;
    display: flex;
    align-items: center;
    grid-gap: 10px;
    .icon {
      font-size: 16px;
      cursor: pointer;
      color: var(--text-third-color);
      &.active,
      &:hover {
        color: var(--theme-color);
      }
    }
    .line {
      display: inline-block;
      width: 1px;
      height: 15px;
      background: #e3e8ec;
    }
  }

  .table-main {
    ::-webkit-scrollbar {
      width: 6px !important;
      height: 6px;
      cursor: pointer;
    }
    /deep/.table {
      display: inline-block;
      width: calc(50% - 6px);
      .el-table__header th,
      .el-table__row td {
        padding: 8px 11px;
        font-size: 12px !important;
        & .cell {
          padding: 0;
        }
      }
      &:first-child {
        margin-right: 12px;
      }
    }
  }
  .pie-main {
    display: flex;
    column-gap: 18px;
    justify-content: space-between;
    .pie {
      flex: 1;
      display: inline-block;
      padding: 0 18px 18px;
    }
  }
  .hide {
    display: none;
  }
}
</style>
