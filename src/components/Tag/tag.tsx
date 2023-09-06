/**
 * 标签
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-03 11:26:25
 */

import { computed, defineComponent, PropType, ref } from '@vue/composition-api';

/** 最长显示，超出默认隐藏 */
const CONTENT_LEN_LIMIT = 12;

export default defineComponent({
  name: 'TgTag',
  props: {
    /** 主题(当前仅含默认主题) */
    theme: {
      type: String as PropType<'default' | 'gray'>,
      default: 'default',
    },
    /** tag 内容 */
    content: {
      type: String,
      required: true,
    },
    /** 最长显示 */
    maxlength: {
      type: Number,
      default: CONTENT_LEN_LIMIT,
    },
  },
  setup(props) {
    const isOutOfLenLimit = computed(() => props.content.length > props.maxlength);
    const isHover = ref(false);

    const text = computed(() =>
      isOutOfLenLimit.value ? props.content.substring(0, props.maxlength) + '...' : props.content,
    );

    const addHoverClass = () => {
      if (isOutOfLenLimit.value) {
        isHover.value = true;
      }
    };

    const removeHoverClass = () => {
      if (isOutOfLenLimit.value) {
        isHover.value = false;
      }
    };

    return {
      addHoverClass,
      isHover,
      isOutOfLenLimit,
      removeHoverClass,
      text,
    };
  },
  render() {
    const tagClass = ['tg-tag', `tg-tag-${this.theme}`, this.isHover ? 'tg-tag-hover' : ''];
    const props = {
      class: tagClass,
      on: {
        mouseenter: this.addHoverClass,
        mouseleave: this.removeHoverClass,
      },
      attrs: {
        'data-content': this.content,
      },
    };

    return <div {...props}>{this.text}</div>;
  },
});
