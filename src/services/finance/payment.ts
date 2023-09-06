import { Get } from '@/utils/request';

/** 付款列表 */
export const GetPaymentList = async (payload: Record<string, any>): Promise<any> =>
  Get('/api/financial/query_pay_list', { params: payload });

/** 付款列表-审批记录 */
export const GetPaymentApprovalList = async (payload: Record<string, any>): Promise<any> =>
  Get('/api/financial/query_approval_cost_list', { params: payload });
