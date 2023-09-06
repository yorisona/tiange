import { PaginationParams } from '../base/pagination';
import { ApprovalStatus } from './system';

export interface QueryUseSealsParams extends PaginationParams {
  // 申请人
  username: string | undefined;
  // 用印原因
  reason: string | undefined;
  // 审批状态
  approval_status: ApprovalStatus | undefined;
  // 申请日期
  apply_date_begin: string | undefined;
  apply_date_end: string | undefined;
}

export interface UseSealsFileModel {
  file_name: string | undefined;
  url: string | undefined;
}

export interface UseSealsModel {
  // 涉及金额
  amount_involved: number | undefined;
  // 审批状态
  approval_status: number;
  // 附件
  attachment: UseSealsFileModel[] | undefined;
  scan: UseSealsFileModel[] | undefined;
  scan_status: number | undefined;
  // 部门
  create_department: string | undefined;
  // id
  id: number;
  // 所属事项名称
  matter_name: string | undefined;
  matter_type: number | undefined;
  // 用印原因说明
  reason: string | undefined;
  // 印章类别名称
  seal_name: string | undefined;
  // 印章类别
  seal_type: number | undefined;
  // 申请日期
  start_time: string | undefined;
  // 申请人
  username: string | undefined;
}
