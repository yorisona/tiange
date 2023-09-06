import { GatherTypes } from '@/const/options';
import { BooleanType, GmtTimeFields } from '@/types/base/advanced';
import { PaginationParams } from '@/types/base/pagination';
import { BusinessTypeEnum } from '../common';

/*
 * @Author: 肖槿
 * @Date: 2021-05-19 13:56:47
 * @Description: 结算管理
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-25 11:06:57
 * @FilePath: \goumee-star-frontend\src\types\tiange\finance\finance.ts
 */
export interface filterForm {
  formData: any;
  formRules: any;
}

export interface filterItemChildren {
  type: string;
  key: string;
  placeholder?: string;
  style?: string;
  value: any;
  selectOption?: settlementType[];
}

export interface filterItem {
  label?: string;
  class?: string;
  style?: string;
  children: filterItemChildren;
}

export interface settlementType {
  value: number | undefined;
  label: string;
}

/** 手工调账 */
export interface reconciliation {
  /** 调整金额 */
  adjust_amount: string;
  /** 调整原因 */
  adjust_reason: string;
}

/** 不通过结算 */
export interface refuseParams {
  id: number;
  refuse_reason: string;
}

/** 应收参数 */
export interface receivableParams extends PaginationParams {
  /** 业务类型 */
  receivable_type: number | string;
  /** 核销状态 */
  write_off_status?: WriteOffStatus;
  /** 应收单编号 */
  receivable_uid: string;
  /** 项目编号 */
  project_uid: string;
  /** 项目名称 */
  project_name: string;
  /** 结算单编号 */
  settlement_uid: string;
  // 客户经理
  customer_manager: string;
  // 品牌
  brand_name: string;
  // 结算公司
  company_name: string;
  // 结算日期
  settlement_date: number | undefined;
  // 隐藏已冲销数据
  is_hide_reverse_data?: number | undefined;
  /** 账期 **/
  account_detail_date?: string;
}

/** 手工调账 */
export interface writeOffInfos {
  /** 收款编号 */
  receipt_uid: string;
  /** 核销金额 */
  write_off_amount: number;
  /** 核销人 */
  write_off_user: string;
  /** 核销时间 */
  write_off_time: string;
}

/** 应收列表 */
export interface receivableList extends ReverseFields {
  /** 创建日期 */
  create_date: string;
  /** id */
  id: number;
  /** 项目名称 */
  project_name: string;
  /** 项目编号 */
  project_uid: string;
  /** 实收(已核销)金额 */
  write_off_amount: number;
  /** 应收金额 */
  receivable_amount: number;
  /** 应收编号 */
  receivable_uid: string;
  /** 结算单编号 */
  settlement_uid: string;
  /** 核销信息 */
  write_off_infos: writeOffInfos[];
  /** 核销状态 */
  write_off_status: WriteOffStatus;
  /** 项目id */
  project_id: number;
  /** 未核销（可核销）金额 */
  not_write_off_amount: number;
  /** 业务类型 */
  receivable_type: number;
  refund_write_off_infos: any;
  // 退款金额
  refund_amount: number;
  /** 账期 **/
  account_detail_date: string;
}

/** 应付气泡 */
export interface payableWriteOffInfos {
  /** 收款编号 */
  cost_uid: string;
  /** 核销金额 */
  write_off_amount: number;
  /** 核销人 */
  write_off_user: string;
  /** 核销时间 */
  write_off_time: string;
}

/** 应付参数 */
export interface payableParams extends PaginationParams {
  /** 业务类型 */
  payable_type: number | string;
  /** 核销状态 */
  write_off_status?: WriteOffStatus;
  /** 应付单编号 */
  payable_uid: string;
  /** 项目编号 */
  project_uid: string;
  /** 项目名称 */
  project_name: string;
  /** 结算单编号 */
  settlement_uid: string;
  /** 客户经理 */
  customer_manager: string;
  // 品牌
  brand_name: string;
  // 结算公司
  company_name: string;
  // 结算日期
  settlement_date: number | undefined;
  // 隐藏已冲销数据
  is_hide_reverse_data?: number | undefined;
}

