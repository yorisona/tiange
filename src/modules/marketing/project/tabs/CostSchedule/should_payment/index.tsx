/**
 * 营销业务-项目管理-成本安排表
 * @author  tingzhu <tingzhu@goumee.com>
 * @since   2021-04-07 17:27:28
 */
import {
  defineComponent,
  computed,
  h,
  ref,
  Ref,
  inject,
  UnwrapRef,
  watch,
} from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';
import { queryMarketPayables } from '@/services/marketing.project';
import {
  Cost,
  CostScheduleShouldPayment,
  InvoiceInfo,
  VTask,
} from '@/types/tiange/marketing/project';
import CostRegister from '../dialog/cost.register.vue';
import RebatesRegister from '../dialog/rebates.register.vue';
import CostInvoice from '../dialog/cost.invoice.vue';
import PayCertificate from '../dialog/pay.certificate.vue';
import CostVTask from '../dialog/cost.vtask.vue';
import Money, { MoneyUnit } from '@/utils/money';
import { RebateParams, MarketingProjectDetail } from '@/types/tiange/marketing/project';
import { CostInfoParams } from '@/types/tiange/marketing/project';
import ApplyDetail from '@/views/workbench/components/ApplyDetail.vue';
import { UserInfo } from '@/types/tiange/system';
import { AE } from '@/types/tiange/marketing/ae';
import ApplicationDetail from '@/views/workbench/application/applicationDetail.vue';
import RefundDetail from '@/modules/workbench/initiate/refund/detail.vue';
import { workbenchStore } from '@/modules/workbench/store';
import { ApprovalInfo } from '@/types/tiange/workbench';
import { RIGHT_CODE } from '@/const/rightCode';
import { HasPermission, usePermission } from '@/use/permission';
import firstStep from '@/modules/live/project/tabs/writeDialog/firstStep.vue';
import WriteOff from '@/components/BusinessComponents/WriteOff/index.vue';
import moment from 'moment';
import { is_reversed_order, is_refunded_order } from '@/use/finance';
import { WriteOffStatus } from '@/types/tiange/finance/finance';
import { get_length_of_string } from '@/utils/string';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import PaymentDialog from '@/modules/marketing/project/dialog/payment/form.vue';

const money = new Money();

const moneyFormat = (num?: number | ''): string =>
  num === '' ? '--' : num === undefined ? '--' : `￥${money.format(num, MoneyUnit.Yuan)}`;
const priceFormat = (num?: number | ''): string =>
  num === '' ? '--' : num === undefined ? '--' : `${money.format(num, MoneyUnit.Yuan)}`;

