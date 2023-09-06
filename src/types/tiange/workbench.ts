/**
 * 工作台
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-17 11:52:12
 */
import { DateStr, GmtTimeFields } from '../base/advanced';
import { PaginationParams } from '../base/pagination';
import { ApprovalStatus } from './system';
import { APPROVAL_TYPE } from './workbench.enum';

/**
 * 审批人员
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-17 11:54:19
 */
export interface ApprovalUser {
  /** 角色code */
  role_code: number;
  /** 审批人员ID */
  user_id: number;
  /** 名字 */
  username: string;
}

/**
 * 审批流程
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-17 11:54:37
 */
export interface ApprovalStreamNode {
  /** 审批人员数组 */
  approval_user?: ApprovalUser[];
  /** 角色code */
  role_code: number;
  /** 角色名称 */
  role_name: string;
  /* 审批流程判断条件 >=100000 分管副总 >=500000 副总经理 */
  limit_amount: number;
}

/**
 * 审批流程请求参数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-17 12:25:29
 */
export interface ApprovalStreamQueryParams {
  approval_type?: APPROVAL_TYPE;
}

/**
 * 工作台查询类型
 *  1---待我审批
 *  2---我发起的
 *  3---我已审批
 */
export type ApprovalSearchType = 1 | 2 | 3;

/**
 * 审批单列表请求参数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-17 14:25:14
 */
export interface ApprovalListQueryParams extends PaginationParams {
  /** 工作台查询类型 1---待我审批, 2---我发起的, 3---我已审批 */
  approval_search_type: ApprovalSearchType;
  /** 审批查询类型 */
  approval_type?: APPROVAL_TYPE;
  /** 审批单编号 */
  approval_uid?: string;
  /** 最小发起时间 */
  start_time_min?: DateStr;
  /** 最大发起时间 */
  start_time_max?: DateStr;
  /** 最小结束时间 */
  end_time_min?: DateStr;
  /** 最大结束时间 */
  end_time_max?: DateStr;
  /** 审批状态 */
  approval_status?: ApprovalStatus;
}

/**
 * 审批单列表请求参数表单
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-18 01:30:42
 */
export interface ApprovalListQueryForm extends PaginationParams {
  /** 审批类型 */
  approval_type?: APPROVAL_TYPE;
  /** 审批单编号 */
  approval_uid: string;
  /** 发起时间 */
  start_time: DateStr[];
  /** 结束时间 */
  end_time: DateStr[];
  project_name: string;
  file_name: string;
  /** 审批状态 */
  approval_status?: ApprovalStatus;
}

/**
 * 发票类型
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-24 15:16:16
 * @prop    {number} 1---普通发票
 * @prop    {number} 2---专用发票
 * @prop    {number} 3---电子发票
 * @prop    {number} 4---收据
 */
export type InvoiceType = 1 | 2 | 3 | 4;

/**
 * 结算单用印三级类型
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-24 15:16:16
 * @prop    {number} 11---不用印
 * @prop    {number} 12---公章
 * @prop    {number} 13---合同章
 */
export type ThirdLevelType = 11 | 12 | 13;

/**
 * 发票类型Map
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-24 15:17:57
 */
export const InvoiceTypeMap = new Map([
  [1, '普通发票'],
  [2, '专用发票'],
  [3, '电子发票'],
  [4, '收据'],
]);

/**
 * 审批单(列表)
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-17 13:31:40
 */
export interface ApprovalRecord {
  /** 项目名称 */
  project_name: string;
  /** 审批单ID */
  approval_id: number;
  /** 审批单状态 */
  approval_status: ApprovalStatus;
  /** 审批单编号 */
  approval_uid: string;
  /** 当前审批用户名 */
  approval_username: string;
  /** 结束时间 */
  end_time: DateStr;
  /** 发起时间 */
  start_time: DateStr;
  /** 审批类型 */
  approval_type: APPROVAL_TYPE;
  /**
   * 子类型
   * ```
   * 发票类型
   *   1---普通发票
   *   2---专用发票
   *   3---电子发票
   *   4---收据
   * ```
   */
  level_two_types: number | InvoiceType;
  level_three_types: number | ThirdLevelType;
  /** 审批内容 */
  approval_content: {
    /** 申请部门 */
    create_department: string;
    /** 用款审批-金额 */
    transfer_amount: number;
    /** 用款审批-金额字符串 */
    transfer_amount_str: string;
    /** 用款日期 */
    transfer_date: DateStr;
    /** 申请人 */
    username: string;
    /** 退款审批-金额 */
    refund_amount: number;
    /** 退款审批-金额字符串 */
    refund_amount_str: string;
    /** 借款审批-金额 */
    borrowing_amount: number;
    /** 借款审批-金额字符串 */
    borrowing_amount_str: string;
    /** 开票审批-金额 */
    invoice_amount: number;
    /** 开票审批-金额字符串 */
    invoice_amount_str: string;
    /** 合同审批-金额 */
    contract_amount: number;
    /** 合同审批-金额字符串 */
    contract_amount_str: string;
  };
  approval_detail?: {
    file_name?: string;
  };
}