/** 应付列表 */
export interface PayableOrder extends ReverseFields {
  /** 创建日期 */
  create_date: string;
  /** id */
  id: number;
  /** 项目名称 */
  project_name: string;
  /** 项目编号 */
  project_uid: string;
  /** 实收(已核销)金额 */
  write_off_amount: number;
  /** 应付金额 */
  payable_amount: number | string;
  /** 应付编号 */
  payable_uid: string;
  /** 结算单编号 */
  settlement_uid: string;
  /** 核销信息 */
  write_off_infos: payableWriteOffInfos[];
  /** 核销状态 */
  write_off_status: WriteOffStatus;
  /** 项目id */
  project_id: number;
  /** 未核销（可核销）金额 */
  not_write_off_amount: number;
  /** 业务类型 */
  payable_type: number;
  refund_write_off_infos: any;
  refund_write_off_info_items: any;
  // 退款金额
  refund_amount: number;
}

/**
 * 核销状态
 * @author  Jerry <jerry.hz.china@gmail.com>
 */
export enum WriteOffStatus {
  /** 未核销 */
  none = 0,
  /** 部分核销 */
  part,
  /** 已核销 */
  done,
}

// 冲销

/** 冲销类型 */
export enum ReverseType {
  /** 收款 */
  receive = 1,
  /** 付款 */
  payment,
  /** 收入结算 */
  settlement_income,
  /** 成本结算 */
  settlement_cost,
}

/** 冲销状态，1-待确认, 2-已确认, 3-退回 */
export enum ReverseStatus {
  /** 待确认 */
  wait_confirm = 1,
  /** 已确认 */
  confirmed,
  /** 退回 */
  refused,
}

/** 冲销状态 */
export const ReverseStatusMap = new Map([
  [ReverseStatus.wait_confirm, '待确认'],
  [ReverseStatus.confirmed, '已确认'],
  [ReverseStatus.refused, '退回'],
]);

/**
 * 冲销相关字段(冲销单相关)
 */
export interface ReverseFields {
  /** 冲销单id（这个有值表示该单已被冲销） */
  reverse_id: number;
  /** 被冲销的单的id（这个有值表示该单是冲销单） */
  reversed_id: number | null;
  /** 冲销状态，1-待确认, 2-已确认, 3-退回 */
  reverse_status: ReverseStatus;
  /** 冲销原因 */
  reverse_reason: string;
  /** 冲销退回原因 */
  reverse_back_reason: string;

  refunded_id?: string; // 退款
}

/**
 * 成本类型
 * ```
 * 目前好像主要在项目付款中有看到要用
 * ```
 */
export enum CostType {
  /** 人员工资 */
  Salary = 1,
  /** 主播服务费 */
  AnchorServiceFee,
  /** 固定资产采购 */
  AssetPurchase,
  /** 水电 */
  WaterAndElectricity,
  /** 装修 */
  Decorate,
  /** 房租 */
  HouseRent,
  /** 营销成本 */
  MarketingCost,
  /** 返点 */
  Rebate,
  /** 冲销 */
  Reverse,
}

export const CostTypeMap = new Map([
  [CostType.Salary, '人员工资'],
  [CostType.AnchorServiceFee, '主播服务费'],
  [CostType.AssetPurchase, '固定资产采购'],
  [CostType.WaterAndElectricity, '水电'],
  [CostType.Decorate, '装修'],
  [CostType.HouseRent, '房租'],
  [CostType.MarketingCost, '营销成本'],
  [CostType.Rebate, '返点'],
  [CostType.Reverse, '冲销'],
]);

/**
 * 收款
 * ```
 * 临时补充的类型，很多字段没加注释
 * ```
 */
export interface FinanceReceive extends GmtTimeFields, ReverseFields {
  // 收款编号
  achievement_id: number;
  // 业绩名称
  achievement_name: string;
  // 业绩编号
  achievement_uid: string;
  add_by: string;
  add_by_id: number;
  // 开票审批编号
  approval_uid: string | null;
  // 业务类型
  business_type: BusinessTypeEnum[];
  contract_id: number | null;
  contract_uid: string | null;
  cooperation_id: number;
  create_time_str: string;
  customer_id: number;
  customer_info: {
    category: number;
    company_name: string;
    company_type: number;
    customer_class: number;
    shop_name: string;
  };
  flag: number;
  gather_amount: number;
  gather_amount_str: string;
  gather_certificate_pic: string;
  gather_confirm_detail: {
    order_date: string;
    pay_company_name: string;
    account: string;
    bank_of_deposit: string;
  };
  gather_date: string;
  gather_type: GatherTypes | null;
  gather_way: number;
  gather_way_detail: {
    order_wangwang_id: number;
    task_id: number;
    order_date: string;
    pay_company_name: string;
  };
  invoice_apply_id: number | null;
  invoice_certificate_pic: string;
  invoice_info: {
    amount: string;
    pic_url: string;
    institution: string;
    invoice_num: string;
    invoice_date: number;
  }[];
  is_gather: number;
  /** 是否开票 */
  is_invoice: BooleanType;
  manager: string;
  modified_by: string;
  modified_by_id: number;
  project_id: number;
  project_uid: string;
  refund_amount: number;
  registration_time: string;
  project_name: string;
  write_off_amount: number;
  write_off_status: number;
  not_write_off_amount: number;
  write_off_infos: {
    receivable_uid: string;
    write_off_amount: string;
    write_off_user: string;
    write_off_time: string;
  }[];
  refund_write_off_info_items: any;
  account_detail_date: number | undefined;
}

