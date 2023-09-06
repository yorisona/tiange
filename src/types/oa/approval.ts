/**
 * OA审批流程节点
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-01 00:25:42
 */
export interface ApprovalFlow {
  /** */
  annexDocHtmls: string;
  /** ID */
  id: string;
  /** 审批节点ID */
  nodeId: string;
  /** 审批节点名称 */
  nodeName: string;
  /** 日期 */
  operateDate: string;
  /** 时间 */
  operateTime: string;
  /** 审批结果 */
  operateType: string;
  /** */
  operatorDept: string;
  /** */
  operatorId: string;
  /** */
  operatorName: string;
  /** 审批人员 */
  receivedPersons: string;
  /** 备注 */
  remark: string;
  /** */
  signDocHtmls: string;
  /** */
  signWorkFlowHtmls: string;
  /** OA 拒绝理由 */
  oa_review_result: string;
}
