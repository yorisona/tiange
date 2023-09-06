/**
 * 财务 - 结算单
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-18 17:53:03
 */
import type { PaginationParams } from '@/types/base/pagination';
import type { BooleanType, GmtTimeFields } from '@/types/base/advanced';
import { BusinessTypeEnum } from '../common';
import type { ReverseFields, ReverseType } from './finance';
import type { Option } from '@/types/components/options';
import { InoviceWriteOffStatusEnums, ProjectTypeEnum } from './invoice';

/** 手工调账 */
export interface AdjustInfoBase {
  /** 调账金额 */
  adjust_amount: string;
  /** 调账原因 */
  adjust_reason: string;
}

/** 手工调账 */
export interface AdjustInfo extends AdjustInfoBase {
  /** 主播ID */
  anchor_id?: string;
  kol_id?: number | string;
  kol_name?: string;
  real_name?: string;
  /** 选择机构 */
  company_id?: string | null;
  company_name?: string;

  type?: number;
  project_name?: string;

  /** 用于主播或机构的 筛选处理 */
  hidden_name?: string;
}

/** 手工调账(结算单/结算单详情) */
export interface AdjustInfoInSettlement extends AdjustInfoBase {
  /** 主播名称(成本结算) */
  kol_name?: string;
  /** 主播ID */
  kol_id?: number;
  /** 机构 */
  company_id?: string;
  /** 机构名称 */
  company_name?: string;
}

/**
 * 结算类型
 * ```
 * 1 --- 店铺代播 - 淘宝店播
 * 2 --- 店铺代播 - 抖音店播
 * 3 --- 营销业务 - 营销
 * 4 --- 通用业务 - MCN - 淘宝CPS
 * 5 --- 通用业务 - MCN - 抖音CPS
 * 6 --- 通用业务 - MCN - V任务
 * 7 --- 营销业务 - V任务
 * ```
 */
export enum SettlementType {
  /** 店铺代播 - 淘宝店播 */
  live_taobao = 1,
  /** 店铺代播 - 抖音店播 */
  live_douyin,
  /** 营销业务 - 营销 */
  marketing_marketing,
  /** 通用业务 - MCN - 淘宝CPS */
  common_mcn_taobao_cps,
  /** 通用业务 - MCN - 抖音CPS */
  common_mcn_douyin_cps,
  /** 通用业务 - MCN - V任务 */
  common_mcn_vtask,
  /** 营销业务 - V任务 */
  marketing_vtask,
  /** 自动结算 **/
  s2b2c_douyin_cps,
  /** s2b2c-其他 **/
  s2b2c_taobao_other,
  live_taobao_pick = 10,
  local_life = 11,
  /** 供应链 */
  supply_chain = 12,
}

/** 结算类型Map */
export const SettlementTypeMap = new Map([
  /** 店铺代播 - 抖音店播 */
  [SettlementType.live_douyin, '抖音店播'],
  /** 店铺代播 - 本地生活 */
  [SettlementType.local_life, '本地生活'],
  /** 店铺代播 - 淘宝店播 */
  [SettlementType.live_taobao, '淘宝店播'],
  /** 店铺代播 - 淘宝店播 */
  [SettlementType.live_taobao_pick, '淘宝甄选'],
  /** 营销业务 - 营销 */
  [SettlementType.marketing_marketing, '营销-营销'],
  /** 通用业务 - MCN - 抖音CPS */
  [SettlementType.common_mcn_douyin_cps, '创新项目-抖音'],
  /** 通用业务 - MCN - 淘宝CPS */
  [SettlementType.common_mcn_taobao_cps, '创新项目-淘宝CPS'],
  /** 通用业务 - MCN - V任务 */
  [SettlementType.common_mcn_vtask, '创新项目-V任务'],
  /** 营销业务 - V任务 */
  [SettlementType.marketing_vtask, '营销-V任务'],
  [SettlementType.s2b2c_douyin_cps, '创新项目-抖音CPS'],
  [SettlementType.s2b2c_taobao_other, '创新项目-其他'],
  [SettlementType.supply_chain, '供应链'],
]);
/** 结算类型Options */
export const SettlementTypeOptions: Required<Option<SettlementType>>[] = [
  { value: SettlementType.live_douyin, label: '抖音店播', group: '' },
  { value: SettlementType.local_life, label: '本地生活', group: '' },
  { value: SettlementType.live_taobao_pick, label: '淘宝甄选', group: '' },
  { value: SettlementType.supply_chain, label: '供应链', group: '' },
  { value: 4, label: '创新项目', group: '' },
  { value: 3, label: '整合营销', group: '' },
  { value: SettlementType.live_taobao, label: '淘宝店播', group: '' },
  /*{ value: SettlementType.common_mcn_douyin_cps, label: '创新项目-抖音', group: '创新项目' },
  { value: SettlementType.common_mcn_taobao_cps, label: '创新项目-淘宝CPS', group: '创新项目' },
  { value: SettlementType.s2b2c_douyin_cps, label: '创新项目-抖音CPS', group: '创新项目' },
  { value: SettlementType.common_mcn_vtask, label: '创新项目-V任务', group: '创新项目' },
  { value: SettlementType.s2b2c_taobao_other, label: '创新项目-其他', group: '创新项目' },
  { value: SettlementType.marketing_marketing, label: '营销-营销', group: '营销' },
  { value: SettlementType.marketing_vtask, label: '营销-V任务', group: '营销' },*/
];
/**
 * 结算状态
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-21 11:15:04
 * ```
 * 0---未提交
 * 1---待确认
 * 2---已确认
 * 3---退回
 * ```
 */
