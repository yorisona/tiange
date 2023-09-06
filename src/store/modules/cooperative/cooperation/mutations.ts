/**
 * 协同模块-合作记录mutations
 */

// @ts-nocheck
import {
  GET_CooperationList,
  GET_CooperationDetail,
  SET_CooperationDetailStatus,
  GET_AchievementList,
  GET_CostList,
  GET_CurrentAERecordList,
  GET_RebatesList,
} from './actiontypes';

export default {
  // 获取合作记录
  [GET_CooperationList]: (state, data) => {
    state.CooperationList = data;
  },
  // 获取合作详情
  [GET_CooperationDetail]: (state, data) => {
    state.CooperationDetail = data;
  },
  // 设置当前合作详情状态
  [SET_CooperationDetailStatus]: (state, data) => {
    state.CooperationdetailStatus = data;
  },
  // 获取业绩记录
  [GET_AchievementList]: (state, data) => {
    state.AchievementList = data;
  },
  // 获取安排成本记录
  [GET_CostList]: (state, data) => {
    state.CostList = data;
  },
  // 设置ae跟单记录
  [GET_CurrentAERecordList]: (state, data) => {
    state.CurrentAERecordList = data;
  },
  // 获取返点安排记录
  [GET_RebatesList]: (state, data) => {
    state.RebatesList = data;
  },
};
