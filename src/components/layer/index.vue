<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :show-close="false"
    :center="true"
    width="418px"
    class="layer-wrapper"
  >
    <h3 v-if="title" class="layer-title">{{ title }}</h3>
    <p v-if="contentText" class="layer-content">{{ contentText }}</p>
    <span slot="footer" class="layer-footer">
      <el-button class="layer-close-btn" @click="dialogVisible = false">{{
        closeBtnText
      }}</el-button>
      <el-button class="layer-confirm-btn" type="primary" @click="handleConfirmClick">{{
        confirmBtnText
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'Layer',
  props: {
    /** 弹窗标题 */
    title: {
      type: String,
      default: '',
    },
    /** 弹窗显示隐藏 */
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    /** 关闭按钮显示文本 */
    closeBtnText: {
      type: String,
      default: '取消',
    },
    /** 确认按钮显示文本 */
    confirmBtnText: {
      type: String,
      default: '确定',
    },
    /** 内容文本 */
    contentText: {
      type: String,
      default: '',
    },
  },
  methods: {
    /** 点击确认事件 */
    handleConfirmClick() {
      /** 通知父组件确认事件点击 */
      this.$emit('confirmClick');
    },
  },
};
</script>

<style lang="less" scoped>
.layer-wrapper {
  text-align: center;
  /deep/ .el-dialog__header {
    display: none;
    background: yellow;
  }
  /deep/ .el-dialog--center .el-dialog__body {
    padding: 24px 25px;
  }
  .layer-title {
    font-size: 16px;
    color: var(--text-color);
    line-height: 20px;
    text-align: center;
  }
  .layer-close-btn,
  .layer-confirm-btn {
    width: 64px;
    height: 32px;
    line-height: 0px;
  }
  .layer-close-btn {
    margin-right: 9px;
  }
  .layer-confirm-btn {
    margin-left: 9px;
  }
  .layer-content {
    font-size: 14px;
    color: #a4b2c2;
    text-align: center;
  }
}
</style>
