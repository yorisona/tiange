/*
 * @Description:
 * @Autor: 神曲
 * @Date: 2020-04-18 18:28:44
 * @LastEditors: 神曲
 * @LastEditTime: 2020-04-20 10:38:57
 */
/**
 * 协同模块getters
 */
// @ts-nocheck

export default {
  CustomerDetail: state => state.CustomerDetail, // 客户详情
  ChatRecord: state => state.ChatRecord, // 洽谈记录
  ContactList: state => state.ContactList, // 客户联系人
  CooperationList: state => state.CooperationList, // 合作记录
  CooperationDetail: state => state.CooperationDetail, // 合作详情
  CooperationdetailStatus: state => state.CooperationdetailStatus, // 当前合作详情状态
  AchievementList: state => state.AchievementList, // 业绩记录
  CostList: state => state.CostList, // 成本记录
  CooperationAE: state => state.CooperationAE, // 执行AE
  CurrentAE: state => state.CurrentAE, // 当前AE
  CurrentAERecordList: state => state.CurrentAERecordList, // 当前AE跟单记录
  RebatesList: state => state.RebatesList, //返点记录
  RedDots: state => state.RedDots, //侧边栏工作台小红点
};
