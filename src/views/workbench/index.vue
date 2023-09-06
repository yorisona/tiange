<template>
  <div id="workbench">
    <div class="workbench-header">
      <div class="tabs">
        <span :class="[{ active_blue: activeName === 'first' }]" @click="activeName = 'first'"
          >发起审批</span
        >
        <span
          :class="['await', { active_blue: activeName === 'second' }]"
          @click="(activeName = 'second'), onclick_await({ approval_search_type: 1 })"
        >
          待我审批
          <i v-if="RedDots" class="red-dots"></i>
        </span>
        <span
          :class="[{ active_blue: activeName === 'third' }]"
          @click="(activeName = 'third'), onclick_initiate({ approval_search_type: 2 })"
          >我发起的</span
        >
        <span
          :class="[{ active_blue: activeName === 'fourth' }]"
          @click="(activeName = 'fourth'), onclick_already({ approval_search_type: 3 })"
          >我已审批</span
        >
      </div>
      <!-- 待我审批 -->
      <await-approve-condition v-if="activeName === 'second'" @search="handleSearchApprovalList" />
      <!-- 我发起的 -->
      <me-initiate-condition @search="handleSearchApprovalList" v-if="activeName === 'third'" />
      <!-- 我已审批 -->
      <already-approve-condition
        @search="handleSearchApprovalList"
        v-if="activeName === 'fourth'"
      />
    </div>
    <!-- 表格 -->
    <approve-table
      v-loading="loading"
      v-if="activeName === 'second' || activeName === 'third' || activeName === 'fourth'"
      :activeName="activeName"
      :page="pagination"
      :dataSource="dataSource"
      @change-page="changePageHandle"
      @upload-handle="handleSearchApprovalList"
      @search="handleSearchApprovalList"
    />
    <!-- 用款申请 -->
    <initiate-approve-condition v-if="activeName === 'first'" />
  </div>
</template>
<script>
import InitiateApproveCondition from './components/initiateApproveCondition';
import AwaitApproveCondition from './components/awaitApproveCondition';
import MeInitiateCondition from './components/meInitiateCondition';
import alreadyApproveCondition from './components/alreadyApproveCondition';
import ApproveTable from './components/ApproveTable';
import { queryApprovalList } from '@/api/workbench';
import { mapGetters } from 'vuex';
export default {
  components: {
    InitiateApproveCondition,
    AwaitApproveCondition,
    MeInitiateCondition,
    alreadyApproveCondition,
    ApproveTable,
  },
  computed: {
    ...mapGetters({
      RedDots: 'cooperative/RedDots',
    }),
  },
  data() {
    return {
      activeName: 'first',
      // 待我审批 小红点处理
      await_data: '',
      search: null,
      loading: true,
      // activeName: "first",
      // 分页
      pagination: {
        page_num: 1,
        num: 10,
        pageSizes: [10, 20, 30],
      },
      // 数据
      dataSource: {
        total: 0,
        data: [],
      },
    };
  },
  mounted() {
    queryApprovalList({
      approval_search_type: 1,
    }).then(res => {
      this.await_data = res.data.data;
      this.$store.commit('cooperative/get_red_dots', this.await_data.data.length); // 将红点状态存入vuex，左侧导航栏那用
    });
  },
  methods: {
    //  查询  approval_type 子组件传的放入params中
    handleSearchApprovalList(form, approval_type) {
      this.loading = true;
      const page = JSON.parse(JSON.stringify(this.pagination));
      let params = { ...page, ...approval_type };
      if (form) {
        params = Object.assign(params, form);
        this.search = form;
      } else {
        if (this.search !== null) {
          params = Object.assign(params, JSON.parse(JSON.stringify(this.search)));
        }
      }
      this.getApprovalList(params);
    },
    // 获取数据方法
    //  approval_type接受当前页面点击事件传的
    getApprovalList(params, approval_type) {
      queryApprovalList(params, approval_type)
        .then(res => {
          if (res && res.data && res.data.success) {
            this.dataSource = res.data.data;
            // 处理小红点
            if (this.activeName === 'second') {
              this.await_data = res.data.data || [];
              this.$store.commit('cooperative/get_red_dots', this.await_data.data.length); // 将红点状态存入vuex，左侧导航栏那用
              this.dataSource = res.data.data;
            }
            // setTimeout(() => {
            this.loading = false;
            // }, 500);
          } else {
            this.dataSource = {
              total: 0,
              data: [],
            };

            this.$message.error('数据获取失败');
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
      this.handleSearchApprovalList(JSON.parse(JSON.stringify(this.search)), {
        approval_search_type: data.approval_search_type,
      });
      // data.approval_search_type;
      // this.getApprovalList({
      //   num: this.pagination.num,
      //   page_num: this.pagination.page_num,
      //   approval_search_type: data.approval_search_type
      // });
    },
    // 待我审批1
    onclick_await(approval_type) {
      this.loading = true;
      this.getApprovalList(approval_type);
    },
    // 我发起的2
    onclick_initiate(approval_type) {
      this.loading = true;
      this.getApprovalList(approval_type);
    },
    // 我已审批3
    onclick_already(approval_type) {
      this.loading = true;
      this.getApprovalList(approval_type);
    },
  },
};
</script>

<style lang="scss" scoped>
#workbench {
  // 工作台筛选区
  .workbench-header {
    background: #fff;
    border-radius: 10px;
    padding: 9px;
  }
  .tabs {
    color: var(--text-color);
    font-size: 16px;
    margin-bottom: 20px;
    margin-top: 10px;
    span {
      cursor: pointer;
      padding-bottom: 6px;
      margin-right: 30px;
      position: relative;
    }
  }
  .active_blue {
    // border-bottom: 4px solid #396fff;
    color: #396fff;
    // transition: left 0.2s ease-in-out 0s;
    font-weight: 600;
  }
  .active_blue::after {
    display: block;
    content: '';
    width: 100%;
    height: 3px;
    border-radius: 3px;
    background: #396fff;
    position: absolute;
    left: 0;
    bottom: -23px;
    z-index: 0;
  }
  // 背景色
  .bgc-withe {
    background: #fff;
    border-radius: 10px;
  }
  // 待我审批
  .await {
    position: relative;
  }
  // 提示小红点
  .red-dots {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(233, 83, 99, 1);
    top: -5px;
    right: -6px;
  }
  // tab栏
  /deep/ .el-tabs__item {
    color: var(--text-color);
    font-size: 16px;
  }
  /deep/ .el-tabs__item:hover {
    color: #396fff;
    cursor: pointer;
  }
  /deep/ .el-tabs__item.is-active {
    color: #396fff !important;
    font-weight: 600;
  }
  /deep/ .el-tabs__nav-wrap::after {
    display: none !important;
  }
  /deep/ .el-tabs__active-bar {
    height: 4px;
    border-radius: 2px;
    background-color: #396fff;
  }
}
</style>
