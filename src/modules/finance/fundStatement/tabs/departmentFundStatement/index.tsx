import { QueryDepartmentFund } from '@/services/finance';
import { DepartmentFundModel } from '@/types/tiange/finance/finance';
import { wait } from '@/utils/func';
import { formatAmount } from '@/utils/string';
import { defineComponent, ref, h, computed, onMounted } from '@vue/composition-api';
import Decimal from 'decimal.js';

// interface TempType extends PaginationParams {
//   date: string[] | undefined;
//   account: number | undefined;
//   unit_name: string | undefined;
//   total: number | undefined;
// }

export default defineComponent({
  name: 'departmentFundStatement',
  setup(props, ctx) {
    // const initQueryForm = () => {
    //   return {
    //     page_num: 1,
    //     num: 20,
    //     date: [],
    //     account: undefined,
    //     unit_name: undefined,
    //     total: 0,
    //   } as TempType;
    // };

    // const queryForm = ref(initQueryForm());
    const loading = ref(false);
    const tableData = ref<DepartmentFundModel[]>([]);

    const methods = {
      // onQueryHandler() {},
      // onResetHandler() {
      //   queryForm.value = initQueryForm();
      // },
      async queryDepartmentFund() {
        loading.value = true;
        const [res] = await wait(500, QueryDepartmentFund());
        loading.value = false;
        if (res.data.success) {
          tableData.value = res.data.data.data;
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      footerMethod({ columns }: { columns: any }) {
        const footers: any[] = [];
        columns.forEach((column: any, columnIndex: number) => {
          if (columnIndex === 0) {
            footers.push('合计');
          } else if (column.field === 'project_type' || column.field === 'project_name') {
            footers.push('--');
          } else {
            if (column.field === 'total_income' || column.field === 'total_expense') {
              const amount = tableData.value
                .reduce((prev, next) => {
                  return prev.add(new Decimal(((next as any)[column.field] ?? 0) / 100));
                }, new Decimal(0))
                .toFixed(2);
              footers.push(formatAmount(amount, 'None'));
            } else if (
              column.field &&
              (column.field.indexOf('-total_income') !== -1 ||
                column.field.indexOf('-total_expense') !== -1)
            ) {
              const month = column.field.split('-')[0];
              const key = column.field.split('-')[1];

              const amount = tableData.value
                .reduce((prev, next) => {
                  const finder = next.data?.find(rowEl => `${rowEl.record_month}` === month);
                  const amount = (finder as any)?.[key] ?? 0;
                  return prev.add(new Decimal(amount / 100));
                }, new Decimal(0))
                .toFixed(2);
              footers.push(formatAmount(amount, 'None'));
            } else {
              footers.push('--');
            }
          }
        });
        return [footers];
      },
      formatAmount,
    };

    const colGroups = computed(() => {
      const groups = ['合计'];
      for (let i = 1; i <= 12; i++) {
        groups.push(`${i}月`);
      }
      return groups.map((el, elIdx) => {
        const evenNumber = elIdx % 2 === 0;
        return {
          title: el,
          headerClassName: `department-fund-statement-group-head-${evenNumber ? 'even' : 'odd'}`,
          align: 'center',
          subColumns: [
            {
              label: '收入 (元)',
              align: 'right',
              headerAlign: 'center',
              width: 130,
              field: elIdx === 0 ? 'total_income' : `${elIdx}-total_income`,
              className: `department-fund-statement-head-${evenNumber ? 'even' : 'odd'}`,
              formatter: ({ row }: { row: DepartmentFundModel }) => {
                let total_income: number | undefined = undefined;
                if (elIdx === 0) {
                  total_income = row.total_income;
                } else {
                  const finder = row.data?.find(rowEl => rowEl.record_month === elIdx);
                  total_income = finder?.total_income;
                }
                if (total_income === undefined || total_income === null) {
                  return '';
                }

                return formatAmount(total_income / 100, 'None');
              },
            },
            {
              label: '支出 (元)',
              align: 'right',
              headerAlign: 'center',
              width: 130,
              field: elIdx === 0 ? 'total_expense' : `${elIdx}-total_expense`,
              className: `department-fund-statement-head-${evenNumber ? 'even' : 'odd'}`,
              formatter: ({ row }: { row: DepartmentFundModel }) => {
                let total_expense: number | undefined = undefined;
                if (elIdx === 0) {
                  total_expense = row.total_expense;
                } else {
                  const finder = row.data?.find(rowEl => rowEl.record_month === elIdx);
                  total_expense = finder?.total_expense;
                }
                if (total_expense === undefined || total_expense === null) {
                  return '';
                }
                return formatAmount(total_expense / 100, 'None');
              },
            },
          ],
        };
      });
    });

    onMounted(() => {
      methods.queryDepartmentFund();
    });

    return {
      loading,
      tableData,
      colGroups,
      // queryForm,
      ...methods,
    };
  },
  render() {
    return (
      <div class="tg-finance-department-fund-statement-container">
        <section class="table-field">
          <div style="height: calc(100% - 32px);">
            <vxe-table
              border
              show-footer={(this.tableData ?? []).length > 0}
              highlight-hover-row
              tooltip-config={{
                theme: 'light',
              }}
              show-overflow
              max-height={'100%'}
              v-loading={this.loading}
              data={this.tableData}
              footer-method={this.footerMethod}
            >
              <template slot="empty">
                <empty-common detail-text="暂无数据"></empty-common>
              </template>
              <vxe-column
                width={135}
                title="部门"
                fixed="left"
                show-overflow
                formatter={({ row }: { row: DepartmentFundModel }) => {
                  return row.department_name ? row.department_name : '--';
                }}
              ></vxe-column>
              {this.colGroups.map(group => {
                return (
                  <vxe-colgroup
                    title={group.title}
                    header-class-name={group.headerClassName}
                    align={group.align}
                  >
                    {group.subColumns.map(v => (
                      <vxe-column
                        header-class-name={v.className}
                        title={v.label}
                        field={v.field}
                        align={v.align}
                        headerAlign={v.headerAlign}
                        minWidth={v.width}
                        // fixed={v.fixed}
                        formatter={v.formatter}
                      />
                    ))}
                  </vxe-colgroup>
                );
              })}
            </vxe-table>
          </div>
        </section>
      </div>
    );
  },
});
