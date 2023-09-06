<template>
  <div class="costlist-container" v-if="CostList !== null">
    <el-button
      size="small"
      class="btn-blue"
      type="primary"
      @click="addCostHandle"
      v-show="
        Permission.canCreate &&
        (IsCurrentUser(CooperationDetail.add_by_id) ||
          IsCurrentUser(CooperationDetail.manager_id) ||
          judgeAEPower())
      "
      >安排成本</el-button
    >
    <el-table
      stripe
      v-if="Permission.canViewList"
      :data="CostList !== null ? CostList.data : []"
      style="width: 100%; margin-top: 15px; margin-bottom: 10px"
      :header-cell-style="{
        background: 'var(--table-thead-th-bg-color)',
        height: '42px',
        color: 'var(--text-second-color)',
        fontWeight: '600',
      }"
    >
      <template #empty>
        <table-no-data
          :isvertical="true"
          title="还没有安排成本记录哦~"
          :img="require('@/assets/img/cooperative/xt_nodata_note.png')"
          class="no_data"
        ></table-no-data>
      </template>
      <el-table-column
        :formatter="
          (row, column, cellValue, index) =>
            (pagination.currentPage - 1) * pagination.pageSize + (index + 1)
        "
        label="序号"
        width="60"
        align="center"
      />
      <el-table-column prop="achievement_uid" label="关联业绩" width="90">
        <template #default="{ row }">
          <span v-if="row.cost_type === 2">借款</span>
          <span v-else>{{ row.achievement_uid }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="contract_uid" label="关联供应商合同" width="90">
        <template #default="{row}">
          <span v-if="row.has_contract===2">无合同</span>
          <span v-else>{{row.contract_uid?row.contract_uid:'--'}}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="KOL / 机构名称 / 关联合同" width="140">
        <template #default="{ row }">
          <p>
            <span class="txt-gwinfo txt-gwinfo-color">{{ row.kol_name }}</span>
          </p>
          <p>
            <span class="txt-gwtitle">{{
              row.is_personal === 1 ? '个人' : row.company_name || '--'
            }}</span>
          </p>
          <p>
            <span v-if="row.has_contract === 2">无合同</span>
            <span class="contract-detail" @click="handleClick(row.contract_id)" v-else>{{
              row.contract_uid ? row.contract_uid : '--'
            }}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="业务执行日期" width="140" :render-header="TotalSales">
        <template #default="{ row }">
          <div v-if="row.live_start_date">
            <p class="txt-gwinfo">{{ row.live_start_date }}~</p>
            <p class="txt-gwinfo">{{ row.live_end_date }}</p>
          </div>
          <p v-else>
            <span class="txt-gwtitle">--</span>
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
            <span class="txt-gwtitle overflow-ellipsis">账户:</span>
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
            <span v-if="row.pay_way === 2" class="lookMore" @click="showVLink(row.pay_way_detail)"
              >查看 ></span
            >
            <el-popover
              placement="top"
              trigger="hover"
              v-if="
                row.pay_way === 1 && (row.bank_info.bank_card_num === '' || row.bank_info === '')
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
              v-if="row.pay_way === 1 && row.bank_info !== '' && row.bank_info.bank_card_num !== ''"
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
                <span style="color: var(--text-des-color); white-space: nowrap">用款审批编号:</span>
                <span
                  @click="approvalUidClick(row)"
                  style="color: #396fff; cursor: pointer; font-size: 14px"
                  >查看</span
                >
              </p>
            </template>
          </p>

          <p style="display: flex" v-if="row.cost_type === 2 && row.borrowing_uid">
            <span style="color: var(--text-des-color); white-space: nowrap">垫款审批编号:</span>
            <span
              style="color: #396fff; cursor: pointer; font-size: 14px"
              @click="loanApprovalNumber(row)"
              >查看</span
            >
          </p>
          <!--<p v-if="row.pay_way===2">-->
          <!--<span class="txt-gwtitle">V任务链接1: </span>-->
          <!--<a class="link" :href="row.pay_way_detail.v_task_url" target="_blank">点击跳转</a>-->
          <!--</p>-->
          <!--<p v-if="row.pay_way===2">-->
          <!--<span class="txt-gwtitle">产品链接: </span>-->
          <!--<a class="link" :href="row.pay_way_detail.item_url" target="_blank">点击跳转</a>-->
          <!--</p>-->
        </template>
      </el-table-column>
      <el-table-column label="打款金额" width="100">
        <template #default="{ row }">
          <span class="txt-skamount">{{
            row.pay_amount_str ? `￥${row.pay_amount_str}` : '--'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="税点金额" width="100">
        <template #default="{ row }">
          <span class="tax" v-if="row.is_invoice === 1">{{
            row.tax_point_str ? `￥${row.tax_point_str}` : '--'
          }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有发票" width="100">
        <template #default="{ row }">
          <p>
            <span class="txt-gwtitle">开票：</span>
            <span>{{ row.is_invoice === 0 ? '否' : row.is_invoice === 1 ? '是' : '--' }}</span>
          </p>
          <p class="img-flex">
            <span class="txt-gwtitle">凭证：</span>
            <i
              v-if="row.invoice_info.length !== 0"
              class="iconfont icontupian"
              style="font-size: 30px !important; color: #396fff; cursor: pointer"
              @click="
                () => {
                  invoice_show(row);
                }
              "
            ></i>
            <span v-else>--</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="是否打款" width="110">
        <template #default="{ row }">
          <p>
            <span class="txt-gwtitle">打款：</span>
            <span>{{ row.is_pay === 0 ? '否' : row.is_pay === 1 ? '是' : '--' }}</span>
          </p>
          <p class="img-flex">
            <span class="txt-gwtitle">凭证：</span>
            <i
              v-if="row.pay_certificate_pic !== ''"
              class="iconfont icontupian"
              style="font-size: 30px !important; color: #396fff; cursor: pointer"
              @click="
                () => {
                  displayImg('打款凭证详情', row.pay_certificate_pic, row.pay_certificate_pic);
                }
              "
            ></i>
            <span v-else>--</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="60">
        <template #default="{ row }">
          <el-popover
            placement="top-start"
            width="200"
            trigger="click"
            v-if="row.note !== ''"
            :content="row.note"
          >
            <template slot="reference">
              <span style="color: #396fff; cursor: pointer; font-size: 13px">查看</span>
            </template>
            <p>{{ row.note }}</p>
          </el-popover>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="60" fixed="right" align="center">
        <template #default="{ row }">
          <div v-if="row.is_pay !== 1">
            <div
              v-if="
                IsCurrentUser(row.add_by_id) ||
                IsCurrentUser(CooperationDetail.manager_id) ||
                judgeAEPower()
              "
            >
              <el-tooltip placement="left" effect="light" content="编辑" class="editor">
                <span v-show="Permission.canEdit">
                  <tg-icon name="ico-edit" @click="editCost(row)" />
                </span>
              </el-tooltip>
              <el-tooltip placement="top" effect="light" content="删除" class="delete">
                <span v-show="Permission.canDelete" style="margin-left: 10px">
                  <tg-icon name="ico-delete" @click="delCost(row)" />
                </span>
              </el-tooltip>
            </div>
            <span v-else>--</span>
          </div>
          <span v-else>--</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="Permission.canViewList"
      class="contract-pagination"
      style="margin-bottom: 10px"
      :current-page.sync="pagination.currentPage"
      :page-sizes.sync="pagination.pageSizes"
      :page-size="pagination.pageSize"
      layout="total, prev, pager, next, sizes, jumper"
      :total="CostList !== null ? CostList.total : 0"
      @current-change="handleCurrentChange"
      @size-change="handlePageSizeChange"
    ></el-pagination>
    <!-- 成本安排 -->
    <AddCost ref="addCostDialog" />
    <!-- v任务链接 -->
    <VLinkDialog ref="vLinkDialog" :v-link="vLink" />
    <!-- 预览图片 -->
    <image-dialog ref="imageDialog" :imgsrc="imgsrc" :title="imgtitle" :imgsrc_list="imgsrc_list" />
    <!-- 上传开票信息 -->
    <InvoiceShowDialog
      ref="InvoiceShowDialog"
      :id="cost_id"
      :type="'certificate/cost_invoice_certificate '"
    />
    <!-- 审批编号弹窗 -->
    <apply-detail ref="applyDetailDialog" v-if="customerVisible" @close="close" />
    <application-detail ref="applicationDetail" v-if="loanFLag" @close="close"></application-detail>
  </div>
</template>

<script>
import ApplyDetail from '@/views/workbench/components/ApplyDetail';
import applicationDetail from '@/views/workbench/application/applicationDetail';
import { mapGetters, mapActions } from 'vuex';
import AddCost from './AddCost';
import VLinkDialog from './VLinkDialog';
import { showProDateFormat } from '@/utils/format';
import { gatherWayListFormat } from '@/const/cooperative';
import { deleteCost } from '@/api/cooperative';
import { getToken } from '@/utils/token';
import CurrentUserPower from '../../mixin/CurrentUserPower';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';
import InvoiceShowDialog from '@/views/customer/components/invoiceShow';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { RouterNameProjectManage } from '@/const/router';

import { RIGHT_CODE as NEW_RIGHT_CODE } from '@/const/rightCode';
import { computed } from '@vue/composition-api';
import { HasPermission, IsCurrentUser } from '@/use/permission';

export default {
  name: 'CostList',
  components: {
    AddCost,
    VLinkDialog,
    ApplyDetail,
    InvoiceShowDialog,
    applicationDetail,
  },
  mixins: [CurrentUserPower, CooperativeStore],
  setup(props, ctx) {
    /** 权限检查 */
    const Permission = computed(() => {
      const canCreate = HasPermission(NEW_RIGHT_CODE.cost_create);
      const canEdit = HasPermission(NEW_RIGHT_CODE.cost_edit);
      const canDelete = HasPermission(NEW_RIGHT_CODE.cost_delete);
      const canViewList = HasPermission(NEW_RIGHT_CODE.cost_list);

      return { canViewList, canCreate, canEdit, canDelete };
    });
    return { Permission, IsCurrentUser };
  },
  data() {
    return {
      cost_id: '',
      imgsrc_list: '',
      loanFLag: false,
      customerVisible: false, //审批编号弹窗
      vLinkShow: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
      },
      imgsrc: '', // 预览图片src
      imgtitle: '', // 预览图片标题
      vLink: [],
    };
  },
  computed: {
    ...mapGetters({
      CostList: 'cooperative/CostList',
    }),
  },
  methods: {
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
    showProDateFormat,
    gatherWayListFormat,
    ...mapActions({
      GetAchievementList: 'cooperative/GetAchievementList',
      GetCoostList: 'cooperative/GetCoostList',
    }),

    // v任务弹框
    showVLink(detail) {
      this.vLink = detail;
      setTimeout(() => {
        this.$refs.vLinkDialog.show();
      }, 30);
    },
    // 安排成本
    addCostHandle() {
      this.$refs.addCostDialog.show();
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
    loanApprovalNumber(row) {
      this.loanFLag = true;
      // 传递给子组件
      this.$nextTick(() => {
        this.$refs.applicationDetail.show(row);
        this.$refs.applicationDetail.cost_show = false;
      });
    },
    // 关闭审批安排弹窗
    close() {
      this.customerVisible = false;
      this.loanFLag = false;
    },
    // 获取分页数据
    getCostListByPage() {
      this.GetCoostList({
        cooperation_id: this.CooperationDetail.cooperation_id,
        num: this.pagination.pageSize,
        page_num: this.pagination.currentPage,
      });
    },
    // 翻页
    handleCurrentChange() {
      this.getCostListByPage();
    },
    // 每页条数改变
    handlePageSizeChange(pageSize) {
      this.pagination.currentPage = 1;
      this.pagination.pageSize = pageSize;
      this.getCostListByPage();
    },
    // 编辑成本
    editCost(row) {
      const page = JSON.parse(JSON.stringify(this.pagination));
      this.$refs.addCostDialog.show(row, page);
    },
    // 删除成本
    async delCost(row) {
      const result = await AsyncConfirm({ root: this }, '此操作将永久删除数据，是否继续？');
      if (result) {
        deleteCost({ cost_id: row.cost_id }).then(res => {
          if (res.data.success) {
            this.$message.success(res.data.message);
            this.getCostListByPage();
            // 更新成本
            this.GetCooperationDetail({
              customer_id: this.CustomerDetail.id,
              cooperation_id: this.CooperationDetail.cooperation_id,
            });
            // 更新业绩登记表
            this.GetAchievementList({
              cooperation_id: this.CooperationDetail.cooperation_id,
              num: 10,
              page_num: 1,
            });
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    },
    // 预览多张图片
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
      this.$refs.InvoiceShowDialog.show(row);
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
  },
};
</script>

<style lang="less" scoped>
.contract-detail {
  &:hover {
    cursor: pointer;
    text-decoration: underline;
    color: #396fff;
  }
}
.el-popper {
  p {
    word-wrap: break-word;
  }
}
.lookMore {
  color: #396fff;
  text-decoration: underline;
  cursor: pointer;
}
.costlist-container {
  /deep/ .el-table {
    border-right-width: 0;
  }
  .txt-skamount {
    color: #ff731e;
  }
  .tax {
    color: #ff731e;
  }
  .txt-gwtitle {
    font-size: 14px;
    color: var(--text-third-color);
  }
  .txt-gwinfo {
    font-size: 14px;
    color: var(--text-color);
  }
  .txt-gwinfo-color {
    color: #396fff;
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
.editor,
.delete {
  position: relative;
  .icon-shanchu {
    position: absolute;
    top: 3px;
  }
  .icon-bianji {
    position: absolute;
    bottom: 3px;
    margin-top: 3px;
  }
}
.btn-blue {
  width: 90px;
  // height: 32px;
}
/deep/ .no_data {
  img {
    width: 110px;
    margin-bottom: 10px;
  }
}
</style>
