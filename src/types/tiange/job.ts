/**
 * 岗位管理
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 10:24:42
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=58&itf=1476
 */
import { GmtTimeFields } from '../base/advanced';
import { PaginationParams } from '../base/pagination';
import { JobDepartment } from './department';

/**
 * 功能角色
 */
export interface JobRole {
  /** 角色ID */
  role_id: number;
  /** 角色名称 */
  role_name: string;
}

/**
 * 岗位等级
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-28 19:49:41
 * @prop    {number} Employee 1
 * @prop    {number} Manager  2
 */
export enum JobLevel {
  /** 普通员工 */
  Employee = 1,
  /** 部门管理 */
  Manager = 2,
}

/**
 * 岗位等级Map
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-28 19:51:12
 */
export const JobLevelMap = new Map([
  [JobLevel.Employee, '普通员工'],
  [JobLevel.Manager, '部门管理'],
]);

/**
 * 岗位等级Options
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-28 19:52:18
 */
export const JobLevelOptions = [
  { value: JobLevel.Employee, label: '普通员工' },
  { value: JobLevel.Manager, label: '部门管理' },
];

/**
 * 岗位
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-26 00:37:16
 */
export interface Job extends GmtTimeFields {
  /** 创建人ID */
  add_by: number;
  /** 关联部门 */
  departments: JobDepartment[];
  /** 0---正常状态；1---删除状态 */
  flag: 0;
  /** ID */
  id: 1;
  /** 岗位等级，1-普通员工， 2-部门管理 */
  job_level: JobLevel;
  /** 岗位名称 */
  job_name: string;
  /** 修改人ID */
  modified_by: 0;
  /** 关联角色 */
  roles: JobRole[];
}

/**
 * 岗位表单
 * @author  codingcat
 * @since   2020-12-24 11:20:10
 */
export interface JobForm {
  /** ID 修改时传 */
  id?: 1;
  /** 岗位等级，1---普通员工， 2---部门管理 */
  job_level: JobLevel;
  /** 岗位名称 */
  job_name: string;
  /** 关联部门id */
  related_dep_ids: number[];
  /** 关联角色id */
  related_role_ids: number[];
}

export interface JobQueryParams extends PaginationParams {
  /** 岗位名称 */
  job_name?: string;
}
