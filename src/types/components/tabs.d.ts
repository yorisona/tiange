/**
 * 选项卡数据
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-09-17 20:56:36
 */
import { ComponentValue } from '../component';

export interface TabHeaderProps<V = ComponentValue> {
  value: V;
  label: string;
  count?: number;
  render?: () => VNode;
}

/**
 * 选项卡数据
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-09-17 20:57:58
 * @prop {string} label
 * @prop {ComponentValue} value
 */
export interface Tab<T = ComponentValue> {
  label: string;
  value: T;
}
