/*
 * @Brief: 简介
 * @Author: tingzhu
 * @Date: 2020-12-30 17:48:39
 */
/**
 * 店铺代播
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-28 14:00:00
 */

/**
 * 项目管理
 * @author  tingzhu <tingzhu@goumee.com>
 * @since   2020-12-28 14:00:00
 */
// 跟踪事项列表
export const TRACK_MASTER_QUERY = '/api/shop_live/query_track_matter';
// 保存事项
export const TRACK_MASTER_SAVE = '/api/shop_live/save_track_matter';

// 保存直播场次
export const SHOP_LIVE_SAVE = '/api/shop_live/save_shop_live';
// 项目编号搜索
export const SHOP_LIVE_PROJECT_ID_LIST = '/api/shop_live/get_shop_live_project_id_list';
// 直播间搜索
export const STUDIO_LIST = '/api/studio/get_studio_list';
// 场次详情 /api/shop_live/get_shop_live/{id}/
export const DISPLAY_DETAIL = '/api/shop_live/get_shop_live';
export const LOCAL_LIFE_DISPLAY_DETAIL = '/api/shop_live/get_local_life_shop_live';
//供应链
export const SUPPLY_CHAIN_DISPLAY_DETAIL = '/api/shop_live/get_supply_chain_shop_live';
// 场次详情 MCN
export const DISPLAY_DETAIL_MCN = '/api/shop_live/get_mcn_shop_live';
// 关闭场次 /api/shop_live/close_shop_live/{id}/
export const DISPLAY_CLOSE = '/api/shop_live/close_shop_live';
// 关闭场次 /api/shop_live/close_shop_live/{id}/
export const LOCAL_LIFE_DISPLAY_CLOSE = '/api/shop_live/close_local_life_shop_live';
// 供应链
export const SUPPLY_CHAIN_DISPLAY_CLOSE = '/api/shop_live/close_supply_chain_shop_live';
export const DISPLAY_CLOSE_MCN = '/api/shop_live/close_mcn_shop_live';
// 删除场次 /api/shop_live/del_shop_live/{id}/
export const DISPLAY_DELETE = '/api/shop_live/del_shop_live';
export const LOCAL_LIFE_DISPLAY_DELETE = '/api/shop_live/del_local_life_shop_live';
export const SUPPLY_CHAIN_DISPLAY_DELETE = '/api/shop_live/del_supply_chain_shop_live';
export const DISPLAY_DELETE_MCN = '/api/shop_live/del_mcn_shop_live';

// 场次详情-主播数据列表
export const KOL_DATA_QUERY = '/api/shop_live/query_kol_data';

// 场次详情-人员排班-查询场次排期
export const LIVE_SCHEDULE_QUERY = '/api/shop_live/query_live_schedule_detail';

// 场次详情-人员排班-查询场次排期-本地生活
export const LOCAL_LIFE_SCHEDULE_QUERY = '/api/shop_live/query_live_schedule_detail/local_life';

// 场次详情-人员排班-查询场次排期-供应链
export const SUPPLY_CHAIN_SCHEDULE_QUERY = '/api/shop_live/query_live_schedule_detail/supply_chain';

// 场次详情-人员排班-主播数据录入
export const KOL_DATA_SAVE = '/api/shop_live/save_kol_data';

// 场次详情 淘宝插件场次列表
export const TAOBAO_SHOP_LIVE_API = '/api/shop_live/get_taobao_live_info';
// 场次详情 淘宝插件场次列表-本地生活
export const TAOBAO_LOCAL_LIFE_API = '/api/shop_live/get_taobao_live_info';
// 场次详情 淘宝插件场次列表-供应链
export const TAOBAO_SUPPLY_CHAIN_API = '/api/shop_live/get_taobao_live_info';

// 场次详情 下载场记数据
export const DOWNLOAD_TAOBAO_SHOP_LIVE_DATA_API = '/api/shop_live/download_taobao_live_log';

// 场次详情 下载直播间实时数据
export const DOWNLOAD_TAOBAO_SHOP_LIVE_STUDIO_DATA_API =
  '/api/shop_live/download_taobao_live_studio_data';

/**
 * 获取所有kol
 * @author  tingzhu <tingzhu@goumee.com>
 * @since   2021-01-09 15:17:27
 */
export const KOL_QUERY = '/api/kol/get_all_kol_id_and_kol_name';

