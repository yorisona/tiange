/**
 * 卡片组件 - 容器
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-03-08 13:25:30
 */
import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from '@vue/composition-api';
import type { PropType, SetupContext } from '@vue/composition-api';
import lodash from '@/utils/lodash/custom';

const { debounce } = lodash;

/** 监控并反馈区块DOMRect数据的相关逻辑 */
const useBlockRect = (ctx: SetupContext) => {
  /** 区块引用 */
  const blockRef = ref<null | HTMLDivElement>(null);

  /** resize事件回调函数 */
  const onResize = () => {
    if (blockRef.value !== null) {
      const rect = blockRef.value.getBoundingClientRect();
      ctx.emit('rect:update', rect);
    }
  };

  const onResizeDebounce = debounce(onResize, 200);

  watch(
    () => blockRef.value,
    next => {
      if (next !== null) {
        // 初始化
        onResizeDebounce();
      }
    },
  );

  onMounted(() => {
    // 添加 resize 事件监听
    window.addEventListener('resize', onResizeDebounce);
  });

  onBeforeUnmount(() => {
    // 移除 resize 事件监听
    window.removeEventListener('resize', onResizeDebounce);
  });

  return { blockRef };
};

export default defineComponent({
  name: 'TgCard',
  props: {
    /** 标题 */
    title: {
      type: String,
    },
    /** 高度 */
    height: {
      type: [Number, String],
    },
    /** 宽度 */
    width: {
      type: Number,
    },
    titleSize: {
      type: String as PropType<'default' | 'small'>,
      default: 'default',
    },
    padding: {
      type: [Number, Array] as PropType<number | number[]>,
      default: () => [0, 16, 0, 16],
    },
    /** 内容区容器自定义样式类名 */
    bodyClass: {
      type: String,
      default: '',
    },
    /**
     * 用于辅助控制(纵向)滚动条出现在卡片容器内部
     */
    overflowInBody: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const id = ref(0);
    const loading = ref(false);

    return {
      id,
      loading,
      ...useBlockRect(ctx),
    };
  },
  render() {
    const children = [];
    const title: string = this.title ?? '';

    const paddingList = Array.isArray(this.padding)
      ? this.padding
      : [this.padding, this.padding, this.padding, this.padding];

    const padding = paddingList.length === 2 ? [...paddingList, ...paddingList] : paddingList;

    const style = {
      ...(this.height
        ? typeof this.height === 'number'
          ? { height: `${this.height}px` }
          : { height: this.height }
        : {}),
      ...(this.width ? { width: `${this.width}px` } : {}),
      padding: padding.map(el => `${el}px`).join(' '),
    };

    if (this.$slots.title !== undefined) {
      children.push(h('div', { class: ['tg-card-hd'] }, [this.$slots.title]));
    } else if (title !== '') {
      children.push(h('div', { class: ['tg-card-hd'] }, [title]));
    }

    return h(
      'div',
      {
        class: ['tg-card', this.overflowInBody ? 'inner-overflow' : ''],
        style,
        ref: 'blockRef',
      },
      [...children, h('div', { class: ['tg-card-bd', this.bodyClass] }, [this.$slots.default])],
    );
  },
});
