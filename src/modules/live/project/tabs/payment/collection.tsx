import { computed, defineComponent, h, ref } from '@vue/composition-api';
import achievement from '../../dialog/cost.dialog.vue';
import invoicelist from '../../dialog/invoice.list.vue';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { useRouter } from '@/use/vue-router';
// import formatData from '@/utils/formatData';
import invoice from '@/modules/live/project/dialog/invoice';
import { getToken } from '@/utils/token';
import { usePermission } from '@/use/permission';
import { useUserInfo } from '@/use/vuex';
// import applyDetail from '@/views/workbench/components/ApplyDetail.vue';
// import refundDetail from '@/views/workbench/refund/refundDetail.vue';
// import applicationDetail from '@/views/workbench/application/applicationDetail.vue';
import invoicesDetail from '@/views/workbench/invoices/invoicesDetail.vue';
import WriteOff from '@/components/BusinessComponents/WriteOff/index.vue';
import FirstStep from '@/modules/live/project/tabs/writeDialog/firstStep.vue';
import reverseOrderDialog from '@/modules/settlement/component/reverseOrder.vue';
import { FinancialReverseParams, ReverseType } from '@/types/tiange/finance/settlement';
import useVisible from '@/use/visible';
import { FinancialReverse, FinancialReverseAgain } from '@/services/finance';
import { wait } from '@/utils/func';
import { ReverseOrderDialog } from '@/modules/settlement/component/reverseOrder';
import { DELETE_SHOP_LIVE_COST, queryShopLiveCost } from '@/services/live.project';
import { Decimal2String, get_limited_length_string } from '@/utils/string';
import Decimal from 'decimal.js';
import { TableColumn } from '@/types/vendor/column';
import { LiveAchivement } from '@/types/tiange/live';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { max_length_of_column } from '@/utils/table';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { ApprovalInfo } from '@/types/tiange/workbench';
import PaymentDetailDialog from '@/modules/workbench/initiate/payment/detail.vue';
import RefundDetailDialog from '@/modules/marketing/project/dialog/refund/detail.vue';
import AdvanceDetailDialog from '@/modules/workbench/initiate/advance/detail.vue';
import PayRefund from '../../dialog/payRefund.vue';
import RefundWriteOff from '../../dialog/refundWriteOff.vue';
import LoanfinanceDetailModal from '@/modules/finance/components/loan/paydetail.vue';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

const money_format = (num: string | number) => `￥${Decimal2String(new Decimal(num))}`;
const price_format = (num: string | number) => `${Decimal2String(new Decimal(num))}`;
/** 调试模式: 比如额外显示一个刷新列表的按钮 */

