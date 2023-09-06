/**
 * 工作台
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-16 10:21:58
 */
import { computed, defineComponent, ref, watch, provide, inject } from '@vue/composition-api';
import { useRouteTabs } from '@/use/tab';
import initate from '@/modules/workbench/initiate';
import TgMine from '@/modules/workbench/mine/list.vue';
import TgWaiting from '@/modules/workbench/waiting/list.vue';
import TgApproved from '@/modules/workbench/approved/list.vue';
import { workbenchStore } from './store';
import { useApprovalInfo } from './useApprovalInfo';
import LoanFormModal from './initiate/loan/form.vue';
import LoanDetailModal from './initiate/loan/detail.vue';
import RefundFormModal from './initiate/refund/form.vue';
import RefundDetailModal from './initiate/refund/detail.vue';
import ApplicationDialog from '@/views/workbench/application/applicationDialog.vue';
import { ApprovalInfo } from '@/types/tiange/workbench';
import ApplicationDetail from '@/views/workbench/application/applicationDetail.vue';
import InvoicesDetail from '@/views/workbench/invoices/invoicesDetail.vue';
import AdvanceDetailDialog from './initiate/advance/detail.vue';
import PaymentDetailDialog from './initiate/payment/detail.vue';
import RefundDetailDialog from '@/modules/marketing/project/dialog/refund/detail.vue';
import CustomerDetailDialog from './initiate/customer/detail.vue';
import Supplier from './initiate/supplier/detail.vue';
import RedDetail from '@/modules/finance/invoice/dialog/invoice.red.detail.vue';
import VoidDetail from '@/modules/finance/invoice/dialog/invoice.void.detail.vue';
import UseSealApplyDetail from '@/modules/finance/invoice/dialog/useSealApplyDetail/index.vue';
import ProjectEnd from '@/modules/finance/invoice/dialog/projectEnd/index.vue';
import assetScrappe from '@/modules/finance/invoice/dialog/assetScrappe/index.vue';

