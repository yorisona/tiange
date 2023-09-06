/**
 * Card组件及其内部表格自适应高度达到固定表头的逻辑
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-11 09:26:26
 */
import { computed, reactive, ref, unref, watch, onUnmounted } from '@vue/composition-api';
import type { ComputedRef, Ref } from '@vue/composition-api';
import Store from '@/store';
import type { ScrollbarSetting, ScrollbarSettingPagename } from '@/store/modules/global';
import { resize } from '@/utils/dom';

interface AutoTHeightOptions {
  /**
   * 设定的补偿值
   * ```
   * 表格所处 Card 容器内除去表格外的元素在y轴(纵向空间)上占据的高度
   * 应当为内部的间距和其它行元素的高度的综合
   * ```
   */
  compensation: number | Ref<number> | ComputedRef<number>;
  /** 首次更新表格高度时候的等待时间 */
  delay?: number;
  /** 除了表格所处容器外其它内容区块高度数组 */
  fixedBlockHeightRefs?: Array<Ref<number> | ComputedRef<number> | number>;
  /** 表格最低显示高度 */
  tableMinHeight?: number;
  /**
   * ```
   * 因为产品经理笔记本屏幕太小
   * 体贴地提供了一个参数关闭自动计算表格高度的功能
   * ```
   * @property true --- 禁用
   * @property false --- 不禁用
   */
  disable?: boolean;
  /**
   * ```
   * 页面名称
   * 用于从全局配置项中查找对应页面的滚动设置
   * 优先级高于 disable 一项(disable是临时方案)
   * ```
   */
  pagename?: ScrollbarSettingPagename;
}

/**
 * Card组件及其内部表格自适应高度达到固定表头的逻辑
 * ``` html
 * <!-- 给出两个值 tableHeight 和 onRectUpdate -->
 * <!-- tableHeight 传给表格的 height -->
 * <!-- onRectUpdate 监听表格所处Card容器的 rect:update 事件 -->
 * <tg-card @rect:update="onRectUpdate">
 *		<el-table v-bind="tableProps" />
 * </tg-card>
 * ```
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-11 09:26:26
 * @param   {AutoTHeightOptions} options
 */
const useAutoTableHeightInCard = (options: AutoTHeightOptions) => {
  const scrollbarSetting = computed<ScrollbarSetting[]>(
    () => Store.getters['global/scrollbarSetting'],
  );

  const disable = computed(() => {
    if (options.pagename !== undefined) {
      // 工作区滚动虚等同禁用此优化效果
      return scrollbarSetting.value.find(el => el.key === options.pagename)?.value === true
        ? false
        : true;
    } else {
      return options.disable ?? false;
    }
  });

  /**
   * 表格所处卡片容器的高度
   */
  const cardHeight = computed(() => {
    const height = (options.fixedBlockHeightRefs ?? [])
      .map(el => unref(el))
      .reduce((acc, cur) => unref(acc) + unref(cur), 0);

    return disable.value ? 'max-content' : `calc(100vh - ${unref(height) + 56 + 36}px)`;
  });

  /**
   * 表格所处卡片容器 flex 设置类名
   * @author  Jerry <jerry.hz.china@gmail.com>
   * @since   2021-05-17 20:57:48
   */
  const cardFlexClass = computed(() => (disable.value ? 'flex-auto' : 'flex-auto'));

  /** 表格所处卡片的滚动设置和高度设置 */
  const cardProps = computed(() => {
    return {
      height: cardHeight.value,
      overflowInBody: disable.value ? false : true,
    };
  });

  /**
   * 表格所处容器高度
   */
  const rectHeight = ref(0);

  /**
   * 表格高度
   * ```
   * 表格所处 Card 容器高度 (DOMRect.height)
   * 和其内部除表格外的元素在y轴 (纵向空间) 上占据的高度计算得出 (options.compensation)
   * 计算得出
   * tableHeight = DOMRect.height - options.compensation
   * ```
   */
  const tableProps = computed(() =>
    disable.value
      ? {}
      : {
          height: Math.max(
            rectHeight.value - unref(unref(options.compensation)),
            options.tableMinHeight ?? 0,
          ),
        },
  );

  /**
   * 更新高度
   * ```
   * 表格所处 Card 容器高度 (DOMRect.height)
   * 和其内部除表格外的元素在y轴 (纵向空间) 上占据的高度计算得出 (options.compensation)
   * 计算得出
   * tableHeight = DOMRect.height - options.compensation
   * ```
   * @param {number} height 高度
   */
  const updateRectHeight = disable.value
    ? () => void 0
    : (height: number) => {
        if (rectHeight.value !== height) {
          rectHeight.value = height;
          resize();
        }
      };

  /**
   * 容器矩形块更新回调
   * ```
   * 主要取用 DOMRect 内的 height 数据
   * ```
   * @param {DOMRect} rect 更新后的容器矩形块数据
   */
  const onRectUpdate = disable.value
    ? () => void 0
    : (rect: DOMRect) => {
        if (rectHeight.value === 0) {
          setTimeout(() => {
            updateRectHeight(rect.height);
          }, options.delay ?? 1200);
        } else {
          updateRectHeight(rect.height);
        }
      };

  return {
    cardHeight,
    tableProps,
    onRectUpdate,
    rectHeight,
    cardFlexClass,
    cardProps,
  };
};

export const useWatchHeight = (tableBox: Ref<HTMLElement>, correct = 0) => {
  const height = ref<number | string>('100%');
  const update = () => {
    if (!tableBox.value) return;
    if (location.href !== '') return;
    const execheight = tableBox.value.clientHeight - correct;
    height.value = execheight;
  };
  onUnmounted(() => {
    window.removeEventListener('resize', resize);
  });
  const resize = () => {
    update();
  };

  watch(() => tableBox.value, update);
  window.addEventListener('resize', resize);
  if (tableBox.value) {
    update();
  }

  return reactive({
    height,
    update,
  });
};

export default useAutoTableHeightInCard;
