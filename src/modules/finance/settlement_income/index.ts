import { defineComponent, ref, computed, h, onActivated, onMounted } from '@vue/composition-api';
import type { SetupContext } from '@vue/composition-api';
import BuessinessSettlement from '@/modules/finance/settlement_income/components/BuessinessSettlement/index.vue';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { ObjectFilterEmpty, URLSearchMaker, wait } from '@/utils/func';
import { resize } from '@/utils/dom';
import {
  ConfirmReverseParams,
  Settlement,
  SettlementListQueryForm,
  SettlementListQueryParams,
  SettlementStatus,
  ReverseType,
  SettlementScanStatusOptions,
} from '@/types/tiange/finance/settlement';
import { SettlementTypeOptions, SettlementStatusOptions } from '@/types/tiange/finance/settlement';
import { useColumns } from '@/modules/settlement/use/columns';
import type { SettlementCol } from '@/modules/settlement/use/columns';
import { form_data_to_optional_params } from '@/utils/request.fn';
import { GetSettlementList } from '@/services/finance/settlement';
import { Options2GroupedOptions } from '@/utils/form';
import reverseAuditDialog from '../components/reverseAudit.vue';
import useVisible from '@/use/visible';
import { ConfirmReverse } from '@/services/finance';
import { BooleanType } from '@/types/base/advanced';
import { ReverseStatus } from '@/types/tiange/finance/finance';
import { is_refunded_order, is_reversed_order as is_reversed_settlement } from '@/use/finance';
import { useDialog } from '@/use/dialog';
import scanCheck from '@/modules/finance/components/scanCheck/index.vue';
import { formatAmount } from '@/utils/string';
import changePayment from '@/modules/finance/components/changePayment/index.vue';

