import { Get } from '@/utils/request';
import type { ListResponse } from '@/types/base/http';
import type { FinancePayDetail } from '@/types/tiange/finance/finance';
import { ObjectFilterEmpty } from '@/utils/func';

/**
 * 获取支出明细
 */
export const GetIncomeList = async (
  payload: Record<string, any>,
): Promise<ListResponse<FinancePayDetail>> =>
  Get('/api/financial/query_pay_detail_list', { params: { ...ObjectFilterEmpty(payload) } });
