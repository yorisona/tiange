/**
 * @description: 财务管理-->收款管理 api
 * @author: 棠棣
 * @since: 2021/1/28 16:19
 * ! 需要迁移
 */
import request from '@/utils/request';
import qs from 'query-string';
import { getToken } from '@/utils/token';

/**
 * 收款列表
 * @deprecated 已迁移 services/finance/receive
 */
export { GetReceiveList } from '@/services/finance/receive';

// 收款确认
export function ReceiveConfirm(data: Record<string, any>) {
  return request({
    url: '/api/financial/update_collection',
    method: 'post',
    data: data,
  });
}

// 导出列表
export function ExportList(params: Record<string, any>) {
  const _paramsstr = qs.stringify(params);
  const token = getToken();
  window.open(
    `${process.env.VUE_APP_BASE_API}/api/financial/export_collection?${_paramsstr}&Authorization=${token}`,
  );
}

// 收款管理--编辑、上传开票凭证
export function UploadInvoice(data: Record<string, any>) {
  return request({
    url: '/api/coop/save_collection_invoice',
    method: 'post',
    data: data,
  });
}
