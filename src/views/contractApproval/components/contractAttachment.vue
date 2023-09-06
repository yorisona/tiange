<!--
 * @Description: 合同附件审批
 * @Author: 白青
 * @Date: 2019-09-09 14:11:42
 * @LastEditTime: 2019-09-12 15:56:12
 * @LastEditors: 白青
 -->
<style lang="scss" scoped>
@import '@/styles/vars.scss';
$color-primary: var(--theme-color);
#contract-attachment {
  /deep/ .el-table td {
    padding: 27px 0;
  }
  /deep/ .el-table th {
    padding: 23px 0;
  }
  .condition {
    border-radius: 10px;
    background: #fff;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.04);
    .condition-line {
      min-height: 60px;
      position: relative;
      &:last-child {
        border-bottom: none;
      }
      .condition-label {
        position: absolute;
        left: 0;
        top: 0;
        display: inline-block;
        height: 60px;
        line-height: 60px;
        margin-left: 12px;
        color: var(--text-color);
        font-size: 16px;
      }
      .condition-value {
        display: inline-block;
        padding-left: 90px;
        &.search-condition {
          padding-left: 140px;
        }
        .contract-type-label {
          color: var(--text-color);
          font-size: 16px;
          margin-left: 20px;
        }
        .select {
          margin-top: 15px;
          width: 160px;
        }
        /deep/ .el-input__inner {
          border-radius: 10px;
        }
        .search-keyword {
          width: 240px;
          margin-top: 15px;
        }
        .contract-uid {
          width: 180px;
          margin-top: 15px;
        }
        .search-btn {
          margin-left: 20px;
          width: 60px;
          height: 30px;
          padding: 0;
        }
        .reset-btn {
          width: 60px;
          height: 30px;
          padding: 0;
        }
      }
    }
  }
  .result-list {
    border-radius: 10px;
    margin-top: 12px;
    padding: 12px 13px;
    background: #fff;
    .contract-uid {
      color: $color-primary;
    }
    .partner-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .create-at {
      font-size: 12px;
    }
    .status-dot {
      display: inline-block;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 5px;
      &.status-dot-1 {
        background-color: #ff8549;
      }
      &.status-dot-2 {
        background-color: $color-primary;
      }
      &.status-dot-3 {
        background-color: #f34b60;
      }
      &.status-dot-4 {
        background-color: #ff8549;
      }
      &.status-dot-5 {
        background-color: #aaa;
      }
    }
    .status-dot-1 {
      color: #ff9434;
    }
    .status-dot-2 {
      color: #2877ff;
    }
    .status-dot-3 {
      color: #f43846;
    }
    .status-dot-4 {
      color: #ff9434;
    }
    .status-dot-5 {
      color: #aaa;
    }
    .empty-placeholder {
      padding: 150px 0;
      img {
        width: 110px;
        height: 110px;
      }
    }
    .comment {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .pagination {
      padding: 12px 0 0;
      /deep/ .el-input {
        margin: 0;
      }
    }
  }
}
</style>

