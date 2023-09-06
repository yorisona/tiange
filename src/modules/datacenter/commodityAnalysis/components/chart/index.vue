<!--
 * @Author: 肖槿
 * @Date: 2021-12-03 09:49:26
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-03-02 16:44:14
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\commodityAnalysis\components\chart\index.vue
-->
<script src="./index.tsx"></script>
<style lang="less" scoped>
.commodity-analysis-chart {
  min-width: 1440px;
  color: var(--text-color);
  .analysis-pie-chart {
    display: flex;
    justify-content: space-between;
    background: #fff;
    padding: 0 18px 18px 18px;
    overflow-x: auto;
    & .category-pie {
      margin-right: 18px;
      position: relative;
    }
    .category-pie,
    .pirce-pie {
      position: relative;
      flex: 1;
      h6 {
        font-weight: 600;
        font-size: 14px;
        line-height: 18px;
        margin: 0;
        position: absolute;
        top: 18px;
        left: 18px;
        display: flex;
        width: calc(100% - 36px);
        justify-content: space-between;
        z-index: 100;
        & .icon-row {
          display: flex;
          align-items: center;
          grid-gap: 10px;
        }
        & .icon {
          font-size: 16px;
          cursor: pointer;
          color: var(--text-third-color);
          &.active,
          &:hover {
            color: var(--theme-color);
          }
        }
        & .line {
          display: inline-block;
          width: 1px;
          height: 15px;
          background: #e3e8ec;
        }
      }
      .table-main {
        height: 300px;
        border: 1px solid #f0f0f0;
        border-radius: 4px;
        padding: 0 18px;
        /deep/.table {
          display: inline-block;
          width: calc(50% - 6px);
          margin-top: 50px;
          .el-table__header th,
          .el-table__row td {
            padding: 8px 11px;
            font-size: 12px !important;
            & .cell {
              padding: 0;
            }
          }
          &:first-child {
            margin-right: 12px;
          }
        }
      }
      .pie-main {
        height: 300px;
        border: 1px solid #f0f0f0;
        border-radius: 4px;
        display: flex;
        column-gap: 18px;
        justify-content: space-between;
        padding: 0 18px;
        .pie {
          flex: 1;
          display: inline-block;
          padding: 0 18px 18px 18px;
        }
      }
      .hide {
        display: none;
      }
    }
  }
  .analysi-table {
    display: flex;
    justify-content: space-between;
    grid-gap: 12px;
    height: 610px;
    margin-top: 12px;
    overflow-x: auto;

    & .best-sale-goods,
    & .sale-goods-rate,
    & .unsale-goods {
      background: #fff;
      border-radius: 2px;
      height: 610px;
    }
    & .best-sale-goods {
      width: 386px;
    }
    & .sale-goods-rate {
      flex: 1;
      padding: 18px;
      & h2.title {
        font-weight: 600;
        font-size: 14px;
        margin: 0 0 18px 0;
      }
    }
    & .unsale-goods {
      width: 386px;
    }
  }
  .sale-info-table {
    background: #fff;
    margin-top: 12px;
    padding: 18px;
    /deep/ .el-table .caret-wrapper {
      height: 20px;
      .sort-caret.ascending {
        top: -1px;
      }
      .sort-caret.descending {
        bottom: -1px;
      }
    }
    & > h2 {
      margin: 0;
      text-align: center;
      font-weight: 600;
      margin-bottom: 16px;
      font-size: 16px;
    }
  }
}
</style>
<style lang="less">
@import './table.less';
</style>
