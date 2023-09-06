<!--
 * @Author: 矢车
 * @Date: 2020-11-28 10:49:13
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-09-01 14:31:09
 * @Description: 供应商管理-供应商合同-结算单详情
-->

<template>
  <div>
    <div class="block-content attachment-list">
      <el-table
        stripe
        :data="tableData"
        :header-cell-style="{
          backgroundColor: 'var(--table-thead-th-bg-color)',
          color: 'var(--text-second-color)',
        }"
        :cell-style="{ borderBottom: '1px solid #ebeef5' }"
      >
        <template slot="empty">
          <div class="nodata">
            <empty-common detail-text="您还没有结算单详情哦~"></empty-common>
          </div>
        </template>
        <el-table-column
          width="60"
          label="序号"
          :formatter="
            (row, column, cellValue, index) =>
              (pagination.currentPage - 1) * pagination.pageSize + (index + 1)
          "
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="140"
          prop="approval_amount"
          label="审批金额"
          align="center"
        ></el-table-column>
        <el-table-column min-width="76" prop="seal_type" label="用章情况" align="center">
          <template slot-scope="scope">
            <span>{{ enumSealType(scope.row.seal_type) }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="180" prop="comment" label="申请内容" align="center">
          <template slot-scope="scope">
            <span :class="!scope.row.comment ? 'color-999' : ''">{{
              scope.row.comment || '--'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="114"
          prop="add_by_name"
          label="创建人"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="136"
          prop="gmt_create"
          label="创建时间"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="140"
          prop="add_by_department"
          label="创建人所属部门"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="132"
          prop="contract_statements_status"
          label="审批状态"
          align="center"
        >
          <template slot-scope="scope">
            <!-- <span>{{ enumApproveStatus(scope.row.contract_statements_status) }}</span> -->
            <el-popover
              v-if="
                !scope.row.feishu_request_id &&
                !scope.row.oa_request_id &&
                scope.row.contract_statements_status !== 2 &&
                scope.row.contract_statements_status !== 5 &&
                scope.row.contract_statements_status !== 1
              "
              placement="bottom-end"
              trigger="hover"
              popper-class="approve-progress-popper"
              @show="
                approveShow(
                  scope.row.feishu_request_id || scope.row.oa_request_id,
                  scope.row.id,
                  scope.$index,
                )
              "
            >
              <template slot="reference">
                <div class="sty-status-dot">
                  <span :class="'font-status-dot-' + scope.row.contract_statements_status">
                    {{ enumApproveStatus(scope.row.contract_statements_status) }}
                  </span>
                </div>
              </template>
              <approve-progress
                :work-infos="scope.row.contract_work_infos"
                :contract-info="scope.row"
              />
            </el-popover>
            <el-popover
              v-else-if="
                (scope.row.feishu_request_id || scope.row.oa_request_id) &&
                scope.row.contract_statements_status !== 2 &&
                scope.row.contract_statements_status !== 5 &&
                scope.row.contract_statements_status !== 1
              "
              placement="bottom-end"
              trigger="hover"
              popper-class="approve-progress-popper"
              @show="
                approveShow(
                  scope.row.feishu_request_id || scope.row.oa_request_id,
                  scope.row.id,
                  scope.$index,
                )
              "
            >
              <template slot="reference">
                <div class="sty-status-dot">
                  <span :class="'font-status-dot-' + scope.row.contract_statements_status">
                    {{ enumApproveStatus(scope.row.contract_statements_status) }}
                  </span>
                </div>
              </template>
              <NewApproveProgress
                :work-infos="new_contract_work_infos"
                :checkStatus="scope.row.contract_statements_status"
              />
            </el-popover>
            <div class="sty-status-dot" v-else>
              <span :class="'font-status-dot-' + scope.row.contract_statements_status">
                {{ enumApproveStatus(scope.row.contract_statements_status) }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="76"
          prop="contract_statements_status"
          label="结算情况"
          align="center"
        >
          <template slot-scope="scope">
            <a class="sty-check" @click="isDialogVisibleList.splice(scope.$index, 1, true)">查看</a>
            <el-dialog
              class="sty-dialog"
              :destroy-on-close="true"
              title="结算情况"
              :visible.sync="isDialogVisibleList[scope.$index]"
              width="1136px"
            >
              <settleCondition :tableData="scope.row.settlement_detail"></settleCondition>
            </el-dialog>
          </template>
        </el-table-column>
        <el-table-column width="48" label="附件单" align="center">
          <template slot-scope="scope">
            <span @click.stop="contract_file_dialog.splice(scope.$index, 1, true)"
              ><a class="sty-check">查看</a></span
            >
            <el-dialog
              title="合同附件"
              :visible.sync="contract_file_dialog[scope.$index]"
              width="445px"
            >
              <fileCheck :dataList="scope.row.attachment_url.split(',')" :type="'结算单'" />
            </el-dialog>
            <!-- <el-popover popper-class="contract-oprete-popper" placement="top" trigger="hover">
              <template slot="reference">
                <span><a>查看</a></span>
              </template>
              <fileCheck :dataList="row.attachment_url_list" />
            </el-popover> -->
          </template>
        </el-table-column>
        <el-table-column prop="" width="48" label="操作" align="center">
          <template slot-scope="scope">
            <a
              @click="deleteProtocol(scope.row.id, scope.$index)"
              v-if="scope.row.add_by === userInfo_id && scope.row.contract_statements_status !== 4"
              >删除</a
            >
            <span class="color-999" v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin: 16px 0 10px 0" v-if="tableData.length">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pagination.currentPage"
          :page-size.sync="pagination.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="pagination.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getContractStatement,
  deleteContractStatements,
  getContractApprovalSettlement,
} from '@/api/customer';
import fileCheck from './fileCheck.vue';
import settleCondition from './settleCondition';
import { enumApproveStatus, enumSealType } from '@/utils/enumFunc';
import ApproveProgress from '@/views/customer/components/approveProgress';
import NewApproveProgress from '@/views/customer/components/newApproveProgress';

export default {
  name: 'SupplementDetal',
  components: {
    fileCheck,
    settleCondition,
    ApproveProgress,
    NewApproveProgress,
  },
  data() {
    return {
      dataList: [],
      contract_file_dialog: [],
      tableData: [], // 表格数据
      isDialogVisibleList: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
        total: 0,
      },
      userInfo_id: JSON.parse(localStorage.getItem('vuex')).user.userinfo.id,
      dialogVisible: false,
      new_contract_work_infos: [],
    };
  },
  mounted() {
    this.getContractAttachment();
  },
  methods: {
    enumApproveStatus,
    enumSealType,
    approveShow(oa_request_id, id, index) {
      if (oa_request_id) {
        // 调用新审批流程接口
        getContractApprovalSettlement(id)
          .then(res => {
            if (res.data.success) {
              this.new_contract_work_infos = res.data.data;
              // this.list[index].contract_work_infos = res.data.data.map(item => {
              //   return {
              //     create_time_str: item.operateDate + ' ' + item.operateTime,
              //     user: item.nodeName,
              //     result_str: item.operateType,
              //     comment: item.remark,
              //     // comment: ,
              //     // create_time: ,
              //     // create_time_str: ,
              //     // id: ,
              //     // next_opration: ,
              //     // next_user_id: ,
              //     // pre_node_id: ,
              //     // result: ,
              //     // result_str: ,
              //     // user: ,
              //     // user_id: ,
              //     // work_id: ,
              //     // work_type: ,
              //   };
              // });
            } else {
              this.$message({
                type: 'warning',
                message: res.data.message,
                duration: 2000,
                showClose: true,
              });
            }
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '审批流程获取失败，请重试',
              duration: 2000,
              showClose: true,
            });
          });
      }
    },
    // 删除
    deleteProtocol(id, index) {
      deleteContractStatements(id)
        .then(res => {
          if (res.data.success) {
            this.$message.success('删除成功', {
              duration: 2000,
              showClose: true,
            });
            this.tableData.splice(index, 1);
            this.contract_file_dialog.splice(index, 1);
            this.isDialogVisibleList.splice(index, 1);
          } else {
            this.$message.error(res.data.message, {
              duration: 2000,
              showClose: true,
            });
          }
        })
        .catch(() => {
          this.$message.error('删除失败，请稍后重试', {
            duration: 2000,
            showClose: true,
          });
        });
    },
    // 翻页 每页数量发生变化
    handleSizeChange: function (val) {
      this.pagination.pageSize = val;
      this.$emit('handle-size-change', val);
      this.getContractAttachment();
    },
    // 翻页
    handleCurrentChange: function (val) {
      this.getContractAttachment();
    },
    // 获取合同附件列表
    getContractAttachment() {
      const params = {
        contract_id: this.$route.params.id,
      };
      params.num = this.pagination.pageSize;
      params.page_num = this.pagination.currentPage;
      // params. = this.pagination.currentPage
      getContractStatement(params)
        .then(res => {
          if (res.data.success) {
            this.tableData = res.data.data.data.map(item => {
              item.attachment_url_list = item.attachment_url.split(',');
              return item;
            });
            this.contract_file_dialog = this.tableData.map(() => {
              return false;
            });
            this.isDialogVisibleList = this.tableData.map(() => {
              return false;
            });
            this.pagination.total = res.data.data.total;
          } else {
            this.$message.warning(res.data.message);
          }
        })
        .catch(() => {
          this.$message.error('合同附件列表获取失败，请稍后重试', {
            duration: 2000,
            showClose: true,
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
@import '@/assets/scss/public.scss';
$color-primary: var(--theme-color);
::v-deep .el-table {
  ::v-deep .el-table__body {
    ::v-deep .el-table__row td {
      border-bottom: 1px solid var(--table-border-color) !important;
    }
  }
}
::v-deep .el-table__body-wrapper {
  margin-bottom: 10px;
}
.content-block {
  .block-content {
    padding: 10px 0;
    ::v-deep .el-table {
      border-radius: 4px !important;
      tr {
        height: 58px;
        th > .cell {
          font-weight: 600;
          color: var(--text-des-color);
          font-size: 14px;
          background: #fafafa;
        }
      }
    }
  }
}
::v-deep .el-dialog {
  padding: 0 !important;
  ::v-deep .el-dialog__header {
    background-color: #f6f6f6;
    padding: 0 20px;
    font-size: 14px;
  }
  ::v-deep .el-dialog__body {
    border-radius: 0;
    padding: 0 20px;
    padding-bottom: 20px;
  }
}
.nodata {
  margin: auto;
  margin-top: 120px;
  font-size: 12px;
  color: var(--text-des-color);
  img {
    width: 190px;
    height: 172px;
  }
  > div {
    span {
      margin-top: -27px;
      color: $color-primary;
      cursor: pointer;
    }
  }
}
::v-deep .el-table__header-wrapper {
  .has-gutter {
    tr {
      height: 60px;
    }
    th {
      background-color: #fafafa !important;
      border: none !important;
    }
  }
}
</style>
