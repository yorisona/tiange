import { GetOurBankAccounts, PendingIncomeClaim } from '@/services/finance';
import { PaginationParams } from '@/types/base/pagination';
import { BankAccount, PendingIncomeClaimModel } from '@/types/tiange/finance/finance';
import { TableColumn } from '@/types/vendor/column';
import { wait } from '@/utils/func';
import { formatAmount } from '@/utils/string';
import { defineComponent, ref, h, onMounted } from '@vue/composition-api';
// import Decimal from 'decimal.js';

type Col = TableColumn<PendingIncomeClaimModel>;

interface FormType extends PaginationParams {
  date: string[] | undefined;
  bank_id: number | undefined;
  company_name: string | undefined;
  total: number | undefined;
}

interface PendingClaimStatistics {
  total_income: number;
  unclaimed_amount: number;
}

export default defineComponent({
  name: 'pendingClaimIncome',
  setup(props, ctx) {
    const initQueryForm = () => {
      return {
        page_num: 1,
        num: 20,
        date: [],
        bank_id: undefined,
        company_name: undefined,
        total: 0,
      } as FormType;
    };

    const loading = ref(false);
    const queryForm = ref(initQueryForm());
    const tableData = ref<PendingIncomeClaimModel[]>([]);
    const bankList = ref<BankAccount[]>([]);
    const pendingClaimStatistics = ref<PendingClaimStatistics | undefined>(undefined);

    const methods = {
      onQueryHandler(page = 1) {
        queryForm.value.page_num = page;
        methods.pendingIncomeClaim();
      },
      onResetHandler() {
        queryForm.value = initQueryForm();
        methods.onQueryHandler();
      },
      async pendingIncomeClaim() {
        const { date, total, ...rest } = queryForm.value;
        const [start_date, end_date] = date ?? [];
        loading.value = true;
        const [res] = await wait(
          500,
          PendingIncomeClaim({
            start_date,
            end_date,
            ...rest,
          }),
        );
        loading.value = false;
        if (res.data.success) {
          pendingClaimStatistics.value = (res.data.data as any)?.statistics;
          tableData.value = res.data.data.data ?? [];
          queryForm.value.total = res.data.data.total;
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      async getOurBankAccounts() {
        const res = await GetOurBankAccounts({
          is_show: 1,
        });
        if (res.data.success) {
          bankList.value = res.data.data ?? [];
        }
      },
      getSummary({ columns, _ }: { columns: any; _: any }) {
        return columns.map((el: any, elIdx: number) => {
          if (elIdx === 0) {
            return '合计';
          } else if (el.property === 'income') {
            // const amount = tableData.value
            //   .reduce((prev, next) => {
            //     return prev.add(new Decimal((next.income ?? 0) / 100));
            //   }, new Decimal(0))
            //   .toFixed(2);
            return formatAmount((pendingClaimStatistics.value?.total_income ?? 0) / 100, 'None');
          } else if (el.property === 'unclaimed_amount') {
            return formatAmount(
              (pendingClaimStatistics.value?.unclaimed_amount ?? 0) / 100,
              'None',
            );
          } else {
            return '--';
          }
        });
        // return ['--', '--', '--', '--', '--', '--', '--']
      },
      formatAmount,
    };

    const columns = ref<Col[]>([
      {
        label: '收款日期',
        minWidth: 90,
        align: 'center',
        showOverflowTooltip: true,
        formatter: row => {
          return row.revenue_date ? row.revenue_date.replace(/-/g, '.') : '.';
        },
      },
      {
        label: '摘要',
        minWidth: 120,
        showOverflowTooltip: true,
        formatter: row => {
          return row.summary ? row.summary : '--';
        },
      },
      {
        label: '收款账户',
        minWidth: 120,
        showOverflowTooltip: true,
        formatter: row => {
          return row.bank_name ? row.bank_name : '--';
        },
      },
      {
        label: '打款单位',
        minWidth: 150,
        showOverflowTooltip: true,
        formatter: row => {
          return row.payer ? row.payer : '--';
        },
      },
      {
        label: '打款账号',
        minWidth: 180,
        showOverflowTooltip: true,
        formatter: row => {
          return row.account_number ? row.account_number : '--';
        },
      },
      {
        label: '金额 (元)',
        minWidth: 130,
        property: 'income',
        align: 'right',
        showOverflowTooltip: true,
        formatter: row => {
          return formatAmount((row.income ?? 0) / 100, 'None');
        },
      },
      {
        label: '待认领金额 (元)',
        minWidth: 130,
        property: 'unclaimed_amount',
        align: 'right',
        showOverflowTooltip: true,
        formatter: (row: any) => {
          return formatAmount((row.unclaimed_amount ?? 0) / 100, 'None');
        },
      },
      {
        label: '备注',
        minWidth: 110,
        showOverflowTooltip: true,
        formatter: row => {
          return row.remark ? row.remark : '--';
        },
      },
    ]);

    onMounted(() => {
      methods.getOurBankAccounts();
      methods.onQueryHandler();
    });

    return {
      loading,
      tableData,
      columns,
      queryForm,
      bankList,
      ...methods,
    };
  },
  render() {
    return (
      <div class="tg-finance-pending-claim-income-container">
        <section class="query-field">
          <el-form size="mini" label-width="60px">
            <el-form-item label="收款日期：">
              <el-date-picker
                style="width: 210px;"
                v-model={this.queryForm.date}
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
                editable={false}
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="收款账户：">
              <el-select
                popper-class="el-select-popper-mini"
                style="width: 210px;"
                v-model={this.queryForm.bank_id}
                clearable
                placeholder="请选择收款户名"
              >
                {this.bankList.map(el => {
                  return <el-option label={el.bank_name} value={el.id} key={el.id}></el-option>;
                })}
              </el-select>
            </el-form-item>
            <el-form-item label="打款单位：">
              <el-input
                v-key-enter={this.onQueryHandler}
                style="width: 210px;"
                v-model={this.queryForm.company_name}
                clearable
                placeholder="请输入打款单位"
              ></el-input>
            </el-form-item>
            <el-form-item label="" label-width="0">
              <div>
                <tg-button type="primary" on-click={() => this.onQueryHandler()}>
                  查询
                </tg-button>
                <tg-button class="mgl-8" on-click={() => this.onResetHandler()}>
                  重置
                </tg-button>
              </div>
            </el-form-item>
          </el-form>
        </section>
        <section class="table-field">
          <div style="height: 100%;">
            <el-table
              v-loading={this.loading}
              border
              stripe
              show-summary
              summary-method={this.getSummary}
              height="100%"
              data={this.tableData}
            >
              {this.columns.map((column, index) => (
                <el-table-column props={{ ...column }} key={index}></el-table-column>
              ))}
              <template slot="empty">
                <empty-common detail-text="暂无数据"></empty-common>
              </template>
            </el-table>
          </div>
        </section>
        {this.tableData.length > 0 && (
          <section class="pagination-field">
            <el-pagination
              current-page={this.queryForm.page_num}
              page-sizes={[20, 30, 50, 100]}
              pageSize={this.queryForm.num}
              total={this.queryForm.total}
              oncurrent-change={(page_num: number) => {
                this.queryForm.page_num = page_num;
                this.onQueryHandler(page_num);
              }}
              onsize-change={(num: number) => {
                this.queryForm.num = num;
                // this.queryForm.page_num = 1;
                this.onQueryHandler();
              }}
              layout="total, prev, pager, next, sizes, jumper"
            />
          </section>
        )}
      </div>
    );
  },
});
