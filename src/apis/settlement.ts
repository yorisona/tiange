/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-05-24 15:12:43
 */
/**
 * 结算数据 api
 * @author  wuyou <wuyou@goumee.com>
 * @since   2021-05-20 17:39:32
 * @see http://wiki.goumee.com/pages/viewpage.action?pageId=18874912
 */

/**
 * 项目结算列表页
 * 项目结算详情	(同项目结算列表页 参数中传id)
 */

/** 查看结算数据 - 营销业务 */
export const MARKETING_SETTLEMENT_QUERY_API = '/api/settlement/query_marketing_settlements';

/** 查看结算数据 - 店播业务 */
export const SHOPLIVE_SETTLEMENT_QUERY_API = '/api/settlement/query_shop_live_settlements';

/** 查看结算数据 - 通用业务 */
export const COMMON_BUSINESS_SETTLEMENT_QUERY_API = '/api/settlement/query_common_settlements';

/** 查看结算数据 - 财务收入结算 */
export const FINANCE_SETTLEMENT_QUERY_API = '/api/settlement/query_financial_settlements';

/** 查看结算数据 - 财务收入结算 */
export const FINANCE_SETTLEMENT_QUERY_API_APPROVAL =
  '/api/settlement/query_settlements/approval_financial';

/** 查看结算数据 - 财务成本结算 */
export const FINANCE_COST_SETTLEMENTS_QUERY_API =
  '/api/settlement/query_financial_cost_settlements';

/** 开票审批 - 选择财务结算列表 */
export const APPROVAL_FINANCE_SETTLEMENT_QUERY_API =
  '/api/settlement/query_approval_financial_settlements';

/**
 * 获取结算单详情路由前缀
 * 后面拼上对应的类型 营销业务: marketing
 * 店播业务: shop_live
 * s2b2c: common
 * 商家：merchant
 * 财务: financial
 * 财务成本: financial_cost
 * 财务审批：approval_financial
 * 例如： /api/settlement/query_settlements/shop_live
 */
export const QUERY_SETTLEMENT_DETAIL_PREFIX = '/api/settlement/query_settlements';

/**
 * 删除结算
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-21 17:16:22
 * @deprecated
 */
export const DEL_SETTLEMENT = '/api/settlement/del_settlement/:id/';

/** 删除营销项目结算 */
export const DEL_MARKETING_SETTLEMENT = '/api/settlement/del_marketing_settlement';
/** 删除店播项目结算 */
export const DEL_SHOP_LIVE_SETTLEMENT = '/api/settlement/del_shop_live_settlement';
/** 删除本地生活项目结算 */
export const DEL_LOCAL_LIFE_SETTLEMENT = '/api/settlement/del_local_life_settlement';
/** 删除供应链项目结算 */
export const DEL_SUPPLY_CHAIN_SETTLEMENT = '/api/settlement/del_supply_chain_settlement';
/** 删除通用项目结算 */
export const DEL_COMMON_SETTLEMENT = '/api/settlement/del_common_settlement';

/**
 * 阶段一 保存结算基本信息
 * @see  http://rap2.goumee.com/repository/editor?id=19&mod=155&itf=1676
 */

// 保存结算数据（营销业务）
export const MARKETING_SETTLEMENT_BASEINFO_SAVE_API =
  '/api/settlement/save_marketing_settlement_base_info';

// 保存结算数据（店播业务）
export const SHOPLIVE_SETTLEMENT_BASEINFO_SAVE_API =
  '/api/settlement/save_shop_live_settlement_base_info';

// 保存结算数据（通用业务）
export const COMMON_BUSINESS_SETTLEMENT_BASEINFO_SAVE_API =
  '/api/settlement/save_common_settlement_base_info';

/**
 * 阶段二 保存结算数据
 * @see  http://rap2.goumee.com/repository/editor?id=19&mod=155&itf=1680
 */

/** 保存结算数据 - 营销业务 */
export const SAVE_MARKETING_SETTLEMENT_DATA = '/api/settlement/save_settlement_data/marketing';

/** 保存结算数据 - 店播业务 */
export const SHOPLIVE_SETTLEMENT_DATA_SAVE_API = '/api/settlement/save_settlement_data/shop_live';
/** 保存结算数据 - 本地生活 */
export const LOCAL_LIFE_SETTLEMENT_DATA_SAVE_API =
  '/api/settlement/save_settlement_data/local_life';

