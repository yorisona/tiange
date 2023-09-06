/**
 * 收入结算 - 步骤三提交布局组件
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-20 14:30:09
 */
import { computed, defineComponent, h, PropType } from '@vue/composition-api';
import Decimal from 'decimal.js';
import { Decimal2String } from '@/utils/string';

const SettlementStep3Layout = defineComponent({
  props: {
    /** 总结算金额 */
    amount: {
      type: [String, Object] as PropType<string | Decimal>,
    },
    // left插槽宽度是否拉伸
    leftItemExpand: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const final_amount = computed(() =>
      typeof props.amount === 'string'
        ? props.amount
        : Decimal2String(props.amount ?? new Decimal(0)),
    );
    return { final_amount };
  },
  render() {
    const hasCenter = this.$slots.center !== undefined;
    const contentNodes: JSX.Element[] = [];

    // contentNodes.push(
    //   <div class="step3-layout-content-top">
    //     <span class="amount-name">总结算金额</span>
    //     <span class="amount-value">￥{this.final_amount}</span>
    //   </div>,
    // );
    if (this.$slots.top !== undefined) {
      contentNodes.push(h('div', { class: 'step3-layout-content-top' }, this.$slots.top));
    }
    if (this.$slots.left !== undefined) {
      contentNodes.push(h('div', { class: 'step3-layout-content-left' }, this.$slots.left));
    }
    if (hasCenter) {
      contentNodes.push(h('div', { class: 'step3-layout-content-center' }, this.$slots.center));
    }
    if (this.$slots.right !== undefined) {
      contentNodes.push(h('div', { class: 'step3-layout-content-right' }, this.$slots.right));
    }

    if (this.$slots.files !== undefined) {
      contentNodes.push(h('div', { class: 'step3-layout-content-files' }, this.$slots.files));
    }

    return (
      <div class="step3-layout">
        <div
          class={[
            'step3-layout-content',
            hasCenter ? 'col-3' : 'col-2',
            this.leftItemExpand ? 'col-2-mcn' : '',
          ]}
        >
          {contentNodes}
        </div>
        <div class="bottom-button-line">{this.$slots.button}</div>
        {this.$slots.mask}
      </div>
    );
  },
});

export default SettlementStep3Layout;
