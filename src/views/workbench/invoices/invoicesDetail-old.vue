<!--
 * @Description: 开票申请详情
 * @Autor: 神曲
 * @Date: 2020-04-13 15:31:25
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-08-18 17:10:16
 -->
<template>
  <!-- :title="id?'编辑客户':'新增客户'" -->
  <el-dialog
    :append-to-body="true"
    :visible.sync="customerVisible"
    width="948"
    top="70px"
    :close-on-click-modal="false"
    @close="close"
    class="sty-add-dialog tg-dialog-vcenter"
  >
    <template #title>
      <div class="title">
        <span style="font-size: 16px; color: #333">开票申请详情</span>
      </div>
    </template>
    <div class="main">
      <div class="main-header">
        <div class="from-header-box">
          <div class="from-header">
            <span>申请人:</span>
            <span>{{ detail_data.username }}</span>
          </div>
          <div class="from-header">
            <span>申请部门:</span>
            <span>{{ detail_data.create_department }}</span>
          </div>
          <div class="from-header">
            <span>发起时间:</span>
            <span>{{ detail_data.gmt_create }}</span>
          </div>
          <span class="left_icon">
            <div class="apply-click" v-if="revocationVisiable()" @click="again">
              <span>
                <img src="@/assets/img/workbench/toresubmit_icon@2x.png" />
              </span>
              <span class="hover-red">再次提交</span>
            </div>
            <div class="apply-click" @click="exportPdf">
              <span>
                <img src="@/assets/img/workbench/download_pdf_icon@2x.png" />
              </span>
              <span>下载PDF</span>
            </div>
          </span>
        </div>
        <div class="title-right">
          <span style="font-size: 16px; color: var(--text-color); font-weight: 600"
            >审批编号：</span
          >
          <span style="color: var(--text-color); font-weight: 600; font-size: 16px">{{
            detail_data.approval_uid
          }}</span>
          <span :class="`status-color ${'status-color-' + detail_data.approval_status}`">
            <span class="approver-state" v-if="detail_data.approval_status === 1">审批中</span>
            <span class="approver-state" v-if="detail_data.approval_status === 2">审批成功</span>
            <span class="approver-state" v-if="detail_data.approval_status === 3">审批失败</span>
            <span class="approver-state" v-if="detail_data.approval_status === 4">已撤销</span>
          </span>
        </div>
      </div>
      <div class="main-middle">
        <div class="uls">
          <ul>
            <li>
              <span class="color-6">开票类型：</span>
              <span class="color-3">{{ enumLevelTwoTypes(detail_data.level_two_types) }} </span>
            </li>
            <li>
              <span class="color-6">开票金额(元)：</span>
              <span style="font-weight: 600; color: #ff731e">{{
                '￥' + detail_data.invoice_amount_str
              }}</span>
            </li>
            <li>
              <span class="color-6">款项是否收到：</span>
              <span class="color-3">{{ detail_data.is_received === 1 ? '是' : '否' }}</span>
            </li>

            <li>
              <span class="color-6">发票寄送方式：</span>
              <span class="color-3">{{
                detail_data.invoice_send_type === 1 ? '快递寄送' : '自行送达'
              }}</span>
            </li>
          </ul>
          <ul>
            <li>
              <span class="color-6">关联客户合同：</span>
              <span
                v-if="detail_data.contract_uid"
                class="color-blue"
                style="cursor: pointer"
                @click="handleClick(detail_data.contract_id)"
                >{{ detail_data.contract_uid }}</span
              >
              <span v-else style="color: #333">--</span>
            </li>
            <li>
              <span class="color-6">关联业绩：</span>
              <span
                style="color: #5c82ff; cursor: pointer"
                @click="jumpToAchievment(detail_data.achievement_uid)"
                >{{ detail_data.achievement_uid }}</span
              >
            </li>
            <li>
              <span class="color-6">{{ detail_data.is_received ? '' : '预计' }}收款时间：</span>
              <span class="color-3">{{ detail_data.received_date }}</span>
            </li>
          </ul>
        </div>
        <p class="title" style="margin-bottom: 10px">开票信息：</p>
        <div class="uls">
          <ul>
            <li style="text-indent: -64px; padding-left: 64px">
              <span class="color-6">公司名称：</span>
              <span class="break-all">{{ detail_data.collecting_company }}</span>
            </li>
            <li style="text-indent: -35px; padding-left: 35px">
              <span class="color-6">地址：</span>
              <span class="break-all">{{ detail_data.address }}</span>
            </li>
            <li style="text-indent: -52px; padding-left: 52px">
              <span class="color-6">开户行：</span>
              <span class="break-all">{{ detail_data.bank_of_deposit }}</span>
            </li>
          </ul>
          <ul>
            <li style="text-indent: -92px; padding-left: 90px">
              <span class="color-6">纳税人识别号：</span>
              <span class="break-all">{{ detail_data.tax_number }}</span>
            </li>
            <li>
              <span class="color-6">电话：</span>
              <span>{{ detail_data.phone }}</span>
            </li>
            <li>
              <span class="color-6">账号：</span>
              <span>{{ detail_data.bank_card_number }}</span>
            </li>
          </ul>
        </div>
        <ul class="reason">
          <span class="color-6">备注：</span>
          <span class="break-all">{{ detail_data.remark ? detail_data.remark : '--' }}</span>
        </ul>
      </div>
    </div>
    <div class="flow">
      <el-form>
        <el-form-item label="审批流程：" label-width="80px">
          <ApprovalFlow />
          <div class="steps" v-if="false">
            <!-- 循环版 -->
            <el-steps direction="vertical" :active="1" class="step-username">
              <el-step style="height: 82px">
                <template #title>
                  <div class="size-medium">申请人</div>
                </template>
                <template #description>
                  <div>
                    <span class="color-3">{{ detail_data.username }}</span>
                    <p class="flow-select">{{ detail_data.gmt_create_datetime }}</p>
                  </div>
                </template>
              </el-step>
            </el-steps>
            <el-steps :active="step_status" direction="vertical" class="steps-line">
              <el-step
                style="height: 82px !important"
                v-for="(item, index) in detail_data.approval_stream
                  ? detail_data.approval_stream
                  : ''"
                :key="index"
                class="step-children"
              >
                <template #title>
                  <span
                    class="size-medium"
                    v-if="item.role_code !== 804 && item.role_code !== 802"
                    >{{ item.role_name }}</span
                  >
                </template>
                <template #description>
                  <div>
                    <span
                      class="flow-select"
                      :class="{
                        refuse: item.approval_result === 2 ? 'refuse' : '',
                        'color-3': item.approval_result === 1 ? 'color-3' : '',
                        'last-color': detail_data.approval_status === 2,
                      }"
                      >审批人:</span
                    >
                    <!-- 已审批 -->
                    <span v-if="item.approval_result">
                      <span
                        v-if="item.approval_result === 1"
                        :class="{
                          'color-3': item.approval_result === 1 ? 'color-3' : 'flow-select',
                          'last-color': detail_data.approval_status === 2,
                        }"
                        >{{ item.username + '（已同意）' }}</span
                      >
                      <span v-if="item.approval_result === 2" class="flow-select refuse">{{
                        item.username + '（已拒绝）'
                      }}</span>
                    </span>
                    <!-- 未审批 -->
                    <span v-else class="flow-select">{{ item.username }}</span>
                    <p v-if="item.remark !== ''" class="refuse">
                      {{ item.remark ? '理由:' + item.remark : '' }}
                    </p>
                    <p
                      v-if="item.approval_date"
                      :class="{
                        refuse: item.approval_result === 2 ? 'refuse' : '',
                        'last-color': detail_data.approval_status === 2,
                      }"
                      class="flow-select"
                    >
                      {{ item.approval_date }}
                    </p>
                  </div>
                </template>
              </el-step>
            </el-steps>
            <el-steps
              direction="vertical"
              :active="1"
              class="step-username revocation"
              v-if="detail_data.approval_status === 4"
            >
              <el-step style="height: 100px">
                <template #title>
                  <div class="size-medium">申请人</div>
                </template>
                <template #description>
                  <div>
                    <span class="flow-select revocation-color">{{
                      detail_data.username + '（已撤销）'
                    }}</span>
                    <p class="flow-select revocation-color">{{ detail_data.gmt_modified }}</p>
                  </div>
                </template>
              </el-step>
            </el-steps>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer" v-if="cost_show">
        <div></div>
        <el-button
          v-if="revocationVisiable() && detail_data.approval_status === 1"
          size="small"
          class="big-button color-9"
          @click="revocation"
          >撤销</el-button
        >
        <el-button
          v-if="btnVisiable() && detail_data.approval_status === 1"
          type="primary"
          class="big-button btn-red"
          size="small"
          @click="refuse"
          >拒绝</el-button
        >
        <el-button
          v-if="btnVisiable() && detail_data.approval_status === 1"
          type="primary"
          class="big-button btn-blue"
          size="small"
          @click="agree"
          >同意</el-button
        >
        <el-dialog
          :visible="approvalDialogVisible"
          class="userinfo-customer-dialog"
          width="460px"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          @close="approvalDialogVisible = false"
          :modal="false"
        >
          <template #title>
            <div class="userinfo-customer-dialog-header">拒绝理由</div>
          </template>
          <div class="approval-content">
            <p style="text-align: left; color: var(--text-color); margin-bottom: 10px">填写理由:</p>
            <el-input
              type="textarea"
              :rows="3"
              :maxlength="30"
              placeholder="请输入不超过30个字符"
              style="width: 100%"
              v-model="remark"
            />
          </div>
          <template #footer>
            <div class="userinfo-customer-dialog-footer">
              <el-button
                size="small"
                plain
                @click="approvalDialogVisible = false"
                class="big-button"
                >取消</el-button
              >
              <el-button
                size="small"
                type="primary"
                @click="handleApprovalSubmitClick"
                class="btn-blue big-button"
                >确定</el-button
              >
            </div>
          </template>
        </el-dialog>
        <!-- 再次提交 -->
        <invoices-dialog ref="InvoicesDialog" @update-info="updateInfo" @reloadTable="reloadList" />
      </span>
    </template>
  </el-dialog>
