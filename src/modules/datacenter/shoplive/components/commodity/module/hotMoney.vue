<!--
 * @Author       : yunie
 * @Date         : 2022-07-18 18:14:25
 * @LastEditTime : 2022-07-23 15:31:22
 * @FilePath     : \src\modules\datacenter\shoplive\components\commodity\module\hotMoney.vue
 * @Description  :
-->
<template>
  <div>
    <div class="header-box">
      <el-button-group>
        <el-button
          style="width: 105px"
          :type="queryForm.sort === 'shop_sale_gmv' ? 'primary' : ''"
          @click="onResetClick('shop_sale_gmv')"
          >销售额TOP10
        </el-button>
        <el-button
          style="width: 100px"
          :type="queryForm.sort === 'shop_sale_count' ? 'primary' : ''"
          @click="onResetClick('shop_sale_count')"
          >销量TOP10
        </el-button>
      </el-button-group>
      <span v-show="catName" style="margin-left: 6px">爆款分析类目：{{ catName }}</span>
    </div>
    <div class="main" ref="imageTofile">
      <div v-loading="loading" class="main-item">
        <h3 class="main-item-title">{{ lastLastWeekNum }} TOP</h3>
        <Table :key="!loading" :list="lastLastData" :row-style="rowColors" />
      </div>
      <div v-loading="loading" class="main-item last-week">
        <h3 class="main-item-title">{{ lastWeekNum }} TOP</h3>
        <Table :key="!loading" :list="lastData" :row-style="rowColors" />
      </div>
    </div>
  </div>
</template>
<script src="./hotMoney.ts"></script>
<style lang="less" scoped>
.header-box {
  display: flex;
  align-items: center;
  margin-top: 32px;
  column-gap: 18px;
  span {
    font-weight: 400;
    font-size: 14px;
    color: var(--text-second-color);
  }
}
.main {
  margin-top: 18px;
  display: flex;
  justify-content: space-between;
  // min-width: 2028px;
  // padding: 18px 18px 0;
  .main-item {
    // width: calc(42% - 9px);
    width: 49%;
    height: 100%;
    &.last-week {
      // width: calc(62% - 9px);
      // margin-left: 18px;
      // margin-right: 18px;
    }
    .main-item-title {
      margin: 0 0 12px 0;
      line-height: 1;
      color: var(--text-color);
      font-weight: 400;
      font-size: 14px;
    }
  }
}
</style>
