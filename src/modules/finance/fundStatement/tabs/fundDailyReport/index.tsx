import { PaginationParams } from '@/types/base/pagination';
import { TableColumn } from '@/types/vendor/column';
import { formatAmount } from '@/utils/string';
import { defineComponent, ref, h, onMounted } from '@vue/composition-api';
import { GetFeishuDepartmentList } from '@/services/live';
// import { departmentFilterDisabled } from '@/utils/filter';
import { FeiShuDepartment } from '@/types/tiange/live';
import { wait } from '@/utils/func';
import { CapitalDailyReport, GetOurBankAccounts } from '@/services/finance';
import { BankAccount, CapitalDailyReportModel, FlowType } from '@/types/tiange/finance/finance';
import { MaycurListExpenseCategories } from '@/services/maycur';
import { SpendingCategory } from '@/types/tiange/spendingCategory';
// import Decimal from 'decimal.js';
import { selectControlPopoverHide } from '@/utils/tree-other';

type Col = TableColumn<CapitalDailyReportModel>;

// enum Kind {
//   income = 1,
//   cost = -1,
// }

interface DaylyReportStatistics {
  expend: number;
  income: number;
}

interface TempType extends PaginationParams {
  date: string[] | undefined;
  bank_id: number | undefined;
  kind: FlowType | undefined;
  company_name: string | undefined;
  department_id: number | undefined;
  department_name: string | undefined;
  project_name: string | undefined;
  account_subject_id: number | undefined;
  total: number | undefined;
}

