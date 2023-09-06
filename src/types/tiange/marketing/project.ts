/**
 * 成本安排表
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-23 13:43:18
 */

import { PaginationParams } from '@/types/base/pagination';
import { CostType, ReverseFields, WriteOffStatus } from '../finance/finance';
import { FinanceInvoiceBase, InoviceWriteOffStatusEnums } from '../finance/invoice';
import { Kol } from '../live';
import { MarketingProjectCooperationTypeEnum, ProjectCooperationStatusEnum } from './project.enum';

export interface PayWay {
  item_url: string;
  v_task_url: string;
  /** 用款审批id 对公银行时必传 */
  approval_id: string;
  /** 用款审批编号 对公银行时必传 */
  approval_uid: string;
  /** 银行卡号 对公银行时必传 */
  bank_card_number: string;
  /** 开户行 对公银行时必传 */
  bank_of_deposit: string;
  /** 收款公司 对公银行时必传 */
  collecting_company: string;
}

export interface VTask {
  /** v任务链接 */
  v_task_url: string | undefined;
  /** 商品链接 */
  item_url: string | undefined;
}

export interface PayWayDetail {
  /** 支付宝-帐号 */
  account: string;
  /** 支付宝-名称 */
  name: string;
  /** v任务-v任务id */
  v_task_id: string;
  /** v任务-旺旺名 */
  wangwang_name: string;
  /** 对公银行-银行卡号 */
  bank_card_number: string;
  /** 对公银行-公司名称 */
  company_name: string;
  /** 对公银行-开户行 */
  bank_of_deposit: string;
  /** v任务-商品链接 */
  item_url: string;
  /** v任务-v任务链接 */
  v_task_url: string;
  /** 银行卡-银行卡号 */
  bank_card_num: string;
  /** 银行卡-银行卡照片 */
  bank_card_pic: string;
  /** 银行卡-开户行 */
  bank_name: string;
  /** 银行卡-身份证照片 */
  id_card_pic: string;
  /** 银行卡-身份证号 */
  id_number: string;
  /** 银行卡-手机号 */
  phone: string;
  /** 银行卡-真实姓名 */
  real_name: string;
}

export interface InvoiceInfo {
  /** 发票金额 */
  amount: string;
  amount_str: string;
  /** 开票单位 */
  institution: string;
  /** 开票时间 */
  invoice_date: string;
  /** 发票号码 */
  invoice_num: number;
  /** 发票图片 */
  pic_url: string;
}

/** 营销项目付款 */
export interface Cost extends ReverseFields {
  /** 编号 */
  uid: string;
  payable_uid: any;
  /** 业绩名称 */
  achievement_name: string;
  /** 业绩等级金额 */
  achievement_gather_amount: number;
  /** 业绩编号 */
  achievement_uid: string;
  /** 创建人 */
  add_by: string;
  /** 创建人id */
  add_by_id: number;
  /** 关联审批id */
  approval_id: number | undefined;
  /** 关联审批编号（用款/退款） */
  approval_uid: string;
  /** 垫款审批单编号 */
  borrowing_uid: string;
  /** 业务类型 */
  business_type: number;
  /** 公司id */
  company_id: number;
  /** 公司名称 */
  company_name: string;
  /** 合同id */
  contract_id: number;
  /** 合作id */
  cooperation_id: number;
  /** 成本id */
  cost_id: number;
  /** 成本类型，1-关联业绩，2-借款 */
  cost_type: number;
  flag: number;
  /** 创建时间 */
  gmt_create: string;
  gmt_modified: string;
  /** 是否有合同 1---有 2---没有 */
  has_contract: number;
  invoice_certificate_pic: string;
  /** 发票信息 */
  invoice_info: InvoiceInfo[];
  /** 是否开票，0-否，1-是 */
  is_invoice: number;
  /** 是否打款，0是待打款，1是已打款，-1是待发起打款 */
  is_pay: number;
  /** kol是否个人，1-是，2-否 */
  is_personal: number;
  /**  */
  is_split: number;
  kol_id: number;
  /** 业务执行结束日期 */
  live_end_date: string;
  /** 业务执行开始日期 */
  live_start_date: string;
  modified_by_id: number;
  /** 成本类型, 1-人员工资，2-主播服务费，3-固定资产采购，4-水电，5-装修，6-房租, 7-营销成本， 8-返点 9---冲销 */
  new_cost_type: CostType;
  /** 备注 */
  note: string;
  /** 打款账户，1-时光机，2-玥每映像，3-构美子账户 */
  pay_account: number;
  /** 打款金额 */
  pay_amount: number;
  /** 实际打款日期 */
  pay_date: string;
  /** 打款凭证 */
  pay_certificate_pic: string;
  /** 打款日期 */
  // pay_date: string;
  /** 付款事由 */
  pay_reason: string;
  /** 付款类型, 1-成本，2-退款 */
  pay_type: number;
  /** 打款方式，((1:银行卡 2, 'v任务'), (3, '对公银行'), (4, '支付宝')) */
  pay_way: number;
  /** 项目id */
  project_id: number;
  /** 项目编号 */
  project_uid: string;
  /** 收款方信息 */
  pay_way_detail: PayWayDetail | VTask[];
  /** 客户名称 */
  shop_name: string;
  /** 税点金额 */
  tax_point: number;
  /** 用款日期 */
  transfer_date: number;
  /** 项目名称 */
  project_name: string;
  /** 主播名称 */
  kol_name: string;
  /** 合同编号 */
  contract_uid: string;
  /** 应付实付追加 */
  write_off_status: WriteOffStatus;
  payable_amount: number;
  not_write_off_amount: number;
  settlement_uid: string;
  id: number;
  write_off_infos: {
    settlement_uid: string;
    cost_id: string;
    cost_uid: string;
    write_off_amount: number;
    write_off_user: string;
    write_off_time: string;
    payable_uid: string;
  }[];
  create_date: string;
  payable_type?: number;
  refunded_amount: number;
  raw_cost_id: number;
  refund_write_off_infos: any;
  refund_write_off_info_items: any;
  refund_write_off_status: number;
  /** 是否发起了退款，发起退款被退回也为false */
  has_refund: boolean;
  //退款金额
  refund_amount: number;
}

