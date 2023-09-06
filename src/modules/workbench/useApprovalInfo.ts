/**
 * 申请单详情
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-18 17:16:55
 */
import { reactive, ref, SetupContext, toRefs } from '@vue/composition-api';
import { ApprovalInfo, ApprovalRecord } from '@/types/tiange/workbench';
import { GetApprovalInfo } from '@/services/workbentch';
import { APPROVAL_TYPE } from '@/types/tiange/workbench.enum';
import projectApproval from '@/modules/workbench/initiate/projectApproval/detail.vue';
import { useDialog } from '@/use/dialog';

/**
 * 审批单详情相关
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-19 17:07:26
 */
export const useApprovalInfo = (ctx: SetupContext) => {
  const visibleState = reactive<{
    /** 用款表单是否可见 */
    loanFormVisible: boolean;
    /** 用款详情是否可见 */
    loanDetailVisible: boolean;
    /** 退款表单是否可见 */
    refundFormVisible: boolean;
    /** 退款详情是否可见 */
    refundDetailVisible: boolean;
    /** 垫款表单是否可见 */
    advanceFormDialogVisible: boolean;
    /** 客户结算单详情是否可见 */
    customerDetailVisible: boolean;
    /** 供应商结算单详情是否可见 */
    supplierDetailVisible: boolean;
    /** 红票详情是否可见 */
    redDetailVisible: boolean;
    /** 作废详情是否可见 */
    voidDetailVisible: boolean;
    useSealApplyDetailVisible: boolean;
    projectEndDetailVisible: boolean;
    /** 资产报废详情是否可见 */
    assetScrappedDetailVisible: boolean;
  }>({
    loanFormVisible: false,
    loanDetailVisible: false,
    refundFormVisible: false,
    refundDetailVisible: false,
    advanceFormDialogVisible: false,
    customerDetailVisible: false,
    supplierDetailVisible: false,
    redDetailVisible: false,
    voidDetailVisible: false,
    useSealApplyDetailVisible: false,
    projectEndDetailVisible: false,
    assetScrappedDetailVisible: false,
  });

  /**
   * 用款表单弹窗关闭回调
   * @param {boolean} success 是否保存成功
   */
  const onLoanFormClose = (success: boolean) => {
    visibleState.loanFormVisible = false;

    ctx.root.$store.dispatch('workbench/setLoanFormVisible', false);

    // 保存成功顺便关闭详情页
    if (success) {
      ctx.root.$store.dispatch('workbench/setLoanDetailVisible', false);
    }
  };

  /** 用款详情弹窗关闭回调 */
  const onLoanDetailClose = () => {
    visibleState.loanDetailVisible = false;
    ctx.root.$store.dispatch('workbench/setLoanDetailVisible', false);
  };

  /**
   * 退款表单弹窗关闭回调
   * @param {boolean} success 是否保存成功
   */
  const onRefundFormClose = (success: boolean) => {
    visibleState.refundFormVisible = false;
    ctx.root.$store.dispatch('workbench/setRefundFormVisible', false);
    // 保存成功顺便关闭详情页
    if (success) {
      ctx.root.$store.dispatch('workbench/setRefundDetailVisible', false);
    }
  };

  /** 退款详情弹窗关闭回调 */
  const onRefundDetailClose = () => {
    visibleState.refundDetailVisible = false;
    ctx.root.$store.dispatch('workbench/setRefundDetailVisible', false);
  };

  /** 客户结算单详情弹窗关闭回调 */
  const onCustomerDetailClose = () => {
    visibleState.customerDetailVisible = false;
    ctx.root.$store.dispatch('workbench/setCustomerDetailVisible', false);
  };

  /** 供应商结算单详情弹窗关闭回调 */
  const onSupplierDetailClose = () => {
    visibleState.supplierDetailVisible = false;
    ctx.root.$store.dispatch('workbench/setSupplierDetailVisible', false);
  };

  /**
   * 垫款弹窗关闭回调
   * @param {boolean} success 是否保存成功
   */
  const onAdvanceFormDialogClose = () => {
    visibleState.advanceFormDialogVisible = false;
    ctx.root.$store.dispatch('workbench/setAdvanceFormDialogVisible', false);
  };

  /** 垫款表单弹窗关闭回调 */
  const onAdvanceFormClose = () => {
    visibleState.loanFormVisible = false;
    ctx.root.$store.dispatch('workbench/setAdvanceFormVisible', false);
  };

  /** 垫款详情弹窗关闭回调 */
  const onAdvanceDetailClose = () => {
    visibleState.loanDetailVisible = false;
    ctx.root.$store.dispatch('workbench/setAdvanceDetailVisible', false);
  };

  /** 开票表单弹窗关闭回调 */
  const onInvoicingFormClose = () => {
    visibleState.refundFormVisible = false;
    ctx.root.$store.dispatch('workbench/setInvoicingFormVisible', false);
  };

  /** 开票详情弹窗关闭回调 */
  const onInvoicingDetailClose = () => {
    visibleState.refundDetailVisible = false;
    ctx.root.$store.dispatch('workbench/setInvoicingDetailVisible', false);
  };

  /** 开票详情弹窗关闭回调 */
  const onRedDetailClose = () => {
    visibleState.redDetailVisible = false;
    ctx.root.$store.dispatch('workbench/setRedDetailVisible', false);
  };

  /** 作废详情弹窗关闭回调 */
  const onVoidDetailClose = () => {
    visibleState.voidDetailVisible = false;
    ctx.root.$store.dispatch('workbench/setVoidDetailVisible', false);
  };

  const onUseSeaalDetailClose = () => {
    visibleState.useSealApplyDetailVisible = false;
    ctx.root.$store.dispatch('workbench/setUseSealApplyDetailVisible', false);
  };

  const onProjectDetailClose = () => {
    visibleState.projectEndDetailVisible = false;
    ctx.root.$store.dispatch('workbench/setProjectEndDetailVisible', false);
  };

  const onAssetScrappedDetailClose = () => {
    visibleState.assetScrappedDetailVisible = false;
    ctx.root.$store.dispatch('workbench/setAssetScrappedDetailVisible', false);
  };

  /** 审批单详情 */
  const approvalInfo = ref<ApprovalInfo | undefined>(undefined);

  /** 获取审批单详情 */
  const fetchApprovalInfo = async (approval_id: number) => {
    const { data: response } = await GetApprovalInfo({ approval_id });
    if (response.success) {
      approvalInfo.value = response.data;
      ctx.root.$store.dispatch('workbench/setApproval', response.data);
    } else {
      ctx.root.$message.error(response.message ?? '获取审批详情失败');
    }
    return approvalInfo.value;
  };

  /** 打开详情 */
  const openDetailModal = (approval: any = undefined) => {
    console.log('approval', approval);

    if (approvalInfo.value === undefined || approvalInfo.value === null) {
      return;
    }
    const { approval_type } = approvalInfo.value;
    if (APPROVAL_TYPE.loan === approval_type) {
      ctx.root.$store.dispatch('workbench/setLoanDetailVisible', true);
    } else if (APPROVAL_TYPE.refund === approval_type) {
      ctx.root.$store.dispatch('workbench/setRefundDetailVisible', true);
    } else if (APPROVAL_TYPE.advance === approval_type) {
      ctx.root.$store.dispatch('workbench/setAdvanceDetailVisible', true);
    } else if (APPROVAL_TYPE.invoicing === approval_type) {
      ctx.root.$store.dispatch('workbench/setInvoicingDetailVisible', true);
    } else if (APPROVAL_TYPE.customer === approval_type) {
      ctx.root.$store.dispatch('workbench/setCustomerDetailVisible', true);
    } else if (APPROVAL_TYPE.supplier === approval_type) {
      ctx.root.$store.dispatch('workbench/setCustomerDetailVisible', true);
    } else if (APPROVAL_TYPE.red === approval_type) {
      ctx.root.$store.dispatch('workbench/setRedDetailVisible', true);
    } else if (APPROVAL_TYPE.void === approval_type) {
      ctx.root.$store.dispatch('workbench/setVoidDetailVisible', true);
    } else if (APPROVAL_TYPE.use_seal === approval_type) {
      ctx.root.$store.dispatch('workbench/setUseSealApplyDetailVisible', true);
    } else if (APPROVAL_TYPE.project_approval === approval_type) {
      const dialog = useDialog({
        component: projectApproval,
        title: '立项审批详情',
        disabledOK: false,
        width: '960px',
      });
      dialog.show(approval);
    } else if (APPROVAL_TYPE.project_end === approval_type) {
      console.log('项目完结');
      ctx.root.$store.dispatch('workbench/setProjectEndDetailVisible', true);
    } else if (APPROVAL_TYPE.asset_scrapped === approval_type) {
      ctx.root.$store.dispatch('workbench/setAssetScrappedDetailVisible', true);
    } else {
      ctx.root.$message.warning('未知审批类型，请联系研发部小伙伴！');
    }
  };

  const onLoanEdit = () => {
    ctx.root.$store.dispatch('workbench/setLoanFormVisible', true);
  };

  const onRefundEdit = () => {
    ctx.root.$store.dispatch('workbench/setRefundFormVisible', true);
  };

  const onRowClick = async ({ approval_id }: ApprovalRecord) => {
    const approval = await fetchApprovalInfo(approval_id);
    if (approval) {
      openDetailModal(approval);
    }
  };

  return {
    ...toRefs(visibleState),
    onLoanFormClose,
    onLoanDetailClose,
    onRefundFormClose,
    onRefundDetailClose,
    onAdvanceFormDialogClose,
    onAdvanceFormClose,
    onAdvanceDetailClose,
    onInvoicingFormClose,
    onInvoicingDetailClose,
    onCustomerDetailClose,
    onSupplierDetailClose,
    onUseSeaalDetailClose,
    onRedDetailClose,
    onVoidDetailClose,
    onProjectDetailClose,
    approvalInfo,
    fetchApprovalInfo,
    openDetailModal,
    onLoanEdit,
    onRefundEdit,
    onRowClick,
    onAssetScrappedDetailClose,
  };
};
