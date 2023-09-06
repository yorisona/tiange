<!--
 * @Description: 工作台通用表格
 * @Autor: 神曲
 * @Date: 2020-04-02 14:13:48
 * @LastEditors: 矢车
 * @LastEditTime: 2020-11-21 11:58:06
 -->

<template>
  <div class="bgc-withe">
    <div class="tabs" v-if="activeName !== 'second'"></div>
    <div class="approve-list">
      <el-table
        :data="dataSource !== null ? dataSource.data : []"
        stripe
        style="width: 100%"
        :header-cell-style="{
          backgroundColor: 'var(--table-thead-th-bg-color)',
          color: 'var(--text-second-color)',
        }"
        :cell-style="{ cursor: 'pointer' }"
        @row-click="handleRowClick"
      >
        <el-table-column prop="contract_uid" label="审批类型" min-width="140" max-width="270">
          <template #default="{ row }">
            <span class="color-8" v-if="row.approval_type === 1">用款申请</span>
            <span class="color-8" v-if="row.approval_type === 2">退款申请</span>
            <span class="color-8" v-if="row.approval_type === 3">借款申请</span>
            <span class="color-8" v-if="row.approval_type === 4">开票申请</span>
          </template>
        </el-table-column>
        <el-table-column prop="contract_uid" label="审批编号" min-width="140" max-width="270">
          <template #default="{ row }">
            <span class="color-blue">{{ row.approval_uid }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="customer_name" label="审批内容" min-width="130" max-width="220">
          <template #default="{ row }">
            <p>
              <span v-if="row.approval_type === 1" class="color-8">用款类型:</span>
              <span v-if="row.approval_type === 2" class="color-8">退款类型:</span>
              <span v-if="row.approval_type === 3" class="color-8">借款类型:</span>
              <span v-if="row.approval_type === 4" class="color-8">开票类型:</span>
              <span class="color-3" v-if="row.approval_type === 1">{{
                row.approval_content.level_two_types === 1 ? '成本安排' : '--'
              }}</span>
              <span class="color-3" v-if="row.approval_type === 2">{{
                row.approval_content.level_two_types === 1 ? '业绩退款' : '--'
              }}</span>
              <span class="color-3" v-if="row.approval_type === 3">{{
                row.approval_content.level_two_types === 1 ? '成本安排' : '--'
              }}</span>
              <span class="color-3" v-if="row.approval_type === 4">{{
                enumLevelTwoTypes(row.approval_content.level_two_types)
              }}</span>
            </p>
            <p v-if="row.approval_type === 1">
              <span class="color-8">用款金额(元):</span>
              <span>{{ row.approval_content.transfer_amount_str }}</span>
            </p>
            <p v-if="row.approval_type === 2">
              <span class="color-8">退款金额(元):</span>
              <span>{{ row.approval_content.refund_amount_str }}</span>
            </p>
            <p v-if="row.approval_type === 3">
              <span class="color-8">借款金额(元):</span>
              <span>{{ row.approval_content.borrowing_amount_str }}</span>
            </p>
            <p v-if="row.approval_type === 4">
              <span class="color-8">开票金额(元):</span>
              <span>{{ row.approval_content.invoice_amount_str }}</span>
            </p>
            <p v-if="row.approval_type === 1">
              <span class="color-8">用款日期:</span>
              <span class="color-3">{{ row.approval_content.transfer_date }}</span>
            </p>
            <p>
              <span class="color-8">申请人:</span>
              <span class="color-3">{{ row.approval_content.username }}</span>
            </p>
            <p>
              <span class="color-8">申请部门:</span>
              <span class="color-3">{{ row.approval_content.create_department }}</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="contract_uid" label="发起时间" min-width="140" max-width="270">
          <template #default="{ row }">
            <span>{{ row.start_time }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="customer_name" label="结束时间" min-width="130" max-width="220">
          <template #default="{ row }">
            <span>{{ row.end_time ? row.end_time : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="customer_name" label="审批状态" min-width="130" max-width="220">
          <template #default="{ row }">
            <span class="title-right">
              <span
                class="approver-state"
                :class="`status-color ${'status-color-' + row.approval_status}`"
              >
                <em></em>
                <!-- 只有审批中显示名字 -->
                <span v-if="row.approval_status === 1">
                  <span id="text" class="user-name">{{
                    row.approval_username ? row.approval_username : ''
                  }}</span>
                  <span v-if="row.approval_status === 1">审批中</span>
                </span>
                <span v-else>
                  <span v-if="row.approval_status === 2">审批通过</span>
                  <span v-if="row.approval_status === 3">审批失败</span>
                  <span v-if="row.approval_status === 4">已撤销</span>
                </span>
              </span>
            </span>
          </template>
        </el-table-column>
        <template #empty>
          <div class="empty-placeholder">
            <img src="@/assets/img/pls_import_product.png" />
            <p>空空如也~</p>
          </div>
        </template>
      </el-table>
      <!-- total,  -->
      <div class="page">
        <el-pagination
          v-if="dataSource.total !== 0"
          class="contract-pagination"
          :current-page.sync="page.page_num"
          :page-sizes.sync="page.pageSizes"
          :page-size="page.num"
          layout="sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handlePageSizeChange"
          :total="dataSource !== null ? dataSource.total : 0"
        ></el-pagination>
      </div>
    </div>
    <!-- 用款申请详情 -->
    <!-- @formSubmit="formSubmit" -->
    <apply-detail ref="applyDetailDialog" v-if="customerVisible" @close="close" />
    <!-- 退款申请详情 -->
    <refund-detail ref="refundDetailDialog" v-if="refundVisible" @close="close" />
    <!-- 借款申请详情 -->
    <application-detail ref="applicationDetailDialog" v-if="applicationVisible" @close="close" />
    <!-- 借款申请详情 -->
    <invoices-detail ref="invoicesDetailDialog" v-if="invoicesVisible" @close="close" />
  </div>
</template>
<script>
import ApplyDetail from './ApplyDetail';
import RefundDetail from '@/views/workbench/refund/refundDetail';
import ApplicationDetail from '@/views/workbench/application/applicationDetail';
import InvoicesDetail from '@/views/workbench/invoices/invoicesDetail';
import { enumLevelTwoTypes } from '@/utils/enumFunc';
export default {
  components: {
    ApplyDetail,
    RefundDetail,
    ApplicationDetail,
    InvoicesDetail,
  },
  props: ['activeName', 'page', 'dataSource'],
  data() {
    return {
      // activeMenu: "all",
      // formSubmitStatus: "", //子组件传的状态
      customerVisible: false,
      refundVisible: false, //退款弹窗
      applicationVisible: false, //借款弹窗
      invoicesVisible: false, //开票弹窗
      searchForm: {
        approval_status: '',
      },
    };
  },
  methods: {
    //  开票类型枚举
    enumLevelTwoTypes,
    // formSubmit(val) {
    //   // console.log(val)
    //   this.formSubmitStatus = val;
    // },
    //点击筛选
    // selectStatusHandle(val) {
    //   this.searchForm.approval_status = val.approval_status;
    //   this.handleSearch();
    // },
    // 绑定条件
    bindCondition() {
      const searchForm = JSON.parse(JSON.stringify(this.searchForm));
      if (searchForm.approval_status === '') delete searchForm.approval_status;
      return searchForm;
    },
    // 筛选方法
    handleSearch() {
      const searchForm = this.bindCondition();
      // 不同页面下传不同参数
      // 我发起的
      if (this.activeName === 'third') {
        this.$emit('search', searchForm, {
          approval_search_type: 2,
          // approval_status: this.formSubmitStatus
        });
      }
      //我已审批
      if (this.activeName === 'fourth') {
        this.$emit('search', searchForm, {
          approval_search_type: 3,
          // approval_status: this.formSubmitStatus
        });
      }
      // 待我审批
      if (this.activeName === 'second') {
        this.$emit('search', searchForm, {
          approval_search_type: 1,
        });
      }
    },
    // 翻页
    handleCurrentChange(val) {
      if (this.activeName === 'second') {
        this.$emit('change-page', {
          type: 'index',
          data: val,
          approval_search_type: 1,
        });
      }
      if (this.activeName === 'third') {
        this.$emit('change-page', {
          type: 'index',
          data: val,
          approval_search_type: 2,
        });
      }
      if (this.activeName === 'fourth') {
        this.$emit('change-page', {
          type: 'index',
          data: val,
          approval_search_type: 3,
        });
      }
    },
    // 页大小变化
    handlePageSizeChange(val) {
      if (this.activeName === 'second') {
        this.$emit('change-page', {
          type: 'size',
          data: val,
          approval_search_type: 1,
          // approval_status: this.formSubmitStatus
        });
      }
      if (this.activeName === 'third') {
        this.$emit('change-page', {
          type: 'size',
          data: val,
          approval_search_type: 2,
          // approval_status: this.formSubmitStatus
        });
      }
      if (this.activeName === 'fourth') {
        this.$emit('change-page', {
          type: 'size',
          data: val,
          approval_search_type: 3,
          // approval_status: this.formSubmitStatus
        });
      }
    },
    // 点击列表
    handleRowClick(row) {
      // 用款申请详情
      if (row && row.approval_type === 1) {
        this.customerVisible = true;
        this.$nextTick(() => {
          this.$refs.applyDetailDialog.show(row);
        });
      }
      // 退款申请详情
      if (row && row.approval_type === 2) {
        this.refundVisible = true;
        this.$nextTick(() => {
          // this.$refs.applyDetailDialog.show(row);
          // this.$refs.refundDetailDialog.show(row);
          this.$refs.refundDetailDialog.show(row);
        });
      }
      // 借款申请详情
      if (row && row.approval_type === 3) {
        this.applicationVisible = true;
        this.$nextTick(() => {
          this.$refs.applicationDetailDialog.show(row);
        });
      }
      // 开票申请详情
      if (row && row.approval_type === 4) {
        this.invoicesVisible = true;
        this.$nextTick(() => {
          this.$refs.invoicesDetailDialog.show(row);
        });
      }
    },
    close() {
      this.customerVisible = false;
      this.refundVisible = false;
      this.applicationVisible = false;
      this.invoicesVisible = false;
    },
  },
};
</script>
<style lang="less" scoped>
.bgc-withe {
  background: #fff;
  border-radius: 10px;
  margin-top: 10px;
  padding-top: 50px;
  padding-left: 20px;
  padding-right: 20px;
  min-height: 700px;
}
.header-menu {
  font-size: 16px;
  color: var(--text-color);
  margin-right: 40px;
  cursor: pointer;
}
.tabs {
  margin-bottom: 30px;
  color: var(--text-color);
  font-size: 16px;
  span {
    cursor: pointer;
    padding-bottom: 6px;
    margin-right: 30px;
    position: relative;
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
    height: 4px;
    border-radius: 6px;
    background: #396fff;
    position: absolute;
    left: 0;
    bottom: -4px;
    z-index: 0;
  }
}
.color-8 {
  color: var(--text-third-color);
  font-size: 14px;
}
.user-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.page {
  padding: 16px 0px;
}
.title-right {
  .approver-state {
    em {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
  }
  // 审核中
  .status-color-1 {
    color: #ff9434;
    em {
      background-color: #ff9434;
    }
  }
  // 审核成功
  .status-color-2 {
    color: #396fff;
    em {
      background-color: #396fff;
    }
  }
  // 审核失败
  .status-color-3 {
    color: #f43846;
    em {
      background-color: #f43846;
    }
  }
  // 已撤销
  .status-color-4 {
    color: var(--text-des-color);
    em {
      background-color: var(--text-des-color);
    }
  }
}
// 缺省图片
.empty-placeholder {
  padding: 150px 0;
  img {
    width: 110px;
    margin-bottom: 10px;
  }
}
/deep/ .el-table th {
  padding: 22px 0;
  min-height: 50px;
}
/deep/ .el-tabs__active-bar {
  transition: transform 0.1s;
}
</style>
