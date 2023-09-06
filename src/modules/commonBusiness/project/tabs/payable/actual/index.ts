import {
  computed,
  defineComponent,
  h,
  inject,
  onMounted,
  Ref,
  ref,
  UnwrapRef,
} from '@vue/composition-api';
import { useRouter } from '@/use/vue-router';
import { fillEmptyStr, get_limited_length_string } from '@/utils/string';
import { AsyncConfirm } from '@/use/asyncConfirm';
import type {
  CommonBusinessPayableActual,
  CommonBusinessProjectDetail,
} from '@/types/tiange/commonBusiness/project';
import { usePermission } from '@/use/permission';
import { useUserInfo } from '@/use/vuex';
import PayableActual from '@/modules/commonBusiness/project/dialog/payable.actual.vue';
import WriteListPop from '@/modules/finance/components/WriteListPop/index.vue';
import InvoiceList from '@/modules/live/project/dialog/invoice.list.vue';
import invoice from '@/modules/live/project/dialog/invoice';
import FirstStep from '@/modules/live/project/tabs/writeDialog/firstStep.vue';
import FinanceInvoiceDetailDialog from '@/modules/finance/dialog/finance.invoice.detail.vue';
import reverseOrderDialog from '@/modules/settlement/component/reverseOrder.vue';

import {
  CommonBusinessSaveCostAction,
  GetCommonPayableActualList,
  CommonBusinessPayableActualDelCost,
} from '@/services/commonBusiness/project';
import { getToken } from '@/utils/token';
import { FinancialReverseParams, ReverseType } from '@/types/tiange/finance/settlement';
import { FinancialReverse, FinancialReverseAgain } from '@/services/finance';
import { CostType, CostTypeMap } from '@/types/tiange/finance/finance';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { TableColumn } from '@/types/vendor/column';
import { max_length_of_column } from '@/utils/table';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { VNode } from 'vue/types/umd';
import PayRefund from '@/modules/live/project/dialog/payRefund.vue';
import RefundWriteOff from '@/modules/live/project/dialog/refundWriteOff.vue';
import Decimal from 'decimal.js';
import LoanfinanceDetailModal from '@/modules/finance/components/loan/paydetail.vue';
import { formatAmount } from '@/utils/string';

