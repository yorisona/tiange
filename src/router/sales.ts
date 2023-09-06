/**
 * 下线了
 *@description: 销售管理
 *@author: 棠棣
 *@since: 2021/1/20 14:06
 */

import { RouteConfig } from 'vue-router';
import RouterViewEmptyPage from '@/layouts/empty.vue';
import { RouterNameSales } from '@/const/router';
import { RIGHT_CODE } from '@/const/rightCode';
const { sales_view, customer_follow_up } = RIGHT_CODE;

export const salesRoute: RouteConfig = {
  path: '/sales',
  name: RouterNameSales.main,
  component: RouterViewEmptyPage,
  meta: {
    name: '销售管理',
    hidden: false,
    right: [sales_view, customer_follow_up],
    icon: 'ico-xiaoshouguanli',
    isKeepLive: true,
  },
  children: [
    {
      path: '/sales/follow',
      name: RouterNameSales.follow,
      component: () => import('../modules/sales/follow/index.vue'),
      meta: {
        name: '客户跟进',
        right: [customer_follow_up],
        parentPath: '/sales',
        hidden: false,
        isKeepLive: true,
      },
    },
    {
      path: '/sales/follow/:id',
      name: RouterNameSales.detail,
      component: () => import('../modules/sales/follow/detail.vue'),
      meta: {
        name: '任务详情',
        right: [],
        parentPath: '/sales',
        activePath: '/sales/follow',
        hidden: false,
      },
    },
  ],
};
