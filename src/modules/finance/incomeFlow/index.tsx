import { PaginationParams } from '@/types/base/pagination';
import { TableColumn } from '@/types/vendor/column';
import { computed, defineComponent, h, onMounted, ref } from '@vue/composition-api';
import incomeClaim from '@/modules/finance/fundStatement/components/dialog/incomeClaim/index.vue';
import { IncomeClaimType } from '@/modules/finance/fundStatement/components/dialog/incomeClaim/index';
import incomeDetailImport from '@/modules/finance/fundStatement/components/dialog/incomeDetailImport/index.vue';
import { IncomeDetailImportType } from '@/modules/finance/fundStatement/components/dialog/incomeDetailImport/index';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { wait } from '@/utils/func';
import {
  DeleteRevenueFlowDetail,
  GetOurBankAccounts,
  GetRevenueFlowDetail,
  QueryRevenueFlow,
} from '@/services/finance';
import {
  AccountType,
  BankAccount,
  FlowRevenueType,
  FlowRevenueTypeMap,
  FlowStatus,
  FlowStatusMap,
  RevenueFlowModel,
} from '@/types/tiange/finance/finance';
import { formatAmount } from '@/utils/string';
import { usePermission } from '@/use/permission';
import moment from 'moment/moment';
import WriteOff from '@/modules/finance/incomeFlow/dialog/WriteOff/index.vue';

interface QueryForm extends PaginationParams {
  date: string[] | undefined;
  bank_id: number | undefined;
  payer: string | undefined;
  total: number;
  status?: FlowStatus;
  revenue_type?: FlowRevenueType;
}

type Col = TableColumn<RevenueFlowModel>;

