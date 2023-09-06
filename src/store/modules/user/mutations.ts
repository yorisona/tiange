/*
 * @Description: 用户 store
 * @Author: 白青
 * @Date: 2019-08-06 09:35:27
 * @LastEditTime: 2019-08-27 18:12:39
 * @LastEditors: 白青
 */
// @ts-nocheck
import { RIGHT_CODE } from '@/const/roleCode';

const mutations = {
  // 登录
  login(state, userinfo) {
    state.userinfo = userinfo;
  },
  // 更新用户信息
  setUserinfo(state, userinfo) {
    state.userinfo = userinfo;
  },
  // 退出
  logout(state) {
    state.userinfo = undefined;
  },
  // 更新权限
  updateUserPower(state, powers) {
    state.userinfo.user_rights = powers;
  },
  // 更改用户菜单权限
  updateUserMenuPower(state, menuPages) {
    const userRights = state.userinfo.user_rights;
    menuPages.forEach(item => {
      if (item.meta.right) {
        const hasOneRightInRightsArr = item.meta.right.some(right => {
          return userRights.includes(RIGHT_CODE[right]);
        });
        item.hidden = !hasOneRightInRightsArr;
        // 判断二级菜单是否拥有权限
        if (item.meta.children) {
          item.meta.children.forEach(children => {
            const hasRight = children.right.some(right => {
              return userRights.includes(RIGHT_CODE[right]);
            });
            children.hidden = !hasRight;
          });
        }
      }
    });
    state.menuPages = menuPages;
  },
};

export default mutations;
