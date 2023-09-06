<!--
 * @Author       : yunie
 * @Date         : 2022-07-19 16:46:12
 * @LastEditTime : 2022-07-25 17:50:39
 * @FilePath     : \src\modules\datacenter\shoplive\components\launchnchor\index.vue
 * @Description  :
-->
<script src="./index.tsx"></script>
<style lang="less" scoped>
.main-box {
  width: 100%;
  // height: 100%;
  background-color: #fff;
  position: relative;
  border: 1px solid rgb(209, 216, 224);
  border-radius: 4px;
  margin-top: 18px;
  padding: 18px;
  .main-item-title {
    margin: 0 0 12px 0;
    line-height: 1;
    color: var(--text-color);
    font-weight: 400;
    font-size: 14px;
  }
  .sale-box {
    display: flex;
    justify-content: space-between;
    // column-gap: 18px;
    .lt {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 18px;
    }
    .rt {
      flex: 2;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .pagination {
    display: flex;
    //padding: 0px 8px 0px 12px;
    height: 50px;
    align-items: center;
    .el-pagination {
      flex: 1;
      margin: 0 !important;
    }
  }
}
</style>
