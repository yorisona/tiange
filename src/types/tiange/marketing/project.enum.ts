/**
 * 合作状态
 * @author  wuyou <wuyou@goumee.com>
 * @since   2021-04-12 17:55:18
 */
export enum ProjectCooperationStatusEnum {
  /** 意向客户 */
  InterestedCustomer = 1,
  /** 确定合作 */
  DetermineCooperation,
  /** 执行项目 */
  ExecuteProject,
  /** 执行结束 */
  ExecuteEnd,
  /** @deprecated 数据入库 */
  ImportData,
}

export const MarketingProjectCooperationStatusMap = new Map([
  [ProjectCooperationStatusEnum.InterestedCustomer, '意向客户'],
  [ProjectCooperationStatusEnum.DetermineCooperation, '确定合作'],
  [ProjectCooperationStatusEnum.ExecuteProject, '执行项目'],
  [ProjectCooperationStatusEnum.ExecuteEnd, '执行结束'],
  [ProjectCooperationStatusEnum.ImportData, '数据入库'],
]);

/** 合作类型 */
export enum MarketingProjectCooperationTypeEnum {
  /** 直播 */
  live = 1,

  /** 视频 */
  video = 2,

  /** 图文 */
  graphic = 3,
}

export const MarketingProjectCooperationTypeMap = new Map([
  [MarketingProjectCooperationTypeEnum.live, '直播'],
  [MarketingProjectCooperationTypeEnum.video, '视频'],
  [MarketingProjectCooperationTypeEnum.graphic, '图文'],
]);
