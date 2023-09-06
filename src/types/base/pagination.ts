/**
 * 分页相关
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-10 09:49:54
 */

/**
 * 分页参数
 * @prop {number} page_num 当前页
 * @prop {number} num 页长
 */
export interface PaginationParams {
  /** 当前页 */
  page_num?: number;
  /** 页长 */
  num?: number;
}