export default defineComponent({
  components: {
    incomeClaim,
    incomeDetailImport,
  },
  setup(props, ctx) {
    const initQueryForm = (): QueryForm => {
      return {
        num: 20,
        page_num: 1,
        total: 0,
        date: undefined,
        payer: undefined,
        bank_id: undefined,
        status: undefined,
        revenue_type: undefined,
      };
    };

    const loading = ref(false);
    const deleteLoading = ref(false);
    const incomeClaimRef = ref<IncomeClaimType | undefined>(undefined);
    const incomeDetailImportRef = ref<IncomeDetailImportType | undefined>(undefined);
    const queryForm = ref<QueryForm>(initQueryForm());
    const tableData = ref<RevenueFlowModel[]>([]);
    const statisticsData = ref<any>();
    const accountList = ref<BankAccount[]>([]);

    const revenueTypeList = computed(() => {
      const tempList: {
        label: string;
        value: FlowRevenueType;
      }[] = [];
      FlowRevenueTypeMap.forEach((val, key) => {
        tempList.push({
          label: val,
          value: key,
        });
      });
      return tempList;
    });

    const permission = usePermission();

    const methods = {
      async onQuery(page = 1) {
        queryForm.value.page_num = page;
        const { date, total, ...rest } = queryForm.value;
        const [revenue_start_date, revenue_end_date] = date ?? [];
        loading.value = true;
        // console.log(page);
        const [res] = await wait(
          500,
          QueryRevenueFlow({
            revenue_start_date,
            revenue_end_date,
            ...rest,
          }),
        );
        loading.value = false;
        if (res.data.success) {
          queryForm.value.total = res.data.data.total;
          tableData.value = res.data.data.data;
          statisticsData.value = (res.data.data as any).statistics;
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      async getRevenueFlowDetail(row: RevenueFlowModel) {
        const res = await GetRevenueFlowDetail(row.id);
        if (res.data.success) {
          const flowData = res.data.data;
          if (flowData.achievement_uid && flowData.status === FlowStatus.claimed) {
            await AsyncConfirm(ctx, {
              title: '提醒',
              // content: `当前收入明细已核销收入结算单，请先冲销对应实收记录。结算单号：${flowData.achievement_uid}`,
              content: () => {
                return h(
                  'div',
                  {
                    style: 'text-align: left; margin-right: -10px; margin-left: -10px;',
                  },
                  [
                    h('div', '当前收入明细已核销收入结算单，请先冲销对应实收记录。'),
                    h('div', { style: 'margin-top: 6px;' }, [
                      h('span', `收款编号：`),
                      h(
                        'span',
                        {
                          style: 'color: var(--text-color);',
                        },
                        `${flowData.achievement_uid}`,
                      ),
                    ]),
                  ],
                );
              },
              cancelText: undefined,
              confirmText: '关闭',
            });
          } else {
            incomeClaimRef.value?.show(row);
          }
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      async getOurBankAccounts() {
        const res = await GetOurBankAccounts({
          is_show: 1,
        });
        if (res.data.success) {
          accountList.value = res.data.data;
        }
      },
      async deleteRevenueFlowDetail(id: number) {
        deleteLoading.value = true;
        const res = await DeleteRevenueFlowDetail(id);
        deleteLoading.value = false;
        if (res.data.success) {
          ctx.root.$message.success(res.data.message);
          methods.onQuery();
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      onRest() {
        queryForm.value = initQueryForm();
        methods.onQuery();
      },
      onImport() {
        incomeDetailImportRef.value?.show();
      },
      onClaimHandler() {},
      async onModifyHandler(row: RevenueFlowModel) {
        methods.getRevenueFlowDetail(row);
      },
      async onDeleteHandler(id: number) {
        // 确认要删除这条结算吗？
        const res = await AsyncConfirm(ctx, {
          title: '确认要删除这条收入流水吗？',
          confirmText: '确认',
        });
        if (res) {
          methods.deleteRevenueFlowDetail(id);
        }
      },
      summaryMethod({ columns }: any) {
        return columns.map((el: any, index: any) => {
          if (!index) return '合计';
          if (['income', 'claimed_amount'].includes(el.property)) {
            const amount = statisticsData.value?.[el.property];
            if (amount === null || amount === undefined || amount === '') return '--';
            return formatAmount(+amount / 100, 'None');
          }
          return '';
        });
      },
    };

    const columns = ref<Col[]>([
      {
        label: '收款日期',
        minWidth: 90,
        align: 'center',
        showOverflowTooltip: true,
        formatter: row => {
          return row.revenue_date ? row.revenue_date.replace(/-/g, '.') : '--';
        },
      },
      {
        label: '摘要',
        minWidth: 90,
        showOverflowTooltip: true,
        formatter: row => {
          return row.summary ? row.summary : '--';
        },
      },
      {
        label: '收款账户',
        minWidth: 90,
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
        minWidth: 200,
        showOverflowTooltip: true,
        formatter: row => {
          return row.payment_account ? row.payment_account : '--';
        },
      },
      {
        label: '金额 (元)',
        minWidth: 120,
        property: 'income',
        align: 'right',
        formatter: row => {
          return formatAmount((row.income ?? 0) / 100, 'None');
        },
      },
      {
        label: '已认领金额 (元)',
        minWidth: 120,
        property: 'claimed_amount',
        align: 'right',
        formatter: row => {
          const projects = [] as { business_type: number; project_id: number }[];
          const arrived_amount_data = (row.claimed_record || []).map((item: any) => {
            projects.push({
              business_type: item.business_type,
              project_id: item.project_id,
            });
            return [
              item.project_name,
              item.uid,
              formatAmount(item.amount / 100, 'None') || '--',
              item.add_by_name + ' / ' + moment(item.gmt_create).format('YYYY.MM.DD'),
            ];
          });
          const write_off_header = ['项目名称', '编号(结算/预收)', '认领金额 (元)', '花名/日期'];
          return row.claimed_amount
            ? h(WriteOff, {
                attrs: {
                  write_off_header,
                  write_off_infos: arrived_amount_data,
                  btnTitle: formatAmount(row.claimed_amount / 100, 'None') || '--',
                  projects: projects,
                },
              })
            : '0';
        },
      },
      {
        label: '备注',
        minWidth: 90,
        showOverflowTooltip: true,
        formatter: row => {
          return row.remark ? row.remark : '--';
        },
      },
      {
        label: '认领状态',
        width: 90,
        align: 'center',
        formatter: row => {
          return FlowStatusMap.get(row.status) ?? '--';
        },
      },
      {
        label: '流水号',
        minWidth: 200,
        showOverflowTooltip: true,
        formatter: row => {
          return row.serial_num ? row.serial_num : '--';
        },
      },
      {
        label: '收入类型',
        minWidth: 110,
        align: 'left',
        formatter: row => {
          return row.revenue_type_display ? row.revenue_type_display : '';
        },
      },
      {
        label: '操作',
        width: 88,
        align: 'left',
        formatter: row => {
          const btns = [];
          if (
            row.status === FlowStatus.watigingClaim &&
            row.revenue_type !== FlowRevenueType.financialIncome &&
            row.revenue_type !== FlowRevenueType.vTaskIncome &&
            row.revenue_type !== FlowRevenueType.yulibaoRedemption
          ) {
            btns.push(
              h(
                'tg-button',
                {
                  props: { type: 'link' },
                  on: {
                    click: () => incomeClaimRef.value?.show(row),
                  },
                },
                ['认领'],
              ),
            );
          }
          if (
            row.status === FlowStatus.claimed &&
            row.revenue_type !== FlowRevenueType.financialIncome &&
            row.revenue_type !== FlowRevenueType.vTaskIncome &&
            row.revenue_type !== FlowRevenueType.yulibaoRedemption
          ) {
            // 收入被认领且与结算单核销后不允许修改，点击【修改】时进行弹窗提示：
            btns.push(
              h(
                'tg-button',
                {
                  props: { type: 'link' },
                  on: {
                    click: () => {
                      methods.onModifyHandler(row);
                      // incomeClaimRef.value?.show(row),
                    },
                  },
                },
                ['修改'],
              ),
            );
          }
          // 待认领状态下的流水，才显示【删除】按钮, 支付宝流水不允许删除
          if (row.status === FlowStatus.watigingClaim && row.account_type !== AccountType.zfb) {
            btns.push(
              h(
                'tg-button',
                {
                  props: { type: 'link' },
                  on: {
                    click: () => methods.onDeleteHandler(row.id),
                  },
                },
                ['删除'],
              ),
            );
          }
          return h('div', { class: 'operator' }, btns);
        },
      },
    ]);

    onMounted(() => {
      methods.getOurBankAccounts();
      methods.onQuery();
    });

    return {
      loading,
      deleteLoading,
      incomeClaimRef,
      incomeDetailImportRef,
      queryForm,
      tableData,
      columns,
      accountList,
      revenueTypeList,
      permission,
      ...methods,
    };
  },
  render() {
    return (
      <div class="tg-finance-income-detail-container">
        <section class="query-field">
          <el-form size="mini" label-width="60px">
            <el-form-item label="收款日期：">
              <el-date-picker
                editable={false}
                v-model={this.queryForm.date}
                type="daterange"
                format="yyyy.MM.dd"
                range-separator="~"
                style="width: 220px;"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="收款账户：">
              <el-select
                popper-class="el-select-popper-mini"
                clearable
                v-model={this.queryForm.bank_id}
                placeholder="请选择收款账户"
                style="width: 220px;"
              >
                {this.accountList.map(el => (
                  <el-option key={el.id} label={el.bank_name} value={el.id}></el-option>
                ))}
              </el-select>
            </el-form-item>
            <el-form-item label="打款单位：">
              <el-input
                clearable
                style="width: 220px;"
                v-model={this.queryForm.payer}
                placeholder="请输入打款单位"
                v-key-enter={this.onQuery}
              ></el-input>
            </el-form-item>
            <el-form-item label="认领状态：">
              <el-select
                popper-class="el-select-popper-mini"
                clearable
                v-model={this.queryForm.status}
                placeholder="请选择认领状态"
                style="width: 220px;"
              >
                {/* {this.accountList.map(el => ( */}
                <el-option
                  key={FlowStatus.watigingClaim}
                  label={FlowStatusMap.get(FlowStatus.watigingClaim)}
                  value={FlowStatus.watigingClaim}
                ></el-option>
                <el-option
                  key={FlowStatus.claimed}
                  label={FlowStatusMap.get(FlowStatus.claimed)}
                  value={FlowStatus.claimed}
                ></el-option>
                <el-option
                  key={FlowStatus.partClaimed}
                  label={FlowStatusMap.get(FlowStatus.partClaimed)}
                  value={FlowStatus.partClaimed}
                ></el-option>
                {/* ))} */}
              </el-select>
            </el-form-item>
            <el-form-item label="收入类型：">
              <el-select
                popper-class="el-select-popper-mini"
                clearable
                v-model={this.queryForm.revenue_type}
                placeholder="请选择收入类型"
                style="width: 220px;"
              >
                {this.revenueTypeList.map(el => (
                  <el-option key={el.value} label={el.label} value={el.value}></el-option>
                ))}
              </el-select>
            </el-form-item>
            <el-form-item label="" label-width="0">
              <tg-button type="primary" on-click={() => this.onQuery()}>
                查询
              </tg-button>
              <tg-button class="mgl-8" on-click={() => this.onRest()}>
                重置
              </tg-button>
              {this.permission.income_flow_import ? (
                <tg-button class="mgl-8" on-click={this.onImport}>
                  导入
                </tg-button>
              ) : (
                ''
              )}
            </el-form-item>
          </el-form>
        </section>
        <section class="table-field">
          <div style="height: 100%;">
            <el-table
              stripe
              show-summary
              v-loading={this.loading}
              border
              height="100%"
              data={this.tableData}
              summary-method={this.summaryMethod}
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
        {(this.tableData ?? []).length > 0 && (
          <section class="pagination-field">
            <el-pagination
              current-page={this.queryForm.page_num}
              page-sizes={[20, 30, 50, 100]}
              pageSize={this.queryForm.num}
              total={this.queryForm.total}
              oncurrent-change={(page_num: number) => {
                this.queryForm.page_num = page_num;
                this.onQuery(page_num);
              }}
              onsize-change={(num: number) => {
                this.queryForm.num = num;
                this.onQuery();
              }}
              layout="total, prev, pager, next, sizes, jumper"
            />
          </section>
        )}
        <incomeClaim ref="incomeClaimRef" on-save={() => this.onQuery()}></incomeClaim>
        <incomeDetailImport
          ref="incomeDetailImportRef"
          on-save={() => this.onQuery()}
        ></incomeDetailImport>
        <tg-mask-loading visible={this.deleteLoading} content="正在删除，请稍候..." />
      </div>
    );
  },
});
