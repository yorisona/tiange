<!--
 * @Description: 垫款申请详情
 * @Autor: 神曲
 * @Date: 2020-04-13 15:02:45
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-12-14 14:11:12
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
    class="sty-add-dialog tg-dialog-vcenter"
  >
    <template #title>
      <div class="title">
        <span>垫款申请详情</span>
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
            <div
              class="apply-click"
              v-if="revocationVisiable() && commitAgainVisible"
              @click="again"
            >
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
              <span class="color-6">垫款类型：</span>
              <span class="color-3">{{
                detail_data.level_two_types === 1 ? '成本安排' : '--'
              }}</span>
            </li>
            <li>
              <span class="color-6">垫款金额(元)：</span>
              <span style="font-weight: 600; color: #ff731e">{{
                '￥' + detail_data.borrowing_amount_str
              }}</span>
            </li>
            <li>
              <span class="color-6">客户(公司)名称：</span>
              <span class="color-3">{{ detail_data.company_name }}</span>
            </li>
            <li>
              <span class="color-6" style="cursor: pointer">关联客户合同：</span>
              <span
                style="cursor: pointer"
                class="color-blue"
                @click="handleClick(detail_data.contract_id)"
                >{{ detail_data.contract_uid }}</span
              >
            </li>
          </ul>
          <ul>
            <li>
              <span class="color-6">回款时间：</span>
              <span class="color-3">{{
                detail_data.back_date ? detail_data.back_date : '--'
              }}</span>
            </li>
            <li>
              <span class="color-6">回款销售金额(元)：</span>
              <span style="font-weight: 600; color: #ff731e">{{
                detail_data.back_amount_str ? '￥' + detail_data.back_amount_str : '--'
              }}</span>
            </li>
            <li>
              <span class="color-6">备注：</span>
              <span class="break-all color-3">{{
                detail_data.remark ? detail_data.remark : '--'
              }}</span>
            </li>
          </ul>
        </div>
        <div class="reason">
          <span class="color-6">垫款理由：</span>
          <span class="break-all">{{
            detail_data.borrowing_reason ? detail_data.borrowing_reason : '--'
          }}</span>
        </div>
      </div>
      <div class="main-footer">
        <span class="title-text">附件</span>
        <div
          class="uploaded-list"
          v-if="detail_data && detail_data.borrowing_apply_annex_list.length !== 0"
        >
          <span
            v-for="(item, index) in detail_data.borrowing_apply_annex_list"
            :key="index"
            style="margin-right: 10px; line-height: 30px"
          >
            <a
              style="cursor: pointer"
              @click.stop="preview(item)"
              target="_blank"
              class="annex-list"
            >
              <i class="iconfont icon-xiangqingyefujian"></i>
              <span v-if="item" class="uploaded-attachment-name">{{
                decodeURIComponent(item.split('/')[item.split('/').length - 1] || '--')
              }}</span>
            </a>
          </span>
        </div>
        <span v-else style="color: #c8cacc; margin-left: 10px">未上传附件</span>
        <p style="height: 1px; background: #f0f3f4; margin: 15px"></p>
        <span class="title-text">图片</span>
        <div
          class="uploaded-list"
          v-if="detail_data && detail_data.borrowing_apply_photo_list.length !== 0"
        >
          <span
            v-for="(item, index) in detail_data.borrowing_apply_photo_list"
            :key="index"
            style="margin-right: 10px; line-height: 30px"
            class="img-list"
          >
            <a style="cursor: pointer" @click.stop="preview(item)" target="_blank">
              <img style="max-height: 70px" :src="item + '?Authorization=' + getToken()" />
            </a>
          </span>
        </div>
        <span v-else style="color: #c8cacc; margin-left: 10px">未上传图片</span>
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
              :rows="1"
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
        <application-dialog
          ref="ApplicationDialog"
          @update-info="updateInfo"
          @reloadTable="reloadList"
        />
      </span>
    </template>
  </el-dialog>
</template>
<script>
import ApplicationDialog from '@/views/workbench/application/applicationDialog';
import { queryTransferApplyInfo, updateTransferApplyInfo } from '@/api/workbench';
import { getToken } from '@/utils/token';
import { fixFileToken } from '@/utils/http';
import { RouterNameProjectManage } from '@/const/router';
import { ExportApprovalInfoPDF } from '@/services/workbench/workbench';
import { useApproval } from '@/use/approval';
import { GetApprovalInfo } from '@/services/workbentch';

