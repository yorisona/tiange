<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-04-21 17:52:00
-->
<script src="./index.tsx"></script>

<style lang="less">
@charset 'utf-8';

.s2b2c-display-data-page-container {
  @table_header_primary_color: #e7fcff;
  @table_header_second_color: #f0f5ff;

  height: 100%;
  .vxe-header--row {
    .base-info-head {
      // background-color: rgba(164, 178, 194, 0.1) !important;
      background-color: @table_header_primary_color !important;
      &.is-leaf {
        // background-color: rgba(164, 178, 194, 0.1) !important;
        background-color: @table_header_primary_color !important;
      }
      & div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        widows: 100%;
      }
    }
    .data-screen-head {
      // background-color: #fef8ed !important;
      background-color: @table_header_second_color !important;
      &.is-leaf {
        // background-color: #fef8ed !important;
        background-color: @table_header_second_color !important;
      }
      & div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        widows: 100%;
      }
    }
    .flow-target-head {
      // background-color: #eff4fd !important;
      background-color: @table_header_primary_color !important;
      &.is-leaf {
        // background-color: #eff4fd !important;
        background-color: @table_header_primary_color !important;
      }
    }
    .interactive-target-head {
      // background-color: #e9f9fc !important;
      background-color: @table_header_second_color !important;
      &.is-leaf {
        // background-color: #e9f9fc !important;
        background-color: @table_header_second_color !important;
      }
    }
    .product-target-head {
      // background-color: #f0f8f3 !important;
      background-color: @table_header_primary_color !important;
      &.is-leaf {
        // background-color: #f0f8f3 !important;
        background-color: @table_header_primary_color !important;
      }
    }
    .trade-target-head {
      // background-color: #fef3e7 !important;
      background-color: @table_header_second_color !important;
      &.is-leaf {
        // background-color: #fef3e7 !important;
        background-color: @table_header_second_color !important;
      }
    }
    .viewer-head {
      // background-color: #fdf9df !important;
      background-color: @table_header_primary_color !important;
      &.is-leaf {
        // background-color: #fdf9df !important;
        background-color: @table_header_primary_color !important;
      }
    }
    .deal-head {
      // background-color: #fef4f0 !important;
      background-color: @table_header_second_color !important;
      &.is-leaf {
        // background-color: #fef4f0 !important;
        background-color: @table_header_second_color !important;
      }
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
        // color: var(--text-color);
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
      // color: var(--text-second-color);
    }
  }
  .vxe-table--body-wrapper,
  .vxe-table--fixed-left-body-wrapper,
  .vxe-table--fixed-right-body-wrapper {
    overflow: auto;
  }
}
</style>
