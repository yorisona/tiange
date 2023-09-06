/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-08-07 15:42:58
 */
/**
 * 成本结算 - 步骤二布局组件
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-03 18:13:12
 */

import { computed, defineComponent, h, PropType } from '@vue/composition-api';
import Decimal from 'decimal.js';
import { Decimal2String } from '@/utils/string';

import { TopCardType } from './top.card';

const SettlementCostStep2Layout = defineComponent({
  props: {
    /** 总结算金额 */
    amount: {
      type: [String, Object] as PropType<string | Decimal>,
    },
    /** 顶部高度样式，default: 24, value1/value2: 118 */
    topHeightType: {
      type: String as PropType<TopCardType>,
      default: 'value1',
    },
    leftItemWidth: {
      type: Number,
    },
    douyinLiveSelf: {
      type: Boolean,
      default: false,
    },
    douyinS2b2cSelf: {
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
    const douyin_live_self = computed(() => props.douyinLiveSelf);
    return { douyin_live_self, final_amount };
  },
  render() {
    const contentNodes: JSX.Element[] = [];

    // contentNodes.push(
    //   <div class="step2-cost-layout-content-top">
    //     <span class="amount-name">总结算金额</span>
    //     <span class="amount-value">￥{this.final_amount}</span>
    //   </div>,
    // );
    let top = 0;
    let middle = 0;
    let bottom = 0;
    let num = 0;
    const left = this.leftItemWidth ?? 0;
    if (this.$slots.top !== undefined) {
      contentNodes.push(h('div', { class: 'step2-cost-layout-content-top' }, this.$slots.top));
    }
    if (this.$slots.left !== undefined) {
      contentNodes.push(h('div', { class: 'step2-cost-layout-content-left' }, this.$slots.left));
      num += 1;
    }
    if (this.$slots.right !== undefined) {
      contentNodes.push(h('div', { class: 'step2-cost-layout-content-right' }, this.$slots.right));
      num += 1;
    }
    if (this.$slots.bottom !== undefined) {
      contentNodes.push(
        h('div', { class: 'step2-cost-layout-content-bottom' }, this.$slots.bottom),
      );
    }
    if (this.$slots.files !== undefined) {
      contentNodes.push(h('div', { class: 'step2-layout-content-files' }, this.$slots.files));
    }

    if (this.$props.topHeightType === 'default') {
      if (this.$slots.bottom === undefined) {
        top = 24;
        middle = 470;
        bottom = 0;
      } else {
        top = 24;
        middle = 376;
        bottom = 20;
      }
    } else {
      if (this.$slots.bottom === undefined) {
        top = 118;
        middle = 380;
        if (this.douyinS2b2cSelf) {
          middle = 420;
        }
        bottom = 0;
      } else {
        top = 118;
        middle = 290;
        bottom = 20;
      }
    }
    if (this.douyin_live_self === true) {
      middle = middle < 370 ? 370 : middle;
    }

    const style = {
      gridTemplateRows: bottom > 0 ? `${top}px ${middle}px ${bottom}px` : `${top}px ${middle}px`,
      // this.$props.topHeightType === 'default' ? '24px 414px' : '118px 320px',
      gridTemplateColumns:
        num === 1 ? (left ? `${left}px` : '1fr') : left ? `${left}px 320px` : '714px 320px',
      columnGap: num === 1 ? '0' : '18px',
      justifyContent: num === 1 ? 'center' : undefined,
    };
    return (
      <div class="step2-cost-layout">
        <div
          class={
            this.$slots.bottom !== undefined && this.$slots.file !== undefined
              ? 'container-contact-bottom step2-cost-layout-content'
              : this.$slots.bottom !== undefined
              ? 'container-bottom step2-cost-layout-content'
              : this.$slots.file !== undefined
              ? 'container-contact step2-cost-layout-content'
              : 'step2-cost-layout-content'
          }
          style={style}
        >
          {contentNodes}
        </div>
        <div class="bottom-button-line">{this.$slots.button}</div>
        {this.$slots.mask}
      </div>
    );
  },
});

export default SettlementCostStep2Layout;
