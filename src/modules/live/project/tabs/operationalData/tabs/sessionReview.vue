<script src="./sessionReview.tsx"></script>
<style lang="less" scoped>
.sessionReview-wrap {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  .sessionReview {
    flex: 1;
    overflow: overlay;
  }
  .bar {
    background-color: #f6f6f6;
    height: 12px;
    width: 100%;
    flex-shrink: 0;
  }
  .date-wrap {
    height: 60px;
    margin-top: 54px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    flex-shrink: 0;
    .date-box {
      display: flex;
      align-items: center;
      width: 100%;
      /deep/.el-input--suffix .el-input__inner {
        padding-right: 0px !important;
      }
      .updata-date {
        font-size: 12px;
        color: #888888;
        margin-left: 32px;
      }
      .btn-box {
        margin-left: auto;
      }
    }
  }
  .container {
    padding: 0 16px 17px;
    // flex: 1 1 0;
    flex: 1;
    overflow: hidden;
  }
  /deep/.header-warp {
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // height: 40px;
    // line-height: 40px;
    padding: 0 12px;
    text-align: left;
    // .ellipsis {
    //   display: -webkit-box;
    //   -webkit-line-clamp: 2;
    //   -webkit-box-orient: vertical;
    //   overflow: hidden;
    //   text-overflow: ellipsis;
    // }
    .item {
      // display: -webkit-box;
      // -webkit-line-clamp: 2;
      // -webkit-box-orient: vertical;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: normal;
      // -webkit-box-orient: horizontal;
      // -webkit-box-align: center;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .text {
        // overflow: hidden;
        // // height: 3em;
        // width: 100%;
        // -webkit-box-flex: 1;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        line-height: 16px;
        // display: flex;
        // flex-direction: column;
      }
    }
    .tag-add {
      width: 20px;
      height: 20px;
      line-height: 20px;
      background: #e4eeff;
      border-radius: 50%;
      color: #2877ff;
      text-align: center;
      display: inline-block;
    }
  }
  /deep/.el-table {
    // 第一行tr
    tr:first-child {
      background: #f6f6f6;
      color: var(--text-color);
      font-weight: 600;
      td {
        &:first-child {
          .cell {
            padding: 0 10px;
          }
        }
      }
      .cell {
        padding: 0;
      }
    }
  }
}
.p-align-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
/deep/ .vxe-table {
  // .vxe-header--row {
  //   .department-fund-statement-group-head-even,
  //   .department-fund-statement-head-even {
  //     background-color: #e7fcff !important;
  //   }
  //   .department-fund-statement-group-head-odd,
  //   .department-fund-statement-head-odd {
  //     background-color: #f0f5ff !important;
  //   }
  // }
  .vxe-table--body-wrapper {
    overflow-y: overlay;
  }
  tr:first-child {
    background: #f6f6f6;
    color: var(--text-color);
    font-weight: 600;
    height: 52px;
    position: sticky;
    top: 0;
    z-index: 1;
    .header-warp {
      padding: 0;
    }
    td {
      &:first-child {
        .cell {
          padding: 0 10px;
        }
      }
    }
    .cell {
      padding: 0;
    }
  }
  // 第二行tr
  tr:nth-child(2) {
    height: 39px;
    // &:hover {
    //   background: #f6f6f6;
    // }
  }
  // 最后一行tr
  // tr {
  //   td {
  //     &:last-child {
  //       padding-right: 7px;
  //     }
  //   }
  // }
  .vxe-body--column.col--ellipsis,
  .vxe-footer--column.col--ellipsis,
  .vxe-header--column.col--ellipsis,
  &.vxe-editable .vxe-body--column {
    // height: auto;
  }
  .vxe-body--row {
    .vxe-body--column {
      height: 31px !important;
      font-size: var(--default-font-size) !important;
      .vxe-cell {
        width: 100% !important;
      }
      & .vxe-cell--label {
        color: var(--text-color);
      }
    }
  }
  // .vxe-table--header thead {
  //   .vxe-header--row {
  //     &:first-of-type {
  //       .vxe-header--column {
  //         & .vxe-cell {
  //           .vxe-cell--title {
  //             flex: 1;
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  .vxe-header--column {
    padding-top: 5px !important;
    padding-bottom: 5px !important;
    & .vxe-cell {
      font-size: var(--default-font-size);
      color: var(--text-color);
      // .vxe-cell--title {
      //   flex: 1;
      // }
    }
  }
  .vxe-table--fixed-wrapper {
    .vxe-table--footer-wrapper.fixed-left--wrapper .vxe-table--footer tfoot .vxe-footer--row td {
      font-weight: 600;
      &:first-of-type {
        .vxe-cell {
          display: flex;
          justify-content: center;
        }
      }
    }
  }
  .vxe-table--render-wrapper {
    .vxe-table--footer-wrapper.body--wrapper .vxe-table--footer tfoot .vxe-footer--row td {
      .vxe-cell {
        font-weight: 600;
        display: flex;
        justify-content: flex-end;
      }
      &:first-of-type {
        .vxe-cell {
          display: flex;
          justify-content: center;
        }
      }
    }
  }
}
</style>
