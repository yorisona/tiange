/**
 * element-ui-input扩展
 * 插槽,等功能暂未扩展后期使用请自行扩展,v-model
 * **/
import { defineComponent, PropType } from '@vue/composition-api';
export default defineComponent({
  name: 'el-input-extend',
  props: {
    inputType: {
      type: String as PropType<'price' | 'uint'>,
    },
  },
  methods: {
    formatToPrice(val: string) {
      return val.replace(/[^\d.]/g, '');
    },
  },
  render(h) {
    const { inputType, ...outherAttrs } = this.$attrs;
    const input: any = this.$listeners.input;
    const listeners = {
      ...this.$listeners,
      input: (val: any) => {
        if (input) {
          if (this.inputType === 'price') return input(this.formatToPrice(val));
          else input(val);
        }
      },
    };
    return h(
      'el-input',
      {
        on: listeners,
        attrs: outherAttrs,
      },
      this.$slots.default,
    );
  },
});
