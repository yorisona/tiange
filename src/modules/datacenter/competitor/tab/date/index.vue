<script src="./index.tsx"></script>
<style lang="less" scoped>
.data-center-competitor {
  .tg-btn-link.text {
    line-height: var(--default-height);
    border-color: transparent;
    color: var(--theme-color) !important;
    > span {
      color: var(--theme-color) !important;
    }
  }
  /deep/ .el-table__body tr {
    &:hover > td.el-table__cell {
      background-color: var(--table-current-row-bg-color);
    }
    &.current-row {
      background: var(--table-focus-row-bg-color);
      &:hover > td.el-table__cell {
        background-color: var(--table-focus-row-bg-color);
      }
    }
  }
  /deep/ .el-table .caret-wrapper {
    height: 20px;
    .sort-caret.ascending {
      top: -1px;
    }
    .sort-caret.descending {
      bottom: -1px;
    }
  }
  position: relative;
  padding-bottom: 0;
  & .competitor-main {
    padding: 12px 16px;
    background-color: #fff;

    & .competitor-category {
      & .action-btn {
        & > div {
          margin-bottom: 12px;
          & .text {
            padding: 0;
            margin-left: 18px;
            color: var(--theme-color);
          }
        }
      }
      /deep/.el-table__body-wrapper {
        height: 300px !important;
      }
      /deep/.el-table__footer-wrapper {
        .el-table__footer tbody tr td.el-table__cell {
          background-color: #e9e9e9 !important;
          border-bottom: 0;
          color: var(--text-color);
          font-weight: 600;
        }
      }
    }
    & .competitor-export {
      border-top: 1px dashed #e3e8ec;
      padding-top: 12px;
      margin-top: 24px;
      min-height: calc(100vh - 500px);

      & .action-btn {
        display: flex;
        margin-bottom: 12px;
        //grid-gap: 30px;
      }
    }
  }
  & .competitor-form {
    background-color: #ffffff;
    display: flex;
    padding: 16px;
    margin-bottom: 10px;
  }
  /deep/.competitor-goods-info {
    display: flex;
    padding: 5px 12px;
    & .goods-image {
      width: 80px;
      height: 80px;
      border-radius: 2px;
      margin-right: 10px;
    }
    & .goods-info {
      font-size: 12px;
      flex: 1;
      & p {
        margin-top: 6px;
        color: var(--text-color);
        margin-bottom: 6px;
        line-height: 12px;
      }
    }
    .two-omit-item {
      margin-top: 0;
      font-size: 12px;
      height: 30px;
      line-height: 15px;
      display: -webkit-box;
      /*! autoprefixer: off */
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      cursor: pointer;
      a {
        color: var(--text-color);
        font-weight: 600;
        line-height: 15px;
        &:hover {
          color: var(--theme-color);
        }
      }
    }
  }
  .competitor-page {
    height: 60px;
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 100;
    width: calc(100vw);
    background-color: #fff;
    margin-right: 16px;
    padding-left: 210px;
    //padding: 15px 32px;
  }
}

/deep/.el-table--border::after,
.el-table--group::after,
.el-table::before {
  content: '';
  position: absolute;
  background-color: #ffffff;
  z-index: 1;
}
</style>
