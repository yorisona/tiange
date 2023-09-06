/*
 * @Description:
 * @Autor: 神曲
 * @Date: 2020-04-02 14:13:48
 * @LastEditors: 神曲
 * @LastEditTime: 2020-04-16 10:37:59
 */
// @ts-nocheck
/**
 * 工作台模块
 */
import request from '@/utils/request';
// import qs from 'query-string'

//获取审批流程人员
/**
 * {@link src/services/workbentch.ts | GetApprovalStream}
 * @deprecated
 */
export function getApprovalStream(params) {
  return request({
    url: '/api/approval/get_approval_stream',
    method: 'get',
    params,
  });
}

/**
 * 用款申请保存
 * @deprecated
 */
export function saveTransferApply(data) {
  return request({
    url: '/api/approval/save_transfer_apply',
    method: 'post',
    data,
  });
}
//获取审批列表
/** @deprecated 获取审批列表 */
export function queryApprovalList(params) {
  return request({
    url: '/api/approval/query_approval_list',
    method: 'get',
    params,
  });
}
// 获取审批详情
/** @deprecated 获取审批详情 */
export function queryTransferApplyInfo(params) {
  return request({
    url: '/api/approval/query_approval_info',
    method: 'get',
    params,
  });
}

/** @deprecated --审批-- 撤销 同意 拒绝 */
export function updateTransferApplyInfo(data) {
  return request({
    url: '/api/approval/update_approval_info',
    method: 'post',
    data,
  });
}

/**
 * 退款申请保存
 * @deprecated
 */
export function saveRefundApply(data) {
  return request({
    url: '/api/approval/save_refund_apply',
    method: 'post',
    data,
  });
}
/**
 * 获取所有业绩编号
 * @deprecated
 * @see {@link /src/services/coop.ts}
 */
export function queryAchievementUid(params) {
  return request({
    url: '/api/coop/query_achievement_uid',
    method: 'get',
    params,
  });
}
/**
 * 获取合同编号
 * ```
 * 迁移到 GetContractUid
 * ```
 * @deprecated
 * @see {@link /src/services/cont.ts}
 */
export function queryContractUid(params) {
  return request({
    url: '/api/cont/query_contract_uid',
    method: 'get',
    params,
  });
}

// 借款申请上传附件和图片
export function uploadAttachment(data) {
  return request({
    url: '/api/approval/upload_attachment',
    method: 'post',
    data,
  });
}
// 保存开票申请
export function saveInvoiceApply(data) {
  return request({
    url: '/api/approval/save_invoice_apply',
    method: 'post',
    data,
  });
}
// 获取开票申请详情
export function queryInvoiceApply(params) {
  return request({
    url: '/api/approval/query_invoice_apply',
    method: 'get',
    params,
  });
}
// 获取借款申请详情
export function saveBorrowingApply(data) {
  return request({
    url: '/api/approval/save_borrowing_apply',
    method: 'post',
    data,
  });
}