/**
 * 财务付款管理
 */
export interface FinancePayment extends GmtTimeFields, ReverseFields {
  /** 付款编号 */
  uid: string;
  //审批记录-付款编号
  approval_cost_record_id: string | null;
  achievement_uid: string;
  add_by_id: number;
  approval_id: number;
  approval_uid: string;
  borrowing_uid: string;
  business_type: BusinessTypeEnum[];
  company_id: number;
  company_name: string | null;
  contract_id: number;
  cooperation_id: number | null;
  cost_id: number;
  cost_type: number | null;
  flag: number;
  has_contract: number;
  invoice_certificate_pic: string;
  invoice_info: {
    amount: string;
    amount_str: string;
    institution: string;
    invoice_date: string;
    invoice_num: number;
    pic_url: string;
  }[];
  is_invoice: number;
  is_pay: number;
  is_personal: number;
  is_split: number;
  kol_id: number | null;
  live_end_date: number;
  live_start_date: number;
  modified_by_id: number;
  /** 成本类型 */
  new_cost_type: number;
  note: string;
  pay_account: string | null;
  pay_amount: number;
  pay_certificate_pic: string;
  pay_invoice_type: number;
  pay_date: string;
  /** 付款事由 */
  pay_reason: string;
  /** 付款类型 */
  pay_type: number;
  pay_way: number | null;
  project_id: number | null;
  project_uid: string | null;
  pay_way_detail: {
    account: string;
    name: string;
    v_task_id: string;
    wangwang_name: string;
    bank_card_number: string;
    company_name: string;
    bank_of_deposit: string;
  };
  shop_name: string | null;
  tax_point: number;
  transfer_date: string;
  project_name: string;
  customer_manager: string;
  kol_name: string;
  cost_company_name: string;
  add_by_username: string;
  contract_uid: string;
  associate_cost: {
    costs: {
      id: number;
      amount: number;
    }[];
    operator_uid: number;
    operator_username: string;
    operator_date: string;
  };
  write_off_infos: any[];
  refund_write_off_infos: any[];
  account_detail_date: number | undefined;
}

/**
 * 发票信息
 * ```
 * 来不及写太多注释了，先上车吧
 * 我也只是临时补个类型让代码可用
 * ```
 */
export interface InvoiceInfo {
  /** 开票金额 */
  amount: string;
  /** 开票金额string版本 */
  amount_str: string;
  institution: string;
  /** 开票日期 */
  invoice_date: string;
  /** 开票单号 */
  invoice_num: number;
  /** 凭证图片地址 */
  pic_url: string;
  invoice_date_str: string;
}

/**
 * 支出明细
 * ```
 * 来不及写注释了，先上车吧
 * 我也只是临时补个类型让代码可用
 * ```
 */