export interface Company {
  company_id: number | undefined;
  company_name: string | undefined;
}

export interface CostStatInfo {
  /** 登记付款 */
  total_pay_amount: string;
  /** 已付款 */
  paid_amount: string;
  /** 待付款 */
  wait_pay_amount: string;
  payable?: number;
  write_off?: number;
  not_write_off: number;
}

export interface CostSchedule {
  data: Cost[];
  total: number;
  stat_info: CostStatInfo;
}

export interface CostScheduleShouldPayment {
  data: Cost[];
  total: number;
  stat_info: {
    payable: number;
    write_off: number;
    not_write_off: number;
  };
}

export interface CostScheduleShouldPayment {
  data: Cost[];
  total: number;
  payable: number;
  write_off: number;
  not_write_off: number;
}

export interface CostInfoParams {
  cost_id: number | undefined;
  /** 成本类型，1-关联业绩，2-借款 */
  cost_type: number;
  /** 合作id */
  cooperation_id: number | undefined;
  achievement_uid: string | undefined;
  /**  */
  kol_id: number | undefined;
  /** 机构id */
  company_id: number | undefined;
  company_name: string | undefined;
  /** 打款方式，1-银行卡，2-v任务 3-对公银行，4-对公支付宝 */
  pay_way: number;
  /** 打款金额（元） */
  pay_amount: string | number | undefined;
  /** 打款账户，1-时光机，2-玥每映像 */
  pay_account: number;
  /** 实际打款日期 */
  pay_date?: string;
  /** 打款日期，格式为2019-1-11 */
  transfer_date: string | undefined;
  /** 是否开票，0-否，1-是 */
  is_invoice: number | undefined;
  /** 税点金额 */
  tax_point: number | undefined;
  /**  */
  note: string | undefined;
  /** 是否个人，1-是，2-否 */
  is_personal: number;
  /**  */
  invoice_certificate_pic: string | undefined;
  /** 是否有合同,1：有；2：没有 */
  has_contract: number;
  /** 合同id，has_contract=1时必填 */
  contract_id: number | undefined;
  /** 业务执行开始时间 */
  live_start_date: string | undefined;
  /** 业务执行结束时间 */
  live_end_date: string | undefined;
  /** 借款审批单编号  借款时时必填 */
  borrowing_uid: string | undefined;
  /** 用款审批单id  借款时时必填 */
  approval_id: number | undefined;
  /** 合同编号 */
  contract_str: string | undefined;
  /** 合同附件，用,隔开 */
  // contract_annex: string | undefined;
  /** v任务信息列表，打款方式为v任务时必填 */
  v_task_list: VTask[];
}

