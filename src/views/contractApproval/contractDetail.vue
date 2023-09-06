<style lang="scss" scoped>
@import '@/styles/vars.scss';
$color-primary: var(--theme-color);
#contract-detail {
  min-width: 1000px;
  .contract-detail-title {
    height: 54px;
    line-height: 54px;
    background: #f2f6f9;
    overflow: hidden;
    margin-bottom: 6px;
    .title-left {
      font-size: 18px;
      color: var(--text-color);
      font-weight: 600;
      i {
        color: #bfc1c8;
        margin-right: 8px;
        cursor: pointer;
        width: 50px;
        height: 40px;
        background: white;
        border-radius: 10px;
        font-size: 24px;
        font-weight: 600;
        line-height: 40px;
        text-align: center;
      }
    }
    .oprate-btn {
      float: right;
      position: absolute;
      top: 60px;
      right: 10px;
      cursor: pointer;
      z-index: 2020;
      .icon-bianji:before {
        color: #396fff;
      }
      .icon-shanchu:before {
        color: #f05765;
      }
      .icon-btn {
        display: inline-block;
        width: 30px;
        text-align: center;
        .gm-icon {
          display: inline-block;
          margin-top: 9px;
        }
        // .check {
        //   display: inline-block;
        //   width: 34px;
        //   height: 34px;
        //   margin-top: 9px;
        //   cursor: pointer;
        //   background: url(../../assets/img/contract_opreate_icon_edit_1.png) no-repeat center center;
        //   &:hover {
        //     background: url(../../assets/img/contract_opreate_icon_edit_2.png) no-repeat center center;
        //   }
        // }
      }
    }
  }
  .contract-detail-content {
    min-height: 400px;
    .content-block {
      border-radius: 10px;
      background: #fff;
      padding-bottom: 20px;
      margin-bottom: 12px;
      /deep/ .el-table {
        border-radius: 10px;
      }
      /deep/ .el-table th.is-leaf {
        border-bottom: 1px solid var(--table-border-color);
      }
      /deep/ .el-table td {
        border-bottom: 1px solid var(--table-border-color);
      }
      /deep/ .el-table th.is-right {
        text-align: left;
      }
      /deep/ .el-table td.is-right {
        text-align: left;
      }
      .block-title {
        height: 37px;
        line-height: 37px;
        padding-top: 5px;
        position: relative;
        padding-left: 12px;
        color: var(--text-color);
        font-weight: 600;
      }
      .block-content {
        &.basic-info {
          padding: 10px 0 0 50px;
          .info-line {
            min-height: 35px;
            line-height: 35px;
            .label {
              color: var(--text-third-color);
              &.sale-chance-label {
                vertical-align: middle;
              }
            }
            .value {
              color: #666;
              &.contract-number {
                color: #4c76ff;
                font-weight: 600;
              }
              &.sale-chance-value {
                width: calc(100% - 80px);
                display: inline-block;
                vertical-align: text-top;
                line-height: 20px;
                // .show-content {
                //   display: inline-block;
                //   overflow: hidden;
                //   text-overflow: ellipsis;
                //   white-space: nowrap;
                //   width: calc(100% - 80px);
                //   vertical-align: middle;
                // }
                // .show-more {
                //   vertical-align: middle;
                //   color: #4C76FF;
                //   cursor: pointer;
                //   i {
                //     margin-left: 5px;
                //   }
                // }
              }
              .contract-status-1 {
                color: #ff8549;
              }
              .contract-status-2 {
                color: $color-primary;
              }
              .contract-status-3 {
                color: #f34b60;
              }
              .contract-status-4 {
                color: #f34b60;
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
          padding: 20px 30px 0;
          .attachment {
            background: #f6f6f6;
            line-height: 37px;
            margin-top: 10px;
            padding: 0 20px;
            border-radius: 10px;
            .attachment-label {
              color: #666;
            }
            .attachment-icon {
              vertical-align: middle;
              width: 30px;
            }
            .attachment-name {
              color: #396fff;
            }
            .attachment-link {
              margin-left: 14px;
              font-weight: 600;
              color: #396fff;
            }
            .no-attachment {
              color: var(--text-third-color);
            }
          }
        }
        &.plan-list,
        &.attachment-list {
          padding: 20px 30px;
        }
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
        color: var(--text-des-color);
        margin-top: 30px;
      }
    }
  }
}
/deep/ .color-red > .cell {
  display: flex;
  &::before {
    content: '￥';
  }
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
.delete-attachment-confirm {
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
.list-url {
  display: inline-block;
  margin: 0 5px;
}
</style>

<template>
  <div id="contract-detail">
    <div class="contract-detail-title">
      <span class="title-left">
        <i class="el-icon-arrow-left" @click="$router.back()"></i>合同详情
      </span>
      <!-- <div class="oprate-btn">
        <template v-if="oprateBtnVisiable()">
          <span class="icon-btn" @click="handleEditContractClick"><i class="gm-icon gm-icon-edit"></i></span>
          <span class="icon-btn" @click="handleDeleteContractClick"><i class="gm-icon gm-icon-delete"></i></span>
      </template>-->
      <!-- 合同未完成审核和具有审核权限的角色显示 -->
      <!-- <span v-if="hasApprovalRight && (detail && detail.contract_info.contract_status !== 2)" class="icon-btn" @click="handleReviewBtnClick"><i class="check"></i></span> -->
      <!-- </div> -->
    </div>
    <div v-loading="loading" class="contract-detail-content">
      <div v-if="detail" class="content-block">
        <div class="block-title">合同基础信息</div>
        <div class="block-content basic-info">
          <el-row>
            <el-col :span="12">
              <div class="info-line">
                <span class="label">合同编号/类型：</span>
                <span class="value contract-number">
                  {{ detail.contract_info.contract_uid }}
                  <span style="color: #666; font-weight: normal">{{
                    detail.contract_info.contract_type_str
                  }}</span>
                </span>
              </div>
              <div class="info-line">
                <span class="label"
                  >{{ $route.query.partner_type === 1 ? '客户' : '供应商' }}名称：</span
                >
                <span class="value">{{
                  ($route.query.partner_type === 1
                    ? detail.partner_info.partner_name || detail.contract_info.customer_name
                    : detail.partner_info.partner_name) || '--'
                }}</span>
              </div>
              <div v-if="$route.query.partner_type === 1" class="info-line">
                <span class="label">关联店铺：</span>
                <span class="value">{{ detail.partner_info.shop_name || '--' }}</span>
              </div>
              <div class="info-line">
                <span class="label sale-chance-label"
                  >{{ $route.query.partner_type === 1 ? '销售' : '采买' }}渠道：</span
                >
                <span class="value sale-chance-value">
                  {{ processSaleChanceToStr(detail.contract_info.sale_chance) }}
                  <!-- <span class="show-content">{{processSaleChanceToStr(detail.contract_info.sale_chance)}}</span>
                  <span class="show-more">查看全部<i class="el-icon-arrow-down"></i></span>-->
                </span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-line">
                <span class="label">所属部门：</span>
                <span class="value">{{ detail.contract_info.department_str }}</span>
              </div>
              <div class="info-line">
                <span class="label">客户经理：</span>
                <span class="value">{{ detail.contract_info.manager_name }}</span>
              </div>
              <div class="info-line">
                <span class="label">创建人：</span>
                <span class="value">{{ detail.contract_info.add_by_name || '--' }}</span>
              </div>
              <div class="info-line">
                <span class="label">创建时间：</span>
                <span class="value">{{ detail.contract_info.create_time_str.split(' ')[0] }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-line">
                <span class="label">合同状态：</span>
                <span class="value">
                  <span :class="`contract-status-${detail.contract_info.contract_status}`">{{
                    detail.contract_info.contract_status_str
                  }}</span>
                  <span
                    v-if="
                      hasApprovalRight &&
                      detail &&
                      detail.contract_info.contract_status !== 2 &&
                      detail.contract_info.contract_status !== 5
                    "
                    class="approve-btn"
                    @click="handleReviewBtnClick"
                  >
                    <i></i>审批
                  </span>
                </span>
              </div>
              <div v-if="detail.contract_info.contract_status !== 5" class="info-line">
                <span class="label">审批状态：</span>
                <span class="value">
                  <el-popover
                    v-if="detail.contract_work_infos.length > 0"
                    placement="bottom"
                    width="246"
                    trigger="click"
                    popper-class="approve-progress-popper"
                  >
                    <template slot="reference">
                      <span class="see-reason-btn">点击看进度</span>
                    </template>
                    <approve-progress
                      :work-infos="detail.contract_work_infos"
                      :contract-info="detail"
                    ></approve-progress>
                  </el-popover>
                </span>
              </div>
              <div v-if="detail.contract_info.contract_status !== 5" class="info-line">
                <span class="label">附件状态：</span>
                <span class="value">
                  <el-popover
                    v-if="detail.contract_annex_work_infos.length > 0"
                    placement="bottom"
                    width="246"
                    trigger="click"
                    popper-class="approve-progress-popper"
                  >
                    <template slot="reference">
                      <span class="see-reason-btn">点击看进度</span>
                    </template>
                    <approve-progress
                      type="fj"
                      :work-infos="detail.contract_annex_work_infos"
                      :contract-info="detail"
                    ></approve-progress>
                  </el-popover>
                  <span v-else>--</span>
                </span>
              </div>
              <div class="info-line">
                <span class="label">合同收回状态：</span>
                <span class="value">
                  <template
                    v-if="
                      detail.contract_info.contract_status === 2 && getCurrentUserHasRecycleRight()
                    "
                  >
                    <!-- 风控显示操作按钮，其他人显示状态文字 -->
                    <span>{{ isRecycled ? '已收回' : '未收回' }}</span>
                    <el-switch
                      v-model="isRecycled"
                      @change="handleContractRecycleChange"
                    ></el-switch>
                  </template>
                  <template v-else>
                    <span>{{ detail.contract_info.is_recycled === 1 ? '已收回' : '未收回' }}</span>
                  </template>
                </span>
              </div>
              <!-- <div class="info-line">
                <span class="label">审批人：</span>
                <span class="value">{{detail.contract_info.approver_name}}</span>
              </div>
              <div class="info-line">
                <span class="label">审批时间：</span>
                <span class="value">{{detail.contract_info.approve_time_str || '--'}}</span>
              </div>-->
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-if="detail" class="content-block">
        <div class="block-title">合作协议明细</div>
        <div class="block-content contract-detail">
          <el-table
            stripe
            :data="detailList"
            border
            :header-cell-style="{
              backgroundColor: 'var(--table-thead-th-bg-color)',
              color: 'var(--text-second-color)',
            }"
            :cell-class-name="cellStyle"
          >
            <el-table-column
              label="序号 "
              :formatter="(row, column, cellValue, index) => index + 1"
              width="63"
              align="center"
            />
            <el-table-column
              prop="sale_chance"
              :label="`产品(${$route.query.partner_type === 1 ? '销售' : '采买'}渠道)`"
              :formatter="row => row.sale_chance"
              min-width="100"
            />
            <el-table-column prop="num" label="数量" width="90" align="right"></el-table-column>
            <el-table-column prop="unit_str" label="单位" width="100" align="right" />
            <el-table-column prop="price" label="标准单价" min-width="100" align="right" />
            <el-table-column prop="discount" label="折扣" width="100" align="right" />
            <el-table-column
              prop="contract_amount"
              label="合同金额"
              min-width="100"
              align="right"
            />
          </el-table>
          <div v-if="detail" class="attachment">
            <span class="attachment-label">合同附件：</span>
            <template v-if="detail.contract_detail.attachment_url">
              <div class="list-url" v-for="(file, index) in caseFileList()" :key="index">
                <img
                  v-if="file.fileName"
                  class="attachment-icon"
                  src="@/assets/img/contract_opreate_icon_annex_1.png"
                />
                <a
                  style="cursor: pointer"
                  @click.stop="preview(detail.contract_detail.attachment_url_list[index].url)"
                  target="_blank"
                >
                  <span class="attachment-name">{{ file.fileName }}</span>
                </a>
                <a
                  v-if="file.fileName"
                  class="attachment-link"
                  :href="file.link + '?Authorization=' + getToken()"
                  target="_blank"
                  >下载</a
                >
              </div>
            </template>
            <template v-else>
              <span class="no-attachment">未上传附件</span>
            </template>
            <div>
              <span class="attachment-label">合同扫描件：</span>
              <template v-if="detail.contract_detail.contract_scan_urls.length > 0">
                <div
                  class="list-url"
                  v-for="(file, index) in detail.contract_detail.contract_scan_urls"
                  :key="index"
                >
                  <img
                    class="attachment-icon"
                    src="@/assets/img/contract_opreate_icon_annex_1.png"
                  />
                  <a
                    style="cursor: pointer"
                    @click.stop="preview(detail.contract_detail.contract_scan_urls[index].url)"
                    target="_blank"
                  >
                    <span class="attachment-name">{{
                      detail.contract_detail.contract_scan_urls[index].file_name
                    }}</span>
                  </a>
                  <a
                    class="attachment-link"
                    :href="file.url + '?Authorization=' + getToken()"
                    target="_blank"
                    >下载</a
                  >
                </div>
              </template>
              <template v-else>
                <span class="no-attachment">未上传扫描件</span>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div v-if="detail" class="content-block">
        <div class="block-title">{{ $route.query.partner_type === 1 ? '收款' : '付款' }}计划</div>
        <div class="block-content plan-list">
          <el-table
            stripe
            :data="detail.proceeds_plan"
            border
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
            <el-table-column
              prop="proceeds_amount"
              :label="`${$route.query.partner_type === 1 ? '收款' : '付款'}金额`"
              align="right"
            />
            <el-table-column
              prop="proceeds_plan_date_str"
              :label="`计划${$route.query.partner_type === 1 ? '收款' : '付款'}日期`"
              align="right"
            />
            <el-table-column
              prop="obtained_amount"
              :label="`${$route.query.partner_type === 1 ? '已收' : '已付'}金额`"
              align="right"
            />
            <el-table-column
              prop="to_obtain_amount"
              :label="`${$route.query.partner_type === 1 ? '待收' : '待付'}金额`"
              align="right"
            />
            <el-table-column prop="invoice_amount" label="已开票" align="right"></el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="detail" class="content-block">
        <div class="block-title">补充附件</div>
        <div class="block-content attachment-list">
          <!-- {{detail.contract_annex_info}} -->
          <el-table
            stripe
            :data="detail.contract_annex_info || []"
            border
            :header-cell-style="{ backgroundColor: '#F3F5F8', color: 'var(--text-second-color)' }"
            :cell-style="{ borderBottom: '1px solid #ebeef5' }"
          >
            <el-table-column label="序号" type="index" width="63" align="center"></el-table-column>
            <el-table-column
              label="附件名称"
              :formatter="
                row => row.attachment_url.split('/')[row.attachment_url.split('/').length - 1]
              "
            />
            <el-table-column label="申请内容" prop="comment"></el-table-column>
            <el-table-column
              label="附件状态"
              prop="contract_annex_status_str"
              width="180"
              align="center"
            >
              <template #default="{ row }">
                <em :class="['status-dot', 'status-dot-' + row.contract_annex_status]"></em>
                {{ row.contract_annex_status_str }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="170" align="center">
              <template #default="{ row }">
                <a :href="row.attachment_url" target="_blank" class="download-btn" type="text"
                  >下载</a
                >
                <!-- <el-button v-if="row.contract_annex_status !== 4" class="delete-btn" type="text" @click="handleAttachmentClick(row)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="!detail" class="no-detail">
        <img src="@/assets/img/pls_import_product.png" />
        <p>没有查询到合同详情</p>
      </div>
    </div>
    <!-- <add-contract ref="editContractDialog" type="edit" @edited="getContractDetail"></add-contract> -->
    <review-dialog ref="reviewDialog" @approved="getContractDetail"></review-dialog>
  </div>
</template>

<script>
import {
  queryContract,
  deleteContract,
  setContractRecycle,
  deleteContractAnnex,
} from '@/api/customer';
import ReviewDialog from '@/views/customer/components/reviewDialog';
import ApproveProgress from '@/views/customer/components/approveProgress';
import { getToken } from '@/utils/token';
import { CONSTRACT_APPROVER } from '@/utils/config';
import { ROLE_CODE, RIGHT_CODE } from '@/const/roleCode';
import { fixFileToken } from '@/utils/http';
// import { getUserInfo } from '@/api/auth'

export default {
  name: 'ContractDetail',
  components: {
    ApproveProgress,
    ReviewDialog,
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
      detail: null,
      getToken,
      loading: false,
      currentUserInfo: null,
      // 合同【收回】状态
      isRecycled: false,
    };
  },
  computed: {
    // 计算是否有审核权限
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
    this.getContractDetail();
    // await this.getUserInfo()
    // 获取当前用户信息
    this.currentUserInfo = this.$store.getters['user/getUserInfo'];
  },
  methods: {
    preview(attachment_url) {
      const url = attachment_url;
      // console.log(attachment_url);
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
    // 合同附件展示
    caseFileList() {
      if (this.detail && this.detail.contract_detail) {
        // console.log(this.detail.kol_info)
        const caseArr = this.detail.contract_detail.attachment_url.split(',');
        const list = caseArr.map(item => {
          const nameArr = item.split('/');

          return {
            fileName: nameArr[nameArr.length - 1],
            link: item,
          };
        });
        return list;
      } else {
        return [];
      }
    },
    // 表格1
    cellStyle({ columnIndex }) {
      if (columnIndex === 4 || columnIndex === 6) {
        //指定坐标
        return 'color-red';
      }
    },
    // 表格2
    cellStyle2({ columnIndex }) {
      if (columnIndex === 1 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
        //指定坐标
        return 'color-red';
      }
    },
    // 获取详情
    getContractDetail() {
      if (!this.$route.query.id || !this.$route.query.partner_type) return false;
      this.loading = true;
      queryContract({
        id: this.$route.query.id,
        partner_type: this.$route.query.partner_type || 1,
      })
        .then(res => {
          if (res.data.success) {
            if (res.data.data.data.length > 0) {
              this.detail = res.data.data.data[0];
              // 赋值协议明细
              this.detailList = [
                {
                  sale_chance: this.processSaleChanceToStr(this.detail.contract_info.sale_chance),
                  num: this.detail.contract_detail.num,
                  unit_str: this.detail.contract_detail.unit_str,
                  price: this.detail.contract_detail.price,
                  discount: this.detail.contract_detail.discount,
                  contract_amount: this.detail.contract_detail.contract_amount,
                },
              ];
              // 赋值 合同状态
              this.isRecycled = this.detail.contract_info.is_recycled === 1;
            }
            //  else {
            //   this.$message({
            //     type: 'warning',
            //     message: '没有查询到合同详情',
            //     duration: 2000,
            //     showClose: true
            //   })
            // }
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
            message: '合同详情获取失败，稍后重试',
            duration: 2000,
            showClose: true,
          });
          this.loading = false;
          console.log(error.message);
        });
    },
    // 处理销售渠道
    processSaleChanceToStr(saleChance) {
      // console.log(saleChance)
      let str = '';
      saleChance.map(item => {
        str += item.sale_chance_name + '、';
        return item;
      });
      return str.substr(0, str.length - 1);
    },
    // 删除合同
    handleDeleteContractClick() {
      if (!this.detail) return false;
      this.$confirm('此操作将删除该合同, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'delete-contract-alert',
        center: true,
      })
        .then(() => {
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
        })
        .catch(() => {
          /* do nth */
        });
    },
    // 编辑合同
    handleEditContractClick() {
      if (!this.detail) return false;

      this.$refs.editContractDialog.show(this.detail);
    },
    // 获取当前用户信息
    // async getUserInfo () {
    //   try {
    //     const res = await getUserInfo()
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
    // },
    oprateBtnVisiable() {
      // 当合同状态不为【正常】时可以删除，合同的客户经理id等于当前用户的时候可以删除，合同的创建者为当前用户可以删除
      const visiable =
        this.detail &&
        this.detail.contract_info.contract_status !== 2 &&
        this.currentUserInfo &&
        (this.currentUserInfo.id === this.detail.contract_info.manager_id ||
          this.currentUserInfo.id === this.detail.contract_detail.add_by);
      // debugger
      return visiable;
    },
    // 点击审核按钮
    handleReviewBtnClick() {
      this.$refs.reviewDialog.show(this.detail.contract_info);
    },
    // 获取当前用户的角色码
    getCurrentUserHasRecycleRight() {
      if (this.currentUserInfo && this.currentUserInfo.user_rights.length > 0) {
        return this.currentUserInfo.user_rights.includes(RIGHT_CODE.recycle_contract);
      } else {
        return false;
      }
    },
    // 点击设置合同收回状态
    handleContractRecycleChange() {
      setContractRecycle({
        id: this.detail.contract_info.id,
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
    handleAttachmentClick(row) {
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
                this.$message.success(res.data.message, {
                  duration: 2000,
                  showClose: true,
                });
              } else {
                this.$message.warning(res.data.message, {
                  duration: 2000,
                  showClose: true,
                });
              }
            })
            .catch(error => {
              this.$message.error('删除附件失败，请稍后重试', {
                duration: 2000,
                showClose: true,
              });
              console.error(error);
            });
        })
        .catch(() => {
          /* do nth */
        });
    },
  },
};
</script>
