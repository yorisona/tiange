/**
 * 权限码
 * @author  wuyou <wuyou@goumee.com>
 * @since   2021-01-13 10:44:31
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=58&itf=1506
 */

/** 主播招募 */
export const WorkbenchRightCodeMap = {
  /** 工作台 */
  workbench_view: 800000,
  /** 主播招募 */
  workbench_anchor_recruit: 800100,
  /** 设计统计 */
  workbench_order_statistics: 800201,
};

/** 通用业务 权限码 */
export const CommonBusinessRightCodeMap = {
  /** 通用业务 */
  common_business: 26000,
  /** 通用业务 项目列表 */
  common_business_project: 260100,
  /** 通用业务 项目列表 查看 */
  common_business_project_view: 260101,
  /** 通用业务 新增/编辑项目 */
  common_business_project_save: 260102,
  /** 通用业务 查看合同协议 */
  common_business_project_contract_view: 260116,
  /** 通用业务 新增合同协议 */
  common_business_project_contract_create: 260117,
  /** 通用业务 新增结算单 */
  common_business_project_contract_statement_create: 260109,
  /** 通用业务 新增补充协议 */
  common_business_project_contract_annex_create: 260007,
  /** 通用业务 日报数据--》 查看数据中心*/
  common_business_project_contract_daily_data: 260120,
  /** 通用业务 项目结算 - 查看 */
  common_business_project_settlement_view: 260107,
  /** 通用业务 项目结算 - 发起结算 */
  common_business_project_settlement_save: 260108,
  /** 通用业务 项目结算 - 删除结算 */
  common_business_project_settlement_delete: 260108,
  /** 通用业务 核销管理 **/
  common_business_write_off: 260112,
  /** 通用业务 登记业绩 **/
  common_business_project_achievement: 260111,
  /** 通用业务 查看项目收款 **/
  common_business_project_gathering_view: 260110,
  /** 通用业务 项目付款-查看 */
  common_business_project_view_common_project_paid: 260113,
  /** 通用业务 登记成本-发起付款 */
  common_business_project_registration_cost: 260114,
  /** 通用业务 编辑成员 */
  common_business_project_team_member_edit: 260102,
  /** 通用业务 项目完结 */
  common_business_project_end_project: 260104,
  /** 通用业务 tab招商 */
  common_business_project_tab_merchant: 260021,
  /** 查看所有项目明细 */
  common_business_view_all_project: 260103,
  /** 成本上传发票权限 */
  common_upload_invoice: 260115,
  /** 确认招商结算 */
  s2b2c_settlement: 260026,
  /** 项目确认 */
  project_confirmation: 260121,
  /** 项目状态变更，项目完成以后修改状态 */
  common_business_project_status_finish_edit: 260104,
};

/** 营销业务 项目管理 */
export const MarketingProjectRightCodeMap = {
  /** 营销业务 项目列表 */
  marketing_project: 130000,
  /** 营销业务 项目列表 查看 */
  marketing_project_view: 130001,
  /** 营销业务 新增/编辑项目 */
  marketing_project_save: 130002,
  /** 营销业务 编辑项目阶段 */
  marketing_project_step_edit: 130003,
  /** 营销业务 查看业绩登记表 */
  marketing_project_achievement_view: 130004,
  /** 营销业务 增删改收款 */
  marketing_project_achievement_change: 130005,
  /** 营销业务 查看成本安排表 */
  marketing_project_cost_view: 130006,
  /** 营销业务 增删改付款 */
  marketing_project_cost_change: 130007,
  /** 营销业务 查看跟单表 */
  marketing_project_documentary_view: 130008,
  /** 营销业务 增删改跟单记录 */
  marketing_project_documentary_change: 130009,
  /** 营销业务 查看合同协议 */
  marketing_project_contract_view: 130010,
  /** 营销业务 新增合同 */
  marketing_project_documentary_create: 130011,
  /** 营销业务 新增结算单 */
  marketing_project_contract_statement_create: 130012,
  /** 营销业务 新增补充协议 */
  marketing_project_contract_annex_create: 130013,
  /** 查看/录入日报数据 */
  view_or_save_coop_daily_report: 130014,
  /** 营销业务项目结算Tab查看 */
  marketing_project_settlement_view: 130017,
  /** 营销业务项目结算 - 发起结算 */
  marketing_project_settlement_save: 130015,
  /** 营销业务项目结算 - 删除结算 */
  marketing_project_settlement_delete: 130015,
  /** 营销业务项目结算 - 核销 */
  marketing_project_write_off_save: 130018,
  /** 成本上传发票权限 */
  coop_upload_invoice: 130019,
  /** 项目状态变更，项目完成以后修改状态 */
  marketing_project_status_finish_edit: 130003,
  /**项目结算设置 **/
  common_business_project_status_setting: 260119,
};

