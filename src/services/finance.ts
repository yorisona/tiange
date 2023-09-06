/*
 * @Author: 肖槿
 * @Date: 2021-05-20 17:24:17
 * @Description: 财务结算
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-28 10:10:23
 * @FilePath: \goumee-star-frontend\src\services\finance.ts
 */
import { Delete, Get, Post } from '@/utils/request';
import * as APIs from '@/apis/finance';
import { ListResponse, HttpResponse } from '@/types/base/http';
import {
  refuseParams,
  receivableParams,
  receivableList,
  payableParams,
  PayableOrder,
  BankAccount,
  DailyCostQueryParams,
  DailyCostModel,
  DashboardChartCommonParams,
  DashboardOverviewModel,
  DashboardLaborEffectModel,
  DashboardSunburstDataModel,
  DashboardGMVTrendModel,
  ProfitMarginStatisticsModel,
  ProfitLossStatementModel,
  OperatingProjectModel,
  FinanceOverviewModel,
  FinancePieModel,
  FinanceTrendsModel,
  FinanceAccountDetailModel,
  CapitalDailyReportModel,
  RevenueFlowParams,
  RevenueFlowModel,
  ClaimRevenueFlowParams,
  BankTemplateModel,
  BankTemplateParams,
  PendingIncomeClaimModel,
  UnpaidCostParams,
  UnpaidCostModel,
  ProjectFundParams,
  ProjectFundModel,
  DepartmentFundModel,
  FinancialLedgerParams,
  FinancialLedgerModel,
  AddFinancialLedgerParams,
  CapitalYearReportModel,
  AccountType,
  AccountPeriodModel,
  AccountPeriodParams,
  CloseAccountPeriodParams,
  InvoiceArchiveApprovalParams,
  AddSettlementAllocatedParams,
} from '@/types/tiange/finance/finance';
import { ObjectFilterEmpty } from '@/utils/func';
import {
  ConfirmReverseParams,
  FinancialReverseParams,
  ReverseAgainParams,
} from '@/types/tiange/finance/settlement';
import { IGPageQuery } from '@/types/tiange/general';
import qs from 'query-string';

/** 不通过结算 */
export const RefuseSettlement = async ({
  id,
  refuse_reason,
}: refuseParams): Promise<HttpResponse<undefined>> =>
  Post(APIs.POST_REFUSE_SETTLEMENT.replace(':id', `${id}`), {
    refuse_reason,
  });

