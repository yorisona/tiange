/**
 * 请求相关的一些工具函数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-02 10:55:01
 */

/**
 * 将一个可选参数的表单数据转换成参数
 * ```
 * 表单中类型为 任意类型T或空字符串 空字符串表示无数据
 * 参数类型为 任意类型T或undefined undefined表示无数据
 * ```
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-02 10:58:05
 */
export const form_data_to_optional_params = <T>(param: T | '') =>
  param === '' ? undefined : param;
