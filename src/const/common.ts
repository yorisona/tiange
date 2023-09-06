/*
 * @Author: 肖槿
 * @Date: 2021-07-07 10:19:41
 * @Description: 通用常量
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-02-18 15:05:14
 * @FilePath: \goumee-star-frontend\src\const\common.ts
 */

export enum BusinessType {
  Marketing = 1, // 营销业务
  Taobao, // 淘宝店播
  Douyin, // 抖音店播
  Base, // 基地业务
  Mcn, // MCN
  Area, // 区域店播
  locallife = 7,
}

export enum ChartType {
  Summary = 0, // 汇总数据
  Gmv = 1, // GMV变化趋势
  LiveDuration = 2, // 直播时长变化
  GmvPercent = 3, // 各业务GMV占比
  OperatingAmount = 4, // 运营费用变化
  CommissionAmount = 5, // 预估佣金变化
  Roi = 6, // 定向投放ROI变化
  AnchorCount = 7, // 开播主播数变化
  PromoteAmountTop = 8, // 业务投放TOP5
  NetSalesAmount = 9, // 预估净销额变化
  IncomeAmount = 10, // 到账金额变化
  AvgStay = 11, // 用户停留时长变化
  PromoteAmount = 12, //  投放金额变化
  IncomeAmountPercent = 13, // 各业务到账金额占比
  LiveCount = 14, // 直播场次变化
  MaxUv = 15, // 同时最高在线人数变化
  NewFansCount = 16, // 直播增粉趋势
}
