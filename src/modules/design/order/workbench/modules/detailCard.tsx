import { defineComponent, h } from '@vue/composition-api';
export default defineComponent({
  name: 'detailCard',
  props: {
    /** 标题  */
    title: {
      type: String,
      default: '',
    },
    /** 宽度  */
    cardsStlye: {
      type: Object,
      default: () => ({}),
    },
    headerStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  // setup(props, ctx) {
  // },
  render() {
    const { title } = this;
    const props = {
      style: this.cardsStlye,
    };

    return (
      <el-card {...props} class="box-card">
        <div slot="header" style={this.headerStyle} class="box-header">
          {this.$slots.header || title}
        </div>
        {this.$slots.default}
      </el-card>
    );
  },
});
