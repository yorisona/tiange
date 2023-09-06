import state from './state';
import * as getters from './getters';
import * as actions from './actions';
import mutations from './mutations';

const project = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
export default project;
