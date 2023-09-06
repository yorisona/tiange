<template>
  <div class="confirm-cooperationDetail-container">
    <div class="content">
      <div class="contract">
        <span class="contract-text">关联客户合同：</span>
        <span
          @click="handleClick"
          v-if="this.CooperationDetail.contract_uid"
          class="contract-uid"
          >{{ this.CooperationDetail.contract_uid }}</span
        >
        <span v-else style="color: var(--text-des-color)">无合同</span>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="业绩登记表" name="achievement">
          <CustomerSimpleDetail :isbg="true" />
          <AchievementList />
        </el-tab-pane>
        <el-tab-pane label="成本安排表" name="cost">
          <CustomerSimpleDetail :isbg="true" />
          <CostList />
        </el-tab-pane>
        <el-tab-pane label="返点安排表" name="rebates">
          <CustomerSimpleDetail :isbg="true" />
          <RebatesList />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import CustomerSimpleDetail from '../components/CustomerSimpleDetail';
import AchievementList from './achievement/AchievementList';
import CostList from './cost/CostList';
import RebatesList from './rebates/RebatesList';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';
import { RouterNameProjectManage } from '@/const/router';

export default {
  name: 'ConfirmCooperationDetail',
  components: {
    CustomerSimpleDetail,
    AchievementList,
    CostList,
    RebatesList,
  },
  mixins: [CooperativeStore],
  data() {
    return {
      activeName: 'achievement',
    };
  },
  methods: {
    handleTabClick(val) {
      this.activeName = val.name;
    },
    // 点击进入供应商合同详情-打开新窗口
    handleClick() {
      const routeUrl = this.$router.resolve({
        name: RouterNameProjectManage.marketing.contract.customer.detail,
        params: {
          id: this.CooperationDetail.contract_id,
        },
        query: {
          partner_type: 2,
        },
      });
      window.open(routeUrl.href, '_blank');
    },
  },
};
</script>

<style lang="less" scoped>
.confirm-cooperationDetail-container {
  width: 100%;
  background-color: #f2f6f9;
  // padding-top: 10px;
  .content {
    background-color: #fff;
    padding: 10px 24px;
    // border-radius: 4px;
    position: relative;
  }
  .contract {
    background: rgba(245, 248, 250, 1);
    border-radius: 19px;
    padding: 10px 24px;
    border-radius: 19px;
    position: absolute;
    right: 20px;
    top: 9px;
    z-index: 100;
    .contract-text {
      color: #666;
    }
    .contract-uid {
      color: #396fff;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
/deep/ .el-tabs__item {
  margin: 0 10px;
  color: #666;
}
/deep/ .el-tabs__item.is-top {
  padding: 0 10px !important;
}
/deep/ .el-tabs__item.is-active {
  background-color: none;
  font-size: 18px !important;
  color: #333333 !important;
  font-weight: 600;
  position: relative;
  z-index: 0;
  &::after {
    display: block;
    content: '';
    width: 100%;
    height: 11px;
    border-radius: 6px;
    background: #ffce36;
    position: absolute !important;
    bottom: 8px;
    left: 0;
    z-index: -1;
  }
}
/deep/ .el-tabs__active-bar {
  height: 0;
}
/deep/ .el-tabs__nav-scroll {
  padding-left: 10px;
  padding-bottom: 5px;
}
</style>
