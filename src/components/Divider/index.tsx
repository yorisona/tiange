import { defineComponent } from '@vue/composition-api';
/**
 * KPI组件,没使用, 也没几把吊用,考虑删除
 */
export default defineComponent({
  name: 'tg-divider',
  render() {
    /** attrs: 属性
     * direction  设置分割线方向  string  horizontal / vertical  horizontal
     * border-style  设置分隔符样式  string  CSS/border-style  solid
     * content-position  自定义分隔线内容的位置  string  left / right / center
     * on: 事件
     * slots：插槽 **/
    const options = {
      attrs: this.$attrs,
      on: this.$listeners,
      slots: this.$slots,
    };
    return (
      <el-divider {...options} class="tg-divider">
        {this.$slots.default}
      </el-divider>
    );
  },
});
