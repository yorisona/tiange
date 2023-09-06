<!--
 * @Author: 肖槿
 * @Date: 2021-12-14 17:18:54
 * @Description: 收支明细
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-25 15:22:45
 * @FilePath: \goumee-star-frontend\src\modules\finance\report\financeDetails\index.vue
-->
<script lang="ts" src="./index.tsx"></script>
<style lang="less" scoped>
.finance-details {
  background-color: #f6f6f6;
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
  .vxe-header--row {
    .project-info-head {
      background-color: #e7fcff !important;
    }
    .project-sum-head {
      background-color: #f0f5ff !important;
    }
    .project-income-head {
      background-color: #e7fcff !important;
    }
    .project-receive-head {
      background-color: #f0f5ff !important;
    }
    .project-receipt-head {
      background-color: #e7fcff !important;
    }
    .project-cost-head {
      &.reserve {
        background-color: #e7fcff !important;
      }
      background-color: #f0f5ff !important;
    }
    .project-payment-head {
      &.reserve {
        background-color: #f0f5ff !important;
      }
      background-color: #e7fcff !important;
    }
    .project-purchase-head {
      &.reserve {
        background-color: #e7fcff !important;
      }
      background-color: #f0f5ff !important;
    }
  }
  .project-info-head {
    &.is-leaf {
      background-color: rgba(164, 178, 194, 0.1) !important;
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
      background-color: #fef8ed !important;
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
      background-color: #eff4fd !important;
    }
  }
  .project-receive-head {
    &.is-leaf {
      background-color: #e9f9fc !important;
    }
  }
  .project-receipt-head {
    &.is-leaf {
      background-color: #e7fcff !important;
    }
  }
  .project-cost-head {
    &.is-leaf {
      background-color: #f0f5ff !important;
    }
    &.reserve.is-leaf {
      background-color: #e7fcff !important;
    }
  }
  .project-payment-head {
    &.is-leaf {
      background-color: #e7fcff !important;
    }
    &.reserve.is-leaf {
      background-color: #f0f5ff !important;
    }
  }
  .project-purchase-head {
    &.is-leaf {
      background-color: #f0f5ff !important;
    }
    &.reserve.is-leaf {
      background-color: #e7fcff !important;
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
      color: var(--text-color);
    }
  }
}
</style>
