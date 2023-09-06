import { RouterNameProjectManage, RouterLegal, RouterNameFinance } from '@/const/router';
import { getUrlParams } from '@/utils/string';
import { getToken, setToken } from '@/utils/token';
import Router, { Route, NavigationGuardNext } from 'vue-router';
import { useRouter } from '@/use/vue-router';

const _router = useRouter();

const externalQueryValue = 'external';
// const externalQueryKey = 'source';
const externalQuery = {
  source: externalQueryValue,
};
const getExternalPath = (subPath?: string) => {
  return subPath
    ? `/${externalQueryValue}${subPath.indexOf('/') === 0 ? '' : '/'}${subPath}`
    : `/${externalQueryValue}`;
};

const ExternalRouteMap = {
  /** 客户合同-old */
  [getExternalPath('/contract/customer/detail')]: RouterLegal.contracts.customer.detail,
  /** 客户合同-new */
  [getExternalPath('/contract/customer/detailTemplate')]:
    RouterLegal.contracts.customer.detailTemplate,
  /** 供应商合同-old */
  [getExternalPath('/contract/supplier/detail')]: RouterLegal.contracts.supplier.detail,
  /** 供应商合同-new */
  [getExternalPath('/contract/supplier/detailTemplate')]:
    RouterLegal.contracts.supplier.detailTemplate,
  /** 主播合同 */
  [getExternalPath('/contract/anchor/detail')]: RouterLegal.contracts.anchor.detailTemplate,
  /** 品牌中心项目 */
  [getExternalPath('/live/project')]: RouterNameProjectManage.live.project.detail,
  /** S2B2C项目 */
  [getExternalPath('/commonbusiness/project')]:
    RouterNameProjectManage.commonBusiness.project.detail,
  /** 整合营销项目 */
  [getExternalPath('/marketing/project')]: RouterNameProjectManage.marketing.project.detail,
  /** 本地生活项目 */
  [getExternalPath('/localLife/project')]: RouterNameProjectManage.localLife.detail.info,
  /** 发票管理 */
  [getExternalPath('/finance/invoice')]: RouterNameFinance.invoice_manager,
};

// 登录验证判断
const doLoginProcess = (to: any, form: any, next: any) => {
  // 登录页自动进入系统
  const token = getToken();
  if (token !== null && to.name === 'Login') {
    return next('/');
  }
  /**
   *  过滤不鉴定路径
   *  /external/login 外部登录
   *
   */
  const exclude = ['/external/', '/login'];
  for (let i = 0; i < exclude.length; i++) {
    if (to.path.indexOf(exclude[i]) === 0) return next();
  }

  // 未登陆跳转登录页
  if (!token) {
    return next({
      path: '/login',
      query: { redirect: window.location.pathname + window.location.search },
    });
  }

  next();
};
// 飞书跳转登录
const doLoginFeishu = (to: any, form: any, next: any) => {
  if (to.fullPath.indexOf('/external/feishu') === 0) {
    //获取路径token加入到cookie
    setToken(getUrlParams(window.location.href).Authorization);
    next('/');
  }
  next();
};

export const setupRouteGuard = (router: Router) => {
  router.beforeEach(doLoginProcess);
  router.beforeEach(doLoginFeishu);
  // router.beforeEach((to, from, next) => {
  //   if (getToken() !== null && to.name === 'Login') {
  //     next('/');
  //   } else if (to.fullPath.indexOf('Authorization') > 0) {
  //     console.log(to, getUrlParams(window.location.href), 'to');
  //     setToken(getUrlParams(window.location.href).Authorization);
  //     next();
  //   } else if (to.fullPath.indexOf('login') < 0) {
  //     if (getToken()) {
  //       next();
  //     } else {
  //       next({
  //         path: '/login',
  //         query: { redirect: window.location.pathname + window.location.search },
  //       });
  //     }
  //   } else {
  //     next();
  //   }
  // });
  router.beforeEach((to: Route, form: Route, next: NavigationGuardNext) => {
    // 目前只有合同，后面修改
    const toPath = to.path;
    const routeName = ExternalRouteMap[toPath];
    const { id, tab, ...rest } = to.query;
    if (routeName) {
      next({
        name: routeName,
        params: {
          id: id as string,
          tab: tab as string,
        },
        query: {
          ...externalQuery,
          ...rest,
        },
      });
    } else {
      next();
    }
  });

  router.afterEach((to, from) => {
    if (to.name === from.name) {
      if (to.name === 'SSLiveProjectDetail' || to.name === 'SSLiveDiaplayDetail') {
        return;
      }
    }

    const el = document.querySelector('.list-scrollbar');
    if (el !== null) {
      el.scrollTop = 0;
      el.scrollLeft = 0;
    }
  });
};

export const isExternal = () => {
  return _router.currentRoute.query.source === externalQueryValue;
};

export const useExternal = () => {
  return {
    isExternal,
    externalQuery,
  };
};
