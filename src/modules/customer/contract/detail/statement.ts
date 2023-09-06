/**
 * 客户管理 - 客户合同 - 合同详情 - tab 结算单详情
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-27 11:26:59
 */
import {
  computed,
  ComputedRef,
  defineComponent,
  h,
  inject,
  onActivated,
  onBeforeMount,
  provide,
  ref,
  Ref,
  watch,
} from '@vue/composition-api';
import { DeleteContractStatements, GetContractStatements } from '@/services/contract';
import { PaginationParams } from '@/types/base/pagination';
import {
  Contract,
  ContractStatementsStatus,
  ContractStatementsStatusMap,
  SealTypeMap,
  Settlement,
  SettlementDetail,
  SettlementListQueryParams,
} from '@/types/tiange/contract';
import { TableColumn } from '@/types/vendor/column';
import SettlementDetailDialog from './settlement_detail.vue';
import { formatAmount } from '@/utils/string';
import AnnexDialog from '../annex.dialog.vue';
import { useOAFlows } from '../useOAFlowsInList';
import { DefText } from '@/components/DefText/dt';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { emptyFunc } from '@/utils/func';
import { MoneyAlign } from '@/use/money.align';

const isDev = process.env.NODE_ENV === 'development';

type Col = TableColumn<Settlement>;
const getFilename = (url = '') =>
  String(url || '')
    .split('/')
    .pop();

const getAnnexList = (row: Settlement | undefined) =>
  row?.attachment_url.split(',').map(url => ({
    file_name: getFilename(url),
    url,
    type: '结算单附件',
    status: -1,
    status_str: '',
  })) ?? [];

const moneyAlign = MoneyAlign.getColSetting();

