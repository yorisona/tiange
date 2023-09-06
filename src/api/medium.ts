// @ts-nocheck
import request from '@/utils/request';
import { getToken } from '@/utils/token';

export function uploadFile(data) {
  return request({
    url: '/api/medium/upload_file',
    method: 'post',
    data: data,
    timeout: 3600000,
  });
}
export function addCompany(data) {
  return request({
    url: '/api/medium/add_company',
    method: 'post',
    data: data,
  });
}
export function updateCompany(data) {
  return request({
    url: '/api/medium/update_company',
    method: 'post',
    data: data,
  });
}
export function queryCompanyList(params) {
  return request({
    url: '/api/medium/query_company_list',
    method: 'get',
    params,
  });
}
export function deleteCompany(data) {
  return request({
    url: '/api/medium/delete_company',
    method: 'post',
    data,
  });
}
export function companyDetail(params) {
  return request({
    url: '/api/medium/company_detail',
    method: 'get',
    params,
  });
}
export function exportCompany(params) {
  const token = getToken();
  window.open(
    `${process.env.VUE_APP_BASE_API}/api/medium/export_company?ids=${params.ids}&Authorization=${token}`,
  );
}

// 个人库相关

// 新增KOL
export function saveKol(data) {
  return request({
    url: '/api/kol/save_kol',
    method: 'post',
    data,
  });
}

/** @deprecated 查询KOL列表/详情 */
export function queryKolList(params) {
  return request({
    url: '/api/kol/query_kol',
    method: 'get',
    params,
  });
}

// 查询KOL列表/详情
export function deleteKol(data) {
  return request({
    url: '/api/kol/delete_kol',
    method: 'post',
    data,
  });
}

// 编辑KOL详情
export function updateKol(data) {
  return request({
    url: '/api/kol/update_kol',
    method: 'post',
    data,
  });
}

// 导出KOL
export function exportKol(params) {
  const token = getToken();
  let str = '';
  for (const key in params) {
    if (params[key]) str += `&${key}=${params[key]}`;
  }
  str = str.substr(1, str.length);
  window.open(`${process.env.VUE_APP_BASE_API}/api/kol/export_kols?${str}&Authorization=${token}`);
}

// 上传案例
export function uploadCase(data) {
  return request({
    url: '/api/kol/upload_case',
    method: 'post',
    data,
  });
}

// 上传照片
export function uploadKolImage(data) {
  return request({
    url: '/api/kol/upload_photo',
    method: 'post',
    data,
  });
}

// 获取所属机构下拉列表
export function getCompanyNameAndId(params) {
  return request({
    url: '/api/medium/get_company_name_and_id',
    method: 'get',
    params,
  });
}

/** @deprecated 查询KOL名称 */
export function queryKolNames() {
  const params = { page: 1, num: 10000 };
  return request({
    url: '/api/kol/query_kol',
    method: 'get',
    params,
  });
}

// 查询所有KOL名称
export function queryAllKolNames(params) {
  return request({
    url: '/api/kol/get_all_kol_id_and_kol_name',
    method: 'get',
    params,
  });
}

// 查询KOL所属机构
export function queryCompanyByKol(params) {
  return request({
    url: '/api/kol/get_kol_company',
    method: 'get',
    params,
  });
}

// 审核KOL信息
export function approvalKol(data) {
  return request({
    url: '/api/kol/approval_kol',
    method: 'post',
    data,
  });
}
