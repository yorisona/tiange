<template>
  <el-dialog
    class="tg-dialog-classic tg-dialog-vcenter-new"
    :visible="visible"
    width="440px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="close"
  >
    <template #title>不通过原因</template>
    <div style="padding: 24px">
      <div class="textarea">
        <el-input
          type="textarea"
          :rows="4"
          :show-word-limit="true"
          :maxlength="100"
          placeholder="请输入不通过原因"
          v-model.trim="refuse_reason"
        />
      </div>
    </div>
    <template #footer>
      <tg-button @click="close">取消</tg-button>
      <tg-button :disabled="refuse_reason === ''" type="primary" @click="onConfirmClick"
        >确定</tg-button
      >
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  setup(props, ctx) {
    const visible = ref(false);
    const refuse_reason = ref('');

    const close = () => {
      visible.value = false;
      refuse_reason.value = '';
    };

    const open = () => {
      visible.value = true;
    };

    const onConfirmClick = () => {
      visible.value = false;
      ctx.emit('refuse', refuse_reason.value);
    };

    return {
      visible,
      refuse_reason,
      open,
      close,
      onConfirmClick,
    };
  },
});
</script>
<style lang="less">
.tg-dialog-vcenter-new {
  textarea {
    color: var(--text-color);
    font-size: 12px;
  }

  textarea::-webkit-input-placeholder {
    color: var(--placeholder-color) !important;
  }

  textarea:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: var(--placeholder-color) !important;
  }

  textarea::-ms-input-placeholder {
    /* Microsoft Edge */
    color: var(--placeholder-color) !important;
  }

  :-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: var(--placeholder-color) !important;
  }

  ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: var(--placeholder-color) !important;
  }
}
</style>
