/*
 * @Description: 客户模块的接口
 * @Author: 白青
 * @Date: 2019-08-14 16:08:38
 * @LastEditTime: 2022-11-30 10:06:31
 * @LastEditors: Please set LastEditors
 */
import request from '@/utils/request';
import { getToken } from '@/utils/token';
import qs from 'query-string';

/** @deprecated */
export function saveCustomer(data: Record<string, any>) {
  return request({
    url: '/api/cust/save_customer',
    method: 'post',
    data: data,
  });
}

/** @deprecated */
export function delCustomer(params: Record<string, any>) {
  return request({
    url: '/api/cust/del_customer',
    method: 'get',
    params: params,
  });
}

/** @deprecated */
export function queryUserNames(params: Record<string, any>) {
  return request({
    url: '/api/auth/query_user_names',
    method: 'get',
    params: params,
  });
}

/** @deprecated */
export function queryAllUserNames() {
  return request({
    url: '/api/auth/query_user_names',
    method: 'get',
  });
}

/** @deprecated */
export function queryUserNamesByRoles(params: Record<string, any>) {
  return request({
    url: '/api/auth/get_user_by_role',
    method: 'get',
    params: params,
  });
}

/** @deprecated */
export function exportCustomers(params: Record<string, any>) {
  const token = getToken();
  const newparams = { ...params, Authorization: token };
  const qpstr = qs.stringify(newparams, { sort: false });
  window.open(`/api/cust/export_customers?${qpstr}`);
}

// 合同相关
// 上传附件
/** @deprecated */
export function uploadContractAttachment(data: Record<string, any>) {
  return request({
    url: '/api/cont/upload_attachment',
    method: 'post',
    data: data,
  });
}

/**
 * 获取部门
 * @deprecated
 * @see /src/services/auth.ts@GetDepartment
 */
export function getDepartment() {
  return request({
    url: '/api/auth/get_department',
    method: 'get',
  });
}

// 获取角色用户（角色（管理员1，客户执行（AE）0，客户经理2，项目经理3））
/** @deprecated */
export function getRoleUser(params: Record<string, any>) {
  return request({
    url: '/api/auth/query_user',
    method: 'get',
    params: params,
  });
}

// 获取合同审批人
/** @deprecated */
export function getApprover() {
  return request({
    url: '/api/cont/get_approver',
    method: 'get',
  });
}

// 查询合同 1 普通,2法务,3店播
/** @deprecated */
export function queryContract(
  params: Record<string, any>,
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | number = 1,
  isExternal = false,
) {
  const url = isExternal
    ? '/api/cont/query_skip_permissions_contract'
    : type === 1
    ? '/api/cont/query_contract'
    : type === 2
    ? '/api/cont/query_law_contract'
    : type === 4
    ? '/api/cont/query_cooperation_contract'
    : type === 5
    ? '/api/cont/query_common_contract'
    : type === 6
    ? '/api/cont/query_statistic_contract_detail'
    : type === 7
    ? '/api/cont/query_local_life_contract'
    : type === 8
    ? '/api/cont/query_local_life_contract'
    : type === 9
    ? '/api/cont/query_supply_chain_contract'
    : '/api/cont/query_shop_live_contract';
  return request({
    url,
    method: 'get',
    params: params,
  });
}

// 新增合同时，获取合同编号
/** @deprecated */
export function getContractUid() {
  return request({
    url: '/api/cont/get_contract_uid',
    method: 'get',
  });
}
// 获取店铺代播项目合同编号
/** @deprecated */
export function getContractShopUid(params: any = {}) {
  return request({
    url: '/api/shop_live/get_shop_live_contract_uid',
    method: 'get',
    params,
  });
}

// 新增供应商合同时，获取合同编号
/** @deprecated */
export function getSupplierContractUid(params: Record<string, any>) {
  return request({
    url: '/api/cont/get_contract_uid',
    method: 'get',
    params: params,
  });
}

// 导出合同
/** @deprecated */
export function exportContracts(params: Record<string, any>) {
  return request({
    url: '/api/cont/export_contracts',
    method: 'get',
    params: params,
  });
}

