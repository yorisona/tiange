/**
 * 工作台 枚举
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-17 13:34:18
 */

/**
 * 审批类型
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-17 13:36:04
 * @prop {number} loan 1---用款申请
 * @prop {number} refund 2---退款申请
 * @prop {number} advance 3---垫款申请
 * @prop {number} invoicing 4---开票申请
 * * @prop {number} customer 4---客户结算单
 * * @prop {number} supplier 4---供应商结算单
 */
export enum APPROVAL_TYPE {
  /** 用款申请 */
  loan = 1,
  /** 退款申请 */
  refund = 2,
  /** 垫款申请 */
  advance = 3,
  /** 开票申请 */
  invoicing = 4,
  /** 客户结算单 */
  customer = 9,
  /** 供应商结算单 */
  supplier = 10,
  /** 发票作废申请 */
  void = 11,
  /** 开红票申请 */
  red = 12,
  /** 用印申请 */
  use_seal = 13,
  /** 立项审批 **/
  project_approval = 14,
  /** 自动客户结算单 **/
  automatic_customer = 15,
  /** 自动供应商结算单 **/
  automatic_supplier = 16,
  /** 项目终止审批申请 **/
  project_end = 17,
  /** 固定资产审批 */
  asset_scrapped = 18,
}
