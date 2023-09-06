/**
 * 营销业务 - 业绩登记表
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-08 14:01:46
 */
import { GatherTypes } from '@/const/options';
import { HttpResponse } from '@/types/base/http';
import { PaginationParams } from '@/types/base/pagination';
import { WriteOffFields } from '../fields';
import { ReverseFields } from '../finance/finance';

/**
 * 业绩登记表列表查询参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-14 13:46:29
 */
export interface AchievementQueryParams extends PaginationParams {
  cooperation_id: number;
}

/**
 * 业绩登记表列表应收查询参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-14 13:46:29
 */
export interface AchievementReceivableQueryParams extends PaginationParams {
  receivable_type?: number;
  project_id?: number;
  is_hide_reverse_data?: number | undefined;
}

export interface AchievementIncoiveInfo {
  /** 图 */
  pic_url: string;
  /** 发票号码 */
  invoice_num: string;
  /** 开票日期 */
  invoice_date: string;
  /** 开票金额 */
  amount: string;
  /** 开票机构 */
  institution: string;
}

/**
 * 业绩登记表
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-14 13:47:17
 */
export interface Achievement extends ReverseFields, WriteOffFields {
  /** 收款编号 */
  achievement_id: number;
  /** 业绩UID */
  achievement_uid: string;
  /** 业绩名称 */
  achievement_name: string;
  /** 开票审批编号 */
  approval_uid: string | null;
  /** 合同ID */
  contract_id: number | null;
  /** 合同ID */
  contract_info: {
    company_name: string | null;
    coop_start_date: string | null;
    coop_end_date: string | null;
    sign_type_name: string | null;
    contract_type: number | null;
    has_template_info: boolean;
  } | null;
  /** 合同编号 */
  contract_uid: string | null;
  /** 合作编号 */
  cooperation_id: number | null;
  /** 客户ID */
  customer_id: number;
  /** 收款金额 */
  gather_amount: number;
  /** 收款凭证 */
  gather_certificate_pic: string;
  /** 确认收款详情 */
  gather_confirm_detail: {
    /** 时间 */
    order_date?: string;
    /** 名称 */
    pay_company_name?: string;
    /** 账号 */
    account?: string;
    /** 开户行 */
    bank_of_deposit?: string;
  } | null;
  /** 收款日期 */
  gather_date: string;
  /** 收款类型 1---服务费 2---佣金 3---其他 */
  gather_type: GatherTypes | null;
  /** 收款方式 1---V任务 2---支付宝 3---对公银行 */
  gather_way: number;
  /** 收款方式向详情 */
  gather_way_detail: {
    /** 下单时间 */
    order_date: string;
    /** 下单旺旺名 */
    order_wangwang_id: string;
    /** 任务ID */
    task_id: string;
    /** 打款公司名称 */
    pay_company_name: string;
  };
  /** 关联开票审批ID */
  invoice_apply_id: number | null;
  /** 发票信息 */
  invoice_info: AchievementIncoiveInfo[];
  /** 是否收款(已开票) 0---否 1---是 */
  is_gather: number | null;
  /** 是否需要开票 0---否 1---是 */
  is_invoice: number;
  /** 项目ID */
  project_id: number;
  /** 退款金额 */
  refund_amount: number;
  /** 登记成本金额 */
  total_pay_amount: number;
  /** 已付成本金额 */
  total_paid_amount: number;
  /** 退款金额 */
  refund_amount_str: string;
  /** 添加者 */
  add_by: string;
  /** 添加者ID */
  add_by_id: number;
  /** 业务类型 1---营销业务 2---淘宝店播 */
  business_type: number[];
  flag: number;
  gmt_create: string;
  gmt_modified: string;
  /** 发票 */
  invoice_certificate_pic: string;
  modified_by_id: number;
  receivable_type?: number;
  refund_write_off_amount: number;
  refund_cost_id: number;
  refund_write_off_info_items: any;
  refund_write_off_status: number;
  /** 是否发起了退款，退款被退回也为false */
  has_refund: boolean;
  settlement_id: number;
  revenue_flow_id?: number;
  /** 存在即为新的合同，否则为老合同 */
  template_info: any;
  customer_company_id?: number;
  customer_company_name?: string;
}

/**
 * 项目收款(应收)
 */
export interface AchievementReceivable extends Achievement, ReverseFields {
  id: number;
  receivable_uid: string;
  receivable_amount: number;
  create_date: string;
  settlement_uid: string;
  not_write_off_amount: number;
  refund_write_off_infos: any;
}

/**
 * 汇总数据
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-14 13:56:02
 */
