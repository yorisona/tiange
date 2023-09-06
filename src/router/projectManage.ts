import { Route, RouteConfig } from 'vue-router';
import RouterViewEmptyPage from '@/layouts/empty.vue';
import { RouterNameProjectManage, RouterInvestment } from '@/const/router';
import { routeParams2Props } from './func';

import { RIGHT_CODE } from '@/const/rightCode';

const {
  live_project_view,
  live_display_view,
  live_studio_view,
  live_project_anchor_view,
  marketing_project_view,
  marketing_customer_view,
  marketing_contract_view,
  marketing_achievement_view,
  cost_view,
  rebate_view,
  import_logs_view,
  common_business_project_view,
  common_business_project,
  merchant_unity,
  supply_view_project,
} = RIGHT_CODE;

export const projectManageRoute: RouteConfig = {
  path: '/projectManage',
  name: RouterNameProjectManage.main,
  component: RouterViewEmptyPage,
  props: (route: Route) => {
    if ([RouterNameProjectManage.live.contract.supplier.detail].includes(route.name ?? '')) {
      return { version: 1 };
    }
    if (
      [
        RouterNameProjectManage.marketing.contract.supplier.detail,
        RouterNameProjectManage.marketing.cost,
      ].includes(route.name ?? '')
    ) {
      return { version: 1 };
    }
    if (
      [RouterNameProjectManage.commonBusiness.contract.supplier.detail].includes(route.name ?? '')
    ) {
      return { version: 1 };
    }
    return { version: 2 };
  },
  meta: {
    name: '项目管理',
    hidden: false,
    icon: 'ico-menu-xiangmuguanli',
    right: [
      live_project_view,
      live_display_view,
      live_studio_view,
      live_project_anchor_view,
      marketing_project_view,
      marketing_customer_view,
      marketing_contract_view,
      marketing_achievement_view,
      cost_view,
      rebate_view,
      import_logs_view,
      common_business_project_view,
      common_business_project,
      merchant_unity,
      RIGHT_CODE.local_life_project_view,
      RIGHT_CODE.supply_view_project,
    ],
  },
  children: [
    {
      path: '/projectManage/live/project',
      name: RouterNameProjectManage.live.project.list,
      component: () => import('../modules/live/project/index.vue'),
      meta: {
        name: '电商业务',
        hidden: false,
        parentPath: '/projectManage',
        right: [RIGHT_CODE.live_project_view],
        isKeepLive: true,
      },
    },
    {
      path: '/projectManage/localLife/project',
      name: RouterNameProjectManage.localLife.project.list,
      component: () => import('../modules/localLife/project/index.vue'),
      meta: {
        name: '本地生活',
        hidden: false,
        parentPath: '/projectManage',
        right: [RIGHT_CODE.local_life_project_view],
        isKeepLive: true,
      },
    },
    // * 整合营销的项目管理
    {
      path: '/projectManage/marketing/project',
      name: RouterNameProjectManage.marketing.project.list,
      component: () =>
        import(
          /* webpackChunkName: "marketing.project" */ '../modules/marketing/project/index.vue'
        ),
      meta: {
        name: '整合营销',
        hidden: false,
        class: 'cls-customer-info',
        isKeepLive: true,
        parentPath: '/projectManage/marketing',
        right: [marketing_project_view],
      },
    },
    {
      path: '/projectManage/commonbusiness/project',
      name: RouterNameProjectManage.commonBusiness.project.list,
      component: () => import('../modules/commonBusiness/project/index.vue'),
      meta: {
        name: '创新业务',
        hidden: false,
        parentPath: '/projectManage/commonbusiness',
        right: [common_business_project_view],
        isKeepLive: true,
      },
    },
    /** 供应链 */
    {
      path: '/projectManage/supplyChain/project',
      name: RouterNameProjectManage.supplyChain.list,
      component: () => import('../modules/supplyChain/index.vue'),
      meta: {
        name: '供应链',
        hidden: false,
        parentPath: '/projectManage/supplyChain',
        right: [supply_view_project],
        isKeepLive: true,
      },
    },
    /** 创新项目详情 */
    {
      path: '/projectManage/commonbusiness/project/:id/:tab?/:liveType?',
      name: RouterNameProjectManage.commonBusiness.project.detail,
      component: () => import('../modules/commonBusiness/project/detail.vue'),
      props: routeParams2Props,
      meta: {
        name: '项目详情',
        hidden: true,
        activePath: '/projectManage/commonbusiness/project',
        class: 'cls-customer-info',
        parentPath: '/projectManage/commonbusiness',
        right: [common_business_project_view],
      },
    },
    {
      path: '/projectManage/commonbusiness/project/:id?/:tab?/:liveType?/display/:liveId',
      name: RouterNameProjectManage.commonBusiness.project.detail_display,
      component: () => import('../modules/commonBusiness/project/display/detail.vue'),
      props: routeParams2Props,
      meta: {
        name: '场次详情',
        hidden: true,
        activePath: '/projectManage/commonbusiness/project',
        parentPath: '/projectManage/commonbusiness',
        right: [common_business_project_view],
      },
    },
    // 客户合同详情
    {
      path: '/projectManage/commonbusiness/project/:project_id?/contract/customer/:id/:tab?',
      name: RouterNameProjectManage.commonBusiness.contract.customer.detail,
      component: () => import('../modules/customer/contract/detail/index.vue'),
      props: true,
      meta: {
        name: '合同详情',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        parentPath: '/projectManage/commonbusiness',
        activePath: '/projectManage/commonbusiness/project',
        right: [],
      },
    },
    // 客户合同详情-模板合同
    {
      path: '/projectManage/commonbusiness/project/:project_id?/contract/customerTemplate/:id/:tab?',
      name: RouterNameProjectManage.commonBusiness.contract.customer.detailTemplate,
      component: () => import('../modules/customer/contract/template/detail/index.vue'),
      props: true,
      meta: {
        name: '合同详情',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        parentPath: '/projectManage/commonbusiness',
        activePath: '/projectManage/commonbusiness/project',
        right: [],
      },
    },
    // * 供应商合同详情
    {
      path: '/projectManage/commonbusiness/project/:project_id?/contract/supplier/:id/:tab?',
      name: RouterNameProjectManage.commonBusiness.contract.supplier.detail,
      component: () => import('../views/medium/contractDetail.vue'),
      props: true,
      meta: {
        name: '供应商合同详情',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        parentPath: '/projectManage/commonbusiness',
        activePath: '/projectManage/commonbusiness/project',
        right: [],
      },
    },
    // * 供应商合同详情模板详情
    {
      path: '/projectManage/commonbusiness/project/:project_id?/contract/supplierTemplate/:id/:tab?',
      name: RouterNameProjectManage.commonBusiness.contract.supplier.detailTemplate,
      component: () => import('../modules/customer/contract/template/detail/index.vue'),
      props: true,
      meta: {
        name: '供应商合同详情',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        parentPath: '/projectManage/commonbusiness',
        activePath: '/projectManage/commonbusiness/project',
        right: [],
      },
    },
    {
      path: '/projectManage/commonbusiness/project/:project_id?/contract/anchorTemplate/:id/:tab?',
      name: RouterNameProjectManage.commonBusiness.contract.anchor.detailTemplate,
      component: () => import('../modules/customer/contract/template/detail/anchor.vue'),
      props: true,
      meta: {
        name: '合同详情',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        parentPath: '/projectManage/commonbusiness',
        activePath: '/projectManage/commonbusiness/project',
        right: [],
      },
    },
    /** 整合营销项目详情 */
    {
      path: '/projectManage/marketing/project/:id/:tab?',
      name: RouterNameProjectManage.marketing.project.detail,
      component: () =>
        import(
          /* webpackChunkName: "marketing.project.id" */ '../modules/marketing/project/detail.vue'
        ),
      props: routeParams2Props,
      meta: {
        name: '项目详情',
        isKeepLive: false,
        hidden: true,
        activePath: '/projectManage/marketing/project',
        class: 'cls-customer-info',
        parentPath: '/projectManage/marketing',
        right: [marketing_project_view],
      },
    },
    // * 客户合同详情
    {
      path: '/projectManage/marketing/project/:project_id?/contract/customer/:id/:tab?',
      name: RouterNameProjectManage.marketing.contract.customer.detail,
      component: () =>
        import(
          /* webpackChunkName: "marketing.contract.customer.id" */ '../modules/customer/contract/detail/index.vue'
        ),
      props: true,
      meta: {
        name: '合同详情',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        parentPath: '/projectManage/marketing',
        activePath: '/projectManage/marketing/project',
        right: [],
      },
    },
    {
      path: '/projectManage/marketing/project/:project_id?/contract/customerTemplate/:id/:tab?',
      name: RouterNameProjectManage.marketing.contract.customer.detailTemplate,
      component: () =>
        import(
          /* webpackChunkName: "marketing.contract.customerTemplate" */ '../modules/customer/contract/template/detail/index.vue'
        ),
      props: true,
      meta: {
        name: '合同详情',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        parentPath: '/projectManage/marketing',
        activePath: '/projectManage/marketing/project',
        right: [],
      },
    },
    // * 供应商合同详情
    {
      path: '/projectManage/marketing/project/:project_id?/contract/supplier/:id/:tab?',
      name: RouterNameProjectManage.marketing.contract.supplier.detail,
      component: () =>
        import(
          /* webpackChunkName: "marketing.contract.supplier" */ '../views/medium/contractDetail.vue'
        ),
      props: true,
      meta: {
        name: '供应商合同详情',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        parentPath: '/projectManage/marketing',
        activePath: '/projectManage/marketing/project',
        right: [],
      },
    },
    {
      path: '/projectManage/marketing/project/:project_id?/contract/supplierTemplate/:id/:tab?',
      name: RouterNameProjectManage.marketing.contract.supplier.detailTemplate,
      component: () =>
        import(
          /* webpackChunkName: "marketing.contract.supplierTemplate" */ '../modules/customer/contract/template/detail/index.vue'
        ),
      props: true,
      meta: {
        name: '供应商合同详情',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        parentPath: '/projectManage/marketing',
        activePath: '/projectManage/marketing/project',
        right: [],
      },
    },
    {
      path: '/projectManage/marketing/project/:project_id?/contract/anchorTemplate/:id/:tab?',
      name: RouterNameProjectManage.marketing.contract.anchor.detailTemplate,
      component: () =>
        import(
          /* webpackChunkName: "marketing.contract.anchorTemplate" */ '../modules/customer/contract/template/detail/anchor.vue'
        ),
      props: true,
      meta: {
        name: '合同详情',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        parentPath: '/projectManage/marketing',
        activePath: '/projectManage/marketing/project',
        right: [],
      },
    },
    /** 匹配主播(新增编辑需求/方案后跳转) */
    {
      path: '/projectManage/marketing/match-anchor',
      name: RouterNameProjectManage.marketing.matchAnchor,
      component: () =>
        import(/* webpackChunkName: "marketing.match_anchor" */ '../views/brand/matchAnchor.vue'),
      meta: {
        name: '匹配主播',
        hidden: true,
        class: 'cls-brand',
        isKeepLive: false,
        parentPath: '/projectManage/marketing',
        right: [],
      },
    },
    /** 匹配主播 - 生成方案 */
    {
      path: '/projectManage/marketing/generateplan',
      name: RouterNameProjectManage.marketing.generateplan,
      component: () =>
        import(/* webpackChunkName: "marketing.generateplan" */ '../views/brand/generatePlan.vue'),
      meta: {
        hidden: true,
        class: 'cls-brand',
        isKeepLive: false,
        parentPath: '/projectManage/marketing',
        right: [],
      },
    },
    /** 电商业务 */
    {
      path: '/projectManage/live/project/:id?/:tab?/:liveType?',
      name: RouterNameProjectManage.live.project.detail,
      component: () => import('../modules/live/project/detail.vue'),
      props: routeParams2Props,
      meta: {
        name: '项目详情',
        hidden: true,
        activePath: '/projectManage/live/project',
        parentPath: '/projectManage',
        right: [live_project_view],
      },
    },
    /** 抖音店播-项目详情 **/
    // /projectManage/localLife/project/282/data
    {
      path: '/projectManage/tiktokLive/project/detail/:id',
      name: RouterNameProjectManage.tiktokLive.project.detail.template,
      component: () => import('../modules/live/project/douyinDetail/index.vue'),
      props: routeParams2Props,
      meta: {
        name: '项目详情',
        hidden: true,
        activePath: '/projectManage/live/project',
        parentPath: '/projectManage',
        right: [live_project_view],
      },
      redirect: '/projectManage/tiktokLive/project/:id',
      children: [
        {
          path: '/projectManage/tiktokLive/project/:id',
          name: RouterNameProjectManage.tiktokLive.project.detail.info,
          component: () => import('../modules/live/project/tabs/douyinProject/index.vue'),
          props: routeParams2Props,
          meta: {
            name: '项目详情',
            hidden: true,
            activePath: '/projectManage/live/project',
            parentPath: '/projectManage',
            right: [live_project_view],
          },
        },
        {
          path: '/projectManage/tiktokLive/project/:id/display',
          name: RouterNameProjectManage.tiktokLive.project.detail.display,
          component: () => import('../modules/live/project/tabs/live/index.vue'),
          props: routeParams2Props,
          meta: {
            name: '直播场次',
            hidden: true,
            activePath: '/projectManage/live/project',
            parentPath: '/projectManage',
            right: [live_project_view],
          },
        },
        {
          path: '/projectManage/tiktokLive/project/:id/income',
          name: RouterNameProjectManage.tiktokLive.project.detail.income,
          component: () => import('../modules/live/project/tabs/income/index.vue'),
          props: routeParams2Props,
          meta: {
            name: '收入',
            hidden: true,
            activePath: '/projectManage/live/project',
            parentPath: '/projectManage',
            right: [live_project_view],
          },
        },
        {
          path: '/projectManage/tiktokLive/project/:id/cost',
          name: RouterNameProjectManage.tiktokLive.project.detail.cost,
          component: () => import('../modules/live/project/tabs/cost/index.vue'),
          props: routeParams2Props,
          meta: {
            name: '成本',
            hidden: true,
            activePath: '/projectManage/live/project',
            parentPath: '/projectManage',
            right: [live_project_view],
          },
        },
        {
          path: '/projectManage/tiktokLive/project/:id/contract',
          name: RouterNameProjectManage.tiktokLive.project.detail.contract,
          component: () => import('@/modules/customer/contract/list/index.vue'),
          props: routeParams2Props,
          meta: {
            name: '合同',
            hidden: true,
            activePath: '/projectManage/live/project',
            parentPath: '/projectManage',
            right: [live_project_view],
          },
        },
        // {
        //   path: '/projectManage/tiktokLive/project/:id/data',
        //   name: RouterNameProjectManage.tiktokLive.project.detail.data,
        //   component: () => import('@/modules/datacenter/shoplive/tabs/projectDetail/index.vue'),
        //   props: routeParams2Props,
        //   meta: {
        //     name: '数据',
        //     hidden: true,
        //     activePath: '/projectManage/live/project',
        //     parentPath: '/projectManage',
        //     right: [live_project_view],
        //   },
        // },
        {
          path: '/projectManage/tiktokLive/project/:id/data',
          name: RouterNameProjectManage.tiktokLive.project.detail.data,
          component: () => import('../modules/live/project/tabs/operationalData/index.vue'),
          props: routeParams2Props,
          meta: {
            name: '数据',
            hidden: true,
            activePath: '/projectManage/live/project',
            parentPath: '/projectManage',
            right: [live_project_view],
          },
        },
        {
          path: '/projectManage/tiktokLive/project/:id/data/sessionReviewDetail',
          name: RouterNameProjectManage.tiktokLive.project.revisionDetail.sessionReviewDetail,
          component: () =>
            import(
              '../modules/live/project/tabs/operationalData/tabs/modules/sessionReviewDetail.vue'
            ),
          props: routeParams2Props,
          meta: {
            name: '场次详情',
            hidden: true,
            activePath: '/projectManage/live/project',
            parentPath: '/projectManage',
            right: [live_project_view],
            tab: 'sessionReview',
          },
        },
        {
          path: '/projectManage/tiktokLive/project/:id/target',
          name: RouterNameProjectManage.tiktokLive.project.detail.target,
          component: () => import('../modules/live/project/tabs/target/index.vue'),
          props: routeParams2Props,
          meta: {
            name: '目标',
            hidden: true,
            activePath: '/projectManage/live/project',
            parentPath: '/projectManage',
            right: [live_project_view],
          },
        },
        {
          path: '/projectManage/tiktokLive/project/:id/liveTool',
          name: RouterNameProjectManage.tiktokLive.project.detail.liveTool,
          component: () => import('../modules/live/project/tabs/liveTool/index.vue'),
          props: routeParams2Props,
          meta: {
            name: '直播工具',
            hidden: true,
            activePath: '/projectManage/live/project',
            parentPath: '/projectManage',
            right: [live_project_view],
          },
        },
        {
          path: '/projectManage/tiktokLive/project/:id/setting',
          name: RouterNameProjectManage.tiktokLive.project.detail.setting,
          component: () => import('../modules/live/project/tabs/setting/index.vue'),
          props: routeParams2Props,
          meta: {
            name: '设置',
            hidden: true,
            activePath: '/projectManage/live/project',
            parentPath: '/projectManage',
            right: [live_project_view],
          },
        },
        {
          path: '/projectManage/tiktokLive/project/:id/display/:liveId',
          name: RouterNameProjectManage.tiktokLive.project.detail.displayDetail,
          component: () => import('../modules/live/display/detail.vue'),
          props: routeParams2Props,
          meta: {
            name: '场次详情',
            hidden: true,
            activePath: '/projectManage/live/project',
            parentPath: '/projectManage',
            right: [],
          },
        },
        // 客户合同详情
        {
          path: '/projectManage/tiktokLive/project/:project_id/contract/customer/:id/:tab?',
          name: RouterNameProjectManage.tiktokLive.contract.customer.detail,
          component: () => import('../modules/customer/contract/detail/index.vue'),
          props: true,
          meta: {
            name: '合同详情',
            hidden: true,
            class: 'cls-customer-info',
            isKeepLive: false,
            activePath: '/projectManage/live/project',
            parentPath: '/projectManage',
            right: [],
          },
        },
        // 客户合同详情-模板合同
        {
          path: '/projectManage/tiktokLive/project/:project_id/contract/customerTemplate/:id/:tab?',
          name: RouterNameProjectManage.tiktokLive.contract.customer.detailTemplate,
          component: () => import('../modules/customer/contract/template/detail/index.vue'),
          props: true,
          meta: {
            name: '合同详情',
            hidden: true,
            class: 'cls-customer-info',
            isKeepLive: false,
            activePath: '/projectManage/live/project',
            parentPath: '/projectManage',
            right: [],
          },
        },
        // * 供应商合同详情
        {
          path: '/projectManage/tiktokLive/project/:project_id/contract/supplier/:id/:tab?',
          name: RouterNameProjectManage.tiktokLive.contract.supplier.detail,
          component: () => import('../views/medium/contractDetail.vue'),
          props: true,
          meta: {
            name: '供应商合同详情',
            hidden: true,
            class: 'cls-star-info',
            isKeepLive: false,
            activePath: '/projectManage/live/project',
            parentPath: '/projectManage',
            right: [],
          },
        },
        // * 供应商合同详情模板详情
        {
          path: '/projectManage/tiktokLive/project/:project_id/contract/supplierTemplate/:id/:tab?',
          name: RouterNameProjectManage.tiktokLive.contract.supplier.detailTemplate,
          component: () => import('../modules/customer/contract/template/detail/index.vue'),
          props: true,
          meta: {
            name: '供应商合同详情',
            hidden: true,
            class: 'cls-star-info',
            isKeepLive: false,
            activePath: '/projectManage/live/project',
            parentPath: '/projectManage',
            right: [],
          },
        },
        {
          path: '/projectManage/tiktokLive/project/:project_id/contract/anchorTemplate/:id/:tab?',
          name: RouterNameProjectManage.tiktokLive.contract.anchor.detailTemplate,
          component: () => import('../modules/customer/contract/template/detail/anchor.vue'),
          props: true,
          meta: {
            name: '合同详情',
            hidden: true,
            class: 'cls-customer-info',
            isKeepLive: false,
            activePath: '/projectManage/live/project',
            parentPath: '/projectManage',
            right: [],
          },
        },
      ],
    },

    {
      path: '/projectManage/live/display',
      name: RouterNameProjectManage.live.display.list,
      component: () => import('../modules/live/display/index.vue'),
      meta: {
        name: '直播场次',
        hidden: true,
        parentPath: '/projectManage',
        right: [live_display_view],
        isKeepLive: true,
      },
    },
    {
      path: '/projectManage/live/project/:id?/:tab?/:liveType?/display/:liveId',
      name: RouterNameProjectManage.live.display.detail,
      component: () => import('../modules/live/display/detail.vue'),
      props: routeParams2Props,
      meta: {
        name: '场次详情',
        hidden: true,
        activePath: '/projectManage/live/project',
        parentPath: '/projectManage',
        right: [live_display_view],
      },
    },
    /** 这里拷贝营销业务中的合同 共享组件/不同路由 **/
    {
      path: '/projectManage/live/project/:project_id?/contract/supplier/:id/:tab?',
      name: RouterNameProjectManage.live.contract.supplier.detail,
      component: () => import('../views/medium/contractDetail.vue'),
      props: true,
      meta: {
        name: '供应商合同详情',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/projectManage/live/project',
        parentPath: '/projectManage',
        right: [],
      },
    },
    {
      path: '/projectManage/live/project/:project_id?/contract/supplierTemplate/:id/:tab?',
      name: RouterNameProjectManage.live.contract.supplier.detailTemplate,
      component: () => import('../modules/customer/contract/template/detail/index.vue'),
      props: true,
      meta: {
        name: '供应商合同详情',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/projectManage/live/project',
        parentPath: '/projectManage',
        right: [],
      },
    },
    {
      path: '/projectManage/live/project/:project_id?/contract/customer/:id/:tab?',
      name: RouterNameProjectManage.live.contract.customer.detail,
      component: () => import('../modules/customer/contract/detail/index.vue'),
      props: true,
      meta: {
        name: '合同详情',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        activePath: '/projectManage/live/project',
        parentPath: '/projectManage',
        right: [],
      },
    },
    {
      path: '/projectManage/live/project/:project_id?/contract/customerTemplate/:id/:tab?',
      name: RouterNameProjectManage.live.contract.customer.detailTemplate,
      component: () => import('../modules/customer/contract/template/detail/index.vue'),
      props: true,
      meta: {
        name: '合同详情',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        activePath: '/projectManage/live/project',
        parentPath: '/projectManage',
        right: [],
      },
    },
    {
      path: '/projectManage/live/project/:project_id?/contract/anchorTemplate/:id/:tab?',
      name: RouterNameProjectManage.live.contract.anchor.detailTemplate,
      component: () => import('../modules/customer/contract/template/detail/anchor.vue'),
      props: true,
      meta: {
        name: '合同详情',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        activePath: '/projectManage/live/project',
        parentPath: '/projectManage',
        right: [],
      },
    },
    {
      path: '/projectManage/live/studio',
      component: () => import('../modules/public/studio/index.vue'),
      meta: {
        name: '直播间管理',
        parentPath: '/projectManage',
        right: [live_studio_view],
      },
    },
    {
      path: '/projectManage/live/anchorScheduling',
      component: () => import('../modules/live/anchorScheduling/index.vue'),
      meta: {
        name: '主播排班',
        parentPath: '/projectManage',
        right: [live_project_anchor_view],
      },
    },
    {
      path: '/projectManage/commonbusiness/unite',
      name: RouterInvestment.unite,
      component: () => import('../modules/investment/unite/index.vue'),
      meta: {
        name: '统一结算',
        parentPath: '/projectManage/investment',
        hidden: false,
        right: [merchant_unity],
      },
      children: [
        {
          path: '/projectManage/commonbusiness/unite/:tab?',
          name: RouterInvestment.withdrawal,
          component: () => import('../modules/investment/unite/index.vue'),
          props: routeParams2Props,
          meta: {
            name: '统一结算',
            hidden: false,
            right: [merchant_unity],
            parentPath: '/projectManage/commonbusiness',
            activePath: '/projectManage/commonbusiness/unite',
          },
        },
      ],
    },
    /** 本地生活 */
    {
      path: '/projectManage/localLife/project/detail/:id',
      name: RouterNameProjectManage.localLife.project.detail,
      component: () => import('../modules/localLife/project/detail.vue'),
      props: routeParams2Props,
      meta: {
        name: '项目详情',
        hidden: true,
        activePath: '/projectManage/localLife/project',
        parentPath: '/projectManage/localLife',
        right: [RIGHT_CODE.local_life_project_view],
        isKeepLive: true,
      },
      children: [
        {
          path: '/projectManage/localLife/project/:id',
          name: RouterNameProjectManage.localLife.detail.info,
          component: () => import('../modules/localLife/project/tabs/projectInfo.vue'),
          meta: {
            name: '项目详情',
            hidden: true,
            activePath: '/projectManage/localLife/project',
            parentPath: '/projectManage/localLife',
            right: [RIGHT_CODE.local_life_project_view],
            isKeepLive: false,
          },
        },
        {
          path: '/projectManage/localLife/project/:id/live',
          name: RouterNameProjectManage.localLife.detail.display,
          component: () => import('../modules/live/project/tabs/live/index.vue'),
          meta: {
            name: '直播场次',
            hidden: true,
            activePath: '/projectManage/localLife/project',
            parentPath: '/projectManage/localLife',
            right: [RIGHT_CODE.local_life_display_view],
            isKeepLive: false,
          },
        },
        {
          path: '/projectManage/localLife/project/:id/income',
          name: RouterNameProjectManage.localLife.detail.income,
          component: () => import('../modules/live/project/tabs/income/index.vue'),
          meta: {
            name: '项目收入',
            hidden: true,
            activePath: '/projectManage/localLife/project',
            parentPath: '/projectManage/localLife',
            right: [
              RIGHT_CODE.local_life_project_settlement_view ||
                RIGHT_CODE.local_life_project_gathering_view,
            ],
            isKeepLive: false,
          },
        },
        {
          path: '/projectManage/localLife/project/:id/cost',
          name: RouterNameProjectManage.localLife.detail.cost,
          component: () => import('../modules/live/project/tabs/cost/index.vue'),
          meta: {
            name: '项目成本',
            hidden: true,
            activePath: '/projectManage/localLife/project',
            parentPath: '/projectManage/localLife',
            right: [
              RIGHT_CODE.local_life_project_settlement_view ||
                RIGHT_CODE.local_life_project_pay_view,
            ],
            isKeepLive: false,
          },
        },
        {
          path: '/projectManage/localLife/project/:id/data',
          name: RouterNameProjectManage.localLife.detail.data,
          component: () => import('../modules/datacenter/shoplive/tabs/projectDetail/index.vue'),
          meta: {
            name: '运营数据',
            hidden: true,
            activePath: '/projectManage/localLife/project',
            parentPath: '/projectManage/localLife',
            right: [RIGHT_CODE.local_life_view_or_save_shop_daily_report],
            isKeepLive: false,
          },
        },
        {
          path: '/projectManage/localLife/project/:id/target',
          name: RouterNameProjectManage.localLife.detail.target,
          component: () => import('../modules/live/project/tabs/target/index.vue'),
          meta: {
            name: '目标设置',
            hidden: true,
            activePath: '/projectManage/localLife/project',
            parentPath: '/projectManage/localLife',
            right: [RIGHT_CODE.local_life_project_target_view],
            isKeepLive: false,
          },
        },
        {
          path: '/projectManage/localLife/project/:id/contract',
          name: RouterNameProjectManage.localLife.detail.contract,
          component: () => import('../modules/customer/contract/list/index.vue'),
          meta: {
            name: '合同协议',
            hidden: true,
            activePath: '/projectManage/localLife/project',
            parentPath: '/projectManage/localLife',
            right: [RIGHT_CODE.local_life_project_contract_view],
            isKeepLive: false,
          },
        },
        {
          path: '/projectManage/localLife/project/:id/setting',
          name: RouterNameProjectManage.localLife.detail.setting,
          component: () => import('../modules/live/project/tabs/setting/index.vue'),
          meta: {
            name: '项目设置',
            hidden: true,
            activePath: '/projectManage/localLife/project',
            parentPath: '/projectManage/localLife',
            // right: [live_display_view],
            isKeepLive: false,
          },
        },
        {
          path: '/projectManage/localLife/display',
          name: RouterNameProjectManage.localLife.display.list,
          component: () => import('../modules/live/display/index.vue'),
          meta: {
            name: '直播场次',
            hidden: true,
            activePath: '/projectManage/localLife/project',
            parentPath: '/projectManage/localLife',
            right: [RIGHT_CODE.local_life_display_view],
            isKeepLive: false,
          },
        },
        {
          path: '/projectManage/localLife/project/:id?/live/:liveType?/display/:liveId',
          name: RouterNameProjectManage.localLife.display.detail,
          component: () => import('../modules/live/display/detail.vue'),
          props: routeParams2Props,
          meta: {
            name: '场次详情',
            hidden: true,
            activePath: '/projectManage/localLife/project',
            parentPath: '/projectManage/localLife',
            right: [RIGHT_CODE.local_life_display_view],
          },
        },
        /** 这里拷贝营销业务中的合同 共享组件/不同路由 **/
        {
          path: '/projectManage/localLife/project/:project_id?/contract/supplier/:id/:tab?',
          name: RouterNameProjectManage.localLife.contract.supplier.detail,
          component: () => import('../views/medium/contractDetail.vue'),
          props: true,
          meta: {
            name: '供应商合同详情',
            hidden: true,
            class: 'cls-star-info',
            isKeepLive: false,
            activePath: '/projectManage/localLife/project',
            parentPath: '/projectManage',
            right: [],
          },
        },
        {
          path: '/projectManage/localLife/project/:project_id?/contract/supplierTemplate/:id/:tab?',
          name: RouterNameProjectManage.localLife.contract.supplier.detailTemplate,
          component: () => import('../modules/customer/contract/template/detail/index.vue'),
          props: true,
          meta: {
            name: '供应商合同详情',
            hidden: true,
            class: 'cls-star-info',
            isKeepLive: false,
            activePath: '/projectManage/localLife/project',
            parentPath: '/projectManage',
            right: [],
          },
        },
        {
          path: '/projectManage/localLife/project/:project_id?/contract/customer/:id/:tab?',
          name: RouterNameProjectManage.localLife.contract.customer.detail,
          component: () => import('../modules/customer/contract/detail/index.vue'),
          props: true,
          meta: {
            name: '合同详情',
            hidden: true,
            class: 'cls-customer-info',
            isKeepLive: false,
            activePath: '/projectManage/localLife/project',
            parentPath: '/projectManage',
            right: [],
          },
        },
        {
          path: '/projectManage/localLife/project/:project_id?/contract/customerTemplate/:id/:tab?',
          name: RouterNameProjectManage.localLife.contract.customer.detailTemplate,
          component: () => import('../modules/customer/contract/template/detail/index.vue'),
          props: true,
          meta: {
            name: '合同详情',
            hidden: true,
            class: 'cls-customer-info',
            isKeepLive: false,
            activePath: '/projectManage/localLife/project',
            parentPath: '/projectManage',
            right: [],
          },
        },
        {
          path: '/projectManage/localLife/project/:project_id?/contract/anchorTemplate/:id/:tab?',
          name: RouterNameProjectManage.localLife.contract.anchor.detailTemplate,
          component: () => import('../modules/customer/contract/template/detail/anchor.vue'),
          props: true,
          meta: {
            name: '合同详情',
            hidden: true,
            class: 'cls-customer-info',
            isKeepLive: false,
            activePath: '/projectManage/localLife/project',
            parentPath: '/projectManage',
            right: [],
          },
        },
      ],
    },
    /** 供应链详情 */
    {
      path: '/projectManage/supplyChain/project/:id?/:tab?/:liveType?',
      name: RouterNameProjectManage.supplyChain.detail,
      component: () => import('../modules/live/project/detail.vue'),
      props: routeParams2Props,
      meta: {
        name: '项目详情',
        hidden: true,
        activePath: '/projectManage/supplyChain/project',
        parentPath: '/projectManage/supplyChain',
        right: [supply_view_project],
      },
    },
    {
      path: '/projectManage/supplyChain/project/:id?/live/SupplyChainDetail/display/:liveId',
      name: RouterNameProjectManage.supplyChain.details.display,
      component: () => import('../modules/live/display/detail.vue'),
      props: routeParams2Props,
      meta: {
        name: '场次详情',
        hidden: true,
        activePath: '/projectManage/supplyChain/project',
        parentPath: '/projectManage/supplyChain',
        right: [RIGHT_CODE.supply_view_shop_live],
      },
    },
    {
      path: '/projectManage/supplyChain/project/:project_id?/contract/supplier/:id/:tab?',
      name: RouterNameProjectManage.supplyChain.contract.supplier.detail,
      component: () => import('../views/medium/contractDetail.vue'),
      props: true,
      meta: {
        name: '供应商合同详情',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/projectManage/supplyChain/project',
        parentPath: '/projectManage/supplyChain',
        right: [],
      },
    },
    {
      path: '/projectManage/supplyChain/project/:project_id?/contract/supplierTemplate/:id/:tab?',
      name: RouterNameProjectManage.supplyChain.contract.supplier.detailTemplate,
      component: () =>
        import(
          /* webpackChunkName: "supplyChain.contract.supplierTemplate" */ '../modules/customer/contract/template/detail/index.vue'
        ),
      props: true,
      meta: {
        name: '供应商合同详情',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/projectManage/supplyChain/project',
        parentPath: '/projectManage/supplyChain',
        right: [],
      },
    },
    {
      path: '/projectManage/supplyChain/project/:project_id?/contract/customer/:id/:tab?',
      name: RouterNameProjectManage.supplyChain.contract.customer.detail,
      component: () => import('../modules/customer/contract/detail/index.vue'),
      props: true,
      meta: {
        name: '合同详情',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        activePath: '/projectManage/supplyChain/project',
        parentPath: '/projectManage/supplyChain',
        right: [],
      },
    },
    {
      path: '/projectManage/supplyChain/project/:project_id?/contract/customerTemplate/:id/:tab?',
      name: RouterNameProjectManage.supplyChain.contract.customer.detailTemplate,
      component: () => import('../modules/customer/contract/template/detail/index.vue'),
      props: true,
      meta: {
        name: '合同详情',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        activePath: '/projectManage/supplyChain/project',
        parentPath: '/projectManage/supplyChain',
        right: [],
      },
    },
    {
      path: '/projectManage/supplyChain/project/:project_id?/contract/anchorTemplate/:id/:tab?',
      name: RouterNameProjectManage.supplyChain.contract.anchor.detailTemplate,
      component: () => import('../modules/customer/contract/template/detail/anchor.vue'),
      props: true,
      meta: {
        name: '合同详情',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        activePath: '/projectManage/supplyChain/project',
        parentPath: '/projectManage/supplyChain',
        right: [],
      },
    },
    {
      path: '/projectManage/supplyChain/project/:project_id?/contract/anchorTemplate/:id/:tab?',
      name: RouterNameProjectManage.supplyChain.contract.anchor.detailTemplate,
      component: () => import('../modules/customer/contract/template/detail/anchor.vue'),
      props: true,
      meta: {
        name: '合同详情',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        activePath: '/projectManage/localLife/project',
        parentPath: '/projectManage',
        right: [],
      },
    },
  ],
};