/** 直播数据录入 */
export const DISPLAY_LIVE_DATA_SAVE_API = '/api/shop_live/enter_live_data';

/**
 * 排班查询
 */
// 查询主播排班
export const KOL_SCHEDULE_EXPORT = '/api/shop_live/export_kol_schedule_detail';
// 查询主播排班
export const KOL_SCHEDULE_QUERY = '/api/shop_live/query_kol_schedule_detail';
// 查询运营助理排班
export const OPERATOR_SCHEDULE_QUERY = '/api/shop_live/query_operator_schedule_detail';
// 查询直播间排班
export const STUDIO_SCHEDULE_QUERY = '/api/shop_live/query_studio_schedule_detail';

/**
 * 直播场次列表
 */
export const QUERY_SHOP_LIVE = '/api/shop_live/query_shop_live';
/**
 * 本地生活直播场次列表
 */
export const QUERY_SHOP_LIVE_LOCAL_LIFE = '/api/shop_live/query_shop_live/local_life';

/**
 * 供应链
 */
export const QUERY_SHOP_LIVE_SUPPLY_CHAIN = '/api/shop_live/query_shop_live/supply_chain';

/**
 * 查询项目排期
 */
export const QUERY_PROJECT_SCHEDULE_DETAIL = '/api/shop_live/query_project_schedule_detail';
/**
 * 查询项目排期-本地生活
 */
export const QUERY_PROJECT_SCHEDULE_DETAIL_LOCAL_LIFE =
  '/api/shop_live/query_project_schedule_detail/local_life';

/**
 * 查询项目排期-供应链
 */
export const QUERY_PROJECT_SCHEDULE_DETAIL_SUPPLY_CHAIN =
  '/api/shop_live/query_project_schedule_detail/supply_chain';
/**
 * 飞书部门列表
 */
export const QUERY_FEISHU_DEPARTMENT_LIST = '/api/feishu/feishu_department_list';

/**
 * 收款退款核销的应收单列表(店播)
 * @author  tingzhu
 */
export const QUERY_SHOP_LIVE_RECEIVABLES_REFUND_FOR_WRITE_OFF =
  '/api/receivable/query_shop_live_receivables_refund_for_write_off';
/**
 * 收款退款核销的应收单列表(营销)
 * @author  tingzhu
 */
export const QUERY_MARKETING_RECEIVABLES_REFUND_FOR_WRITE_OFF =
  '/api/receivable/query_marketing_receivables_refund_for_write_off';
/**
 * 收款退款核销的应收单列表(mcn)
 * @author  tingzhu
 */
export const QUERY_COMMON_RECEIVABLES_REFUND_FOR_WRITE_OFF =
  '/api/receivable/query_common_receivables_refund_for_write_off';

/**
 * 收款退款核销
 * @author  tingzhu
 */
export const SAVE_RECEIVABLES_REFUND_FOR_WRITE_OFF =
  '/api/receivable/shop_live_receivables_refund_for_write_off';

/**
 * 创建付款退款
 * @author  tingzhu
 */
export const CREATE_PAY_REFUND = '/api/financial/create_pay_refund';

/**
 * 付款退款核销应付列表
 * @author  tingzhu
 */
export const QUERY_PAY_REFUND_WRITEOFF_PAYABLE_LIST =
  '/api/payable/pay_refund_writeoff_payable_list';

/**
 * 付款退款核销
 * @author  tingzhu
 */
export const SAVE_PAY_REFUND_FOR_WRITE_OFF = '/api/payable/write_off_pay_refund';

/**
 * 直播场次
 */
export const QUERY_PROJECT_SCHEDULE_CALENDAR = '/api/shop_live/query_project_schedule_calendar';
/**
 * 直播场次-本地生活
 */
export const QUERY_PROJECT_SCHEDULE_CALENDAR_LOCAL_LIFE =
  '/api/shop_live/query_local_life_project_schedule_calendar';
/**
 * 直播场次-供应链
 */
export const QUERY_PROJECT_SCHEDULE_CALENDAR_SUPPLY_CHAIN =
  '/api/shop_live/query_supply_chain_project_schedule_calendar';
/**
 * MCN直播场次
 */
export const QUERY_PROJECT_SCHEDULE_CALENDAR_MCN =
  '/api/shop_live/query_mcn_project_schedule_calendar';

