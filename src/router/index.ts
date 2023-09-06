/**
 * @Description: 路由配置
 * @Author: 白青
 * @Date: 2019-08-06 09:35:27
 * @LastEditTime: 2020-05-14 16:46:52
 * @LastEditors: 神曲
 */
import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/layouts/home/home.vue';
import { customerRoute } from './customer';
import { supplierRoute } from './supplier';
// import { publicRoute } from './public';
import { systemRoute } from './system';
import { projectManageRoute } from './projectManage';
import { legalRoute } from './legal';
import { dataRoute, goodsAnalysis, financialStatements } from './data';
import { financeRoute } from './finance';
// import { advertiseRoute } from './advertise';
import { performance } from './performance';
import externalInfos from './external_infos';
import { design } from './design';
import { fixedAssets } from './fixedAssets';
import { RouterWorkbench } from '@/const/router';
import { strategicInformationRoute } from './strategicInformation';
import { companyCulture } from './companyCulture';
import { setupRouteGuard } from './routeGuard/index';
import { ManagementRoute } from '@/router/management';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    ...externalInfos,
    // * 登录
    {
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "Login" */ '../modules/auth/login.vue'),
      meta: { hidden: true },
    },
    // * 首页
    {
      path: '/',
      name: 'Home',
      redirect: '/workbench',
      component: Home,
      meta: { hidden: true },
      children: [
        {
          path: '/',
          redirect: '/workbench',
          name: 'HomeEmpty',
          meta: { hidden: true },
        },
        // 【侧边栏导航配置 start ↓↓↓↓↓↓】
        {
          path: '/workbench',
          name: 'Workbench',
          component: () =>
            import(/* webpackChunkName: "workbench" */ '../modules/workbench/index.vue'),
          meta: {
            name: '工作台',
            hidden: false,
            icon: 'ico-menu-gongzuotai',
            isKeepLive: false,
            right: [],
          },
        },
        // 我发起的0
        {
          path: '/workbench/mine',
          name: 'mine',
          component: () =>
            import(/* webpackChunkName: "workbench_mine" */ '../modules/workbench/indexMine.vue'),
          meta: {
            name: '我发起的',
            hidden: true,
            icon: 'ico-workbench',
            isKeepLive: false,
            parentPath: '/workbench',
            activePath: '/workbench',
          },
        },
        {
          path: '/workbench/minefiles',
          name: RouterWorkbench.home.mine_files,
          component: () =>
            import(
              /* webpackChunkName: "workbench_MINEFILES" */ '../modules/workbench/download/mineFiles/index.vue'
            ),
          meta: {
            name: '我的文件',
            hidden: true,
            icon: 'ico-workbench',
            isKeepLive: false,
            parentPath: '/workbench',
            activePath: '/workbench',
          },
        },
        {
          path: '/workbench/anchorrecruitment',
          name: RouterWorkbench.home.anchor_recruitment,
          component: () =>
            import(
              /* webpackChunkName: "workbench_anchorrecruitment" */ '../modules/anchorRecruitment/workbench/index.vue'
            ),
          meta: {
            name: '主播招募',
            hidden: true,
            icon: 'ico-workbench',
            isKeepLive: false,
            parentPath: '/workbench',
            activePath: '/workbench',
          },
        },
        // 客户管理
        customerRoute,
        // 供应商管理
        supplierRoute,
        // 营销业务、 通用业务、 店铺代播
        projectManageRoute,
        // 运营管理
        ManagementRoute,
        // 数据中心
        dataRoute,
        goodsAnalysis,
        // 企业中台
        ...design,
        // 财务管理
        financeRoute,
        financialStatements,
        // 法务管理
        legalRoute,
        // 固定资产
        ...fixedAssets,
        // 战略资讯
        strategicInformationRoute,
        // 绩效管理
        ...performance,
        // 企业文化
        ...companyCulture,
        // 系统设置
        systemRoute,
        // ...(isTargetDev ? [operationRoute] : []),
        // {
        //   path: '/external/feishu',
        //   name: 'ExternalFeishu',
        //   component: () => import('../modules/external/feishu.vue'),
        //   meta: {
        //     hidden: true,
        //     name: '飞书跳转登录',
        //   },
        // },
        {
          path: '*',
          name: 'NotFound',
          component: () =>
            import(/* webpackChunkName: "notfound_404" */ '../modules/error/404.vue'),
          meta: {
            hidden: true,
            name: '该页面不存在',
          },
        },
      ],
    },
    // * 泛路由
    {
      path: '*',
      name: 'notfound',
      component: () => import(/* webpackChunkName: "error_404" */ '../modules/error/404.vue'),
      meta: {
        hidden: true,
        name: '该页面不存在',
      },
    },
  ],
});

setupRouteGuard(router);

export default router;
