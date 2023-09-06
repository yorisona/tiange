import request, { Get, Post } from '@/utils/request';
import type { HttpResponse, ListResponse } from '@/types/base/http';
import type { FinancePayDetail } from '@/types/tiange/finance/finance';
import { ObjectFilterEmpty } from '@/utils/func';
import qs from 'query-string';
import { getToken } from '@/utils/token';

/**
 * 获取费用分摊明细
 */
export const GetCostShareList = async (
  payload: Record<string, any>,
): Promise<ListResponse<FinancePayDetail>> =>
  Get('/api/financial/query_settlement_allocated', { params: { ...ObjectFilterEmpty(payload) } });

// 保存分摊费用
export const SaveCostShare = async (
  payload: Record<string, any>,
): Promise<HttpResponse<undefined>> =>
  Post('/api/financial/upload_allocated_file', {
    ...ObjectFilterEmpty(payload),
  });

// 编辑分摊费用
export const EditCostShare = async (
  payload: Record<string, any>,
): Promise<HttpResponse<undefined>> =>
  Post('/api/financial/update_settlement_allocated', {
    ...ObjectFilterEmpty(payload),
  });

// 删除分摊费用
export const DeleteCostShare = async (
  payload: Record<string, any>,
): Promise<HttpResponse<undefined>> =>
  Post('/api/financial/batch_delete_settlement_allocated', {
    ...ObjectFilterEmpty(payload),
  });

// 获取所有项目
export function getProjectids(params: any) {
  return request({
    url: '/api/shop_live/query_all_project',
    method: 'get',
    params,
  });
}

// 费用分摊 导出
export const ExportCostSharingReport = (params: Record<string, any>) => {
  const props = ObjectFilterEmpty(params);
  const _paramsstr = qs.stringify(props);
  const token = getToken();
  window.open(
    `${process.env.VUE_APP_BASE_API}/api/financial/export_settlement_allocated?${_paramsstr}&Authorization=${token}`,
  );
};
