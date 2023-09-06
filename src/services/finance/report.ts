/*
 * @Author: 肖槿
 * @Date: 2021-12-15 14:20:17
 * @Description: 财务明细
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-12-17 15:36:28
 * @FilePath: \goumee-star-frontend\src\services\finance\report.ts
 */
import { Get } from '@/utils/request';
import { ListResponse } from '@/types/base/http';

/** 明细列表 */
export const GetFinanceReport = async (payload: Record<string, any>): Promise<ListResponse<any>> =>
  Get('/api/financial/query_financial_report', { params: payload });

/** 预收列表 */
export const GetFinancePreincome = async (
  payload: Record<string, any>,
): Promise<ListResponse<any>> => Get('/api/financial/query_pre_income_report', { params: payload });

/** 预付列表 */
export const GetFinancePrepay = async (payload: Record<string, any>): Promise<ListResponse<any>> =>
  Get('/api/financial/query_pre_cost_report', { params: payload });

/** 财务快照 */
export const GetFinanceReportSnapshot = async (
  payload: Record<string, any>,
): Promise<ListResponse<any>> =>
  Get('/api/financial/query_financial_report_snapshot', { params: payload });