export default {
  components: {
    ApplicationDialog,
  },
  name: 'applicationDetail',
  setup(props, ctx) {
    return { ...useApproval(ctx) };
  },
  data() {
    return {
      getToken,
      cost_show: true,
      step_status: 0, //步骤
      detail_data: '', //工作台详情弹窗数据
      customerVisible: false,
      // 审核-拒绝
      approvalDialogVisible: false,
      commitAgainVisible: true,
      remark: '', //备注,
    };
  },
  async mounted() {
    // 获取当前用户信息
    this.currentUserInfo = this.$store.getters['user/getUserInfo'];
  },
  methods: {
    /**
     * @Author: 矢车
     * @Date: 2020-11-17 15:08:01
     * @Description: 点击进入关联客户合同-打开新窗口
     */
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
    updateInfo(val) {
      // 子组件保存后触发父组件刷新
      if (val) {
        // this.$parent.handleSearch();
      }
    },
    preview(attachment_url) {
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
    reloadList() {
      this.$emit('reload:application');
    },
    // 显示弹窗
    show(row, _isLoan, commitAgainVisible = true) {
      const params = {};
      // 判断是否是从工作台查看详情还是从成本列表点击借款审批号查看详情
      this.commitAgainVisible = commitAgainVisible;
      if (row.approval_id) {
        params.approval_id = row.approval_id;
      } else {
        params.approval_uid = row.borrowing_uid;
      }

      queryTransferApplyInfo(params).then(res => {
        if (res && res.data && res.data.success) {
          this.detail_data = res.data.data;
          this.step_status = this.detail_data.steps;
        }
        if (this.detail_data.approval_status === 2 || this.detail_data.approval_status === 3) {
          this.step_status = this.step_status + 1;
        }
        this.customerVisible = true;
      });
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
      this.$refs.ApplicationDialog.show(detail_data);
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
              this.$emit('reload:application');
              // this.$parent.handleSearch();
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
              // this.$parent.handleSearch();
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
            // this.$parent.handleSearch();
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
.sty-add-dialog > .el-dialog .el-dialog__body .main .main-middle .reason {
  height: auto !important;
}
.img-list {
  img {
    width: 70px;
    border-radius: 4px;
  }
}
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
    border-radius: 4px;
    padding: 1px 4px;
  }
  .status-color {
    vertical-align: top;
  }
  // 审核中
  .status-color-1 {
    color: #ff9434;
    background: rgba(255, 249, 244, 1);
  }
  // 审批成功
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
}
.hover-red:hover {
  color: #f43846;
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
  .uls {
    display: flex;
    padding: 15px 15px;
    padding-bottom: 0;
    ul {
      flex: 1;
      li {
        line-height: 35px;
        text-indent: -35px;
        padding-left: 35px;
      }
    }
  }
  .reason {
    padding: 15px;
    border-top: 1px solid #f2f6f9;
    text-indent: -64px;
    padding-left: 79px;
  }
}
.main-footer {
  margin-top: 0px;
  .uploaded-list {
    margin-left: 15px;
    // width: 70px;
    // height: 70px;
    display: flex;
    flex-wrap: wrap;
    .img-list {
      display: inline-block;
      width: 70px;
      height: 70px;
      border: 1px solid #e9ebf3;
    }
  }
  margin-top: 10px;
  border-radius: 4px;
  background: #fff;
  padding: 20px 0;
  .title-text {
    font-weight: 600;
    color: var(--text-color);
    padding-left: 15px;
  }
  .annex-list {
    padding-left: 15px;
    display: inline-block;
    width: 220px;
    height: 42px;
    line-height: 42px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(233, 235, 243, 1);
    border-radius: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    // vertical-align: bottom;
    span {
      color: #666666;
      display: inline-block;
      width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: bottom;
    }
    .icon-xiangqingyefujian {
      color: #396fff;
      margin-right: 5px;
    }
  }
  .annex-list:hover {
    border: 1px solid rgba(57, 111, 255, 1);
    span {
      color: #396fff;
    }
  }
}
.color-9 {
  color: var(--text-des-color);
}
// 已撤销
.revocation {
  ::v-deep .el-step__line {
    background-color: transparent;
    top: -42px !important;
  }
  .revocation-color {
    color: var(--text-des-color);
  }
}
// deep
::v-deep .el-step.is-vertical .el-step__main {
  padding-left: 15px;
  padding-top: 5px;
}
::v-deep .el-dialog__body {
  padding: 0;
}
::v-deep .el-dialog__body {
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
  ::v-deep .el-step__icon-inner {
    display: none;
  }
  // 完成后步骤样式
  ::v-deep .el-step__title.is-finish {
    color: var(--text-color);
  }
  ::v-deep .el-step__head.is-finish {
    .el-step__icon.is-text {
      border-radius: 50%;
      border: 6px solid #396fff !important;
      border-color: inherit;
      background: #fff;
    }
  }
  //未完成步骤样式
  ::v-deep .el-step__title.is-process {
    font-weight: 400;
  }
  ::v-deep .el-step__head.is-process {
    .el-step__icon.is-text {
      border-radius: 50%;
      border-color: inherit;
      background: rgba(213, 217, 222, 1);
      border: none;
    }
  }
  ::v-deep .el-step__head.is-wait {
    .el-step__icon.is-text {
      border-radius: 50%;
      border-color: inherit;
      background: #d6d6d6;
      border: none;
    }
  }
  // 未完成步骤右侧文字样式
  ::v-deep .el-step__title.is-wait,
  ::v-deep .el-step__title.is-process {
    color: var(--text-des-color);
  }
  ::v-deep .el-step__icon {
    width: 18px;
    height: 18px;
    margin-left: 3px;
  }
  ::v-deep .el-step.is-vertical .el-step__line {
    top: 36px;
    bottom: 20px;
  }

  ::v-deep .el-input--suffix {
    width: 309px;
    height: 32px;
  }
  ::v-deep .el-input__inner {
    height: 32px;
  }
  ::v-deep .el-input__icon {
    line-height: 30px;
  }
  ::v-deep .step-username {
    .el-step:last-of-type .el-step__line {
      display: block;
    }
    ::v-deep .el-step__line-inner {
      height: 44px;
    }
  }
}

::v-deep .el-dialog__header {
  padding: 0 0 0 20px;
}
.userinfo-customer-dialog {
  ::v-deep .el-dialog__header {
    background: #f2f6f9;
    padding: 0;
    border-bottom: #efefef solid 1px;
    .userinfo-customer-dialog-header {
      // background: #F8F8F8;
      background: #f2f6f9;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      color: var(--text-color);
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
  ::v-deep .el-dialog__body {
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
  ::v-deep .el-dialog__footer {
    border-top: #f5f5f5 solid 1px;
    padding: 20px;
    .el-button {
      width: 100px;
      text-align: center;
      font-size: 14px;
    }
  }
}
::v-deep .el-step.is-vertical .el-step__head {
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
