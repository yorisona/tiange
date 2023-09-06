import * as actions from './actions';
import state from './state';
import getters from './getters';
import mutations from './mutations';

const user = {
  namespaced: true,
  actions,
  state,
  getters,
  mutations,
};
export default user;
