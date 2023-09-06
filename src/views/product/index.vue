<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-06 09:35:27
 * @LastEditTime: 2020-04-30 11:38:23
 * @LastEditors: 肖槿
 -->
<template>
  <section>
    <el-row style="background: #fff; padding: 12px; border-radius: 10px">
      <!-- <el-row class="medium-choose">
        <div class="name">客户类目:</div>
        <div class="category-list">
          <div
            class="category-item"
            :class="{current:categoryIndex===index}"
            v-for="(item, index) in categoryOptions"
            :key="index"
            @click="selectCategory(index)"
          >{{item.label}}</div>
        </div>
      </el-row> -->

      <el-row class="medium-choose">
        <el-col :span="4" class="name name2">客户类目:</el-col>
        <el-col :span="22" class="category-list">
          <div
            class="category-item"
            :class="{ current: categoryIndex === item.key }"
            v-for="(item, index) in categoryList"
            :key="index"
            @click="selectCategory(item.key)"
          >
            {{ item.value }}
          </div>
        </el-col>
      </el-row>

      <!-- <el-form-item label="品 类:">
            <el-select v-model="searchProductForm.category" clearable placeholder="选择商品品类">
              <el-option v-for="(item, index) in categoryOptions" :key="index" :value="item.value" :label="item.label"></el-option>
            </el-select>
      </el-form-item>-->
      <el-form :inline="true" class="search-pro-form" size="small" :model="searchProductForm">
        <el-row>
          <el-form-item label="主播昵称:">
            <el-select v-model="searchProductForm.star_name" filterable clearable>
              <el-option
                class="option-width"
                v-for="(item, index) in allStars"
                :key="index"
                :value="item.value"
                :label="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="直播日期:">
            <el-date-picker
              placeholder="请选择日期"
              v-model="searchProductForm.display_time"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="最近直播:">
            <el-select
              v-model="searchProductForm.latest_display_time"
              placeholder="选择最近直播"
              clearable
            >
              <el-option
                v-for="(item, index) in latestDisplayTimeOptions"
                :key="index"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="录入人:">
            <el-select v-model="searchProductForm.add_by" filterable clearable>
              <el-option
                v-for="(item, index) in allAddBy"
                :key="index"
                :value="item"
                :label="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="是否出单:">
            <el-select v-model="searchProductForm.is_display" clearable placeholder="选择是否出单">
              <el-option
                v-for="(item, index) in isDisplayOptions"
                :key="index"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否预售:">
            <el-select v-model="searchProductForm.is_presell" clearable>
              <el-option
                v-for="(item, index) in isPresellOptions"
                :key="index"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="店铺/商品名称:">
            &nbsp;
            <el-input v-model="shopName" placeholder="店铺/商品名称"></el-input>
          </el-form-item>

          <el-button type="primary" class="btn-search btn btn-blue" @click="searchProduct"
            >查询</el-button
          >
          <tg-button type="negative" size="small" @click="searchReset" style="margin-left: 10px"
            >重置</tg-button
          >
        </el-row>
      </el-form>
    </el-row>
    <!-- main-table -->
    <el-row style="background: #fff; padding: 12px; margin-top: 10px; border-radius: 10px">
      <el-button
        v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.del_product)"
        size="small"
        class="product-delete-btn color-999"
        @click="clickBatchDelete"
        >批量删除</el-button
      >
      <productTable
        v-loading="productTableLoading"
        :productTableData="productTableData"
        :size="'medium'"
        @com-query-product="comQueryProduct"
        @pass-delete-data="passDeleteData"
      />
      <div style="margin-top: 14px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pagination.currentPage"
          :page-size.sync="pagination.pageSize"
          :page-sizes.sync="pagination.pageSizes"
          layout="sizes, prev, pager, next, jumper"
          :total="pagination.total"
        />
      </div>
    </el-row>
  </section>
</template>
<script>
// import { categoryList } from '@/utils/format';
import {
  isPresellOptions,
  categoryOptions,
  isDisplayOptions,
  latestDisplayTimeOptions,
  livePeriodOption,
  liveDurationOption,
} from '@/const/options';
import { queryStarSug } from '@/api/star';
import { queryProducts, deleteProduct } from '@/api/display';
import { allStars } from '@/const/getStar';
// import { getUserInfo } from '@/api/auth'
// import { USER_ROLE } from '@/utils/config'
import { RIGHT_CODE } from '@/const/roleCode';

