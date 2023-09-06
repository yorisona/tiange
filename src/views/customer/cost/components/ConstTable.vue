<template>
  <tg-block class="achievementtable-container mgt-10" bodyStyle="padding: 18px">
    <div class="result-list">
      <div class="button-line">
        <tg-button
          type="primary"
          icon="ico-btn-export"
          v-if="Permission.canExport && dataSource.total !== 0"
          @click="handleExportClick"
          >导出</tg-button
        >
        <div v-if="dataSource.stat_info" class="all-amount">
          <span class="all-amount-1">
            打款总金额
            <el-tooltip
              content="需要进行打款的总金额（包含未打款金额）"
              placement="bottom"
              effect="light"
            >
              <i class="el-icon-question" /> </el-tooltip
            >:
            <span class="color-blue">￥{{ dataSource.stat_info.all_pay_amount_str }}</span>
          </span>
          <span class="all-amount-1">
            税点总金额:
            <span class="color-blue">￥{{ dataSource.stat_info.all_tax_point_str }}</span>
          </span>
          <span style="color: #bbbdc0; font-size: 12px"
            >* 统计结果为当前页，根据筛选条件的变化而变化</span
          >
        </div>
      </div>
      <el-alert
        :closable="false"
        style="margin-top: 12px; padding: 9px 21px; border: 1px solid rgba(255, 122, 54, 0.5)"
        type="warning"
        show-icon
      >
        <template #title>
          <span
            >本页面即将下线，新的版块【财务管理-付款管理】已上线，请尽可能转至新版块工作，新版块如有不满足使用需求的地方请反馈给</span
          >
          <a href="dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=qdlylsy"
            >研发部-产品经理
          </a>
        </template>
      </el-alert>
      <div class="list cost-list">
        <el-table
          stripe
          v-if="Permission.canViewList"
          :data="dataSource !== null ? dataSource.data : []"
          style="width: 100%; margin-top: 15px; margin-bottom: 10px"
          :header-cell-style="{
            background: 'var(--table-thead-th-bg-color)',
            height: '42px',
            color: 'var(--text-second-color)',
            fontWeight: 'bold',
          }"
          @selection-change="handleSelectionChange"
        >
          <template #empty>
            <table-no-data
              :isvertical="true"
              title="暂时木有内容呀~"
              class="no_data"
              :img="require('@/assets/img/cooperative/xt_nodata_cost.png')"
            ></table-no-data>
          </template>
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column
            :formatter="
              (row, column, cellValue, index) => (page.page_num - 1) * page.num + (index + 1)
            "
            label="序号"
            width="60"
            fixed="left"
            align="center"
          />
          <el-table-column prop="manager" label="客户经理 / 关联业绩" width="170">
            <template #default="{ row }">
              <span>{{ row.manager || '--' }}</span>
              <p>
                <span v-if="row.cost_type === 2">借款</span>
                <span class="color-blue" v-else>{{ row.achievement_uid }}</span>
              </p>
            </template>
          </el-table-column>

          <el-table-column prop="manager" label="店铺名称" width="130">
            <template #default="{ row }">
              <span>{{ row.shop_name || '--' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="KOL / 机构 /关联合同" min-width="140">
            <template #default="{ row }">
              <p class="text-kol">
                <span class="color-blue">{{ row.kol_name || '--' }}</span>
              </p>
              <p class="text-kol">
                <span style="color: #333">{{
                  row.is_personal === 1 ? '个人' : row.company_name || '--'
                }}</span>
              </p>
              <p>
                <span v-if="row.has_contract === 2">无合同</span>
                <span v-else>
                  合同编号：
                  <tg-button @click="handleClick(row.contract_id)" type="link">查看</tg-button>
                </span>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="业务执行日期" width="140" :render-header="TotalSales">
            <template #default="{ row }">
              <div v-if="row.live_start_date">
                <p>{{ row.live_start_date }}~</p>
                <p>{{ row.live_end_date }}</p>
              </div>
              <p v-else>
                <span>--</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column min-width="140" label="打款信息">
            <template #default="{ row }">
              <p>
                <span class="txt-gwtitle">时间:</span>
                <span class="txt-gwinfo">{{ row.pay_date }}</span>
              </p>
              <p>
                <span class="txt-gwtitle">账户:</span>
                <span class="txt-gwinfo" v-if="row.pay_account === 1">时光机</span>
                <span class="txt-gwinfo" v-if="row.pay_account === 2">玥每映像</span>
                <span class="txt-gwinfo" v-if="row.pay_account === 3">构美子账户</span>
              </p>
              <p>
                <span class="txt-gwtitle">方式:</span>
                <!-- <span class="txt-gwinfo">{{row.pay_way===1 ? '银行卡' : 'v任务'}}</span> -->
                <span v-if="row.pay_way === 1" class="txt-gwinfo">银行卡</span>
                <span v-if="row.pay_way === 2" class="txt-gwinfo">v任务</span>
                <span v-if="row.pay_way === 3" class="txt-gwinfo">对公银行</span>
                <span v-if="row.pay_way === 4" class="txt-gwinfo">对公支付宝</span>
                <a
                  v-if="row.pay_way === 2"
                  class="link"
                  style="font-size: 14px"
                  @click="showVLink(row.pay_way_detail)"
                  >查看</a
                >
                <el-popover
                  placement="top"
                  trigger="hover"
                  v-if="
                    row.pay_way === 1 &&
                    (row.bank_info.bank_card_num === '' || row.bank_info === '')
                  "
                >
                  <template slot="reference">
                    <i
                      class="iconfont iconjinggao"
                      style="font-size: 15px !important; color: red; cursor: pointer"
                    ></i>
                  </template>
                  <div>
                    <i
                      class="iconfont iconjinggao"
                      style="font-size: 15px !important; color: rgba(242, 100, 103, 1)"
                    ></i>
                    <span style="color: rgba(242, 100, 103, 1); font-size: 12px"
                      >待媒介补充银行卡信息</span
                    >
                  </div>
                </el-popover>
                <el-popover
                  placement="bottom"
                  trigger="hover"
                  popper-class="tipbankinfo"
                  v-if="
                    row.pay_way === 1 && row.bank_info !== '' && row.bank_info.bank_card_num !== ''
                  "
                >
                  <template slot="reference">
                    <i
                      class="iconfont icongengduo"
                      style="font-size: 15px !important; color: #5c82ff; cursor: pointer"
                    ></i>
                  </template>
                  <div>
                    <div style>
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#iconbank" />
                      </svg>
                      <span>银行卡信息</span>
                    </div>
                    <div
                      style="
                        width: 100%;
                        height: 1px;
                        background: rgba(238, 239, 241, 1);
                        border-radius: 2px;
                        margin: 5px 0;
                      "
                    ></div>
                    <div style="display: flex; flex-direction: row; justify-content: space-around">
                      <div style="padding-right: 60px">
                        <p style="line-height: 24px; color: #666">
                          <label style="color: var(--text-des-color)">主播真实姓名：</label>
                          {{ row.bank_info.real_name || '--' }}
                        </p>
                        <p style="line-height: 24px; color: #666">
                          <label style="color: var(--text-des-color)">开户行：</label>
                          {{ row.bank_info.bank_name || '--' }}
                        </p>
                        <p style="line-height: 24px; color: #666">
                          <label style="color: var(--text-des-color)">银行卡号：</label>
                          {{ row.bank_info.bank_card_num || '--' }}
                        </p>
                        <p style="line-height: 24px; color: #666">
                          <label style="color: var(--text-des-color)">身份证号：</label>
                          {{ row.bank_info.id_number || '--' }}
                        </p>
                        <p style="line-height: 24px; color: #666">
                          <label style="color: var(--text-des-color)">手机号：</label>
                          {{ row.bank_info.phone || '--' }}
                        </p>
                      </div>
                      <div>
                        <a
                          style="border-radius: 2px; position: relative; display: block"
                          v-if="row.bank_info.bank_card_pic"
                          :href="row.bank_info.bank_card_pic + '?Authorization=' + getToken()"
                          target="_blank"
                        >
                          <img
                            style="width: 76px; height: 57px"
                            :src="row.bank_info.bank_card_pic + '?Authorization=' + getToken()"
                            alt
                          />
                          <div
                            style="
                              width: 100%;
                              background: #000;
                              opacity: 0.4;
                              line-height: 20px;
                              position: absolute;
                              bottom: 0;
                              color: #fff;
                              text-align: center;
                              font-size: 12px;
                            "
                          >
                            银行卡照片
                          </div>
                        </a>
                        <span v-else style="border-radius: 2px; position: relative; display: block">
                          <img
                            style="width: 76px; height: 57px"
                            src="@/assets/img/default_img.png"
                            alt
                          />
                          <div
                            style="
                              width: 100%;
                              background: #000;
                              opacity: 0.4;
                              line-height: 20px;
                              position: absolute;
                              bottom: 0;
                              color: #fff;
                              text-align: center;
                              font-size: 12px;
                            "
                          >
                            暂无照片
                          </div>
                        </span>
                        <a
                          style="border-radius: 2px; position: relative; display: block"
                          v-if="row.bank_info.id_card_pic"
                          :href="row.bank_info.id_card_pic + '?Authorization=' + getToken()"
                          target="_blank"
                        >
                          <img
                            style="width: 76px; height: 57px"
                            :src="row.bank_info.id_card_pic + '?Authorization=' + getToken()"
                            alt
                          />
                          <div
                            style="
                              width: 100%;
                              background: #000;
                              opacity: 0.4;
                              line-height: 20px;
                              position: absolute;
                              bottom: 0;
                              color: #fff;
                              text-align: center;
                              font-size: 12px;
                            "
                          >
                            身份证照片
                          </div>
                        </a>
                        <span v-else style="border-radius: 2px; position: relative; display: block">
                          <img
                            style="width: 76px; height: 57px"
                            src="@/assets/img/default_img.png"
                            alt
                          />
                          <div
                            style="
                              width: 100%;
                              background: #000;
                              opacity: 0.4;
                              line-height: 20px;
                              position: absolute;
                              bottom: 0;
                              color: #fff;
                              text-align: center;
                              font-size: 12px;
                            "
                          >
                            暂无照片
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                </el-popover>
                <!-- 对公银行 -->
                <el-popover
                  placement="bottom"
                  trigger="hover"
                  popper-class="tipbankinfo"
                  v-if="row.pay_way === 3"
                >
                  <template slot="reference">
                    <i
                      class="iconfont icongengduo"
                      style="font-size: 15px !important; color: #5c82ff; cursor: pointer"
                    ></i>
                  </template>
                  <div style="padding-right: 60px">
                    <p style="line-height: 24px; color: #666">
                      <label style="color: var(--text-des-color)">公司名称：</label>
                      {{ row.pay_way_detail[0].collecting_company || '--' }}
                    </p>
                    <p style="line-height: 24px; color: #666">
                      <label style="color: var(--text-des-color)">开户行：</label>
                      {{ row.pay_way_detail[0].bank_of_deposit || '--' }}
                    </p>
                    <p style="line-height: 24px; color: #666">
                      <label style="color: var(--text-des-color)">银行卡号：</label>
                      {{ row.pay_way_detail[0].bank_card_number || '--' }}
                    </p>
                  </div>
                </el-popover>

                <!-- 对公支付宝 -->
                <el-popover
                  placement="bottom"
                  trigger="hover"
                  popper-class="tipbankinfo"
                  v-if="row.pay_way === 4"
                >
                  <template slot="reference">
                    <i
                      class="iconfont icongengduo"
                      style="font-size: 15px !important; color: #5c82ff; cursor: pointer"
                    ></i>
                  </template>
                  <div style="padding-right: 60px">
                    <p style="line-height: 24px; color: #666">
                      <label style="color: var(--text-des-color)">收款人：</label>
                      {{ row.pay_way_detail[0].collecting_person || '--' }}
                    </p>
                    <p style="line-height: 24px; color: #666">
                      <label style="color: var(--text-des-color)">支付宝账号：</label>
                      {{ row.pay_way_detail[0].alipay_account || '--' }}
                    </p>
                  </div>
                </el-popover>

                <template v-if="row.pay_way === 3 || row.pay_way === 4">
                  <p style="display: flex; overflow: hidden">
                    <span style="color: var(--text-des-color); white-space: nowrap"
                      >用款审批编号:</span
                    >
                    <span
                      @click="approvalUidClick(row)"
                      style="color: #396fff; cursor: pointer; font-size: 14px"
                      >查看</span
                    >
                  </p>
                </template>
                <template v-if="row.borrowing_uid">
                  <p style="display: flex; overflow: hidden">
                    <span style="color: var(--text-des-color); white-space: nowrap"
                      >垫款审批编号:</span
                    >
                    <span
                      @click="loanApprovalNumber(row)"
                      style="color: #396fff; cursor: pointer; font-size: 14px"
                      >查看</span
                    >
                  </p>
                </template>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="打款金额" width="120">
            <template #default="{ row }">
              <span class="txt-skamount">{{
                row.pay_amount_str ? `￥${row.pay_amount_str}` : '--'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="税点金额" min-width="90">
            <template #default="{ row }">
              <span class="txt-skamount" v-if="row.is_invoice === 1">{{
                row.tax_point_str ? `￥${row.tax_point_str}` : '--'
              }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template #default="{ row }">
              <el-popover
                placement="top-start"
                width="200"
                trigger="click"
                v-if="row.note !== ''"
                :content="row.note"
              >
                <template slot="reference">
                  <span style="color: #5c82ff; cursor: pointer; font-size: 14px">查看</span>
                </template>
                <p>{{ row.note }}</p>
              </el-popover>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="gather_amount" label="是否有发票" min-width="90">
            <template #default="{ row }">
              <p>
                <span class="txt-gwtitle">开票：</span>
                <span>{{ row.is_invoice === 0 ? '否' : row.is_invoice === 1 ? '是' : '--' }}</span>
              </p>
              <p class="img-flex">
                <span class="txt-gwtitle txt-center">凭证：</span>
                <i
                  v-if="row.invoice_info.length !== 0"
                  class="iconfont icontupian txt-center"
                  style="
                    font-size: 30px !important;
                    color: #396fff;
                    cursor: pointer;
                    vertical-align: bottom;
                  "
                  @click="
                    () => {
                      invoice_show(row);
                    }
                  "
                ></i>
                <span v-else class="txt-center">&nbsp;--</span>
              </p>
            </template>
          </el-table-column>

          <el-table-column label="是否打款" align="center" min-width="90">
            <template #default="{ row }">
              <span>&nbsp;&nbsp;打款：{{ row.is_pay === 1 ? '是' : '否' }}</span>
              <div style="white-space: nowrap">
                &nbsp;&nbsp;凭证:
                <i
                  v-if="row.pay_certificate_pic !== ''"
                  class="iconfont icontupian txt-center"
                  style="
                    font-size: 30px !important;
                    color: #396fff;
                    cursor: pointer;
                    vertical-align: bottom;
                  "
                  @click="
                    () => {
                      displayImg('打款凭证详情', row.pay_certificate_pic, row.pay_certificate_pic);
                    }
                  "
                ></i>
                <span v-else>&nbsp;&nbsp;--</span>
              </div>
              <!-- </div> -->
            </template>
          </el-table-column>
          <!-- <el-table-column fixed="right" label="财务操作" align="center" min-width="90">
            <template #default="{ row }">
              <div>
                <p v-if="Permission.canUploadEvidence">
                  <tg-button
                    v-if="row.pay_certificate_pic !== ''"
                    type="link"
                    @click="uploadHandel(row)"
                    >编辑凭证</tg-button
                  >
                  <tg-button v-else type="link" @click="uploadHandel(row)">打款凭证</tg-button>
                </p>
                <p v-else>--</p>
                <p v-if="Permission.canUploadInvoice">
                  <tg-button
                    v-if="row.invoice_info.length !== 0"
                    type="link"
                    @click="uploadHandelEdit(row)"
                    >编辑发票</tg-button
                  >
                  <tg-button v-else type="link" @click="uploadHandelAdd(row)">上传发票</tg-button>
                </p>
                <p v-else>--</p>
              </div>
            </template>
          </el-table-column> -->
        </el-table>
        <el-pagination
          v-if="Permission.canViewList"
          class="contract-pagination"
          :current-page.sync="page.page_num"
          :page-sizes.sync="page.pageSizes"
          :page-size="page.num"
          layout="total, prev, pager, next, sizes, jumper"
          :total="dataSource !== null ? dataSource.total : 0"
          @current-change="handleCurrentChange"
          @size-change="handlePageSizeChange"
        ></el-pagination>
      </div>
    </div>
    <!-- 预览凭证 -->
    <image-dialog ref="imageDialog" :imgsrc="imgsrc" :title="imgtitle" :imgsrc_list="imgsrc_list" />
    <!-- v任务链接 -->
    <VLinkDialog ref="vLinkDialog" :v-link="vLink" />
    <!-- 上传开票凭证 -->
    <CertificateUploadMoreDialog
      ref="certificateUploadDialog"
      :id="cost_id"
      @upload-close="dialogCancelHandle"
      :type="'certificate/cost_pay_certificate'"
    />
    <!-- 上传开票信息 -->
    <CostEditInvoiceDialog
      ref="costEditInvoiceDialog"
      :id="cost_id"
      :type="'certificate/cost_invoice_certificate '"
      @upload-close2="dialogCancelHandle2"
    />
    <!-- 上传开票信息 -->
    <InvoiceShowDialog
      ref="InvoiceShowDialog"
      :id="cost_id"
      :type="'certificate/cost_invoice_certificate '"
      @upload-close2="dialogCancelHandle2"
    />
    <!-- 审批编号弹窗 -->
    <apply-detail ref="applyDetailDialog" v-if="customerVisible" @close="close" />
    <application-detail ref="applicationDetail" v-if="loanFLag" @close="close"></application-detail>
  </tg-block>
</template>

<script>
import ApplyDetail from '../../../workbench/components/ApplyDetail';
import CostEditInvoiceDialog from '../../components/CostEditInvoice';
import applicationDetail from '@/views/workbench/application/applicationDetail';
import InvoiceShowDialog from '../../components/invoiceShow';
import { RIGHT_CODE } from '@/const/roleCode';
import { mapGetters } from 'vuex';
import CertificateUploadMoreDialog from '../../components/CertificateUploadMore';
import VLinkDialog from '@/views/customer/cooperative/confirm_cooperation/cost/VLinkDialog';
import { getToken } from '@/utils/token';
// import { updateIsPay } from '@/api/cooperative';
// import { queryTransferApplyInfo } from '@/api/workbench';
import { RouterNameProjectManage } from '@/const/router';

import { RIGHT_CODE as NEW_RIGHT_CODE } from '@/const/rightCode';
import { computed } from '@vue/composition-api';
import { HasPermission } from '@/use/permission';

export default {
  name: 'ConstTable',
  props: ['page', 'dataSource'],
  components: {
    CertificateUploadMoreDialog,
    VLinkDialog,
    CostEditInvoiceDialog,
    InvoiceShowDialog,
    ApplyDetail,
    applicationDetail,
  },
  setup(props, ctx) {
    /** 权限检查 */
    const Permission = computed(() => {
      const canViewList = HasPermission(NEW_RIGHT_CODE.cost_view);
      const canExport = HasPermission(NEW_RIGHT_CODE.cost_export);
      const canCreate = HasPermission(NEW_RIGHT_CODE.cost_create);
      const canUploadEvidence = HasPermission(NEW_RIGHT_CODE.cost_upload_edit_pay_evidence);
      const canUploadInvoice = HasPermission(NEW_RIGHT_CODE.cost_upload_edit_invoice);

      return { canViewList, canExport, canCreate, canUploadEvidence, canUploadInvoice };
    });
    return { Permission };
  },
  data() {
    return {
      customerVisible: false, //审批编号弹窗
      loanFLag: false, // 借款审批编号弹窗
      imgsrc_list: '',
      partner_type: 2,
      RIGHT_CODE,
      imgsrc: '',
      imgtitle: '',
      multipleSelectionIds: [],
      cost_id: '',
      vLink: [],
    };
  },
  computed: {
    ...mapGetters({
      UserRoles: 'user/getUserRole',
    }),
  },
  methods: {
    loanApprovalNumber(row) {
      this.loanFLag = true;
      // 传递给子组件
      this.$nextTick(() => {
        this.$refs.applicationDetail.show(row);
        this.$refs.applicationDetail.cost_show = false;
      });
    },
    // 点击进入供应商合同详情-打开新窗口
    handleClick(row) {
      const routeUrl = this.$router.resolve({
        name: RouterNameProjectManage.marketing.contract.supplier.detail,
        params: {
          id: row,
        },
        query: {
          partner_type: 2,
        },
      });
      window.open(routeUrl.href, '_blank');
    },
    getToken,
    // v任务弹框
    showVLink(detail) {
      this.vLink = detail;
      setTimeout(() => {
        this.$refs.vLinkDialog.show();
      }, 30);
    },
    // 翻页
    handleCurrentChange(val) {
      this.$emit('change-page', {
        type: 'index',
        data: val,
      });
    },
    // 页大小变化
    handlePageSizeChange(val) {
      this.$emit('change-page', {
        type: 'size',
        data: val,
      });
    },
    // 导出
    handleExportClick() {
      const multipleSelectionIds = JSON.parse(JSON.stringify(this.multipleSelectionIds));
      this.$emit('export', multipleSelectionIds);
    },
    // 预览图片
    displayImg(title, imgsrc, imgsrc_list) {
      true, (this.imgsrc = imgsrc);
      this.imgtitle = title;
      this.imgsrc_list = imgsrc_list.split(',');
      this.$refs.imageDialog.show();
      // console.log(imgsrc.split(","))
      // this.imgsrc.split(",")
    },
    // 预览开票信息
    invoice_show(row) {
      // distinguishCancelAndClose: true, (this.imgsrc = imgsrc);
      // this.imgtitle = title;
      // this.imgsrc_list = imgsrc_list.split(",");
      this.$refs.InvoiceShowDialog.show(row);
      // console.log(imgsrc.split(","))
      // this.imgsrc.split(",")
    },
    // 多选
    handleSelectionChange(data) {
      this.multipleSelectionIds = data.map(cc => cc.cost_id);
    },
    // 上传凭证
    uploadHandel(row) {
      this.cost_id = row.cost_id;
      this.$refs.certificateUploadDialog.show(row);
    },
    // 编辑上传发票
    uploadHandelEdit(row) {
      this.cost_id = row.cost_id;
      this.$refs.costEditInvoiceDialog.show(row);
    },
    // 新增上传发票
    uploadHandelAdd(row) {
      this.cost_id = row.cost_id;
      this.$refs.costEditInvoiceDialog.show();
    },
    // 关闭上传弹窗
    dialogCancelHandle(flag) {
      if (!flag) {
        this.$emit('upload-handle');
      }
      this.cost_id = '';
    },
    dialogCancelHandle2(flag) {
      if (!flag) {
        this.$emit('upload-handle');
      }
      this.cost_id = '';
    },
    // 业务执行日期的表头小提示
    TotalSales() {
      return (
        <span>
          业务执行日期
          <el-tooltip placement="top" effect="light">
            <div slot="content">
              <p>kol开播的时间段。</p>
            </div>
            <i class="el-icon-question" style="cursor:pointer;margin-left:2px"></i>
          </el-tooltip>
        </span>
      );
    },
    // 审批编号
    approvalUidClick(row) {
      this.customerVisible = true;
      // 传递给子组件
      this.$nextTick(() => {
        this.$refs.applyDetailDialog.show(row);
        this.$refs.applyDetailDialog.cost_show = false;
      });
    },
    close() {
      this.customerVisible = false;
      this.loanFLag = false;
    },
    // 切换变化
    // switchChangeHandle(val, row) {
    //   updateIsPay({
    //     is_pay: val ? 1 : 0,
    //     cost_id: row.cost_id
    //   }).then(res => {
    //     if (res.data.success) {
    //       this.$message.success("更新成功");
    //       this.$emit("upload-handle");
    //     } else {
    //       this.$message.error("更新失败");
    //     }
    //   });
    // }
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
.achievementtable-container {
  .contract-detail {
    &:hover {
      cursor: pointer;
      text-decoration: underline;
      color: #396fff;
    }
  }
  .result-list {
    .opreate-btns {
      .all-amount {
        display: inline-block;
        color: #666;
        .all-amount-1 {
          margin-right: 40px;
        }
        .color-blue {
          font-weight: 600;
        }
      }
      .el-icon-question:before {
        content: '\E634';
        color: #cdcdcd;
      }
    }
    .contract-pagination {
      padding: 0;
      margin-top: 12px;
      /deep/ .el-input.el-input--mini.el-input--suffix {
        margin: 0;
      }
    }
    .txt-skamount {
      color: #ff631e;
    }
    .txt-gwtitle {
      font-size: 14px;
      color: var(--text-des-color);
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .txt-gwinfo {
      font-size: 14px;
      color: var(--text-color);
      // white-space:nowrap;
      // text-overflow: ellipsis;
      // overflow:hidden;
    }
    .text-kol {
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }
    .img-flex {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .link {
      color: #396fff;
      font-size: 12px;
      cursor: pointer;
      text-decoration: none;
    }
    /deep/ .el-switch__label {
      position: absolute;
      display: none;
      color: #fff;
      span {
        font-size: 12px;
      }
    }
    /*打开时文字位置设置*/
    // /deep/ .el-switch__label--right {
    //   z-index: 1;
    //   right: 21px;
    //   bottom: 1px;
    // }
    /*关闭时文字位置设置*/
    // /deep/ .el-switch__label--left {
    //   z-index: 1;
    //   left: 21px;
    //   bottom: 1px;
    // }
    /*显示文字*/
    /deep/ .el-switch__label.is-active {
      display: block;
    }
    /deep/.el-switch .el-switch__core,
    .el-switch .el-switch__label {
      width: 60px !important;
    }
  }
}
.icontupian:before {
  vertical-align: bottom;
}
.btn {
  border-radius: 10px;
}
/deep/ .no_data {
  img {
    width: 110px;
    margin-bottom: 10px;
  }
}
.el-popover {
  p {
    word-break: break-all;
  }
}
.approval-uid {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
    color: #396fff;
  }
}
</style>
