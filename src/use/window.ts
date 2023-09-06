/**
 * 窗口
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-12 14:24:31
 */
import { computed, onBeforeUnmount, onMounted, Ref, ref } from '@vue/composition-api';
import { getBodyRect, resize } from '@/utils/dom';

interface WindowRect {
  /** 宽 */
  width: number;
  /** 高 */
  height: number;
}

interface UseWindowRect {
  /** 视口宽高 */
  WindowRect: Ref<WindowRect>;
  /** 是否小屏幕---宽度小于等于1280 */
  isSmallScreen: Ref<boolean>;
  /** 是否大屏幕---宽度大于1280(处理不超过1920) */
  isBigScreen: Ref<boolean>;
}

export const useWindowRect = (): UseWindowRect => {
  const WindowRect = ref<WindowRect>({
    width: 0,
    height: 0,
  });

  const fn = () => {
    WindowRect.value = getBodyRect();
  };

  onMounted(() => {
    window.addEventListener('resize', fn);
    resize();
  });

  onBeforeUnmount(() => {
    window.addEventListener('resize', fn);
  });

  const isSmallScreen = computed(() => WindowRect.value.width < 1920);
  const isBigScreen = computed(() => WindowRect.value.width >= 1920);

  return { WindowRect, isSmallScreen, isBigScreen };
};
