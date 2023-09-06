/**
 * 可选择的标签组件
 **/
import { defineComponent, h, PropType, ref, watch } from '@vue/composition-api';
import { ComponentValue } from '@/types/base/component';

export default defineComponent({
  name: 'TgLabel',
  props: {
    /** 标签值 */
    value: {
      type: [String, Number] as PropType<ComponentValue>,
      default: '',
    },
    /** 标签名称(文本) */
    label: {
      type: String as PropType<string>,
      default: '',
    },
    /** 是否选中状态 */
    checked: {
      type: Boolean,
    },
  },
  setup(props) {
    // 初始化选中状态
    const isChecked = ref<boolean>(props.checked ?? false);

    /** 同步父组件选中状态变化 */
    watch(
      () => props.checked,
      (val, prevVal) => {
        if (val !== prevVal && val !== undefined) {
          isChecked.value = val;
        }
      },
    );

    return { isChecked };
  },
  render() {
    const labelClass = 'tg-label';
    const labelActiveClass = `${labelClass}-active`;

    return h('div', {
      class: this.isChecked ? [labelClass, labelActiveClass] : labelClass,
      domProps: {
        innerText: this.label,
      },
      on: {
        click: () => {
          this.$emit('click', this.value);
        },
      },
    });
  },
});