export default defineComponent({
  name: 'TgWorkbench',
  components: {
    initate,
    mine: TgMine,
    waiting: TgWaiting,
    approved: TgApproved,
    LoanFormModal,
    LoanDetailModal,
    PaymentDetailDialog,
    RefundFormModal,
    RefundDetailModal,
    ApplicationDialog,
    ApplicationDetail,
    InvoicesDetail,
    AdvanceDetailDialog,
    RefundDetailDialog,
    CustomerDetailDialog,
    Supplier,
    RedDetail,
    VoidDetail,
    UseSealApplyDetail,
    ProjectEnd,
    assetScrappe,
  },
  setup(propx, ctx) {
    const routes = [
      {
        title: '工作台',
        path: '/workbench',
      },
      {
        title: '我发起的',
        path: '',
      },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const tabs = useRouteTabs(
      ctx,
      [
        {
          label: '发起审批',
          value: 'initate',
        },
        {
          label: '我发起的',
          value: 'mine',
        },
        {
          label: '待我审批',
          value: 'waiting',
        },
        {
          label: '我已审批',
          value: 'approved',
        },
      ],
      'initate',
    );

    // 动态注册vuex子模块
    if (!ctx.root.$store.hasModule('workbench')) {
      ctx.root.$store.registerModule('workbench', workbenchStore);
    }

    const {
      onLoanFormClose,
      onLoanDetailClose,
      onRefundFormClose,
      onRefundDetailClose,
      onAdvanceDetailClose,
      onInvoicingDetailClose,
      onLoanEdit,
      onRefundEdit,
      onCustomerDetailClose,
      onSupplierDetailClose,
      onRedDetailClose,
      onVoidDetailClose,
      onUseSeaalDetailClose,
      onProjectDetailClose,
      onAssetScrappedDetailClose,
    } = useApprovalInfo(ctx);

    const workbenchState = computed(() => ctx.root.$store.state.workbench);
    const approval = computed<ApprovalInfo | undefined>(() => workbenchState.value.approval);
    console.log('approval', ctx.root.$store.state);

    const loanFormVisible = computed(() => workbenchState.value.loanFormVisible);
    const loanDetailVisible = computed(() => workbenchState.value.loanDetailVisible);
    const refundFormVisible = computed(() => workbenchState.value.refundFormVisible);
    const refundDetailVisible = computed(() => workbenchState.value.refundDetailVisible);
    const customerDetailVisible = computed(() => workbenchState.value.customerDetailVisible);
    const supplierDetailVisible = computed(() => workbenchState.value.supplierDetailVisible);
    const advanceFormVisible = computed(() => workbenchState.value.advanceFormVisible);
    const advanceDetailVisible = computed(() => workbenchState.value.advanceDetailVisible);
    const invoicingFormVisible = computed(() => workbenchState.value.invoicingFormVisible);
    const invoicingDetailVisible = computed(() => workbenchState.value.invoicingDetailVisible);
    const redDetailVisible = computed(() => workbenchState.value.redDetailVisible);
    const voidDetailVisible = computed(() => workbenchState.value.voidDetailVisible);
    const projectApprovalVisible = computed(() => workbenchState.value.projectApprovalVisible);
    const useSealApplyDetailVisible = computed(
      () => workbenchState.value.useSealApplyDetailVisible,
    );
    const projectEndDetailVisible = computed(() => workbenchState.value.projectEndDetailVisible);
    /** 资产报废 */
    const assetScrappedDetailVisible = computed(
      () => workbenchState.value.assetScrappedDetailVisible,
    );

    /** 垫款弹窗ref */
    const applicationDialog = ref<{ show(approval: ApprovalInfo | undefined): void } | null>(null);
    const applicationDetail = ref<{ show(approval: ApprovalInfo | undefined): void } | null>(null);
    const invoicingDetail = ref<{ show(approval: ApprovalInfo | undefined): void } | null>(null);
    const advanceDetailDialog = ref<{ show(approval: number | undefined): void } | null>(null);
    const redDetailDialog = ref<{ show(): void } | null>(null);
    const voidDetailDialog = ref<{ show(): void } | null>(null);
    const useSealApplyDetailDialog = ref<{ show(): void } | null>(null);
    const projectEndDetailDialog = ref<any>();
    const assetScrappedDetailDialog = ref<any>();

    // * 控制弹窗的变量为 true 时,打开弹窗(这种形式是旧时组件的写法)
    watch(
      () => workbenchState.value.advanceFormVisible,
      (val: boolean, preVal: boolean) => {
        if (val && val !== preVal) {
          applicationDialog.value?.show(approval.value);
        }
      },
    );

    // * 控制弹窗的变量为 true 时,打开弹窗(这种形式是旧时组件的写法)
    watch(
      () => workbenchState.value.invoicingDetailVisible,
      (val: boolean, preVal: boolean) => {
        if (val && val !== preVal) {
          ctx.root.$nextTick(() => {
            invoicingDetail.value?.show(approval.value);
          });
        }
      },
    );

    // * 控制弹窗的变量为 true 时,打开弹窗(这种形式是旧时组件的写法)
    watch(
      () => workbenchState.value.redDetailVisible,
      (val: boolean, preVal: boolean) => {
        if (val && val !== preVal) {
          ctx.root.$nextTick(() => {
            (redDetailDialog.value as any).show(approval.value);
          });
        }
      },
    );

    watch(
      () => workbenchState.value.useSealApplyDetailVisible,
      (val: boolean, preVal: boolean) => {
        if (val && val !== preVal) {
          ctx.root.$nextTick(() => {
            (useSealApplyDetailDialog.value as any).show(approval.value);
          });
        }
      },
    );
    watch(
      () => workbenchState.value.projectEndDetailVisible,
      (val: boolean, preVal: boolean) => {
        if (val && val !== preVal) {
          ctx.root.$nextTick(() => {
            (projectEndDetailDialog.value as any).show(approval.value);
          });
        }
      },
    );
    watch(
      () => workbenchState.value.assetScrappedDetailVisible,
      (val: boolean, preVal: boolean) => {
        console.log('assetScrappedDetailVisible', approval.value);

        if (val && val !== preVal) {
          ctx.root.$nextTick(() => {
            (assetScrappedDetailDialog.value as any).show(approval.value);
          });
        }
      },
    );

    watch(
      () => workbenchState.value.voidDetailVisible,
      (val: boolean, preVal: boolean) => {
        if (val && val !== preVal) {
          ctx.root.$nextTick(() => {
            (voidDetailDialog.value as any).show(approval.value);
          });
        }
      },
    );

    const reloadSymbol = ref(0);

    const triggerReload = (name: string) => {
      console.group(`${name} trigger reload`);
      reloadSymbol.value++;
      console.groupEnd();
    };

    provide('reloadSymbol', reloadSymbol);

    return {
      ...tabs,
      approval,
      loanFormVisible,
      loanDetailVisible,
      refundFormVisible,
      refundDetailVisible,
      customerDetailVisible,
      supplierDetailVisible,
      onLoanFormClose,
      onLoanDetailClose,
      onRefundFormClose,
      onRefundDetailClose,
      onCustomerDetailClose,
      onSupplierDetailClose,
      onLoanEdit,
      onRefundEdit,
      advanceFormVisible,
      advanceDetailVisible,
      invoicingFormVisible,
      invoicingDetailVisible,
      applicationDialog,
      applicationDetail,
      advanceDetailDialog,
      invoicingDetail,
      redDetailDialog,
      redDetailVisible,
      voidDetailVisible,
      useSealApplyDetailVisible,
      projectEndDetailVisible,
      assetScrappedDetailVisible,
      voidDetailDialog,
      projectEndDetailDialog,
      assetScrappedDetailDialog,
      onAdvanceDetailClose,
      onInvoicingDetailClose,
      onRedDetailClose,
      onVoidDetailClose,
      onUseSeaalDetailClose,
      onProjectDetailClose,
      onAssetScrappedDetailClose,
      triggerReload,
      routes,
      useSealApplyDetailDialog,
      projectApprovalVisible,
    };
  },
});
