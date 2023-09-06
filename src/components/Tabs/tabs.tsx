/**
 * 选项卡组件
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-23 16:36:03
 */
import { computed, defineComponent, h, PropType, ref, watch } from '@vue/composition-api';
import { ComponentValue } from '@/types/base/component';
import { TabHeaderProps } from '@/types/components/tabs';
import { emptyFunc } from '@/utils/func';

interface TabItemCtx {
  props: {
    tab: TabHeaderProps<ComponentValue>;
    isActive: boolean;
    index: number;
  };
  listeners?: {
    click?: (event?: MouseEvent) => void;
  };
}

/**
 * Tab Item
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-07-09 10:24:11
 */
const TgTabItem = (ctx: TabItemCtx) => {
  const { isActive, index, tab } = ctx.props;
  const tabItemClass = 'tg-tabs-header-tab-item';
  const tabItemActiveClass = `${tabItemClass}-active`;

  const tabItemProps = {
    class: isActive ? [tabItemClass, tabItemActiveClass] : tabItemClass,
    attrs: {
      'data-index': index,
    },
    on: {
      click: ctx.listeners?.click ?? emptyFunc,
    },
  };

  const TgTabItemText = tab.render === undefined ? tab.label : tab.render();

  return <div {...tabItemProps}>{TgTabItemText}</div>;
};

export default defineComponent({
  name: 'TgTabs',
  model: {
    event: 'input',
    prop: 'value',
  },
  props: {
    /** 样式主题 默认line */
    theme: {
      type: String as PropType<'line' | 'normal'>,
      default: 'line',
    },
    /** 当前选中项 */
    value: {
      type: [String, Number] as PropType<ComponentValue>,
    },
    /** 标签数组 */
    tabs: {
      type: Array as PropType<TabHeaderProps<ComponentValue>[]>,
      required: true,
    },
    /** 宽度 inline 为`false` 时会处理成100% */
    width: {
      type: Number,
    },
    /** 高度 默认`50` */
    height: {
      type: Number,
      default: 48,
    },
    /** 是否内联 */
    inline: {
      type: Boolean,
      default: false,
    },
    /** 背景色，默认 `white` */
    background: {
      type: String as PropType<'white' | 'transparent'>,
      default: 'white',
    },
    bottom: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    emptyFunc() {
      // ! do not delete me
      // ! no methods will cause type error in render
    },
  },
  setup(props, ctx) {
    const checked = ref<string | number | undefined>(props.value ?? props.tabs[0].value);
    /**
     * tab item 点击事件回调
     * @author Jerry <superzcj_001@163.com>
     * @since  2020-07-08 23:34:55
     */
    const onTabClick = (tabItem: TabHeaderProps) => {
      const { render: _render, ...rest } = tabItem;

      if (checked.value === tabItem.value) {
        return;
      }

      // checked.value = tabItem.value;
      ctx.emit('input', tabItem.value);
      ctx.emit('change', {
        ...rest,
      });
    };

    // 容器样式类名
    const containerClass = computed(() => {
      const classList = ['tg-tabs'];

      classList.push(`tg-tabs-${props.theme}`);

      if (props.inline) {
        classList.push('tg-tabs-inline');
      }
      if (props.background === 'white') {
        classList.push('bg-white');
      }

      if (props.bottom) {
        classList.push('tg-tabs-bottom-line');
      }

      return classList;
    });

    // 容器样式对象
    const containerStyle = computed<Record<string, any>>(() => {
      if (!props.inline) {
        return {
          width: props.width ? `${props.width}px` : '100%',
        };
      }

      if (props.width) {
        return {
          width: `${props.width}px`,
        };
      }

      return {};
    });

    const height = computed(() => (props.theme === 'normal' ? 40 : props.height));

    // 高度
    const heightStyle = computed<{ height: string }>(() => ({
      height: `${height.value}px`,
      lineHeight: `${height.value}px`,
    }));

    /**
     * 判断是否激活状态
     * @author Jerry <superzcj_001@163.com>
     * @since  2020-07-09 10:26:49
     */
    const isActiveTabItem = (tab: TabHeaderProps) => tab.value === checked.value;

    watch(
      () => props.value,
      (val, prevVal) => {
        if (val !== prevVal) {
          checked.value = val;
        }
      },
    );

    return {
      checked,
      onTabClick,
      containerClass,
      containerStyle,
      heightStyle,
      isActiveTabItem,
    };
  },
  render() {
    const tabs = this.tabs;
    const heightStyle: Record<string, string> = this.heightStyle;

    // 容器 props
    const tabContainerProps: { class: string | string[]; style: Record<string, ComponentValue> } = {
      class: this.containerClass,
      style: this.containerStyle,
    };

    // 选项卡 props
    const tabItemPropsMaker = (tab: TabHeaderProps, index: number) => ({
      props: {
        tab,
        index,
        isActive: this.isActiveTabItem(tab),
      },
      on: {
        click: () => {
          this.onTabClick(tab);
        },
      },
    });

    return (
      <div {...tabContainerProps}>
        <div class="tg-tabs-header" style={heightStyle}>
          <div class="tg-tabs-header-tab-list">
            {tabs
              .map((tab, tabIndex) => tabItemPropsMaker(tab, tabIndex))
              .map(props => (
                <TgTabItem {...props} />
              ))}
          </div>
          {this.$slots.default && <div class="tg-tabs-body">{this.$slots.default}</div>}
        </div>
      </div>
    );
  },
});