export enum SettlementStatus {
  /** 未提交 */
  unsubmit = 0,
  /** 待确认 */
  wait_confirm,
  /** 已确认 */
  confirmed,
  /** 退回 */
  refused,
  /** 待项目确认 */
  wait_project_confirm,
  /** 项目确认不通过 */
  nopass_project_confirm,
}

/**
 * 结算状态Map
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-21 15:02:12
 */
export const SettlementStatusMap = new Map([
  [SettlementStatus.unsubmit, '未提交'],
  [SettlementStatus.wait_confirm, '待确认'],
  [SettlementStatus.confirmed, '已确认'],
  [SettlementStatus.refused, '退回'],
  [SettlementStatus.wait_project_confirm, '待项目确认'],
  [SettlementStatus.nopass_project_confirm, '项目确认不通过'],
]);
/**
 * 结算状态Options
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-03 15:35:47
 */
export const SettlementStatusOptions = [
  { value: SettlementStatus.unsubmit, label: '未提交' },
  { value: SettlementStatus.wait_confirm, label: '待确认' },
  { value: SettlementStatus.confirmed, label: '已确认' },
  { value: SettlementStatus.refused, label: '退回' },
  { value: SettlementStatus.wait_project_confirm, label: '待项目确认' },
  { value: SettlementStatus.nopass_project_confirm, label: '项目确认不通过' },
];
/**
 * 结算步骤
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-21 11:18:27
 * ```
 * 0---发起结算
 * 1---结算数据
 * 2---财务确认
 * ```
 */
export enum SettlementStep {
  /** 步骤一 --- 发起结算 */
  step_one = 0,
  /** 步骤二 --- 结算数据 */
  step_two,
  /** 步骤三 --- 财务确认 */
  step_three,
}

/**
 * 结算种类
 * @prop {number} income 收入结算
 * @prop {number} cons 成本结算
 */
export enum SettlementKind {
  /** 收入结算 */
  income = 1,
  /** 成本结算 */
  cost,
}
/**
 * 结算操作
 */
export enum SettlementOneStepOperationEnum {
  /** 关闭 */
  close = 0,
  /** 上一步 */
  prev,
  /** 下一步/提交... */
  next,
}

/**
 * 结算列表查询参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-21 10:58:00
 */
export interface SettlementListQueryParams extends PaginationParams {
  /** 项目ID */
  project_id?: number;
  /** 业务类型 */
  business_type?: BusinessTypeEnum | number;
  /** 项目名称 */
  project_name?: string;
  /** 结算类型 */
  settlement_type?: SettlementType;
  /** 结算状态 */
  status?: SettlementStatus;
  /** 结算种类 */
  settlement_kind?: SettlementKind;
  /** 是否确认 */
  is_confirmed?: BooleanType;
  /** 是否已经发起成本结算标记 */
  is_initiate_cost_settlement?: BooleanType;
  /** 当前成本结算关联的收入结算ID */
  income_settlement_id?: number;
  /** 是否临时结算单(用于财务成本结算过滤临时结算单) */
  is_tmp?: BooleanType;
  /** 是否排除冲销单和被冲销单 */
  no_reverse?: BooleanType;
  /** 结算周期 */
  month?: string;
  account_month?: string;
  no_confirmed_reverse?: BooleanType;
  /** ((1, '营销业务'), (2, '淘宝店播'), (3, '抖音店播'), (4, '创新项目'), (5, '区域业务')) */
  project_type?: ProjectTypeEnum;

  /** 是否 暂估 */
  is_estimate?: 0 | 1;
  /** 是否隐藏已冲销数据*/
  is_hide_reverse_data?: number | undefined;
}

/**
 * 结算详情查询参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-09 15:45:16
 */
export interface SettlementDetailQueryParams {
  /** ID */
  id: number;
}

/**
 * 结算列表筛选项表单
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-03 15:14:46
 */
export interface SettlementListQueryForm extends PaginationParams {
  /** 项目名称 */
  project_name: string;
  /** 结算类型 */
  settlement_type: SettlementType | '';
  /** 结算状态 */
  status: SettlementStatus | '';
  /** 结算种类 */
  settlement_kind: SettlementKind | '';
  /** 是否确认 */
  is_confirmed: BooleanType | '';

  /** 搜索类型 */
  search_type: string;

  /** 搜索关键词 */
  search_value: string;

  /** 结算周期 */
  month: string;
  /** 账期时间 */
  account_month: string;
  /** 扫描件状态 */
  settlement_scan_status?: number | string | undefined;
}

/**
 * 收入结算文件数据
 */
export interface IncomeExcelDataItem {
  name: string;
  value: string;
}

/**
 * 工资类型
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-07 23:16:48
 */
export enum SalaryType {
  /** 时薪 */
  Hourly = 1,
  /** 底薪/提成(取高值) */
  Basic_or_commision,
  /** 底薪+提成 */
  Basic_and_commision,
}

export const SalaryTypeMap = new Map([
  [SalaryType.Hourly, '时薪'],
  [SalaryType.Basic_or_commision, '底薪/提成(取高的)'],
  [SalaryType.Basic_and_commision, '底薪+提成'],
]);

