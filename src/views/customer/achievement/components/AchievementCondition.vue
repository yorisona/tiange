<template>
  <tg-block class="achievementcondition-container" bodyStyle="padding: 8px 18px 2px 18px">
    <el-row class="medium-operator">
      <el-row class="medium-choose">
        <tg-label-group
          v-model="searchForm.gather_way"
          :options="gatherWayListAll.map(el => ({ label: el.label, value: el.value }))"
          @change="selectGatherWayHandle(item.value)"
          style="margin-bottom: 6px"
        >
          <template #label>收款方式</template>
        </tg-label-group>
      </el-row>
      <el-form class="medium-search-bar" :inline="true" size="small">
        <el-form-item class="medium-cls">
          <template #label>
            <span class="medium-label">收款时间：</span>
          </template>
          <el-date-picker
            v-model="gather_date"
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
        <el-form-item class="medium-cls">
          <template #label>
            <span class="medium-label">登记时间：</span>
          </template>
          <el-date-picker
            v-model="gmt_create"
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
            <span class="medium-label">是否开票：</span>
          </template>
          <el-select v-model="searchForm.is_invoice" placeholder="请选择" style="width: 120px">
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
            v-model="searchForm.has_invoice_certificate"
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
          />
        </el-form-item>
        <el-form-item class="medium-cls">
          <template #label>
            <span class="medium-label">店铺/公司名称：</span>
          </template>
          <el-input
            v-model.trim="searchForm.shop_or_company_name"
            style="width: 210px"
            placeholder="请输入店铺/公司名称"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <tg-button type="primary" @click="handleSearch">查询</tg-button>
        </el-form-item>
        <el-form-item>
          <tg-button type="negative" @click="handleReset">重置</tg-button>
        </el-form-item>
      </el-form>
    </el-row>
  </tg-block>
</template>

<script>
import { gatherWayList } from '@/const/cooperative';
import { queryUserNamesByRoles } from '@/api/customer';

export default {
  name: 'AchievementCondition',
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
      gmt_create: [], // 登记时间
      gather_date: [], // 收款时间范围
      searchForm: {
        gather_way: '', // 支付方式
        is_invoice: '', // 是否开票
        has_invoice_certificate: '', // 是否有开票凭证
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
    const { source, achievement } = this.$router.currentRoute.query;
    if (source !== undefined) {
      this.searchForm.achievement_uid = achievement;
    }
    this.getManagers();
  },
  computed: {
    gatherWayListAll() {
      const _gatherWayList = JSON.parse(JSON.stringify(this.gatherWayList));
      _gatherWayList.unshift({
        label: '不限',
        value: '',
      });
      return _gatherWayList;
    },
  },
  watch: {
    gmt_create: {
      deep: true,
      handler(vv) {
        this.formatTime(vv, 'gmt_create');
      },
    },
    gather_date: {
      deep: true,
      handler(vv) {
        this.formatTime(vv, 'gather_date');
      },
    },
  },
  methods: {
    // 选择收款方式
    selectGatherWayHandle(val) {
      this.searchForm.gather_way = val;
      this.handleSearch();
    },
    // 查询条件时间格式化
    formatTime(vv, key) {
      if (!vv) {
        this.$delete(this.searchForm, key + '_min');
        this.$delete(this.searchForm, key + '_max');
      } else {
        this.searchForm[key + '_min'] = vv[0];
        this.searchForm[key + '_max'] = vv[1];
      }
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
      if (searchForm.gather_way === '') delete searchForm.gather_way;
      if (searchForm.is_invoice === '') delete searchForm.is_invoice;
      if (searchForm.has_invoice_certificate === '') delete searchForm.has_invoice_certificate;
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
        gather_way: '', // 支付方式
        is_invoice: '', // 是否开票
        has_invoice_certificate: '', // 是否有开票凭证
        manager_id: '', // 客户经理
        achievement_uid: '', // 收款编号
        shop_or_company_name: '', // 店铺/公司名称
      };
      this.gather_date = []; // 收款时间
      this.gmt_create = []; // 登记时间
      this.handleSearch();
      //调用父组件方法刷新
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
