<!--
 * @Author: 肖槿
 * @Date: 2021-12-14 10:22:19
 * @Description: 财务报表vue
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-12-16 18:19:27
 * @FilePath: \goumee-star-frontend\src\modules\finance\report\index.vue
-->
<script lang="ts" src="./index.tsx"></script>
<style lang="less">
.page-report {
  overflow: hidden;
  .page-report-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
  }
  & > .tg-card-bd:first-child {
    background: #f6f6f6;
  }
  & .filter-form-div {
    background: #fff;
  }
}
</style>
<style lang="less" scoped>
.un-writeoff-form {
  .filter-form-item {
    min-width: 234px;
    max-width: 234px;
    /deep/ .el-input {
      width: 164px;
    }
  }
}
.filter-form-div {
  .filter-form-item {
    width: 314px;
    min-width: 314px;
    min-width: 314px;
    /deep/ .item-groups {
      display: flex;
      border-radius: 2px;
      border: 1px solid var(--border-line-color);
      height: 28px;
      overflow: hidden;
      align-items: center;
      .el-date-editor {
        border-left: 1px solid var(--border-line-color);
      }
      .el-input__inner {
        border: none;
      }
    }
  }
}
</style>
