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
      .budget-filter-form-item:nth-child(2) {
        .el-form-item {
          width: 254px;
        }
      }
      .budget-filter-form-item:last-child {
        .el-form-item {
          width: 130px;
        }
      }
    }
  }

  .budget-background-card {
    background: white;
    .budget-btns {
      display: flex;
      justify-content: space-between;
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
    padding-bottom: 32px;
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
    .el-table__footer-wrapper .el-table__footer tbody tr td.el-table__cell .cell {
      font-weight: 600;
      text-align: right;
      padding: 0 10px !important;
    }
  }

  & .el-table__body-wrapper {
    border-left: 1px solid var(--table-border-color) !important;
    border-right: 1px solid var(--table-border-color) !important;
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
}
</style>
