<template>
  <div style="line-height: 100%; text-align: left">
    <div
      class="title"
      :style="{
        fontSize: titleFontNum + 'px',
        color: titleColorStr,
        fontWeight: titleFontNum === 12 ? '600' : '400',
      }"
    >
      <span
        :style="{
          height: titleFontNum + 'px',
          top: (20 - titleFontNum) / 2 + 'px',
        }"
      ></span
      >{{ titleStr }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'emptyCommon',
  props: {
    title: {
      default: '',
      type: String,
      required: false,
    },
    titleFont: {
      default: 12,
      type: Number,
      required: false,
    },
    titleColor: {
      default: 'var(--text-color)',
      type: String,
      required: false,
    },
  },
  data() {
    return {
      titleStr: '',
      titleColorStr: '',
      titleFontNum: 12,
    };
  },
  created() {
    this.titleStr = this.title || this.titleStr;
    this.titleFontNum = this.titleFont || this.titleFontNum;
    this.titleColorStr = this.titleColor || this.titleColorStr;
  },
};
</script>
<style lang="less" scoped>
.title {
  font-size: 14px;
  height: 20px;
  line-height: 20px;
  padding-left: 12px;
  color: var(--text-color);
  font-weight: 400;
  border-left: 0 solid var(--theme-color);
  margin-right: 18px;
  position: relative;
  margin-left: -3px;
  & > span {
    position: absolute;
    display: inline-block;
    width: 3px;
    height: 12px;
    background: var(--theme-color);
    left: 3px;
    top: 4px;
    border-radius: 1px;
  }
}
</style>
