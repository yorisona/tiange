<template>
  <el-dialog
    top="25vh"
    append-to-body
    width="28%"
    custom-class="dialog-min-width-tip"
    class="gm-message"
    title=""
    :visible.sync="visible"
  >
    <p class="message-icon">
      <i :class="`msg-${type}`"></i>
    </p>
    <p class="message-content">{{ content }}</p>
    <p v-show="showBtn" class="message-btn">
      <el-button size="small" type="info" @click="closeDialog">{{
        submutConfig.infoText
      }}</el-button>
      <el-button
        v-show="submutConfig.visible"
        size="small"
        type="primary"
        @click="handleSbumutClick"
        >{{ submutConfig.primaryText }}</el-button
      >
    </p>
  </el-dialog>
</template>

<script>
export default {
  name: 'gmMessage',
  data() {
    return {
      content: '',
      duration: 1400,
      visible: false,
      type: 'success',
      showBtn: false,
      submutConfig: {
        visible: false,
        primaryText: '确定',
        infoText: '我知道了',
        callback: () => {
          // do nth
        },
      },
    };
  },
  mounted() {
    if (this.duration > 0) {
      this.closeDialog();
    }
  },
  methods: {
    closeDialog() {
      setTimeout(() => {
        this.visible = false;
      }, this.duration);
    },
    // 点击确定回调
    handleSbumutClick() {
      this.submutConfig.callback();
      this.visible = false;
    },
  },
};
</script>
<style lang="less">
.gm-message {
  .el-dialog__header {
    background: #fff;
    padding: 0;
    .el-dialog__headerbtn .el-dialog__close {
      color: var(--text-third-color) !important;
      font-size: 24px;
      &:hover {
        color: var(--text-third-color) !important;
      }
    }
  }
  .el-dialog__body {
    padding-top: 0;
    .message-icon {
      i {
        display: inline-block;
        width: 118px;
        height: 105px;
      }
      .msg-success {
        background: url('~@/assets/images/zb_icon_success.png') no-repeat;
      }
      .msg-tip {
        background: url('~@/assets/images/zb_icon_warning.png') no-repeat;
      }
    }
  }
  p {
    text-align: center;
  }
  // .message-icon {
  //   i {
  //     display: inline-block;
  //     width: 37px;
  //     height: 36px;
  //   }
  //   .msg-success {
  //     background: url(../../assets/img/star_info_sprite1.png) -61px -8px;
  //   }
  //   .msg-tip {
  //     background: url(../../assets/img/delete_icon1.png) no-repeat;
  //   }
  // }
  .message-content {
    margin-top: 14px;
    color: #666;
    font-size: 16px;
  }
  .message-btn {
    margin-top: 14px;
  }
  .el-dialog__body {
    padding-bottom: 20px;
    background: #fff;
    border-radius: 10px;
  }
}
</style>