export default defineComponent({
  name: 'TgCostSchedule',
  components: {
    CostRegister,
    RebatesRegister,
    CostInvoice,
    PayCertificate,
    CostVTask,
    ApplyDetail,
    ApplicationDetail,
    RefundDetail,
    firstStep,
    PaymentDialog,
  },
  setup(props, ctx) {
    const aeList = computed<AE[]>(() => ctx.root.$store.getters['marketing/aeList'] ?? []);
    const permission = usePermission();
    const paymentDialogVisible = ref(false);
    const isHideReversed = ref(true);
    const project =
      inject<Ref<MarketingProjectDetail>>('MarketingProject') ?? ref<MarketingProjectDetail>();
    const user: UserInfo = ctx.root.$store.getters['user/getUserInfo'];
    const paymentData = ref({
      project_name: project?.value ? project.value.cooperation_name : '',
      project_id: project?.value ? project.value.cooperation_id : '',
      brand_name: project?.value ? project.value.brand_name : '',
      brand_id: project?.value ? project.value.brand_id : '',
      business_type: 1,
    });

    watch(
      () => project?.value,
      () => {
        paymentData.value = {
          project_name: project?.value ? project.value.cooperation_name : '',
          project_id: project?.value ? project.value.cooperation_id : '',
          brand_name: project?.value ? project.value.brand_name : '',
          brand_id: project?.value ? project.value.brand_id : '',
          business_type: 1,
        };
      },
    );

    // 动态注册vuex子模块
    if (!ctx.root.$store.hasModule('workbench')) {
      ctx.root.$store.registerModule('workbench', workbenchStore);
    }

    const workbenchState = computed(() => ctx.root.$store.state.workbench);
    const approval = computed<ApprovalInfo | undefined>(() => workbenchState.value.approval);

    const { id } = ctx.root.$route.params;
    const deleteLoading = ref<boolean>(false);
    const costRegisterVisible = ref<boolean>(false);
    const rebatesRegisterVisible = ref<boolean>(false);
    const costInvoiceVisible = ref<boolean>(false);
    const payCertificateVisible = ref<boolean>(false);
    const costVTaskVisible = ref<boolean>(false);
    const customerVisible = ref<boolean>(false);
    const applicationDetailVisible = ref<boolean>(false);
    const refundVisible = ref<boolean>(false);

    const editRebate = ref<RebateParams | undefined>(undefined);
    const editCost = ref<CostInfoParams | undefined>(undefined);

    const loading = ref<boolean>(false);
    const costSchedule = ref<CostScheduleShouldPayment | undefined>(undefined);
    const vtasks = ref<VTask[]>([]);

    const invoices = ref<InvoiceInfo[]>();
    const payCertificatePic = ref<string>();

    const applyDetailRef = ref<any | undefined>(undefined);
    const applicationDetailRef = ref<any | undefined>(undefined);
    const refundDetailDialogRef = ref<any | undefined>(undefined);

    const costDataList = computed(() => {
      return costSchedule.value?.data ?? [];
    });

    const firstStepRef = ref<UnwrapRef<{ show: (...args: any) => void } | undefined>>(undefined);

    /** 应付编号渲染函数(仅计算) */
    const payable_uid_render = (row: Cost) => row.payable_uid;

    /** 应付编号最小宽度 */
    const payable_uid_min_length = computed(() =>
      Math.max(
        ...costDataList.value.map(row => get_length_of_string(payable_uid_render(row))),
        get_length_of_string('应付编号'),
      ),
    );

    /** 应付金额渲染函数(仅计算) */
    const payable_amount_render = (row: Cost) => priceFormat(row.payable_amount);

    /** 结算清单渲染函数(仅计算) */
    const settlement_uid_render = (row: Cost) => row.settlement_uid;

    /** 结算清单最小宽度 */
    const settlement_uid_min_length = computed(() =>
      Math.max(
        ...costDataList.value.map(row => get_length_of_string(settlement_uid_render(row))),
        get_length_of_string('结算清单'),
      ),
    );

    const columns = computed<TableColumn<Cost>[]>(() => [
      {
        label: '应付编号',
        align: 'left',
        minWidth: payable_uid_min_length.value,
        property: 'payable_uid',
        formatter: row => {
          return h(
            'div',
            {
              class: 'number-div',
            },
            [
              h(
                'span',
                {
                  class: `number-span ${
                    row.reverse_id !== null ||
                    row.reversed_id !== null ||
                    row.refunded_id !== null ||
                    (row.refund_amount > 0 && row.refund_amount === row.payable_amount)
                      ? 'reverse-red'
                      : row.refund_amount > 0 && row.refund_amount !== row.payable_amount
                      ? 'reverse-orange'
                      : ''
                  }`,
                },
                row.payable_uid,
              ),
            ],
          );
        },
      },
      {
        label: '应付金额 (元)',
        align: 'right',
        minWidth: 120,
        formatter: row =>
          h(
            'div',
            row.reverse_id !== null ||
              is_reversed_order(row) ||
              is_refunded_order(row) ||
              (row.refund_amount > 0 && row.refund_amount === row.payable_amount)
              ? { class: 'reverse-red' }
              : row.refund_amount > 0 && row.refund_amount !== row.payable_amount
              ? { class: 'reverse-orange' }
              : {},
            payable_amount_render(row),
          ),
      },
      {
        label: '创建日期',
        align: 'center',
        minWidth: 120,
        property: 'create_date',
        formatter: row => moment(row.create_date).format('YYYY.MM.DD'),
      },
      {
        label: '结算单编号',
        align: 'left',
        minWidth: settlement_uid_min_length.value,
        property: 'settlement_uid',
        formatter: row => {
          return h(
            'div',
            {
              class: 'number-div',
            },
            [
              h(
                'span',
                row.reverse_id !== null ||
                  is_reversed_order(row) ||
                  is_refunded_order(row) ||
                  (row.refund_amount > 0 && row.refund_amount === row.payable_amount)
                  ? { class: 'number-span text reverse-red' }
                  : row.refund_amount > 0 && row.refund_amount !== row.payable_amount
                  ? { class: 'number-span text reverse-orange' }
                  : { class: 'number-span text' },
                row.settlement_uid,
              ),
            ],
          );
        },
      },
      {
        label: '核销状态',
        align: 'center',
        minWidth: 126,
        formatter: row => {
          const write_off_infos = (row.write_off_infos || []).map(item => {
            return [item.cost_id, item.write_off_amount, item.write_off_user, item.write_off_time];
          });
          (row.refund_write_off_info_items || []).forEach((item: any) => {
            write_off_infos.push([
              item.achievement_uid,
              (item.write_off_amount ?? 0) * -1,
              item.write_off_user,
              item.write_off_time,
            ]);
          });
          const write_off_header = ['单据编号', '核销金额 (元)', '核销人/账期时间'];
          return h(WriteOff, {
            attrs: {
              write_off_header,
              write_off_infos,
              write_off_status: row.write_off_status,
              is_reverse: row.reversed_id !== null,
            },
          });
        },
      },
      {
        label: '操作',
        align: 'center',
        fixed: 'right',
        formatter: row => {
          const nodes = [];
          if (
            (row.write_off_status === WriteOffStatus.part ||
              row.write_off_status === WriteOffStatus.none) &&
            row.reverse_id === null &&
            !is_reversed_order(row) &&
            permission.marketing_project_write_off_save &&
            !is_refunded_order(row)
          ) {
            nodes.unshift(
              h(
                'a',
                {
                  on: {
                    click: () => {
                      //@firstStepRef 营销业务/应付
                      firstStepRef.value?.show({
                        type: 'isPayable',
                        id: row.id,
                        amount: row.not_write_off_amount, // 可核销金额
                        leaf: 'coop', // 营销业务
                        busType: row.payable_type,
                        receivable_uid: row.payable_uid, // 应收编号
                      });
                    },
                  },
                },
                '核销',
              ),
            );
          }

          return h('div', { class: 'operation' }, nodes);
        },
      },
    ]);

    const costRegisterPermission = computed(() => {
      const ae = aeList.value.filter((ae: AE) => {
        return ae.ae_id === user.id;
      });
      if (
        user.id === project.value?.add_by_id ||
        user.id === project.value?.manager_id ||
        ae.length > 0
      ) {
        return true;
      }
      return false;
    });

    const costRebatePermission = computed(() => {
      if (user.id === project.value?.add_by_id || user.id === project.value?.manager_id) {
        return true;
      }
      return false;
    });

    // 关闭审批安排弹窗
    const applyDetailClose = () => {
      customerVisible.value = false;
    };
    // 关闭审批安排弹窗
    const applicationDetailClose = () => {
      applicationDetailVisible.value = false;
    };
    // 关闭审批安排弹窗
    const refundDetailClose = () => {
      refundVisible.value = false;
    };

    /** 权限检查 */
    const Permission = computed(() => {
      const canViewList = HasPermission(RIGHT_CODE.marketing_project_cost_view);
      const canChange = HasPermission(RIGHT_CODE.marketing_project_cost_change);

      return { canChange, canViewList };
    });

    const sendGetCostScheduleRequest = async () => {
      loading.value = true;
      const res = await queryMarketPayables(id, 1, isHideReversed.value ? 1 : undefined);
      loading.value = false;
      if (res.data.success) {
        const { payable, write_off, not_write_off } = res.data.data;
        const data = {
          ...res.data.data,
          stat_info: {
            payable,
            write_off,
            not_write_off,
          },
        };
        costSchedule.value = data;
      } else {
        ctx.root.$message.error(res.data.message ?? '获取成本安排表失败，请稍后重试');
      }
    };

    const lookupInvoice = (cost: Cost) => {
      costInvoiceVisible.value = true;
      invoices.value = cost.invoice_info;
    };

    const costListSaved = () => {
      sendGetCostScheduleRequest();
    };

    sendGetCostScheduleRequest();

    // 自适应表格高度部分
    const buttonLineHeight = 32;
    const paginationLineHeight = 34;
    const rectPadding = 36;
    const otherHeight = 31;

    const topCardHeight = ref(200);
    // const onTopCardRectUpdate = (rect: DOMRect) => {
    //   topCardHeight.value = rect.height;
    // };

    const tableHeightLogic = useAutoTableHeightInCard({
      compensation: computed(
        () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      ),
      fixedBlockHeightRefs: [topCardHeight],
      tableMinHeight: 100,
    });

    const showPaymentDialog = () => {
      paymentDialogVisible.value = true;
    };
    /** 隐藏已冲销数据用*/
    const reload = () => {
      sendGetCostScheduleRequest();
    };
    return {
      isHideReversed,
      reload,
      Permission,
      loading,
      applyDetailClose,
      applicationDetailClose,
      refundDetailClose,
      deleteLoading,
      costInvoiceVisible,
      costRegisterVisible,
      rebatesRegisterVisible,
      payCertificateVisible,
      costVTaskVisible,
      customerVisible,
      applicationDetailVisible,
      refundVisible,
      costSchedule,
      costDataList,
      invoices,
      vtasks,
      payCertificatePic,
      columns,
      moneyFormat,
      lookupInvoice,
      costListSaved,
      editCost,
      editRebate,
      applyDetailRef,
      applicationDetailRef,
      refundDetailDialogRef,
      costRegisterPermission,
      costRebatePermission,
      approval,
      firstStepRef,
      paymentDialogVisible,
      showPaymentDialog,
      paymentData,
      ...tableHeightLogic,
    };
  },
});