export interface AchievementStatInfo {
  /** 确认收款金额 */
  confirmed_gather_amount: number;
  /** 登记收款款金额 */
  total_gather_amount: number;
  /** 等待确认金额 */
  wait_gather_amount: number;
  write_off_amount: number;
  not_write_off_amount: number;
}

/**
 * 应收汇总数据
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-14 13:56:02
 */
export interface AchievementReviceivablesStatInfo {
  /** 应收款金额 */
  receivable: number;
  /** 已核销 */
  write_off: number;
  /** 未核销 */
  not_write_off: number;
}
/**
 * 业绩登记表列表查询响应数据
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-14 13:52:45
 */
export type AchievementResponse = HttpResponse<{
  total: number;
  data: Achievement[];
  stat_info: AchievementStatInfo;
}>;
/**
 * 业绩登记表列表查询响应数据
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-14 13:52:45
 */
export type AchievementReceivableResponse = HttpResponse<{
  total: number;
  data: AchievementReceivable[];
  /** 应收款金额 */
  receivable: number;
  /** 已核销 */
  write_off: number;
  /** 未核销 */
  not_write_off: number;
}>;
/**
 * 删除业绩请求参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-14 15:30:22
 */
export interface AchievementDeleteParams {
  /** 收款编号 */
  achievement_id: number;
}

/**
 * 业绩表单
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-14 16:51:40
 */
export interface AchievementForm {
  /** 业绩名称 */
  achievement_name: string;
  /** 收款类型 1---服务费 2---佣金 3---其他 */
  gather_type: number;
  /** 合同ID */
  contract_id: number | '';
  /** 收款金额(元) */
  gather_amount: string;
  /** 收款方式 1---V任务 2---支付宝 3---对公银行 */
  gather_way: number;
  /** V任务ID */
  task_id: string;
  /** 下单旺旺名 */
  order_wangwang_id?: string;
  /** 日期(V任务必填) */
  order_date?: string;
  /** 是否需要开票 */
  is_invoice: number;
  /** 收款凭证 */
  gather_certificate_pic: string;
  /** 公司名称(对公银行必填) */
  pay_company_name?: string;
  /** 收款编号 */
  achievement_id?: number;
  /** 合作ID */
  cooperation_id: number | '';
}

/**
 * 业绩保存参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-14 16:38:58
 */
export interface AchievementSaveParams {
  /** 合作ID */
  cooperation_id: number;
  /** 收款方式 1---V任务 2---支付宝 3---对公银行 */
  gather_way: number;
  /** 收款金额(元) */
  gather_amount: string;
  /** 下单旺旺名 */
  order_wangwang_id?: string;
  /** V任务ID */
  task_id?: string;
  /** 是否需要开票 */
  is_invoice?: number;
  /** 收款凭证 */
  gather_certificate_pic: string;
  /** 日期(V任务必填) */
  order_date?: string;
  /** 公司名称(对公银行必填) */
  pay_company_name?: string;
  /** 收款编号 */
  achievement_id?: number;
  /** 业绩名称 */
  achievement_name: string;
  /** 收款类型 1---服务费 2---佣金 3---其他 */
  gather_type: number;
  /** 合同ID */
  contract_id?: number;
}

/**
 * 上传凭证类型
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-15 10:11:50
 */
export enum CertificateUpdateType {
  /** 业绩收款凭证 */
  AchievementGatherCertificate = 'certificate/achievement_gather_certificate',
  /** 业绩开票凭证 */
  AchievementInvoiceCertificate = 'certificate/achievement_invoice_certificate',
  /** 成本开票凭证 */
  CostInvoiceCertificate = 'certificate/cost_invoice_certificate',
  /** 成本打款凭证 */
  CostPayCertificate = 'certificate/cost_pay_certificate',
  /** 返点打款凭证 */
  RebatePayCertificate = 'certificate/rebate_pay_certificate',
}

/**
 * 上传凭证参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-15 10:26:33
 */
export interface UploadCertificateParams {
  /** 上传类型 */
  type: CertificateUpdateType;
  /** 文件 */
  file: File;
  /** 业绩/返点/成本 ID */
  achievement_or_cost_id?: number;
}

export interface submitWrteOff {
  /** 应收编号 */
  receivable_uid: string;
  /** 实收编号 */
  receipt_uid: string;
  /** 核销金额 */
  write_off_amount: string;
}
export interface payableSubmitWrteOff {
  /** 应付编号 */
  payable_uid: string;
  /** 实付编号 */
  paid_uid: string;
  /** 核销金额 */
  write_off_amount: string;
}
// 提交核销
export interface writeOffParams {
  list: submitWrteOff[];
  confirm: boolean;
  project_type?: string;
}

/** 实付应付创建核销参数 */
export interface payableIns {
  list: payableSubmitWrteOff[];
  confirm: boolean;
  project_type?: string;
}
