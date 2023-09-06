/**
 * 组件示例页面
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-03-04 16:20:40
 */
import { RouteConfig } from 'vue-router';
import RouterViewEmptyPage from '@/layouts/empty.vue';

// * 系统设置
export const demoRoute: RouteConfig = {
  path: '/components',
  name: 'Components',
  component: RouterViewEmptyPage,
  meta: {
    name: '组件示例',
    hidden: false,
    class: 'cls-star-info',
    icon: 'ico-xitongguanli',
    isKeepLive: false,
    right: [],
    noauth: true,
  },
  children: [
    {
      path: '/components/button',
      name: 'ComponentsButton',
      component: () => import('../modules/demo/button/index.vue'),
      meta: {
        name: '按钮',
        hidden: false,
        parentPath: '/system',
        right: [],
        noauth: true,
      },
    },
    {
      path: '/components/checkbox',
      name: 'ComponentsCheckbox',
      component: () => import('../modules/demo/checkbox/index.vue'),
      meta: {
        name: 'CheckBox/Radio',
        hidden: false,
        parentPath: '/system',
        right: [],
        noauth: true,
      },
    },
    {
      path: '/components/divider',
      name: 'ComponentsDivider',
      component: () => import('../modules/demo/checkbox/index.vue'),
      meta: {
        name: 'Divider',
        hidden: false,
        parentPath: '/system',
        right: [],
        noauth: true,
      },
    },
    {
      path: '/components/step',
      name: 'ComponentsStep',
      component: () => import('../modules/demo/step/index.vue'),
      meta: {
        name: '步骤条',
        hidden: false,
        parentPath: '/system',
        right: [],
        noauth: true,
      },
    },
    {
      path: '/components/empty',
      name: 'ComponentsEmpty',
      component: () => import('../modules/demo/empty/index.vue'),
      meta: {
        name: '无数据展示',
        hidden: false,
        parentPath: '/system',
        right: [],
        noauth: true,
      },
    },
  ],
};
