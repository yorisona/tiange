/**
 * 营销业务 - 项目详情 - tab 跟单表 - 列表部分
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-12 17:54:20
 */
import { computed, h, inject, onMounted, ref, watch } from '@vue/composition-api';
import type { Ref, SetupContext } from '@vue/composition-api';
import type { TableColumn } from '@/types/vendor/column';
import type { AE, AEItem, AEOrder, AEOrderQueryParams } from '@/types/tiange/marketing/ae';
import type { MarketingProjectDetail as ProjectDetail } from '@/types/tiange/marketing/project';
import type { UserInfo } from '@/types/tiange/system';
import { DeleteAEOrder, GetAeDocumentaryAmount, GetAEOrders } from '@/services/marketing/ae';
import Money, { MoneyUnit } from '@/utils/money';
import moment from 'moment';
import { sleep } from '@/utils/func';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { RIGHT_CODE } from '@/const/rightCode';
import { HasPermission } from '@/use/permission';
import { max_length_of_column } from '@/utils/table';
import { get_limited_length_string } from '@/utils/string';
import { TableColumnRenderReturn } from '@/types/tiange/utils';

const money = new Money();

type Col = TableColumn<AEOrder>;

const moneyFormat = (num?: number | ''): string =>
  num === '' ? '--' : num === undefined ? '--' : `${money.format(num, MoneyUnit.Yuan)}`;

