/**
 * 工作台
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-17 10:56:09
 */

/**
 * 获取审批流程
 * @prop method GET
 */
export const GET_APPROVAL_STREAM = '/api/approval/get_approval_stream';

/**
 * 保存用款申请单
 * @prop method POST
 */
export const SAVE_TRANSFER_APPLY = '/api/approval/save_transfer_apply';

/**
 * 查询审批列表
 * @prop method GET
 */
export const QUERY_APPROVAL_LIST = '/api/approval/query_approval_list';

/**
 * 获取审批详情
 * @prop method GET
 */
export const QUERY_APPROVAL_INFO = '/api/approval/query_approval_info';

/**
 * 更新审批单状态
 * @prop method POST
 */
export const UPDATE_APPROVAL_INFO = '/api/approval/update_approval_info';

/**
 * 获取已通过的审批单id列表
 * @prop method GET
 */
export const QUERY_APPROVAL_ID_LIST = '/api/approval/query_approval_id_list';

/**
 * 导出pdf
 * @prop method GET
 */
export const EXPORT_APPROVAL_INFO_PDF = '/api/approval/export_approval_info_pdf';

/**
 * 开票申请详情
 * @prop method GET
 */
export const QUERY_INVOICE_APPLY = '/api/approval/query_invoice_apply';

/**
 * 保存开票申请
 * @prop method POST
 */
export const SAVE_INVOICE_APPLY = '/api/approval/save_invoice_apply';

/**
 * 保存退款申请单
 * @prop method POST
 */
export const SAVE_REFUND_APPLY = '/api/approval/save_refund_apply';

/**
 * 保存借款申请单
 * @prop method POST
 */
export const SAVE_BORROWING_APPLY = '/api/approval/save_borrowing_apply';

/**
 * 上传附件、照片
 * @prop method POST
 */
export const UPLOAD_ATTACHMENT = '/api/approval/upload_attachment';

// 查所有项目
export const QUERY_ALL_PROJECTS = '/api/approval/query_all_projects';

/**
 *  删除开票管理中的审批
 * **/
export const QUERY_INVOICE_DELETE = '/api/approval/delete';

/**
 *  非合同用印飞书申请
 * **/
export const SAVE_NOT_CONTRACT_USE_SEAL = '/api/approval/save_not_contract_use_seal';
/**
 *  抖音项目商品导出记录查询
 * **/
export const QUERY_DOUYIN_ITEM_EXPORT_RECORD = '/api/shop_live/query_douyin_item_export_record';
/**
 *  抖音项目商品导出记录状态查询
 * **/
export const QUERY_DOUYIN_ITEM_EXPORT_RECORD_STATUS =
  '/api/shop_live/query_douyin_item_export_record_status';

/**
 * 查询项目清单列表
 * @prop method GET
 */
export const QUERY_PROJECT_FILES_LIST = '/api/shop_live/workbench/shop_live_projects';
