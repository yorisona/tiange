<!--
 * @Author: 肖槿
 * @Date: 2021-12-14 17:18:54
 * @Description: 收支明细
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-12-22 15:14:11
 * @FilePath: \goumee-star-frontend\src\modules\finance\report\financePrepay\index.vue
-->
<script lang="ts" src="./index.tsx"></script>
<style lang="less">
.finance-precharge {
  background: #fff;
  margin-top: 10px;
  padding: 16px 16px 2px 16px;
  & .precharge-table {
    height: calc(100vh - 252px);
    width: 100%;
    overflow-y: auto;
  }
  .el-table {
    thead > tr > th,
    tbody > tr > td {
      border-right: 1px solid var(--table-border-color);
      border-bottom: 1px solid var(--table-border-color);
    }
    &::before {
      display: none;
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
</style>