export interface FinancePayDetail extends GmtTimeFields, ReverseFields {
  achievement_uid: string;
  add_by_id: number;
  approval_id: number;
  approval_uid: string;
  borrowing_uid: string;
  business_type: BusinessTypeEnum[];
  company_id: number;
  company_name: string | null;
  contract_id: number;
  cooperation_id: number | null;
  /** 付款ID */
  cost_id: number;
  /** 付款编号(临时版) */
  uid: string;
  cost_type: null;
  flag: number;
  has_contract: number;
  invoice_certificate_pic: string;
  /** 发票信息 */
  invoice_info: InvoiceInfo[];
  /** 是否开票 */
  is_invoice: BooleanType;
  is_pay: number;
  is_personal: number;
  is_split: number;
  kol_id: number | null;
  live_end_date: number;
  live_start_date: number;
  modified_by_id: number;
  new_cost_type: number;
  note: string;
  pay_account: string | null;
  pay_amount: number;
  pay_certificate_pic: string;
  pay_date: string;
  pay_reason: string;
  pay_type: number;
  pay_way: number | null;
  pay_way_detail: [];
  project_id: number | null;
  project_uid: string | null;
  receive_type: number;
  receiver_info: {
    account: string;
    name: string;
    v_task_id: string;
    wangwang_name: string;
    bank_card_number: string;
    company_name: string;
    bank_of_deposit: string;
  };
  shop_name: string | null;
  /** 税点金额 */
  tax_point: number | null;
  transfer_date: string;
  achievement_name: string;
  contract_uid: string;
  cost_company_name: string;
  kol_name: string;
  customer_manager: string;
  project_name: string;
  add_by: string;
}
// 对公账户
export enum AccountType {
  bank = 1,
  zfb,
  prepay,
}

export const AccountTypeMap = new Map([
  [AccountType.bank, '银行账户'],
  [AccountType.zfb, '支付宝'],
  [AccountType.prepay, '预收款'],
]);

export interface BankAccount {
  id: number;
  account_name: string;
  account_number: string;
  // account_type: AccountType;
  bank_name: string;
  bank_type: AccountType;
  bank_detail_name: string;
  bank_code: string;
  // 0 启用 1 禁用
  status: number;
  logo: string | undefined;
  amount: number | string | undefined;
  template_path: string | undefined;
  template_name: string | undefined;
}

interface DailyCostCommon extends PaginationParams {
  // 支出类型
  pay_type: number | undefined;
  //  费用类型
  expense_category_code: number | undefined;
  //  归属部门
  department_name: number | undefined;
  // 转出路径
  payer_bank_account_id: number | undefined;
  //  项目名称
  project_name: string | undefined;
}

export interface DailyCostQueryForm extends DailyCostCommon {
  date: string[] | undefined;
  search_type: string;
}

export interface DailyCostQueryParams extends DailyCostCommon {
  start_date: string | undefined;
  end_date: string | undefined;
}

export interface DailyCostModel {
  // 是否有使用分摊 0-否，1-是
  allocated: number;
  // 分摊唯一编码
  code: string;
  // 单据内码
  form_data_code: string;
  // 单据小类编码
  form_sub_type_biz_code: string;
  // 单据小类名称
  form_sub_type_name: string;
  // 单据大类类型 列表接口获取
  form_type: string;
  // 请求详情接口时的原始数据
  meta_data_detail: any;
  // 请求列表接口时的原始数据
  meta_data_list: any;
  // 单据号
  form_code: string;
  // 支付时间
  settled_at: string | undefined;
  // 付款事由
  reimburse_name: string;
  // 申请人工号
  reim_employee_id: string;
  // 申请人
  reim_employee_name: string;
  // 费用归属部门编码 飞书的部门id
  department_biz_code: string;
  // 费用归属部门
  multistage_department_name: string;
  // 收款户名 收款方式，枚举类型，BANK-银行，ALIPAY-支付宝，CASH-现金
  payer_payment_type: string;
  // 收款户名 收款的银行卡户名，支付宝或者现金时为空
  bank_acct_name: string;
  // 收款户名 收款方账户，为银行时，是银行卡，支付宝时为支付宝账户，现金时为空
  bank_acct_number: string;
  // 支出类型 | 天鸽中只包含1-成本 2-退款两类 | 每刻，包括1-成本  3-费用 4-借款 5-其它
  pay_type: number;
  // 不含税金额
  tax_excluded_amount: string;
  // 税额
  tax_amount: string;
  // 应付金额
  payment_amount: string;
  // 实付金额
  approved_amount: string;
  // 发票 0-无，1-有   显示有或无，接口获取 根据发票数量判断是否已上传
  has_invoice: number;
  // 会计科目    费用类细项编码
  expense_type_biz_code: string;
  // 会计科目 - 费用细项名称--类别
  expense_type_name: string;
  // 备注
  comment: string;
  // 转出路径    支付方名称
  payer_name: string;
  // 转出路径  支付方账户，为银行时，是银行卡，支付宝时为支付宝账户，现金时为空
  payer_bank_account: string;
  // 项目   项目编号
  project_uid: string;
  // 项目   项目名称
  project_name: string;
  //  转出路径
  payer_bank_account_name: string;
  // 会计科目
  expense_category_code: string;
  // 会计科目()
  expense_category_name: string;
  // 管报科目
  subject_name: string;
}

