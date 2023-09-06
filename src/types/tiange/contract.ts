/**
 * 合同
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-20 10:13:45
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=75
 */

import { DateStr, GmtTimeFields } from '../base/advanced';
import { PaginationParams } from '../base/pagination';
import { PlatformCodes } from './kol';

/**
 * 获取合同编号请求参数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-20 10:22:20
 * @prop {number} partner_type 1---客户合同 2---供应商合同
 * @prop {number} partner_id 客户或供应商 ID
 * @prop {number} contract_status 合同状态 1---待审批 2---审批成功 3---审批失败 4---审批中 5---已作废
 * @prop {number} flag 标识，非空字符串
 * @prop {number} search 合同编号模糊搜索
 */
export interface ContractUidQueryParams {
  /** 1---客户合同 2---供应商合同 */
  partner_type: 1 | 2;
  /** 客户或供应商 ID */
  partner_id?: number;
  /** 合同状态 1---待审批 2---审批成功 3---审批失败 4---审批中 5---已作废 */
  contract_status?: ApprovalStatus;
  /** 标识，非空字符串 */
  flag?: string;
  /** 合同编号模糊搜索 */
  search?: string;
  /** 合同类型 */
  contract_type?: ContractType;
  /** 所属项目 **/
  project_id?: number;
  /** 项目类型, 1-店播业务，2-营销业务 */
  project_type?: number;
}

/**
 * 合同编号
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-20 10:25:18
 * @prop {number} contract_id ID
 * @prop {string} contract_uid 编号
 */
export interface ContractUid {
  /** ID */
  contract_id: number;
  /** 编号 */
  contract_uid: string;
}

/**
 * 合同查询参数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-23 23:54:22
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=75&itf=311
 * @prop {number} id 合同ID
 * @prop {number} sale_chance 销售机会平台 1---小红书 2---微信公众号 3---新浪微博 4---抖音 5---快手 6---哔哩哔哩 7---淘宝直播 8---一直播 9---淘宝图文 10---淘宝短视频 11---线下场地搭建 12---线下视觉设计 13---活动策划执行
 * @prop {number} contract_type 合同类型 1---销售合同 2---框架协议 3---供应商合同
 * @prop {number} contract_status 合同状态 1---待审批 2---审批成功 3---审批失败 4---审批中  5---已作废
 * @prop {number} manager_id 客户经理ID
 * @prop {string} contract_uid 合同编号
 * @prop {number} is_recycled 合同是否已收回 0---未收回 1---已收回
 * @prop {string} partner_name 客户名称
 * @prop {number} partner_type 1---客户合同 2---供应商合同
 * @prop {string} last_annex_status 最新添加的合同附件状态 1---待审批 2---审批成功 3---审批失败 4---审批中  5---已作废
 */
export interface ContractQueryParams extends PaginationParams {
  cooperation_id?: number | string | undefined;
  project_id?: number | string | undefined;
  /** 合同ID */
  id?: number;
  /** 销售机会平台 */
  sale_chance?: PlatformCodes | '';
  /** 合同类型 1---销售合同 2---框架协议 3---供应商合同 */
  contract_type?: number;
  /** 合同状态 1---待审批 2---审批成功 3---审批失败 4---审批中 5---已作废 */
  contract_status?: ApprovalStatus;
  /** 客户经理ID */
  manager_id?: number;
  /** 合同编号 */
  contract_uid?: string;
  /** 合同是否已收回 0---未收回 1---已收回 */
  is_recycled?: number;
  /** 客户名称 */
  partner_name?: string;
  /** 1---客户合同 2---供应商合同 */
  partner_type?: number;
  /** 最新添加的合同附件状态 1---待审批 2---审批成功 3---审批失败 4---审批中 5---已作废 */
  last_annex_status?: string;
  /** 合作结束时间 */
  coop_end_date?: string;
  /** 业务类型 **/
  business_type?: number;
  /** 公司id */
  company_id?: number;
  /** 是否剔除已过期合同 */
  is_pass_expired?: boolean;
  /** 是否剔除关联合同 */
  is_pass_associated?: boolean;
  /** 根据关联关系进行排序 */
  is_order_by_relation?: boolean;
  /** 公司名称搜索 */
  company_name?: string | undefined;
  /** 隐藏已失效 */
  is_hide_invalid_data?: number | undefined;
}

