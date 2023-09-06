/**
 * 卡片区块
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-28 17:46:33
 */
import { defineComponent, h } from '@vue/composition-api';
import { ElCardCommonProps } from '@/const/ui';

export default defineComponent({
  name: 'TgBlock',
  props: {
    /** 标题 */
    title: {
      type: String,
    },
    /** body 自定义样式类名 */
    bodyClass: {
      type: String,
      default: '',
    },
  },
  render() {
    const nodesProps = { class: ['tg-block-bd', this.bodyClass] };
    const nodes = [<div {...nodesProps}>{this.$slots.default}</div>];

    if (this.title !== undefined) {
      nodes.unshift(<div class="tg-block-hd">{this.title}</div>);
    } else if (this.$slots.title !== undefined) {
      nodes.unshift(<div class="tg-block-hd">{this.$slots.title}</div>);
    }

    const props = { ...ElCardCommonProps.props, ...this.$attrs };

    return h('el-card', { class: 'tg-block', props }, nodes);
  },
});
