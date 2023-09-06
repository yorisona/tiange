/**
 * 客户管理
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-07 20:16:08
 */
import type { RouteConfig } from 'vue-router';
import RouterViewEmptyPage from '@/layouts/empty.vue';
import { RouterDataCenter, RouterNameCustomer } from '@/const/router';
import { RIGHT_CODE } from '@/const/rightCode';
import { props2RouteParams } from './func';

const { customer_list, company_list, brand_view } = RIGHT_CODE;

// * 客户管理
export const customerRoute: RouteConfig = {
  path: '/customer',
  name: RouterNameCustomer.main,
  component: RouterViewEmptyPage,
  meta: {
    name: '客户管理',
    hidden: false,
    right: [customer_list, company_list, brand_view],
    icon: 'ico-menu-kehuguanli',
    isKeepLive: true,
  },
  children: [
    // * 客户管理 - 公司管理
    {
      path: '/customer/company',
      name: RouterNameCustomer.company,
      component: () =>
        import(
          /* webpackChunkName: "customer.company" */ '../modules/customer/list/company/list.vue'
        ),
      props: props2RouteParams,
      meta: {
        name: '公司管理',
        hidden: false,
        class: 'cls-customer-info',
        isKeepLive: true,
        parentPath: '/customer',
        activePath: '/customer/company',
        right: [company_list],
      },
    },
    // * 客户管理 - 公司管理-新增
    {
      path: '/customer/company/add',
      name: RouterNameCustomer.companyAdd,
      component: () =>
        import(
          /* webpackChunkName: "customer.company.add" */ '../modules/customer/list/company/modify/index.vue'
        ),
      meta: {
        name: '公司管理-新增',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        parentPath: '/customer',
        activePath: '/customer/company',
        right: [company_list],
      },
    },
    // * 客户管理 - 公司管理-编辑
    {
      path: '/customer/company/edit/:id',
      name: RouterNameCustomer.companyEdit,
      component: () =>
        import(
          /* webpackChunkName: "customer.company.edit" */ '../modules/customer/list/company/modify/index.vue'
        ),
      meta: {
        name: '公司管理-编辑',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        parentPath: '/customer',
        activePath: '/customer/company',
        right: [company_list],
      },
    },

    // * 客户管理 - 店铺管理
    {
      path: '/customer/shop',
      name: RouterNameCustomer.shop,
      component: () =>
        import(/* webpackChunkName: "customer.shop" */ '../modules/customer/shop/index.vue'),
      props: props2RouteParams,
      meta: {
        name: '店铺管理',
        hidden: false,
        class: 'cls-customer-info',
        isKeepLive: true,
        parentPath: '/customer',
        activePath: '/customer/shop',
        right: [customer_list],
      },
    },

    // * 客户列表 - 品牌管理
    {
      path: '/customer/brand',
      component: () =>
        import(/* webpackChunkName: "customer.brand" */ '../modules/customer/brand/index.vue'),
      meta: {
        name: '品牌管理',
        parentPath: '/customer',
        right: [brand_view],
      },
    },
    // * 客户列表 - 店铺详情
    {
      path: '/customer/shop/:id',
      name: RouterNameCustomer.shopDetail,
      component: () =>
        import(
          /* webpackChunkName: "customer.sho.id" */ '../views/customer/cooperative/customer_detail/index.vue'
        ),
      props: true,
      meta: {
        name: '店铺详情',
        hidden: true,
        activePath: '/customer/shop',
        class: 'cls-product-info',
        isKeepLive: false,
        parentPath: '/customer',
        right: [customer_list],
      },
    },
    // * 客户列表 - 公司详情
    {
      path: '/customer/company/:id',
      name: RouterNameCustomer.companyDetail,
      component: () =>
        import(
          /* webpackChunkName: "customer.company.id" */ '../modules/customer/list/company/detail.vue'
        ),
      props: true,
      meta: {
        name: '公司详情',
        hidden: true,
        class: 'cls-product-info',
        isKeepLive: false,
        parentPath: '/customer',
        activePath: '/customer/company',
        right: [company_list],
      },
    },
    {
      path: 'shangJiaXiTong',
      name: RouterDataCenter.shopSystem,
      meta: {
        name: '商家系统',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/customer/shopSystem',
        parentPath: '/customer',
        right: [customer_list, company_list, brand_view],
      },
    },
  ],
};
