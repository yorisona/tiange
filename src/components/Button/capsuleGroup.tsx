import { defineComponent, h, PropType } from '@vue/composition-api';
/**
 * @description: 胶囊按钮组
 */
export default defineComponent({
  name: 'TgCapsuleGroup',
  model: {
    prop: 'value',
    event: 'change',
  },
  emits: ['change'],
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    /** 选项 */
    options: {
      type: Array as PropType<TG.OptionType[]>,
      required: true,
      default: () => [],
    },
  },
  setup(props, ctx) {
    return {};
  },
  render() {
    const { value: externalVal } = this;
    const btns = this.options.map(({ value, label }) => {
      return (
        <div
          class={[`btn-capsuleGroup_item`]}
          selected={externalVal === value}
          onClick={() => {
            if (externalVal === value) return;
            this.$emit('change', value);
          }}
        >
          {label}
        </div>
      );
    });
    return <div class="btn-capsuleGroup">{btns}</div>;
  },
});
