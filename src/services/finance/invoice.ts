/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-08-21 11:34:06
 */
// 发票管理 services
import { Get, Post } from '@/utils/request';
import { HttpResponse, ListResponse } from '@/types/base/http';
import { IGPageQuery } from '@/types/tiange/general';
import {
  FinanceInvoice,
  FinanceInvoiceListQueryParams,
  FinanceInvoiceProjectUIDQueryParams,
  ProjectUIDData,
  SettlementListQueryParams,
} from '@/types/tiange/finance/invoice';
import * as APIs from '@/apis/finance';
import { ObjectFilterEmpty } from '@/utils/func';
import { Settlement } from '@/types/tiange/finance/settlement';
import {
  FINANCE_COST_SETTLEMENTS_QUERY_API,
  FINANCE_SETTLEMENT_QUERY_API_APPROVAL,
  COOP_UPLOAD_INVOICE_SETTLEMENT,
  COMMON_UPLOAD_INVOICE_SETTLEMENT,
  SHOP_LIVE_UPLOAD_INVOICE_SETTLEMENT,
  LOCAL_LIFE_INVOICE_SETTLEMENT,
  SUPPLY_CHAIN_INVOICE_SETTLEMENT,
} from '@/apis/settlement';
import { ProjectTypeEnum } from '@/types/tiange/common';

/** 发票管理列表 */
export const GetFinanceInvoiceList = async (
  payload: FinanceInvoiceListQueryParams,
): Promise<ListResponse<FinanceInvoice>> =>
  Get(APIs.GET_FINANCIAL_INVOICE_LIST, { params: { ...ObjectFilterEmpty(payload) } });

/** 发票管理-统计数据 */
export const GetFinanceInvoiceStatistics = async (
  payload: FinanceInvoiceListQueryParams,
): Promise<HttpResponse<any>> =>
  Get(APIs.GET_FINANCIAL_INVOICE_STATISTICS, { params: { ...ObjectFilterEmpty(payload) } });

/** 查询项目编号列表 */
export const QueryProjectUID = async (
  payload: FinanceInvoiceProjectUIDQueryParams,
): Promise<HttpResponse<ProjectUIDData[]>> =>
  Get(APIs.QUERY_PROJECT_UID, { params: { ...ObjectFilterEmpty(payload) } });

export const QuerySettlementList = async (
  type: 'income' | 'cost',
  payload: SettlementListQueryParams,
): Promise<ListResponse<Settlement>> =>
  Get(
    type === 'income' ? FINANCE_SETTLEMENT_QUERY_API_APPROVAL : FINANCE_COST_SETTLEMENTS_QUERY_API,
    {
      params: { ...ObjectFilterEmpty(payload) },
    },
  );

// 作废发票
export const AbolishFinancialInvoice = async (payload: {
  id: number;
  // 是否重新开票
  is_reinvoice: boolean;
  remark?: string;
}): Promise<HttpResponse<undefined>> =>
  Post(APIs.ABOLISH_FINANCIAL_INVOICE, {
    invoice_status: 2,
    ...ObjectFilterEmpty(payload),
  });

// 上传发票 - 开票审批
export const UploadFinancialInvoice = async (payload: {
  invoice_tmp_numbers: string[];
  approval_info_id: number;
}): Promise<HttpResponse<undefined>> =>
  Post(APIs.UPLOAD_INVOICE_APPROVAL, {
    ...ObjectFilterEmpty(payload),
  });

// 上传发票 - 成本结算单
export const UploadInvoiceSettlement = async (
  payload: {
    invoice_tmp_infos: {
      invoice_number: string;
      seller_name: string;
    }[];
    settlement_id: number;
  },
  project_type: ProjectTypeEnum | undefined,
): Promise<HttpResponse<undefined>> => {
  switch (project_type) {
    case ProjectTypeEnum.live:
      return Post(SHOP_LIVE_UPLOAD_INVOICE_SETTLEMENT, {
        ...ObjectFilterEmpty(payload),
      });
    case ProjectTypeEnum.local_life:
      return Post(LOCAL_LIFE_INVOICE_SETTLEMENT, {
        ...ObjectFilterEmpty(payload),
      });
    case ProjectTypeEnum.supply_chain:
      return Post(SUPPLY_CHAIN_INVOICE_SETTLEMENT, {
        ...ObjectFilterEmpty(payload),
      });
    case ProjectTypeEnum.common_business:
      return Post(COMMON_UPLOAD_INVOICE_SETTLEMENT, {
        ...ObjectFilterEmpty(payload),
      });
    case ProjectTypeEnum.marketing:
      return Post(COOP_UPLOAD_INVOICE_SETTLEMENT, {
        ...ObjectFilterEmpty(payload),
      });
    default:
      return Post(SHOP_LIVE_UPLOAD_INVOICE_SETTLEMENT, {
        ...ObjectFilterEmpty(payload),
      });
  }
};

// 开红票
export const RedInvoiceApproval = async (payload: {
  id: string;
  is_certified: number;
  red_invoice_attachment_url: string;
  remark?: string;
  department_id?: number;
}): Promise<HttpResponse<undefined>> =>
  Post(APIs.RED_INVOICE_APPROVAL, {
    ...ObjectFilterEmpty(payload),
  });

// 核销发票
export const WriteOffInvoice = async (
  invoice_id: string | number,
  write_off_list: {
    settlement_id: number;
    write_off_amount: string | number | undefined;
  }[],
): Promise<HttpResponse<undefined>> =>
  Post(APIs.WRITE_OFF_INVOICE, {
    invoice_id,
    write_off_list,
  });

// 查询抖音开票列表
export const QueryBuyinCpsInvoice = async (
  pager: IGPageQuery,
  payload: any,
): Promise<ListResponse<Record<string, any>>> =>
  Get('/api/financial/query_buyin_cps_invoice', {
    params: ObjectFilterEmpty({
      ...payload,
      ...pager,
    }),
  });