/**
 * 主播工资信息
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-07 23:11:58
 */
export interface KolSalaryInfo {
  /** ID */
  id: number;
  /** 结算ID */
  settlement_id: number;
  /** 主播ID */
  kol_id: number;
  /** 主播名称 */
  kol_name: string;
  /** 工资类型 */
  salary_type: SalaryType;
  /** 工资/提成 */
  salary: number;
  /** 开播时长 */
  live_duration: number;
  /** 单价 */
  unit_price: number;
  /** 底薪 */
  base_salary: number;
  /** 销售金额 */
  sale_amount: number;
  /** 收入金额 */
  income_amount: number;
  /** 提成比例 */
  commission_rate: number;
  /** 排班文件 */
  schedule_file: string;
}

export interface KOLInfo {
  /** 达人号(淘宝cps */
  daren_no?: string;
  /** 主播旺旺号(mcn-v任务 */
  wangwang_no?: string;
  /** 主播名称 */
  kol_name: string;
  /** 机构名称 */
  company_name: string;
  /** 对应业务线 */
  business_line: string;
  /** 收入 */
  income_amount: string;
  /** 支出(mcn-v任务 */
  spend_amount?: string;
  /** 退款金额 */
  tkje?: string;
  /** 机构扣点 */
  jgkd?: string;
  /** 税点 */
  sd?: string;
  /** 主播成本(不一定用得到,用于统计机构的成本 */
  zbcb?: string;
}

export interface CompanyInfo {
  /** 机构名称 */
  company_id: string;
  /** 机构名称 */
  company_name: string;
  /** 支出成本 */
  zccb: string;
  /** 原始收入 */
  yssr: string;
  /** 提成比例 */
  tcbl: string;
  /** 原始支出 */
  yszc: string;
  /** 退款金额 */
  tkje: string;
  /** 机构扣点 */
  jgkd: string;
  /** 税点 */
  sd: string;
  /** 结算总金额 */
  jszje: string;
  /** 服务费收取方式,1-百分比，2-固定金额 */
  fwfsqfs: string | number;
  /** 服务费百分比 */
  fwfbfb: string;
  /** 服务费 */
  fwf: string;
  /** 主播工资信息 */
  kol_salary_infos: KolSalaryInfoForm[];
  /** 主播数据 */
  excel_data: KOLInfo[];
  /** 主播服务费 */
  zbfwf: string;

  type: SettlementIncomeType | SettlementProjectType | undefined;
  file: string | undefined;
  income_amount: string | undefined;
  company_list:
    | {
        /** 机构名称 */
        company_id: string | number | undefined;
        /** 机构名称 */
        company_name: string | undefined;
        income_amount: string | undefined;
        remark: string | undefined;
        kol_name?: string;
        kol_id?: number | string;
      }[]
    | undefined;
  company_info_list: any[];
}

export interface CompanyData {
  /** 机构数据列表 */
  company_info_list: CompanyInfo[];
  //  招商结算-商品编码
  product_code?: string;
  //  招商结算-商品名称
  product_name?: string;
  /** 没有对应机构的主播名称 */
  nofind?: string[];
  /** 审核通过的主播/达人 */
  no_approved?: string[];
  /** 收入结算弹框 - 拆分后结算数据页面使用 */
  amount_info_list?: SettlementAmountInfo[];

  goods_id?: number;
}

/**
 * 收入结算MCN客户费用信息
 */
export interface SettlementAmountInfo {
  amount: string | number | undefined;
  file: string | undefined;
  remark: string | undefined;
  type: SettlementIncomeType;
  kol_ids?: number[];
  tax_balance?: any;
}

/**
 * 结算单开票申请 - 开票信息
 */
export interface SettlementBillCompanyDetail {
  /** 公司名称 */
  company_name: string | undefined;
  /** 纳税人识别号 */
  tax_id: string | undefined;
  /** 电话 */
  contact_phone: string | undefined;
  /** 公司电话 */
  cw_info_contact_phone: string | undefined;
  /** 开户支行 */
  bank_sub_name: string | undefined;
  /** 开户账号 */
  bank_account: string | undefined;
  /** 地址 */
  address: string | undefined;
  /** 开票内容 */
  content_type?: number | undefined | string;
  content_type_other?: string | undefined;
}

/**
 * 结算单
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-18 17:54:18
 */
