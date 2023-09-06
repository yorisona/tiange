import { PaginationParams } from '@/types/base/pagination';
import { TableColumn } from '@/types/vendor/column';
import { formatAmount } from '@/utils/string';
import { defineComponent, ref, h, onMounted } from '@vue/composition-api';
import standingBookRegister from '@/modules/finance/fundStatement/components/dialog/standingBookRegister/index.vue';
import { StandingBookRegisterType } from '@/modules/finance/fundStatement/components/dialog/standingBookRegister/index';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { wait } from '@/utils/func';
import { DeleteFinancial, GetOurBankAccounts, QueryFinancialLedger } from '@/services/finance';
import { BankAccount, FinancialLedgerModel } from '@/types/tiange/finance/finance';
// import Decimal from 'decimal.js';
import { usePermission } from '@/use/permission';
type Col = TableColumn<FinancialLedgerModel>;

interface TempType extends PaginationParams {
  date: string[] | undefined;
  bank_id: number | undefined;
  total: number | undefined;
}

interface FinancialStatistics {
  buy_in_amount: number;
  profit: number;
  redeem_amount: number;
}

export default defineComponent({
  name: 'financialStandingBook',
  components: {
    standingBookRegister,
  },
  setup(props, ctx) {
    const initQueryForm = () => {
      return {
        page_num: 1,
        num: 20,
        date: [],
        bank_id: undefined,
        total: 0,
      } as TempType;
    };

    const loading = ref(false);
    const deleteLoading = ref(false);
    const queryForm = ref(initQueryForm());
    const tableData = ref<FinancialLedgerModel[]>([]);
    const bankList = ref<BankAccount[]>([]);
    const standingBookRegisterRef = ref<StandingBookRegisterType | undefined>(undefined);
    const financialStatistics = ref<FinancialStatistics | undefined>(undefined);

    const permission = usePermission();

    const methods = {
      onQueryHandler(page = 1) {
        queryForm.value.page_num = page;
        methods.queryFinancialLedger();
      },
      onResetHandler() {
        queryForm.value = initQueryForm();
        methods.onQueryHandler();
      },
      onRegisterHandler() {
        standingBookRegisterRef.value?.show();
      },
      async onDeleteHandler(row: FinancialLedgerModel) {
        // 确认要删除这条结算吗？
        const res = await AsyncConfirm(ctx, {
          title: '确认要删除这条理财记录吗？',
          confirmText: '确认',
        });
        if (res) {
          methods.deleteFinancial(row.id);
        }
      },
      async deleteFinancial(id: number | undefined) {
        deleteLoading.value = true;
        const res = await DeleteFinancial(id);
        deleteLoading.value = false;
        if (res.data.success) {
          ctx.root.$message.success(res.data.message);
          methods.onQueryHandler();
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      async queryFinancialLedger() {
        const { date, total, ...rest } = queryForm.value;
        const [start_date, end_date] = date ?? [];
        loading.value = true;
        const [res] = await wait(
          500,
          QueryFinancialLedger({
            start_date,
            end_date,
            ...rest,
          }),
        );
        loading.value = false;
        if (res.data.success) {
          queryForm.value.total = res.data.data.total;
          financialStatistics.value = (res.data.data as any).statistics;
          tableData.value = res.data.data.data;
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
          } else if (
            el.property === 'buy_in_amount' ||
            el.property === 'redeem_amount' ||
            el.property === 'profit'
          ) {
            const key = el.property;
            // const amount = tableData.value
            //   .reduce((prev, next) => {
            //     return prev.add(new Decimal(((next as any)[key] ?? 0) / 100));
            //   }, new Decimal(0))
            //   .toFixed(2);
            return formatAmount(((financialStatistics.value as any)?.[key] ?? 0) / 100, 'None');
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
        label: '日期',
        minWidth: 90,
        align: 'center',
        showOverflowTooltip: true,
        formatter: row => {
          return row.record_time ? row.record_time.replace(/-/g, '.') : '--';
        },
      },
      {
        label: '买入金额 (元)',
        minWidth: 130,
        align: 'right',
        property: 'buy_in_amount',
        showOverflowTooltip: true,
        formatter: row => {
          return row.buy_in_amount !== undefined && row.buy_in_amount !== null
            ? formatAmount(row.buy_in_amount / 100, 'None')
            : '';
        },
      },
      {
        label: '赎回金额 (元)',
        minWidth: 130,
        align: 'right',
        property: 'redeem_amount',
        showOverflowTooltip: true,
        formatter: row => {
          return row.redeem_amount !== undefined && row.redeem_amount !== null
            ? formatAmount(row.redeem_amount / 100, 'None')
            : '';
        },
      },
      {
        label: '收益金额 (元)',
        minWidth: 130,
        align: 'right',
        property: 'profit',
        showOverflowTooltip: true,
        formatter: row => {
          return row.profit !== undefined && row.profit !== null
            ? formatAmount(row.profit / 100, 'None')
            : '';
        },
      },
      {
        label: '所属银行',
        minWidth: 90,
        showOverflowTooltip: true,
        formatter: row => {
          return row.bank_name ? row.bank_name : '--';
        },
      },
      {
        label: '产品名称',
        minWidth: 90,
        showOverflowTooltip: true,
        formatter: row => {
          return row.product_name ? row.product_name : '--';
        },
      },
      {
        label: '操作',
        width: 100,
        align: 'center',
        showOverflowTooltip: true,
        formatter: row => {
          return h('div', [
            h(
              'tg-button',
              {
                props: {
                  type: 'link',
                },
                on: {
                  click: () => methods.onDeleteHandler(row),
                },
              },
              ['删除'],
            ),
          ]);
        },
      },
    ]);

    onMounted(() => {
      methods.getOurBankAccounts();
      methods.onQueryHandler();
    });

    return {
      loading,
      deleteLoading,
      standingBookRegisterRef,
      bankList,
      tableData,
      columns,
      queryForm,
      permission,
      ...methods,
    };
  },
  render() {
    return (
      <div class="tg-finance-fund-statement-container">
        <section class="query-field">
          <el-form size="mini" label-width="60px">
            <el-form-item label="买卖日期：">
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
            <el-form-item label="所属银行：">
              <el-select
                popper-class="el-select-popper-mini"
                style="width: 210px;"
                v-model={this.queryForm.bank_id}
                clearable
                placeholder="请选择所属银行"
              >
                {this.bankList.map(el => {
                  return <el-option label={el.bank_name} value={el.id} key={el.id}></el-option>;
                })}
              </el-select>
            </el-form-item>
            <el-form-item label="" label-width="0">
              <div>
                <tg-button type="primary" on-click={() => this.onQueryHandler()}>
                  查询
                </tg-button>
                <tg-button class="mgl-8" on-click={() => this.onResetHandler()}>
                  重置
                </tg-button>
                {this.permission.financal_standing_book_register ? (
                  <tg-button class="mgl-8" on-click={this.onRegisterHandler}>
                    台账登记
                  </tg-button>
                ) : (
                  ''
                )}
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
              show-summary={true}
              height="100%"
              data={this.tableData}
              summary-method={this.getSummary}
            >
              <template slot="empty">
                <empty-common detail-text="暂无数据"></empty-common>
              </template>
              {this.columns.map((column, index) => (
                <el-table-column props={{ ...column }} key={index}></el-table-column>
              ))}
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
                this.onQueryHandler();
              }}
              layout="total, prev, pager, next, sizes, jumper"
            />
          </section>
        )}
        <standingBookRegister
          ref="standingBookRegisterRef"
          on-save={() => this.onQueryHandler()}
        ></standingBookRegister>
        <tg-mask-loading visible={this.deleteLoading} content="正在删除，请稍候..." />
      </div>
    );
  },
});