/**
 * 合同查询表单
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-23 23:54:22
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=75&itf=311
 * @prop {number} id 合同ID
 * @prop {number} sale_chance 销售机会平台 1---小红书 2---微信公众号 3---新浪微博 4---抖音 5---快手 6---哔哩哔哩 7---淘宝直播 8---一直播 9---淘宝图文 10---淘宝短视频 11---线下场地搭建 12---线下视觉设计 13---活动策划执行
 * @prop {number} contract_type 合同类型 1---销售合同 2---框架协议 3---供应商合同
 * @prop {number} contract_status 合同状态 1---待审批 2---审批成功 3---审批失败 4---审批中  5---已作废
 * @prop {number} manager_id 客户经理ID
 * @prop {string} contract_uid 合同编号
 * @prop {number} is_recycled 合同是否已收回 0---未收回 1---已收回
 * @prop {string} partner_name 客户名称
 * @prop {number} partner_type 1---客户合同 2---供应商合同
 * @prop {string} last_annex_status 最新添加的合同附件状态 1---待审批 2---审批成功 3---审批失败 4---审批中  5---已作废
 */
export interface ContractQueryForm extends Required<PaginationParams> {
  sign_type?: number;
  /** 业务类型 */
  business_type?: number;
  /** 销售机会平台 */
  sale_chance?: PlatformCodes | '';
  /** 合同类型 1---销售合同 2---框架协议 3---供应商合同 */
  contract_type?: number;
  /** 合同状态 1---待审批 2---审批成功 3---审批失败 4---审批中 5---已作废 */
  contract_status?: number;
  /** 客户经理ID */
  manager_id?: number;
  /** 合同编号 */
  contract_uid?: string;
  /** 合同是否已收回 0---未收回 1---已收回 */
  is_recycled?: number;
  company_name?: string;
  /** 客户名称 */
  partner_name?: string;
  /** 1---客户合同 2---供应商合同 */
  partner_type?: number;
  /** 最新添加的合同附件状态 1---待审批 2---审批成功 3---审批失败 4---审批中  5---已作废 */
  last_annex_status?: string;
  /** 创建人名称 */
  add_by_name?: string;
  /** 合作结束时间 */
  coop_end_date?: string;
  /** 供应商名称 */
  provider_name?: string;
  /** 合同扫描件 0未上传 1上传 */
  contract_scan_flag?: number;
  /** 项目名称*/
  project_name?: string;
  /** 项目uid*/
  project_uid?: string;
  /*签约类型*/
  contract_sign_type?: number;
  /*收费类型*/
  pay_type?: number;
  /*执行状态*/
  execute_status?: number;
}

/**
 * 合同类型
 * @prop {number} Sales 1---销售合同
 * @prop {number} Framework 2---框架合同
 * @prop {number} Purchase 3---供应商-采买合同
 * @prop {number} SupplierFramework 4---供应商-框架合同
 */
export enum ContractType {
  /** 客户-销售合同 */
  Sales = 1,
  /** 客户-框架合同 */
  Framework = 2,
  /** 供应商-采买合同 */
  Purchase = 3,
  /** 供应商-框架合同 */
  SupplierFramework = 4,
  /** 客户合同 */
  ServiceContract = 5,
  /** 供应商合同 */
  SupplierContract = 6,
  /** 主播合同 */
  AnchorContract = 7,
}

import { ApprovalStatus } from '@/types/tiange/system';

export enum ContractScanStatus {
  // 0-初始状态
  initial = 0,
  //  1-待审核
  waiting,
  //  2--通过
  passed,
  // 3--驳回
  refused,
}

/**
 * 合同
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-24 00:05:51
 */
