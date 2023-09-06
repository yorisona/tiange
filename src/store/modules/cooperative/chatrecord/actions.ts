/**
 * 协同模块-洽谈记录Actions
 */
// @ts-nocheck
import { getConversation } from '@/api/cooperative';
import { GET_ChatRecord } from './actiontypes';
import { Message } from 'element-ui';

// 获取洽谈记录
const GetConversation = ({ commit }, data) => {
  getConversation(data)
    .then(res => {
      if (res.data.success) {
        const chatrecord = res.data.data;
        commit(GET_ChatRecord, chatrecord);
      } else {
        if (res.data.error_code !== 200) {
          // error_code: 200 权限不足
          Message.error(res.data.message);
        }
        commit(GET_ChatRecord, null);
      }
    })
    .catch(err => {
      Message.error(err);
    });
};

export default {
  GetConversation,
};