export const SUPPLY_CHAIN_SETTLEMENT_DATA_SAVE_API =
  '/api/settlement/save_settlement_data/supply_chain';

/** 保存结算数据 - 通用业务 */
export const COMMON_BUSINESS_SETTLEMENT_DATA_SAVE_API =
  '/api/settlement/save_settlement_data/common';

/**
 * 阶段三 提交结算
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=155&itf=1691
 */
// 保存结算数据 最终提交 api
export const SETTLEMENT_FINAL_SAVE_API = '/api/settlement/submit_settlement';

/**
 * 上传文件 淘宝店播 结算
 */
export const SETTLEMENT_TAOBAO_FILE_UPLOAD_API = '/api/settlement/upload_recommend_file';

// 上传文件-抖音订单
export const SETTLEMENT_DOUYIN_ORDER_FILE_UPLOAD_API = '/api/settlement/upload_order_file';

/**
 * 上传文件 MCN淘宝CPS 收入
 */
export const INCOME_MCN_TAOBAO_FILE_UPLOAD_API = '/api/settlement/upload_taobao_cps_file';
/**
 * 上传文件 S2B2C抖音CPS 收入
 */
// 接口地址待修改
export const INCOME_MCN_DOUYIN_FILE_UPLOAD_API = '/api/settlement/upload_douyin_cps_file';
/**
 * 上传文件 MCN v任务 收入
 */
export const INCOME_MCN_V_TASK_FILE_UPLOAD_API = '/api/settlement/upload_vtask_file';

/** 获取下载 直播时长文件的地址 */
export const SHOPLIVE_TIME_DATA_FILE_API = '/api/settlement/export_project_lives';

/** 淘宝店播 业务结算 阶段二 获取时长 */
export const SHOPLIVE_TIME_DATA_API = '/api/settlement/get_project_live_count';
/** 刷新店播主播机构对应关系 */
export const RELOAD_KOL_COMPANY_RELATIONSHIP = '/api/settlement/reload_kol_company_relationship';

// 收入结算

/** 收入结算 - 保存基本信息 - 店播 */
export const SAVE_LIVE_SETTLEMENT_COST_BASEINFO =
  '/api/settlement/save_shop_live_settlement_base_info';

/** 收入结算 - 保存基本信息 - 店播 */
export const SAVE_LOCAL_LIFE_SETTLEMENT_COST_BASEINFO =
  '/api/settlement/save_local_life_settlement_base_info';

export const SAVE_SUPPLY_CHAIN_SETTLEMENT_COST_BASEINFO =
  '/api/settlement/save_supply_chain_settlement_base_info';

/** 收入结算 - 保存基本信息 - 营销 */
export const SAVE_MARKETING_SETTLEMENT_COST_BASEINFO =
  '/api/settlement/save_marketing_settlement_base_info';

/** 收入结算 - 保存基本信息 - 通用 */
export const SAVE_COMMON_SETTLEMENT_COST_BASEINFO =
  '/api/settlement/save_common_settlement_base_info';

/** 成本结算 - 保存基本信息 - 营销 */
export const SAVE_COST_SETTLEMENT_BASE_INFO_MARKETING =
  '/api/settlement/save_marketing_cost_settlement_base_info';

/** 成本结算 - 保存基本信息 - 店播 */
export const SAVE_COST_SETTLEMENT_BASE_INFO_LIVE =
  '/api/settlement/save_shop_live_cost_settlement_base_info';

/** 收入结算 - 保存基本信息 - 店播 */
export const SAVE_COST_SETTLEMENT_BASE_INFO_LOCAL_LIFE =
  '/api/settlement/save_local_life_cost_settlement_base_info';

/** 成本结算 - 保存基本信息 - 供应链 */
export const SAVE_COST_SETTLEMENT_BASE_INFO_SUPPLY_CHAIN =
  '/api/settlement/save_supply_chain_cost_settlement_base_info';

/** 成本结算 - 保存基本信息 - 通用 */
export const SAVE_COST_SETTLEMENT_BASE_INFO_COMMON =
  '/api/settlement/save_common_cost_settlement_base_info';

/** 成本结算 - 上传主播机构对应文件 - 通用 */
export const UPLOAD_KOL_COMPANY_FILE = '/api/settlement/upload_kol_company_file';

/** 成本结算 - 生成结算单 - 通用 */
export const GET_SUB_COST_SETTLEMENT = '/api/settlement/gen_sub_cost_settlement';

/**
 * 替换 暂估结算
 */