export default defineComponent({
  name: 'TgMarketingProjectTabActual',
  components: {
    WriteListPop,
    PayableActual,
    InvoiceList,
    FirstStep,
    FinanceInvoiceDetailDialog,
    reverseOrderDialog,
    PayRefund,
    RefundWriteOff,
    LoanfinanceDetailModal,
  },
  setup: function (props, ctx) {
    const router = useRouter();
    const project_id = router.currentRoute.params.id;
    const project =
      inject<Ref<CommonBusinessProjectDetail>>('project') ?? ref<CommonBusinessProjectDetail>();
    // 4: 基地业务 5: 创新项目
    const currentProject = computed(() => project.value);
    const business_type = currentProject.value?.business_type;

    const writeOffLoading = ref<boolean>(false);
    const saveLoading = ref<boolean>(false);

    const notRefundWriteOffAmount = ref<number | undefined>(undefined);
    const refundWriteoffId = ref<number | undefined>(undefined);
    const refundWriteoffCostId = ref<number | undefined>(undefined);

    const payRefundCostId = ref<number | undefined>(undefined);

    const reasonVisible = ref<boolean>(false);
    const reasonTitle = ref<string>('');
    const reason = ref<string>('');
    const payRefundVisible = ref<boolean>(false);
    const refundWriteOffVisible = ref<boolean>(false);
    const payRefundAmout = ref<number | undefined>(undefined);

    /** 权限检查 */
    const Permission = usePermission();

    const firstStepRef = ref<UnwrapRef<{ show: (...args: any) => void } | undefined>>(undefined);
    const userInfo = useUserInfo();
    const loading = ref(false);
    const list = ref<any>([]);
    const info = ref<any>({
      total_pay_amount: 0,
      paid_amount: 0,
      wait_pay_amount: 0,
      write_off_amount: 0,
      not_write_off_amount: 0,
    });
    const invoicelistRef = ref<UnwrapRef<{ show: (...arg: any) => void } | undefined>>(undefined);

    const shouldVisible = ref<boolean>(false);
    const title = ref<string>('');
    const costId = ref<number | undefined>(undefined);
    const dialogData = ref<CommonBusinessPayableActual>({
      pay_amount: '',
      transfer_date: '',
      pay_reason: '',
      pay_way: 1,
      pay_way_detail: {
        name: '',
      },
    });
    const payRefundData = ref({});
    const editCost = (item: any) => {
      costId.value = item.cost_id;
      dialogData.value = {
        pay_amount: item.pay_amount,
        transfer_date: item.transfer_date,
        pay_reason: item.pay_reason,
        pay_way: item.pay_way,
        pay_way_detail: item.pay_way_detail,
      };
      title.value = '编辑登记成本';
      shouldVisible.value = !shouldVisible.value;
    };

    const reverseOrderDialogRef = ref<{
      open: (cb: (msg: string) => Promise<boolean>, reverse_reason?: string) => void;
    } | null>(null);

    /** 冲销动作 */
    const onWriteOffConfirmResolve = async (row: any, msg: string, again: boolean) => {
      const params: FinancialReverseParams = {
        id: row.cost_id,
        reverse_reason: msg,
        reverse_type: ReverseType.payment,
      };
      writeOffLoading.value = true;
      let res;
      if (again) {
        res = await FinancialReverseAgain(params);
      } else {
        res = await FinancialReverse(params);
      }
      writeOffLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success(res.data.message ?? '冲销成功');
        getList();
      } else {
        ctx.root.$message.error(res.data.message ?? '冲销失败');
      }

      return res.data.success;
    };

    const handleReserve = (row: any, again: boolean) => {
      reverseOrderDialogRef.value?.open(
        msg => onWriteOffConfirmResolve(row, msg, again),
        row.reverse_reason,
      );
    };

    const handleViewReserveReason = (row: any) => {
      reasonVisible.value = true;
      reasonTitle.value = '冲销原因';
      reason.value = row.reverse_reason;
    };

    const handleViewReserveBackReason = (row: any) => {
      reasonVisible.value = true;
      reasonTitle.value = '冲销退回原因';
      reason.value = row.reverse_back_reason;
    };

    const onReasonDialogClose = () => {
      reason.value = '';
      reasonVisible.value = false;
    };

    // const handleAddEventAction = () => {
    //   title.value = '登记成本';
    //   costId.value = undefined;
    //   shouldVisible.value = !shouldVisible.value;
    // };

    const handleCloseAction = () => {
      shouldVisible.value = false;
      costId.value = undefined;
      dialogData.value = {
        pay_amount: '',
        transfer_date: '',
        pay_reason: '',
        pay_way: 1,
        pay_way_detail: {
          name: '',
        },
      };
    };
    const handleSucceedAction = async (payload: CommonBusinessPayableActual) => {
      const projectId = Number(project_id);
      const data = { project_id: projectId, ...payload };
      if (costId.value) {
        data.cost_id = costId.value;
      }
      saveLoading.value = true;
      const res = await CommonBusinessSaveCostAction(data);
      saveLoading.value = false;
      if (res.data.success) {
        shouldVisible.value = !shouldVisible.value;
        dialogData.value = {
          pay_amount: '',
          transfer_date: '',
          pay_reason: '',
          pay_way: 1,
          pay_way_detail: {
            name: '',
          },
        };
        ctx.root.$message.success('保存通用业务成本成功！');
        getList();
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };

    const delCost = async (costId: number, title: string) => {
      const result = await AsyncConfirm(ctx, title);
      if (!result) {
        return;
      }
      const res = await CommonBusinessPayableActualDelCost(costId);
      if (res.data.success) {
        ctx.root.$message.success('删除成功！');
        getList();
      } else {
        getList();
        ctx.root.$message.error(res.data.message);
      }
    };
    const isHideReversed = ref(true);
    const getList = async () => {
      loading.value = true;
      const res = await GetCommonPayableActualList(
        project_id,
        isHideReversed.value ? 1 : undefined,
      );
      if (res.data.success) {
        const data = res.data.data;
        list.value = data.list;
        info.value = {
          total_pay_amount: data.total_pay_amount,
          paid_amount: data.paid_amount,
          wait_pay_amount: data.wait_pay_amount,
          write_off_amount: data.write_off_amount,
          not_write_off_amount: data.not_write_off_amount,
        };
        loading.value = false;
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };

    // 发票弹框相关操作
    const invoiceShow = ref(false);
    const invoiceList = ref<any>([]);
    const showInvoice = (list: never[]) => {
      invoiceList.value = list;
      invoiceShow.value = true;
    };
    const closeInvoice = () => {
      invoiceShow.value = false;
    };

    // 打开凭证弹框
    const showCertificatePic = (link: string) => {
      const list = link.split(',');
      if (list.length === 1) {
        invoice.showDetail(list[0] + '?Authorization=' + getToken());
      } else {
        invoicelistRef.value?.show({
          title: '打款凭证',
          list: list.map((val: any) => val + '?Authorization=' + getToken()),
          type: 1,
        });
      }
    };

    const handleWriteOff = (row: any) => {
      //@firstStepRef 通用业务实付
      firstStepRef.value?.show({
        type: 'isActual',
        id: row.cost_id,
        amount: row.not_write_off_amount, // 可核销金额
        leaf: 'common_business', // 店铺代播
        busType: row.business_type, // businessType
        receivable_uid: row.cost_id, // 应收编号
      });
    };

    const costTypeName = (costType: CostType) => {
      return CostTypeMap.get(costType) ?? '--';
    };

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

    onMounted(() => {
      if (project_id) {
        getList();
      }
    });

    // 自适应表格高度部分
    const buttonLineHeight = 32;
    const paginationLineHeight = 0;
    const rectPadding = 0;
    const otherHeight = 0;

    const topCardHeight = ref(100);
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

    // const settlement_uid_render = <T extends boolean>(row: any, text_only: T) => {
    //   const textClass = row.reversed_id ? 'reverse-red' : '';
    //   const payable_uid = row.uid;

    //   return text_only
    //     ? payable_uid
    //     : (h('div', { class: textClass }, [payable_uid]) as TableColumnRenderReturn<T>);
    // };

    const payable_uid_render = <T extends boolean>(row: any, text_only: T) => {
      const textClass = row.reverse_id !== null || row.reversed_id ? 'reverse-red' : '';
      const payable_uid = row.uid;

      return text_only
        ? payable_uid
        : (h('div', { class: textClass }, [payable_uid]) as TableColumnRenderReturn<T>);
    };

    const pay_amount_render = <T extends boolean>(row: any, text_only: T) => {
      const textClass = row.reverse_id !== null || row.reversed_id !== null ? 'reverse-red' : '';
      const amount = String(formatAmount(row.pay_amount, ''));

      return text_only
        ? amount
        : (h('div', { class: textClass }, [amount]) as TableColumnRenderReturn<T>);
    };

    const pay_reason_render = <T extends boolean>(row: any, text_only: T) => {
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
                width: '220',
                content: data,
              },
            },
            [h('div', { slot: 'reference' }, [folded_text])],
          ) as TableColumnRenderReturn<T>);
    };

    /** 供应商渲染函数 */
    const supplier_render = <T extends boolean>(row: any, text_only: T) => {
      const data = row.cost_company_name || '--';

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

    const columns = computed<TableColumn<any>[]>(() => [
      {
        label: '付款编号',
        minWidth: max_length_of_column(list, '付款编号', payable_uid_render).value,
        align: 'center',
        formatter: row => payable_uid_render(row, false),
      },
      {
        label: '付款金额 (元)',
        align: 'right',
        minWidth: max_length_of_column(list, '付款金额 (元)', pay_amount_render).value,
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
        minWidth: max_length_of_column(list, '付款事由', pay_reason_render).value,
        formatter: row => pay_reason_render(row, false),
      },
      {
        label: '供应商',
        minWidth: max_length_of_column(list, '供应商', supplier_render).value,
        formatter: row => supplier_render(row, false),
      },
      // {
      //   label: '是否开票',
      //   minWidth: 80,
      //   align: 'center',
      //   formatter: row => {
      //     if (row.is_invoice === 0) {
      //       return '未开票';
      //     }
      //     return h(
      //       'tg-button',
      //       {
      //         props: {
      //           type: 'link',
      //         },
      //         on: {
      //           click: (event: PointerEvent) => {
      //             showInvoice(row.invoice_info);
      //             event.stopPropagation();
      //           },
      //         },
      //       },
      //       ['查看'],
      //     );
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
                    showCertificatePic(row.pay_certificate_pic);
                    event.stopPropagation();
                  },
                },
              },
              ['查看'],
            );
          } else {
            return '--';
          }
        },
      },
      {
        label: '核销状态',
        minWidth: 130,
        align: 'center',
        formatter: row => {
          const nodes: VNode[] = [];
          let statusNode: VNode | undefined = undefined;
          if (row.write_off_status === 2) {
            statusNode = h('p', { class: 'write-on label-70' }, ['已核销']);
          } else if (row.write_off_status === 1) {
            statusNode = h('p', { class: 'write-off label-70' }, ['部分核销']);
          } else {
            statusNode = h('p', { class: 'write-off label-70' }, ['未核销']);
          }
          nodes.push(
            h(
              'div',
              {
                class: 'line-info',
                style: {
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                },
              },
              [h('p', { class: 'label-50' }, ['状态：']), statusNode],
            ),
          );
          if (
            row.pay_type === 2
              ? row.refund_write_off_infos.length > 0
              : row.write_off_infos.length > 0
          ) {
            nodes.push(
              h(
                'div',
                {
                  class: 'line-info',
                  style: {
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  },
                },
                [
                  h('p', { class: 'label-50' }, ['详情：']),
                  h(WriteListPop, {
                    class: 'label-70',
                    props: {
                      list:
                        row.pay_type === 2
                          ? row.refund_write_off_infos.map((el: any) => {
                              const newEl = { ...el };
                              newEl.write_off_amount = newEl.write_off_amount * -1;
                              return newEl;
                            })
                          : row.write_off_infos,
                      type: row.pay_type === 2 ? 'receive' : 'commonBusinessPayableActual',
                      showSettlementUid: true,
                      dateText: '账期时间',
                    },
                  }),
                ],
              ),
            );
          }
          return nodes;
        },
      },
      {
        label: '单据状态',
        minWidth: 80,
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

      // {
      //   label: '成本类型',
      //   minWidth: 112,
      //   formatter: row => {
      //     const cls = row.new_cost_type === 9 ? 'reverse-red' : '';
      //     return h('div', { class: cls }, [costTypeName(row.new_cost_type)]);
      //   },
      // },
      // {
      //   label: '用款日期',
      //   minWidth: 104,
      //   formatter: row => row.transfer_date,
      // },
      // {
      //   label: '收款方信息',
      //   minWidth: 266,
      //   formatter: row => {
      //     const nodes: VNode[] = [];
      //     const nameNodes: VNode[] = [];
      //     let wayNode: VNode | string = '--';

      //     nameNodes.push(h('p', { class: 'label-50' }, ['名称：']));
      //     if (row.pay_way_detail.name && row.pay_way_detail.name.length > 12) {
      //       nameNodes.push(
      //         h('el-popover', {
      //           props: {
      //             placement: 'top-start',
      //             width: '200',
      //             trigger: 'hover',
      //             content: row.pay_way_detail.name,
      //           },
      //           scopedSlots: {
      //             reference: () =>
      //               h('p', { class: 'line-clamp-1 customer-name', style: 'width: 195px' }, [
      //                 row.pay_way_detail.name,
      //               ]),
      //           },
      //         }),
      //       );
      //     } else {
      //       nameNodes.push(
      //         h('p', { class: 'customer-name' }, [fillEmptyStr(row.pay_way_detail.name)]),
      //       );
      //     }

      //     if (row.pay_way === 1) {
      //       wayNode = h('p', ['银行卡']);
      //     } else if (row.pay_way === 2) {
      //       wayNode = h('p', ['v任务']);
      //     } else if (row.pay_way === 3) {
      //       wayNode = h('p', ['对公银行']);
      //     } else if (row.pay_way === 4) {
      //       wayNode = h('p', ['支付宝']);
      //     }
      //     nodes.push(h('div', { class: 'line-info' }, [nameNodes]));
      //     nodes.push(
      //       h('div', { class: 'line-info' }, [h('p', { class: 'label-50' }, ['方式：']), wayNode]),
      //     );

      //     return nodes;
      //   },
      // },

      // {
      //   label: '税点金额',
      //   align: 'right',
      //   minWidth: max_length_of_column(list, '税点金额', tax_point_render).value,
      //   formatter: tax_point_render,
      // },
      // {
      //   label: '财务确认信息',
      //   minWidth: 174,
      //   formatter: row => {
      //     if (row.is_pay === 2) {
      //       return '--';
      //     }
      //     if (row.is_pay === 0) {
      //       return '待打款';
      //     }
      //     const nodes: VNode[] = [];
      //     nodes.push(
      //       h('div', { class: 'line-info' }, [
      //         h('p', { class: 'label-70' }, ['状态：']),
      //         h('p', ['已打款']),
      //       ]),
      //     );
      //     nodes.push(
      //       h('div', { class: 'line-info' }, [
      //         h('p', { class: 'label-70' }, ['打款日期：']),
      //         h('p', [row.pay_date.replace(/-/g, '.')]),
      //       ]),
      //     );
      //     nodes.push(
      //       h('div', { class: 'line-info' }, [
      //         h('p', { class: 'label-70' }, ['凭证：']),
      //         h(
      //           'tg-button',
      //           {
      //             props: {
      //               type: 'link',
      //             },
      //             on: {
      //               click: () => showCertificatePic(row.pay_certificate_pic),
      //             },
      //           },
      //           ['查看'],
      //         ),
      //       ]),
      //     );
      //     return nodes;
      //   },
      // },
      // {
      //   label: '核销状态',
      //   minWidth: 126,
      //   formatter: row => {
      //     const nodes: VNode[] = [];
      //     let statusNode: VNode | undefined = undefined;
      //     if (row.write_off_status === 2) {
      //       statusNode = h('p', { class: 'write-on' }, ['已核销']);
      //     } else if (row.write_off_status === 1) {
      //       statusNode = h('p', { class: 'write-off' }, ['部分核销']);
      //     } else {
      //       statusNode = h('p', { class: 'write-off' }, ['未核销']);
      //     }
      //     nodes.push(
      //       h('div', { class: 'line-info' }, [
      //         h('p', { class: 'label-50' }, ['状态：']),
      //         statusNode,
      //       ]),
      //     );
      //     if (
      //       row.pay_type === 2
      //         ? row.refund_write_off_infos.length > 0
      //         : row.write_off_infos.length > 0
      //     ) {
      //       nodes.push(
      //         h('div', { class: 'line-info' }, [
      //           h('p', { class: 'label-50' }, ['详情：']),
      //           h(WriteListPop, {
      //             props: {
      //               list:
      //                 row.pay_type === 2
      //                   ? row.refund_write_off_infos.map((el: any) => {
      //                       const newEl = { ...el };
      //                       newEl.write_off_amount = newEl.write_off_amount * -1;
      //                       return newEl;
      //                     })
      //                   : row.write_off_infos,
      //               type: row.pay_type === 2 ? 'receive' : 'commonBusinessPayableActual',
      //             },
      //           }),
      //         ]),
      //       );
      //     }
      //     return nodes;
      //   },
      // },
      // {
      //   label: '冲销状态',
      //   minWidth: 126,
      //   formatter: row => {
      //     let node: VNode | string = h('div', '--');
      //     if (row.reverse_status === 1) {
      //       node = h('div', { style: 'color: #ff7a36' }, ['待确认']);
      //     } else if (row.reverse_status === 2) {
      //       node = h('div', { style: 'color: var(--success-color)' }, ['已确认']);
      //     } else if (row.reverse_status === 3) {
      //       node = h('div', { style: 'color: var(--error-color)' }, ['退回']);
      //     }
      //     return node;
      //   },
      // },
      // {
      //   label: '录入人/日期',
      //   minWidth: 106,
      //   formatter: row =>
      //     h('div', [
      //       h('p', [row.add_by]),
      //       h('p', { class: 'color-a4b2c2' }, [fillEmptyStr(row.add_date)]),
      //     ]),
      // },
      {
        label: '操作',
        fixed: 'right',
        minWidth: 160,
        formatter: row => {
          const nodes: VNode[] = [];
          if (row.reversed_id) {
            //  冲销单
            if (row.reverse_status === 3) {
              if (row.pay_type !== 2) {
                nodes.push(
                  h(
                    'tg-button',
                    {
                      props: {
                        type: 'link',
                      },
                      class: 'mgr-12',
                      on: {
                        click: (event: PointerEvent) => {
                          delCost(row.cost_id, '是否删除该冲销单');
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
                  'tg-button',
                  {
                    props: {
                      type: 'link',
                    },
                    class: 'mgr-12',
                    on: {
                      click: (event: PointerEvent) => {
                        handleReserve(row, true);
                        event.stopPropagation();
                      },
                    },
                  },
                  ['重新提交'],
                ),
              );
              nodes.push(
                h(
                  'tg-button',
                  {
                    props: {
                      type: 'link',
                    },
                    on: {
                      click: (event: PointerEvent) => {
                        handleViewReserveBackReason(row);
                        event.stopPropagation();
                      },
                    },
                  },
                  ['退回原因'],
                ),
              );
            } else {
              nodes.push(
                h(
                  'tg-button',
                  {
                    props: {
                      type: 'link',
                    },
                    on: {
                      click: (event: PointerEvent) => {
                        handleViewReserveReason(row);
                        event.stopPropagation();
                      },
                    },
                  },
                  ['查看'],
                ),
              );
            }
          } else {
            //  非冲销单
            if (row.is_pay === 1 && !row.reverse_id && row.pay_type !== 2 && !row.has_refund) {
              nodes.push(
                h(
                  'tg-button',
                  {
                    props: {
                      type: 'link',
                    },
                    class: 'button-item-reverse',
                    on: {
                      click: (event: PointerEvent) => {
                        handleReserve(row, false);
                        event.stopPropagation();
                      },
                    },
                  },
                  ['冲销'],
                ),
              );
            }
            if (
              row.write_off_status !== 2 &&
              row.is_pay === 1 &&
              row.pay_type === 1 &&
              business_type !== 4 &&
              Permission.common_business_write_off &&
              !row.reverse_id
            ) {
              nodes.push(
                h(
                  'tg-button',
                  {
                    props: {
                      type: 'link',
                    },
                    class: 'mgl-12',
                    on: {
                      click: (event: PointerEvent) => {
                        handleWriteOff(row);
                        event.stopPropagation();
                      },
                    },
                  },
                  ['核销'],
                ),
              );
            }
            // if (row.is_pay !== 1 && row.add_by_id === userInfo.value.id) {
            //   nodes.push(
            //     h(
            //       'tg-button',
            //       {
            //         props: {
            //           type: 'link',
            //         },
            //         class: 'mgr-12',
            //         on: {
            //           click: (event: PointerEvent) => {
            //             editCost(row);
            //             event.stopPropagation();
            //           },
            //         },
            //       },
            //       ['编辑'],
            //     ),
            //   );
            //   nodes.push(
            //     h(
            //       'tg-button',
            //       {
            //         props: {
            //           type: 'link',
            //         },
            //         on: {
            //           click: (event: PointerEvent) => {
            //             delCost(row.cost_id, `确认删除该成本？`);
            //             event.stopPropagation();
            //           },
            //         },
            //       },
            //       ['删除'],
            //     ),
            //   );
            // }
          }
          if (row.is_pay && row.pay_type !== 2 && !row.reverse_id && row.reverse_status === null) {
            const refundMoneyBtn = h(
              'tg-button',
              {
                props: {
                  type: 'link',
                },
                class: nodes.length > 0 ? 'mgl-12' : '',
                on: {
                  click: (event: PointerEvent) => {
                    payRefundAmout.value = new Decimal(row.pay_amount ?? 0)
                      .sub(new Decimal(row.refunded_amount ?? 0))
                      .toNumber();
                    payRefundVisible.value = true;
                    payRefundCostId.value = row.cost_id;
                    payRefundData.value = row;
                    event.stopPropagation();
                  },
                },
              },
              ['退款'],
            );
            nodes.push(refundMoneyBtn);
          }
          if (
            row.is_pay &&
            row.pay_type === 2 &&
            !row.reverse_id &&
            !row.reversed_id &&
            row.write_off_status !== 2
          ) {
            const refundMoneyBtn = h(
              'tg-button',
              {
                props: {
                  type: 'link',
                },
                class: nodes.length > 0 ? 'mgl-12' : '',
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
            nodes.push(refundMoneyBtn);
          }
          // 禁止删除实付记录
          // if (
          //   row.is_pay === 0 &&
          //   row.pay_type === 1 &&
          //   Permission.common_business_project_settlement_delete
          // ) {
          //   nodes.push(
          //     h(
          //       'tg-button',
          //       {
          //         props: {
          //           type: 'link',
          //         },
          //         on: {
          //           click: (event: PointerEvent) => {
          //             delCost(row.cost_id, '确认删除' + (row.pay_type === 1 ? '成本' : '退款'));
          //             event.stopPropagation();
          //           },
          //         },
          //       },
          //       ['删除'],
          //     ),
          //   );
          // }
          return h('div', nodes);
        },
      },
    ]);

    const onPayRefundSave = () => {
      payRefundVisible.value = false;
      getList();
    };
    const onRefundWriteOffSave = () => {
      refundWriteOffVisible.value = false;
      getList();
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
      getList();
    };
    return {
      isHideReversed,
      reload,
      columns,
      saveLoading,
      Permission,
      invoicelistRef,
      loading,
      info,
      list,
      formatAmount,
      fillEmptyStr,
      showInvoice,
      closeInvoice,
      invoiceList,
      invoiceShow,
      project_id,
      shouldVisible,
      title,
      handleCloseAction,
      handleSucceedAction,
      // handleAddEventAction,
      showCertificatePic,
      dialogData,
      editCost,
      delCost,
      business_type,
      firstStepRef,
      handleWriteOff,
      userInfo,
      getList,
      writeOffLoading,
      handleReserve,
      reverseOrderDialogRef,
      onWriteOffConfirmResolve,
      handleViewReserveReason,
      handleViewReserveBackReason,
      onReasonDialogClose,
      reasonVisible,
      reason,
      reasonTitle,
      costTypeName,
      ...tableHeightLogic,
      payRefundVisible,
      refundWriteOffVisible,
      onPayRefundSave,
      payRefundCostId,
      onRefundWriteOffSave,
      notRefundWriteOffAmount,
      refundWriteoffId,
      refundWriteoffCostId,
      payRefundAmout,
      loanDetailVisible,
      detail_data,
      onRowClick,
      onLoanDetailClose,
      payRefundData,
    };
  },
});
