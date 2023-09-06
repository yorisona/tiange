/*
 * @Author: 肖槿
 * @Date: 2020-04-07 11:57:47
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2020-04-22 17:21:52
 * @FilePath: \goumee-star-frontend\src\store\modules\customer\mutations.js
 */
// @ts-nocheck
const mutations = {
  updateCurrentId(state, id) {
    state.currentId = id;
  },
  updateCustomerInfo(state, customerInfo) {
    state.customerInfo = customerInfo;
  },
  updatePage(state, value) {
    state.currentPage = value;
  },
  companyList(state, value) {
    state.companyList = value;
  },
};
export default mutations;
