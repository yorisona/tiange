/**
 * 营销业务 - 项目详情 - tab 业绩登记表 - 列表部分
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-08 09:57:43
 */
import { computed, h, inject, onMounted, ref, UnwrapRef } from '@vue/composition-api';
import type { Ref, SetupContext } from '@vue/composition-api';
import type { TableColumn } from '@/types/vendor/column';
import type {
  AchievementReceivable,
  AchievementIncoiveInfo,
  AchievementReceivableQueryParams,
  AchievementReviceivablesStatInfo,
} from '@/types/tiange/marketing/achievement';
import type { PaginationParams } from '@/types/base/pagination';
import moment from 'moment';
import Money, { MoneyUnit } from '@/utils/money';
import invoice from '@/modules/live/project/dialog/invoice';
import { GetAchievementListReceivables } from '@/services/marketing/achievement';
import type { UserInfo } from '@/types/tiange/system';
import type { MarketingProjectDetail as ProjectDetail } from '@/types/tiange/marketing/project';
import { TgInvoiceDetail } from '@/modules/workbench/initiate/invoice/detail';
import { usePermission } from '@/use/permission';

import WriteOff from '@/components/BusinessComponents/WriteOff/index.vue';
import { wait } from '@/utils/func';
import { get_length_of_string } from '@/utils/string';
const money = new Money();

type Col = TableColumn<AchievementReceivable>;

const moneyFormat = (num?: number | ''): string =>
  num === '' ? '--' : num === undefined ? '--' : `￥${money.format(num, MoneyUnit.Yuan)}`;
const priceFormat = (num?: number | ''): string =>
  num === '' ? '--' : num === undefined ? '--' : `${money.format(num, MoneyUnit.Yuan)}`;

