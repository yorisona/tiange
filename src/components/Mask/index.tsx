/**
 * 蒙版组件
 */
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'tg-mask',
  props: {
    /** 是否可见 */
    visible: {
      type: Boolean,
      default: false,
    },
  },
  render() {
    const options = {
      attrs: this.$attrs,
      on: this.$listeners,
      slots: this.$slots,
      style: { display: this.visible ? 'display' : 'none' },
    };

    return (
      <div {...options} class="tg-mask">
        {this.$slots.default}
      </div>
    );
  },
});
