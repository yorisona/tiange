/*
 * @Author: 肖槿
 * @Date: 2022-04-06 09:58:57
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-05-10 10:37:59
 * @FilePath: \goumee-star-frontend\src\apis\investment.ts
 */
export const SAVE_LIVE_GOODS_V2 = '/api/shop_live/save_live_goods_v2';

// 结算
// 保存招商收入结算基本信息
export const SAVE_MERCHANT_SETTLEMENT_BASE_INFO =
  '/api/settlement/save_merchant_settlement_base_info';
// 保存结算数据
export const SAVE_MERCHANT_SETTLEMENT_DATA = '/api/settlement/save_settlement_data/merchant';
// 招商生成子结算单
export const GEN_SUB_MERCHANT_INCOME_SETTLEMENT =
  '/api/settlement/gen_sub_merchant_income_settlement';

// 招商商品收入结算场次查询接口
export const QUERY_SETTLEMENT_SHOP_LIVE = '/api/shop_live/query_merchant_shop_live';

// 招商结算列表查询接口
export const QUERY_MERCHANT_SETTLEMENTS = '/api/settlement/query_merchant_settlements';

// 删除招商结算
export const DEL_MERCHANT_SETTLEMENT = '/api/settlement/del_merchant_settlement';
// 通过招商结算接口
export const PASS_MERCHANT_SETTLEMENT = '/api/settlement/pass_merchant_settlement';
// 通过S2B2C结算接口
export const PASS_UNITY_SETTLEMENT = '/api/settlement/pass_unity_settlement';
// 不通过招商结算接口
export const REFUND_MERCHANT_SETTLEMENT = '/api/settlement/refuse_merchant_settlement';

// 财务通过招商结算接口
export const APPROVE_MERCHANT_SETTLEMENT_FINANCIAL =
  '/api/settlement/approve_merchant_settlement_financial/:id';
// 财务不通过招商结算接口
export const REFUND_MERCHANT_SETTLEMENT_FINANCIAL =
  '/api/settlement/refuse_merchant_settlement_financial/:id';

// 招商结算退款列表
export const QUERY_MERCHANT_REFUND_LIST = '/api/financial/query_pay_list_v2';

// 招商统一结算
export const LIST_UNITY_SETTLEMENTS = '/api/settlement/list_unity_settlements';

// 创建招商统一结算
export const CREATE_UNITY_SETTLEMENTS = '/api/settlement/create_unity_settlements';

// 财务确认结算
export const CONFIRM_UNITY_SETTLEMENTS = '/api/settlement/confirm_unity_settlements';

// 财务确认结算
export const DELETE_UNITY_SETTLEMENTS = '/api/settlement/delete_unity_settlement';

// 刷新数据
export const REFRESH_UNITY_SETTLEMENTS = '/api/settlement/refresh_unity_settlement';
// 保存提现
