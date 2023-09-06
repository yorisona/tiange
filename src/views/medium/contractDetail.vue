<template>
  <div class="contract-detail sty-detail" v-if="detail">
    <div v-loading="loading" class="contract-detail-content">
      <div v-if="detail" class="content-block">
        <div class="block-title">
          <div style="display: flex; align-items: center; margin-bottom: 18px !important">
            <span class="contract-type-label-circle" :class="contract_type_label_class">
              {{ detail.contract_info.contract_type === 3 ? '采买' : '框架' }}
            </span>
            <span class="value contract-number"> {{ detail.contract_info.contract_uid }}</span>
          </div>
          <div class="operates">
            <el-button
              v-if="oprateBtnVisiable() && detail && detail.contract_info.contract_status !== 5"
              size="small"
              type="primary"
              icon="el-icon-edit-outline"
              @click.stop="handleEditContractClick"
              >编辑
            </el-button>
            <el-popover
              v-if="
                detail.contract_info.add_by === userInfo_id &&
                detail.contract_info.contract_status === 2 &&
                limitShow(detail)
              "
              popper-class="contract-oprete-popper"
              placement="top"
              trigger="hover"
              content="补充协议/结算单审批中, 禁止作废"
            >
              <template slot="reference">
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-document-delete"
                  style="background-color: #fff !important; color: #aaa; cursor: not-allowed"
                  >作废
                </el-button>
              </template>
            </el-popover>
            <el-button
              style="margin-left: 18px"
              v-else-if="
                detail.contract_info.contract_status === 2 &&
                detail.contract_info.add_by === userInfo_id &&
                limitShowClick(detail)
              "
              size="small"
              type="primary"
              icon="el-icon-document-delete"
              @click.stop="handleInvalidClick"
              >作废
            </el-button>
            <el-button
              style="margin-left: 18px"
              v-if="oprateBtnVisiable() && detail"
              size="small"
              type="primary"
              icon="el-icon-delete"
              @click="handleDeleteContractClick"
              >删除
            </el-button>
          </div>
        </div>
        <div class="block-content basic-info">
          <el-row>
            <el-col>
              <div class="info-line">
                <span class="label">供应商名称：</span>
                <span
                  class="value"
                  :class="!detail.contract_info.company_name ? 'color-999' : ''"
                  >{{ detail.contract_info.company_name || '--' }}</span
                >
              </div>
              <div class="info-line">
                <span class="label">合同类型：</span>
                <span class="value">{{ detail.contract_info.contract_type_str }}</span>
              </div>
              <div class="info-line">
                <span class="label sale-chance-label">采买渠道：</span>
                <el-popover
                  popper-class="contract-sale-chance-popover"
                  placement="top"
                  max-width="384"
                  trigger="hover"
                >
                  <template slot="reference">
                    <span class="value sale-chance-value sale-chance-value_eclipse">
                      {{ processSaleChanceToStr(detail.contract_info.sale_chance) }}
                    </span>
                  </template>
                  <ul class="contract-sale-chance">
                    <li v-for="(chance, index) in detail.contract_info.sale_chance" :key="index">
                      {{ chance.sale_chance_name }}
                    </li>
                  </ul>
                </el-popover>
              </div>
            </el-col>
            <el-col>
              <div class="info-line">
                <span class="label">合同状态：</span>
                <span class="value">
                  <span
                    style="margin-right: 10px"
                    class="contract-status-all"
                    :class="[status_tag_class]"
                    >{{ detail.contract_info.contract_status_str }}</span
                  >
                  <el-popover
                    v-if="
                      this.new_contract_work_infos.length === 0 &&
                      detail.contract_info.contract_status !== 5
                    "
                    placement="bottom-end"
                    trigger="click"
                    popper-class="approve-progress-popper"
                  >
                    <template slot="reference" style="cursor: pointer">
                      <a> 查看进度</a>
                    </template>
                    <approve-progress
                      :work-infos="detail.contract_work_infos"
                      :contract-info="detail"
                    />
                  </el-popover>
                  <el-popover
                    v-else-if="
                      this.new_contract_work_infos.length > 0 &&
                      detail.contract_info.contract_status !== 5
                    "
                    placement="bottom-end"
                    trigger="click"
                    popper-class="approve-progress-popper"
                  >
                    <template slot="reference">
                      <a>
                        <label style="cursor: pointer" @click="approveShow(detail.contract_info.id)"
                          >查看进度</label
                        ></a
                      >
                    </template>
                    <NewApproveProgress
                      :work-infos="new_contract_work_infos"
                      :checkStatus="detail.contract_info.contract_status"
                    />
                  </el-popover>
                </span>
              </div>
              <div class="info-line">
                <span class="label">合作期限：</span>
                <span
                  class="value"
                  :class="!detail.contract_info.coop_start_date ? 'color-999' : ''"
                  >{{ detail.contract_info.coop_start_date || '--' }} 至
                  {{ detail.contract_info.coop_end_date || '--' }}</span
                >
              </div>
              <div class="info-line">
                <span class="label">是否收回：</span>
                <span class="value">
                  <template>
                    <span>{{ detail.contract_info.is_recycled === 1 ? '已收回' : '未收回' }}</span>
                  </template>
                </span>
              </div>
            </el-col>
            <el-col>
              <div class="info-line">
                <span class="label">创建人：</span>
                <span class="value" :class="!detail.contract_info.add_by_name ? 'color-999' : ''">{{
                  detail.contract_info.add_by_name || '--'
                }}</span>
              </div>
              <div class="info-line">
                <span class="label">创建部门：</span>
                <span
                  class="value"
                  :class="!detail.contract_info.add_by_department ? 'color-999' : ''"
                  >{{ detail.contract_info.add_by_department || '--' }}</span
                >
              </div>
              <div class="info-line">
                <span class="label">创建时间：</span>
                <span class="value">{{ detail.contract_info.create_time_str.split(' ')[0] }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div style="border-bottom: 1px solid #ebebeb">
          <div
            class="info-line info-line-last"
            style="display: flex"
            v-if="detail.contract_info.contract_type === 4"
          >
            <span
              class="label"
              style="display: inline-block; min-width: 95px; max-width: 98px; text-align: right"
              >关联合同：</span
            >
            <span class="value">
              <template>
                <span class="color-999" v-if="!detail.contract_info.related_contracts.length"
                  >--</span
                >
                <span v-for="(val, i) in detail.contract_info.related_contracts" :key="val.id"
                  ><a @click="handleClick(val.id, 3, val.contract_type)">{{ val.contract_uid }}</a>
                  <label v-if="i !== detail.contract_info.related_contracts.length - 1">
                    、
                  </label></span
                >
              </template>
            </span>
          </div>
          <div class="info-line info-line-last" v-else>
            <span class="label">关联合同：</span>
            <span class="value">
              <template>
                <span
                  ><a
                    :class="!detail.contract_info.frame_contract_id ? 'color-999' : ''"
                    @click="
                      handleClick(
                        detail.contract_info.frame_contract_id,
                        4,
                        detail.contract_info.frame_contract_type,
                      )
                    "
                    >{{ detail.contract_info.frame_contract_uid || '--' }}</a
                  ></span
                >
              </template>
            </span>
          </div>
        </div>
      </div>
      <div v-if="detail" class="content-block">
        <div class="block-title" style="font-size: 14px">合作项目</div>
        <div style="display: flex; border-bottom: 1px solid #ebebeb; padding: 9px 0 20px">
          <div
            style="width: 87px; color: var(--text-third-color); text-align: right; flex-shrink: 0"
          >
            项目名称：
          </div>
          <div>
            {{ (detail.project_infos || []).map(el => el.project_name).join('、') || '--' }}
          </div>
        </div>
        <div
          class="block-title"
          style="font-size: 14px"
          v-if="detail.contract_info.contract_type === 3"
        >
          合同明细
        </div>
        <div class="block-content contract-detail" style="padding-top: 0; padding-bottom: 1px">
          <ul v-if="detail.contract_info.contract_type === 3">
            <li>
              <span class="contract-detail-label">合同金额：</span>
              <span
                class="contract-detail-value"
                :class="!detailList[0].contract_amount ? 'color-999' : ''"
                >{{ detailList[0].contract_amount || '--' }}</span
              >
            </li>
            <li>
              <span class="contract-detail-label">标准单价：</span>
              <span class="contract-detail-value" :class="!detailList[0].price ? 'color-999' : ''"
                >￥{{ detailList[0].price || '--' }}</span
              >
            </li>
            <li>
              <span class="contract-detail-label">数量：</span>
              <span class="contract-detail-value" :class="!detailList[0].num ? 'color-999' : ''">{{
                detailList[0].num || '--'
              }}</span>
            </li>
            <li>
              <span class="contract-detail-label">单位：</span>
              <span
                class="contract-detail-value"
                :class="!detailList[0].unit_str ? 'color-999' : ''"
                >{{ detailList[0].unit_str || '--' }}</span
              >
            </li>
            <li>
              <span class="contract-detail-label">折扣：</span>
              <span
                class="contract-detail-value"
                :class="!detailList[0].discount ? 'color-999' : ''"
                >{{ detailList[0].discount || '--' }}</span
              >
            </li>
          </ul>
          <div v-if="detail && detail.project_contract_relation_type !== 2" class="attachment">
            <span class="attachment-label">合同附件</span>
            <template v-if="detail.contract_detail.attachment_url_list">
              <div class="file-back">
                <div class="list" v-for="(file, index) in caseFileList()" :key="index">
                  <tg-icon :name="`ico-${file.iconName}`" style="font-size: 20px"></tg-icon>
                  <a style="cursor: pointer" @click.stop="preview(file.link)" target="_blank">
                    <span class="attachment-name">{{ utils.basename(file.fileName) }}</span>
                  </a>
                  <a
                    v-if="file.fileName"
                    class="attachment-link"
                    @click="handleFileDownloadClick(file.link, file.fileName)"
                    >下载</a
                  >
                </div>
              </div>
            </template>
            <template v-else>
              <div
                class="no-attachment"
                style="border-bottom: 1px solid #ebebeb; margin-bottom: 10px"
              >
                未上传附件
              </div>
            </template>
            <div :style="{ 'margin-top': caseFileList().length ? '10px' : '0px' }">
              <span class="attachment-label" style="display: inline-block">
                <span>合同扫描件</span>
                <tg-button
                  v-if="
                    Permission.hasScanPermission &&
                    detail.contract_info.contract_scan_status === 1 &&
                    detail.contract_detail.contract_scan_urls.length !== 20 &&
                    detail.contract_info.contract_status === 2 &&
                    (detail.contract_info.add_by === userInfo_id ||
                      (detail.allow_update_contract_scan_user_ids &&
                        detail.allow_update_contract_scan_user_ids.includes(userInfo_id)))
                  "
                  type="link"
                  class="mgl-12"
                  @click="onApprovalHandler && detail.contract_detail.contract_scan_urls.length > 0"
                  >审核</tg-button
                >
              </span>
              <template>
                <div
                  class="file-back"
                  style="padding-bottom: 18px"
                  :style="{
                    'border-bottom':
                      detail && detail.contract_info.contract_type !== 3
                        ? 'none'
                        : '1px solid #ebebeb',
                  }"
                >
                  <div class="list" v-for="(file, index) in scanFileList()" :key="index">
                    <tg-icon :name="`ico-${file.iconName}`" style="font-size: 20px"></tg-icon>
                    <a style="cursor: pointer" @click.stop="preview(file.url)" target="_blank">
                      <span class="attachment-name">{{ utils.basename(file.fileName) }}</span>
                    </a>
                    <a
                      class="attachment-link"
                      @click="handleFileDownloadClick(file.url, file.fileName)"
                      >下载</a
                    >
                    <span
                      class="delete_tr"
                      @click="clearUploadedFile(index)"
                      v-if="detail.contract_info.contract_status === 2 && false"
                      ><i class="el-icon-error" style="color: #ccc"></i
                    ></span>
                    <div
                      v-if="
                        detail.contract_info.contract_scan_status === 2 ||
                        detail.contract_info.contract_scan_status === 3
                      "
                      :style="{
                        position: 'absolute',
                        bottom: '-10px',
                        left: '0',
                        'font-size': '12px',
                        width: '178px',
                        'text-align': 'center',
                        color:
                          detail.contract_info.contract_scan_status === 3
                            ? 'red'
                            : 'var(--success-color)',
                      }"
                    >
                      {{ detail.contract_info.contract_scan_status === 2 ? '审批通过' : '已驳回' }}
                    </div>
                  </div>
                  <div class="list" style="cursor: pointer" v-if="canUpload">
                    <el-upload
                      action
                      :http-request="uploadPlans"
                      :show-file-list="false"
                      accept=".docx,.doc,.pdf"
                    >
                      <TgIcon name="ico-add-thin" class="icons"></TgIcon>
                      <div class="icons-title">
                        <p>支持：docx、doc、pdf</p>
                        <p>单个文件不超过50M</p>
                      </div>
                    </el-upload>
                  </div>
                  <div v-else style="margin-top: 13px">
                    <span
                      v-if="detail.contract_detail.contract_scan_urls.length === 0"
                      class="no-attachment"
                      >{{
                        [
                          approval_status.Failure,
                          approval_status.Processing,
                          approval_status.Invalid,
                        ].includes(detail.contract_info.contract_status) &&
                        detail.contract_info.contract_status !== 2
                          ? '合同审批通过后由创建人上传'
                          : '未上传合同扫描件'
                      }}</span
                    >
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div v-if="detail && detail.contract_info.contract_type === 3" class="content-block">
        <div
          class="block-title"
          style="font-size: 14px; height: 20px; position: relative; top: -10px"
        >
          付款计划
        </div>
        <div class="block-content plan-list">
          <el-table
            stripe
            :data="detail.proceeds_plan"
            :header-cell-style="{
              backgroundColor: 'var(--table-thead-th-bg-color)',
              color: 'var(--text-second-color)',
            }"
            :cell-style="{ borderBottom: '1px solid #ebeef5' }"
            :cell-class-name="cellStyle2"
          >
            <el-table-column
              label="序号 "
              :formatter="(row, column, cellValue, index) => index + 1"
              width="63"
              align="center"
            />
            <el-table-column prop="proceeds_amount" label="付款金额" align="center" />
            <el-table-column prop="proceeds_plan_date_str" label="计划付款日期" align="center">
              <template slot-scope="scope">
                <span :class="!scope.row.proceeds_plan_date_str ? 'color-999' : ''">
                  {{ scope.row.proceeds_plan_date_str ? scope.row.proceeds_plan_date_str : '--' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="obtained_amount" label="已付金额" align="center" />
            <el-table-column prop="to_obtain_amount" label="待付金额" align="center" />
            <el-table-column
              prop="invoice_amount"
              label="已收发票金额"
              align="center"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="!detail" class="no-detail">
        <img src="@/assets/img/pls_import_product.png" />
        <p>没有查询到合同详情</p>
      </div>

      <add-contract
        :get-type="get_type"
        ref="editContractDialog"
        type="edit"
        @edited="getContractDetail"
      />
      <review-dialog ref="reviewDialog" @approved="getContractDetail" />
    </div>
    <div class="relative">
      <div
        class="tabs-btn"
        v-if="
          !breadcrumb.isLegalSupplierContractDetail &&
          !breadcrumb.isLegalStatisticsSupplierContractDetail &&
          !breadcrumb.isCommonBusinessSupplierContractDetail &&
          !breadcrumb.isLiveSupplierContractDetail &&
          !breadcrumb.isTiktokSupplierContractDetail &&
          !breadcrumb.isLocalLifeSupplierContractDetail &&
          !breadcrumb.isSupplyChainSupplierContractDetail &&
          !breadcrumb.isCoopSupplierContractDetail
        "
      >
        <span
          v-if="detail.contract_info.contract_status === 2"
          @click="$refs.editAttachmentDialog.dialogVisible = true"
          >新增补充协议</span
        >
        <span
          v-if="
            !detail.contract &&
            detail.contract_info.contract_type === 4 &&
            detail.contract_info.contract_status === 2
          "
          @click="$refs.editSettlementDialog.dialogVisible = true"
          ><label style="margin: 0 10px">|</label>新增结算单
        </span>
      </div>
    </div>
    <template v-if="!detail.contract && detail.contract_info.contract_type === 4">
      <tg-tabs class="mgt-18" :tabs="tabs" v-model="checkedTab" bottom />
      <template v-if="checkedTab === 1">
        <div v-if="detail" class="content-block">
          <SupplementDetail />
        </div>
      </template>
      <template v-if="checkedTab === 2">
        <div class="content-block">
          <SettlementDetail ref="settlementDetail" />
        </div>
      </template>
    </template>
    <!-- 测试要求去掉 -->
    <!-- <div class="tabs-back" v-else>
      <div class="tabs-title">补充协议详情</div>
      <div v-if="detail" class="content-block">
        <SupplementDetail />
      </div>
    </div> -->
    <EditAttachmentDialog ref="editAttachmentDialog" :editData="editAttachmentData" />
    <EditSettlementDialog ref="editSettlementDialog" :editData="editSettlementData" />
    <tg-mask-loading :visible="approvalLoading" content="正在保存，请稍候..." />
  </div>
</template>

<script lang="ts">
// ! 临时改写的勉强能运行的带类型版本，请后续认真重构一版
import {
  queryContract,
  deleteContract,
  setContractRecycle,
  deleteContractAnnex,
  getContractApproval,
  invalidContract,
} from '@/api/customer';
import AddContract from '@/views/medium/components/addContract.vue';
import ReviewDialog from '@/views/customer/components/reviewDialog.vue';
import ApproveProgress from '@/views/customer/components/approveProgress.vue';
import NewApproveProgress from '@/views/customer/components/newApproveProgress.vue';
import SettlementDetail from '@/views/medium/components/settlementDetail.vue';
import SupplementDetail from '@/views/medium/components/supplementDetail.vue';
import { getToken } from '@/utils/token';
import { CONSTRACT_APPROVER } from '@/utils/config';
import { ROLE_CODE } from '@/const/roleCode';
import { fixFileToken } from '@/utils/http';
import TgIcon from '@/components/IconFont/tg.vue';
import { uploadFile, savaContractCopy, savaContractCopyLegal } from '@/api/cooperative';
import EditAttachmentDialog from '@/views/medium/components/addAttachmentDialog.vue';
import EditSettlementDialog from '@/views/medium/components/addSettlementDialog.vue';
import { getContractStatement } from '@/api/customer';
import { RouterNameProjectManage, RouterLegal } from '@/const/router';
import { ApprovalStatus } from '@/types/tiange/system';
import { defineComponent, ref } from '@vue/composition-api';
import { RIGHT_CODE as NEW_RIGHT_CODE } from '@/const/rightCode';
import { computed, provide, inject } from '@vue/composition-api';
import { HasPermission } from '@/use/permission';
import { useBreadcrumb } from '@/modules/live/project/use/breadcrumb';
import { downloadFileFromBlob, sleep } from '@/utils/func';
import { DeleteContractScan, GetContract, PostVerify_contract_scan } from '@/services/contract';
import { GetMarketingProjectDetail } from '@/services/marketing.project';
import { GetLiveProjectDetail } from '@/services/live.project';
import { Contract, ContractQueryParams, ContractType, Settlement } from '@/types/tiange/contract';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { useRefTabs } from '@/use/tab';
import { useDialog } from '@/use/dialog';
import toExamineDialog from '@/modules/legal/contract/dialog/toExamineDialog';
import { isExternal } from '@/router/routeGuard';
import utils from '@/utils';
import { useBreadcrumbRouter } from '@/modules/customer/contract/template/detail/use';
import { useRouter } from '@/use/vue-router';

export default defineComponent({
  name: 'ContractDetail',
  components: {
    AddContract,
    ApproveProgress,
    NewApproveProgress,
    ReviewDialog,
    SettlementDetail,
    SupplementDetail,
    TgIcon,
    EditAttachmentDialog,
    EditSettlementDialog,
  },
  setup(props, ctx) {
    const ContractDetail = ref<Contract | undefined>(undefined);
    const ProjectDetailData = ref({});
    const project_add_id = ref(-1);
    const approvalLoading = ref(false);

    const breadcrumb = useBreadcrumb();
    /** 权限检查 */
    const Permission = computed(() => {
      const canUploadScan = HasPermission(NEW_RIGHT_CODE.marketing_contract_scan_upload);
      const hasScanPermission = HasPermission(NEW_RIGHT_CODE.law_verify_contract_scan);
      const hasUploadAttachment = HasPermission(NEW_RIGHT_CODE.upload_attachment);
      return { canUploadScan, hasScanPermission, hasUploadAttachment };
    });

    let get_type = 1;
    if (breadcrumb.isLegalSupplierContractDetail || breadcrumb.isLegalCustomerContractDetail) {
      get_type = 2;
    } else if (
      breadcrumb.isLiveCustomerContractDetail ||
      breadcrumb.isLiveSupplierContractDetail ||
      breadcrumb.isTiktokLiveCustomerContractDetail ||
      breadcrumb.isTiktokSupplierContractDetail
    ) {
      get_type = 3;
    } else if (breadcrumb.isCoopCustomerContractDetail || breadcrumb.isCoopSupplierContractDetail) {
      get_type = 4;
    } else if (
      breadcrumb.isCommonBusinessCustomerContractDetail ||
      breadcrumb.isCommonBusinessSupplierContractDetail
    ) {
      /** 通用业务类型 */
      get_type = 5;
    } else if (
      breadcrumb.isLegalStatisticsSupplierContractDetail ||
      breadcrumb.isLegalStatisticsCustomerContractDetail
    ) {
      get_type = 6;
    } else if (
      breadcrumb.isLocalLifeSupplierContractDetail ||
      breadcrumb.isLocalLifeCustomerContractDetail
    ) {
      get_type = 8;
    } else if (
      breadcrumb.isSupplyChainSupplierContractDetail ||
      breadcrumb.isSupplyChainCustomerContractDetail
    ) {
      get_type = 9;
    }

    const contract_type_label_class = computed(() => {
      return ContractType[
        detail.value?.contract_info.contract_type ?? ContractType.Sales
      ].toLowerCase();
    });

    const status_tag_class = computed(() =>
      `approval-status-label-circle ${
        ApprovalStatus[detail.value?.contract_info.contract_status ?? -1]
      }`.toLowerCase(),
    );

    /** 获取详情 */
    const getContractDetail = async () => {
      const id = ctx.root.$route.params.id;
      if (!id) {
        return false;
      }
      const breadRouter = useBreadcrumbRouter();
      const router_project_id = ctx.root.$route.query.parent_id
        ? Number(ctx.root.$route.query.parent_id)
        : undefined;
      const payload: ContractQueryParams = {
        id: parseInt(id, 10),
        partner_type: 2,
        project_id:
          breadRouter.breadcrumb.isCoopCustomerContractDetail ||
          breadRouter.breadcrumb.isCoopSupplierContractDetail
            ? undefined
            : router_project_id,
        cooperation_id:
          breadRouter.breadcrumb.isCoopCustomerContractDetail ||
          breadRouter.breadcrumb.isCoopSupplierContractDetail
            ? router_project_id
            : undefined,
        contract_type: parseInt(ctx.root.$route.query.contract_type as string, 10) || undefined,
      };
      // const isExternal = router.currentRoute.query.source === 'external';
      const response = await GetContract(payload, get_type, isExternal());
      if (response.success && response.data) {
        ContractDetail.value = response.data;
      } else {
        ctx.root.$message.warning(response.message ?? '合同详情获取失败，稍后重试');
      }

      project_add_id.value = ContractDetail.value?.contract_info.project_id
        ? ContractDetail.value?.contract_info.project_id
        : -1;

      const project_id = computed(() => ContractDetail.value?.contract_info.project_id);
      const fetchProjectDetailData = async (project_id: number) => {
        const queryService = get_type === 4 ? GetMarketingProjectDetail : GetLiveProjectDetail;
        const [{ data: response }, _] = await Promise.all([
          await queryService(project_id.toString()),
          await sleep(200),
        ]);

        if (response.success) {
          return response.data;
        } else {
          return {};
        }
      };

      /** Get project detail data */
      const getProjectDetailData = async () => {
        const id = project_id.value ? project_id.value : ContractDetail.value?.cooperation_id;
        if (id) {
          const result = await fetchProjectDetailData(id);
          ProjectDetailData.value = result;
        }
      };

      getProjectDetailData();
    };

    getContractDetail();

    provide('project', ProjectDetailData);
    provide('project_add_id', project_add_id);
    const fileTypeIconMap = new Map([
      ['image/jpeg', 'picture'],
      ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'excel'],
      ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'word'],
      ['application/msword', 'word'],
      ['application/pdf', 'pdf'],
      ['xlsx', 'excel'],
      ['docx', 'word'],
      ['doc', 'word'],
      ['pdf', 'pdf'],
      ['jpeg', 'picture'],
      ['png', 'picture'],
    ]);

    const requestOptions = {
      headers: {
        Authorization: getToken() ?? '',
      },
    };

    const detail = ref<Contract | undefined>(undefined);

    const { tabs, checkedTab } = useRefTabs([
      {
        label: '补充协议详情',
        value: 1,
      },
      {
        label: '结算单详情',
        value: 2,
      },
    ]);

    const postVerify_contract_scan = async (v: any) => {
      v.status = 3;
      approvalLoading.value = true;
      const res = await PostVerify_contract_scan(v);
      approvalLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success(res.data.message ?? '驳回成功');
        // queryContract();
        getContractDetail();
      } else {
        ctx.root.$message.error(res.data.message ?? '请求失败，请重试');
      }
    };

    const dialogProject = useDialog({
      component: toExamineDialog,
      title: '扫描件审核',
      okText: '驳回',
      width: '400px',
      on: {
        submit: (v: { contract_id: number; message?: string }) => {
          postVerify_contract_scan(v);
        },
      },
    });

    const onApprovalHandler = () => {
      dialogProject.show(detail.value?.contract_info?.id);
    };

    const isProject = computed(() => {
      return (
        !breadcrumb.isLegalStatisticsSupplierContractDetail &&
        !breadcrumb.isLegalSupplierContractDetail
      );
    });

    const userInfo_id = JSON.parse(localStorage.getItem('vuex') ?? '{}')?.user?.userinfo?.id;
    const canUpload = computed(() => {
      // const isProject =
      //   !breadcrumb.isLegalStatisticsSupplierContractDetail &&
      //   !breadcrumb.isLegalSupplierContractDetail;
      const inTeam =
        detail.value?.contract_info.add_by === userInfo_id ||
        (detail.value?.allow_update_contract_scan_user_ids &&
          detail.value?.allow_update_contract_scan_user_ids.includes(userInfo_id));
      return (
        (detail.value?.contract_info.contract_scan_status === 0 ||
          detail.value?.contract_info.contract_scan_status === 3) &&
        detail.value?.contract_detail.contract_scan_urls.length !== 20 &&
        detail.value?.contract_info.contract_status === 2 &&
        ((isProject.value && inTeam) || (!isProject.value && Permission.value.hasUploadAttachment))
      );
      // return (
      //   (detail.value?.contract_info.contract_scan_status === 0 ||
      //     detail.value?.contract_info.contract_scan_status === 3) &&
      //   detail.value?.contract_detail.contract_scan_urls.length !== 20 &&
      //   detail.value?.contract_info.contract_status === 2 &&
      //   (detail.value?.contract_info.add_by === userInfo_id ||
      //     (detail.value?.allow_update_contract_scan_user_ids &&
      //       detail.value?.allow_update_contract_scan_user_ids.includes(userInfo_id))) &&
      //   (Permission.value.hasUploadAttachment ||
      //     (!breadcrumb.isLegalStatisticsSupplierContractDetail &&
      //       !breadcrumb.isLegalSupplierContractDetail))
      // );
    });
    const router = useRouter();
    let routes: { title: string; path?: string; name?: string; params?: any }[] = [
      {
        name: RouterNameProjectManage.marketing.project.list,
        title: '项目管理',
      },
      {
        name: RouterNameProjectManage.marketing.project.detail,
        params: {
          id: router.currentRoute.query.parent_id,
          tab: router.currentRoute.query.parent_tab,
        },
        title: '项目详情',
      },
      {
        path: '',
        title: '供应商合同详情',
      },
    ];
    if (breadcrumb.isLiveSupplierContractDetail) {
      routes = [
        { title: '项目管理', name: RouterNameProjectManage.live.project.list },
        {
          title: '项目详情',
          name: RouterNameProjectManage.live.project.detail,
          params: {
            id: router.currentRoute.query.parent_id,
            tab: router.currentRoute.query.parent_tab,
            liveType: 'calendar',
          },
        },
        { title: '供应商合同详情' },
      ];
    } else if (breadcrumb.isTiktokSupplierContractDetail) {
      routes = [
        { title: '项目管理', name: RouterNameProjectManage.live.project.list },
        {
          title: '项目详情',
          name: RouterNameProjectManage.tiktokLive.project.detail.info,
          params: {
            id: router.currentRoute.query.parent_id,
            tab: router.currentRoute.query.parent_tab,
            liveType: 'calendar',
          },
        },
        { title: '供应商合同详情' },
      ];
    } else if (breadcrumb.isSupplyChainSupplierContractDetail) {
      routes = [
        { title: '项目管理', name: RouterNameProjectManage.supplyChain.list },
        {
          title: '项目详情',
          name: RouterNameProjectManage.supplyChain.detail,
          params: {
            id: router.currentRoute.query.parent_id,
            tab: router.currentRoute.query.parent_tab,
            liveType: 'SupplyChainDetail',
          },
        },
        { title: '供应商合同详情' },
      ];
    } else if (breadcrumb.isLocalLifeSupplierContractDetail) {
      routes = [
        { title: '项目管理', name: RouterNameProjectManage.localLife.project.list },
        {
          title: '项目详情',
          name: RouterNameProjectManage.localLife.detail.info,
          params: {
            id: router.currentRoute.query.parent_id,
          },
        },
        { title: '供应商合同详情' },
      ];
    } else if (breadcrumb.isCommonBusinessSupplierContractDetail) {
      routes = [
        { title: '项目管理', name: RouterNameProjectManage.commonBusiness.project.list },
        {
          title: '项目详情',
          name: RouterNameProjectManage.commonBusiness.project.detail,
          params: {
            id: router.currentRoute.query.parent_id,
            tab: router.currentRoute.query.parent_tab,
          },
        },
        { title: '供应商合同详情' },
      ];
    } else if (breadcrumb.isCoopSupplierContractDetail) {
      routes = [
        { title: '项目管理', name: RouterNameProjectManage.marketing.project.list },
        {
          title: '项目详情',
          name: RouterNameProjectManage.marketing.project.detail,
          params: {
            id: router.currentRoute.query.parent_id,
            tab: router.currentRoute.query.parent_tab,
          },
        },
        { title: '合同详情' },
      ];
    } else if (breadcrumb.isLegalCustomerContractDetail) {
      routes = [
        { title: '法务管理', name: RouterLegal.contact },
        { title: '合同管理', name: RouterLegal.contact },
        { title: '供应商合同详情' },
      ];
    } else if (breadcrumb.isLegalStatisticsCustomerContractDetail) {
      routes = [
        { title: '法务管理', name: RouterLegal.contact },
        { title: '合同统计', name: RouterLegal.constatistics },
        { title: '供应商合同详情' },
      ];
    }
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    return {
      utils,
      approvalLoading,
      onApprovalHandler,
      contract_type_label_class,
      status_tag_class,
      fileTypeIconMap,
      requestOptions,
      Permission,
      breadcrumb,
      get_type,
      detail,
      tabs,
      checkedTab,
      canUpload,
      isProject,
      isExternal,
      // getContractDetail,
    };
  },
  data() {
    return {
      ROLE_CODE,
      CONSTRACT_APPROVER,
      detailList: [
        // {
        //   sale_chance: ['小红书', '淘宝直播', '抖音', '快手'],
        //   num: 4,
        //   unit_str: '场',
        //   price: '8800.00',
        //   discount: '5.50',
        //   contract_amount: '48400.00'
        // }
      ],
      getToken,
      loading: false,
      currentUserInfo: null,
      // 合同【收回】状态
      isRecycled: false,
      attachment_url_list: [],
      contract_scan_urls: [], //合同扫描件
      attachment_url: [],
      // tab 栏切换
      activeName: 'supplement_detail',
      new_contract_work_infos: [],
      userInfo_id: JSON.parse(localStorage.getItem('vuex') ?? '{}').user.userinfo.id,
      tableSettleData: [],
      editAttachmentData: {},
      editSettlementData: {},
      isClickTimes: false, //刚开始点击两次，点击一次patener_name没值，没时间找问题，先用这个控制
      approval_status: ApprovalStatus,
    };
  },
  computed: {
    // 计算是否有审核权限
    hasApprovalRight() {
      if (this.currentUserInfo) {
        // if (this.currentUserInfo.id === CONSTRACT_APPROVER.xyx_manager || this.currentUserInfo.id === CONSTRACT_APPROVER.general_manager || this.currentUserInfo.id === CONSTRACT_APPROVER.risk_control_specialist) {
        if (Object.values(CONSTRACT_APPROVER).includes((this.currentUserInfo as any).id)) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
  },
  created() {
    if (this.$route.query.activeName === 'settlement_detail') {
      this.activeName = 'settlement_detail';
    }
    getContractStatement({
      contract_id: this.$route.params.id,
    })
      .then(res => {
        if (res.data.success) {
          this.tableSettleData = res.data.data.data.map((item: any) => {
            item.attachment_url_list = item.attachment_url.split(',');
            return item;
          });
        } else {
          this.$message.warning(res.data.message);
        }
      })
      .catch(() => {
        this.$message.error('合同附件列表获取失败，请稍后重试');
      });
  },
  async mounted() {
    this.getContractDetail();
    // await this.getUserInfo()
    // 获取当前用户信息
    this.currentUserInfo = this.$store.getters['user/getUserInfo'];
  },
  methods: {
    backToList() {
      this.$router.push({ name: RouterNameProjectManage.marketing.contract.supplier.list });
    },
    jumpToCommonBusiness() {
      this.$router.push({
        name: RouterNameProjectManage.commonBusiness.project.list,
      });
    },
    jumpToCommonBusinessDetail() {
      const currentRoute = this.$router.currentRoute;
      this.$router.push({
        name: RouterNameProjectManage.commonBusiness.project.detail,
        params: {
          id: `${currentRoute.query.parent_id}`,
          tab: `${currentRoute.query.parent_tab}`,
        },
      });
    },
    jumpToLegal() {
      this.$router.push({
        name: RouterLegal.contact,
      });
    },
    jumpToStatisticsLegal() {
      this.$router.push({
        name: RouterLegal.constatistics,
      });
    },
    jumpToLive() {
      this.$router.push({
        name: RouterNameProjectManage.live.project.list,
      });
    },
    jumpToLiveDetail() {
      const currentRoute = this.$router.currentRoute;
      this.$router.push({
        name: RouterNameProjectManage.live.project.detail,
        params: {
          id: `${currentRoute.query.parent_id}`,
          tab: `${currentRoute.query.parent_tab}`,
          liveType: 'calendar',
        },
      });
    },
    jumpToCoop() {
      this.$router.push({
        name: RouterNameProjectManage.marketing.project.list,
      });
    },
    jumpToCoopDetail() {
      const currentRoute = this.$router.currentRoute;
      this.$router.push({
        name: RouterNameProjectManage.marketing.project.detail,
        params: {
          id: `${currentRoute.query.parent_id}`,
          tab: `${currentRoute.query.parent_tab}`,
          calendar: 'week',
        },
      });
    },
    jumpToLocalLife() {
      this.$router.push({
        name: RouterNameProjectManage.live.project.list,
      });
    },
    jumpToLocalLifeDetail() {
      const currentRoute = this.$router.currentRoute;
      this.$router.push({
        name: RouterNameProjectManage.localLife.detail.info,
        params: {
          id: `${currentRoute.query.parent_id}`,
          tab: `${currentRoute.query.parent_tab}`,
          liveType: 'calendar',
        },
      });
    },
    jumpToSupplyChain() {
      this.$router.push({
        name: RouterNameProjectManage.supplyChain.list,
      });
    },
    jumpToSupplyChainDetail() {
      const currentRoute = this.$router.currentRoute;
      this.$router.push({
        name: RouterNameProjectManage.supplyChain.detail,
        params: {
          id: `${currentRoute.query.parent_id}`,
          tab: `${currentRoute.query.parent_tab}`,
          liveType: 'calendar',
        },
      });
    },
    jumpToTiktokLiveDetail() {
      const currentRoute = this.$router.currentRoute;
      this.$router.push({
        name: RouterNameProjectManage.tiktokLive.project.detail.info,
        params: {
          id: `${currentRoute.query.parent_id}`,
          tab: `${currentRoute.query.parent_tab}`,
          liveType: 'calendar',
        },
      });
    },
    //  作废合同判断条件1
    limitShow(row: Contract) {
      const isAnnex = row.contract_annex_info.some(item => {
        return item.contract_annex_status === 4;
      });
      const isStatement = this.tableSettleData.some((item: Settlement) => {
        return item.contract_statements_status === 4;
      });
      return (
        (isAnnex || isStatement) &&
        !(row.contract_annex_info.length === 0 && this.tableSettleData.length === 0)
      );
    },
    limitShowClick(row: Contract) {
      if (isExternal()) return false;
      const isAnnex = row.contract_annex_info.every(item => {
        return item.contract_annex_status !== 4;
      });
      const isStatement = this.tableSettleData.every((item: Settlement) => {
        return item.contract_statements_status !== 4;
      });
      return (
        (isAnnex && isStatement) ||
        (row.contract_annex_info.length === 0 && this.tableSettleData.length === 0)
      );
    },
    handleInvalidClick() {
      this.$confirm('此操作将作废合同, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // type: 'warning',
        customClass: 'invalid-confirm',
        dangerouslyUseHTMLString: true,
      })
        .then(() => {
          invalidContract({
            contract_id: this.detail?.contract_info.id,
            invalid_code: 5,
          }).then(res => {
            if (res.data.success) {
              this.$message({
                type: 'success',
                message: res.data.message,
                duration: 2000,
                showClose: true,
              });
              location.reload();
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
    // 上传合同扫描件
    uploadPlans(params: { file: File }) {
      const file = params.file;
      const isLt2M = file.size / 1024 / 1024 < 50;
      if (!isLt2M) {
        this.$message.warning('上传文件大小不能超过 50MB!');
        return;
      }
      const form = new FormData();
      form.append('file', file);
      form.append('type', 'contract/scan');
      uploadFile(form)
        .then(data => {
          if (data.data && data.data.success) {
            (this.isProject
              ? savaContractCopy({
                  contract_scan_urls: [data.data.data.source],
                  contract_id: this.detail?.contract_info.id,
                  save_for_update: 1,
                })
              : savaContractCopyLegal({
                  contract_scan_urls: [data.data.data.source],
                  contract_id: this.detail?.contract_info.id,
                  save_for_update: 1,
                })
            )
              .then(res => {
                if (res.data.success) {
                  this.$message.success('上传成功');
                } else {
                  this.$message.error(res.data.message);
                  throw new Error(res.data.message);
                }
              })
              .then(() => {
                this.detail?.contract_detail.contract_scan_urls.push({
                  url: data.data.data.source,
                  file_name:
                    data.data.data.source.split('/')[data.data.data.source.split('/').length - 1],
                });
              })
              .catch(ex => {
                console.log(ex.message);
              });
          } else {
            this.$message.error('上传失败！');
          }
        })
        .catch(error => {
          this.$message({
            type: 'warning',
            message: error.message || '上传失败，稍后重试',
            showClose: true,
            duration: 2000,
          });
        });
    },
    clearUploadedFile(index: number) {
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        DeleteContractScan({
          contract_scan_urls: [
            this.detail?.contract_detail.contract_scan_urls[index].url,
          ] as string[],
          contract_id: this.detail?.contract_info.id as number,
        })
          .then(res => {
            if (res.data.success) {
              this.detail?.contract_detail.contract_scan_urls.splice(index, 1);
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(() => {
            this.$message.error('删除失败，请稍后重试');
          });
      });
    },
    approveShow(id: number) {
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
    },
    /**
     * @Author: 矢车
     * @Date: 2020-11-17 15:08:01
     * @Description: 点击合同编号-打开新窗口
     */
    handleClick(id: number, contract_type: ContractType, frame_contract_type: number) {
      if (!id) {
        return;
      }
      const tmpInfo = frame_contract_type === 5 || frame_contract_type === 6;
      let routeUrl = this.$router.resolve({
        name: tmpInfo
          ? RouterNameProjectManage.marketing.contract.supplier.detailTemplate
          : RouterNameProjectManage.marketing.contract.supplier.detail,
        params: { id: `${id}` },
        query: {
          contract_type: `${contract_type}`,
        },
      });
      // 这里做兼容,如果是供应商合同处理特殊参数
      if (this.breadcrumb.isLiveSupplierContractDetail) {
        routeUrl = this.$router.resolve({
          name: tmpInfo
            ? RouterNameProjectManage.live.contract.supplier.detailTemplate
            : RouterNameProjectManage.live.contract.supplier.detail,
          params: { id: `${id}` },
          query: {
            ...this.$router.currentRoute.query,
            contract_type: `${contract_type}`,
          },
        });
      } else if (this.breadcrumb.isTiktokSupplierContractDetail) {
        routeUrl = this.$router.resolve({
          name: tmpInfo
            ? RouterNameProjectManage.tiktokLive.contract.supplier.detailTemplate
            : RouterNameProjectManage.tiktokLive.contract.supplier.detail,
          params: { id: `${id}` },
          query: {
            ...this.$router.currentRoute.query,
            contract_type: `${contract_type}`,
          },
        });
      } else if (this.breadcrumb.isLocalLifeSupplierContractDetail) {
        routeUrl = this.$router.resolve({
          name: tmpInfo
            ? RouterNameProjectManage.localLife.contract.supplier.detailTemplate
            : RouterNameProjectManage.localLife.contract.supplier.detail,
          params: { id: `${id}` },
          query: {
            ...this.$router.currentRoute.query,
            contract_type: `${contract_type}`,
          },
        });
      } else if (this.breadcrumb.isSupplyChainSupplierContractDetail) {
        routeUrl = this.$router.resolve({
          name: tmpInfo
            ? RouterNameProjectManage.supplyChain.contract.supplier.detailTemplate
            : RouterNameProjectManage.supplyChain.contract.supplier.detail,
          params: { id: `${id}` },
          query: {
            ...this.$router.currentRoute.query,
            contract_type: `${contract_type}`,
          },
        });
      } else if (this.breadcrumb.isCommonBusinessSupplierContractDetail) {
        routeUrl = this.$router.resolve({
          name: tmpInfo
            ? RouterNameProjectManage.commonBusiness.contract.supplier.detailTemplate
            : RouterNameProjectManage.commonBusiness.contract.supplier.detail,
          params: { id: `${id}` },
          query: {
            ...this.$router.currentRoute.query,
            contract_type: `${contract_type}`,
          },
        });
      } else if (this.breadcrumb.isCoopSupplierContractDetail) {
        routeUrl = this.$router.resolve({
          name: tmpInfo
            ? RouterNameProjectManage.marketing.contract.supplier.detailTemplate
            : RouterNameProjectManage.marketing.contract.supplier.detail,
          params: { id: `${id}` },
          query: {
            ...this.$router.currentRoute.query,
            contract_type: `${contract_type}`,
          },
        });
      } else if (this.breadcrumb.isLegalSupplierContractDetail) {
        routeUrl = this.$router.resolve({
          name: tmpInfo
            ? RouterLegal.contracts.supplier.detailTemplate
            : RouterLegal.contracts.supplier.detail,
          params: { id: `${id}` },
          query: {
            ...this.$router.currentRoute.query,
            contract_type: `${contract_type}`,
          },
        });
      } else if (this.breadcrumb.isLegalStatisticsSupplierContractDetail) {
        routeUrl = this.$router.resolve({
          name: tmpInfo
            ? RouterLegal.statistics.supplier.detailTemplate
            : RouterLegal.statistics.supplier.detail,
          params: { id: `${id}` },
          query: {
            ...this.$router.currentRoute.query,
            contract_type: `${contract_type}`,
          },
        });
      }

      window.open(routeUrl.href, '_blank');
    },
    preview(attachment_url: string) {
      const url = attachment_url;
      const arr = ['.doc', '.ppt', '.xls'];
      const wrUrl =
        'https://view.officeapps.live.com/op/view.aspx?src=' +
        encodeURIComponent(this.fixFileToken(url, false));
      if (url.includes(arr[0]) || url.includes(arr[1]) || url.includes(arr[2])) {
        window.open(wrUrl);
      } else {
        window.open(this.fixFileToken(url, false));
      }
    },
    fixFileToken,
    // 合同扫描件
    scanFileList() {
      if (this.detail && this.detail.contract_detail) {
        const caseArr = this.detail.contract_detail.contract_scan_urls;

        const list = caseArr.map(item => {
          const fileName = item.file_name;
          let iconName = 'picture';
          const filename_suffix = fileName.split('.')[fileName.split('.').length - 1];
          iconName = this.fileTypeIconMap.get(filename_suffix) ?? 'picture';

          return {
            fileName: fileName,
            url: item.url,
            iconName: iconName,
          };
        });
        return list;
      } else {
        return [];
      }
    },
    // 合同附件展示
    caseFileList() {
      if (
        this.detail &&
        this.detail.contract_detail &&
        this.detail.contract_detail.attachment_url_list
      ) {
        const caseArr = this.detail.contract_detail.attachment_url_list;
        const list = caseArr.map(item => {
          const fileName = item.file_name;
          const filename_suffix = fileName.split('.')[fileName.split('.').length - 1];
          const iconName = this.fileTypeIconMap.get(filename_suffix) ?? 'picture';

          return {
            fileName: fileName,
            link: item.url,
            iconName: iconName,
          };
        });
        return list;
      } else {
        return [];
      }
    },
    // 表格1
    cellStyle({ columnIndex }: { columnIndex: number }) {
      if (columnIndex === 4 || columnIndex === 6) {
        //指定坐标
        return 'color-red';
      }
    },
    // 表格2
    cellStyle2({ columnIndex }: { columnIndex: number }) {
      if (columnIndex === 1 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
        //指定坐标
        return 'color-red';
      }
    },
    // 获取详情
    getContractDetail() {
      if (!this.$route.params.id) return false;
      this.loading = true;
      const breadRouter = useBreadcrumbRouter();
      const router_project_id = this.$route.query.parent_id
        ? Number(this.$route.query.parent_id)
        : undefined;

      // const isExternal = this.$router.currentRoute.query.source === 'external';
      queryContract(
        {
          project_id:
            breadRouter.breadcrumb.isCoopCustomerContractDetail ||
            breadRouter.breadcrumb.isCoopSupplierContractDetail
              ? undefined
              : router_project_id,
          cooperation_id:
            breadRouter.breadcrumb.isCoopCustomerContractDetail ||
            breadRouter.breadcrumb.isCoopSupplierContractDetail
              ? router_project_id
              : undefined,
          id: this.$route.params.id,
          contract_type: this.$route.query.contract_type,
          partner_type: 2,
        },
        this.get_type,
        isExternal(),
      )
        .then(res => {
          if (res.data.success) {
            if (res.data.data.data.length > 0) {
              this.detail = res.data.data.data[0];

              if (this.detail === undefined) {
                return;
              }
              (this.editAttachmentData = {
                contract_type: this.detail?.contract_info.contract_type,
                contract_uid: this.detail?.contract_info.contract_uid,
                partner_name: this.detail?.partner_info.partner_name,
                contract_id: this.detail?.contract_info.id,
                partner_id: this.detail?.partner_info.id,
                isEdit: true,
              }),
                (this.editSettlementData = {
                  contract_type: this.detail?.contract_info.contract_type,
                  contract_uid: this.detail?.contract_info.contract_uid,
                  partner_name: this.detail?.partner_info.partner_name,
                  contract_id: this.detail?.contract_info.id,
                  partner_id: this.detail?.partner_info.id,
                  isEdit: true,
                });

              //  新审批进度
              if (
                this.detail?.contract_info.feishu_request_id ||
                this.detail?.contract_info.oa_request_id
              ) {
                this.approveShow(this.detail.contract_info.id);
              }

              // 附件列表
              // contract_annex_info 附件列表，列表里面没有个附件 对应多个文件，所以要展示的话，需要遍历整理数据
              this.attachment_url_list = [];
              if (this.detail.contract_annex_info.length > 0) {
                for (let index = 0; index < this.detail?.contract_annex_info.length; index++) {
                  // this.attachment_url_list = this.attachment_url_list.concat(this.detail.contract_annex_info[i].attachment_url_list || [])
                  if (this.detail.contract_annex_info[index].attachment_url_list.length > 0) {
                    for (
                      let indexJ = 0;
                      indexJ < this.detail.contract_annex_info[index].attachment_url_list.length;
                      indexJ++
                    ) {
                      this.attachment_url_list.push({
                        // 文件地址
                        attachment_url:
                          this.detail.contract_annex_info[index].attachment_url_list[indexJ],
                        // 附件审核状态
                        contract_annex_status:
                          this.detail.contract_annex_info[index].contract_annex_status,
                        // 附件审核状态文字
                        contract_annex_status_str:
                          this.detail.contract_annex_info[index].contract_annex_status_str,
                        // 创建者id
                        add_by: this.detail.contract_annex_info[index].add_by,
                        // 客户经理id
                        manager_id: this.detail.contract_annex_info[index].manager_id,
                        // 附件id
                        id: this.detail.contract_annex_info[index].id,
                        // 申请内容
                        comment: this.detail.contract_annex_info[index].comment,
                      } as never);
                    }
                  }
                }
              }
              // 赋值协议明细
              this.detailList = [
                {
                  sale_chance: this.processSaleChanceToStr(this.detail.contract_info.sale_chance),
                  num: this.detail.contract_detail.num,
                  unit_str: this.detail.contract_detail.unit_str,
                  price: this.detail.contract_detail.price,
                  discount: this.detail.contract_detail.discount,
                  contract_amount: this.detail.contract_detail.contract_amount,
                } as never,
              ];
              // 赋值 合同状态
              this.isRecycled = this.detail.contract_info.is_recycled === 1;
            }
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
        .catch(() => {
          this.loading = false;
        });
    },
    // 处理销售渠道
    processSaleChanceToStr(saleChance: any) {
      // console.log(saleChance)
      let str = '';
      saleChance.map((item: any) => {
        str += item.sale_chance_name + '、';
        return item;
      });
      return str.substr(0, str.length - 1);
    },
    // 删除合同
    async handleDeleteContractClick() {
      if (this.detail === undefined) return false;

      const result = await AsyncConfirm({ root: this }, '此操作将删除该合同, 是否继续？');

      if (!result) {
        return;
      }
      // this.$confirm('此操作将删除该合同, 是否继续？', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   customClass: 'delete-contract-alert',
      //   center: true,
      // })
      //   .then(() => {
      deleteContract({
        contract_id: this.detail.contract_info.id,
      })
        .then(res => {
          this.$message({
            type: res.data.success ? 'success' : 'warning',
            message: res.data.message,
            duration: 2000,
            showClose: true,
          });
          if (res.data.success) {
            this.$router.back();
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
      // })
      // .catch(() => {
      //   /* do nth */
      // });
    },
    // 编辑合同
    handleEditContractClick() {
      (this.$refs.editContractDialog as any).show(this.detail);
    },
    oprateBtnVisiable() {
      // 当合同状态为【正常】时不可以删除，【审批中】不可删除，合同的客户经理id等于当前用户的时候可以删除，合同的创建者为当前用户可以删除
      if (isExternal()) return false;
      const visiable =
        this.detail &&
        this.detail.contract_info.contract_status !== 2 &&
        this.detail.contract_info.contract_status !== 4 &&
        this.currentUserInfo &&
        ((this.currentUserInfo as any).id === this.detail.contract_info.manager_id ||
          (this.currentUserInfo as any).id === this.detail.contract_detail.add_by);
      return visiable;
    },
    // 合同附件删除权限
    attachmentDeleteRight(attachment: any) {
      const currentUserInfo = this.$store.getters['user/getUserInfo'];
      const visiable =
        attachment.contract_annex_status !== 4 && // 附件状态除审批中状态可以删除
        ((currentUserInfo && currentUserInfo.id === attachment.add_by) || // 创建人自己可以删除
          (currentUserInfo && currentUserInfo.id === attachment.manager_id)); // 创建时指定的客户经理可以删除
      return visiable;
    },
    // 点击审核按钮
    handleReviewBtnClick() {
      (this.$refs.reviewDialog as any).show(this.detail?.contract_info);
    },
    // 获取当前用户的角色码
    getCurrentUserRoleCode() {
      if (this.currentUserInfo && (this.currentUserInfo as any).role_info.length > 0) {
        return (this.currentUserInfo as any).role_info[0].role_code;
      } else {
        return false;
      }
    },
    handleFileDownloadClick(urlString: string, fileName: string) {
      // 合同附件 合同扫描件 下载
      fetch(urlString, this.requestOptions).then(async response => {
        const result = response.clone();
        try {
          const data = await result.json();
          this.$message.error(data.message);
        } catch {
          if (response.status === 200) {
            const data = await response.blob();
            downloadFileFromBlob(data, fileName);
          } else {
            this.$message.error('下载失败');
          }
        }
      });
    },
    // 点击设置合同收回状态
    handleContractRecycleChange() {
      setContractRecycle({
        id: this.detail?.contract_info.id,
        is_recycled: this.isRecycled ? 1 : 0,
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
            this.isRecycled = !this.isRecycled;
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
          this.isRecycled = !this.isRecycled;
          this.$message({
            type: 'error',
            message: '设置合同收回状态失败，稍后重试',
            duration: 2000,
            showClose: true,
          });
          console.log(error.message);
        });
    },
    // 点击删除附件
    handleAttachmentClick(row: any) {
      this.$confirm('此操作将永久删除该附件, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'delete-attachment-confirm',
      })
        .then(() => {
          deleteContractAnnex({
            contract_annex_id: row.id,
            attachment_url: row.attachment_url,
          })
            .then(res => {
              if (res.data.success) {
                this.getContractDetail();
                this.$message.success(res.data.message);
              } else {
                this.$message.warning(res.data.message);
              }
            })
            .catch(error => {
              this.$message.error('删除附件失败，请稍后重试');
              console.error(error);
            });
        })
        .catch(() => {
          /* do nth */
        });
    },
  },
});
</script>
<style lang="less">
@import '@/styles/utils/index.less';
.approval-status-label-circle {
  .hlh(20px, 20px);
  .brdr(10px);
  .pd(0 6px);

  font-weight: 400;
  .fs(var(--default-font-size));
  // * 框架
  &.pending,
  &.processing {
    @fgColor: var(--warning-color);
    @bgColor: rgba(var(--warning-rgb-color), 0.1);
    .fgc(@fgColor);
    .brd(rgba(var(--warning-rgb-color), 0.8));
    .bgc(@bgColor);
  }
  &.normal {
    @fgColor: var(--success-color);
    @bgColor: rgba(var(--success-rgb-color), 0.1);
    .fgc(rgba(var(--success-rgb-color), 0.7));
    .brd(rgba(var(--success-rgb-color), 0.6));
    .bgc(@bgColor);
  }
  // * 销售
  &.failure {
    @fgColor: var(--error-color);
    @bgColor: rgba(var(--error-rgb-color), 0.1);
    .fgc(rgba(var(--error-rgb-color), 0.85));
    .brd(rgba(var(--error-rgb-color), 0.8));
    .bgc(@bgColor);
  }
  // * 采买
  &.invalid {
    @fgColor: var(--fail-color);
    @bgColor: fade(#3c5269, 8);
    .fgc(@fgColor);
    .brd(#C9D0D6);
    .bgc(@bgColor);
  }
}
.contract-type-label-circle {
  .hlh(20px, 20px);
  .brdr(10px);
  .pd(0);
  .mgr(4px);

  font-weight: 400;
  .fs(var(--default-font-size));
  // * 框架
  &.framework,
  &.supplierframework {
    @fgColor: #2eb5ff;
    @bgColor: fade(@fgColor, 8);
    .fgc(@fgColor);
    .brd(fade(@fgColor, 85));
    .bgc(@bgColor);
  }
  // * 销售
  &.sales {
    @fgColor: #2877ff;
    @bgColor: fade(@fgColor, 8);
    .fgc(fade(@fgColor, 90));
    .brd(fade(@fgColor, 80));
    .bgc(@bgColor);
  }
  // * 采买
  &.purchase {
    @fgColor: #3f6dff;
    @bgColor: fade(#7999ff, 10);
    .fgc(fade(@fgColor, 90));
    .brd(fade(@fgColor, 80));
    .bgc(@bgColor);
  }
}
</style>
<style lang="scss" scoped>
@import '@/assets/scss/public.scss';
$color-primary: var(--theme-color);
.tabs-back {
  margin-top: 10px;

  .tabs-title {
    padding: 20px 0;
    padding-bottom: 5px;
    background: #fff;
    font-size: 16px;
    padding-left: 20px;
  }
}

.contract-sale-chance {
  display: flex;
  width: 384px;
  flex-wrap: wrap;

  li {
    margin: 5px 10px;
    margin-left: 0;
    background: #f3f4f6;
    padding: 4px;
    font-size: 13px;
  }
}

.contract-detail {
  position: relative;
  min-width: 1000px;

  ::v-deep .el-table__body-wrapper {
    margin-bottom: 10px;
  }

  .content-block {
    .block-content {
      padding: 10px 0px;
      padding-top: 0px;

      ::v-deep .el-table {
        border-radius: 4px !important;

        ::v-deep .has-gutter {
          ::v-deep tr {
            height: 40px;
            background-color: #fafafa;
          }

          ::v-deep th {
            background-color: #fafafa !important;
            border: none !important;
          }
        }

        tr {
          height: 58px;

          th > .cell {
            font-weight: 600;
            color: var(--text-des-color);
            font-size: 14px;
            background: #fafafa;
          }
        }

        .cell {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
        }
      }
    }
  }

  .contract-detail-content {
    min-height: 400px;
  }

  .content-block {
    background: #fff;
    padding: 5px 20px;
    padding-bottom: 0;

    ::v-deep .el-table {
      border-radius: 4px;
    }

    ::v-deep .el-table th.is-leaf {
      border-bottom: 1px solid var(--table-border-color);
    }

    ::v-deep .el-table td {
      border-bottom: 1px solid var(--table-border-color);
    }

    ::v-deep .el-table th.is-right {
      text-align: left;
    }

    ::v-deep .el-table td.is-right {
      text-align: left;
    }

    .block-title {
      margin: 20px 0 !important;
      margin-top: 15px !important;
      margin-bottom: 4px !important;
      position: relative;
      color: var(--text-color);
      font-weight: 600;
      display: flex;
      align-items: center;
      font-size: 16px;
    }

    .block-content {
      &.basic-info {
        .info-line {
          margin-bottom: 16px;

          .label {
            color: var(--text-third-color);
            display: inline-block;
            width: 96px;
            text-align: right;

            &.sale-chance-label {
              vertical-align: middle;
            }
          }

          .value {
            color: var(--text-color);

            &.contract-number {
              color: #4c76ff;
              font-weight: 600;
            }

            &.sale-chance-value_eclipse {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }

            &.sale-chance-value {
              width: calc(100% - 100px);
              display: inline-block;
              vertical-align: text-top;
              line-height: 24px;
            }

            .contract-status-all {
              // display: inline-block;
              // width: 52px;
              // height: 20px;
              // line-height: 20px;
              // border-radius: 4px;
              // text-align: center;
              // font-size: 12px;
            }

            .contract-status-1 {
              color: #ff7a36;
              border: 1px solid #ff7a36;
              background: rgba(255, 122, 54, 0.1);
            }

            .contract-status-2 {
              color: #3eaf90;
              border: 1px solid #3eaf90;
              background: rgba(62, 175, 144, 0.1);
            }

            .contract-status-3 {
              color: #e91313;
              border: 1px solid #e91313;
              background: rgba(255, 122, 54, 0.1);
            }

            .contract-status-4 {
              color: #ff7a36;
              border: 1px solid #ff7a36;
              background: rgba(236, 65, 65, 0.1);
            }

            .contract-status-5 {
              color: #999999;
              border: 1px solid #999999;
              background: rgba(153, 153, 153, 0.1);
            }

            .approve-btn {
              margin-left: 12px;
              border-bottom: #9fa3b3 solid 1px;
              padding: 0 2px;
              color: #9fa3b3;
              cursor: pointer;

              i {
                display: inline-block;
                width: 12px;
                height: 12px;
                background: url(../../assets/img/shenpi_icon.png) no-repeat;
                vertical-align: middle;
                margin-right: 4px;
                position: relative;
                bottom: 1px;
              }

              &:hover {
                color: $color-primary;
                border-color: $color-primary;

                i {
                  background-position: -12px 0;
                }
              }
            }

            .see-reason-btn {
              color: $color-primary;
              cursor: pointer;
            }
          }
        }
      }

      &.contract-detail {
        .attachment {
          line-height: 37px;
          padding-top: 8px;

          .attachment-label {
            color: var(--text-color);
            font-weight: 600;
          }

          .file-back {
            margin-top: -16px;
            display: flex;
            flex-wrap: wrap;
            padding-bottom: 20px;
            border-bottom: 1px solid #ebebeb;
          }

          .list {
            width: 178px;
            height: 112px;
            display: flex;
            flex-direction: column;
            font-size: 12px;
            border: 1px solid #ebebeb;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            margin-right: 30px;
            margin-top: 16px;
            border-radius: 4px;

            img {
              width: 28px;
              height: 28px;
            }

            a {
              line-height: 36px;
              height: 33px;
              font-size: 12px;
            }

            a:last-child {
              height: 20px;
              line-height: 20px;
            }

            .icons {
              color: var(--icon-color);
              font-size: 20px;
              position: relative;
              top: 7px;
            }

            .icons-title {
              color: var(--text-third-color);
              margin-top: 13px;

              p {
                line-height: 20px;
                text-align: center;
              }
            }

            .delete_tr {
              position: absolute;
              margin-left: 177px;
              margin-top: -110px;
              font-size: 16px;

              i:hover {
                color: red !important;
              }
            }
          }

          .attachment-icon {
            vertical-align: middle;
            width: 30px;
          }

          .attachment-name {
            display: inline-block;
            max-width: 160px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: var(--text-color);
          }

          .attachment-link {
            color: $color-primary;
            font-size: 12px;
          }

          .no-attachment {
            color: var(--text-third-color);
            font-size: 14px;
          }
        }
      }

      // &.plan-list,
      // &.attachment-list {
      //   padding: 20px 30px;
      // }
      &.attachment-list {
        .download-btn {
          text-decoration: underline;
          color: $color-primary;
          margin: 0 5px;
        }

        .delete-btn {
          text-decoration: underline;
          color: #f34b60;
          margin: 0 5px;
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
            background-color: #396fff;
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
      }
    }
  }

  .no-detail {
    text-align: center;
    padding-top: 140px;

    p {
      color: var(--text-third-color);
      margin-top: 30px;
    }
  }

  .info-line-last {
    padding-bottom: 20px;
    margin-top: -10px;
    color: var(--text-third-color);
  }
}

.contract-detail {
  ul {
    display: grid;
    grid-template-columns: 33.3% 33.3% 33.3%;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebebeb;

    li {
      height: 35px;
      line-height: 35px;

      .contract-detail-label {
        color: var(--text-third-color);
        display: inline-block;
        width: 87px;
        text-align: right;
      }

      .contract-detail-value {
        color: var(--text-color);
      }
    }
  }
}

.tabs-btn {
  position: absolute;
  z-index: 1;
  margin-top: 26px;
  right: 23px;
  color: $color-primary;

  span {
    cursor: pointer;
  }
}

::v-deep .color-red > .cell {
  display: flex;

  &::before {
    content: '￥';
  }
}

::v-deep .el-tabs__header {
  background: white;

  ::v-deep .el-tabs__nav-wrap:after {
    background-color: white;
  }

  .el-tabs__nav {
    margin: 0 15px;
  }
}

::v-deep .el-col-24 {
  width: 33.3%;
}

::v-deep .el-tabs__item {
  font-size: 16px;
}

::v-deep .el-tabs__item.is-active {
  color: $color-primary;
  font-weight: 600;
}

::v-deep .el-tabs__nav-wrap {
  margin-top: 10px;
  margin-bottom: -14px;
}

.upload-file {
  position: absolute;
  width: 178px;
  height: 110px;
}

.operates {
  position: absolute;
  right: 0px;

  ::v-deep .el-button {
    background-color: white !important;
    border: 1px solid var(--border-line-color);
    color: #333 !important;
  }
}

.contract-detail .content-block {
  ::v-deep .el-table td.is-right {
    color: var(--text-color);
  }
}

.block-content ::v-deep .el-table {
  td {
    color: var(--text-color);
  }
}

::v-deep .el-table__row:last-child {
  td {
    border: none !important;
  }
}

.border-kj {
  border: 1px solid #6e6be9;
  color: #6e6be9;
  display: inline-block;
  width: 40px;
  text-align: center;
  height: 20px;
  line-height: 20px;
  border-radius: 20px;
  background: #e9eaf5;
  margin-right: 5px;
  font-size: 12px;
  font-weight: 600;
}
</style>

<style lang="less">
.delete-contract-alert.el-message-box .el-message-box__content {
  height: initial;
}

.delete-contract-alert.el-message-box .el-message-box__content .el-message-box__message {
  top: 0;
}

.approve-progress-popper {
  padding: 0;
}

.delete-attachment-confirm.el-message-box {
  .el-message-box__content {
    height: initial;
    text-align: center;
  }

  .el-message-box__status {
    position: initial;
  }

  .el-message-box__message {
    position: initial;
    top: initial !important;
  }
}
#contract-detail-title {
  line-height: 42px;
  height: 42px !important;
  padding-left: 18px;
  span {
    color: var(--text-second-color);
    font-weight: 400;
  }
  .title {
    color: var(--text-third-color);
  }
  .breakcrumb-no-link {
    color: var(--text-second-color);
  }
}
</style>