/** 营销业务 合同列表 */
export const MarketingRightCodeMap = {
  /** 营销业务 客户列表 查看 */
  marketing_customer_view: 112001,
  /** 营销业务 合同列表 查看 */
  marketing_contract_view: 113008,
  /** 营销业务 合同列表 */
  marketing_contract_list: 113001,
  /** 营销业务 合同列表 新增合同 */
  marketing_contract_create: 113002,
  /** 营销业务 合同列表 修改合同 */
  marketing_contract_edit: 113003,
  /** 营销业务 合同列表 修改合同 */
  marketing_contract_delete: 113004,
  /** 营销业务 合同列表 上传合同扫描件 */
  marketing_contract_scan_upload: 113007,
};

/** 营销业务 业绩登记表 */
export const AchievementRightCodeMap = {
  /** 业绩登记表 查看 */
  marketing_achievement_view: 161008,
  /** 业绩登记表 */
  achievement_list: 161001,
  /** 上传 编辑发票 */
  achievement_upload_edit_invoice: 161006,
  /** 登记 编辑时间 */
  achievement_register_edit_time: 161007,
  /** 导出 */
  achievement_export: 161005,
};

/** 营销业务 成本安排表 */
export const CostRightCodeMap = {
  /** 成本安排表 查看 */
  cost_view: 162009,
  /** 成本安排表 */
  cost_list: 162001,
  /** 新增成本安排 */
  cost_create: 162002,
  /** 修改成本安排 */
  cost_edit: 162003,
  /** 删除成本安排 */
  cost_delete: 162004,
  /** 上传/编辑打款凭证  */
  cost_upload_edit_pay_evidence: 162006,
  /** 上传/编辑发票 */
  cost_upload_edit_invoice: 162008,
  /** 导出 */
  cost_export: 162005,
};

/** 营销业务 返点安排表 */
export const RebateRightCodeMap = {
  /** 返点安排表 查看 */
  rebate_view: 165007,
  /** 返点安排表 */
  rebate_list: 165001,
  /** 新增返点表 */
  rebate_create: 165002,
  /** 修改返点表 */
  rebate_edit: 165003,
  /** 删除返点表 */
  rebate_delete: 165004,
  /** 上传/编辑打款凭证 */
  rebate_upload_edit_pay_evidence: 165006,
  /** 导出 */
  rebate_export: 165005,
};

// /** 营销业务 需求管理 */
// export const DemandRightCodeMap = {
//   /** 需求管理 */
//   demand_list: 110001,
//   /** 新增需求 */
//   demand_create: 110002,
//   /** 更新需求 */
//   demand_edit: 110003,
//   /** 删除需求 */
//   demand_delete: 110004,
// };

// /** 营销业务 场次管理 */
// export const DisplayRightCodeMap = {
//   /** 场次管理 */
//   display_list: 130001,
//   /** 新增场次 */
//   display_create: 130002,
//   /** 修改场次 */
//   display_edit: 130003,
//   /** 删除场次 */
//   display_delete: 130004,
//   /** 导出 */
//   display_export: 130005,
// };

// /** 营销业务 商品管理 */
// export const ProductRightCodeMap = {
//   /** 商品管理 */
//   product_list: 131001,
//   /** 新增商品 */
//   product_create: 131002,
//   /** 修改商品 */
//   product_edit: 131003,
//   /** 删除商品 */
//   product_delete: 131004,
// };

/** 店铺代播 项目管理*/
export const LiveProjectRightCodeMap = {
  /** 项目管理 查看 */
  live_project_view: 200114,
  /** 项目管理 */
  live_project_list: 200114,
  /** 新增/编辑项目 */
  live_project_save: 200101,
  /** 核销按钮 */
  live_write_off_save: 200119,
  /** 编辑项目阶段 */
  live_project_status_edit: 200102,
  /** 查看跟踪事项 */
  // live_project_task_view: 200103,
  /** 新增/编辑跟踪事项 */
  // live_project_task_save: 200104,
  /** 查看直播排期 */
  // live_project_schedule_view: 200105,
  /** 查看项目收款 */
  live_project_gathering_view: 200106,
  /** 登记业绩 */
  live_project_achievement: 200112,
  /** 查看项目付款 */
  live_project_pay_view: 200107,
  /** 发起付款 */
  live_project_cost: 200113,
  /** 查看合同协议 */
  live_project_contract_view: 200108,
  /** 新增合同 */
  live_project_contract_create: 200109,
  /** 新增结算单 */
  live_project_statements_create: 200110,
  /** 新增补充协议  */
  live_project_annex_create: 200111,
  /** 查看/录入日报数据 */
  view_or_save_shop_daily_report: 200115,
  /** 店播业务项目结算Tab - 查看 */
  live_project_settlement_view: 200118,
  /** 店播业务项目结算 - 发起结算 */
  live_project_settlement_save: 200116,
  /** 店播业务项目结算 - 删除结算 */
  live_project_settlement_delete: 200116,
  /** 成本上传发票权限 */
  shop_live_upload_invoice: 200127,
  /** 项目状态变更，项目完成以后修改状态 */
  live_project_status_finish_edit: 200102,
  /** 项目目标查看 */
  live_project_target_view: 200129,
  /** 项目目标店铺管理 */
  live_project_target_shop_edit: 200130,
  /** 项目目标主播管理 */
  live_project_target_anchor_edit: 200131,
  /** 查看所有主播排班 */
  live_project_anchor_view: 200601,
  /** 导出所有主播排班*/
  live_project_anchor_export: 200602,
  /** 延长项目清算期 **/
  update_end_project: 200132,
};

