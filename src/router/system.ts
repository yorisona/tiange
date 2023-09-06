/**
 * 系统设置
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-24 15:10:12
 */
import { RouteConfig } from 'vue-router';
import { RouterDataCenter, RouterNameSystem } from '@/const/router';
import RouterViewEmptyPage from '@/layouts/empty.vue';
import { routeParams2Props } from './func';
import { RIGHT_CODE } from '@/const/rightCode';

const { system_news_list } = RIGHT_CODE;

// * 系统设置
export const systemRoute: RouteConfig = {
  path: '/system',
  name: RouterNameSystem.main,
  component: RouterViewEmptyPage,
  meta: {
    name: '系统设置',
    hidden: false,
    class: 'cls-star-info',
    icon: 'ico-menu-xitongshezhi',
    isKeepLive: false,
    noauth: true,
    right: [
      // user_list,
      system_news_list,
      RIGHT_CODE.datacenter_statistics_view,
      RIGHT_CODE.ending_category_edit,
    ],
  },
  children: [
    {
      path: '/system/user',
      name: RouterNameSystem.user.list,
      component: () => import('../modules/system/user/index.vue'),
      meta: {
        name: '用户管理',
        hidden: false,
        parentPath: '/system',
        noauth: true,
        // right: [user_list],
      },
      children: [
        {
          path: '/system/user/:tab?',
          name: RouterNameSystem.user.listWithTab,
          component: () => import('../modules/system/user/index.vue'),
          props: routeParams2Props,
          meta: {
            name: '用户管理',
            hidden: false,
            activePath: '/system/user',
            parentPath: '/system',
            noauth: true,
            // right: [user_list],
          },
        },
      ],
    },
    {
      path: '/system/spendingCategory',
      component: () => import('../modules/system/spendingCategory'),
      meta: {
        name: '会计科目',
        hidden: false,
        parentPath: '/system',
        right: [RIGHT_CODE.ending_category_edit],
      },
      children: [
        {
          path: '/system/spendingCategory/:type?',
          component: () => import('../modules/system/spendingCategory'),
          name: RouterNameSystem.spendingCategory,
          meta: {
            name: '支出类别',
            hidden: false,
            activePath: '/system/spendingCategory',
            parentPath: '/system',
            right: [RIGHT_CODE.ending_category_edit],
          },
        },
      ],
    },
    {
      path: '/system/news',
      name: RouterNameSystem.news,
      component: () => import('../modules/system/news/index.vue'),
      meta: {
        name: '消息管理',
        hidden: false,
        parentPath: '/system',
        right: [system_news_list],
      },
    },
    {
      path: '/system/statistics',
      name: RouterDataCenter.dataStatistics,
      component: () => import('../modules/datacenter/statistics/index.vue'),
      meta: {
        name: '数据统计',
        hidden: false,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/system/statistics',
        parentPath: '/system',
        right: [RIGHT_CODE.datacenter_statistics_view],
      },
    },
  ],
};
