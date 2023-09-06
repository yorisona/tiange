<template>
  <div class="icon-con">
    <span class="iconfont" :class="iconTag"></span>
    <slot></slot>
  </div>
</template>

<script>
import '../../assets/iconfont/gmFont.css';

/**
 * icon图标
 * 只找到 2 处引用考虑删除
 * */
export default {
  name: 'iconFontClass',
  props: {
    /** 图标字体，显示名称 */
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    iconTag() {
      return `icon-${this.name}`;
    },
  },
};
</script>

<style scoped>
.iconfont {
  font-family: 'iconfont' !important;
  font-size: 2em;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.icon-con {
  display: inline;
}
</style>
