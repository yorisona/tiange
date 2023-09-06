import { QUERY_USE_SEALS } from '@/apis/legal';
import { ListResponse, HttpResponse } from '@/types/base/http';
import { QueryUseSealsParams, UseSealsModel } from '@/types/tiange/legal';
import { ObjectFilterEmpty } from '@/utils/func';
import { Get, Post } from '@/utils/request';

// 非合同用印飞书申请列表
export const QueryUseSeals = async (
  payload: QueryUseSealsParams,
): Promise<ListResponse<UseSealsModel>> =>
  Get(QUERY_USE_SEALS, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 修改用印申请
export const update_use_seal = async (payload: any): Promise<HttpResponse<any>> =>
  Post('/api/approval/update_use_seal', {
    ...ObjectFilterEmpty(payload),
  });
