/**
 * 营销业务-导入日志
 * @author  wuyou <wuyou@goumee.com>
 * @since   2021-04-12 11:41:00
 */

import * as APIs from '@/apis/marketing.importlog';
import {
  MarketingImportLog,
  MarketingImportLogQueryParams,
} from '@/types/tiange/marketing/importlog';
import { Get } from '@/utils/request';
import { HttpResponse, ListResponse } from '@/types/base/http';
import { ObjectFilterEmpty } from '@/utils/func';

// 导入日志
export const GetMarketingImportLog = async (
  payload: MarketingImportLogQueryParams,
): Promise<ListResponse<MarketingImportLog>> =>
  Get(APIs.MARKETING_IMPORT_LOG_API, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// query star data
export const GetQueryStarData = async (payload: any): Promise<HttpResponse<any>> =>
  Get(APIs.MARKETING_QUERY_STAR_API, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
