import { AdjustInfo, CompanyData, SettlementStep, TaxAmountInfo } from './finance/settlement';

/**
 *@description: 招商商品查询
 *@author: 棠棣
 *@since: 2022/1/20 10:41
 */
export interface MerchantsQueryParams {
  /** 数据量 */
  num: number;
  /** 页码 */
  page_num: number;
  /** 商品名称 or 编码 */
  product_code_name: string;
  /** 招商人员id */
  add_by_id: number | '';
  /** 是否有坑位费 */
  has_pit_fee: number | '';
  platform_type: number | '';
}

/**
 *@description: 商品基础信息
 *@author: 棠棣
 *@since: 2022/1/22 10:45
 */
export interface Merchants {
  /** 商品编码 */
  product_code: string;
  product_name: string;
  company_id: number;
  company_name: string;
  shop_name: string;
  shop_id: number;
  brand_name: string;
  brand_id: number;
  has_pit_fee: number;
  id: number;
  add_by_name: string;
  add_by_id: number;
  gmt_create: string;
  project_id: number;
  project_name: string;
  [propsName: string]: any;
}

/**
 *@description: 编辑跟进弹框系列
 *@author: 棠棣
 *@since: 2022/1/22 10:11
 */
export interface SettlementQueryParams {
  /** 数据量 */
  num: number;
  /** 页码 */
  page_num: number;
  /** 项目搜索类型 */
  search_type: number;
  /** 项目搜索类型值 */
  search_value: string;
  /** 结算状态 */
  status: number | '';
  /** 结算周期 */
  month: string;
  add_by?: string | number;
}

/**
 *@description: 结算状态
 *@author: 棠棣
 *@since: 2022/1/22 10:49
 */
export enum SettlementStatus {
  /** 未提交 */
  unsubmitted = 0,
  /** 待确认 */
  wait_confirm = 1,
  /** 已确认 */
  confirmed = 2,
  /** 退回 */
  refused = 3,
  /** 待项目确认 */
  wai_project_confirm = 4,
  /** 项目确认不通过 */
  project_confirm_fail = 5,
}

/**
 *@description: 结算状态Map
 *@author: 棠棣
 *@since: 2022/1/22 10:49
 */
export const SettlementStatusMap = new Map([
  [SettlementStatus.unsubmitted, '未提交'],
  [SettlementStatus.wait_confirm, '待确认'],
  [SettlementStatus.confirmed, '已确认'],
  [SettlementStatus.refused, '退回'],
  [SettlementStatus.wai_project_confirm, '待项目确认'],
  [SettlementStatus.project_confirm_fail, '项目确认不通过'],
]);

/**
 *@description: 结算状态Options
 *@author: 棠棣
 *@since: 2022/1/22 10:51
 */
export const SettlementStatusOptions = [
  { value: SettlementStatus.unsubmitted, label: '未提交' },
  { value: SettlementStatus.wait_confirm, label: '待确认' },
  { value: SettlementStatus.confirmed, label: '已确认' },
  { value: SettlementStatus.refused, label: '退回' },
  { value: SettlementStatus.wai_project_confirm, label: '待项目确认' },
  { value: SettlementStatus.project_confirm_fail, label: '项目确认不通过' },
];

/**
 *@description: 新增场次
 *@author: 棠棣
 *@since: 2022/1/26 11:43
 */
export interface AddLiveParams {
  /** 项目id */
  project_id: string | number;
  project_name?: string;
  /** 产品id */
  product_id: string | number;
  /** 项目搜索类型 */
  [propName: string]: any;
  // live_goods_detail_list: {
  //   live_id: string;
  //   income_pit_fee: string;
  //   expend_pit_fee: string;
  //   id?: string;
  // }[];
}

/**
 *@description: 保存结算基本信息
 *@author: 葶苧
 *@since: 2022/02/10 09:56
 */
export interface SaveBaseInfoParams {
  /** 结算单id,修改的时候传入 */
  id?: string | number;
  /** 招商商品id */
  shop_live_live_goods_id: string | number | undefined;
  /** 场次id */
  shop_live_info_id: string | number | undefined;

  step: SettlementStep;
}

// 结算数据form
export interface BaseInfoForm {
  /** 场次id */
  shop_live_id: string | number | undefined;
}

export interface SaveSettlementDataForm extends TaxAmountInfo {
  json_data: CompanyData;
  adjust_info?: AdjustInfo[];
}

export interface SaveSettlementDataParams extends TaxAmountInfo {
  id: number | undefined;
  step: SettlementStep;
  total_settle_amount: string | number;
  adjust_info: AdjustInfo[];
  json_data: CompanyData;
}
