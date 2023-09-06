/**
 * 运营中心路由
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-10 10:42:56
 */
import { RouteConfig } from 'vue-router';
import RouterViewEmptyPage from '@/layouts/empty.vue';

// 运营中心
export const operationRoute: RouteConfig = {
  path: '/operation',
  name: 'OperationCenter',
  component: RouterViewEmptyPage,
  meta: {
    name: '运营中心',
    hidden: false,
    class: 'cls-customer-info',
    icon: 'ico-menu-operation',
    isKeepLive: false,
  },
  children: [
    // 二级菜单 - 人员管理
    {
      path: '/operation/user/user',
      name: 'UserManagementUser',
      component: () => import('../views/user/UserInfo.vue'),
      meta: {
        name: '人员管理',
        hidden: false,
        class: 'cls-user',
        isKeepLive: false,
        activePath: '/operation/user',
        parentPath: '/operation',
        right: [],
      },
    },
    {
      path: '/operation/user/role',
      name: 'UserManagementRole',
      component: () => import('../views/user/RoleInfo.vue'),
      meta: {
        name: '角色管理',
        hidden: false,
        class: 'cls-user',
        isKeepLive: false,
        activePath: '/operation/user',
        parentPath: '/operation',
        right: [],
      },
    },
  ],
};
