/**
 * 营销业务-导入日志
 * @author  wuyou <wuyou@goumee.com>
 * @since   2021-04-12 11:41:00
 */

import { PaginationParams } from '@/types/base/pagination';

export interface ImportLogDetail {
  add_item: string[];
  failed_item: string[];
  update_item: string[];
}

export interface MarketingImportLog {
  /** ID */
  id: number;

  /** 文件名称 */
  file_name: string;

  /** 操作模块 */
  operate: string;

  /** 状态 */
  status: string;

  /** 导入结果 */
  result: string;

  /** 导入人 */
  operator: string;

  /** 导入时间 */
  upload_date: string;

  /** 文件地址 */
  upload_file_path: string;

  /** 导入详情 */
  result_detail?: any[] | ImportLogDetail;
}

export interface MarketingImportLogQueryParams extends Required<PaginationParams> {
  /** 导入人 */
  operator?: string;

  /** 状态 */
  status?: number;

  /** date range */
  date_range?: string;

  /** 开始时间 */
  start_time?: string;

  /** 结束时间 */
  end_time?: string;
}
