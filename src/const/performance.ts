import { OptionType } from '@/types/base/advanced';
/**
 * 绩效管理相关
 */

export enum EINDICATOR_TYPE {
  /** 定量指标 **/
  RATION = 1,

  /** 定性指标 **/
  QUALITATIVE,
  /** 加分项目 **/
  BONUS,
  /** 扣分项 **/
  DEDUCT,
}

export const INDICATOR_TYPE_MAP = new Map([
  [EINDICATOR_TYPE.RATION, '定量指标'],
  [EINDICATOR_TYPE.QUALITATIVE, '定性指标'],
  [EINDICATOR_TYPE.BONUS, '加分项'],
  [EINDICATOR_TYPE.DEDUCT, '扣分项'],
]);

export const INDICATOR_TYPE_OPTIONS: OptionType<EINDICATOR_TYPE>[] = [
  { label: '定量指标', value: EINDICATOR_TYPE.RATION },
  { label: '定性指标', value: EINDICATOR_TYPE.QUALITATIVE },
  { label: '加分项', value: EINDICATOR_TYPE.BONUS },
  { label: '扣分项', value: EINDICATOR_TYPE.DEDUCT },
];

/**
 * 周期类型
 */

export enum ECYCLE_TYPE {
  MONTHLY = 1,
  QUARTERLY,
  SEMIANNUA,
  ANNUAL,
}
export const ECYCLE_TYPE_MAP = new Map([
  [ECYCLE_TYPE.MONTHLY, '月度'],
  [ECYCLE_TYPE.QUARTERLY, '季度'],
  [ECYCLE_TYPE.SEMIANNUA, '半年度'],
  [ECYCLE_TYPE.ANNUAL, '年度'],
]);

export const ECYCLE_TYPE_OPTIONS: OptionType<ECYCLE_TYPE>[] = [
  { label: '月度', value: ECYCLE_TYPE.MONTHLY },
  { label: '季度', value: ECYCLE_TYPE.QUARTERLY },
  { label: '半年度', value: ECYCLE_TYPE.SEMIANNUA },
  { label: '年度', value: ECYCLE_TYPE.ANNUAL },
];

export enum EEVALUATION_OPERATOR {
  // 被考核人
  BY_EVALUATION_PERSON = 1,
  // 直接主管
  DIRECT_MANAGER = 2,
  // 指定人
  DESIGNATED_USER = 3,
}

// 考核状态
export enum EASSESSMENT_STAGE {
  // 目标制定
  TARGET_SETTING = 1,
  // 目标确认
  TARGET_CONFIRM,
  // 执行中
  IN_PROGRESS,
  // 自评
  SELF,
  // 上级评分
  SUPERIOR,
  // 签字确认
  SIGNATURE,
  // 考核完成
  FINISH,
}
export const EASSESSMENT_STAGE_MAP = new Map([
  [EASSESSMENT_STAGE.TARGET_SETTING, '目标制定'],
  [EASSESSMENT_STAGE.TARGET_CONFIRM, '目标确认'],
  [EASSESSMENT_STAGE.IN_PROGRESS, '执行中'],
  [EASSESSMENT_STAGE.SELF, '自评'],
  [EASSESSMENT_STAGE.SUPERIOR, '上级评分'],
  [EASSESSMENT_STAGE.SIGNATURE, '签字确认'],
  [EASSESSMENT_STAGE.FINISH, '考核完成'],
]);

export const EASSESSMENT_STAGE_OPTIONS: OptionType<EASSESSMENT_STAGE>[] = [
  { label: '目标制定', value: EASSESSMENT_STAGE.TARGET_SETTING },
  { label: '目标确认', value: EASSESSMENT_STAGE.TARGET_CONFIRM },
  { label: '执行中', value: EASSESSMENT_STAGE.IN_PROGRESS },
  { label: '自评', value: EASSESSMENT_STAGE.SELF },
  { label: '上级评分', value: EASSESSMENT_STAGE.SUPERIOR },
  { label: '签字确认', value: EASSESSMENT_STAGE.SIGNATURE },
  { label: '考核完成', value: EASSESSMENT_STAGE.FINISH },
];

// 绩效改进状态
export enum IMPROVEMENT_STATUS {
  // 全部
  ALL = 100,
  // 制定中
  UNDER_FORMULATION = 0,
  // 待审核
  CHECK_PENDING,
  // 待更新
  WAIT_UPDATED,
  // 已驳回
  REJECTED,
  // 已完成
  COMPLETED,
}