// 导出合同
/** @deprecated */
export function deleteContracts(data: Record<string, any>) {
  return request({
    url: '/api/cont/del_contract',
    method: 'post',
    data: data,
  });
}

// 审核合同
/** @deprecated */
export function approveContract(data: Record<string, any>) {
  return request({
    url: '/api/cont/approve_contract',
    method: 'post',
    data: data,
  });
}

// 删除合同
/** @deprecated */
export function deleteContract(data: Record<string, any>) {
  return request({
    url: '/api/cont/del_contract',
    method: 'post',
    data: data,
  });
}

// 删除合同补充协议
/** @deprecated */
export function deleteContractAnnexID(id: number) {
  return request({
    url: `/api/cont/delete_contract_annex/${id}/`,
    method: 'post',
  });
}

// 删除结算单
/** @deprecated */
export function deleteContractStatements(id: number) {
  return request({
    url: `/api/cont/delete_contract_statements/${id}/`,
    method: 'post',
  });
}

// 作废合同
/** @deprecated */
export function invalidContract(data: Record<string, any>) {
  return request({
    url: '/api/cont/invalid_contract',
    method: 'post',
    data: data,
  });
}

// 【风控】设置合同收回状态
/** @deprecated */
export function setContractRecycle(data: Record<string, any>) {
  return request({
    url: '/api/cont/recycle_contract',
    method: 'post',
    data: data,
  });
}

//
/**
 * 获取所有店铺的名称列表
 * @deprecated
 * @see /src/services/customers.ts@QueryShopAndCompany
 */
export function getAllStoreName() {
  return request({
    url: '/api/cust/query_shop_and_company',
    method: 'get',
  });
}

// 根据角色码获取角色列表
/** @deprecated */
export function getUserByRole(params: Record<string, any>) {
  return request({
    url: '/api/auth/get_user_by_role',
    method: 'get',
    params: params,
  });
}

// 获取供应商合同中需要的供应商列表
/** @deprecated */
export function getPartnerList(params: Record<string, any>) {
  return request({
    url: '/api/cont/get_partner_by_name',
    method: 'get',
    params: params,
  });
}

/**
 * 提交保存合同附件
 * @see /src/services/contract.ts
 * @deprecated 已废弃
 */
export function saveContractAnnex(data: Record<string, any>) {
  return request({
    url: '/api/cont/save_contract_annex',
    method: 'post',
    data: data,
  });
}

// 删除合同附件
/** @deprecated */
export function deleteContractAnnex(data: Record<string, any>) {
  return request({
    url: '/api/cont/del_contract_annex',
    method: 'post',
    data: data,
  });
}

// 获取合同附件列表
/** @deprecated */
export function getContractAnnex(params: Record<string, any>) {
  return request({
    url: '/api/cont/query_contract_annex',
    method: 'get',
    params: params,
  });
}

// 审批合同附件
/** @deprecated */
export function approveContractAnnex(data: Record<string, any>) {
  return request({
    url: '/api/cont/approve_contract_annex',
    method: 'post',
    data: data,
  });
}

// 新增合同结算单
/** @deprecated */
export function newContract(data: Record<string, any>) {
  return request({
    url: '/api/cont/save_contract_statements',
    method: 'post',
    data: data,
  });
}

// 合同结算单列表
/** @deprecated */
export function getContractStatement(params: Record<string, any>) {
  return request({
    url: '/api/cont/query_contract_statements',
    method: 'get',
    params: params,
  });
}

// 新审批流程 - 合同
/** @deprecated */
export function getContractApproval(id: number) {
  return request({
    url: `/api/cont/get_contract_approval_flow/${id}/`,
    method: 'get',
  });
}

// 新审批流程 - 补充协议
/** @deprecated */
export function getContractApprovalSupplement(id: number) {
  return request({
    url: `/api/cont/get_contract_annex_approval_flow/${id}/`,
    method: 'get',
  });
}

// 新审批流程 - 结算单
/** @deprecated */
export function getContractApprovalSettlement(id: number) {
  return request({
    url: `/api/cont/get_contract_statements_approval_flow/${id}/`,
    method: 'get',
  });
}
