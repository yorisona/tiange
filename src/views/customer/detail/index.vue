<template>
  <el-drawer
    :title="shopFormModalTitle"
    height="100vh"
    :size="412"
    :visible="shopDrawerVisible"
    :wrapperClosable="false"
    @close="closeDrawer"
  >
    <div class="shop-drawer-content">
      <div class="tg-shop-info base-grid cols">
        <div class="base-grid-item col-1-2">
          <span class="base-grid-item-lbl">店铺名称：</span>
          <span class="base-grid-item-content">{{ rowDetail.shop_name }}</span>
        </div>
        <div class="base-grid-item col-1-2">
          <span class="base-grid-item-lbl">店铺类目：</span>
          <span class="base-grid-item-content">{{ filterAreaStr(rowDetail.category) }}</span>
        </div>
        <div class="base-grid-item col-1-2">
          <span class="base-grid-item-lbl">店铺类型：</span>
          <span class="base-grid-item-content">{{ shopTypeFormat(rowDetail) }}</span>
        </div>
        <div class="base-grid-item col-1-2">
          <span class="base-grid-item-lbl">店铺品牌：</span>
          <span class="base-grid-item-content">{{ rowDetail.brand_name }}</span>
        </div>
        <div class="base-grid-item col-1-2">
          <span class="base-grid-item-lbl">客户类型：</span>
          <span class="base-grid-item-content">{{
            companyTypeList[rowDetail.company_type].value
              ? companyTypeList[rowDetail.company_type].value
              : '--'
          }}</span>
        </div>
        <div class="base-grid-item col-1-2">
          <span class="base-grid-item-lbl">业务类型：</span>
          <span
            class="base-grid-item-content item-business-type"
            v-for="(business_type, index) in rowDetail.business_type"
            :key="index"
            >{{
              BusinessTypeMap.get(business_type) ? BusinessTypeMap.get(business_type) : ''
            }}</span
          >
        </div>
        <div class="base-grid-item col-1-2">
          <span class="base-grid-item-lbl">关联公司：</span>
          <span
            class="base-grid-item-content"
            v-for="(company, index) in rowDetail.companies"
            :key="index"
            v-bind="company"
            >{{ company.company_name ? company.company_name : '--' }}</span
          >
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script src="./index.ts"></script>

<style lang="less">
@import './index.less';
</style>