/** 店铺代播 供应链*/
export const SupplyChainRightCodeMap = {
  supply_edit_project: 200801, // 新增/编辑项目
  supply_edit_project_status: 200802, // 变更项目状态
  supply_view_achievement: 200806, // 查看应收实收
  supply_view_cost: 200807, // 查看应付实付
  supply_view_contract: 200808, // 查看合同协议
  supply_edit_contract: 200809, // 新增合同协议
  supply_edit_contract_settlement: 200810, // 新增结算单
  supply_project_annex_create: 200111, // 新增补充协议
  supply_edit_achievement: 200812, // 登记收款
  supply_edit_cost: 200813, // 发起付款
  supply_view_project: 200814, // 查看项目
  supply_view_daily_report: 200815, // 查看数据
  supply_edit_settlement: 200816, // 新增/删除结算
  supply_view_settlement: 200818, // 查看结算
  supply_write_off: 200819, // 核销
  supply_view_shop_live: 200820, // 查看直播场次
  supply_edit_shop_live: 200821, // 新增/编辑直播场次
  supply_edit_assistant_schedule: 200822, // 运营助理排班
  supply_edit_kol_schedule: 200823, // 主播排班
  supply_view_shop_live_archive: 200824, // 直播数据留档
  supply_view_project_detail: 200825, // 查看所有项目明细
  supply_edit_shop_live_not_archive: 200826, // 未归档编辑
  supply_upload_invoice: 200827, // 上传发票
  supply_view_goal: 200829, // 查看目标
  supply_edit_shop_goal: 200830, // 店铺目标设置
  supply_edit_anchor_goal: 200831, // 主播目标设置
  supply_update_project_end_status: 200832, // 延长项目清算期
};
/** 店铺代播 项目管理*/
export const LocalLifeProjectRightCodeMap = {
  /** 项目管理 查看 */
  local_life_project_view: 200714,
  /** 项目管理 */
  local_life_project_list: 200714,
  /** 新增/编辑项目 */
  local_life_project_save: 200701,
  /** 核销按钮 */
  local_life_write_off_save: 200719,
  /** 编辑项目阶段 */
  local_life_project_status_edit: 200702,
  /** 查看项目收款 */
  local_life_project_gathering_view: 200706,
  /** 登记业绩 */
  local_life_project_achievement: 200712,
  /** 查看项目付款 */
  local_life_project_pay_view: 200707,
  /** 发起付款 */
  local_life_project_cost: 200713,
  /** 查看合同协议 */
  local_life_project_contract_view: 200708,
  /** 新增合同 */
  local_life_project_contract_create: 200709,
  /** 新增结算单 */
  local_life_project_statements_create: 200710,
  /** 新增补充协议  */
  local_life_project_annex_create: 200111,
  /** 查看/录入日报数据 */
  local_life_view_or_save_shop_daily_report: 200715,
  /** 店播业务项目结算Tab - 查看 */
  local_life_project_settlement_view: 200718,
  /** 店播业务项目结算 - 发起结算 */
  local_life_project_settlement_save: 200716,
  /** 店播业务项目结算 - 删除结算 */
  local_life_project_settlement_delete: 200716,
  /** 成本上传发票权限 */
  local_life_upload_invoice: 200727,
  /** 项目状态变更，项目完成以后修改状态 */
  local_life_project_status_finish_edit: 200702,
  /** 项目目标查看 */
  local_life_project_target_view: 200729,
  /** 项目目标店铺管理 */
  local_life_project_target_shop_edit: 200730,
  /** 项目目标主播管理 */
  local_life_project_target_anchor_edit: 200731,
  /** 查看所有主播排班 */
  local_life_project_anchor_view: 200601,
  /** 导出所有主播排班*/
  local_life_project_anchor_export: 200602,
  /** 延长项目清算期 **/
  local_life_update_end_project: 200732,
  /** 直播场次 查看 */
  local_life_display_view: 200720,
  /** 新增/编辑直播场次 */
  local_life_display_save: 200721,
  /** 已归档编辑权限 */
  local_life_display_lived_edit: 200726,
  /** 主播排班 */
  local_life_streamer_schedule: 200723,
  /** 运营助理排班 */
  local_life_operation_schedule: 200722,
  /** 直播间管理 */
  local_life_studio: 200500,
  /** 新增/编辑直播间 */
  local_life_studio_modify: 200501,
  /** 直播间管理查看 */
  local_life_studio_view: 200502,
  // 直播数据留档
  local_life_live_archive: 200724,

  /** 查看所有项目明细 **/
  local_life_view_all_project: 200725,
  // 直播数据留档
  local_life_view_shop_live_archive: 200724,
};

