import state from './state';
import getters from './getters';
import mutations from './mutations';

const requirement = {
  namespaced: true,
  state,
  getters,
  mutations,
};
export default requirement;