const useList = (ctx: SetupContext) => {
  const project = inject<Ref<ProjectDetail>>('MarketingProject');

  /** 是否有权限操作 */
  const hasPermission = computed(() => {
    const user: UserInfo = ctx.root.$store.getters['user/getUserInfo'];

    return [project?.value?.add_by_id, project?.value?.manager_id].includes(user.id);
  });

  const loading = ref(false);
  const data = ref<AchievementReceivable[]>([]);
  const statInfo = ref<AchievementReviceivablesStatInfo>({
    write_off: 0,
    receivable: 0,
    not_write_off: 0,
  });
  const total = ref(0);

  const queryForm = ref<PaginationParams>({
    page_num: 1,
    num: 10,
  });

  const invoiceDialogVisible = ref(false);
  const permission = usePermission();
  const invoices = ref<AchievementIncoiveInfo[]>([]);

  const closeInvoiceDialog = () => {
    invoiceDialogVisible.value = false;
  };

  const deleteLoading = ref(false);

  const checkedRowIndex = ref(-1);

  const clearCheckedRowIndex = () => {
    checkedRowIndex.value = -1;
  };

  const get_reverse_classname = (row: AchievementReceivable) =>
    row.reverse_id !== null ||
    row.reversed_id !== null ||
    row.refunded_id !== null ||
    (row.refund_amount > 0 && row.refund_amount === row.receivable_amount)
      ? { class: 'reverse-red' }
      : row.refund_amount > 0 && row.refund_amount !== row.receivable_amount
      ? { class: 'reverse-orange' }
      : {};

  const dialogRef = ref<TgInvoiceDetail | null>(null);
  const firstStepRef = ref<UnwrapRef<{ show: (...args: any) => void } | undefined>>(undefined);

  /** 应收金额渲染函数 */
  const receivable_amount_render = (row: AchievementReceivable) =>
    priceFormat(row.receivable_amount);

  /** 应收金额最小宽度 */
  const receivable_amount_min_length = computed(
    () =>
      Math.max(
        ...data.value.map(row => get_length_of_string(receivable_amount_render(row))),
        get_length_of_string('应收金额 (元)'),
      ) + 10,
  );

  const columns = computed<Col[]>(() => [
    {
      label: '应收编号',
      fixed: 'left',
      minWidth: 150,
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
                  (row.refund_amount > 0 && row.refund_amount === row.receivable_amount)
                    ? 'reverse-red'
                    : row.refund_amount > 0 && row.refund_amount !== row.receivable_amount
                    ? 'reverse-orange'
                    : ''
                }`,
              },
              row.receivable_uid,
            ),
          ],
        );
      },
    },
    {
      label: '应收金额 (元)',
      property: 'gather_amount',
      align: 'right',
      minWidth: receivable_amount_min_length.value,
      formatter: row => h('span', get_reverse_classname(row), [receivable_amount_render(row)]),
    },
    {
      label: '创建日期',
      property: 'create_date',
      align: 'center',
      minWidth: 110,
      formatter: row => moment(row.create_date).format('YYYY.MM.DD'),
    },
    {
      label: '结算单编号',
      property: 'settlement_uid',
      minWidth: 150,
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
                class: `number-span text ${
                  row.reverse_id !== null ||
                  row.reversed_id !== null ||
                  row.refunded_id !== null ||
                  (row.refund_amount > 0 && row.refund_amount === row.receivable_amount)
                    ? 'reverse-red'
                    : row.refund_amount > 0 && row.refund_amount !== row.receivable_amount
                    ? 'reverse-orange'
                    : ''
                }`,
              },
              row.settlement_uid,
            ),
          ],
        );
      },
    },
    {
      label: '核销状态',
      property: 'write_off_status',
      align: 'left',
      headerAlign: 'left',
      minWidth: 150,
      formatter: row => {
        const write_off_infos = (row.write_off_infos || []).map(item => {
          return [
            item.receipt_uid,
            item.write_off_amount,
            item.write_off_user,
            item.write_off_time,
          ];
        });
        (row.refund_write_off_infos || []).forEach((item: any) => {
          write_off_infos.push([
            item.cost_id,
            (item.write_off_amount ?? 0) * -1,
            item.write_off_user,
            item.write_off_time,
          ]);
        });
        const write_off_header = ['单据编号', '核销金额 (元)', '核销人/账期时间'];
        const props = {
          attrs: {
            write_off_header,
            write_off_infos,
            write_off_status: row.write_off_status,
            is_reverse: row.reversed_id !== null,
          },
        };

        return <WriteOff {...props} />;
      },
    },
    {
      label: '操作',
      fixed: 'right',
      minWidth: 100,
      align: 'center',
      formatter: row => {
        const btnNodes = [];
        const hasWriteOff = permission.marketing_project_write_off_save;
        if (row.refunded_id) return '';
        if (row.reversed_id === null) {
          if (
            (row.write_off_status === 1 || row.write_off_status === 0) &&
            hasWriteOff &&
            row.reverse_id === null
          ) {
            btnNodes.push(
              <a
                onClick={() => {
                  firstStepRef.value?.show({
                    type: 'isReceivable',
                    id: row.id,
                    amount: row.not_write_off_amount, // 可核销金额
                    leaf: 'coop', // 营销业务
                    busType: row.receivable_type, // businessType
                    receivable_uid: row.receivable_uid || row.achievement_uid, // 应收编号
                  });
                }}
              >
                核销
              </a>,
            );
          }
        }

        return <div class="operation">{btnNodes}</div>;
      },
    },
  ]);

  const loadData = async (payload: AchievementReceivableQueryParams) => {
    loading.value = true;
    const [{ data: response }] = await wait(500, GetAchievementListReceivables(payload));
    loading.value = false;

    if (response.success) {
      data.value = response.data.data;
      total.value = response.data.total;
      statInfo.value = {
        not_write_off: response.data.not_write_off,
        receivable: response.data.receivable,
        write_off: response.data.write_off,
      };
    } else {
      data.value = [];
      total.value = 0;
      statInfo.value.not_write_off = 0;
      statInfo.value.receivable = 0;
      statInfo.value.write_off = 0;
    }
  };
  const old_is_hide_reverse_data = ref<number | undefined>(1);
  const reload = async (is_hide_reverse_data: number | undefined, clean = true) => {
    if (clean) {
      queryForm.value.page_num = 1;
    }
    old_is_hide_reverse_data.value = is_hide_reverse_data;
    const payload = {
      // ...queryForm.value,
      receivable_type: 1,
      project_id: parseInt(ctx.root.$route.params.id, 10),
      is_hide_reverse_data: is_hide_reverse_data,
    };

    await loadData(payload);
  };

  onMounted(() => {
    reload(old_is_hide_reverse_data.value);
  });

  // 分页 - 页长
  const onPageSizeChange = (pageSize: number) => {
    queryForm.value.num = pageSize;
    reload(old_is_hide_reverse_data.value);
  };

  // 分页 - 当前页
  const onPageChange = (page: number) => {
    queryForm.value.page_num = page;
    reload(old_is_hide_reverse_data.value, false);
  };

  /** 显示发票详情中的发票图片 */
  const showInvoicePic = (url: string) => {
    invoice.showDetail(url);
  };

  return {
    hasPermission,
    project,
    loading,
    data,
    statInfo,
    total,
    columns,
    reload,
    moneyFormat,
    deleteLoading,
    onPageSizeChange,
    onPageChange,
    queryForm,
    checkedRowIndex,
    clearCheckedRowIndex,
    invoiceDialogVisible,
    closeInvoiceDialog,
    invoices,
    showInvoicePic,
    dialogRef,
    firstStepRef,
  };
};

export default useList;
