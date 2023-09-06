<style lang="scss" scoped>
$color-primary: var(--theme-color);
#customer-contract-approval {
  /deep/ .el-table td {
    padding: 27px 0;
  }
  /deep/ .el-table th {
    padding: 23px 0;
  }
  .condition {
    background: #fff;
    border-radius: 10px;
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
      .condition-label2 {
        color: var(--text-des-color);
      }
      .condition-value {
        display: inline-block;
        padding-left: 80px;
        /* 采买渠道 */
        .sell-chance {
          padding-top: 15px;
          overflow: hidden;
          font-size: 16px;
          color: var(--text-des-color);
          li {
            float: left;
            margin: 0 20px;
            cursor: pointer;
            padding-bottom: 5px;
            height: 30px;
            color: var(--text-des-color);
            &.active {
              // color: $color-primary;
              padding: 0 8px;
              &::after {
                width: 100%;
              }
            }
            &:hover {
              color: $color-primary;
            }
          }
        }
        /* 合同类型 */
        .contract-type {
          padding-bottom: 12px;
          margin-left: 10px;
          .select {
            width: 160px;
            height: 32px;
            margin-top: 14px;
            /deep/ .el-input__inner {
              height: 32px;
              line-height: 32px;
              border-radius: 10px;
            }
            /deep/ .el-input__icon {
              line-height: 32px;
            }
          }
          .contract-type-label {
            font-size: 16px;
            color: var(--text-color);
            margin-left: 20px;
          }
        }
        /* 搜索合同 */
        .search-contract {
          .input {
            width: 260px;
            margin-top: 14px;
            display: inline-block;
            vertical-align: middle;
            margin-right: 10px;
            /deep/ .el-input__inner {
              height: 32px;
              border-radius: 10px;
            }
          }
          .el-button {
            vertical-align: middle;
            margin-top: 14px;
            font-size: 14px;
            padding: 7px 15px;
          }
        }
      }
    }
  }
  .result-list {
    border-radius: 10px;
    margin-top: 12px;
    padding: 12px;
    background: #fff;
    // .opreate-btns {
    //   margin-bottom: 12px;
    //   .el-button {
    //     font-size: 14px;
    //     padding: 7px 0;
    //     width: 80px;
    //     text-align: center;
    //   }
    // }
    .contract-sale-chance-reference {
      cursor: pointer;
      position: relative;
      padding-right: 20px;
      // display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .icon-arrow {
        position: absolute;
        top: 3px;
        right: 0;
        margin-left: 6px;
      }
    }
    .one-sale-chance {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .status-dot {
      display: inline-block;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      vertical-align: middle;
      &.status-dot-1 {
        background-color: #ff9434;
      }
      &.status-dot-2 {
        background-color: #2877ff;
      }
      &.status-dot-3 {
        background-color: #f43846;
      }
      &.status-dot-4 {
        background-color: #ff9434;
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
    .create-time {
      color: var(--text-des-color);
    }
    .status-text {
      vertical-align: middle;
      color: $color-primary;
    }
    .customer-name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .oprate-btn {
      display: inline-block;
      width: 34px;
      height: 34px;
      margin: 0 2px;
      cursor: pointer;
      &.has-no-attachment {
        cursor: no-drop;
        &:hover {
          background: #ecf0ff url(../../../assets/img/contract_opreate_icon_annex_1.png) no-repeat
            center center;
        }
      }
    }
    .contract-uid {
      color: $color-primary;
    }
    .contract-type {
      color: var(--text-des-color);
      font-size: 16px;
    }
    .contract-pagination {
      padding: 0;
      margin-top: 12px;
      /deep/ .el-input.el-input--mini.el-input--suffix {
        margin: 0;
      }
    }
    .empty-placeholder {
      padding: 150px 0;
      img {
        width: 110px;
        height: 110px;
      }
    }
    .see-reason-btn {
      color: #ff8549;
    }
    .approve-btn-wrap {
      width: 34px;
      display: inline-block;
    }
  }
}
.color-red {
  color: #ff731e;
}
</style>
<style>
.contract-sale-chance-popover.el-popover {
  min-width: 300px;
  /* padding: 0 12px; */
}
.contract-sale-chance-popover .contract-sale-chance li {
  /* height: 50px;
    line-height: 50px;
    min-width: 106px;
    border-bottom: #EBEBEB dashed 1px; */
  display: inline-block;
  background: #f2f2f2;
  margin: 3px;
  padding: 4px 6px;
}
.contract-sale-chance-popover .contract-sale-chance li:last-child {
  border-bottom: none;
}
.contract-oprete-popper {
  min-width: auto;
  padding: 7px 12px;
}
.delete-contract-alert.el-message-box .el-message-box__content {
  height: initial;
}
.delete-contract-alert.el-message-box .el-message-box__content .el-message-box__message {
  top: 0;
}
.approve-progress-popper {
  padding: 0;
}
</style>

<template>
  <div id="customer-contract-approval" class="list-left">
    <div class="condition">
      <div class="condition-line">
        <span class="condition-label condition-label2">采买渠道:</span>
        <div class="condition-value">
          <ul class="sell-chance">
            <li :class="condition.sale_chance ? '' : 'active'" @click="handleSelectSaleChance('')">
              全部
            </li>
            <li
              v-for="(chance, index) in saleChances"
              :class="condition.sale_chance === chance.value ? 'active' : ''"
              :key="index"
              @click="handleSelectSaleChance(chance.value)"
            >
              {{ chance.label }}
            </li>
          </ul>
        </div>
      </div>
      <div class="condition-line">
        <span class="condition-label">合同状态:</span>
        <div class="condition-value">
          <div class="contract-type">
            <!-- <el-select class="select" v-model="condition.contract_type" clearable placeholder="请选择" @clear="queryContract">
              <el-option
                v-for="item in contractTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>-->
            <!-- <span class="contract-type-label">合同状态:</span> -->
            <el-select
              class="select"
              v-model="condition.contract_status"
              clearable
              placeholder="请选择"
              @clear="queryContract"
            >
              <el-option
                v-for="item in contractStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="contract-type-label">客户经理:</span>
            <el-select
              class="select"
              v-model="condition.manager_id"
              clearable
              placeholder="请选择"
              @clear="queryContract"
            >
              <el-option
                v-for="(item, index) in accountManager"
                :key="index"
                :label="item.username"
                :value="item.id"
              ></el-option>
            </el-select>
            <span class="contract-type-label">合同是否收回:</span>
            <el-select
              class="select"
              v-model="condition.is_recycled"
              clearable
              placeholder="请选择"
              @clear="queryContract"
            >
              <el-option label="已收回" :value="1"></el-option>
              <el-option label="未收回" :value="0"></el-option>
            </el-select>
            <span class="contract-type-label">附件状态:</span>
            <el-select
              class="select"
              v-model="condition.last_annex_status"
              clearable
              placeholder="请选择"
              @clear="queryContract"
            >
              <el-option
                v-for="item in contractStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="condition-line">
        <span class="condition-label">供应商名称:</span>
        <div class="condition-value" style="padding-left: 95px">
          <div class="contract-type search-contract">
            <el-input
              class="input"
              v-model="condition.partner_name"
              placeholder="请输入供应商名称"
              clearable
              @clear="queryContract"
            ></el-input>
            <span class="contract-type-label" style="position: relative; top: 7px">合同编号:</span>
            <el-input
              class="input"
              v-model="condition.contract_uid"
              placeholder="请输入合同编号"
              clearable
              @clear="queryContract"
            ></el-input>
            <el-button class="btn-blue" type="primary" size="small" @click="handleSearchClick"
              >查询</el-button
            >
            <tg-button
              type="negative"
              size="small"
              @click="handleResetCondition"
              style="vertical-align: middle; margin-top: 14px; margin-left: 10px"
              >重置</tg-button
            >
          </div>
        </div>
      </div>
    </div>
    <div class="result-list list-left">
      <!-- <div v-if="currentUserInfo" class="opreate-btns">
        <el-button v-if="currentUserInfo.user_rights.includes(RIGHT_CODE.add_contract)" type="primary" size="small" @click="showAddContractDialog">新增合同</el-button>
        <el-button v-if="currentUserInfo.user_rights.includes(RIGHT_CODE.del_contract)" size="small" @click="handleDeleteContracts">删除</el-button>
      </div>-->
      <el-table
        :data="list"
        stripe
        style="width: 100%"
        v-loading="loading"
        :header-cell-style="{ backgroundColor: 'detail_data', color: 'var(--text-second-color)' }"
        :cell-style="{ cursor: 'pointer' }"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <el-table-column type="index" label="序号" width="60" fixed="left" align="center" />
        <el-table-column
          prop="contract_uid"
          label="合同编号/合同类型"
          min-width="100"
          max-width="220"
        >
          <template #default="{ row }">
            <div class="contract-uid size-normal">{{ row.contract_info.contract_uid }}</div>
            <p class="contract-type">{{ row.contract_info.contract_type_str }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="customer_name" label="供应商名称" min-width="100">
          <template #default="{ row }">
            <el-popover placement="top" trigger="hover" :content="row.partner_info.partner_name">
              <template slot="reference">
                <div class="customer-name">{{ row.partner_info.partner_name }}</div>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="contract_type"
          :formatter="row => {
            const type = contractTypeOptions.find(item => item.value === row.contract_info.contract_type)
            return type ? type.label : ''
          }"
          label="合同类型"
          min-width="80">
        </el-table-column>-->
        <el-table-column prop="contract_amount" label="合同金额" align="left">
          <!-- :formatter="row => formatAmount(row.contract_detail.contract_amount, 2)" -->
          <template #default="{ row }">
            <div class="color-red">
              {{
                row.contract_detail.contract_amount
                  ? row.contract_detail.contract_amount !== '0.00'
                    ? formatAmount(row.contract_detail.contract_amount, 2)
                    : row.contract_detail.contract_amount
                  : '--'
              }}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="discount"
          label="合同折扣/折"
          :formatter="row => row.contract_detail.discount ? formatDiscount(row.contract_detail.discount) : '--'"
          min-width="100"
          align="center">
        </el-table-column>-->
        <el-table-column prop="sale_chance" label="采买渠道" align="left">
          <template #default="{ row }">
            <template v-if="row.contract_info.sale_chance.length === 1">
              <el-popover
                placement="top"
                trigger="hover"
                :content="row.contract_info.sale_chance[0].sale_chance_name"
              >
                <template slot="reference">
                  <span class="one-sale-chance">{{
                    row.contract_info.sale_chance[0]
                      ? row.contract_info.sale_chance[0].sale_chance_name
                      : ''
                  }}</span>
                </template>
              </el-popover>
            </template>
            <el-popover
              v-if="row.contract_info.sale_chance.length > 1"
              popper-class="contract-sale-chance-popover"
              placement="top"
              width="130"
              trigger="hover"
            >
              <template slot="reference">
                <span class="contract-sale-chance-reference">
                  {{ row.contract_info.sale_chance[0].sale_chance_name }}
                  <i class="icon-arrow el-icon-arrow-down"></i>
                </span>
              </template>
              <ul class="contract-sale-chance">
                <li v-for="(chance, index) in row.contract_info.sale_chance" :key="index">
                  {{ chance.sale_chance_name }}
                </li>
              </ul>
            </el-popover>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="manager_id"
          label="客户经理"
          :formatter="row => row.contract_info.manager_name || '--'"
          min-width="100">
        </el-table-column>-->
        <el-table-column prop="gmt_create" label="创建人/时间">
          <template #default="{ row }">
            <p>{{ row.contract_info.add_by_name }}</p>
            <p class="create-time">{{ row.contract_info.create_time_str.split(' ')[0] }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="contract_status" label="合同状态" width="120">
          <template #default="{ row }">
            <em :class="`status-dot status-dot-${row.contract_info.contract_status}`"></em>
            <el-popover
              v-if="
                row.contract_work_infos.length > 0 &&
                row.contract_info.contract_status !== 2 &&
                row.contract_info.contract_status !== 5
              "
              placement="bottom-end"
              width="246"
              trigger="hover"
              popper-class="approve-progress-popper"
            >
              <!-- 审批 -->
              <template slot="reference">
                <span :class="`status-dot-${row.contract_info.contract_status}`">{{
                  row.contract_info.contract_status_str
                }}</span>
              </template>
              <approve-progress :work-infos="row.contract_work_infos" :contract-info="row" />
            </el-popover>
            <!-- 正常、作废 -->
            <span :class="`status-dot-${row.contract_info.contract_status}`" v-else>{{
              row.contract_info.contract_status_str
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="附件状态" width="120">
          <template #default="{ row }">
            <em
              v-if="row.contract_annex_info && row.contract_annex_info.length > 0"
              :class="`status-dot status-dot-${row.contract_annex_info[0].contract_annex_status}`"
            ></em>
            <template v-if="row.contract_annex_info && row.contract_annex_info.length > 0">
              <el-popover
                v-if="
                  row.contract_annex_info[0].contract_annex_status !== 2 &&
                  row.contract_annex_info[0].contract_annex_status !== 5
                "
                placement="bottom-end"
                width="246"
                trigger="hover"
                popper-class="approve-progress-popper"
              >
                <template slot="reference">
                  <span
                    v-if="
                      row.contract_annex_info[0].contract_annex_status !== 2 &&
                      row.contract_annex_info[0].contract_annex_status !== 5
                    "
                    :class="`status-dot-${row.contract_annex_info[0].contract_annex_status}`"
                    >{{ row.contract_annex_info[0].contract_annex_status_str || '--' }}</span
                  >
                </template>
                <approve-progress
                  type="fj"
                  style="color: red"
                  :work-infos="row.contract_annex_work_infos"
                  :contract-info="row"
                />
              </el-popover>
              <!-- 作废 -->
              <span
                :class="`status-dot-${row.contract_annex_info[0].contract_annex_status}`"
                v-else
                >{{ row.contract_annex_info[0].contract_annex_status_str || '--' }}</span
              >
            </template>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="合同是否收回" width="120" align="center">
          <template #default="{ row, $index }">
            <!-- 风控显示操作按钮，其他人显示状态文字 -->
            <span
              v-if="row.contract_info.contract_status === 2 && getCurrentUserHasRecycleRight()"
              @click.stop="() => false"
            >
              <el-switch
                v-model="recycledStatusList[$index].status"
                @change="handleContractRecycleChange(row, $index)"
              ></el-switch>
              <span style="font-size: 12px; color: #666">{{
                recycledStatusList[$index].status ? '已收回' : '未收回'
              }}</span>
            </span>
            <span
              v-if="row.contract_info.contract_status === 2 && !getCurrentUserHasRecycleRight()"
              style="color: #666; font-size: 14px"
              >{{ row.contract_info.is_recycled === 1 ? '已收回' : '未收回' }}</span
            >
            <span v-if="row.contract_info.contract_status !== 2">--</span>
          </template>
        </el-table-column>
        <el-table-column label="合同附件" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <!-- 无补充附件弹窗 -->
            <el-popover popper-class="contract-oprete-popper" placement="top" trigger="hover">
              <template slot="reference">
                <span @click.stop="handleAttachmentLinkClick(row.contract_detail.attachment_url)"
                  >查看</span
                >
              </template>
              <contract-scanning :detail="row" />
            </el-popover>
            <!-- 有补充附件弹窗 -->
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <!-- 无补充附件弹窗 -->
            <!-- 审批 -->
            <!-- <span class="approve-btn-wrap"> -->
            <el-popover
              v-if="
                hasApprovalRight &&
                row.contract_info.contract_status !== 2 &&
                row.contract_info.contract_status !== 5
              "
              popper-class="contract-oprete-popper"
              placement="top"
              trigger="hover"
              content="审核"
            >
              <template slot="reference">
                <span
                  class="iconfont icon-shenhe"
                  @click.stop="handleReviewContractClick(row.contract_info)"
                ></span>
              </template>
            </el-popover>
            <span v-else>--</span>
            <!-- </span> -->
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
        class="contract-pagination"
        :current-page.sync="pagination.currentPage"
        :page-sizes.sync="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
      ></el-pagination>
    </div>
    <add-contract ref="addContractDialog" @added="queryContract"></add-contract>
    <review-dialog ref="reviewDialog" @approved="queryContract"></review-dialog>
  </div>
</template>

<script>
import { contractTypeOptions, contractStatusOptions, saleChances } from '@/const/options';
import AddContract from '@/views/customer/components/addContract';
import ReviewDialog from '@/views/customer/components/reviewDialog';
import ApproveProgress from '@/views/customer/components/approveProgress';
// import AttachmentListPopover from '@/views/customer/components/attachmentListPopover';
import contractScanning from '@/views/customer/components/contractScanning';
import { queryContract, queryUserNames, deleteContracts, setContractRecycle } from '@/api/customer';
import { getToken } from '@/utils/token';
// import { getUserInfo } from '@/api/auth'
import { CONSTRACT_APPROVER } from '@/utils/config';
import { ROLE_CODE, RIGHT_CODE } from '@/const/roleCode';

export default {
  name: 'ContractApproval',
  components: {
    AddContract,
    ReviewDialog,
    ApproveProgress,
    // AttachmentListPopover,
    contractScanning,
  },
  data() {
    return {
      CONSTRACT_APPROVER, // 审批人id常量
      ROLE_CODE,
      RIGHT_CODE,
      contractTypeOptions,
      contractStatusOptions,
      saleChances,
      accountManager: [],
      condition: {
        sale_chance: undefined,
        contract_status: undefined,
        manager_id: undefined,
        is_recycled: undefined,
        partner_name: '',
        contract_uid: '',
        partner_type: 2,
        last_annex_status: undefined,
      },
      list: [],
      recycledStatusList: [],
      loading: true,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
        total: 0,
      },
      selection: [], // 被选中的数据
      currentUserInfo: null,
      recycled: false,
    };
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
  async mounted() {
    // debugger
    await this.getAccountManager();
    // debugger
    // await this.getUserInfo()
    // 获取当前用户信息
    this.currentUserInfo = this.$store.getters['user/getUserInfo'];
    // debugger
    // this.queryContract()
  },
  activated() {
    // debugger
    this.queryContract();
    this.getUserId();
  },
  methods: {
    // 获取用户id刷新dom
    getUserId() {
      this.currentUserInfo = this.$store.getters['user/getUserInfo'];
    },
    formatDiscount(discount) {
      discount = parseFloat(discount);
      return discount.toFixed(2);
    },
    // 数字千位格式化
    formatAmount(s, n) {
      n = n > 0 && n <= 20 ? n : 2;
      s = parseFloat((s + '').replace(/[^\d\\.-]/g, '')).toFixed(n) + '';
      const l = s.split('.')[0].split('').reverse();
      const r = s.split('.')[1];
      let t = '';
      for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '');
      }
      return '￥' + t.split('').reverse().join('') + '.' + r;
    },
    // 新增合同弹窗显示
    showAddContractDialog() {
      this.$refs.addContractDialog.show();
    },
    // 选择采买渠道
    handleSelectSaleChance(chanceValue) {
      this.condition.sale_chance = chanceValue;
      this.pagination.currentPage = 1;
      this.queryContract();
    },
    // 获取客户经理
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
    // 查询合同
    queryContract() {
      this.condition.page_num = this.pagination.currentPage;
      this.condition.num = this.pagination.pageSize;
      this.loading = true;
      queryContract(this.condition)
        .then(res => {
          if (res.data.success) {
            this.list = res.data.data.data;
            // 处理收回标志
            // this.list = this.list.map(item => {
            //   item.contract_info.recycled = item.contract_info.is_recycled === 1
            //   return item
            // })
            this.pagination.total = res.data.data.total;
            // 处理合同收回状态
            this.recycledStatusList = this.list.map(item => {
              // item.contract_info.recycled = item.contract_info.is_recycled === 1
              return {
                status: item.contract_info.is_recycled === 1,
                loading: false,
              };
            });

            // console.log(res.data.data)
          } else {
            this.$message({
              type: 'warning',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
          }
          this.loading = false;
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '查询合同失败，稍后重试',
            duration: 2000,
            showClose: true,
          });
          console.log(error.message);
          this.loading = false;
        });
    },
    // 表格多选发生改变
    handleSelectionChange(selection) {
      this.selection = selection;
    },
    // 批量删除合同
    handleDeleteContracts() {
      if (this.selection.length === 0) {
        this.$message({
          type: 'warning',
          message: '至少选择一条数据',
          showClose: true,
        });
        return false;
      }
      // console.log(this.currentUserInfo)
      const canDeleteCount = this.selection.reduce((sum, item) => {
        // sum += item.contract_info.contract_status === 2 ? 1 : 0
        // sum += item.contract_info.contract_status === this.currentUserInfo.id ? 1 : 0
        // 审核中和正常的合同不能删除，当前用户是该合同的客户经理可以删除，当前用户是该合同的创建者可以删除
        if (
          item.contract_info.contract_status !== 2 &&
          item.contract_info.contract_status !== 4 &&
          (this.currentUserInfo.id === item.contract_info.manager_id ||
            this.currentUserInfo.id === item.contract_detail.add_by)
        ) {
          sum += 1;
        }
        return sum;
      }, 0);

      this.$confirm(
        `可删列表 <span style="font-weight: 600;color:red;">${canDeleteCount}</span> 条<br>正常状态/非本人创建/客户经理非本人的情况下，<br>不允许删除`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'delete-contract-alert',
          center: true,
          dangerouslyUseHTMLString: true,
        },
      )
        .then(() => {
          if (canDeleteCount === 0) {
            this.$message({
              type: 'warning',
              message: '没有您可以删除的合同',
              duration: 2000,
              showClose: true,
            });
          } else {
            deleteContracts({
              contract_id: this.selection.map(item => item.contract_info.id),
            })
              .then(res => {
                if (res.data.success) {
                  this.queryContract();
                } else {
                  this.$message({
                    type: 'warning',
                    message: res.data.message,
                    duration: 2000,
                    showClose: true,
                  });
                }
              })
              .catch(error => {
                this.$message({
                  type: 'error',
                  message: '合同删除失败，稍后重试',
                  duration: 2000,
                  showClose: true,
                });
                console.log(error.message);
              });
          }
        })
        .catch(() => {
          /* do nth */
        });
    },
    // 重置搜索条件
    handleResetCondition() {
      this.condition = {
        sale_chance: undefined,
        contract_status: undefined,
        manager_id: undefined,
        is_recycled: undefined,
        partner_name: '',
        contract_uid: '',
        partner_type: 2,
        last_annex_status: undefined,
      };
      this.queryContract();
    },
    // 点击审核合同
    handleReviewContractClick(contractInfo) {
      this.$refs.reviewDialog.show(contractInfo);
    },
    // 点击进入合同详情
    handleRowClick(row) {
      window.open(`/supplier/contract/${row.contract_info.id}`);
    },
    // 查看附件
    handleAttachmentLinkClick(attachmentUrl) {
      if (!attachmentUrl) return false;
      const token = getToken();
      const link = document.createElement('a');
      link.href = attachmentUrl + '?Authorization=' + token;
      link.target = '_blank';
      link.click();
    },
    // 翻页
    handleCurrentChange() {
      // console.log(this.pagination.currentPage)
      this.queryContract();
    },
    handlePageSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.queryContract();
    },
    // 合同收回按钮
    handleContractRecycleChange(row, $index) {
      // debugger
      // console.log(row, this.recycledStatusList[$index].status)
      setContractRecycle({
        id: row.contract_info.id,
        is_recycled: this.recycledStatusList[$index].status ? 1 : 0,
      })
        .then(res => {
          if (res.data.success) {
            // this.queryContract()
            this.$message({
              type: 'success',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
          } else {
            // 出错，恢复之前的状态
            this.recycledStatusList[$index].status = !this.recycledStatusList[$index].status;
            this.$message({
              type: 'warning',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
          }
        })
        .catch(error => {
          // 出错，恢复之前的状态
          this.recycledStatusList[$index].status = !this.recycledStatusList[$index].status;
          this.$message({
            type: 'error',
            message: '设置合同收回状态失败，稍后重试',
            duration: 2000,
            showClose: true,
          });
          console.log(error.message);
        });
    },
    // 获取当前用户的角色码
    getCurrentUserHasRecycleRight() {
      if (this.currentUserInfo && this.currentUserInfo.user_rights.length > 0) {
        return this.currentUserInfo.user_rights.includes(RIGHT_CODE.recycle_contract);
      } else {
        return false;
      }
    },
    // 点击搜索按钮
    handleSearchClick() {
      this.pagination.currentPage = 1;
      this.queryContract();
    },
    // 查询当前用户信息
    // async getUserInfo () {
    //   try {
    //     const res = await getUserInfo()
    //     // debugger
    //     if (res.status === 200 && res.data.success) {
    //       this.currentUserInfo = res.data.data
    //     } else {
    //       this.$message({
    //         type: 'warning',
    //         message: res.data.message,
    //         duration: 2000,
    //         showClose: true
    //       })
    //     }
    //   } catch (error) {
    //     this.$message({
    //       type: 'error',
    //       message: '用户信息获取失败，稍后重试',
    //       duration: 2000,
    //       showClose: true
    //     })
    //     console.log(error)
    //   }
    // }
    // 导出合同列表
    // exportContracts () {
    //   if (this.selection.length === 0) {
    //     this.$message({
    //       type: 'warning',
    //       message: '至少选择一条数据',
    //       showClose: true
    //     })
    //     return false
    //   }
    //   exportContracts({
    //     contract_ids: this.selection.map(item => item.contract_info.id)
    //   }).then(res => {

    //   }).catch(error => {

    //   })
    // }
  },
  watch: {
    $route: {
      // 从别处进入触发刷新，详情页返回不触发
      handler(val, oldval) {
        if (val.name === '合同审批' && oldval.name !== '合同审批详情') {
          this.handleResetCondition();
        }
      },
    },
  },
};
</script>