export interface Settlement extends GmtTimeFields, ReverseFields, TaxAmountInfo {
  reverse_amount: number; // 已冲销金额
  settlement_scan_message?: string;
  settlement_scan_status?: number;
  settlement_scan_urls?: string[];
  coop_start_date?: string;
  coop_end_date?: string;
  sign_type_name?: string;
  contract_uid?: string;
  //关联合同ID
  contract_id?: number;
  /** ID */
  id: number;
  /** 结算单编号 */
  settlement_uid: string;
  /** 项目ID */
  project_id: number;
  /** 项目名称 */
  project_name: string;
  /** 业务类型 */
  business_type: BusinessTypeEnum;
  /** 收入类型、成本类型 */
  type: number;
  /**
   * 结算类型
   * ```
   * 1 --- 店铺代播 - 淘宝店播
   * 2 --- 店铺代播 - 抖音店播
   * 3 --- 营销业务 - 营销
   * 4 --- 通用业务 - MCN - 淘宝CPS
   * 5 --- 通用业务 - MCN - 抖音CPS
   * 6 --- 通用业务 - MCN - V任务
   * 7 --- 营销业务 - V任务
   * ```
   */
  settlement_type: SettlementType;
  /** 结算种类 */
  settlement_kind: SettlementKind;
  /** 结算状态 */
  status: SettlementStatus;
  /** 结算步骤 0---发起结算 1---结算数据 2---财务确认 */
  step: SettlementStep;
  /** 总结算金额 */
  total_settle_amount: number;
  /** 总时长 */
  total_duration: number;
  /** 总场次 */
  total_live_num: number;
  /** 佣金 */
  commission: number;
  /** 佣金比例 */
  commission_rate: number;
  /** 手工调账信息 */
  adjust_info: AdjustInfoInSettlement[];
  /** 单价 */
  unit_price: number;
  /** 收入金额 */
  income_amount: number;
  invoiced_amount: number;
  /** 收入文件 */
  income_file: string;
  /** 时长文件 */
  live_file: string;
  /** 订单文件 */
  order_file: string;
  /** 种草金额 */
  recommend_amount: number;
  /** 种草文件 */
  recommend_file: string;
  /** 上传文件的记录数 */
  record_count: number;
  /** 退货率 */
  refund_rate: number;
  /** 不通过原因 */
  refuse_reason: string;
  /** 销售金额 */
  sale_amount: number;
  /** 服务费 */
  service_amount: number;
  /** 营销/商广*/
  marketing_advertising_amount?: number;
  /** 结算单文件列表 */
  settlement_files: string[];
  /** 开始时间 */
  start_date: number;
  /** 结束时间 */
  end_date: number;
  /** 提交人ID */
  submit_by: number;
  /** 提交时间 */
  submit_time: number;
  /** 提交人 */
  submit_username: string;
  /** 录入人ID */
  add_by: number;
  /** 修改人 */
  modified_by: number;
  /** 确认人ID */
  confirmed_by: number;
  /** 确认人 */
  confirmed_username: string;
  /** 确认时间 */
  confirmed_time: number;
  /** flag */
  flag: number;
  /** 结算明细下载地址 */
  detail_file: string;
  /** excel具体数据 */
  excel_data: IncomeExcelDataItem[];
  /** 关联的收入结算ID(成本结算) */
  related_income_settlement_id: number;
  /** 结构ID */
  company_id: number;
  /** 机构名称 */
  company_name: string;
  /** 退款金额 */
  refund_amount: number;
  /** 支出 */
  spend_amount: number;
  /** 机构扣点 */
  buckle_point: number;
  /** 税点 */
  tax_point: number;
  /** 主播工资信息 */
  kol_salary_infos: KolSalaryInfo[];
  /** 原始结算单(拆分前)的ID, null 表示当前结算单不是拆分后的单据 */
  super_settlement_id: number | null;
  /** 是否临时结算单 */
  is_tmp: BooleanType;
  /** 机构数据(原始单据) ，成本结算单拆分之前 */
  json_data?: CompanyData;
  /** 成本原始数据 */
  new_json_data?: any[];
  /** 非临时结算单存储mcnv任务的主播数据 */
  formal_json_data: KOLInfo[];
  /** 主播数据 人数 */
  kol_count?: number;
  /** 原始收入 */
  original_income_amount: string;
  /** 原始支出 */
  original_spend_amount: string;
  /** 关联的收入结算单编号 */
  related_income_settlement_uid: string;
  /** 主播名称 */
  kol_name?: string;
  // /** 税额 */
  // tax_amount?: number;
  // /** 是否含税，0-否, 1-是 */
  // is_include_tax?: number;
  // /** 税率 */
  // tax_rate?: number;
  // /** 含税金额 */
  // tax_included_amount?: number;
  // /** 不含税金额 */
  // tax_excluded_amount?: number;

  /** 机构服务费 */
  company_service_amount?: number;
  /** 机构服务费率 */
  company_service_rate?: number;
  /** 主播服务费 */
  kol_service_amount?: number;
  /** 服务费收取方式  1 抽成(百分比)  2 固定费用 */
  company_service_type?: number;
  /** 是否暂估 */
  is_estimate: 0 | 1;
  /** 核销金额 */
  write_off_amount: string | number;
  /** 核销状态 */
  write_off_status: InoviceWriteOffStatusEnums | undefined;
  /** 合作类型, 1-自营，2-区域 */
  cooperation_type?: number;
  /** 已付金额 */
  paid_amount: number;
  /** 待付金额 */
  pending_amount: number;
  /** 未登记金额 */
  settlement_no_register_amount: number | undefined;
  // 收入结算的应收单未核销金额
  settlement_no_write_off_amount?: number;
  /** 收入结算弹框 - 拆分前结算数据页面使用 */
  company_info_json: {
    company_id: number | undefined;
    company_name: string | undefined;
    total_amount: number | undefined;
    adjust_info: AdjustInfoInSettlement[];
    amount_info_list: SettlementAmountInfo[];
  }[];

