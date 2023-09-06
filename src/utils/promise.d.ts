declare module '@/utils/promise' {
  /**
   * 判断是否Promise
   * @author  Jerry <superzcj_001@163.com>
   * @since   2020-10-17 09:48:29
   */
  export function isPromise<T, S>(obj: PromiseLike<T> | S): obj is PromiseLike<T>;
}
