/**
 * 步骤条
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-29 14:12:16
 */
import { VNode } from 'vue';
import { computed, defineComponent } from '@vue/composition-api';
import type { PropType } from '@vue/composition-api';

/**
 * 步骤数据
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-28 13:20:36
 */
export interface Step {
  /** 标题 */
  title: string | (() => VNode | VNode[]);
  /**
   * 描述/内容
   * ```
   * 支持以普通字符串或者JSX形式传入
   * ```
   * @type {string| (()=>VNode|VNode[])}
   */
  description: string | (() => VNode | VNode[]);
}

/**
 * 单个步骤组件
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-28 13:20:42
 */
export const TgStep = defineComponent({
  name: 'TgStep',
  props: {
    /** 标题 */
    title: {
      type: [String, Function] as PropType<string | (() => VNode | VNode[])>,
    },
    /**
     * 描述/内容
     * ```
     * 支持以普通字符串或者JSX形式传入
     * ```
     * @type {string| (()=>VNode|VNode[])}
     */
    description: {
      type: [String, Function] as PropType<string | (() => VNode | VNode[])>,
    },
    /**
     * 状态
     * ```
     * wait    --- 未到达的节点
     * process --- 当前进行中节点
     * finish  --- 已完成节点
     * ```
     */
    status: {
      type: String as PropType<'wait' | 'process' | 'finish'>,
      required: true,
    },
  },
  render() {
    const contentInStepCircle = (() =>
      this.status === 'finish' ? <tg-icon name="ico-right" /> : this.$slots.default?.[0] ?? '')();

    const description =
      typeof this.description === 'string' ? this.description : this.description?.() ?? '';
    const title = typeof this.title === 'string' ? this.title : this.title?.() ?? '';
    return (
      <div class={['tg-step', `tg-${this.status}`]}>
        <div class="tg-step-icon">{contentInStepCircle}</div>
        <div class="tg-step-title">{this.$slots.title ?? title}</div>
        <div class="tg-step-title-line"></div>
        <div class="tg-step-description">{this.$slots.description ?? description}</div>
      </div>
    );
  },
});

/**
 * 步骤条组件
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-28 13:39:24
 */
export const TgSteps = defineComponent({
  name: 'TgSteps',
  props: {
    /** 步骤条数据 */
    steps: Array as PropType<Step[]>,
    /** 当前激活节点索引 */
    active: {
      type: Number,
      default: 0,
    },
    /**
     * 显示方向
     * ```
     * horizontal --- 横向(默认)
     * vertical   --- 纵向
     * ```
     */
    direction: {
      type: String as PropType<'vertical' | 'horizontal'>,
      default: 'horizontal',
    },
    /**
     * 宽度
     * ```
     * 用于控制纵向步骤条宽度, 默认 192
     * ---
     * 横向步骤条不使用该参数，默认撑满一行
     * ```
     */
    width: {
      type: Number,
      default: 192,
    },
    /**
     * 内间距
     * ```
     * 默认 [18, 0, 18, 0]
     * ```
     */
    padding: {
      type: [Number, Array] as PropType<number | number[]>,
      default: () => [18, 0, 18, 0],
    },
  },
  setup(props) {
    /** 经过计算转换的步骤数据 */
    const computedSteps = computed(
      () =>
        props.steps?.map((step, index) => {
          return {
            ...step,
            status: index < props.active ? 'finish' : index > props.active ? 'wait' : 'process',
          };
        }) ?? [],
    );

    /** 是否纵向 */
    const isVertical = computed(() => props.direction === 'vertical');

    /** padding 处理转换成数组 */
    const computedPadding = computed(() => {
      if (Array.isArray(props.padding)) {
        return props.padding;
      } else {
        return [props.padding, props.padding, props.padding, props.padding];
      }
    });

    return { computedSteps, isVertical, computedPadding };
  },
  render() {
    const count = this.$slots.default?.length ?? this.steps?.length ?? 0;
    if (count === 0) {
      return <div>没有任何步骤</div>;
    }

    const props = {
      class: ['tg-steps', this.isVertical ? 'vertical' : ''],
      style: this.isVertical
        ? {
            'grid-template-rows': `repeat(${count}, auto)`,
            width: `${this.width}px`,
            padding: this.computedPadding.map(el => (el === 0 ? el : `${el}px`)).join(' '),
          }
        : {
            'grid-template-columns': `repeat(${count}, 1fr)`,
            padding: this.computedPadding.map(el => (el === 0 ? el : `${el}px`)).join(' '),
          },
    };

    if (this.steps === undefined || this.steps.length === 0) {
      return <div {...props}>{this.$slots.default}</div>;
    }

    return (
      <div {...props}>
        {this.computedSteps.map((step, stepIndex) => (
          <tg-step props={step}>{stepIndex + 1}</tg-step>
        ))}
      </div>
    );
  },
});

export default TgSteps;