/** 店铺代播 直播场次 */
export const LiveDisplayRightCodeMap = {
  /** 店铺代播 */
  shop_live_manage: 200000,
  /** 直播场次 查看 */
  // live_display_view: 200208,
  live_display_view: 200120,

  // 直播数据留档
  view_shop_live_archive: 200124,

  /** 查看所有项目明细 **/
  view_all_project: 200125,

  /** 直播场次 */
  // live_display_list: 200200,
  /** 新增/编辑直播场次 */
  // live_display_save: 200201,
  live_display_save: 200121,
  /** 已归档编辑权限 */
  live_display_lived_edit: 200126,
  /** 直播场次 关闭 */
  // live_display_close: 200202,
  /** 直播场次 删除 */
  // live_display_delete: 200203,
  /** 主播排班 */
  // live_streamer_schedule: 200204,
  live_streamer_schedule: 200123,
  /** 运营助理排班 */
  // live_operation_schedule: 200205,
  live_operation_schedule: 200122,
  /** 主播数据录入 */
  // live_streamer_data_typein: 200206,
  /** 下载直播间场记 */
  // download_shop_live_log: 200220,
  /** 下载实时数据 */
  // download_shop_live_data: 200221,
  /** 直播数据录入 */
  // live_data_typein: 200207,
  /** 直播复盘 */
  // live_replay_view: 200209,
  /** 直播间管理 */
  live_studio: 200500,
  /** 新增/编辑直播间 */
  live_studio_modify: 200501,
  /** 直播间管理查看 */
  live_studio_view: 200502,
};

/** 经营管理 */
export const ManagementRightCodeMap = {
  budget_manage: 330100,
  budget_manage_view: 330101,
  project_dashboard: 330200,
  project_dashboard_view: 330201,
  project_dashboard_detail_export: 330202,
  project_management_dashboard: 330300,
  project_management_dashboard_view: 330301,
  company_dashboard: 330500,
  company_dashboard_view: 330501,
  department_dashboard: 330400,
  department_dashboard_view: 330401,
};
/** 销售管理 */
export const SalesRightCodeMap = {
  /** 销售管理 查看 */
  sales_view: 210002,
  /** 销售管理 */
  sales_list: 210000,
  /** 客户跟进 */
  customer_follow_up: 210100,
  /** 新增编辑任务 */
  sales_task_save: 210101,
  /** 新增编辑任务 */
  sales_add_task_save: 210102,
};

/** 财务管理 */
const FinanceRightCodeMap = {
  /** 收入结算 - 查看 */
  settlement_income_view: 220401,
  /** 收入结算 - 操作 */
  settlement_income_update: 220402,
  /** 成本结算 - 查看 */
  settlement_cost_view: 221201,
  /** 成本结算 - 操作 */
  settlement_cost_update: 221202,
  /** 结算管理 查看 */
  settlement_view: 220400,
  /** 收款管理 查看 */
  gathering_view: 220104,
  /** 收款管理 */
  gathering_list: 220100,
  /** 收款管理 导出 */
  gathering_export: 220101,
  /** 收款确认 */
  gathering_confirm: 220102,
  /** 上传/编辑发票 */
  gathering_upload_edit_invoice: 220103,
  /** 付款管理 查看 */
  payment_view: 220205,
  /** 付款管理 */
  payment_list: 220200,
  /** 付款管理 导出 */
  payment_export: 220201,
  /** 上传/编辑打款凭证 */
  payment_upload_edit_pay_evidence: 220202,
  /** 上传/编辑发票 */
  payment_upload_edit_invoice: 220203,
  /** 关联付款 导出 */
  link_payment_btn: 220206,
  /** 应收 */
  receivable_view: 220501,
  /** 应付 */
  payable_view: 220601,
  /** 发票管理 */
  invoice_manage: 220700,
  /** 发票 查看 */
  view_invoice: 220701,
  /** 发票 新增 */
  add_invoice: 220702,
  /** 发票 核销 */
  write_off_invoice: 220703,
  /** 发票 作废 */
  void_invoice: 220704,
  /** 发票 归档审核 */
  invoice_archive_approval_: 220706,
  /** 财务报表 */
  invoice_report: 300900,
  /** 财务报表查看 */
  invoice_report_view: 500101,
  /** 财务报表导出 */
  invoice_report_export: 500102,
  /** 开票中上传发票权限 */
  upload_invoice: 220705,
  /** 费用分摊 */
  cost_share: 220800,
  /** 费用分摊查看 */
  cost_share_view: 220801,
  /** 费用分摊 */
  cost_share_edit: 220802,
  /** 费用分摊 */
  cost_share_export: 220804,
  /** 费用分摊历史 **/
  cost_share_history: 221400,
  /** 费用分摊历史查看 **/
  cost_share_history_view: 221401,
  /** 费用分摊修改操作人员 **/
  cost_share_modify_operator: 220805,
  /** 收入流水菜单 */
  income_flow: 220900,
  /** 收入流水查看 */
  income_flow_view: 220901,
  /** 收入流水导入 */
  income_flow_import: 220902,
  /** 账期管理 */
  account_period_manage: 221000,
  /** 账期管理查看 */
  view_account_period: 221001,
  /** 账期管理修改 */
  modify_account_period: 221002,
  /** 对公账户 */
  finance_account: 221100,
  /** 对公账户查看 */
  finance_account_view: 221101,
  /** 对公账户编辑 */
  finance_account_modify: 221102,
  /** 预收管理查看 */
  advance_payment_view: 221301,
  /** 预收管理审核 */
  advance_payment_audit: 221302,
  /** 抖音开票批量导出开票 */
  shake_tone_billed_export: 220707,
  /** 收入结算 - 修改账期 */
  edit_income_account_period: 220403,
  /** 成本结算 - 修改账期 */
  edit_cost_account_period: 221203,
};

