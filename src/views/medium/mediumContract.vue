<!--
 * @Description: 供应商管理-供应商合同-列表
 * @Author: 白青
 * @Date: 2019-09-05 11:42:39
 * @LastEditTime: 2021-09-01 14:31:03
 * @LastEditors: 肖槿
 -->
<template>
  <div id="medium-contarct">
    <div class="condition">
      <div class="condition-line">
        <span class="condition-label condition-label2">采买渠道：</span>
        <div class="condition-value">
          <ul class="sell-chances">
            <li :class="condition.sale_chance ? '' : 'actives'" @click="handleSelectSaleChance('')">
              全部
            </li>
            <li
              v-for="(chance, index) in saleChances"
              :class="condition.sale_chance === chance.value ? 'actives' : ''"
              :key="index"
              @click="handleSelectSaleChance(chance.value)"
            >
              {{ chance.label }}
            </li>
          </ul>
        </div>
      </div>

      <div class="condition-line-form">
        <div class="condition-value" style="padding-left: 0">
          <div class="contract-type">
            <ul class="sty-input-search">
              <li>
                <span class="contract-type-label">合同编号：</span>
                <el-input
                  v-model="condition.contract_uid"
                  placeholder="请输入合同编号"
                  size="medium"
                  clearable
                  @clear="queryContract"
                ></el-input>
              </li>
              <li>
                <span class="contract-type-label">供应商名称：</span>
                <el-input
                  v-model="condition.partner_name"
                  placeholder="请输入供应商名称"
                  size="medium"
                  clearable
                  @clear="queryContract"
                ></el-input>
              </li>
              <li>
                <span class="contract-type-label">类型：</span>
                <el-select
                  size="medium"
                  class="select"
                  v-model="condition.contract_type"
                  clearable
                  placeholder="请选择"
                  @clear="queryContract"
                >
                  <el-option
                    v-for="item in supplierContractTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </li>
              <li>
                <span class="contract-type-label">状态：</span>
                <el-select
                  class="select"
                  size="medium"
                  v-model="condition.contract_status"
                  clearable
                  placeholder="请选择"
                  @clear="queryContract"
                >
                  <el-option
                    v-for="item in supplierContractStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </li>

              <li>
                <span class="contract-type-label">是否收回：</span>
                <el-select
                  size="medium"
                  class="select"
                  v-model="condition.is_recycled"
                  clearable
                  placeholder="请选择"
                  @clear="queryContract"
                >
                  <el-option label="已收回" :value="1"></el-option>
                  <el-option label="未收回" :value="0"></el-option>
                </el-select>
              </li>
              <li>
                <span class="contract-type-label">创建人：</span>
                <el-input
                  size="medium"
                  v-model="condition.add_by_name"
                  placeholder="请输入创建人名称"
                  clearable
                  @clear="queryContract"
                ></el-input>
              </li>
              <li>
                <span class="contract-type-label">结束日期：</span>
                <el-date-picker
                  size="medium"
                  :clearable="false"
                  placeholder="请选择"
                  format="yyyy.MM.dd"
                  value-format="yyyy-MM-dd"
                  style="font-size: 14px; line-height: 36px"
                  v-model="condition.coop_end_date"
                ></el-date-picker>
              </li>
              <li style="margin-left: 86px">
                <el-button
                  class="btn-search-confirm"
                  type="primary"
                  size="small"
                  style="
                    position: relative;
                    top: -1.5px;
                    width: 60px;
                    line-height: 36px;
                    padding: 0;
                    border: none;
                  "
                  @click="handleSearchClick"
                  >查询</el-button
                >
                <tg-button
                  class="btn-search-reset"
                  type="negative"
                  size="small"
                  style="height: 36px; line-height: 36px; margin-left: 20px"
                  @click="handleResetCondition"
                  >重置</tg-button
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="result-list list-left">
      <div v-if="currentUserInfo" class="opreate-btns sty-table-btn">
        <el-button
          class="btn-blues"
          v-if="Permission.canCreate"
          type="primary"
          size="small"
          @click="showAddContractDialog"
          ><i class="button-icon el-icon-plus"></i>新增合同</el-button
        >
        <el-button
          class="btn-blues"
          v-if="Permission.canCreate"
          type="primary"
          size="small"
          @click="showAddContractAnnexDialog"
          ><i class="button-icon el-icon-plus"></i>新增补充协议</el-button
        >
        <el-button
          class="btn-blues"
          v-if="Permission.canCreate"
          type="primary"
          size="small"
          @click="showAddSettlementDialog"
          ><i class="button-icon el-icon-plus"></i>新增结算单</el-button
        >
        <!-- <el-button
          class="color-333 deleteBTN"
          v-if="currentUserInfo.user_rights.includes(RIGHT_CODE.del_contract)"
          size="small"
          @click="handleDeleteContracts"
          ><i class="button-icon el-icon-delete" style="color: var(--text-color); top: 1px"></i>删除</el-button
        > -->
      </div>
      <el-table
        stripe
        v-if="Permission.canViewList"
        :data="list"
        style="width: 100%"
        v-loading="loading"
        :header-cell-style="{
          backgroundColor: 'var(--table-thead-th-bg-color)',
          color: 'var(--text-second-color)',
        }"
        :cell-style="{ cursor: 'pointer', borderBottom: '1px solid #ebeef5' }"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="36" v-if="false"></el-table-column>
        <el-table-column
          class="nowarp"
          :formatter="
            (row, column, cellValue, index) => (pagination.currentPage - 1) * 10 + (index + 1)
          "
          label="序号"
          width="52"
          align="center"
        />
        <el-table-column class="nowarp" prop="contract_uid" label="合同类型/编号" width="212">
          <template #default="{ row }">
            <div class="contract_type_uid cell-left">
              <span
                :class="
                  row.contract_info.contract_type_str.split('-')[1].substr(0, 2) === '采买'
                    ? 'type-cm'
                    : ''
                "
                class="type"
                >{{ row.contract_info.contract_type_str.split('-')[1].substr(0, 2) }}</span
              >
              <span class="num">{{ row.contract_info.contract_uid }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="partner_name" label="供应商名称" min-width="216">
          <template #default="{ row }">
            <el-popover placement="top" trigger="hover" :content="row.partner_info.partner_name">
              <template slot="reference">
                <div
                  class="customer-name"
                  :class="!row.partner_info.partner_name ? 'color-999' : ''"
                >
                  {{ row.partner_info.partner_name || '--' }}
                </div>
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
        <el-table-column prop="contract_amount" label="合同金额" align="center" min-width="140">
          <!--   :formatter="row => {return '￥'+formatAmount(row.contract_detail.contract_amount, 2)}" -->
          <template #default="{ row }">
            <div :class="!row.contract_detail.contract_amount ? 'color-999' : ''">
              {{
                row.contract_detail.contract_amount
                  ? '￥' + formatAmount(row.contract_detail.contract_amount, 2)
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
        <el-table-column prop="sale_chance" label="采买渠道" align="center" min-width="180">
          <template #default="{ row }">
            <template v-if="row.contract_info.sale_chance.length === 1">
              <span class="one-sale-chance">{{
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
                    {{ row.contract_info.sale_chance.length > 2 ? '...' : '' }}
                  </p>
                </div>
                <!-- <div>
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
                </div> -->
              </template>
              <ul class="contract-sale-chance">
                <li v-for="(chance, index) in row.contract_info.sale_chance" :key="index">
                  {{ chance.sale_chance_name }}
                </li>
              </ul>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column prop="gmt_create" label="合作期限" align="center" width="202">
          <template #default="{ row }">
            <p :class="!row.contract_info.coop_start_date ? 'color-999' : ''">
              {{
                row.contract_info.coop_end_date
                  ? row.contract_info.coop_start_date + ' ~ ' + row.contract_info.coop_end_date
                  : '--'
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="gmt_create" label="创建人/时间" align="center" min-width="114">
          <template #default="{ row }">
            <p>{{ row.contract_info.add_by_name }}</p>
            <p style="color: var(--text-third-color)">
              {{ row.contract_info.create_time_str.split(' ')[0] }}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="contract_status" label="合同状态" align="center" min-width="76">
          <template slot-scope="scope">
            <el-popover
              v-if="
                !scope.row.contract_info.feishu_request_id &&
                !scope.row.contract_info.oa_request_id &&
                scope.row.contract_info.contract_status !== 2 &&
                scope.row.contract_info.contract_status !== 5 &&
                scope.row.contract_info.contract_status !== 1
              "
              placement="bottom-end"
              width="246"
              trigger="hover"
              popper-class="approve-progress-popper"
              @show="
                approveShow(
                  scope.row.contract_info.feishu_request_id ||
                    scope.row.contract_info.oa_request_id,
                  scope.row.contract_info.id,
                  scope.$index,
                )
              "
            >
              <template slot="reference">
                <div class="recycle-back">
                  <span :class="`status-dot-${scope.row.contract_info.contract_status}`">{{
                    scope.row.contract_info.contract_status_str
                  }}</span>
                  <span
                    v-if="scope.row.contract_info.contract_status === 2"
                    class="recycle-status"
                    :class="scope.row.contract_info.is_recycled === 1 ? 'recycle-status-no' : ''"
                    >{{ scope.row.contract_info.is_recycled === 1 ? '已收回' : '未收回' }}</span
                  >
                </div>
              </template>
              <approve-progress
                :work-infos="scope.row.contract_work_infos"
                :contract-info="scope.row"
              />
            </el-popover>
            <el-popover
              v-else-if="
                (scope.row.contract_info.feishu_request_id ||
                  scope.row.contract_info.oa_request_id) &&
                scope.row.contract_info.contract_status !== 2 &&
                scope.row.contract_info.contract_status !== 5 &&
                scope.row.contract_info.contract_status !== 1
              "
              placement="bottom-end"
              width="240"
              trigger="hover"
              popper-class="approve-progress-popper"
              @show="
                approveShow(
                  scope.row.contract_info.feishu_request_id ||
                    scope.row.contract_info.oa_request_id,
                  scope.row.contract_info.id,
                  scope.$index,
                )
              "
            >
              <template slot="reference">
                <div class="recycle-back">
                  <span :class="`status-dot-${scope.row.contract_info.contract_status}`">{{
                    scope.row.contract_info.contract_status_str
                  }}</span>
                  <span
                    v-if="scope.row.contract_info.contract_status === 2"
                    class="recycle-status"
                    :class="scope.row.contract_info.is_recycled === 1 ? 'recycle-status-no' : ''"
                    >{{ scope.row.contract_info.is_recycled === 1 ? '已收回' : '未收回' }}</span
                  >
                </div>
              </template>
              <NewApproveProgress
                :work-infos="new_contract_work_infos"
                :checkStatus="scope.row.contract_info.contract_status"
              />
            </el-popover>
            <div v-else>
              <div class="recycle-back">
                <span :class="`status-dot-${scope.row.contract_info.contract_status}`"
                  >{{ scope.row.contract_info.contract_status_str || '--' }}
                </span>
                <span
                  v-if="scope.row.contract_info.contract_status === 2"
                  class="recycle-status"
                  :class="scope.row.contract_info.is_recycled !== 1 ? 'recycle-status-no' : ''"
                  >{{ scope.row.contract_info.is_recycled === 1 ? '已收回' : '未收回' }}</span
                >
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="合同是否收回" min-width="66" align="center">
          <template #default="{ row }">
            // 风控显示操作按钮，其他人显示状态文字
            <span
              v-if="row.contract_info.contract_status === 2"
              style="color: #666; font-size: 14px"
              >{{ row.contract_info.is_recycled === 1 ? '已收回' : '未收回' }}</span
            >
            <span v-if="row.contract_info.contract_status !== 2">--</span>
          </template>
        </el-table-column> -->
        <el-table-column label="合同附件" min-width="50" align="center">
          <template slot-scope="scope">
            <!-- <el-popover popper-class="contract-oprete-popper" placement="top" trigger="hover">
              <template slot="reference">
                <span @click.stop="row.contract_detail.attachment_url;" class="contract-file-check"
                  >查看</span
                >
              </template>
              <contract-scanning :detail="row" />
            </el-popover> -->
            <span @click.stop="checkFileDialog(scope)" class="contract-file-check">查看</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="156" align="center" v-if="false">
          <template #default="{ row }">
            <span v-if="currentUserInfo.user_rights.includes(RIGHT_CODE.upload_contract_scan)">
              <el-popover
                v-if="row.contract_info.contract_status === 2"
                popper-class="contract-oprete-popper"
                placement="top"
                trigger="click"
                content="上传合同扫描件"
              >
                <template slot="reference">
                  <span
                    class="tg-fg-blue"
                    v-if="currentUserInfo.user_rights.includes(RIGHT_CODE.upload_contract_scan)"
                    @click.stop="showAddContractCopyDialog(row)"
                    >上传合同扫描件</span
                  >
                </template>
              </el-popover>
              <el-popover
                v-if="
                  row.contract_info.add_by === userInfo_id &&
                  row.contract_info.contract_status === 2 &&
                  limitShow(row)
                "
                popper-class="contract-oprete-popper"
                placement="top"
                trigger="hover"
                content="补充协议/结算单审批中, 禁止作废"
              >
                <template slot="reference">
                  <a
                    v-if="currentUserInfo.user_rights.includes(RIGHT_CODE.upload_contract_scan)"
                    @click.stop
                    style="cursor: pointer"
                    disabled
                  >
                    作废</a
                  >
                </template>
              </el-popover>
              <el-popover
                v-else-if="
                  row.contract_info.contract_status === 2 &&
                  row.contract_info.add_by === userInfo_id &&
                  limitShowClick(row)
                "
                popper-class="contract-oprete-popper"
                placement="top"
                trigger="click"
                content="作废合同"
              >
                <template slot="reference">
                  <span class="tg-fg-blue" @click.stop="handleInvalidClick(row.contract_info.id)">
                    作废</span
                  >
                </template>
              </el-popover>
              <span v-else style="margin-left: 5px" class="color-999">--</span>
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
        v-if="Permission.canViewList"
        class="contract-pagination"
        :current-page.sync="pagination.currentPage"
        :page-sizes.sync="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, prev, pager, next, sizes, jumper"
        :total="pagination.total"
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
      />
      <el-dialog
        title="合同附件"
        :visible.sync="contract_file_dialog[dialogObj.index]"
        width="445px"
      >
        <contract-scanning :detail="dialogObj.row" />
      </el-dialog>
    </div>
    <add-contract ref="addContractDialog" @added="queryContract" />
    <add-attachment-dialog ref="addAttachmentDialog" @added="queryContract" />
    <add-settlement-dialog ref="addSettlementDialog" @added="queryContract" />
    <!-- 新增合同复印件 -->
    <add-contract-copy-dialog
      ref="addContractCopyDialog"
      @added="queryContract"
      :contractId="contractId"
    />
  </div>
</template>

<script>
import {
  supplierContractTypeOptions,
  contractStatusOptions,
  supplierContractStatusOptions,
  saleChances,
} from '@/const/options';
import AddContract from '@/views/medium/components/addContract';
// import ReviewDialog from '@/views/customer/components/reviewDialog'
import AddAttachmentDialog from '@/views/medium/components/addAttachmentDialog';
import AddSettlementDialog from '@/views/medium/components/addSettlementDialog';
import ApproveProgress from '@/views/customer/components/approveProgress';
import NewApproveProgress from '@/views/customer/components/newApproveProgress';
// import AttachmentListPopover from '@/views/customer/components/attachmentListPopover';
import contractScanning from '@/views/customer/components/contractScanning';
import AddContractCopyDialog from '@/views/customer/components/addContractCopyDialog';
import {
  queryContract,
  queryUserNames,
  deleteContracts,
  invalidContract,
  getContractApproval,
} from '@/api/customer';
import { getToken } from '@/utils/token';
// import { getUserInfo } from '@/api/auth'
import { CONSTRACT_APPROVER } from '@/utils/config';
import { ROLE_CODE, RIGHT_CODE } from '@/const/roleCode';
import { RouterNameProjectManage } from '@/const/router';

import { RIGHT_CODE as NEW_RIGHT_CODE } from '@/const/rightCode';
import { computed, provide } from '@vue/composition-api';
import { HasPermission } from '@/use/permission';

export default {
  name: 'MediumContarct',
  components: {
    AddContract,
    // ReviewDialog,
    ApproveProgress,
    NewApproveProgress,
    AddAttachmentDialog,
    AddSettlementDialog,
    // AttachmentListPopover,
    AddContractCopyDialog,
    contractScanning,
  },
  setup(props, ctx) {
    /** 权限检查 */
    const Permission = computed(() => {
      const canViewList = HasPermission(NEW_RIGHT_CODE.marketing_contract_list);
      const canCreate = HasPermission(NEW_RIGHT_CODE.marketing_contract_create);

      return {
        canViewList,
        canCreate,
      };
    });
    provide('project_add_id', null);
    return { Permission };
  },
  data() {
    return {
      contractId: null,
      contract_file_dialog: [],
      CONSTRACT_APPROVER, // 审批人id常量
      ROLE_CODE,
      RIGHT_CODE,
      supplierContractTypeOptions,
      contractStatusOptions,
      supplierContractStatusOptions,
      saleChances,
      accountManager: [],
      condition: {
        add_by_name: undefined,
        add_by: undefined,
        coop_end_date: undefined,
        sale_chance: undefined,
        contract_type: undefined,
        contract_status: undefined,
        manager_id: undefined,
        is_recycled: undefined,
        partner_type: 2,
        last_annex_status: undefined,
        partner_name: undefined,
        contract_uid: undefined,
        business_type: 1,
      },
      userInfo_id: JSON.parse(localStorage.getItem('vuex')).user.userinfo.id,
      list: [],
      recycledStatusList: [],
      loading: true,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
        total: 0,
      },
      dialogObj: {
        row: {},
        index: 0,
      },
      selection: [], // 被选中的数据
      currentUserInfo: null,
      recycled: false,
      new_contract_work_infos: [], // 新审批流程
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
    this.queryContract();
  },
  activated() {
    // debugger
    this.queryContract();
  },
  methods: {
    handleResize(event) {
      this.fullWidth = document.documentElement.clientWidth;
    },
    // 点击查看合同附件
    checkFileDialog(scope) {
      this.contract_file_dialog.splice(scope.$index, 1, true);
      this.dialogObj = {
        row: scope.row,
        index: scope.$index,
      };
    },
    //  作废合同判断条件1
    limitShow(row) {
      const isAnnex = row.contract_annex_info.some(item => {
        return item.contract_annex_status === 4;
      });
      const isStatement = row.contract_statements_list.some(item => {
        return item.contract_statements_status === 4;
      });
      return isAnnex || isStatement;
    },
    limitShowClick(row) {
      const isAnnex = row.contract_annex_info.every(item => {
        return item.contract_annex_status !== 4;
      });
      const isStatement = row.contract_statements_list.every(item => {
        return item.contract_statements_status !== 4;
      });
      return (
        (isAnnex && isStatement) ||
        (row.contract_annex_info.length === 0 && row.contract_statements_list.length === 0)
      );
    },
    //
    approveShow(oa_request_id, id, index) {
      if (oa_request_id) {
        // 调用新审批流程接口
        getContractApproval(id)
          .then(res => {
            if (res.data.success) {
              this.new_contract_work_infos = res.data.data;
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
    formatDiscount(discount) {
      discount = parseFloat(discount);
      return discount.toFixed(2);
    },
    // 数字千位格式化
    formatAmount(str, nlen) {
      nlen = nlen > 0 && nlen <= 20 ? nlen : 2;
      str = parseFloat((str + '').replace(/[^\d\\.-]/g, '')).toFixed(nlen) + '';
      const l_ = str.split('.')[0].split('').reverse();
      const r_ = str.split('.')[1];
      let result = '';
      for (let index = 0; index < l_.length; index++) {
        result += l_[index] + ((index + 1) % 3 === 0 && index + 1 !== l_.length ? ',' : '');
      }
      return result.split('').reverse().join('') + '.' + r_;
    },
    // 新增合同弹窗显示
    showAddContractDialog() {
      this.$refs.addContractDialog.clearParterDate();
      this.$refs.addContractDialog.show();
    },
    showAddContractCopyDialog(row) {
      // console.log(row);
      this.contractId = row.contract_detail.contract_id;
      this.$refs.addContractCopyDialog.show(row);
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
      this.list = [];
      this.condition.page_num = this.pagination.currentPage;
      this.condition.num = this.pagination.pageSize;
      this.loading = true;
      queryContract(this.condition)
        .then(res => {
          if (res.data.success) {
            this.list = res.data.data.data;
            this.contract_file_dialog = this.list.map(() => {
              return false;
            });
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
        partner_type: 2,
        last_annex_status: undefined,
        partner_name: undefined,
        contract_uid: undefined,
        business_type: 1,
      };
      this.queryContract();
    },
    // 点击审核合同
    handleReviewContractClick(contractInfo) {
      this.$refs.reviewDialog.show(contractInfo);
    },
    // 点击进入合同详情
    handleRowClick(row) {
      this.$router.push({
        name: RouterNameProjectManage.marketing.contract.supplier.detail,
        params: {
          id: row.contract_info.id,
        },
        query: {
          contract_type: row.contract_info.contract_type,
        },
      });
    },
    // 查看附件
    handleAttachmentLinkClick(attachmentUrl) {
      if (!attachmentUrl) return false;
      const token = getToken();
      const link = document.createElement('a');
      // console.log(token)
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
              this.$alert(res.data.message, '提示', {
                confirmButtonText: '我知道了',
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
    // 点击新增结算单按钮
    showAddSettlementDialog() {
      this.$refs.addSettlementDialog.show();
    },
    // 点击按条件搜索按钮
    handleSearchClick() {
      this.pagination.currentPage = 1;
      this.queryContract();
    },
  },
  watch: {
    $route: {
      // 从别处进入触发刷新，详情页返回不触发
      handler(val, oldval) {
        if (val.name === '供应商合同' && oldval.name !== '供应商合同详情') {
          this.handleResetCondition();
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import './mediumContract.scss';
.recycle-back {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.recycle-status {
  color: #3eaf90;
  font-size: 14px;
  font-size: 12px;
  display: inline-block;
  width: 48px;
  height: 20px;
  line-height: 20px;
  border-radius: 4px;
  background: rgba(62, 175, 144, 0.1);
}
.recycle-status-no {
  color: var(--text-des-color);
  background: rgba(153, 153, 153, 0.1);
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
.scroll {
  max-height: 330px;
  overflow-y: auto;
  overflow-x: hidden;
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
  overflow-y: auto;
  overflow-x: hidden;
}
.nowarp {
  white-space: nowrap;
}
</style>
