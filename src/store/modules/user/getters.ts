// @ts-nocheck
const getters = {
  // 获取用户信息
  getUserInfo(state) {
    return state.userinfo;
  },
  // 获取用户权限
  getUserRole(state) {
    if (state.userinfo) {
      return state.userinfo.user_rights;
    } else {
      return [];
    }
  },
};

export default getters;
