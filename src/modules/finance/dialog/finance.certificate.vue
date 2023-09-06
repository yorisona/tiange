<template>
  <div class="finance-certificate-dialog">
    <el-dialog
      class="tg-dialog-classic"
      :visible="visible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="closeAction"
    >
      <template #title>{{ title }}</template>
      <div class="finance-certificate-img-box">
        <img v-for="(item, index) in imgUrl" :key="index" :src="item" class="img-url" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'FinanceCertificate',
  props: {
    title: {
      type: String,
      default: '收款凭证',
    },
    imgUrl: {
      type: Array,
      default: () => {
        return [];
      },
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeAction() {
      this.$emit('closeFinanceCertificateAction');
    },
  },
};
</script>

<style scoped lang="less">
.finance-certificate-dialog {
  .finance-certificate-img-box {
    max-height: 560px;
    width: 100%;
    overflow-y: scroll;
    .img-url {
      width: 92%;
      border: 1px solid var(--border-line-color);
      border-radius: 4px;
      margin-top: 20px;
      margin-left: 4%;
      margin-bottom: 30px;
    }
  }
}
</style>
