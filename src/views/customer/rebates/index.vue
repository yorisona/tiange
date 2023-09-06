<!--
 * @Description: 返点首页
 * @Author: 神曲
 * @LastEditTime: 2021-01-29 16:00:39
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="achievementindex-container">
    <RebatestCondition @search="handleSearchRebatest" />
    <RebatestTable
      v-loading="loading"
      :page="pagination"
      :dataSource="dataSource"
      @change-page="changePageHandle"
      @upload-handle="getRebateRequest"
      @exort="exortRebate"
    />
  </div>
</template>

<script>
import RebatestCondition from './components/RebatestCondition.vue';
import RebatestTable from './components/RebatestTable.vue';
import {
  exportRebate, //导出返点
  getRebate, //查询返点
} from '@/api/cooperative';

export default {
  name: 'RebateIndex',
  components: {
    RebatestCondition,
    RebatestTable,
  },
  data() {
    return {
      pagination: {
        page_num: 1,
        num: 10,
        pageSizes: [10, 20, 30],
      },
      dataSource: {
        total: 0,
        data: [],
      },
      loading: false,
      search: null,
    };
  },
  created() {
    this.getRebateRequest();
  },
  methods: {
    getRebateRequest(form, _type) {
      this.loading = true;
      // if (type !== "page") this.resetPage();
      const page = JSON.parse(JSON.stringify(this.pagination));
      let params = { ...page };
      if (form) {
        params = Object.assign(params, form);
        this.search = form;
      } else {
        if (this.search !== null) {
          params = Object.assign(params, JSON.parse(JSON.stringify(this.search)));
        }
      }
      const { shop_or_company_name, ...otherParams } = { ...params };
      if (shop_or_company_name) {
        params = { ...otherParams, shop_name: shop_or_company_name };
      }

      getRebate(params)
        .then(res => {
          if (res && res.data && res.data.success) {
            this.dataSource = res.data.data;
            this.loading = false;
          } else {
            this.dataSource = {
              total: 0,
              data: [],
            };
            this.$message.error({ message: res.data.message });
            this.loading = false;
          }
        })
        .catch(err => {
          console.error(err);
          this.dataSource = {
            total: 0,
            data: [],
          };
          this.$message.error('数据获取失败');
          this.loading = false;
        });
    },

    // 改变页
    changePageHandle(data) {
      if (data.type === 'index') {
        this.pagination.page_num = data.data;
      }
      if (data.type === 'size') {
        this.pagination.num = data.data;
      }
      this.getRebateRequest(JSON.parse(JSON.stringify(this.search)), 'page');
    },
    resetPage() {
      this.pagination = {
        page_num: 1,
        num: 10,
        pageSizes: [10, 20, 30],
      };
    },
    // 查询返点
    handleSearchRebatest(form, _type) {
      this.pagination.page_num = 1;
      this.getRebateRequest(form, _type);
    },
    // 导出业绩
    exortRebate(rebate_ids) {
      if (rebate_ids.length > 0) {
        rebate_ids = JSON.stringify(rebate_ids);
        exportRebate({ rebate_ids });
      } else {
        const form = JSON.parse(JSON.stringify(this.search));
        exportRebate(form);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.achievementindex-container {
  background-color: #f5f5f5;
}
</style>