/**
 * 费用类型/会计科目
 */
export enum FinaceFeeType {
  //  固定资产
  FixedAssets = '01',
  //  办公费
  OfficeExpenses = '02',
  //  差旅费
  TravelExpenses = '03',
  // 市内交通费
  CityTransportationFee = '04',
  // 业务招待费
  BusinessEntertainmentExpenses = '05',
  // 物流费
  LogisticsFee = '06',
  // 中介咨询费
  IntermediaryConsultingFee = '07',
  // 通讯费用
  CommunicationCost = '08',
  // 汽车费用
  CarCost = '09',
  // 会议费
  ConferenceExpenses = '10',
  // 资产使用费
  AssetUseFee = '11',
  // 促销费用
  PromotionExpenses = '13',
  // 技术服务费
  TechnicalServiceFee = '14',
  // 样品费
  SampleFee = '15',
  // 低值易耗品
  LowValueConsumables = '16',
  // 主营业务成本
  MainBusinessCost = '999999',
  // 借款
  Loan = '999998',
}
/**
 * 支出类型
 */
export enum FinaceSpendingType {
  //  成本
  Cost = 1, // EnumValue(1, '成本')
  // 退款
  Refund = 2, // EnumValue(2, '退款')
  // 费用
  Fee = 3, // EnumValue(3, '费用')
  // 借款
  Loan = 4, // EnumValue(4, '借款')
  // 其他
  Other = 5, // EnumValue(5, '其他')
  // 资金划转
  FundTransfer = 6,
  // 理财买入
  financeBuy = 7,
  //煜丰投放（收量）
  Release = 8,
}

export const FinaceSpendingTypeMap = new Map([
  [FinaceSpendingType.Cost, '成本'],
  [FinaceSpendingType.Refund, '退款'],
  [FinaceSpendingType.Fee, '费用'],
  [FinaceSpendingType.Loan, '借款'],
  [FinaceSpendingType.Other, '其他'],
  [FinaceSpendingType.FundTransfer, '资金划转'],
  [FinaceSpendingType.financeBuy, '理财买入'],
  [FinaceSpendingType.Release, '煜丰投放（收量）'],
]);

export const FinaceFeeTypeMap = new Map([
  [FinaceFeeType.FixedAssets, '固定资产'],
  [FinaceFeeType.OfficeExpenses, '办公费'],
  [FinaceFeeType.TravelExpenses, '差旅费'],
  [FinaceFeeType.CityTransportationFee, '市内交通费'],
  [FinaceFeeType.BusinessEntertainmentExpenses, '业务招待费'],
  [FinaceFeeType.LogisticsFee, '物流费'],
  [FinaceFeeType.IntermediaryConsultingFee, '中介咨询费'],
  [FinaceFeeType.CommunicationCost, '通讯费用'],
  [FinaceFeeType.CarCost, '汽车费用'],
  [FinaceFeeType.ConferenceExpenses, '会议费'],
  [FinaceFeeType.AssetUseFee, '资产使用费'],
  [FinaceFeeType.PromotionExpenses, '促销费用'],
  [FinaceFeeType.TechnicalServiceFee, '技术服务费'],
  [FinaceFeeType.SampleFee, '样品费'],
  [FinaceFeeType.LowValueConsumables, '低值易耗品'],
  [FinaceFeeType.MainBusinessCost, '主营业务成本'],
  [FinaceFeeType.Loan, '借款'],
]);

export interface DashboardChartCommonParams {
  start_date: string;
  end_date: string;
  group_by?: 'day' | 'month';
}

export interface DashboardOverviewModel {
  cost: number | undefined;
  gmv: number | undefined;
  income: number | undefined;
  profit: number | undefined;
  per_capita_cost: number | undefined;
  per_capita_gmv: number | undefined;
  per_capita_income: number | undefined;
  per_capita_profit: number | undefined;
  update_time: number | undefined;
}

export interface DashboardLaborEffectDataModel {
  per_capita_cost: (number | null)[] | undefined;
  per_capita_income: (number | null)[] | undefined;
  per_capita_profit: (number | null)[] | undefined;
}

