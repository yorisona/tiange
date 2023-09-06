/**
 * 基础类型 / 类型工具
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-08-28 16:05:48
 */

/**
 * 字符串数组
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-15 10:19:05
 */
export type StringArray = Array<string>;

/**
 * 让经过复杂转换的类型/接口能被显示出内容
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-08-28 16:12:22
 */
export type PickMe<T> = Pick<T, keyof T>;

/**
 * 将部分属性转为可选
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-08-28 15:49:12
 */
export type Optional<T, OptionalKey extends keyof T> = PickMe<
  Partial<Pick<T, OptionalKey>> & Omit<T, OptionalKey>
>;

/**
 * ```
 * 将 interface/type 的 id 可选化
 * Optional 的特定版本
 * ```
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-08-28 15:52:03
 */
export type OptionalId<T extends { id: number }> = Optional<T, 'id'>;

/**
 * 指定部分属性可选
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-09-11 17:17:07
 */
export type PartialSome<T, K extends keyof T> = { [P in K]?: T[P] | undefined } & Omit<T, K>;
