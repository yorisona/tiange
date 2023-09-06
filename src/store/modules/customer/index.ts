import state from './state';
import getters from './getters';
import mutations from './mutations';

const customer = {
  namespaced: true,
  state,
  getters,
  mutations,
};
export default customer;
