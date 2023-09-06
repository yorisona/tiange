import { PaginationParams } from '../base/pagination';

/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-05-08 09:57:56
 */
export interface CompanyParams {
  id: string | number | undefined;
  /** 地址 */
  address: string;
  /** 擅长领域，用“,”拼接。 */
  areas: string;
  /** 市 */
  city: string;
  /** 区 */
  county: string;
  /** 描述 */
  description: string;
  /** 描述文件的url */
  description_file: string;
  // /** 描述预览预览的url */
  // description_file_preview: string;
  /** 上传的logo的url，没有就传空 */
  logo: string;
  /** 公司名称 */
  name: string;
  /** 合作平台，用“,”拼接。 */
  platforms: string;
  /** 省 */
  province: string;
  /** 报价单的url */
  quotation: string;
  // quotation_size: 0.03
  /** 是否专票 */
  special_ticket: number;
  /** 联系人邮箱 */
  contact_email: string;
  /** 联系电话 */
  contact_no: string;
  /** 联系人 */
  contact_person: string;
  /** 微信号 */
  wechat: string;

  /** 财务联系邮箱 */
  contact_email2: string;
  /** 财务联系电话 */
  contact_no2: string;
  /** 财务联系人 */
  contact_person2: string;
  /** 财务微信 */
  wechat2: string;
  /** 开户行 */
  bank_of_deposit: string;
  /** 银行账号 */
  bank_card_number: string;
  /** 支付宝账号 */
  alipay_account: string;
  /** 营业执照 */
  business_license: string[];
  /** 开户许可证 */
  account_permit: string[];
}

export interface Company {
  id: string | number | undefined;
  /** 录入人 */
  add_by: string;
  add_by_id: number | undefined;
  /** 地址 */
  address: string;
  /** 擅长领域，用“,”拼接。 */
  areas: number[];
  /** 市 */
  city: string;
  /** 区 */
  county: string;
  /** 描述 */
  description: string;
  /** 描述文件的url */
  description_file: string;
  // /** 描述预览预览的url */
  // description_file_preview: string;
  /** 上传的logo的url，没有就传空 */
  logo: string;
  /** 公司名称 */
  name: string;
  /** 合作平台，用“,”拼接。 */
  platforms: number[];
  /** 省 */
  province: string;
  /** 报价单的url */
  quotation: string;
  // quotation_size: 0.03
  /** 是否专票 */
  special_ticket: number;
  /** 联系人邮箱 */
  contact_email: string;
  /** 联系电话 */
  contact_no: string;
  /** 联系人 */
  contact_person: string;
  /** 微信号 */
  wechat: string;

  /** 财务联系邮箱 */
  contact_email2: string;
  /** 财务联系电话 */
  contact_no2: string;
  /** 财务联系人 */
  contact_person2: string;
  /** 财务微信 */
  wechat2: string;
  /** 开户行 */
  bank_of_deposit: string;
  /** 银行账号 */
  bank_card_number: string;
  /** 支付宝账号 */
  alipay_account: string;
  /** 营业执照 */
  business_license: string[];
  /** 开户许可证 */
  account_permit: string[];
  quotation_size: number;
  /** 审核状态 */
  verify_status: number | undefined;
  /** 审批流程 */
  approval_flow_detail: any[];
  /** 开户行省 */
  bank_province: string;
  /** 开户行市 */
  bank_city: string;
  /** 开户银行 */
  bank_name: string;
  /** 开户支行 */
  bank_sub_name: string;
  /** 联行号 */
  bank_code: string;
  /** 新增原因 */
  reason: string;
}

// 主播信息
export interface IAnchorInfo {
  id: number;
  anchor_type?: number;
  live_year?: number;
  has_kol_exp?: boolean;
  flower_name?: string;
  real_name?: string;
  shoes_size?: number;
  wechat?: string;
  gender?: number;
  height?: number;
  weight?: number;
  verify_status?: number;
  add_by?: string;
  add_user_id?: string;
  gmt_create?: string;
  verify_by?: string;
  verify_time?: string;
  cates: ICate[];
  tags: ITag[];
  images: string[];
  cases: ICase[];
  cooperations: ICooperation[];
  brands: { id: number; name: string }[];
  anchor_platform_label: string;
  hourly_wage_label: string;
  collection_bank_name: string;
  collection_bank_account: string;
  collection_bank_no: string;
  settlement_company_id?: string;
  settlement_company_name: string;
  settlement_company_contact_no?: string;
  settlement_company_address?: string;
  collection_id_card: string;
  collection_phone: string;
  id_card: string;
  id_card_front: string;
  id_card_back: string;
  bank_card_front: string;
  bank_card_back: string;
  salary: string;
  contracts: string[];
  maintainer: string | undefined;
  maintainer_id: string | number | undefined;
}

export interface ICase {
  id?: number;
  description: string;
  images: string[];
  videos: string[];
  title: string;
}

export interface ICooperation {
  appendix: string[];
  cooperation_status: 1 | 2;
  end_date: string;
  start_date: string;
  hourly_wage: number;
  id: number;
  project_id: number;
  project_name: string;
  settlement_type: number;
  settlement_type_label: string;
  base_salary: number;
  commission_rate: string;
  live_count: number;
  live_time: number;
}
export interface ICate {
  code: number;
  name: string;
}
export interface ITag {
  id: number;
  name: string;
}

export interface Model {
  flag: number;
  id?: number;
  images: string[];
  mobile?: string;
  real_name: string;
  flower_name: string;
  wechat?: string;
}

/** 主播敏感信息类型 */
export enum AnchorKeyType {
  Wechat = 1,
  Phone = 2,
}

/**
 * 查询主播敏感信息查看记录表单
 */
export interface AnchorKeyInfoLogForm extends PaginationParams {
  /** 时间 */
  dates: string[] | undefined;
  /** 花名 */
  flower_name?: string;
  /** 真名 */
  real_name?: string;
  /** 操作人 */
  add_by_name?: string;
  /** 数据总数 */
  total: number;
}

/**
 * 查询主播敏感信息查看记录参数
 */
export interface AnchorKeyInfoLogParams extends PaginationParams {
  /** 开始时间 */
  start_time: string | undefined;
  /** 结束时间 */
  end_time: string | undefined;
  /** 花名 */
  flower_name?: string;
  /** 真名 */
  real_name?: string;
  /** 操作人 */
  add_by_name?: string;
}

/**
 * 查询主播敏感信息查看记录数据
 */
export interface AnchorKeyInfoLogModel {
  /** 开始时间 */
  search_type: AnchorKeyType | undefined;
  /** 操作时间 */
  gmt_create: string | undefined;
  /** 花名 */
  flower_name: string | undefined;
  /** 真名 */
  real_name: string | undefined;
  /** 操作人 */
  add_by_name: string | undefined;
}