export default defineComponent({
  name: 'fundDailyReport',
  setup(props, ctx) {
    const initQueryForm = () => {
      return {
        page_num: 1,
        num: 20,
        date: [],
        bank_id: undefined,
        kind: undefined,
        company_name: undefined,
        department_id: undefined,
        department_name: undefined,
        project_name: undefined,
        account_subject_id: undefined,
        total: 0,
      } as TempType;
    };

    const loading = ref(false);

    const queryForm = ref(initQueryForm());
    const tableData = ref<CapitalDailyReportModel[]>([]);
    const feishuDepartmentList = ref<FeiShuDepartment[]>([]);
    const department_tree = ref<{ setCheckedKeys: (ids: number[]) => void } | undefined>(undefined);
    const bankList = ref<BankAccount[]>([]);
    const categoryList = ref<SpendingCategory[]>([]);
    const daylyReportStatistics = ref<DaylyReportStatistics | undefined>(undefined);

    const methods = {
      async getOurBankAccounts() {
        const res = await GetOurBankAccounts({
          is_show: 1,
        });
        if (res.data.success) {
          bankList.value = res.data.data ?? [];
        }
      },
      async maycurListExpenseCategories() {
        const res = await MaycurListExpenseCategories({
          num: 1000,
          page_num: 1,
        });
        if (res.data.success) {
          categoryList.value = (res.data.data as any)?.data ?? [];
        }
      },
      async capitalDailyReport() {
        const { date, department_name, total, ...rest } = queryForm.value;
        const [start_date, end_date] = date ?? [];
        loading.value = true;
        const [res] = await wait(
          500,
          CapitalDailyReport({
            start_date,
            end_date,
            ...rest,
          }),
        );
        loading.value = false;
        if (res.data.success) {
          daylyReportStatistics.value = (res.data.data as any).statistics;
          queryForm.value.total = res.data.data.total;
          tableData.value = res.data.data.data ?? [];
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      onQueryHandler(page = 1) {
        queryForm.value.page_num = page;
        methods.capitalDailyReport();
      },
      onResetHandler() {
        queryForm.value = initQueryForm();
        department_tree.value?.setCheckedKeys([]);
        methods.onQueryHandler();
      },
      getDPRuningDepartment(arr: FeiShuDepartment[]): FeiShuDepartment | undefined {
        for (let i = 0; i < arr?.length ?? 0; i++) {
          const dp = arr[i];
          if (dp.name === '品牌运营部') {
            return dp;
          } else {
            const finder = methods.getDPRuningDepartment(dp.sons);
            if (finder) {
              return finder;
            }
          }
        }
        return undefined;
      },
      async getFeishuDepartmentList(_ = false) {
        const res = await GetFeishuDepartmentList({
          // root_department_name: '品牌',
        });
        if (res.data.success) {
          const list = res.data.data.data;
          // departmentFilterDisabled(list, true, 3);
          feishuDepartmentList.value = list;
          // if (isMounted) {
          //   const finder = methods.getDPRuningDepartment(feishuDepartmentList.value);
          //   queryForm.value.department_id = finder?.id;
          //   queryForm.value.department_name = finder?.name;
          //   if (queryForm.value.department_id) {
          //     department_tree.value?.setCheckedKeys([queryForm.value.department_id]);
          //   }
          // }
        } else {
          ctx.root.$message.error(res.data.message ?? '请求失败，请重试');
        }
      },
      ondepartmentCleaar(event: any) {
        department_tree.value?.setCheckedKeys([]);
        queryForm.value.department_id = undefined;
        queryForm.value.department_name = undefined;
        if (event) {
          event.stopPropagation();
        }
      },
      handleCheckChange: (data: FeiShuDepartment) => {
        department_tree.value?.setCheckedKeys([]);
        if (queryForm.value.department_id === data.id) {
          queryForm.value.department_id = undefined;
          queryForm.value.department_name = undefined;
        } else {
          queryForm.value.department_id = data.id;
          queryForm.value.department_name = data.name;
          department_tree.value?.setCheckedKeys([data.id]);
        }
      },
      getSummary({ columns, _ }: { columns: any; _: any }) {
        return columns.map((el: any, elIdx: number) => {
          if (elIdx === 0) {
            return '合计';
          } else if (
            el.property === 'income'
            // || el.property === 'balance'
          ) {
            // const amount = tableData.value
            //   .reduce((prev, next) => {
            //     if (el.property === 'income') {
            //       return prev.add(new Decimal((next.income ?? 0) / 100));
            //     } else if (el.property === 'expenditure') {
            //       return prev.add(new Decimal((next.expenditure ?? 0) / 100));
            //     } else {
            //       return prev.add(new Decimal((next.balance ?? 0) / 100));
            //     }
            //   }, new Decimal(0))
            //   .toFixed(2);
            return formatAmount((daylyReportStatistics.value?.income ?? 0) / 100, 'None');
          } else if (
            el.property === 'expenditure'
            // || el.property === 'balance'
          ) {
            // const amount = tableData.value
            //   .reduce((prev, next) => {
            //     if (el.property === 'income') {
            //       return prev.add(new Decimal((next.income ?? 0) / 100));
            //     } else if (el.property === 'expenditure') {
            //       return prev.add(new Decimal((next.expenditure ?? 0) / 100));
            //     } else {
            //       return prev.add(new Decimal((next.balance ?? 0) / 100));
            //     }
            //   }, new Decimal(0))
            //   .toFixed(2);
            return formatAmount((daylyReportStatistics.value?.expend ?? 0) / 100, 'None');
          } else {
            return '--';
          }
        });
      },
      formatAmount,
    };

    const columns = ref<Col[]>([
      {
        label: '编号',
        minWidth: 108,
        fixed: 'left',
        showOverflowTooltip: true,
        formatter: row => {
          return row.id ? row.id : '--';
        },
      },
      {
        label: '日期',
        minWidth: 150,
        align: 'center',
        showOverflowTooltip: true,
        formatter: row => {
          return row.revenue_date ? row.revenue_date.replace(/-/g, '.') : '--';
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
        label: '账户名称',
        minWidth: 150,
        showOverflowTooltip: true,
        formatter: row => {
          return row.bank_name ? row.bank_name : '--';
        },
      },
      {
        label: '往来单位',
        minWidth: 180,
        showOverflowTooltip: true,
        formatter: row => {
          return row.company_name ? row.company_name : '--';
        },
      },
      {
        label: '收入 (元)',
        minWidth: 130,
        property: 'income',
        align: 'right',
        showOverflowTooltip: true,
        formatter: row => {
          return methods.formatAmount((row.income ?? 0) / 100, 'None');
        },
      },
      {
        label: '支出 (元)',
        minWidth: 130,
        property: 'expenditure',
        align: 'right',
        showOverflowTooltip: true,
        formatter: row => {
          return methods.formatAmount((row.expenditure ?? 0) / 100, 'None');
        },
      },
      {
        label: '可用余额 (元)',
        minWidth: 130,
        property: 'balance',
        align: 'right',
        showOverflowTooltip: true,
        formatter: row => {
          return methods.formatAmount((row.balance ?? 0) / 100, 'None');
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
      {
        label: '归属部门',
        minWidth: 110,
        showOverflowTooltip: true,
        formatter: row => {
          return row.department_name ? row.department_name : '--';
        },
      },
      {
        label: '关联项目',
        minWidth: 110,
        showOverflowTooltip: true,
        formatter: row => {
          return row.project_name ? row.project_name : '--';
        },
      },
      {
        label: '会计科目',
        minWidth: 120,
        showOverflowTooltip: true,
        formatter: row => {
          return row.expense_type_name ? row.expense_type_name : '--';
        },
      },
    ]);

    onMounted(async () => {
      methods.getOurBankAccounts();
      methods.maycurListExpenseCategories();
      methods.getFeishuDepartmentList(false);
      methods.onQueryHandler();
    });

    return {
      loading,
      department_tree,
      feishuDepartmentList,
      bankList,
      categoryList,
      tableData,
      columns,
      queryForm,
      selectControlPopoverHide,
      // daylyReportStatistics,
      ...methods,
    };
  },
  render() {
    const treeProps = {
      label: 'name',
      children: 'sons',
    };
    return (
      <div class="tg-finance-fund-daily-report-container">
        <section class="query-field">
          <el-form size="mini" label-width="60px">
            <el-form-item label="时间周期：">
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
            <el-form-item label="账户名称：">
              <el-select
                popper-class="el-select-popper-mini"
                style="width: 210px;"
                v-model={this.queryForm.bank_id}
                clearable
                placeholder="请选择账户名称"
                on-focus={this.selectControlPopoverHide}
              >
                {this.bankList.map(el => {
                  return <el-option label={el.bank_name} value={el.id} key={el.id}></el-option>;
                })}
              </el-select>
            </el-form-item>
            <el-form-item label="往来单位：">
              <el-input
                style="width: 210px;"
                v-model={this.queryForm.company_name}
                clearable
                placeholder="请输入往来单位"
                v-key-enter={this.onQueryHandler}
              ></el-input>
            </el-form-item>
            <el-form-item label="数据类型：">
              <el-select
                popper-class="el-select-popper-mini"
                style="width: 210px;"
                v-model={this.queryForm.kind}
                clearable
                placeholder="请选择数据类型"
                on-focus={this.selectControlPopoverHide}
              >
                <el-option label="全部" value={undefined} key={undefined}></el-option>
                <el-option label="收入" value={FlowType.income} key={FlowType.income}></el-option>
                <el-option label="支出" value={FlowType.cost} key={FlowType.cost}></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="归属部门：">
              {/* <el-select style="width: 210px;" v-model={this.queryForm.department_id}>
                <el-option label="1" value="1" key="1"></el-option>
              </el-select> */}
              <div style="display: flex; align-items: center;">
                <el-popover
                  placement="bottom-start"
                  trigger="click"
                  width="370"
                  popper-class="fund-daily-report-tree-popper el-tree-popper-mini"
                >
                  <div
                    slot="reference"
                    class="department-tree-select"
                    style="display: block; cursor: pointer;"
                  >
                    {this.queryForm.department_name && (
                      <div class="depart-select-box">
                        <span style="height: 28px; line-height: 28px;">
                          {this.queryForm.department_name}
                        </span>
                        <i
                          style="margin-top: 7px; color: white; font-size: var(--small-font-size)"
                          class="el-icon-circle-close"
                          onClick={this.ondepartmentCleaar}
                        ></i>
                      </div>
                    )}
                    {!this.queryForm.department_name && (
                      <div class="depart-select-box">
                        <span style="color: var(--disabled-color); height: 28px; line-height: 27px;">
                          请选择所属部门
                        </span>
                        <i
                          style="margin-top: 7px; color: var(--disabled-color);font-size: var(--small-font-size)"
                          class="el-icon-arrow-down"
                        ></i>
                      </div>
                    )}
                  </div>
                  <div class="department-tree">
                    <el-tree
                      ref="department_tree"
                      props={{
                        props: treeProps,
                      }}
                      check-strictly={true}
                      node-key="id"
                      data={this.feishuDepartmentList}
                      show-checkbox
                      check-on-click-node
                      // default-expand-all
                      // default-checked-keys="default_checked_department_ids"
                      default-expanded-keys={
                        this.queryForm.department_id ? [this.queryForm.department_id] : []
                      }
                      on-check={this.handleCheckChange}
                    ></el-tree>
                  </div>
                </el-popover>
              </div>
              <li style="display: none" class="controlPopoverHide"></li>
            </el-form-item>
            <el-form-item label="关联项目：">
              <el-input
                style="width: 210px;"
                v-model={this.queryForm.project_name}
                clearable
                placeholder="请输入关联项目"
                v-key-enter={this.onQueryHandler}
              ></el-input>
            </el-form-item>
            <el-form-item label="会计科目：">
              <el-select
                popper-class="el-select-popper-mini"
                style="width: 210px;"
                v-model={this.queryForm.account_subject_id}
                clearable
                filterable
                placeholder="请选择会计科目"
                on-focus={this.selectControlPopoverHide}
              >
                {this.categoryList.map(el => {
                  return (
                    <el-option
                      label={el.expense_category_name}
                      value={el.expense_category_code}
                      key={el.expense_category_code}
                    ></el-option>
                  );
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
              </div>
            </el-form-item>
          </el-form>
        </section>
        <section class="table-field">
          <div style="height: 100%;">
            <el-table
              border
              stripe
              v-loading={this.loading}
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
