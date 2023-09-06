/**
 * 浏览器相关
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-10 22:36:02
 */

/**
 * 判断是否为 Chrome 并返回其大版本号
 * 非 Chrome 返回 false
 * 非严谨判断，主要用来处理 360等套壳浏览器
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-10 22:38:29
 */
export const getChromeVersion = () => {
  const result = /Chrome\/(\d+)/giu.exec(window.navigator.userAgent);

  if (result === null) {
    return false;
  } else {
    const [_, version] = result;
    return parseInt(version, 10);
  }
};
