/**
 * 按钮尺寸
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-29 11:04:59
 */
export enum ButtonSize {
  /** 标准 */
  default = 'default',
  /** 小 */
  small = 'small',
  /** 大 */
  large = 'large',
  /** 迷你 */
  mini = 'mini',
}

/**
 * 按钮类型(用途和配色)
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-29 11:12:58
 */
export enum ButtonType {
  /** 默认/次要的 */
  default = 'default',
  /** 首要的 */
  primary = 'primary',
  /** 正向 */
  positive = 'primary',
  /** 反向 */
  negative = 'negative',
  /** 链接(特殊) */
  link = 'link',
}

/**
 * 按钮图标
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-29 11:56:24
 */
export type ButtonIcons =
  | 'ico-arrow-left'
  | 'ico-arrow-right'
  | 'ico-arrow-down'
  | 'ico-arrow-up'
  | 'ico-edit-lite'
  | 'ico-btn-export'
  | 'ico-btn-upload'
  | 'ico-btn-delete'
  | 'ico-btn-add';
