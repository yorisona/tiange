/**
 *  单选框
 */
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'tg-radio',
  render() {
    const options = {
      attrs: this.$attrs,
      on: this.$listeners,
      slots: this.$slots,
    };

    return (
      <el-radio {...options} class="tg-radio">
        {this.$slots.default}
      </el-radio>
    );
  },
});
