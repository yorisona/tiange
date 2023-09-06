<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-03-14 16:52:32
-->
<script src="./index.tsx"></script>

<style lang="less">
.form-item-project {
  .el-input-group__prepend {
    background-color: #ffffff !important;
    color: var(--text-color);
  }
}
.daily-cost-container {
  background: transparent;
  overflow: overlay;

  .daily-cost-filter-form {
    min-width: 1052px;
    .daily-cost-filter-form-div {
      display: grid;
      grid-template-columns: 314px repeat(auto-fit, minmax(222px, 314px));
    }

    .daily-cost-filter-form-item {
      // .el-input {
      // width: 164px;
      // }
      .el-input-group--prepend .el-input-group__prepend {
        background-color: #fff;
        width: 88px;
        .el-input .el-input__inner {
          border-color: transparent;
        }
      }
      .el-date-editor {
        .el-range-input {
          width: 44%;
        }
        .el-range-separator {
          width: 12%;
          min-width: 20px;
        }
        // .el-range__close-icon {
        //     display: none;
        // }
      }
    }
  }
  .daily-cost-background-card {
    background: white;
  }
  .el-table {
    thead > tr > th,
    tbody > tr > td {
      border-right: 1px solid var(--table-border-color);
      border-bottom: 1px solid var(--table-border-color);
    }
    thead > tr > th {
      padding-top: 6px;
      padding-bottom: 6px;
      font-size: 12px;
    }
  }
  & .el-table__body-wrapper {
    border-left: 1px solid var(--table-border-color) !important;
    border-right: 1px solid var(--table-border-color) !important;
    & td {
      padding-top: 6px !important;
      padding-bottom: 6px !important;
      font-size: 12px !important;
      & .cell {
        padding-left: 12px !important;
        padding-right: 12px !important;
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
}
</style>