export interface Contract extends GmtTimeFields {
  associate_contracts?: Array<string>;
  associate_contract_count?: number;
  getMoneytype?: string;
  contractMoney?: string;
  contractCommission?: string;
  contractOtherMoney?: string;
  /** 如果是营销项目 返回 */
  cooperation_id?: number;
  // 项目合同详情页，使用 project_relation 中的数据对应列表中的 创建及审批状态
  project_relation: {
    // 关联类型，1->创建时关联，2->手动关联
    relation_type: number;
    // 审批状态
    relation_status: ApprovalStatus;
    // 创建人名称
    add_by: number;
    // 创建人名称
    add_by_name: string;
    // 创建时间
    create_time_str: string;
  };
  /** 合同其它附件 */
  contract_annex_info: {
    add_by: number;
    /** 审批金额 */
    approval_amount: number;
    attachment_url: string;
    attachment_url_list: string[];
    comment: string;
    /** 附件审批状态 */
    contract_annex_status: ApprovalStatus;
    /** 附件审批状态-文本 */
    contract_annex_status_str: string;
    contract_annex_todo_str: string;
    contract_annex_type: number;
    contract_id: number;
    department: number;
    flag: number;
    id: number;
    manager_id: number;
    modified_by: number;
    partner_id: number;
    partner_name: string;
  }[];
  //
  contract_annex_work_infos: {
    comment: string;
    create_time: number;
    create_time_str: DateStr;
    id: number;
    next_opration: number;
    next_user_id: number;
    pre_node_id: number;
    result: number;
    result_str: string;
    user: string;
    user_id: number;
    work_id: number;
    work_type: number;
  }[];
  /** 合同详情 */
  contract_detail: {
    add_by: number;
    attachment_url: string;
    /** 合同附件列表 */
    attachment_url_list: {
      file_name: string;
      url: string;
    }[];
    /** 合同金额 */
    contract_amount: string;
    contract_id: number;
    discount: string;
    flag: number;
    id: number;
    modified_by: number;
    num: number;
    price: string;
    remark?: string;
    unit: number;
    unit_str: string;
    contract_scan_urls: Array<
      {
        url: string;
        file_name: string;
      } & Partial<GmtTimeFields>
    >;
  };
  project_contract_relation_type: number | null; //(1, '新增关联') (2, '关联已有')
  /** 项目列表 */
  project_infos: {
    project_name: string;
    project_id: number;
    project_uid: string;
  }[];
  /** 合同信息 */
  contract_info: {
    cooperative_sign_type?: E.supplier.CooperativeSignType;
    /** 主播审批流程的部门名称 */
    approval_department_name?: string;
    anchor_id?: undefined;
    approver_name?: undefined;
    project_name?: undefined;
    template_info?: undefined;
    /*合同编码*/
    contract_id?: undefined;
    /** 业务类型 */
    business_type?: BusinessTypeEnum;
    /** 创建人ID */
    add_by: number;
    company_id: number | undefined;
    company_name: string;
    /** 创建人 */
    add_by_name: string;
    /** 创建人部门 */
    add_by_department: string;
    approve_time: number;
    approver_id: number;
    /** 合同状态 */
    contract_status: ApprovalStatus;
    /** 合同状态 */
    contract_status_str: string;
    contract_todo_str: string;
    /** 合同类型 1---销售合同 2---框架合同 3---采买合同 */
    contract_type: ContractType;
    /** 合同类型-名称 */
    contract_type_str: string;
    /** 合同编号 */
    contract_uid: string;
    /** 创建时间 */
    create_time_str: DateStr;
    customer_name: string;
    /** 创建人部门ID */
    department: number;
    /** 创建人部门 */
    department_str: string;
    project_id?: number;
    flag: number;
    id: number;
    /** 是否收回 1---已收回 0---未收回 */
    is_recycled: number;
    /** 是否收回字符串 */
    is_recycled_str: string;
    last_annex_status: number;
    last_annex_status_str: string;
    manager_id: number;
    manager_name: string;
    invoice_content: string;
    modified_by: number;
    partner_id: number;
    sale_chance: {
      sale_chance_name: string;
      value: PlatformCodes;
    }[];
    /** 合作开始日期 */
    coop_start_date: string;
    /** 合作结束日期 */
    coop_end_date: string;
    /** 框架合同id */
    frame_contract_id: number | null;
    /** 框架合同编号 */
    frame_contract_uid: string;
    frame_contract_type?: number | null;
    /** 关联合同 */
    related_contracts: {
      /** 关联合同编号 */
      contract_uid: string;
      id: number;
    }[];
    /** OA request id 有则从OA拉审批流程数据 */
    oa_request_id?: number;
    feishu_request_id?: number;
    /** 店铺ID **/
    shop_id?: number;
    /** 店铺名称 **/
    shop_name?: string;
    contract_scan_status: ContractScanStatus | undefined;
  } & GmtTimeFields;
  contract_work_infos: {
    comment: string;
    create_time: number;
    create_time_str: DateStr;
    id: number;
    next_opration: number;
    next_user_id: number;
    pre_node_id: number;
    result: number;
    result_str: string;
    user: string;
    user_id: number;
    work_id: number;
    work_type: number;
  }[];
  /** 合作方信息(客户/供应商) */
  partner_info: {
    /** 合作方(客户/供应商)ID */
    id: number;
    /** 合作方(客户/供应商)名称 */
    partner_name: string;
    /** 店铺名称 */
    shop_name: string;
  };
  /** 收款信息 */
  proceeds_plan: Array<
    {
      add_by: number;
      contract_id: number;
      flag: number;
      id: number;
      invoice_amount: string;
      modified_by: number;
      obtained_amount: string;
      proceeds_amount: string;
      proceeds_plan_date: string;
      proceeds_plan_date_str: string;
      to_obtain_amount: string;
    } & GmtTimeFields
  >;
  /** 结算单信息 */
  contract_statements_list: {
    /** 结算单附件列表 */
    attachment_url_list: string[];
    /** 结算单状态 */
    contract_statements_status: ApprovalStatus;
    /** 结算单状态 */
    contract_statements_status_str: string;
  }[];
  template_info?: {
    // 主播信息
    anchor_info: KeyValue[];
    // 关联机构信息
    company_info: KeyValue[];
    // 我方信息
    our_info: KeyValue[];
    // 合作内容
    cooperation_content: KeyValue[];
    // 合作期限
    cooperation_duration: KeyValue[];
    // 收付款条件
    pay_condition: KeyValue[];
    // 保证金
    margin: KeyValue[];
    // 其它
    others: KeyValue[];
    extend_contract_info?: KeyValue[];
    othersMap: Record<string, any>;
    pay_conditionMap: Record<string, any>;
    // 是否填写了保证金
    hasMargin: boolean;
    frontend_data: any;
    // 是否有试合作期
    // hasTryCooperation: boolean;
  };
  settlement_info:
    | {
        // 实收
        receivable_write_off_amount: number | undefined;
        // 应收
        receivable_amount: number | undefined;
        // 实付
        payable_write_off_amount: number | undefined;
        // 应付
        payable_amount: number | undefined;
      }
    | undefined;
  allow_update_contract_scan_user_ids: number[] | undefined;
}
interface KeyValue {
  key: string;
  value: string;
}
// * 新增/修改合同

