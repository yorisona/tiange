import { defineComponent, ref, onMounted, computed, h } from '@vue/composition-api';
import { workbenchStore } from '@/modules/workbench/store';
import { GetFinancialReceivables } from '@/services/finance';
import WriteListPop from '../components/WriteListPop/index.vue';
import { receivableList, receivableParams, WriteOffStatus } from '@/types/tiange/finance/finance';
import { BusinessTypeOptions } from '@/types/tiange/common';
import { numberMoneyFormat } from '@/utils/formatMoney';
import { PaginationParams } from '@/types/base/pagination';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { TableColumn } from '@/types/vendor/column';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { max_length_of_column } from '@/utils/table';
import { Decimal2String } from '@/utils/string';
import Decimal from 'decimal.js';
import { usePageJump } from '@/utils/pageJump';
import { BusinessTypeMap } from '@/types/tiange/common';
import { getToken } from '@/utils/token';
import { ObjectFilterEmpty } from '@/utils/func';
import qs from 'query-string';

export default defineComponent({
  components: {
    WriteListPop,
  },
  filters: {
    emptyData(data: string | null | undefined) {
      if (data === '' || data === undefined || data === null) {
        return '--';
      } else {
        return data;
      }
    },
  },
  setup(_, ctx) {
    const loading = ref(false);
    const list = ref<receivableList[]>([]);
    const total = ref(0);
    const queryForm = ref<
      {
        receivable_type: number | string;
        write_off_status: WriteOffStatus | '';
        search_type: number;
        search_value: string;
        customer_manager: string;
        brand_name: string;
        company_name: string;
        settlement_date: number | undefined;
        account_detail_date?: string;
      } & PaginationParams
    >({
      receivable_type: '',
      write_off_status: '',
      search_value: '',
      search_type: 1,
      customer_manager: '',
      brand_name: '',
      company_name: '',
      settlement_date: undefined,
      page_num: 1,
      num: 20,
      account_detail_date: undefined,
    });
    const isHideReversed = ref(true);
    const QueryFormCopy = ref<any>({});
    /** 应收编号渲染函数 */
    const receivable_uid_render = (row: receivableList) => {
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
                row.reversed_id !== null ||
                row.reverse_id !== null ||
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
    };

    const amount_render = <T extends boolean>(
      row: receivableList,
      field: 'receivable_amount' | 'write_off_amount' | 'not_write_off_amount',
      text_only: T,
    ) => {
      const data = `${Decimal2String(new Decimal(row[field]))}`;
      if (
        (text_only ||
          (row.reversed_id === null && row.reverse_id === null && row.refunded_id === null)) &&
        row.refunded_id === null &&
        (row.refund_amount === null || row.refund_amount <= 0)
      ) {
        return data;
      } else if (row.refund_amount > 0 && row.refund_amount !== row.receivable_amount) {
        return h('span', { class: 'reverse-orange' }, [data]) as TableColumnRenderReturn<T>;
      }
      return h('span', { class: 'reverse-red' }, [data]) as TableColumnRenderReturn<T>;
    };

    /** 应收金额渲染函数 */
    const receivable_amount_render = <T extends boolean>(row: receivableList, text_only: T) =>
      amount_render(row, 'receivable_amount', text_only);

    /** 应收金额最大宽度 */
    const receivable_amount_max_length = max_length_of_column(
      list,
      '应收金额 (元)',
      receivable_amount_render,
    );

    /** 实收金额渲染函数 */
    const write_off_amount_render = <T extends boolean>(row: receivableList, text_only: T) =>
      amount_render(row, 'write_off_amount', text_only);

    /** 实收金额最大宽度 */
    const write_off_amount_max_length = max_length_of_column(
      list,
      '实收金额 (元)',
      write_off_amount_render,
    );

    /** 未核销金额渲染函数 */
    const not_write_off_amount_render = <T extends boolean>(row: receivableList, text_only: T) =>
      amount_render(row, 'not_write_off_amount', text_only);

    /** 未核销金额最大宽度 */
    const not_write_off_amount_max_length = max_length_of_column(
      list,
      '未核销金额 (元)',
      not_write_off_amount_render,
    );

    const columns = computed<TableColumn<receivableList>[]>(() => [
      {
        label: '应收编号',
        fixed: 'left',
        align: 'center',
        minWidth: 160,
        formatter: row => receivable_uid_render(row),
      },
      {
        label: '应收金额 (元)',
        align: 'right',
        fixed: 'left',
        minWidth: receivable_amount_max_length.value,
        formatter: row => receivable_amount_render(row, false),
      },
      {
        label: '实收金额 (元)',
        align: 'right',
        minWidth: write_off_amount_max_length.value,
        formatter: row => write_off_amount_render(row, false),
      },
      {
        label: '未核销金额 (元)',
        align: 'right',
        minWidth: not_write_off_amount_max_length.value,
        formatter: row => not_write_off_amount_render(row, false),
      },
      {
        label: '账期',
        align: 'center',
        prop: 'account_detail_date',
        minWidth: 100,
        formatter: row => row.account_detail_date || '--',
      },
    ]);

    /** 结算单编号渲染函数 */
    const settlement_uid_render = (row: receivableList) => {
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
                row.reversed_id !== null ||
                row.reverse_id !== null ||
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
    };

    const columns2 = computed<TableColumn<receivableList>[]>(() => [
      {
        label: '结算单',
        minWidth: 160,
        align: 'center',
        formatter: row => settlement_uid_render(row),
      },
    ]);

    const getParams = (): receivableParams => {
      const query = queryForm.value;
      return {
        num: query.num,
        page_num: query.page_num,
        receivable_type: query.receivable_type,
        write_off_status: query.write_off_status === '' ? undefined : query.write_off_status,
        receivable_uid: query.search_type === 1 ? query.search_value : '',
        project_uid: query.search_type === 2 ? query.search_value : '',
        project_name: query.search_type === 3 ? query.search_value : '',
        settlement_uid: query.search_type === 4 ? query.search_value : '',
        // customer_manager: query.search_type === 5 ? query.search_value : '',
        customer_manager: query.customer_manager,
        brand_name: query.brand_name,
        company_name: query.company_name,
        settlement_date: query.settlement_date,
        is_hide_reverse_data: isHideReversed.value ? 1 : undefined,
        account_detail_date: queryForm.value.account_detail_date,
      };
    };

    const getList = async () => {
      loading.value = true;
      const payload = getParams();
      QueryFormCopy.value = { ...payload };
      delete QueryFormCopy.value.num;
      delete QueryFormCopy.value.page_num;

      const res = await GetFinancialReceivables(payload);
      if (res.data.success) {
        const data = res.data.data;
        list.value = data.data;
        total.value = data.total;
        loading.value = false;
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };
    // interface filterKey {
    //   num: any;
    //   page_num: any;
    // }
    // type filterKeys = Exclude<keyof receivableParams, keyof filterKey>;
    // type filterForm = {
    //   [key in filterKeys as string]: receivableParams[key];
    // };
    // const exportFilterParams = (params: filterForm) => {
    //   for (const i in params) {
    //     if (params[i]) {
    //       console.log(params[i], 'params[i]');
    //       return true;
    //     }
    //     return false;
    //   }
    // };
    const isDisabled = computed(() => {
      if (QueryFormCopy.value.receivable_type) return false;
      else if (QueryFormCopy.value.write_off_status) return false;
      else if (QueryFormCopy.value.receivable_uid) return false;
      else if (QueryFormCopy.value.project_uid) return false;
      else if (QueryFormCopy.value.project_name) return false;
      else if (QueryFormCopy.value.settlement_uid) return false;
      else if (QueryFormCopy.value.customer_manager) return false;
      else if (QueryFormCopy.value.brand_name) return false;
      else if (QueryFormCopy.value.company_name) return false;
      else if (QueryFormCopy.value.settlement_date) return false;
      else if (QueryFormCopy.value.account_detail_date) return false;
      return true;
    });
    const onQueryResetClick = () => {
      queryForm.value.receivable_type = '';
      queryForm.value.write_off_status = '';
      queryForm.value.search_value = '';
      queryForm.value.search_type = 1;
      queryForm.value.page_num = 1;
      queryForm.value.num = 20;
      queryForm.value.customer_manager = '';
      queryForm.value.brand_name = '';
      queryForm.value.company_name = '';
      queryForm.value.settlement_date = undefined;
      queryForm.value.account_detail_date = undefined;
      getList();
    };
    const onQuerySearchClick = async () => {
      queryForm.value.page_num = 1;
      getList();
    };

    const handleCurrentChange = (num: number) => {
      queryForm.value.page_num = num;
      getList();
    };

    const handlePageSizeChange = (num: number) => {
      queryForm.value.page_num = 1;
      queryForm.value.num = num;
      getList();
    };

    const { jumpProjectDetail } = usePageJump();
    /**
     * 打开项目详情
     */
    const goProjectDetail = async (row: any) => {
      jumpProjectDetail(row.business_type || row.receivable_type, {
        project_id: row.project_id,
        newWindow: true,
      });
    };

    onMounted(() => {
      getList();
      if (!ctx.root.$store.hasModule('workbench')) {
        ctx.root.$store.registerModule('workbench', workbenchStore);
      }
    });

    // 自适应表格高度部分
    // 滚动模式相关
    const buttonLineHeight = 32;
    const paginationLineHeight = 34;
    const rectPadding = 36;
    const otherHeight = 31;

    const topCardHeight = ref(0);
    const onTopCardRectUpdate = (rect: DOMRect) => {
      topCardHeight.value = rect.height;
    };

    const { cardProps, tableProps, onRectUpdate } = useAutoTableHeightInCard({
      compensation: computed(
        () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      ),
      fixedBlockHeightRefs: [topCardHeight],
      tableMinHeight: 100,
    });

    const writeOffPopoverVisible = (row: receivableList) => {
      let popoverVisible = false;
      // if (row.receivable_type === 2) {
      //   popoverVisible = row.refund_write_off_infos && row.refund_write_off_infos.length > 0;
      // } else {
      popoverVisible =
        (row.write_off_infos && row.write_off_infos.length > 0) ||
        (row.refund_write_off_infos && row.refund_write_off_infos.length > 0);
      // }
      return popoverVisible;
    };

    const writeOffPopoverInfo = (row: receivableList) => {
      let info = [];
      // if (row.receivable_type === 2) {
      //   info = row.refund_write_off_infos ?? [];
      // } else {
      info = [...(row.write_off_infos ?? [])];
      (row.refund_write_off_infos ?? []).forEach((item: any) => {
        info.push({
          receipt_uid: `${item.cost_id}`,
          write_off_amount: (item.write_off_amount ?? 0) * -1,
          write_off_time: item.write_off_time,
          write_off_user: item.write_off_user,
        });
      });

      // }
      return info;
    };
    const exportQuick = () => {
      const _paramsstr = qs.stringify({ ...ObjectFilterEmpty(QueryFormCopy.value) });
      const token = getToken();
      console.log(_paramsstr, queryForm.value, 'pr');
      window.open(
        `${process.env.VUE_APP_BASE_API}/api/receivable/query_financial_receivables_export?${_paramsstr}&Authorization=${token}`,
      );
    };
    return {
      isHideReversed,
      BusinessTypeOptions,
      onTopCardRectUpdate,
      queryForm,
      loading,
      getList,
      list,
      total,
      BusinessTypeMap,
      columns,
      columns2,
      onQuerySearchClick,
      onQueryResetClick,
      handleCurrentChange,
      handlePageSizeChange,
      numberMoneyFormat,
      goProjectDetail,
      cardProps,
      tableProps,
      onRectUpdate,
      writeOffPopoverVisible,
      writeOffPopoverInfo,
      exportQuick,
      isDisabled,
    };
  },
});
