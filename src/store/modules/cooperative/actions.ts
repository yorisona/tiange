/**
 * 协同模块Actions
 */
// @ts-nocheck
import { GetCustomer } from '@/services/customers';
import { GET_CustomerDetail } from './actiontypes';
import { Message } from 'element-ui';

// 洽谈记录
import ChatRecordActions from './chatrecord/actions';
// 客户联系人
import ContactActions from './contact/actions';
// 合作记录
import CooperationActions from './cooperation/actions';
// 执行项目
import ExecuteActions from './execute/actions';

// 获取客户详情
const GetCustomerDetail = async ({ commit }, customer_id) => {
  try {
    const { data: response } = await GetCustomer({ customer_id });

    if (response.success) {
      const customer_detail = response.data.data[0];
      commit(GET_CustomerDetail, customer_detail);
    } else {
      Message.error(response.message);
      commit(GET_CustomerDetail, null);
    }
  } catch (err) {
    Message.error(err);
  }
};

export default {
  GetCustomerDetail,
  ...ChatRecordActions,
  ...CooperationActions,
  ...ExecuteActions,
  ...ContactActions,
};