/**
 * 收款计划
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-25 14:37:11
 * @prop {number} id 收款计划ID
 * @prop {string} proceeds_plan_date 计划收款日期
 * @prop {number} proceeds_amount 收款金额
 * @prop {string} obtained_amount 已收金额
 * @prop {number} to_obtain_amount 待收金额
 * @prop {number} invoice_amount 已开票金额
 * @prop {number} is_delete 0---不删除 1---删除
 */
export interface ProceedsPlan {
  /** 收款计划ID */
  id?: number;
  /** 计划收款日期 */
  proceeds_plan_date: string;
  /** 收款金额 */
  proceeds_amount: number;
  /** 已收金额 */
  obtained_amount: string;
  /** 待收金额 */
  to_obtain_amount: number;
  /** 已开票金额 */
  invoice_amount: number;
  /** 0---不删除 1---删除 */
  is_delete?: number;
}
/**
 * 新增/编辑合同请求参数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-25 14:15:25
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=75&itf=309
 * @prop {number} id 合同ID
 * @prop {string} contract_uid 合同编号
 * @prop {string} partner_id 合同对应合作方ID
 * @prop {ContractType} contract_type 合同类型
 * @prop {string[]} sale_change 销售机会
 * @prop {string} num 数量
 * @prop {number} unit 单位 1---场 2---次
 * @prop {string} price 标准单价(元)
 * @prop {string} discount 折扣
 * @prop {string} contract_amount 合同金额
 * @prop {string | string[]} attachment_url 附件url
 * @prop {FormProceedsPlan[]} proceeds_plan 收款计划
 * @prop {string} frame_contract_id 框架合同ID(框架附属合同需要)
 * @prop {string} coop_start_date 合作开始日期
 * @prop {string} coop_end_date 合作结束日期
 */