import productTable from './component/productTable';
import { areaType } from '@/const/kolConst';
import { deepClone } from '@/utils/tools';
const _areaType = deepClone(areaType);
_areaType.unshift({
  value: '综合',
  key: '',
});
export default {
  data() {
    return {
      categoryList: _areaType,
      RIGHT_CODE,
      categoryIndex: '',
      // isAdminUser: true,
      searchProductForm: {
        star_name: '',
        is_presell: '',
        display_time: '',
        category: '',
        add_by: '',
        is_display: '',
        latest_display_time: '',
        num: '',
        page_num: '',
      },
      isPresellOptions,
      categoryOptions,
      isDisplayOptions,
      latestDisplayTimeOptions,
      livePeriodOption,
      liveDurationOption,
      allStars,
      allAddBy: [],
      productTableData: [],
      productTableLoading: false,
      editProDialogVisible: false,
      proDialogFormData: {},
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
        total: 100,
      },
      batchDeleteData: [],
      // 店铺名称
      shopName: '',
    };
  },
  components: { productTable },
  activated() {
    // getUserInfo().then(response => {
    //   if (response.data.data.role === USER_ROLE.CUSTOMER_MANAGER || response.data.data.role === USER_ROLE.PROJECT_MANAGER) {
    //     this.isAdminUser = false
    //   }
    // })
    // const role = this.$store.getters['user/getUserRole']
    // if (role === USER_ROLE.CUSTOMER_MANAGER || role === USER_ROLE.PROJECT_MANAGER) {
    //   this.isAdminUser = false
    // }

    const searchsugpass = { num: 1000 };
    queryStarSug(searchsugpass).then(response => {
      const result = response.data;
      if (result.success) {
        this.allAddBy = result.data.user_data;
      } else {
        console.log(result.message);
      }
    });
    this.queryProduct();
  },
  mounted() {
    // 匹配主播跳转过来的
    if (this.$route.query.starName) {
      this.searchProductForm.star_name = this.$route.query.starName;
      this.searchProduct();
    }
  },
  methods: {
    passDeleteData(value) {
      this.batchDeleteData = [];
      value.forEach(item => {
        this.batchDeleteData.push(item.id);
      });
    },
    clickBatchDelete() {
      if (this.batchDeleteData.length === 0) {
        this.$gmMessage('请先选择商品', 'tip');
      } else {
        this.$confirm('此操作将永久删除数据，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'warning-icon',
        })
          .then(() => {
            const deletepass = {
              id: JSON.stringify(this.batchDeleteData),
            };
            this.productTableLoading = true;
            deleteProduct(deletepass).then(response => {
              const result = response.data;
              this.productTableLoading = false;
              if (result.success) {
                this.$gmMessage(result.message);
                this.queryProduct();
              } else {
                this.$gmMessage(result.message, 'tip');
              }
            });
          })
          .catch(() => {
            /* do nth */
          });
      }
    },
    searchProduct() {
      this.pagination.currentPage = 1;
      this.queryProduct();
    },
    // 点击筛选
    selectCategory(index) {
      this.categoryIndex = index;
      // this.$store.commit("customer/updatePage", 1);
      this.queryProduct();
    },
    // 重置按钮
    searchReset() {
      this.searchProductForm = {
        star_name: '',
        is_presell: '',
        display_time: '',
        category: '',
        add_by: '',
        is_display: '',
        latest_display_time: '',
        num: '',
        page_num: '',
      };
      this.shopName = '';
      this.categoryIndex = '';
      this.searchProduct();
    },
    comQueryProduct() {
      this.queryProduct();
    },
    queryProduct() {
      this.productTableData = [];
      this.productTableLoading = true;
      this.searchProductForm.num = this.pagination.pageSize;
      this.searchProductForm.page_num = this.pagination.currentPage;
      // this.searchProductForm.category = this.categoryIndex+1;
      this.searchProductForm.category = this.categoryIndex;
      for (const item in this.searchProductForm) {
        if (this.searchProductForm[item] === '') delete this.searchProductForm[item];
      }
      this.searchProductForm.shop_name = this.shopName.trim();
      const productpass = this.searchProductForm;
      queryProducts(productpass)
        .then(response => {
          const data = response.data;
          if (data.success) {
            const res = data.data.data;
            for (const i in res) {
              this.productTableData.push(Object.assign(res[i]));
            }
            this.pagination.total = data.data.total;
          } else {
            this.$gmMessage(data.message, 'tip');
          }
          this.productTableLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.productTableLoading = false;
        });
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.$emit('handle-size-change', val);
      this.queryProduct();
    },
    handleCurrentChange() {
      this.queryProduct();
    },
  },
  watch: {
    $route: {
      // 从别处进入触发刷新，详情页返回不触发
      handler(val) {
        if (val.name === '商品管理') {
          this.searchReset();
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
.search-pro-form {
  // min-width: 1006px;
  /deep/ .el-form-item__label {
    // width: 120px;
  }
  /deep/ .el-form-item__content {
    // width: calc(100% - 100px);
  }
  .el-row {
    margin: 20px 0;
    white-space: nowrap;
    .el-form-item {
      // width: 23%;
      margin: 0px 10px;
    }
  }
}
</style>
<style lang="less">
.search-pro-form {
  .el-form-item__label {
    // text-align: left;
    // width: 33%;
    overflow: hidden;
    white-space: nowrap;
    // text-overflow: ellipsis;
  }
  .el-form-item__content {
    // width:65%;
    .el-select,
    .el-input {
      width: 100%;
    }
  }
}
.search-pro-btn {
  font-size: 0;
  .btn-search {
    padding: 0 !important;
    vertical-align: top;
    width: 60px;
    height: 30px !important;
    margin: 10px 0 0 0;
    font-size: 14px;
    text-align: center;
    &:nth-child(n + 2) {
      margin-left: 10px;
    }
  }
}
.product-delete-btn {
  margin-bottom: 12px;
}
.category-list {
  display: inline-block;
  flex: 1;
  .category-item {
    display: inline-block;
    // padding: 0 17px;
    font-size: 16px;
    color: var(--text-des-color);
    line-height: 30px;
    padding: 0 10px;
    margin: 0 10px;
    border-bottom: #fff solid 2px;
    cursor: pointer;
    // &:hover {
    //   color: $color-primary;
    // }
    &.current {
      // color: #fff!important;
      // background: $color-primary;
      // border-radius: 15px;
      //新增
      font-size: 18px;
      color: var(--text-color);
      font-weight: 600;
      position: relative;
      z-index: 0;
      &::after {
        display: block;
        content: '';
        width: 100%;
        height: 11px;
        border-radius: 6px;
        background: rgba(255, 206, 54, 1);
        position: absolute;
        left: 0;
        bottom: 2px;
        z-index: -1;
      }
    }
  }
}
.name2 {
  font-size: 16px;
  color: var(--text-des-color);
  line-height: 30px;
  display: inline-block;
  width: 80px;
  margin-left: 10px;
}
</style>
