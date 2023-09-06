export const columns = [
  {
    label: '项目名称',
    align: 'left',
    dataType: 'text',
    minWidth: '160',
    fixed: 'left',
    'show-overflow-tooltip': true,
    formatter: (row: BudgetModel) => {
      return row.project_name || '';
    },
  },
  {
    label: '所属部门',
    align: 'left',
    fixed: 'left',
    dataType: 'text',
    'show-overflow-tooltip': true,
    minWidth: '160',
    formatter: (row: BudgetModel) => {
      return row.department_name || '';
    },
  },
  {
    label: '项目类型',
    fixed: 'left',
    align: 'center',
    dataType: 'text',
    'show-overflow-tooltip': true,
    minWidth: '100',
    formatter: (row: BudgetModel) => {
      return row.business_type_name || '';
    },
  },
];
export const department_columns = [
  {
    label: '一级部门',
    align: 'left',
    prop: 'one_level_name',
    minWidth: '160',
    fixed: 'left',
    'show-overflow-tooltip': true,
    formatter: (row: departmentBudgetModel) => {
      return row.one_level_name || '';
    },
  },
  {
    label: '二级部门',
    align: 'left',
    fixed: 'left',
    prop: 'two_level_name',
    'show-overflow-tooltip': true,
    minWidth: '160',
    formatter: (row: departmentBudgetModel) => {
      return row.two_level_name || '';
    },
  },
  {
    label: '三级部门',
    fixed: 'left',
    align: 'left',
    prop: 'three_level_name',
    'show-overflow-tooltip': true,
    minWidth: '120',
    formatter: (row: departmentBudgetModel) => {
      return row.three_level_name || '';
    },
  },
];

export interface BudgetModel {
  project_name: string | null;
  project_id: number | null | string;
  gmv_goal_value: string | number | null;
  revenue_goal_value: string | number | null;
  department_name: string | null;
  business_type: number | null;
  business_type_name: string | null;
  goal_settlement_rate: string | number | null;
  month_goal_values: {
    gmv_goal_value: string | number | null;
    month: number | string | null;
    revenue_goal_value: string | number | null;
  }[];
  is_finish?: boolean;
  start_time: string | null;
  end_time: string | null;
  add_by_name: string | null;
}
export interface departmentBudgetModel {
  department_id?: number | null;
  gmv_goal_value: string | number | null;
  revenue_goal_value: string | number | null;
  one_level_name: string | null;
  two_level_name: string | null;
  three_level_name: string | null;
  month_goal_values: {
    gmv_goal_value: string | number | null;
    month: number | string | null;
    revenue_goal_value: string | number | null;
  }[];
}
export interface budgetQueryForm {
  year: string | number | undefined;
  business_type?: string | number | undefined;
  department_ids: string | number | number[] | string[] | undefined;
  project_name?: string | undefined;
  is_finish?: boolean;
  page_num?: number;
  num?: number;
}

export interface projectBussinessModel {
  business_type?: string | number | null;
  business_type_name?: string | null;
  gmv_goal_value?: number | null;
  revenue_goal_value?: number | null;
}
