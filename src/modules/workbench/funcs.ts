/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-03-28 16:05:28
 */
import { APPROVAL_TYPE } from '@/types/tiange/workbench.enum';

export const approvalType2Text = (type: number) => {
  switch (type) {
    case APPROVAL_TYPE.loan:
      return '对外付款';
    case APPROVAL_TYPE.refund:
      return '退款申请';
    case APPROVAL_TYPE.advance:
      return '垫款申请';
    case APPROVAL_TYPE.invoicing:
      return '开票申请';
    case APPROVAL_TYPE.customer:
      return '客户结算单';
    case APPROVAL_TYPE.supplier:
      return '供应商结算单';
    case APPROVAL_TYPE.red:
      return '开红票申请';
    case APPROVAL_TYPE.void:
      return '发票作废申请';
    case APPROVAL_TYPE.use_seal:
      return '非合同类用印';
    case APPROVAL_TYPE.project_approval:
      return '立项审批';
    case APPROVAL_TYPE.project_end:
      return '项目终止审批';
    case APPROVAL_TYPE.asset_scrapped:
      return '固定资产审批';
    default:
      return '--';
  }
};

export const approvalType2AmountText = (type: number) => {
  switch (type) {
    case APPROVAL_TYPE.loan:
      return '用款金额';
    case APPROVAL_TYPE.refund:
      return '退款金额';
    case APPROVAL_TYPE.advance:
      return '垫款金额';
    case APPROVAL_TYPE.invoicing:
      return '开票金额';
    case APPROVAL_TYPE.customer:
      return '结算单金额';
    case APPROVAL_TYPE.supplier:
      return '结算单金额';
    case APPROVAL_TYPE.void:
      return '作废原因';
    case APPROVAL_TYPE.red:
      return '开红票原因';
    case APPROVAL_TYPE.use_seal:
      return '用印金额';
    case APPROVAL_TYPE.project_end:
      return '项目终止';
    case APPROVAL_TYPE.asset_scrapped:
      return '资产报废';
    default:
      return '--';
  }
};
