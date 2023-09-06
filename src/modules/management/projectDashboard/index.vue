<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-management-project-dashboard-container {
  min-width: 1264px;
  .filter-field {
    display: flex;
    background-color: white;
    padding: 16px;
    .filter-item {
      margin-left: 18px;
      display: flex;
      align-items: center;
      width: 204px;
      flex-shrink: 0;
      &:first-of-type {
        margin-left: 0;
      }
      .label {
        flex-shrink: 0;
        font-size: var(--default-font-size);
        color: var(--text-second-color);
      }
    }
  }
  .table-field {
    margin-top: 10px;
    background: white;
    padding: 0 16px 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .tab-container {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e3e8ec;
      // padding: 0 16px 16px;
      .tab-right {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        .amount-unit {
          color: #5a5a5a;
          font-size: 12px;
          margin-right: 20px;
        }
        .budget-tag {
          font-size: var(--default-font-size);
          color: var(--text-second-color);
          display: inline-flex;
          align-items: center;
          margin-left: 12px;
          &::before {
            content: ' ';
            width: 8px;
            height: 8px;
            margin-right: 6px;
            background-color: #ffa8a7;
          }
        }
        .budget-tag.budget-tag-1::before {
          background-color: #ffa8a7;
        }
        .budget-tag.budget-tag-2::before {
          background-color: #9ce2f8;
        }
        .budget-tag.budget-tag-3::before {
          background-color: #a6dd90;
        }
        .budget-tag.budget-tag-4::before {
          background-color: #c7aaf3;
        }
        /deep/ .show-finished-box {
          font-size: var(--default-font-size);
          margin-left: 32px;
          .el-checkbox__input {
            line-height: 0;
            margin-top: -2px;
          }
          .el-checkbox__inner {
            width: 12px;
            height: 12px;
            &::after {
              height: 6px;
              width: 3px;
              top: 1px;
              left: 4px;
            }
          }
          .el-checkbox__label {
            font-size: var(--default-font-size);
            padding-left: 6px;
          }
        }
      }
    }
    .table-container {
      flex: 1;
      overflow: hidden;
    }
  }
  .pagination-field {
    background-color: white;
    padding: 0 18px;
    border-top: 1px solid #e3e8ec;
  }
  /deep/ .vxe-table {
    .vxe-header--row {
      .department-fund-statement-group-head-even,
      .department-fund-statement-head-even {
        background-color: #e7fcff !important;
      }
      .department-fund-statement-group-head-odd,
      .department-fund-statement-head-odd {
        background-color: #f0f5ff !important;
      }
      th > .vxe-cell .vxe-cell--sort {
        .vxe-sort--asc-btn,
        .vxe-sort--desc-btn {
          font-size: var(--default-font-size);
          overflow: hidden;
          &:not(.sort--active, :hover) {
            color: #a4b2c2;
          }
        }
        .vxe-sort--asc-btn {
          top: 0;
          &::before {
            bottom: 3px;
          }
        }
        .vxe-sort--desc-btn {
          bottom: 0;
          &::before {
            top: 3px;
          }
        }
      }
    }
    .vxe-body--column.col--ellipsis,
    .vxe-footer--column.col--ellipsis,
    .vxe-header--column.col--ellipsis,
    &.vxe-editable .vxe-body--column {
      height: auto;
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
    .vxe-footer--row {
      .vxe-footer--column {
        height: 31px !important;
        font-size: var(--default-font-size) !important;
        padding: 5px 0;
        background-color: #f5f7fa;
        & .vxe-cell--item {
          color: var(--text-color);
        }
      }
    }
    .vxe-table--header thead {
      .vxe-header--row {
        &:first-of-type {
          .vxe-header--column {
            & .vxe-cell {
              .vxe-cell--title {
                flex: 1;
              }
            }
          }
        }
      }
    }
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
}
</style>
