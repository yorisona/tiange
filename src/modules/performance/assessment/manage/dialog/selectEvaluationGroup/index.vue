<script src="./index.tsx"></script>
<style lang="less" scoped>
.launch-container {
  display: grid;
  padding: 24px;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 16px;
  height: 430px;
  overflow: hidden;
  & > div {
    border: 1px solid var(--border-line-div-color);
    border-radius: 4px;
    padding: 16px;
    overflow: hidden;
  }
  .content-select {
    display: flex;
    flex-direction: column;
    .search {
      display: flex;
      align-items: center;
      margin: 16px 0;
      column-gap: 12px;
      .el-input {
        flex: 1;
      }
    }
    .header {
      display: flex;
      column-gap: 12px;
      span {
        cursor: pointer;
        padding: 4px 12px;
        &.active {
          color: white;
          background: #3b83ff;
          border-radius: 2px;
        }
        &.disabled {
          color: #a4b2c2;
        }
      }
    }
    .flex-fill {
      overflow: auto;
    }
    /deep/.pagination {
      margin-bottom: -10px;
      .number {
        border: none;
        height: 30px;
        line-height: 30px;
        width: auto;
        font-size: 12px;
        &:hover {
          border: none;
        }
        &.active {
          color: rgba(var(--theme-rgb-color), 0.9);
          background-color: transparent;
        }
      }
      button {
        border: none;
        &:hover {
          border: none;
        }
      }
    }
    .table {
      display: grid;
      grid-template-columns: 1fr;
      // grid-template-columns: 20px auto auto 1fr;
      grid-column-gap: 6px;
      grid-row-gap: 10px;
      .group-count {
        color: #a4b2c2;
      }
      .table-row {
        display: flex;
        font-size: 12px;
        .el-checkbox {
          font-size: 12px;
          line-height: 14px;
        }
        .group-count {
          color: var(--text-third-color);
        }
        div:not(:first-child) {
          line-height: 18px;
        }
      }
    }
  }

  .select-box {
    padding: 16px;
    overflow: hidden;
    border: 1px solid var(--border-line-div-color);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    .all-select {
      margin-top: 24px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      column-gap: 16px;
      padding-left: 12px;
    }

    .selected-people,
    .el-tree {
      flex: 1;
      overflow: auto;
    }
    .selected-info {
      display: flex;
      span {
        flex: 1;
        color: var(--text-third-color);
      }
      a {
        font-size: 12px;
      }
    }
    .selected-people {
      .selected-people-list {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        padding-top: 18px;
        column-gap: 8px;
        row-gap: 12px;
        span {
          padding: 4px 10px;
          display: flex;
          align-items: center;
          background: #f5f7f8;
          border-radius: 2px;
          color: var(--text-color);
          font-size: 12px;
          cursor: default;
          &:hover {
            background: rgba(var(--theme-rgb-color), 0.1);
            color: var(--theme-color);
            i {
              cursor: pointer;
              color: var(--theme-color);
            }
          }
          i {
            margin-left: 6px;
            line-height: 1;
            width: 12px;
            height: 12px;
            color: var(--text-third-color);
          }
        }
      }
    }
  }
}
</style>
