/**
 * 协同模块接口请求
 */
// @ts-nocheck
import { HttpResponse } from '@/types/base/http';
import request, { Post } from '@/utils/request';
import { getToken } from '@/utils/token';
import qs from 'query-string';
import { ObjectFilterEmpty } from '@/utils/func';
// 洽谈 start

// 保存洽谈记录
export async function saveConversation(data) {
  return request({
    url: '/api/cust/save_conversation',
    method: 'post',
    data,
  });
}

// 获取洽谈记录
export function getConversation(params) {
  return request({
    url: '/api/cust/query_conversation',
    method: 'get',
    params,
  });
}

// 删除洽谈记录
export function deleteConversation(data) {
  return request({
    url: '/api/cust/del_conversation',
    method: 'post',
    data,
  });
}

// 洽谈 end

// 合作 start

// 获取合作记录
export function getCooperation(params) {
  return request({
    url: '/api/coop/query_cooperation',
    method: 'get',
    params,
  });
}

// 获取合作详情
export function getCooperationDetail(params) {
  return request({
    url: '/api/coop/query_cooperation',
    method: 'get',
    params,
  });
}

// 保存合作
export function saveCooperation(data) {
  return request({
    url: '/api/coop/save_cooperation',
    method: 'post',
    data,
  });
}

// 删除合作
export function deleteCooperation(data) {
  return request({
    url: '/api/coop/del_cooperation',
    method: 'post',
    data,
  });
}

// 上传文件
export const uploadFile = (data): Promise<HttpResponse<{ size: number; source: string }>> =>
  Post('/api/resources/upload_file', data);

// 确认合作
export function confirmCooperation(data) {
  return request({
    url: '/api/coop/confirm_cooperation',
    method: 'post',
    data,
  });
}

// 合作 end

// 业绩 start

// 获取业绩编号
export function getAchievementUid() {
  return request({
    url: '/api/coop/get_achievement_uid',
    method: 'get',
  });
}

// 上传凭证
// certificate/achievement_gather_certificate # 业绩收款凭证
// certificate/achievement_invoice_certificate # 业绩开票凭证
// certificate/cost_invoice_certificate # 成本开票凭证
// certificate/cost_pay_certificate # 成本打款凭证
// certificate/rebate_pay_certificate # 返点打款凭证
/**
 * @deprecated
 * `Please use → src/services/common/other.ts#UploadCertificate`
 */
export function uploadCertificate(data) {
  return request({
    url: '/api/resources/upload_certificate',
    method: 'post',
    data,
  });
}

// 保存业绩
export function saveAchievement(data) {
  return request({
    url: '/api/coop/save_achievement',
    method: 'post',
    data,
  });
}

// 获取业绩列表
export function getAchievementList(params) {
  return request({
    url: '/api/coop/query_achievement',
    method: 'get',
    params,
  });
}

// 删除业绩
export function deleteAchievement(data) {
  return request({
    url: '/api/coop/del_achievement',
    method: 'post',
    data,
  });
}

// 导出业绩
export function exportAchievement(params) {
  const _paramsstr = qs.stringify(params);
  const token = getToken();
  window.open(
    `${process.env.VUE_APP_BASE_API}/api/coop/export_achievement?${_paramsstr}&Authorization=${token}`,
  );
}

// 获取某个合作的所有业绩编号
export function getAchievementUIdsByCooperation(params) {
  params = { ...params, ...{ num: 10000, page_num: 1 } };
  return request({
    url: '/api/coop/query_achievement',
    method: 'get',
    params,
  });
}
// 获取合作下的所有合同编号
export function getCostContractUid(params) {
  return request({
    url: '/api/cont/query_contract_uid',
    method: 'get',
    params,
  });
}
// 获取合作下的项目
export function getProjectids(params) {
  return request({
    url: '/api/approval/query_all_projects',
    method: 'get',
    params,
  });
}

// 获取合作下的经办人
export function getUserids(params) {
  return request({
    url: '/api/auth/author_contract/query_user_v2',
    method: 'get',
    params,
  });
}
// 获取关联借款审批号
export function getQueryApprovalIdList(params) {
  return request({
    url: '/api/approval/query_approval_id_list',
    method: 'get',
    params,
  });
}
// 业绩end

// 成本start

// 批量添加成本
export function addCostList(data) {
  return request({
    url: '/api/coop/add_cost_list',
    method: 'post',
    data,
  });
}

// 更新成本
export function updateCostList(data) {
  return request({
    url: '/api/coop/update_cost',
    method: 'post',
    data,
  });
}

// 获取成本列表
export function getCostList(params) {
  return request({
    url: '/api/coop/query_cost',
    method: 'get',
    params,
  });
}

// 删除成本
export function deleteCost(data) {
  return request({
    url: '/api/coop/del_cost',
    method: 'post',
    data,
  });
}