/** 法务管理 */
const LawRightCodeMap = {
  /** 法务管理 查看 */
  law_legal_view: 230000,
  /** 合同管理 查看 */
  law_contract_view: 230102,
  /** 合同管理 */
  law_contract_list: 230100,
  /** 回收合同 */
  law_contract_retrieve: 230101,
  /** 模版管理 查看 */
  law_contract_template_view: 230201,
  /** 模版管理 */
  law_contract_template_list: 230200,
  /** 模版管理操作 */
  law_contract_template_retrieve: 230202,
  /** 合同统计 查看 */
  law_statistics_contract_view: 230301,
  /** 合同统计*/
  law_statistics_contract_list: 230300,
  /** 用印记录菜单 */
  use_seal_record: 230400,
  /** 用印记录查看 */
  use_seal_record_view: 230401,
  /** 合同扫描件审核 */
  law_verify_contract_scan: 230103,
  /** 合同看板 查看*/
  law_contract_kanban: 230501,
  /** 合同附件上传 */
  upload_attachment: 230104,
  /** 合同台账 */
  law_contract_ledger: 230601,
  /** 合同台账导出 */
  law_contract_ledger_export: 230602,
  /** 查看通用合同 */
  law_contract_general: 230701,
};

/** 招商管理 */
const InvestmentRightCodeMap = {
  /** 查看结算数据 */
  merchant_settlement_view: 310201,
  /** 删除结算 */
  merchant_settlement_del: 310202,
  /** 结算确认 */
  merchant_settlement_confirmed: 310203,
  /** 核销 */
  merchant_settlement_write_off: 310204,
  /** 收款 */
  merchant_settlement_collection: 310205,
  /** 开票 */
  merchant_settlement_invoice: 310206,
  /** 查看全部结算数据 */
  merchant_settlement_view_all: 310207,
  /** 统一结算 */
  merchant_unity: 310301,
};

/** 客户管理 */
const CustomerRightCodeMap = {
  /** 客户管理 */
  customer: 240000,
  /** 业绩登记表 查看 */
  achievement_view: 161009,
  /** 新增业绩 */
  achievement_create: 161002,
  /** 修改业绩 */
  achievement_edit: 161003,
  /** 删除业绩 */
  achievement_delete: 161004,
  /** 客户列表 */
  customer_list: 240100,
  /** 店铺管理 */
  shop_list: 240101,
  /** 新增客户 */
  customer_create: 240102,
  /** 删除客户 */
  customer_delete: 112003,
  /** 修改客户 */
  customer_edit: 240102,
  /** 导出客户 */
  customer_export: 112005,
  /** 公司管理 */
  company_list: 240201,
  /** 新增管理 */
  company_create: 240202,
  /** 删除公司 */
  company_delete: 112103,
  /** 修改公司 */
  company_edit: 240202,
  /** 导出公司 */
  company_export: 112105,
  /** 查看洽谈记录 */
  negotiation_list: 114001,
  /** 新增洽谈记录 */
  negotiation_create: 114002,
  /** 修改 洽谈记录 */
  negotiation_edit: 114003,
  /** 删除洽谈记录 */
  negotiation_delete: 114004,
  /** 查看客户合作 */
  customer_collaboration_list: 160001,
  /** 新增客户合作 */
  customer_collaboration_create: 160002,
  /** 修改客户合作 */
  customer_collaboration_edit: 160003,
  /** 删除客户合作 */
  customer_collaboration_delete: 160004,
  /** 查看跟单 163001 */
  /** 新增跟单 163002 */
  /** 修改跟单 163003 */
  /** 删除跟单 163004 */
};

