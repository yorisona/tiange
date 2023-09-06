import {
  Display_Fields_Setting,
  Query_Project_Detail,
  Save_Display_Fields_Setting,
} from '@/services/management';
import { IGPageQuery } from '@/types/tiange/general';
import { ManagementDashboardData } from '@/types/tiange/management';
// import { TgTableColumn } from '@/types/vendor/column';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { ref, computed, onMounted, watch } from '@vue/composition-api';
import moment from 'moment';
import { numberFormat } from '@/utils/formatMoney';
import { RouterManagement } from '@/const/router';
import { useRouter } from '@/use/vue-router';
const router = useRouter();

type FormData = Omit<
  TG.PaginationParams<typeof Query_Project_Detail> & IGPageQuery,
  'sort' | 'desc'
>;
// type Col = TgTableColumn<ManagementDashboardData>;
export type CycleType = 'year' | 'season' | 'month';

export const applyDrag = (arr: any[], dragResult: any) => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;

  const result = [...arr];
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return result;
};

// export type ProjectDashboardBaseInfoKeyType =
//   /** 项目属性 */
//   | 'project_name' // 项目名称
//   | 'business_type' // 项目类型
//   | 'department_name' //  所属部门
//   | 'budget_sales_ratio' // 预估净销率
//   | 'commission_ratio'; // 佣金比例

// export type ProjectDashboardProjectDataKeyType =
//   /** 项目数据 */
//   | 'gmv_goal' //  GMV目标
//   | 'gmv_budget_process' // GMV预算进度
//   | 'revenue_goal' // 营收目标
//   | 'revenue_budget_process' // 营收预算进度
//   | 'commission' // 佣金
//   | 'actual_settlement_ratio' // 实际结算率
//   | 'shangguang_mrketing' // 商广/营销
//   | 'fee' // 服务费
//   | 'other_income' // 其它收入
//   | 'has_arrived' // 已到账
//   | 'cashback_ratio' // 回款率
//   | 'not_arrived' // 未到账
//   | 'cost' // 成本
//   | 'kol_cost' // 主播成本
//   | 'put_cost' // 投放成本
//   | 'marketing_cost' // 营销成本
//   | 'labor_cost' // 人力成本
//   | 'other_cost' // 其它成本
//   | 'profit' // 净利润
//   | 'profit_ratio'; // 净利率;
// export interface ProjectDashboardDataType {
//   key: ProjectDashboardBaseInfoKeyType | ProjectDashboardProjectDataKeyType;
//   dataType: 'text' | 'price' | 'ratio' | 'priceRatioGg' | 'enum';
// }
export const textFormat = (val: number | undefined, type: 'money' | 'ratio' | 'text' = 'money') => {
  if (val === undefined || val === null) return '';
  if (type === 'money') return numberFormat(Math.round(val / 100), 0) + '';
  return val + '%';
};

const processRender = (
  amount: number | string,
  ratioStr: string,
  ratio: number | undefined,
  goal_amount: number | undefined,
) => {
  if (!goal_amount) return <div style="text-align: right">{amount || '--'}</div>;
  if (amount === '' && ratioStr === '') return null;
  // background: linear-gradient(90deg, orange 0, orange 90%, white 90%);
  const colors = useProcessColors(ratio);
  const newRatio = (ratio || 0) >= 100 ? 100 : ratio || 0;
  const style = `display: flex; align-items: center;
  justify-content: center;
  color: var(--text-color);
  margin: 0px -10px;
  border: 1px solid ${colors.borderColor};
  background: linear-gradient(90deg, ${colors.backgroundColor} 0, ${colors.backgroundColor} ${newRatio}%, white ${newRatio}%);`;
  return (
    <div style={style}>
      <span style="width: 88px; display: inline-block; text-align: right">{amount}</span>
      {ratioStr.length > 0 && (
        <fragments>
          <span style="margin: 0 4px; width: 4px">{amount !== '' ? '|' : ''}</span>
          <span style="width: 60px; display: inline-block; text-align: left;">{ratioStr}</span>
        </fragments>
      )}
    </div>
  );
};

