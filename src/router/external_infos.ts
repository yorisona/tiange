/**
 *@description: 财务管理
 *@author: 棠棣
 *@since: 2021/1/23 10:12
 */

import { RouteConfig } from 'vue-router';
import dailyInformationList from '@/modules/external/dailyInformation/list/index.vue';
import dailyInformationDetail from '@/modules/external/dailyInformation/detail/index.vue';
import { RouterNameExternal } from '@/const/router';

export default [
  {
    path: '/external/dailyInformation',
    name: RouterNameExternal.dailyInformation.default,
    component: dailyInformationList,
    meta: {
      name: '每日资讯',
    },
  },
  {
    path: '/external/dailyInformation/detail',
    name: RouterNameExternal.dailyInformation.detail,
    component: dailyInformationDetail,
    meta: {
      name: '每日资讯',
    },
  },
] as RouteConfig[];