export interface DashboardLaborEffectModel {
  datas: DashboardLaborEffectDataModel | undefined;
  dates: (string | null)[] | undefined;
}

export interface DashboardSunburstDataModel {
  project_name: string | undefined;
  value: number | null | undefined;
  children: DashboardSunburstDataModel[] | undefined;
}

export interface DashboardGMVTrendModel {
  datas:
    | {
        key: string | undefined;
        value: (number | null)[];
      }[]
    | undefined;
  dates: (string | null)[] | undefined;
}

export interface ProfitMarginStatisticsModel {
  datas:
    | {
        key: string | undefined;
        value: (number | null)[];
      }[]
    | undefined;
  dates: (string | null)[] | undefined;
}

export interface ProfitLossStatementModel {
  datas:
    | {
        key: string | undefined;
        value: (number | null)[] | undefined;
      }[]
    | undefined;
  dates: (string | null)[] | undefined;
  update_time: number | undefined;
}

export interface OperatingProjectModel {
  project_id: number | undefined;
  project_name: string | undefined;
}

export interface FinanceOverviewModel {
  // 年度支出
  annual_cost: number | undefined;
  // 年度收入
  annual_income: number | undefined;
  // 理财资金
  financing_balance: number | undefined;
  // 理财收益
  financing_earn: number | undefined;
  // 本月支出
  monthly_cost: number | undefined;
  // 本月收入
  monthly_income: number | undefined;
  // 可用余额
  total_balance: number | undefined;
  // 待支付
  total_unpaid: number | undefined;
}

export interface FinancePieModel {
  // 账户名称
  account_name: number | undefined;
  // 余额
  value: number | undefined;
}

export interface FinanceTrendsDataModel {
  // 余额
  balance: number | undefined;
  // 变动
  balance_change: number | undefined;
  // 支出
  cost: number | undefined;
  // 收入
  income: number | undefined;
}

export interface FinanceTrendsModel {
  // 账户名称
  datas: FinanceTrendsDataModel[] | undefined;
  // 余额
  months: string[] | undefined;
}

export enum ClassifyType {
  // 支付宝
  alipay = 0,
  // 招商
  zhaoshangBank,
  // 农行
  nongyeBank,
  // 工商
  gongshangBank,
  // 杭州银行
  hangzhouBank,
  // 联合银行
  lianheBank,
  // 北京银行
  beijingBank,
  // 宁波银行
  ningboBank,
}

export interface FinanceAccountDetailModel {
  // 账户名称
  account_name: string | undefined;
  // 可用余额
  available_balance: number | undefined;
  // 余额
  balance: number | undefined;
  // 理财余额
  financing_balance: number | undefined;
  // 账户图标
  logo: string | undefined;
  // 账户银行类型
  classify: ClassifyType;
}

export interface CapitalDailyReportModel {
  // 可用余额
  balance: number | undefined;
  // 账户名称
  bank_name: string | undefined;
  // 往来单位
  company_name: string | undefined;
  // 归属部门
  department_name: string | undefined;
  // 支出
  expenditure: number | undefined;
  // 会计科目
  expense_type_name: string | undefined;
  // 编号
  id: number | undefined;
  // 收入
  income: number | undefined;
  // 关联项目
  project_name: string | undefined;
  // 备注
  remark: string | undefined;
  // 日期
  revenue_date: string | undefined;
  // 摘要
  summary: string | undefined;
}

export interface CapitalYearReportBankModel {
  bank_id: number | undefined;
  bank_name: string | undefined;
  data: {
    month: number | undefined;
    // 期初数
    open_balance: number | undefined;
    income: number | undefined;
    // 支出
    expenditure: number | undefined;
    // 余额
    balance: number | undefined;
  }[];
}

export interface CapitalYearReportBalanceModel {
  month: number | undefined;
  // 余额
  balance: number | undefined;
}

export interface CapitalYearReportModel {
  data: CapitalYearReportBankModel[];
  balance_data: CapitalYearReportBalanceModel[];
}

export enum FlowStatus {
  // 待认领
  watigingClaim = 0,
  // 已认领
  claimed,
  // 部分认领
  partClaimed,
}

export const FlowStatusMap = new Map([
  [FlowStatus.watigingClaim, '待认领'],
  [FlowStatus.claimed, '已认领'],
  [FlowStatus.partClaimed, '部分认领'],
]);

