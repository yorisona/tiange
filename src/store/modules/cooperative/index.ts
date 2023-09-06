/**
 * 协同模块状态管理
 */

import state from './state';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';

const cooperative = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default cooperative;
