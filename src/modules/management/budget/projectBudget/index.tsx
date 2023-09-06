import { GetProjectManagementList, SaveProjectManagement } from '@/services/management';
import { getToken } from '@/utils/token';
import {
  computed,
  defineComponent,
  inject,
  onMounted,
  onUpdated,
  ref,
  watch,
} from '@vue/composition-api';
import moment from 'moment';
import { columns, budgetQueryForm, BudgetModel } from '../use/index';
import { useDialog } from '@/use/dialog';
import { sleep } from '@/utils/func';
import dialogImport from '../dialog/uploadTemplate/index.vue';
import qs from 'query-string';
import { useRouter } from '@/use/vue-router';
import { ElTable } from 'element-ui/types/table';
// import { formatAmount } from '@/utils/string';
import InputLimit from '@/utils/inputLimit';
import { RouterManagement } from '@/const/router';

export default defineComponent({
  setup(props, ctx) {
    const routes = [
      { title: '预算目标', name: RouterManagement.targetManagement },
      { title: '项目预算' },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const currentDate = moment();
    const monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const currentYearOptions = [
      { label: currentDate.format('YYYY') + ' 年', value: Number(currentDate.format('YYYY')) },
    ];
    const initQueryForm = (): budgetQueryForm => {
      return {
        year: Number(currentDate.format('YYYY')),
        department_ids: undefined,
        business_type: undefined,
        project_name: undefined,
        is_finish: true,
        page_num: 1,
        num: 20,
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
          methods.queryProjectManagementReq();
        },
      },
    });
    const queryForm = ref<budgetQueryForm>(initQueryForm());
    const tableData = ref<BudgetModel[]>([]);
    const multipleSelection = ref<BudgetModel[]>([]);
    const oldTableData = ref<any[]>([]);
    const total = ref<number>(0);
    const loading = ref<boolean>(false);
    const updateRouterParams = () => {
      const router = useRouter();
      const { business_type, year } = router.currentRoute.params;
      queryForm.value.business_type =
        business_type && E.project.ProjectTypeMap.get(Number(business_type)) !== undefined
          ? Number(business_type)
          : undefined;
      queryForm.value.year = year ? Number(year) : Number(currentDate.format('YYYY'));
    };
    updateRouterParams();
    const methods = {
      query() {
        queryForm.value.page_num = 1;
        methods.queryProjectManagementReq();
      },
      reset() {
        queryForm.value = initQueryForm();
        methods.queryProjectManagementReq();
      },
      queryProjectManagementReq: async () => {
        loading.value = true;
        const res = await GetProjectManagementList({
          year: queryForm.value.year,
          business_type: queryForm.value.business_type,
          project_name: queryForm.value.project_name,
          is_finish: queryForm.value.is_finish,
          page_num: queryForm.value.page_num,
          num: queryForm.value.num,
          department_ids:
            queryForm.value.department_ids instanceof Array
              ? queryForm.value.department_ids.join(',')
              : queryForm.value.department_ids,
        });
        loading.value = false;
        if (res.data.success) {
          tableData.value = res.data.data.data || [];
          total.value = res.data.data.total;
          statistics_data.value = res.data.data as any;
          oldTableData.value = JSON.parse(JSON.stringify(tableData.value));
          ctx.root.$nextTick(() => {
            if (projectBudgetTable.value) {
              multipleSelection.value = tableData.value;
              tableData.value.forEach(row => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                projectBudgetTable.value.toggleRowSelection(row, undefined);
              });
            }
          });
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      handleCurrentChange(val: number) {
        queryForm.value.page_num = val;
        methods.queryProjectManagementReq();
      },
      currentSizeChange(val: number) {
        queryForm.value.num = val;
        methods.queryProjectManagementReq();
      },
    };

    onMounted(async () => {
      methods.queryProjectManagementReq();
    });
    const statistics_data = ref<any>();
    const numFormat = (num: string) => {
      const res = num.toString().replace(/\d+/, function (n) {
        // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
          return $1 + ',';
        });
      });
      return res;
    };
    const summaryMethod = () => {
      if (statistics_data.value === undefined) return [];
      const arr = [
        '',
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
    // 自适应表格高度部分
    // const topCardHeightStr = ref('calc(100vh - 290px)');
    const topCardHeight = ref(158);
    const onTopCardRectUpdate = (rect: DOMRect) => {
      topCardHeight.value = rect.height;
    };
    const topCardHeightStr = computed(() => {
      const height = total.value <= 0 ? 175 : 175;
      const topCardHeight_s = String(Number(topCardHeight.value + height).toFixed(0));
      return 'calc(100vh - ' + topCardHeight_s + 'px)';
    });
    const clickProjectId = ref<string | number>('');
    const clickBusinessType = ref(0);
    const clickCellColumn = ref('');
    const onInputBlur = async (row: BudgetModel) => {
      const month_goal_values = row.month_goal_values
        ? JSON.parse(JSON.stringify(row.month_goal_values))
        : [];
      const payload: any = {
        business_type: row.business_type,
        gmv_goal_value: row.gmv_goal_value
          ? Number(row.gmv_goal_value)
          : row.gmv_goal_value !== ''
          ? row.gmv_goal_value
          : null,
        goal_settlement_rate: row.goal_settlement_rate
          ? Number(row.goal_settlement_rate)
          : row.goal_settlement_rate !== ''
          ? row.goal_settlement_rate
          : null,
        month_goal_values: month_goal_values.map(
          (item: {
            gmv_goal_value: number | string | null;
            month: number | string | null;
            revenue_goal_value: number | string | null;
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
        project_id: row.project_id,
      };
      loading.value = true;
      const [{ data: response }, _] = await Promise.all([
        await SaveProjectManagement(payload),
        await sleep(200),
      ]);
      loading.value = false;
      if (response.success) {
        methods.queryProjectManagementReq();
        ctx.root.$message.success(response.message ?? '保存成功');
      } else {
        tableData.value = JSON.parse(JSON.stringify(oldTableData.value));
        ctx.root.$message.error(response.message ?? '保存失败');
      }
    };

    const onExportExcel = async () => {
      const _paramsstr = qs.stringify({
        ...queryForm.value,
        export_ids: multipleSelection.value.map(item => item.project_id),
      });
      const token = getToken();
      const url = '/api/operate_manage/export_project_goal';
      window.open(`${process.env.VUE_APP_BASE_API}${url}?${_paramsstr}&Authorization=${token}`);
    };
    const old_goal_value = ref<string | number>(0);
    watch(
      () => queryForm.value.is_finish,
      () => {
        if (queryForm.value.is_finish) {
          ctx.root.$message.success('已显示所有项目');
        } else {
          ctx.root.$message.success('已成功过滤已结束项目');
        }
        queryForm.value.page_num = 1;
        methods.queryProjectManagementReq();
      },
    );
    const projectBudgetTable = ref<ElTable>();
    onUpdated(() => {
      if (projectBudgetTable.value) {
        projectBudgetTable.value?.doLayout();
      }
    });
    const handleSelectionChange = (val: any[]) => {
      multipleSelection.value = val || [];
    };
    return {
      handleSelectionChange,
      multipleSelection,
      numFormat,
      projectBudgetTable,
      old_goal_value,
      onExportExcel,
      dialog,
      clickCellColumn,
      monthArr,
      onInputBlur,
      clickProjectId,
      clickBusinessType,
      projectTypeOption: E.project.ProjectTypeOption,
      currentYearOptions,
      topCardHeight,
      topCardHeightStr,
      onTopCardRectUpdate,
      total,
      queryForm,
      tableData,
      columns,
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
                    clearable
                    v-model={this.queryForm.department_ids}
                    queryForm={{
                      need_department_names:
                        '商业化中心,杭州煜丰电子商务有限公司,市场中心,上海分公司',
                    }}
                  ></department-select>
                </el-form-item>
              </div>
              <div class="budget-filter-form-item">
                <el-form-item label="项目类型：">
                  <el-select
                    popper-class="el-select-popper-mini"
                    v-model={this.queryForm.business_type}
                    class="budget-select"
                    placeholder="请选择项目类型"
                    style="width: 100%"
                  >
                    <el-option label="全部" value={undefined} key={undefined}></el-option>
                    {this.projectTypeOption
                      .filter(el => el.value !== 1)
                      .map((el, index) => {
                        return (
                          <el-option label={el.label} value={el.value} key={index + 1}></el-option>
                        );
                      })}
                  </el-select>
                </el-form-item>
              </div>
              <div class="budget-filter-form-item">
                <el-form-item label="项目名称：">
                  <el-input
                    style="width: 100%"
                    v-model={this.queryForm.project_name}
                    placeholder="请输入项目名称"
                    v-key-enter={this.query}
                  />
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
        <tg-card class="budget-background-card mgt-10" padding={[12, 16, 0, 16]}>
          <div class="mgb-12 budget-btns">
            <div class="budget-operator">
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
                  this.dialog.show('1', this.queryForm.year);
                }}
              >
                导入
              </tg-button>
              <el-checkbox v-model={this.queryForm.is_finish} size="small" />
              <span>显示已结束项目</span>
            </div>
            <div class="label">金额单位：元</div>
          </div>
          <el-table
            ref="projectBudgetTable"
            height={this.topCardHeightStr}
            v-loading={this.loading}
            border
            class="budget-table"
            data={this.tableData}
            show-summary
            summary-method={this.summaryMethod}
            on-selection-change={this.handleSelectionChange}
          >
            <el-table-column align="center" type="selection" width="55" />
            {this.columns &&
              this.columns.map((col, colIndex) => {
                return <el-table-column key={colIndex} props={{ ...col }} />;
              })}
            <el-table-column
              label="结算率目标"
              minWidth={120}
              scopedSlots={{
                default: ({ row, column }: any) => {
                  if (
                    row.project_id === this.clickProjectId &&
                    row.business_type === this.clickBusinessType &&
                    this.clickCellColumn === '3'
                  ) {
                    return (
                      <div class="el-input-div">
                        <el-input
                          v-model={row.goal_settlement_rate}
                          size="mini"
                          v-focus
                          onInput={(value: string) => {
                            // row.goal_settlement_rate = value.replace(/^(0+)|[^\d]+/g, '');
                            row.goal_settlement_rate = InputLimit.IntergerAndDecimals(value);
                          }}
                          onBlur={() => {
                            if (this.old_goal_value !== String(row.goal_settlement_rate || '')) {
                              this.old_goal_value = String(row.goal_settlement_rate || '');
                              this.onInputBlur(row);
                            }
                            this.clickProjectId = '';
                          }}
                          v-key-enter={() => {
                            this.clickProjectId = '';
                            if (this.old_goal_value !== String(row.goal_settlement_rate || '')) {
                              this.old_goal_value = String(row.goal_settlement_rate || '');
                              this.onInputBlur(row);
                            }
                          }}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div
                        class="information-div"
                        on-dblclick={() => {
                          this.old_goal_value = String(row.goal_settlement_rate || '');
                          this.clickProjectId = row.project_id;
                          this.clickBusinessType = row.business_type;
                          this.clickCellColumn = '3';
                        }}
                      >
                        {row.goal_settlement_rate !== null &&
                        row.goal_settlement_rate !== undefined &&
                        row.goal_settlement_rate !== ''
                          ? row.goal_settlement_rate + '%'
                          : null}
                        {/* formatAmount(row.goal_settlement_rate || 0, 'None', true */}
                      </div>
                    );
                  }
                },
              }}
            />
            <el-table-column
              label="GMV目标"
              minWidth={136}
              scopedSlots={{
                default: ({ row, column }: any) => {
                  if (
                    row.project_id === this.clickProjectId &&
                    row.business_type === this.clickBusinessType &&
                    this.clickCellColumn === '4'
                  ) {
                    return (
                      <div class="el-input-div">
                        <el-input
                          v-model={row.gmv_goal_value}
                          size="mini"
                          v-focus
                          onInput={(value: string) => {
                            const match = /(\d+)$|\d+\.?\d{0,2}/.exec(value);
                            row.gmv_goal_value = match ? match[0] : '';
                          }}
                          onBlur={() => {
                            if (this.old_goal_value !== String(row.gmv_goal_value || '')) {
                              this.old_goal_value = String(row.gmv_goal_value || '');
                              this.onInputBlur(row);
                            }
                            this.clickProjectId = '';
                          }}
                          v-key-enter={() => {
                            this.clickProjectId = '';
                            if (this.old_goal_value !== String(row.gmv_goal_value || '')) {
                              this.old_goal_value = String(row.gmv_goal_value || '');
                              this.onInputBlur(row);
                            }
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
                          this.clickProjectId = row.project_id;
                          this.clickBusinessType = row.business_type;
                          this.clickCellColumn = '4';
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
              minWidth={136}
              scopedSlots={{
                default: ({ row, column }: any) => {
                  if (
                    row.project_id === this.clickProjectId &&
                    row.business_type === this.clickBusinessType &&
                    this.clickCellColumn === '5'
                  ) {
                    return (
                      <div class="el-input-div">
                        <el-input
                          v-model={row.revenue_goal_value}
                          size="mini"
                          v-focus
                          onInput={(value: string) => {
                            const match = /(\d+)$|\d+\.?\d{0,2}/.exec(value);
                            row.revenue_goal_value = match ? match[0] : '';
                          }}
                          onBlur={() => {
                            if (this.old_goal_value !== String(row.revenue_goal_value || '')) {
                              this.old_goal_value = String(row.revenue_goal_value || '');
                              this.onInputBlur(row);
                            }
                            this.clickProjectId = '';
                          }}
                          v-key-enter={() => {
                            if (this.old_goal_value !== String(row.revenue_goal_value || '')) {
                              this.old_goal_value = String(row.revenue_goal_value || '');
                              this.onInputBlur(row);
                            }
                            this.clickProjectId = '';
                          }}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div
                        class="information-div"
                        on-dblclick={() => {
                          this.old_goal_value = String(row.revenue_goal_value || '');
                          this.clickCellColumn = '5';
                          this.clickProjectId = row.project_id;
                          this.clickBusinessType = row.business_type;
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
                  class-name={
                    item % 2
                      ? 'department-fund-statement-head-even'
                      : 'department-fund-statement-head-odd'
                  }
                >
                  <el-table-column
                    label="GMV目标"
                    minWidth={126}
                    class-name={
                      item % 2
                        ? 'department-fund-statement-head-even'
                        : 'department-fund-statement-head-odd'
                    }
                    scopedSlots={{
                      default: ({ row, column }: any) => {
                        const startTime = row.start_time
                          ? moment(row.start_time).format('YYYY-MM')
                          : '';
                        const endTime = row.end_time ? moment(row.end_time).format('YYYY-MM') : '';
                        const currentTime =
                          this.queryForm.year + '-' + (item < 10 ? '0' + item : item);
                        const isStart = startTime
                          ? moment(startTime).diff(moment(currentTime), 'months') <= 0
                          : true;
                        const isNoEnd = endTime
                          ? moment(endTime).diff(moment(currentTime), 'months') >= 0
                          : true;
                        if (
                          row.project_id === this.clickProjectId &&
                          row.business_type === this.clickBusinessType &&
                          this.clickCellColumn === '4' + index
                        ) {
                          return (
                            <div
                              class={[
                                'el-input-div ',
                                row.month_goal_values[index].gmv_goal_value === null
                                  ? isStart && isNoEnd
                                    ? ''
                                    : 'no-default'
                                  : '',
                              ]}
                            >
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
                                  if (
                                    this.old_goal_value !==
                                    String(row.month_goal_values[index].gmv_goal_value || '')
                                  ) {
                                    this.old_goal_value = String(
                                      row.month_goal_values[index].gmv_goal_value || '',
                                    );
                                    this.onInputBlur(row);
                                  }
                                  this.clickProjectId = '';
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
                                  this.clickProjectId = '';
                                }}
                              />
                            </div>
                          );
                        } else {
                          return (
                            <div
                              class={[
                                'information-div ',
                                row.month_goal_values[index].gmv_goal_value === null
                                  ? isStart && isNoEnd
                                    ? ''
                                    : 'no-default'
                                  : '',
                              ]}
                              on-dblclick={() => {
                                this.old_goal_value = String(
                                  row.month_goal_values[index].gmv_goal_value || '',
                                );
                                this.clickCellColumn = '4' + index;
                                this.clickProjectId = row.project_id;
                                this.clickBusinessType = row.business_type;
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
                    minWidth={126}
                    scopedSlots={{
                      default: ({ row, column }: any) => {
                        const startTime = row.start_time
                          ? moment(row.start_time).format('YYYY-MM')
                          : '';
                        const endTime = row.end_time ? moment(row.end_time).format('YYYY-MM') : '';
                        const currentTime =
                          this.queryForm.year + '-' + (item < 10 ? '0' + item : item);
                        const isStart = startTime
                          ? moment(startTime).diff(moment(currentTime), 'months') <= 0
                          : true;
                        const isNoEnd = endTime
                          ? moment(endTime).diff(moment(currentTime), 'months') >= 0
                          : true;
                        if (
                          row.project_id === this.clickProjectId &&
                          row.business_type === this.clickBusinessType &&
                          this.clickCellColumn === '5' + index
                        ) {
                          return (
                            <div
                              class={[
                                'el-input-div ',
                                row.month_goal_values[index].revenue_goal_value === null
                                  ? isStart && isNoEnd
                                    ? ''
                                    : 'no-default'
                                  : '',
                              ]}
                            >
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
                                  if (
                                    this.old_goal_value !==
                                    String(row.month_goal_values[index].revenue_goal_value || '')
                                  ) {
                                    this.old_goal_value = String(
                                      row.month_goal_values[index].revenue_goal_value || '',
                                    );
                                    this.onInputBlur(row);
                                  }
                                  this.clickProjectId = '';
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
                                  this.clickProjectId = '';
                                }}
                              />
                            </div>
                          );
                        } else {
                          return (
                            <div
                              class={[
                                'information-div ',
                                row.month_goal_values[index].revenue_goal_value === null
                                  ? isStart && isNoEnd
                                    ? ''
                                    : 'no-default'
                                  : '',
                              ]}
                              on-dblclick={() => {
                                this.old_goal_value = String(
                                  row.month_goal_values[index].revenue_goal_value || '',
                                );
                                this.clickCellColumn = '5' + index;
                                this.clickProjectId = row.project_id;
                                this.clickBusinessType = row.business_type;
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

          {this.tableData.length > 0 && (
            <div class="budget-pagination">
              <el-pagination
                class="flex-none"
                current-page={this.queryForm.page_num}
                page-sizes={[10, 20, 30, 50, 100]}
                page-size={this.queryForm.num}
                total={this.total}
                layout="total, prev, pager, next, sizes, jumper"
                on-current-change={this.handleCurrentChange}
                on-size-change={this.currentSizeChange}
              />
            </div>
          )}
        </tg-card>
      </tg-card>
    );
  },
});
