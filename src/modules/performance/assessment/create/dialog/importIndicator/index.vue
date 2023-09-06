<script src="./index.tsx"></script>
<style lang="less" scoped>
.page-container {
  /deep/ .el-form {
    padding: 16px 18px;
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, 1fr) auto;
    border-bottom: solid 1px var(--border-line-div-color);
    .el-form-item {
      display: flex;
      margin-bottom: 0;
      margin-right: 18px;
      .el-form-item__label {
        font-size: 12px;
        height: 28px;
        line-height: 28px;
      }
      .el-form-item__content {
        height: 28px;
        line-height: 28px;
        flex: 1;
        .el-input__inner {
          display: block;
          font-size: 12px;
          height: 28px;
          line-height: 28px;
        }

        .el-select,
        .el-input {
          display: block;
        }
      }
    }
    .tg-btn {
      height: 28px;
      line-height: 28px;
    }
  }
  .content-box {
    padding: 18px 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 18px;
  }
  /deep/.library-box {
    height: 394px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .table-column {
      .cell {
        text-align: left !important;
      }
    }
    .pagination {
      // margin-bottom: -10px;
      margin-top: 4px;
      .number {
        border: none;
        height: 24px;
        line-height: 24px;
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
  }
  .select-box {
    height: 394px;
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
