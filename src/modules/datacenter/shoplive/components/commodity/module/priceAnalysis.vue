<!--
 * @Author       : yunie
 * @Date         : 2022-07-19 13:04:59
 * @LastEditTime : 2022-07-25 16:32:36
 * @FilePath     : \src\modules\datacenter\shoplive\components\commodity\module\priceAnalysis.vue
 * @Description  :
-->
<script src="./priceAnalysis.tsx"></script>
<style lang="less" scoped>
.main-item-title {
  margin: 0 0 12px 0;
  line-height: 1;
  color: var(--text-color);
  font-weight: 400;
  font-size: 14px;
}
.pirce-pie {
  flex: 1;
  position: relative;
  // width: 49%;
  // padding: 0 18px;
  .table-main {
    flex: auto;
    ::-webkit-scrollbar {
      /* width: 6px;
      height: 6px; // 纵向滚动条 必写*/
      cursor: pointer;
    }
    /deep/.table {
      display: inline-block;
      width: calc(100% - 5px);
      .el-table__header th,
      .el-table__row td {
        padding: 8px 11px;
        font-size: 12px !important;
        & .cell {
          padding: 0;
        }
      }
      /*   &:first-child {
        margin-right: 12px;
      }*/
    }
  }
  .pie-main {
    display: flex;
    column-gap: 18px;
    justify-content: center;
    .pie {
      width: 580px;
      margin: 0 auto;
      display: inline-block;
    }
  }
  .hide {
    display: none;
  }
}
</style>
