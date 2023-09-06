/**
 * 协同模块-执行项目mutations
 */
// @ts-nocheck

import { GET_CooperationAE, GET_CurrentAE, GET_CurrentAERecordList } from './actiontypes';

export default {
  // 获取查询跟单AE记录
  [GET_CooperationAE]: (state, data) => {
    state.CooperationAE = data;
  },
  // 获取当前执行AE
  [GET_CurrentAE]: (state, data) => {
    state.CurrentAE = data;
  },
  // 当前执行AE跟单记录
  [GET_CurrentAERecordList]: (state, data) => {
    state.CurrentAERecordList = data;
  },
};
