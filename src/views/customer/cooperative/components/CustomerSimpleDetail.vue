<template>
  <div :class="['customersimpledetail-container', { bg: isbg }]">
    <el-row :gutter="10" class="text-block">
      <el-col :span="8" class="text-item">
        <span class="name"> 店铺名称： </span>
        <span class="text">
          {{ CustomerDetail.shop_name }}
        </span>
      </el-col>
      <el-col :span="8" class="text-item">
        <span class="name"> 公司名称： </span>
        <span class="text">
          {{ CustomerDetail.company_name }}
        </span>
      </el-col>
      <el-col :span="8" class="text-item">
        <span class="name"> 客户分类： </span>
        <span class="text">
          {{
            CustomerDetail.customer_class
              ? customerClassList[CustomerDetail.customer_class].value
              : '--'
          }}
          <span
            v-if="CustomerDetail.is_year_customer && CustomerDetail.customer_class"
            class="year-box"
            >年框</span
          >
        </span>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="text-block">
      <el-col :span="8" class="text-item">
        <span class="name"> 客户类目： </span>
        <span class="text">
          {{ categoryFormate({ category: CustomerDetail.category }) }}
        </span>
      </el-col>
      <el-col :span="8" class="text-item">
        <span class="name"> 公司类型： </span>
        <span class="text">
          {{ CustomerDetail.company_type ? companyTypeFormat(CustomerDetail) : '--' }}
        </span>
      </el-col>
      <el-col :span="8" class="text-item">
        <span class="name"> 客户经理： </span>
        <span class="text">
          {{ CooperationDetail.manager || '--' }}
        </span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { categoryFormate, companyTypeFormat, customerClassList } from '@/utils/format';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';

export default {
  name: 'CustomerSimpleDetail',
  props: ['isbg'],
  mixins: [CooperativeStore],
  data() {
    return {
      customerClassList,
    };
  },
  methods: {
    categoryFormate,
    companyTypeFormat,
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
$color-primary: var(--theme-color);
.year-box {
  padding: 2px 8px;
  background-color: rgba(255, 166, 123, 0.1);
  border: 1px solid rgba(255, 166, 123, 1);
  border-radius: 8px;
  color: #ff7d3e;
  font-size: 12px;
}
.customersimpledetail-container {
  margin-top: -15px;
  margin-bottom: 15px;
  padding-left: 80px;
  .text-block {
    margin-top: 10px;
    flex-wrap: wrap;
    font-size: 14px;
    line-height: 1;
    .text-item {
      display: flex;
      height: 25px;
      line-height: 25px;
      .name {
        color: var(--text-des-color);
        width: 70px;
        text-align: right;
        &.w100 {
          width: auto;
        }
      }
      .text {
        color: #666666;
        flex: 1;
        overflow: hidden;
        word-wrap: break-word;
        &.nowrap {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .lookall {
        color: $color-primary;
        cursor: pointer;
        .el-icon-arrow-down {
          display: inline;
        }
        .el-icon-arrow-up {
          display: none;
        }
        &:hover {
          .el-icon-arrow-down {
            display: none;
          }
          .el-icon-arrow-up {
            display: inline;
          }
        }
      }
      .click-look-step {
        display: inline-block;
        color: $color-primary;
        cursor: pointer;
        outline: none;
      }
    }
  }
}
.bg {
  background-color: #f6f6f6;
  padding-top: 8px;
  padding-bottom: 15px;
  border-radius: 10px;
  margin-top: 5px;
}
</style>
