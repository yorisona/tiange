<!--
 * @Author: 肖槿
 * @Date: 2021-11-08 16:47:54
 * @Description: 模特管理
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-11-12 15:55:27
 * @FilePath: \goumee-star-frontend\src\modules\supplier\modelManage\index.vue
-->
<script src="./index.tsx"></script>
<style lang="less" scoped>
.supplier-model-manage {
  height: 100%;
  display: flex;
  flex-direction: column;
  & .model-addbtn {
    justify-content: space-between;
    background: #fff;
    padding: 12px 18px;
  }
  .table-box.table-model {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .table-box.display-picture {
    flex: 1;
    display: flex;
    padding: 0 18px;
    column-gap: 18px;
    flex-wrap: wrap;
    row-gap: 18px;
    align-content: baseline;
    overflow-y: auto;
  }
  & .empty-model {
    text-align: center;
    margin: 0 auto;
  }
}
</style>