// 返点
export interface RebateParams {
  /** 修改时必传 */
  cost_id: number | undefined;
  /** 合作id */
  cooperation_id: number | undefined;
  /** 业绩编号 */
  achievement_uid: string | undefined;
  /** 返点金额 */
  pay_amount: string | number | undefined;
  /** 银行卡号 */
  bank_card_num: string | undefined;
  /** 开户行 */
  bank_name: string | undefined;
  /** 真实姓名 */
  real_name: string | undefined;
  /** 身份证号 */
  id_number: string | undefined;
  /** 用款日期 */
  transfer_date: string | undefined;
  /** 身份证照片url */
  id_card_pic: string | undefined;
  /** 银行卡照片url */
  bank_card_pic: string | undefined;
  /** 电话号码 */
  phone: string | undefined;
}

/** 营销业务项目管理
 *      ┌─┐       ┌─┐ + +
 *   ┌──┘ ┴───────┘ ┴──┐++
 *   │                 │
 *   │       ───       │++ + + +
 *   ███████───███████ │+
 *   │                 │+
 *   │       ─┴─       │
 *   │                 │
 *   └───┐         ┌───┘
 *       │         │
 *       │         │   + +
 *       │         │
 *       │         └──────────────┐
 *       │                        │
 *       │                        ├─┐
 *       │                        ┌─┘
 *       │                        │
 *       └─┐  ┐  ┌───────┬──┐  ┌──┘  + + + +
 *         │ ─┤ ─┤       │ ─┤ ─┤
 *         └──┴──┘       └──┴──┘  + + + +
 *                神兽保佑
 *               代码无BUG!
 */

/**
 * 跟单AE
 */
export interface ProjectAe {
  /** id */
  ae_id: number | string;
  /** ae名称 */
  ae_name: string;
  /** 预计跟单金额 */
  expect_amount: number | string;
}

export interface BaseMarketingProject {
  /** 项目所属业务类型 */
  project__type?: 'marketing';
  /** 项目编号 */
  cooperation_uid: string;
  /** 项目名称 */
  cooperation_name: string;
  /** 品牌名称 */
  brand_name?: string;
  /** 品牌id */
  brand_id?: number;
  /** 客户名称 */
  company_name: string;
  /** 客户名称 */
  shop_name: string;
  /** 客户经理 */
  manager_name: string;
  /** 执行ae */
  ae: ProjectAe[];
  /** 项目阶段/合作状态/合作进度 1---意向客户 2---确定合作 3---执行项目 4---执行结束 5---数据入库 */
  cooperation_status: ProjectCooperationStatusEnum;
  /** 合作类型 */
  cooperation_type: MarketingProjectCooperationTypeEnum[];
  /** 是否收款 */
  is_gather?: 0 | 1;
  /** 预算 */
  budget?: number | string;
  /** uv */
  uv?: number | string;
  /** pv */
  pv?: number | string;
  /** gmv */
  gmv?: number | string;
  /** 销售额 */
  sale_amount?: number | string;
  /** 备注 */
  remark?: string | string;
  /** 备注 */
  note?: string | string;
  /** 回款日期 */
  gather_date?: number | string;
  /** 项目所属部门id */
  feishu_department_id: number | undefined;
  feishu_department_name: string | undefined;
}

/** 营销项目 */
export type MarketingProject = BaseMarketingProject;

export enum MarketingProjectSearchType {
  /** 项目名称 */
  cooperation_name = 1,
  /** 客户名称 */
  shop_name = 2,
  /** 项目编号 */
  cooperation_uid = 3,
  /** 客户经理 */
  customer_manager_name = 4,
  /** ae名称 */
  ae_name = 5,
}

export interface MarketingProjectQueryParams extends Required<PaginationParams> {
  search_type?: MarketingProjectSearchType;
  search_value?: string;
  cooperation_status?: ProjectCooperationStatusEnum;
  /** 合作类型 1---直播 2---视频 3---图文 */
  cooperation_type?: number;
  end_date?: string;
}

export interface MarketingProjectQueryForm extends Required<PaginationParams> {
  search_type: MarketingProjectSearchType | '';
  search_value: string;
  cooperation_status: ProjectCooperationStatusEnum | '';
  /** 合作类型 1---直播 2---视频 3---图文 */
  cooperation_type: 1 | 2 | 3 | '';
}