/**
 * 审批详情请求参数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-17 13:18:21
 */
export interface ApprovalInfoQueryParams {
  approval_id?: number;
  approval_uid?: string;
}

/**
 *@description: 审批详情请求参数(new)
 *@author: 棠棣
 *@since: 2021/8/19 14:35
 */

export interface ApprovalDetailQueryParams {
  approval_id: number;
}

/** Tiange审批流程 */
export interface TiangeApprovalStream {
  approval_date: DateStr;
  /** 审批结果 1---通过, 2---不通过 */
  approval_result: number;
  /** 索引 */
  index: number;
  /** 备注 */
  remark: string;
  /** 角色code */
  role_code: number;
  /** 角色名称 */
  role_name: string;
  /** 用户ID */
  user_id: number;
  /** 用户名(审批人) */
  username: string;
  /* 审批流程判断条件 >=100000 分管副总 >=500000 副总经理 */
  limit_amount: number;
}
/**
 * OA审批流程数据
 * 字段兼容天鸽审批流程数据
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-23 11:14:58
 */
export interface ApprovalFlowDetail extends TiangeApprovalStream {
  /** */
  annexDocHtmls: string;
  /** ID */
  id: string;
  /** 审批节点ID */
  nodeId: string;
  /** 审批节点名称 */
  nodeName: string;
  /** 日期 */
  operateDate: string;
  /** 时间 */
  operateTime: string;
  /** 审批结果 */
  operateType: string;
  /** */
  operatorDept: string;
  /** */
  operatorId: string;
  /** */
  operatorName: string;
  /** 审批人员 */
  receivedPersons: string;
  /** 备注 */
  remark: string;
  /** */
  signDocHtmls: string;
  /** */
  signWorkFlowHtmls: string;
  /** OA 拒绝理由 */
  oa_review_result: string;
}

/**
 * 审批单(详情)
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-17 13:18:46
 */