const useList = (ctx: SetupContext, reload: () => void) => {
  const data = ref<Settlement[]>([]);
  const statisticsData = ref<any>();
  const total = ref<number>(0);
  const loading = ref(false);
  const loadDataList = async (payload: SettlementListQueryParams) => {
    loading.value = true;
    const [{ data: response }] = await wait(500, GetSettlementList('finance', payload));
    loading.value = false;
    if (response.success) {
      statisticsData.value = response.data.total_count;
      data.value = response.data.data;
      total.value = response.data.total;
    } else {
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };
  const showDetail = (row: Settlement) => {
    (ctx.refs.BuessinessSettlement as unknown as { show: (row: any) => void }).show(row);
  };

  const Permission = computed(() => {
    const canShowDetail = HasPermission(RIGHT_CODE.settlement_income_view);
    const editAccountPeriod = HasPermission(RIGHT_CODE.edit_income_account_period);
    return { canShowDetail, editAccountPeriod };
  });
  const changePaymentDialog = useDialog({
    component: changePayment,
    title: '修改账期',
    width: 306,
    okText: '确定',
    cancelText: '取消',
    on: {
      submit() {
        reload();
      },
    },
  });

  const onChangeDateHandler = (row: Settlement) => {
    changePaymentDialog.show(row, 1);
  };
  const reverseAuditDialogRef = ref<{
    open: (
      msg: string,
      cb: (
        is_pass: BooleanType,
        reverse_back_reason: string,
        account_detail_date?: string,
      ) => Promise<boolean>,
      accoiuntPeriod: boolean,
    ) => void;
  } | null>(null);

  const { visible: reverseAuditLoading, toggleVisible: toggleReverseAuditLoading } = useVisible();

  /** 冲销确认动作 */
  const onReverseAuditConfirm = async (
    row: Settlement,
    is_pass: BooleanType,
    reverse_back_reason: string | undefined,
    account_detail_date: string | undefined,
  ) => {
    toggleReverseAuditLoading();

    const params: ConfirmReverseParams = {
      id: row.id,
      reverse_type: ReverseType.settlement_income,
      is_pass,
      reverse_back_reason,
      account_detail_date,
    };
    const res = await ConfirmReverse(params);
    toggleReverseAuditLoading();
    if (res.data.success) {
      ctx.root.$message.success(res.data.message ?? '确认成功');
      reload();
    } else {
      ctx.root.$message.error(res.data.message ?? '确认失败');
    }

    return res.data.success;
  };
  // 查看冲销原因弹窗
  const reasonDialogVisible = ref(false);
  const reason = ref('');

  const onReasonViewBtnClick = (reverse_reason: string) => {
    reason.value = reverse_reason;
    reasonDialogVisible.value = true;
  };

  const onReasonDialogClose = () => {
    reason.value = '';
    reasonDialogVisible.value = false;
  };

  const {
    settlement_number_column,
    settlement_company_column,
    settlement_cycle_column,
    bill_period_column,
    settlement_money_column,
    settlement_tax_rate_column,
    settlement_tax_amount_column,
    settlement_no_tax_amount_column,
    settlement_status_column,
    write_off_status_column,
    settlement_person_column,
    submit_date_column,
    confirm_person_column,
    confirm_date_column,
    project_name_colume,
    department_name_colume,
    settlement_type_column,
    settlement_bill_column,
    scan_file_status_column,
    settlement_income_type_column,
  } = useColumns(data);
  /** 扫描件审核 */
  const dialogScanDemo = useDialog({
    component: scanCheck,
    footer: false,
    width: 410,
    title: '扫描件归档审核',
    on: {
      submit: () => {
        reload();
      },
    },
  });
  const lookFileClick = (row: Settlement) => {
    dialogScanDemo.show(row.id, row.settlement_scan_urls, true, row.settlement_scan_message);
  };
  const checkFileClick = (row: Settlement) => {
    dialogScanDemo.show(row.id, row.settlement_scan_urls, false);
  };
  const columns = computed<SettlementCol[]>(() => [
    settlement_number_column.value,
    project_name_colume.value,
    settlement_income_type_column.value,
    department_name_colume.value,
    settlement_company_column.value,
    settlement_type_column.value,
    settlement_cycle_column.value,
    bill_period_column.value,
    settlement_money_column.value,
    settlement_tax_rate_column.value,
    settlement_tax_amount_column.value,
    settlement_no_tax_amount_column.value,
    settlement_status_column.value,
    write_off_status_column.value,
    settlement_person_column.value,
    submit_date_column.value,
    confirm_person_column.value,
    confirm_date_column.value,
    settlement_bill_column.value,
    scan_file_status_column.value,
    {
      label: '结算单扫描件',
      fixed: 'right',
      align: 'center',
      headerAlign: 'center',
      minWidth: 108,
      formatter: row => {
        const status = row.settlement_scan_status || 0;
        /** 冲销订单，退款订单,暂估订单,完全退款 */
        if (
          is_reversed_settlement(row) ||
          is_refunded_order(row) ||
          row.is_estimate === 1 ||
          (row.refund_amount !== 0 && row.refund_amount === row.tax_included_amount && status === 0)
        ) {
          return h('div', { style: 'display: flex;justify-content: center' }, '');
        } else {
          /** 已确认结算 */
          if (row.status === 2) {
            return status === 1
              ? h(
                  'a',
                  {
                    on: {
                      click: (event: MouseEvent) => {
                        checkFileClick(row);
                        event.stopPropagation();
                      },
                    },
                  },
                  ['审核'],
                )
              : status === 2 || status === 3
              ? h(
                  'a',
                  {
                    style: {
                      color: 'var(--text-color)',
                    },
                    on: {
                      click: (event: MouseEvent) => {
                        lookFileClick(row);
                        event.stopPropagation();
                      },
                    },
                  },
                  ['查看'],
                )
              : '';
          } else {
            return '';
          }
        }
      },
    },
    {
      label: '操作',
      fixed: 'right',
      minWidth: 110,
      formatter: row => {
        const btns = [];
        if (row.refunded_id) {
          if (Permission.value.editAccountPeriod) {
            const btns = [
              h(
                'a',
                {
                  on: {
                    click: () => {
                      onChangeDateHandler(row);
                    },
                  },
                },
                ['账期'],
              ),
            ];
            return h('div', { class: 'operation' }, btns);
          }
          return h('div', { class: 'operation' });
        }
        if (row.shop_live_live_goods_id) return h('div', { class: 'operation' });
        if (row.reversed_id) {
          if (row.reverse_status === ReverseStatus.wait_confirm) {
            btns.push(
              h(
                'a',
                {
                  class: 'reverse-red',
                  on: {
                    click: () => {
                      reverseAuditDialogRef.value?.open(
                        row.reverse_reason,
                        (is_pass, reverse_back_reason, date) =>
                          onReverseAuditConfirm(row, is_pass, reverse_back_reason, date),
                        true,
                      );
                    },
                  },
                },
                ['冲销确认'],
              ),
            );
          }
          if (
            row.reverse_status === ReverseStatus.confirmed ||
            row.reverse_status === ReverseStatus.refused
          ) {
            //  查看
            btns.push(
              h(
                'a',
                {
                  on: {
                    click: () => {
                      //  查看冲销原因
                      onReasonViewBtnClick(row.reverse_reason);
                    },
                  },
                },
                ['查看'],
              ),
            );
          }
        } else {
          if (
            (row.status === SettlementStatus.wait_confirm ||
              row.status === SettlementStatus.confirmed) &&
            Permission.value.canShowDetail
          ) {
            btns.push(
              h(
                'a',
                {
                  on: {
                    click: () => {
                      showDetail(row);
                    },
                  },
                },
                ['查看'],
              ),
            );
          }
        }
        if (Permission.value.editAccountPeriod && row.account_detail_date) {
          btns.push(
            h(
              'a',
              {
                on: {
                  click: () => {
                    onChangeDateHandler(row);
                  },
                },
              },
              ['账期'],
            ),
          );
        }
        return h('div', { class: 'operation' }, btns);
      },
    },
  ]);
  return {
    reason,
    reasonDialogVisible,
    onReasonViewBtnClick,
    onReasonDialogClose,
    onChangeDateHandler,
    columns,
    loadDataList,
    showDetail,
    loading,
    total,
    Permission,
    data,
    statisticsData,
    reverseAuditDialogRef,
    reverseAuditLoading,
  };
};

export default defineComponent({
  components: {
    BuessinessSettlement,
    reverseAuditDialog,
  },
  data() {
    return {
      SettlementTypeOptions: Options2GroupedOptions(SettlementTypeOptions),
      SettlementStatusOptions,
    };
  },
  setup(_, ctx) {
    const queryParams = ref<SettlementListQueryForm>({
      project_name: '',
      settlement_type: '',
      search_type: '1',
      search_value: '',
      status: 1,
      settlement_kind: '',
      is_confirmed: '',
      page_num: 1,
      num: 20,
      month: '',
      account_month: '',
      settlement_scan_status: '',
    });

    const logicPart = useList(ctx, () => {
      reload();
    });
    // 自适应表格高度部分
    const buttonLineHeight = 0;
    const paginationLineHeight = 34;
    const rectPadding = 36;
    const otherHeight = 8;
    const topCardHeight = ref(0);

    const onTopCardRectUpdate = (rect: DOMRect) => {
      topCardHeight.value = rect.height;
    };

    const tableHeightLogic = useAutoTableHeightInCard({
      compensation: computed(
        () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      ),
      fixedBlockHeightRefs: [topCardHeight],
      tableMinHeight: 100,
      pagename: 'marketing_project',
      delay: 100,
    });

    onActivated(() => {
      resize();
    });

    const getPayload = (): SettlementListQueryParams => {
      const {
        project_name,
        settlement_type,
        status,
        settlement_kind,
        is_confirmed,
        month,
        account_month,
        ...rest
      } = queryParams.value;

      const filterFormParams = ObjectFilterEmpty({
        project_name: form_data_to_optional_params(project_name),
        settlement_type: form_data_to_optional_params(settlement_type),
        status: form_data_to_optional_params(status),
        ...rest,
      });

      const url = new URL(
        location.origin + ctx.root.$route.path + '?' + URLSearchMaker(filterFormParams),
      );

      if (url.search !== location.search) {
        ctx.root.$router.replace({
          path: url.pathname + url.search,
        });
      }

      const payload: SettlementListQueryParams = {
        month: month === '' ? undefined : month,
        account_month: account_month === '' ? undefined : account_month,
        project_name: form_data_to_optional_params(project_name),
        settlement_type: form_data_to_optional_params(settlement_type),
        status: form_data_to_optional_params(status),
        settlement_kind: form_data_to_optional_params(settlement_kind),
        is_confirmed: form_data_to_optional_params(is_confirmed),
        ...rest,
      };

      return payload;
    };

    const reload = async (clean = true) => {
      if (clean) {
        queryParams.value.page_num = 1;
      }

      await logicPart.loadDataList(getPayload());
    };

    const resetQueryForm = () => {
      queryParams.value.project_name = '';
      queryParams.value.settlement_type = '';
      queryParams.value.status = '';
      queryParams.value.search_type = '1';
      queryParams.value.search_value = '';
      queryParams.value.month = '';
      queryParams.value.account_month = '';
      queryParams.value.settlement_scan_status = '';
    };

    const reset = async () => {
      resetQueryForm();
      await reload();
    };

    const handleCurrentChange = async (num: number) => {
      queryParams.value.page_num = num;
      await reload(false);
    };

    const handlePageSizeChange = async (size: number) => {
      queryParams.value.num = size;
      await reload();
    };

    onMounted(() => {
      const params = new URLSearchParams(location.search);
      queryParams.value.search_type = params.get('search_type') || '1';
      queryParams.value.search_value = params.get('search_value') || '';
      reload();
    });
    const ScanStatusOptions = computed(() => {
      return [...SettlementScanStatusOptions];
    });
    const summaryMethod = ({ columns }: any) => {
      return columns.map((el: any, index: any) => {
        if (!index) return '合计';
        if (['tax_amount', 'tax_excluded_amount', 'tax_included_amount'].includes(el.property)) {
          const amount = logicPart.statisticsData.value?.[el.property];
          if (amount === null || amount === undefined || amount === '') return '--';
          return formatAmount(+amount / 100, 'None');
        }
        return '';
      });
    };
    return {
      ScanStatusOptions,
      reload,
      queryParams,
      reset,
      ...logicPart,
      ...tableHeightLogic,
      onTopCardRectUpdate,
      handleCurrentChange,
      handlePageSizeChange,
      summaryMethod,
    };
  },
});
