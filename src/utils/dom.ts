/**
 * DOM相关
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-26 17:44:53
 */

/**
 * 触发resize
 * @author Jerry <superzcj_001@163.com>
 * @date   2017-07-28
 */
export const resize = () => {
  const resizeEvent = document.createEvent('Event');
  resizeEvent.initEvent('resize', true, true);
  window.dispatchEvent(resizeEvent);
};

/**
 * 获取body宽高
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-26 17:46:16
 */
export const getBodyRect = () => {
  const { width, height } = document.body.getBoundingClientRect();
  return { width, height };
};