  shop_live_live_goods_id?: number;
  shop_live_info_id?: number;
  merchant_add_by_username?: string;
  merchant_income_amount?: string;
  project_income_amount?: string;
  company_detail?: SettlementBillCompanyDetail;
  refund_status?: number;
  refund_reason?: string;
  refund_back_reason?: string;
  feishu_department_name?: string;
  has_refund_settlement?: number;
  /** 开票总金额 */
  // total_invoice_amount: number | undefined;
  // 统一结算单
  unity_settlement_id?: number;
  project_feishu_department_id: number | undefined;
  project_feishu_department_name: string | undefined;
  /** 账期时间 */
  account_detail_date?: number;
  //是否盖章，2为公章，1不用印章
  seal_type?: number | null;
  //合同公司
  contract_company_name?: string;
  /** 收入类型 */
  income_type_str?: string;
  /** 成本类型 */
  cost_type_str?: string;
  /** 是否关联了实收，并可以冲销实收记录 */
  achievements_can_be_reversed?: boolean;
}

/**
 * 保存结算基本信息
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-24 13:24:52
 */
export interface SettlementStep1SaveParams {
  /** ID */
  id?: number;
  /** 业务类型 */
  business_type: BusinessTypeEnum;
  /** 项目ID */
  project_id: number;
  /** 结算类型 */
  settlement_type: SettlementType;
  /** 开始日期 */
  start_date: string;
  /** 结束日期 */
  end_date: string;
  /** 结算步骤 */
  step?: SettlementStep;

  /** 是否暂估 */
  is_estimate?: 0 | 1;
}

/**
 * 结算基本信息(步骤一)表单
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-24 13:26:49
 */
export interface SettlementStep1Frm {
  /** ID */
  id?: number;
  /** 业务类型 */
  business_type: BusinessTypeEnum;
  /** 结算类型 */
  settlement_type: SettlementType | '';
  /** 结算日期 */
  date: string[];

  /** 是否为暂估 */
  is_estimate: 0 | 1;

  /** 结算方式 */
  settlement_way?: string;

  /** 替换 结算周期 结算ID */
  settlement_replace_id?: string;
  settlement_replace_way?: number;
  //  DP月份选择
  dateMonth?: string;
}

/**
 * 收入结算信息 - 步骤二营销 - 表单
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-24 13:26:49
 */
export interface SettlementStep2MakettingFrm {
  /** 服务费 - 收入 */
  income_amount: string;
  /** 手工调账信息 */
  adjust_info: AdjustInfo[];
}

/**
 * 成本结算信息 - 步骤二营销 - 表单
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-24 13:26:49
 */
export interface SettlementCostStep2MakettingFrm {
  /** 服务费 - 支出 */
  spend_amount: string;
  /** 手工调账信息 */
  adjust_info: AdjustInfo[];
  /** 供应商company_id */
  company_id: string;
}

/**
 * 业务结算 结算数据 表单
 */
export interface SettlementShopLiveDataForm extends TaxAmountInfo {
  /** 单价 */
  unit_price?: string;
  /** 佣金比例 */
  commission_rate?: string;
  /** 退货率 */
  refund_rate?: string;
  recommend_file?: string;
  /** 销售金额 */
  sale_amount?: string;
  /** 服务费 */
  service_amount?: string;
  /** 营销/商广用*/
  marketing_advertising_amount?: string;
  /** 佣金 */
  commission?: string;
  recommend_live_time?: string;
  record_count?: string;
  order_file?: string;
  live_file?: string;
  /** 手工调账 */
  adjust_info?: AdjustInfo[];
  settlement_files?: string[];
  seal_type?: number | null;
  //业务类型
  business_type?: number | null;
}

/** MCN结算数据 表单 */
export interface SettlementMCNDataForm extends TaxAmountInfo {
  id: number;
  income_amount: number;
  income_file: string;
  total_settle_amount: number;
  settlement_type: SettlementType;
  adjust_info?: AdjustInfo[];
}

/** 发起结算 最终阶段 提交 */
export interface SettlementFinalForm {
  /** 结算单文件 */
  statements_files: string[];
}

/** 保存结算数据参数 */
export interface SettlementDataUnionParams extends TaxAmountInfo {
  /** id */
  id: number;
  /** 结算步骤，0-发起结算，1-结算数据, 2-财务确认 */
  step?: SettlementStep;
  /** 总结算金额 */
  total_settle_amount?: string;
  /** 服务费 */
  service_amount?: string;
  /** 营销/商广*/
  marketing_advertising_amount?: string;
  /** 单价 */
  unit_price?: string;
  /** 总场次 */
  total_live_num?: string;
  /** 总时长 */
  total_duration?: string;
  /** 佣金 */
  commission?: string;
  /** 佣金比例 */
  commission_rate?: string;
  /** 退货率 */
  refund_rate?: string;
  /** 种草金额 */
  recommend_amount?: string;
  /** 销售金额 */
  sale_amount?: string;
  /** 上传文件的记录数 */
  record_count?: string;
  /** 收入金额 */
  income_amount?: string | number;
  /** 种草文件 */
  recommend_file?: string;
  /** 订单文件 */
  order_file?: string;
  /** 收入文件 */
  income_file?: string;
  /** 手工调账信息 */
  adjust_info?: AdjustInfo[];
  /** 结算单文件 */
  settlement_files?: string[];
  /** 支出 */
  spend_amount?: string;
  json_data?: CompanyData;
  contract_id?: number;
  seal_type?: null | number;
}

/**
 * 收入结算信息 - 步骤二营销 - 保存参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-25 00:57:36
 * @extends SettlementDataUnionParams
 */
export interface SettlementStep2MakettingParams extends SettlementDataUnionParams {
  /** ID */
  id: number;
  /** 结算步骤 */
  step?: SettlementStep;
  /** 总结算金额 */
  total_settle_amount: string;
  /** 服务费 */
  income_amount: string;
  /** 手工调账信息 */
  adjust_info: AdjustInfo[];
}

