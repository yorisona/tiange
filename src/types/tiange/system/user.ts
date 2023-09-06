/**
 * 系统设置 - 用户管理
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-30 13:54:52
 */
import type { PaginationParams } from '@/types/base/pagination';
import type { BusinessTypeEnum } from '@/types/tiange/common';

/**
 * 系统设置 - 用户管理 - 查询参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-30 13:55:29
 */
export interface UserListQueryParams extends PaginationParams {
  /** 搜索类型 1---手机号, 2---花名 */
  search_type?: number;
  /** 搜索值 */
  search_value?: string;
  /** 状态 1---正常, 2----停用 */
  is_checked?: number;
  /** 部门ID */
  department_id?: number;
  /** 岗位ID */
  job_id?: number;
  /** 业务类型 1---营销业务, 2---淘宝店铺 */
  business_type?: BusinessTypeEnum;
  /** 部门ID */
  department_ids?: string;
  /** 岗位名称 */
  job_name?: string;
  /** 岗位名称 */
  user_id?: number;
}

export interface UserListFilterForm extends PaginationParams {
  /** 搜索类型 1---手机号, 2---花名 */
  search_type: number;
  /** 搜索值 */
  search_value: string;
  /** 状态 1---正常, 2----停用 */
  is_checked: number | '';
  /** 部门ID */
  department_id: number | '';
  /** 岗位ID */
  job_id: number | '';
  /** 业务类型 1---营销业务, 2---淘宝店铺 */
  business_type: BusinessTypeEnum | '';
  /** 部门ID */
  department_ids?: number[];
  /** 岗位名称 */
  job_name: string;
}
