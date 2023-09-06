/**
 * 工作台 actions
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-21 10:03:28
 */

import { ApprovalInfo } from '@/types/tiange/workbench';
import { ActionContext } from 'vuex';
import { WorkbenchState } from './state';
import * as Types from './types';

type Action = ActionContext<WorkbenchState, Record<string, Record<string, any>>>;

export const setApproval = ({ commit }: Action, payload: ApprovalInfo) => {
  commit(Types.SET_APPROVAL, payload);
};

export const setLoanFormVisible = ({ commit }: Action, payload: boolean) => {
  commit(Types.SET_LOAN_FORM_VISIBLE, payload);
};

export const setLoanDetailVisible = ({ commit }: Action, payload: boolean) => {
  commit(Types.SET_LOAN_DETAIL_VISIBLE, payload);
};

export const setRefundFormVisible = ({ commit }: Action, payload: boolean) => {
  commit(Types.SET_REFUND_FORM_VISIBLE, payload);
};

export const setRefundDetailVisible = ({ commit }: Action, payload: boolean) => {
  commit(Types.SET_REFUND_DETAIL_VISIBLE, payload);
};
export const setCustomerDetailVisible = ({ commit }: Action, payload: boolean) => {
  commit(Types.SET_CUSTOMER_DETAIL_VISIBLE, payload);
};

export const setSupplierDetailVisible = ({ commit }: Action, payload: boolean) => {
  commit(Types.SET_SUPPLIER_DETAIL_VISIBLE, payload);
};

export const setAdvanceFormDialogVisible = ({ commit }: Action, payload: boolean) => {
  commit(Types.SET_ADVANCE_FORM_DIALOG_VISIBLE, payload);
};

export const setAdvanceFormVisible = ({ commit }: Action, payload: boolean) => {
  commit(Types.SET_ADVANCE_FORM_VISIBLE, payload);
};

export const setAdvanceDetailVisible = ({ commit }: Action, payload: boolean) => {
  commit(Types.SET_ADVANCE_DETAIL_VISIBLE, payload);
};

export const setInvoicingFormVisible = ({ commit }: Action, payload: boolean) => {
  commit(Types.SET_INVOICING_FORM_VISIBLE, payload);
};

export const setInvoicingDetailVisible = ({ commit }: Action, payload: boolean) => {
  commit(Types.SET_INVOICING_DETAIL_VISIBLE, payload);
};

export const setRedDetailVisible = ({ commit }: Action, payload: boolean) => {
  commit(Types.SET_RED_DETAIL_VISIBLE, payload);
};

export const setVoidDetailVisible = ({ commit }: Action, payload: boolean) => {
  commit(Types.SET_VOID_DETAIL_VISIBLE, payload);
};

export const setUseSealApplyDetailVisible = ({ commit }: Action, payload: boolean) => {
  commit(Types.SET_USE_SEAL_DETAIL_VISIBLE, payload);
};
export const setProjectApprovalVisible = ({ commit }: Action, payload: boolean) => {
  commit(Types.SET_PROJECT_APPROVAL_VISIBLE, payload);
};
export const setProjectEndDetailVisible = ({ commit }: Action, payload: boolean) => {
  commit(Types.SET_PROJECT_END_VISIBLE, payload);
};
export const setAssetScrappedDetailVisible = ({ commit }: Action, payload: boolean) => {
  commit(Types.SET_ASSET_SCRAPPED_VISIBLE, payload);
};
