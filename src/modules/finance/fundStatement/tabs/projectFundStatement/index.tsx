import { PaginationParams } from '@/types/base/pagination';
import { formatAmount } from '@/utils/string';
import { defineComponent, ref, h, computed, onMounted } from '@vue/composition-api';
import { GetFeishuDepartmentList } from '@/services/live';
import { FeiShuDepartment } from '@/types/tiange/live';
import { wait } from '@/utils/func';
import { QueryProjectFund } from '@/services/finance';
import { BusinessTypeEnum, BusinessTypeOptions } from '@/types/tiange/common';
import { ProjectFundModel } from '@/types/tiange/finance/finance';
// import Decimal from 'decimal.js';
import { selectControlPopoverHide } from '@/utils/tree-other';
// import { departmentFilterDisabled } from '@/utils/filter';

interface FormType extends PaginationParams {
  department_id: number | undefined;
  department_name: string | undefined;
  business_id: number | undefined;
  project_name: string | undefined;
  total: number | undefined;
}

interface ProjectFundStatistics {
  total_income: number;
  total_expense: number;
  month_data: {
    month: number;
    total_income: number;
    total_expense: number;
  }[];
}

export default defineComponent({
  name: 'projectFundStatement',
  setup(props, ctx) {
    const initQueryForm = () => {
      return {
        page_num: 1,
        num: 20,
        business_id: undefined,
        department_id: undefined,
        department_name: undefined,
        project_name: undefined,
        total: 0,
      } as FormType;
    };

    const loading = ref(false);
    const queryForm = ref(initQueryForm());
    const tableData = ref<ProjectFundModel[]>([]);
    const feishuDepartmentList = ref<FeiShuDepartment[]>([]);
    const department_tree = ref<{ setCheckedKeys: (ids: number[]) => void } | undefined>(undefined);

    const projectFundStatistics = ref<ProjectFundStatistics | undefined>(undefined);

    const businessList = computed(() => {
      return [
        {
          label: '全部',
          value: undefined,
        },
        ...BusinessTypeOptions,
      ];
    });

    const methods = {
      onQueryHandler(page = 1) {
        queryForm.value.page_num = page;
        methods.queryProjectFund();
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
      ondepartmentCleaar(event: any) {
        department_tree.value?.setCheckedKeys([]);
        queryForm.value.department_id = undefined;
        queryForm.value.department_name = undefined;
        if (event) {
          event.stopPropagation();
        }
      },
      async queryProjectFund() {
        const { department_name, total, ...rest } = queryForm.value;
        loading.value = true;
        const [res] = await wait(
          500,
          QueryProjectFund({
            ...rest,
          }),
        );
        loading.value = false;
        if (res.data.success) {
          projectFundStatistics.value = (res.data.data as any).statistics;
          tableData.value = res.data.data.data ?? [];
          queryForm.value.total = res.data.data.total;
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      businessTypeStr(businessType: BusinessTypeEnum | undefined) {
        const finder = businessList.value.find(el => el.value === businessType);
        if (finder?.value) {
          return finder.label;
        }
        return '--';
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
              const key = column.field;
              // const amount = tableData.value
              //   .reduce((prev, next) => {
              //     return prev.add(new Decimal(((next as any)[column.field] ?? 0) / 100));
              //   }, new Decimal(0))
              //   .toFixed(2);
              footers.push(
                formatAmount(((projectFundStatistics.value as any)?.[key] ?? 0) / 100, 'None'),
              );
            } else if (
              column.field &&
              (column.field.indexOf('-total_income') !== -1 ||
                column.field.indexOf('-total_expense') !== -1)
            ) {
              const month = column.field.split('-')[0];
              const key = column.field.split('-')[1];

              // const amount = tableData.value
              //   .reduce((prev, next) => {
              //     const finder = next.data?.find(rowEl => `${rowEl.record_month}` === month);
              //     const amount = (finder as any)?.[key] ?? 0;
              //     return prev.add(new Decimal(amount / 100));
              //   }, new Decimal(0))
              //   .toFixed(2);
              const finder = projectFundStatistics.value?.month_data?.find(
                rowEl => `${rowEl.month}` === month,
              );
              footers.push(formatAmount(((finder as any)?.[key] ?? 0) / 100, 'None'));
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
              formatter: ({ row }: { row: ProjectFundModel }) => {
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
              formatter: ({ row }: { row: ProjectFundModel }) => {
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

    onMounted(async () => {
      methods.getFeishuDepartmentList(false);
      methods.onQueryHandler();
    });

    return {
      loading,
      businessList,
      colGroups,
      tableData,
      queryForm,
      feishuDepartmentList,
      department_tree,
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
      <div class="tg-finance-project-fund-statement-container">
        <section class="query-field">
          <el-form size="mini" label-width="60px">
            <el-form-item label="项目名称：">
              <el-input
                style="width: 210px;"
                v-model={this.queryForm.project_name}
                clearable
                placeholder="请输入项目名称"
                v-key-enter={this.onQueryHandler}
              ></el-input>
            </el-form-item>
            <el-form-item label="业务类型：">
              <el-select
                popper-class="el-select-popper-mini"
                style="width: 210px;"
                v-model={this.queryForm.business_id}
                clearable
                on-focus={this.selectControlPopoverHide}
              >
                {this.businessList.map(el => (
                  <el-option label={el.label} value={el.value} key={el.value}></el-option>
                ))}
              </el-select>
            </el-form-item>
            <el-form-item label="归属部门：">
              <el-popover
                placement="bottom-start"
                trigger="click"
                width="370"
                popper-class="project-fund-statement-tree-popper  el-tree-popper-mini"
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
                      <span style="color: var(--disabled-color);height: var(--default-height); line-height: var(--default-height);">
                        请选择所属部门
                      </span>
                      <i
                        style="margin-top: 7px; color: var(--disabled-color);font-size: var(--small-font-size);"
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
            <vxe-table
              border
              show-footer={(this.tableData ?? []).length > 0}
              highlight-hover-row
              tooltip-config={{
                theme: 'light',
              }}
              show-overflow
              height={'100%'}
              v-loading={this.loading}
              data={this.tableData}
              footer-method={this.footerMethod}
            >
              <template slot="empty">
                <empty-common detail-text="暂无数据"></empty-common>
              </template>
              <vxe-column
                width={180}
                title="项目名称"
                fixed="left"
                field="project_name"
                show-overflow
                formatter={({ row }: { row: ProjectFundModel }) => {
                  return row.project_name ? row.project_name : '--';
                }}
              ></vxe-column>

              <vxe-column
                width={100}
                title="业务类型"
                field="project_type"
                align="center"
                show-overflow
                formatter={({ row }: { row: ProjectFundModel }) => {
                  return this.businessTypeStr(row.project_type);
                }}
              ></vxe-column>
              <vxe-column
                width={150}
                title="项目编号"
                show-overflow
                formatter={({ row }: { row: ProjectFundModel }) => {
                  return row.project_uid ? row.project_uid : '--';
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
