/**
 *@description: 财务管理-->收支明细 api
 *@author: 棠棣
 *@since: 2021/1/28 16:19
 */
import qs from 'query-string';
import { getToken } from '@/utils/token';

// 导出列表
export function ExportList(params: Record<string, any>) {
  const _paramsstr = qs.stringify(params);
  const token = getToken();
  window.open(
    `${process.env.VUE_APP_BASE_API}/api/financial/export_pay_detail_list?${_paramsstr}&Authorization=${token}`,
  );
}
