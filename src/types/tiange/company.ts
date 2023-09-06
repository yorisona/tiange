/**
 * 公司相关
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-30 10:51:23
 */

import type { BooleanType, GmtTimeFields } from '@/types/base/advanced';
import type { PaginationParams } from '@/types/base/pagination';
import type { AddressFields } from './fields';
import { Brand } from '@/types/tiange/brand';
import { AccountType } from '@/types/tiange/finance/finance';

/**
 * 公司
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-30 10:52:45
 * @prop {number} id ID
 * @prop {string} company_name 公司名称
 * @prop {string} email 邮箱地址
 * @prop {string} logo 公司logo
 * @prop {string} introduce 公司介绍
 * @prop {string} introduce_file 公司介绍文件
 * @prop {string} shops / 关联店铺
 * @prop {string} wechat 微信
 * @prop {number} flag ?
 * @prop {string} contact 联系人
 * @prop {string} contact_phone 联系人电话
 * @prop {string|null} add_by 录入人
 * @prop {number} add_by_id 录入人ID
 * @prop {DateStr} gmt_create 创建时间
 * @prop {DateStr} gmt_modified 修改时间
 * @prop {number} modified_by_id 修改人ID
 * @extends AddressFields
 */
export interface Company extends AddressFields, GmtTimeFields {
  /** ID */
  id: number;
  /** 公司名称 */
  company_name: string;
  /** 公司logo */
  logo?: string;
  /** 公司介绍 */
  introduce: string;
  /** 新增公司原因 **/
  reason: string;
  /** 公司介绍文件 */
  introduce_file: string;
  /** 关联店铺 */
  // shops: string[];
  /** ? */
  flag: number;
  /** 业务联系人 - 联系人 */
  contact: string;
  /** 业务联系人 - 联系人电话 */
  contact_phone: string;
  /** 业务联系人 - 微信 */
  wechat: string;
  /** 业务联系人 - 邮箱地址 */
  email: string;
  address: string;
  /** 录入人 */
  add_by: string | null;
  /** 录入人ID */
  add_by_id: number;
  /** 修改人ID */
  modified_by_id: number;
  /** 财务联系人 - 联系人名称 @since v2.3.1 */
  cw_contact: string;
  /** 财务联系人 - 联系人电话 @since v2.3.1 */
  cw_contact_phone: string;
  /** 财务联系人 - 微信 @since v2.3.1 */
  cw_wechat: string;
  /** 财务联系人 - 邮箱 @since v2.3.1 */
  cw_email: string;
  /** 财务信息 - 开户行 @since v2.3.1 */
  bank_name: string;
  bank_sub_name: string;
  /** 财务信息 - 纳税人识别号 @since v2.3.1 */
  tax_id: string;
  /** 财务信息 - 银行账户 @since v2.3.1 */
  bank_account: string;
  /** 财务信息 - 财务信息联系电话 @since v2.3.1 */
  cw_info_contact_phone: string;
  /** 财务信息 - 接收发票手机号 @since v2.3.1 */
  cw_invoice_phone: string;
  /** 财务信息 - 接收发票邮箱 @since v2.3.1 */
  cw_invoice_email: string;
  /** 财务信息 - 注册地址 @since v2.3.1 */
  cw_register_address: string;
  /** 财务信息 - 是否一般纳税人 @since v2.3.1 */
  is_taxpayer: BooleanType;
  /** 审核状态 */
  verify_status: number | undefined;
  /** 审批流程 */
  approval_flow_detail: any[];
  /** 关联品牌 */
  brands?: Brand[];
  company_account?: {
    /** 银行账号/支付宝账号 */
    account_code?: string;
    account_type?: AccountType;
    bank_city?: string;
    // 联行号
    bank_code?: string;

    bank_id?: number;
    // 开户银行
    bank_name?: string;
    bank_province?: string;
    //  开户支行
    bank_sub_name?: string;
  }[];
  email_address?: string;
}

/**
 * 公司查询筛选项表单
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-30 10:52:49
 * @prop {string} company_name 公司名称
 * @extends PaginationParams
 */
export interface CompanyListQueryForm extends PaginationParams {
  /** 公司名称 */
  company_name: string;
  verify_status: string;
}

/**
 * 公司查询参数
 * @author  Jerry <superzcj_001@163.com>
 * @prop {string} company_name 公司名称
 * @since   2020-10-30 10:53:04
 * @extends PaginationParams
 */
export interface CompanyListQueryParams extends PaginationParams {
  /** 公司名称 */
  company_name?: string;
  /** 是否审核 **/
  verify_status?: number;
}

/**
 *@description: 供应商查询参数
 *@author: 棠棣
 *@since: 2021/8/16 17:14
 */
