<template>
  <el-dialog
    class="tg-dialog-classic tg-dialog-vcenter-new tg-write-off-confirm-dialog"
    :visible="visible"
    :close-on-click-modal="false"
    @close="close"
    width="440px"
  >
    <template #title>单据冲销</template>
    <div style="padding: 24px">
      <div class="star">冲销原因</div>
      <div style="margin-top: 7px">
        <el-input
          type="textarea"
          placeholder="请输入冲销原因"
          v-model="reverse_reason"
          clearable
          :maxlength="100"
          show-word-limit
        />
      </div>
      <template v-if="related_receive_ref">
        <div class="mgt-12 star">是否同时冲销实收记录？</div>
        <div style="margin-top: 7px">
          <el-select v-model="reverseReceive" size="mini" style="width: 100%">
            <el-option label="冲销实收记录" :value="true"></el-option>
            <el-option label="不冲销实收记录" :value="false"></el-option>
          </el-select>
        </div>
      </template>
    </div>
    <template #footer>
      <tg-button @click="close">取消</tg-button>
      <tg-button type="primary" @click="onConfirm" :disabled="isConfirmButtonDisabled"
        >保存</tg-button
      >
    </template>
  </el-dialog>
</template>

<script src="./reverseOrder.ts"></script>

<style lang="less">
.tg-write-off-confirm-dialog {
  .star {
    color: var(--text-second-color);
    font-size: 12px;
    &::before {
      content: '*';
      color: #ec4141;
    }
  }

  .el-textarea > textarea {
    width: 392px;
    height: 110px;
    font-size: 12px;
    color: var(--text-color);
    resize: none;
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
