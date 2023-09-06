/**
 * 浏览器支持
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-12 23:45:26
 */
import { computed } from '@vue/composition-api';
import { getChromeVersion } from '@/utils/browser';

/**
 * 检测浏览器版本并决定是否应该功能降级
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-12 23:46:20
 */
export const useBrowserFallback = () => {
  const version = getChromeVersion();

  /** 样式相关 Chrome 84 以下需要降级处理, 非 Chrome 或 84 以上不需要降级 */
  const isStyleFallback = computed(() => (version === false ? version : version < 84));

  return { isStyleFallback };
};

/**
 * 检测浏览器版本并决定是否应该功能降级
 * 样式相关 Chrome 84 以下需要降级处理, 非 Chrome 或 84 以上不需要降级
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-12 23:46:20
 */
export const isStyleFallback = () => {
  const version = getChromeVersion();

  return version === false ? version : version < 84;
};
