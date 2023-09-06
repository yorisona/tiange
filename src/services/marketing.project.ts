/**
 * 营销业务-项目管理
 * @author  tingzhu <tingzhu@goumee.com>
 * @since   2021-04-08 13:10:00
 */

import * as APIs from '@/apis/marketing.project';
import type {
  CostSchedule,
  MarketingProject,
  MarketingProjectForm,
  MarketingProjectFormAddCustomer,
  MarketingProjectQueryParams,
  MarketingProjectDetail as ProjectDetail,
  MarketingProjectConfirmEndForm,
  SettlementForPayment,
  MarketingStartPayParams,
} from '@/types/tiange/marketing/project';
import { Get, Post } from '@/utils/request';
import { HttpResponse, ListResponse } from '@/types/base/http';
import { ObjectFilterEmpty } from '@/utils/func';
import { QUERY_APPROVAL_ID_LIST } from '@/apis/workbench';
import { CostInfoParams } from '@/types/tiange/marketing/project';
import { MarketingProjectAeForm } from '@/types/tiange/marketing/ae';
import { RebateParams, CostScheduleShouldPayment } from '../types/tiange/marketing/project';

// 查询成本  QUERY_COST
export const queryCost = async (
  cooperation_id: number | string,
  is_hide_reverse_data: number | undefined,
): Promise<HttpResponse<CostSchedule>> =>
  Get(APIs.QUERY_COST, {
    params: {
      ...ObjectFilterEmpty({
        cooperation_id,
        num: 1000,
        page_num: 1,
        is_hide_reverse_data: is_hide_reverse_data,
      }),
    },
  });
// 查询成本  QUERY_COST
export const queryMarketPayables = async (
  project_id: number | string,
  payable_type: number | string,
  is_hide_reverse_data: number | undefined,
): Promise<HttpResponse<CostScheduleShouldPayment>> =>
  Get(APIs.QUERY_MARKET_PAYABLES, {
    params: {
      ...ObjectFilterEmpty({
        project_id,
        payable_type,
        is_hide_reverse_data: is_hide_reverse_data,
      }),
    },
  });
// 删除成本  QUERY_COST
export const delCost = async (cost_id: number): Promise<HttpResponse<any>> =>
  Post(APIs.DEL_COST, {
    cost_id: cost_id,
  });
// 添加成本
export const addCostList = async (costList: CostInfoParams[]): Promise<HttpResponse<any>> =>
  Post(APIs.ADD_COST_LIST, costList);

// 保存返点
export const saveRebateCost = async (rebate: RebateParams): Promise<HttpResponse<any>> =>
  Post(APIs.SAVE_REBATE_COST, rebate);

// 更新成本
export const updateCost = async (cost: CostInfoParams): Promise<HttpResponse<any>> =>
  Post(APIs.UPDATE_COST, cost);

// 查询业绩
export const queryArchievement = async (cooperation_id: number): Promise<HttpResponse<any>> =>
  Get(APIs.QUERY_ACHIEVEMENT, {
    params: {
      cooperation_id: cooperation_id,
      num: 1000,
      page_num: 1,
      is_reverse: true,
    },
  });
// 获取已通过的审批单id列表,level_three_types 用款申请：3-对公银行，4-对公支付宝
export const queryApprovalList = async (
  approval_type: number,
  customer_id?: number | string,
  level_three_types?: 3 | 4,
): Promise<HttpResponse<any>> =>
  Get(QUERY_APPROVAL_ID_LIST, {
    params: {
      approval_type,
      customer_id,
      level_three_types,
    },
  });
// 返回指定kol的所属机构
export const queryKolCompany = async (kol_id: number): Promise<HttpResponse<any>> =>
  Get(APIs.QUERY_KOL_COMPANY, {
    params: {
      kol_id,
    },
  });

/**
 * 上传图片
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-15 10:07:19
 */
export const UploadFile = async (
  formData: FormData,
): Promise<
  HttpResponse<{
    /** size */
    size: number;
    /** 地址 */
    source: string;
  }>
> => Post('/api/resources/upload_file', formData);

/** 营销业务 项目列表 (合作列表) */
export const GetMarketingProject = async (
  payload: MarketingProjectQueryParams,
): Promise<ListResponse<MarketingProject>> =>
  Get(APIs.MARKETING_PROJECT_LIST_API, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 保存 营销业务项目 */
export const SaveMarketingProject = async (
  payload: MarketingProjectForm,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.MARKETING_PROJECT_SAVE_API, {
    ...ObjectFilterEmpty(payload),
  });

/** 营销业务项目 客户列表 */
export const GetCustomerList = async (
  payload: string,
): Promise<ListResponse<MarketingProjectFormAddCustomer>> =>
  Get(APIs.CUSTOMER_LIST_API, {
    params: {
      mult_args: payload,
    },
  });

/** 营销业务 项目详情 */
export const GetMarketingProjectDetail = async (id: string): Promise<HttpResponse<ProjectDetail>> =>
  Get(APIs.MARKETING_PROJECT_DETAIL_API.replace(':id', id));

/** 指定AE 营销业务项目详情 */
export const SaveMarketingProjectAe = async (
  payload: MarketingProjectAeForm,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.MARKETING_PROJECT_SAVE_AE_API, {
    ...ObjectFilterEmpty(payload),
  });

/** 营销项目 执行结束 结束合作 */
export const SaveMarketingProjectConfirmEnd = async (
  payload: MarketingProjectConfirmEndForm,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.MARKETING_PROJECT_CONFIRM_END_API, {
    ...ObjectFilterEmpty(payload),
  });

/** 对外申请用款 */
export const SavePaymentApplyDialog = async (payload: any): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_TRANSFER_APPLY, {
    ...ObjectFilterEmpty(payload),
  });

/** 对外申请退款 */
export const SaveRefundApplyDialog = async (payload: any): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_REFUND_APPLY, {
    ...ObjectFilterEmpty(payload),
  });

/** 查询可创建付款的成本结算单 */
export const QuerySettlementForPayment = async (payload?: {
  settlement_id: number | string | undefined;
  settlement_uid: number | string | undefined;
  business_type: number | string | undefined;
}): Promise<HttpResponse<SettlementForPayment[]>> =>
  Get(APIs.QUERY_SETTLEMENT_FOR_PAYMENT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 对外申请付款---合同附件 */
export const QuerySettlementContractForPayment = async (payload: {
  settlement_ids: string;
}): Promise<HttpResponse<undefined>> => {
  return Get('/api/approval/query_settlements_contract', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};
/** 发起打款 */
export const CreateCostPayment = async (
  payload: MarketingStartPayParams,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.CREATE_COST_PAYMENT, {
    ...ObjectFilterEmpty(payload),
  });
