/**
 * @description 替代tsx中的v-if TODO: 未完成
 */

import { defineComponent, h } from '@vue/composition-api';
export default defineComponent({
  name: 'TgIf',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    return {};
  },
  render() {
    const { value, $slots } = this;
    if (value) {
      if ($slots?.['default'])
        return <fragemnts>{this.$slots.default && this.$slots.default[0]}</fragemnts>;
    } else {
      if ($slots?.['default'] && $slots?.['default']?.length > 1)
        return <fragemnts>{this.$slots.default && this.$slots.default[1]}</fragemnts>;
    }
    return <fragments></fragments>;
  },
});
