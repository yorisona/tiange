/**
 * 通用业务 / 项目管理 apis
 * @author  wuyou <wuyou@goumee.com>
 * @since   2021-05-06 14:45:43
 */

/** 通用业务 项目列表 */
export const COMMON_BUSINESS_PROJECT_LIST_API = '/api/shop_live/query_common_project';

/** 通用业务 项目详情 */
export const COMMON_BUSINESS_PROJECT_DETAIL_API = '/api/shop_live/get_common_project/:id/';

/** 通用业务 保存项目 */
export const COMMON_BUSINESS_PROJECT_SAVE_API = '/api/shop_live/save_common_project';

/** 通用业务 项目付款 应付列表 */
export const COMMON_BUSINESS_QUERY_COMMON_PAYABLES = '/api/payable/query_common_payables';

/** 通用业务 项目付款 实付列表 登记业务or编辑业务 */
export const COMMON_BUSINESS_SAVE_COST = '/api/common_business/save_cost';

/** 通用业务 项目付款 实付列表 */
export const COMMON_BUSINESS_QUERY_COST = '/api/common_business/query_cost';

/** 通用业务 项目付款 实付列表 删除 */
export const COMMON_BUSINESS_DEL_COST = '/api/common_business/del_cost';

/** 通用业务 项目付款 实付列表 删除 */
export const QUERY_MCN_SHOP_LIVE = '/api/shop_live/query_mcn_shop_live';

/** 保存店播项目团队成员 */
export const UPDATE_SHOP_LIVE_COMMON_PROJECT_TEAM_MEMBERS =
  '/api/shop_live/update_shop_live_common_project_team_members';

/** 场次商品列表 */
export const GET_LIVE_GOODS = '/api/shop_live/get_live_goods';

/** 项目详情 盈收统计数据 */
export const GET_SHOP_LIVE_COMMON_PROJECT_PROFIT_STAT_DATA =
  '/api/shop_live/get_shop_live_common_project_profit_stat_data';

/** s2b2c抖音平台日报查询 */
export const QUERY_S2B2C_DOUYIN_DAILY_REPORT =
  '/api/common_business/query_s2b2c_douyin_daily_report';
/** s2b2c抖音平台场次查询 */
export const QUERY_S2B2C_DOUYIN_SESSION_REPORT =
  '/api/common_business/query_s2b2c_douyin_live_report';

/** 保存s2b2c抖音项目目标 */
export const SAVE_PROJECT_DOUYIN_GOAL_INFO = '/api/shop_live/save_project_douyin_goal_info';