export default defineComponent({
  components: {
    achievement,
    invoicelist,
    // applyDetail,
    // refundDetail,
    // applicationDetail,
    invoicesDetail,
    FirstStep,
    reverseOrderDialog,
    PaymentDetailDialog,
    RefundDetailDialog,
    AdvanceDetailDialog,
    PayRefund,
    RefundWriteOff,
    LoanfinanceDetailModal,
  },
  setup(props, ctx) {
    /** 本地生活 */
    const { isFromLocalLife, business_type, isFromSupplyChain, isFromLiveDouyin } =
      useProjectBaseInfo();
    const achievementRef = ref<{ show: (obj?: any) => void } | null>(null);
    const invoicelistRef = ref<{ show: (obj: any) => void } | null>(null);
    // const applyDetailDialog = ref<{ show: (obj?: any) => void } | null>(null);
    // const refundDetailDialog = ref<{ show: (obj?: any) => void } | null>(null);
    // const applicationDetailDialog = ref<{ show: (obj?: any) => void } | null>(null);
    const invoicesDetailDialog = ref<{ show: (obj?: any) => void } | null>(null);
    const applyDetailDialogVisible = ref(false);
    const refundVisible = ref(false);
    const applicationVisible = ref(false);
    const invoicesVisible = ref(false);
    const firstStepRef = ref<{ show: (...args: any) => void } | undefined>(undefined);

    const refundWriteoffId = ref<string | undefined>(undefined);
    const refundWriteoffCostId = ref<number | undefined>(undefined);

    const payRefundInfo = ref<{ id: number | undefined; amout: number | undefined }>({
      id: undefined,
      amout: undefined,
    });
    const isHideReversed = ref(true);
    const payRefundVisible = ref<boolean>(false);
    const payRefundDialogData = ref<any>({});
    const refundWriteOffVisible = ref<boolean>(false);
    const notRefundWriteOffAmount = ref<number | undefined>(undefined);

    const permission = usePermission();
    const loanDetailVisible = ref<boolean>(false);
    const detail_data = ref<any | undefined>({});

    // # 列表部分
    const data = ref<LiveAchivement[]>([]);
    const loading = ref(false);
    let lastParams: any;
    const paid_amount = ref(0);
    const total_pay_amount = ref(0);
    const wait_pay_amount = ref(0);
    const write_off_amount = ref(0);
    const not_write_off_amount = ref(0);
    const total = ref(0);

    const workbenchState = computed(() => ctx.root.$store.state.workbench);
    const approval = computed<ApprovalInfo | undefined>(() => workbenchState.value.approval);
    const query = async (params: any = {}) => {
      lastParams = { ...params, is_hide_reverse_data: isHideReversed.value ? 1 : undefined };

      loading.value = true;
      const [res] = await wait(500, queryShopLiveCost(lastParams, business_type.value));
      loading.value = false;

      if (res.data.success) {
        const info = res.data.data;
        data.value = info.data;

        paid_amount.value = info.stat_info.paid_amount;
        total_pay_amount.value = info.stat_info.total_pay_amount;
        wait_pay_amount.value = info.stat_info.wait_pay_amount;
        not_write_off_amount.value = info.stat_info.not_write_off_amount;
        write_off_amount.value = info.stat_info.write_off_amount;
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };

    const reload = () => {
      query({ ...lastParams });
    };

    const Delete = (cost_id: number) => {
      DELETE_SHOP_LIVE_COST(cost_id + '').then(res => {
        if (res.data.success) {
          ctx.root.$message.success(res.data.message);
          reload();
        } else {
          ctx.root.$message.error(res.data.message);
        }
      });
    };
    // # 列表部分结束

    const router = useRouter();
    const project_id = router.currentRoute.params.id;
    const deleteCollection = async (cost_id: number, msg: string) => {
      const ok = await AsyncConfirm(ctx, msg);
      if (ok) {
        Delete(cost_id);
      }
    };
    query({
      project_id,
    });
    const userinfo = useUserInfo();

    const reverseOrderDialogRef = ref<ReverseOrderDialog | null>(null);

    const { visible: writeOffLoading, toggleVisible: toggleWriteOffLoading } = useVisible();

    /** 冲销动作 */
    const onWriteOffConfirmResolve = async (reverse_id: number, reverse_reason: string) => {
      toggleWriteOffLoading();

      const params: FinancialReverseParams = {
        id: reverse_id,
        reverse_reason: reverse_reason,
        reverse_type: ReverseType.payment,
      };
      const res = await FinancialReverse(params);
      toggleWriteOffLoading();
      if (res.data.success) {
        ctx.root.$message.success(res.data.message ?? '冲销成功');
        reload();
      } else {
        ctx.root.$message.error(res.data.message ?? '冲销失败');
      }

      return res.data.success;
    };

    const reasonDialogVisible = ref(false);
    const reason = ref('');
    const reasonDialogTitle = ref('');

    const onReasonDialogClose = () => {
      reason.value = '';
      reasonDialogVisible.value = false;
    };

    const onReverseReasonViewBtnClick = (reverse_reason: string) => {
      reasonDialogTitle.value = '冲销原因';
      reason.value = reverse_reason;
      reasonDialogVisible.value = true;
    };

    const onReverseBackReasonViewBtnClick = (reverse_back_reason: string) => {
      reasonDialogTitle.value = '退回原因';
      reason.value = reverse_back_reason;
      reasonDialogVisible.value = true;
    };
    const { visible: reverseAgainLoading, toggleVisible: toggleReverseAgainLoading } = useVisible();

    /** 重新提交冲销 */
    const reverseAgain = async (reverse_id: number, reverse_reason: string) => {
      toggleReverseAgainLoading();
      const [{ data: response }] = await wait(
        500,
        FinancialReverseAgain({
          id: reverse_id,
          reverse_type: ReverseType.payment,
          reverse_reason,
        }),
      );
      toggleReverseAgainLoading();

      if (response.success) {
        ctx.root.$message.success(response.message ?? '重新提交成功');
        reload();
      } else {
        ctx.root.$message.error(response.message ?? '重新提交失败');
      }

      return response.success;
    };

    // 是否是冲销数据
    const isReversedRow = (row: { reversed_id: number | null }) => {
      return row.reversed_id !== null && row.reversed_id !== 0;
    };

    const all_amount = computed(() => {
      return {
        total_pay_amount: money_format(total_pay_amount.value),
        paid_amount: money_format(paid_amount.value),
        wait_pay_amount: money_format(wait_pay_amount.value),
        write_off_amount: money_format(write_off_amount.value),
        not_write_off_amount: money_format(not_write_off_amount.value),
      };
    });
    /** 结算单比那好渲染函数 */
    // const settlement_uid_render = <T extends boolean>(row: LiveAchivement, text_only: T) =>
    //   text_only || row.reversed_id === null
    //     ? row.uid
    //     : (h('span', { class: 'reverse-red' }, [row.uid]) as TableColumnRenderReturn<T>);

    /** 结算单编号最大宽度 */
    // const settlement_uid_max_length = max_length_of_column(
    //   data,
    //   '结算单编号',
    //   settlement_uid_render,
    // );

    /** 付款ID渲染函数 */
    const uid_render = <T extends boolean>(row: LiveAchivement, text_only: T) =>
      text_only || (row.reverse_id === null && row.reversed_id === null)
        ? row.uid
        : (h('span', { class: 'reverse-red' }, [row.uid]) as TableColumnRenderReturn<T>);

    /** 付款ID最大宽度 */
    const uid_max_length = max_length_of_column(data, '付款编号', uid_render);

    /** 付款类型渲染类型 */
    const pay_type_render = (row: LiveAchivement) =>
      row.pay_type === 1 ? '成本' : row.pay_type === 2 ? '退款' : '--';

    /** 打款金额渲染函数 */
    const pay_amount_render = <T extends boolean>(row: LiveAchivement, text_only: T) => {
      const text = price_format(row.pay_amount);
      return text_only || (row.reverse_id === null && row.reversed_id === null)
        ? text
        : (h('span', { class: 'reverse-red' }, [text]) as TableColumnRenderReturn<T>);
    };

    /** 打款金额最大宽度 */
    const pay_amount_max_length = max_length_of_column(data, '付款金额 (元)', pay_amount_render);

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

    /** 付款事由渲染函数 */
    const pay_reason_render = <T extends boolean>(row: LiveAchivement, text_only: T) => {
      const { is_folded, folded_text } = get_limited_length_string(row.pay_reason ?? '--', 12);

      return text_only || !is_folded
        ? folded_text
        : (h(
            'el-popover',
            {
              props: {
                placement: 'right',
                trigger: 'hover',
              },
            },
            [
              h('span', { slot: 'reference' }, [folded_text]),
              h('div', { style: { width: '300px' } }, [row.pay_reason]),
            ],
          ) as TableColumnRenderReturn<T>);
    };

    /** 付款事由最大宽度 */
    const pay_reason_max_length = max_length_of_column(data, '付款事由', pay_reason_render);

    // const onInvoiceBtnClick = (row: LiveAchivement) => {
    //   invoicelistRef.value?.show({
    //     title: '发票详情',
    //     secondTitle: '发票',
    //     list: row.invoice_info.map((item: any) => {
    //       item.info = [
    //         { label: '发票号码', value: formatData.formatEmpty(item.invoice_num) },
    //         {
    //           label: '开票时间',
    //           value: formatData.formatEmpty(item.invoice_date),
    //         },
    //         {
    //           label: '开票金额',
    //           value: money_format(item.amount),
    //         },
    //         { label: '开票公司', value: formatData.formatEmpty(item.institution) },
    //       ];
    //       return item;
    //     }),
    //     type: 0,
    //   });
    // };

    /** 开票信息渲染函数 */
    // const invoice_info_render = <T extends boolean>(row: LiveAchivement, text_only: T) => {
    //   if (row.invoice_info.length === 0) {
    //     return '未开票';
    //   }

    //   return text_only
    //     ? '查看'
    //     : (h(
    //         'a',
    //         {
    //           on: {
    //             click: (event: PointerEvent) => {
    //               onInvoiceBtnClick(row);
    //               event.stopPropagation();
    //             },
    //           },
    //         },
    //         ['查看'],
    //       ) as TableColumnRenderReturn<T>);
    // };

    /** 供应商渲染函数 */
    const supplier_render = <T extends boolean>(row: LiveAchivement, text_only: T) => {
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

    /** 开票信息最大宽度 */
    // const invoice_info_max_length = max_length_of_column(data, '是否开票', invoice_info_render, 20);

    const columns = computed<TableColumn<LiveAchivement>[]>(() => [
      // {
      //   label: '结算单编号',
      //   fixed: 'left',
      //   minWidth: settlement_uid_max_length.value,
      //   formatter: row => settlement_uid_render(row, false),
      // },
      {
        label: '付款编号',
        fixed: 'left',
        align: 'center',
        minWidth: uid_max_length.value,
        formatter: row => uid_render(row, false),
      },
      {
        label: '付款金额 (元)',
        align: 'right',
        minWidth: pay_amount_max_length.value,
        formatter: row => pay_amount_render(row, false),
      },
      {
        label: '付款类型',
        align: 'center',
        minWidth: 80,
        formatter: pay_type_render,
      },
      {
        label: '付款方式',
        minWidth: 80,
        align: 'center',
        formatter: row => {
          const pay_way_detail = row.pay_way_detail;
          if (!pay_way_detail || row.pay_way === null) return '--';
          const pay_way: number = row.pay_way;
          const payType: string = { 2: 'V任务', 3: '对公银行', 4: '支付宝' }[pay_way] || '未知类型';
          return payType;
        },
      },
      {
        label: '付款事由',
        minWidth: pay_reason_max_length.value,
        formatter: row => pay_reason_render(row, false),
      },
      {
        label: '供应商',
        minWidth: max_length_of_column(data, '供应商', supplier_render).value,
        formatter: row => supplier_render(row, false),
      },
      // {
      //   label: '是否开票',
      //   align: 'center',
      //   minWidth: invoice_info_max_length.value,
      //   formatter: row => invoice_info_render(row, false),
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
                    const images = row.pay_certificate_pic.split(',');
                    if (images.length === 1) {
                      invoice.showDetail(row.pay_certificate_pic + '?Authorization=' + getToken());
                    } else {
                      invoicelistRef.value?.show({
                        title: '打款凭证',
                        list: images.map((val: string) => val + '?Authorization=' + getToken()),
                        type: 1,
                      });
                    }
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
        minWidth: 120,
        formatter: row => {
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
            write_off_infos = (row.write_off_infos || []).map((item: any) => {
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
      //   label: '关联审批',
      //   minWidth: approval_uid_max_length.value,
      //   formatter: row => approval_uid_render(row, false),
      // },

      // {
      //   label: '成本类型',
      //   minWidth: new_cost_type_max_length.value,
      //   formatter: row => new_cost_type_render(row, false),
      // },
      // {
      //   label: '用款日期',
      //   minWidth: transfer_date_max_length.value,
      //   formatter: transfer_date_render,
      // },
      // {
      //   label: '收款方信息',
      //   minWidth: pay_way_detail_max_length.value,
      //   formatter: row => pay_way_detail_render(row, false),
      // },

      // {
      //   label: '备注',
      //   minWidth: note_max_length.value,
      //   formatter: row => note_render(row, false),
      // },

      // {
      //   label: '税点金额',
      //   align: 'right',
      //   minWidth: tax_point_max_length.value,
      //   formatter: row => (row.tax_point === null ? '--' : money_format(row.tax_point)),
      // },
    ]);

    // 自适应表格高度部分
    const buttonLineHeight = 32;
    const paginationLineHeight = 0;
    const rectPadding = 36;
    const otherHeight = 31;

    const { onRectUpdate, ...tableHeightLogic } = useAutoTableHeightInCard({
      compensation: computed(
        () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      ),
      fixedBlockHeightRefs: [],
      tableMinHeight: 100,
    });

    return {
      isFromLocalLife,
      isFromLiveDouyin,
      isFromSupplyChain,
      isHideReversed,
      payRefundVisible,
      refundWriteOffVisible,
      isDev: process.env.NODE_ENV === 'development',
      isReversedRow,
      reasonDialogTitle,
      reason,
      reasonDialogVisible,
      reverseAgainLoading,
      reverseAgain,
      onReasonDialogClose,
      onReverseReasonViewBtnClick,
      onReverseBackReasonViewBtnClick,
      writeOffLoading,
      reverseOrderDialogRef,
      onWriteOffConfirmResolve,
      permission,
      achievementRef,
      invoicelistRef,
      // applyDetailDialog,
      applyDetailDialogVisible,
      deleteCollection,
      userinfo,
      // refundDetailDialog,
      // applicationDetailDialog,
      invoicesDetailDialog,
      refundVisible,
      applicationVisible,
      invoicesVisible,
      firstStepRef,
      // 列表部分
      paid_amount,
      total_pay_amount,
      wait_pay_amount,
      write_off_amount,
      not_write_off_amount,
      data,
      query,
      reload,
      total,
      Delete,
      loading,
      all_amount,
      columns,
      ...tableHeightLogic,
      onRectUpdate,
      approval,
      payRefundInfo,
      refundWriteoffId,
      notRefundWriteOffAmount,
      refundWriteoffCostId,
      loanDetailVisible,
      detail_data,
      payRefundDialogData,
    };
  },
  render() {
    return (
      <tg-card
        class="project-collection"
        on={{
          ['rect:update']: (rect: DOMRect) => {
            this.onRectUpdate(rect);
          },
        }}
        overflowInBody
        style={{
          height:
            this.isFromLocalLife || this.isFromLiveDouyin
              ? 'calc(100vh - 145px)'
              : 'calc(100vh - 190px)',
        }}
      >
        <tg-button-line class="header mgt-12 mgb-12">
          <span class="label" style="margin-left:18px">
            登记付款：
          </span>
          <span class="text">{this.all_amount.total_pay_amount}</span>
          <span class="label">已付款：</span>
          <span class="text">{this.all_amount.paid_amount}</span>
          <span class="label">待付款：</span>
          <span class="text">{this.all_amount.wait_pay_amount}</span>
          <span class="label">已核销金额：</span>
          <span class="text">{this.all_amount.write_off_amount}</span>
          <span class="label">未核销金额 ：</span>
          <span class="text">{this.all_amount.not_write_off_amount}</span>
          <div class="reverse-div">
            <el-checkbox
              on-change={() => {
                this.reload();
              }}
              v-model={this.isHideReversed}
              size="small"
            >
              <span>隐藏已冲销数据</span>
            </el-checkbox>
          </div>
        </tg-button-line>
        <el-table
          stripe
          border
          data={this.data}
          height={this.tableProps.height}
          row-style={{ cursor: 'pointer' }}
          on={{
            'row-click': (row: any) => {
              this.detail_data = row;
              this.loanDetailVisible = true;
            },
          }}
          {...{
            directives: [
              {
                name: 'loading',
                value: this.loading,
              },
            ],
          }}
          scopedSlots={{
            empty: () => {
              return (
                <div style="position: static;">
                  <empty-common detail-text="暂无数据"></empty-common>
                </div>
              );
            },
          }}
        >
          {this.columns.map((col, colIndex) => (
            <el-table-column props={{ ...col }} key={colIndex} />
          ))}
          {/* <el-table-column
            label="财务确认信息"
            min-width={170}
            scopedSlots={{
              default: ({ row }: any) => {
                if (row.is_pay === 0) return <span style={{ color: '#FF7A36' }}>待打款</span>;
                return (
                  <div class="column-cell">
                    <div class="column-cell-line">
                      <span class="label label-pay">状态：</span>
                      <span class="text">已打款</span>
                    </div>
                    <div class="column-cell-line">
                      <span class="label">打款时间：</span>
                      <span class="text">{formatData.formatTime(row.pay_date)}</span>
                    </div>
                    <div class="column-cell-line">
                      <span class="label">凭证：</span>
                      <span
                        class="text"
                        style={{ color: '#3C75DF', cursor: 'pointer' }}
                        onClick={() => {
                          const images = row.pay_certificate_pic.split(',');
                          if (images.length === 1) {
                            invoice.showDetail(
                              row.pay_certificate_pic + '?Authorization=' + getToken(),
                            );
                          } else {
                            this.invoicelistRef?.show({
                              title: '打款凭证',
                              list: images.map(
                                (val: string) => val + '?Authorization=' + getToken(),
                              ),
                              type: 1,
                            });
                          }
                        }}
                      >
                        查看
                      </span>
                    </div>
                  </div>
                );
              },
            }}
          /> */}
          {/* <el-table-column
            label="核销状态"
            align="left"
            min-width={122}
            scopedSlots={{
              default({ row }: any) {
                let write_off_infos = [];
                if (row.pay_type === 2) {
                  write_off_infos = (row.refund_write_off_infos || []).map((item: any) => {
                    return [
                      item.receivable_uid,
                      item.write_off_amount * -1,
                      item.write_off_user,
                      item.write_off_time,
                    ];
                  });
                } else {
                  write_off_infos = (row.write_off_infos || []).map((item: any) => {
                    return [
                      item.payable_uid,
                      item.write_off_amount,
                      item.write_off_user,
                      item.write_off_time,
                    ];
                  });
                }
                const write_off_header = [
                  row.pay_type === 2 ? '应收编号' : '应付编号',
                  '核销金额',
                  '核销人/日期',
                ];

                return (
                  <WriteOff
                    {...{
                      attrs: {
                        write_off_header,
                        write_off_infos,
                        write_off_status: row.write_off_status,
                        is_reverse: row.reversed_id !== null,
                      },
                    }}
                  />
                );
              },
            }}
          /> */}
          {/* <el-table-column
            label="冲销状态"
            width={122}
            scopedSlots={{
              default: ({ row }: any) => {
                if (row.reverse_status === 1) {
                  return <div style="color: #ff7a36">待确认</div>;
                } else if (row.reverse_status === 2) {
                  return <div style="color: var(--success-color)">已确认</div>;
                } else if (row.reverse_status === 3) {
                  return <div style="color: var(--error-color)">退回</div>;
                } else {
                  return '--';
                }
              },
            }}
          /> */}
          {/* <el-table-column
            label="录入人/日期"
            width={102}
            scopedSlots={{
              default: ({ row }: any) => {
                return (
                  <div class="table_achievement">
                    <div>{row.add_by ?? '--'}</div>
                    <div class="text">{moment(row.gmt_create).format('YYYY.MM.DD')}</div>
                  </div>
                );
              },
            }}
          /> */}
          <el-table-column
            label="操作"
            fixed="right"
            min-width={160}
            scopedSlots={{
              default: ({ row }: any) => {
                const refundMoneyBtn = (
                  <tg-button
                    style="margin-right: 12px;"
                    type="link"
                    onclick={(event: PointerEvent) => {
                      this.payRefundInfo.id = row.raw_cost_id;
                      this.payRefundInfo.amout = new Decimal(row.pay_amount ?? 0)
                        .sub(new Decimal(row.refunded_amount ?? 0))
                        .toNumber();
                      this.payRefundDialogData = row;
                      this.payRefundVisible = true;
                      event.stopPropagation();
                    }}
                  >
                    退款
                  </tg-button>
                );
                const refundWriteOffBtn = (
                  <tg-button
                    style="margin-right: 12px;"
                    type="link"
                    onclick={(event: PointerEvent) => {
                      this.refundWriteOffVisible = true;
                      this.refundWriteoffId = row.achievement_uid;
                      this.refundWriteoffCostId = row.cost_id;
                      this.notRefundWriteOffAmount = row.not_write_off_amount;
                      event.stopPropagation();
                    }}
                  >
                    核销
                  </tg-button>
                );
                if (this.isReversedRow(row)) {
                  // 冲销的记录行
                  const viewBtn = [
                    <button
                      style="margin-right: 12px;"
                      class="tg-button"
                      onclick={(event: PointerEvent) => {
                        this.onReverseReasonViewBtnClick(row.reverse_reason);
                        event.stopPropagation();
                      }}
                    >
                      查看
                    </button>,
                  ];

                  const buttonGroup = [
                    <div>
                      {row.pay_type !== 2 && (
                        <button
                          style="margin-right: 12px;"
                          class="tg-button"
                          onclick={(event: PointerEvent) => {
                            this.deleteCollection(row.id, '是否删除该冲销单');
                            event.stopPropagation();
                          }}
                        >
                          删除
                        </button>
                      )}
                      <button
                        style="margin-right: 12px;"
                        class="tg-button"
                        onclick={(event: PointerEvent) => {
                          this.reverseOrderDialogRef?.open(
                            msg => this.reverseAgain(row.raw_cost_id, msg),
                            row.reverse_reason,
                          );
                          event.stopPropagation();
                        }}
                      >
                        重新提交
                      </button>
                      <button
                        style="margin-right: 12px;"
                        class="tg-button"
                        onclick={(event: PointerEvent) => {
                          this.onReverseBackReasonViewBtnClick(row.reverse_back_reason);
                          event.stopPropagation();
                        }}
                      >
                        退回原因
                      </button>
                    </div>,
                  ];
                  //不是核销的
                  if (row.reverse_status === 3) {
                    //退回
                    // if (row.pay_type !== 2 && row.is_pay) {
                    //   buttonGroup.push(refundMoneyBtn);
                    // }
                    return buttonGroup;
                  } else {
                    if (row.reverse_status === 1 || row.reverse_status === 2) {
                      return viewBtn;
                    }
                    if (row.pay_type !== 2 && row.is_pay) {
                      viewBtn.push(refundMoneyBtn);
                    }
                    return viewBtn;
                  }
                }

                const hasSelf = row.add_by_id === this.userinfo.id;
                const noGather = row.is_pay === 0;
                // 竹鸢说成本类型是人员工资的才可以操作编辑和删除
                const newCostType = row.new_cost_type === 1;
                const hasEdit = this.isFromSupplyChain
                  ? this.permission.supply_edit_project_status
                  : this.isFromLocalLife
                  ? this.permission.local_life_project_status_edit
                  : this.permission.live_project_status_edit;
                const hasWriteOff = this.isFromSupplyChain
                  ? this.permission.supply_write_off
                  : this.isFromLocalLife
                  ? this.permission.local_life_write_off_save
                  : this.permission.live_write_off_save;
                let btn;
                let btnChongxiao;
                if (
                  hasWriteOff &&
                  (row.write_off_status === 1 || row.write_off_status === 0) &&
                  row.pay_type === 1 &&
                  row.is_pay !== 0 &&
                  row.reverse_id === null
                ) {
                  btn = (
                    <button
                      style="margin-right: 12px;"
                      class="tg-button"
                      onclick={(event: PointerEvent) => {
                        //@firstStepRef 店铺代播/实付
                        this.firstStepRef?.show({
                          type: 'isActual',
                          id: row.cost_id,
                          amount: row.not_write_off_amount, // 可核销金额
                          leaf: this.isFromSupplyChain
                            ? 'supply_chain'
                            : this.isFromLocalLife
                            ? 'local_life'
                            : 'live', // 店铺代播
                          busType: row.business_type,
                          receivable_uid: row.cost_id, // 应收编号
                          cost_split_id: row.id, // 店铺时传
                        });
                        event.stopPropagation();
                      }}
                    >
                      核销
                    </button>
                  );
                }

                if (
                  row.is_pay === 1 &&
                  row.reversed_id === null &&
                  row.reverse_id === null &&
                  row.pay_type !== 2 &&
                  !row.has_refund
                ) {
                  btnChongxiao = (
                    <a
                      onclick={(event: PointerEvent) => {
                        this.reverseOrderDialogRef?.open(msg =>
                          this.onWriteOffConfirmResolve(row.raw_cost_id, msg),
                        );
                        event.stopPropagation();
                      }}
                      style="color: var(--error-color);margin-right: 12px;"
                    >
                      冲销
                    </a>
                  );
                }

                return (
                  <div>
                    {btnChongxiao}
                    {btn}
                    {hasSelf && hasEdit && noGather && newCostType && !row.approval_id && (
                      <fragments>
                        <button
                          style="margin-right: 12px;"
                          class="tg-button"
                          onclick={(event: PointerEvent) => {
                            const data: any = {};
                            data.pay_amount = row.pay_amount;
                            data.pay_reason = row.pay_reason;
                            data.id = row.id;
                            this.achievementRef?.show(data);
                            event.stopPropagation();
                          }}
                        >
                          编辑
                        </button>
                      </fragments>
                    )}
                    {/* 禁止删除实付记录 */}
                    {/* {noGather && hasDelete && row.pay_type !== 2 && (
                      <button
                        style="margin-right: 12px;"
                        onclick={(event: PointerEvent) => {
                          this.deleteCollection(
                            row.id,
                            '确认删除' + (row.pay_type === 1 ? '成本' : '退款'),
                          );
                          event.stopPropagation();
                        }}
                        class="tg-button"
                      >
                        删除
                      </button>
                    )} */}
                    {row.is_pay &&
                    row.pay_type !== 2 &&
                    !row.reverse_id &&
                    row.real_pay_amount !== 0
                      ? refundMoneyBtn
                      : ''}
                    {row.is_pay &&
                    row.pay_type === 2 &&
                    !row.reverse_id &&
                    !row.reversed_id &&
                    row.write_off_status !== 2 &&
                    hasWriteOff
                      ? refundWriteOffBtn
                      : ''}
                  </div>
                );
              },
            }}
          />
        </el-table>
        <achievement ref="achievementRef" onadded={() => this.reload()} />
        <first-step ref="firstStepRef" onSubmit={() => this.reload()} />
        <invoicelist ref="invoicelistRef" />
        {this.applyDetailDialogVisible && (
          <payment-detail-dialog
            info={this.approval}
            visible={this.applyDetailDialogVisible}
            on={{
              'dialog:close': () => {
                this.applyDetailDialogVisible = false;
              },
            }}
          />
          // <applyDetail
          //   ref="applyDetailDialog"
          //   onclose={() => {
          //     this.applyDetailDialogVisible = false;
          //   }}
          // />
        )}
        {this.refundVisible && (
          <refund-detail-dialog
            info={this.approval}
            visible={this.refundVisible}
            on={{
              'dialog:close': () => {
                this.refundVisible = false;
              },
            }}
          />
          // <refund-detail
          //   ref="refundDetailDialog"
          //   onclose={() => {
          //     this.refundVisible = false;
          //   }}
          // />
        )}
        {this.applicationVisible && (
          <advance-detail-dialog
            info={this.approval}
            visible={this.applicationVisible}
            on={{
              'dialog:close': () => {
                this.applicationVisible = false;
              },
            }}
          />
          // <application-detail
          //   ref="applicationDetailDialog"
          //   onclose={() => {
          //     this.applicationVisible = false;
          //   }}
          // />
        )}
        {this.invoicesVisible && (
          <invoices-detail
            ref="invoicesDetailDialog"
            onclose={() => {
              this.invoicesVisible = false;
            }}
          />
        )}
        <reverseOrderDialog ref="reverseOrderDialogRef" />
        <pay-refund
          visible={this.payRefundVisible}
          dialogData={this.payRefundDialogData}
          costId={this.payRefundInfo.id}
          rawAmount={this.payRefundInfo.amout}
          onCancel={() => {
            this.payRefundVisible = false;
          }}
          onsave={() => {
            this.payRefundVisible = false;
            this.reload();
          }}
        ></pay-refund>
        <refund-write-off
          type="receive"
          projectType={1}
          notWriteOffAmount={this.notRefundWriteOffAmount}
          visible={this.refundWriteOffVisible}
          invoiceId={this.refundWriteoffId}
          costSplitId={this.refundWriteoffCostId}
          onCancel={() => {
            this.refundWriteOffVisible = false;
          }}
          onsave={() => {
            this.refundWriteOffVisible = false;
            this.reload();
          }}
        ></refund-write-off>
        <tg-mask-loading visible={this.writeOffLoading} content="正在提交冲销，请稍候..." />
        <tg-mask-loading visible={this.reverseAgainLoading} content="正在提交冲销，请稍候..." />
        <el-dialog
          class="tg-dialog-classic tg-dialog-vcenter-new"
          visible={this.reasonDialogVisible}
          width="440px"
          onClose={() => {
            this.onReasonDialogClose();
          }}
        >
          <div slot="title">{this.reasonDialogTitle}</div>
          <div class="reason-dialog-content">{this.reason}</div>
        </el-dialog>
        {this.loanDetailVisible && (
          <loanfinance-detail-modal
            visible={this.loanDetailVisible}
            detail-data={this.detail_data}
            on={{
              'dialog:closerow': () => {
                this.loanDetailVisible = false;
              },
            }}
          />
        )}
      </tg-card>
    );
  },
});
