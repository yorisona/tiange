<template>
  <el-form
    :inline="true"
    :model="importedProListItem"
    class="edit-require-product"
    label-position="top"
    label-width="110px"
    ref="importedProListItem"
  >
    <el-form-item
      label="商品名称"
      prop="product_name"
      :rules="[{ required: true, message: '请输入商品名称' }]"
    >
      <el-input
        size="small"
        name="product_name"
        v-model="importedProListItem.product_name"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="商品链接"
      prop="product_url"
      :rules="[{ required: true, message: '请输入商品链接' }]"
    >
      <el-input
        size="small"
        name="product_url"
        v-model="importedProListItem.product_url"
      ></el-input>
    </el-form-item>
    <el-form-item label="品类" prop="category" :rules="[{ required: true, message: '请选择品类' }]">
      <el-select size="small" v-model="importedProListItem.category">
        <el-option
          v-for="item in categoryOptions"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></el-option>
      </el-select>
    </el-form-item>
    <!-- <el-form-item label="预计成本" prop="display_cost" :rules="[{required: true, message: '请输入成本'}]">
      <el-input size="small" name="display_cost" v-model="importedProListItem.display_cost" type="number">
        <template #append>元</template>
      </el-input>
      <span class="cost-price-error-dialog" v-show="showCanUseCostTip">可分配金额不足</span>
    </el-form-item> -->
    <el-form-item label="活动价(客单价)">
      <el-input
        size="small"
        v-model="importedProListItem.product_sales_price"
        type="number"
        @mousewheel.native.prevent
      >
        <template #append>元</template>
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { categoryOptions } from '@/const/options';

export default {
  props: ['importedProListItem'],
  data() {
    return {
      categoryOptions,
    };
  },
  created() {
    if (this.importedProListItem.display_cost < 0) this.importedProListItem.display_cost = '';
  },
  mounted() {
    this.$emit('pass-ref-form-name', this.$refs['importedProListItem']);
  },
  methods: {},
};
</script>

<style lang="scss">
.edit-require-product {
  .el-form-item__label {
    padding-bottom: 0px;
    line-height: 20px;
  }
  .el-dialog__body {
    border-bottom: 1px solid #eee;
  }
  .el-form-item__error {
    top: -18px;
  }
  .el-input__inner {
    box-shadow: none;
  }
}
</style>

<style lang="scss" scoped>
.edit-require-product {
  .el-form-item {
    width: 70%;
    margin: 0;
    margin-left: 15%;
    .el-input,
    .el-select {
      width: 100%;
    }
    .cost-price-error-dialog {
      color: var(--error-color);
      font-size: 12px;
      position: absolute;
      top: -28px;
      right: 0;
    }
  }
}
</style>
