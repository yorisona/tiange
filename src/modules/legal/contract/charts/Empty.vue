<template>
  <div style="line-height: 100%; text-align: center">
    <img
      src="~@/assets/images/echart-empty.png"
      style="width: 160px; height: 160px; margin-bottom: 10px"
      :style="{ width: imgwidthnum + 'px', height: imgheightnum + 'px' }"
    />
    <!-- <div style="color: #a4b2c2">{{ detailstr }}</div> -->
  </div>
</template>

<script>
export default {
  name: 'emptyCommon',
  props: {
    detailText: {
      default: '暂无数据',
      type: String,
      required: false,
    },
    imgWidth: {
      required: false,
      type: Number,
      default: 160,
    },
    imgHeight: {
      required: false,
      type: Number,
      default: 160,
    },
  },
  data() {
    return {
      // detailstr: '暂无数据',
      imgwidthnum: 235,
      imgheightnum: 128,
    };
  },
  computed: {
    detailstr() {
      return this.detailText ? this.detailText : '暂无数据';
    },
  },
  created() {
    // this.detailstr = this.detailText ? this.detailText : this.detailstr;
    this.imgwidthnum = this.imgWidth ? this.imgWidth : this.imgwidthnum;
    this.imgheightnum = this.imgHeight ? this.imgHeight : this.imgheightnum;
  },
};
</script>

<style scoped></style>
