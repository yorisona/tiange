/*
 * @Author: 肖槿
 * @Date: 2021-12-14 17:18:49
 * @Description: 未核销发票
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-03-09 15:20:19
 * @FilePath: \goumee-star-frontend\src\modules\finance\report\unWriteOff\index.tsx
 */
import { defineComponent, onMounted, Ref, computed, SetupContext, ref } from '@vue/composition-api';
import { FinanceInvoice } from '@/types/tiange/finance/invoice';
import { useColumns, FinanceInvoiceCol } from '@/modules/finance/invoice/use/columns';
import { useUnWriteOff } from '../useReport';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer.vue';
export default defineComponent({
  name: 'unWriteOff',
  components: {
    ElImageViewer,
  },
  setup(prop, ctx) {
    const { getData, tableData, params, loading, total } = useUnWriteOff(ctx);
    const currentSizeChange = (val: number) => {
      params.value.num = val;
      query(params.value);
    };
    const handleCurrentChange = (val: number) => {
      params.value.page_num = val;
      query(params.value);
    };
    onMounted(() => {
      getData(params.value);
    });
    const query = (curparams: any) => {
      getData(curparams);
    };
    const getColumns = (
      ctx: SetupContext,
      data: Ref<FinanceInvoice[]>,
      showPreviewViewer: (urllist: string[]) => void,
    ) => {
      const {
        invoice_number_column, // 发票号码
        invoice_date_column, // 发票日期
        invoice_amount_column, // 开票金额
        seller_name_column, // 销售方
        buyer_name_column, // 购买方
        invoice_not_amount_column, // 未核销金额
        writeoff_status_column, // 核销状态
        invoice_picture_column, // 发票
      } = useColumns(data, showPreviewViewer);
      const columns = computed<FinanceInvoiceCol[]>(() => [
        buyer_name_column.value,
        seller_name_column.value,
        invoice_number_column.value,
        invoice_date_column.value,
        invoice_amount_column.value,
        invoice_not_amount_column.value,
        writeoff_status_column.value,
        invoice_picture_column.value,
      ]);
      return columns;
    };
    const showViewer = ref(false);
    const closeViewer = () => {
      showViewer.value = false;
    };
    const ImageUrlList = ref<string[]>([]);
    const showPreviewViewer = (urllist: string[]) => {
      showViewer.value = true;
      ImageUrlList.value = urllist;
    };
    const columns = getColumns(ctx, tableData, showPreviewViewer);
    return {
      tableData,
      loading,
      getData,
      params,
      columns,
      showViewer,
      ImageUrlList,
      closeViewer,
      total,
      currentSizeChange,
      handleCurrentChange,
      query,
    };
  },
  render() {
    return (
      <div class="report-un-write-off">
        <div class="tabs-box">
          <tg-table
            height="100%"
            v-loading={this.loading}
            border
            stripe
            class="precharge-table"
            data={this.tableData}
          >
            <template slot="empty">
              <empty-common detail-text="暂无数据"></empty-common>
            </template>
            {this.columns.map((v, k) => (
              <el-table-column
                resizable={false}
                class-name={v.className}
                label={v.label}
                prop={v.property}
                align={v.align}
                headerAlign={v.headerAlign}
                minWidth={(k <= 1 || k === 6 || k === 4 || k === 5) && v.minWidth}
                formatter={v.formatter}
              />
            ))}
          </tg-table>
        </div>

        {this.tableData.length > 0 && (
          <div class="pagination">
            <el-pagination
              class="flex-none"
              current-page={this.params.page_num}
              page-sizes={[10, 20, 30, 50, 100]}
              page-size={this.params.num}
              total={this.total}
              layout="total, prev, pager, next, sizes, jumper"
              on-current-change={this.handleCurrentChange}
              on-size-change={this.currentSizeChange}
            />
          </div>
        )}

        {this.showViewer && (
          <el-image-viewer attrs={{ 'on-close': this.closeViewer }} url-list={this.ImageUrlList} />
        )}
      </div>
    );
  },
});