export interface ContractSaveParams {
  /** 合同ID */
  id?: number;
  /** 合同编号 */
  contract_uid: string;
  /** 店铺id */
  partner_id: number | undefined;
  company_id: number | undefined;
  /** 合同类型 */
  contract_type: ContractType;
  /** 销售机会 */
  sale_chance: string[];
  /** 数量 */
  num?: string;
  /** 单位 1---场 2---次 */
  unit?: number;
  /** 标准单价(元) */
  price?: string;
  /** 备注 */
  remark?: string;
  /** 折扣 */
  discount?: string;
  /** 合同金额 */
  contract_amount?: string;
  /** 附件url */
  attachment_url?: string[];
  /** 收款计划 */
  proceeds_plan?: FormProceedsPlan[];
  /** 框架合同ID(框架附属合同需要) */
  frame_contract_id?: number;
  /** 合作开始日期 */
  coop_start_date?: string;
  /** 合作结束日期 */
  coop_end_date?: string;
  /** 店铺名称(客户合同) */
  shop_name?: string;
  /** 客户公司名称(客户合同) */
  customer_company_name?: string;
  /** 供应商名称(供应商合同) */
  supplier_name?: string;
  /** 项目编号 **/
  project_id?: string;
  /** 营销业务项目id **/
  cooperation_id?: string;
}

export interface FormProceedsPlan {
  /** 收款计划ID */
  id?: number;
  /** 计划收款日期 */
  proceeds_plan_date: string;
  proceeds_plan_date_str?: string;
  /** 收款金额 */
  proceeds_amount: string;
  /** 已收金额 */
  obtained_amount: string;
  /** 待收金额 */
  to_obtain_amount: string;
  /** 已开票金额 */
  invoice_amount: string;
  /** 0---不删除 1---删除 */
  is_delete?: number;
}

/**
 * 合同表单
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-25 14:52:21
 */
export interface ContractForm {
  /** 合同ID */
  id?: number;
  /** 合同编号 */
  contract_uid: string;
  /** 合同对应合作方ID */
  partner_id: number | '' | undefined;
  company_id: number | undefined;
  /** 合同类型 */
  contract_type: ContractType;
  /** 销售机会 */
  sale_chance: number[];
  /** 数量 */
  num: string;
  /** 单位 1---场 2---次 */
  unit: number;
  /** 标准单价(元) */
  price: string;
  /** 折扣 */
  discount: string;
  /** 合同金额 */
  contract_amount: string;
  /** 附件url */
  attachment_url: string[];
  remark?: string;
  /** 收款计划 */
  proceeds_plan?: FormProceedsPlan[];
  /** 框架合同ID(框架附属合同需要) */
  frame_contract_id?: number;
  /** 合作日期 */
  coop_date: string[];
  /**  项目编号 */
  /** 项目编号 */
  project_id?: number;
  /** 当前项目id, project_id or cooperation_id */
  current_project_id?: string;
  /** 项目类型, 1-店播业务，2-营销业务 */
  project_type?: number;

  /** 公司名称 */
  customer_company_name?: string;

  /** 店铺名称 */
  shop_name?: string;
}

/**
 * 合同表单
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-25 14:52:21
 */
export interface ContractSettlement {
  /** 合同ID */
  contract_id?: number;
  contract_company_name?: string;
  company_name?: string;
  /** 合同编号 */
  contract_uid?: string;
  /** 合同对应合作方ID */
  partner_id?: number | string | undefined;
  partner_name?: string | undefined;
  company_id?: number | undefined;
  contract_status?: number;
  /** 合同类型 */
  contract_type?: ContractType;
  /** 项目类型, 1-店播业务，2-营销业务 */
  project_type?: number;
  /** 公司名称 */
  sign_type?: number | string;
  sign_type_name?: string;
  coop_end_date?: string;
  coop_start_date?: string;
  last_annex_status?: number | string;
  invoice_content?: string;
}

/**
 * 合同附件查询参数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-26 11:48:32
 * @prop {string} manager_id 客户经理ID
 * @prop {string} contract_annex_status 合同附件状态
 * @prop {string} contract_annex_type 合同附件类型 1---客户 2---供应商
 * @prop {string} contract_uid 合同编号
 * @prop {string} partner_name 客户或供应商名称
 * @prop {number} contract_id 合同ID
 */
