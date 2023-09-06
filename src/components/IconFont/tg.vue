<template>
  <svg
    class="icon"
    :class="name"
    aria-hidden="true"
    :disabled="disabled"
    @click="onBtnClick"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <use v-bind="use" />
  </svg>
</template>

<script lang="tsx">
/**
 * 图标字体组件
 **/
import { computed, defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'TgIcon',
  props: {
    /** 名称 */
    name: String,
    /** 是否禁用 */
    disabled: {
      type: Boolean,
      default: false,
    },
    /** hover 时切换图标 */
    hoverName: {
      type: String,
      required: false,
    },
  },
  setup(props, ctx) {
    const isHover = ref(false);

    const onMouseenter = () => {
      isHover.value = true;
    };

    const onMouseleave = () => {
      isHover.value = false;
    };

    const finalName = computed(() => (isHover.value ? props.hoverName ?? props.name : props.name));
    /** 图标点击事件 */
    const onBtnClick = (event: MouseEvent) => {
      if (!props.disabled) {
        ctx.emit('click', event);
      }
    };

    const use = computed(() => ({
      'xlink:href': `#${finalName.value}`,
    }));

    return { use, onBtnClick, onMouseenter, onMouseleave };
  },
});
</script>
