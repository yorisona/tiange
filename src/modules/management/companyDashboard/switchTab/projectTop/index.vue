<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-project-top-page-container {
  /deep/ .empty-no-support {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 252px;
    div {
      color: var(--text-third-color);
      font-size: var(--small-font-size);
    }
    img {
      width: 150px !important;
      height: 100px !important;
      margin-bottom: 10px !important;
    }
  }
  .operator-field {
    display: flex;
    justify-content: space-between;
    .tg-btn-link {
      display: flex;
      align-items: center;
    }
    .ico-arrow-right {
      font-size: 16px;
    }
    .business-type-switch {
      display: grid;
      grid-auto-flow: column;
      justify-content: start;
      align-items: center;
      column-gap: 8px;
      &::before {
        // content: '\7edf\8ba1\7ef4\5ea6\ff1a';
        content: '\4e1a\52a1\7c7b\578b:';
        font-size: 12px;
        color: #5a5a5a;
      }
      .item {
        display: inline-block;
        background: #ffffff;
        border: 1px solid #d8d8d8;
        border-radius: 2px;
        font-size: 12px;
        padding: 1px 10px 2px;
        color: #888888;
        cursor: pointer;
        &[actived] {
          color: white;
          background-color: var(--theme-color);
          border-color: var(--theme-color);
        }
      }
    }
  }
  .table-field {
    margin-top: 16px;
    border-top: 1px solid var(--table-border-color);
    /deep/ .el-table {
      border: none !important;
      .project-name-div {
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &:hover {
          color: var(--theme-color);
        }
      }
      .cell-container {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .amount {
          color: var(--text-third-color);
          font-size: 12px;
        }
        .line {
          width: 1px;
          height: 17px;
          border-left: 1px solid var(--table-border-color);
          margin: 0 8px 0 10px;
          display: inline-block;
        }
        .rank {
          color: var(--text-third-color);
          font-size: 12px;
          text-align: left;
          width: 24px;
        }
        .rank-change {
          display: inline-block;
          width: 24px;
          text-align: left;
        }
      }
      .no-sortable {
        cursor: auto;
        pointer-events: none;
        .cell {
          .caret-wrapper {
            display: none;
          }
        }
      }
      .sort-column {
        //background: #f0f8ff !important;
        .cell-container {
          .amount,
          .rank {
            color: var(--text-color);
          }
        }
      }
      .el-table__row > td.el-table__cell,
      th.el-table__cell.is-leaf {
        border-right: 1px solid var(--table-border-color) !important;
        //border-bottom: none !important;
        &:last-child {
          border-right: none !important;
        }
      }
      th.el-table__cell.is-leaf {
        &:nth-last-child(2) {
          border-right: none !important;
        }
      }
    }
  }
}
</style>
