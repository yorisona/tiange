/**
 * 按钮
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-29 10:56:58
 */
import { computed, defineComponent, h, PropType } from '@vue/composition-api';
import { ButtonIcons, ButtonSize, ButtonType } from '@/types/components/button.enum';

export default defineComponent({
  name: 'TgButton',
  props: {
    /** 类型 */
    type: {
      type: String as PropType<ButtonType>,
      default: 'default',
    },
    /** 按钮尺寸 */
    size: {
      type: String as PropType<ButtonSize>,
      default: 'default',
    },
    /** 是否禁用 */
    disabled: {
      type: Boolean,
      default: false,
    },
    /** 图标 */
    icon: {
      type: String as PropType<ButtonIcons>,
    },
    /** 原生type */
    htmlType: {
      default: 'button',
      validator: (value: string) => {
        return ['button', 'submit', 'reset'].includes(value);
      },
    },
  },
  setup(props) {
    const colorClass = computed<string>(() => `tg-btn-${props.type}`);

    const sizeClass = computed<string>(() =>
      props.size === ButtonSize.default ? '' : `tg-btn-${props.size}`,
    );

    return { sizeClass, colorClass };
  },
  render() {
    if (this.type === ButtonType.link) {
      return h(
        'a',
        {
          class: ['tg-btn-link'],
          attrs: { disabled: this.disabled },
          on: {
            click: (event: MouseEvent) => {
              if (!this.disabled) this.$emit('click', event);
            },
          },
        },
        [this.$slots.default],
      );
    }

    const btnProps = {
      class: ['tg-btn', this.colorClass, this.sizeClass, this.icon],
      domProps: {
        type: this.htmlType,
        disabled: this.disabled,
      },
      on: {
        click: (event: MouseEvent) => {
          if (!this.disabled) this.$emit('click', event);
        },
      },
    };

    const nodes = this.icon
      ? [
          h('div', { class: ['tg-btn-content'] }, [
            h('tg-icon', { props: { name: this.icon } }),
            h('span', { class: '' }, [this.$slots.default]),
          ]),
        ]
      : [this.$slots.default];

    return h('button', btnProps, nodes);
  },
});
