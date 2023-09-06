/**
 * 营销业务 - 项目 - 跟单
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-16 00:28:27
 */
import { Get, Post } from '@/utils/request';
import { ObjectFilterEmpty } from '@/utils/func';
import type { HttpResponse, ListResponse } from '@/types/base/http';
import type {
  AE,
  AeDocumentaryAmount,
  AeDocumentaryAmountQueryParams,
  AEListQueryParmas,
  AEOrder,
  AEOrderQueryParams,
  AEOrderSaveParams,
  DeleteAEOrderParams,
} from '@/types/tiange/marketing/ae';

/**
 * 查询跟单AE
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-16 00:48:40
 */
export const GetAEList = async (payload: AEListQueryParmas): Promise<HttpResponse<AE[]>> =>
  Get('/api/coop/query_cooperation_ae', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 获取AE实际跟单金额和预计跟单金额
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-16 00:46:10
 */
export const GetAeDocumentaryAmount = async (
  payload: AeDocumentaryAmountQueryParams,
): Promise<HttpResponse<AeDocumentaryAmount>> =>
  Get('/api/coop/get_ae_documentary_amount', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 获取跟单列表
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-16 00:35:48
 */
export const GetAEOrders = async (payload: AEOrderQueryParams): Promise<ListResponse<AEOrder>> =>
  Get('/api/coop/query_documentary', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 批量新增跟单
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-17 01:18:26
 */
export const SaveAEOrder = async (payload: AEOrderSaveParams[]): Promise<HttpResponse<null>> =>
  Post(
    '/api/coop/add_documentary_list',
    payload.map(el => ({ ...ObjectFilterEmpty(el) })),
  );

/**
 * 删除跟单
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-17 11:51:16
 */
export const DeleteAEOrder = async (payload: DeleteAEOrderParams): Promise<HttpResponse<null>> =>
  Post('/api/coop/del_documentary', payload);

/**
 * 更新跟单
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-22 13:42:50
 */
export const UpdateDocumentary = async (payload: AEOrderSaveParams): Promise<HttpResponse<null>> =>
  Post('/api/coop/update_documentary', {
    ...ObjectFilterEmpty(payload),
  });
