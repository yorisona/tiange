/**
 * 协同模块-洽谈记录mutations
 */

// @ts-nocheck
import { GET_ChatRecord } from './actiontypes';

export default {
  // 获取洽谈记录
  [GET_ChatRecord]: (state, data) => {
    state.ChatRecord = data;
  },
};
