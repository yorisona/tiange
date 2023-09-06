/**
 * 工作台
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-16 10:21:58
 */
import { computed, defineComponent, provide, ref, watch } from '@vue/composition-api';
import initate from '@/modules/workbench/initiate';
import Initate2Dialog from '@/modules/workbench/initiate/lnvoice2/index.vue';
import TgMine from '@/modules/workbench/mine/list.vue';
import TgWaiting from '@/modules/workbench/waiting/list.vue';
import TgApproved from '@/modules/workbench/approved/list.vue';
import { workbenchStore } from './store';
import { useApprovalInfo } from './useApprovalInfo';
import LoanFormModal from './initiate/loan/form.vue';
import LoanDetailModal from './initiate/loan/detail.vue';
import RefundFormModal from './initiate/refund/form.vue';
import AdvanceFormDialog from './initiate/advance/form.vue';
import RefundDetailModal from './initiate/refund/detail.vue';
import ApplicationDialog from '@/views/workbench/application/applicationDialog.vue';
import { ApprovalInfo } from '@/types/tiange/workbench';
import ApplicationDetail from '@/views/workbench/application/applicationDetail.vue';
import InvoicesDetail from '@/views/workbench/invoices/invoicesDetail.vue';
import InvoicesDialog from '@/views/workbench/invoices/invoicesDialog.vue';
import hooksWorkbench, { EControlItem, IControlItem } from './useWorkbench';
import UseSealApply from '@/modules/workbench/dialog/useSealApply/index.vue';
import { UseSealApplyType } from '@/modules/workbench/dialog/useSealApply/index';
import { useRouter } from '@/use/vue-router';
import {
  RouterNameProjectManage,
  RouterLegal,
  RouterNameFinance,
  RouterNameSales,
  RouterNameSupplier,
  RouterNamePerformance,
  RouterWorkbench,
  RouterNameDesign,
  RouterNameMB,
  RouterFixedAssets,
} from '@/const/router';
import { useStore } from '@/use/vuex';
import ProjectFilesDialog from '@/modules/workbench/download/projectFiles/index.vue';

