/**
 * 工作台 store
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-21 10:21:33
 */
import state from './state';
import mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';

export const workbenchStore = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
