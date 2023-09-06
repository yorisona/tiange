/**
 * 幽灵按钮
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-13 22:02:39
 */
import { defineComponent, h } from '@vue/composition-api';
import type { PropType } from '@vue/composition-api';
import type { ButtonIcons } from '@/types/components/button.enum';

const button = defineComponent({
  name: 'TgGhostButton',
  props: {
    /** 是否禁用 */
    disabled: {
      type: Boolean,
      default: false,
    },
    /** 图标 */
    icon: {
      type: String as PropType<ButtonIcons>,
      default: 'ico-btn-add',
    },
  },
  render() {
    const btnProps = {
      class: ['tg-ghost-button'],
      domProps: {
        disabled: this.disabled,
      },
      on: {
        click: (event: MouseEvent) => {
          this.$emit('click', event);
        },
      },
    };

    const nodes = this.icon
      ? [
          h('tg-icon', { props: { name: this.icon } }),
          h('span', { class: '' }, [this.$slots.default]),
        ]
      : [this.$slots.default];

    return h('div', btnProps, nodes);
  },
});

export default button;