/**
 * 收入结算信息 - 步骤二营销 - 保存参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-25 00:57:36
 * @extends SettlementDataUnionParams
 */
export interface SettlementCostStep2MakettingParams extends SettlementDataUnionParams {
  /** ID */
  id: number;
  /** 结算步骤 */
  step?: SettlementStep;
  /** 总结算金额 */
  total_settle_amount: string;
  /** 服务费 - 支出 */
  spend_amount: string;
  /** 手工调账信息 */
  adjust_info: AdjustInfo[];

  /** 供应商 company_id */
  company_id: string;
}

/**
 * 结算信息 - 步骤三营销 - 保存参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-25 00:57:36
 * @extends SettlementDataUnionParams
 */
export interface SettlementStep3MakettingParams extends SettlementDataUnionParams {
  /** ID */
  id: number;
  /** 结算步骤 */
  step?: SettlementStep;
  /** 结算当列表 */
  settlement_files?: string[];
  contract_id?: number;
}

/**
 * 结算信息 - 步骤三营销 - 表单
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-27 13:04:18
 */
export interface SettlementStep3MakettingFrm {
  /** 结算当列表 */
  settlement_files: string[];
  contract_id?: number;
  seal_type?: number | null;
}

/** 提交结算数据 参数 第三步 */
export interface SettlementSubmitParams {
  /** 结算ID */
  id: number;
  /** 结算单url列表 */
  settlement_files?: string[];
  contract_id?: number;
  seal_type?: number | null;
}

/**
 * 获取项目中已结算过的日期的查询参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-01 11:07:22
 */
export interface SettledDatesQueryParams {
  /** 项目ID */
  project_id: number;
  /** 业务类型 */
  business_type: BusinessTypeEnum;
  /** 结算ID， 新建场景不传 */
  settlement_id?: number;
}

export interface IncomeFileUploadResponseData {
  /** 总收入金额 */
  income_amount: number;
  /** 收入文件地址 */
  income_file: string;
  /** 结算明细下载地址 */
  detail_file: string;
  /** 具体数据 */
  excel_data: IncomeExcelDataItem[];
}

// ! 成本结算
/**
 * 成本结算 - 保存基本信息(步骤一)
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-10 10:19:48
 */

export interface SettlementCostBasicInfoSaveParams {
  /** 成本结算ID */
  id?: number;
  /** 结算类型 */
  settlement_type: SettlementType;
  /** 收入结算ID */
  related_income_settlement_id: number;

  /** 是否暂估 */
  is_estimate?: number;
  /** 业务类型 */
  business_type?: number;
}

/**
 * 成本结算
 */

export interface KolSalaryInfoForm {
  /** 主播 ID */
  id: string;
  /** 主播名称 */
  kol_name: string;
  kol_id: string;
  /** 主播真实姓名 **/
  real_name?: string;
  /** 工资/提成 */
  salary?: string | '';
  /** 工资类型 */
  salary_type: SalaryType;

  /** 净销额 */
  sale_amount?: string;

  /** 结算ID */
  settlement_id?: string;

  /** 开播时长 */
  live_duration?: string;
  /** 单价 */
  unit_price?: string;
  /** 底薪 */
  base_salary?: string;

  /** 提成比例 */
  commission_rate?: string;
  /** 排班文件 */
  schedule_file?: string;
}

/** 店播 成本结算 拆分后 */
export interface ShopLiveCostSettlementAfterForm {
  // kol
  kol_name: string;
  // 公司名称(机构名称)
  company_name: string;
  /** 结算明细下载地址 */
  detail_file?: string;
  /** 手工调账信息 */
  adjust_info: AdjustInfo[];
  settlement_files?: string[];
  service_fee?: string;
  /**  发票类型 专票2、普票1 不开票0 */
  invoice_type?: number | undefined;
  // 是否含税，0-否, 1-是
  is_include_tax?: 0 | 1;
  // 机构服务费收取方式, 1-百分比，2-固定金额
  company_service_type: '1' | '2';
  // 主播服务费
  kol_service_amount: string;
  // 机构服务费
  company_service_amount: string;
  // 机构服务费率
  company_service_rate: string;

  // 税额
  tax_amount: string;
  // 税率
  tax_rate: string;
  // 含税金额
  tax_included_amount: string;
  // 不含税金额
  tax_excluded_amount: string;
  json_data?: {
    amount_info_list: any[];
  };
  kol_salary_infos?: any[];
  business_type?: number | null;
}

/** 店播 成本结算 拆分后 */
export interface ShopLiveCostSettlementFormAfter {
  seal_type?: number | null;
  /** 结算明细下载地址 */
  detail_file?: string;
  /** 手工调账信息 */
  adjust_info: AdjustInfo[];
  settlement_files?: string[];
  service_fee?: string;
  /**  发票类型 专票2、普票1 不开票0 */
  invoice_type?: number;
  // 是否含税，0-否, 1-是
  is_include_tax?: 0 | 1;
  // 机构服务费收取方式, 1-百分比，2-固定金额
  company_service_type: '1' | '2';
  // 主播服务费
  kol_service_amount: string;
  // 机构服务费
  company_service_amount: string;
  // 机构服务费率
  company_service_rate: string;