export const enum FlowRevenueType {
  // 其他收入
  otherIncome = 0,
  // 资金划转
  fundTransfer,
  // 项目收入
  ProjectIncome,
  // 支付宝提现
  zfbWithdraw,
  // 理财收入
  financialIncome,
  // 淘宝cps收入
  taobaoCpsIncome,
  // v任务收入
  vTaskIncome,
  // 员工还款
  staffRepayment,
  // 公务损坏赔款
  damageIndemnity,
  // 余利宝赎回
  yulibaoRedemption,
  /* 红包退回 */
  redEnvelopeReturn,
}

export const FlowRevenueTypeMap = new Map([
  [FlowRevenueType.otherIncome, '其它收入'],
  [FlowRevenueType.fundTransfer, '资金划转'],
  [FlowRevenueType.ProjectIncome, '项目收入'],
  [FlowRevenueType.zfbWithdraw, '支付宝提现'],
  [FlowRevenueType.financialIncome, '理财收入'],
  [FlowRevenueType.taobaoCpsIncome, '淘宝CPS收入'],
  [FlowRevenueType.vTaskIncome, 'V任务收入'],
  [FlowRevenueType.staffRepayment, '员工还款'],
  [FlowRevenueType.damageIndemnity, '公物损坏赔偿'],
  [FlowRevenueType.yulibaoRedemption, '余利宝赎回'],
  [FlowRevenueType.redEnvelopeReturn, '红包退回'],
]);

export interface RevenueFlowParams extends PaginationParams {
  revenue_start_date?: string | undefined;
  revenue_end_date?: string | undefined;
  bank_id?: number | undefined;
  payer?: string | undefined;
  // 0 待认领 1 已认领
  status?: FlowStatus | string;
  account_type?: AccountType;
  revenue_type?: FlowRevenueType;
  //支付宝搜索
  payment_account?: string | undefined;
}

export interface RevenueFlowModel {
  account_type: AccountType;
  // 打款金额
  income: number;
  // 已认领金额
  claimed_amount: number;
  claimed_record?: any[] | null;
  // 收款账户
  bank_name: string;
  // 打款单位
  payer: string;
  // 打款账号
  payment_account: number;
  // 备注
  remark: string;
  // 收款日期
  revenue_date: string;
  // 收入类型（展示直接用下面的revenue_type_display就好了）
  revenue_type: FlowRevenueType;
  // 流水号
  serial_num: number;
  // 状态
  status: FlowStatus;
  // 摘要
  summary: string;
  // 收入类型描述
  revenue_type_display: string;
  // id
  id: number;
  // 收款编号
  achievement_uid: string | undefined;
  un_claimed_amount?: number;
}

export interface ClaimRevenueFlowParams {
  id: number | undefined;
  revenue_type: FlowRevenueType | undefined;
  remark: string | undefined;
  account_type: AccountType | undefined;
}

export interface BankTemplateModel {
  bank_code: string | undefined;
  bank_name: string | undefined;
  template_name: string | undefined;
  template_path: string | undefined;
}

export interface BankTemplateParams extends PaginationParams {
  start_date: string | undefined;
  end_date: string | undefined;
  bank_id: number | undefined;
  company_name: string | undefined;
}

export interface PendingIncomeClaimModel {
  // 打款账号
  account_number: string | undefined;
  // 收款账户
  bank_name: string | undefined;
  id: number | undefined;
  // 金额
  income: number | undefined;
  //已认领金额
  claimed_amount: number | undefined;
  // 待认领金额
  unclaimed_amount: number | undefined;
  // 打款单位
  payer: string | undefined;
  // 备注
  remark: string | undefined;
  // 收款日期
  revenue_date: string | undefined;
  // 摘要
  summary: string | undefined;
}

export enum PayType {
  cost = 1,
  refund = 2,
  fee = 3,
  loan,
  other,
  fundTransfer,
}

export const PayTypeMap = new Map([
  [PayType.cost, '成本'],
  [PayType.refund, '退款'],
  [PayType.fee, '费用'],
  [PayType.loan, '借款'],
  [PayType.other, '其他'],
  [PayType.fundTransfer, '资金划转'],
]);

export interface UnpaidCostParams extends PaginationParams {
  start_date: string | undefined;
  end_date: string | undefined;
  // 申请人
  add_by: string | undefined;
  // 归属部门
  department_id: number | undefined;
  // 收款户名
  bank_name: string | undefined;
  // 支出类型 1-成本 2-退款 3-费用 4-借款 5-其它
  pay_type: PayType | undefined;
  // 关联项目名称
  project_name: string | undefined;
  // 会计科目编码
  expense_category_code: number | undefined;
}