export interface ApprovalInfo extends GmtTimeFields {
  /** 创建人ID */
  add_by: number;
  /** 审批单ID */
  approval_id: number;
  /** 审批类型 */
  approval_type: APPROVAL_TYPE;
  /** 二级类型 */
  level_two_types: number;
  /** 三级类型 */
  level_three_types: number;
  /** 审批状态 1---审批中, 2---审批通过, 3---审批失败, 4---已撤销 */
  approval_status: ApprovalStatus;
  /** 审批流程 */
  approval_stream: TiangeApprovalStream[];
  /** 审批编号 */
  approval_uid: string;
  /** 申请部门 */
  create_department: string;
  /** 申请日期时间 */
  gmt_create_datetime: DateStr;
  /** 当前审批人ID */
  now_id: number;
  /** 备注 */
  remark: string;
  /** 当前的步骤 */
  steps: number;
  /** 用户名 */
  username: string;
  /** 关联合同ID */
  contract_id: number;
  /** 关联合同编号 */
  contract_uid: string;
  /** 用款 - 金额 */
  transfer_amount: number;
  /** 用款 - 金额字符串 */
  transfer_amount_str: string;
  /** 用款 - 用款日期 */
  transfer_date: DateStr;
  /** 用款 - 银行卡号 */
  bank_card_number: string;
  /** 用款 - 开户行 */
  bank_of_deposit: string;
  /** 用款 - 收款公司 */
  collecting_company: string;
  /** 用款 - 店铺名称 */
  collecting_shop_name: string;
  /** 用款 - 收款人 */
  collecting_person: string;
  /** 用款 - 支付宝账号 */
  alipay_account: string;
  /** 用款 - 付款事由 */
  pay_reason: string;
  /** 退款 - 退款金额 */
  refund_amount: number;
  /** 退款 - 退款金额字符串 */
  refund_amount_str: string;
  /** 退款 - 退款理由 */
  refund_reason: string;
  /** 退款 - 退款方式详情 */
  refund_way_detail: {
    /** 三级类型1 - v任务id */
    v_task_id: string;
    /** 三级类型1 - 旺旺名 */
    wangwang_name: string;
    /** 三级类型2 - 姓名 */
    name: string;
    /** 三级类型2 - 账号 */
    account: string;
    /** 三级类型3 - 银行卡号 */
    bank_card_number: string;
    /** 三级类型3 - 开户行 */
    bank_of_deposit: string;
    /** 三级类型3 - 公司名称 */
    company_name: string;
  };
  /** 借款 - 借款金额 */
  borrowing_amount: number;
  /** 借款 - 借款金额字符串 */
  borrowing_amount_str: string;
  /** 借款 - 借款理由 */
  borrowing_reason: string;
  /** 借款 - 公司名称 */
  company_name: string;
  /** 借款 - 店铺名称 */
  shop_name: string;
  /** 借款 - 回款金额 */
  back_amount: string;
  /** 借款 - 回款金额字符串 */
  back_amount_str: string;
  /** 借款 - 回款日期 */
  back_date: string;
  /** 借款 - 附件 */
  borrowing_apply_annex_list: string[];
  /** 借款 - 图片 */
  borrowing_apply_photo_list: string[];
  /** 业绩收款金额 */
  gather_amount?: number;
  /** 收款编号 */
  achievement_id?: number;
  /** 业绩uid */
  achievement_uid?: string;
  /** OA审批流程数据 */
  approval_flow_detail: ApprovalFlowDetail[];
  /** 业务类型 */
  cost_type?: number;
  /** 成本 */
  cost?: {
    /**所属项目*/
    project_id: string;
    /**费用金额*/
    price: string;
  }[];
  business_type?: string;
  /** 开票申请-款项是否收到 1---是 0---否 */
  is_received: number;
  /** 开票申请-收款时间/预计收款时间 */
  received_date: string;
  /** 开票申请-发票寄送方式： 1---快递 2---自行送达 */
  invoice_send_type: number;
  /** 开票金额 */
  invoice_amount: number;
  /** 开票金额 */
  invoice_amount_str: string;
  approval_detail?: {
    buyer_name: string;
    buyer_tax_number: string;
    create_id: number;
    invoice_code: string;
    invoice_date: string;
    invoice_id: number;
    invoice_number: string;
    is_certified: number;
    red_invoice_attachment_url: string;
    remark: string;
    total_amount: string;
    seller: string;
    invoice_remark: string;
  };
  department_name?: string | null;
}

/**
 * 用款申请单内流程节点
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-17 19:53:13
 * @deprecated 废弃天鸽审批流程，采用OA的，不再提交，纯展示
 */
export interface FormApprovalStreamNode {
  index: number;
  user_id: number;
  role_code: number;
}

/**
 * 用款申请单(参数|表单参数)
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-17 14:51:19
 */
export interface LoanParams {
  /** 申请单ID */
  approval_id?: number;
  /** 用款申请 */
  approval_type: 1;
  /** 成本安排类型 */
  level_two_types: 1;
  /** 收款方式 3---对公银行, 4---对公支付宝 */
  level_three_types: number;
  /** 银行卡号 */
  bank_card_number?: string;
  /** 开户行 */
  bank_of_deposit?: string;
  /** 收款公司 */
  collecting_company?: string;
  /** 收款店铺 */
  collecting_shop_name: string;
  /** 备注 */
  remark?: string;
  /** 用款金额 */
  transfer_amount: string;
  /** 用款日期 */
  transfer_date: DateStr;
  /**
   * 审批流程
   * @deprecated 废弃天鸽审批流程，采用OA的，不再提交
   */
  approval_stream: FormApprovalStreamNode[];
  // 新增
  /** 收款人 */
  collecting_person?: string;
  /** 支付宝账号 */
  alipay_account?: string;
  /** 付款事由 */
  pay_reason: string;
  /**  业务类型   */
  business_type: number;
  /** 成本类型 */
  cost_type: number;
  /** 成本 */
  cost: {
    /**所属项目*/
    project_id: string;
    /**费用金额*/
    price: string;
  }[];
}

/**
 * 更新审批单状态参数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-19 14:26:49
 * @prop {number} approval_id 审批单ID
 * @prop {number} remark 备注
 * @prop {number} update_code 审批结果 2---通过 3---失败 4---撤销
 */
