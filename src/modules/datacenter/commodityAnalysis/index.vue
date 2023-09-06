<template>
  <div class="commodity-analysis" :class="activeIndex ? 'minBig' : 'minSmall'" ref="commodityRef">
    <div class="commodity-form">
      <el-form class="filter-form flex-form" size="mini" :show-message="false" :inline="true">
        <el-form-item label="项目名称：" prop="">
          <el-select
            popper-class="el-select-popper-mini"
            @change="getAccess"
            v-model="form.project_id"
            filterable
            style="width: 264px"
          >
            <el-option
              v-for="item in project_list"
              :label="item.project_name"
              :key="item.project_id"
              :value="item.project_id"
              >{{ item.project_name }}
              <span v-if="item.project_status === ProjectStatusEnum.finish">(已完结)</span>
              <span v-else-if="item.project_status === ProjectStatusEnum.executionEnd"
                >(执行结束)</span
              >
              <span v-else>(进行中)</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查询日期：">
          <el-date-picker
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="~"
            :picker-options="pickerOptions"
            type="daterange"
            v-model="curDate"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            :clearable="false"
            style="width: 264px"
          />
        </el-form-item>
        <el-form-item>
          <tg-button type="primary" @click="search">查询</tg-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="router">
      <div class="commodity-navgition">
        <tg-button @click="linkAccess" style="margin-right: 8px" :disabled="accessObj.has_access"
          >商家授权</tg-button
        >
        <span v-if="!accessObj.has_access" class="tips">
          <i class="el-icon-warning-outline"></i>
          <span class="text">当前商家未授权</span>
        </span>
        <span v-else class="tips">
          <tg-icon
            name="ico-icon_tongyong_chenggong_xianxing1"
            style="color: #33ba5d; font-size: 18px; margin-top: 1px"
          ></tg-icon>
          <span class="text">当前商家已授权</span>
        </span>
      </div>
      <div class="summary-gmv">
        <span
          >总销量：<b>{{ numberFormat(baseData.all_sale_count, 0, '.', ',') }}</b></span
        >
        <span
          >总销售额：<b>{{
            formatPriceFormYuan(baseData.all_sale_amount === 0 ? 0 : baseData.all_sale_amount / 100)
          }}</b></span
        >
        <span
          >店铺总销售量：<b>{{ numberFormat(baseData.all_shop_sale_count, 0, '.', ',') }}</b></span
        >
        <span
          >店铺总销售额：<b>{{
            formatPriceFormYuan(
              baseData.all_shop_sale_amount === 0 ? 0 : baseData.all_shop_sale_amount / 100,
            )
          }}</b></span
        >
      </div>
      <data-switch
        style="margin-left: auto"
        @checkATab="handleCheckTab"
        :index="activeIndex"
      ></data-switch>
    </div>
    <div class="commodity-main">
      <component :is="component" ref="comp" @scroll="onScroll" @report="getReport" />
    </div>
  </div>
</template>
<script src="./index.ts"></script>
<style lang="less" scoped>
.commodity-analysis {
  display: flex;
  &.minBig {
    min-width: 1638px;
  }
  &.minSmall {
    min-width: 1238px;
  }
  .commodity-form {
    background-color: #ffffff;
    display: flex;
    padding: 16px;
    margin-bottom: 10px;
  }

  .router {
    background-color: #ffffff;
    padding: 12px 16px;
    display: flex;
    .commodity-navgition {
      display: flex;
      min-width: 195px;
      margin-right: 32px;
      height: 28px;
      font-size: 12px;
      color: var(--text-third-color);
      .tips {
        display: flex;
        margin-top: 4px;
        min-width: 110px;
        .el-icon-warning-outline {
          color: var(--warning-color);
          height: 22px;
          line-height: 20px;
          font-size: 14px;
        }
        .text {
          color: var(--text-third-color);
          padding: 0;
          margin-left: 3px;
          margin-top: 2px;
        }
      }
    }
    .summary-gmv {
      min-width: 750px;
      line-height: 28px;
      flex: 1;
      span {
        padding-right: 24px;
        b {
          color: rgba(var(--theme-rgb-color), 0.9);
        }
      }
    }
  }

  & .commodity-main {
    flex: 1;
    padding: 0;
  }
}
</style>
