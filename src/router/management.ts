import { RouteConfig } from 'vue-router';
import RouterViewEmptyPage from '@/layouts/empty.vue';
import { RouterManagement } from '@/const/router';

import { RIGHT_CODE } from '@/const/rightCode';
import { routeParams2Props } from '@/router/func';

const {
  budget_manage,
  budget_manage_view,
  project_dashboard,
  project_dashboard_view,
  project_management_dashboard,
  project_management_dashboard_view,
  company_dashboard,
  company_dashboard_view,
  department_dashboard,
  department_dashboard_view,
} = RIGHT_CODE;

export const ManagementRoute: RouteConfig = {
  path: '/management',
  name: RouterManagement.main,
  component: RouterViewEmptyPage,
  meta: {
    name: '经营管理',
    hidden: false,
    icon: 'ico-menu-jingyingguanli',
    right: [
      budget_manage,
      budget_manage_view,
      project_dashboard,
      project_dashboard_view,
      project_management_dashboard,
      project_management_dashboard_view,
      company_dashboard,
      company_dashboard_view,
      department_dashboard,
      department_dashboard_view,
    ],
  },
  children: [
    {
      path: '/management/companyDashboard',
      name: RouterManagement.companyDashboard,
      props: routeParams2Props,
      component: () => import('../modules/management/companyDashboard/index.vue'),
      meta: {
        name: '公司看板',
        hidden: false,
        parentPath: '/management',
        right: [company_dashboard_view],
        isKeepLive: false,
      },
    },
    {
      path: '/management/departmentDashboard',
      name: RouterManagement.departmentDashboard,
      props: routeParams2Props,
      component: () => import('../modules/management/departmentDashboard/index.vue'),
      meta: {
        name: '部门看板',
        hidden: false,
        parentPath: '/management',
        right: [department_dashboard_view],
        isKeepLive: false,
      },
    },
    {
      path: '/management/projectManagementDashboard',
      name: RouterManagement.projectManagementDashboard,
      props: routeParams2Props,
      component: () => import('../modules/management/projectManagementDashboard/index.vue'),
      meta: {
        name: '项目看板',
        hidden: false,
        parentPath: '/management',
        right: [project_management_dashboard_view],
        isKeepLive: false,
      },
    },
    {
      path: '/management/projectDashboard',
      name: RouterManagement.projectDashboard,
      props: routeParams2Props,
      component: () => import('../modules/management/projectDashboard/index.vue'),
      meta: {
        name: '项目明细',
        hidden: false,
        parentPath: '/management',
        right: [project_dashboard_view],
        isKeepLive: false,
      },
    },
    {
      path: '/management/targetManagement',
      name: RouterManagement.targetManagement,
      component: () => import('../modules/management/budget/index.vue'),
      meta: {
        name: '预算目标',
        hidden: false,
        parentPath: '/management',
        right: [budget_manage_view],
        isKeepLive: false,
      },
    },
    {
      path: '/management/targetManagement/departmentBudget',
      name: RouterManagement.departmentManagement,
      props: routeParams2Props,
      component: () => import('../modules/management/budget/departmentBudget/index.vue'),
      meta: {
        name: '部门预算',
        hidden: true,
        activePath: '/management/targetManagement',
        parentPath: '/management',
        right: [budget_manage_view],
        isKeepLive: false,
      },
    },
    {
      path: '/management/targetManagement/projectBudget',
      name: RouterManagement.projectManagement,
      props: routeParams2Props,
      component: () => import('../modules/management/budget/projectBudget/index.vue'),
      meta: {
        name: '项目预算',
        hidden: true,
        activePath: '/management/targetManagement',
        parentPath: '/management',
        right: [budget_manage_view],
        isKeepLive: false,
      },
    },
  ],
};
