/**
 * 组件相关类型
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-07-29 23:08:06
 */

/**
 * 组件值类型
 * 常见为string
 * 个别需要组合其它类型
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-07-29 23:09:14
 */
export type ComponentValue<T = string | number> = string | T;

export type StringBasedValue<T> = ComponentValue<T>;

/**
 * CSS Style 数值类型
 * 单数值 / width & height / top & right & bottom & left
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-07-31 18:19:47
 */
export type StyleNumber<T = ComponentValue> = T | [T, T] | [T, T, T, T];

/**
 * CSS Style 数值类型
 * 弱化版本，不限制数组元素数量
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-08-03 09:49:24
 */
export type WeakStyleNumber<T = ComponentValue> = T | T[];

/**
 * CSS Style 数值类型数组
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-08-03 09:59:36
 */
export type StyleNumberList<T = ComponentValue> = [T, T] | [T, T, T, T];
