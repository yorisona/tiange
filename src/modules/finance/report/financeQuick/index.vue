<!--
 * @Author: 肖槿
 * @Date: 2021-12-14 17:18:54
 * @Description: 收支明细
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-12-22 16:32:10
 * @FilePath: \goumee-star-frontend\src\modules\finance\report\financeQuick\index.vue
-->
<script lang="ts" src="./index.tsx"></script>
<style lang="less" scoped>
.finance-details {
  background: #f6f6f6;
  .finance-report-main {
    height: calc(100vh - 164px);
  }
  .finance-report-table {
    margin-top: 12px;
    height: calc(100vh - 255px);
  }
}
</style>
<style lang="less">
.finance-details {
  .is-group.has-gutter {
    & > tr:first-child {
      .project-info-head {
        background: rgba(164, 178, 194, 0.1) !important;
      }
      .project-sum-head {
        background: #fef8ed !important;
      }
      .project-income-head {
        background: #eff4fd !important;
      }
      .project-receive-head {
        background: #e9f9fc !important;
      }
      .project-receipt-head {
        background: #f0f8f3 !important;
      }
      .project-cost-head {
        background: #fef3e7 !important;
      }
      .project-payment-head {
        background: #fdf9df !important;
      }
      .project-purchase-head {
        background: #fef4f0 !important;
      }
    }
  }
  .project-info-head {
    &.is-leaf {
      background: rgba(164, 178, 194, 0.1) !important;
    }
    & div {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      widows: 100%;
    }
  }
  .project-sum-head {
    &.is-leaf {
      background: #fef8ed !important;
    }
    & div {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      widows: 100%;
    }
  }
  .project-income-head {
    &.is-leaf {
      background: #eff4fd !important;
    }
  }
  .project-receive-head {
    &.is-leaf {
      background: #e9f9fc !important;
    }
  }
  .project-receipt-head {
    &.is-leaf {
      background: #f0f8f3 !important;
    }
  }
  .project-cost-head {
    &.is-leaf {
      background: #fef3e7 !important;
    }
  }
  .project-payment-head {
    &.is-leaf {
      background: #fdf9df !important;
    }
  }
  .project-purchase-head {
    &.is-leaf {
      background: #fef4f0 !important;
    }
  }

  .el-table {
    thead > tr > th,
    tbody > tr > td {
      border-right: 1px solid var(--table-border-color);
      border-bottom: 1px solid var(--table-border-color);
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
  .vxe-header--column {
    padding-top: 5px !important;
    padding-bottom: 5px !important;
    & .vxe-cell {
      font-size: 12px;
    }
  }
}
</style>
