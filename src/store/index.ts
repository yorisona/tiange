/*
 * @Description:
 * @Autor: 神曲
 * @Date: 2020-03-04 16:44:15
 * @LastEditors: 神曲
 * @LastEditTime: 2020-04-17 09:51:29
 */
import Vue from 'vue';
import Vuex from 'vuex';
import requirement from './modules/requirement';
import customer from './modules/customer';
import marketing from './modules/marketing';
import user from './modules/user';
import cooperative from './modules/cooperative';
import global from './modules/global';
import VuexPersistence from 'vuex-persist';
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    marketing,
    requirement,
    customer,
    user,
    cooperative,
    global,
  },
  plugins: [vuexLocal.plugin],
});

export default store;