<template>
  <div id="contract-attachment" class="list-left">
    <div class="condition">
      <div class="condition-line">
        <span class="condition-label">客户经理:</span>
        <div class="condition-value">
          <el-select
            class="select"
            v-model="condition.manager_id"
            clearable
            placeholder="请选择"
            size="small"
            @clear="getContractAttachment"
          >
            <el-option
              v-for="(item, index) in accountManager"
              :key="index"
              :label="item.username"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <span class="contract-type-label">附件类型:</span>
          <el-select
            class="select"
            v-model="condition.contract_annex_type"
            clearable
            placeholder="请选择"
            size="small"
            @clear="getContractAttachment"
          >
            <el-option label="客户合同附件" :value="1"></el-option>
            <el-option label="供应商合同附件" :value="2"></el-option>
          </el-select>
          <span class="contract-type-label">附件状态:</span>
          <el-select
            class="select"
            v-model="condition.contract_annex_status"
            clearable
            placeholder="请选择"
            size="small"
            @clear="getContractAttachment"
          >
            <el-option
              v-for="(item, index) in contractStatusOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="condition-line">
        <span class="condition-label">供应商/客户名称:</span>
        <div class="condition-value search-condition">
          <el-input
            class="search-keyword"
            v-model="condition.partner_name"
            size="small"
            placeholder="请输入供应商/客户名称"
            clearable
            @clear="getContractAttachment"
          ></el-input>
          <span class="contract-type-label">合同编号:</span>
          <el-input
            class="contract-uid"
            v-model="condition.contract_uid"
            size="small"
            placeholder="请输入合同编号"
            clearable
            @clear="getContractAttachment"
          ></el-input>
          <el-button
            class="search-btn btn-blue"
            type="primary"
            size="small"
            @click="handleSearchClick"
            >查询</el-button
          >
          <tg-button
            type="negative"
            size="small"
            @click="handleConditionResetClick"
            style="margin-top: 14px; margin-left: 10px"
            >重置</tg-button
          >
        </div>
      </div>
    </div>
    <div class="result-list">
      <el-table
        :data="data"
        :header-cell-style="{
          backgroundColor: 'var(--table-thead-th-bg-color)',
          color: 'var(--text-second-color)',
        }"
        stripe
      >
        <el-table-column type="index" label="序号" width="60" align="center"> </el-table-column>
        <el-table-column label="关联合同编号" min-width="140" max-width="220">
          <template #default="{ row }">
            <span class="contract-uid size-normal">{{ row.contract_info.contract_uid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="供应商/客户名称" min-width="130">
          <template #default="{ row }">
            <el-popover
              placement="top-start"
              trigger="hover"
              :content="row.contract_annex_info.partner_name"
            >
              <template slot="reference">
                <p class="partner-name">
                  {{ row.contract_annex_info.partner_name }}
                </p>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="审批金额" min-width="100">
          <template #default="{ row }">
            <span class="color-red">￥{{ row.contract_annex_info.approval_amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="附件类型" width="120">
          <template #default="{ row }">
            <span>{{ row.contract_annex_info.contract_annex_type_str }}</span>
          </template>
        </el-table-column>
        <el-table-column label="附件数" width="120" align="center">
          <template #default="{ row }">
            <span>{{ row.contract_annex_info.annex_num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请内容" align="left" width="150">
          <template #default="{ row }">
            <el-popover placement="top" trigger="hover" :content="row.contract_annex_info.comment">
              <template slot="reference">
                <span class="comment">{{ row.contract_annex_info.comment }}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="创建人/创建时间" width="150">
          <template #default="{ row }">
            <p class="create-by">{{ row.contract_annex_info.add_by_name }}</p>
            <p class="create-at color-999">{{ row.contract_annex_info.gmt_create }}</p>
          </template>
        </el-table-column>
        <el-table-column label="附件状态" width="150">
          <template #default="{ row }">
            <em
              :class="['status-dot', 'status-dot-' + row.contract_annex_info.contract_annex_status]"
            ></em>
            <el-popover
              v-if="
                row.contract_annex_work_infos &&
                row.contract_annex_work_infos.length > 0 &&
                row.contract_annex_info.contract_annex_status !== 2 &&
                row.contract_annex_info.contract_annex_status !== 5
              "
              placement="bottom-end"
              width="246"
              trigger="hover"
              popper-class="approve-progress-popper"
            >
              <template slot="reference">
                <span :class="['status-dot-' + row.contract_annex_info.contract_annex_status]">{{
                  row.contract_annex_info.contract_annex_status_str
                }}</span>
              </template>
              <approve-progress
                type="fjapproval"
                :work-infos="row.contract_annex_work_infos"
                :contract-info="row"
              />
            </el-popover>
            <span :class="['status-dot-' + row.contract_annex_info.contract_annex_status]" v-else>{{
              row.contract_annex_info.contract_annex_status_str
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <!-- 补充附件弹窗 -->
            <el-popover
              v-if="
                row.contract_annex_info !== undefined &&
                row.contract_annex_info.annex_list &&
                row.contract_annex_info.annex_list.length > 0
              "
              popper-class="contract-attachment-popper"
              placement="bottom-end"
              trigger="hover"
            >
              <template slot="reference">
                <span
                  class="iconfont icon-fujian1"
                  @click.stop="handleAttachmentLinkClick()"
                ></span>
              </template>
              <attachment-list-popover :annex-list="row.contract_annex_info.annex_list" />
            </el-popover>
            <!-- 审批 -->
            <span v-if="hasApprovalRight" class="approve-btn-wrap">
              <el-popover
                v-if="
                  hasApprovalRight &&
                  row.contract_annex_info.contract_annex_status !== 2 &&
                  row.contract_annex_info.contract_annex_status !== 5
                "
                popper-class="contract-oprete-popper"
                placement="top"
                trigger="hover"
                content="审核"
              >
                <template slot="reference">
                  <span
                    class="iconfont icon-shenhe"
                    @click.stop="handleReviewContractClick(row)"
                  ></span>
                </template>
              </el-popover>
            </span>
          </template>
        </el-table-column>
        <template #empty>
          <div class="empty-placeholder" v-show="!loading">
            <img src="@/assets/img/pls_import_product.png" />
            <p>空空如也~</p>
          </div>
        </template>
      </el-table>
      <el-pagination
        class="pagination"
        :current-page.sync="pagination.currentPage"
        :page-sizes.sync="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
      >
      </el-pagination>
    </div>
    <review-dialog ref="reviewDialog" @approved="getContractAttachment" />
  </div>
</template>

<script>
import { contractStatusOptions } from '@/const/options';
import { queryUserNames, getContractAnnex } from '@/api/customer';
import AttachmentListPopover from '@/views/contractApproval/components/attachmentListPopover';
import ReviewDialog from '@/views/contractApproval/components/reviewDialog';
import ApproveProgress from '@/views/customer/components/approveProgress';
import { ROLE_CODE } from '@/const/roleCode';
import { CONSTRACT_APPROVER } from '@/utils/config';
export default {
  name: 'ContractAttachment',
  components: {
    AttachmentListPopover,
    ReviewDialog,
    ApproveProgress,
  },
  data() {
    return {
      accountManager: [], // 客户经理
      contractStatusOptions,
      condition: {
        manager_id: undefined,
        contract_annex_type: undefined,
        contract_annex_status: undefined,
        partner_name: '',
        contract_uid: '',
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
        total: 0,
      },
      data: [],
      loading: false,
      currentUserInfo: null,
    };
  },
  async mounted() {
    this.currentUserInfo = this.$store.getters['user/getUserInfo'];
    await this.getAccountManager();
    this.getContractAttachment();
  },
  computed: {
    hasApprovalRight() {
      if (this.currentUserInfo) {
        // if (this.currentUserInfo.id === CONSTRACT_APPROVER.xyx_manager || this.currentUserInfo.id === CONSTRACT_APPROVER.general_manager || this.currentUserInfo.id === CONSTRACT_APPROVER.risk_control_specialist) {
        if (Object.values(CONSTRACT_APPROVER).includes(this.currentUserInfo.id)) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
  },
  activated() {
    this.getUserId();
  },
  methods: {
    // 获取用户id刷新dom
    getUserId() {
      this.currentUserInfo = this.$store.getters['user/getUserInfo'];
    },
    // 获取搜索条件中的客户经理
    getAccountManager() {
      return new Promise((resolve, reject) => {
        queryUserNames({
          role: ROLE_CODE.customer_manager + ',' + ROLE_CODE.major_customer_manager,
        })
          .then(res => {
            if (res.data.success) {
              this.accountManager = res.data.data.user_data;
              resolve(undefined);
            } else {
              this.$message({
                type: 'warning',
                message: res.data.message,
                duration: 2000,
                showClose: true,
              });
              reject(res.data.message);
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '客户经理获取失败，稍后重试',
              duration: 2000,
              showClose: true,
            });
            console.log(error.message);
            reject(error);
          });
      });
    },
    // 获取合同附件列表
    getContractAttachment() {
      this.loading = true;
      const params = this.condition;
      params.num = this.pagination.pageSize;
      params.page_num = this.pagination.currentPage;
      // params. = this.pagination.currentPage
      getContractAnnex(params)
        .then(res => {
          if (res.data.success) {
            this.data = res.data.data.data;
            this.pagination.total = res.data.data.total;
          } else {
            this.$message.warning(res.data.message);
          }
          this.loading = false;
        })
        .catch(error => {
          this.$message.error('合同附件列表获取失败，请稍后重试', {
            duration: 2000,
            showClose: true,
          });
          console.error(error.message);
          this.loading = false;
        });
    },
    // 点击审核合同
    handleReviewContractClick(row) {
      this.$refs.reviewDialog.show(row);
    },
    // 搜索条件点击重置
    handleConditionResetClick() {
      this.condition = {
        manager_id: undefined,
        contract_annex_type: undefined,
        contract_annex_status: undefined,
        partner_name: '',
        contract_uid: '',
      };
      this.getContractAttachment();
    },
    // 翻页
    handleCurrentChange() {
      this.getContractAttachment();
    },
    // 每页展现数量发生变化
    handlePageSizeChange(size) {
      this.pagination.pageSize = size;
      this.getContractAttachment();
    },
    // 点击搜索按钮
    handleSearchClick() {
      this.pagination.currentPage = 1;
      this.getContractAttachment();
    },
  },
};
</script>
