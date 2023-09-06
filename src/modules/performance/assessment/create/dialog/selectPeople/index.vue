<script src="./index.tsx"></script>
<style lang="less" scoped>
.dialog-container {
  display: grid;
  grid-template-columns: 500px 1fr;
  grid-column-gap: 16px;
  padding: 24px;
  overflow: hidden;
  .select-box {
    height: 502px;
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
      color: var(--text-third-color);
      span {
        flex: 1;
      }
      a {
        font-size: 12px;
      }
    }
    .selected-people {
      margin-top: 18px;
      .selected-people-list {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        column-gap: 8px;
        row-gap: 12px;
        font-size: 12px;
        span {
          padding: 4px 10px;
          display: flex;
          align-items: center;
          background: #f5f7f8;
          border-radius: 2px;
          color: var(--text-color);
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
            height: 9px;
            color: var(--text-third-color);
          }
        }
      }
    }
  }
  /deep/ .el-tree {
    color: var(--text-color);
    .people-count {
      color: var(--text-third-color);
    }
    .el-tree-node {
      margin-bottom: 4px;
    }
  }
}
</style>
