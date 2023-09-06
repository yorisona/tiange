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
  // nextTick,
  Ref,
  inject,
  UnwrapRef,
} from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';
import { delCost, queryCost } from '@/services/marketing.project';
import { Cost, CostSchedule, InvoiceInfo, VTask } from '@/types/tiange/marketing/project';
import CostRegister from './dialog/cost.register.vue';
import RebatesRegister from './dialog/rebates.register.vue';
import CostInvoice from './dialog/cost.invoice.vue';
import PayCertificate from './dialog/pay.certificate.vue';
import CostVTask from './dialog/cost.vtask.vue';
import { AsyncConfirm } from '@/use/asyncConfirm';
import Money, { MoneyUnit } from '@/utils/money';
import { RebateParams, MarketingProjectDetail } from '@/types/tiange/marketing/project';
import { CostInfoParams } from '@/types/tiange/marketing/project';
// import ApplyDetail from '@/views/workbench/components/ApplyDetail.vue';
import { UserInfo } from '@/types/tiange/system';
import { AE } from '@/types/tiange/marketing/ae';
// import ApplicationDetail from '@/views/workbench/application/applicationDetail.vue';
// import RefundDetail from '@/modules/workbench/initiate/refund/detail.vue';
import RefundDetailDialog from '@/modules/marketing/project/dialog/refund/detail.vue';
import AdvanceDetailDialog from '@/modules/workbench/initiate/advance/detail.vue';
import PaymentDetailDialog from '@/modules/workbench/initiate/payment/detail.vue';
import { workbenchStore } from '@/modules/workbench/store';
import { ApprovalInfo } from '@/types/tiange/workbench';
import { RIGHT_CODE } from '@/const/rightCode';
import { HasPermission } from '@/use/permission';
import firstStep from '@/modules/live/project/tabs/writeDialog/firstStep.vue';
import WriteOff from '@/components/BusinessComponents/WriteOff/index.vue';
import { usePermission } from '@/use/permission';
import { ReverseStatus, ReverseType } from '@/types/tiange/finance/finance';
import { wait } from '@/utils/func';
import { ReverseOrderDialog } from '@/modules/settlement/component/reverseOrder';
import { FinancialReverse, FinancialReverseAgain } from '@/services/finance';
import useVisible from '@/use/visible';
import reverseOrderDialog from '@/modules/settlement/component/reverseOrder.vue';
import { BooleanType } from '@/types/base/advanced';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import PayRefund from '@/modules/live/project/dialog/payRefund.vue';
import RefundWriteOff from '@/modules/live/project/dialog/refundWriteOff.vue';
import Decimal from 'decimal.js';
import StartPay from './dialog/start.pay.vue';
import { formatAmount, get_limited_length_string } from '@/utils/string';
import { max_length_of_column } from '@/utils/table';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import LoanfinanceDetailModal from '@/modules/finance/components/loan/paydetail.vue';

const money = new Money();

const moneyFormat = (num?: number | ''): string =>
  num === '' ? '--' : num === undefined ? '--' : `￥${money.format(num, MoneyUnit.Yuan)}`;

