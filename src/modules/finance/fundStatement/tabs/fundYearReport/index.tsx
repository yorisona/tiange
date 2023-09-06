import { CapitalYearReport } from '@/services/finance';
import { CapitalYearReportModel } from '@/types/tiange/finance/finance';
import { wait } from '@/utils/func';
import { formatAmount } from '@/utils/string';
import { defineComponent, ref, h, computed, onMounted } from '@vue/composition-api';
import Decimal from 'decimal.js';

export default defineComponent({
  name: 'fundYearReport',
  setup(props, ctx) {
    const loading = ref(false);

    const tableData = ref<CapitalYearReportModel | undefined>(undefined);
    const tableRowData = computed(() => {
      if (!tableData.value?.data.length) {
        return [];
      }
      const rows: {
        month: number;
        title: string;
      }[] = [];
      for (let i = 1; i <= 12; i++) {
        rows.push({
          title: `${i}月`,
          month: i,
        });
      }
      return rows;
    });

    const methods = {
      async capitalYearReport() {
        loading.value = true;
        const [res] = await wait(500, CapitalYearReport());
        loading.value = false;
        if (res.data.success) {
          tableData.value = res.data.data;
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      footerMethod({ columns }: { columns: any }) {
        const footers: any[] = [];
        columns.forEach((column: any, columnIndex: number) => {
          if (columnIndex === 0) {
            footers.push('合计');
          } else if (columnIndex === 1) {
            // const amount =
            //   tableData.value?.balance_data
            //     .reduce((prev, next) => {
            //       return prev.add(new Decimal((next.balance ?? 0) / 100));
            //     }, new Decimal(0))
            //     .toFixed(2) ?? '0';
            // footers.push(formatAmount(amount, 'None'));
            footers.push('--');
          } else {
            if (
              // column.field === 'open_balance' ||
              column.field === 'income' ||
              column.field === 'expenditure'
              // || column.field === 'balance'
            ) {
              const key = column.field;
              const dataIndex = Math.floor((columnIndex - 2) / 4);
              const amount = tableData.value?.data[dataIndex].data
                .reduce((prev, next) => {
                  return prev.add(new Decimal(((next as any)[key] ?? 0) / 100));
                }, new Decimal(0))
                .toFixed(2);
              footers.push(formatAmount(amount ?? '0', 'None'));
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
      const groups = [];
      for (let i = 1; i <= 12; i++) {
        groups.push(`${i}月`);
      }
      return (
        tableData.value?.data.map((el, elIdx) => {
          const evenNumber = elIdx % 2 === 0;
          return {
            title: el.bank_name,
            headerClassName: `department-fund-statement-group-head-${evenNumber ? 'even' : 'odd'}`,
            align: 'center',
            subColumns: [
              {
                label: '期初数 (元)',
                align: 'right',
                headerAlign: 'center',
                width: 130,
                field: 'open_balance',
                className: `department-fund-statement-head-${evenNumber ? 'even' : 'odd'}`,
                formatter: ({ row }: { row: any }) => {
                  const month = row.month as number;
                  const finder = el.data.find(dataEl => dataEl.month === month);
                  return finder?.open_balance !== undefined && finder?.open_balance !== null
                    ? formatAmount((finder?.open_balance ?? 0) / 100, 'None')
                    : '';
                },
              },
              {
                label: '收入 (元)',
                align: 'right',
                headerAlign: 'center',
                width: 130,
                field: 'income',
                className: `department-fund-statement-head-${evenNumber ? 'even' : 'odd'}`,
                formatter: ({ row }: { row: any }) => {
                  const month = row.month as number;
                  const finder = el.data.find(dataEl => dataEl.month === month);
                  return finder?.income !== undefined && finder?.income !== null
                    ? formatAmount((finder?.income ?? 0) / 100, 'None')
                    : '';
                },
              },
              {
                label: '支出 (元)',
                align: 'right',
                headerAlign: 'center',
                width: 130,
                field: 'expenditure',
                className: `department-fund-statement-head-${evenNumber ? 'even' : 'odd'}`,
                formatter: ({ row }: { row: any }) => {
                  const month = row.month as number;
                  const finder = el.data.find(dataEl => dataEl.month === month);
                  return finder?.expenditure !== undefined && finder?.expenditure !== null
                    ? formatAmount((finder?.expenditure ?? 0) / 100, 'None')
                    : '';
                },
              },
              {
                label: '余额 (元)',
                align: 'right',
                headerAlign: 'center',
                width: 130,
                field: 'balance',
                className: `department-fund-statement-head-${evenNumber ? 'even' : 'odd'}`,
                formatter: ({ row }: { row: any }) => {
                  const month = row.month as number;
                  const finder = el.data.find(dataEl => dataEl.month === month);
                  return finder?.balance !== undefined && finder?.balance !== null
                    ? formatAmount((finder?.balance ?? 0) / 100, 'None')
                    : '';
                },
              },
            ],
          };
        }) ?? []
      );
    });

    const balanceCol = computed(() => {
      if (tableData.value) {
        return {
          label: '余额 (元)',
          align: 'right',
          headerAlign: 'center',
          width: 130,
          formatter: ({ row }: { row: any }) => {
            const month = row.month as number;
            const finder = tableData.value?.balance_data.find(el => el.month === month);
            return finder?.balance !== undefined && finder?.balance !== null
              ? methods.formatAmount((finder?.balance ?? 0) / 100, 'None')
              : '';
          },
        };
      }
      return undefined;
    });

    onMounted(() => {
      methods.capitalYearReport();
    });

    return {
      loading,
      tableData,
      tableRowData,
      balanceCol,
      colGroups,
      // queryForm,
      ...methods,
    };
  },
  render() {
    return (
      <div class="tg-finance-fund-year-report-container">
        <section class="table-field">
          <div style="height: 100%; max-height: 478px;">
            <vxe-table
              border
              show-footer={(this.tableRowData ?? []).length > 0}
              highlight-hover-row
              tooltip-config={{
                theme: 'light',
              }}
              show-overflow
              height={'100%'}
              // max-height="478px"
              v-loading={this.loading}
              data={this.tableRowData}
              footer-method={this.footerMethod}
              // footer-method={() => ['合计', '2', '44', '67', '-', '2', '44', '67', '-', '2', '44', '67', '-', '2', '44', '67', '-', '2', '44', '67', '-', '2', '44', '67', '-', '2', '1']}
            >
              <template slot="empty">
                <empty-common detail-text="暂无数据"></empty-common>
              </template>
              {(this.tableRowData ?? []).length > 0 && (
                <vxe-column
                  width={60}
                  title="月份"
                  align="center"
                  fixed="left"
                  show-overflow
                  formatter={({ row }: { row: any }) => {
                    return row.title;
                  }}
                ></vxe-column>
              )}
              {this.balanceCol ? (
                <vxe-column
                  fixed="left"
                  width={this.balanceCol.width}
                  title={this.balanceCol.label}
                  align={this.balanceCol.align}
                  headerAlign={this.balanceCol.headerAlign}
                  show-overflow
                  formatter={this.balanceCol.formatter}
                ></vxe-column>
              ) : (
                ''
              )}
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
