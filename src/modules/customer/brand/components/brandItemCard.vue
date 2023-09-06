<template>
  <div class="brand-item-card">
    <div class="item-avatar">{{ getFirstAvatarName(brandItem.brand_name) }}</div>
    <div class="item-content">
      <div class="item-brand-name">{{ brandItem.brand_name }}</div>

      <el-popover placement="top-start" trigger="hover" popper-class="platform-areas-grid-popover">
        <div class="platform-areas-grid">
          <template v-if="brandItem.customer_info.length > 0">
            <span v-for="(item, index) in brandItem.customer_info" :key="index">
              {{ item.company_name }}
            </span>
          </template>
          <template v-else>
            <span>无关联公司</span>
          </template>
        </div>
        <template slot="reference">
          <div>
            <span class="item-relation-shop" style="cursor: pointer">关联公司：</span>
            <span class="shop-count">{{ brandItem.customer_info.length }}</span>
          </div>
        </template>
      </el-popover>
    </div>
    <div class="operation-area">
      <slot></slot>
    </div>
  </div>
</template>

<script src="./brandItemCard.ts"></script>

<style lang="less" scoped>
@import 'brandItemCard.less';
</style>