</template>
<script>
// import RefundDialog from "./ApplyDialog";
import InvoicesDialog from '@/views/workbench/invoices/invoicesDialog';
import { enumLevelTwoTypes } from '@/utils/enumFunc';
import { queryTransferApplyInfo, updateTransferApplyInfo } from '@/api/workbench';
import ApprovalFlow from '@/modules/workbench/approvalFlow';
import { RouterNameFinance, RouterNameProjectManage } from '@/const/router';
import { ExportApprovalInfoPDF } from '@/services/workbench/workbench';

export default {
  components: {
    InvoicesDialog,
    ApprovalFlow,
  },
  name: 'applicationDetail',
  data() {
    return {
      cost_show: true,
      step_status: 0, //步骤
      detail_data: '', //工作台详情弹窗数据
      customerVisible: true,
      // 审核-拒绝
      approvalDialogVisible: false,
      remark: '', //备注,
    };
  },
  async mounted() {
    // 获取当前用户信息
    this.currentUserInfo = this.$store.getters['user/getUserInfo'];
  },
  methods: {
    jumpToAchievment(achievement) {
      const type = achievement.substring(0, 2);
      const name =
        type === 'DY' || type === 'TD' || type === 'TB' || type === 'YX'
          ? RouterNameFinance.receive
          : RouterNameProjectManage.marketing.achievement;
      const routerUrl = this.$router.resolve({
        name,
        query: {
          source: 'dialog',
          achievement,
        },
      });
      window.open(routerUrl.href, '_blank');
    },
    enumLevelTwoTypes,
    updateInfo(val) {
      // 子组件保存后触发父组件刷新
      if (val) {
        this.$parent.handleSearch();
      }
    },
    /**
     * @Author: 矢车
     * @Date: 2020-11-17 15:08:01
     * @Description: 点击进入关联客户合同-打开新窗口
     */
    handleClick(row) {
      const routeUrl = this.$router.resolve({
        name: RouterNameProjectManage.marketing.contract.customer.detail,
        params: {
          id: row,
        },
        query: {
          partner_type: 2,
        },
      });
      window.open(routeUrl.href, '_blank');
    },
    // 显示弹窗
    show(row) {
      //  工作台点击详情
      if (row && row.pay_way_detail === undefined) {
        // this.$emit("formSubmit", row.approval_status);
        queryTransferApplyInfo({ approval_id: row.approval_id }).then(res => {
          if (res && res.data && res.data.success) {
            this.detail_data = res.data.data;
            this.step_status = this.detail_data.steps;
          }
          if (this.detail_data.approval_status === 2 || this.detail_data.approval_status === 3) {
            this.step_status = this.step_status + 1;
          }
        });
      } else {
        //  成本安排点击详情
        queryTransferApplyInfo({
          approval_id: row.pay_way_detail[0].approval_id,
        }).then(res => {
          if (res && res.data && res.data.success) {
            this.detail_data = res.data.data;
            this.step_status = this.detail_data.steps;
          }
          if (this.detail_data.approval_status === 2 || this.detail_data.approval_status === 3) {
            this.step_status = this.step_status + 1;
          }
        });
      }
    },
    //  撤销和再次提交 判断是否是本人
    revocationVisiable() {
      // const currentUserInfo = this.$store.getters['user/getUserInfo'];
      const visiable = this.currentUserInfo && this.currentUserInfo.id === this.detail_data.add_by;
      return visiable;
    },
    // 同意和拒绝权限
    btnVisiable() {
      // const currentUserInfo = this.$store.getters['user/getUserInfo'];
      const visiable = this.currentUserInfo && this.currentUserInfo.id === this.detail_data.now_id;
      return visiable;
    },
    // 关闭弹窗
    close() {
      this.$emit('close');
      // try {
      //   this.$parent.handleSearch();
      // } catch (error) {}
    },
    // 再次提交
    again() {
      const detail_data = this.detail_data;
      this.$refs.InvoicesDialog.show(detail_data);
    },
    // 导出PDF
    exportPdf() {
      ExportApprovalInfoPDF(this.detail_data.approval_id);
    },
    // 撤销
    revocation() {
      this.$confirm('你确定撤销吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'warning-icon',
      })
        .then(() => {
          const params = {
            approval_id: this.detail_data.approval_id,
            update_code: 4,
          };
          updateTransferApplyInfo(params).then(res => {
            if (res && res.data && res.data.success) {
              this.close();
              this.$message.success('保存成功');
              this.$emit('reload:invoices');
              this.$parent.handleSearch();
            } else {
              this.$message.error('保存失败');
            }
          });
        })
        .catch(() => {
          return false;
        });
    },
    reloadList() {
      this.$emit('reload:invoices');
    },
    // 同意弹框
    agree() {
      this.$confirm('你确定同意该申请吗', '提示', {
        confirmButtonText: '同意',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'success-icon',
      })
        .then(() => {
          const params = {
            approval_id: this.detail_data.approval_id,
            update_code: 2,
          };
          //调用更新接口
          updateTransferApplyInfo(params).then(res => {
            if (res && res.data && res.data.success) {
              this.close();
              this.$message.success('保存成功');
              this.$parent.handleSearch();
            } else {
              this.$message.error('保存失败');
            }
          });
        })
        .catch(() => {
          return false;
        });
    },
    // 拒绝按钮
    refuse() {
      this.approvalDialogVisible = true;
    },
    // 拒绝审核确定点击回调
    handleApprovalSubmitClick() {
      const params = {
        approval_id: this.detail_data.approval_id,
        update_code: 3,
        remark: this.remark,
      };
      updateTransferApplyInfo(params)
        .then(res => {
          if (res && res.data && res.data.success) {
            this.approvalDialogVisible = false;
            this.close();
            this.$message.success('保存成功');
            this.this.remark = '';
            this.$parent.handleSearch();
          } else {
            this.$message.error('保存失败');
          }
        })
        .catch(() => {
          return false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/public.scss';
@import '@/assets/scss/dialog.scss';

.dialog-footer:after {
  content: '.';
  display: block;
  clear: both;
  height: 0; //使父元素不会被.撑出来
  overflow: hidden; //使.隐藏
}

.remark-text {
  text-indent: -2.5em;
  margin-left: 2em;

  span {
    //  word-wrap: break-word;
    word-break: break-all;
  }
}

.left_icon {
  float: right;
  margin-right: 10px;
  cursor: pointer;
  // text-align: left;
  .apply-click {
    display: inline-block;
    color: #666;
    font-size: 12px;
    margin-right: 8px;

    img {
      width: 14px;
      height: 16px;
      vertical-align: middle;
      margin-bottom: 5px;
      margin-right: 3px;
    }
  }
}

.btn-red {
  background: #f43846;
  border: none;
}

.title-right {
  padding-left: 20px;
  line-height: 67px;

  .approver-state {
    font-size: 12px;
    border: 1px solid;
    border-radius: 6px;
    padding: 1px 4px;

    .status-color {
      margin-left: 3px;
      vertical-align: top;
    }
  }

  // 审核中
  .status-color-1 {
    color: #ff9434;
    background: rgba(255, 249, 244, 1);
  }

  // 审批成功
  .status-color-2 {
    color: #3eaf90;
    background: rgba(247, 249, 255, 1);
  }

  // 审核失败
  .status-color-3 {
    color: #f43846;
    background: rgba(255, 242, 244, 1);
  }

  // 已撤销
  .status-color-4 {
    color: var(--text-des-color);
    background: rgba(251, 251, 251, 1);
  }
}

.main-header {
  background: #fff;
  border-radius: 4px;

  .from-header-box {
    background: rgba(250, 252, 254, 1);
    padding-left: 20px;
    line-height: 46px;
    border-radius: 4px;

    .from-header {
      display: inline-block;
      color: #666;
      font-size: 12px;
      text-align: left;
      margin-right: 30px;
    }
  }
}

.main-middle {
  margin-top: 10px;
  border-radius: 4px;
  background: #fff;

  .title {
    padding-left: 20px;
    font-weight: 600;
    color: var(--text-color);
    padding-top: 15px;
  }

  .uls {
    display: flex;
    padding: 15px 20px;
    padding-bottom: 0;

    ul {
      flex: 1;

      li {
        line-height: 35px;
      }
    }
  }

  .reason {
    padding: 15px;
    border-top: 1px solid #f2f6f9;
    text-indent: -64px;
    padding-left: 85px;
  }
}

.color-9 {
  color: var(--text-des-color);
}

.hover-red:hover {
  color: #f43846;
}

// 已撤销
.revocation {
  /deep/ .el-step__line {
    background-color: transparent;
    top: -42px !important;
  }

  .revocation-color {
    color: var(--text-des-color);
  }
}

// deep
/deep/ .el-step.is-vertical .el-step__main {
  padding-left: 15px;
  padding-top: 5px;
}

/deep/ .el-dialog__body {
  padding: 0;
}

/deep/ .el-dialog__body {
  background: #f2f6f9;
  border-radius: 4px;
}

.flow {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  margin-top: 10px;

  .steps {
    padding-left: 20px;

    .color-3 {
      font-size: 14px;
      color: var(--text-color);
    }
  }

  .flow-select {
    color: var(--text-des-color);
    font-size: 14px;
  }

  .refuse {
    color: #f43846;
  }

  .flow-title {
    margin-bottom: 10px;
    color: var(--text-color);
    font-weight: 600;
  }

  /deep/ .el-step__icon-inner {
    display: none;
  }

  /deep/ .el-step__icon {
    width: 18px;
    height: 18px;
    margin-left: 3px;
  }

  // 完成后步骤样式
  /deep/ .el-step__title.is-finish {
    color: var(--text-color);
  }

  /deep/ .el-step__head.is-finish {
    // color: var(--text-color);
    .el-step__icon.is-text {
      border-radius: 50%;
      border: 6px solid #396fff !important;
      border-color: inherit;
      background: #fff;
    }
  }

  //未完成步骤样式
  /deep/ .el-step__title.is-process {
    font-weight: 400;
  }

  /deep/ .el-step__head.is-process {
    .el-step__icon.is-text {
      border-radius: 50%;
      border-color: inherit;
      background: #d6d6d6;
      border: none;
    }
  }

  /deep/ .el-step__head.is-wait {
    .el-step__icon.is-text {
      border-radius: 50%;
      border-color: inherit;
      background: #d6d6d6;
      border: none;
    }
  }

  // 未完成步骤右侧文字样式
  /deep/ .el-step__title.is-wait,
  /deep/ .el-step__title.is-process {
    color: var(--text-des-color);
  }

  /deep/ .el-step.is-vertical .el-step__line {
    top: 36px;
    bottom: 20px;
  }

  /deep/ .el-input--suffix {
    width: 309px;
    height: 32px;
  }

  /deep/ .el-input__inner {
    height: 32px;
  }

  /deep/ .el-input__icon {
    line-height: 30px;
  }

  /deep/ .step-username {
    .el-step:last-of-type .el-step__line {
      display: block;
    }

    /deep/ .el-step__line-inner {
      height: 44px;
    }
  }
}

/deep/ .el-dialog__header {
  padding: 0 0 0 20px;
}

.userinfo-customer-dialog {
  /deep/ .el-dialog__header {
    background: #f2f6f9;
    padding: 0;
    border-bottom: #efefef solid 1px;

    .userinfo-customer-dialog-header {
      // background: #F8F8F8;
      background: #f2f6f9;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      color: var(--text-color);
      font-weight: 600;
      padding-left: 10px;
    }

    .el-dialog__headerbtn {
      top: 10px;
      right: 10px;

      i.el-dialog__close {
        color: #0b1536 !important;
        font-size: 30px;
        opacity: 0.5;
      }
    }
  }

  /deep/ .el-dialog__body {
    .approval-content {
      text-align: center;
      padding: 18px 30px;
      border-radius: 4px;
      background: #fff;

      .el-textarea__inner {
        border-radius: 4px;
      }

      .el-radio {
        & + .el-radio {
          padding-left: 60px;
        }

        span.el-radio__input,
        span.el-radio__label {
          vertical-align: text-top;
          font-size: 16px;
        }
      }
    }

    .edit-content {
      width: 540px;
      margin: 0 auto;

      .edit-input {
        display: inline-block;
        width: 428px;

        .el-input__inner {
          border-radius: 4px;
        }
      }

      .el-form-item__content {
        margin-bottom: 15px;
      }
    }
  }

  /deep/ .el-dialog__footer {
    border-top: #f5f5f5 solid 1px;
    padding: 20px;

    .el-button {
      width: 100px;
      text-align: center;
      font-size: 14px;
    }
  }
}

/deep/ .el-step.is-vertical .el-step__head {
  height: 100px;
}

// 去除小蓝框
:focus {
  outline: 0;
}

// 审批成功后最后一个步骤样式
.steps {
  .step-children:last-child {
    .last-color {
      color: #396fff;
    }
  }
}
</style>
