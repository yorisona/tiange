import { TableColumn } from '@/types/vendor/column';
import { formatAmount } from '@/utils/string';
import { defineComponent, ref, h, onMounted } from '@vue/composition-api';
// import { wait } from '@/utils/func';
import { selectControlPopoverHide } from '@/utils/tree-other';
import billingPeriodOperate from '@/modules/finance/billingPeriod/dialog/billingPeriodOperate/index.vue';
import { BillingPeriodOperateType } from './dialog/billingPeriodOperate';
import { QueryAccountPeriod } from '@/services/finance';
import { wait } from '@/utils/func';
import { AccountPeriodModel, AccountPeriodParams } from '@/types/tiange/finance/finance';
import moment from 'moment';
import { usePermission } from '@/use/permission';

type AcountPeriodForm = AccountPeriodParams & { total: number };

type Col = TableColumn<AccountPeriodModel>;

export default defineComponent({
  name: 'billingPeriod',
  components: {
    billingPeriodOperate,
  },
  setup(props, ctx) {
    const initQueryForm = () => {
      return {
        page_num: 1,
        num: 20,
        account_month: undefined,
        total: 0,
      } as AcountPeriodForm;
    };
    const permission = usePermission();
    const loading = ref(false);

    const queryForm = ref(initQueryForm());
    const tableData = ref<AccountPeriodModel[]>([]);
    const billingPeriodOperateRef = ref<BillingPeriodOperateType | undefined>(undefined);

    const methods = {
      async queryAccountPeriod() {
        const { total, ...rest } = queryForm.value;
        loading.value = true;
        const [res] = await wait(
          500,
          QueryAccountPeriod({
            ...rest,
          }),
        );
        loading.value = false;
        if (res.data.success) {
          queryForm.value.total = res.data.data.total;
          tableData.value = res.data.data.data ?? [];
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      onQueryHandler(page = 1) {
        queryForm.value.page_num = page;
        methods.queryAccountPeriod();
      },
      onResetHandler() {
        queryForm.value = initQueryForm();
        methods.onQueryHandler();
      },
      formatAmount,
    };

    const columns = ref<Col[]>([
      {
        label: '账期',
        minWidth: 150,
        align: 'center',
        showOverflowTooltip: true,
        formatter: row => {
          return row.period_date_start
            ? moment(row.period_date_start * 1000).format('yyyy年M月')
            : '--';
        },
      },
      {
        label: '操作人',
        minWidth: 120,
        align: 'center',
        showOverflowTooltip: true,
        formatter: row => {
          return row.modified_by_name || '--';
        },
      },
      {
        label: '操作时间',
        minWidth: 150,
        align: 'center',
        showOverflowTooltip: true,
        formatter: row => {
          return row.gmt_modified
            ? moment(row.gmt_modified * 1000).format('yyyy.MM.DD HH:mm:ss')
            : '--';
        },
      },
      {
        label: '账期状态',
        minWidth: 180,
        align: 'center',
        showOverflowTooltip: true,
        formatter: row => {
          return row.status ? '已关闭' : '--';
        },
      },
    ]);

    onMounted(async () => {
      methods.onQueryHandler();
    });

    return {
      loading,
      permission,
      tableData,
      columns,
      queryForm,
      selectControlPopoverHide,
      billingPeriodOperateRef,
      // daylyReportStatistics,
      ...methods,
    };
  },
  render() {
    return (
      <div class="tg-billing-period-container">
        <section class="query-field">
          <el-form size="mini">
            <el-form-item label="账期：" label-width="36px">
              <el-date-picker
                style="width: 210px;"
                v-model={this.queryForm.account_month}
                type="month"
                placeholder="请选择月份"
                format="yyyy.MM"
                value-format="yyyy-MM"
                editable={false}
              ></el-date-picker>
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
        <section class="operator-field">
          {this.permission.modify_account_period ? (
            <div class="operator-items">
              <tg-button
                type="primary"
                on-click={() => {
                  this.billingPeriodOperateRef?.show(
                    this.tableData
                      .filter(el => el.period_date_start)
                      .map(el => el.period_date_start || 0) ?? [],
                  );
                }}
              >
                关闭账期
              </tg-button>
            </div>
          ) : (
            <div class="mgt-16"></div>
          )}
        </section>
        <section class="table-field">
          <div style="height: 100%;">
            <el-table stripe border v-loading={this.loading} height="100%" data={this.tableData}>
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
                this.onQueryHandler();
              }}
              layout="total, prev, pager, next, sizes, jumper"
            />
          </section>
        )}
        <billingPeriodOperate
          ref="billingPeriodOperateRef"
          on-save={() => this.onQueryHandler()}
        ></billingPeriodOperate>
      </div>
    );
  },
});
