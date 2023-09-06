/**
 * 工作台 getters
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-21 10:09:42
 */

import { WorkbenchState } from './state';

export const approval = (state: WorkbenchState) => state.approval;
export const loanFormVisible = (state: WorkbenchState) => state.loanFormVisible;
export const loanDetailVisible = (state: WorkbenchState) => state.loanDetailVisible;
export const refundFormVisible = (state: WorkbenchState) => state.refundFormVisible;
export const refundDetailVisible = (state: WorkbenchState) => state.refundDetailVisible;
export const advanceFormDialogVisible = (state: WorkbenchState) => state.advanceFormDialogVisible;
export const advanceFormVisible = (state: WorkbenchState) => state.advanceFormVisible;
export const advanceDetailVisible = (state: WorkbenchState) => state.advanceDetailVisible;
export const customerDetailVisible = (state: WorkbenchState) => state.customerDetailVisible;
export const supplierDetailVisible = (state: WorkbenchState) => state.supplierDetailVisible;
