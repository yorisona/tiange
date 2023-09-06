/**
 * 合同接口地址
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-20 10:08:09
 */

/**
 * 获取合同编号
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-20 10:08:49
 * @param   method GET
 */
export const QUERY_CONTRACT_UID = '/api/cont/query_contract_uid';

/**
 * 查询合同
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-23 23:42:24
 */
export const QUERY_CONTRACT = '/api/cont/query_contract';
// 查询项目下合同
export const QUERY_SHOP_CONTRACT = '/api/cont/query_shop_live_contract';
// 查询项目下合同
export const QUERY_LOCAL_LIFE_CONTRACT = '/api/cont/query_local_life_contract';
// 查询供应链合同
export const QUERY_SUPPLY_CHAIN_CONTRACT = '/api/cont/query_supply_chain_contract';
// 查询营销业务项目下合同
export const QUERY_COOP_CONTRACT = '/api/cont/query_cooperation_contract';
/**
 * 查询法务合同
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-23 23:42:24
 */
export const QUERY_LAW_CONTRACT = '/api/cont/query_law_contract';
/**
 * 查询法务统计合同
 */
export const QUERY_LAW_STATISTICS_CONTRACT = '/api/cont/contract_statistic';
/**
 * 查询法务统计合同详情
 */
export const QUERY_LAW_STATISTICS_DETAIL_CONTRACT = '/api/cont/query_statistic_contract_detail';
/**
 * 查询法务统计合同详情
 */
export const QUERY_LAW_ANCHOR_DETAIL_CONTRACT = '/api/cont/query_anchor_contract';
//查询合同模板列表-模板管理
export const QUERY_TEMPLATE_CONTRACT = '/api/cont/get_contract_upload_template_list/';
//查询合同模板列表-MCN
export const QUERY_TEMPLATE_MCN_CONTRACT = '/api/cont/get_mcn_contract_upload_template_list/';
//查询合同模板列表-LIVE
export const QUERY_TEMPLATE_LIVE_CONTRACT =
  '/api/cont/get_shop_live_contract_upload_template_list/';
//查询合同模板列表-本地生活
export const QUERY_TEMPLATE_LOCAL_LIFE_CONTRACT =
  '/api/cont/get_local_life_contract_upload_template_list/';
//查询合同模板列表-供应链
export const QUERY_TEMPLATE_SUPPLY_CHAIN_CONTRACT =
  '/api/cont/get_supply_chain_contract_upload_template_list/';
//查询合同模板列表-营销项目
export const QUERY_TEMPLATE_MARKETING_CONTRACT =
  '/api/cont/get_marketing_contract_upload_template_list/';
//新增、编辑合同模板-模板管理
export const SAVE_TEMPLATE_UPLAODE_CONTRACT = '/api/cont/save_contract_upload_template/';
//新增/编辑直播模版合同-项目
export const SAVE_TEMPLATE_CONTRACT = '/api/cont/save_template_contract/';
//合同协议 pdf 预览和下载-项目
export const QUERY_TEMPLATE_PREVIEW_CONTRACT = '/api/cont/contract_template_agreement_pdf/';
//新增/编辑直播模版合同-主播
export const SAVE_ANCHOR_TEMPLATE_CONTRACT = '/api/anchor/contract';
//合同协议 pdf 预览和下载-主播
export const QUERY_ANCHOR_TEMPLATE_PREVIEW_CONTRACT = '/api/anchor/contract_template_agreement_pdf';
//更新、删除合同模板-模板管理
export const UPLOAD_TEMPLATE_INFO_CONTRACT = '/api/cont/update_contract_upload_template_info/';
// 查询通用业务合同 列表
export const QUERY_COMMON_BUSINESS_CONTRACT = '/api/cont/query_common_contract';
/** 获取合同详情 - 无权限 */
export const QUERY_SKIP_PERMISSIONS_CONTRACT = '/api/cont/query_skip_permissions_contract';
/**
 * 新增/编辑合同
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-25 14:41:20
 */
export const SAVE_CONTRACT = '/api/cont/save_contract';
/**
 * 新增/编辑店铺代播合同
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-25 14:41:20
 */
export const SAVE_CONTRACT_SHOP = '/api/cont/save_contract/shop_live';

/**
 * 新增/编辑 通用项目合同
 * @author  wuyou <wuyou@goumee.com>
 * @since   2021-05-18 09:59:20
 */
export const SAVE_CONTRACT_COMMON_BUSINESS = '/api/cont/save_contract/common';

/**
 * 新增/编辑营销业务项目合同
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-25 14:41:20
 */
export const SAVE_COOPERATION_CONTRACT = '/api/cont/save_contract/coop';
/**
 * 查询补充协议(合同附件)
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-26 11:43:54
 */
export const QUERY_CONTRACT_ANNEX = '/api/cont/query_contract_annex';

/**
 * 新增补充协议(合同附件)
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-26 20:08:21
 */
export const SAVE_CONTRACT_ANNEX = '/api/cont/save_contract_annex';

/**
 * 删除补充协议(合同附件)
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-30 22:28:48
 */
export const DELETE_CONTRACT_ANNEX = '/api/cont/delete_contract_annex/:id/';

/**
 * 合同结算单列表
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-27 11:52:32
 */
export const QUERY_CONTRACT_STATEMENTS = '/api/cont/query_contract_statements';

/**
 * 新增合同结算单
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-29 15:59:27
 */
export const SAVE_CONTRACT_STATEMENTS = '/api/cont/save_contract_statements';

/**
 * 删除合同结算单
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-30 11:16:29
 */
export const DELETE_CONTRACT_STATEMENTS = '/api/cont/delete_contract_statements/:id/';

/**
 * 获取补充协议审批流
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-01 00:16:05
 */
export const GET_CONTRACT_ANNEX_APPROVAL_FLOW = '/api/cont/get_contract_annex_approval_flow/:id/';

/**
 * 获取结算单审批流
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-01 16:36:51
 */
export const GET_CONTRACT_STATEMENTS_APPROVAL_FLOW =
  '/api/cont/get_contract_statements_approval_flow/:id/';

/**
 * 获取合同审批流详情
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-02 11:23:53
 */
export const GET_CONTRACT_APPROVAL_FLOW = '/api/cont/get_contract_approval_flow/:id/';
/**
 * 获取关联合同审批流详情
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-02 11:23:53
 */
export const GET_ASSOCIATE_CONTRACT_APPROVAL_FLOW = '/api/cont/get_contract_relation_approval_flow';

/**
 * 保存合同扫描件
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-14 09:41:03
 */
export const SAVE_CONTRACT_SCAN = '/api/cont/save_contract_scan';

/**
 * 保存合同扫描件-法务
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-14 09:41:03
 */
export const SAVE_CONTRACT_SCAN_LEGAL = '/api/cont/save_contract_scan_legal';

/**
 * 删除合同扫描件
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-14 17:48:09
 */
export const DELETE_CONTRACT_SCAN = '/api/cont/delete_contract_scan';
/**
 * 查询主播合同签约
 */
export const ANCHOR_CONTRACT = '/api/anchor/contract';
