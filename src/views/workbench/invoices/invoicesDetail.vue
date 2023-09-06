<!--
 * @Author: 肖槿
 * @Date: 2021-08-18 14:27:53
 * @Description: 开票详情
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-01-21 14:24:13
 * @FilePath: \goumee-star-frontend\src\views\workbench\invoices\invoicesDetail.vue
-->
<script src="./invoicesDetail.tsx"></script>
<style lang="less">
.new-invoice-detail-dialog {
  & .new-invoice-detail {
    background: #f6f6f6;
    display: flex;
    height: 510px;
    overflow-y: auto;
    & .invoice-detail,
    & .invoice-press {
      height: 100%;
      font-size: 12px;
    }
    & .invoice-detail {
      background-color: #fff;
      margin-right: 12px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    & .line2 {
      width: 676px;
      height: 1px;
      background-color: #e3e8ec;
      margin-top: -12px;
      left: 0;
    }
    & .invoice-detail-info {
      width: 676px;
      display: flex;
      padding: 18px 16px;
      flex-wrap: wrap;
      align-content: flex-start;

      & .detail-row {
        display: flex;
        margin: 0 18px 12px 0;
        position: relative;
        line-height: 18px;
        font-size: 12px;
        &.row {
          width: 100%;
          & .value {
            width: 500px;
          }
        }
        & .label {
          width: 103px;
          text-align: right;
          color: var(--text-third-color);
        }
        & .value {
          width: 180px;
          color: var(--text-color);
          &.block {
            width: 542px;
          }
        }
        & .load {
          display: flex;
          width: 542px;
          flex-direction: column;
          & .value {
            width: 100%;
            color: var(--theme-color);
            margin-bottom: 6px;
            cursor: pointer;
            & .icon {
              font-size: 16px;
              margin-right: 5px;
            }
          }
        }
        & .contract-status {
          font-size: 12px;
          border-radius: 10px;
          height: 20px;
          line-height: 18px;
          padding: 0px 6px 1px 6px;
          position: absolute;
          right: -60px;
          top: -1px;
          -webkit-backface-visibility: hidden;
          -moz-backface-visibility: hidden;
        }
        & .status-1 {
          border: 1px solid rgba(var(--warning-rgb-color), 0.8);
          background: rgba(var(--warning-rgb-color), 0.1);
          color: var(--warning-color);
        }
        & .status-2 {
          border: 1px solid rgba(var(--success-rgb-color), 0.6);
          background: rgba(var(--success-rgb-color), 0.1);
          color: var(--success-color);
        }
        & .status-3 {
          border: 1px solid rgba(var(--error-rgb-color), 0.8);
          background: rgba(var(--error-rgb-color), 0.1);
          color: var(--error-color);
        }
        & .status-4 {
          border: 1px solid #c9d0d6;
          background: rgba(60, 82, 105, 0.08);
          color: var(--fail-color);
        }
      }
      & .line {
        width: 676px;
        height: 1px;
        background-color: #e3e8ec;
        margin-top: 6px;
        left: 0;
      }
    }
    & .invoice-detail-table {
      border: 1px solid #e3e8ec;
      margin: -12px 18px 0 18px;
      border-right: 0 !important;
      & .table-body-tr,
      & .detail-table-head {
        display: flex;
        & .table-body-td,
        & .table-head-td {
          flex: 1;
          padding: 7px 12px;
          color: var(--text-color);
          background: rgba(164, 178, 194, 0.1);
          border-right: 1px solid #e3e8ec;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          /* &:last-child {
            border-right: 0;
          }*/
        }
        & .table-head-td {
          font-weight: 600;
        }
        & .table-body-td {
          background-color: #fff;
        }
      }
      & .table-body-tr {
        border-top: 1px solid #e3e8ec;
      }
      & .text-r {
        text-align: right;
      }
    }
    & .invoice-press {
      width: 260px;
      background-color: #fff;
      padding: 18px;
      overflow-y: auto;

      & .title {
        font-size: 14px;
        color: var(--text-color);
        font-weight: 600;
        margin: 0 0 26px 0;
      }
    }
  }
}
</style>
