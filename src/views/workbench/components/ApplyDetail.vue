<!--
 * @Description: 用款申请详情
 * @Autor: 神曲
 * @Date: 2020-04-02 14:13:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-30 15:49:47
 -->

<template>
  <!-- :title="id?'编辑客户':'新增客户'" -->
  <el-dialog
    :append-to-body="true"
    :visible.sync="customerVisible"
    width="800px"
    top="70px"
    :close-on-click-modal="false"
    @close="close"
    style="border-radius: 10px"
  >
    <template #title>
      <div>
        <span style="font-size: 18px; font-weight: 600; color: #333">用款申请详情</span>
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
            <div class="apply-click" v-if="false" @click="again">
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
          <span style="font-size: 16px; color: #333">审批编号:</span>
          <span style="color: var(--text-color); font-weight: 600; font-size: 16px">{{
            detail_data.approval_uid
          }}</span>
          <span :class="`status-color ${'status-color-' + detail_data.approval_status}`">
            <span class="approver-state" v-if="detail_data.approval_status === 1">审批中</span>
            <span class="approver-state" v-if="detail_data.approval_status === 2">审批通过</span>
            <span class="approver-state" v-if="detail_data.approval_status === 3">审批失败</span>
            <span class="approver-state" v-if="detail_data.approval_status === 4">已撤销</span>
          </span>
        </div>
      </div>
      <div class="main-middle">
        <el-row style="margin-right: 0" :gutter="20">
          <el-col :span="8">
            <div class="from-middle-first">
              <span class="color-9">用款类型:</span>
              <span v-if="detail_data.level_two_types === 1">成本安排</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="from-middle-first">
              <span class="color-9">用款金额（元）:</span>
              <span class="color-red" style="font-weight: 600">{{
                '￥' + detail_data.transfer_amount_str
              }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="from-middle-first">
              <span class="color-9">用款日期:</span>
              <span>{{ detail_data.transfer_date }}</span>
            </div>
          </el-col>
        </el-row>
        <!-- [收款方式: 3--对公银行] -->
        <template v-if="detail_data.level_three_types === 3">
          <el-row style="margin-right: 0" :gutter="20">
            <el-col :span="8">
              <div class="from-middle">
                <span class="color-9">收款方式：</span>
                <span>对公银行</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="from-middle">
                <span class="color-9">银行卡号：</span>
                <span>{{ detail_data.bank_card_number }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="from-middle">
                <span class="color-9">开户行：</span>
                <span>{{ detail_data.bank_of_deposit }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-right: 0" :gutter="20">
            <el-col :span="8">
              <div class="from-middle from-middle-company">
                <span class="color-9">公司名称：</span>
                <span>{{ detail_data.collecting_company }}</span>
              </div>
            </el-col>
          </el-row>
        </template>
        <!-- [收款方式: 4---对公支付宝] -->
        <template v-if="detail_data.level_three_types === 4">
          <el-row style="margin-right: 0" :gutter="20">
            <el-col :span="8">
              <div class="from-middle">
                <span class="color-9">收款方式：</span>
                <span>对公支付宝</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="from-middle">
                <span class="color-9">收款人：</span>
                <span>{{ detail_data.collecting_person }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="from-middle">
                <span class="color-9">支付宝账号：</span>
                <span>{{ detail_data.alipay_account }}</span>
              </div>
            </el-col>
          </el-row>
        </template>

        <el-row style="margin-right: 0" :gutter="20">
          <el-col :span="8">
            <div class="from-middle">
              <span class="color-9">店铺名称:</span>
              <span>{{ detail_data.collecting_shop_name }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="from-middle remark-text-remark">
              <span class="color-9">备注:</span>
              <span>{{ detail_data.remark ? detail_data.remark : '--' }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="from-middle remark-text-reason">
              <span class="color-9">付款事由:</span>
              <span>{{ detail_data.pay_reason ? detail_data.pay_reason : '--' }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="flow" style="padding-left: 18px">
      <div class="invoice-info-title">审批流程</div>
      <tg-steps
        v-if="steps.length > 0"
        direction="vertical"
        :steps="steps"
        :active="activeNumber"
      />
      <span v-else>--</span>
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
            ></el-input>
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
        <show-apply-dialog ref="showApplyDialog" @update-info="updateInfo" />
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, provide, ref } from '@vue/composition-api';
import ShowApplyDialog from './ApplyDialog';
import { queryTransferApplyInfo, updateTransferApplyInfo } from '@/api/workbench';
import { ExportApprovalInfoPDF } from '@/services/workbench/workbench';
import { useApproval } from '@/use/approval';
import { GetApprovalInfo } from '@/services/workbentch';

export default defineComponent({
  components: {
    ShowApplyDialog,
  },
  name: 'ApplyDetail',
  data() {
    return {
      cost_show: true,
      step_status: 0, //步骤
      customerVisible: true,
      // 审核-拒绝
      approvalDialogVisible: false,
      remark: '', //备注,
    };
  },
  setup(props, ctx) {
    //工作台详情弹窗数据
    const detail_data = ref({});
    console.log({ approval_flow_detail: detail_data.value.approval_flow_detail });

    const approval_flow_detail = ref([]);
    provide('flows', approval_flow_detail);

    return { detail_data, approval_flow_detail, ...useApproval(ctx) };
  },
  async mounted() {
    // 获取当前用户信息
    this.currentUserInfo = this.$store.getters['user/getUserInfo'];
  },
  methods: {
    async getFlowStepData(approval_id) {
      const { data: response } = await GetApprovalInfo({ approval_id });
      if (response.success) {
        this.$store.dispatch('workbench/setApproval', {
          ...response.data,
        });
      } else {
        this.$message.error(response.message ?? '获取审批详情失败');
      }
    },
    updateInfo(val) {
      // 子组件保存后触发父组件刷新
      if (val) {
        this.$parent.handleSearch();
      }
    },
    // 显示弹窗 type: 0以前的入口进入，1新的成本安排表进入
    show(row, type = 0) {
      //  工作台点击详情
      /** @deprecated 工作台点击详情 */
      if (row && row.pay_way_detail === undefined && type !== 1) {
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
          approval_id: type === 1 ? row.approval_id : row.pay_way_detail[0].approval_id,
        }).then(res => {
          if (res && res.data && res.data.success) {
            this.detail_data = res.data.data;
            this.step_status = this.detail_data.steps;
            this.approval_flow_detail = this.detail_data.approval_flow_detail;
          }
          if (this.detail_data.approval_status === 2 || this.detail_data.approval_status === 3) {
            this.step_status = this.step_status + 1;
          }
        });
      }
      // 获取 审批流程数据
      this.getFlowStepData(row.approval_id);
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
    },
    // 再次提交
    again() {
      const detail_data = this.detail_data;
      this.$refs.showApplyDialog.show(detail_data);
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
});
</script>

<style lang="less" scoped>
.dialog-footer:after {
  content: '.';
  display: block;
  clear: both;
  height: 0; //使父元素不会被.撑出来
  overflow: hidden; //使.隐藏
}
.remark-text-remark {
  text-indent: -2.3em;
  margin-left: 2em;
  span {
    //  word-wrap: break-word;
    word-break: break-all;
  }
}
.remark-text-reason {
  text-indent: -4.3em;
  margin-left: 3.7em;
  span {
    //  word-wrap: break-word;
    word-break: break-all;
  }
}
.left_icon {
  float: right;
  margin-right: 10px;
  cursor: pointer;
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
  }
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
// 审核成功
.status-color-2 {
  color: #396fff;
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
.main-header {
  background: #fff;
  border-radius: 10px;
  .from-header-box {
    background: rgba(250, 252, 254, 1);
    padding-left: 20px;
    line-height: 46px;
    border-radius: 10px;
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
  border-radius: 10px;
  background: #fff;
  padding: 20px 0;
  padding-left: 90px;
  .from-middle {
    color: #666;
    text-align: left;
    // line-height: 40px;
    margin-top: 38px;
    .color-9 {
      color: var(--text-des-color);
    }
  }
  .from-middle-first {
    .color-9 {
      color: var(--text-des-color);
    }
  }
  .from-middle-company {
    margin-top: 10px;
  }
}
.color-9 {
  color: var(--text-des-color);
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
.hover-red:hover {
  color: #f43846;
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
  border-radius: 10px;
}
.flow {
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  margin-top: 10px;
  .steps {
    padding-left: 20px;
    .color-3 {
      color: var(--text-color);
      font-size: 14px;
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
  // /deep/ .el-step__icon.is-text {
  //   border-radius: 50%;
  //   border: 5px solid #9eb8fd !important;
  //   border-color: inherit;
  //   background: #396fff;
  // }
  // /deep/ .el-step__line {
  //   position: absolute;
  //   border-color: inherit;
  //   background-color: #396fff;
  // }
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
  /deep/ .el-step__icon {
    width: 18px;
    height: 18px;
    margin-left: 3px;
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
      border-radius: 10px;
      background: #fff;
      .el-textarea__inner {
        border-radius: 10px;
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
          border-radius: 10px;
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
// 审批通过后最后一个步骤样式
.steps {
  .step-children:last-child {
    .last-color {
      color: #396fff;
    }
  }
}
</style>

<style lang="less">
// ! oa-flows 组件容器样式
.oa-flow-container {
  background: #fff;
  margin-top: 10px;
  .flow-select {
    color: var(--text-des-color);
    font-size: 14px;
  }
  .refuse {
    color: #f43846;
  }
}
.el-dialog__header {
  padding: 0 20px;
}
</style>