  // 税额
  tax_amount: string;
  // 税率
  tax_rate: string;
  // 含税金额
  tax_included_amount: string;
  // 不含税金额
  tax_excluded_amount: string;
  json_data?: {
    amount_info_list: any[];
  };
  business_type?: number | null;
}

/** 店播 成本结算 */
export interface ShopLiveCostSettlementForm {
  /** 结算明细下载地址 */
  detail_file?: string;
  /** 手工调账信息 */
  adjust_info: AdjustInfo[];
  kol_salary_infos: KolSalaryInfoForm[];
  settlement_files?: string[];
  service_fee?: string;
  new_json_data?: any[];
  business_type?: number | null;
}

export interface ShopLiveCostSettlementBeforeForm {
  /** 手工调账信息 */
  adjust_info: AdjustInfo[];
  json_data: CompanyData;
  settlement_info_list?: any[] | undefined;
  business_type?: number | null;
}

/** 保存 成本结算数据参数，店铺代播，生成结算单之前 */
export interface SettlementCostDataLiveParams {
  /** id */
  id: number;
  /** 总结算金额 */
  total_settle_amount?: string;
  /** 结算步骤，0-发起结算，1-结算数据, 2-财务确认 */
  step?: SettlementStep;
  adjust_info?: AdjustInfo[];
  json_data?: CompanyData;
  settlement_files?: string[];
  new_json_data?: any[];
}

/** 保存 成本结算数据参数 拆分后 */
export interface SettlementCostDataUnionParamsAfter {
  /** id */
  id: number;
  /** 结算步骤，0-发起结算，1-结算数据, 2-财务确认 */
  step?: SettlementStep;
  /** 总结算金额 */
  total_settle_amount?: string;
  /** 主播 手工调账 */
  adjust_info?: AdjustInfo[];
  /**  发票类型 专票1、普票2 不开票3 */
  invoice_type?: number;
  // 是否含税，0-否, 1-是
  is_include_tax?: 0 | 1;
  // 机构服务费收取方式, 1-百分比，2-固定金额
  company_service_type: '1' | '2';

  // 主播服务费
  kol_service_amount: string | number;

  // 机构服务费
  company_service_amount: string;

  // 机构服务费率
  company_service_rate: string;

  // 税额
  tax_amount: string;

  // 税率
  tax_rate: string;

  // 含税金额
  tax_included_amount: string;

  // 不含税金额
  tax_excluded_amount: string;
  json_data?: any;
}

/** 保存 成本结算数据参数 */
export interface SettlementCostDataUnionParams {
  /** id */
  id: number;
  /** 结算步骤，0-发起结算，1-结算数据, 2-财务确认 */
  step?: SettlementStep;
  /** 总结算金额 */
  total_settle_amount?: string;
  /** 主播 手工调账 */
  kol_adjust_infos?: AdjustInfo[];
  /** 主播工资信息 */
  kol_salary_infos?: KolSalaryInfoForm[];

  /** 结算单文件 */
  settlement_files?: string[];
  contract_id?: number;
  seal_type?: number | null;
}

/**
 * 成本结算 店播 结算数据 表单
 */
export interface SettlementCostShopLiveDataForm {
  /** 手工调账 */
  adjust_info?: AdjustInfo[];
}

export interface SettlementCostMcnDataForm {
  adjustInfo: AdjustInfo[];
  companyData?: CompanyData;
}

export interface SettlementCostMcnVtaskDataForm {
  adjustInfo: AdjustInfo[];
  companyData: CompanyData;
}

export interface SettlementCostMcnTaobaoBeforeSaveParams extends SettlementDataUnionParams {
  /** id */
  id: number;
  /** 结算步骤，0-发起结算，1-结算数据, 2-财务确认 */
  step: SettlementStep;
  /** 总结算金额 */
  total_settle_amount: string;
  adjust_info?: AdjustInfo[];
  json_data?: CompanyData;
}

export interface SettlementCostMcnTaobaoAfterSaveParams extends SettlementDataUnionParams {
  /** id */
  id: number;
  /** 结算步骤，0-发起结算，1-结算数据, 2-财务确认 */
  step: SettlementStep;
  /** 总结算金额 */
  commission: string;
  commission_rate: string;
  // company_id: string;
  total_settle_amount: string;
  adjust_info?: AdjustInfo[];
}

export interface SettlementCostMcnTaobaoAfterDataForm extends TaxAmountInfo {
  adjustInfo: AdjustInfo[];
  companyInfo: Pick<CompanyInfo, 'company_id' | 'company_name' | 'tcbl' | 'zccb' | 'yssr'>;
}

/** 冲销类型 */
export { ReverseType } from './finance';

/**
 * 发起冲销请求参数
 */
export interface FinancialReverseParams {
  /**
   * 被冲销的单的ID
   * ```
   * 结算取 id
   * 收款取 achievement_id
   * 成本取 row_cost_id
   * ```
   */
  id: number;
  /** 冲销类型 */
  reverse_type: ReverseType;
  /** 冲销原因 */
  reverse_reason: string;
  is_confirm?: boolean;
  is_reverse_achievement?: boolean;
}

/**
 * 重新发起冲销请求参数
 */
export interface ReverseAgainParams {
  /**
   * 被冲销的单的ID
   * ```
   * 结算取 id
   * 收款取 achievement_id
   * 成本取 row_cost_id
   * ```
   */
  id: number;
  /** 冲销类型 */
  reverse_type: ReverseType;
  /** 冲销原因 */
  reverse_reason: string;
  is_confirm?: boolean;
}

