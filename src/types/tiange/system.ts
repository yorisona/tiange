/**
 * 系统(全局)
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-12 13:44:20
 */
import { DateStr } from '../base/advanced';

/**
 * 部门信息
 * @author  tingzhu
 * @since   2020-12-12 13:51:25
 */
export interface DepartmentInfo {
  add_by: number;
  dep_level: number;
  department_name: string;
  flag: number;
  gmt_create: string;
  gmt_modified: string;
  id: number;
  modified_by: number;
  superior_dep_id: number;
}

/**
 * 用户信息
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-12 13:51:25
 */
export interface UserInfo {
  /** ID */
  id: number;
  /** 用户头像 */
  avatar: string;
  /** 业务类型 */
  business_type: number[];
  /** ?? */
  is_checked: number;
  /** 创建时间 */
  gm_create: DateStr;
  /** 修改时间 */
  gm_modified: DateStr;
  /** 最后登录时间 */
  last_login_time: number;
  /**  */
  modified_by_id: number;
  /** OA用户ID */
  os_user_id: number;
  /** 手机号 */
  phone: string;
  /** 角色ID */
  role: number;
  /** 角色信息 */
  role_info: {
    /** 部门 */
    department: string;
    /** 角色code */
    role_code: number;
    /** 角色名称 */
    role_name: string;
  }[];
  /** 权限code */
  user_rights: number[];
  /** 用户名 */
  username: string;
  /** 工号 */
  work_id: string;
  /** 部门ID */
  department_id: number;
  /** 部门名称 */
  department_name: string;
  job_id: number;
  /** 岗位信息 */
  job_info: {
    /** 添加人 */
    add_by: number;
    /** flag */
    flag: number;
    /** 创建时间 */
    gmt_create: string;
    /** 修改时间 */
    gmt_modified: string;
    /** ID */
    id: number;
    /** 岗位级别 */
    job_level: number;
    /** 岗位名称 */
    job_name: string;
    /** 修改人 */
    modified_by: number;
  };
  /** 岗位名称 */
  job_name: string;
  /** OA 用户 ID*/
  oa_user_id: number;
  /** 部门信息 */
  department_info?: DepartmentInfo;
  /** 创建时间 */
  gmt_create: string;
  /** 最后登录时间 */
  last_login_time_str: string;
}

/**
 * 审批状态
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-13 21:48:03
 */
export enum ApprovalStatus {
  /** 待审批 */
  Pending = 1,
  /** 审批成功 */
  Normal = 2,
  /** 审批失败 */
  Failure = 3,
  /** 审批中 */
  Processing = 4,
  /** 已作废 */
  Invalid = 5,
}
/**
 * 合同扫描件上传状态
 */
export enum ContractScanFlagStatus {
  /** 待审批 */
  Yes = 0,
  /** 审批成功 */
  No = 1,
  /** 已驳回 */
  Reject = 2,
}

/**
 * 合同状态
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-12 10:29:38
 */
export const ApprovalStatusMap = new Map<ApprovalStatus, string>([
  [ApprovalStatus.Pending, '待审批'],
  [ApprovalStatus.Normal, '审批成功'],
  [ApprovalStatus.Failure, '审批失败'],
  [ApprovalStatus.Processing, '审批中'],
  [ApprovalStatus.Invalid, '已作废'],
]);
/**
 * 合同扫描件上传状态
 */
export const ContractScanFlagMap = new Map<ContractScanFlagStatus, string>([
  [ContractScanFlagStatus.Yes, '未上传'],
  [ContractScanFlagStatus.No, '已上传'],
  [ContractScanFlagStatus.Reject, '已驳回'],
]);

/**
 * * 合同状态选项
 * ! 待审批不显示
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-12 10:29:21
 */
export const ApprovalStatusOptions = [
  ApprovalStatus.Normal,
  ApprovalStatus.Failure,
  ApprovalStatus.Processing,
  ApprovalStatus.Invalid,
].map(el => ({ value: el, label: ApprovalStatusMap.get(el) ?? '' }));

export const ContractScanFlagOptions = [
  ContractScanFlagStatus.Yes,
  ContractScanFlagStatus.No,
  ContractScanFlagStatus.Reject,
].map(el => ({ value: el, label: ContractScanFlagMap.get(el) ?? '' }));

/**
 * 元素权限
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-29 23:41:12
 * @deprecated
 */
export interface ElementRight {
  /** label */
  label: string;
  /** 权限码 */
  value: number;
}

/**
 * 权限节点
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-29 23:41:34
 */
export interface RightNode {
  /** 权限树层级 */
  level: number;
  /** 权限码 */
  right_code: number;
  /** 权限节点名称 */
  right_name: string;
  /** 父节点权限码 */
  superior_code: number;
  /** 附加的权限码列表，包含自身权限码和全部子孙节点权限码 */
  all_code?: number[];
}

/**
 * 权限树
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-05 16:22:43
 */
export interface RightTree extends RightNode {
  /** 子节点 */
  children: RightTree[];
}

/**
 * 权限树原始数据
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-06 13:43:19
 */
export interface RightTreeOriginal extends RightNode {
  /** 子节点 */
  sub_nodes: RightTreeOriginal[];
}
