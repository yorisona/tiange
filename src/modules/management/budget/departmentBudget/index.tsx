import { GetDepartmentManagementList, SaveDepartmentManagement } from '@/services/management';
import { getToken } from '@/utils/token';
import { computed, defineComponent, onMounted, ref, inject } from '@vue/composition-api';
import moment from 'moment';
import { department_columns, budgetQueryForm, departmentBudgetModel } from '../use/index';
import { useDialog } from '@/use/dialog';
import dialogImport from '../dialog/uploadTemplate/index.vue';
import { sleep } from '@/utils/func';
import qs from 'query-string';
import { useRouter } from '@/use/vue-router';
import { ElTable } from 'element-ui/types/table';
import { RouterManagement } from '@/const/router';

export default defineComponent({
  setup(props, ctx) {
    const routes = [
      { title: '预算目标', name: RouterManagement.targetManagement },
      { title: '部门预算' },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const currentDate = moment();
    const currentYearOptions = [
      { label: currentDate.format('YYYY') + ' 年', value: Number(currentDate.format('YYYY')) },
    ];
    /*[].fill(4).map((_, index) => {
      const target = Number(currentDate.format('YYYY')) - index ;
      return {
        label: `${target} 年`,
        value: target,
      };
    });*/
    const initQueryForm = (): budgetQueryForm => {
      return {
        year: Number(currentDate.format('YYYY')),
        department_ids: undefined,
      };
    };

    const dialog = useDialog({
      component: dialogImport,
      width: '328px',
      title: '数据导入',
      footer: false,
      on: {
        submit() {
          queryForm.value.page_num = 1;
          methods.queryDepartmentBudgetReq();
        },
      },
    });
    const queryForm = ref<budgetQueryForm>(initQueryForm());
    const updateRouterParams = () => {
      const router = useRouter();
      const { department_id, year } = router.currentRoute.params;
      queryForm.value.department_ids = department_id ? [department_id] : undefined;
      queryForm.value.business_type = year ? Number(year) : Number(currentDate.format('YYYY'));
    };
    updateRouterParams();
    const tableData = ref<departmentBudgetModel[]>([]);
    const multipleSelection = ref<departmentBudgetModel[]>([]);
    const departTable = ref<ElTable>();
    const oldTableData = ref<departmentBudgetModel[]>([]);
    const loading = ref<boolean>(false);
    const numFormat = (num: string) => {
      const res = num.toString().replace(/\d+/, function (n) {
        // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
          return $1 + ',';
        });
      });
      return res;
    };
    const methods = {
      query() {
        methods.queryDepartmentBudgetReq();
      },
      reset() {
        queryForm.value = initQueryForm();
        methods.queryDepartmentBudgetReq();
      },
      queryDepartmentBudgetReq: async () => {
        loading.value = true;
        const res = await GetDepartmentManagementList({
          year: queryForm.value.year,
          department_ids:
            queryForm.value.department_ids instanceof Array
              ? queryForm.value.department_ids.join(',')
              : queryForm.value.department_ids,
        });
        loading.value = false;
        if (res.data.success) {
          tableData.value = res.data.data.data || [];
          oldTableData.value = JSON.parse(JSON.stringify(tableData.value));
          statistics_data.value = res.data.data as any;
          ctx.root.$nextTick(() => {
            if (departTable.value) {
              multipleSelection.value = tableData.value;
              tableData.value.forEach(row => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                departTable.value.toggleRowSelection(row, undefined);
              });
            }
          });
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      handleCurrentChange(val: number) {
        queryForm.value.page_num = val;
        methods.queryDepartmentBudgetReq();
      },
      currentSizeChange(val: number) {
        queryForm.value.num = val;
        methods.queryDepartmentBudgetReq();
      },
    };

    onMounted(async () => {
      methods.queryDepartmentBudgetReq();
    });
    // 自适应表格高度部分
    // const topCardHeightStr = ref('calc(100vh - 290px)');
    const topCardHeight = ref(88);
    const onTopCardRectUpdate = (rect: DOMRect) => {
      topCardHeight.value = rect.height;
    };
    const topCardHeightStr = computed(() => {
      const height = 144;
      const topCardHeight_s = String(Number(topCardHeight.value + height).toFixed(0));
      return 'calc(100vh - ' + topCardHeight_s + 'px)';
    });
    const clickId = ref(0);
    const clickCellColumn = ref('');
    const onInputBlur = async (row: departmentBudgetModel) => {
      const month_goal_values = row.month_goal_values
        ? JSON.parse(JSON.stringify(row.month_goal_values))
        : [];
      const payload: any = {
        department_id: row.department_id,
        gmv_goal_value: row.gmv_goal_value
          ? Number(row.gmv_goal_value)
          : row.gmv_goal_value !== ''
          ? row.gmv_goal_value
          : null,
        month_goal_values: month_goal_values.map(
          (item: {
            gmv_goal_value: string | number | null;
            month: number | string | null;
            revenue_goal_value: string | number | null;
          }) => {
            item.gmv_goal_value = item.gmv_goal_value
              ? Number(item.gmv_goal_value)
              : item.gmv_goal_value !== ''
              ? item.gmv_goal_value
              : null;
            item.revenue_goal_value = item.revenue_goal_value
              ? Number(item.revenue_goal_value)
              : item.revenue_goal_value !== ''
              ? item.revenue_goal_value
              : null;
            return item;
          },
        ),
        revenue_goal_value: row.revenue_goal_value
          ? Number(row.revenue_goal_value)
          : row.revenue_goal_value !== ''
          ? row.revenue_goal_value
          : null,
        year: queryForm.value.year,
      };
      loading.value = true;
      const [{ data: response }, _] = await Promise.all([
        await SaveDepartmentManagement(payload),
        await sleep(200),
      ]);
      loading.value = false;
      if (response.success) {
        methods.queryDepartmentBudgetReq();
        ctx.root.$message.success(response.message ?? '保存成功');
      } else {
        tableData.value = JSON.parse(JSON.stringify(oldTableData.value));
        ctx.root.$message.error(response.message ?? '保存失败');
      }
    };
    const monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const old_goal_value = ref<string | number>(0);
    const onExportExcel = async () => {
      const _paramsstr = qs.stringify({
        ...queryForm.value,
        export_ids: multipleSelection.value.map(item => item.department_id),
      });
      const token = getToken();
      const url = '/api/operate_manage/export_department_goal';
      window.open(`${process.env.VUE_APP_BASE_API}${url}?${_paramsstr}&Authorization=${token}`);
    };
    const handleSelectionChange = (val: any[]) => {
      multipleSelection.value = val || [];
    };
    // 合计
    const statistics_data = ref<any>();
    const summaryMethod = () => {
      if (statistics_data.value === undefined) return [];
      const arr = [
        '',
        '合计',
        '',
        '--',
        statistics_data.value.gmv_goal_value !== null
          ? numFormat(String(statistics_data.value.gmv_goal_value || 0))
          : '--',
        statistics_data.value.revenue_goal_value !== null
          ? numFormat(String(statistics_data.value.revenue_goal_value || 0))
          : '--',
      ];
      monthArr.map((item: number) => {
        arr.push(
          statistics_data.value.month_goal_values &&
            statistics_data.value.month_goal_values.length >= item &&
            statistics_data.value.month_goal_values[item - 1]
            ? numFormat(
                String(statistics_data.value.month_goal_values[item - 1].gmv_goal_value || 0),
              )
            : '--',
        );
        arr.push(
          statistics_data.value.month_goal_values &&
            statistics_data.value.month_goal_values.length >= item &&
            statistics_data.value.month_goal_values[item - 1]
            ? numFormat(
                String(statistics_data.value.month_goal_values[item - 1].revenue_goal_value || 0),
              )
            : '--',
        );
      });
      return arr;
    };
    return {
      handleSelectionChange,
      multipleSelection,
      departTable,
      numFormat,
      onExportExcel,
      dialog,
      old_goal_value,
      clickCellColumn,
      monthArr,
      onInputBlur,
      clickId,
      projectTypeOption: E.project.ProjectTypeOption,
      currentYearOptions,
      topCardHeight,
      topCardHeightStr,
      onTopCardRectUpdate,
      queryForm,
      tableData,
      department_columns,
      loading,
      summaryMethod,
      // dialog,
      ...methods,
    };
  },
  render() {
    return (
      <tg-card class="budget-container" padding={0}>
        <tg-card
          class="budget-background-card"
          padding={[16, 0, 4, 16]}
          on={{ 'rect:update': this.onTopCardRectUpdate }}
        >
          <el-form
            class="budget-filter-form"
            size="mini"
            label-width="60px"
            attrs={{
              model: this.formData,
            }}
          >
            <div class="budget-filter-form-div">
              <div class="budget-filter-form-item">
                <el-form-item label="所属年度：">
                  <el-select
                    popper-class="el-select-popper-mini"
                    v-model={this.queryForm.year}
                    class="budget-select"
                    placeholder="请选择所属年度"
                    style="width: 100%"
                  >
                    {this.currentYearOptions.map((el, index) => {
                      return (
                        <el-option label={el.label} value={el.value} key={index + 1}></el-option>
                      );
                    })}
                  </el-select>
                </el-form-item>
              </div>
              <div class="budget-filter-form-item">
                <el-form-item label="所属部门：">
                  <department-select
                    selectMultiple={true}
                    queryForm={{
                      need_department_names:
                        '商业化中心,杭州煜丰电子商务有限公司,市场中心,上海分公司',
                    }}
                    clearable
                    v-model={this.queryForm.department_ids}
                  ></department-select>
                </el-form-item>
              </div>
              <div class="budget-filter-form-item btns">
                <el-form-item label-width="0">
                  <div class="budget-filter-form-item-btn">
                    <tg-button type="primary" onClick={this.query}>
                      查询
                    </tg-button>
                    <tg-button class="mgl-8" onClick={this.reset}>
                      重置
                    </tg-button>
                  </div>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </tg-card>
        <tg-card class="budget-background-card mgt-10" padding={[12, 16, 32, 16]}>
          <div class="mgb-12 budget-btns">
            <div>
              <tg-button
                disabled={this.multipleSelection.length < 1}
                onclick={() => {
                  this.onExportExcel();
                }}
              >
                导出
              </tg-button>
              <tg-button
                class="mgl-8"
                onclick={() => {
                  this.dialog.show('2', this.queryForm.year);
                }}
              >
                导入
              </tg-button>
            </div>
            <div class="label">金额单位：元</div>
          </div>
          <el-table
            height={this.topCardHeightStr}
            v-loading={this.loading}
            border
            class="budget-table"
            data={this.tableData}
            show-summary
            summary-method={this.summaryMethod}
            ref="departTable"
            on-selection-change={this.handleSelectionChange}
          >
            <el-table-column align="center" type="selection" width="55" />
            {this.department_columns &&
              this.department_columns.map((col, colIndex) => {
                return <el-table-column key={colIndex} props={{ ...col }} />;
              })}
            <el-table-column
              label="GMV目标"
              minWidth={130}
              scopedSlots={{
                default: ({ row, column }: any) => {
                  if (row.department_id === this.clickId && this.clickCellColumn === '3') {
                    return (
                      <div class="el-input-div">
                        <el-input
                          v-focus
                          v-model={row.gmv_goal_value}
                          size="mini"
                          onInput={(value: string) => {
                            const match = /(\d+)$|\d+\.?\d{0,2}/.exec(value);
                            row.gmv_goal_value = match ? match[0] : '';
                          }}
                          onBlur={() => {
                            this.clickCellColumn = '';
                            if (this.old_goal_value !== String(row.gmv_goal_value || '')) {
                              this.old_goal_value = String(row.gmv_goal_value || '');
                              this.onInputBlur(row);
                            }
                          }}
                          v-key-enter={() => {
                            if (this.old_goal_value !== String(row.gmv_goal_value || '')) {
                              this.old_goal_value = String(row.gmv_goal_value || '');
                              this.onInputBlur(row);
                            }
                            this.clickCellColumn = '';
                          }}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div
                        class="information-div"
                        on-dblclick={() => {
                          this.old_goal_value = String(row.gmv_goal_value || '');
                          this.clickCellColumn = '3';
                          this.clickId = row.department_id;
                        }}
                      >
                        {row.gmv_goal_value && this.numFormat(String(row.gmv_goal_value || 0))}
                      </div>
                    );
                  }
                },
              }}
            />
            <el-table-column
              label="营收目标"
              minWidth={130}
              scopedSlots={{
                default: ({ row, column }: any) => {
                  if (row.department_id === this.clickId && this.clickCellColumn === '4') {
                    return (
                      <div class="el-input-div">
                        <el-input
                          v-focus
                          v-model={row.revenue_goal_value}
                          size="mini"
                          onInput={(value: string) => {
                            const match = /(\d+)$|\d+\.?\d{0,2}/.exec(value);
                            row.revenue_goal_value = match ? match[0] : '';
                          }}
                          onBlur={() => {
                            this.clickCellColumn = '';
                            if (this.old_goal_value !== String(row.revenue_goal_value || '')) {
                              this.old_goal_value = String(row.revenue_goal_value || '');
                              this.onInputBlur(row);
                            }
                          }}
                          v-key-enter={() => {
                            if (this.old_goal_value !== String(row.revenue_goal_value || '')) {
                              this.old_goal_value = String(row.revenue_goal_value || '');
                              this.onInputBlur(row);
                            }
                            this.clickCellColumn = '';
                          }}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div
                        class="information-div "
                        on-dblclick={() => {
                          this.old_goal_value = String(row.revenue_goal_value || '');
                          this.clickCellColumn = '4';
                          this.clickId = row.department_id;
                        }}
                      >
                        {row.revenue_goal_value &&
                          this.numFormat(String(row.revenue_goal_value || 0))}
                      </div>
                    );
                  }
                },
              }}
            />
            {this.monthArr.map((item: number, index: number) => {
              return (
                <el-table-column
                  label={item + '月'}
                  key="selfShop"
                  column-key="selfShop"
                  width="306"
                  class-name={
                    item % 2
                      ? 'department-fund-statement-head-even'
                      : 'department-fund-statement-head-odd'
                  }
                >
                  <el-table-column
                    label="GMV目标"
                    minWidth={120}
                    class-name={
                      item % 2
                        ? 'department-fund-statement-head-even'
                        : 'department-fund-statement-head-odd'
                    }
                    scopedSlots={{
                      default: ({ row, column }: any) => {
                        if (
                          row.department_id === this.clickId &&
                          this.clickCellColumn === '3' + index
                        ) {
                          return (
                            <div class="el-input-div">
                              <el-input
                                v-focus
                                v-model={row.month_goal_values[index].gmv_goal_value}
                                size="mini"
                                onInput={(value: string) => {
                                  const match = /(\d+)$|\d+\.?\d{0,2}/.exec(value);
                                  row.month_goal_values[index].gmv_goal_value = match
                                    ? match[0]
                                    : '';
                                }}
                                onBlur={() => {
                                  this.clickCellColumn = '';
                                  if (
                                    this.old_goal_value !==
                                    String(row.month_goal_values[index].gmv_goal_value || '')
                                  ) {
                                    this.old_goal_value = String(
                                      row.month_goal_values[index].gmv_goal_value || '',
                                    );
                                    this.onInputBlur(row);
                                  }
                                }}
                                v-key-enter={() => {
                                  if (
                                    this.old_goal_value !==
                                    String(row.month_goal_values[index].gmv_goal_value || '')
                                  ) {
                                    this.old_goal_value = String(
                                      row.month_goal_values[index].gmv_goal_value || '',
                                    );
                                    this.onInputBlur(row);
                                  }
                                  this.clickCellColumn = '';
                                }}
                              />
                            </div>
                          );
                        } else {
                          return (
                            <div
                              class="information-div "
                              on-dblclick={() => {
                                this.old_goal_value = String(
                                  row.month_goal_values[index].gmv_goal_value || '',
                                );
                                this.clickCellColumn = '3' + index;
                                this.clickId = row.department_id;
                              }}
                            >
                              {row.month_goal_values[index].gmv_goal_value &&
                                this.numFormat(
                                  String(row.month_goal_values[index].gmv_goal_value || 0),
                                )}
                            </div>
                          );
                        }
                      },
                    }}
                  />
                  <el-table-column
                    label="营收目标"
                    class-name={
                      item % 2
                        ? 'department-fund-statement-head-even'
                        : 'department-fund-statement-head-odd'
                    }
                    minWidth={120}
                    scopedSlots={{
                      default: ({ row, column }: any) => {
                        if (
                          row.department_id === this.clickId &&
                          this.clickCellColumn === '4' + index
                        ) {
                          return (
                            <div class="el-input-div">
                              <el-input
                                v-focus
                                v-model={row.month_goal_values[index].revenue_goal_value}
                                size="mini"
                                onInput={(value: string) => {
                                  const match = /(\d+)$|\d+\.?\d{0,2}/.exec(value);
                                  row.month_goal_values[index].revenue_goal_value = match
                                    ? match[0]
                                    : '';
                                }}
                                onBlur={() => {
                                  this.clickCellColumn = '';
                                  if (
                                    this.old_goal_value !==
                                    String(row.month_goal_values[index].revenue_goal_value || '')
                                  ) {
                                    this.old_goal_value = String(
                                      row.month_goal_values[index].revenue_goal_value || '',
                                    );
                                    this.onInputBlur(row);
                                  }
                                }}
                                v-key-enter={() => {
                                  if (
                                    this.old_goal_value !==
                                    String(row.month_goal_values[index].revenue_goal_value || '')
                                  ) {
                                    this.old_goal_value = String(
                                      row.month_goal_values[index].revenue_goal_value || '',
                                    );
                                    this.onInputBlur(row);
                                  }
                                  this.clickCellColumn = '';
                                }}
                              />
                            </div>
                          );
                        } else {
                          return (
                            <div
                              class="information-div "
                              on-dblclick={() => {
                                this.old_goal_value = String(
                                  row.month_goal_values[index].revenue_goal_value || '',
                                );
                                this.clickCellColumn = '4' + index;
                                this.clickId = row.department_id;
                              }}
                            >
                              {row.month_goal_values[index].revenue_goal_value &&
                                this.numFormat(
                                  String(row.month_goal_values[index].revenue_goal_value || 0),
                                )}
                            </div>
                          );
                        }
                      },
                    }}
                  />
                </el-table-column>
              );
            })}

            <template slot="empty">
              <empty-common detail-text="暂无数据"></empty-common>
            </template>
          </el-table>
        </tg-card>
      </tg-card>
    );
  },
});
