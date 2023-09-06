/**
 * 工作台 - 开票(发票)
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-23 13:48:26
 */
import { Get } from '@/utils/request';
import { QUERY_APPROVAL_INFO } from '@/apis/workbench';
import type { HttpResponse } from '@/types/base/http';
import type { ApprovalInfo, ApprovalInfoQueryParams } from '@/types/tiange/workbench';
import { downloadFileFromLink } from '@/utils/func';
import { getToken } from '@/utils/token';

const token = getToken();
const isDev = process.env.NODE_ENV === 'development';

/**
 * 获取审批详情
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-23 13:51:29
 */
export const QueryApprovalInfo = async (
  params: ApprovalInfoQueryParams,
): Promise<HttpResponse<ApprovalInfo>> =>
  Get(QUERY_APPROVAL_INFO, {
    params,
  });

/**
 * 导出PDF
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-19 16:05:07
 */
export function ExportApprovalInfoPDF(approval_id: number) {
  const path = `/api/approval/export_approval_info_pdf?approval_id=${approval_id}&Authorization=${token}`;
  const link = isDev
    ? `${window.location.protocol}${window.location.host}${path}`
    : `${process.env.VUE_APP_BASE_API}${path}`;

  downloadFileFromLink(link);
}
