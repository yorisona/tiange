/**
 *@description: 财务管理
 *@author: 棠棣
 *@since: 2021/1/23 10:12
 */

import { RouteConfig } from 'vue-router';
import RouterViewEmptyPage from '@/layouts/empty.vue';
import { RouterNameStrategicInformation } from '@/const/router';
import { RIGHT_CODE } from '@/const/rightCode';

export const strategicInformationRoute: RouteConfig = {
  path: '/strategicInformation',
  name: RouterNameStrategicInformation.container,
  component: RouterViewEmptyPage,
  meta: {
    name: '行业资讯',
    hidden: false,
    right: [RIGHT_CODE.strategicInformation_view, RIGHT_CODE.dailyInformation_view],
    icon: 'ico-menu-hangyezixun',
    isKeepLive: false,
  },
  children: [
    {
      path: '/strategicInformation/competitionData',
      name: RouterNameStrategicInformation.competitionData,
      component: () =>
        import(
          /* webpackChunkName: "strategicInformation.competitionData" */ '../modules/strategicInformation/competitionData/index.vue'
        ),
      meta: {
        name: '竞对数据',
        right: [RIGHT_CODE.strategicInformation_view],
        hidden: false,
        parentPath: '/strategicInformation',
        activePath: '/strategicInformation/competitionData',
      },
    },
    {
      path: '/strategicInformation/competitionData/competitionSettings',
      name: RouterNameStrategicInformation.competitionSettings,
      component: () =>
        import(
          /* webpackChunkName: "strategicInformation.competitionSettings" */ '../modules/strategicInformation/competitionSettings/index.vue'
        ),
      meta: {
        name: '竞对设置',
        right: [RIGHT_CODE.strategicInformation_setting],
        hidden: true,
        parentPath: '/strategicInformation',
        activePath: '/strategicInformation/competitionData',
      },
    },
    {
      path: '/strategicInformation/news/push',
      name: RouterNameStrategicInformation.dailyInformation,
      component: () =>
        import(/* webpackChunkName: "design.news.push" */ '../modules/design/news/push/index.vue'),
      meta: {
        name: '每日资讯',
        right: [RIGHT_CODE.dailyInformation_view],
        hidden: false,
        parentPath: '/strategicInformation',
        activePath: '/strategicInformation/news/push',
      },
    },
  ],
};
