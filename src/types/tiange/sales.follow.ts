/**
 *@description: 销售管理
 *@author: 棠棣
 *@since: 2021/1/20 16:28
 */
import { PaginationParams } from '../base/pagination';
import { DateStr } from '@/types/base/advanced';

export interface SalesFollowQueryParams extends Required<PaginationParams> {
  /** 业务类型 */
  business_type?: number | '';
  /** 任务状态 */
  status?: number | '';
  /** 客户意向 */
  customer_intention?: number | '';
  /** 任务搜索-关键字 */
  search_value?: string;
  /** 任务搜索-类型 */
  search_type?: string;
  /** 客户经理 */
  customer_manager?: string | number | '';
  /** 客户名称 */
  customer_name?: string | number | '';
  /** 任务编号 */
  mission_no?: string | number | '';
}

export interface CustomerFollowList {
  /** 任务编号 */
  mission_no: number | string;
  /** 客户名称 */
  customer_name: string;
  /** 客户意向 */
  customer_intention: number;
  /** 客户经理 */
  customer_manager: string;
  /** 客户情况 */
  customer_info: string;
  /** 跟进时间 */
  follow_time: DateStr;
  /** 下次跟进 */
  next_time: DateStr;
  /** 业务类型 */
  business_type: number;
  /** 任务状态 */
  status: number;
  /** 任务id */
  id: number | string;
}

/** 任务状态 */
export enum TaskStatusTypeEnum {
  /** 跟进中 */
  process = 0,
  /** 已达成 */
  reached = 2,
  /** 已关闭 */
  closed = 1,
}
export const TaskStatusTypeMap = new Map([
  [TaskStatusTypeEnum.process, '跟进中'],
  [TaskStatusTypeEnum.reached, '已合作'],
  [TaskStatusTypeEnum.closed, '已关闭'],
]);

/** 客户意向 */
export const CustomerIntentionMAP = new Map([
  [1, '标三'],
  [2, '方案'],
  [3, '重点'],
  [4, '预测'],
]);

/** 新增跟进任务--客户名称 */
export interface SalesFollowAddCustomer {
  /** 客户id */
  customer_uid: number | '';
  /** 客户名称 */
  customer_name: number | string | '';
}

/** 新增跟进任务--客户名称 */
export interface CustomerAddForm {
  /** 客户id */
  customer_uid: number | '';
  /** 客户名称 */
  customer_name: string;
  /** 联系人 */
  contact_name: string | '';
  /** 备注 */
  remark: string | '';
  /** 预估金额 */
  estimate_money: string | number | '';
  /** 业务类型 */
  business_type: number;
  /** 客户意向 */
  customer_intention: number;
  /** 预计到账时间 */
  estimate_time: string | '';
  /** 手机号 */
  phone: string | number | '';
  /** 微信号 */
  wechat: string | number | '';
  /** 跟进时间 */
  follow_time: string | '';
  /** 下次跟进时间 */
  next_time: string | '';
  /** 客户情况 */
  customer_info: string | '';
  /** 客户经理 */
  customer_manager: string;
}
