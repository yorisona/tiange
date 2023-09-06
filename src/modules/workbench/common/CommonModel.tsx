import { defineComponent, ref } from '@vue/composition-api';
import LoanDetailModal from '../initiate/loan/detail.vue';
import { useState } from '@/use/vuex';
import { useApprovalInfo } from '../useApprovalInfo';
import RefundDetailModal from '../initiate/refund/detail.vue';
// import ApplicationDialog from '@/views/workbench/application/applicationDialog.vue';
export default defineComponent({
  setup(_, ctx) {
    const approvalInfo = useApprovalInfo(ctx);
    const reloadSymbol = ref(0);
    const workbench = useState(({ workbench }) => workbench);
    const triggerReload = (name: string) => {
      console.group(`${name} trigger reload`);
      reloadSymbol.value++;
      console.groupEnd();
    };
    return {
      approvalInfo,
      workbench,
      triggerReload,
    };
  },
  render(h) {
    const { approvalInfo, workbench, triggerReload } = this;
    const loadDetailProps = {
      props: {
        visible: workbench.loanDetailVisible,
        approval: workbench.approval,
      },
      on: {
        'dialog:close': approvalInfo.onLoanDetailClose,
        close: approvalInfo.onLoanDetailClose,
        'reload:loan': triggerReload,
      },
    };
    const refundDetailProps: any = {
      props: {
        visible: workbench.refundFormVisible,
        approval: workbench.approval,
        on: {
          'dialog:close': approvalInfo.onRefundDetailClose,
          close: approvalInfo.onRefundDetailClose,
          'loan:edit': approvalInfo.onRefundEdit,
          'reload:refund': () => this.triggerReload('refund'),
        },
      },
    };

    return (
      <div>
        {/*用款申请详情弹框 */}
        <LoanDetailModal {...loadDetailProps} />
        {/*退款申请详情弹框 */}
        <RefundDetailModal {...refundDetailProps} />
        {/*垫款申请详情弹框*/}
        {/*<ApplicationDialog />*/}
      </div>
    );
  },
});