export interface ContractAnnexQueryParams extends Required<PaginationParams> {
  /** 客户经理ID */
  manager_id?: string;
  /** 合同附件状态 */
  contract_annex_status?: string;
  /** 合同附件类型 1---客户 2---供应商 */
  contract_annex_type?: number;
  /** 合同编号 */
  contract_uid?: string;
  /** 客户或供应商名称 */
  partner_name?: string;
  /** 合同ID */
  contract_id?: number;
}

/**
 * 用章情况
 * @prop 1---不用印章
 * @prop 2---公章
 * @prop 3---合同章
 */
export enum SealType {
  /** 不用印章 */
  Type1 = 1,
  /** 公章 */
  Type2 = 2,
  /** 合同章 */
  Type3 = 3,
}

export const SealTypeMap = new Map([
  [SealType.Type1, '不用印章'],
  [SealType.Type2, '公章'],
  [SealType.Type3, '合同章'],
]);

export const SealTypeOptions = [
  { label: '公章', value: SealType.Type2 },
  { label: '合同章', value: SealType.Type3 },
  { label: '不用印章', value: SealType.Type1 },
];

/**
 * 合同附件
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-26 11:55:54
 */
export interface ContractAnnex {
  contract_annex_info: {
    /** 添加人ID */
    add_by: number;
    /** 添加人部门 */
    add_by_department: string;
    /** 添加人 */
    add_by_name: string;
    /** 审批金额 */
    approval_amount: number;
    /**
     * 附件地址
     * 同 attachment_url
     */
    annex_list: string[];
    annex_num: number;
    /**
     * 附件地址 `annex_list` 的原始值
     * @deprecated 不建议使用
     */
    attachment_url: string;
    /** 申请内容 */
    comment: string;
    contract_annex_id: number;
    /**
     * ```
     * 附件审批状态
     * pending 1---待审批
     * normal 2---审批成功
     * failed 3---审批失败
     * approving 4---审批中
     * invalid 5---已作废
     * ```
     */
    contract_annex_status: ApprovalStatus;
    contract_annex_status_str: string;
    contract_annex_todo_str: string;
    contract_annex_type: number;
    contract_annex_type_str: string;
    /** 合同ID */
    contract_id: number;
    /** 合同类型 */
    contract_type: number;
    department: number; //
    flag: number; //
    /** ID */
    id: number;
    manager_id: number;
    modified_by: number;
    partner_id: number;
    partner_name: string;
    /** 用章情况 1---不用印章 2---公章 3---合同章 */
    seal_type: SealType | null;
  } & GmtTimeFields;
  contract_annex_work_infos: {
    comment: string;
    create_time: number;
    create_time_str: DateStr;
    id: number;
    next_opration: number;
    next_user_id: number;
    pre_node_id: number;
    result: number;
    result_str: string;
    user: string;
    user_id: number;
    work_id: number;
    work_type: number;
  }[];
  /** 合同信息 */
  contract_info: {
    /** 合同ID */
    contract_id: number;
    /** 合同编号 */
    contract_uid: string;
  };
}

/**
 * 新增合同附件
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-26 16:42:46
 */
export interface ContractAnnexSaveParams {
  /** 合同ID */
  contract_id: number;
  /** 审批金额 */
  approval_amount: string;
  /** 申请内容 */
  comment?: string;
  /** 附件URL */
  attachment_url: string[];
  /** 客户经理ID */
  manager_id?: number;
  /** 所属部门 */
  department?: string;
  /** 合作对象ID */
  partner_id: number;
  /** 合作方名称 */
  partner_name: string;
  /** 合同附件类型(即合作对象类型) 1---客户 2---供应商 */
  contract_annex_type: number;
  /** 合同类型 */
  contract_type: ContractType;
  /** 用章情况 */
  seal_type: SealType;
}

/**
 * 新增合同附件表单
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-26 17:25:00
 */