export interface MarketingProjectForm {
  /** 合作ID */
  cooperation_id?: number;
  /** 项目名称 */
  cooperation_name: string;
  /** 客户ID */
  company_id: string | number;
  /** 客户名称 */
  company_name: string;
  brand_id: number | undefined;
  /** 店铺ID */
  // company_shop_id?: string | number;
  /** 店铺名称 */
  // shop_name?: string;
  /** 客户ID */
  customer_id: number | string;
  /** 客户经理 */
  manager_id: number | string;
  /** 合作类型 1---直播 2---视频 3---图文 */
  cooperation_type: MarketingProjectCooperationTypeEnum[];
  /** 合作方案 文件列表 */
  plan?: string[];
  /** 预算 */
  budget?: string;
  /** uv */
  uv?: string;
  /** pv */
  pv?: string;
  /** gmv */
  gmv?: string;
  /** 销售额 */
  sale_amount?: string;
  /** 是否回款 0---否 1---是 */
  is_gather?: number | 1;
  /** 回款日期 */
  gather_date?: string;
  /** 备注 */
  remark?: string;
  /** 其他需求 */
  note?: string;
  /** 项目所属部门id */
  feishu_department_id: number | undefined;
  feishu_department_name: string | undefined;
  /** 归属主体 **/
  company_subject?: number;
}

export interface MarketingProjectFormAddCustomer {
  /** ID */
  id: number;
  /** 品牌名称 */
  brand_name: string;
  /** 店铺名称 */
  shop_name: string;
  /** 店铺类目 */
  category: number;
  /** 客户名称 */
  customer_name: number | string | string;
}

/** 客户类型
 * 1-同行机构
 * 2-广告公司
 * 3-品牌TP
 * 4-直客
 */
export enum MarketingProjectCompanyTypeEnum {
  peer_org = 1,
  ad_company = 2,
  brand_tp = 3,
  direct_guest = 4,
}

export const MarketingProjectCompanyTypeMap = new Map([
  [MarketingProjectCompanyTypeEnum.peer_org, '同行机构'],
  [MarketingProjectCompanyTypeEnum.ad_company, '广告公司'],
  [MarketingProjectCompanyTypeEnum.brand_tp, '品牌TP'],
  [MarketingProjectCompanyTypeEnum.direct_guest, '直客'],
]);

/** 客户分类:1:普通客户,2:重点客户,3:战略客户,4:KA客户 */
export enum MarketingProjectCustomerClassEnum {
  general_customer = 1,
  import_customer = 2,
  strategic_customer = 3,
  ka_customer = 4,
}

export const MarketingProjectCustomerClassMap = new Map([
  [MarketingProjectCustomerClassEnum.general_customer, '普通客户'],
  [MarketingProjectCustomerClassEnum.import_customer, '重点客户'],
  [MarketingProjectCustomerClassEnum.strategic_customer, '战略客户'],
  [MarketingProjectCustomerClassEnum.ka_customer, 'KA客户'],
]);

/** 意外终止后续类型 */
export enum MarketingProjectTerminateTypeEnum {
  /** 补播 */
  supplement_live = 1,
  /** 退款 */
  refund = 2,
  /** 其他 */
  other = 3,
}

export const MarketingProjectTerminateTypeMap = new Map([
  [MarketingProjectTerminateTypeEnum.supplement_live, '补播'],
  [MarketingProjectTerminateTypeEnum.refund, '退款'],
  [MarketingProjectTerminateTypeEnum.other, '其他'],
]);

export enum MarketingProjectEndTypeEnum {
  /** 正常结束 */
  normal = 1,
  /** 意外终止 */
  unexpected = 2,
}

