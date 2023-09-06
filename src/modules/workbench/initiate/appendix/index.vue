<!--
 * @Author: 肖槿
 * @Date: 2021-08-21 10:23:30
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-08-23 11:39:36
 * @FilePath: \goumee-star-frontend\src\modules\workbench\initiate\appendix\index.vue
-->
<script src="./index.tsx"></script>
<style lang="less" scoped>
.case-item {
  display: flex;
  font-size: 12px;
  margin-bottom: 4px;
  .case-icon {
    font-size: 16px;
    margin-top: 2px;
  }
  .case-name {
    color: var(--text-color);
    max-width: 450px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 6px;

    /*  &:hover {
      color: var(--theme-color);
    }*/
  }
  .case-down {
    margin-left: 12px;
    color: var(--theme-color);
    cursor: pointer;
    font-size: 12px;
    margin-top: 1px;
  }
}
</style>
