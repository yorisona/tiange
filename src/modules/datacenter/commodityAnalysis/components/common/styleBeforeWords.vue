<template>
  <div class="styleBeforeWords" :class="type">
    <slot />
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api';
export default defineComponent({
  name: 'styleBeforeWords',
  props: {
    /* 竖线or圆点 */
    type: {
      type: String,
      default: 'line',
    },
  },
});
</script>
<style lang="less" scoped>
.styleBeforeWords {
  font-weight: 400;
  font-size: 14px;
  color: var(--text-color);
  display: flex;
  align-items: center;
}
.line {
  &::before {
    content: '';
    width: 3px;
    height: 14px;
    background: var(--theme-color);
    border-radius: 1px;
    display: inline-block;
    margin-right: 4px;
  }
}
.dot {
  font-weight: 600;
  font-size: 12px;
  &::before {
    content: '';
    width: 4px;
    height: 4px;
    background: var(--theme-color);
    border-radius: 1px;
    display: inline-block;
    margin-right: 4px;
  }
}
</style>
