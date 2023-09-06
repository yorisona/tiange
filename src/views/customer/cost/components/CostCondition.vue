<template>
  <tg-block class="costcondition-container" bodyStyle="padding: 8px 18px 2px 18px">
    <el-row class="medium-operator">
      <el-row class="medium-choose">
        <tg-label-group
          v-model="searchForm.pay_way"
          :options="gatherWayListAll.map(el => ({ label: el.label, value: el.value }))"
          @change="selectPayWayHandle(item.value)"
          style="margin-bottom: 6px"
        >
          <template #label>打款方式</template>
        </tg-label-group>
      </el-row>
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
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="medium-label">成本类型：</span>
          </template>
          <el-select v-model="searchForm.new_cost_type" placeholder="请选择" style="width: 150px">
            <el-option label="全部" :value="undefined"> </el-option>
            <el-option label="营销成本" :value="7"> </el-option>
            <el-option label="返点" :value="8"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form class="medium-search-bar" :inline="true" size="small">
        <el-form-item class="medium-cls">
          <template #label>
            <span class="medium-label">客户经理：</span>
          </template>
          <el-select v-model="searchForm.manager_id" placeholder="请选择" style="width: 150px">
            <el-option v-for="item in managers" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="medium-cls">
          <template #label>
            <span class="medium-label">是否打款：</span>
          </template>
          <el-select v-model="searchForm.is_pay" placeholder="请选择" style="width: 120px">
            <el-option
              v-for="item in payaccountList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="medium-cls">
          <template #label>
            <span class="medium-label" style="margin-left: 10px">打款凭证：</span>
          </template>
          <el-select
            v-model="searchForm.has_pay_certificate"
            placeholder="请选择"
            style="width: 120px"
          >
            <el-option
              v-for="item in payaccountpzList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="medium-cls">
          <template #label>
            <span class="medium-label">是否有发票：</span>
          </template>
          <el-select v-model="searchForm.is_invoice" placeholder="请选择" style="width: 120px">
            <el-option
              v-for="item in ticketList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
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
          />
        </el-form-item>
        <el-form-item class="medium-cls">
          <template #label>
            <span class="medium-label">kol/机构名称：</span>
          </template>
          <el-input
            v-model.trim="searchForm.kol_or_company_name"
            style="width: 210px"
            placeholder="请输入kol/机构名称"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button class="btn btn-blue" type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <tg-button type="negative" size="small" @click="handleReset">重置</tg-button>
        </el-form-item>
      </el-form>
    </el-row>
  </tg-block>
</template>

<script>
import { gatherWayList } from '@/const/cooperative';
import { queryUserNamesByRoles } from '@/api/customer';

export default {
  name: 'CostCondition',
  data() {
    return {
      gatherWayList,
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
      payaccountList: [
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
      payaccountpzList: [
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
      // conbinList: [
      //   {
      //     label: '全部',
      //     value: ''
      //   },
      //   {
      //     label: '已开',
      //     value: 1
      //   },
      //   {
      //     label: '未开',
      //     value: 0
      //   }
      // ],
      managers: [],
      searchForm: {
        pay_way: '', // 打款方式
        pay_date: [], // 打款时间范围
        is_pay: '', // 是否打款
        has_pay_certificate: '', // 是否有打款凭证
        is_invoice: '', // 是否开票
        has_invoice_certificate: '', // 是否有开票凭证
        manager_id: '', // 客户经理
        new_cost_type: undefined,
        achievement_uid: '', // 收款编号
        kol_or_company_name: '', // 店铺/公司名称
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
  computed: {
    gatherWayListAll() {
      return [
        { label: '不限', value: '' },
        { label: '银行卡', value: 1 },
        { label: 'V任务', value: 2 },
        { label: '对公银行', value: 3 },
        { label: '对公支付宝', value: 4 },
      ];
    },
  },
  methods: {
    // 选择收款方式
    selectPayWayHandle(val) {
      this.searchForm.pay_way = val;
      this.handleSearch();
    },
    // 获取客户经理
    getManagers() {
      // 客户经理，大客户经理
      queryUserNamesByRoles({ roles: '1008' }).then(res => {
        if (res.data.data) {
          const managers = res.data.data.map(cc => ({ id: cc.id, name: cc.username }));
          managers.unshift({ id: '', name: '全部' });
          this.managers = managers;
        }
      });
    },
    // 绑定条件
    bindCondition() {
      const searchForm = JSON.parse(JSON.stringify(this.searchForm));
      if (searchForm.pay_way === '') delete searchForm.pay_way;
      if (!searchForm.pay_date || searchForm.pay_date.length === 0) {
        delete searchForm.pay_date;
      } else {
        searchForm.pay_date_min = searchForm.pay_date[0];
        searchForm.pay_date_max = searchForm.pay_date[1];
        delete searchForm.pay_date;
      }
      if (searchForm.is_invoice === '') delete searchForm.is_invoice;
      if (searchForm.has_invoice_certificate === '') delete searchForm.has_invoice_certificate;
      if (searchForm.manager_id === '') delete searchForm.manager_id;
      if (searchForm.achievement_uid === '') delete searchForm.achievement_uid;
      if (searchForm.kol_or_company_name === '') delete searchForm.kol_or_company_name;
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
        pay_way: '', // 打款方式
        pay_date: [], // 打款时间范围
        is_pay: '', // 是否打款
        has_pay_certificate: '', // 是否有打款凭证
        is_invoice: '', // 是否开票
        has_invoice_certificate: '', // 是否有开票凭证
        manager_id: '', // 客户经理
        achievement_uid: '', // 收款编号
        kol_or_company_name: '', // 店铺/公司名称
      };
      this.handleSearch();
      // 调用父组件方法刷新分页
      this.$parent.resetPage();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
.costcondition-container {
  .medium-operator {
    background-color: #fff;
    .medium-choose {
      .choose-block {
        min-height: 60px;
        box-sizing: border-box;
        font-size: 0;
        padding: 15px 12px;
        display: flex;
        .name {
          font-size: 16px;
          color: var(--text-des-color);
          line-height: 30px;
          display: inline-block;
          width: 80px;
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
          }
        }
      }
    }
    .medium-search-bar {
      .medium-label {
        color: var(--text-color);
        font-size: 14px;
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
