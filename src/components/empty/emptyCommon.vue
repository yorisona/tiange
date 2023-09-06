<template>
  <div style="line-height: 100%; text-align: center">
    <img
      src="~@/assets/images/icon-empty.png"
      style="width: 215px; height: 128px; margin-bottom: 10px"
      :style="{ width: imgWidthNum + 'px', height: imgHeightNum + 'px' }"
    />
    <div style="color: var(--text-third-color); font-size: var(--small-font-size)">
      {{ detailstr }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'emptyCommon',
  props: {
    /** 无数据的时候显示文字内容 */
    detailText: {
      default: '暂无数据',
      type: String,
      required: false,
    },
    /** 图片宽度 */
    imgWidth: {
      required: false,
      type: Number,
      default: 215,
    },
    /** 图片高度 */
    imgHeight: {
      required: false,
      type: Number,
      default: 128,
    },
  },
  data() {
    return {
      imgWidthNum: 215,
      imgHeightNum: 128,
    };
  },
  computed: {
    detailstr() {
      return this.detailText ? this.detailText : '暂无数据';
    },
  },
  created() {
    this.imgWidthNum = this.imgWidth ? this.imgWidth : this.imgWidthNum;
    this.imgHeightNum = this.imgHeight ? this.imgHeight : this.imgHeightNum;
  },
};
</script>

<style scoped></style>
