<script src="./index.tsx"></script>

<style lang="less">
.budget-container {
  background: transparent;
  overflow: auto;
  overflow: overlay;

  .budget-filter-form {
    .budget-filter-form-div {
      display: flex;
      flex-wrap: wrap;

      .el-form-item {
        width: 204px;
      }
      .budget-filter-form-item:last-child {
        .el-form-item {
          width: 130px;
        }
      }
      .budget-filter-form-item:nth-child(2) {
        .el-form-item {
          width: 254px;
        }
      }
    }
  }

  .budget-background-card {
    background: white;
    .budget-operator {
      display: flex;
      align-items: center;
    }
    .budget-btns {
      display: flex;
      justify-content: space-between;
      .el-checkbox {
        margin: 0 8px 0 26px;
        .el-checkbox__input {
          line-height: 14px;
        }
        &.is-checked .el-switch__core {
          border-color: #409eff;
          background-color: #409eff;
        }
      }
      span {
        display: inline-block;
        line-height: 28px;
        font-size: 12px;
      }
      .tg-btn-default {
        width: 60px;
      }
      .label {
        color: var(--text-third-color);
        font-size: 12px;
        line-height: 28px;
        margin-right: 24px;
        .wan-span {
          color: var(--warning-color);
          font-weight: 600;
        }
      }
    }
  }

  .el-table {
    tbody > tr > td {
      padding: 0 !important;
      font-size: 12px !important;
      border-right: 1px solid var(--table-border-color);
      border-bottom: 1px solid var(--table-border-color);
      line-height: 16px;
      .cell {
        padding: 0 !important;
      }
      &.is-left {
        padding: 6px 0 !important;
        .cell.el-tooltip {
          min-height: 20px;
          padding: 0 10px !important;
        }
      }
      &.is-center {
        border-right: 1px solid var(--table-border-color);
      }
    }
    thead > tr > th {
      border-right: 1px solid var(--table-border-color);
      border-bottom: 1px solid var(--table-border-color);
      padding-top: 6px;
      padding-bottom: 6px;
      font-size: 12px;

      .cell {
        min-height: 16px;
        line-height: 16px;
        visibility: visible;
        white-space: pre-line;
      }

      &.department-fund-statement-head-even {
        background-color: #e7fcff !important;
      }

      &.department-fund-statement-head-odd {
        background-color: #f0f5ff !important;
      }
    }
  }

  & .el-table__body-wrapper {
    border-left: 1px solid var(--table-border-color) !important;
    border-right: 1px solid var(--table-border-color) !important;
    tr {
      &:hover,
      &.hover-row {
        > td {
          background: var(--table-current-row-bg-color);

          .no-default {
            background: var(--table-current-row-bg-color);
          }
        }
      }
    }
    & td {
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      font-size: 12px !important;
      .el-input-div {
        padding: 0 !important;
        .el-input {
          .el-input__inner {
            padding: 0 10px;
            background: transparent;
            border-width: 0;
            text-align: right;
            line-height: 30px;
            height: 30px;
            &:focus {
              background: white;
              border-width: 1px;
            }
          }
        }
      }
      /*.before {
        border: 1px solid var(--warning-color);
        //background: #fbeddd;
      }*/
      .no-default {
        background: #ebf3f95e;
        width: 100%;
        height: 32px;
        line-height: 32px;
        padding: 0 10px;
      }
      .information-div {
        width: 100%;
        height: 32px;
        line-height: 32px;
        padding: 0 10px;
        text-align: right;
      }
      & .cell {
        padding-left: 10px !important;
        padding-right: 10px !important;
      }
    }
  }

  & .el-table__header-wrapper {
    border-top: 1px solid var(--table-border-color) !important;
    border-left: 1px solid var(--table-border-color) !important;
  }
  .el-table--border,
  .el-table--group {
    border: none;
  }
  .el-table__fixed {
    border-left: 1px solid var(--table-border-color);
    border-top: 1px solid var(--table-border-color);
    border-right: none;
    overflow-x: hidden;
    overflow-y: hidden;
  }
  // 清除固定列右侧边框线
  .el-table--border .el-table__cell:last-child {
    border-right: none !important;
  }
  .el-table__fixed-footer-wrapper tbody td.el-table__cell {
    background: #f5f7fa !important;
    &:first-child,
    &:nth-child(2) {
      border-right: 0 solid var(--table-border-color);
    }
    &:nth-child(2) .cell {
      margin-left: 30px;
    }
  }
  .el-table__footer-wrapper {
    .el-table__footer {
      tbody {
        tr td.el-table__cell {
          .cell {
            font-weight: 600;
            text-align: right;
            padding: 0 10px !important;
          }
          background: #f5f7fa !important;
          &:first-child,
          &:nth-child(2) {
            border-right: 0 solid var(--table-border-color);
          }
          &:nth-child(2) .cell {
            margin-left: 30px;
          }
        }
      }
    }
  }
}
</style>
