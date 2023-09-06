/*
 * @Author: 肖槿
 * @Date: 2021-05-21 10:24:42
 * @Description: 项目管理结算url
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-26 09:46:05
 * @FilePath: \goumee-star-frontend\src\apis\finance.ts
 */
/** 不通过结算 */
export const POST_REFUSE_SETTLEMENT = '/api/settlement/refuse_settlement/:id';

/** 通过结算 */
export const GET_APPROVE_SETTLEMENT = '/api/settlement/approve_settlement/:id';

/** 财务管理应收列表 */
export const QUERY_FINANCIAL_RECEIVABLES = '/api/receivable/query_financial_receivables';
// 财务管理应付列表
export const QUERY_FINANCIAL_PAYABLES = '/api/payable/query_financial_payables';

/**
 * 发票管理
 */
// 发票列表
export const GET_FINANCIAL_INVOICE_LIST = '/api/financial/query_invoice';
// 发票管理-统计数据
export const GET_FINANCIAL_INVOICE_STATISTICS = '/api/financial/get_invoice_statistics';

export const QUERY_PROJECT_UID = '/api/shop_live/query_project_uid';

// 作废发票
export const ABOLISH_FINANCIAL_INVOICE = '/api/financial/void_invoice';

// 核销发票
export const WRITE_OFF_INVOICE = '/api/financial/write_off_invoice';

// 开红票
export const RED_INVOICE_APPROVAL = '/api/financial/red_invoice_approval';

// 上传发票
export const UPLOAD_INVOICE_APPROVAL = '/api/financial/upload_invoice_approval';
// 日支出报表
export const QUERY_DAILY_COST = '/api/financial/query_daily_pay';

// 经营看板-看板首页 数据概览接口
export const QUERY_OPERATING_OVERVIEW = '/api/data_center/operating/overview';
// 经营看板-看板首页 GMV旭日图占比接口
export const QUERY_GMV_SUNBURST = '/api/data_center/operating/gmv_percent_sunburst';
// 经营看板-看板首页 GMV趋势接口
export const QUERY_GMV_TREND = '/api/data_center/operating/gmv_team_trend';
// 经营看板-看板首页 利润率统计
export const QUERY_PROFIT_MARGIN_STATISTICS = '/api/data_center/operating/profit_margin_statistics';
// 经营看板-看板首页 人效趋势接口
export const QUERY_LABOR_EFFICIENCY_TREND = '/api/data_center/operating/labor_efficiency_trend';
// 经营看板-看板首页 项目分布气泡图接口
export const QUERY_PROJECT_DISTRIBUTION_BUBBLE =
  '/api/data_center/operating/project_distribution_bubble';
// 经营看板-GMV目标率
export const QUERY_PROJECT_GMV_COMPLETION_RATE = '/api/data_center/operating/gmv_completion_rate';
// 经营看板-GMV目标率趋势
export const QUERY_PROJECT_GMV_COMPLETION_TREND = '/api/data_center/operating/gmv_completion_trend';
// 经营看板-收入成本利润旭日图
export const QUERY_PROJECT_PERCENT_SUNBURST_COST =
  '/api/data_center/operating/cost_percent_sunburst';
export const QUERY_PROJECT_PERCENT_SUNBURST_INCOME =
  '/api/data_center/operating/income_percent_sunburst';
export const QUERY_PROJECT_PERCENT_SUNBURST_PROFIT =
  '/api/data_center/operating/profit_percent_sunburst';
// 经营看板-收入成本利润趋势图
export const QUERY_PROJECT_TEAM_TREND_COST = '/api/data_center/operating/cost_team_trend';
export const QUERY_PROJECT_TEAM_TREND_INCOME = '/api/data_center/operating/income_team_trend';
export const QUERY_PROJECT_TEAM_TREND_PROFIT = '/api/data_center/operating/profit_team_trend';
// 经营看板-成本趋势明细
export const QUERY_PROJECT_TEAM_TREND_DETAIL_COST =
  '/api/data_center/operating/cost_project_detail';