/** 供应商管理 */
const SupplierRightCodeMap = {
  /** 供应商列表 */
  supplier_list: 250100,
  /** kol 库 */
  kol_list: 250101,
  /** 新增kol */
  kol_create: 250102,
  /** 修改kol */
  kol_edit: 250102,
  /** 删除kol */
  kol_delete: 121004,
  /** 导出kol */
  kol_export: 121005,
  /** kol审核 */
  kol_approval: 250103,
  /** 详情页中编辑 **/
  kol_edit_in_detail: 250102,
  /** 查看达人敏感信息 */
  kol_star_key_info_view: 250104,
  /** 公司库 */
  supplier_company_list: 250201,
  /** 新增公司 */
  supplier_company_create: 250202,
  /** 修改公司 */
  supplier_company_edit: 250202,
  /** 删除公司 */
  supplier_company_delete: 120004,
  /** 导出公司 */
  supplier_company_export: 120005,
  /** 主播查看列表权限- 查看 **/
  supplier_anchor_list: 250312,
  /** 主播 新增/编辑详情 **/
  supplier_anchor_detail: 250301,
  /** 主播 查看直播经验 **/
  supplier_anchor_view_experience: 250302,
  /** 主播-其他信息权限 **/
  supplier_anchor_other_base: 250303,
  /** 主播-历史合作权限 **/
  supplier_anchor_cooperation: 250304,
  /** 主播 审核 **/
  supplier_anchor_check: 250307,
  /** 主播 删除 **/
  supplier_anchor_delete: 250308,
  /** 查看主播隐私信息 **/
  view_anchor_key_info: 250309,
  /** 新增/编辑主播维护人 **/
  save_anchor_maintainer: 250310,
  /** 主播签约权限 */
  supplier_kol_sign_contract: 250311,
  /** 模特管理列表**/
  supplier_model_list: 250500,
  /** 添加模特**/
  supplier_model_add: 250501,
  /** 查看模特**/
  supplier_model_show: 250502,
  /** 添加完整模特**/
  supplier_model_show_all: 250503,
  /** 删除模特 */
  supplier_model_delete: 250504,
};

/** 公共管理 */
const PublicRightCodeMap = {
  /** 品牌管理 查看 */
  brand_view: 240301,
  /** 品牌管理 */
  brand_list: 240300,
  /** 新增/编辑品牌 */
  brand_save: 240302,
  /** 删除品牌 */
  brand_delete: 240303,
  // /** 直播间管理 查看 */
  // studio_view: 270202,
  // /** 直播间管理 */
  // studio_list: 270200,
  // /** 新增/编辑直播间 */
  // studio_save: 270201,
  /** 商品信息管理 */
  commodity_information_manager_view: 320500,
  /** 商品信息上传 */
  commodity_information_manager_update: 320502,
  /** 商品信息删除 */
  commodity_information_manager_delete: 320503,
  /** 商品信息编辑 */
  commodity_information_manager_edit: 320504,
  /** 全网热销监控 */
  commodity_hot_sale_manager: 320601,
  /** 对公账户 */
  // public_account: 270500,
  // /** 对公账户查看 */
  // public_account_view: 270501,
  // /** 新增编辑*/
  // public_account_edit: 270502,
};

/** 系统设置 */
const SystemRightCodeMap = {
  /** 用户管理 */
  user_list: 280101,
  /** 用户列表导出 */
  user_list_export: 280105,
  /** 新增/编辑用户 */
  // user_save: 280102,
  /** 用户授权 */
  userAuthorization: 280103,
  /** 系统消息管理 */
  system_news_list: 280301,
  /** 费用类别编辑 **/
  ending_category_edit: 280501,
  /** 数据统计 **/
  datacenter_statistics_view: 280400,
  /* 批量授权 */
  batchAuthorization_view: 280104,
};

