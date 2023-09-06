/**
 * 各种选项(select/radio)
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-07 14:14:37
 */
export type Option<T = string | number> = {
  /** 值 */
  value: T;
  /** 名称/标签 */
  label: string;
  /** 分组名称，可用于转换成分组选项用, 对应 OptionsGroup 中的 label */
  group?: string;
};

/**
 * 分组选项
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-07 14:17:30
 */
export type OptionsGroup<T> = {
  /** 分组名称 */
  label: string;
  /** 分组选项列表 */
  options: Option<T>[];
  value?: T;
};
