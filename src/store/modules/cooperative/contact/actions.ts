/**
 * 客户联系人Actions
 */
// @ts-nocheck
import { getContact } from '@/api/cooperative';
import { GET_Contact } from './actiontypes';
import { Message } from 'element-ui';

// 获取客户联系人
const GetContact = ({ commit }, data) => {
  getContact(data)
    .then(res => {
      if (res.data.success) {
        const contact_record = res.data.data;
        commit(GET_Contact, contact_record);
      } else {
        if (res.data.error_code !== 200) {
          // error_code: 200 权限不足
          Message.error(res.data.message);
        }
        commit(GET_Contact, null);
      }
    })
    .catch(err => {
      Message.error(err);
    });
};

export default {
  GetContact,
};