export interface UpdateApprovalStatusParams {
  /** 审批单ID */
  approval_id: number;
  /** 备注 */
  remark?: string;
  /** 审批结果 2---通过 3---失败 4---撤销 */
  update_code: number;
}

// 退款
/**
 * 退款申请参数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-19 17:54:56
 *
 * ```
 * 当 `level_three_types` 1---v任务时
 * v_task_id/wangwang_name 必填
 * 当 `level_three_types` 2---支付宝时
 * account/name 必填
 * 当 `level_three_types` 3---对公银行时
 * bank_card_number/bank_of_deposit/company_name 为必填
 * ```
 */
export interface RefundParams {
  /** 审批单类型 2---退款申请 */
  approval_type: 2;
  /** 退款类型 1---业绩退款 */
  level_two_types: 1;
  /** 收款编号 */
  achievement_id: number;
  /** 退款金额 */
  refund_amount: string;
  /** 退款原因 */
  refund_reason: string;
  /** 备注 */
  remark: string;
  /** 审批流程 */
  approval_stream: FormApprovalStreamNode[];
  /** 退款方式 1---v任务 2---支付宝 3---对公银行 */
  level_three_types: number;
  /** v任务ID */
  v_task_id?: string;
  /** 旺旺名 */
  wangwang_name?: string;
  /** 账号 */
  account?: string;
  /** 姓名 */
  name?: string;
  /** 银行卡号 */
  bank_card_number?: string;
  /** 开户行 */
  bank_of_deposit?: string;
  /** 公司名称 */
  company_name?: string;
}

/**
 * 退款申请表单
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-20 11:52:22
 */
export interface RefundForm {
  /** 审批单类型 2---退款申请 */
  approval_type: 2;
  /** 退款类型 1---业绩退款 */
  level_two_types: 1;
  /** 收款编号 */
  achievement_id: number | '';
  /** 业绩UID */
  achievement_uid?: string;
  /** 业绩金额*/
  gather_amount: number | string;
  /** 退款金额 */
  refund_amount: string;
  /** 退款原因 */
  refund_reason: string;
  /** 备注 */
  remark: string;
  /** 审批流程 */
  approval_stream: FormApprovalStreamNode[];
  /** 退款方式 1---v任务 2---支付宝 3---对公银行 */
  level_three_types: number;
  /** v任务ID */
  v_task_id: string;
  /** 旺旺名 */
  wangwang_name: string;
  /** 账号 */
  account: string;
  /** 姓名 */
  name: string;
  /** 银行卡号 */
  bank_card_number: string;
  /** 开户行 */
  bank_of_deposit: string;
  /** 公司名称 */
  company_name: string;
}

export interface FeeDetail {
  project_id: string; // 项目id
  project_name?: string; //项目名称
  settlement_no: number; //结算单编号
  business_type?: number; // 结算金额
  invoice_amount: string; // 本次开票金额
  settlement_no_disabled?: boolean; // 是否已填写
  shop_id?: string;
}

/**
 * 开票申请表单
 * @author  xiaojin
 * @since   2021-08-16 11:38:22
 */
export interface Invoice {
  level_two_types: number;
  approval_type: number;
  invoice_amount: number;
  address: string;
  attachment?: string;
  bank_card_number: string;
  bank_of_deposit: string;
  collecting_company: string;
  details: FeeDetail[];
  invoice_send_type: number;
  is_received: number;
  phone: string;
  received_date: string;
  remark?: string;
  tax_number: string;
  content_type?: number;
  content_type_other?: string;
  seller?: string;
  invoice_remark?: string;
}

export enum UseSealApplyBusinessTypeEnum {
  /** 营销业务 */
  Marketing = 1,
  /** 淘宝店播 */
  shop_live_taobao,
  /** 抖音店播 */
  shop_live_douuyin,
  /** 区域业务 */
  area,
  /** MCN业务 */
  mcn,
  /** 煜丰投放 */
  yufeng_put,
  /** 本地生活 */
  shop_live_douuyin_shanghai,
  /** 其他 */
  other,
  /** 供应链 */
  supply_chain,
}

