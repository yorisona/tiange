/**
 * 营销业务-项目管理
 * @author  tingzhu <tingzhu@goumee.com>
 * @since   2021-04-08 13:10:00
 */

// 查询成本
export const QUERY_COST = '/api/coop/query_cooperation_cost';
// 查询营销业务/付款列表
export const QUERY_MARKET_PAYABLES = '/api/payable/query_marketing_payables';
// 删除成本
export const DEL_COST = '/api/coop/del_cost';
// 查询业绩
export const QUERY_ACHIEVEMENT = '/api/coop/query_achievement';
// 返回指定kol的所属机构
export const QUERY_KOL_COMPANY = '/api/kol/get_kol_company';
// 批量添加成本
export const ADD_COST_LIST = '/api/coop/add_cost_list';
// 批量添加成本
export const UPDATE_COST = '/api/coop/update_cost';
// 保存返点
export const SAVE_REBATE_COST = '/api/coop/save_rebate_cost';

/** 营销业务 项目列表 (合作列表) */
export const MARKETING_PROJECT_LIST_API = '/api/coop/v2/query_cooperation';

/** 营销业务 项目详情 */
export const MARKETING_PROJECT_DETAIL_API = '/api/coop/get_cooperation/:id/';

/** 营销业务 保存 */
export const MARKETING_PROJECT_SAVE_API = '/api/coop/v2/save_cooperation';

/** 客户列表 */
export const CUSTOMER_LIST_API = '/api/cust/query_customer';

/** 指定AE */
export const MARKETING_PROJECT_SAVE_AE_API = '/api/coop/save_cooperation_ae';

/** 项目 执行结束 操作 */
export const MARKETING_PROJECT_CONFIRM_END_API = '/api/coop/confirm_end_cooperation';

/** 对外申请付款 */
export const SAVE_TRANSFER_APPLY = '/api/approval/save_transfer_apply';

/** 对外申请退款 */
export const SAVE_REFUND_APPLY = '/api/approval/save_refund_apply';

/** 查询可创建付款的成本结算单 */
export const QUERY_SETTLEMENT_FOR_PAYMENT = '/api/approval/query_settlements_for_payment_approval';

/** 发起打款 */
export const CREATE_COST_PAYMENT = '/api/coop/create_cost_payment';
