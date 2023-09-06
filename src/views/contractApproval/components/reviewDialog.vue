<style lang="scss" scoped>
@import '@/styles/vars.scss';
$color-primary: var(--theme-color);
#review-dialog {
  /deep/ .el-dialog__header {
    text-align: left !important;
  }
  ::v-deep .el-radio__inner {
    width: 24px;
    height: 24px;
  }
  ::v-deep .el-dialog__header {
    background-color: #f6f6f6;
    margin: 0;
    .title {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: var(--text-color);
    }
    .el-dialog__headerbtn {
      top: 12px;
      font-size: 24px;
      .el-dialog__close {
        color: var(--text-third-color) !important;
      }
    }
  }
  ::v-deep .el-dialog__body {
    padding: 40px;
    .review-main {
      .contract-info {
        background: #f6f6f6;
        border-radius: 10px;
        padding: 20px 50px;
        p {
          line-height: 40px;
          .contract-number {
            color: var(--text-color);
          }
          .status-dot {
            em {
              display: inline-block;
              width: 5px;
              height: 5px;
              border-radius: 50%;
              vertical-align: middle;
              margin-right: 5px;
            }
            &.status-dot-1 {
              em {
                background-color: #ff9434;
              }
            }
            &.status-dot-2 {
              color: $color-primary;
              em {
                background-color: $color-primary;
              }
            }
            &.status-dot-3 {
              color: #f34b60;
              em {
                background-color: #f34b60;
              }
            }
            &.status-dot-4 {
              color: #f34b60;
              em {
                background-color: #f34b60;
              }
            }
          }
        }
      }
      .review-radio {
        text-align: center;
        margin: 20px 0 10px;
      }
      .approve-comment {
        margin-top: 20px;
        border-radius: 10px;
        textarea {
          border-radius: 10px;
        }
      }
    }
  }
  ::v-deep .el-dialog__footer {
    padding: 20px 20px 10px;
    .footer {
      .el-button {
        padding: 8px 20px;
        &.save-btn {
          background-color: #396fff;
          color: #fff;
        }
      }
    }
  }
}
</style>

<template>
  <div id="review-dialog">
    <el-dialog
      :visible="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="460px"
      @close="handleCancel"
    >
      <template #title>
        <div class="title">合同附件审核</div>
      </template>
      <div class="review-main">
        <div v-if="attachmentInfo" class="contract-info">
          <p>
            合同编号：<span class="contract-number">{{
              attachmentInfo.contract_info.contract_uid
            }}</span>
          </p>
          <p>
            合同状态：<span
              :class="`status-dot ${
                'status-dot-' + attachmentInfo.contract_annex_info.contract_annex_status
              }`"
              ><em></em>{{ attachmentInfo.contract_annex_info.contract_annex_status_str }}</span
            >
          </p>
        </div>
        <div class="review-radio">
          <el-radio-group v-model="approve_status">
            <el-radio :label="2">通过</el-radio>
            <el-radio :label="3">拒绝</el-radio>
          </el-radio-group>
        </div>
        <el-input
          v-show="approve_status === 3"
          class="approve-comment"
          type="textarea"
          placeholder="请输入拒绝原因，不超出100个字"
          v-model="comment"
          maxlength="100"
          show-word-limit
          :rows="3"
        ></el-input>
      </div>
      <template #footer>
        <div class="footer">
          <el-button class="big-button" size="medium" @click="handleCancel">取消</el-button>
          <el-button
            class="save-btn big-button"
            size="medium"
            :loading="loading"
            @click="handleSubmitSave"
            >确定</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { approveContractAnnex } from '@/api/customer';

export default {
  name: 'ReviewDialog',
  data() {
    return {
      dialogVisible: false,
      approve_status: undefined,
      id: null,
      attachmentInfo: null,
      comment: '',
      loading: false,
    };
  },
  methods: {
    // 显示审核弹窗，提供给父组件使用，勿删
    show(info) {
      this.approve_status = info.contract_status;

      this.attachmentInfo = info;
      this.id = info.contract_annex_info.id;
      this.dialogVisible = true;
    },
    // 提交审核
    handleSubmitSave() {
      if (!this.approve_status || this.approve_status === 1) {
        this.$message({
          type: 'warning',
          message: '请选择审核的状态',
          duration: 2000,
          showClose: true,
        });
        return false;
      }
      this.loading = true;
      approveContractAnnex({
        approve_status: this.approve_status,
        comment: this.approve_status === 3 ? this.comment : '',
        id: this.id,
      })
        .then(res => {
          if (res.data.success) {
            // 触发审核完成事件，通知父组件更新状态
            this.$emit('approved', this.attachmentInfo);
            this.dialogVisible = false;
            this.comment = '';
          }
          this.$message({
            type: res.data.success ? 'success' : 'warning',
            message: res.data.message,
            duration: 2000,
            showClose: true,
          });
          this.loading = false;
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '合同审核失败，稍后重试',
            duration: 2000,
            showClose: true,
          });
          console.log(error.message);
          this.loading = false;
        });
    },
    // 取消
    handleCancel() {
      this.dialogVisible = false;
      this.approve_status = undefined;
      this.id = null;
      this.attachmentInfo = null;
      this.comment = '';
    },
  },
};
</script>
