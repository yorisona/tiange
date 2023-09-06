<!--
 * @Author: 肖槿
 * @Date: 2021-05-20 15:43:10
 * @Description: 弹框
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-05-21 17:21:00
 * @FilePath: \goumee-star-frontend\src\modules\finance\Settlement\components\SettlementDialog\index.vue
-->
<template>
  <div>
    <el-dialog
      class="tg-dialog-classic"
      :visible="visible"
      width="440px"
      top="35vh"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="closeAction"
    >
      <template #title>不通过原因</template>
      <div class="settlement-dialog">
        <div class="textarea">
          <el-input
            type="textarea"
            :rows="4"
            :show-word-limit="true"
            :maxlength="100"
            placeholder="请输入不通过原因"
            v-model="textarea"
          />
        </div>
      </div>
      <template #footer>
        <tg-button class="big-button" @click="visible = false">取 消</tg-button>
        <tg-button :disabled="!textarea" type="primary" @click="confirmHandler">确定</tg-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
export default defineComponent({
  setup(_, ctx) {
    const visible = ref<boolean>(false);
    const textarea = ref<string>('');
    const closeAction = () => {
      visible.value = false;
      textarea.value = '';
    };
    const show = () => {
      visible.value = true;
    };
    const confirmHandler = () => {
      ctx.emit('unpass', textarea.value);
    };
    return {
      visible,
      closeAction,
      show,
      textarea,
      confirmHandler,
    };
  },
});
</script>

<style lang="less">
.settlement-dialog {
  padding: 24px;
  border-color: var(--border-line-color);
  textarea {
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
