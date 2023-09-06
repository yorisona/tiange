<template>
  <common-dialog
    class="SessionDetails"
    ref="SceneDetailDialog"
    title="场次详情"
    :width="1024"
    @dialog-cancel="handledialogCancel"
    :isAppendToBody="true"
    :isDestroyOnClose="true"
    :isfooter="false"
  >
    <productDetail :pdata="pdata" @delete-scene="deleteSceneHandle" />
  </common-dialog>
</template>

<script>
import productDetail from '../productDetail';
import PubSub from 'pubsub-js';

export default {
  name: 'SceneDetailDialog',
  components: {
    productDetail,
  },
  data() {
    return {
      pdata: null,
    };
  },
  methods: {
    show(data) {
      this.pdata = data;
      this.$refs.SceneDetailDialog.dialogOpen();
      setTimeout(() => {
        PubSub.publish('toProductDetail', data);
      }, 300);
    },
    handledialogCancel() {
      this.$refs.SceneDetailDialog.dialogClose();
    },
    // 删除场次
    deleteSceneHandle() {
      this.$refs.SceneDetailDialog.dialogClose();
      PubSub.publish('addScene', true);
    },
  },
};
</script>

<style lang="scss" scoped>
.SessionDetails {
  /deep/ .el-dialog__header .title {
    color: var(--text-color);
    font-size: 14px;
    padding-left: 10px;
  }
  /deep/ .el-dialog__header {
    text-align: left !important;
  }
}
/deep/ .el-dialog__body {
  background: #f2f6f9;
}
/deep/ .title-left {
  .display_none {
    display: none;
  }
  i {
    display: none;
  }
  .create-left {
    position: absolute;
    top: -43px;
    left: 80px;
  }
}
</style>