/**
 * 设置休息日-创新项目
 */
export const SCHEDULE_SET_REST = '/api/shop_live/common/schedule_set_rest';

/**
 * 取消休息日-创新项目
 */
export const SCHEDULE_CANCEL_REST = '/api/shop_live/common/del_schedule_rest';
/**
 * 设置休息日-品牌中心
 */
export const SCHEDULE_SET_REST_SHOPLIVE = '/api/shop_live/schedule_set_rest';

/**
 * 取消休息日-品牌中心
 */
export const SCHEDULE_CANCEL_REST_LOCAL_LIFE = '/api/shop_live/local_life/del_schedule_rest';

/**
 * 取消休息日-品牌中心供应链
 */
export const SCHEDULE_CANCEL_REST_SUPPLY_CHAIN = '/api/shop_live/supply_chain/del_schedule_rest';
/**
 * 设置休息日-品牌中心
 */
export const SCHEDULE_SET_REST_LOCAL_LIFE = '/api/shop_live/schedule_set_rest/local_life';

/**
 * 设置休息日-品牌中心供应链
 */
export const SCHEDULE_SET_REST_SUPPLY_CHAIN = '/api/shop_live/schedule_set_rest/supply_chain';
/**
 * 取消休息日-品牌中心
 */
export const SCHEDULE_CANCEL_REST_SHOPLIVE = '/api/shop_live/del_schedule_rest';
/**
 * 项目排期表
 */
export const QUERY_PROJECT_SHOP_LIVE = '/api/shop_live/query_shop_live_v2';
/**
 * 项目排期表-本地生活
 */
export const QUERY_PROJECT_SHOP_LIVE_LOCAL_LIFE = '/api/shop_live/query_local_life_shop_live';
/**
 * 供应链
 */
export const QUERY_PROJECT_SHOP_LIVE_SUPPLY_CHAIN = '/api/shop_live/query_supply_chain_shop_live';
// 项目排期表 MCN
export const QUERY_PROJECT_SHOP_LIVE_MCN = '/api/shop_live/query_mcn_shop_live';

/**
 *  店铺项目详情 盈收统计数据
 *
 */
export const SHOP_LIVE_PROFIT_STAT_DATA = '/api/shop_live/get_shop_live_project_profit_stat_data';

/**
 *  保存店播项目团队成员
 *
 */
export const UPDATE_SHOP_LIVE_TEAM_MEMBERS = '/api/shop_live/update_shop_live_project_team_members';

/**
 *  保存店播项目团队成员
 *
 */
export const UPDATE_LOCAL_LIFE_TEAM_MEMBERS =
  '/api/shop_live/update_local_life_project_team_members';

/**
 * 保存店播项目团队成员供应链
 */
export const UPDATE_SUPPLY_CHAIN_TEAM_MEMBERS =
  '/api/shop_live/update_supply_chain_project_team_members';

/** 复制排期 */
export const COPY_SHOP_LIVE_SCHEDULE_API = '/api/shop_live/copy_schedule_detail';
/** 复制排期-本地生活 */
export const COPY_SHOP_LIVE_SCHEDULE_API_LOCAL_LIFE =
  '/api/shop_live/copy_schedule_detail/local_life';

/** 复制排期-供应链 */
export const COPY_SHOP_LIVE_SCHEDULE_API_SUPPLY_CHAIN =
  '/api/shop_live/copy_schedule_detail/supply_chain';

/** 直播留档列表 */
export const SHOP_LIVE_RECORD_DATA_LIST_API = '/api/shop_live/query_live_data';

/** 直播留档列表-本地生活 */
export const LOCAL_LIFE_RECORD_DATA_LIST_API = '/api/shop_live/local_life/query_live_data';

/** 直播留档列表-供应链 */
export const SUPPLY_CHAIN_RECORD_DATA_LIST_API = '/api/shop_live/supply_chain/query_live_data';

/** 新增/更新直播留档 */
export const SHOP_LIVE_RECORD_DATA_EDIT_API = '/api/shop_live/enter_live_data_v2';

export const SHOP_LIVE_LOCAL_LIFE_RECORD_DATA_EDIT_API =
  '/api/shop_live/enter_live_data_v2/local_life';

export const SHOP_LIVE_SUPPLY_CHAIN_RECORD_DATA_EDIT_API =
  '/api/shop_live/enter_live_data_v2/supply_chain';