export interface SupplierListQueryParams {
  pay_way?: number;
  keyword: string;
  verify_status?: number;
}

/**
 *@description: 自动查询项目公司退款账号信息
 *@author: 棠棣
 *@since: 2021/8/17 16:44
 */
export interface CompanyAccountQueryParams {
  business_type: number;
  project_id: number;
}

/**
 *@description: 手动查询项目公司退款账号信息
 *@author: 棠棣
 *@since: 2021/8/17 16:44
 */
export interface CompanyAccountListQueryParams {
  keyword: string;
}

/**
 * 批量删除公司参数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-31 10:30:28
 */
export interface BatchDeleteCompanyParams {
  /** (实际)英文逗号分隔的id */
  ids: number[] | string[];
}

/**
 * (客户)公司表单
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-07 13:25:11
 */
export interface CompanyForm {
  /** 公司ID */
  id?: number;
  /** 公司名称 */
  company_name: string;
  /** 公司LOGO */
  logo: string;
  /** 省市区 */
  cities: string[];
  /** 详细地址 */
  address: string;
  /** 业务联系人 - 联系人名称 */
  contact: string;
  /** 业务联系人 - 联系人电话 */
  contact_phone: string;
  /** 业务联系人 - 微信 */
  wechat: string;
  /** 业务联系人 - 邮箱 */
  email: string;
  /** 公司介绍 */
  introduce: string;
  /** 公司介绍文件 */
  introduce_file: string;
  /** 财务联系人 - 联系人名称 @since v2.3.1 */
  cw_contact: string;
  /** 财务联系人 - 联系人电话 @since v2.3.1 */
  cw_contact_phone: string;
  /** 财务联系人 - 微信 @since v2.3.1 */
  cw_wechat: string;
  /** 财务联系人 - 邮箱 @since v2.3.1 */
  cw_email: string;
  /** 财务信息 - 开户行 @since v2.3.1 */
  bank_name: string;
  /** 财务信息 - 纳税人识别号 @since v2.3.1 */
  tax_id: string;
  /** 财务信息 - 银行账户 @since v2.3.1 */
  bank_account: string;
  /** 财务信息 - 财务信息联系电话 @since v2.3.1 */
  cw_info_contact_phone: string;
  /** 财务信息 - 接收发票手机号 @since v2.3.1 */
  cw_invoice_phone: string;
  /** 财务信息 - 接收发票邮箱 @since v2.3.1 */
  cw_invoice_email: string;
  /** 财务信息 - 注册地址 @since v2.3.1 */
  cw_register_address: string;
  /** 财务信息 - 是否一般纳税人 @since v2.3.1 */
  is_taxpayer: BooleanType;
}

/**
 * 新增公司参数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-31 13:37:52
 * @extends AddressFields
 */
export interface CompanyCreateParams extends AddressFields {
  /** 公司名称 */
  company_name: string;
  /** 公司LOGO */
  logo?: string;
  /** 业务联系人联系人 */
  contact?: string;
  /** 业务联系人联系人电话 */
  contact_phone?: string;
  /** 业务联系人微信 */
  wechat?: string;
  /** 业务联系人邮箱 */
  email?: string;
  /** 财务联系人 - 联系人名称 @since v2.3.1 */
  cw_contact?: string;
  /** 财务联系人 - 联系人电话 @since v2.3.1 */
  cw_contact_phone?: string;
  /** 财务联系人 - 微信 @since v2.3.1 */
  cw_wechat?: string;
  /** 财务联系人 - 邮箱 @since v2.3.1 */
  cw_email?: string;
  /** 财务信息 - 开户行 @since v2.3.1 */
  bank_name: string;
  /** 财务信息 - 纳税人识别号 @since v2.3.1 */
  tax_id: string;
  /** 财务信息 - 银行账户 @since v2.3.1 */
  bank_account: string;
  /** 财务信息 - 财务信息联系电话 @since v2.3.1 */
  cw_info_contact_phone: string;
  /** 财务信息 - 接收发票手机号 @since v2.3.1 */
  cw_invoice_phone?: string;
  /** 财务信息 - 接收发票邮箱 @since v2.3.1 */
  cw_invoice_email?: string;
  /** 财务信息 - 注册地址 @since v2.3.1 */
  cw_register_address: string;
  /** 公司介绍 */
  introduce?: string;
  /** 公司介绍文件 */
  introduce_file?: string;
  /** 财务信息 - 是否一般纳税人 @since v2.3.1 */
  is_taxpayer: BooleanType;
}

/**
 * 编辑公司参数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-31 13:40:27
 */
export interface CompanyEditParams extends CompanyCreateParams {
  /** ID */
  id: number;
}

/**
 * 公司导出参数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-06 14:54:34
 */
export interface CompanyExportParams {
  company_name?: string;
  ids?: string;
}
