/**
 * 合同审批
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-12 23:28:33
 * @deprecated
 */

const isTargetDev = process.env.VUE_APP_TARGET_ENV !== 'production';

export default [
  {
    path: '/contract-approval',
    name: 'ContractApproval',
    component: () => import('../modules/contractApproval/index.vue'),
    meta: {
      name: '合同审批',
      hidden: false,
      class: 'cls-approval',
      icon: 'ico-menu-lite',
      isKeepLive: true,
      right: [],
    },
  },
  /*
  {
    path: '/contract-approval/:id/:tab?',
    name: 'ContractDetailInContractApproval',
    component: () => import('../modules/customer/contract/detail/index.vue'),
    meta: {
      name: '合同审批',
      hidden: true,
      class: 'cls-customer-info',
      isKeepLive: false,
    },
  },
  */
  ...(isTargetDev
    ? [
        {
          path: '/contract-approval/contract-detail',
          name: '合同审批详情',
          component: () => import('../views/contractApproval/contractDetail.vue'),
          meta: {
            hidden: true,
            class: 'cls-customer-info',
            isKeepLive: false,
            right: [],
          },
        },
      ]
    : []),
];
