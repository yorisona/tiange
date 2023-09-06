/**
 * 胶囊按钮
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-08 11:52:04
 */
import { defineComponent, h, PropType } from '@vue/composition-api';

export default defineComponent({
  name: 'TgBtnCapsule',
  model: {
    prop: 'value',
    event: 'click',
  },
  props: {
    value: {
      type: String as PropType<'left' | 'right'>,
      required: true,
    },
  },
  setup(props, ctx) {
    return {};
  },
  render() {
    const btns = ['left', 'right'].map(value => {
      return (
        <div
          class={[`btn-capsule-${value}`, this.value === value ? 'active' : undefined]}
          onClick={() => {
            if (this.value === value) return;
            this.$emit('click', value);
          }}
        >
          {this.$slots[value]}
        </div>
      );
    });

    return (
      <div class="btn-capsule">
        {btns[0]}
        <div class="sep"></div>
        {btns[1]}
      </div>
    );
  },
});
