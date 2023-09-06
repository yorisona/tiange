/**
 * 可复用的基础字段
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-30 10:57:45
 */

import { PayableWriteOffInfos } from './commonBusiness/project';
import { WriteOffStatus } from './finance/finance';

/**
 * 财务信息
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-23 13:43:18
 */
export interface InvoiceFields {
  /** 财务-公司开票抬头 */
  invoice_title: string;
  /** 财务-地址 */
  invoice_addr: string;
  /** 财务-纳税人识别号 */
  invoice_number: string;
  /** 财务-账号 */
  invoice_account: string;
  /** 财务-开户行 */
  invoice_bank: string;
  /** 财务-电话 */
  invoice_phone: string;
}

/**
 * 省市区(县)详细地址
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-30 11:00:54
 * @prop {string} province 省
 * @prop {string} city 市
 * @prop {string} county 区(县)
 * @prop {string} address 详细地址
 */
export interface AddressFields {
  /** 省 */
  province: string;
  /** 市 */
  city: string;
  /** 区(县) */
  county: string;
  /** 详细地址 */
  address: string;
}

/**
 * 核销字段
 */
export interface WriteOffFields {
  /** 核销信息 */
  write_off_infos: PayableWriteOffInfos[];
  /** 核销状态 */
  write_off_status: WriteOffStatus;
  /** 实收(已核销)金额 */
  write_off_amount: number;
  /** 未核销（可核销）金额 */
  not_write_off_amount: number;
}
