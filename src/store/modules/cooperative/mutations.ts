/**
 * 协同模块mutations
 */
// @ts-nocheck

import { GET_CustomerDetail, GET_RedDots } from './actiontypes';

// 洽谈记录
import ChatRecordMutations from './chatrecord/mutations';
// 洽谈记录
import ContactMutations from './contact/mutations';
// 合作记录
import CooperationMutations from './cooperation/mutations';
// 执行项目
import ExecuteMutations from './execute/mutations';

export default {
  ...ChatRecordMutations,
  ...CooperationMutations,
  ...ExecuteMutations,
  ...ContactMutations,
  // 获取客户详情
  [GET_CustomerDetail]: (state, data) => {
    state.CustomerDetail = data;
  },
  [GET_RedDots]: (state, data) => {
    state.RedDots = data;
  },
};
