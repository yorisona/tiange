import { PaginationParams } from '@/types/base/pagination';
import { TableColumn } from '@/types/vendor/column';
import { formatAmount } from '@/utils/string';
import { defineComponent, ref, onMounted, computed } from '@vue/composition-api';
import { GetFeishuDepartmentList } from '@/services/live';
import { FeiShuDepartment } from '@/types/tiange/live';
import { wait } from '@/utils/func';
import { QueryUnpaidCost } from '@/services/finance';
import { PayType, PayTypeMap, UnpaidCostModel } from '@/types/tiange/finance/finance';
import { MaycurListExpenseCategories } from '@/services/maycur';
import { SpendingCategory } from '@/types/tiange/spendingCategory';
import { selectControlPopoverHide } from '@/utils/tree-other';
// import Decimal from 'decimal.js';
// import { departmentFilterDisabled } from '@/utils/filter';

type Col = TableColumn<UnpaidCostModel>;

interface TempType extends PaginationParams {
  date: string[] | undefined;
  add_by: string | undefined;
  department_id: number | undefined;
  department_name: string | undefined;
  bank_name: string | undefined;
  pay_type: number | undefined;
  project_name: string | undefined;
  expense_category_code: number | undefined;
  total: number | undefined;
}

interface PendingPayStatistics {
  total_amount: number;
}