/** 标签管理 */
const TagManagementRightCode = {
  /** 标签管理 路由 */
  tag_role_router: 270300,
  /** 标签管理 查 */
  tag_role_read: 270301,
  /** 标签管理 增/改 */
  tag_role_update: 270302,
  /** 标签管理 删 */
  tag_role_delete: 270303,
};
//数据中心
const DataCenterRightCode = {
  // 数据中心
  datacenter_view: 300000,
  // 创新项目
  datacenter_dataMCN_view: 300601,
  // 营销业务
  datacenter_dataMarket_view: 300701,

  // 商品分析- 查看
  datacenter_commodity_analyze_view: 320101,
  // 商品分析监控- 查看
  datacenter_monitor_analyze_view: 320101,
  // 商品大盘分析- 查看
  datacenter_market_analysis: 320201,
  // 竞品分析- 查看
  datacenter_competitor_analysis: 320301,
  // 商品分析
  dataAnalysis: 320000,
  // ctr数据分析 已废弃
  ctr_shop_live_report: 301000,
  // 品牌中心
  datacenter_shop_live: 300801,
  // 商品培训管理
  trainingManage_view: 320701,
  trainingManage_edit: 320702,
  trainingManage_delete: 320703,
  trainingManage_export: 320704,
  /** 短视频测款-查看 */
  short_video_test_view: 320801,
  /** 隐藏 **/
  short_video_test_private: 320802,
  /** 关联 **/
  short_video_test_relation: 320803,
  /** 效果跟进 **/
  short_video_test_follow_up: 320804,
  /** 编辑颜色归类 **/
  edit_color_classify: 320102,
  /** 库存售罄监控 */
  inventory_sold_out_monitoring: 320103,
};
// MCN 管理
const McnRightCodeMap = {
  /**查看直播场次 */
  mcn_shop_live_view: 260105,
  // 新增/编辑直播场次
  mcn_save_shop_live: 260106,
  // 已归档编辑权限
  mcn_lived_edit_shop_live: 260118,
};
// 财务报表
const financialReportMap = {
  // 财务报表
  financial_report: 500100,
  financial_report_view: 500101,
  // 经营看板
  financial_dashboard: 500201,
  // 损益表
  financial_profit_loss_statement: 500301,
  // 资金报表
  fund_statement: 500400,
  // 资金看板
  fund_dashboard_view: 500401,
  // 资金日报
  fund_daily_report_view: 500402,
  // 资金年报
  fund_year_report_view: 500403,
  // 理财台账
  financal_standing_book_view: 500404,
  financal_standing_book_register: 500405,
  // 项目资金报表
  project_fund_statement_view: 500406,
  // 部门资金报表
  department_fund_statement_view: 500407,
  // 待支付明细
  pending_pay_detail_view: 500408,
  // 待认领收入
  pending_claim_income_view: 500409,
  //  收支明细- 查看
  fincialStatements_report_view: 500501,
  //  预收预付- 查看
  fincialStatements_prepaid_view: 500601,
  // 日支出报表- 查看
  fincialStatements_dailyCost_view: 500701,
};

// 绩效管理
const performanceMap = {
  // 绩效管理
  performance_management: 600000,
  // -----------指标库 ---------------
  // 指标库
  indicators_library: 600100,
  // 指标库查看
  indicators_library_view: 600101,
  // 指标库新增编辑
  indicators_library_edit: 600104,
  // 指标删除
  indicators_library_delete: 600105,
  // 移动指标库
  indicators_library_move: 600106,
  // 指标标签/新增/编辑
  indicators_library_tag_edit: 600102,
  // 指标标签/删除
  indicators_library_tag_delete: 600103,

  //-----------考评组-----------------
  evaluation_group: 600200,
  //考评组查看
  evaluation_group_view: 600201,
  // 考评组新增/编辑/复制
  evaluation_group_edit: 600202,
  // 考评组删除
  evaluation_group_delete: 600203,

  // --------------考核管理--------------
  assessment_management: 600300,
  //查看
  assessment_management_view: 600301,
  // 发起考核
  assessment_management_start: 600302,
  // 考核等级设置
  assessment_management_level: 600304,
  // 发起评分
  assessment_management_score: 600305,
  // 调整等级和结果
  assessment_management_result: 600306,
  // 重置流程
  assessment_management_process: 600307,
  // 转交考核
  assessment_management_transfer: 600311,
  // 上传绩效奖金
  assessment_management_bonus: 600312,
  // 跳过考核
  assessment_skipAssessment: 600314,
  // 考核结果分析
  performance_report_analysis: 600400,
  // 考核结果分析查看
  performance_report_analysis_view: 600401,
  // 考核结果分析导出
  performance_report_analysis_view_export: 600402,
  // 员工绩效归档
  performance_report_performance: 600500,
  // 查看
  performance_report_performance_view: 600501,
  // 公示结果
  assessment_publicity_result: 600308,
  // 逾期重启
  restart_overdue: 600309,
  // 批量重置
  batch_reset: 600313,
  // 导出考核
  export_assessment_detail: 600310,
  // 实施监控流程查看
  implement_monitor_process: 600701,
  // 实施监控流程导出
  implement_monitor_process_export: 600702,
  // 述职管理
  debriefing_manage: 600800,
  // 述职管理查看
  debriefing_manage_view: 600801,
  // 述职管理新增
  debriefing_manage_edit: 600802,
  // --------------绩效报表----------
  // performance_report: 700000,
  // // 考核结果分析
  // performance_report_analysis: 700100,
  // // 考核结果分析查看
  // performance_report_analysis_view: 700101,
  // // 考核结果分析导出
  // performance_report_analysis_view_export: 700102,
  // // 员工绩效归档
  // performance_report_performance: 700200,
  // // 查看
  // performance_report_performance_view: 700201,
  //导出
  // performance_report_performance_export: 700202,

  handle_appeal: 600601,
};

