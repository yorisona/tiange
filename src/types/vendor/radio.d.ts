/**
 * 单选
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-17 19:23:54
 */
import { ComponentValue } from '../base/component';

/**
 * 单选按钮选项
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-17 19:25:51
 */
export interface RadioOption<T = ComponentValue> {
  value: T;
  label: string;
  disabled?: boolean;
  border?: boolean;
  size?: 'medium' | 'small' | 'mini';
  name?: string;
}
