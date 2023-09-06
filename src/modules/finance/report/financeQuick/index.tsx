/*
 * @Author: 肖槿
 * @Date: 2021-12-14 17:18:49
 * @Description: 收支明细
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-12-22 15:36:05
 * @FilePath: \goumee-star-frontend\src\modules\finance\report\financeQuick\index.tsx
 */
import { defineComponent, onMounted, inject, Ref } from '@vue/composition-api';
import {
  useQuick,
  projectColumn,
  sumColumn,
  incomeColumn,
  paymentColumn,
  receivePaymentColumn,
  purchaseColumn,
  salesReceiptColumn,
  costColumn,
} from '../useReport';
import { reportFilterParams } from '../reportType';
import days from 'moment';

export default defineComponent({
  name: 'financeQuick',
  setup(prop, ctx) {
    const { getData, tableData, loading } = useQuick(ctx);
    const filterParams: any = inject<Ref<reportFilterParams>>('filterParams');
    const query = () => {
      const { business_type, date, project_name } = filterParams.value;
      getData({ business_type, date, project_name });
    };
    onMounted(() => {
      const curDate = days(new Date()).subtract(1, 'months').startOf('month').format('YYYY-MM');
      const { business_type, date = curDate, project_name } = filterParams.value;
      getData({ business_type, date, project_name });
    });
    return {
      tableData,
      loading,
      getData,
      query,
    };
  },
  render() {
    return (
      <div class="finance-details">
        <tg-card class="mgt-10 finance-report-main" padding={[4, 16, 16, 16]}>
          <div class="finance-report-table">
            <vxe-table
              highlight-hover-row
              border
              tooltip-config={{
                theme: 'light',
              }}
              show-overflow
              height={'100%'}
              v-loading={this.loading}
              data={this.tableData}
            >
              <template slot="empty">
                <empty-common detail-text="暂无数据"></empty-common>
              </template>
              <vxe-colgroup title="项目信息" header-class-name="project-info-head" align="center">
                {projectColumn.map(v => (
                  <vxe-column
                    header-class-name={v.className}
                    title={v.label}
                    field={v.property}
                    fixed={v.fixed}
                    align={v.align}
                    headerAlign={v.headerAlign}
                    width={v.width}
                    formatter={v.formatter}
                  />
                ))}
              </vxe-colgroup>
              <vxe-colgroup title="合计" header-class-name="project-sum-head" align="center">
                {sumColumn.map(v => (
                  <vxe-column
                    header-class-name={v.className}
                    title={v.label}
                    field={v.property}
                    align={v.align}
                    headerAlign={v.headerAlign}
                    width={v.width}
                    formatter={v.formatter}
                  />
                ))}
              </vxe-colgroup>
              <vxe-colgroup title="收入" header-class-name="project-income-head" align="center">
                {incomeColumn.map(v => (
                  <vxe-column
                    header-class-name={v.className}
                    title={v.label}
                    field={v.property}
                    align={v.align}
                    headerAlign={v.headerAlign}
                    width={v.width}
                    formatter={v.formatter}
                  />
                ))}
              </vxe-colgroup>
              <vxe-colgroup title="收款" header-class-name="project-receive-head" align="center">
                {receivePaymentColumn.map(v => (
                  <vxe-column
                    header-class-name={v.className}
                    title={v.label}
                    field={v.property}
                    align={v.align}
                    headerAlign={v.headerAlign}
                    width={v.width}
                    formatter={v.formatter}
                  />
                ))}
              </vxe-colgroup>

              <vxe-colgroup
                title="销售发票"
                header-class-name="project-receipt-head"
                align="center"
              >
                {salesReceiptColumn.map(v => (
                  <vxe-column
                    header-class-name={v.className}
                    title={v.label}
                    field={v.property}
                    align={v.align}
                    headerAlign={v.headerAlign}
                    width={v.width}
                    formatter={v.formatter}
                  />
                ))}
              </vxe-colgroup>
              <vxe-colgroup title="成本" header-class-name="project-cost-head" align="center">
                {costColumn.map(v => (
                  <vxe-column
                    header-class-name={v.className}
                    title={v.label}
                    field={v.property}
                    align={v.align}
                    headerAlign={v.headerAlign}
                    width={v.width}
                    formatter={v.formatter}
                  />
                ))}
              </vxe-colgroup>
              <vxe-colgroup title="付款" header-class-name="project-payment-head" align="center">
                {paymentColumn.map(v => (
                  <vxe-column
                    header-class-name={v.className}
                    title={v.label}
                    field={v.property}
                    align={v.align}
                    headerAlign={v.headerAlign}
                    width={v.width}
                    formatter={v.formatter}
                  />
                ))}
              </vxe-colgroup>
              <vxe-colgroup
                title="采购发票"
                header-class-name="project-purchase-head"
                align="center"
              >
                {purchaseColumn.map(v => (
                  <vxe-column
                    header-class-name={v.className}
                    title={v.label}
                    field={v.property}
                    align={v.align}
                    headerAlign={v.headerAlign}
                    width={v.width}
                    formatter={v.formatter}
                  />
                ))}
              </vxe-colgroup>
            </vxe-table>
          </div>
        </tg-card>
      </div>
    );
  },
});
