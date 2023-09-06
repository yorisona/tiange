/**
 * 绩效管理
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-09 11:36:28
 */
import { RouteConfig } from 'vue-router';
import { RouterNameMB } from '@/const/router';
import RouterViewEmptyPage from '@/layouts/empty.vue';
import { RIGHT_CODE } from '@/const/rightCode';

export const companyCulture: RouteConfig[] = [
  {
    path: '/companyCulture',
    component: RouterViewEmptyPage,
    props: {},
    meta: {
      name: '企业文化',
      icon: 'ico-menu-qiyewenhua',
      isKeepLive: true,
      right: [RIGHT_CODE.mb_good_view, RIGHT_CODE.mb_good_exchange_record_view, RIGHT_CODE.mb_view],
    },
    children: [
      {
        path: '/design/mb/manage',
        name: RouterNameMB.manage,
        component: () => import('../modules/design/mb/manage/index.vue'),
        meta: {
          name: 'M币管理',
          hirouteParams2Propsen: false,
          class: 'cls-star-info',
          isKeepLive: true,
          parentPath: '/companyCulture',
          hidden: false,
          right: [RIGHT_CODE.mb_view],
        },
      },
      {
        path: '/design/mb/mall',
        name: RouterNameMB.mall.default,
        component: () => import('../modules/design/mb/mall/index.vue'),
        meta: {
          name: '兑换商城',
          hirouteParams2Propsen: false,
          class: 'cls-star-info',
          isKeepLive: true,
          parentPath: '/companyCulture',
          activePath: '/design/mb/mall',
          hidden: false,
          right: [RIGHT_CODE.mb_good_view, RIGHT_CODE.mb_good_exchange_record_view],
        },
        children: [
          {
            path: '/design/mb/mall/manage',
            name: RouterNameMB.mall.manage,
            component: () => import('../modules/design/mb/mall/manage/index.vue'),
            meta: {
              name: '商品管理',
              hirouteParams2Propsen: false,
              class: 'cls-star-info',
              isKeepLive: false,
              parentPath: '/companyCulture',
              hidden: false,
              activePath: '/design/mb/mall',
            },
          },
          {
            path: '/design/mb/mall/detail',
            name: RouterNameMB.mall.detail,
            component: () => import('../modules/design/mb/mall/detail/index.vue'),
            meta: {
              name: '兑换明细',
              hirouteParams2Propsen: false,
              class: 'cls-star-info',
              parentPath: '/companyCulture',
              activePath: '/design/mb/mall',
            },
          },
          {
            path: '/design/mb/mall/giftDetails',
            name: RouterNameMB.mall.giftDetails,
            component: () => import('../modules/design/mb/mall/giftDetails/index.vue'),
            meta: {
              name: '赠送明细',
              hirouteParams2Propsen: false,
              class: 'cls-star-info',
              parentPath: '/companyCulture',
              activePath: '/design/mb/mall',
            },
          },
        ],
      },
    ],
  },
];
