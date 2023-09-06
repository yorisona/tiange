<!--
 * @Description: 侧边栏返点安排表筛选
 * @Author: 神曲
 * @LastEditTime: 2021-01-28 16:21:55
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="achievementcondition-container">
    <el-row class="medium-operator" style="padding-top: 14px">
      <el-form class="medium-search-bar" :inline="true" size="small">
        <el-form-item class="medium-cls">
          <template #label>
            <span class="medium-label">打款时间：</span>
          </template>
          <el-date-picker
            v-model="searchForm.pay_date"
            unlink-panels
            type="daterange"
            size="small"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions1"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            :default-value="new Date().getTime() - 2592000000"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <el-form class="medium-search-bar" :inline="true" size="small">
        <el-form-item class="medium-cls">
          <template #label>
            <span class="medium-label">客户经理：</span>
          </template>
          <el-select v-model="searchForm.manager_id" placeholder="请选择" style="width: 150px">
            <el-option
              v-for="item in managers"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="medium-cls">
          <template #label>
            <span class="medium-label">是否打款：</span>
          </template>
          <el-select v-model="searchForm.is_pay" placeholder="请选择" style="width: 120px">
            <el-option
              v-for="item in ticketList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="medium-cls">
          <template #label>
            <span class="medium-label" style="margin-left: 10px">开票凭证：</span>
          </template>
          <el-select
            v-model="searchForm.has_pay_certificate"
            placeholder="请选择"
            style="width: 120px"
          >
            <el-option
              v-for="item in conbinList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form class="medium-search-bar" :inline="true" size="small">
        <el-form-item class="medium-cls">
          <template #label>
            <span class="medium-label">收款编号：</span>
          </template>
          <el-input
            v-model.trim="searchForm.achievement_uid"
            style="width: 210px"
            placeholder="请输入收款编号"
            clearable
            @clear="handleSearch"
          ></el-input>
        </el-form-item>
        <el-form-item class="medium-cls">
          <template #label>
            <span class="medium-label">店铺/公司名称：</span>
          </template>
          <el-input
            v-model.trim="searchForm.shop_or_company_name"
            style="width: 210px"
            placeholder="请输入店铺公司名称"
            clearable
            @clear="handleSearch"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn btn-blue" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <tg-button type="negative" size="small" @click="handleReset">重置</tg-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import { queryUserNamesByRoles } from '@/api/customer'; //通过角色码获取对应的所有用户

export default {
  name: 'RebatestCondition',
  data() {
    return {
      ticketList: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '是',
          value: 1,
        },
        {
          label: '否',
          value: 0,
        },
      ],
      conbinList: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '已开',
          value: 1,
        },
        {
          label: '未开',
          value: 0,
        },
      ],
      managers: [],
      searchForm: {
        pay_date: [], // 打款时间范围
        is_pay: '', // 是否打款
        has_pay_certificate: '', // 是否有打款凭证
        manager_id: '', // 客户经理
        achievement_uid: '', // 收款编号
        shop_or_company_name: '', // 店铺/公司名称
      },
      pickerOptions1: {
        disabledDate(date) {
          const ret = date.getTime() > new Date().getTime();
          return ret;
        },
      },
    };
  },
  created() {
    this.getManagers();
  },
  computed: {},
  methods: {
    // 获取客户经理
    getManagers() {
      // 客户经理，大客户经理
      queryUserNamesByRoles({ roles: '1008' }).then(res => {
        if (res.data.data) {
          const managers = res.data.data.map(cc => ({
            id: cc.id,
            name: cc.username,
          }));
          managers.unshift({ id: '', name: '全部' });
          this.managers = managers;
        }
      });
    },
    // 绑定条件
    bindCondition() {
      this.searchForm.pay_date = this.searchForm.pay_date ?? [];

      const searchForm = JSON.parse(JSON.stringify(this.searchForm));
      if (searchForm.pay_date.length === 0) {
        delete searchForm.pay_date;
      } else {
        searchForm.pay_date_min = searchForm.pay_date[0];
        searchForm.pay_date_max = searchForm.pay_date[1];
        delete searchForm.pay_date;
      }
      if (searchForm.is_pay === '') delete searchForm.is_pay;
      if (searchForm.has_pay_certificate === '') delete searchForm.has_pay_certificate;
      if (searchForm.manager_id === '') delete searchForm.manager_id;
      if (searchForm.achievement_uid === '') delete searchForm.achievement_uid;
      if (searchForm.shop_or_company_name === '') delete searchForm.shop_or_company_name;
      return searchForm;
    },
    // 查询
    handleSearch() {
      const searchForm = this.bindCondition();
      this.$emit('search', searchForm);
    },
    // 重置
    handleReset() {
      this.searchForm = {
        pay_date: [], // 打款时间范围
        is_pay: '', // 是否打款
        has_pay_certificate: '', // 是否有打款凭证
        manager_id: '', // 客户经理
        achievement_uid: '', // 收款编号
        shop_or_company_name: '', // 店铺/公司名称
      };
      this.handleSearch();
      // 调用父组件方法刷新
      this.$parent.resetPage();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
.achievementcondition-container {
  .medium-operator {
    border-radius: 10px;
    background-color: #fff;
    .medium-search-bar {
      padding: 1px 12px 0;
      .medium-label {
        color: var(--text-color);
        font-size: 16px;
      }
      .range-input {
        width: 100px;
      }
    }
  }
}
.btn {
  width: 60px;
  height: 30px;
  padding: 0;
}
</style>