export interface ContractAnnexForm {
  /** 合同ID */
  contract_id: number | '';
  /** 审批金额 */
  approval_amount: string | '';
  /** 申请内容 */
  comment: string;
  /** 附件URL */
  attachment_url: string[];
  /** 客户经理ID */
  manager_id?: number | '';
  /** 所属部门 */
  department?: string;
  /** 合作对象ID */
  partner_id: number | '';
  /** 合作方名称 */
  partner_name: string;
  /** 合同附件类型(即合作对象类型) 1---客户 2---供应商 */
  contract_annex_type: number;
  /** 合同类型 */
  contract_type: ContractType;
  /** 用章情况 */
  seal_type: SealType;
  /** 当前项目id, project_id or cooperation_id */
  current_project_id?: string;
  /** 项目类型, 1-店播业务，2-营销业务 */
  project_type?: number;
}

/**
 * 根据合同编号获取合作方及合同
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-26 19:53:52
 * @prop {number} partner_type 合作方类型 1---客户 2---供应商
 * @prop {string} contract_uid 合同编号
 */
export interface GetPartnerByUidParmas {
  /** 合作方类型 1---客户 2---供应商 */
  partner_type: number;
  /** 合同编号 */
  contract_uid: string;
  /** 合同类型 */
  contract_type?: ContractType;
  /** 店播业务项目id */
  project_id?: string;
  /** 项目类型 1-店播业务，2-营销业务*/
  project_type?: number;
}

/**
 * 根据合同编号获取合作方及合同 - 返回
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-26 19:57:48
 * @prop {number} contract_id 合同ID
 * @prop {number} contract_status 合同状态
 * @prop {string} contract_uid 合同编号
 * @prop {number} partner_id 合作方ID
 * @prop {string} partner_name 合作方名称
 */
export interface GetPartnerByUidRecord {
  /** 合同ID */
  contract_id: number;
  /** 合同状态 */
  contract_status: number;
  /** 合同编号 */
  contract_uid: string;
  /** 合作方ID */
  partner_id: number;
  /** 合作方名称 */
  partner_name: string;
  /** 合同类型 **/
  contract_type: number;
}

/**
 * 合同结算单列表请求参数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-27 13:05:37
 */
export interface SettlementListQueryParams extends PaginationParams {
  contract_id: number;
}

import { ApprovalStatus as ContractStatementsStatus } from '@/types/tiange/system';
import { BusinessTypeEnum } from './common';
export { ApprovalStatus as ContractStatementsStatus } from '@/types/tiange/system';

/** * 结算单审批状态 */
export const ContractStatementsStatusMap = new Map([
  [ContractStatementsStatus.Pending, '待审批'],
  [ContractStatementsStatus.Normal, '审批成功'],
  [ContractStatementsStatus.Failure, '审批失败'],
  [ContractStatementsStatus.Processing, '审批中'],
  [ContractStatementsStatus.Invalid, '作废'],
]);

/**
 * 结算方式
 * @prop {number} Way1 1---对公银行
 * @prop {number} Way2 2---支付宝
 * @prop {number} Way3 3---V任务
 * @prop {number} Way4 4---淘宝联盟
 * @prop {number} Way5 5---巨量百应
 */
export enum SettleWay {
  /** 对公银行 */
  Bank = 1,
  /** 支付宝 */
  Alipay = 2,
  /** V任务 */
  VTask = 3,
  /** 淘宝联盟 */
  Alimama = 4,
  /** 巨量百应 */
  Buyin = 5,
  /** 自动发起审批 */
  Auto = 6,
}

export const SettleWayMap = new Map([
  [SettleWay.Bank, '对公银行'],
  [SettleWay.Alipay, '支付宝'],
  [SettleWay.VTask, 'V任务'],
  [SettleWay.Alimama, '淘宝联盟'],
  [SettleWay.Buyin, '巨量百应'],
]);

export const SettleWayOptions = [
  { value: SettleWay.Bank, label: '对公银行' },
  { value: SettleWay.Alipay, label: '支付宝' },
  { value: SettleWay.VTask, label: 'V任务' },
  { value: SettleWay.Alimama, label: '淘宝联盟' },
  { value: SettleWay.Buyin, label: '巨量百应' },
];

/**
 * 结算单明细
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-27 17:18:47
 */
export interface SettlementDetail {
  /** 待收金额/待付金额 */
  wait_amount: number | string;
  /** 已收金额/已付金额 */
  done_amount: number | string;
  /** 已开发票金额/已收发票金额 */
  invoice_amount: number | string;
  /** 结算金额 */
  settle_amount: number | string;
  /** 结算方式 1---对公银行 2---支付宝 3---V任务 4---淘宝联盟 5---巨量百应 */
  settle_way: SettleWay;
  /** 店铺名称 */
  shop_name: string;
  /** 开始日期 */
  start_date: string;
  /** 结束日期 */
  end_date: DateStr;
  /** 旺旺号 */
  wangwang_num: string;
  /** 备注 */
  remark: string;
}