export default defineComponent({
  name: 'TgWorkbench',
  components: {
    initate,
    Initate2Dialog,
    mine: TgMine,
    waiting: TgWaiting,
    approved: TgApproved,
    LoanFormModal,
    LoanDetailModal,
    RefundFormModal,
    AdvanceFormDialog,
    RefundDetailModal,
    ApplicationDialog,
    ApplicationDetail,
    InvoicesDetail,
    InvoicesDialog,
    UseSealApply,
    ProjectFilesDialog,
  },
  setup(propx, ctx) {
    const router = useRouter();
    const ApprovalItem = hooksWorkbench.useApproval();
    const Agency = hooksWorkbench.useAgency();
    const Scheduling = hooksWorkbench.useScheduling();
    const Download = hooksWorkbench.useDownload();
    const model = hooksWorkbench.useModelState();
    const useSealApplyRef = ref<UseSealApplyType | undefined>(undefined);
    const store = useStore();
    const jumpRouter = (name: string, source = 'console') => {
      const { href } = router.resolve({
        name,
        query: {
          source,
        },
      });
      window.open(href, '_blank');
    };

    const jumpLiveProjectRouter = () => {
      const { href } = router.resolve({
        name: RouterNameProjectManage.live.project.list,
        query: {
          source: 'console',
          search_type: '8',
        },
      });
      window.open(href, '_blank');
    };
    const onControlItemClick = (item: IControlItem) => {
      let _dispatch: any;
      switch (item.type) {
        case EControlItem.yongkuanshenqing:
          _dispatch = store.commit('workbench/CLEAR_APPROVAL');
          model.LoanForm = true;
          break;
        case EControlItem.tuikuanshenqing:
          _dispatch = store.commit('workbench/CLEAR_APPROVAL');
          model.RefundForm = true;
          break;
        case EControlItem.diankuanshenqing:
          model.AdvanceForm = true;
          break;
        case EControlItem.diankuanshenqing1:
          _dispatch = store.commit('workbench/CLEAR_APPROVAL');
          model.AdvanceFormDialog = true;
          break;
        case EControlItem.kaipiaoshenqing:
          // @ts-ignore
          initate2Dialog?.value.show();
          break;
        case EControlItem.xiaoshourenwugenjin:
          jumpRouter(RouterNameSales.follow);
          break;
        case EControlItem.zhiboshujvluru:
          jumpRouter(RouterNameProjectManage.live.display.list, 'console_luru');
          break;
        case EControlItem.hetongshouhui:
          jumpRouter(RouterLegal.contact);
          break;
        case EControlItem.xiagnmugenjin:
          jumpRouter(RouterNameProjectManage.live.project.list);
          break;
        case EControlItem.zhibopaibang:
          // 直播排班
          jumpLiveProjectRouter();
          break;
        case EControlItem.shoukuanqueren:
          jumpRouter(RouterNameFinance.receive);
          break;
        case EControlItem.fukuan:
          jumpRouter(RouterNameFinance.payment);
          break;
        case EControlItem.kaipiao:
          jumpRouter(RouterNameFinance.receive, 'console_kaipiao');
          break;
        case EControlItem.kehuzhixing:
          jumpRouter(RouterNameProjectManage.marketing.project.list);
          break;
        case EControlItem.anchor_approval:
          jumpRouter(RouterNameSupplier.player, 'console_anchor_apply');
          break;
        case EControlItem.kol_approval:
          jumpRouter(RouterNameSupplier.list, 'console_kol_apply');
          break;
        case EControlItem.yongyinshenqing:
          // jumpRouter(RouterNameSupplier.list, 'console_kol_apply');
          useSealApplyRef.value?.show();
          break;
        case EControlItem.performance_management_count:
          jumpRouter(RouterNamePerformance.my.own.list, 'console_kol_apply');
          break;
        case EControlItem.makeup:
          router.push({
            name: RouterNameDesign.workbench.list,
          });
          break;
        case EControlItem.design_order:
          router.push({
            name: RouterNameDesign.workbench.design_order_list,
          });
          break;
        case EControlItem.myAssets:
          router.push({
            name: RouterFixedAssets.workbench.myAssets,
            query: {
              source: 'console_kol_apply',
            },
          });
          break;
        case EControlItem.mine_files:
          jumpRouter(RouterWorkbench.home.mine_files);
          break;
        case EControlItem.anchor_recruitment_count:
          jumpRouter(RouterWorkbench.home.anchor_recruitment, 'console_kol_apply');
          break;
        case EControlItem.design_statistics:
          router.push({
            name: RouterNameDesign.workbench.statistics,
          });
          break;
        //TODO: 工作台跳转
        case EControlItem.mb_redeem:
          router.push({
            name: RouterNameMB.workbench.mall,
            query: {
              source: 'console_kol_apply',
            },
          });
          break;
        case EControlItem.project_files:
          projectFilesDialog.value?.show();
          break;
      }
    };

    // 动态注册vuex子模块
    if (!ctx.root.$store.hasModule('workbench')) {
      ctx.root.$store.registerModule('workbench', workbenchStore);
    }
    const jumpToLive = (row: any) => {
      const { href } = router.resolve({
        name: RouterNameProjectManage.live.display.detail,
        params: {
          id: row.project_id,
          liveId: row.shop_live_id,
          tab: 'live',
        },
      });
      window.open(href, '_blank');
    };

    Agency.query();

    const {
      onLoanFormClose,
      onLoanDetailClose,
      onRefundFormClose,
      onRefundDetailClose,
      onAdvanceFormDialogClose,
      onAdvanceDetailClose,
      onAdvanceFormClose,
      onInvoicingDetailClose,
      onLoanEdit,
      onRefundEdit,
    } = useApprovalInfo(ctx);

    const workbenchState = computed(() => ctx.root.$store.state.workbench);
    const approval = computed<ApprovalInfo | undefined>(() => workbenchState.value.approval);

    const loanFormVisible = computed(() => workbenchState.value.loanFormVisible);
    const loanDetailVisible = computed(() => workbenchState.value.loanDetailVisible);
    const refundFormVisible = computed(() => workbenchState.value.refundFormVisible);
    const advanceFormDialogVisible = computed(() => workbenchState.value.advanceFormDialogVisible);
    const refundDetailVisible = computed(() => workbenchState.value.refundDetailVisible);
    const advanceFormVisible = computed(() => workbenchState.value.advanceFormVisible);
    const advanceDetailVisible = computed(() => workbenchState.value.advanceDetailVisible);
    const invoicingFormVisible = computed(() => workbenchState.value.invoicingFormVisible);
    const invoicingDetailVisible = computed(() => workbenchState.value.invoicingDetailVisible);

    /** 垫款弹窗ref */
    const applicationDialog = ref<{ show(approval: ApprovalInfo | undefined): void } | null>(null);
    const applicationDetail = ref<{ show(approval: ApprovalInfo | undefined): void } | null>(null);
    const invoicingDetail = ref<{ show(approval: ApprovalInfo | undefined): void } | null>(null);
    const invoicesDialog = ref<{ show(): void } | null>(null);
    const initate2Dialog = ref<{ show(): void } | null>(null);
    const projectFilesDialog = ref<{ show(): void } | null>(null);
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
      () => workbenchState.value.advanceDetailVisible,
      (val: boolean, preVal: boolean) => {
        if (val && val !== preVal) {
          ctx.root.$nextTick(() => {
            applicationDetail.value?.show(approval.value);
          });
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

    const reloadSymbol = ref(0);

    const triggerReload = (name: string) => {
      console.group(`${name} trigger reload`);
      reloadSymbol.value++;
      console.groupEnd();
    };

    provide('reloadSymbol', reloadSymbol);
    return {
      projectFilesDialog,
      ...ApprovalItem,
      Agency,
      Scheduling,
      ...Download,
      approval,
      loanFormVisible,
      loanDetailVisible,
      refundFormVisible,
      refundDetailVisible,
      advanceFormDialogVisible,
      onLoanFormClose,
      onLoanDetailClose,
      onRefundFormClose,
      onRefundDetailClose,
      onAdvanceFormDialogClose,
      onLoanEdit,
      onRefundEdit,
      advanceFormVisible,
      advanceDetailVisible,
      invoicingFormVisible,
      invoicingDetailVisible,
      applicationDialog,
      applicationDetail,
      invoicingDetail,
      invoicesDialog,
      initate2Dialog,
      onAdvanceDetailClose,
      onAdvanceFormClose,
      onInvoicingDetailClose,
      triggerReload,
      onControlItemClick,
      router,
      jumpToLive,
      model,
      useSealApplyRef,
    };
  },
});
