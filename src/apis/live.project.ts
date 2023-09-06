/**
 * 店铺代播 / 项目管理 apis
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-30 11:09:52
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=146&itf=1494
 */

/** 店铺代播 项目列表 */
export const LIVE_PROJECT_LIST_API = '/api/shop_live/query_shop_live_project';
/** 本地生活 项目列表 */
export const LOCAL_LIFE_PROJECT_LIST_API = '/api/shop_live/query_local_life_project';
/** 供应链  */
export const SUPPLY_CHAIN_PROJECT_LIST_API = '/api/shop_live/query_supply_chain_project';

/** 店铺代播 项目详情 */
export const LIVE_PROJECT_DETAIL_API = '/api/shop_live/get_shop_live_project/:id/';
/** 本地生活 项目详情 */
export const LOCAL_LIFE_PROJECT_DETAIL_API = '/api/shop_live/get_local_life_project/:id/';
/** 供应链 项目详情 */
export const SUPPLY_CHAIN_PROJECT_DETAIL_API = '/api/shop_live/get_supply_chain_project/:id/';

/** 店铺代播 保存项目 */
export const LIVE_PROJECT_SAVE_API = '/api/shop_live/save_shop_live_project';

/** 本地生活 保存项目 */
export const LOCAL_LIFE_PROJECT_SAVE_API = '/api/shop_live/save_local_life_project';

/** 供应链 */
export const SUPPLY_CHAIN_PROJECT_SAVE_API = '/api/shop_live/save_supply_chain_project';
/**
 * 店播项目业绩列表
 */
export const QUERY_SHOP_LIVE_ACHIEVEMENT = '/api/shop_live/query_shop_live_achievement';
/**
 * 店播项目业绩列表
 */
export const QUERY_LOCAL_LIFE_ACHIEVEMENT = '/api/shop_live/query_local_life_achievement';
/**
 * 店播项目业绩列表
 * 供应链
 */
export const QUERY_SUPPLY_CHAIN_ACHIEVEMENT = '/api/shop_live/query_supply_chain_achievement';

export const QUERY_ACHIEVEMENT = '/api/common_business/query_achievement';

export const QUERY_MERCHANT_ACHIEVEMENT = '/api/common_business/query_merchant_achievement';
/**
 * 店播项目业绩列表
 */
export const DEL_SHOP_LIVE_ACHIEVEMENT_COMMON =
  '/api/common_business/del_achievement/{achievement_id}/';
/**
 * 店播项目业绩列表-通用业务
 */
export const DEL_SHOP_LIVE_ACHIEVEMENT =
  '/api/shop_live/del_shop_live_achievement/{achievement_id}/';
/**
 * 项目业绩添加
 */
export const SAVE_SHOP_LIVE_ACHIEVEMENT = '/api/shop_live/save_shop_live_achievement';
/**
 * 项目业绩添加
 */
export const SAVE_LOCAL_LIFE_ACHIEVEMENT = '/api/shop_live/save_local_life_achievement';
/**
 * 项目业绩添加
 */
export const SAVE_SUPPLY_CHAIN_ACHIEVEMENT = '/api/shop_live/save_supply_chain_achievement';
/** 通用也饿无-业绩添加 **/
export const SAVE_SHOP_LIVE_ACHIEVEMENT_COMMON = '/api/common_business/save_achievement';
/** 招商结算收款 **/
export const SAVE_SHOP_LIVE_MERCHANT_ACHIEVEMENT =
  '/api/shop_live/save_shop_live_merchant_achievement';

/** 店播：修改已完结项目状态 */
export const CHANGE_SHOP_LIVE_PROJECT_STATUS = '/api/shop_live/change_shop_live_project_status';
/** MCN：修改已完结项目状态 */
export const CHANGE_COMMON_PROJECT_STATUS = '/api/shop_live/change_common_project_status';
/** 营销：修改已完结项目状态 */
export const CHANGE_COOPERATION_STATUS = '/api/shop_live/change_cooperation_status';
