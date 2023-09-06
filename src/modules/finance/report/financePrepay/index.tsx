/*
 * @Author: 肖槿
 * @Date: 2021-12-14 17:18:49
 * @Description: 预付
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-03-09 15:55:20
 * @FilePath: \goumee-star-frontend\src\modules\finance\report\financePrepay\index.tsx
 */
import { defineComponent, inject, onMounted, Ref } from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';
import {
  reportFilterParams,
  busType,
  platformType,
  cooperationType,
  gatherPreType,
} from '../reportType';
import { usePrepay } from '../useReport';
import { numberFormat } from '@/utils/formatMoney';
type Col = TableColumn<any>;
const prechargeColumn: Col[] = [
  {
    label: '项目编号',
    property: 'project_uid',
    align: 'center',
    width: 160,
    className: 'project-income-head',
  },
  {
    label: '项目名称',
    property: 'project_name',
    align: 'left',
    width: 150,
    className: 'project-income-head',
  },
  {
    label: '业务类型',
    align: 'center',
    width: 90,
    formatter: v => busType.get(v.business_type) || '--',
  },
  {
    label: '所属平台',
    align: 'center',
    headerAlign: 'center',
    width: 90,
    formatter: v => platformType.get(v.platform) || '--',
  },
  {
    label: '合作类型',
    align: 'center',
    headerAlign: 'center',
    width: 90,
    formatter: v => cooperationType.get(v.cooperation_type) || '--',
  },
  {
    label: '部门',
    property: 'department',
    align: 'center',
    width: 120,
    formatter: row => row.department || '--',
  },
  {
    label: '项目经理',
    property: 'project_manager',
    align: 'center',
    headerAlign: 'center',
    width: 90,
    formatter: row => row.project_manager || '--',
  },
  {
    label: '客户经理',
    property: 'customer_manager',
    align: 'center',
    headerAlign: 'center',
    width: 90,
    formatter: row => row.customer_manager || '--',
  },
  {
    label: '单据编号',
    property: 'cost_id',
    align: 'center',
    headerAlign: 'center',
    width: 120,
  },
  {
    label: '付款金额 (元)',
    align: 'right',
    headerAlign: 'right',
    width: 120,
    formatter: row => numberFormat(row.pay_amount, 2, '.', ','),
  },
  {
    label: '付款方式',
    align: 'center',
    headerAlign: 'center',
    width: 90,
    formatter: v => gatherPreType.get(v.pay_way),
  },
  {
    label: '付款时间',
    property: 'pay_date',
    align: 'center',
    headerAlign: 'center',
    width: 100,
  },
  {
    label: '确认时间',
    property: 'confirm_date',
    align: 'center',
    headerAlign: 'center',
    width: 100,
  },
  {
    label: '确认人',
    property: 'confirm_by',
    align: 'center',
    headerAlign: 'center',
    width: 90,
    formatter: row => row.confirm_by || '--',
  },
];
export default defineComponent({
  name: 'financePrepay',
  setup(prop, ctx) {
    const { getData, tableData, params, loading, total } = usePrepay(ctx);
    const filterParams: any = inject<Ref<reportFilterParams>>('filterParams');
    const currentSizeChange = (val: number) => {
      params.value.num = val;
      query();
    };
    const handleCurrentChange = (val: number) => {
      params.value.page_num = val;
      query();
    };
    onMounted(() => {
      const { business_type, page_num = 1, num = 30, project_name } = filterParams.value;
      getData({ business_type, page_num, num, project_name });
    });
    const query = () => {
      const { business_type, project_name } = filterParams.value;
      const { page_num, num } = params.value;
      getData({ business_type, page_num, num, project_name });
    };
    return {
      tableData,
      loading,
      getData,
      params,
      total,
      currentSizeChange,
      handleCurrentChange,
      query,
    };
  },
  render() {
    return (
      <div class="finance-precharge">
        <tg-table
          tooltip-effect="light"
          v-loading={this.loading}
          border
          stripe
          class="precharge-table"
          height={this.tableData.length > 0 ? 'calc(100vh - 255px)' : 'calc(100vh - 205px)'}
          data={this.tableData}
        >
          <template slot="empty">
            <empty-common detail-text="暂无数据"></empty-common>
          </template>
          {prechargeColumn.map(v => (
            <el-table-column
              show-overflow-tooltip
              class-name={v.className}
              label={v.label}
              prop={v.property}
              align={v.align}
              headerAlign={v.headerAlign}
              minWidth={v.width}
              formatter={v.formatter}
            />
          ))}
        </tg-table>

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
      </div>
    );
  },
});
