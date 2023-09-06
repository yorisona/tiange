/**
 * 路由相关常量
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-24 10:12:36
 */

/** 通用业务 路由名称 */
export const RouterWorkbench = {
  main: 'Workbench',
  home: {
    mine_files: 'MineFiles',
    anchor_recruitment: 'anchorRecruitment',
    m_currency_exchange: 'm_currency_exchange',
  },
};

/** 项目管理 */
export const RouterNameProjectManage = {
  main: 'SSProjectManage',
  /** 电商业务 */
  live: {
    project: {
      list: 'SSLiveProject',
      detail: 'SSLiveProjectDetail',
    },
    roster: 'SSLiveRoster',
    status: 'SSLiveStatus',
    rosterTab: 'SSLiveRosterTab',
    display: {
      list: 'SSLiveDiaplay',
      detail: 'SSLiveDiaplayDetail',
    },
    /** 合同 */
    contract: {
      /** 客户合同 */
      customer: {
        /** 客户合同 - 列表 */
        list: 'SSLiveCustomerContract',
        /** 客户合同 - 详情 */
        detail: 'SSLiveCustomerContractDetail',
        detailTemplate: 'SSLiveCustomerContractDetailTemplate',
      },
      /** 供应商合同 */
      supplier: {
        /** 供应商合同 - 列表 */
        list: 'SSLiveSupplierContract',
        /** 供应商合同 - 详情 */
        detail: 'SSLiveSupplierContractDetail',
        detailTemplate: 'SSLiveSupplierContractDetailTemplate',
      },
      anchor: {
        detailTemplate: 'SSLiveAnchorContractDetailTemplate',
      },
    },
  },
  tiktokLive: {
    project: {
      detail: {
        template: 'SSTikTokLiveProjectDetailTemplate',
        info: 'SSTikTokLiveProjectDetailInfo',
        display: 'SSTikTokLiveProjectDisplay',
        income: 'SSTikTokLiveProjectIncome',
        cost: 'SSTikTokLiveProjectCost',
        contract: 'SSTikTokLiveProjectContract',
        data: 'SSTikTokLiveProjectData',
        target: 'SSTikTokLiveProjectTarget',
        liveTool: 'SSTikTokLiveProjectLiveTool',
        setting: 'SSTikTokLiveProjectSetting',
        displayDetail: 'SSTikTokLiveProjectDisplayDetail',
      },
      revisionDetail: {
        sessionReviewDetail: 'SSTikTokLiveProjectRevisionSessionReviewDetail',
      },
    },
    /** 合同 */
    contract: {
      /** 客户合同 */
      customer: {
        /** 客户合同 - 列表 */
        list: 'SSTikTokLiveCustomerContract',
        /** 客户合同 - 详情 */
        detail: 'SSTikTokLiveCustomerContractDetail',
        detailTemplate: 'SSTikTokLiveCustomerContractDetailTemplate',
      },
      /** 供应商合同 */
      supplier: {
        /** 供应商合同 - 列表 */
        list: 'SSTikTokLiveSupplierContract',
        /** 供应商合同 - 详情 */
        detail: 'SSTikTokLiveSupplierContractDetail',
        detailTemplate: 'SSTikTokLiveSupplierContractDetailTemplate',
      },
      anchor: {
        detailTemplate: 'SSTikTokLiveAnchorContractDetailTemplate',
      },
    },
  },
  /** 电商业务 */
  localLife: {
    project: {
      list: 'SSLocalLifeProject',
      detail: 'SSLocalLifeProjectDetail',
    },
    roster: 'SSLocalLifeRoster',
    status: 'SSLocalLifeStatus',
    rosterTab: 'SSLocalLifeRosterTab',
    display: {
      list: 'SSLocalLifeDiaplay',
      detail: 'SSLocalLifeDiaplayDetail',
    },
    detail: {
      info: 'SSLocalLifeDetailInfo',
      display: 'SSLocalLifeDetailDiaplay',
      income: 'SSLocalLifeDetailIncome',
      cost: 'SSLocalLifeDetailCost',
      contract: 'SSLocalLifeDetailContract',
      data: 'SSLocalLifeDetailData',
      target: 'SSLocalLifeDetailTarget',
      setting: 'SSLocalLifeDetailSetting',
    },
    /** 合同 */
    contract: {
      /** 客户合同 */
      customer: {
        /** 客户合同 - 列表 */
        list: 'SSLocalLifeCustomerContract',
        /** 客户合同 - 详情 */
        detail: 'SSLocalLifeCustomerContractDetail',
        detailTemplate: 'SSLocalLifeCustomerContractDetailTemplate',
      },
      /** 供应商合同 */
      supplier: {
        /** 供应商合同 - 列表 */
        list: 'SSLocalLifeSupplierContract',
        /** 供应商合同 - 详情 */
        detail: 'SSLocalLifeSupplierContractDetail',
        detailTemplate: 'SSLocalLifeSupplierContractDetailTemplate',
      },
      anchor: {
        detailTemplate: 'SSLocalLifeAnchorContractDetailTemplate',
      },
    },
  },
  marketing: {
    /** 项目 */
    project: {
      /** 列表 */
      list: 'MarketingProjectList',
      /** 详情 */
      detail: 'MarketingProjectDetail',
    },
    /** 客户 */
    customer: {
      /** 客户列表 */
      list: 'MarketingCustomerList',
      /** 客户列表(带tab参数版本) */
      listTab: 'MarketingCustomerListWithTab',
      /** 客户列表 - 店铺详情 */
      shop: 'MarketingShopDetail',
      /** 客户列表 - 公司详情 */
      company: 'MarketingCompanyDetail',
    },
    /** 合同 */
    contract: {
      /** 客户合同 */
      customer: {
        /** 客户合同 - 列表 */
        list: 'MarketingCustomerContract',
        /** 客户合同 - 详情 */
        detail: 'MarketingCustomerContractDetail',
        detailTemplate: 'MarketingCustomerContractDetailTemplate',
      },
      /** 供应商合同 */
      supplier: {
        /** 供应商合同 - 列表 */
        list: 'MarketingSupplierContract',
        /** 供应商合同 - 详情 */
        detail: 'MarketingSupplierContractDetail',
        detailTemplate: 'MarketingSupplierContractDetailTemplate',
      },
      anchor: {
        detailTemplate: 'MarketingAnchorContractDetailTemplate',
      },
    },
    /** 业绩登记表 */
    achievement: 'MarketingAchievement',
    /** 成本安排表 */
    cost: 'MarketingCost',
    /** 返点安排表 */
    rebates: 'MarketingRebates',
    /** 需求管理 */
    demand: {
      /** 需求管理 */
      demand: 'MarketingDemand',
      /** 需求管理 - 新增需求 */
      create: 'MarketingDemandCreate',
      /** 需求管理 - 需求详情 */
      detail: 'MarketingDemandDetail',
    },
    /** 匹配主播(新增编辑需求/方案后跳转) */
    matchAnchor: 'MarketingMatchAnchor',
    /** 匹配主播 - 生成方案 */
    generateplan: 'MarketingGenerateplan',
    /** 品牌管理 */
    brand: 'MarketingBrand',
    /** 场次管理 */
    display: {
      list: 'MarketingDisplay',
      /** 场次详情 */
      detail: 'MarketingProductDetail',
    },
    /** 商品管理 */
    product: {
      /** 商品管理 - 列表 */
      list: 'MarketingProduct',
    },
    /** old 导入日志 */
    importLogOld: 'MarketingImportLogOld',
    /** 导入日志 */
    importLog: 'MarketingImportLog',
  },
  /** 供应链 */
  supplyChain: {
    /** 列表 */
    list: 'SupplyChainList',
    detail: 'SupplyChainDetail',
    details: {
      info: 'SupplyDetailInfo',
      display: 'SupplyDetailDiaplay',
      income: 'SupplyDetailIncome',
      cost: 'SupplyDetailCost',
      contract: 'SupplyDetailContract',
      data: 'SupplyDetailData',
      target: 'SupplyDetailTarget',
      setting: 'SupplyDetailSetting',
    },
    /** 合同 */
    contract: {
      /** 客户合同 */
      customer: {
        /** 客户合同 - 列表 */
        list: 'SupplyCustomerContract',
        /** 客户合同 - 详情 */
        detail: 'SupplyCustomerContractDetail',
        detailTemplate: 'SupplyCustomerContractDetailTemplate',
      },
      /** 供应商合同 */
      supplier: {
        /** 供应商合同 - 列表 */
        list: 'SupplySupplierContract',
        /** 供应商合同 - 详情 */
        detail: 'SupplySupplierContractDetail',
        detailTemplate: 'SupplySupplierContractDetailTemplate',
      },
      anchor: {
        detailTemplate: 'SupplyAnchorContractDetailTemplate',
      },
    },
  },
  commonBusiness: {
    project: {
      /** 列表 */
      list: 'CommonBusinessProjectList',
      /** 详情 */
      detail: 'CommonBusinessProjectDetail',
      detail_session: 'session',
      detail_display: 'CommonBusinessProjectDetailDisplay',
    },
    /** 合同 */
    contract: {
      /** 客户合同 */
      customer: {
        /** 客户合同 - 列表 */
        list: 'CommonBusinessCustomerContract',
        /** 客户合同 - 详情 */
        detail: 'CommonBusinessCustomerContractDetail',
        detailTemplate: 'CommonBusinessCustomerContractDetailTemplate',
      },
      /** 供应商合同 */
      supplier: {
        /** 供应商合同 - 列表 */
        list: 'CommonBusinessSupplierContract',
        /** 供应商合同 - 详情 */
        detail: 'CommonBusinessSupplierContractDetail',
        // 模板合同
        detailTemplate: 'CommonBusinessSupplierContractDetailTemplate',
      },
      anchor: {
        detailTemplate: 'CommonBusinessAnchorContractDetailTemplate',
      },
    },
  },
};

/** 招商管理 */
export const RouterInvestment = {
  merchants: 'merchants',
  settlement: 'settlement',
  collection: 'collection',
  unite: 'estimated',
  withdrawal: 'withdrawal',
};

/** 法务管理 */
export const RouterLegal = {
  main: 'legal',
  contact: 'LegalContact',
  /*合同看板*/
  LegalBulletinBoard: 'LegalBulletinBoard',
  //无合同项目
  NoLegalContractProject: 'NoLegalContractProject',
  //异常合同
  AbnormalContract: 'AbnormalContract',
  // 将到期合同
  ExpiringContract: 'ExpiringContract',
  /*合同统计*/
  constatistics: 'StatisticsContact',
  /*模板管理*/
  contempalte: 'TemContact',
  /** 合同 */
  contracts: {
    /** 客户合同 */
    customer: {
      /** 客户合同 - 详情 */
      detail: 'LiveLegalCustomerContractDetail',
      detailTemplate: 'LiveLegalCustomerContractDetailTemplate',
    },
    /** 供应商合同 */
    supplier: {
      /** 供应商合同 - 详情 */
      detail: 'LiveLegalSupplierContractDetail',
      detailTemplate: 'LiveLegalSupplierContractDetailTemplate',
    },
    anchor: {
      detailTemplate: 'LiveLegalAnchorContractDetailTemplate',
    },
    /** 合同台账 */
    contractAccount: 'LegalContractAccount',
    generalContract: 'LegalgeneralContract',
  },
  /** 合同 */
  statistics: {
    /** 客户合同 */
    customer: {
      /** 客户合同 - 详情 */
      detail: 'StatisticCustomerContractDetail',
      detailTemplate: 'StatisticCustomerContractDetailTemplate',
    },
    /** 供应商合同 */
    supplier: {
      /** 供应商合同 - 详情 */
      detail: 'StatisticSupplierContractDetail',
      detailTemplate: 'StatisticSupplierContractDetailTemplate',
    },
    anchor: {
      detailTemplate: 'StatisticAnchorContractDetailTemplate',
    },
  },
  /*用印记录*/
  sealUseRecord: 'sealUseRecord',
};

/** 固定资产 */
export const RouterFixedAssets = {
  // 资产管理
  fixedAssetsManagement: 'fixedAssetsManagement',
  // 资产使用
  fixedAssetsUse: 'fixedAssetsUse',
  // 资产管理设置
  fixedAssetsManagementSetting: 'fixedAssetsManagementSetting',
  workbench: {
    // 我的资产
    myAssets: 'myAssets',
  },
  // 资产费用
  fixedAssetsCost: 'fixedAssetsCost',
  // 费用明细
  fixedAssetsCostDetail: 'fixedAssetsCostDetail',
  // 资产盘点
  fixedAssetsInventory: 'fixedAssetsInventory',
  // 资产盘点详情
  fixedAssetsInventoryDetail: 'fixedAssetsInventoryDetail',
  // 资产统计
  fixedAssetsStatistics: 'fixedAssetsStatistics',
};
/** 数据中心 */
export const RouterDataCenter = {
  main: 'dataCenter',
  //品牌中心
  dataGeneralization: 'dataGeneralization',
  //品牌中心-项目详情
  dataItemDetail: 'dataItemDetail',
  //品牌中心-商品明细
  projectShopDetail: 'projectShopDetail',
  //品牌中心-场次详情
  performanceDetail: 'performanceDetail',
  //数据概括
  dataGeneralizationProject: 'dataGeneralizationProject',
  //淘宝店播
  dataTaobao: 'dataTaobao',
  //淘宝店播-项目数据
  dataTaobaoProject: 'dataTaobaoProject',
  //抖音店播
  dataDouyin: 'dataDouyin',
  //抖音店播-项目数据
  dataDouyinProject: 'dataDouyinProject',
  // 区域店播
  dataArea: 'dataArea',
  // 区域店播-项目数据
  dataAreaProject: 'dataAreaProject',
  // 基地业务
  dataBase: 'dataBase',
  // 创新项目
  dataMCN: 'dataMCN',
  // 创新项目-项目数据
  dataMCNProject: 'dataMCNProject',
  // 营销业务
  dataMarket: 'dataMarket',
  // 营销业务-项目数据
  dataMarketProject: 'dataMarketProject',
  // 商家系统
  shopSystem: 'shopSystem',
  dataStatistics: 'dataStatistics',
  commodityAnalysis: 'commodityAnalysis',
  commodityAnalysisDetail: 'commodityAnalysisDetail',
  commodityAnalysisCompetitive: 'commodityAnalysisCompetitive',
  // 周月销售分析
  commodityWeekMonthSalesAnalysis: 'commodityWeekMonthSalesAnalysis',
  // 品牌类目分析
  commodityBrandCategoryAnalysis: 'commodityBrandCategoryAnalysis',
  // 年度季节分析
  commodityYearSeasonAnalysis: 'commodityYearSeasonAnalysis',
  commoditySalesAnalysis: 'commoditySalesAnalysis',
  // 竟品销售分析-日期
  commoditySalesAnalysisByDate: 'commoditySalesAnalysisByDate',
  // 竟品销售分析-月度
  commoditySalesAnalysisByMonth: 'commoditySalesAnalysisByMonth',
  // 预售商品分析
  commodityAnalysisPreSale: 'commodityAnalysisPreSale',
  // 商品监控分析
  commodityAnalysisMonitor: 'commodityAnalysisMonitor',
  commodityWeekPopular: 'commodityWeekPopular',
  marketAnalysis: 'marketAnalysis', // 大盘分析
  dataCompetitor: 'dataCompetitor',
  // 商品分析-系统类目分析
  commodityAnalysisSystem: 'commodityAnalysisSystem',
  // 商品分析-年度季节分析
  commodityAnalysisTimer: 'commodityAnalysisTimer',
  // 商品分析-全网热销监控
  hotSaleMonitor: 'hotSaleMonitor',
  // 商品分析-全网热销监控详情
  hotSaleMonitorDetail: 'hotSaleMonitorDetail',
  shopLive: 'shopLive',
  // CTR数据分析
  ctrDataAnalysis: 'ctrDataAnalysis',
  // CTR数据分析明细
  ctrDataAnalysisDetail: 'ctrDataAnalysisDetail',
  // 商品培训管理
  trainingManage: 'trainingManage',
  // 商品培训管理详情
  trainingManageDetail: 'trainingManageDetail',
  // 商品搭配管理
  matchingManage: 'matchingManage',
  // 视频测款
  videoMeasurement: 'videoMeasurement',
  // 短视频测款商品页面
  videoMeasurementGoods: 'videoMeasurementGoods',
  // 视频详情
  videoMeasurementVideos: 'videoMeasurementVideos',
  // 短视频测款-模特
  videoMeasurementModel: 'videoMeasurementModel',
  // 视频测款商品详情
  commodityDetails: 'commodityDetails',
  // 商品多维度分析
  commodityMultiDimensionalAnalysis: 'commodityMultiDimensionalAnalysis',
  // 直播讲解
  commodityCollocationMonitoringLive: 'commodityCollocationMonitoringLive',
  // 搭配统计
  commodityCollocationMonitoringStatistics: 'commodityCollocationMonitoringStatistics',
  // 库存售罄监控
  commodityCollocationMonitoringInventory: 'commodityCollocationMonitoringInventory',
};
/** 商品分析 **/
export const RouterGoodAnalysis = {
  main: 'dataAnalysis',
  CompleteDetail: 'CompleteDetail', // 分析明细
  TargetCompletion: 'targetCompletion',
};

/** 销售管理 */
export const RouterNameSales = {
  main: 'Sales',
  follow: 'CustomerFollow',
  detail: 'CustomerFollowDetail',
};

/** 财务管理 */
export const RouterNameFinance = {
  main: 'Finance',
  receive: 'FinanceReceive',
  payment: 'FinancePayment',
  income: 'FinanceIncome',
  settlement: 'Settlement',
  settlement_cost: 'SettlementCost',
  receivable: 'FinanceReceivable',
  payable: 'FinancePayable',
  invoice: 'FinanceInvoice',
  invoice_manager: 'FinanceInvoiceManager',
  invoice_application: 'FinanceInvoiceApplication',
  cost_sharing: 'cost_sharing',
  cost_sharing_history: 'cost_sharing_history',
  income_detail: 'IncomeDetail',
  billing_period: 'billing_period',
};

/** 客户管理 */
export const RouterNameCustomer = {
  main: 'Customer',
  list: 'CustomerList',
  shop: 'shopList',
  listTab: 'CustomerListTab',
  shopDetail: 'CustomerShopDetail',
  company: 'CustomerCompany',
  companyAdd: 'CustomerCompanyAdd',
  companyEdit: 'CustomerCompanyEdit',
  companyDetail: 'CustomerCompanyDetail',
  boardAccount: 'CustomerBoardAccount',
};

/** 供应商管理 */
export const RouterNameSupplier = {
  main: 'Supplier',
  /** 主播管理 **/
  player: 'player',
  /** 主播管理-详情 **/
  player_detail: 'player_detail',
  /** 主播管理-审核 **/
  player_check: 'player_check',
  /** 修改 **/
  player_modify: 'player_modify',
  /** 合同详情 **/
  player_contract: 'player_contract',
  /** 添加 **/
  player_add: 'player_add',
  /** KOL管理 */
  list: 'SupplierList',
  /** KOL管理 */
  listDetail: 'SupplierListDetail',
  /** KOL审核 **/
  supplierGenerateApproval: 'supplierGenerateApproval',
  /** 供应商 - 公司详情 */
  company: 'SupplierCompanyDetail',
  /** 供应商 - 公司详情 - 方案详情 */
  companyPlan: 'SupplierCompanyPlanDetail',
  /** 公司管理 */
  manage: 'SupplierCompany',
  /** 公司管理新增 */
  companyAdd: 'SupplierCompanyAdd',
  /** 公司管理编辑 */
  companyEdit: 'SupplierCompanyEdit',
  /** 创建kol */
  generate: 'SupplierGenerate',
  /** 编辑kol */
  generateEdit: 'generateEdit',
  /** 模特管理 **/
  player_trialModel: 'player_trialModel',
};

/** 公共管理 */
export const RouterNamePublic = {
  main: 'Public',
  user: 'PublicUser',
  role: 'PublicBuiltInRole',
  bank: 'PublicBank',
};

/** 系统设置 */
export const RouterNameSystem = {
  main: 'System',
  user: {
    list: 'SystemUser',
    listWithTab: 'SystemUserWithTab',
  },
  role: 'SystemBuiltInRole',
  news: 'SystemNews',
  // 费用类别
  spendingCategory: 'spendingCategory',
};

// 财务报表
export const RouterNameFinancialStatements = {
  main: 'FinancialStatements',
  managementDashboard: 'managementDashboard', // 经营看板
  profixLossStatement: 'profixLossStatement', // 损益表
  incomeAndExpenditure: 'IncomeAndExpenditure', // 收支明细
  prepaid: 'Prepaid', // 预收预付
  dailyExpenseReport: 'DailyExpenseReport', // 日支出报表
  fundStatement: 'FundStatement', //资金报表
};
// 绩效管理
export const RouterNamePerformance = {
  // 指标库
  indicatorLibrary: {
    // 列表页
    list: 'RouterNamePerformance.indicatorLibrary.list',
    create: 'RouterNamePerformance.indicatorLibrary.create',
  },
  // 考核
  assessment: {
    list: 'RouterNamePerformance.assessment.list',
    // 创建
    create: {
      base: 'RouterNamePerformance.assessment.create.base',
      indicators: 'RouterNamePerformance.assessment.create.indicators',
      process: 'RouterNamePerformance.assessment.create.process',
    },
    preview: 'RouterNamePerformance.assessment.create.preview',
    // 考核管理
    manage: {
      list: 'RouterNamePerformance.assessment.manage.list',
      detailList: 'RouterNamePerformance.assessment.manage.detailList',
      detailDetail: 'RouterNamePerformance.assessment.manage.detailDetail',
    },
  },
  // 我的绩效
  my: {
    own: {
      list: 'RouterNamePerformance.my.own.list',
      detail: 'RouterNamePerformance.my.own.detail',
    },
    related: {
      list: 'RouterNamePerformance.my.related.list',
      detail: 'RouterNamePerformance.my.related.detail',
    },
    underling: {
      list: 'RouterNamePerformance.my.underling.list',
      detail: 'RouterNamePerformance.my.underling.detail',
    },
  },
  // 绩效报表
  report: {
    record: 'RouterNamePerformance.report.record',
    detail: 'RouterNamePerformance.report.detail',
    detailDetail: 'RouterNamePerformance.report.detailDetail',
    result_analysis: 'RouterNamePerformance.report.result_analysis',
    result_analysis_detail: 'RouterNamePerformance.report.result_analysis_detail',
  },
  //实施流程监控
  processMonitoring: 'RouterNamePerformance.processMonitoring',
  // 述职管理
  debriefing: {
    // 述职管理
    manage: 'RouterNamePerformance.debriefing.manage',
    // 述职清单
    list: 'RouterNamePerformance.debriefing.list',
    // 我的述职
    mine: 'RouterNamePerformance.debriefing.mine',
    // 下级述职
    underling: 'RouterNamePerformance.debriefing.underling',
  },
};

// 形象设计
export const RouterNameDesign = {
  workbench: {
    // 工作台列表
    list: 'RouterNameDesign.workbench.list',
    // 视觉设计
    design_order_list: 'RouterNameDesign.workbench.design_order_list',
    design_order_detail: 'RouterNameDesign.workbench.design_order_detail',
    design_order_orderStatistics: 'RouterNameDesign.workbench.design_order_orderStatistics',
    // 设计统计
    statistics: 'RouterNameDesign.workbench.statistics',
  },
  image: {
    detail: 'RouterNameDesign.image.detail',
    // 统计明细
    statistics: 'RouterNameDesign.image.statistics',
  },
  design_order_list: 'RouterNameDesign.design_order_list',
  // 设计统计
  design_order_statistics: 'RouterNameDesign.design_order_statistics',
  // 设计统计明细
  design_order_statistics_detail: 'RouterNameDesign.design_order_statistics_detail',
  //设计统计明细个人
  design_order_statistics_detail_personal:
    'RouterNameDesign.design_order_statistics_detail_personal',
  design_order_detail: 'RouterNameDesign.design_order_detail',
  // 设计设置
  design_order_setting: 'RouterNameDesign.design_order_setting',
  // 主播招募
  anchorrecruitment: 'RouterNameDesign.anchorrecruitment',
  ctr: {
    // 直播画面监控
    liveScreenMonitoring: 'RouterNameDesign.ctr.liveScreenMonitoring',
  },
};
// M币管理系统
export const RouterNameMB = {
  manage: 'RouterNameMB.manage',
  mall: {
    default: 'RouterNameMB.default',
    manage: 'RouterNameMB.mall.manage',
    detail: 'RouterNameMB.mall.detail',
    giftDetails: 'RouterNameMB.mall.giftDetails',
  },
  workbench: {
    mall: 'RouterNameMB.workbench.mall',
    my: 'RouterNameMB.workbench.my',
  },
};
// 行业资讯
export const RouterNameStrategicInformation = {
  container: 'StrategicInformation',
  // 竞对数据
  competitionData: 'StrategicInformation.competitionData',
  //竞对设置
  competitionSettings: 'StrategicInformation.competitionSettings',
  // 每日资讯
  dailyInformation: 'StrategicInformation.dailyInformation',
};
export const RouterNameExternal = {
  dailyInformation: {
    default: 'RouterNameExternal.dailyInformation.default',
    detail: 'RouterNameExternal.dailyInformation.detail',
  },
};

/** 经营管理 */
export const RouterManagement = {
  main: 'Management',
  targetManagement: 'targetManagement',
  projectManagement: 'projectManagement',
  departmentManagement: 'departmentManagement',
  projectDashboard: 'projectDashboard',
  projectManagementDashboard: 'projectManagementDashboard',
  companyDashboard: 'companyDashboard',
  departmentDashboard: 'departmentDashboard',
};
