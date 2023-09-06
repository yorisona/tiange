import { HttpResponse } from '@/types/base/http';
import { BankAccount } from '@/types/tiange/finance/finance';
import { ObjectFilterEmpty } from '@/utils/func';
import { Get } from '@/utils/request';

/**
 * 收款列表
 */
export const GetReceiveList = async (params: Record<string, any>): Promise<any> =>
  Get('/api/financial/query_collection', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });

/**
 * 获取收款银行账号
 */
export const GetBankAccountList = async (
  gather_way: number,
): Promise<HttpResponse<BankAccount[]>> =>
  Get('/api/financial/query_receive_account', { params: { gather_way } });