// 直播留档 删除
export const SHOP_LIVE_RECORD_DATA_DELETE_API = '/api/shop_live/del_live_data';
// 直播留档 删除-本地生活
export const SHOP_LIVE_LOCAL_LIFE_RECORD_DATA_DELETE_API =
  '/api/shop_live/local_life/del_live_data';
// 直播留档 删除-供应链
export const SHOP_LIVE_SUPPLY_CHAIN_RECORD_DATA_DELETE_API =
  '/api/shop_live/supply_chain/del_live_data';

// 主播 排班保存
export const SHOP_LIVE_SAVE_KOL_SCHEDULE_DATA_API = '/api/shop_live/save_kol_schedule';
// 主播 排班保存
export const LOCAL_LIFE_SAVE_KOL_SCHEDULE_DATA_API = '/api/shop_live/local_life/save_kol_schedule';
// 主播 排班保存供应链
export const SUPPLY_CHAIN_SAVE_KOL_SCHEDULE_DATA_API =
  '/api/shop_live/supply_chain/save_kol_schedule';

// 运营 排班保存
export const SHOP_LIVE_SAVE_OPERATOR_SCHEDULE_DATA_API = '/api/shop_live/save_operator_schedule';

/** 今日排班接口 */
export const QUERY_TODAY_LIVE_SCHEDULE_DETAIL = '/api/shop_live/query_today_live_schedule_detail';

/** 排班预警接口 */
export const QUERY_TODAY_LIVE_SCHEDULE_WARNING_DETAIL =
  '/api/shop_live/query_shop_live_scheduled_warning';

/** 查询是否在项目成员中 */
export const IN_PROJECT_TEAM = '/api/shop_live/in_project_team';

/** 查询是否在项目成员中 */
export const LOCAL_LIFE_IN_PROJECT_TEAM = '/api/shop_live/local_life/in_project_team';

/** 查询是否在项目成员中供应链 */
export const SUPPLY_CHAIN_IN_PROJECT_TEAM = '/api/shop_live/supply_chain/in_project_team';

/** 查询用户名(不带权限) */
export const QUERY_USER_NAMES = '/api/auth/query_user_names';

// 新增编辑场次 V2
export const EDIT_SHOP_LIVE_DISPLAY_DATA_API = '/api/shop_live/save_shop_live_v2';
// 新增编辑场次 V2 本地生活
export const EDIT_SHOP_LIVE_LOCAL_LIFE_DISPLAY_DATA_API =
  '/api/shop_live/save_local_life_shop_live';

// 新增编辑场次 V2 供应链
export const EDIT_SHOP_LIVE_SUPPLY_CHAIN_DISPLAY_DATA_API =
  '/api/shop_live/save_supply_chain_shop_live';

// 新增编辑场次 V2 MCN
export const EDIT_SHOP_LIVE_DISPLAY_DATA_API_MCN = '/api/shop_live/save_mcn_shop_live';
// 设置店播场次为未归档
export const SET_LIVE_DISPLAY_NOT_LIVED = '/api/shop_live/open_shop_live';
// 设置MCN场次为未归档
export const SET_MCN_LIVE_DISPLAY_NOT_LIVED = '/api/shop_live/open_mcn_shop_live';
// 设置店播场次为未归档
export const SET_LOCAL_LIFE_LIVE_DISPLAY_NOT_LIVED = '/api/shop_live/open_local_life_shop_live';
// 设置店播场次为未归档
export const SET_SUPPLY_CHAIN_LIVE_DISPLAY_NOT_LIVED = '/api/shop_live/open_supply_chain_shop_live';

// 场次详情-直播数据
export const GET_SHOP_LIVE_STATISTIC = '/api/shop_live/get_shop_live_statistic';

// 场次详情-直播数据
export const GET_LOCAL_LIFE_STATISTIC = '/api/shop_live/get_local_life_statistic';

// 场次详情-直播数据
export const GET_SUPPLY_CHAIN_STATISTIC = '/api/shop_live/get_supply_chain_statistic';

// 项目日目标列表
export const QUERY_PROJECT_DAILY_GOAL_SETTINGS = '/api/shop_live/query_project_daily_goal_settings';

// 项目日目标列表
export const SAVE_PROJECT_SHOP_DAILY_GOAL_SETTINGS =
  '/api/shop_live/save_project_shop_daily_goal_approval';