// 替换暂估 收入结算(营销业务)
export const REPLACE_COOP_ESTIMATE_INCOME_SETTLEMENT_API =
  '/api/settlement/replace_coop_estimate_income_settlement';

// 替换暂估 收入结算(店播业务)
export const REPLACE_LIVE_ESTIMATE_INCOME_SETTLEMENT_API =
  '/api/settlement/replace_project_estimate_income_settlement';
// 替换暂估 收入结算(店播业务)
export const REPLACE_LOCAL_LIFE_ESTIMATE_INCOME_SETTLEMENT_API =
  '/api/settlement/replace_local_life_estimate_income_settlement';
//供应链
export const REPLACE_SUPPLY_CHAIN_ESTIMATE_INCOME_SETTLEMENT_API =
  '/api/settlement/replace_supply_chain_estimate_income_settlement';

// 替换暂估 收入结算(通用业务)
export const REPLACE_COMMON_ESTIMATE_INCOME_SETTLEMENT_API =
  '/api/settlement/replace_common_estimate_income_settlement';

// 替换暂估 成本结算(营销业务)
export const REPLACE_MARKETING_ESTIMATE_COST_SETTLEMENT_API =
  '/api/settlement/replace_marketing_estimate_cost_settlement_base_info';

// 替换暂估 成本结算(店播业务)
export const REPLACE_LIVE_ESTIMATE_COST_SETTLEMENT_API =
  '/api/settlement/replace_shop_live_estimate_cost_settlement_base_info';
// 替换暂估 成本结算(本地生活)
export const REPLACE_LOCAL_LIFE_ESTIMATE_COST_SETTLEMENT_API =
  '/api/settlement/replace_local_life_estimate_cost_settlement_base_info';

//供应链
export const REPLACE_SUPPLY_CHAIN_ESTIMATE_COST_SETTLEMENT_API =
  '/api/settlement/replace_supply_chain_estimate_cost_settlement_base_info';
// 替换暂估 成本结算(通用业务)
export const REPLACE_COMMON_ESTIMATE_COST_SETTLEMENT_API =
  '/api/settlement/replace_common_estimate_cost_settlement_base_info';

// 上传星图excel
export const UPLOAD_XINGTU_FILE = '/api/settlement/upload_xingtu_file';

// 上传抖音cpsexcel
export const UPLOAD_DOUYIN_CPS_FILE_V2 = '/api/settlement/upload_douyin_cps_file_v2';

// 上传团长费用excel
export const UPLOAD_GROUP_FILE = '/api/settlement/upload_group_file';

// 查询结算周期内的坑位费
export const GET_COMPANY_PIT_FEE = '/api/shop_live/get_customer_company_pit_fee';
/** 收入结算 - 生成结算单 */
export const GET_SUB_INCOME_SETTLEMENT = '/api/settlement/gen_sub_income_settlement';

/** 下载场次商品明细excel */
export const GET_MERCHANT_GOODS = '/api/shop_live/download_live_goods_detail';

export const QUERY_SETTLEMENT_COMPANY = '/api/cust/settlement/query_company';
/** 投放成本达人消耗金额搜索接口 */
export const GET_AD_COST = '/api/oceanengine/ad_plan/get_ad_cost';

/** 煜丰投放成本达人消耗金额搜索接口 */
export const GET_YF_AD_COST = '/api/oceanengine/ad_plan/get_ad_cost/yufeng';

/** 上传发票(营销成本结算单) */
export const COOP_UPLOAD_INVOICE_SETTLEMENT = '/api/financial/coop_upload_invoice_settlement';
/** 上传发票(MCN成本结算单) */
export const COMMON_UPLOAD_INVOICE_SETTLEMENT = '/api/financial/common_upload_invoice_settlement';
/** 上传发票(店播哦成本结算单) */
export const SHOP_LIVE_UPLOAD_INVOICE_SETTLEMENT =
  '/api/financial/shop_live_upload_invoice_settlement';

/** 上传发票(店播哦成本结算单) */
export const LOCAL_LIFE_INVOICE_SETTLEMENT = '/api/financial/local_life_upload_invoice_settlement';
export const SUPPLY_CHAIN_INVOICE_SETTLEMENT =
  '/api/financial/supply_chain_upload_invoice_settlement';

/** 查询结算单的开票数据 */
export const GET_SETTLEMENT_INVOICE_AMOUNT = '/api/approval/get_approval_by_settlement';