/**
 * 合同结算单
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-27 13:07:50
 */
export interface Settlement extends GmtTimeFields {
  project_id: number;
  /** 创建人 */
  add_by: number;
  /** 创建人所属部门 */
  add_by_department: string;
  /** 创建人 */
  add_by_name: string;
  /** 审批金额 */
  approval_amount: number;
  /** 附件url */
  attachment_url: string;
  /** 申请内容 */
  comment: string;
  /** 合同ID */
  contract_id: number;
  /** 结算单审批状态 1---待审批 2---审批成功 3---审批失败 4---审批中 5---已作废 */
  contract_statements_status: number;
  /** 合同类型 */
  contract_type: ContractType;
  /** flag */
  flag: number;
  /** ID */
  id: number;
  /** 修改人 */
  modified_by: number;
  /** 客户/供应商ID */
  partner_id: number;
  /** 用章情况 */
  seal_type: SealType;
  /** 结算单明细 */
  settlement_detail: SettlementDetail[];
  end_date: number;
  start_date: number;
}

/**
 * 合同结算单保存参数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-27 15:37:23
 */
export interface ContractStatementsSaveParams {
  /** 合同ID */
  contract_id: number;
  /** 审批金额 */
  approval_amount: string;
  /** 申请内容 */
  comment: string;
  /** 附件 url */
  attachment_url: string;
  /** 合作方ID */
  partner_id: number;
  /** 合作方客户/供应商名称 */
  partner_name: string;
  /** 合同类型 */
  contract_type: ContractType;
  /** 用章 */
  seal_type: number;
  /** 结算单明细 */
  settlement_detail: SettlementDetail[];
  project_type?: number;
  current_project_id?: string;
}

/**
 * 结算单表单
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-27 19:15:33
 */
export interface ContractStatementsForm {
  /** 合同ID */
  contract_id: number | '';
  /** 审批金额 */
  approval_amount: string;
  /** 申请内容 */
  comment: string;
  /** 附件 url */
  attachment_url: string[];
  /** 合作方ID */
  partner_id: number | '';
  /** 合作方客户/供应商名称 */
  partner_name: string;
  /** 合同类型 */
  contract_type: ContractType;
  /** 用章 */
  seal_type: SealType;
  /** 结算单明细 */
  settlement_detail: SettlementDetail[];
  /** 当前项目id, project_id or cooperation_id */
  current_project_id?: string;
  /** 项目类型, 1-店播业务，2-营销业务 */
  project_type?: number;
}

/**
 * 保存合同扫描件参数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-14 09:58:52
 */
export interface ContractScanSaveParams {
  /** 合同ID */
  contract_id: number;
  /** 附件地址 */
  contract_scan_urls: string[];
  /** 批量更新/单个追加 0---批量更新 1---单个追加 */
  save_for_update: number;
}

/**
 * 删除合同扫描件参数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-14 17:51:15
 */
export interface ContractScanDeleteParams {
  /** 合同ID */
  contract_id: number;
  /** 附件地址 */
  contract_scan_urls: string[];
}

export const SignTypeMap = new Map([
  [1, '单次合同'],
  [2, '框架合同'],
  [4, '合作协议'],
  [-1, '补充协议'],
  // [0, '续签合同'],
  [-3, '解除协议'],
  [-4, '结算协议'],
  [11, '销售合同'],
  [12, '采买合同'],
]);
export const SignTypeOptions = [
  { value: 1, label: '单次合同' },
  { value: 2, label: '框架合同' },
  { value: 4, label: '合作协议' },
  { value: -1, label: '补充协议' },
  // { value: 0, label: '续签合同' },
  { value: -3, label: '解除协议' },
  { value: -4, label: '结算协议' },
  { value: 11, label: '客户销售合同' },
  { value: 12, label: '供应商采买' },
];
export const PayConditionMap = new Map([
  [0, '其它'],
  [1, '固定服务费'],
  [2, '固定服务费+佣金'],
  [3, '纯佣金'],
]);
