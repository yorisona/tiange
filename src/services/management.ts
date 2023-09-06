import { Delete } from '@/utils/request';
// 日支出报表
import { HttpResponse, ListResponse } from '@/types/base/http';
import { Get, Post } from '@/utils/request';
import { ObjectFilterEmpty } from '@/utils/func';
import {
  BudgetModel,
  budgetQueryForm,
  departmentBudgetModel,
} from '@/modules/management/budget/use';
import { IGPageQuery } from '@/types/tiange/general';
import { ManagementDashboardData } from '@/types/tiange/management';
/** 项目预算 */
export const GetProjectManagementList = async (
  payload?: budgetQueryForm,
): Promise<ListResponse<BudgetModel>> =>
  Get('/api/operate_manage/query_project_goal', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 部门预算 */
export const GetDepartmentManagementList = async (
  payload?: budgetQueryForm,
): Promise<ListResponse<departmentBudgetModel>> =>
  Get('/api/operate_manage/query_department_goal', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 保存部门预算 */
export const SaveDepartmentManagement = (payload: any): Promise<HttpResponse<any>> =>
  Post('/api/operate_manage/save_department_goal', payload);

/** 导入部门 */
export const ImportDepartmentManagementFile = (payload: {
  file_path: string;
  year: number;
}): Promise<HttpResponse<any>> =>
  Post('/api/operate_manage/inport_department_goal', {
    ...ObjectFilterEmpty(payload),
  });

/** 保存项目预算 */
export const SaveProjectManagement = (payload: any): Promise<HttpResponse<any>> =>
  Post('/api/operate_manage/save_project_goal', payload);

/** 导入项目 */
export const ImportProjectManagementFile = (payload: {
  file_path: string;
  year: number;
}): Promise<HttpResponse<any>> =>
  Post('/api/operate_manage/import_project_goal', {
    ...ObjectFilterEmpty(payload),
  });

/** 目标预算 */
export const GetTargetManagementList = async (payload?: {
  year: number;
}): Promise<HttpResponse<any>> =>
  Get('/api/operate_manage/year_goal_board', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 查询自定义指标展示和排序设置 */
export const Display_Fields_Setting = async (): Promise<
  HttpResponse<
    {
      type_name: string;
      type_fields: {
        id: string;
        is_hide: boolean;
        name: string;
        sort: number;
      }[];
    }[]
  >
> => Get('/api/operate_manage/project_detail/display_fields_setting');

/** 保存自定义指标展示和排序设置 */
export const Save_Display_Fields_Setting = (payload: any): Promise<HttpResponse<undefined>> =>
  Post('/api/operate_manage/project_detail/display_fields_setting', {
    ...ObjectFilterEmpty(payload),
  });

/** 项目明细列表数据 */
export const Query_Project_Detail = async (
  pager: IGPageQuery,
  payload?: {
    desc?: boolean;
    sort?: string;
    year: string | number | undefined;
    business_type: E.project.ProjectType | undefined;
    department_id: number | undefined;
    project_name: string | undefined;
    is_finish: boolean;
    group_by?: 'year' | 'season' | 'month';
    sort_index?: string | number;
  },
): Promise<ListResponse<ManagementDashboardData>> =>
  Get('/api/operate_manage/project_detail', {
    params: {
      ...ObjectFilterEmpty(pager),
      ...ObjectFilterEmpty(payload),
    },
  });

/** 项目看板 - 项目名称列表接口 */
export const Query_Operate_Manage_Project_List = async (
  // pager: IGPageQuery,
  payload?: {
    is_end?: boolean;
    business_type?: E.project.ProjectType;
    department_id?: number;
    project_name?: string;
    num: number;
    page_num: number;
  },
): Promise<HttpResponse<any[]>> =>
  Get('/api/operate_manage/project_detail/project_list', {
    params: {
      // ...ObjectFilterEmpty(pager),
      ...ObjectFilterEmpty(payload),
    },
  });

type OperatingReportType = 'company' | 'department' | 'project';
function OperatingReportPath(type: OperatingReportType) {
  switch (type) {
    case 'company':
      return 'company_operating_report';
    case 'department':
      return 'department_operating_report';
    case 'project':
      return 'project_operating_report';
  }
}
/** 项目概览数据接口 */
export const Query_Operate_Manage_Project_Overview = async (payload?: {
  year?: string;
  project_id?: number;
  start_date: string;
  end_date: string;
}): Promise<HttpResponse<any>> =>
  Get('/api/operate_manage/project_operating_report/project_overview', {
    params: {
      // ...ObjectFilterEmpty(pager),
      ...ObjectFilterEmpty(payload),
    },
  });

/** GMV概览数据接口（年+月） */
export const Query_Operate_Manage_Poject_Operating_Report_GMV_Overview = async (
  payload?: {
    project_id?: number;
    department_id?: string;
    department_ids?: string;
    start_date: string;
    end_date: string;
  },
  type: OperatingReportType = 'project',
): Promise<HttpResponse<any>> =>
  Get(`/api/operate_manage/${OperatingReportPath(type)}/gmv_overview`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** GMV趋势接口（年+月） */
export const Query_Operate_Manage_Poject_Operating_Report_GMV_Trend = async (
  payload?: {
    project_id?: number;
    department_id?: string;
    department_ids?: string;
    start_date: string;
    end_date: string;
    /** day: 按天汇总 month: 按月汇总 */
    group_by: 'day' | 'month';
  },
  type: OperatingReportType = 'project',
): Promise<HttpResponse<any>> =>
  Get(`/api/operate_manage/${OperatingReportPath(type)}/gmv_trend`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 营收概览数据接口（年+月） */
export const Query_Operate_Manage_Poject_Operating_Report_Income_Overview = async (
  payload?: {
    project_id?: number;
    department_id?: string;
    department_ids?: string;
    start_date: string;
    end_date: string;
  },
  type: OperatingReportType = 'project',
): Promise<HttpResponse<any>> =>
  Get(`/api/operate_manage/${OperatingReportPath(type)}/income_overview`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 营收趋势接口（年+月） */
export const Query_Operate_Manage_Poject_Operating_Report_Income_Trend = async (
  payload?: {
    project_id?: number;
    department_id?: string;
    department_ids?: string;
    start_date: string;
    end_date: string;
    /** day: 按天汇总 month: 按月汇总 */
    group_by: 'day' | 'month';
  },
  type: OperatingReportType = 'project',
): Promise<HttpResponse<any>> =>
  Get(`/api/operate_manage/${OperatingReportPath(type)}/income_trend`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 成本概览数据接口（年） */
export const Query_Operate_Manage_Poject_Operating_Report_Cost_Overview = async (
  payload?: {
    project_id?: number;
    department_id?: string;
    department_ids?: string;
    start_date: string;
    end_date: string;
  },
  type: OperatingReportType = 'project',
): Promise<HttpResponse<any>> =>
  Get(`/api/operate_manage/${OperatingReportPath(type)}/cost_overview`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 成本趋势接口（年） */
export const Query_Operate_Manage_Poject_Operating_Report_Cost_Trend = async (
  payload?: {
    project_id?: number;
    department_id?: string;
    department_ids?: string;
    start_date: string;
    end_date: string;
    /** day: 按天汇总 month: 按月汇总 */
    group_by: 'day' | 'month';
  },
  type: OperatingReportType = 'project',
): Promise<HttpResponse<any>> =>
  Get(`/api/operate_manage/${OperatingReportPath(type)}/cost_trend`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 净利润概览接口（年） */
export const Query_Operate_Manage_Poject_Operating_Report_Revenue_Overview = async (
  payload?: {
    project_id?: number;
    department_id?: string;
    department_ids?: string;
    start_date: string;
    end_date: string;
  },
  type: OperatingReportType = 'project',
): Promise<HttpResponse<any>> =>
  Get(`/api/operate_manage/${OperatingReportPath(type)}/revenue_overview`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 净利润趋势接口（年） */
export const Query_Operate_Manage_Poject_Operating_Report_Revenue_Trend = async (
  payload?: {
    project_id?: number;
    department_id?: string;
    department_ids?: string;
    start_date: string;
    end_date: string;
    /** day: 按天汇总 month: 按月汇总 */
    group_by: 'day' | 'month';
  },
  type: OperatingReportType = 'project',
): Promise<HttpResponse<any>> =>
  Get(`/api/operate_manage/${OperatingReportPath(type)}/revenue_trend`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 项目关键信息列表 */
export const Query_Operate_Manage_Poject_Operating_Project_comment = async (payload?: {
  project_id?: number;
}): Promise<HttpResponse<any>> =>
  Get('/api/operate_manage/project_operating_report/project_comment', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 添加项目关键信息 */
export const Add_Operate_Manage_Poject_Operating_Project_comment = (payload: {
  project_id?: number;
  comment?: string;
}): Promise<HttpResponse<any>> =>
  Post('/api/operate_manage/project_operating_report/project_comment', {
    ...ObjectFilterEmpty(payload),
  });

/** 删除项目关键信息 */
export const Delete_Operate_Manage_Poject_Operating_Project_comment = (payload: {
  id: number;
}): Promise<HttpResponse<any>> =>
  Delete(`/api/operate_manage/project_operating_report/project_comment`, {
    data: {
      ...ObjectFilterEmpty(payload),
    },
  });
/** 业务板块 */
export const query_business_gmv_trend = async (payload?: {
  start_date: string;
  end_date: string;
  /** day: 按天汇总 month: 按月汇总 */
  group_by: 'day' | 'month';
  department_ids?: string[];
  not_department_ids?: string[];
  // business_type: E.management.BusinessType;
}): Promise<HttpResponse<any>> =>
  Get(`/api/operate_manage/company_operating_report/business_gmv_trend`, {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
        department_ids: payload?.department_ids?.join(','),
        not_department_ids: payload?.not_department_ids?.join(','),
      }),
    },
  });
/** 数据结构 */
export const Query_Operate_Manage_Poject_Operating_Data_Structure = async (
  payload?: {
    start_date: string;
    end_date: string;
    // department_id?: number;
    department_ids?: string[];
    not_department_ids?: string[];
    // business_type?: E.management.BusinessType;
    group_by: 'business_type' | 'department_id' | 'project_id';
  },
  type: OperatingReportType = 'project',
): Promise<HttpResponse<any>> =>
  Get(`/api/operate_manage/${OperatingReportPath(type)}/data_structure`, {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
        department_ids: payload?.department_ids?.join(','),
        not_department_ids: payload?.not_department_ids?.join(','),
      }),
    },
  });

/** 部门经营概况趋势图 */
export const Query_Operate_Manage_Poject_Operating_Department_Operating_Trend = async (
  payload?: {
    start_date: string;
    end_date: string;
  },
  type: OperatingReportType = 'project',
): Promise<HttpResponse<any>> =>
  Get(`/api/operate_manage/${OperatingReportPath(type)}/department_operating_trend`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 项目经营概况趋势图 */
export const Query_Operate_Manage_Poject_Operating_Project_Operating_Trend = async (
  payload?: {
    start_date: string;
    end_date: string;
    department_id?: string;
    department_ids?: string;
  },
  type: OperatingReportType = 'project',
): Promise<HttpResponse<any>> =>
  Get(`/api/operate_manage/${OperatingReportPath(type)}/project_operating_trend`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 项目榜单 */
export const Query_Operate_Manage_Poject_Operating_Top_Project = async (
  payload?: {
    start_date: string;
    end_date: string;
    department_id?: string;
    department_ids?: string;
    business_type?: E.management.BusinessType;
    sort?: string;
    // 是否降序
    desc?: boolean;
  },
  type: OperatingReportType = 'project',
): Promise<HttpResponse<any>> =>
  Get(`/api/operate_manage/${OperatingReportPath(type)}/top_project`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 新项目列表 */
export const Query_Operate_Manage_Poject_Operating_New_Projects = async (
  payload?: {
    department_id?: string;
    department_ids?: string;
    business_type?: number | undefined;
  },
  type: OperatingReportType = 'project',
): Promise<HttpResponse<any>> =>
  Get(`/api/operate_manage/${OperatingReportPath(type)}/new_projects`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/** 新项目成长趋势图 */
export const Query_Operate_Manage_Poject_Operating_New_Project_Trend = async (
  payload?: {
    start_date: string;
    end_date: string;
    project_id: number;
  },
  type: OperatingReportType = 'project',
): Promise<HttpResponse<any>> =>
  Get(`/api/operate_manage/${OperatingReportPath(type)}/new_project_trend`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 合同续签提醒 */
export const Query_Operate_Manage_Poject_Operating_Renewal_Contracts = async (
  payload?: {
    start_date?: string;
    end_date?: string;
    department_id?: string;
    department_ids?: string;
    business_type?: number | undefined;
  },
  type: OperatingReportType = 'project',
): Promise<HttpResponse<any>> =>
  Get(`/api/operate_manage/${OperatingReportPath(type)}/renewal_contracts`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
