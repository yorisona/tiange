<template>
  <el-dialog
    :visible="dialogVisible"
    :width="width ? `${width}px` : '800px'"
    :close-on-click-modal="ClickModal"
    :close-on-press-escape="false"
    custom-class="common-dialog"
    :modal="ismodal"
    :append-to-body="isAppendToBody"
    @close="handleCancelClick"
    :top="top ? `${top}px` : '15vh'"
  >
    <template #title>
      <div :class="['title', { sub: subtitle && subtitle !== '' }]">
        {{ title }}
        <span v-if="subtitle" class="sub-title">{{ subtitle }}</span>
      </div>
    </template>
    <slot />
    <template #footer>
      <div v-if="isfooter" class="dialog-footer">
        <tg-button class="big-button color-999" @click="handleCancelClick">取 消</tg-button>
        <tg-button
          type="primary"
          class="big-button btn-blue"
          @click="handleSubmitClick"
          :disabled="isAddingEditing"
          >提 交</tg-button
        >
      </div>
      <div v-if="isfooter_upload" class="dialog-footer">
        <tg-button
          type="primary"
          class="big-button btn-blue"
          @click="handleSubmitClick"
          :disabled="isAddingEditing"
          >提 交</tg-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script>
/**
 * 创始人创建的组件, 21处使用,作用未知
 * */
export default {
  name: 'CommonDialog',
  props: [
    /** 是否显示提交按钮 */
    'isfooter_upload',
    /** 标题 */
    'title',
    /** 宽度 */
    'width',
    /** 距离顶部距离 */
    'top',
    /** 是否显示页脚 */
    'isfooter',
    /** 副标题 */
    'subtitle',
    /** 是否需要遮罩层 */
    'ismodal',
    /** 是否插入至 body 元素上 默认false */
    'isAppendToBody',
    /** 废弃 */
    'isDestroyOnClose',
    /** 提交按钮display */
    'isAddingEditing',
  ],
  // computed: {
  //   normalized: function() {
  //     return this.isAddingEditing
  //   }
  // },
  data() {
    return {
      dialogVisible: false,
      ClickModal: false,
      isAddingEditing_copy: this.isAddingEditing,
    };
  },
  methods: {
    // 打开弹窗
    dialogOpen() {
      this.dialogVisible = true;
    },
    // 点击任意区域关闭弹窗
    ClickModel() {
      this.ClickModal = true;
    },
    // 关闭弹窗
    dialogClose() {
      this.dialogVisible = false;
    },
    // 取消按钮
    handleCancelClick() {
      this.dialogClose();
      this.$emit('dialog-cancel');
    },
    // 确定按钮
    handleSubmitClick() {
      this.$emit('dialog-submit');
      // this.isAddingEditing = true;
      this.isAddingEditing_copy = true;
    },
  },
};
</script>

<style lang="less">
.common-dialog {
  border-radius: 10px;
  // background: #f2f6f9;
  .el-dialog__footer {
    text-align: center;
    padding: 14px 0px;
  }
  .el-dialog__header {
    background-color: #f2f6f9;
    padding: 0;
    height: 60px;
    line-height: 57px;

    .title {
      color: var(--text-color);
      font-size: 14px;
      padding-left: 10px;
    }
    .sub {
      float: left;
      // margin-left: 15px;
      .sub-title {
        font-size: 12px;
        font-weight: 400;
        margin-left: 10px;
        color: var(--text-second-color) !important;
      }
    }
    .el-dialog__headerbtn {
      top: 14px;
      font-size: 22px;
      right: 15px;
      .el-dialog__close {
        color: var(--text-third-color) !important;
      }
    }
  }
  .el-dialog__body {
    padding: 0;
    .el-form-item__error {
      padding: 0;
    }
  }
}
</style>
