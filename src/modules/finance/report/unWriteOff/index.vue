<!--
 * @Author: 肖槿
 * @Date: 2021-12-14 17:18:54
 * @Description: 收支明细
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-03-15 13:59:18
 * @FilePath: \goumee-star-frontend\src\modules\finance\report\unWriteOff\index.vue
-->
<script lang="ts" src="./index.tsx"></script>
<style lang="less">
.report-un-write-off {
  background: #fff;
  margin-top: 12px;
  padding: 18px 18px 0 18px;
  .tabs-box {
    flex: 1;
    overflow: hidden;
  }
  & .precharge-table {
    height: calc(100vh - 300px);
    overflow-y: auto;
    width: 100%;
  }
  & .pagination {
    padding: 8px 18px;
  }
  .el-table {
    .invoiceImageView {
      width: 16px;
      height: 16px;
      cursor: pointer;
      color: #6a7b92;
    }
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
        padding-left: 8px !important;
        padding-right: 8px !important;
      }
    }
  }
  & .el-table__header-wrapper {
    border-top: 1px solid var(--table-border-color) !important;
    border-left: 1px solid var(--table-border-color) !important;
  }
  .project-income-head {
    & div {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      widows: 100%;
    }
  }
  .el-table--border,
  .el-table--group {
    border: none;
  }
}
.finance-invoice-status-popper {
  cursor: pointer;
  border: none;
  box-shadow: 0 1px 10px 0 rgba(47, 56, 72, 0.12);

  .finance-invoice-popper-header {
    display: flex;
    // width: 531px;

    div {
      padding: 0 12px;
      font-size: var(--default-font-size);
      color: var(--text-color);
      font-weight: 600;
      // flex: 1;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: var(--table-thead-th-bg-color);
      border-top: 1px solid var(--table-border-color);
      border-left: 1px solid var(--table-border-color);
      border-bottom: 1px solid var(--table-border-color);
    }
  }
  .finance-invoice-popper-row {
    display: flex;
    // width: 531px;
    div {
      // flex: 1;
      padding: 0 12px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      border-left: 1px solid var(--table-border-color);
      border-bottom: 1px solid var(--table-border-color);
    }
  }
}
</style>
