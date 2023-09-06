import { TgTableColumn } from '@/types/vendor/column';
import { formatAmount } from '@/utils/string';
import { computed, defineComponent, onMounted, PropType, ref, watch } from '@vue/composition-api';
import { useRequest } from '@gm/hooks/ahooks';
import { GetFinanceInvoiceList } from '@/services/finance/invoice';
import { FinanceInvoice, FinanceInvoiceListQueryParams } from '@/types/tiange/finance/invoice';
import { baseInfo } from '../../dialog/invoice.upload';

type Col = TgTableColumn<FinanceInvoice>;
export type ChooseHistoryInvoiceType = {
  getCheckedIds: () => string[];
};

export default defineComponent({
  props: {
    baseInfo: {
      type: Object as PropType<baseInfo>,
    },
    //type 1代表财务发票上传, 2成本结算上传发票
    type: {
      type: Number,
    },
  },
  setup: (props, ctx) => {
    const checkedList = ref<string[]>([]);
    const methods = {
      getCheckedIds() {
        return [...checkedList.value];
      },
    };
    const params = ref<FinanceInvoiceListQueryParams>({
      num: 20,
      page_num: 1,
      invoice_status: 1,
      not_full_write_off: true,
      buyer_name: undefined,
      seller_name: undefined,
    });
    const getBuyerAndSeller = () => {
      return {
        buyer_name: props.type === 1 ? props.baseInfo?.company : undefined,
        seller_name: props.type === 2 ? props.baseInfo?.company : undefined,
      };
    };
    const listServe = useRequest(GetFinanceInvoiceList, { manual: true });
    const pagination = ref({
      total: 0,
      page_sizes: [10, 20, 50, 100],
      layout: 'total, prev, pager, next, sizes',
      onCurrentChange(num: number) {
        const { page_num, ...rest } = params.value;
        const tempParams = {
          page_num: num,
          ...rest,
          ...getBuyerAndSeller(),
        };
        listServe.runAsync(tempParams).then(restult => {
          params.value.page_num = num;
          pagination.value.total = restult.data.data.total;
        });
      },
      onSizeChange(size: number) {
        const { num, ...rest } = params.value;
        const tempParams = {
          num,
          ...rest,
          ...getBuyerAndSeller(),
        };
        listServe.runAsync(tempParams).then(restult => {
          params.value.num = size;
          pagination.value.total = restult.data.data.total;
        });
      },
    });
    const columns = computed<Col[]>(() => [
      {
        label: '选择',
        align: 'center',
        width: 52,
        formatter: row => {
          return (
            <el-checkbox
              value={checkedList.value.includes(row.invoice_number)}
              // value={false}
              on-change={(val: boolean) => {
                if (val) {
                  checkedList.value.push(row.invoice_number);
                } else {
                  checkedList.value = checkedList.value.filter(el => el !== row.invoice_number);
                }
              }}
            ></el-checkbox>
          );
        },
      },
      {
        label: '购买方',
        showOverflowTooltip: true,
        minWidth: 70,
        formatter: row => row.buyer_name || '--',
      },
      {
        label: '销售方',
        minWidth: 70,
        showOverflowTooltip: true,
        formatter: row => row.seller_name || '--',
      },
      {
        label: '发票金额',
        width: 95,
        align: 'right',
        formatter: row => formatAmount(row.total_amount || 0, '¥ '),
      },
      {
        label: '可核销金额',
        width: 95,
        align: 'right',
        formatter: row => formatAmount(row.not_write_off_amount || 0, '¥ '),
      },
      {
        label: '是否专票',
        width: 75,
        align: 'center',
        formatter: row => (row.is_special ? '是' : '否'),
      },
      {
        label: '税率',
        width: 55,
        align: 'right',
        formatter: row => (row.tax_rate ? row.tax_rate + '%' : '--'),
      },
    ]);
    onMounted(async () => {
      const restult = await listServe.runAsync({ ...params.value, ...getBuyerAndSeller() });
      if (restult.data.success) {
        pagination.value.total = restult.data.data.total;
      }
    });
    watch(
      () => props.baseInfo,
      async () => {
        checkedList.value = [];
        const restult = await listServe.runAsync({ ...params.value, ...getBuyerAndSeller() });
        if (restult.data.success) {
          pagination.value.total = restult.data.data.total;
        }
      },
    );
    return {
      columns,
      params,
      listServe,
      pagination,
      ...methods,
    };
  },
  render() {
    const { pagination, params } = this;
    return (
      <div class="tg-choose-history-invoice-dialog-container">
        <div class="table-field">
          <tg-table
            v-loading={this.listServe.loading}
            stripe
            border
            columns={this.columns}
            height="100%"
            data={this.listServe.data?.data || []}
          >
            <template slot="empty">
              <empty-common detail-text="暂无可核销的发票"></empty-common>
            </template>
          </tg-table>
        </div>
        <div className="pagination-field">
          <el-pagination
            pager-count={4}
            total={pagination.total}
            page-size={params.num}
            page-sizes={pagination.page_sizes}
            layout={pagination.layout}
            current-page={params.page_num}
            oncurrent-change={pagination.onCurrentChange}
            onsize-change={pagination.onSizeChange}
          />
        </div>
      </div>
    );
  },
});