export const IMPROVEMENT_STATUS_OPTIONS: OptionType<IMPROVEMENT_STATUS>[] = [
  { label: '全部', value: IMPROVEMENT_STATUS.ALL },
  { label: '制定中', value: IMPROVEMENT_STATUS.UNDER_FORMULATION },
  { label: '待审核', value: IMPROVEMENT_STATUS.CHECK_PENDING },
  { label: '待更新', value: IMPROVEMENT_STATUS.WAIT_UPDATED },
  { label: '已驳回', value: IMPROVEMENT_STATUS.REJECTED },
  { label: '已完成', value: IMPROVEMENT_STATUS.COMPLETED },
];

export const IMPROVEMENT_STATUS_MAP = new Map(
  IMPROVEMENT_STATUS_OPTIONS.map(item => [item.value, item.label]),
);

export enum EASSESSMENT_STATUS {
  OVERDUE = 0,
  /** 正常流转 */
  NORMAL = 1,
  /** 目标制定逾期 */
  GOAL_SETTING_OVERDUE,
  /** 自评逾期 */
  SELF_ASSESSMENT_OVERDUE,
  /** 目标确认逾期 */
  TARGET_CONFRIM_OVERDUE,
  /** 上级评分逾期 */
  SUPERIOR_RATING_OVERDUE,
  /** 签字确认逾期 */
  SIGN_CONFIRM_OVERDUE,
}

export const EASSESSMENT_STATUS_MAP = new Map([
  [EASSESSMENT_STATUS.NORMAL, '正常流转'],
  [EASSESSMENT_STATUS.OVERDUE, '操作逾期'],
]);

export const EASSESSMENT_STATUS_OPTIONS: OptionType<EASSESSMENT_STATUS>[] = [
  { label: '正常流转', value: EASSESSMENT_STATUS.NORMAL },
  { label: '操作逾期', value: EASSESSMENT_STATUS.OVERDUE },
];

/** 允许操作的按钮权限表 **/
export enum ALLOW_OPERATOR_CODES {
  /** 目标制定- 保存 **/
  GOAL_SETTING_SAVE = 11,
  /** 目标制定-提交 */
  GOAL_SETTING_COMMIT = 12,
  /** 目标确定-提交 */
  GOAL_CONFIRM_COMMIT = 21,
  /** 目标确定-同意 */
  GOAL_CONFIRM_PASSED = 22,
  /** 目标确定-驳回 */
  GOAL_CONFIRM_FAILED = 23,
  /** 目标确定-转交 */
  GOAL_CONFIRM_DELIVER = 24,
  /** 目标确定 - 撤销 */
  GOAL_CONFIRM_REVOKE = 25,
  /** 执行中-发起评分 */
  EXECUTING_LAUNCH = 31,
  /** 自评-保存 */
  SELF_ASSESSMENT_SAVE = 41,
  /** 自评-提交 */
  SELF_ASSESSMENT_COMMIT = 42,
  /** 上级评分-提交 */
  SUPERIOR_ASSESSMENT_COMMIT = 51,
  /** 上级评分-撤销 */
  SUPERIOR_ASSESSMENT_REVOKE,
  /** 上级评分-驳回 */
  SUPERIOR_ASSESSMENT_FAILED,
  /** 上级评分-转交 */
  SUPERIOR_ASSESSMENT_DELIVER,
  /** 上级评分-隔级同意 */
  SUPERIOR_ASSESSMENT_LEADER_PASSED,
  /** 上级评分-隔级调整 */
  SUPERIOR_ASSESSMENT_LEADER_COMMIT,
  /** 上级评分-保存 */
  SUPERIOR_ASSESSMENT_SAVE,
  /** 签名确认-提交 */
  SIGNATURE_CONFIRM_COMMIT = 61,
  /** 签名确认-申诉 */
  SIGNATURE_CONFIRM_APPEAL,
  /** 签名确认-申诉撤回 */
  SIGNATURE_CONFIRM_APPEAL_RETRACT,
  /** 签名确认-申诉通过 */
  SIGNATURE_CONFIRM_APPEAL_PASSED,
  /** 签名确认-申诉驳回 */
  SIGNATURE_CONFIRM_APPEAL_FAILED,
  /* 跳过当前节点 */
  SKIP_CURRENT_NODE = 91,
}

export enum AppealStatus {
  /** 未发起 **/
  no_appeal = 1,
  /** 发起申诉 **/
  launch = 2,
  /** 撤回 **/
  retract = 0,
  /** 驳回 **/
  failed = 3,
  /**  通过 **/
  passed = 4,
}

export enum improvementStatus {
  /** 待发起 **/
  to_be_initiated = 0,
  /** 待制定 **/
  to_be_designated = 1,
  /** 待审批 **/
  to_be_approved = 2,
  /** 待更新 **/
  to_be_updated = 3,
  /** 查看 **/
  view = 4,
}