export interface UnpaidCostModel {
  id: number | undefined;
  // 日期
  date: string | undefined;
  // 付款事由
  reimburse_reason: string | undefined;
  // 申请人
  reimburse_employee_name: string | undefined;
  // 费用归属部门
  department_name: string | undefined;
  // 户名
  bank_acct_name: string | undefined;
  // 账号
  bank_acct_number: string | undefined;
  // 金额
  amount: number | undefined;
  // 支出类型，参考上面支出类型参数
  pay_type: PayType | undefined;
  // 项目名称
  project_name: string | undefined;
  // 备注
  remark: string | undefined;
  // 会计科目
  expense_category_name: string | undefined;
}

export interface ProjectFundParams extends PaginationParams {
  // 归属部门
  department_id: number | undefined;
  business_id: BusinessTypeEnum | undefined;
  // 关联项目名称
  project_name: string | undefined;
}

export interface ProjectFundDataModel {
  id: number | undefined;
  // 月份
  record_month: number | undefined;
  // 支出
  total_expense: number | undefined;
  // 收入
  total_income: number | undefined;
}

export interface ProjectFundModel {
  // 业务类型
  project_type: BusinessTypeEnum | undefined;
  id: number | undefined;
  // 项目名称
  project_name: string | undefined;
  // 项目编号
  project_uid: string | undefined;
  // 合计收入
  total_income: number | undefined;
  // 合计支出
  total_expense: number | undefined;
  // 费用归属部门
  data: ProjectFundDataModel[] | undefined;
}

export interface DepartmentFundDataModel {
  department_id: number | undefined;
  name: string | undefined;
  // 月份
  record_month: number | undefined;
  // 支出
  total_expense: number | undefined;
  // 收入
  total_income: number | undefined;
}

export interface DepartmentFundModel {
  id: number | undefined;
  // 部门名称
  department_name: string | undefined;
  // 合计收入
  total_income: number | undefined;
  // 合计支出
  total_expense: number | undefined;
  // 费用归属部门
  data: DepartmentFundDataModel[] | undefined;
}

export interface FinancialLedgerParams extends PaginationParams {
  start_date: string | undefined;
  end_date: string | undefined;
  bank_id: number | undefined;
}

export interface FinancialLedgerModel {
  // 所属银行
  bank_name: string | undefined;
  // 买入金额
  buy_in_amount: number | undefined;
  // 产品名称
  product_name: string | undefined;
  // 收益金额
  profit: number | undefined;
  // 日期
  record_time: string | undefined;
  // 赎回金额
  redeem_amount: number | undefined;
  id: number | undefined;
}

export enum FlowType {
  // 赎回, 收入
  income = 1,
  // 买入，支出
  cost = -1,
}
export interface AddFinancialLedgerParams {
  // -1 赎回 1 买入
  kind: FlowType;
  // 日期
  date: string | undefined;
  // 银行id
  bank_id: number | undefined;
  // 产品名称
  product_name: string | undefined;

  // 买入金额
  purchase?: number | string;

  // 赎回金额
  redeem?: number | string;
  // 流水ID
  flow_id?: number;
  // 利润
  profit?: number | string;
}

export interface AccountPeriodParams extends PaginationParams {
  account_month: string | undefined;
  effective_month: string | undefined;
}

export interface CloseAccountPeriodParams {
  account_month: string | undefined;
}

export interface AccountPeriodModel {
  // 操作时间
  gmt_modified: number | undefined;
  // 操作人ID
  modified_by: number | undefined;
  // 操作人花名
  modified_by_name: string | undefined;
  // 账期开始时间
  period_date_end: number | undefined;
  // 账期结束时间
  period_date_start: number | undefined;
  status: number | undefined;
}

export interface InvoiceArchiveApprovalParams {
  //  驳回意见
  archive_reject_remark?: string;
  //  归档状态) 0: 未归档 1: 已归档
  archive_status?: number;
  // 发票id
  invoice_id?: number;
}

export interface AddSettlementAllocatedParams {
  //  分摊费用
  allocated_amount?: number | string;
  //  分摊日期
  allocated_time?: string;
  // 费用类别
  expense_type_biz_code?: number;
  /** 分摊录入人员 **/
  add_by?: number;
}
