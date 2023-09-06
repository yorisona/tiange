/*
 * @Author: 肖槿
 * @Date: 2021-12-14 17:18:49
 * @Description: 预收
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-03-09 15:52:35
 * @FilePath: \goumee-star-frontend\src\modules\finance\report\financePrecharge\index.tsx
 */
import { defineComponent, inject, onMounted, Ref } from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';
import {
  reportFilterParams,
  busType,
  platformType,
  cooperationType,
  gatherType,
} from '../reportType';
import { usePrecharge } from '../useReport';
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
    formatter: row => busType.get(row.business_type),
  },
  {
    label: '所属平台',
    align: 'center',
    width: 90,
    formatter: row => platformType.get(row.platform) || '--',
  },
  {
    label: '合作类型',
    align: 'center',
    headerAlign: 'center',
    width: 90,
    formatter: row => cooperationType.get(row.cooperation_type) || '--',
  },
  {
    label: '部门',
    property: 'department',
    align: 'center',
    width: 120,
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
    property: 'achievement_uid',
    align: 'left',
    headerAlign: 'center',
    width: 160,
  },
  {
    label: '业绩名称',
    property: 'achievement_name',
    align: 'left',
    width: 120,
    className: 'project-income-head',
  },
  {
    label: '收款金额 (元)',
    align: 'right',
    headerAlign: 'right',
    width: 120,
    formatter: row => numberFormat(row.gather_amount, 2, '.', ','),
  },
  {
    label: '收款方式',
    align: 'center',
    headerAlign: 'center',
    width: 90,
    formatter: row => gatherType.get(row.gather_way),
  },
  {
    label: '收款时间',
    property: 'gather_date',
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
  name: 'financePrecharge',
  setup(prop, ctx) {
    const { getData, tableData, params, loading, total } = usePrecharge(ctx);
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
          stripe
          tooltip-effect="light"
          height={this.tableData.length > 0 ? 'calc(100vh - 255px)' : 'calc(100vh - 205px)'}
          v-loading={this.loading}
          border
          class="precharge-table"
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
