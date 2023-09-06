/*
 * 发票管理 类型
 */

import { PaginationParams } from '@/types/base/pagination';

export enum InoviceWriteOffStatusEnums {
  /** 未核销 */
  write_off_none = 0,
  /** 部分核销 */
  write_off_part = 1,
  /** 已核销 */
  write_off_all = 2,
}

export const InoviceWriteOffStatusMap = new Map([
  [InoviceWriteOffStatusEnums.write_off_none, '未核销'],
  [InoviceWriteOffStatusEnums.write_off_part, '部分核销'],
  [InoviceWriteOffStatusEnums.write_off_all, '已核销'],
]);

export interface FinanceInvoiceBase {
  // ID
  id: number;

  // 发票号码
  invoice_number: string;

  // 开票日期
  invoice_date: number;

  // 开票金额
  total_amount: string;

  // 税率
  tax_rate: string;

  // 税额
  tax_amount: string;

  // 不含税金额
  tax_excluded_amount: string;

  // 发票类型，1-销售发票, 2-采购发票
  invoice_type: number;

  // 发票状态，1-正常, 2-作废
  invoice_status: number;

  // 已核销金额
  write_off_amount: string;

  // 核销状态 0-未核销，1-部分核销，2-已核销
  write_off_status: InoviceWriteOffStatusEnums;

  // 发票图片
  invoice_pic_url: string;

  // 购买方
  buyer_name: string;

  // 销售方
  seller_name: string;

  not_write_off_amount?: number;
}

export interface UploadInvoice {
  // ID
  id: string;
  // 发票号码
  invoice_number: string;
  // 开票日期
  invoice_date: number | string;
  // 开票金额
  total_amount: string;
  // 税率
  tax_rate: string;
  // 税额
  tax_amount: string;
  // 不含税金额
  tax_excluded_amount: string;
  // 发票类型，1-销售发票, 2-采购发票
  invoice_type: number | string;
  // 是否专票，1专票, 0 否
  is_special?: number | string | undefined;
  // 发票图片
  invoice_pic_url: string;
  // 购买方
  buyer_name: string;
  // 销售方
  seller_name: string;
  show_url?: string;
  type: number;
  // 发票内容
  content_type_name?: string;
}

export interface FinanceInvoiceUploadList {
  start_time: string;
  project_name: string | null;
  invoiced: number | null;
  invoice_pic_url_list: string[];
  end_time: string;
  collecting_company: string;
  approval_username: string | null;
  approval_uid: string;
  approval_type: number;
  approval_status: number;
  approval_search_type: number;
  approval_id: number;
  approval_content: {
    create_department: string;
    invoice_amount: number;
    invoice_amount_str: string;
    level_two_types: number;
    username: string;
    create_id: number;
  };
  [propName: string]: any;
}

export interface WriteOffInfo {
  gmt_create: string;
  gmt_modified: string;
  id: number;
  invoice_id: number;
  invoice_number: string;
  project_name: string;
  settlement_id: number;
  settlement_uid: string;
  user_id: number;
  write_off_amount: number;
  write_off_time: number;
  buyer_name: string;
  seller_name: string;
  not_write_off_amount?: number;
  account_detail_date: number;
}

export interface FinanceInvoice extends FinanceInvoiceBase {
  write_off_infos: WriteOffInfo[];
  remark: string;
  verified_desc: string;
  is_certified: number;
  red_invoice_attachment_url: string;
  invoice_id: number;
  is_verified: number | boolean;
  is_special: number | boolean;
  // 是否归档，0: 未归档 1: 已归档
  archive_status?: number;
  add_by_name?: string;
  department_id?: number | undefined;
  invoice_content?: string;
  raw_identify_data: any;
}

export interface FinanceInvoiceListQueryParams extends Required<PaginationParams> {
  // 发票号码
  invoice_number?: string;

  // 发票类型，1-销售发票, 2-采购发票
  invoice_type?: number;
  is_special?: number | string | undefined;
  tax_rate?: number | undefined;

  // 核销状态 0-未核销，1-部分核销，2-已核销
  write_off_status?: InoviceWriteOffStatusEnums;

  // 发票状态，1-正常, 2-作废
  invoice_status?: number;

  // 购买方
  buyer_name?: string;

  // 销售方
  seller_name?: string;
  //  未全部核销，true已全部核销，false未全部核销
  not_full_write_off?: boolean;
}

export enum ProjectTypeEnum {
  /** 营销业务 */
  marketing = 1,
  /** 淘宝店播 */
  tabao_live = 2,
  /** 抖音店播 */
  douyin_live = 3,
  /** mcn业务 */
  mcn = 4,
  /** 区域业务 */
  area = 5,
  local_life = 7,
  /** 淘宝甄选 */
  tabao_pick = 8,
  /** 供应链 */
  supply_chain = 9,
}

export interface FinanceInvoiceProjectUIDQueryParams {
  /** ((1, '营销业务'), (2, '淘宝店播'), (3, '抖音店播'), (4, '创新项目'), (5, '区域业务')) */
  project_type: string | number;
  /** 项目编号 */
  project_uid?: string;
  project_name?: string;
}

export interface SettlementListQueryParams {
  /** 数量 */
  num: number;
  /** 页码 */
  page_num: number;
  /** ((1, '营销业务'), (2, '淘宝店播'), (3, '抖音店播'), (4, '创新项目'), (5, '区域业务')) */
  project_type: number | string;
  /** 搜索项，1-项目名称，2-项目编号，3-客户名称（公司）4-供应商名称 */
  search_type: string;
  /** 搜索值 */
  search_value: string;
  /** 结算种类，1-收入结算，2-成本结算。默认1 */
  settlement_kind: number;
  /** 是否确认，0-未确认，1-已确认 */
  is_confirmed: number;
  /** 去除冲销单以及确认的冲销单的被冲销单 */
  no_confirmed_reverse: number;
  /** 发票核销类型， 1-正金额，2-负金额 */
  invoice_write_off_type: number;
  /** 是否临时结算单, 0-否，1-是 */
  is_tmp: number;
  /** 是否暂估结算, 0-否，1-是 */
  is_estimate: number;
}

export interface ProjectUIDData {
  /** 项目id */
  project_id: number | string | undefined;
  /** 项目uid */
  project_uid: string;
  /** 项目名称 */
  project_name: string;
}

export const ProjectTypes = [
  {
    label: '营销业务',
    value: '1',
  },
  {
    label: '创新项目',
    value: '4',
  },
  {
    label: '抖音店播',
    value: '3',
  },
  {
    label: '淘宝店播',
    value: '2',
  },
  {
    label: '区域业务',
    value: '5',
  },
  {
    label: '本地生活',
    value: '7',
  },
  {
    label: '淘宝甄选',
    value: '8',
  },
];