export default defineComponent({
  name: 'pendingPayDetail',
  setup(props, ctx) {
    const initQueryForm = () => {
      return {
        page_num: 1,
        num: 20,
        date: [],
        add_by: undefined,
        department_id: undefined,
        department_name: undefined,
        bank_name: undefined,
        pay_type: undefined,
        project_name: undefined,
        expense_category_code: undefined,
        total: 0,
      } as TempType;
    };

    const loading = ref(false);
    const queryForm = ref(initQueryForm());
    const tableData = ref<UnpaidCostModel[]>([]);
    const feishuDepartmentList = ref<FeiShuDepartment[]>([]);
    const department_tree = ref<{ setCheckedKeys: (ids: number[]) => void } | undefined>(undefined);
    const categoryList = ref<SpendingCategory[]>([]);
    const pendingPayStatistics = ref<PendingPayStatistics | undefined>(undefined);

    const payTypes = computed(() => {
      const tempList: {
        label: string;
        value: PayType;
      }[] = [];
      PayTypeMap.forEach((val, key) => {
        tempList.push({
          label: val,
          value: key,
        });
      });
      return tempList;
    });

    const methods = {
      onQueryHandler(page = 1) {
        queryForm.value.page_num = page;
        methods.queryUnpaidCost();
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
      async queryUnpaidCost() {
        const { date, total, department_name, ...rest } = queryForm.value;
        const [start_date, end_date] = date ?? [];
        loading.value = true;
        const [res] = await wait(
          500,
          QueryUnpaidCost({
            start_date,
            end_date,
            ...rest,
          }),
        );
        loading.value = false;
        if (res.data.success) {
          queryForm.value.total = res.data.data.total;
          pendingPayStatistics.value = (res.data.data as any)?.statistics;
          tableData.value = res.data.data.data ?? [];
        } else {
          ctx.root.$message.error(res.data.message);
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
      getSummary({ columns, _ }: { columns: any; _: any }) {
        return columns.map((el: any, elIdx: number) => {
          if (elIdx === 0) {
            return '合计';
          } else if (el.property === 'amount') {
            // const amount = tableData.value
            //   .reduce((prev, next) => {
            //     return prev.add(new Decimal((next.amount ?? 0) / 100));
            //   }, new Decimal(0))
            //   .toFixed(2);
            return formatAmount((pendingPayStatistics.value?.total_amount ?? 0) / 100, 'None');
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
          return row.date?.replace(/-/g, '.');
        },
      },
      {
        label: '付款事由',
        minWidth: 90,
        showOverflowTooltip: true,
        formatter: row => {
          return row.reimburse_reason ? row.reimburse_reason : '--';
        },
      },
      {
        label: '申请人',
        minWidth: 100,
        showOverflowTooltip: true,
        formatter: row => {
          return row.reimburse_employee_name ? row.reimburse_employee_name : '--';
        },
      },
      {
        label: '费用归属部门',
        minWidth: 180,
        showOverflowTooltip: true,
        formatter: row => {
          return row.department_name ? row.department_name : '--';
        },
      },
      {
        label: '户名',
        minWidth: 120,
        // align: 'right',
        showOverflowTooltip: true,
        formatter: row => {
          return row.bank_acct_name ? row.bank_acct_name : '--';
          // return methods.formatAmount('35345', 'None');
        },
      },
      {
        label: '账号',
        minWidth: 120,
        // align: 'right',
        showOverflowTooltip: true,
        formatter: row => {
          return row.bank_acct_number ? row.bank_acct_number : '--';
          // return methods.formatAmount('35345', 'None');
        },
      },
      {
        label: '支出类型',
        minWidth: 90,
        align: 'center',
        showOverflowTooltip: true,
        formatter: row => {
          return row.pay_type ? PayTypeMap.get(row.pay_type) : '--';
        },
      },
      {
        label: '金额 (元)',
        minWidth: 120,
        property: 'amount',
        align: 'right',
        showOverflowTooltip: true,
        formatter: row => {
          return methods.formatAmount((row.amount ?? 0) / 100, 'None');
        },
      },
      {
        label: '会计科目',
        minWidth: 120,
        showOverflowTooltip: true,
        formatter: row => {
          return row.expense_category_name ? row.expense_category_name : '--';
        },
      },
      {
        label: '备注',
        minWidth: 120,
        showOverflowTooltip: true,
        formatter: row => {
          return row.remark ? row.remark : '--';
        },
      },
      {
        label: '项目',
        minWidth: 120,
        showOverflowTooltip: true,
        formatter: row => {
          return row.project_name ? row.project_name : '--';
        },
      },
    ]);

    onMounted(async () => {
      methods.getFeishuDepartmentList(false);
      methods.maycurListExpenseCategories();
      methods.onQueryHandler();
    });

    return {
      loading,
      payTypes,
      feishuDepartmentList,
      department_tree,
      categoryList,
      tableData,
      columns,
      queryForm,
      selectControlPopoverHide,
      ...methods,
    };
  },
  render() {
    const treeProps = {
      label: 'name',
      children: 'sons',
    };
    return (
      <div class="tg-finance-pending-pay-detail-container">
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
            <el-form-item label="申请人：">
              <el-input
                style="width: 210px;"
                v-model={this.queryForm.add_by}
                clearable
                placeholder="请输入申请人"
                v-key-enter={this.onQueryHandler}
              ></el-input>
            </el-form-item>
            <el-form-item label="归属部门：">
              <el-popover
                placement="bottom-start"
                trigger="click"
                width="370"
                popper-class="pending-pay-detail-tree-popper el-tree-popper-mini"
              >
                <div
                  slot="reference"
                  class="department-tree-select"
                  style="display: block; cursor: pointer;"
                >
                  {this.queryForm.department_name && (
                    <div class="depart-select-box">
                      <span style="height: var(--default-height); line-height: var(--default-height);">
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
                      <span style="color: var(--disabled-color); height: var(--default-height); line-height: var(--default-height);">
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
              <li style="display: none" class="controlPopoverHide"></li>
            </el-form-item>
            <el-form-item label="收款户名：">
              <el-input
                style="width: 210px;"
                v-model={this.queryForm.bank_name}
                clearable
                placeholder="请输入收款户名"
                v-key-enter={this.onQueryHandler}
              ></el-input>
            </el-form-item>
            <el-form-item label="支出类型：">
              <el-select
                popper-class="el-select-popper-mini"
                style="width: 210px;"
                v-model={this.queryForm.pay_type}
                clearable
                placeholder="请选择支出类型"
                on-focus={this.selectControlPopoverHide}
              >
                {this.payTypes.map(el => (
                  <el-option label={el.label} value={el.value} key={el.value}></el-option>
                ))}
              </el-select>
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
                v-model={this.queryForm.expense_category_code}
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
              show-summary={true}
              v-loading={this.loading}
              border
              stripe
              height="100%"
              data={this.tableData}
              summary-method={this.getSummary}
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
