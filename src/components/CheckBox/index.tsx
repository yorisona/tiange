import { defineComponent } from '@vue/composition-api';

/**
 * KPI组件, 0使用, 0鸡吧用
 */
export default defineComponent({
  name: 'tg-checkbox',
  render() {
    /** attrs: 属性
     * on: 事件
     * slots：插槽 **/
    const options = {
      attrs: this.$attrs,
      on: this.$listeners,
      slots: this.$slots,
    };
    return (
      <el-checkbox {...options} class="tg-checkbox">
        {this.$slots.default}
      </el-checkbox>
    );
  },
});