// 经营看板-收入趋势明细
export const QUERY_PROJECT_TEAM_TREND_DETAIL_INCOME =
  '/api/data_center/operating/income_project_detail';
// 经营看板-收入趋势明细
export const QUERY_PROJECT_TEAM_TREND_DETAIL_PROFIT =
  '/api/data_center/operating/profit_project_detail';

// 损益表接口
export const QUERY_PROFIT_LOSS_DETAIL = '/api/data_center/operating/profit_loss_detail';
// 损益表-获取项目接口
export const QUERY_OPERATING_PROJECTS = '/api/shop_live/query_operating_projects';

// 经营看板-GMV趋势明细
export const QUERY_PROJECT_TEAM_TREND_DETAIL_GMV = '/api/data_center/operating/gmv_project_detail';

// 资金看板-数据概览
export const FINANCE_OVERVIEW = '/api/financial/statistics/finance_overview';
// 资金看板-账户余额饼图
export const FINANCE_PIE = '/api/financial/statistics/finance_pie';
// 资金看板-年度收支明细
export const FINANCE_TRENDS = '/api/financial/statistics/finance_trends';
// 资金看板-账户列表
export const FINANCE_ACCOUNT_DETAILS = '/api/financial/statistics/account_details';
// 资金报表-理财台账查询
export const QUERY_FINANCIAL_LEDGER = '/api/financial/financing/query_financial_ledger';
// 资金报表-理财台账买入/赎回
export const ADD_FINANCIAL_LEDGER = '/api/financial/financing/add_financial_ledger';
// 资金报表-理财台账删除
export const DELETE_FINANCIAL_LEDGER = '/api/financial/financing/delete_financial_ledger';
// 资金报表-项目资金报表
export const QUERY_PROJECT_FUND = '/api/financial/statistics/project_project_fund';
// 资金报表-部门资金报表
export const QUERY_DEPARTMENT_FUND = '/api/financial/statistics/department_fund';
// 资金报表-待支付明细
export const QUERY_UNPAID_COST = '/api/financial/statistics/unpaid_cost';
// 资金报表-待认领收入
export const PENDING_INCOME_CLAIM = '/api/financial/statistics/pending_income_claim';

// 资金日报
export const CAPITAL_DAILY_REPORT = '/api/financial/statistics/capital_daily_report';
// 资金年报
export const CAPITAL_YEAR_REPORT = '/api/financial/statistics/capital_year_report';
// 收入流水查询-带权限
export const QUERY_REVENUE_FLOW = '/api/financial/revenue/query_revenue_flow';
// 收入流水查询-不带权限
export const QUERY_SETTLEMENT_REVENUE_FLOW = '/api/settlement/query_revenue_flow';
// 收入流水详情
export const GET_REVENUE_FLOW_DETAIL = '/api/financial/revenue/get_revenue_flow_detail';
// 收入流水详情-收款
export const GET_SETTLEMENT_REVENUE_FLOW_DETAIL = '/api/settlement/get_revenue_flow_detail';

// 收入流水查询
export const CLAIM_REVENUE_FLOW = '/api/financial/revenue/claim_revenue_flow';

// 删除收入流水
export const DELETE_REVENUE_FLOW_DETAIL = '/api/financial/revenue/delete_revenue_flow_detail';

// 收入流水银行模板下载链接
export const BANK_TEMPLATE = '/api/revenue_flow/bank_template';
// 收入流水导入
export const PARSE_BANK_EXCEL_DATA = '/api/financial/parse_bank_excel_data';
// 查询关闭账期
export const QUERY_ACCOUNT_PERIOD = '/api/settlement_account/query_account_period';
// 关闭账期
export const CLOSE_ACCOUNT_PERIOD = '/api/settlement_account/close_account_period';
// 发票归档审批
export const INVOICE_ARCHIVE_APPROVAL = '/api/financial/archive_approval';