export default defineComponent({
  name: 'tg-customer-contract-detail-tab-statement',
  components: {
    SettlementDetailDialog,
    AnnexDialog,
  },
  setup(props, ctx) {
    /** 从父组件获取的合同详情数据 */
    const contract = inject<Ref<Contract | null>>('contract');
    /** 用户信息 */
    const currentUserInfo = inject<ComputedRef<Record<string, any>>>('currentUserInfo');
    const loading = ref(false);
    const data = ref<Settlement[]>([]);
    const total = ref(0);

    const visible = ref(false);

    const details = ref<SettlementDetail[]>([]);

    provide('details', details);

    const toggleDetail = (show = false) => {
      visible.value = show;
    };

    const openDetail = (detail: SettlementDetail[]) => {
      toggleDetail(true);
      details.value = detail;
    };

    const closeDetail = () => {
      details.value = [];
      toggleDetail();
    };

    const queryForm = ref<PaginationParams>({
      page_num: 1,
      num: 10,
    });

    const oaFlows = useOAFlows('statement');

    const columns = ref<Col[]>([
      {
        label: '序号',
        type: 'index',
        align: 'center',
        minWidth: 60,
        headerAlign: 'center',
        formatter: (row, column, value, index) => index + 1,
      },
      {
        label: '审批金额',
        property: 'approval_amount',
        ...moneyAlign,
        formatter: ({ approval_amount }) => formatAmount(approval_amount),
      },
      {
        label: '用章情况',
        align: 'center',
        headerAlign: 'center',
        property: 'seal_type',
        formatter: ({ seal_type }) => SealTypeMap.get(seal_type) ?? DefText(),
      },
      {
        label: '申请内容',
        align: 'center',
        headerAlign: 'center',
        property: 'comment',
        formatter: ({ comment }) => comment || DefText(),
      },

      {
        label: '创建人',
        align: 'center',
        headerAlign: 'center',
        property: 'add_by_name',
      },
      {
        label: '创建时间',
        align: 'center',
        headerAlign: 'center',
        property: 'gmt_create',
      },
      {
        label: '创建人所属部门',
        align: 'center',
        headerAlign: 'center',
        minWidth: 140,
        property: 'add_by_department',
      },
      {
        label: '审批状态',
        align: 'center',
        headerAlign: 'center',
        property: 'contract_statements_status',
        formatter: ({ id, contract_statements_status }) => {
          const status_str =
            ContractStatementsStatusMap.get(contract_statements_status) ?? DefText();

          const status_node = (slot = false) =>
            h(
              'span',
              {
                class: [`fg-${ContractStatementsStatus[contract_statements_status]}`.toLowerCase()],
                ...(slot ? { slot: 'reference' } : {}),
              },
              [status_str],
            );

          if (
            [ContractStatementsStatus.Normal, ContractStatementsStatus.Invalid].includes(
              contract_statements_status,
            )
          ) {
            return status_node();
          } else {
            return h('div', [
              h(
                'el-popover',
                {
                  props: {
                    placement: 'top',
                    width: 215,
                    trigger: 'hover',
                    popperClass: 'oa-approve-progress-popper',
                    popperOptions: { boundariesElement: 'body', gpuAcceleration: false },
                  },
                  on: {
                    show: () => {
                      oaFlows.onFlowsShow(id);
                    },
                    hide: () => {
                      oaFlows.onFlowsHide();
                    },
                  },
                },
                [
                  status_node(true),
                  ...(oaFlows.flowsLoading.value
                    ? [h('div', { style: { padding: '10px 20px' } }, ['正在查询进度...'])]
                    : oaFlows.flowsError.value !== ''
                    ? [oaFlows.flowsError.value]
                    : [oaFlows.oaflowsRender(contract_statements_status)]),
                ],
              ),
            ]);
          }
        },
      },
      {
        label: '附件单',
        align: 'center',
        headerAlign: 'center',
        property: 'attachment_url',
        width: 70,
        formatter: row =>
          h(
            'span',
            {
              class: 'hover-link',
              on: {
                click: (event: MouseEvent) => {
                  event.stopPropagation();

                  checkedRow.value = row;
                  annexDialogVisible.value = true;
                },
              },
            },
            ['查看'],
          ),
      },
      {
        label: '结算情况',
        align: 'center',
        headerAlign: 'center',
        property: 'settlement_detail',
        width: 80,
        formatter: ({ settlement_detail, contract_type }) => {
          return h('div', [
            h(
              'span',
              {
                class: 'hover-link',
                on: {
                  click: () => {
                    const settlement_details = [...settlement_detail];
                    // @ts-ignore
                    settlement_details.contract_type = contract_type;
                    // @ts-ignore
                    openDetail(settlement_details);
                  },
                },
              },
              ['查看'],
            ),
          ]);
        },
      },
      {
        label: '操作',
        align: 'center',
        headerAlign: 'center',
        width: 70,
        formatter: row => {
          if (
            [2, 3, 5].includes(row.contract_statements_status) &&
            currentUserInfo?.value.id === row.add_by
          ) {
            return h(
              'a',
              {
                on: {
                  click: () => {
                    deleteContractStatements(row.id);
                  },
                },
              },
              ['删除'],
            );
          } else {
            return DefText();
          }
        },
      },
    ]);

    /**
     * 删除结算单
     * @author  Jerry <superzcj_001@163.com>
     * @since   2020-11-30 11:40:10
     */
    const deleteContractStatements = async (id: number) => {
      const result = await AsyncConfirm(ctx, '删除后数据无法恢复，是否继续操作？');
      if (!result) {
        return;
      }

      const { data: response } = await DeleteContractStatements(id);
      if (response.success) {
        ctx.root.$message.success('删除成功');
        reload();
      } else {
        ctx.root.$message.error(response.message ?? '删除失败');
      }
    };

    /** 加载数据 */
    const loadData = async (payload: SettlementListQueryParams) => {
      loading.value = true;
      const { data: response } = await GetContractStatements(payload);
      loading.value = false;

      if (response.success) {
        data.value = response.data.data;
        total.value = response.data.total;
      } else {
        data.value = [];
        total.value = 0;
      }
    };

    /** 重载数据 */
    const reload = async (clean = true) => {
      if (clean) {
        queryForm.value.page_num = 1;
      }

      const contract_id = contract?.value?.contract_detail?.contract_id;

      if (!contract_id) {
        return;
      }

      await loadData({
        contract_id,
        ...queryForm.value,
      });
    };

    onBeforeMount(() => {
      reload();
    });

    onActivated(() => {
      reload();
    });

    watch(
      () => contract?.value,
      val => {
        if (val !== null) {
          reload();
        }
      },
    );

    const onCurrentChange = async () => {
      await reload(false);
    };

    const onSizeChange = async (num: number) => {
      queryForm.value.num = num;
      await reload(true);
    };

    const annexDialogVisible = ref(false);
    const checkedRow = ref<Settlement | undefined>(undefined);

    const annexList = computed(() => getAnnexList(checkedRow.value));

    provide('annex-data', annexList);
    provide('annex-dialog-visible', annexDialogVisible);

    const onAnnexDialogClose = () => {
      annexDialogVisible.value = false;
      checkedRow.value = undefined;
    };

    // ! 测试用，误删
    // ! 清空数据
    // ! 仅限开发环境可见
    const clearAllData = isDev
      ? () => {
          data.value = [];
          total.value = 0;
        }
      : emptyFunc;

    return {
      isDev,
      clearAllData,
      contract,
      currentUserInfo,
      loading,
      data,
      total,
      queryForm,
      columns,
      reload,
      onCurrentChange,
      onSizeChange,
      visible,
      closeDetail,
      onAnnexDialogClose,
    };
  },
});
