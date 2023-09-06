import { computed, defineComponent, h, PropType } from '@vue/composition-api';
import Decimal from 'decimal.js';
import { Decimal2String } from '@/utils/string';
import { TopCardType } from './top.card';

const SettlementStep2Layout = defineComponent({
  props: {
    /** 总结算金额 */
    amount: {
      type: [String, Object] as PropType<string | Decimal>,
    },
    incomeType: {
      type: Number,
      default: 2,
      required: false,
    },
    /** 顶部高度样式，default: 24, value1/value2: 118 */
    topHeightType: {
      type: String as PropType<TopCardType>,
      default: 'value1',
    },
    // left插槽宽度是否拉伸
    leftItemExpand: {
      type: Boolean,
      default: false,
    },
    leftItemWidth: {
      type: Number,
    },
  },
  setup(props) {
    const final_amount = computed(() =>
      typeof props.amount === 'string'
        ? props.amount
        : Decimal2String(props.amount ?? new Decimal(0)),
    );
    const newincomeType = computed(() => {
      // console.log('props.incomeType==', props.incomeType);
      return props.incomeType || 2;
    });
    return { final_amount, newincomeType };
  },
  render() {
    const hasCenter = this.$slots.center !== undefined;
    const contentNodes: JSX.Element[] = [];

    // contentNodes.push(
    //   <div class="step2-layout-content-top">
    //     <span class="amount-name">总结算金额</span>
    //     <span class="amount-value">￥{this.final_amount}</span>
    //   </div>,
    // );
    let top = 0;
    let middle = 0;
    let bottom = 0;
    let num = 0;

    if (this.$slots.top !== undefined) {
      contentNodes.push(h('div', { class: 'step2-layout-content-top' }, this.$slots.top));
    }
    if (this.$slots.left !== undefined) {
      contentNodes.push(h('div', { class: 'step2-layout-content-left' }, this.$slots.left));
      num += 1;
    }
    if (hasCenter) {
      contentNodes.push(h('div', { class: 'step2-layout-content-center' }, this.$slots.center));
      num += 1;
    }
    if (this.$slots.right !== undefined) {
      contentNodes.push(h('div', { class: 'step2-layout-content-right' }, this.$slots.right));
      num += 1;
    }
    if (this.$slots.bottom !== undefined) {
      contentNodes.push(h('div', { class: 'step2-layout-content-bottom' }, this.$slots.bottom));
    }

    if (this.$props.topHeightType === 'default') {
      top = 24;
      middle = 414;
      bottom = 50;
    } else {
      top = 118;
      middle = 320;
      bottom = 50;
    }
    let gridTemplateColumns: string | undefined = undefined;
    if (num === 1) {
      gridTemplateColumns = this.leftItemExpand
        ? '1fr 0'
        : this.leftItemWidth
        ? `${this.leftItemWidth}px 0`
        : '286px 0';
    } else if (num === 2) {
      gridTemplateColumns = this.leftItemExpand
        ? '1fr 286px'
        : this.leftItemWidth
        ? `${this.leftItemWidth}px 286px`
        : 'repeat(2, 286px)';
    } else if (num === 3) {
      gridTemplateColumns = this.leftItemExpand
        ? '1fr repeat(2, 286px)'
        : this.leftItemWidth
        ? `${this.leftItemWidth}px repeat(2, 286px)`
        : 'repeat(3, 286px)';
    }
    const style = {
      gridTemplateRows: `${top}px ${middle}px ${bottom}px`,
      // this.$props.topHeightType === 'default' ? '24px 414px' : '118px 320px',
      gridTemplateColumns,
      justifyContent: this.leftItemExpand ? undefined : 'center',
      columnGap: num === 1 ? '0' : '18px',
    };

    return (
      <div class="step2-layout">
        <div
          class={[
            'step2-layout-content',
            hasCenter ? 'col-3' : 'col-2',
            this.newincomeType === 1
              ? 'step2-content-one'
              : this.newincomeType === 2
              ? 'step2-content-two'
              : 'step2-content-three',
          ]}
          style={style}
        >
          {contentNodes}
        </div>
        {/*<div class="bottom-footer">{this.$slots.footer}</div>*/}
        <div class="bottom-button-line ">{this.$slots.button}</div>
        {this.$slots.mask}
      </div>
    );
  },
});

export default SettlementStep2Layout;
