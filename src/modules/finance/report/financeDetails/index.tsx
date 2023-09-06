/*
 * @Author: 肖槿
 * @Date: 2021-12-14 17:18:49
 * @Description: 收支明细
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-12-22 16:12:12
 * @FilePath: \goumee-star-frontend\src\modules\finance\report\financeDetails\index.tsx
 */
import { defineComponent, onMounted, inject, Ref, ref, watch } from '@vue/composition-api';
import {
  useReport,
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
import { FD } from '@/utils/formatData';
import { formatAmount } from '@/utils/string';
// import days from 'moment';

export default defineComponent({
  name: 'financeDetails',
  props: {
    from_height: {
      type: Number,
      default: 144,
    },
  },
  setup(prop, ctx) {
    const { getData, tableData, loading } = useReport(ctx);
    const filterParams: any = inject<Ref<reportFilterParams>>('filterParams');
    const query = () => {
      const {
        account_detail_date,
        business_type,
        project_name,
        settlement_date,
        income_or_pay_search_type,
        income_or_pay_date,
        income_search_type,
        income_date,
        pay_search_type,
        pay_date,
      } = filterParams.value;
      getData({
        account_detail_date,
        business_type,
        project_name,
        settlement_date,
        income_or_pay_search_type,
        income_or_pay_date,
        income_search_type,
        income_date,
        pay_search_type,
        pay_date,
      });
    };

    // 1收款搜索，2付款搜索
    const searchType = ref<number | undefined>(undefined);

    onMounted(() => {
      // const curDate = days(new Date()).subtract(1, 'months').startOf('month').format('YYYY-MM');
      // const { business_type, date = curDate, project_name } = filterParams.value;
      // getData({ business_type, date, project_name });
      query();
    });

    watch(
      () => loading.value,
      () => {
        if (loading.value === false) {
          if (filterParams.value.income_date) {
            searchType.value = 1;
          } else if (filterParams.value.pay_date) {
            searchType.value = 2;
          } else {
            searchType.value = undefined;
          }
        }
      },
    );
    const footerMethod = ({ columns }: any) => {
      return [
        columns?.map((el: any, index: number) => {
          if (index === 0) return '合计';
          const amount = tableData.value?.statistics_data?.[el.property];
          return FD.isEmpty(amount) ? '--' : formatAmount(+amount / 100, 'None');
        }),
      ];
    };
    return {
      tableData,
      loading,
      getData,
      query,
      footerMethod,
      searchType,
    };
  },
  render() {
    return (
      <div class="finance-details">
        <tg-card
          class="mgt-10 finance-report-main"
          style={{
            height: 'calc(100vh - ' + (this.from_height + 90) + 'px)',
          }}
          padding={[4, 16, 16, 16]}
        >
          <div
            class="finance-report-table"
            style={{
              height: 'calc(100vh - ' + (this.from_height + 150) + 'px)',
            }}
          >
            <vxe-table
              border
              show-footer
              highlight-hover-row
              tooltip-config={{
                theme: 'light',
              }}
              show-overflow
              height={'100%'}
              v-loading={this.loading}
              data={this.tableData?.report_list || []}
              footer-method={this.footerMethod}
              show-footer-overflow
              // key={this.searchType}
            >
              <template slot="empty">
                <empty-common detail-text="暂无数据"></empty-common>
              </template>
              <vxe-colgroup
                key={this.searchType + 'project'}
                title="项目信息"
                header-class-name="project-info-head"
                align="center"
              >
                {projectColumn.map(v => (
                  <vxe-column
                    header-class-name={v.className}
                    title={v.label}
                    field={v.property}
                    align={v.align}
                    headerAlign={v.headerAlign}
                    minWidth={v.width}
                    fixed={v.fixed}
                    formatter={v.formatter}
                    key={v.label}
                  />
                ))}
              </vxe-colgroup>
              <vxe-colgroup
                title="合计"
                key={this.searchType + 'sum'}
                header-class-name="project-sum-head"
                align="center"
              >
                {sumColumn.map((v, idx) => {
                  return (
                    (this.searchType === undefined ||
                      (this.searchType === 1 && idx < 3) ||
                      (this.searchType === 2 && idx > 2)) && (
                      <vxe-column
                        header-class-name={v.className}
                        title={v.label}
                        field={v.property}
                        align={v.align}
                        headerAlign={v.headerAlign}
                        minWidth={v.width}
                        formatter={v.formatter}
                        key={v.label}
                      />
                    )
                  );
                })}
              </vxe-colgroup>
              {(this.searchType === 1 || this.searchType === undefined) && (
                <fragments>
                  <vxe-colgroup
                    key={this.searchType + 'income'}
                    title="收入"
                    header-class-name="project-income-head"
                    align="center"
                  >
                    {incomeColumn.map(v => (
                      <vxe-column
                        header-class-name={v.className}
                        title={v.label}
                        field={v.property}
                        align={v.align}
                        headerAlign={v.headerAlign}
                        minWidth={v.width}
                        formatter={v.formatter}
                        key={v.label}
                      />
                    ))}
                  </vxe-colgroup>
                  <vxe-colgroup
                    title="收款"
                    key={this.searchType + 'receive'}
                    header-class-name="project-receive-head"
                    align="center"
                  >
                    {receivePaymentColumn.map(v => (
                      <vxe-column
                        header-class-name={v.className}
                        title={v.label}
                        field={v.property}
                        align={v.align}
                        headerAlign={v.headerAlign}
                        minWidth={v.width}
                        formatter={v.formatter}
                        key={v.label}
                      />
                    ))}
                  </vxe-colgroup>
                  <vxe-colgroup
                    title="销售发票"
                    key={this.searchType + 'sale'}
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
                        minWidth={v.width}
                        formatter={v.formatter}
                        key={v.label}
                      />
                    ))}
                  </vxe-colgroup>
                </fragments>
              )}
              {(this.searchType === 2 || this.searchType === undefined) && (
                <fragments>
                  <vxe-colgroup
                    key={this.searchType + 'cost'}
                    title="成本"
                    header-class-name={
                      this.searchType === 2 ? 'project-cost-head reserve' : 'project-cost-head'
                    }
                    align="center"
                  >
                    {costColumn.map(v => (
                      <vxe-column
                        header-class-name={
                          this.searchType === 2 ? `${v.className} reserve` : v.className
                        }
                        title={v.label}
                        field={v.property}
                        align={v.align}
                        headerAlign={v.headerAlign}
                        minWidth={v.width}
                        formatter={v.formatter}
                        key={v.label}
                      />
                    ))}
                  </vxe-colgroup>
                  <vxe-colgroup
                    key={this.searchType + 'payment'}
                    title="付款"
                    header-class-name={
                      this.searchType === 2
                        ? 'project-payment-head reserve'
                        : 'project-payment-head'
                    }
                    align="center"
                  >
                    {paymentColumn.map(v => (
                      <vxe-column
                        header-class-name={
                          this.searchType === 2 ? `${v.className} reserve` : v.className
                        }
                        title={v.label}
                        field={v.property}
                        align={v.align}
                        headerAlign={v.headerAlign}
                        minWidth={v.width}
                        formatter={v.formatter}
                        key={v.label}
                      />
                    ))}
                  </vxe-colgroup>
                  <vxe-colgroup
                    key={this.searchType + 'purchase'}
                    title="采购发票"
                    header-class-name={
                      this.searchType === 2
                        ? 'project-purchase-head reserve'
                        : 'project-purchase-head'
                    }
                    align="center"
                  >
                    {purchaseColumn.map(v => (
                      <vxe-column
                        header-class-name={
                          this.searchType === 2 ? `${v.className} reserve` : v.className
                        }
                        title={v.label}
                        field={v.property}
                        align={v.align}
                        headerAlign={v.headerAlign}
                        minWidth={v.width}
                        formatter={v.formatter}
                        key={v.label}
                      />
                    ))}
                  </vxe-colgroup>
                </fragments>
              )}
            </vxe-table>
          </div>
        </tg-card>
      </div>
    );
  },
});
