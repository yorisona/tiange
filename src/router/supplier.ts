/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-02-01 11:53:37
 */
/**
 * 供应商管理
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-09 11:36:28
 */
import { RouteConfig } from 'vue-router';
import { RouterNameDesign, RouterNameSupplier } from '@/const/router';
import RouterViewEmptyPage from '@/layouts/empty.vue';
import { routeParams2Props } from './func';
import { RIGHT_CODE } from '@/const/rightCode';

const { supplier_list, kol_list, kol_approval, supplier_company_list } = RIGHT_CODE;

export const supplierRoute: RouteConfig = {
  path: '/supplier',
  name: RouterNameSupplier.main,
  component: RouterViewEmptyPage,
  props: {
    version: 1,
  },
  meta: {
    name: '供应商管理',
    icon: 'ico-menu-gongyingshang',
    isKeepLive: true,
    right: [
      RIGHT_CODE.supplier_list,
      RIGHT_CODE.kol_list,
      RIGHT_CODE.supplier_company_list,
      RIGHT_CODE.supplier_anchor_view_experience,
      RIGHT_CODE.supplier_anchor_list,
      RIGHT_CODE.anchor_recruit,
      RIGHT_CODE.supplier_model_show,
    ],
  },
  children: [
    {
      path: '/supplier/playermanager',
      name: RouterNameSupplier.player,
      component: () =>
        import(
          /* webpackChunkName: "supplier.playermanager" */ '../modules/supplier/playerManager/list/index.vue'
        ),
      meta: {
        name: '主播管理',
        hirouteParams2Propsen: false,
        class: 'cls-star-info',
        isKeepLive: true,
        parentPath: '/supplier',
        right: [RIGHT_CODE.supplier_anchor_list, RIGHT_CODE.supplier_anchor_view_experience],
      },
    },
    {
      path: '/supplier/playermanager/detail/:id/:tab?',
      name: RouterNameSupplier.player_detail,
      component: () =>
        import(
          /* webpackChunkName: "supplier.playermanager.detail" */ '../modules/supplier/playerManager/detail/index.vue'
        ),
      meta: {
        name: '主播管理-详情',
        hidden: true,
        hirouteParams2Propsen: false,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/supplier/playermanager',
        parentPath: '/supplier',
        right: [],
      },
    },
    {
      path: '/supplier/playermanager/check/:id/:tab?',
      name: RouterNameSupplier.player_check,
      component: () =>
        import(
          /* webpackChunkName: "supplier.playermanager.check" */ '../modules/supplier/playerManager/check/index.vue'
        ),
      meta: {
        name: '主播管理-审核',
        hirouteParams2Propsen: false,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/supplier/playermanager',
        parentPath: '/supplier',
        right: [],
        hidden: true,
      },
    },
    {
      path: '/supplier/playermanager/add/:tab?',
      name: RouterNameSupplier.player_add,
      component: () =>
        import(
          /* webpackChunkName: "supplier.playermanager.add" */ '../modules/supplier/playerManager/modify/index.vue'
        ),
      meta: {
        name: '主播管理-新增',
        hirouteParams2Propsen: false,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/supplier/playermanager',
        parentPath: '/supplier',
        right: [],
        hidden: true,
      },
    },
    {
      path: '/supplier/playermanager/edit/:id/:verify_status/:tab?/:verify?',
      name: RouterNameSupplier.player_modify,
      component: () =>
        import(
          /* webpackChunkName: "supplier.playermanager.edit" */ '../modules/supplier/playerManager/modify/index.vue'
        ),
      meta: {
        name: '主播管理-编辑',
        hirouteParams2Propsen: false,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/supplier/playermanager',
        parentPath: '/supplier',
        right: [],
        hidden: true,
      },
    },
    {
      path: '/supplier/list',
      name: RouterNameSupplier.list,
      component: () =>
        import(/* webpackChunkName: "supplier.list" */ '../modules/supplier/kolManage/index.vue'),
      meta: {
        name: '达人管理',
        hirouteParams2Propsen: false,
        class: 'cls-star-info',
        isKeepLive: true,
        parentPath: '/supplier',
        right: [supplier_list, kol_list],
      },
    },
    {
      path: '/supplier/list/:id',
      name: RouterNameSupplier.listDetail,
      component: () =>
        import(
          /* webpackChunkName: "supplier.list.id" */ '../modules/supplier/kolManage/detail/index.vue'
        ),
      props: routeParams2Props,
      meta: {
        name: '达人详情',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        parentPath: '/supplier',
        activePath: '/supplier/list',
        right: [supplier_list, kol_list],
      },
    },
    {
      path: '/supplier/generate/generate',
      name: RouterNameSupplier.generate,
      component: () =>
        import(
          /* webpackChunkName: "supplier.generate.generate" */ '../modules/supplier/kolManage/newGenerateKol/index.vue'
        ),
      meta: {
        name: '新增达人',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        parentPath: '/supplier',
        activePath: '/supplier/list',
        right: [supplier_list, kol_list],
      },
    },
    {
      path: '/supplier/generate/generate/:id',
      name: RouterNameSupplier.generateEdit,
      component: () =>
        import(
          /* webpackChunkName: "supplier.generate.generate.id" */ '../modules/supplier/kolManage/newGenerateKol/index.vue'
        ),
      meta: {
        name: '编辑达人',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/supplier/list',
        parentPath: '/supplier',
        right: [supplier_list, kol_list],
      },
    },
    {
      path: '/supplier/company',
      name: RouterNameSupplier.manage,
      component: () =>
        import(/* webpackChunkName: "supplier.company" */ '../views/medium/index.vue'),
      meta: {
        name: '公司管理',
        hirouteParams2Propsen: false,
        class: 'cls-star-info',
        isKeepLive: true,
        parentPath: '/supplier',
        right: [supplier_company_list],
      },
    },
    {
      path: '/supplier/trial/model',
      name: RouterNameSupplier.player_trialModel,
      component: () => import('../modules/supplier/modelManage/index.vue'),
      meta: {
        name: '模特管理',
        hidden: false,
        hirouteParams2Propsen: false,
        class: 'cls-star-info',
        isKeepLive: false,
        parentPath: '/supplier',
        right: [RIGHT_CODE.supplier_model_show, RIGHT_CODE.supplier_model_show_all],
      },
    },
    {
      path: '/supplier/company/add',
      name: RouterNameSupplier.companyAdd,
      component: () =>
        import(
          /* webpackChunkName: "supplier.company.add" */ '../modules/supplier/company/modify/index.vue'
        ),
      props: routeParams2Props,
      meta: {
        name: '公司管理-新增',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        parentPath: '/supplier',
        activePath: '/supplier/company',
        right: [supplier_list, supplier_company_list],
      },
    },
    {
      path: '/supplier/company/edit/:id',
      name: RouterNameSupplier.companyEdit,
      component: () =>
        import(
          /* webpackChunkName: "supplier.company.edit" */ '../modules/supplier/company/modify/index.vue'
        ),
      props: routeParams2Props,
      meta: {
        name: '公司管理-编辑',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        parentPath: '/supplier',
        activePath: '/supplier/company',
        right: [supplier_list, supplier_company_list],
      },
    },
    {
      path: '/supplier/company/:id',
      name: RouterNameSupplier.company,
      component: () =>
        import(/* webpackChunkName: "supplier.company.id" */ '../views/medium/detail.vue'),
      props: routeParams2Props,
      meta: {
        name: '公司详情',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        parentPath: '/supplier',
        activePath: '/supplier/company',
        right: [supplier_list, supplier_company_list],
      },
    },
    {
      path: '/supplier/plan/:id',
      name: RouterNameSupplier.companyPlan,
      component: () =>
        import(/* webpackChunkName: "supplier.plan.id" */ '../views/brand/planInfo.vue'),
      props: routeParams2Props,
      meta: {
        name: '方案详情',
        hidden: true,
        isKeepLive: false,
        parentPath: '/supplier',
        right: [supplier_list, kol_list, supplier_company_list],
      },
    },
    {
      path: '/supplier/generate/approval/:id',
      name: RouterNameSupplier.supplierGenerateApproval,
      component: () =>
        import(
          /* webpackChunkName: "supplier.generate.approval.id" */ '../modules/supplier/kolManage/detail/index.vue'
        ),
      props: routeParams2Props,
      meta: {
        name: 'KOL审核',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        parentPath: '/supplier',
        activePath: '/supplier/list',
        right: [supplier_list, kol_approval],
      },
    },
    {
      path: '/supplier/playermanager/contract/anchorTemplate/:id',
      name: RouterNameSupplier.player_contract,
      component: () =>
        import(
          /* webpackChunkName: "supplier.playermanager.contract.anchorTemplate" */ '../modules/customer/contract/template/detail/anchor.vue'
        ),
      props: true,
      meta: {
        name: '主播管理-合同详情',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        activePath: '/supplier/playermanager',
        parentPath: '/supplier',
        right: [],
      },
    },
    {
      path: '/design/anchorrecruitment',
      name: RouterNameDesign.anchorrecruitment,
      component: () =>
        import(
          /* webpackChunkName: "anchorRecruitment.recruitment" */ '../modules/anchorRecruitment/recruitment/index.vue'
        ),
      meta: {
        name: '主播招募',
        hirouteParams2Propsen: false,
        class: 'cls-star-info',
        isKeepLive: true,
        parentPath: '/supplier',
        right: [RIGHT_CODE.anchor_recruit],
      },
    },
  ],
};
