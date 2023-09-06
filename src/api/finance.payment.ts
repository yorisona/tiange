/**
 *@description: 财务管理-->付款管理 api
 *@author: 棠棣
 *@since: 2021/1/28 16:19
 */
import request, { Post, Get } from '@/utils/request';
import qs from 'query-string';
import { getToken } from '@/utils/token';
import { HttpResponse } from '@/types/base/http';
import { ObjectFilterEmpty } from '@/utils/func';

// 获取项目列表
export function GetProjectList(params: Record<string, any>) {
  return request({
    url: '/api/shop_live/get_shop_live_project_id_list',
    method: 'get',
    params: params,
  });
}

// 导出列表
export function ExportList(params: Record<string, any>) {
  const _paramsstr = qs.stringify(params);
  const token = getToken();
  window.open(
    `${process.env.VUE_APP_BASE_API}/api/financial/export_pay_list?${_paramsstr}&Authorization=${token}`,
  );
}

// 导出列表
export function ApprovalExportList(params: Record<string, any>) {
  const _paramsstr = qs.stringify(params);
  const token = getToken();
  window.open(
    `${process.env.VUE_APP_BASE_API}/api/financial/export_approval_cost_list?${_paramsstr}&Authorization=${token}`,
  );
}
// 成本拆分
export function CostSplit(data: Record<string, any>) {
  return request({
    url: '/api/financial/cost_split',
    method: 'post',
    data: data,
  });
}

// 编辑、上传开票凭证
export function UploadInvoice(data: Record<string, any>) {
  return request({
    url: '/api/financial/save_cost_invoice_list',
    method: 'post',
    data: data,
  });
}

// 确认打款
export function ConfirmPay(data: Record<string, any>) {
  return request({
    url: '/api/financial/confirm_pay',
    method: 'post',
    data: data,
  });
}

// 上传文件
export const UploadFile = (
  data: Record<string, any>,
): Promise<HttpResponse<{ size: number; source: string }>> =>
  Post('/api/resources/upload_certificate', data);

// 关联付款
export function SubmitLinkPayment(data: Record<string, any>) {
  return request({
    url: '/api/financial/associate',
    method: 'post',
    data: data,
  });
}

// 上传文件
export const UploadInvoiceFile = (data: Record<string, any>): Promise<HttpResponse<any>> =>
  Post('/api/financial/save_invoice_tmp', data);

/** 查询待上传的发票金额 */
export const GetAllowInvoiceAmount = async (
  business_type: string,
  params: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Get(`/api/financial/get_allow_invoice_amount/settlement/${business_type}`, {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });

/** 发票管理中查询待上传的发票金额 */
export const InvoiceManagementgetAllowInvoiceAmount = async (params: {
  approval_info_id: string;
}): Promise<HttpResponse<any>> =>
  Get(`/api/financial/get_allow_invoice_amount/approval`, {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });
