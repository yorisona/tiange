import { RouteConfig } from 'vue-router';
import {
  RouterDataCenter,
  // RouterNameFinance,
  RouterGoodAnalysis,
  RouterNameFinancialStatements,
} from '@/const/router';
import RouterViewEmptyPage from '@/layouts/empty.vue';
import { RIGHT_CODE } from '@/const/rightCode';
import { routeParams2Props } from '@/router/func';

// 项目管报 -业财管报 --- 原来的数据中心
export const dataRoute: RouteConfig = {
  path: '/datacenter',
  name: RouterDataCenter.main,
  component: RouterViewEmptyPage,
  meta: {
    name: '项目管报',
    right: [RIGHT_CODE.datacenter_view],
    icon: 'ico-menu-xiangmuguanbao',
    isKeepLive: true,
  },
  children: [
    {
      path: '/datacenter/shoplive',
      name: RouterDataCenter.shopLive,
      component: () =>
        import(
          /* webpackChunkName: "datacenter.shoplive" */ '../modules/datacenter/shoplive/index.vue'
        ),
      meta: {
        name: '品牌中心',
        hidden: false,
        class: 'cls-star-info',
        isKeepLive: false,
        // activePath: '/datacenter/overview',
        parentPath: '/datacenter',
        right: [RIGHT_CODE.datacenter_shop_live],
      },
    },
    {
      path: '/datacenter/projectDetail/:id',
      name: RouterDataCenter.dataItemDetail,
      component: () =>
        import(
          /* webpackChunkName: "datacenter.projectdetail" */ '../modules/datacenter/shoplive/tabs/projectDetail/index.vue'
        ),
      meta: {
        name: '项目详情',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/datacenter/shoplive',
        parentPath: '/datacenter/shoplive',
        right: [RIGHT_CODE.datacenter_shop_live],
      },
    },
    {
      path: '/datacenter/projectDetail/projectShopDetail/:id',
      name: RouterDataCenter.projectShopDetail,
      component: () =>
        import(
          /* webpackChunkName: "datacenter.projectdetail.projectShopDetail" */ '../modules/datacenter/shoplive/tabs/projectDetail/projectShopDetail.vue'
        ),
      meta: {
        name: '商品明细',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/datacenter/shoplive',
        parentPath: '/datacenter/shoplive',
        right: [RIGHT_CODE.datacenter_shop_live],
      },
    },
    {
      path: '/datacenter/shoplive/performance/:id',
      name: RouterDataCenter.performanceDetail,
      component: () =>
        import(
          /* webpackChunkName: "datacenter.shoplive.performance" */ '../modules/datacenter/shoplive/tabs/performanceDetail/index.vue'
        ),
      meta: {
        name: '场次复盘',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/datacenter/shoplive',
        parentPath: '/datacenter/shoplive',
        right: [RIGHT_CODE.datacenter_shop_live],
      },
    },
    {
      path: '/datacenter/mcn',
      name: RouterDataCenter.dataMCN,
      component: () =>
        import(/* webpackChunkName: "datacenter.mcn" */ '../modules/datacenter/mcn/index.vue'),
      meta: {
        name: '创新项目',
        hidden: false,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/datacenter/mcn',
        parentPath: '/datacenter',
        right: [RIGHT_CODE.datacenter_dataMCN_view],
      },
    },
    {
      path: '/datacenter/mcn/project/:id/:businessType',
      name: RouterDataCenter.dataMCNProject,
      props: routeParams2Props,
      component: () =>
        import(
          /* webpackChunkName: "datacenter.mcn.project" */ '../modules/datacenter/project/index.vue'
        ),
      meta: {
        name: '项目数据',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/datacenter/mcn',
        parentPath: '/datacenter',
        right: [RIGHT_CODE.datacenter_dataMCN_view],
      },
    },
    {
      path: '/datacenter/taomarket',
      name: RouterDataCenter.dataMarket,
      component: () =>
        import(
          /* webpackChunkName: "datacenter.taomarket" */ '../modules/datacenter/market/index.vue'
        ),
      meta: {
        name: '整合营销',
        hidden: false,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/datacenter/taomarket',
        parentPath: '/datacenter',
        right: [RIGHT_CODE.datacenter_dataMarket_view],
      },
    },
    {
      path: '/datacenter/taomarket/project/:id/:businessType',
      name: RouterDataCenter.dataMarketProject,
      props: routeParams2Props,
      component: () =>
        import(
          /* webpackChunkName: "datacenter.taomarket.project" */ '../modules/datacenter/project/index.vue'
        ),
      meta: {
        name: '项目数据',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/datacenter/taomarket',
        parentPath: '/datacenter',
        right: [RIGHT_CODE.datacenter_dataMarket_view],
      },
    },
  ],
};

export const goodsAnalysis: RouteConfig = {
  path: '/dataAnalysis',
  name: RouterGoodAnalysis.main,
  component: RouterViewEmptyPage,
  meta: {
    name: '商品分析',
    right: [
      RIGHT_CODE.dataAnalysis,
      RIGHT_CODE.commodity_hot_sale_manager,
      RIGHT_CODE.datacenter_market_analysis,
      RIGHT_CODE.datacenter_competitor_analysis,
      RIGHT_CODE.datacenter_commodity_analyze_view,
      RIGHT_CODE.trainingManage_view,
      RIGHT_CODE.short_video_test_view,
    ],
    icon: 'ico-menu-shangpinfenxi',
    isKeepLive: true,
  },
  children: [
    {
      path: '/dataAnalysis/commodityAnalysis',
      name: RouterDataCenter.commodityAnalysis,
      component: () =>
        import(
          /* webpackChunkName: "dataAnalysis.commodityAnalysis" */ '../modules/datacenter/commodityAnalysis/home.vue'
        ),
      meta: {
        name: '品牌商品分析',
        hidden: false,
        class: 'cls-star-info',
        isKeepLive: true,
        activePath: '/dataAnalysis/commodityAnalysis',
        parentPath: '/dataAnalysis',
        right: [RIGHT_CODE.datacenter_commodity_analyze_view],
      },
    },
    {
      path: '/dataAnalysis/multidimensional/commodity',
      name: RouterDataCenter.commodityMultiDimensionalAnalysis,
      component: () =>
        import(
          /* webpackChunkName: "dataAnalysis.multidimensional" */ '../modules/datacenter/multidimensional/commodity/index.vue'
        ),
      meta: {
        name: '商品多维分析',
        hidden: true,
        class: 'cls-star-info',
        isNoShowBack: false,
        isKeepLive: true,
        parentPath: '/dataAnalysis',
        activePath: '/dataAnalysis/commodityAnalysis',
        right: [RIGHT_CODE.datacenter_commodity_analyze_view],
      },
    },
    {
      path: '/dataAnalysis/multidimensional/inventory',
      name: RouterDataCenter.commodityCollocationMonitoringInventory,
      component: () =>
        import(
          /* webpackChunkName: "dataAnalysis.commodityCollocationMonitoring" */ '../modules/datacenter/commodityAnalysis/inventory/index.vue'
        ),
      meta: {
        name: '库存售罄监控',
        hidden: true,
        class: 'cls-star-info',
        isNoShowBack: false,
        isKeepLive: true,
        parentPath: '/dataAnalysis',
        activePath: '/dataAnalysis/commodityAnalysis',
        right: [RIGHT_CODE.inventory_sold_out_monitoring],
      },
    },
    {
      path: '/dataAnalysis/commodityAnalysis/detail',
      name: RouterDataCenter.commodityAnalysisDetail,
      component: () =>
        import(
          /* webpackChunkName: "dataAnalysis.commodityAnalysis" */ '../modules/datacenter/commodityAnalysis/detail/index.vue'
        ),
      meta: {
        name: '品牌商品分析详情',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/dataAnalysis/commodityAnalysis',
        parentPath: '/dataAnalysis',
        right: [RIGHT_CODE.datacenter_commodity_analyze_view],
      },
    },
    {
      path: '/dataAnalysis/commodityAnalysis/weekMonthSalesAnalysis',
      name: RouterDataCenter.commodityWeekMonthSalesAnalysis,
      component: () =>
        import(
          /* webpackChunkName: "dataAnalysis.commodityAnalysis.weekMonthSalesAnalysis" */ '../modules/datacenter/commodityAnalysis/weekMonthSalesAnalysis/index.vue'
        ),
      meta: {
        name: '日/周/月销售分析',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/dataAnalysis/commodityAnalysis',
        parentPath: '/dataAnalysis',
        // right: [RIGHT_CODE.datacenter_commodity_analyze_view],
      },
    },
    {
      path: '/dataAnalysis/commodityAnalysis/brandCategoryAnalysis',
      name: RouterDataCenter.commodityBrandCategoryAnalysis,
      component: () =>
        import(
          /* webpackChunkName: "dataAnalysis.commodityAnalysis.commodityAnalysis" */ '../modules/datacenter/commodityAnalysis/brandCategory/index.vue'
        ),
      meta: {
        name: '品牌类目分析',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: true,
        activePath: '/dataAnalysis/commodityAnalysis',
        parentPath: '/dataAnalysis',
        isNewPage: true, //是新开的页面展示
        // right: [RIGHT_CODE.datacenter_commodity_analyze_view],
      },
    },
    {
      path: '/dataAnalysis/commodityAnalysis/yearSeasonAnalysis',
      name: RouterDataCenter.commodityYearSeasonAnalysis,
      component: () =>
        import(
          /* webpackChunkName: "dataAnalysis.commodityAnalysis.yearSeasonAnalysis" */ '../modules/datacenter/commodityAnalysis/yearSeason/index.vue'
        ),
      meta: {
        name: '年度季节分析',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: true,
        activePath: '/dataAnalysis/commodityAnalysis',
        parentPath: '/dataAnalysis',
        isNewPage: true, //是新开的页面展示
        // right: [RIGHT_CODE.datacenter_commodity_analyze_view],
      },
    },
    {
      path: '/dataAnalysis/commodityAnalysis/competitive',
      name: RouterDataCenter.commodityAnalysisCompetitive,
      component: () =>
        import(
          /* webpackChunkName: "dataAnalysis.commodityAnalysis.competitive" */ '../modules/datacenter/commodityAnalysis/competitive/index.vue'
        ),
      meta: {
        name: '竞品销售分析',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/dataAnalysis/commodityAnalysis',
        parentPath: '/dataAnalysis',
        right: [RIGHT_CODE.datacenter_commodity_analyze_view],
      },
    },
    {
      path: '/dataAnalysis/commodityAnalysis/preSale',
      name: RouterDataCenter.commodityAnalysisPreSale,
      component: () =>
        import(
          /* webpackChunkName: "dataAnalysis.commodityAnalysis.preSale" */ '../modules/datacenter/commodityAnalysis/preSale/index.vue'
        ),
      meta: {
        name: '预售商品分析',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/dataAnalysis/commodityAnalysis',
        parentPath: '/dataAnalysis',
        right: [RIGHT_CODE.datacenter_commodity_analyze_view],
      },
    },
    {
      path: '/dataAnalysis/commodityAnalysis/monitorAnalysis',
      name: RouterDataCenter.commodityAnalysisMonitor,
      component: () =>
        import(
          /* webpackChunkName: "dataAnalysis.commodityAnalysis.preSale" */ '../modules/datacenter/commodityAnalysis/monitorAnalysis/index.vue'
        ),
      meta: {
        name: '商品监控分析',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/dataAnalysis/commodityAnalysis',
        parentPath: '/dataAnalysis',
        right: [RIGHT_CODE.datacenter_monitor_analyze_view],
      },
    },
    {
      path: '/dataAnalysis/commodityAnalysis/popular',
      name: RouterDataCenter.commodityWeekPopular,
      component: () =>
        import(
          /* webpackChunkName: "dataAnalysis.commodityAnalysis.preSale" */ '../modules/datacenter/commodityAnalysis/popular/index.vue'
        ),
      meta: {
        name: '每周爆款对比',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/dataAnalysis/commodityAnalysis',
        parentPath: '/dataAnalysis',
        right: [RIGHT_CODE.datacenter_commodity_analyze_view],
      },
    },
    {
      path: '/dataAnalysis/competitor',
      name: RouterDataCenter.commoditySalesAnalysis,
      component: () =>
        import(
          /* webpackChunkName: "dataAnalysis.commodityAnalysis.preSale" */ '../modules/datacenter/competitor/index.vue'
        ),
      meta: {
        name: '竞品销售分析',
        hidden: false,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/dataAnalysis/competitor',
        parentPath: '/dataAnalysis',
        // right: [RIGHT_CODE.datacenter_competitorAnalysis],
        isNoShowBack: true,
        right: [RIGHT_CODE.datacenter_competitor_analysis],
      },
      redirect: '/dataAnalysis/competitor/date',
      children: [
        {
          path: '/dataAnalysis/competitor/date',
          name: RouterDataCenter.commoditySalesAnalysisByDate,
          component: () =>
            import(
              /* webpackChunkName: "dataAnalysis.commodityAnalysis.preSale" */ '../modules/datacenter/competitor/tab/date/index.vue'
            ),
          meta: {
            name: '竞品销售分析',
            hidden: true,
            class: 'cls-star-info',
            isKeepLive: false,
            activePath: '/dataAnalysis/competitor',
            parentPath: '/dataAnalysis',
            right: [RIGHT_CODE.datacenter_competitor_analysis],
            isNoShowBack: true,
          },
        },
        {
          path: '/dataAnalysis/competitor/month',
          name: RouterDataCenter.commoditySalesAnalysisByMonth,
          component: () =>
            import(
              /* webpackChunkName: "dataAnalysis.competitor.month" */ '../modules/datacenter/competitor/tab/month/index.vue'
            ),
          meta: {
            name: '竞品销售分析',
            hidden: true,
            class: 'cls-star-info',
            isKeepLive: false,
            activePath: '/dataAnalysis/competitor',
            parentPath: '/dataAnalysis',
            right: [RIGHT_CODE.datacenter_competitor_analysis],
            isNoShowBack: true,
          },
        },
      ],
    },
    {
      path: '/dataAnalysis/marketAnalysis',
      name: RouterDataCenter.marketAnalysis,
      component: () =>
        import(
          /* webpackChunkName: "dataAnalysis.marketAnalysis" */ '../modules/datacenter/marketAnalysis/index.vue'
        ),
      meta: {
        name: '大盘类目分析',
        hidden: false,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/dataAnalysis/marketAnalysis',
        parentPath: '/dataAnalysis',
        right: [RIGHT_CODE.datacenter_market_analysis],
      },
    },
    {
      path: '/dataAnalysis/hotSale',
      name: RouterDataCenter.hotSaleMonitor,
      component: () =>
        import(
          /* webpackChunkName: "dataAnalysis.hotSale" */ '../modules/datacenter/hotSale/index.vue'
        ),
      meta: {
        name: '全网热销监控',
        isKeepLive: true,
        parentPath: '/dataAnalysis',
        right: [RIGHT_CODE.commodity_hot_sale_manager],
      },
    },
    {
      path: '/dataAnalysis/hotSale/:id/:project_name',
      name: RouterDataCenter.hotSaleMonitorDetail,
      component: () =>
        import(
          /* webpackChunkName: "dataAnalysis.hotSale" */ '../modules/datacenter/hotSale/detail.vue'
        ),
      meta: {
        name: '项目查看',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/dataAnalysis/hotSale',
        parentPath: '/dataAnalysis/',
        right: [RIGHT_CODE.commodity_hot_sale_manager],
      },
    },
    {
      path: '/dataAnalysis/trainingManage',
      component: () =>
        import(
          /* webpackChunkName: "dataAnalysis.trainingManage" */ '../modules/dataAnalysis/index.vue'
        ),
      meta: {
        name: '商品培训管理',
        hidden: false,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/dataAnalysis/trainingManage',
        parentPath: '/dataAnalysis',
        right: [RIGHT_CODE.trainingManage_view],
      },
      redirect: '/dataAnalysis/trainingManage/training',
      children: [
        {
          path: '/dataAnalysis/trainingManage/training',
          name: RouterDataCenter.trainingManage,
          component: () =>
            import(
              /* webpackChunkName: "dataAnalysis.trainingManage.training" */ '../modules/dataAnalysis/tabs/trainingManage/index.vue'
            ),
          meta: {
            name: '商品培训管理',
            hidden: true,
            class: 'cls-star-info',
            isKeepLive: false,
            activePath: '/dataAnalysis/trainingManage',
            parentPath: '/dataAnalysis',
            right: [RIGHT_CODE.trainingManage_view],
            isNoShowBack: true,
          },
        },
        {
          path: '/dataAnalysis/trainingManage/matching',
          name: RouterDataCenter.matchingManage,
          component: () =>
            import(
              /* webpackChunkName: "dataAnalysis.trainingManage.matching" */ '../modules/dataAnalysis/tabs/matchingManage/index.vue'
            ),
          meta: {
            name: '商品搭配管理',
            hidden: true,
            class: 'cls-star-info',
            isKeepLive: false,
            activePath: '/dataAnalysis/trainingManage',
            parentPath: '/dataAnalysis',
            right: [RIGHT_CODE.trainingManage_view],
            isNoShowBack: true,
          },
        },
      ],
    },
    {
      path: '/dataAnalysis/trainingManage/training/detail',
      name: RouterDataCenter.trainingManageDetail,
      component: () =>
        import(
          /* webpackChunkName: "dataAnalysis.trainingManage" */ '../modules/dataAnalysis/tabs/trainingManage/detail/index.vue'
        ),
      meta: {
        name: '商品培训详情',
        hidden: true,
        class: 'cls-star-info',
        isKeepLive: false,
        activePath: '/dataAnalysis/trainingManage',
        parentPath: '/dataAnalysis',
        right: [RIGHT_CODE.datacenter_commodity_analyze_view],
      },
    },
    {
      path: '/dataAnalysis/videomeasurement/video',
      component: () =>
        import(
          /* webpackChunkName: "dataAnalysis.videomeasurement" */ '../modules/datacenter/videoMeasurement/index.vue'
        ),
      meta: {
        name: '短视频测款',
        hidden: false,
        class: 'cls-star-info',
        isNoShowBack: true,
        isKeepLive: true,
        parentPath: '/dataAnalysis',
        right: [RIGHT_CODE.short_video_test_view],
      },
      children: [
        {
          path: '/dataAnalysis/videomeasurement/video',
          name: RouterDataCenter.videoMeasurementVideos,
          component: () =>
            import(
              /* webpackChunkName: "dataAnalysis.videomeasurement" */ '../modules/datacenter/videoMeasurement/video/index.vue'
            ),
          meta: {
            name: '短视频测款',
            hidden: true,
            class: 'cls-star-info',
            isKeepLive: true,
            parentPath: '/dataAnalysis',
            activePath: '/dataAnalysis/videomeasurement/video',
            right: [RIGHT_CODE.short_video_test_view],
            isNoShowBack: true,
          },
        },
        {
          path: '/dataAnalysis/videomeasurement/goods',
          name: RouterDataCenter.videoMeasurementGoods,
          component: () =>
            import(
              /* webpackChunkName: "dataAnalysis.videomeasurement" */ '../modules/datacenter/videoMeasurement/goods/index.vue'
            ),
          meta: {
            name: '短视频测款',
            hidden: true,
            class: 'cls-star-info',
            isKeepLive: true,
            parentPath: '/dataAnalysis',
            activePath: '/dataAnalysis/videomeasurement/video',
            right: [RIGHT_CODE.short_video_test_view],
            isNoShowBack: true,
          },
        },
        {
          path: '/dataAnalysis/videomeasurement/model',
          name: RouterDataCenter.videoMeasurementModel,
          component: () =>
            import(
              /* webpackChunkName: "dataAnalysis.videomeasurement.model" */ '../modules/datacenter/videoMeasurement/model/index.vue'
            ),
          meta: {
            name: '短视频测款',
            hidden: true,
            class: 'cls-star-info',
            isKeepLive: true,
            parentPath: '/dataAnalysis',
            activePath: '/dataAnalysis/videomeasurement/video',
            right: [RIGHT_CODE.short_video_test_view],
            isNoShowBack: true,
          },
        },
      ],
    },
    {
      path: '/dataAnalysis/commodityCollocationMonitoring/live',
      component: () =>
        import(
          /* webpackChunkName: "dataAnalysis.commodityCollocationMonitoring.live" */ '../modules/datacenter/commodityCollocationMonitoring/index.vue'
        ),
      meta: {
        name: '商品搭配监控',
        hidden: true,
        class: 'cls-star-info',
        isNoShowBack: true,
        isKeepLive: true,
        parentPath: '/dataAnalysis',
        right: [RIGHT_CODE.short_video_test_view],
      },
      children: [
        {
          path: '/dataAnalysis/commodityCollocationMonitoring/live',
          name: RouterDataCenter.commodityCollocationMonitoringLive,
          component: () =>
            import(
              /* webpackChunkName: "dataAnalysis.commodityCollocationMonitoring" */ '../modules/datacenter/commodityCollocationMonitoring/live/index.vue'
            ),
          meta: {
            name: '搭配效果追踪',
            hidden: true,
            class: 'cls-star-info',
            isKeepLive: true,
            parentPath: '/dataAnalysis',
            activePath: '/dataAnalysis/commodityAnalysis',
            right: [RIGHT_CODE.short_video_test_view],
            // isNoShowBack: true,
          },
        },
        {
          path: '/dataAnalysis/commodityCollocationMonitoring/statistics',
          name: RouterDataCenter.commodityCollocationMonitoringStatistics,
          component: () =>
            import(
              /* webpackChunkName: "commodityCollocationMonitoring" */ '../modules/datacenter/commodityCollocationMonitoring/statistics/index.vue'
            ),
          meta: {
            name: '搭配统计',
            hidden: true,
            class: 'cls-star-info',
            isKeepLive: true,
            parentPath: '/dataAnalysis',
            activePath: '/dataAnalysis/commodityAnalysis',
            right: [RIGHT_CODE.short_video_test_view],
            isNoShowBack: true,
          },
        },
      ],
    },
  ],
};

export const financialStatements: RouteConfig = {
  path: '/fincialStatements',
  name: RouterNameFinancialStatements.main,
  component: RouterViewEmptyPage,
  meta: {
    name: '财务报表',
    right: [
      RIGHT_CODE.financial_report,
      RIGHT_CODE.financial_report_view,
      RIGHT_CODE.financial_dashboard,
      RIGHT_CODE.financial_profit_loss_statement,
      RIGHT_CODE.fincialStatements_report_view,
      RIGHT_CODE.fincialStatements_prepaid_view,
      RIGHT_CODE.fincialStatements_dailyCost_view,
    ],
    icon: 'ico-menu-caiwubaobiao',
    isKeepLive: true,
  },
  children: [
    {
      path: '/fincialStatements/fundStatement',
      name: RouterNameFinancialStatements.fundStatement,
      component: () =>
        import(
          /* webpackChunkName: "fincialStatements.fundStatement" */ '../modules/finance/fundStatement/index.vue'
        ),
      meta: {
        name: '资金报表',
        right: [RIGHT_CODE.fund_statement],
        hidden: false,
        parentPath: '/fincialStatements',
      },
    },
    {
      path: '/fincialStatements/profixLossStatement',
      name: RouterNameFinancialStatements.profixLossStatement,
      component: () =>
        import(
          /* webpackChunkName: "fincialStatements.profixLossStatement" */ '../modules/finance/profixLossStatement/index.vue'
        ),
      meta: {
        name: '损益表',
        right: [RIGHT_CODE.financial_profit_loss_statement],
        hidden: false,
        parentPath: '/fincialStatements',
      },
    },
    {
      path: '/fincialStatements/report',
      name: RouterNameFinancialStatements.incomeAndExpenditure,
      component: () =>
        import(
          /* webpackChunkName: "fincialStatements.report" */ '../modules/finance/report/index.vue'
        ),
      meta: {
        name: '收支明细',
        right: [RIGHT_CODE.fincialStatements_report_view],
        hidden: false,
        parentPath: '/fincialStatements',
        tab: ['financeDetails', 'financeQuick'],
      },
    },
    {
      path: '/fincialStatements/prepaid',
      name: RouterNameFinancialStatements.prepaid,
      component: () =>
        import(
          /* webpackChunkName: "fincialStatements.prepaid" */ '../modules/finance/report/index.vue'
        ),
      meta: {
        name: '预收预付',
        right: [RIGHT_CODE.fincialStatements_prepaid_view],
        hidden: false,
        parentPath: '/fincialStatements',
        tab: ['financePrecharge', 'financePrepay'],
      },
    },
    {
      path: '/fincialStatements/dailyCost',
      name: RouterNameFinancialStatements.dailyExpenseReport,
      component: () =>
        import(
          /* webpackChunkName: "fincialStatements.dailyCost" */ '../modules/finance/report/index.vue'
        ),
      meta: {
        name: '日支出报表',
        right: [RIGHT_CODE.fincialStatements_dailyCost_view],
        hidden: false,
        parentPath: '/fincialStatements',
        tab: ['dailyCost'],
      },
    },
  ],
};