export interface UseSealApplyCommon {
  /** 是否外带 1：是 0：否 */
  is_take_out: number | undefined;
  /** 是否邮寄 1：是 0：否 */
  is_express: number | undefined;
  /** 合作方公司全称 */
  cooperation_company_name: string | undefined;
  /** 公司名称
1, '构美（浙江）信息科技有限公司'
2, '杭州煜丰电子商务有限公司'
3, '构美（浙江）信息科技有限公司上海分公司' */
  company_name_code: number | undefined;
  /** 非合同用印 - 印章名称
1, '公章'
2, '法人章'
3, '财务专用章'
4, '合同章' */
  seal_type: number | undefined;
  /** 涉及金额 */
  amount_involved: string | undefined;
  /** 所属事项
    1, '个人类型'
    2, '公司类型' */
  matter_type: number | undefined;
  /** 文件名 */
  file_name: string | undefined;
  /** 文件数量 */
  file_number: string | undefined;
  reason: string | undefined;
  /** 收件人 */
  addressee: string | undefined;
  /** 联系方式 */
  phone: string | undefined;
  /** 邮寄地址 */
  address: string | undefined;
  /** 邮寄时必填 寄件人/商务处理人 */
  sender: number | undefined;
  sender_name?: string;
  approval_id?: number;
  /** 附件 */
  attachment: string[] | undefined;
  /** 扫描件 */
  scan: string[] | undefined;
  /** 业务类型 */
  business_type: UseSealApplyBusinessTypeEnum | undefined;
}
export interface UseSealApplyForm extends UseSealApplyCommon {
  take_out_dates: number[] | undefined;
}

export interface UseSealApplyParams extends UseSealApplyCommon {
  /** 外带开始时间 */
  take_out_start_date: number | undefined;
  /** 外带结束时间 */
  take_out_end_date: number | undefined;
}

/**
 * 公司Map
 */
export const UseSealCompanyMap = new Map([
  [1, '构美（浙江）信息科技有限公司'],
  [2, '杭州煜丰电子商务有限公司'],
  [3, '构美（浙江）信息科技有限公司上海分公司'],
  [4, '杭州构美星耀科技有限公司'],
  [5, '杭州构茂科技有限公司'],
  [6, '杭州莱茂信息科技有限公司'],
]);

/**
 * 印章类型Map
 */
export const SealTypeMap = new Map([
  [1, '公章'],
  [2, '法人章'],
  [3, '财务专用章'],
  [4, '合同章'],
]);

/**
 * 所属事项类型Map
 */
export const UseSealMatterMap = new Map([
  [1, '个人类型'],
  [2, '公司类型'],
  [3, '结算单用印'],
]);

/**
 * 业务类型Map
 */
export const UseSealBusinessMap = new Map([
  [UseSealApplyBusinessTypeEnum.Marketing, '营销业务'],
  [UseSealApplyBusinessTypeEnum.shop_live_taobao, '淘宝店播'],
  [UseSealApplyBusinessTypeEnum.shop_live_douuyin, '抖音店播'],
  [UseSealApplyBusinessTypeEnum.area, '区域业务'],
  [UseSealApplyBusinessTypeEnum.mcn, '创新项目'],
  [UseSealApplyBusinessTypeEnum.yufeng_put, '煜丰投放'],
  [UseSealApplyBusinessTypeEnum.shop_live_douuyin_shanghai, '本地生活'],
  [UseSealApplyBusinessTypeEnum.supply_chain, '供应链'],
  [UseSealApplyBusinessTypeEnum.other, '其他'],
]);

export enum DouyinItemRecordStatus {
  /** 待执行 */
  watingExecute = 0,
  /** 执行中 */
  executing,
  /** 已完成 */
  finished,
  /** 执行失败 */
  failed,
}

export type DouyinItemRecordExportParams = PaginationParams;

export interface DouyinItemRecordExportModel {
  /** 导出选择的结束时间 */
  end_date: string | string;
  /** 异常提示 */
  error_log: string | undefined;
  /** 生成时间 */
  export_end_date: number | number;
  /** 导出文件地址 */
  export_file_url: string | undefined;
  first_tiange_cat_id: number | undefined;
  project_id: number | undefined;
  second_tiange_cat_id: number | undefined;
  /** 文件展示名称 */
  show_file_name: string | undefined;
  /** 导出选择的开始时间 */
  start_date: string | undefined;
  /** 任务状态 0->待执行；1->执行中；2->已完成；3->执行失败 */
  status: DouyinItemRecordStatus;
  third_tiange_cat_id: number;
  /** 操作人ID */
  user_id: number | undefined;
  /** 操作人花名 */
  user_name: string | undefined;
  /** 导出记录ID */
  id: number;
}
