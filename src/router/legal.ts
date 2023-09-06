/**
 * 供应商管理
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-09 11:36:28
 */
import { Route, RouteConfig } from 'vue-router';
import { RouterLegal } from '@/const/router';
import RouterViewEmptyPage from '@/layouts/empty.vue';
import { RIGHT_CODE } from '@/const/rightCode';

const {
  law_contract_view,
  law_legal_view,
  law_statistics_contract_view,
  law_contract_template_view,
  use_seal_record_view,
  law_contract_kanban,
} = RIGHT_CODE;
export const legalRoute: RouteConfig = {
  path: '/legal',
  name: RouterLegal.main,
  component: RouterViewEmptyPage,
  props: (route: Route) => {
    if ([RouterLegal.contracts.supplier.detail].includes(route.name ?? '')) {
      return { version: 1 };
    }
    if ([RouterLegal.statistics.supplier.detail].includes(route.name ?? '')) {
      return { version: 1 };
    }
    return { version: 2 };
  },
  meta: {
    name: '法务管理',
    right: [
      law_legal_view,
      law_contract_view,
      law_contract_template_view,
      law_statistics_contract_view,
      use_seal_record_view,
      law_contract_kanban,
      RIGHT_CODE.law_contract_general,
    ],
    icon: 'ico-menu-fawuguanli',
    isKeepLive: true,
  },
  children: [
    /** 这里拷贝营销业务中的合同 共享组件/不同路由 **/
    {
      path: '/legal/contract/supplier/:id/:tab?',
      name: RouterLegal.contracts.supplier.detail,
      component: () => import('../views/medium/contractDetail.vue'),
      props: true,
      meta: {
        name: '供应商合同详情',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/legal/contract',
        parentPath: '/legal',
        right: [],
      },
    },
    {
      path: '/legal/contract/supplierTemplate/:id/:tab?',
      name: RouterLegal.contracts.supplier.detailTemplate,
      component: () => import('../modules/customer/contract/template/detail/index.vue'),
      props: true,
      meta: {
        name: '供应商合同详情',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/legal/contract',
        parentPath: '/legal',
        right: [],
      },
    },
    {
      path: '/legal/contract/customer/:id/:tab?',
      name: RouterLegal.contracts.customer.detail,
      component: () => import('../modules/customer/contract/detail/index.vue'),
      props: true,
      meta: {
        name: '合同详情',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        activePath: '/legal/contract',
        parentPath: '/legal',
        right: [],
      },
    },
    {
      path: '/legal/contract/customerTemplate/:id/:tab?',
      name: RouterLegal.contracts.customer.detailTemplate,
      component: () => import('../modules/customer/contract/template/detail/index.vue'),
      props: true,
      meta: {
        name: '合同详情',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        activePath: '/legal/contract',
        parentPath: '/legal',
        right: [],
      },
    },
    {
      path: '/legal/statistics/supplier/:id/:tab?',
      name: RouterLegal.statistics.supplier.detail,
      component: () => import('../views/medium/contractDetail.vue'),
      props: true,
      meta: {
        name: '供应商合同详情',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/legal/statisticscontract',
        parentPath: '/legal',
        right: [],
      },
    },
    {
      path: '/legal/statistics/supplierTemplate/:id/:tab?',
      name: RouterLegal.statistics.supplier.detailTemplate,
      component: () => import('../modules/customer/contract/template/detail/index.vue'),
      props: true,
      meta: {
        name: '供应商合同详情',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/legal/statisticscontract',
        parentPath: '/legal',
        right: [],
      },
    },
    {
      path: '/legal/statistics/customer/:id/:tab?',
      name: RouterLegal.statistics.customer.detail,
      component: () => import('../modules/customer/contract/detail/index.vue'),
      props: true,
      meta: {
        name: '合同详情',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        activePath: '/legal/statisticscontract',
        parentPath: '/legal',
        right: [],
      },
    },
    {
      path: '/legal/statistics/customerTemplate/:id/:tab?',
      name: RouterLegal.statistics.customer.detailTemplate,
      component: () => import('../modules/customer/contract/template/detail/index.vue'),
      props: true,
      meta: {
        name: '合同详情',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        activePath: '/legal/statisticscontract',
        parentPath: '/legal',
        right: [],
      },
    },
    {
      path: '/legal/contract/anchorTemplate/:id/:tab?',
      name: RouterLegal.contracts.anchor.detailTemplate,
      component: () => import('../modules/customer/contract/template/detail/anchor.vue'),
      props: true,
      meta: {
        name: '合同详情',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        activePath: '/legal/contract',
        parentPath: '/legal',
        right: [],
      },
    },
    {
      path: '/legal/statistics/anchorTemplate/:id/:tab?',
      name: RouterLegal.statistics.anchor.detailTemplate,
      component: () => import('../modules/customer/contract/template/detail/anchor.vue'),
      props: true,
      meta: {
        name: '合同详情',
        hidden: true,
        class: 'cls-customer-info',
        isKeepLive: false,
        activePath: '/legal/statisticscontract',
        parentPath: '/legal',
        right: [],
      },
    },
    {
      path: '/legal/LegalBulletinBoard',
      name: RouterLegal.LegalBulletinBoard,
      component: () => import('../modules/legal/contract/LegalBulletinBoard.vue'),
      meta: {
        name: '合同看板',
        class: 'cls-star-info',
        isKeepLive: false,
        parentPath: '/legal',
        hidden: false,
        right: [RIGHT_CODE.law_contract_kanban],
        // right: [law_statistics_contract_view],
      },
    },
    {
      path: '/legal/NoLegalContractProject',
      name: RouterLegal.NoLegalContractProject,
      component: () => import('../modules/legal/contract/NoLegalContractProject.vue'),
      meta: {
        name: '无合同项目',
        class: 'cls-star-info',
        activePath: '/legal/LegalBulletinBoard',
        // isKeepLive: true,
        parentPath: '/legal',
        hidden: true,
        right: [law_statistics_contract_view],
      },
    },
    {
      path: '/legal/ExpiringContract',
      name: RouterLegal.ExpiringContract,
      component: () => import('../modules/legal/contract/ExpiringContract.vue'),
      meta: {
        name: '将到期合同',
        activePath: '/legal/LegalBulletinBoard',
        class: 'cls-star-info',
        // isKeepLive: true,
        parentPath: '/legal',
        hidden: true,
        right: [law_statistics_contract_view],
      },
    },
    {
      path: '/legal/AbnormalContract',
      name: RouterLegal.AbnormalContract,
      component: () => import('../modules/legal/contract/AbnormalContract.vue'),
      meta: {
        name: '倒签合同',
        activePath: '/legal/LegalBulletinBoard',
        class: 'cls-star-info',
        // isKeepLive: true,
        parentPath: '/legal',
        hidden: true,
        right: [law_statistics_contract_view],
      },
    },
    {
      path: '/legal/contract',
      name: RouterLegal.contact,
      component: () => import('../modules/legal/contract/index.vue'),
      meta: {
        name: '合同管理',
        class: 'cls-star-info',
        isKeepLive: false,
        parentPath: '/legal',
        hidden: false,
        right: [law_contract_view],
      },
    },
    {
      path: '/legal/tempaltecontract',
      name: RouterLegal.contempalte,
      component: () => import('../modules/legal/contract/templateContract.vue'),
      meta: {
        name: '模板管理',
        class: 'cls-star-info',
        isKeepLive: true,
        parentPath: '/legal',
        hidden: false,
        right: [RIGHT_CODE.law_contract_template_view],
      },
    },
    {
      path: '/legal/statisticscontract',
      name: RouterLegal.constatistics,
      component: () => import('../modules/legal/contract/statisticsContract.vue'),
      meta: {
        name: '合同统计',
        class: 'cls-star-info',
        isKeepLive: true,
        parentPath: '/legal',
        hidden: false,
        right: [RIGHT_CODE.law_statistics_contract_view],
      },
    },
    {
      path: '/legal/usesealrecord',
      name: RouterLegal.sealUseRecord,
      component: () => import('../modules/legal/sealUseRecord/index.vue'),
      meta: {
        name: '用印记录',
        class: 'cls-star-info',
        isKeepLive: false,
        parentPath: '/legal',
        hidden: false,
        right: [RIGHT_CODE.use_seal_record_view],
      },
    },
    {
      path: '/legal/contractAccount',
      name: RouterLegal.contracts.contractAccount,
      component: () => import('../modules/legal/contractAccount/index.vue'),
      meta: {
        name: '合同台账',
        class: 'cls-star-info',
        isKeepLive: false,
        parentPath: '/legal',
        hidden: false,
        right: [RIGHT_CODE.law_contract_ledger],
      },
    },
    {
      path: '/legal/generalContract',
      name: RouterLegal.contracts.generalContract,
      component: () => import('../modules/legal/contract/generalContract.vue'),
      meta: {
        name: '通用合同',
        class: 'cls-star-info',
        isKeepLive: false,
        parentPath: '/legal',
        hidden: false,
        right: [RIGHT_CODE.law_contract_general],
      },
    },
  ],
};
