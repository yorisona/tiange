/**
 * 客户联系人mutations
 */

// @ts-nocheck
import { GET_Contact } from './actiontypes';

export default {
  // 获取客户联系人
  [GET_Contact]: (state, data) => {
    state.ContactList = data;
  },
};
