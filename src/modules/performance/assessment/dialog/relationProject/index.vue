<script src="./index.tsx"></script>
<style lang="less">
.dialog-container.relation-project {
  padding: 24px 24px 24px;

  .form-search {
    /deep/ .el-form {
      display: flex;
      align-items: center;
      .el-select,
      .el-input {
        width: 100%;
      }
      .el-form-item {
        display: flex;
        &:first-child {
          margin-left: 0;
          .el-form-item__content {
            width: 160px;
          }
        }
        &:last-child {
          margin-right: 0;
          flex: 1;
          .el-form-item__content {
            width: auto;
          }
        }
        .el-form-item__label {
          white-space: nowrap;
        }
      }
    }
  }

  .form-body {
    height: 60vh;
    display: flex;
    .project-table {
      width: 410px;
    }
    .select-box {
      height: 100%;
      width: 330px;
      margin-left: 16px;
      padding: 16px;
      //overflow: hidden;
      border: 1px solid var(--table-border-color);
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
}
</style>
