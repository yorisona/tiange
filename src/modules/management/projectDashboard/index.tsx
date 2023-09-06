import { useDialog } from '@/use/dialog';
import { useRefTabs } from '@/use/tab';
import { computed, defineComponent, watchEffect } from '@vue/composition-api';
import indicator from '@/modules/management/projectDashboard/dialog/indicator/index.vue';
import { useList, textFormat } from './use';
import qs from 'query-string';
import { ObjectFilterEmpty } from '@/utils/func';
import { getToken } from '@/utils/token';
import { CycleType } from './use';
import { usePermission } from '@/use/permission';

export default defineComponent({
  setup(props, ctx) {
    // const tableKey = ref(Math.random());
    const list = useList();
    const permission = usePermission();
    const methods = {
      query: list.query,
      export() {
        const { num, page_num, ...rest } = list.formData.value;
        const _paramsstr = qs.stringify({
          ...ObjectFilterEmpty({
            ...rest,
          }),
        });
        const token = getToken();
        const exportUrl = `${process.env.VUE_APP_BASE_API}/api/operate_manage/export_project_detail?${_paramsstr}&Authorization=${token}`;
        window.open(exportUrl);
      },
      reset: list.reset,
      onCustomIndicator() {
        dialogIndicator.show(list.reqDisplayFieldSetting.data || []);
      },
      onCurrentChange(val: number) {
        list.formData.value.page_num = val;
        list.queryProjectDetailRequest();
      },
      onSizeChange(size: number) {
        list.formData.value.page_num = 1;
        list.formData.value.num = size;
        list.queryProjectDetailRequest();
      },
      getBaseInfoFieldList() {
        return [...(list.reqDisplayFieldSetting.data?.[0].type_fields || [])];
      },
      getProjectDataFieldList() {
        return [...(list.reqDisplayFieldSetting.data?.[1].type_fields || [])];
      },
      getAllDisplayFieldIdList() {
        const allFieldsList = [
          ...methods.getBaseInfoFieldList(),
          ...methods.getProjectDataFieldList(),
        ];
        return allFieldsList.sort((a, b) => a.sort - b.sort);
      },
      getDisplayProjectFields() {
        // console.log('project_data_info');
        // return list.projectDataGroup;
        const allFieldList = methods.getAllDisplayFieldIdList();
        const projectFieldList = methods.getProjectDataFieldList();
        if (allFieldList.length === 0) return list.projectDataGroup.value;
        const newGroups = list.projectDataGroup.value.map(group => {
          const { subColumns, ...rest } = group;
          const newSubColumns = [...(subColumns || [])];
          newSubColumns.sort((a: any, b: any) => {
            return (
              allFieldList.findIndex(el => el.id === a.field) -
              allFieldList.findIndex(el => el.id === b.field)
            );
          });
          return {
            ...rest,
            subColumns: newSubColumns.filter((column: any) => {
              const finder = projectFieldList.find(el => el.id === column.field);
              return (finder && !finder.is_hide) || !finder;
            }),
          };
        });

        const flag = newGroups.every(el => el.subColumns.length === 0);
        return flag ? [] : newGroups;
      },
      getDisplayBaseInfoFields() {
        const allFieldList = methods.getAllDisplayFieldIdList();

        return list.isBaseInfoExpand.value && allFieldList.length === 0
          ? list.baseInfoGroup.value
          : list.baseInfoGroup.value.map(group => {
              const { subColumns, ...rest } = group;
              subColumns.sort((a, b) => {
                return (
                  allFieldList.findIndex(el => el.id === a.field) -
                  allFieldList.findIndex(el => el.id === b.field)
                );
              });
              return {
                ...rest,
                subColumns: subColumns.filter((column, idx) => {
                  if (!list.isBaseInfoExpand.value) {
                    return idx === 0;
                  }
                  const finder = allFieldList.find(el => el.id === column.field);
                  return (finder && !finder.is_hide) || !finder;
                }),
              };
            });
      },
      footerMethod({ columns }: { columns: any }) {
        const footers: any[] = [];
        const statistics = list.statistics.value;
        // if (list.statistics.value) return [footers];
        columns.forEach((element: any) => {
          const params = element.params;
          if (!params) {
            footers.push('合计');
          } else {
            if (!statistics) footers.push('');
            const { cycleType, groupIndex, field, dateType } = params;
            // const { field } = element;
            const item = list.statistics.value?.[cycleType]?.[groupIndex];
            const value = item?.[field];
            if (field === 'gmv_complete_rate') {
              const gmv_goal = textFormat(item?.gmv);
              const rate = value === undefined || value === null ? '' : value + '%';
              if (gmv_goal.length && rate) {
                footers.push(gmv_goal + ' | ' + rate);
              } else if (gmv_goal.length) {
                footers.push(gmv_goal);
              } else if (rate) {
                footers.push(rate);
              } else {
                footers.push('--');
              }
            } else if (field === 'income_complete_rate') {
              const goal_income = textFormat(item?.income);
              const rate = value === undefined || value === null ? '' : value + '%';
              if (goal_income.length && rate) {
                footers.push(goal_income + ' | ' + rate);
              } else if (goal_income.length) {
                footers.push(goal_income);
              } else if (rate) {
                footers.push(rate);
              } else {
                footers.push('--');
              }
              // const text = textFormat(goal_income) + ' | ' + value + '%';
              // footers.push(text);
            } else {
              footers.push(
                value === null || value === undefined
                  ? '--'
                  : textFormat(value, dateType ? dateType : 'money'),
              );
            }
          }
        });
        return [footers];
      },
      sortChangeEvent({ column, property, order }: { column: any; property: any; order: any }) {
        // return;
        list.tableSort.value = {
          field: order ? property : undefined,
          order,
        };
        // tableKey.value = Math.random();
        // console.log({
        //   column,
        //   property,
        //   order,
        //   sort: list.tableSort.value,
        // });
      },
      // footerSpan({ column, columnIndex }: { column: any; columnIndex: number }) {
      //   const allFieldList = methods.getAllDisplayFieldIdList();
      //   const baseInfoList = methods.getBaseInfoFieldList().filter(el => !el.is_hide);
      //   const colspan = allFieldList.length === 0 ? 5 : baseInfoList.length + 1;
      //   if (!column.params && list.isBaseInfoExpand.value) {
      //     if (columnIndex === 0) {
      //       return {
      //         rowspan: 1,
      //         colspan: colspan,
      //       };
      //     } else {
      //       return {
      //         rowspan: 0,
      //         colspan: 0,
      //       };
      //     }
      //   }
      // },
      mergeFooterItems() {
        const allFieldList = methods.getAllDisplayFieldIdList();
        let colspan = 5;
        if (!list.isBaseInfoExpand.value) {
          colspan = 1;
        } else if (allFieldList.length !== 0) {
          const baseInfoList = methods.getBaseInfoFieldList().filter(el => !el.is_hide);
          colspan = baseInfoList.length + 1;
        }
        return [{ row: 0, col: 0, rowspan: 1, colspan }];
      },
    };
    const tabs = useRefTabs<CycleType>(
      [
        {
          label: '月度',
          value: 'month',
        },
        {
          label: '季度',
          value: 'season',
        },
        {
          label: '年度',
          value: 'year',
        },
      ],
      'month',
    );
    const dialogIndicator = useDialog({
      component: indicator,
      title: '自定义指标',
      width: '298px',
      okText: '确定',
      props: {},
      on: {
        submit() {
          list.reloadDisplayField();
          // ctx.emit('save');
        },
      },
    });

    watchEffect(() => {
      const allFieldList = methods.getAllDisplayFieldIdList();
      const baseInfoList = methods.getBaseInfoFieldList().filter(el => !el.is_hide);
      if (allFieldList.length === 0) {
        list.showExpandItem.value = true;
      } else {
        list.showExpandItem.value = baseInfoList.length !== 0;
      }
    });

    // const mergeFooterItems = computed(() => {
    //   const allFieldList = methods.getAllDisplayFieldIdList();
    //   let colspan = 5;
    //   if (!list.isBaseInfoExpand.value) {
    //     colspan = 1;
    //   } else if (allFieldList.length !== 0) {
    //     const baseInfoList = methods.getBaseInfoFieldList().filter(el => !el.is_hide);
    //     colspan = baseInfoList.length + 1;
    //   }
    //   return [{ row: 0, col: 0, rowspan: 1, colspan }];
    // });

    const displayColumns = computed(() => {
      const displayBaseInfoGroup = methods.getDisplayBaseInfoFields();
      const displayProjectInfoGroup = methods.getDisplayProjectFields();
      // return [methods.getDisplayBaseInfoFields().map(group => {
      // })
      return [
        ...displayBaseInfoGroup.map(group => {
          return {
            title: group.title,
            fixed: 'left',
            slots: group.scopedSlots,
            subColumns: group.subColumns,
            align: group.align,
            key: group,
            children: group.subColumns.map(v => {
              return {
                key: v.field + group.title,
                title: v.label,
                field: v.field,
                // fixed: v.fixed,
                align: v.align,
                headerAlign: v.headerAlign,
                minWidth: v.width,
                // fixed={v.fixed}
                formatter: v.formatter,
                slots: v.scopedSlots ? v.scopedSlots : undefined,
              };
            }),
          };
        }),
        ...displayProjectInfoGroup.map((group, groupIdx) => {
          return {
            title: group.title,
            headerClassName:
              groupIdx % 2 === 0
                ? 'department-fund-statement-group-head-even'
                : 'department-fund-statement-group-head-odd',
            align: group.align,
            key: group.title + list.projectInfoKey.value,
            children: group.subColumns.map(v => {
              const newField = v.sortBy;
              return {
                headerClassName:
                  groupIdx % 2 === 0
                    ? 'department-fund-statement-head-even'
                    : 'department-fund-statement-head-odd',
                title: v.label,
                field: newField,
                align: v.align,
                headerAlign: v.headerAlign,
                params: v.params,
                sortable: v.sortable,
                sortBy: newField,
                minWidth: v.width,
                slots: v.scopedSlots ? v.scopedSlots : undefined,
                // fixed={v.fixed}
                key: v.field + groupIdx + list.projectInfoKey.value,
                formatter: v.formatter,
              };
            }),
          };
        }),
      ];
    });

    return {
      ...tabs,
      list,
      permission,
      // tableKey,
      tableRef: list.tableRef,
      displayColumns,
      dialogIndicator,
      // mergeFooterItems,
      projectTypeOption: E.project.ProjectTypeOption,
      ...methods,
    };
  },
  render() {
    // const displayBaseInfoGroup = this.getDisplayBaseInfoFields();
    // const displayProjectInfoGroup = this.getDisplayProjectFields();
    // console.log('render');
    const mergeFooterItems = this.mergeFooterItems();
    return (
      <div class="tg-management-project-dashboard-container">
        <section class="filter-field">
          <div class="filter-item">
            <span class="label">所属年度：</span>
            <el-select
              popper-class="el-select-popper-mini"
              v-model={this.list.formData.value.year}
              class="budget-select"
              placeholder="请选择所属年度"
              style="width: 100%"
              size="mini"
            >
              {this.list.currentYearOptions.map((el, index) => {
                return <el-option label={el.label} value={el.value} key={index + 1}></el-option>;
              })}
            </el-select>
          </div>
          <div class="filter-item">
            <span class="label">项目类型：</span>
            <el-select
              popper-class="el-select-popper-mini"
              v-model={this.list.formData.value.business_type}
              class="budget-select"
              placeholder="请选择项目类型"
              style="width: 100%"
              size="mini"
            >
              <el-option label="全部" value={undefined} key={undefined}></el-option>
              {this.projectTypeOption.map((el, index) => {
                return <el-option label={el.label} value={el.value} key={index + 1}></el-option>;
              })}
            </el-select>
          </div>
          <div class="filter-item">
            <span class="label">所属部门：</span>
            <department-select
              clearable
              v-model={this.list.formData.value.department_id}
              queryForm={{
                need_department_names: '商业化中心,杭州煜丰电子商务有限公司,上海分公司',
              }}
            ></department-select>
          </div>
          <div class="filter-item">
            <span class="label">项目名称：</span>
            <el-input
              style="width: 100%"
              v-model={this.list.formData.value.project_name}
              placeholder="请输入项目名称"
              v-key-enter={this.query}
              size="mini"
            />
          </div>
          <div class="filter-item">
            <tg-button class="el-btn-mini" type="primary" onClick={this.query}>
              查询
            </tg-button>
            <tg-button class="mgl-8 el-btn-mini" onClick={this.reset}>
              重置
            </tg-button>
            {this.permission.project_dashboard_detail_export && (
              <tg-button icon="ico-btn-export" class="el-btn-mini mgl-8" onClick={this.export}>
                导出
              </tg-button>
            )}
          </div>
        </section>
        <div
          style="display: flex; flex: 1; flex-direction: column; overflow: hidden;"
          v-loading={this.list.reqProjectDetail.loading}
        >
          <section class="table-field">
            <div class="tab-container">
              <tg-tabs
                tabs={this.tabs}
                v-model={this.checkedTab}
                on-change={(val: any) => {
                  this.list.tableSort.value = {
                    field: undefined,
                    order: undefined,
                  };
                  this.list.tableRef.value?.clearSort();
                  this.list.cycleType.value = val.value;
                }}
              ></tg-tabs>
              <div class="tab-right">
                <div class="amount-unit">金额单位：元</div>
                {E.management.BudgetProcessOption.map(el => (
                  <div class={`budget-tag budget-tag-${el.value}`}>{el.label}</div>
                ))}
                <el-checkbox class="show-finished-box" v-model={this.list.formData.value.is_finish}>
                  显示已结束项目
                </el-checkbox>
                <tg-button
                  style="margin-left: 24px"
                  class="mgl-8 el-btn-mini"
                  onClick={this.onCustomIndicator}
                >
                  自定义指标
                </tg-button>
              </div>
            </div>
            <div class="table-container mgt-16">
              <vxe-grid
                border
                // show-footer={(this.tableData ?? []).length > 0}
                highlight-hover-row
                tooltip-config={{
                  theme: 'light',
                }}
                ref="tableRef"
                show-footer={true}
                scroll-x={{ gt: 30 }}
                scroll-y={{ gt: 30 }}
                show-overflow
                height="100%"
                footer-align="right"
                auto-resize={true}
                data={this.list.reqProjectDetail.data}
                columns={this.displayColumns}
                footer-method={this.footerMethod}
                merge-footer-items={mergeFooterItems}
                // footer-span-method={this.footerSpan}
                sort-config={{
                  trigger: 'cell',
                  remote: true,
                  // defaultSort: this.list.tableSort.value,
                  orders: ['desc', 'asc', null],
                }}
                // sort-config={{
                //   trigger: 'cell',
                //   remote: true,
                //   defaultSort: this.list.tableSort.value,
                //   orders: ['desc', 'asc', null],
                // }}
                on-sort-change={this.sortChangeEvent}
              >
                <template slot="empty">
                  <empty-common detail-text="暂无数据"></empty-common>
                </template>
                {/* {displayBaseInfoGroup.map(group => {
                return (
                  <vxe-colgroup
                    title={group.title}
                    // fixed={group.fixed}
                    fixed="left"
                    scopedSlots={group.scopedSlots}
                    // header-class-name={group.headerClassName}
                    subColumns={group.subColumns}
                    align={group.align}
                    key={group}
                  >
                    {group.subColumns.map(v => (
                      <vxe-column
                        // header-class-name={v.className}
                        key={v.field + group.title}
                        title={v.label}
                        field={v.field}
                        fixed={v.fixed}
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
              {displayProjectInfoGroup.map((group, groupIdx) => {
                return (
                  <vxe-colgroup
                    title={group.title}
                    header-class-name={
                      groupIdx % 2 === 0
                        ? 'department-fund-statement-group-head-even'
                        : 'department-fund-statement-group-head-odd'
                    }
                    align={group.align}
                    key={group.title + this.list.projectInfoKey.value}
                  >
                    {group.subColumns.map((v: any) => {
                      // console.log({
                      //   by: v.sortBy,
                      // });
                      const newField = v.sortBy;
                      return (
                        <vxe-column
                          header-class-name={
                            groupIdx % 2 === 0
                              ? 'department-fund-statement-head-even'
                              : 'department-fund-statement-head-odd'
                          }
                          title={v.label}
                          field={newField}
                          align={v.align}
                          headerAlign={v.headerAlign}
                          params={v.params}
                          sortable={v.sortable}
                          sort-by={newField}
                          minWidth={v.width}
                          scopedSlots={v.scopedSlots ? v.scopedSlots : undefined}
                          // fixed={v.fixed}
                          key={v.field + groupIdx + this.list.projectInfoKey.value}
                          formatter={v.formatter}
                        />
                      );
                    })}
                  </vxe-colgroup>
                );
              })} */}
              </vxe-grid>
            </div>
          </section>
          <section class="pagination-field">
            <el-pagination
              total={this.list.reqProjectDetail.pagination.total || 0}
              page-size={this.list.formData.value.num}
              page-sizes={[10, 20, 50, 100]}
              layout={'total, prev, pager, next, sizes, jumper'}
              current-page={this.list.formData.value.page_num}
              on-current-change={this.onCurrentChange}
              on-size-change={this.onSizeChange}
            />
          </section>
        </div>
      </div>
    );
  },
});