// 导出成本
export function exportCost(params) {
  const _paramsstr = qs.stringify(params);
  const token = getToken();
  window.open(
    `${process.env.VUE_APP_BASE_API}/api/coop/export_cost?${_paramsstr}&Authorization=${token}`,
  );
}

// 更新打款
export function updateIsPay(data) {
  return request({
    url: '/api/coop/update_cost_is_pay',
    method: 'post',
    data,
  });
}

// 成本end

// 执行start

// 查询跟单ae
export function getCooperationAE(params) {
  return request({
    url: '/api/coop/query_cooperation_ae',
    method: 'get',
    params,
  });
}

// 保存AE
export function saveAE(data) {
  return request({
    url: '/api/coop/save_cooperation_ae',
    method: 'post',
    data,
  });
}

// 获取当前执行AE的账户金额
export function getCurrentAEAccount(params) {
  return request({
    url: '/api/coop/get_ae_documentary_amount',
    method: 'get',
    params,
  });
}

// 批量添加跟单
export function addDocumentaryList(data) {
  return request({
    url: '/api/coop/add_documentary_list',
    method: 'post',
    data,
  });
}

/** @deprecated 更新跟单 */
export function updateDocumentary(data) {
  return request({
    url: '/api/coop/update_documentary',
    method: 'post',
    data,
  });
}

// 获取跟单列表
export function getDocumentaryList(params) {
  return request({
    url: '/api/coop/query_documentary',
    method: 'get',
    params,
  });
}

/** @deprecated 删除跟单 */
export function deleteDocumentary(data) {
  return request({
    url: '/api/coop/del_documentary',
    method: 'post',
    data,
  });
}

// 结束合作
export function StopCooperation(data) {
  return request({
    url: '/api/coop/confirm_end_cooperation',
    method: 'post',
    data,
  });
}
// 执行end

// 判断任务id是否重复
export function taskIdIsRepeat(params) {
  return request({
    url: '/api/coop/check_task_id_is_repeat',
    method: 'get',
    params,
  });
}

// --返安排点start--

// 查询返点
export function getRebate(params) {
  return request({
    url: '/api/coop/query_rebate',
    method: 'get',
    params,
  });
}
// 保存返点
export function saveRebate(data) {
  return request({
    url: '/api/coop/save_rebate',
    method: 'post',
    data,
  });
}
// 删除返点
export function delRebate(data) {
  return request({
    url: '/api/coop/del_rebate',
    method: 'post',
    data,
  });
}
//更新返点是否打款
export function updateRebateIsPay(data) {
  return request({
    url: '/api/coop/update_rebate_is_pay',
    method: 'post',
    data,
  });
}
// 返点导出
export function exportRebate(params) {
  const _paramsstr = qs.stringify(params);
  const token = getToken();
  window.open(
    `${process.env.VUE_APP_BASE_API}/api/coop/export_rebate?${_paramsstr}&Authorization=${token}`,
  );
}
// --返安排点end--

//保存合同扫描件
export function savaContractCopy(data) {
  return request({
    url: '/api/cont/save_contract_scan',
    method: 'post',
    data,
  });
}
//保存合同扫描件-法务
export function savaContractCopyLegal(data) {
  return request({
    url: '/api/cont/save_contract_scan_legal',
    method: 'post',
    data,
  });
}
// 保存成本打款凭证
export function saveCostPayCertificate(data) {
  return request({
    url: '/api/coop/save_cost_pay_certificate',
    method: 'post',
    data,
  });
}
// 保存成本开票信息
export function saveCostInvoiceList(data) {
  return request({
    url: '/api/coop/save_cost_invoice_list',
    method: 'post',
    data,
  });
}
//保存业绩开票凭证
export function saveAchievementInvoiceList(data) {
  return request({
    url: '/api/coop/save_achievement_invoice_list',
    method: 'post',
    data,
  });
}
//保存业绩收款时间
export function saveAhievementGatherDate(data) {
  return request({
    url: '/api/coop/save_achievement_gather_date',
    method: 'post',
    data,
  });
}

// 获取审批编号
export function queryApprovalIdList(params: {
  //   审批类型 1 用款申请 2 退款申请 3 借款申请 4 发票申请
  approval_type?: number;
  // 审批单编号
  approval_uid?: string;
  // 客户ID
  customer_id?: string;
  // 审批单三级类型，（用款申请：3-对公银行，4-对公支付宝）
  level_three_types?: string;
  // 收款编号
  achievement_id?: string;
}) {
  return request({
    url: '/api/approval/query_approval_id_list',
    method: 'get',
    params: ObjectFilterEmpty(params),
  });
}

// 删除合同扫描件
export function deleteContractScan(data) {
  return request({
    url: '/api/cont/delete_contract_scan',
    method: 'post',
    data,
  });
}

// 获取客户联系人
export function getContact(params) {
  return request({
    url: '/api/cust/query_customer_contact',
    method: 'get',
    params,
  });
}

// 保存客户联系人
export async function saveContact(data) {
  return request({
    url: '/api/cust/save_customer_contact',
    method: 'post',
    data,
  });
}