/** 确认冲销 */
export interface ConfirmReverseParams {
  /**
   * 被冲销的单的ID
   * ```
   * 结算取 id
   * 收款取 achievement_id
   * 成本取 raw_cost_id
   * ```
   */
  id: number;
  /** 冲销类型 */
  reverse_type?: ReverseType;
  /** 是否通过 */
  is_pass: BooleanType;
  /** 冲销退回原因 */
  reverse_back_reason?: string;
  account_detail_date?: string;
}

export interface TaxAmountInfo {
  /**  发票类型 专票2、普票1 不开票0 */
  invoice_type?: number | undefined;
  /** 是否含税，0-否, 1-是 */
  is_include_tax?: number;
  /** 税率 */
  tax_rate?: string | number | undefined;
  /** 含税金额) */
  tax_included_amount?: string | number;
  /** 不含税金额 */
  tax_excluded_amount?: string | number;
  /** 税额 */
  tax_amount?: string | number;
}

export enum SettlementIncomeType {
  /** 坑位费 */
  pit_fee = 1,
  /** 团长服务费 */
  head_service_fee,
  /** 抖音CPS */
  douyin_cps,
  /** 星图 */
  xingtu,
  /** 商广 */
  shangguang,
  /** 其他 */
  other,
  /** 达人成本 */
  talent_cost,
  /** 投放 */
  put,
  /** 主播 */
  anchor,
  unity = 10, // CPS收入
  marketing_advertising = 15, //营销商广
}

export enum SettlementProjectType {
  // 招商项目
  merchant_project = 1,
  // 执行项目
  execute_project = 2,
}

export const SetlementIncomeTypeMap = new Map([
  [SettlementIncomeType.pit_fee, '坑位费'],
  [SettlementIncomeType.head_service_fee, '团长服务费'],
  [SettlementIncomeType.douyin_cps, '抖音CPS'],
  [SettlementIncomeType.xingtu, '星图'],
  [SettlementIncomeType.shangguang, '商广'],
  [SettlementIncomeType.other, '其他'],
]);

export const SetlementCostTypeMap = new Map([
  [SettlementIncomeType.pit_fee, '坑位费'],
  [SettlementIncomeType.talent_cost, '达人成本'],
  [SettlementIncomeType.put, '投放成本'],
  [SettlementIncomeType.xingtu, '星图'],
  [SettlementIncomeType.shangguang, '商广'],
  [SettlementIncomeType.other, '其他'],
]);

export const SetlementLiveCostTypeMap = new Map([
  [SettlementIncomeType.anchor, '主播成本'],
  [SettlementIncomeType.put, '投放成本'],
  [SettlementIncomeType.marketing_advertising, '营销/商广'],
  [SettlementIncomeType.other, '其他成本'],
]);

export const SetlementAllCostTypeMap = new Map([
  [SettlementIncomeType.pit_fee, '坑位费'],
  [SettlementIncomeType.head_service_fee, '团长服务费'],
  [SettlementIncomeType.talent_cost, '达人成本'],
  [SettlementIncomeType.douyin_cps, '抖音CPS'],
  [SettlementIncomeType.xingtu, '星图'],
  [SettlementIncomeType.shangguang, '商广'],
  [SettlementIncomeType.anchor, '主播成本'],
  [SettlementIncomeType.put, '投放成本'],
  [SettlementIncomeType.marketing_advertising, '营销/商广'],
  [SettlementIncomeType.other, '其他'],
]);

export type CompanyInfoForMCNDouyin = Pick<
  CompanyInfo,
  'company_id' | 'company_name' | 'file' | 'type' | 'income_amount' | 'company_list'
>;
export type CompanyInfoForLiveDouyin = Pick<
  CompanyInfo,
  | 'company_id'
  | 'company_name'
  | 'file'
  | 'type'
  | 'income_amount'
  | 'company_list'
  | 'type'
  | 'company_info_list'
>;
export interface MCNDouuyinForm {
  adjustInfo: AdjustInfo[];
  company_info_list: CompanyInfoForMCNDouyin[] | undefined;
}

export interface PitFeeParams {
  project_id: number;
  start_date: number;
  end_date: number;
  /** 1-收入，2-成本 */
  fee_type: 1 | 2;
}

export interface CompanyPitFee {
  company_id: number;
  company_name: string;
  sum_fee: string;
}

export interface MCNIncomeFormForDouyinAfter extends TaxAmountInfo {
  adjust_info: AdjustInfo[];
  amount_info_list: SettlementAmountInfo[];
}

export interface MCNCostFormForDouyinAfter extends TaxAmountInfo {
  adjust_info: AdjustInfo[];
  amount_info_list: SettlementAmountInfo[];
}

export interface AdCostParams {
  kol_id?: number | undefined;
  project_id?: number | undefined;
  start_date: number | undefined;
  end_date: number | undefined;
}

/**
 * 结算状态-扫描件状态
 */
export const SettlementScanStatusOptions = [
  {
    label: '待上传',
    value: 0,
  },
  {
    label: '审核中',
    value: 1,
  },
  {
    label: '已驳回',
    value: 3,
  },
  {
    label: '已归档',
    value: 2,
  },
];
export const SettlementScanStatusMap = new Map([
  [0, '待上传'],
  [1, '审核中'],
  [2, '已归档'],
  [3, '已驳回'],
]);