/** 项目详情 */
export interface MarketingProjectDetail extends BaseMarketingProject {
  add_by_id: number;
  /** 店铺类目 */
  category: number;
  /** 客户分类  1---普通客户 2---重点客户 3---战略客户 4---KA客户 */
  customer_class: MarketingProjectCustomerClassEnum;
  /** 客户ID */
  customer_id: number | string;
  /** 客户经理 */
  customer_manager?: string;
  /** 合作ID */
  cooperation_id: number;
  /** 合作类型 1---直播 2---视频 3---图文 */
  cooperation_type: MarketingProjectCooperationTypeEnum[];
  /** 客户类型 1---同行机构 2---广告公司 3---品牌TP 4---直客 */
  company_type: MarketingProjectCompanyTypeEnum;
  /** 是否回款 0---否 1---是 */
  is_gather: 0 | 1;
  /** 回款日期 */
  gather_date: number;
  /** 公司名称 */
  company_name: string;
  /** 公司id */
  company_id: string;
  /** 备注 */
  note: string;
  /** 预算 */
  budget?: number | string;
  /** 合作方案 文件列表 */
  plan?: string[];
  /** pv */
  /** per uv */
  per_uv?: number;
  per_uv_str?: string;
  pv?: number | string;
  /** per pv */
  per_pv?: number;
  per_pv_str?: string;
  /** gmv */
  gmv?: number | string;
  /** 销售额 */
  sale_amount?: number | string;
  /** 销售额 */
  sale_amount_str?: string;
  /** 退款金额 */
  refund_total_amount: number;
  /** 退款金额 */
  refund_total_amount_str: string;
  /** 收款金额（元） */
  gather_amount: number;
  /** 收款金额（元） */
  gather_amount_str: string;
  /** 待收款金额 */
  wait_gather_amount: number;
  /** 待收款金额 */
  wait_gather_amount_str: string;
  /** 成本安排金额 (元) */
  cost_amount: number;
  cost_amount_str: string;
  /** roi */
  roi?: number;
  /** roi_str */
  roi_str?: string;
  /** 客户经理 ID */
  manager_id: number | '';
  /** 客户经理 名称 */
  manager_name: string;
  /** 结束类型 1---正常结束 2---意外终止 */
  end_type: MarketingProjectEndTypeEnum;
  /** 结束结果 */
  end_detail: {
    unexpected_terminate_detail?: string;
    unexpected_terminate_type?: number;
  };
  /** 合同ID */
  contract_id: number;
  /** 创建时间 */
  gmt_create?: number;
  business_type?: number;
  /** 结束时间 */
  end_time: number;
  /** 归属主体 **/
  company_subject?: number;
}

/** 营销业务项目 执行结束操作 */
export interface MarketingProjectConfirmEndForm {
  /** 合作ID */
  cooperation_id: number;
  /** 结束类型，1-正常结束，2-意外终止  */
  end_type: 1 | 2;
  /** 意外终止后续类型，1-补播，2-退款，3-其他 */
  unexpected_terminate_type: MarketingProjectTerminateTypeEnum;
  /** unexpected_terminate_type为1时，可以为空；为2时，为退款金额；为3时，为其他备注信息 */
  unexpected_terminate_detail?: string | number;
  /** 是否更新，0-否，1-是 */
  is_update: 0 | 1;
}

/**
 * 发起打款表单
 */
export interface MarketingStartPayForm {
  /** 主播 */
  kol: Kol | undefined;
  /** 业务执行日期 */
  start_end_date: string[];
  /** 打款日期 */
  pay_date?: string;
  /** v任务链接 */
  v_task_link?: string;
  /** v任务产品链接 */
  v_task_product_link?: string;
}

/**
 * 发起打款请求参数
 */
export interface MarketingStartPayParams {
  /** 付款id */
  cost_id: number | undefined;
  /** 打款方式 */
  pay_way: number | undefined;
  /** 主播 */
  kol_id: number;
  /** 业务执行开始日期 */
  live_start_date: string;
  /** 业务执行结束日期 */
  live_end_date: string;
  /** 打款日期 */
  transfer_date?: string;
  v_task_list?: {
    /** v任务链接 */
    v_task_url?: string;
    /** v任务产品链接 */
    item_url?: string;
  }[];
}

/**
 * 获取付款结算可用的供应商合同参数
 */
export interface QueryContractsParams {
  /** 项目id */
  project_id?: number;
  /** 业务类型 */
  business_type?: number;
  /** 合同编号 */
  contract_uid?: string;
}

/**
 * 查询可创建付款的成本结算单
 */
export interface SettlementForPayment {
  settlement_id: string | number | undefined;
  /** 已付金额 */
  paid_amount: number | undefined;
  /** 可付款金额 */
  pending_amount: number | undefined;
  /** 项目名 */
  project_name: string;
  /** 结算金额 */
  settlement_amount: string | number | undefined;
  /** 供应商名字 */
  company_name: string;
  /** 结算编号 */
  settlement_uid: string;
  pay_amount?: string;
  write_off_amount: string | number;
  write_off_status?: InoviceWriteOffStatusEnums;
  /** 关联发票列表 */
  invoice_info_list: FinanceInvoiceForPayment[] | undefined;
  settlement_files?: string[];
}

export interface FinanceInvoiceForPayment extends FinanceInvoiceBase {
  settlement_uid: string;
}