export default defineComponent({
  name: 'TgCostSchedule',
  components: {
    CostRegister,
    RebatesRegister,
    CostInvoice,
    PayCertificate,
    CostVTask,
    // ApplyDetail,
    // ApplicationDetail,
    // RefundDetail,
    RefundDetailDialog,
    firstStep,
    reverseOrderDialog,
    AdvanceDetailDialog,
    PaymentDetailDialog,
    PayRefund,
    RefundWriteOff,
    StartPay,
    LoanfinanceDetailModal,
  },
  setup(props, ctx) {
    const aeList = computed<AE[]>(() => ctx.root.$store.getters['marketing/aeList'] ?? []);
    const permission = usePermission();

    const project =
      inject<Ref<MarketingProjectDetail>>('MarketingProject') ?? ref<MarketingProjectDetail>();
    const user: UserInfo = ctx.root.$store.getters['user/getUserInfo'];

    const payRefundVisible = ref<boolean>(false);
    const refundWriteOffVisible = ref<boolean>(false);

    const payRefundCostId = ref<number | undefined>(undefined);

    // 动态注册vuex子模块
    if (!ctx.root.$store.hasModule('workbench')) {
      ctx.root.$store.registerModule('workbench', workbenchStore);
    }

    const workbenchState = computed(() => ctx.root.$store.state.workbench);
    const approval = computed<ApprovalInfo | undefined>(() => workbenchState.value.approval);

    const { id } = ctx.root.$route.params;
    const firstStepRef = ref<UnwrapRef<{ show: (...args: any) => void } | undefined>>(undefined);
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
    const costSchedule = ref<CostSchedule | undefined>(undefined);
    const vtasks = ref<VTask[]>([]);

    const invoices = ref<InvoiceInfo[]>();
    const payCertificatePic = ref<string>();

    const notRefundWriteOffAmount = ref<number | undefined>(undefined);
    const refundWriteoffId = ref<string | undefined>(undefined);
    const refundWriteoffCostId = ref<number | undefined>(undefined);
    const payRefundAmout = ref<number | undefined>(undefined);
    const payRefundBusinessType = ref<number>();

    const startPayVisible = ref<boolean>(false);
    const isHideReversed = ref(true);
    // const applyDetailRef = ref<any | undefined>(undefined);
    // const applicationDetailRef = ref<any | undefined>(undefined);
    // const refundDetailDialogRef = ref<any | undefined>(undefined);

    const costDataList = computed(() => {
      return costSchedule.value?.data ?? [];
    });

    // 类型：1: 返点，2: 退款, 0: 其他
    // const costType = (cost: Cost) => {
    //   if (cost.pay_type === 2) {
    //     return 2; // 退款
    //   }
    //   if (cost.cost_type === 1 && cost.new_cost_type === 8) {
    //     return 1; // 返点
    //   }
    //   return 0;
    // };

    // const operationPermission = (row: Cost) => {
    //   const ae = aeList.value.filter((ae: AE) => {
    //     return ae.ae_id === user.id;
    //   });
    //   if (row.pay_type === 2) {
    //     return false;
    //   }
    //   if (row.is_pay === 1) {
    //     return false;
    //   }
    //   if (
    //     row.new_cost_type === 7 &&
    //     user.id !== project.value?.add_by_id &&
    //     user.id !== project.value?.manager_id &&
    //     ae.length === 0
    //   ) {
    //     return false;
    //   }
    //   if (
    //     row.new_cost_type === 8 &&
    //     user.id !== project.value?.add_by_id &&
    //     user.id !== project.value?.manager_id
    //   ) {
    //     return false;
    //   }
    //   return true;
    // };

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

    const payWay = (pay_way: number) => {
      switch (pay_way) {
        case 1:
          return '银行卡';
        case 2:
          return 'V任务';
        case 3:
          return '对公银行';
        case 4:
          return '支付宝';
        default:
          return '--';
      }
    };

    // const account = (payAccount: number | undefined) => {
    //   if (payAccount === undefined) return '--';
    //   switch (payAccount) {
    //     case 1:
    //       return '时光机';
    //     case 2:
    //       return '玥每映像';
    //     case 3:
    //       return '构美子账户';
    //     default:
    //       return '--';
    //   }
    // };
    // 付款类型
    const payType = (pay_type: number) => {
      switch (pay_type) {
        case 1:
          return '成本';
        case 2:
          return '退款';
        default:
          return '--';
      }
    };

    // 单据状态
    const payStatus = (is_pay: number) => {
      switch (is_pay) {
        case 0:
          return '待打款';
        case 1:
          return '已打款';
        case -1:
          return '待发起打款';
        default:
          return '--';
      }
    };
    // 成本类型
    // const newCostType = (new_cost_type: number) => {
    //   switch (new_cost_type) {
    //     case 1:
    //       return '人员工资';
    //     case 2:
    //       return '主播服务费';
    //     case 3:
    //       return '固定资产采购';
    //     case 4:
    //       return '水电';
    //     case 5:
    //       return '装修';
    //     case 6:
    //       return '房租';
    //     case 7:
    //       return '营销成本';
    //     case 8:
    //       return '返点';
    //     default:
    //       return '--';
    //   }
    // };

    // const popoverContent = (cost: Cost) => {
    //   if (cost.pay_way_detail instanceof Array) {
    //     return;
    //   }
    //   const detail = cost.pay_way_detail as PayWayDetail;
    //   let label1;
    //   let label2;
    //   let label3;
    //   let value1;
    //   let value2;
    //   let value3;

    //   const labelWidthStyle = {
    //     width:
    //       cost.pay_way === 1
    //         ? '70px'
    //         : cost.pay_way === 2
    //         ? '68px'
    //         : cost.pay_way === 3
    //         ? '70px'
    //         : '84px',
    //   };

    //   const labelStyle = {
    //     display: 'inline-block',
    //     ...labelWidthStyle,
    //     color: '#a4b2c2',
    //     textAlign: 'right',
    //   };

    //   const valueStyle = {
    //     color: 'var(--text-color)',
    //   };

    //   const rowStyle = {
    //     display: 'flex',
    //     marginTop: '12px',
    //   };

    //   const elImgStyle = {
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     width: '90px',
    //     height: '54px',
    //     borderRadius: '2px',
    //     backgroundColor: 'rgba(164, 178, 194, 0.1)',
    //   };
    //   const imgStyle = {
    //     width: '40px',
    //     height: '40px',
    //   };

    //   const imgDesc = {
    //     textAlign: 'center',
    //     color: '#A4B2C2',
    //     lineHeight: '16px',
    //     marginTop: '4px',
    //   };

    //   switch (cost.pay_way) {
    //     case 1: {
    //       const tokenStr = `Authorization=${getToken()}`;
    //       return h(
    //         'div',
    //         {
    //           style: {
    //             padding: '6px',
    //           },
    //         },
    //         [
    //           h('div', [
    //             h('span', { style: labelStyle }, '真实姓名：'),
    //             h('span', { style: valueStyle }, detail.real_name ? detail.real_name : '--'),
    //           ]),
    //           h('div', { style: rowStyle }, [
    //             h('span', { style: labelStyle }, '开户行：'),
    //             h('span', { style: valueStyle }, detail.bank_name ? detail.bank_name : '--'),
    //           ]),
    //           h('div', { style: rowStyle }, [
    //             h('span', { style: labelStyle }, '银行卡号：'),
    //             h(
    //               'span',
    //               { style: valueStyle },
    //               detail.bank_card_num ? detail.bank_card_num : '--',
    //             ),
    //           ]),
    //           h('div', { style: rowStyle }, [
    //             h('span', { style: labelStyle }, '身份证号：'),
    //             h('span', { style: valueStyle }, detail.id_number ? detail.id_number : '--'),
    //           ]),
    //           h('div', { style: rowStyle }, [
    //             h('span', { style: labelStyle }, '手机号：'),
    //             h('span', { style: valueStyle }, detail.phone ? detail.phone : '--'),
    //           ]),
    //           h('div', { style: rowStyle }, [
    //             h('span', { style: labelStyle }, '照片：'),
    //             h('div', { style: { display: 'inline-block' } }, [
    //               h('div', { style: { display: 'inline-block' } }, [
    //                 h('el-image', {
    //                   style: {
    //                     ...elImgStyle,
    //                     marginRight: '12px',
    //                   },
    //                   props: {
    //                     src: `${detail.id_card_pic}?${tokenStr}`,
    //                     previewSrcList: [`${detail.id_card_pic}?${tokenStr}`],
    //                     zIndex: 2010,
    //                   },
    //                   scopedSlots: {
    //                     error: () => {
    //                       return h('img', {
    //                         style: imgStyle,
    //                         domProps: {
    //                           src: no_upload_placeholder,
    //                         },
    //                       });
    //                     },
    //                   },
    //                 }),
    //                 h(
    //                   'div',
    //                   {
    //                     style: {
    //                       ...imgDesc,
    //                       marginRight: '12px',
    //                     },
    //                   },
    //                   '身份证照片',
    //                 ),
    //               ]),
    //               h('div', { style: { display: 'inline-block' } }, [
    //                 h('el-image', {
    //                   style: elImgStyle,
    //                   props: {
    //                     src: `${detail.bank_card_pic}?${tokenStr}`,
    //                     previewSrcList: [`${detail.bank_card_pic}?${tokenStr}`],
    //                     zIndex: 2010,
    //                   },
    //                   scopedSlots: {
    //                     error: () => {
    //                       return h('img', {
    //                         style: imgStyle,
    //                         domProps: {
    //                           src: no_upload_placeholder,
    //                         },
    //                       });
    //                     },
    //                   },
    //                 }),
    //                 h('div', { style: imgDesc }, '银行卡照片'),
    //               ]),
    //             ]),
    //           ]),
    //         ],
    //       );
    //     }
    //     case 2:
    //       // v任务
    //       label1 = 'V任务ID：';
    //       label2 = '旺旺名：';
    //       value1 = detail.v_task_id;
    //       value2 = detail.wangwang_name;
    //       break;
    //     case 3:
    //       // 对公银行
    //       label1 = '银行卡号：';
    //       label2 = '公司名称：';
    //       label3 = '开户行：';
    //       value1 = detail.bank_card_number;
    //       value2 = detail.company_name;
    //       value3 = detail.bank_of_deposit;
    //       break;
    //     case 4:
    //       // 对公银行
    //       label1 = '收款人：';
    //       label2 = '支付宝账号：';
    //       value1 = detail.name;
    //       value2 = detail.account;
    //       break;
    //     default:
    //       break;
    //   }
    //   return h(
    //     'div',
    //     {
    //       style: {
    //         padding: '6px',
    //       },
    //     },
    //     [
    //       h('div', [
    //         h('span', { style: labelStyle }, label1),
    //         h('span', { style: valueStyle }, value1),
    //       ]),
    //       h('div', { style: rowStyle }, [
    //         h('span', { style: labelStyle }, label2),
    //         h('span', { style: valueStyle }, value2),
    //       ]),
    //       cost.pay_way === 3
    //         ? h('div', { style: rowStyle }, [
    //             h('span', { style: labelStyle }, label3),
    //             h('span', { style: valueStyle }, value3),
    //           ])
    //         : '',
    //     ],
    //   );
    // };

    // const clickContract = (row: number) => {
    //   const routeUrl = ctx.root.$router.resolve({
    //     name: RouterNameProjectManage.marketing.contract.supplier.detail,
    //     params: {
    //       id: `${row}`,
    //     },
    //     query: {
    //       partner_type: '2',
    //     },
    //   });

    //   window.open(routeUrl.href, '_blank');
    // };

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

    /** 获取垫款申请单详情 */
    // const fetchApprovalInfo = async (approval_id?: number, approval_uid?: string) => {
    //   const { data: response } = await GetApprovalInfo({ approval_id, approval_uid });
    //   if (response.success) {
    //     ctx.root.$store.dispatch('workbench/setApproval', response.data);
    //   } else {
    //     ctx.root.$message.error(response.message ?? '获取审批详情失败');
    //   }
    //   return response.data;
    // };

    // const onEdit = (row: Cost) => {
    //   if (row.new_cost_type !== 8) {
    //     // 用款
    //     let pay_task = undefined;
    //     if (row.pay_way_detail instanceof Array) {
    //       pay_task = row.pay_way_detail as [];
    //     }
    //     editCost.value = {
    //       cost_id: row.cost_id,
    //       cost_type: row.cost_type,
    //       cooperation_id: row.cooperation_id,
    //       achievement_uid: row.achievement_uid,
    //       kol_id: row.kol_id,
    //       company_id: row.company_id,
    //       company_name: row.company_name,
    //       pay_way: row.pay_way,
    //       pay_amount: row.pay_amount,
    //       pay_account: row.pay_account,
    //       pay_date: row.pay_date,
    //       transfer_date: row.transfer_date
    //         ? format(row.transfer_date * 1000, 'YYYY-mm-dd')
    //         : undefined,
    //       is_invoice: row.is_invoice,
    //       tax_point: row.tax_point,
    //       note: row.note,
    //       is_personal: row.is_personal,
    //       invoice_certificate_pic: row.invoice_certificate_pic,
    //       has_contract: row.has_contract,
    //       contract_id: row.contract_id,
    //       live_start_date: row.live_start_date,
    //       live_end_date: row.live_end_date,
    //       borrowing_uid: row.borrowing_uid,
    //       approval_id: row.approval_id,
    //       contract_str: row.contract_uid,
    //       v_task_list: pay_task ?? [],
    //     };
    //     costRegisterVisible.value = true;
    //   } else {
    //     // 借款
    //     const detail = row.pay_way_detail as PayWayDetail;
    //     editRebate.value = {
    //       cost_id: row.cost_id,
    //       cooperation_id: row.cooperation_id,
    //       achievement_uid: row.achievement_uid,
    //       pay_amount: row.pay_amount,
    //       bank_card_num: detail.bank_card_num,
    //       bank_name: detail.bank_name,
    //       real_name: detail.real_name,
    //       id_number: detail.id_number,
    //       transfer_date: format(row.transfer_date * 1000, 'YYYY-mm-dd'),
    //       id_card_pic: detail.id_card_pic,
    //       bank_card_pic: detail.bank_card_pic,
    //       phone: detail.phone,
    //     };
    //     rebatesRegisterVisible.value = true;
    //   }
    // };

    const reverseOrderDialogRef = ref<ReverseOrderDialog | null>(null);

    const { visible: reverseLoading, toggleVisible: toggleReverseLoading } = useVisible();

    const startPayCost = ref<{ cost_id: number; pay_way: number } | undefined>(undefined);

    /** 冲销动作 */
    const onReverseConfirm = async (row: Cost, reverse_reason: string) => {
      toggleReverseLoading();

      const [{ data: response }] = await wait(
        500,
        FinancialReverse({
          id: row.cost_id,
          reverse_type: ReverseType.payment,
          reverse_reason,
        }),
      );

      toggleReverseLoading();

      if (response.success) {
        ctx.root.$message.success(response.message ?? '发起冲销成功');
        sendGetCostScheduleRequest();
      } else {
        ctx.root.$message.error(response.message ?? '发起冲销失败');
      }

      return response.success;
    };

    const { visible: reverseAgainLoading, toggleVisible: toggleReverseAgainLoading } = useVisible();

    /** 重新提交冲销 */
    const reverseAgain = async (row: Cost, reverse_reason: string) => {
      toggleReverseAgainLoading();
      const [{ data: response }] = await wait(
        500,
        FinancialReverseAgain({
          id: row.cost_id,
          reverse_type: ReverseType.payment,
          reverse_reason,
        }),
      );
      toggleReverseAgainLoading();

      if (response.success) {
        ctx.root.$message.success(response.message ?? '重新提交成功');
        sendGetCostScheduleRequest();
      } else {
        ctx.root.$message.error(response.message ?? '重新提交失败');
      }

      return response.success;
    };

    const reasonDialogVisible = ref(false);
    const reason = ref('');
    const reasonDialogTitle = ref('');

    const onReasonDialogClose = () => {
      reason.value = '';
      reasonDialogVisible.value = false;
    };

    const onReverseBackReasonViewBtnClick = (row: Cost) => {
      reasonDialogTitle.value = '退回原因';
      reason.value = row.reverse_back_reason;
      reasonDialogVisible.value = true;
    };

    const onReverseReasonViewBtnClick = (row: Cost) => {
      reasonDialogTitle.value = '冲销原因';
      reason.value = row.reverse_reason;
      reasonDialogVisible.value = true;
    };

    const uid_render = <T extends boolean>(row: Cost, text_only: T) => {
      if (text_only) {
        return row.uid;
      }
      return h(
        'span',
        { class: row.reverse_id !== null || row.reversed_id !== null ? 'reverse-red' : '' },
        [row.uid],
      ) as TableColumnRenderReturn<T>;
    };
    const pay_amount_render = <T extends boolean>(row: Cost, text_only: T) => {
      if (text_only) {
        return formatAmount(row.pay_amount, '');
      }
      return h(
        'span',
        { class: row.reverse_id !== null || row.reversed_id !== null ? 'reverse-red' : '' },
        [formatAmount(row.pay_amount, '')],
      ) as TableColumnRenderReturn<T>;
    };

    /** 付款事由渲染函数 */
    const pay_reason_render = <T extends boolean>(row: Cost, text_only: T) => {
      const data = row.pay_reason || '--';

      const { is_folded, folded_text } = get_limited_length_string(data, 12);

      return text_only || !is_folded
        ? folded_text
        : (h(
            'el-popover',
            {
              props: {
                placement: 'right',
                trigger: 'hover',
                content: data,
              },
            },
            [h('span', { slot: 'reference' }, [folded_text])],
          ) as TableColumnRenderReturn<T>);
    };

    /** 供应商渲染函数 */
    const supplier_render = <T extends boolean>(row: Cost, text_only: T) => {
      const data = row.company_name || '--';

      const { is_folded, folded_text } = get_limited_length_string(data, 12);

      return text_only || !is_folded
        ? folded_text
        : (h(
            'el-popover',
            {
              props: {
                placement: 'right',
                trigger: 'hover',
                content: data,
              },
            },
            [h('span', { slot: 'reference' }, [folded_text])],
          ) as TableColumnRenderReturn<T>);
    };

    const columns = computed<TableColumn<Cost>[]>(() => [
      {
        label: '付款编号',
        fixed: 'left',
        align: 'center',
        minWidth: max_length_of_column(costDataList, '付款编号', uid_render).value,
        formatter: row => uid_render(row, false),
      },
      {
        label: '付款金额 (元)',
        align: 'right',
        minWidth: max_length_of_column(costDataList, '付款金额 (元)', pay_amount_render).value,
        formatter: row => pay_amount_render(row, false),
      },
      {
        label: '付款类型',
        minWidth: 80,
        align: 'center',
        formatter: row => h('div', payType(row.pay_type)),
      },
      {
        label: '付款方式',
        minWidth: 80,
        align: 'center',
        formatter: row => h('div', payWay(row.pay_way)),
      },
      {
        label: '付款事由',
        minWidth: max_length_of_column(costDataList, '付款事由', pay_reason_render).value,
        formatter: row => pay_reason_render(row, false),
      },
      {
        label: '供应商',
        minWidth: max_length_of_column(costDataList, '供应商', supplier_render).value,
        formatter: row => supplier_render(row, false),
      },
      // {
      //   label: '是否开票',
      //   minWidth: 80,
      //   align: 'center',
      //   formatter: row => {
      //     let on = undefined;
      //     if (row.is_invoice) {
      //       on = {
      //         click: (event: PointerEvent) => {
      //           lookupInvoice(row);
      //           event.stopPropagation();
      //         },
      //       };
      //     }
      //     return h('div', [
      //       h(
      //         'tg-button',
      //         {
      //           props: { type: 'link', disabled: row.is_invoice === 0 },
      //           on,
      //           class: 'invoices-link',
      //           style: {
      //             color: row.is_invoice ? '#2877FF' : undefined,
      //           },
      //         },
      //         row.is_invoice ? '查看' : '未开票',
      //       ),
      //     ]);
      //   },
      // },
      {
        label: '付款时间',
        minWidth: 100,
        align: 'center',
        formatter: row => {
          return row.pay_date ? row.pay_date.replace(/-/g, '.') : '--';
        },
      },
      {
        label: '付款凭证',
        minWidth: 80,
        align: 'center',
        formatter: row => {
          if (row.is_pay === 1) {
            return h(
              'tg-button',
              {
                props: {
                  type: 'link',
                },
                on: {
                  click: (event: PointerEvent) => {
                    payCertificateVisible.value = true;
                    payCertificatePic.value = row.pay_certificate_pic;
                    event.stopPropagation();
                  },
                },
              },
              '查看',
            );
          } else {
            return '--';
          }
        },
      },
      {
        label: '核销状态',
        width: 143,
        formatter: row => {
          if (row.new_cost_type !== 7 && row.new_cost_type !== 9 && row.pay_type !== 2) return '--';
          let write_off_infos = [];
          if (row.pay_type === 2) {
            write_off_infos = (row.refund_write_off_infos || []).map((item: any) => {
              return [
                item.settlement_uid,
                item.receivable_uid,
                item.write_off_amount * -1,
                item.write_off_user,
                item.write_off_time,
              ];
            });
          } else {
            write_off_infos = (row.write_off_infos || []).map(item => {
              return [
                item.settlement_uid,
                item.payable_uid,
                item.write_off_amount,
                item.write_off_user,
                item.write_off_time,
              ];
            });
          }
          const write_off_header = [
            '结算单编号',
            row.pay_type === 2 ? '应收编号' : '应付编号',
            '核销金额 (元)',
            '核销人/账期时间',
          ];
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
        label: '单据状态',
        minWidth: 100,
        align: 'center',
        formatter: row =>
          h(
            'div',
            {
              style: {
                color:
                  row.is_pay === 0
                    ? '#ff7a36'
                    : row.is_pay === 1
                    ? undefined
                    : 'var(--warning-color)',
              },
            },
            [payStatus(row.is_pay)],
          ),
      },

      {
        label: '操作',
        align: 'left',
        minWidth: 160,
        fixed: 'right',
        formatter: row => {
          const nodes = [];
          const showStartPayBtn = row.is_pay === -1;
          if (showStartPayBtn && Permission.value.canChange) {
            const payBtn = h(
              'tg-button',
              {
                props: {
                  type: 'link',
                },
                on: {
                  click: (event: PointerEvent) => {
                    startPayCost.value = {
                      cost_id: row.cost_id,
                      pay_way: row.pay_way,
                    };
                    startPayVisible.value = true;
                    event.stopPropagation();
                  },
                },
              },
              ['发起打款'],
            );
            nodes.push(payBtn);
            return h('div', { class: 'operation' }, nodes);
          }

          if (row.reversed_id === null) {
            if (
              row.reverse_id === null &&
              row.is_pay === BooleanType.YES &&
              row.pay_type !== 2 &&
              !row.has_refund
            ) {
              nodes.push(
                h(
                  'a',
                  {
                    class: 'reverse-red',
                    on: {
                      click: (event: PointerEvent) => {
                        reverseOrderDialogRef.value?.open(msg => onReverseConfirm(row, msg));
                        event.stopPropagation();
                      },
                    },
                  },
                  ['冲销'],
                ),
              );
            }
            if (
              (row.write_off_status === 1 || row.write_off_status === 0) &&
              permission.marketing_project_write_off_save &&
              // 营销成本
              row.new_cost_type === 7 &&
              row.is_pay === BooleanType.YES &&
              row.reverse_id === null
            ) {
              nodes.push(
                h(
                  'a',
                  {
                    on: {
                      click: (event: PointerEvent) => {
                        firstStepRef.value?.show({
                          type: 'isActual',
                          id: row.cost_id,
                          amount: row.not_write_off_amount, // 可核销金额
                          leaf: 'coop', // 店铺代播
                          busType: row.business_type,
                          receivable_uid: row.cost_id, // 应收编号
                          cost_split_id: row.id, // 店铺时传
                        });
                        event.stopPropagation();
                      },
                    },
                  },
                  '核销',
                ),
              );
            }
            // if (!(!Permission.value.canChange || !operationPermission(row))) {
            //   nodes.push(
            //     h(
            //       'tg-button',
            //       {
            //         props: { type: 'link' },
            //         on: {
            //           click: (event: PointerEvent) => {
            //             onEdit(row);
            //             event.stopPropagation();
            //           },
            //         },
            //       },
            //       '编辑',
            //     ),
            //     h(
            //       'tg-button',
            //       {
            //         props: { type: 'link' },
            //         on: {
            //           click: async (event: PointerEvent) => {
            //             sendDelCostRequest(row.cost_id);
            //             event.stopPropagation();
            //           },
            //         },
            //       },
            //       '删除',
            //     ),
            //   );
            // }
          } else {
            if (
              ReverseStatus.wait_confirm === row.reverse_status ||
              ReverseStatus.confirmed === row.reverse_status
            ) {
              nodes.push(
                h(
                  'a',
                  {
                    on: {
                      click: (event: PointerEvent) => {
                        onReverseReasonViewBtnClick(row);
                        event.stopPropagation();
                      },
                    },
                  },
                  ['查看'],
                ),
              );
            } else {
              if (Permission.value.canChange && row.pay_type !== 2) {
                nodes.push(
                  h(
                    'a',
                    {
                      on: {
                        click: (event: PointerEvent) => {
                          sendDelCostRequest(row.cost_id, '是否删除该冲销单');
                          event.stopPropagation();
                        },
                      },
                    },
                    ['删除'],
                  ),
                );
              }

              nodes.push(
                h(
                  'a',
                  {
                    on: {
                      click: (event: PointerEvent) => {
                        reverseOrderDialogRef.value?.open(
                          msg => reverseAgain(row, msg),
                          row.reverse_reason,
                        );
                        event.stopPropagation();
                      },
                    },
                  },
                  ['重新提交'],
                ),
              );

              nodes.push(
                h(
                  'a',
                  {
                    on: {
                      click: (event: PointerEvent) => {
                        onReverseBackReasonViewBtnClick(row);
                        event.stopPropagation();
                      },
                    },
                  },
                  ['退回原因'],
                ),
              );
            }
          }
          if (row.is_pay === BooleanType.YES && row.pay_type !== 2 && !row.reverse_id) {
            //不是冲销订单
            if (row.reverse_status === null) {
              const refundMoneyBtn = h(
                'tg-button',
                {
                  props: {
                    type: 'link',
                  },
                  on: {
                    click: (event: PointerEvent) => {
                      console.log('row', row);
                      payRefundAmout.value = new Decimal(row.pay_amount ?? 0)
                        .sub(new Decimal(row.refunded_amount ?? 0))
                        .toNumber();
                      payRefundVisible.value = true;
                      payRefundCostId.value = row.raw_cost_id;
                      payRefundBusinessType.value = row.business_type;
                      event.stopPropagation();
                    },
                  },
                },
                ['退款'],
              );
              nodes.push(refundMoneyBtn);
            }
          }
          if (
            row.is_pay === BooleanType.YES &&
            row.pay_type === 2 &&
            !row.reverse_id &&
            !row.reversed_id &&
            row.write_off_status !== 2
          ) {
            const refundWriteOffBtn = h(
              'tg-button',
              {
                props: {
                  type: 'link',
                },
                on: {
                  click: (event: PointerEvent) => {
                    refundWriteOffVisible.value = true;
                    notRefundWriteOffAmount.value = row.not_write_off_amount;
                    refundWriteoffId.value = row.achievement_uid;
                    refundWriteoffCostId.value = row.cost_id;
                    event.stopPropagation();
                  },
                },
              },
              ['核销'],
            );
            nodes.push(refundWriteOffBtn);
          }
          // 实付记录禁止删除
          // if (row.is_pay === 0 && row.pay_type === 1 && Permission.value.canChange) {
          //   nodes.push(
          //     h(
          //       'a',
          //       {
          //         on: {
          //           click: (event: PointerEvent) => {
          //             sendDelCostRequest(
          //               row.cost_id,
          //               '确认删除' + (row.pay_type === 1 ? '成本' : '退款'),
          //             );
          //             event.stopPropagation();
          //           },
          //         },
          //       },
          //       ['删除'],
          //     ),
          //   );
          // }

          return h('div', { class: 'operation' }, nodes);
        },
      },
    ]);

    /** 获取数据 */
    const sendGetCostScheduleRequest = async () => {
      loading.value = true;
      const res = await queryCost(id, isHideReversed.value ? 1 : undefined);
      loading.value = false;
      if (res.data.success) {
        costSchedule.value = res.data.data;
      } else {
        ctx.root.$message.error(res.data.message ?? '获取成本安排表失败，请稍后重试');
      }
    };

    const sendDelCostRequest = async (cost_id: number, msg = '确认删除该成本？') => {
      const result = await AsyncConfirm(ctx, msg);
      if (!result) {
        return;
      }
      deleteLoading.value = true;
      const res = await delCost(cost_id);
      deleteLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success('删除成功');
        sendGetCostScheduleRequest();
      } else {
        ctx.root.$message.error(res.data.message ?? '删除失败，稍后重试');
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

    const tableHeightLogic = useAutoTableHeightInCard({
      compensation: computed(
        () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      ),
      fixedBlockHeightRefs: [topCardHeight],
      tableMinHeight: 100,
    });

    const onPayRefundSave = () => {
      payRefundVisible.value = false;
      sendGetCostScheduleRequest();
    };

    const onRefundWriteOffSave = () => {
      refundWriteOffVisible.value = false;
      sendGetCostScheduleRequest();
    };

    const onStartPaySave = () => {
      startPayVisible.value = false;
      sendGetCostScheduleRequest();
    };

    const loanDetailVisible = ref<boolean>(false);
    const detail_data = ref({ name: '' });
    const onRowClick = (row: any) => {
      detail_data.value = row;
      loanDetailVisible.value = true;
    };
    const onLoanDetailClose = () => {
      loanDetailVisible.value = false;
    };
    /** 隐藏已冲销数据用*/
    const reload = () => {
      sendGetCostScheduleRequest();
    };
    return {
      payRefundBusinessType,
      isHideReversed,
      reload,
      payRefundVisible,
      refundWriteOffVisible,
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
      // applyDetailRef,
      // applicationDetailRef,
      // refundDetailDialogRef,
      costRegisterPermission,
      costRebatePermission,
      approval,
      firstStepRef,
      reverseOrderDialogRef,
      reverseLoading,
      reverseAgainLoading,
      reasonDialogVisible,
      reason,
      reasonDialogTitle,
      onReasonDialogClose,
      ...tableHeightLogic,
      onPayRefundSave,
      payRefundCostId,
      onRefundWriteOffSave,
      notRefundWriteOffAmount,
      refundWriteoffId,
      refundWriteoffCostId,
      payRefundAmout,
      startPayVisible,
      detail_data,
      loanDetailVisible,
      onRowClick,
      onLoanDetailClose,
      startPayCost,
      onStartPaySave,
    };
  },
});
