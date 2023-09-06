<!--
 * @Description: 客户合同
 * @Author: 白青
 * @Date: 2019-08-19 13:43:20
 * @LastEditTime: 2020-12-12 11:36:07
 * @LastEditors: 矢车
 -->
<style lang="scss" scoped>
$color-primary: var(--theme-color);
.icon-shangchuankaipiaopingzheng:before {
  content: '\E620';
  font-size: 24px;
}
.icon-zuofeihetong:before {
  font-size: 24px;
}
/deep/ .el-table td {
  padding: 28px 0;
}
/deep/ .el-table th {
  padding: 22px 0;
  min-height: 50px;
}
#contract {
  .condition {
    border-radius: 10px;
    background: #fff;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.04);
    .condition-line {
      color: #666;
      min-height: 60px;
      position: relative;
      &:last-child {
        border-bottom: none;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        // width: 400px;
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
        /* 销售渠道 */

        .sell-chance {
          padding-top: 16px;
          overflow: hidden;
          li {
            float: left;
            padding: 0 10px;
            margin: 0 10px;
            margin-bottom: 10px;
            cursor: pointer;
            height: 28px;
            line-height: 28px;
            font-size: 16px;
            color: var(--text-des-color);
            // &.active {
            //   color: #fff!important;
            //   background: $color-primary;
            //   border-radius: 15px;
            // }
          }
        }
        /* 合同类型 */
        .contract-type {
          padding-bottom: 12px;
          padding-left: 10px;
          .select {
            width: 160px;
            height: 32px;
            margin-top: 14px;
            /deep/ .el-input__inner {
              height: 32px;
              line-height: 32px;
            }
            /deep/ .el-input__icon {
              line-height: 32px;
            }
          }
          .contract-type-label {
            color: var(--text-color);
            margin-left: 20px;
            font-size: 16px;
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
    margin-top: 12px;
    padding: 12px;
    background: #fff;
    border-radius: 10px;
    .opreate-btns {
      margin-bottom: 12px;
      .el-button {
        font-size: 14px;
        width: 100px;
        height: 36px;
        text-align: center;
      }
    }
    .contract-sale-chance-reference {
      cursor: pointer;
      position: relative;
      padding-right: 20px;
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
    // 正常
    .status-dot-all {
      color: $color-primary;
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
    }
    .customer-name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .oprate-btn {
      vertical-align: bottom;
      display: inline-block;
      width: 34px;
      height: 34px;
      margin: 0 2px;
      cursor: pointer;
    }
    .contract-uid {
      color: $color-primary;
    }
    .contract-type {
      color: var(--text-third-color);
      font-size: 12px;
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
      // color: $color-blue;
      color: #ff9434;
    }
    .see-reason-btn2 {
      color: #2877ff;
    }
    .status-dot.status-dot-2 {
      color: red;
    }
    .approve-btn-wrap {
      width: 34px;
      display: inline-block;
    }
  }
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
  background: #eef4fa;
  margin: 3px;
  padding: 4px 10px;
  border-radius: 6px;
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
/* 作废弹窗样式 */
.invalid-confirm.el-message-box .el-message-box__content {
  height: initial;
  text-align: center;
}
.invalid-confirm.el-message-box .el-message-box__content .el-message-box__message {
  top: initial;
}
.invalid-confirm.el-message-box .el-message-box__content .el-message-box__status {
  position: initial;
}
/* 合同附件弹窗样式 */
.contract-attachment-popper {
  border-radius: 2px;
  padding: 0 20px;
}
</style>

<template>
  <div id="contract">
    <div class="condition">
      <div class="condition-line">
        <span class="condition-label condition-label2">销售渠道:</span>
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
        <span class="condition-label">合同类型:</span>
        <div class="condition-value">
          <div class="contract-type">
            <el-select
              class="select"
              v-model="condition.contract_type"
              clearable
              placeholder="请选择"
              @clear="queryContract"
            >
              <el-option
                v-for="item in contractTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="contract-type-label">合同状态:</span>
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
        <span class="condition-label">客户名称:</span>
        <div class="condition-value">
          <div class="contract-type search-contract">
            <el-input
              class="input"
              v-model="condition.partner_name"
              placeholder="请输入客户名称"
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
            <el-button type="primary" size="small" class="btn-blue" @click="handleSearchClick"
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
    <div class="result-list Customer-contract">
      <div v-if="currentUserInfo" class="opreate-btns">
        <el-button
          v-if="currentUserInfo.user_rights.includes(RIGHT_CODE.add_contract)"
          type="primary"
          size="small"
          @click="showAddContractDialog"
          class="rect-100-36 btn-blue"
          >新增合同</el-button
        >
        <el-button
          v-if="currentUserInfo.user_rights.includes(RIGHT_CODE.add_contract)"
          type="primary"
          size="small"
          @click="showAddContractAnnexDialog"
          class="rect-100-36 btn-blue"
          >新增附件</el-button
        >
        <el-button
          v-if="currentUserInfo.user_rights.includes(RIGHT_CODE.del_contract)"
          size="small"
          @click="handleDeleteContracts"
          class="rect-100-36 color-999"
          >删除</el-button
        >
      </div>
      <el-table
        :data="list"
        stripe
        style="width: 100%"
        v-loading="loading"
        :header-cell-style="{
          backgroundColor: 'var(--table-thead-th-bg-color)',
          color: 'var(--text-second-color)',
        }"
        :cell-style="{ cursor: 'pointer' }"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="50" fixed="left"></el-table-column>
        <el-table-column
          :formatter="
            (row, column, cellValue, index) => (pagination.currentPage - 1) * 10 + (index + 1)
          "
          label="序号"
          width="60"
          fixed="left"
          align="center"
          class="size-normal"
        />
        <el-table-column
          prop="contract_uid"
          label="合同编号/合同类型"
          min-width="140"
          max-width="270"
        >
          <template #default="{ row }">
            <div class="contract-uid size-normal">{{ row.contract_info.contract_uid }}</div>
            <p class="contract-type olor-999">{{ row.contract_info.contract_type_str }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="customer_name" label="客户名称" min-width="130" max-width="220">
          <template #default="{ row }">
            <el-popover
              placement="top"
              trigger="hover"
              :content="row.partner_info.partner_name || row.contract_info.customer_name"
            >
              <template slot="reference">
                <div class="customer-name size-medium color-666">
                  {{ row.partner_info.partner_name || row.contract_info.customer_name || '--' }}
                </div>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="contract_amount" label="合同金额" align="left" min-width="100">
          <template #default="{ row }">
            <div class="many size-medium">
              {{ '￥' + formatAmount(row.contract_detail.contract_amount, 2) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="sale_chance"
          label="销售渠道"
          align="left"
          class="marketing-channel"
          min-width="120"
        >
          <template v-slot="{ row }">
            <template v-if="row.contract_info.sale_chance.length === 1">
              <span class="one-sale-chance size-medium color-666">{{
                row.contract_info.sale_chance[0]
                  ? row.contract_info.sale_chance[0].sale_chance_name
                  : ''
              }}</span>
            </template>
            <el-popover
              v-if="row.contract_info.sale_chance.length > 1"
              popper-class="contract-sale-chance-popover"
              placement="top"
              width="130"
              trigger="hover"
            >
              <template slot="reference">
                <div>
                  <p class="contract-sale-chance-reference">
                    {{ row.contract_info.sale_chance[0].sale_chance_name }}
                  </p>
                  <p
                    v-if="row.contract_info.sale_chance.length > 1"
                    class="contract-sale-chance-reference"
                  >
                    {{ row.contract_info.sale_chance[1].sale_chance_name }}
                  </p>
                  <p
                    v-if="row.contract_info.sale_chance.length > 2"
                    class="contract-sale-chance-reference"
                  >
                    {{ row.contract_info.sale_chance[2].sale_chance_name }}
                  </p>
                  <p
                    v-if="row.contract_info.sale_chance.length > 3"
                    class="contract-sale-chance-reference"
                  >
                    ...
                  </p>
                </div>
              </template>
              <ul class="contract-sale-chance">
                <li v-for="(chance, index) in row.contract_info.sale_chance" :key="index">
                  {{ chance.sale_chance_name }}
                </li>
              </ul>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="gmt_create" label="创建人/时间" min-width="120" align="center">
          <template #default="{ row }">
            <p class="size-medium color-666">{{ row.contract_info.add_by_name }}</p>
            <p class="create-time size-medium color-999">
              {{
                row.contract_info.create_time_str
                  ? row.contract_info.create_time_str.split(' ')[0]
                  : '--'
              }}
            </p>
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
              <template slot="reference">
                <span :class="`status-dot-${row.contract_info.contract_status}`">{{
                  row.contract_info.contract_status_str
                }}</span>
              </template>
              <approve-progress :work-infos="row.contract_work_infos" :contract-info="row" />
            </el-popover>
            <span :class="`status-dot-${row.contract_info.contract_status}`" v-else>{{
              row.contract_info.contract_status_str || '--'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="附件状态" width="100">
          <template #default="{ row }">
            <template
              v-if="row.contract_annex_work_infos && row.contract_annex_work_infos.length > 0"
            >
              <em
                v-if="row.contract_annex_info && row.contract_annex_info.length > 0"
                :class="`status-dot status-dot-${row.contract_annex_info[0].contract_annex_status}`"
              ></em>
              <el-popover
                placement="bottom-end"
                width="246"
                trigger="hover"
                popper-class="approve-progress-popper"
                v-if="
                  row.contract_annex_info[0].contract_annex_status !== 2 &&
                  row.contract_annex_info[0].contract_annex_status !== 5
                "
              >
                <template slot="reference">
                  <span
                    v-if="
                      row.contract_annex_info[0].contract_annex_status !== 2 &&
                      row.contract_annex_info[0].contract_annex_status !== 5
                    "
                    :class="` status-dot-${row.contract_annex_info[0].contract_annex_status}`"
                    >{{ row.contract_annex_info[0].contract_annex_status_str || '--' }}</span
                  >
                </template>
                <approve-progress
                  type="fj"
                  :work-infos="row.contract_annex_work_infos"
                  :contract-info="row"
                />
              </el-popover>
              <span
                :class="` status-dot-${row.contract_annex_info[0].contract_annex_status}`"
                v-else-if="row.contract_annex_info && row.contract_annex_info.length > 0"
                >{{ row.contract_annex_info[0].contract_annex_status_str || '--' }}</span
              >
            </template>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="合同是否收回" width="120" align="center">
          <template #default="{ row }">
            <!-- 风控显示操作按钮，其他人显示状态文字 -->
            <!-- <span v-if="row.contract_info.contract_status === 2 && getCurrentUserRoleCode() === ROLE_CODE.risk_control_specialist" @click.stop="() => false">
              <el-switch
                v-model="recycledStatusList[$index].status"
                @change="handleContractRecycleChange(row, $index)">
              </el-switch>
              <span style="font-size:12px;color:#666;">{{recycledStatusList[$index].status ? '已收回' : '未收回'}}</span>
            </span>-->
            <span
              v-if="row.contract_info.contract_status === 2"
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
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <span v-if="currentUserInfo.user_rights.includes(RIGHT_CODE.upload_contract_scan)">
              <el-popover
                v-if="row.contract_info.contract_status === 2"
                popper-class="contract-oprete-popper"
                placement="top"
                trigger="hover"
                content="上传合同扫描件"
              >
                <template slot="reference">
                  <span
                    v-if="currentUserInfo.user_rights.includes(RIGHT_CODE.upload_contract_scan)"
                    class="iconfont icon-shangchuankaipiaopingzheng"
                    @click.stop="showAddContractCopyDialog(row)"
                  ></span>
                </template>
              </el-popover>
              <el-popover
                v-if="row.contract_info.contract_status !== 2"
                popper-class="contract-oprete-popper"
                placement="top"
                trigger="hover"
                content="合同非正常状态"
              >
                <template slot="reference">
                  <span
                    v-if="currentUserInfo.user_rights.includes(RIGHT_CODE.upload_contract_scan)"
                    @click.stop
                    class="iconfont icon-shangchuankaipiaopingzheng"
                    style="cursor: not-allowed"
                  ></span>
                </template>
              </el-popover>
            </span>
            <span v-else>--</span>
            <!-- 作废弹窗 -->
            <el-popover
              v-if="row.contract_info.contract_status === 2 && hasInvalidRight(row)"
              popper-class="contract-oprete-popper"
              placement="top"
              trigger="hover"
              content="作废合同"
            >
              <template slot="reference">
                <span
                  class="iconfont icon-zuofeihetong"
                  @click.stop="handleInvalidClick(row.contract_info.id)"
                ></span>
              </template>
            </el-popover>
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
    <add-attachment-dialog ref="addAttachmentDialog" @added="queryContract"></add-attachment-dialog>
    <!-- 新增合同复印件 -->
    <add-contract-copy-dialog
      ref="addContractCopyDialog"
      @added="queryContract"
      :contractId="contractId"
    ></add-contract-copy-dialog>
  </div>
</template>

<script>
import { contractTypeOptions, contractStatusOptions, saleChances } from '@/const/options';
import AddContractCopyDialog from '@/views/customer/components/addContractCopyDialog';
import AddContract from '@/views/customer/components/addContract';
import ReviewDialog from '@/views/customer/components/reviewDialog';
import AddAttachmentDialog from '@/views/customer/components/addAttachmentDialog';
import ApproveProgress from '@/views/customer/components/approveProgress';
// import AttachmentListPopover from '@/views/customer/components/attachmentListPopover';
import contractScanning from '@/views/customer/components/contractScanning';
import { queryContract, queryUserNames, deleteContracts, invalidContract } from '@/api/customer';
import { getToken } from '@/utils/token';
// import { getUserInfo } from '@/api/auth'
import { CONSTRACT_APPROVER } from '@/utils/config';
import { ROLE_CODE, RIGHT_CODE } from '@/const/roleCode';
import { fixFileToken } from '@/utils/http';
import { RouterNameProjectManage } from '@/const/router';

export default {
  name: 'ContractApproval',
  components: {
    AddContract,
    ReviewDialog,
    ApproveProgress,
    AddAttachmentDialog,
    // AttachmentListPopover,
    AddContractCopyDialog,
    contractScanning,
  },
  data() {
    return {
      contractId: null,
      CONSTRACT_APPROVER, // 审批人id常量
      ROLE_CODE,
      RIGHT_CODE,
      contractTypeOptions,
      contractStatusOptions,
      saleChances,
      accountManager: [],
      condition: {
        sale_chance: undefined,
        contract_type: undefined,
        contract_status: undefined,
        manager_id: undefined,
        is_recycled: undefined,
        contract_uid: '',
        partner_type: 1,
        last_annex_status: undefined,
        partner_name: '',
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
  },
  methods: {
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
      return t.split('').reverse().join('') + '.' + r;
    },
    // 新增合同弹窗显示
    showAddContractDialog() {
      this.$refs.addContractDialog.show();
    },
    // 新增合同复印件弹窗显示
    showAddContractCopyDialog(row) {
      // console.log(row);
      this.contractId = row.contract_detail.contract_id;
      this.$refs.addContractCopyDialog.show(row);
    },
    // 选择销售渠道
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
      this.list = [];
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
        contract_type: undefined,
        contract_status: undefined,
        manager_id: undefined,
        is_recycled: undefined,
        contract_uid: '',
        partner_type: 1,
        last_annex_status: undefined,
        partner_name: '',
      };
      this.queryContract();
    },
    // 点击审核合同
    handleReviewContractClick(contractInfo) {
      this.$refs.reviewDialog.show(contractInfo);
    },
    // 点击进入合同详情
    handleRowClick(row) {
      // console.log(row)
      this.$router.push({
        name: RouterNameProjectManage.marketing.contract.customer.list,
        params: {
          id: row.contract_info.id,
        },
        query: {
          // id: row.contract_info.id,
          contract_type: row.contract_info.contract_type,
        },
      });
    },
    // 查看附件
    handleAttachmentLinkClick(attachmentUrl) {
      if (!attachmentUrl) return false;
      const token = getToken();
      const link = document.createElement('a');
      // console.log(token);
      link.href = attachmentUrl + '?Authorization=' + token;
      link.target = '_blank';
      link.click();

      // const url = attachmentUrl;
      // console.log(url);
      // const arr = [".doc",".docx", ".ppt", ".xls" ,".png", ".jpg"];
      // const wrUrl =
      //   "http://view.officeapps.live.com/op/view.aspx?src=" +
      //   encodeURIComponent(this.fixFileToken(url));
      // if (
      //   url.includes(arr[0]) ||
      //   url.includes(arr[1]) ||
      //   url.includes(arr[2]) ||
      //   url.includes(arr[3]) ||
      //   url.includes(arr[4]) ||
      //   url.includes(arr[5]) ||
      //   url.includes(arr[6])
      // ) {
      //     window.open(wrUrl);
      // } else {
      //   window.open(this.fixFileToken(url));
      //   // this.$message({
      //   //     message: "该文件过大（超过5M），请下载后查看！",
      //   //     type: "warning"
      //   //   });
      // }
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
    // 点击作废
    handleInvalidClick(id) {
      this.$confirm(
        '<i class="el-icon-warning" style="color:#E6A23C;font-size:24px;"></i><p>此操作将作废合同, 是否继续?</p>',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // type: 'warning',
          customClass: 'invalid-confirm',
          dangerouslyUseHTMLString: true,
        },
      )
        .then(() => {
          invalidContract({
            contract_id: id,
            invalid_code: 5,
          }).then(res => {
            if (res.data.success) {
              this.$message({
                type: 'success',
                message: res.data.message,
                duration: 2000,
                showClose: true,
              });
              this.queryContract();
            } else {
              this.$message({
                type: 'warning',
                message: res.data.message,
                duration: 2000,
                showClose: true,
              });
            }
          });
        })
        .catch(() => {
          /* do nth */
        });
    },
    // 获取作废权限
    hasInvalidRight(row) {
      // debugger
      if (this.currentUserInfo) {
        return (
          this.currentUserInfo.id === row.contract_info.manager_id ||
          this.currentUserInfo.id === row.contract_info.add_by
        );
      } else {
        return false;
      }
    },
    // 点击新增合同附件按钮
    showAddContractAnnexDialog() {
      this.$refs.addAttachmentDialog.show();
    },
    // 点击按条件查询
    handleSearchClick() {
      this.pagination.currentPage = 1;
      this.queryContract();
    },
    fixFileToken,
    // 合同收回按钮
    // handleContractRecycleChange (row, $index) {
    //   // debugger
    //   // console.log(row, this.recycledStatusList[$index].status)
    //   setContractRecycle({
    //     id: row.contract_info.id,
    //     is_recycled: this.recycledStatusList[$index].status ? 1 : 0
    //   }).then(res => {
    //     if (res.data.success) {
    //       // this.queryContract()
    //       this.$message({
    //         type: 'success',
    //         message: res.data.message,
    //         duration: 2000,
    //         showClose: true
    //       })
    //     } else {
    //       // 出错，恢复之前的状态
    //       this.recycledStatusList[$index].status = !this.recycledStatusList[$index].status
    //       this.$message({
    //         type: 'warning',
    //         message: res.data.message,
    //         duration: 2000,
    //         showClose: true
    //       })
    //     }
    //   }).catch(error => {
    //     // 出错，恢复之前的状态
    //     this.recycledStatusList[$index].status = !this.recycledStatusList[$index].status
    //     this.$message({
    //       type: 'error',
    //       message: '设置合同收回状态失败，稍后重试',
    //       duration: 2000,
    //       showClose: true
    //     })
    //     console.log(error.message)
    //   })
    // },
    // 获取当前用户的角色码
    // getCurrentUserRoleCode () {
    //   if (this.currentUserInfo && this.currentUserInfo.role_info.length > 0) {
    //     return this.currentUserInfo.role_info[0].role_code
    //   } else {
    //     return false
    //   }
    // }
  },
  watch: {
    $route: {
      // 从别处进入触发刷新，详情页返回不触发
      handler(val, oldval) {
        if (val.name === '客户合同' && oldval.name !== '合同详情') {
          this.handleResetCondition();
        }
      },
    },
  },
};
</script>
