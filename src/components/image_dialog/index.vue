<template>
  <common-dialog
    ref="ImageDialog"
    :isAppendToBody="true"
    :title="title || '预览图片'"
    :width="1000"
    :isfooter="false"
  >
    <img v-if="!imgsrc_list" :src="`${imgsrc}?Authorization=${getToken()}`" alt class="dis-img" />
    <!-- <span v-if="imgsrc_list">{{imgsrc}}</span>
    <span v-if="imgsrc_list">{{imgsrc_list}}</span>-->

    <p v-if="imgsrc_list && imgsrc_list.length > 0" class="box1">
      <span class="color-3">凭证1:</span>
      <img :src="`${imgsrc_list[0]}?Authorization=${getToken()}`" alt class="dis-img" />
    </p>
    <p v-if="imgsrc_list && imgsrc_list.length > 1" class="box1">
      <span class="color-3">凭证2:</span>
      <img :src="`${imgsrc_list[1]}?Authorization=${getToken()}`" alt class="dis-img" />
    </p>
    <p v-if="imgsrc_list && imgsrc_list.length > 2" class="box1">
      <span class="color-3">凭证3:</span>
      <img :src="`${imgsrc_list[2]}?Authorization=${getToken()}`" alt class="dis-img" />
    </p>
  </common-dialog>
</template>

<script>
import { getToken } from '@/utils/token';
/**
 * 预览凭证的一个组件,应该是一个业务组件,使用较少
 * */
export default {
  name: 'ImageDialog',
  /** title: 图片标题
   * imgsrc: 图片地址
   * imgsrc_list: 图片地址列表 **/
  props: ['title', 'imgsrc', 'imgsrc_list'],
  methods: {
    getToken,
    /** 预览显示事件 */
    show() {
      this.$refs.ImageDialog.dialogOpen();
      // 弹窗点击任意区域关闭
      this.$refs.ImageDialog.ClickModel();
    },
  },
};
</script>

<style lang="less" scoped>
.dis-img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  margin-top: 10px;
  border: 1px solid rgba(232, 236, 238, 1);
}
/deep/ .el-dialog__header {
  margin-bottom: 0px;
}
.box1 {
  background: #fff;
  margin-bottom: 10px;
  border-radius: 10px;
  padding: 20px;
  .color-3 {
    margin-bottom: 10px;
    font-weight: 600;
  }
}
/deep/ .el-dialog__body {
  background: #f2f6f9;
  border-radius: 10px;
}
</style>