const useList = (ctx: SetupContext) => {
  const project = inject<Ref<ProjectDetail>>('MarketingProject');
  const loading = ref(false);
  const data = ref<AEOrder[]>([]);
  const statInfo = ref<{
    act_documentary_amount: number | '';
    exp_documentary_amount: number | '';
  }>({
    act_documentary_amount: '',
    exp_documentary_amount: '',
  });
  const total = ref(0);

  /** 权限检查 */
  const Permission = computed(() => {
    const canChange = HasPermission(RIGHT_CODE.marketing_project_documentary_change);

    return { canChange };
  });

  const userInfo = computed<UserInfo>(() => ctx.root.$store.getters['user/getUserInfo']);

  const aeList = computed<AE[]>(() => ctx.root.$store.getters['marketing/aeList']);

  const isAE = computed(
    () => aeList.value?.map(el => el.ae_id).includes(userInfo.value.id) ?? false,
  );

  const aeOptions = computed(
    () =>
      aeList.value?.map(el => {
        return {
          label: el.ae_name,
          value: el.ae_id,
        };
      }) ?? [],
  );

  const queryForm = ref<{ ae_id: number | '' }>({
    ae_id: '',
  });

  const checkedAE = computed(
    () => '跟单AE：' + aeList.value.find(el => el.ae_id === queryForm.value.ae_id)?.ae_name ?? '',
  );

  watch(
    () => JSON.stringify(aeList.value),
    (next, prev) => {
      if (next === prev) {
        return;
      }

      if (queryForm.value.ae_id === '') {
        if (isAE.value) {
          queryForm.value.ae_id = userInfo.value.id;
        } else {
          queryForm.value.ae_id = aeList.value[0].ae_id;
        }
      }
    },
  );

  const checked_ae_ready = ref(false);
  const ae_list_ready = computed(() => aeList.value.length > 0);
  const userinfo_ready = computed(() => userInfo.value.id > 0);

  const init_ae = () => {
    if (queryForm.value.ae_id === '') {
      const id = isAE.value
        ? userInfo.value.id
        : aeList.value.length > 0
        ? aeList.value[0].ae_id
        : '';

      queryForm.value.ae_id = id;
    }
  };

  watch(
    () => checked_ae_ready.value === false && ae_list_ready.value && userinfo_ready.value,
    next => {
      if (next) {
        init_ae();
      }
    },
  );

  onMounted(() => {
    init_ae();
  });

  const itemsDialogVisible = ref(false);

  const itemsTableColumns = ref<TableColumn<AEItem>[]>([
    {
      label: '商品名称',
      property: 'item_name',
      formatter: (row, col, val) => <div class="line-clamp-2">{val}</div>,
    },
    {
      label: '商品名称',
      property: 'item_url',
      formatter: (row, col, val) => (
        <a href={val} target="_blank" class="line-clamp-1">
          {val}
        </a>
      ),
    },
    {
      label: '样品是否安排',
      property: 'is_sample_arrange',
      align: 'center',
      headerAlign: 'center',
      width: 108,
      formatter: (row, col, val) => (val === 0 ? '否' : '是'),
    },
  ]);

  const items = ref<AEItem[]>([]);

  const closeItemsDialog = () => {
    itemsDialogVisible.value = false;
  };

  const deleteLoading = ref(false);

  // 删除跟单
  const deleteAEOrder = async (row: AEOrder) => {
    const result = await AsyncConfirm(ctx, '确认删除该跟单？');
    if (!result) {
      return;
    }

    const { documentary_id } = row;

    deleteLoading.value = true;
    const { data: response } = await DeleteAEOrder({ documentary_id });
    deleteLoading.value = false;

    if (response.success) {
      ctx.root.$message.success(response.message ?? `删除成功`);
      reload();
    } else {
      ctx.root.$message.error(response.message ?? `删除失败`);
    }
  };

  const checkedRowIndex = ref(-1);

  const clearCheckedRowIndex = () => {
    checkedRowIndex.value = -1;
  };

  /** KOL渲染函数 */
  const kol_name_render = (row: AEOrder) => row.kol_name;

  // /** KOL渲染函数 */
  // const kol_name_render = <T extends boolean>(row: AEOrder, text_only: T) => {
  //   const data = row.kol_name || '--';
  //   const { is_folded, folded_text } = get_limited_length_string(data, 12);

  //   return text_only || !is_folded
  //     ? folded_text
  //     : (h(
  //       'el-popover',
  //       {
  //         props: {
  //           placement: 'right',
  //           trigger: 'hover',
  //           content: data,
  //         },
  //       },
  //       [h('span', { slot: 'reference' }, [folded_text])],
  //     ) as TableColumnRenderReturn<T>);
  // };

  /** kol名称最大宽度 */
  const kol_name_max_length = max_length_of_column(data, 'KOL名称', kol_name_render);

  const price_amount_render = (row: AEOrder) => moneyFormat(row.price_amount);

  const cosnt_amount_render = (row: AEOrder) => moneyFormat(row.cost_amount);

  const goods_name_render = <T extends boolean>(row: AEOrder, text_only: T) => {
    let data = '--';
    let url = '';
    const { item_list } = row;

    if (item_list.length === 0) {
      return '--';
    } else {
      const { item_url, item_name } = item_list[0];
      data = item_name;
      url = item_url;
    }

    const { folded_text } = get_limited_length_string(data, 12);

    return text_only
      ? folded_text
      : (h(
          'el-popover',
          {
            props: {
              placement: 'right',
              trigger: 'hover',
              content: data,
              width: 220,
              openDelay: 300,
            },
          },
          [
            h('div', { slot: 'reference' }, [
              h(
                'span',
                {
                  class: 'hover-link line-clamp-1',
                  on: {
                    click: () => {
                      window.open(url);
                    },
                  },
                },
                [folded_text],
              ),
              item_list.length > 1
                ? h(
                    'a',
                    {
                      on: {
                        click: () => {
                          items.value = item_list;
                          itemsDialogVisible.value = true;
                        },
                      },
                    },
                    ['更多商品'],
                  )
                : '',
            ]),
          ],
        ) as TableColumnRenderReturn<T>);
  };

  const note_render = <T extends boolean>(row: AEOrder, text_only: T) => {
    const data = row.note || '--';
    const { is_folded, folded_text } = get_limited_length_string(data, 17);
    return text_only || !is_folded
      ? folded_text
      : (h(
          'el-popover',
          {
            props: {
              placement: 'right',
              trigger: 'hover',
              content: data,
              width: 220,
              openDelay: 300,
            },
          },
          [h('span', { slot: 'reference' }, [folded_text])],
        ) as TableColumnRenderReturn<T>);
  };

  const base_columns = computed<Col[]>(() => [
    {
      label: 'KOL名称',
      property: 'kol_name',
      fixed: 'left',
      minWidth: kol_name_max_length.value,
      formatter: kol_name_render,
    },
    {
      label: '报价金额 (元)',
      property: 'price_amount',
      align: 'right',
      headerAlign: 'right',
      minWidth: max_length_of_column(data, '报价金额 (元)', price_amount_render).value,
      formatter: price_amount_render,
    },
    {
      label: '成本金额 (元)',
      property: 'cost_amount',
      align: 'right',
      headerAlign: 'right',
      formatter: cosnt_amount_render,
      minWidth: max_length_of_column(data, '成本金额 (元)', cosnt_amount_render).value,
    },
    {
      label: '成本是否安排',
      property: 'is_cost_arrange',
      minWidth: 108,
      align: 'center',
      formatter: (row, col, val) => (val === 0 ? '否' : '是'),
    },
    {
      label: '商品名称/链接',
      property: 'item_list',
      minWidth: max_length_of_column(data, '商品名称/链接', goods_name_render).value,
      formatter: row => goods_name_render(row, false),
    },
    {
      label: '直播日期',
      property: 'live_date',
      minWidth: 100,
      align: 'center',
      formatter: (row, col, val) => (val === '' ? '--' : moment(val).format('YYYY.MM.DD')),
    },
    {
      label: '样品是否安排',
      property: 'is_sample_arrange',
      align: 'center',
      headerAlign: 'center',
      minWidth: 108,
      formatter: row => (row.item_list?.[0].is_sample_arrange === 0 ? '否' : '是'),
    },
    {
      label: '备注',
      property: 'note',
      minWidth: max_length_of_column(data, '备注', note_render).value + 30,
      formatter: row => note_render(row, false),
    },
  ]);

  const operation_column = computed<Col[]>(() => [
    {
      label: '操作',
      fixed: 'right',
      minWidth: Permission.value.canChange ? 94 : 44,
      formatter: (row, col, val, index) => {
        if (!Permission.value.canChange) {
          return '--';
        }
        return (
          <div class="operation">
            <a on={{ click: () => (checkedRowIndex.value = index) }}>编辑</a>
            <a on={{ click: () => deleteAEOrder(row) }}>删除</a>
          </div>
        );
      },
    },
  ]);

  const columns = computed<Col[]>(() => [
    ...base_columns.value,
    ...(queryForm.value.ae_id === userInfo.value.id ? operation_column.value : []),
  ]);

  const loadData = async (payload: AEOrderQueryParams) => {
    loading.value = true;
    const [{ data: response }] = await Promise.all([await GetAEOrders(payload), await sleep(500)]);
    loading.value = false;

    if (response.success) {
      data.value = response.data.data;
      total.value = response.data.total;
    } else {
      data.value = [];
      total.value = 0;
    }
  };

  const getPayload = () => {
    const payload: AEOrderQueryParams = {
      cooperation_id: project?.value?.cooperation_id,
    };

    if (queryForm.value.ae_id !== '') {
      payload.ae_id = queryForm.value.ae_id;
    }
    return payload;
  };

  const reload = async () => {
    await loadData(getPayload());
  };

  const getAmount = async () => {
    const { data: response } = await GetAeDocumentaryAmount(getPayload());

    if (response.success) {
      statInfo.value = response.data;
    } else {
      statInfo.value.act_documentary_amount = 0;
      statInfo.value.exp_documentary_amount = 0;
    }
  };

  // 初始化拉取数据
  watch(
    () => queryForm.value.ae_id !== '' && project?.value?.cooperation_id !== undefined,
    (next, prev) => {
      if (next !== prev) {
        reload();
        getAmount();
      }
    },
  );

  // 切换AE时重新拉取数据
  watch(
    () => queryForm.value.ae_id,
    (next, prev) => {
      if (next !== prev && next !== '' && project?.value?.cooperation_id !== undefined) {
        reload();
        getAmount();
      }
    },
  );

  const documentary_amount_format = (amount: string) => (amount === '' ? '--' : `￥${amount}`);

  return {
    loading,
    data,
    total,
    statInfo,
    queryForm,
    aeList,
    checkedAE,
    aeOptions,
    columns,
    itemsTableColumns,
    items,
    itemsDialogVisible,
    closeItemsDialog,
    reload,
    getAmount,
    documentary_amount_format,
    isAE,
    deleteLoading,
    checkedRowIndex,
    clearCheckedRowIndex,
  };
};

export default useList;
