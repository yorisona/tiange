/**
 * 部门管理
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 10:06:56
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=58&itf=1473
 */
import { GmtTimeFields } from '../base/advanced';

/**
 * 部门(岗位)
 */
export interface JobDepartment {
  /** 部门ID */
  department_id: number;
  /** 部门名称 */
  department_name: string;
}

/**
 * 部门
 */
export interface Department extends GmtTimeFields {
  /** 创建人ID */
  add_by: number;
  /** 部门层级 */
  dep_level: number;
  /** 部门名称 */
  department_name: string;
  /** 0---正常状态；1---删除状态 */
  flag: number;
  /** ID */
  id: number;
  /** 修改人ID */
  modified_by: number;
  /** 上级部门id */
  superior_dep_id: number;
  /** 上级部门名称 */
  superior_dep_name: string;
  /** 关联岗位 */
  related_jobs: {
    job_id: number;
    job_name: string;
  }[];
}

export type DepartmentTree = Department & { sub_nodes?: Department[] };

export interface DepartmentForm {
  /** ID */
  id?: number;
  /** 部门名称 */
  department_name: string;
  /** 上级部门id */
  superior_dep_id?: number;
  /** 岗位ID列表 */
  related_job_ids?: number[];
}