// 企业中台
const BusinessSupport = {
  // 企业中台
  image_design: 700000,
  // 查看
  image_design_view: 700101,
  // 导出
  image_design_export: 700102,
  // CTR数据分析
  view_shop_live_ctr: 700201,
  // 直播画面监控
  live_screen_monitoring_view: 700901,
  // 预约日期设置
  appointment_date_setting: 700103,
  // 主播招募- 查看
  anchor_recruit: 700501,
  // 视觉设计
  design_order: 700300,
  // 平面设计查看
  design_order_view: 700301,
  // 平面设计分配
  design_order_allot: 700302,
  // 项目完成平面设计
  complete_design_order: 700305,
  // 活动取消平面设计
  cancel_design_order: 700306,
  // 平面设计审核
  design_order_audit: 700303,
  // 平面设计审核意见
  design_order_audit_opinion: 700304,
  // 视觉设计
  design_order_setting: 700400,
  // 平面设计设置查看
  design_order_setting_type_view: 700401,
  // 平面设计设置新增
  design_order_setting_type_edit: 700402,
  // 平面设计设置部门
  design_order_setting_department_edit: 700403,
  // 视觉设计统计
  design_order_statistics: 701001,
};

// 积分商城
const PointsMall = {
  // '查看(可查看列表和M币明细M币明细)
  mb_view: 700601,
  // 发放/扣除'
  mb_send_less_m: 700602,
  // 编辑
  mb_edit: 700603,
  // 查看商品
  mb_good_view: 700701,
  // 新增/编辑商品
  mb_good_edit: 700702,
  // 查看兑换明细
  mb_good_exchange_record_view: 700703,
  // 完成/退还
  mb_goodexchange_record_edit_: 700704,
  // 查看赠送明细
  mb_good_present_record_view: 700705,
  // 赠送审核
  mb_good_present_record_audit: 700706,
  // 赠送明细导出
  mb_good_present_record_export: 700707,
};
// 每日资讯
const dailyInformation = {
  // 查看
  dailyInformation_view: 700801,
  // 设置
  dailyInformation_edit_set: 700802,
  // 推送
  dailyInformation_push_msg: 700803,
  // 删除
  dailyInformation_delete: 700804,
};
// 固定资产
const fixedAsset = {
  // 资产管理查看
  fixedAssetManage_view: 1000101,
  fixedAssetUse: 1000201,
  //资产类型设置
  fixedAssetTypeSetting_view: 1000301,
  // 资产费用
  fixedAssetCost_view: 1000401,
  // 资产盘点
  fixedAssetInventory_view: 1000501,
  // 资产统计
  fixedAssetStatistics_view: 1000601,
};
// 行业资讯
const strategicInformation = {
  // 查看
  strategicInformation_view: 900101,
  // 设置
  strategicInformation_setting: 900102,
};
export const RIGHT_CODE = {
  ...dailyInformation,
  ...WorkbenchRightCodeMap,
  ...financialReportMap,
  /** 营销业务 项目管理 */
  ...MarketingProjectRightCodeMap,
  /** 营销业务 合同列表 */
  ...MarketingRightCodeMap,
  /** 营销业务 业绩登记表 */
  ...AchievementRightCodeMap,
  /** 营销业务 成本安排表 */
  ...CostRightCodeMap,
  /** 营销业务 反点安排表 */
  ...RebateRightCodeMap,
  ...McnRightCodeMap,
  ...fixedAsset,
  // /** 营销业务 需求管理 */
  // ...DemandRightCodeMap,
  // /** 营销业务 场次管理 */
  // ...DisplayRightCodeMap,
  // /** 营销业务 商品管理 */
  // ...ProductRightCodeMap,
  /** 导入日志 */
  import_logs_view: 140001,
  import_logs_list: 140001,
  /** 通用业务 */
  ...CommonBusinessRightCodeMap,
  /** 店铺代播 项目管理 */
  ...LiveProjectRightCodeMap,
  /** 店铺代播 供应链 */
  ...SupplyChainRightCodeMap,
  /** 店铺代播 直播场次 */
  ...LiveDisplayRightCodeMap,
  /** 本地生活 项目管理 */
  ...LocalLifeProjectRightCodeMap,
  ...ManagementRightCodeMap,
  /** 销售管理 */
  ...SalesRightCodeMap,
  /** 财务管理 */
  ...FinanceRightCodeMap,
  /** 法务管理 */
  ...LawRightCodeMap,
  /** 客户管理 */
  ...CustomerRightCodeMap,
  /** 招商管理 */
  ...InvestmentRightCodeMap,
  /** 供应商管理 */
  ...SupplierRightCodeMap,
  /** 公共管理 */
  ...PublicRightCodeMap,
  /** 系统管理 */
  ...SystemRightCodeMap,
  /** 标签管理 */
  ...TagManagementRightCode,
  ...DataCenterRightCode,
  ...performanceMap,
  ...BusinessSupport,
  ...PointsMall,
  ...strategicInformation,
};

export const RightCodeSet = new Set();

Object.entries(RIGHT_CODE).map((item, _) => {
  RightCodeSet.add(item[1]);
});
