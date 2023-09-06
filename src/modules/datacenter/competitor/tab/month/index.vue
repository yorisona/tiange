<script src="./index.tsx"></script>
<style lang="less" scoped>
.data-center-competitor {
  // /deep/ .el-table__body tr {
  //   &:hover > td.el-table__cell {
  //     background-color: var(--table-current-row-bg-color);
  //   }
  //   &.current-row {
  //     background: var(--table-focus-row-bg-color);
  //     &:hover > td.el-table__cell {
  //       background-color: var(--table-focus-row-bg-color);
  //     }
  //   }
  // }
  // /deep/ .el-table .caret-wrapper {
  //   height: 20px;
  //   .sort-caret.ascending {
  //     top: -1px;
  //   }
  //   .sort-caret.descending {
  //     bottom: -1px;
  //   }
  // }
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
      // /deep/.el-table__body-wrapper {
      //   height: 300px !important;
      // }
      // /deep/.el-table__footer-wrapper {
      //   .el-table__footer tbody tr td.el-table__cell {
      //     background-color: #e9e9e9 !important;
      //     border-bottom: 0;
      //     color: var(--text-color);
      //     font-weight: 600;
      //   }
      // }
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
}

// /deep/.el-table--border::after,
// .el-table--group::after,
// .el-table::before {
//   content: '';
//   position: absolute;
//   background-color: #ffffff;
//   z-index: 1;
// }
.content-field {
  background: white;
  padding: 16px 16px 40px;
  flex: 1;
  overflow: overlay;
}
.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: var(--small-font-size);
  &::before {
    content: '';
    width: 3px;
    height: 14px;
    background: var(--theme-color);
    border-radius: 1px;
    display: inline-block;
    margin-right: 4px;
  }
}
.sort-item {
  display: inline-block;
  height: 20px;
  margin-top: 4px;
  margin-right: 8px;
  padding: 0 5px;
  color: var(--text-second-color);
  cursor: pointer;
  border-radius: 2px;
  border: 1px solid rgba(152, 167, 186, 0.3);
  margin-bottom: 6px;
  &.actived,
  &:hover {
    background: var(--theme-color);
    color: #fff;
  }
}
.top10-month {
  font-size: 14px;
  font-weight: 600;
  padding: 18px 0 8px 0;
}
/deep/ .vxe-table-style {
  .vxe-body--row {
    &.vxe-table-row-customer {
      cursor: pointer;
    }
  }
  .vxe-body--column {
    &.actived {
      background: var(--table-focus-row-bg-color);
    }
  }
  .vxe-header--row {
    .group-head-even,
    .head-even {
      background-color: #e7fcff !important;
    }
    .group-head-odd,
    .head-odd {
      background-color: #f0f5ff !important;
    }
  }
  .vxe-body--row {
    .vxe-body--column {
      height: 31px !important;
      font-size: 12px !important;
      & .vxe-cell--label {
        color: var(--text-color);
      }
    }
  }
  .vxe-footer--row {
    .vxe-footer--column {
      height: 31px !important;
      font-size: 12px !important;
      padding: 5px 0;
      background-color: #f5f7fa;
      & .vxe-cell--item {
        color: var(--text-color);
      }
    }
  }
  .vxe-header--column {
    padding-top: 5px !important;
    padding-bottom: 5px !important;
    & .vxe-cell {
      font-size: 12px;
      color: var(--text-color);
    }
  }
}
/deep/ .el-table {
  .item-image {
    display: flex;
    justify-content: center;
  }
  .item-id {
    text-align: left;
  }
  .item-title {
    cursor: pointer;
    text-align: left;
    &:hover {
      color: var(--theme-color);
    }
  }
}
</style>
