/**
 * 工作台 getters
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-21 10:21:46
 */
import { ApprovalInfo } from '@/types/tiange/workbench';

export interface WorkbenchState {
  /** 审批单详情*/
  approval: ApprovalInfo | undefined;
  /** 用款表单是否可见 */
  loanFormVisible: boolean;
  /** 用款详情是否可见 */
  loanDetailVisible: boolean;
  /** 退款表单是否可见 */
  refundFormVisible: boolean;
  /** 退款详情是否可见 */
  refundDetailVisible: boolean;
  // 立项审批是否可见
  projectApprovalVisible: boolean;
  /** 垫款表单是否可见 */
  advanceFormDialogVisible: boolean;
  /** 垫款表单是否可见 */
  advanceFormVisible: boolean;
  /** 垫款详情是否可见 */
  advanceDetailVisible: boolean;
  /** 开票表单是否可见 */
  invoicingFormVisible: boolean;
  /** 开票详情是否可见 */
  invoicingDetailVisible: boolean;
  /** 客户结算单详情是否可见 */
  customerDetailVisible: boolean;
  /** 供应商结算单详情是否可见 */
  supplierDetailVisible: boolean;
  /** 红票详情是否可见 */
  redDetailVisible: boolean;
  voidDetailVisible: boolean;
  useSealApplyDetailVisible: boolean;
  projectEndDetailVisible: boolean;
  /** 资产审批 */
  assetScrappedDetailVisible: boolean;
}

/**
 * 工作台 state
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-21 09:50:36
 */
const state: WorkbenchState = {
  approval: undefined,
  loanFormVisible: false,
  loanDetailVisible: false,
  refundFormVisible: false,
  refundDetailVisible: false,
  advanceFormDialogVisible: false,
  advanceFormVisible: false,
  advanceDetailVisible: false,
  invoicingFormVisible: false,
  invoicingDetailVisible: false,
  customerDetailVisible: false,
  supplierDetailVisible: false,
  redDetailVisible: false,
  voidDetailVisible: false,
  useSealApplyDetailVisible: false,
  projectApprovalVisible: false,
  projectEndDetailVisible: false,
  assetScrappedDetailVisible: false,
};

export default state;