/** 收入结算 - 确认结算 */
export const ApproveSettlement = async (
  id: number,
  payload: {
    account_detail_date: string;
  },
): Promise<HttpResponse<boolean>> =>
  Get(APIs.GET_APPROVE_SETTLEMENT.replace(':id', `${id}`), {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 成本结算 - 确认结算 */
export const ApproveCostSettlement = async (
  id: number,
  payload: {
    account_detail_date: string;
  },
): Promise<HttpResponse<boolean>> =>
  Get(`/api/settlement/approve_cost_settlement/${id}`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 不通过成本结算 */
export const RefuseCostSettlement = ({
  id,
  refuse_reason,
}: refuseParams): Promise<HttpResponse<boolean>> =>
  Post(`/api/settlement/refuse_cost_settlement/${id}`, { refuse_reason });

// 获取应收列表
export const GetFinancialReceivables = async (
  payload: receivableParams,
): Promise<ListResponse<receivableList>> =>
  Get(APIs.QUERY_FINANCIAL_RECEIVABLES, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 获取应付列表
export const GetFinancialPayable = async (
  payload: payableParams,
): Promise<ListResponse<PayableOrder>> =>
  Get(APIs.QUERY_FINANCIAL_PAYABLES, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 冲销部分

/**
 * 发起冲销
 * @author  Jerry <jerry.hz.china@gmail.com>
 */
export const FinancialReverse = async (
  payload: FinancialReverseParams,
): Promise<HttpResponse<null>> => Post('/api/financial/reverse', payload);

/**
 * 重新发起冲销
 * @author  Jerry <jerry.hz.china@gmail.com>
 */
export const FinancialReverseAgain = async (
  payload: ReverseAgainParams,
): Promise<HttpResponse<null>> => Post('/api/financial/reverse_again', payload);

/**
 * 确认冲销
 * @author  Jerry <jerry.hz.china@gmail.com>
 */
export const ConfirmReverse = async (payload: ConfirmReverseParams): Promise<HttpResponse<null>> =>
  Post('/api/financial/confirm_reverse', {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 招商确认冲销
 */
export const ConfirmMerchantReverse = async (
  payload: ConfirmReverseParams,
): Promise<HttpResponse<null>> =>
  Post('/api/financial/merchant_confirm_reverse', {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 构美银行行号列表
 */
export const GetOurBankAccounts = async (payload?: {
  // 0启用，1停用
  status?: 0 | 1;
  // 0 显示全部，1 过滤煜丰
  is_show?: 0 | 1;
  bank_type?: AccountType;
}): Promise<HttpResponse<BankAccount[]>> =>
  Get('/api/financial/query_our_bank_accounts', {
    params: {
      ...ObjectFilterEmpty(payload ?? {}),
    },
  });

// 日支出报表
export const GetDailyCostList = async (
  payload: DailyCostQueryParams,
): Promise<ListResponse<DailyCostModel>> =>
  Get(APIs.QUERY_DAILY_COST, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/**
 * 手动录入支出
 */
export const FinancialAddManuallyPayInfo = async (
  payload: ConfirmReverseParams,
): Promise<HttpResponse<null>> =>
  Post('/api/financial/add_manually_pay_info', {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 手动录入支出
 */
export const FinancialFinancialQueryAllProject = async (
  pager: IGPageQuery,
  payload: { project_name: string },
): Promise<HttpResponse<any>> =>
  Get('/api/financial/query_all_project', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });

// 经营看板-看板首页 数据概览接口
export const QueryOperationOverview = async (
  payload: DashboardChartCommonParams,
): Promise<HttpResponse<DashboardOverviewModel>> =>
  Get(APIs.QUERY_OPERATING_OVERVIEW, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
// 经营看板-看板首页 GMV占比旭日图接口
export const QueryGmvSunburst = async (
  payload: DashboardChartCommonParams,
): Promise<HttpResponse<DashboardSunburstDataModel[]>> =>
  Get(APIs.QUERY_GMV_SUNBURST, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
// 经营看板-看板首页 GMV趋势接口
export const QueryGmvTrend = async (
  payload: DashboardChartCommonParams,
): Promise<HttpResponse<DashboardGMVTrendModel>> =>
  Get(APIs.QUERY_GMV_TREND, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
// 经营看板-看板首页 利润率统计
export const QueryProfitMarginStatistics = async (
  payload: DashboardChartCommonParams,
): Promise<HttpResponse<ProfitMarginStatisticsModel>> =>
  Get(APIs.QUERY_PROFIT_MARGIN_STATISTICS, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
// 经营看板-看板首页 人效趋势接口
export const QueryLaborEfficiencyTrend = async (
  payload: DashboardChartCommonParams,
): Promise<HttpResponse<DashboardLaborEffectModel>> =>
  Get(APIs.QUERY_LABOR_EFFICIENCY_TREND, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
// 经营看板-看板首页 项目分布气泡图接口
export const QueryProjectDistributionBubble = async (
  payload: DashboardChartCommonParams,
): Promise<HttpResponse<any>> =>
  Get(APIs.QUERY_PROJECT_DISTRIBUTION_BUBBLE, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 经营看板 GMV目标率
export const QueryProjectGMVCompletionRate = async (payload: {
  second_department_id?: string | number | undefined;
  third_department_id?: string | number | undefined;
  start_date: string;
  end_date: string;
}): Promise<HttpResponse<any>> =>
  Get(APIs.QUERY_PROJECT_GMV_COMPLETION_RATE, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 经营看板 GMV目标率趋势
export const QueryProjectGMVCompletionTrend = async (payload: {
  second_department_id?: string | number | undefined;
  third_department_id?: string | number | undefined;
  start_date: string;
  end_date: string;
}): Promise<HttpResponse<any>> =>
  Get(APIs.QUERY_PROJECT_GMV_COMPLETION_TREND, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 经营看板 收入成本利润旭日图
export const QueryProjectPercentSunburst = async (
  payload: DashboardChartCommonParams,
  type: number,
): Promise<HttpResponse<any>> => {
  if (type === 2) {
    return Get(APIs.QUERY_PROJECT_PERCENT_SUNBURST_COST, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  } else if (type === 1) {
    return Get(APIs.QUERY_PROJECT_PERCENT_SUNBURST_INCOME, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  } else {
    return Get(APIs.QUERY_PROJECT_PERCENT_SUNBURST_PROFIT, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
};

// 经营看板 收入成本利润趋势图
export const QueryProjectTeamTrend = async (
  payload: DashboardChartCommonParams,
  type: number,
): Promise<HttpResponse<any>> => {
  if (type === 2) {
    return Get(APIs.QUERY_PROJECT_TEAM_TREND_COST, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  } else if (type === 1) {
    return Get(APIs.QUERY_PROJECT_TEAM_TREND_INCOME, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  } else {
    return Get(APIs.QUERY_PROJECT_TEAM_TREND_PROFIT, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
};

// 经营看板 收入成本利润明细
export const QueryProjectTeamTrendDetail = async (
  payload: DashboardChartCommonParams,
  type: number,
): Promise<HttpResponse<any>> => {
  if (type === 2) {
    return Get(APIs.QUERY_PROJECT_TEAM_TREND_DETAIL_COST, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  } else if (type === 1) {
    return Get(APIs.QUERY_PROJECT_TEAM_TREND_DETAIL_INCOME, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  } else if (type === 3) {
    return Get(APIs.QUERY_PROJECT_TEAM_TREND_DETAIL_PROFIT, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  } else {
    return Get(APIs.QUERY_PROJECT_TEAM_TREND_DETAIL_GMV, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
};

// 损益表-获取项目接口
export const QueryOperatingProjects = async (payload: {
  department_id?: number | undefined;
  department_ids?: string;
  project_name?: string;
}): Promise<HttpResponse<OperatingProjectModel[]>> =>
  Get(APIs.QUERY_OPERATING_PROJECTS, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 损益表接口
export const QueryProfitLossDetail = async (payload: {
  start_date: string | number | undefined;
  end_date: string;
  project_ids: string | undefined;
  department_id?: number | undefined;
  department_ids?: string;
}): Promise<HttpResponse<ProfitLossStatementModel>> =>
  Get(APIs.QUERY_PROFIT_LOSS_DETAIL, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
// 损益表-导出
export const ExportProfitLoss = (params: Record<string, any>) => {
  const props = ObjectFilterEmpty(params);
  const _paramsstr = qs.stringify(props);
  return Get(`/api/data_center/operating/profit_loss_detail/export_special_type?${_paramsstr}`);
};
// 资金看板-数据概览
export const FinanceOverview = async (): Promise<HttpResponse<FinanceOverviewModel>> =>
  Get(APIs.FINANCE_OVERVIEW);

// 资金看板-账户余额饼图
export const FinancePie = async (): Promise<HttpResponse<FinancePieModel[]>> =>
  Get(APIs.FINANCE_PIE);

// 资金看板-年度收支明细
export const FinanceTrends = async (): Promise<HttpResponse<FinanceTrendsModel>> =>
  Get(APIs.FINANCE_TRENDS);

// 资金看板-账户列表
export const FinanceAccountDetail = async (): Promise<HttpResponse<FinanceAccountDetailModel[]>> =>
  Get(APIs.FINANCE_ACCOUNT_DETAILS);

// 资金日报
export const CapitalDailyReport = async (payload: {
  start_date: string | undefined;
  end_date: string | undefined;
  bank_id: number | undefined;
  company_name: string | undefined;
  kind: number | undefined;
  department_id: number | undefined;
  project_name: string | undefined;
  account_subject_id: number | undefined;
}): Promise<ListResponse<CapitalDailyReportModel>> =>
  Get(APIs.CAPITAL_DAILY_REPORT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 资金年报
export const CapitalYearReport = async (): Promise<HttpResponse<CapitalYearReportModel>> =>
  Get(APIs.CAPITAL_YEAR_REPORT);

// 资金报表-理财台账查询
export const QueryFinancialLedger = async (
  payload: FinancialLedgerParams,
): Promise<ListResponse<FinancialLedgerModel>> =>
  Get(APIs.QUERY_FINANCIAL_LEDGER, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 资金报表-理财台账买入/赎回
export const AddFinancialLedger = async (
  payload: AddFinancialLedgerParams,
): Promise<ListResponse<undefined>> =>
  Post(APIs.ADD_FINANCIAL_LEDGER, {
    ...ObjectFilterEmpty(payload),
  });

// 资金报表-理财台账删除
export const DeleteFinancial = async (id: number | undefined): Promise<ListResponse<undefined>> =>
  Delete(`${APIs.DELETE_FINANCIAL_LEDGER}/${id}`);

// 资金报表-项目资金报表
export const QueryProjectFund = async (
  payload: ProjectFundParams,
): Promise<ListResponse<ProjectFundModel>> =>
  Get(APIs.QUERY_PROJECT_FUND, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 资金报表-部门资金报表
export const QueryDepartmentFund = async (): Promise<
  HttpResponse<{ data: DepartmentFundModel[] }>
> => Get(APIs.QUERY_DEPARTMENT_FUND);

// 资金报表-待支付明细
export const QueryUnpaidCost = async (
  payload: UnpaidCostParams,
): Promise<ListResponse<UnpaidCostModel>> =>
  Get(APIs.QUERY_UNPAID_COST, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 资金报表-待认领收入
export const PendingIncomeClaim = async (
  payload: BankTemplateParams,
): Promise<ListResponse<PendingIncomeClaimModel>> =>
  Get(APIs.PENDING_INCOME_CLAIM, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 收入流水查询 - 带权限
export const QueryRevenueFlow = async (
  payload: RevenueFlowParams,
): Promise<ListResponse<RevenueFlowModel>> =>
  Get(APIs.QUERY_REVENUE_FLOW, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
// 收入流水详情-收款
export const GetSettlementRevenueFlowDetail = async (
  id: number,
): Promise<HttpResponse<RevenueFlowModel>> =>
  Get(`${APIs.GET_SETTLEMENT_REVENUE_FLOW_DETAIL}/${id}`);

// 收入流水查询 - 不带权限
export const QuerySettlementRevenueFlow = async (
  payload: RevenueFlowParams,
): Promise<ListResponse<RevenueFlowModel>> =>
  Get(APIs.QUERY_SETTLEMENT_REVENUE_FLOW, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 收入流水详情
export const GetRevenueFlowDetail = async (id: number): Promise<HttpResponse<RevenueFlowModel>> =>
  Get(`${APIs.GET_REVENUE_FLOW_DETAIL}/${id}`);

// 收入流水认领
export const ClaimRevenueFlow = async (
  payload: ClaimRevenueFlowParams,
): Promise<ListResponse<undefined>> =>
  Post(APIs.CLAIM_REVENUE_FLOW, {
    ...ObjectFilterEmpty(payload),
  });

// 收入流水删除
export const DeleteRevenueFlowDetail = async (
  id: number,
): Promise<ListResponse<RevenueFlowModel>> => Delete(`${APIs.DELETE_REVENUE_FLOW_DETAIL}/${id}`);

// 收入流水银行模板下载链接
export const BankTemplate = async (payload: {
  // 0 显示所有， 1 过滤煜丰
  is_show: 0 | 1;
}): Promise<HttpResponse<BankTemplateModel[]>> =>
  Get(APIs.BANK_TEMPLATE, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 上传文件
export const ParseBankExcelData = (data: any): Promise<HttpResponse<undefined>> =>
  Post(APIs.PARSE_BANK_EXCEL_DATA, data);

// 查询关闭账期
export const QueryAccountPeriod = async (
  payload: AccountPeriodParams,
): Promise<ListResponse<AccountPeriodModel>> =>
  Get(APIs.QUERY_ACCOUNT_PERIOD, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 关闭账期
export const CloseAccountPeriod = async (
  payload: CloseAccountPeriodParams,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.CLOSE_ACCOUNT_PERIOD, {
    ...ObjectFilterEmpty(payload),
  });

// 发票归档审批
export const InvoiceArchiveApproval = async (
  payload: InvoiceArchiveApprovalParams,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.INVOICE_ARCHIVE_APPROVAL, {
    ...ObjectFilterEmpty(payload),
  });

// 查询预收接口登记
export const QueryDepositRecevied = async (
  pager: IGPageQuery,
  payload: any,
): Promise<ListResponse<Record<string, any>>> =>
  Get('/api/deposit_received/financial/query_deposit_recevied', {
    params: ObjectFilterEmpty({
      ...payload,
      ...pager,
    }),
  });

// 查询预收核销接口
export const QueryDepositReceviedWriteOff = async (
  pager: IGPageQuery,
  payload: any,
): Promise<ListResponse<Record<string, any>>> =>
  Get('/api/deposit_received/financial/query_deposit_recevied_write_off', {
    params: ObjectFilterEmpty({
      ...payload,
      ...pager,
    }),
  });

// 预收管理-预收核销审核接口
export const AuditDepositReceviedWriteOff = async (payload: {
  audit_status: number;
  achievement_id: number;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/deposit_received/financial/audit_deposit_recevied_write_off', {
    ...ObjectFilterEmpty(payload),
  });
// 预收管理-审核预收接口
export const AuditDepositRecevied = async (payload: {
  audit_status: number;
  id: number;
  audit_reason?: string;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/deposit_received/financial/audit_deposit_recevied', {
    ...ObjectFilterEmpty(payload),
  });

// 财务管理-预收管理-审核预收冲销接口
export const AuditReverseDepositRecevied = async (payload: {
  operate_status: number; //1: 已通过 0: 不通过
  id: number;
  reverse_audit_reason?: string;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/deposit_received/financial/audit_reverse_deposit_recevied', {
    ...ObjectFilterEmpty(payload),
  });

// 新增费用分摊
export const AddSettlementAllocated = async (
  payload: AddSettlementAllocatedParams,
): Promise<HttpResponse<undefined>> =>
  Post('/api/financial/add_settlement_allocated', {
    ...ObjectFilterEmpty(payload),
  });

// 费用分摊历史
export const query_allocated_add_history = async (
  pager: IGPageQuery,
  payload?: any,
): Promise<HttpResponse<any>> =>
  Get('/api/financial/query_allocated_add_history', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...(payload || {}),
      }),
    },
  });

// 已导入人力成本的月份
export const ImprotedEmployeeNumMonth = async (
  type: 'all' | 'rent',
  payload?: any,
): Promise<HttpResponse<any>> =>
  Get(
    type === 'all'
      ? '/api/financial/imported_employee_num_month'
      : '/api/financial/query_allocated_rent_month',
    {
      params: {
        ...ObjectFilterEmpty(payload || {}),
      },
    },
  );

/** 收入、成本结算 - 账期结算 */
export const EditApproveCostSettlement = async (
  payload: {
    account_month: string;
    settlement_id: number;
  },
  type = 1,
): Promise<HttpResponse<boolean>> => {
  /** 1为收入，2为成本 */
  if (type === 1) {
    return Post('/api/settlement_account/income/modify_account_period', {
      ...ObjectFilterEmpty(payload),
    });
  }
  return Post('/api/settlement_account/cost/modify_account_period', {
    ...ObjectFilterEmpty(payload),
  });
};