const baseInfoSubColumnKeys = ref([
  {
    key: 'project_name',
    label: '项目名称',
    align: 'left',
    fixed: 'left',
    width: 144,
    showOverflowTooltip: true,
    // formatter: ({ row }: { row: ManagementDashboardData }) => {
    //   return row.project_name;
    // },
    scopedSlots: {
      default: ({ row }: { row: ManagementDashboardData }) => {
        return (
          <tg-button
            type="link"
            onClick={() => {
              const { href } = router.resolve({
                name: RouterManagement.projectManagementDashboard,
                query: {
                  id: `${row.project_id}`,
                  project_name: `${row.project_name}`,
                },
              });
              window.open(href, '_blank');
            }}
          >
            {row.project_name}
          </tg-button>
        );
      },
    },
  },
  {
    key: 'project_type_name',
    label: '项目类型',
    align: 'center',
    width: 92,
    formatter: ({ row }: { row: ManagementDashboardData }) => {
      return row.project_type_name;
    },
  },
  {
    key: 'project_department',
    label: '所属部门',
    align: 'left',
    width: 130,
    showOverflowTooltip: true,
    formatter: ({ row }: { row: ManagementDashboardData }) => {
      return row.project_department;
    },
  },
  {
    key: 'estimate_settled_rate',
    label: '预估净销率',
    align: 'right',
    width: 130,
    formatter: ({ row }: { row: ManagementDashboardData }) => {
      return textFormat(row.estimate_settled_rate, 'ratio');
    },
  },
  {
    key: 'commission_rate',
    label: '佣金比例',
    align: 'right',
    width: 130,
    formatter: ({ row }: { row: ManagementDashboardData }) => {
      return textFormat(row.commission_rate, 'ratio');
    },
  },
]);
const projectDataColumnKeys = ref([
  {
    key: 'goal_gmv',
    label: 'GMV目标',
    align: 'right',
    width: 130,
    formatter: (
      {
        row,
      }: {
        row: ManagementDashboardData;
      },
      type: CycleType,
      groupIndex: number,
    ) => {
      return textFormat(row[type]?.[groupIndex].goal_gmv) || '--';
    },
  },
  {
    key: 'gmv_complete_rate',
    label: 'GMV预算进度',
    align: 'center',
    width: 180,
    scopedSlots: {
      default: (
        {
          row,
        }: {
          row: ManagementDashboardData;
        },
        type: CycleType,
        groupIndex: number,
      ) => {
        const tdData = row[type]?.[groupIndex];
        const rate = textFormat(tdData?.gmv_complete_rate, 'ratio');
        const gmv = textFormat(tdData?.gmv);
        return processRender(gmv, rate, tdData?.gmv_complete_rate, tdData?.goal_gmv);
        // (
        // <div style="display: flex; align-items: center; justify-content: center; color: var(--text-color); margin: 0px -10px; ">
        //   <span style="width: 59px; display: inline-block; text-align: right">{gmv}</span>
        //   <span style="margin: 0 4px">|</span>
        //   <span style="width: 38px; display: inline-block;">{rate}</span>
        // </div>
        // );
      },
    },
    // formatter: (
    //   {
    //     row,
    //   }: {
    //     row: ManagementDashboardData;
    //   },
    //   type: CycleType,
    //   groupIndex: number,
    // ) => {
    //   const tdData = row[type]?.[groupIndex];
    //   const rate =
    //     tdData?.gmv_complete_rate === null || tdData?.gmv_complete_rate === undefined
    //       ? '--'
    //       : tdData.gmv_complete_rate;
    //   const gmv = tdData?.gmv === null || tdData?.gmv === undefined ? '--' : tdData.gmv;
    //   return <div>{`${gmv} | ${rate}`}</div>;
    // },
  },
  {
    key: 'goal_income',
    label: '营收目标',
    align: 'right',
    width: 130,
    formatter: (
      {
        row,
      }: {
        row: ManagementDashboardData;
      },
      type: CycleType,
      groupIndex: number,
    ) => {
      return textFormat(row[type]?.[groupIndex].goal_income) || '--';
    },
  },
  {
    key: 'income_complete_rate',
    label: '营收预算进度',
    align: 'left',
    width: 180,
    scopedSlots: {
      default: (
        {
          row,
        }: {
          row: ManagementDashboardData;
        },
        type: CycleType,
        groupIndex: number,
      ) => {
        const tdData = row[type]?.[groupIndex];
        const rate = textFormat(tdData?.income_complete_rate, 'ratio');
        const income = textFormat(tdData?.income);
        return processRender(income, rate, tdData?.income_complete_rate, tdData?.goal_income);
        // (
        //   <div style="display: flex; align-items: center; justify-content: center; color: var(--text-color); margin: 0px -10px;">
        //     <span style="width: 59px; display: inline-block; text-align: right">{income}</span>
        //     <span style="margin: 0 4px">|</span>
        //     <span style="width: 38px; display: inline-block;">{rate}</span>
        //   </div>
        // );
      },
    },
    // formatter: (
    //   {
    //     row,
    //   }: {
    //     row: ManagementDashboardData;
    //   },
    //   type: CycleType,
    //   groupIndex: number,
    // ) => {
    //   const tdData = row[type]?.[groupIndex];
    //   const rate =
    //     tdData?.income_complete_rate === null || tdData?.income_complete_rate === undefined
    //       ? '--'
    //       : tdData.income_complete_rate;
    //   const income = tdData?.income === null || tdData?.income === undefined ? '--' : tdData.income;
    //   return <div>{`${income} | ${rate}`}</div>;
    //   // return row[type]?.[groupIndex].income_complete_rate;
    // },
  },
  {
    key: 'commission',
    label: '佣金',
    align: 'right',
    width: 130,
    formatter: (
      {
        row,
      }: {
        row: ManagementDashboardData;
      },
      type: CycleType,
      groupIndex: number,
    ) => {
      return textFormat(row[type]?.[groupIndex].commission);
    },
  },
  {
    // key: 'real_settlement_rate',real_settled_rate
    key: 'real_settled_rate',
    label: '实际结算率',
    dataType: 'ratio',
    align: 'right',
    width: 130,
    formatter: (
      {
        row,
      }: {
        row: ManagementDashboardData;
      },
      type: CycleType,
      groupIndex: number,
    ) => {
      return textFormat(row[type]?.[groupIndex].real_settled_rate, 'ratio');
    },
  },
  {
    key: 'promote_amount',
    label: '商广/营销',
    align: 'right',
    width: 130,
    formatter: (
      {
        row,
      }: {
        row: ManagementDashboardData;
      },
      type: CycleType,
      groupIndex: number,
    ) => {
      return textFormat(row[type]?.[groupIndex].promote_amount);
    },
  },
  {
    key: 'service_amount',
    label: '服务费',
    align: 'right',
    width: 130,
    formatter: (
      {
        row,
      }: {
        row: ManagementDashboardData;
      },
      type: CycleType,
      groupIndex: number,
    ) => {
      return textFormat(row[type]?.[groupIndex].service_amount);
    },
  },
  {
    key: 'other_income',
    label: '其它收入',
    align: 'right',
    width: 130,
    formatter: (
      {
        row,
      }: {
        row: ManagementDashboardData;
      },
      type: CycleType,
      groupIndex: number,
    ) => {
      return textFormat(row[type]?.[groupIndex].other_income);
    },
  },
  {
    key: 'received_income',
    label: '已到账',
    align: 'right',
    width: 130,
    formatter: (
      {
        row,
      }: {
        row: ManagementDashboardData;
      },
      type: CycleType,
      groupIndex: number,
    ) => {
      return textFormat(row[type]?.[groupIndex].received_income);
    },
  },
  {
    key: 'received_rate',
    label: '回款率',
    align: 'right',
    width: 130,
    dataType: 'ratio',
    formatter: (
      {
        row,
      }: {
        row: ManagementDashboardData;
      },
      type: CycleType,
      groupIndex: number,
    ) => {
      return textFormat(row[type]?.[groupIndex].received_rate, 'ratio');
    },
  },
  {
    key: 'not_received_income',
    label: '未到账',
    align: 'right',
    width: 130,
    formatter: (
      {
        row,
      }: {
        row: ManagementDashboardData;
      },
      type: CycleType,
      groupIndex: number,
    ) => {
      return textFormat(row[type]?.[groupIndex].not_received_income);
    },
  },
  {
    key: 'cost',
    label: '成本',
    align: 'right',
    width: 130,
    formatter: (
      {
        row,
      }: {
        row: ManagementDashboardData;
      },
      type: CycleType,
      groupIndex: number,
    ) => {
      return textFormat(row[type]?.[groupIndex].cost);
    },
  },
  {
    key: 'anchor_cost',
    label: '主播成本',
    align: 'right',
    width: 130,
    formatter: (
      {
        row,
      }: {
        row: ManagementDashboardData;
      },
      type: CycleType,
      groupIndex: number,
    ) => {
      return textFormat(row[type]?.[groupIndex].anchor_cost);
    },
  },
  {
    key: 'ad_cost',
    label: '投放成本',
    align: 'right',
    width: 130,
    formatter: (
      {
        row,
      }: {
        row: ManagementDashboardData;
      },
      type: CycleType,
      groupIndex: number,
    ) => {
      return textFormat(row[type]?.[groupIndex].ad_cost);
    },
  },
  {
    key: 'promote_cost',
    label: '营销成本',
    align: 'right',
    width: 130,
    formatter: (
      {
        row,
      }: {
        row: ManagementDashboardData;
      },
      type: CycleType,
      groupIndex: number,
    ) => {
      return textFormat(row[type]?.[groupIndex].promote_cost);
    },
  },
  {
    key: 'labor_cost',
    label: '人力成本',
    align: 'right',
    width: 130,
    formatter: (
      {
        row,
      }: {
        row: ManagementDashboardData;
      },
      type: CycleType,
      groupIndex: number,
    ) => {
      return textFormat(row[type]?.[groupIndex].labor_cost);
    },
  },
  {
    key: 'other_cost',
    label: '其它成本',
    align: 'right',
    width: 130,
    formatter: (
      {
        row,
      }: {
        row: ManagementDashboardData;
      },
      type: CycleType,
      groupIndex: number,
    ) => {
      return textFormat(row[type]?.[groupIndex].other_cost);
    },
  },
  {
    key: 'revenue_amount',
    label: '净利润',
    align: 'right',
    width: 130,
    formatter: (
      {
        row,
      }: {
        row: ManagementDashboardData;
      },
      type: CycleType,
      groupIndex: number,
    ) => {
      return textFormat(row[type]?.[groupIndex].revenue_amount, 'money');
    },
  },
  {
    key: 'revenue_rate',
    label: '净利率',
    align: 'right',
    width: 130,
    dataType: 'ratio',
    formatter: (
      {
        row,
      }: {
        row: ManagementDashboardData;
      },
      type: CycleType,
      groupIndex: number,
    ) => {
      return textFormat(row[type]?.[groupIndex].revenue_rate, 'ratio');
    },
  },
]);
const gropKeyMap = ref<{ type: CycleType; value: string[] }[]>([
  {
    type: 'year',
    value: ['年度'],
  },
  {
    type: 'season',
    value: Array.from({ length: 4 }, (v, k) => k + 1).map(el => `第${el}季度`),
  },
  {
    type: 'month',
    value: Array.from({ length: 12 }, (v, k) => k + 1).map(el => `${el}月`),
  },
]);
export const useList = () => {
  const projectInfoKey = ref(1);
  const showExpandItem = ref(true);
  const tableRef = ref<{ clearSort: () => void }>();
  const currentDate = moment();
  const cycleType = ref<CycleType>('month');
  const isBaseInfoExpand = ref(true);
  const statistics = ref();
  const tableSort = ref<{ field: string | undefined; order: string | undefined }>({
    field: undefined,
    order: undefined,
  });
  const initFormData = (): FormData => {
    return {
      year: Number(currentDate.format('YYYY')),
      business_type: undefined,
      department_id: undefined,
      project_name: undefined,
      is_finish: true,
      num: 20,
      page_num: 1,
    };
  };
  const currentYearOptions = [
    { label: currentDate.format('YYYY') + ' 年', value: Number(currentDate.format('YYYY')) },
  ];
  const formData = ref<FormData>(initFormData());
  const baseInfoGroup = computed(() => {
    return [
      {
        title: '项目属性',
        align: 'center',
        // fixed: 'left',
        scopedSlots: {
          header: ({
            column,
          }: {
            column: any;
            columnIndex: any;
            $columnIndex: any;
            _columnIndex: any;
            $rowIndex: any;
          }) => {
            return (
              <div style="position: relative">
                <span
                  style={
                    !isBaseInfoExpand.value && showExpandItem.value ? 'margin-left: -34px;' : ''
                  }
                >
                  {column.title}
                </span>
                {showExpandItem.value && (
                  <tg-button
                    type="link"
                    style="position: absolute; right: 0; font-weight: 400; font-size: 12px"
                    on-click={() => {
                      isBaseInfoExpand.value = !isBaseInfoExpand.value;
                    }}
                  >
                    <i
                      class="el-icon-d-arrow-left"
                      style={
                        isBaseInfoExpand.value
                          ? 'margin-right: 6px;'
                          : 'margin-right: 6px;transform: rotate(180deg);'
                      }
                    ></i>
                    <span>{isBaseInfoExpand.value ? '收起' : '展开'}</span>
                  </tg-button>
                )}
              </div>
            );
          },
        },
        subColumns: baseInfoSubColumnKeys.value.map(el => {
          return {
            label: el.label,
            align: el.align,
            headerAlign: 'center',
            width: el.width,
            field: el.key,
            fixed: el.fixed,
            sort: undefined,
            showOverflowTooltip: el.showOverflowTooltip,
            formatter: el.formatter,
            scopedSlots: el.scopedSlots ? el.scopedSlots : undefined,
          };
        }),
      },
    ];
  });
  const projectDataGroup = computed(() => {
    const groups = gropKeyMap.value.find(el => el.type === cycleType.value)?.value || [];
    return groups.map((group, groupIdx) => {
      return {
        title: group,
        align: 'center',
        subColumns: projectDataColumnKeys.value.map(el => {
          return {
            label: el.label,
            align: el.align,
            headerAlign: 'center',
            width: el.width,
            field: el.key,
            sortable: true,
            sortBy: el.key + '-' + groupIdx,
            params: {
              field: el.key,
              cycleType: cycleType.value,
              dateType: el.dataType,
              groupIndex: groupIdx,
            },
            formatter: (v: any) => {
              return el.formatter?.(v, cycleType.value, groupIdx);
            },
            scopedSlots: el.scopedSlots
              ? {
                  default: (val: any) => {
                    return el.scopedSlots?.default(val, cycleType.value, groupIdx);
                  },
                }
              : undefined,
          };
        }),
      };
    });
  });
  const reqDisplayFieldSetting = useRequest(Display_Fields_Setting, {
    onSuccess() {
      projectInfoKey.value += 1;
    },
  });
  const reqSaveDisplayFieldSetting = useRequest(Save_Display_Fields_Setting, { manual: true });
  const reqProjectDetail = usePagination(Query_Project_Detail, {
    manual: true,
    onSuccess: (data, oData) => {
      statistics.value = (oData.data as any)?.statistics;
      // console.log({
      //   oData,
      // });
    },
  });
  const queryProjectDetailRequest = () => {
    const { num, page_num, ...rest } = formData.value;
    const { order, field } = tableSort.value;
    const [key, sort_index] = field?.split('-') || [];
    reqProjectDetail.runAsync(
      {
        num,
        page_num,
      },
      {
        desc: order === 'desc' ? true : order === 'asc' ? false : undefined,
        sort: key,
        group_by: cycleType.value,
        sort_index,
        ...rest,
      },
    );
  };
  const query = () => {
    formData.value.page_num = 1;
    queryProjectDetailRequest();
  };
  const reset = () => {
    formData.value = initFormData();
    queryProjectDetailRequest();
  };
  const reloadDisplayField = () => {
    reqDisplayFieldSetting.reload();
  };
  // const reloadList;
  watch(
    [
      () => formData.value.is_finish,
      () => tableSort.value.field,
      () => tableSort.value.order,
      () => cycleType.value,
    ],
    () => {
      query();
    },
  );
  onMounted(() => {
    queryProjectDetailRequest();
  });
  return {
    showExpandItem,
    statistics,
    isBaseInfoExpand,
    tableRef,
    tableSort,
    query,
    reset,
    reloadDisplayField,
    queryProjectDetailRequest,
    baseInfoGroup,
    projectDataGroup,
    reqDisplayFieldSetting,
    reqSaveDisplayFieldSetting,
    reqProjectDetail,
    currentYearOptions,
    formData,
    projectInfoKey,
    cycleType,
  };
};

export const useProcessColors = (proceees: number | undefined) => {
  const newVal = proceees || 0;
  let backgroundColor = '#FFA8A7';
  let borderColor = '#FFA8A7';
  if (newVal >= 120) {
    backgroundColor = '#C7AAF34c';
    borderColor = '#C7AAF3';
  } else if (newVal >= 100) {
    backgroundColor = '#A6DD904c';
    borderColor = '#A6DD90';
  } else if (newVal >= 80) {
    backgroundColor = '#9CE2F84c';
    borderColor = '#9CE2F8';
  } else {
    backgroundColor = '#FFA8A74c';
    borderColor = '#FFA8A7';
  }
  return {
    backgroundColor,
    borderColor,
  };
};
