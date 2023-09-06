/*
 * @Author: 矢车
 * @Date: 2020-11-21 14:39:55
 * @LastEditors: 矢车
 * @LastEditTime: 2020-11-21 16:51:11
 * @Description:
 */
/**
 * 工作台 mutations
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-21 09:54:36
 */
import { WorkbenchState } from './state';
import * as Types from './types';
import { parse } from '@/utils/func';
import { ApprovalInfo } from '@/types/tiange/workbench';

const mutations = {
  /**
   * 保存审批单详情
   * @author  Jerry <superzcj_001@163.com>
   * @since   2020-11-21 09:54:50
   */
  [Types.SET_APPROVAL]: (state: WorkbenchState, payload: ApprovalInfo) => {
    state.approval = parse(payload);
  },
  /**
   * 清除审批单详情
   * @author  Jerry <superzcj_001@163.com>
   * @since   2020-11-21 23:51:58
   */
  [Types.CLEAR_APPROVAL]: (state: WorkbenchState) => {
    state.approval = undefined;
  },
  /** 设置用款审批表单弹层可见 */
  [Types.SET_LOAN_FORM_VISIBLE]: (state: WorkbenchState, payload: boolean) => {
    state.loanFormVisible = payload;
  },
  /** 设置用款审批详情弹层可见 */
  [Types.SET_LOAN_DETAIL_VISIBLE]: (state: WorkbenchState, payload: boolean) => {
    state.loanDetailVisible = payload;
  },
  /** 设置退款审批表单弹层可见 */
  [Types.SET_REFUND_FORM_VISIBLE]: (state: WorkbenchState, payload: boolean) => {
    state.refundFormVisible = payload;
  },
  /** 设置退款审批详情弹层可见 */
  [Types.SET_REFUND_DETAIL_VISIBLE]: (state: WorkbenchState, payload: boolean) => {
    state.refundDetailVisible = payload;
  },
  /** 设置客户审批单详情弹层可见 */
  [Types.SET_CUSTOMER_DETAIL_VISIBLE]: (state: WorkbenchState, payload: boolean) => {
    state.customerDetailVisible = payload;
  },
  /** 设置供应商审批单详情弹层可见 */
  [Types.SET_SUPPLIER_DETAIL_VISIBLE]: (state: WorkbenchState, payload: boolean) => {
    state.supplierDetailVisible = payload;
  },
  /** 设置退款审批表单弹层可见 */
  [Types.SET_ADVANCE_FORM_DIALOG_VISIBLE]: (state: WorkbenchState, payload: boolean) => {
    state.advanceFormDialogVisible = payload;
  },
  /** 设置垫款审批表单弹层可见 */
  [Types.SET_ADVANCE_FORM_VISIBLE]: (state: WorkbenchState, payload: boolean) => {
    state.advanceFormVisible = payload;
  },
  /** 设置垫款审批详情弹层可见 */
  [Types.SET_ADVANCE_DETAIL_VISIBLE]: (state: WorkbenchState, payload: boolean) => {
    state.advanceDetailVisible = payload;
  },
  /** 设置开票审批表单弹层可见 */
  [Types.SET_INVOICING_FORM_VISIBLE]: (state: WorkbenchState, payload: boolean) => {
    state.invoicingFormVisible = payload;
  },
  /** 设置开票审批详情弹层可见 */
  [Types.SET_INVOICING_DETAIL_VISIBLE]: (state: WorkbenchState, payload: boolean) => {
    state.invoicingDetailVisible = payload;
  },
  /** 设置红票审批详情弹层可见 */
  [Types.SET_RED_DETAIL_VISIBLE]: (state: WorkbenchState, payload: boolean) => {
    state.redDetailVisible = payload;
  },
  /** 设置作废审批详情弹层可见 */
  [Types.SET_VOID_DETAIL_VISIBLE]: (state: WorkbenchState, payload: boolean) => {
    state.voidDetailVisible = payload;
  },
  /** 设置用印审批详情弹层可见 */
  [Types.SET_USE_SEAL_DETAIL_VISIBLE]: (state: WorkbenchState, payload: boolean) => {
    state.useSealApplyDetailVisible = payload;
  },
  [Types.SET_PROJECT_APPROVAL_VISIBLE]: (state: WorkbenchState, payload: boolean) => {
    state.projectApprovalVisible = payload;
  },
  /** 设置项目终止审批弹层可见 */
  [Types.SET_PROJECT_END_VISIBLE]: (state: WorkbenchState, payload: boolean) => {
    state.projectEndDetailVisible = payload;
  },
  /** 设置固定资产审批弹层可见 */
  [Types.SET_ASSET_SCRAPPED_VISIBLE]: (state: WorkbenchState, payload: boolean) => {
    console.log('--------');
    state.assetScrappedDetailVisible = payload;
  },
};

export default mutations;
