/**
 *@description: 财务管理
 *@author: 棠棣
 *@since: 2021/1/23 10:12
 */

import { RouteConfig } from 'vue-router';
import RouterViewEmptyPage from '@/layouts/empty.vue';
import { RouterNameFinance } from '@/const/router';
import { RIGHT_CODE } from '@/const/rightCode';
import { routeParams2Props } from '@/router/func';

const {
  gathering_view,
  payment_view,
  settlement_income_view,
  settlement_cost_view,
  receivable_view,
  payable_view,
  invoice_manage,
  cost_share,
  cost_share_history,
  income_flow,
  view_account_period,
  finance_account_view,
  view_invoice,
  cost_share_view,
  cost_share_history_view,
  income_flow_view,
  advance_payment_view,
} = RIGHT_CODE;

export const financeRoute: RouteConfig = {
  path: '/finance',
  name: RouterNameFinance.main,
  component: RouterViewEmptyPage,
  meta: {
    name: '财务管理',
    hidden: false,
    right: [
      finance_account_view,
      view_invoice,
      view_account_period,
      income_flow_view,
      gathering_view,
      payment_view,
      settlement_income_view,
      settlement_cost_view,
      receivable_view,
      payable_view,
      invoice_manage,
      cost_share_view,
      cost_share_history_view,
      advance_payment_view,
    ],
    icon: 'ico-menu-caiwuguanli',
    isKeepLive: false,
  },
  children: [
    {
      path: '/finance/settlement',
      name: RouterNameFinance.settlement,
      component: () =>
        import(
          /* webpackChunkName: "finance.settlement_income" */ '../modules/finance/settlement_income/index.vue'
        ),
      meta: {
        name: '收入结算',
        right: [settlement_income_view],
        hidden: false,
        parentPath: '/finance',
      },
    },
    {
      path: '/finance/settlement_cost',
      name: RouterNameFinance.settlement_cost,
      component: () =>
        import(
          /* webpackChunkName: "finance.settlement_cost" */ '../modules/finance/settlement_cost/index.vue'
        ),
      meta: {
        name: '成本结算',
        right: [settlement_cost_view],
        hidden: false,
        parentPath: '/finance',
      },
    },
    {
      path: '/finance/receivable',
      name: RouterNameFinance.receivable,
      component: () =>
        import(
          /* webpackChunkName: "finance.receivable" */ '../modules/finance/receivable/index.vue'
        ),
      meta: {
        name: '应收管理',
        right: [receivable_view],
        hidden: false,
        parentPath: '/finance',
      },
    },
    {
      path: '/finance/receive',
      name: RouterNameFinance.receive,
      component: () =>
        import(/* webpackChunkName: "finance.receive" */ '../modules/finance/receive/index.vue'),
      meta: {
        name: '收款管理',
        right: [gathering_view],
        hidden: false,
        parentPath: '/finance',
      },
    },
    {
      path: '/finance/payable',
      name: RouterNameFinance.payable,
      component: () =>
        import(/* webpackChunkName: "finance.payable" */ '../modules/finance/payable/index.vue'),
      meta: {
        name: '应付管理',
        right: [payable_view],
        hidden: false,
        parentPath: '/finance',
      },
    },
    {
      path: '/finance/payment',
      name: RouterNameFinance.payment,
      component: () =>
        import(/* webpackChunkName: "finance.payment" */ '../modules/finance/payment/index.vue'),
      meta: {
        name: '付款管理',
        right: [payment_view],
        hidden: false,
        parentPath: '/finance',
      },
    },
    {
      path: '/finance/invoice',
      name: RouterNameFinance.invoice_manager,
      component: () =>
        import(/* webpackChunkName: "finance.invoice" */ '../modules/finance/invoice/tab.vue'),
      meta: {
        name: '发票管理',
        right: [invoice_manage],
        hidden: false,
        parentPath: '/finance',
      },
      children: [
        {
          path: '/finance/invoice/:tab?',
          name: RouterNameFinance.invoice_application,
          component: () =>
            import(
              /* webpackChunkName: "finance.invoice.tab" */ '../modules/finance/invoice/tab.vue'
            ),
          props: routeParams2Props,
          meta: {
            name: '发票管理',
            right: [invoice_manage],
            hidden: false,
            parentPath: '/finance',
            activePath: '/finance/invoice',
          },
        },
      ],
    },
    {
      path: '/finance/costsharing',
      name: RouterNameFinance.cost_sharing,
      component: () =>
        import(
          /* webpackChunkName: "finance.costSharing" */ '../modules/finance/costSharing/index.vue'
        ),
      meta: {
        name: '费用分摊',
        right: [cost_share],
        hidden: false,
        parentPath: '/finance',
        activePath: '/finance/costsharing',
      },
    },
    {
      path: '/finance/costsharinghistory',
      name: RouterNameFinance.cost_sharing_history,
      component: () =>
        import(
          /* webpackChunkName: "finance.costSharing" */ '../modules/finance/costSharingHistory/index.vue'
        ),
      meta: {
        name: '分摊历史',
        right: [cost_share_history],
        hidden: false,
        parentPath: '/finance',
        activePath: '/finance/costsharinghistory',
      },
    },
    {
      path: '/finance/incomedetail',
      name: RouterNameFinance.income_detail,
      component: () =>
        import(
          /* webpackChunkName: "finance.incodedetail" */ '../modules/finance/incomeFlow/index.vue'
        ),
      meta: {
        name: '收入流水',
        right: [income_flow],
        hidden: false,
        parentPath: '/finance',
      },
    },
    {
      path: '/finance/billperiod',
      name: RouterNameFinance.billing_period,
      component: () =>
        import(
          /* webpackChunkName: "finance.billpreiod" */ '../modules/finance/billingPeriod/index.vue'
        ),
      meta: {
        name: '账期管理',
        right: [view_account_period],
        hidden: false,
        parentPath: '/finance',
      },
    },
    {
      path: '/finance/bank',
      component: () =>
        import(/* webpackChunkName: "finance.bank" */ '../modules/public/bank/index.vue'),
      meta: {
        name: '对公账户',
        parentPath: '/finance',
        right: [finance_account_view],
      },
    },
    {
      path: '/finance/prePay',
      component: () =>
        import(/* webpackChunkName: "finance.bank" */ '../modules/finance/prePay/index.vue'),
      meta: {
        name: '预收管理',
        parentPath: '/finance',
        right: [advance_payment_view],
      },
    },
  ],
};
