/**
 * 一些工具函数相关的类型
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-07-12 15:48:56
 */
import { VNode } from 'vue';

/**
 * 用于自定义渲染函数返回值的判定
 * ```
 * 渲染函数必须是如下类型
 * (row: DataType, text_only: boolean) => VNode | string
 *
 * 当 text_only(纯文本模式)为true时 返回纯文本内容用于计算长度
 * 否则允许返回 string 或 VNode 用于实际渲染
 * ```
 */
export type TableColumnRenderReturn<TextOnly> = TextOnly extends false
  ? VNode | VNode[] | string
  : string;
