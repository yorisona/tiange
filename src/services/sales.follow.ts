import { ListResponse } from '@/types/base/http';
import { Get } from '@/utils/request';
import * as APIs from '@/apis/sales.follow';
import { ObjectFilterEmpty } from '@/utils/func';
import {
  SalesFollowQueryParams,
  CustomerFollowList,
  SalesFollowAddCustomer,
} from '@/types/tiange/sales.follow';

/** 店铺代播 项目列表 */
export const GetLiveProjectList = async (
  payload: SalesFollowQueryParams,
): Promise<ListResponse<CustomerFollowList>> =>
  Get(APIs.SALES_FOLLOW_LIST_API, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 店铺代播 项目列表 */
export const GetCustomerList = async (
  payload: string,
): Promise<ListResponse<SalesFollowAddCustomer>> =>
  Get(APIs.CUSTOMER_LIST_API, {
    params: {
      mult_args: payload,
    },
  });
