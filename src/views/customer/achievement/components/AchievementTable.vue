<template>
  <tg-block class="achievementtable-container list-left mgt-10" bodyStyle="padding: 18px">
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
            收款总金额
            <el-tooltip content="业绩登记总金额" placement="bottom" effect="light">
              <i class="el-icon-question" /> </el-tooltip
            >:
            <span class="color-blue">￥{{ dataSource.stat_info.all_gather_amount_str }}</span>
          </span>
          <span class="all-amount-1">
            成本安排总金额
            <el-tooltip
              content="需要安排成本的总金额（包含已安排成本的金额）"
              placement="bottom"
              effect="light"
            >
              <i class="el-icon-question" /> </el-tooltip
            >:
            <span class="color-blue">￥{{ dataSource.stat_info.all_pay_amount_str }}</span>
          </span>
          <span class="all-amount-1">
            已安排成本总金额
            <el-tooltip content="财务实际已经打款出去的金额。" placement="bottom" effect="light">
              <i class="el-icon-question" /> </el-tooltip
            >:
            <span class="color-blue">￥{{ dataSource.stat_info.all_paid_amount_str }}</span>
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
            >本页面即将下线，新的版块【财务管理-收款管理】已上线，请尽可能转至新版块工作，新版块如有不满足使用需求的地方请反馈给</span
          >
          <a href="dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=qdlylsy"
            >研发部-产品经理
          </a>
        </template>
      </el-alert>
      <div class="list">
        <el-table
          stripe
          v-if="Permission.canViewList"
          :data="dataSource !== null ? dataSource.data : []"
          style="width: 100%; margin-top: 15px; margin-bottom: 10px"
          :header-cell-style="{
            background: 'var(--table-thead-th-bg-color)',
            height: '42px',
            color: '#666666',
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
          <el-table-column label="登记时间" min-width="100px">
            <template #default="{ row }">
              <span>{{
                row.create_time_str
                  ? `${row.create_time_str && row.create_time_str.split(' ')[0]}`
                  : '--'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="收款编号/客户经理" width="100">
            <!-- prop="achievement_uid" -->
            <template v-slot="scope">
              <p style="color: var(--text-des-color); font-size: 14px">{{ scope.row.manager }}</p>
              <span style="color: #396fff; font-size: 14px">{{ scope.row.achievement_uid }}</span>
            </template>
          </el-table-column>
          <el-table-column label="关联客户合同" width="120">
            <!-- prop="achievement_uid" -->
            <template v-slot="scope">
              <p
                v-if="scope.row.contract_uid"
                @click="handleClick(scope.row.contract_id)"
                class="contract-detail"
                style="font-size: 14px"
              >
                {{ scope.row.contract_uid }}
              </p>
              <p v-else>--</p>
            </template>
          </el-table-column>

          <el-table-column label="客户信息" min-width="120">
            <template #default="{ row }">
              <el-popover
                placement="bottom-start"
                trigger="hover"
                visible-arrow="false"
                popper-class="personal-library-active-platform-popover personal-library-public-popover"
              >
                <div>
                  <p style="margin-bottom: 5px">
                    <span style="font-size: 14px; color: #333">店铺名称:</span>
                    <span style="ont-size: 14px; color: #333333">{{
                      row.customer_info.shop_name || '--'
                    }}</span>
                  </p>
                  <p style="margin-bottom: 5px">
                    <span>公司名称:</span>
                    <span style="ont-size: 14px; color: #333333">{{
                      row.customer_info.company_name || '--'
                    }}</span>
                  </p>
                  <p>
                    <span>客户类目:</span>
                    <span style="ont-size: 14px; color: #333333">{{
                      filterAreaStr(row.customer_info.category)
                    }}</span>
                  </p>
                  <p style="margin-bottom: 5px">
                    <span>客户类型:</span>
                    <span style="ont-size: 14px; color: #333333">{{
                      companyType[row.customer_info.company_type]
                        ? companyType[row.customer_info.company_type].value !== '不限'
                          ? companyType[row.customer_info.company_type].value
                          : '--'
                        : '--'
                    }}</span>
                  </p>
                  <p>
                    <span>客户分类:</span>
                    <span style="ont-size: 14px; color: #333333">{{
                      customerClassList[row.customer_info.customer_class]
                        ? customerClassList[row.customer_info.customer_class].value
                        : '--'
                    }}</span>
                  </p>
                </div>
                <template slot="reference">
                  <div>
                    <p class="overflow">
                      <span class="txt-gwtitle">店铺名称:</span>
                      <span class="txt-gwinfo">{{ row.customer_info.shop_name || '--' }}</span>
                    </p>
                    <p class="overflow">
                      <span class="txt-gwtitle">公司名称:</span>
                      <span class="txt-gwinfo">{{ row.customer_info.company_name || '--' }}</span>
                    </p>
                    <p>
                      <span class="txt-gwtitle">客户类目:</span>
                      <span class="txt-gwinfo">{{
                        filterAreaStr(row.customer_info.category)
                      }}</span>
                    </p>
                    <p>
                      <span class="txt-gwtitle">客户类型:</span>
                      <span class="txt-gwinfo">{{
                        companyType[row.customer_info.company_type]
                          ? companyType[row.customer_info.company_type].value !== '不限'
                            ? companyType[row.customer_info.company_type].value
                            : '--'
                          : '--'
                      }}</span>
                    </p>
                    <p>
                      <span class="txt-gwtitle">客户分类:</span>
                      <span class="txt-gwinfo">{{
                        customerClassList[row.customer_info.customer_class]
                          ? customerClassList[row.customer_info.customer_class].value
                          : '--'
                      }}</span>
                    </p>
                  </div>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="gather_way" min-width="190" label="收款信息">
            <template #default="{ row }">
              <p>
                <span class="txt-gwtitle">收款方式:</span>
                <span class="txt-gwinfo">{{ gatherWayListFormat(row.gather_way) }}</span>
              </p>
              <p v-if="row.gather_way === 3" class="overflow-ellipsis">
                <el-popover
                  placement="left"
                  trigger="hover"
                  :content="
                    '打款公司名称:' +
                    (row.gather_way_detail.pay_company_name
                      ? row.gather_way_detail.pay_company_name
                      : '--')
                  "
                >
                  <template slot="reference">
                    <span class="txt-gwtitle">打款公司名称:</span>
                  </template>
                </el-popover>
                <span class="txt-gwinfo">{{
                  row.gather_way_detail.pay_company_name
                    ? row.gather_way_detail.pay_company_name
                    : '--'
                }}</span>
              </p>
              <p v-if="row.gather_way === 1">
                <span class="txt-gwtitle">下单旺旺名:</span>
                <span class="txt-gwinfo">{{ row.gather_way_detail.order_wangwang_id }}</span>
              </p>
              <p v-if="row.gather_way === 1">
                <span class="txt-gwtitle">任务Id:</span>
                <span class="txt-gwinfo">{{ row.gather_way_detail.task_id }}</span>
              </p>
              <p v-if="row.gather_way === 1">
                <span class="txt-gwtitle">接单时间:</span>
                <span class="txt-gwinfo">{{ row.gather_way_detail.order_date || '--' }}</span>
              </p>
              <p>
                <span class="txt-gwtitle">收款时间:</span>
                <span class="txt-gwinfo">{{ row.gather_date ? `${row.gather_date}` : '--' }}</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="gather_amount"
            :render-header="customColumnHeaderGather"
            min-width="100px"
          >
            <template #default="{ row }">
              <span class="txt-skamount">{{
                row.gather_amount_str ? `¥${row.gather_amount_str}` : '--'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="退款金额" min-width="100px">
            <template #default="{ row }">
              <span class="txt-skamount">{{
                row.refund_amount_str ? `¥${row.refund_amount_str}` : '--'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="gather_amount" min-width="140" :render-header="customColumnHeader">
            <template #default="{ row }">
              <span class="txt-skamount">{{
                row.total_pay_amount ? `¥${row.total_pay_amount}` : '--'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="gather_amount" width="140" :render-header="customColumnHeader2">
            <template #default="{ row }">
              <span class="txt-skamount">{{
                row.total_paid_amount ? `¥${row.total_paid_amount}` : '--'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="gather_amount" label="收款凭证" min-width="100px">
            <template #default="{ row }">
              <p class="img-flex">
                <span>凭证：</span>
                <i
                  v-if="row.gather_certificate_pic !== ''"
                  class="iconfont icontupian"
                  style="font-size: 30px !important; color: #396fff; cursor: pointer"
                  @click="
                    () => {
                      displayImg('收款凭证', row.gather_certificate_pic);
                    }
                  "
                ></i>
                <span v-else>--</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="gather_amount" label="是否开票" min-width="100px">
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
                  @click="invoice_show(row)"
                ></i>
                <span v-else class="txt-center">&nbsp;--</span>
              </p>
            </template>
          </el-table-column>
          <!-- <el-table-column fixed="right" label="财务操作" width="90" align="center">
            <template #default="{ row }">
              <div v-if="row.is_invoice === 1">
                <div v-if="Permission.canUploadInvoice">
                  <tg-button
                    v-if="row.invoice_info.length !== 0"
                    type="link"
                    @click="uploadHandelEdit(row)"
                    >编辑发票</tg-button
                  >
                  <tg-button v-else type="link" @click="uploadHandelAdd(row)">上传发票</tg-button>
                </div>
                <div v-else>--</div>
              </div>
              <div v-else>--</div>
              <div v-if="Permission.canEditGatherTime">
                <tg-button v-if="row.gather_date" type="link" @click="gatherDateEdit(row, edit)"
                  >编辑时间</tg-button
                >
                <tg-button v-else type="link" @click="gatherDateAdd(row)">收款时间</tg-button>
              </div>
              <div v-else>--</div>
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
        />
      </div>
    </div>
    <!-- 预览凭证 -->
    <image-dialog ref="imageDialog" :imgsrc="imgsrc" :title="imgtitle" />
    <!-- 上传开票信息 -->
    <AttachmentListEditInvoiceDialog
      ref="attachmentListEditInvoiceDialog"
      :id="achievement_id"
      :name="'发票'"
      :type="'certificate/cost_invoice_certificate '"
      @upload-close2="dialogCancelHandle"
    />
    <AddGatherDateDialog
      ref="addGatherDateDialog"
      :id="achievement_id"
      :name="'发票'"
      :type="'certificate/cost_invoice_certificate '"
      @upload-close2="dialogCancelHandle"
    />
    <!-- 上传开票信息 -->
    <InvoiceShowDialog
      ref="InvoiceShowDialog"
      :id="achievement_id"
      :name="'发票'"
      :type="'certificate/cost_invoice_certificate '"
      @upload-close2="dialogCancelHandle"
    />
  </tg-block>
</template>

<script>
import { RIGHT_CODE } from '@/const/roleCode';
import { mapGetters } from 'vuex';
import { gatherWayListFormat } from '@/const/cooperative';
import { customerClassList, categoryList, companyType } from '@/utils/format';
import AttachmentListEditInvoiceDialog from '../../components/AttachmentListEditInvoice.vue';
import AddGatherDateDialog from '../../components/addGatherDate.vue';
import InvoiceShowDialog from '../../components/invoiceShow.vue';
import { areaStr } from '@/utils/filter';
import { RouterLegal } from '@/const/router';

import { RIGHT_CODE as NEW_RIGHT_CODE } from '@/const/rightCode';
import { computed } from '@vue/composition-api';
import { HasPermission } from '@/use/permission';

export default {
  name: 'AchievementTable',
  props: ['page', 'dataSource'],
  components: {
    AttachmentListEditInvoiceDialog,
    AddGatherDateDialog,
    InvoiceShowDialog,
  },
  setup(props, ctx) {
    /** 权限检查 */
    const Permission = computed(() => {
      const canViewList = HasPermission(NEW_RIGHT_CODE.achievement_list);
      const canExport = HasPermission(NEW_RIGHT_CODE.achievement_export);
      const canCreate = HasPermission(NEW_RIGHT_CODE.achievement_create);
      const canUploadInvoice = HasPermission(NEW_RIGHT_CODE.achievement_upload_edit_invoice);
      const canEditGatherTime = HasPermission(NEW_RIGHT_CODE.achievement_register_edit_time);

      return {
        canViewList,
        canExport,
        canCreate,
        canUploadInvoice,
        canEditGatherTime,
      };
    });
    return { Permission };
  },
  data() {
    return {
      edit: true,
      RIGHT_CODE,
      customerClassList,
      categoryList,
      companyType,
      imgsrc: '',
      imgtitle: '',
      multipleSelectionIds: [],
      achievement_id: '',
      achievement_uid: '',
    };
  },
  computed: {
    ...mapGetters({
      UserRoles: 'user/getUserRole',
    }),
  },
  methods: {
    filterAreaStr: areaStr,
    customColumnHeaderGather(h, { column: _column, $index: _index }) {
      return (
        <div style="margin:0;padding:0;line-height:32px">
          <p style="margin:0;line-height:18px;font-size:16px">
            收款金额
            <el-tooltip
              content="如发生退款，该字段为减去退款金额后的实际收款金额"
              placement="top"
              effect="light"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </p>
        </div>
      );
    },
    // 点击进入供应商合同详情-打开新窗口
    handleClick(contract_id) {
      const routeUrl = this.$router.resolve({
        name: RouterLegal.contracts.customer.detail,
        params: {
          id: contract_id,
        },
      });
      window.open(routeUrl.href, '_blank');
    },
    gatherWayListFormat,
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
      this.$emit('exort', multipleSelectionIds);
    },
    // 预览图片
    displayImg(title, imgsrc) {
      this.imgsrc = imgsrc;
      this.imgtitle = title;
      this.$refs.imageDialog.show();
    },
    // 预览开票信息
    invoice_show(row) {
      this.$refs.InvoiceShowDialog.show(row);
    },
    // 多选
    handleSelectionChange(data) {
      this.multipleSelectionIds = data.map(cc => cc.achievement_id);
    },
    // 新增上传发票
    uploadHandelAdd(row) {
      this.achievement_id = row.achievement_id;
      this.$refs.attachmentListEditInvoiceDialog.show();
    },
    // 编辑上传发票
    uploadHandelEdit(row) {
      this.achievement_id = row.achievement_id;
      this.$refs.attachmentListEditInvoiceDialog.show(row);
    },
    // 新增收款时间
    gatherDateAdd(row) {
      this.achievement_id = row.achievement_id;
      this.$refs.addGatherDateDialog.show();
    },
    // 编辑上传发票
    gatherDateEdit(row, edit) {
      this.achievement_id = row.achievement_id;
      this.$refs.addGatherDateDialog.show(row, edit);
    },
    // 关闭上传弹窗
    dialogCancelHandle(flag) {
      if (!flag) {
        this.$emit('upload-handle');
      }
      this.achievement_id = '';
    },
    customColumnHeader(h, { column: _column, $index: _index }) {
      return (
        <div style="margin:0;padding:0;line-height:32px">
          <p style="margin:0;line-height:18px;font-size:16px">成本安排</p>
          <p style="margin:0;line-height:18px;font-size:16px">
            金额
            <el-tooltip
              content="该笔业绩登记id下包含的所有需要安排成本金额的总和。"
              placement="top"
              effect="light"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </p>
        </div>
      );
    },
    customColumnHeader2(h, { column: _column, $index: _index }) {
      return (
        <div style="margin:0;padding:0;line-height:32px">
          <p style="margin:0;line-height:18px;font-size:16px">已安排成本</p>
          <p style="margin:0;line-height:18px;font-size:16px">
            金额
            <el-tooltip
              content="该笔业绩登记id下包含的财务实际已经打款出去的金额。"
              placement="top"
              effect="light"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </p>
        </div>
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
.achievementtable-container {
  .contract-detail {
    color: #666;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
      color: #396fff;
    }
  }
  .result-list {
    background: #fff;
    .opreate-btns {
      margin-bottom: 12px;
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
    }
    .contract-pagination {
      padding: 0;
      margin-top: 12px;
      /deep/ .el-input.el-input--mini.el-input--suffix {
        margin: 0;
      }
    }
    .txt-skamount {
      color: #ff731e;
    }
    .txt-gwtitle {
      font-size: 14px;
      color: var(--text-des-color);
    }
    .txt-gwinfo {
      font-size: 14px;
      color: var(--text-color);
    }
    .img-flex {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
}
.overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rect-100-36 {
  width: 100px;
  height: 36px;
}
/deep/ .el-icon-question:before {
  color: #cdcdcd;
  margin-left: 2px;
}
/deep/ .no_data {
  img {
    width: 110px;
    margin-bottom: 10px;
  }
}
</style>
