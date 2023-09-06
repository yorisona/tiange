/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-01-20 17:39:48
 */
/**
 * 角色管理
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 15:29:42
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=58&itf=1478
 */

import { GmtTimeFields } from '../base/advanced';
import { PaginationParams } from '../base/pagination';
import { RoleTypeEnum } from './common';
/**
 * 角色(基础)
 */
export interface BaseRole {
  /** 角色id */
  id: number;
  /** 角色码 */
  role_code: number;
  /** 角色名称 */
  role_name: string;
  /** 角色类型，1-普通角色，2-系统角色 */
  role_type: RoleTypeEnum;
}

/**
 * 角色
 */
export interface Role extends BaseRole, GmtTimeFields {
  /** 角色ID */
  id: number;
  /** 创建人ID */
  add_by?: number;
  /** 部门ID */
  department: number;
  /** 0---正常状态；1---删除状态 */
  flag: 0;
  /** 修改人ID */
  modified_by: number;
  /** 权限码列表 */
  right_code_list: number[];
}

/**
 * 角色查询参数
 */
export interface RoleQueryParams extends Required<PaginationParams> {
  /** 角色名称 */
  role_name?: string;
  /** 角色类型，1---普通角色，2---系统角色 */
  role_type: RoleTypeEnum;
}

export interface RoleForm {
  /** 角色ID */
  id?: number;
  /** 角色名称 */
  role_name: string;
  /** 权限码列表 */
  right_codes: number[];
}

/**
 * 系统角色
 * @author: wuyou <wuyou@goumee.com>
 * @since: 2020-12-25 13:38:09
 * @see: http://rap2.goumee.com/repository/editor?id=19&mod=58&itf=1482
 */

export interface SystemRole extends BaseRole {
  /** 关联管理岗位 数组 */
  related_manager_job: {
    /** 岗位ID */
    job_id: number;
    /** 岗位名称 */
    job_name: string;
  };
  /** 关联执行岗位 数组 */
  related_normal_jobs: {
    /** 岗位ID */
    job_id: number;
    /** 岗位名称 */
    job_name: string;
  }[];
  /** 说明 */
  instructions: string;
}

export interface SystemRoleForm {
  /** 角色ID */
  id?: number;
  /** 关联管理岗位 ID */
  manager_job_id: number | undefined;
  /** 关联管理岗位 名称 */
  manager_job_name?: string;
  /** 关联执行岗位 ID 数组 */
  normal_job_ids: (number | undefined)[];
  /** 关联执行岗位 名称 数组 */
  normal_job_names?: string[];
}
