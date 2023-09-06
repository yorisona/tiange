/**
 * 工作台 Service
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-17 10:56:29
 */

import { Get, Post } from '@/utils/request';
import * as APIs from '@/apis/workbench';
import { HttpResponse, ListResponse } from '@/types/base/http';
import {
  ApprovalInfo,
  ApprovalInfoQueryParams,
  ApprovalListQueryParams,
  // ApprovalRecord,
  ApprovalStreamNode,
  ApprovalStreamQueryParams,
  LoanParams,
  RefundParams,
  UpdateApprovalStatusParams,
  Invoice,
  ApprovalDetailQueryParams,
  UseSealApplyParams,
  DouyinItemRecordExportParams,
  DouyinItemRecordExportModel,
} from '@/types/tiange/workbench';
import { ObjectFilterEmpty } from '@/utils/func';

/**
 * 获取审批流程
 */
export const GetApprovalStream = async (
  payload: ApprovalStreamQueryParams,
): Promise<HttpResponse<ApprovalStreamNode[]>> =>
  Get(APIs.GET_APPROVAL_STREAM, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 获取审批单列表
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-17 14:17:31
 */
export const GetApprovalList = async (
  payload: ApprovalListQueryParams,
): Promise<ListResponse<any>> =>
  Get(APIs.QUERY_APPROVAL_LIST, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 获取审批单详情
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-17 14:17:40
 */
export const GetApprovalInfo = async (
  payload: ApprovalInfoQueryParams,
): Promise<HttpResponse<ApprovalInfo>> =>
  Get(APIs.QUERY_APPROVAL_INFO, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/**
 *  删除开票管理中的审批
 * **/
export const DeleteInvoiceApproval = async (
  approval_id: number,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.QUERY_INVOICE_DELETE, {
    approval_id,
  });
/**
 * 审批
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-19 14:22:57
 */
export const UpdateApprovalStatus = async (
  payload: UpdateApprovalStatusParams,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.UPDATE_APPROVAL_INFO, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 保存用款申请单
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-22 23:34:08
 */
export const SaveTransferApply = async (payload: LoanParams): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_TRANSFER_APPLY, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 退款申请保存
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-22 23:40:15
 */
export const SaveRefundApply = async (payload: RefundParams): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_REFUND_APPLY, {
    ...ObjectFilterEmpty(payload),
  });

export const GetAllProject = async (payload: any): Promise<HttpResponse<any>> =>
  Get(APIs.QUERY_ALL_PROJECTS, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 开票申请
export const PostSaveInvoiceApplay = async (payload: Invoice): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_INVOICE_APPLY, {
    ...ObjectFilterEmpty(payload),
  });

/**
 *@description: 保存垫款申请（new）
 *@author: 棠棣
 *@since: 2021/8/18 14:43
 */
export const SaveAdvanceApply = async (payload: any): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_BORROWING_APPLY, {
    ...ObjectFilterEmpty(payload),
  });

export const GetAdvanceDetail = async (
  payload: ApprovalDetailQueryParams,
): Promise<HttpResponse<any>> =>
  Get(APIs.QUERY_APPROVAL_INFO, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/**
 * 非合同用印飞书申请
 * @param payload
 * @returns
 */
export const SaveNotContractUseSeal = async (
  payload: UseSealApplyParams,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_NOT_CONTRACT_USE_SEAL, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 抖音项目商品导出记录查询
 * @param payload
 * @returns
 */
export const QueryDouyinItemExportRecord = async (
  payload: DouyinItemRecordExportParams,
): Promise<ListResponse<DouyinItemRecordExportModel>> =>
  Get(APIs.QUERY_DOUYIN_ITEM_EXPORT_RECORD, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 抖音项目商品导出记录状态查询
 * @param payload
 * @returns
 */
export const QueryDouyinItemExportRecordStatus = async (payload: {
  record_ids: string;
}): Promise<HttpResponse<DouyinItemRecordExportModel[]>> =>
  Get(APIs.QUERY_DOUYIN_ITEM_EXPORT_RECORD_STATUS, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 获取审批单列表
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-17 14:17:31
 */
export const GetProjectFilesList = async (payload: {
  business_type?: string | undefined;
  department_id?: number | undefined;
  project_id?: number | undefined;
  project_name?: string | undefined;
  num?: number | undefined;
  page_num?: number | undefined;
}): Promise<HttpResponse<any>> =>
  Get(APIs.QUERY_PROJECT_FILES_LIST, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
