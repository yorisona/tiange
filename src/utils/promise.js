/**
 * 判断是否Promise
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-17 09:48:05
 */
export function isPromise(value) {
  return (
    !!value &&
    (typeof value === 'object' || typeof value === 'function') &&
    typeof value.then === 'function'
  );
}
