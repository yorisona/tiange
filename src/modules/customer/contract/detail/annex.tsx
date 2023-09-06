/**
 * 客户管理 - 客户合同 - 合同详情 - tab 补充协议详情
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-26 11:29:44
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
  Ref,
  ref,
  watch,
} from '@vue/composition-api';
import { DeleteContractAnnex, GetContractAnnex } from '@/services/contract';
import {
  Contract,
  ContractAnnex,
  ContractAnnexQueryParams,
  SealTypeMap,
} from '@/types/tiange/contract';
import { TableColumn } from '@/types/vendor/column';
import { formatAmount } from '@/utils/string';
import AnnexDialog from '../annex.dialog.vue';
import { useOAFlows } from '../useOAFlowsInList';
import { DefText } from '@/components/DefText/dt';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { ApprovalStatus, ApprovalStatusMap } from '@/types/tiange/system';
import { MoneyAlign } from '@/use/money.align';

type Col = TableColumn<ContractAnnex>;

const getFilename = (url = '') =>
  String(url || '')
    .split('/')
    .pop();
const getAnnexList = (row: ContractAnnex | undefined) =>
  row?.contract_annex_info.annex_list.map(url => ({
    file_name: getFilename(url),
    url,
    type: '补充协议',
    status: -1,
    status_str: '',
  })) ?? [];

export default defineComponent({
  name: 'tg-customer-contract-detail-tab-annex',
  components: {
    AnnexDialog,
  },
  setup(props, ctx) {
    /** 从父组件获取的合同详情数据 */
    const contract = inject<Ref<Contract | null>>('contract');
    /** 用户信息 */
    const currentUserInfo = inject<ComputedRef<Record<string, any>>>('currentUserInfo');

    const loading = ref(false);
    const data = ref<ContractAnnex[]>([]);
    const total = ref(0);

    const queryForm = ref<ContractAnnexQueryParams>({
      page_num: 1,
      num: 10,
    });

    const oaFlows = useOAFlows('annex');
    const moneyAlign = MoneyAlign.getColSetting();

    const columns = ref<Col[]>([
      {
        label: '序号',
        // type: 'index',
        align: 'center',
        minWidth: 60,
        formatter: (row, column, value, index) => index + 1,
      },

      {
        label: '审批金额',
        property: 'contract_annex_info',
        ...moneyAlign,
        formatter: row => formatAmount(row.contract_annex_info.approval_amount),
      },
      {
        label: '用章情况',
        align: 'center',
        headerAlign: 'center',
        property: 'contract_annex_info',
        formatter: row => SealTypeMap.get(row.contract_annex_info.seal_type ?? -1) ?? DefText(),
      },
      {
        label: '申请内容',
        align: 'center',
        headerAlign: 'center',
        property: 'contract_annex_info',
        formatter: row => row.contract_annex_info.comment || DefText(),
      },
      {
        label: '创建人',
        align: 'center',
        headerAlign: 'center',
        property: 'contract_annex_info',
        formatter: row => row.contract_annex_info.add_by_name,
      },
      {
        label: '创建时间',
        align: 'center',
        headerAlign: 'center',
        property: 'contract_annex_info',
        formatter: row => row.contract_annex_info.gmt_create,
      },
      {
        label: '创建人所属部门',
        align: 'center',
        headerAlign: 'center',
        property: 'contract_annex_info',
        minWidth: 140,
        formatter: row => row.contract_annex_info.add_by_department,
      },
      {
        label: '审批状态',
        align: 'center',
        headerAlign: 'center',
        property: 'contract_annex_info',
        formatter: row => {
          const {
            contract_annex_info: { contract_annex_status },
          } = row;

          const contract_annex_status_str =
            ApprovalStatusMap.get(contract_annex_status) ?? DefText();

          const status_str = (slot = false) =>
            h(
              'span',
              {
                class: [`fg-${ApprovalStatus[contract_annex_status]}`.toLowerCase()],
                ...(slot ? { slot: 'reference' } : {}),
              },
              [contract_annex_status_str],
            );

          if ([ApprovalStatus.Normal, ApprovalStatus.Invalid].includes(contract_annex_status)) {
            // return contract_annex_status_str;
            return status_str();
          } else {
            return h(
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
                    oaFlows.onFlowsShow(row.contract_annex_info.id);
                  },
                  hide: () => {
                    oaFlows.onFlowsHide();
                  },
                },
              },
              [
                status_str(true),
                ...(oaFlows.flowsLoading.value
                  ? [h('div', { style: { padding: '10px 20px' } }, ['正在查询进度...'])]
                  : oaFlows.flowsError.value !== ''
                  ? [oaFlows.flowsError.value]
                  : [oaFlows.oaflowsRender(contract_annex_status)]),
              ],
            );
          }
        },
      },
      {
        label: '附件单',
        align: 'center',
        headerAlign: 'center',
        property: 'contract_annex_info',
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
        label: '操作',
        align: 'center',
        headerAlign: 'center',
        formatter: row => {
          if (
            row.contract_annex_info.contract_annex_status !== ApprovalStatus.Processing &&
            currentUserInfo?.value.id === row.contract_annex_info.add_by
          ) {
            return h(
              'a',
              {
                on: {
                  click: () => {
                    deleteContractAnnex(row.contract_annex_info.id);
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

    const deleteContractAnnex = async (id: number) => {
      const result = await AsyncConfirm(ctx, '删除后数据无法恢复，是否继续操作？');
      if (!result) {
        return;
      }

      const { data: response } = await DeleteContractAnnex(id);

      if (response.success) {
        ctx.root.$message.success('删除成功');
        await reload();
      } else {
        ctx.root.$message.error(response.message ?? '删除失败');
      }
    };

    const getPayload = () => {
      return {
        ...queryForm.value,
        contract_id: contract?.value?.contract_info.id,
        contract_annex_type: 1,
      };
    };

    const loadData = async (payload: ContractAnnexQueryParams) => {
      if (payload.contract_id === undefined) {
        return false;
      }

      loading.value = true;
      const { data: response } = await GetContractAnnex(payload);
      loading.value = false;

      if (response.success) {
        data.value = response.data.data;
        total.value = response.data.total;
      } else {
        data.value = [];
        total.value = 0;
      }
    };

    const reload = async (clean = true) => {
      if (clean) {
        queryForm.value.page_num = 1;
      }

      await loadData(getPayload());
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
      await reload(true);
    };
    const onSizeChange = async (num: number) => {
      queryForm.value.num = num;
      await reload(true);
    };

    const annexDialogVisible = ref(false);
    const checkedRow = ref<ContractAnnex | undefined>(undefined);

    const annexList = computed(() => getAnnexList(checkedRow.value));

    provide('annex-data', annexList);
    provide('annex-dialog-visible', annexDialogVisible);

    const onAnnexDialogClose = () => {
      annexDialogVisible.value = false;
      checkedRow.value = undefined;
    };

    return {
      contract,
      loading,
      columns,
      data,
      total,
      queryForm,
      loadData,
      reload,
      onCurrentChange,
      onSizeChange,
      onAnnexDialogClose,
    };
  },
});
