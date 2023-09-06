/**
 数据中心
 **/
import { Delete, Get, Post } from '@/utils/request';
import { Message } from 'element-ui';
import { ListResponse, HttpResponse } from '@/types/base/http';
import { ObjectFilterEmpty } from '@/utils/func';
import { LiveProject, LiveProjectQueryParams } from '@/types/tiange/live.project';
import { MarketingProject, MarketingProjectQueryParams } from '@/types/tiange/marketing/project';
import {
  CommonBusinessProject,
  CommonBusinessProjectQueryParams,
} from '@/types/tiange/commonBusiness/project';
import {
  DataCenterTableParams,
  DataCenterChartParams,
  IHotProjectSearchParams,
  IHotCommodityParams,
  IMonitorConfig,
  CtrListModel,
  CtrQueryParams,
  CTRProject,
  ShiftInfo,
  ShiftGroupCtrShopLive,
  ShopLiveStatisticalTrendsParam,
  ShopLiveStatisticalTrendsModel,
  DouyinCompetitiveItems,
  DouyinCompetitiveTop10Item,
  VideoRecordItem,
  VideoItemDetail,
  VideoRecordGoodsItem,
  VideoAccount,
  UpdateFollowUpRecordParams,
  ItemColorClassifyModel,
} from '@/types/tiange/datacenter';
import {
  ItemReportParams,
  chartParams,
  ITabProps,
  TimeLine,
  CompetitiveParams,
  CompetitiveAnalysisDetail,
  IWeekPopularParams,
} from '@/modules/datacenter/commodityAnalysis/types';
import {
  competitorCategoryParams,
  dateAndCateDouyinCompetitiveParams,
} from '@/modules/datacenter/competitor/types';
import { douyinCategory } from '@/modules/datacenter/marketAnalysis/types';
import qs from 'query-string';
import { getToken } from '@/utils/token';
import {
  QUERY_CTR_PROJECTS,
  QUERY_PROJECT_SHIFTS,
  QUERY_CTR_SHOP_LIVE,
  QUERY_SHIFT_GROUP_CTR_SHOP_LIVE,
  SAVE_SHOP_LIVE_SCREENSHOT,
  QUERY_SHOP_LIVE_STATISTICAL_TRENDS,
  PROJECT_TRADE_FUNNEL,
  PROJECT_FLOW_SUNBURST,
  DEPARTMENT_PROJECT_STATISTICS_DETAIL,
  QUERY_PROJECT_TOP_PRODUCTS,
  QUERY_DEPARTMENT_PROJECT_STATISTICS,
  GET_LAST_UPDATE_TIME,
} from '@/apis/datacenter';
import { IGPageQuery } from '@/types/tiange/general';
import { ComputedRef } from '@vue/composition-api';
import axios, { Canceler } from 'axios';

const catchError = (res: any) => {
  if (res.data.success !== true) throw new Error(res.data.message);
  return res.data.data;
};

const toastError = (ex: Error) => {
  Message.error(ex.message || '请求错误');
  throw ex;
};

/** iframe链接 **/
export const GetDatacenterIframelink = async (params: { [key: string]: any }) =>
  Get(`/api/data_center/iframe_link`, { params }).then(catchError).catch(toastError);

/** 通用业务 项目列表 */
export const GetCommonProjectList = async (
  payload: CommonBusinessProjectQueryParams,
): Promise<ListResponse<CommonBusinessProject>> =>
  Get(`/api/data_center/query_common_project`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/** 通用业务 抖音项目列表 */
export const GetCommonDouyinProjectList = async (payload: {
  begin_time: string;
  end_time: string;
  department_id?: number | string;
}): Promise<ListResponse<CommonBusinessProject>> =>
  Get(`/api/shop_live/query_project_douyin_by_date`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/** 店铺代播 项目列表 */
export const GetLiveProjectList = async (
  payload: LiveProjectQueryParams,
): Promise<ListResponse<LiveProject>> =>
  Get(`/api/data_center/query_shop_live_project`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 营销业务 项目列表 */
export const GetMarketingProjectList = async (
  payload: MarketingProjectQueryParams,
): Promise<ListResponse<MarketingProject>> =>
  Get(`/api/data_center/query_cooperation`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 数据中心表格接口
export const GetDataCenterTable = async (
  payload: DataCenterTableParams,
): Promise<HttpResponse<any>> =>
  Get('/api/data_center/table', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 数据中心图表接口
export const GetDataCenterChart = async (
  payload: DataCenterChartParams,
): Promise<HttpResponse<[]>> =>
  Get('/api/data_center/chart', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 客户&供应商信息管理情况统计
export const GetCustomerSupplierManageTable = async (): Promise<HttpResponse<[]>> =>
  Get('/api/data_center/customer_supplier_manage_table');

// 开票审批情况统计
export const GetInvoiceApplyTable = async (): Promise<HttpResponse<[]>> =>
  Get('/api/data_center/invoice_apply_table');

// 付款审批情况统计
export const GetCustomerPayApplyTable = async (): Promise<HttpResponse<[]>> =>
  Get('/api/data_center/customer_pay_apply_table');

// 合同审批情况统计
export const GetContractApplyTable = async (): Promise<HttpResponse<[]>> =>
  Get('/api/data_center/contract_apply_table');

// 系统登录情况统计
export const GetSystemLoginTable = async (): Promise<HttpResponse<[]>> =>
  Get('/api/data_center/system_login_table');

// 结算单统计
export const GetSettlementTable = async (): Promise<HttpResponse<[]>> =>
  Get('/api/data_center/settlement_table');

// 项目执行情况统计
export const GetProjectTable = async (): Promise<HttpResponse<[]>> =>
  Get('/api/data_center/project_table');

// 自营店播执行情况统计
export const GetShopLiveTable = async (): Promise<HttpResponse<[]>> =>
  Get('/api/data_center/shop_live_table');

// 商品分析：抖音类目销量报告饼图
export const GetDouyinCategoryPieChart = async (payload: chartParams): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/douyin_category_pie_chart', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
// 商品分析：抖音类目销量报告饼图
export const GetDouyinOldCategoryPieChart = async (
  payload: chartParams,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/douyin_old_category_pie_chart', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 商品分析：抖音商品价格分布饼图
export const GetDouyinItemPieChart = async (payload: chartParams): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/douyin_item_pie_chart', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 商品分析：品牌销售分析-销售数据
export const GetQueryProjectSalesAnalysis = async (payload: {
  project_id: number;
}): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/query_project_sales_analysis', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 商品分析：抖音数据报告可选项目
export const GetQueryDouyinReportProjects = async (payload?: {
  project_name?: string;
  exclude_project_status?: number[];
}): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/query_douyin_report_projects', {
    params: {
      ...ObjectFilterEmpty({
        project_name: payload?.project_name,
        exclude_project_status: payload?.exclude_project_status?.join(','),
      }),
    },
  });

// 商品分析：抖音项目商品销售列表
export const GetDouyinItemReport = async (
  payload: ItemReportParams,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (payload.is_from_project) {
    //是否是从场次跳转
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    if (payload.room_id && payload.room_id !== '') {
      return Get('/api/shop_live/project_data/douyin_item_report_by_room' + url, {
        params: {
          ...ObjectFilterEmpty(payload),
        },
      });
    }
    return Get('/api/shop_live/project_data/douyin_item_report' + url, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  //是否是从场次跳转
  if (payload.room_id && payload.room_id !== '') {
    return Get('/api/shop_live/operating/douyin_item_report_by_room', {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/douyin_item_report', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 商品分析：抖音项目类目销售列表
export const GetDouyinCategoryReport = async (
  payload: ItemReportParams,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/douyin_category_report', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 商品分析：抖音类目7天销量趋势图
export const GetDouyinCategoryTimeline = async (payload: {
  cat_id: string;
  project_id: string;
}): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/douyin_category_timeline', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 商品分析：抖音商品7天销售量趋势图
export const GetDouyinItemTimeline = async (payload: {
  item_id: string;
  project_id: string;
}): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/douyin_item_timeline', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 商品分析：抖音爆款商品销售占比
export const GetDouyinHotItemReport = async (payload: chartParams): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/douyin_hot_item_report', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
// 商品分析：抖音爆款商品销售占比
export const GetCheckDouyinAccess = async (payload: chartParams): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/check_project_douyin_access', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
// 竞品分析：类目表
export const GetDouyinCompetitiveCategory = async (
  payload: competitorCategoryParams,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/query_douyin_competitive_item_categories', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 竞品分析：竞品账号
export const GetCompetitiveShops = async (payload?: {
  project_id: number | string | undefined;
  has_self: boolean;
  local: number;
}): Promise<HttpResponse<any>> => {
  if (payload && payload.project_id) {
    return Get('/api/shop_live/query_douyin_competitive_shops_by_project', {
      params: {
        ...ObjectFilterEmpty(payload || {}),
      },
    });
  }
  return Get('/api/shop_live/query_douyin_competitive_shops');
};

// 竞品分析：TOP分布对比分析
export const GetCompetitiveTopShops = async (
  payload: competitorCategoryParams,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/query_douyin_competitive_top', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 竞品分析：品类销售对比分析
export const GetCompetitiveAnalysisShops = async (
  payload: CompetitiveAnalysisDetail,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/query_douyin_competitive_analysis', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 竞品分析：商品按日期
export const GetDateCompetitiveItem = async (
  payload: dateAndCateDouyinCompetitiveParams,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/query_douyin_competitive_items', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
// 竞品分析：商品按日期
export const GetCategoryCompetitiveItem = async (
  payload: dateAndCateDouyinCompetitiveParams,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/query_douyin_competitive_items_total', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

export const PostCompetitiveShops = (payload: any[]): Promise<HttpResponse<any>> =>
  Post('/api/shop_live/update_douyin_competitive_shops', {
    ...ObjectFilterEmpty({ shop_names: payload }),
  });
// 竞品分析：售量趋势图
export const GetCompetitiveTimeline = async (payload: {
  shop_name: string;
  item_id: string;
}): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/query_douyin_competitive_item_timeline', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
// 大盘商品分析：类目表
export const GetDouyinCompositeCategories = async (): Promise<HttpResponse<any>> =>
  Get('/api/data_center/douyin_composite_categories');
// 大盘商品分析：抖音大盘基础列表
export const GetDouyinCategoryImage = async (payload: douyinCategory): Promise<HttpResponse<any>> =>
  Get('/api/data_center/douyin_category_image', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
// 大盘商品分析：抖音大盘基础图标
export const GetDouyinCategoryImageDetail = async (
  payload: douyinCategory,
): Promise<HttpResponse<any>> =>
  Get('/api/data_center/douyin_category_image_detail', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 商品分析：年度季度分析-查询规则
export const GetCommodityYearSeasonRule = async (payload: {
  project_id: number;
}): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/query_year_season_analyze_settings', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 商品分析：年度季度分析-按年度设置
export const SaveCommodityYearSeasonRule = (payload: any[]): Promise<HttpResponse<any>> =>
  Post('/api/shop_live/save_year_season_analyze_settings', {
    ...ObjectFilterEmpty(payload),
  });

// 商品分析：款别设置
export const SaveCommoditySettingRule = (payload: any[], type = 0): Promise<HttpResponse<any>> => {
  if (type === 2) {
    return Post('/api/shop_live/save_real_sn_analyze_settings', {
      ...ObjectFilterEmpty(payload),
    });
  } else if (type === 3) {
    return Post('/api/shop_live/save_section_analyze_settings', {
      ...ObjectFilterEmpty(payload),
    });
  } else if (type === 4) {
    return Post('/api/shop_live/save_competitive_sn_analyze_settings', {
      ...ObjectFilterEmpty(payload),
    });
  }
  return Post('/api/shop_live/save_section_analyze_settings', {
    ...ObjectFilterEmpty(payload),
  });
};
// 商品分析：款别等
export const GetCommoditySettingRule = async (
  payload: {
    project_id: number;
  },
  type = 0,
): Promise<HttpResponse<any>> => {
  if (type === 2) {
    return Get('/api/shop_live/query_real_sn_analyze_settings', {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  } else if (type === 3) {
    return Get('/api/shop_live/query_section_analyze_settings', {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  } else if (type === 4) {
    return Get('/api/shop_live/query_competitive_sn_analyze_settings', {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/query_year_season_analyze_settings', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 商品分析-监控：指标配置
export const GetCommoditySettingConfig = async (payload: {
  project_id: number;
}): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/query_user_shop_live_field_config', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 商品分析-监控：指标配置-保存
export const SaveCommoditySettingConfig = (payload: any[]): Promise<HttpResponse<any>> =>
  Post('/api/shop_live/update_user_shop_live_field_config', {
    ...ObjectFilterEmpty(payload),
  });

// 商品分析监控-列表
export const GetCommodityMonitorAnalysis = async (payload: any): Promise<HttpResponse<any>> => {
  return Get('/api/shop_live/get_sku_analysis', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 商品分析监控-更新
export const UpDataCommodityMonitorAnalysis = (payload: any): Promise<HttpResponse<any>> =>
  Post('/api/shop_live/update_sku_analysis', {
    ...ObjectFilterEmpty(payload),
  });

/** 商品分析监控-上传指标 */
export const ExportMonitorAnalysisFile = async (payload: string): Promise<HttpResponse<void>> =>
  Post(
    '/api/shop_live/import_sku_analysis',
    ObjectFilterEmpty({
      file: payload,
    }),
  );

// 自定义类目分析导出
export const ExportMonitorAnalysisReport = (payload: Record<string, any>) =>
  Get('/api/shop_live/export_sku_analysis', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

/** 商品监控 - 类目列表 */
export const GetQueryAnalysisCategory = async (payload: {
  project_id: number | string | undefined;
}): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/analysis/query_douyin_tiange_category', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 商品分析：年度季度分析-按年度
export const GetCommodityYearList = async (payload: ITabProps): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/douyin_year_season_report', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 商品分析：年度季度分析-按季节
export const GetCommoditySeasonList = async (payload: ITabProps): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/douyin_season_year_report', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 商品分析：系统类目分析-一级类目
export const GetSystemFirstCategory = async (payload: ITabProps): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/query_douyin_tiange_category', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 商品分析：系统类目分析-一级类目下的数据
export const GetSystemCategoryReport = async (
  payload: any,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (payload.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/douyin_tiange_category_report' + url, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/douyin_tiange_category_report', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 商品分析：查询商品分析详情-年度季度下拉框
export const GetShopLiveListDouyinSeason = async (payload: ITabProps): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/list_douyin_season', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
// 商品分析：查询商品分析详情-季度年度下拉框
export const GetShopLiveListDouyinSeasonYear = async (
  payload: ITabProps,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/list_douyin_season_year', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 商品分析：查询商品分析详情-类目下拉框
export const GetShopLiveQueryDouyinTiangeCategory = async (
  payload: any,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (payload.room_id && payload.room_id !== '') {
    if (payload.is_from_project) {
      const url =
        business_type === E.project.BusinessType.supplyChain
          ? '/supply_chain'
          : business_type === E.project.BusinessType.locallife
          ? '/local_life'
          : '';
      return Get('/api/shop_live/project_data/query_douyin_tiange_category_by_room' + url, {
        params: {
          ...ObjectFilterEmpty(payload),
        },
      });
    }
    return Get('/api/shop_live/operating/query_douyin_tiange_category_by_room', {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/query_douyin_tiange_category', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 商品分析：系统类目分析- 销售分析line
export const GetSystemTimeLine = async (payload: TimeLine): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/douyin_contrast_category_timeline', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 商品分析：获取目标设置
export const GetShopLiveQuerySeasonRules = async (): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/query_season_rules');

// 商品分析：修改目标设置
export const UpdateDouyinCompetitiveShops = (payload: any[]): Promise<HttpResponse<any>> =>
  Post('/api/shop_live/edit_season_rules', {
    ...ObjectFilterEmpty({ rules_infos: payload }),
  });

export const GetCompetitiveAnalysis = async (
  payload: CompetitiveParams,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/query_douyin_competitive_analysis', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

export const GetCompetitiveAnalysisDetail = async (
  payload: CompetitiveAnalysisDetail,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/query_douyin_competitive_analysis_detail', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 全网热销监控项目列表
export const GetHotProjectList = async (
  payload: IHotProjectSearchParams,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/query_feigua_hot_item_project', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 全网热销商品列表
export const GetHotCommodityList = async (
  payload: IHotCommodityParams,
): Promise<HttpResponse<any>> =>
  Get('/api/data_center/hot_item', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 飞瓜监控账号管理列表
export const GetMonitorConfig = async (payload: {
  project_id: string | number;
}): Promise<HttpResponse<any>> =>
  Get('/api/data_center/feigua_monitor_config', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 飞瓜监控账号管理保存与更新
export const UpdateMonitorConfig = (payload: IMonitorConfig): Promise<HttpResponse<any>> =>
  Post('/api/data_center/feigua_monitor_config', {
    ...ObjectFilterEmpty(payload),
  });

// 每周爆款对比
export const HotStyleEveryWeek = async (
  payload: IWeekPopularParams,
  isMonth = false,
): Promise<HttpResponse<any>> => {
  if (isMonth) {
    return Get('/api/data_center/hot_style_every_month', {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/data_center/hot_style_every_week', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 每周爆款对比
export const GetTiangeDouyinThirdCategory = async (): Promise<HttpResponse<any>> =>
  Get('/api/data_center/tiange_douyin_category', {
    params: {
      ...ObjectFilterEmpty({ level: 3 }),
    },
  });

// 自定义类目分析导出
export const ExportDouyinCategoryReport = (params: Record<string, any>) => {
  const props = ObjectFilterEmpty(params);
  const _paramsstr = qs.stringify(props);
  const token = getToken();
  window.open(
    `${process.env.VUE_APP_BASE_API}/api/shop_live/export_douyin_tiange_category_report?${_paramsstr}&Authorization=${token}`,
  );
};

// 商品明细导出
export const ExportCommodityAnalysisDetail = (params: Record<string, any>) => {
  if (params.room_id && params.room_id !== '') {
    const token = getToken();
    if (params.is_from_project) {
      params.is_from_project = undefined;
      const props = ObjectFilterEmpty(params);
      const _paramsstr = qs.stringify(props);
      window.open(
        `${process.env.VUE_APP_BASE_API}/api/shop_live/project_data/export_douyin_item_report_by_room?${_paramsstr}&Authorization=${token}`,
      );
    } else {
      params.is_from_project = undefined;
      const props = ObjectFilterEmpty(params);
      const _paramsstr = qs.stringify(props);
      window.open(
        `${process.env.VUE_APP_BASE_API}/api/shop_live/operating/export_douyin_item_report_by_room?${_paramsstr}&Authorization=${token}`,
      );
    }
  } else {
    params.is_from_project = undefined;
    params.room_id = undefined;
    const props = ObjectFilterEmpty(params);
    const _paramsstr = qs.stringify(props);
    const token = getToken();
    window.open(
      `${process.env.VUE_APP_BASE_API}/api/shop_live/export_douyin_item_report?${_paramsstr}&Authorization=${token}`,
    );
  }
};

// 根据项目查询班次
export const ExportCommodityAnalysisDetailV2 = (params: Record<string, any>) => {
  params.is_from_project = undefined;
  params.room_id = undefined;
  const props = ObjectFilterEmpty(params);
  const _paramsstr = qs.stringify(props);
  return Get(`/api/shop_live/export_douyin_item_report?${_paramsstr}`);
};

// 竞品销售分析导出商品数据
export const ExportProductData = (url: string, params: Record<string, any>) => {
  params.is_from_project = undefined;
  params.room_id = undefined;
  const props = ObjectFilterEmpty(params);
  const _paramsstr = qs.stringify(props);
  return Get(`${url}?${_paramsstr}`);
};

// 根据项目查询班次
export const QueryProjectShifts = async (): Promise<HttpResponse<ShiftInfo[]>> =>
  Get(QUERY_PROJECT_SHIFTS);

// CTR-单项目明细-列表
export const QueryCtrShopLive = async (
  payload: CtrQueryParams,
): Promise<ListResponse<CtrListModel>> =>
  Get(QUERY_CTR_SHOP_LIVE, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

//上传班次信息
export const PostShiftInfo = (payload: any): Promise<HttpResponse<any>> =>
  Post('/api/shop_live/save_shift', {
    ...ObjectFilterEmpty(payload),
  });

//新增/修改 标记变更
export const PostChangesTips = (payload: any): Promise<HttpResponse<any>> =>
  Post('/api/shop_live/save_shop_live_change_tips', {
    ...payload,
  });

// 查询CTR项目
export const QueryCTRProjects = (payload?: {
  project_name: string | undefined;
}): Promise<HttpResponse<CTRProject[]>> =>
  Get(QUERY_CTR_PROJECTS, {
    // Get('http://127.0.0.1:4523/mock/496243/api/shop_live/query_ctr_projects', {
    params: {
      ...ObjectFilterEmpty(payload ?? {}),
    },
  });
// CTR-单项目明细-图表
// http://127.0.0.1:4523/mock/496243/api/shop_live/query_shift_group_ctr_shop_live
export const QueryShiftGroupCtrShopLive = (
  payload: CtrQueryParams,
): Promise<HttpResponse<ShiftGroupCtrShopLive[]>> =>
  Get(QUERY_SHIFT_GROUP_CTR_SHOP_LIVE, {
    // Get('http://127.0.0.1:4523/mock/496243/api/shop_live/query_shift_group_ctr_shop_live', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// CTR-上传新图
export const SaveShopLiveScreenshot = (
  id: number | undefined,
  live_screenshot: string,
): Promise<HttpResponse<undefined>> =>
  Post(SAVE_SHOP_LIVE_SCREENSHOT, {
    ...ObjectFilterEmpty({ id, live_screenshot }),
  });
const CancelToken = axios.CancelToken;
// CTR场次趋势总览接口
export const QueryShopLiveStatisticalTrends = (
  payload: ShopLiveStatisticalTrendsParam,
  cancelHandler?: (cancelToken: Canceler) => void,
): Promise<HttpResponse<ShopLiveStatisticalTrendsModel[]>> =>
  Get(QUERY_SHOP_LIVE_STATISTICAL_TRENDS, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
    cancelToken: new CancelToken(function executor(c) {
      cancelHandler?.(c);
    }),
  });

// 根据类目查询抖音竞品店铺商品销量
export const ShopLiveQueryDouyinCategoryCompetitiveItemsTotal = async (
  params: any,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/query_douyin_category_competitive_items_total', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });
// 每周爆款对比
export const ShopLiveGetDpShopOrdersPresell = async (
  pager: IGPageQuery,
  payload: { project_id: string; start_date: string; end_date: string; pre_sale_type: string },
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/get_dp_shop_orders_presell_stat_day', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });

// 品牌中心项目成交漏斗图
export const QueryProjectTradeFunnel = async (payload: {
  project_id: string;
  start_date?: string;
  end_date?: string;
  shop_live_id?: string;
  merge_shop_live_id?: string;
}): Promise<HttpResponse<any>> =>
  Get(PROJECT_TRADE_FUNNEL, {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

// 品牌中心项目流量构成旭日图
export const QueryProjectFlowBurst = async (payload: {
  project_id: string;
  start_date: string;
  end_date: string;
}): Promise<HttpResponse<any>> =>
  Get(PROJECT_FLOW_SUNBURST, {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

// 品牌中心项目部门项目明细
export const QueryDepartmentStatisticsDetail = async (payload: {
  third_department_id: string | number | undefined;
  start_date: string;
  end_date: string;
  business_type: number | undefined;
}): Promise<HttpResponse<any>> =>
  Get(DEPARTMENT_PROJECT_STATISTICS_DETAIL, {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

// 品牌中心项目流量构成旭日图
export const QueryProjectTopProducts = async (payload: {
  project_id: string | number | undefined;
  start_date: string;
  end_date: string;
  page_num: number;
  num: number;
}): Promise<HttpResponse<any>> =>
  Get(QUERY_PROJECT_TOP_PRODUCTS, {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

// 品牌中心项目组的项目数据概览
export const QueryDepartmentProjectStatistics = async (payload: {
  third_department_id: string | number | undefined;
  start_date: string;
  end_date: string;
  business_type: number | undefined;
}): Promise<HttpResponse<any>> =>
  Get(QUERY_DEPARTMENT_PROJECT_STATISTICS, {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

// 品牌中心项目组的项目数据概览
export const GetLastUpdateTime = async (): Promise<HttpResponse<any>> => Get(GET_LAST_UPDATE_TIME);

// 品牌中心项目项目每日明细
export const QueryProjectStatisticsDetail = async (payload: {
  project_id?: string | number | undefined;
  third_department_id?: string | number | undefined;
  start_date: string;
  end_date: string;
}): Promise<HttpResponse<any>> =>
  Get(DEPARTMENT_PROJECT_STATISTICS_DETAIL, {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

/** --------------------------  商品培训模块 ----------------------**/
export interface ITrainGoods {
  id: number;
  topic: string;
  train_addr: string;
  train_courseware: string[];
  train_end_time: string;
  train_start_time: string;
  // 培训人
  trainer_id: number;
}
export interface ITrainGoodsComplete extends ITrainGoods {
  trainer_name: string[];
  sponsor_id: number;
  sponsor_name: string;
  sign_in_info: { id: number; username: string }[];
  sign_out_info: { id: number; username: string }[];
  train_date: string;
  train_duration: number;
  trainer_info: { id: number; username: string }[];
  evaluation_info: {
    department: string;
    evaluation_info: string;
    goods_train_id: number;
    train_score: number;
    user_name: string;
    train_grade: string;
    train_grade_desc: string;
    gmt_create: string;
  }[];
}

export interface IGoodsCollocation {
  topic: string;
  sponsor_id: number;
  sponsor_name: string;
  quantity: number;
  project_name: string;
  project_id: number;
  id: number;
  attachments: string[];
  gmt_create: string;
}

// 商品培训列表查询
export const Query_Goods_Train = async (
  pager: IGPageQuery,
  payload: {
    sponsor_id: number;
    trainer_id: number;
    train_addr: string;
    train_start_date: string;
    train_end_date: string;
  },
): Promise<ListResponse<ITrainGoodsComplete>> =>
  Get('/api/goods_train/query_goods_train', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });

export const Save_Goods_Train = async (payload: ITrainGoods) =>
  Post('/api/goods_train/save_goods_train', ObjectFilterEmpty(payload));

/** 删除培训商品 */
export const Delete_Goods_Train = async (payload: number): Promise<HttpResponse<any>> =>
  Post('/api/goods_train/delete_goods_train', {
    ids: [payload],
  });

/** 查询培训商品详情 */
export const Get_Goods_Train = async (id: number): Promise<HttpResponse<ITrainGoodsComplete>> =>
  Get('/api/goods_train/get_goods_train', {
    params: { id },
  });

/** 查询商品搭配列表 */
export const Query_Goods_Collocation = async (
  pager: IGPageQuery,
  payload: {
    sponsor_id: number;
    project_id: number;
    create_start_date: string;
    create_end_date: string;
  },
): Promise<ListResponse<IGoodsCollocation>> =>
  Get('/api/goods_train/goods_collocation', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });

/** 新增/编辑商品搭配 */
export const Save_Goods_Collocation = async (payload: {
  // sponsor_id: number;
  project_id: number | undefined;
  attachments: string[] | undefined;
  id?: number;
  quantity: string | undefined;
  topic: string | undefined;
  type: number;
  collocation_detail_list: any[];
  collocation_detail_file: any[];
}): Promise<HttpResponse<undefined>> =>
  Post('/api/goods_train/goods_collocation', {
    ...ObjectFilterEmpty({
      ...payload,
    }),
  });

/** 删除商品搭配 */
export const Delete_Goods_Collocation = async (payload: {
  // sponsor_id: number;
  id: number;
}): Promise<HttpResponse<undefined>> =>
  Delete(`/api/goods_train/goods_collocation?id=${payload.id}`);

//周月销售分析-目标达成进度
export const GetWeekMonthTargetCompleteAchievement = async (
  payload: { project_id: number; start_date: string; end_date: string },
  isMonth = false,
): Promise<HttpResponse<any>> => {
  if (isMonth) {
    return Get('/api/shop_live/query_project_achievement_by_month', {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/query_project_achievement_by_week', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 周月销售分析-top占比及库存
export const GetWeekMonthTopStock = async (payload: {
  project_id?: string | number | undefined;
  first_cat_id?: string | number | undefined;
  start_date: string;
  end_date: string;
  sort_by: number;
}): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/query_project_top_and_stock', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

// 周月销售分析-品类退货分析
export const GetWeekMonthRefundCategory = async (payload: {
  project_id?: string | number | undefined;
  first_cat_id?: string | number | undefined;
  start_date: string;
  end_date: string;
}): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/query_project_refund_by_category', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

// 周月销售分析-价格带分析
export const GetWeekMonthPriceList = async (payload: {
  project_id?: string | number | undefined;
  start_date: string;
  end_date: string;
}): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/query_project_price_pie_chart', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

// 每周爆款对比
export const GetWeekMonthHotStyleEveryWeek = async (payload: {
  project_id: string | undefined | ComputedRef<string | undefined> | (string | null)[];
  sort_by: string;
  start_date: string | ComputedRef<string | undefined> | undefined;
  end_date?: string | ComputedRef<string | undefined> | undefined;
}): Promise<HttpResponse<any>> => {
  return Get('/api/shop_live/hot_style_in_region', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 周月销售分析-新品动销分析
export const GetWeekMonthNewShopList = async (payload: {
  project_id?: string | number | undefined;
  start_date: string;
  end_date: string;
}): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/new_sku_sales_ratio', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

// 周月销售分析-导出
export const PostWeekMonthExportExcel = async (payload: {
  project_id?: string | number | undefined;
  start_date: string;
  end_date: string;
}): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/create_export_brand_analysis_excel_task', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

// 竞品销售分析-导出
export const PostCompetitiveExportExcel = async (payload: {
  project_id?: string | number | undefined;
  start_date: string;
  end_date: string;
  shop_names: string | undefined;
  self_shop_names: string;
  sort_for_top: string;
  category_id?: number | string | undefined;
  sort_for_category: string;
  first_tiange_category_id: number | undefined;
  select_field?: string | undefined;
}): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/create_export_competitive_analysis_excel_task', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

// 查询抖音竞品月度销售环比情况
export const Douyin_Competitive_Items_By_Month = async (payload: {
  shop_name?: string;
  start_date?: string;
  end_date?: string;
}): Promise<HttpResponse<DouyinCompetitiveItems[]>> =>
  Get('/api/shop_live/douyin_competitive_items_by_month', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

// 查询抖音竞品各类目销售TOP榜
export const Douyin_Competitive_Items_Month_Top10 = async (payload: {
  shop_name?: string;
  start_date?: string;
  end_date?: string;
  // sale  gmv
  sort?: 'sale' | 'gmv';
  third_tiange_cat_id?: number;
}): Promise<HttpResponse<DouyinCompetitiveTop10Item[]>> =>
  Get('/api/shop_live/douyin_competitive_items_month_top10', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

// 导出抖音竞品各类目月度分析
export const Export_Douyin_Competitive_Items_By_Month = async (payload: {
  top10_months: number;
  shop_name?: string;
  start_date?: string;
  end_date?: string;
  sort?: 'sale' | 'gmv';
  third_tiange_cat_id?: number;
}): Promise<HttpResponse<undefined>> =>
  Get('/api/shop_live/export_douyin_competitive_items_by_month', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });
/** 查询短视频列表 */
export const Query_Video_Record = async (
  pager: IGPageQuery,
  payload: {
    order_by?: E.datacenter.VideoSortType | E.datacenter.ModelVideoOrderType;
    sort_order?: string;
    start_date?: string;
    end_date?: string;
    is_relation_product?: boolean;
    account_douyin_id?: number;
    account_douyin_ids?: string;
    video_title?: string;
    project_id?: number;
  },
): Promise<ListResponse<VideoRecordItem>> =>
  Get('/api/short_video/query_video_record', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
        ...pager,
      }),
    },
  });

/** 查询短视频列表 */
export const Query_Video_Item_Detail_V2 = async (
  video_id: number,
): Promise<HttpResponse<VideoRecordItem[]>> =>
  Get('/api/short_video/query_video_item_detail_v2', {
    params: { video_id },
  });

/** 查询视频关联的商品详情数据 */
export const Query_Video_Item_Detail = async (payload: {
  video_id: number;
  // 统计周期
  statistics_stage: number;
  // 二级类目
  second_tiange_cat_id?: number;
  // 三级类目
  third_tiange_cat_id?: number;
  title?: string;
}): Promise<HttpResponse<VideoItemDetail>> =>
  Get('/api/short_video/query_video_item_detail', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

/** 查询时间段内关联视频的商品数据  */
export const Query_Top_Video_Relation_Item = async (
  pager: IGPageQuery,
  payload: {
    order_by?: E.datacenter.GoodsSortType;
    start_date?: string;
    end_date?: string;
    project_id?: number;
    model_id?: number;
    follow_up_status?: E.datacenter.FollowUpStatus;
  },
): Promise<ListResponse<VideoRecordGoodsItem>> =>
  Get('/api/short_video/query_top_video_relation_item', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });
/** 查询时间段内模特数据  */
export const query_model_video_statistics = async (payload: {
  order_by?: E.datacenter.ModelVideoOrderType;
  start_date?: string;
  end_date?: string;
  project_id?: number;
}): Promise<HttpResponse<VideoRecordGoodsItem[]>> =>
  Get('/api/short_video/query_model_video_statistics', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });
/** 查询视频账号列表  */
export const Query_Video_Account = async (): Promise<HttpResponse<VideoAccount[]>> =>
  Get('/api/short_video/query_video_account');

export const Get_item_video_detail = async (payload: {
  project_id: number;
  sn: string;
}): Promise<HttpResponse<any[]>> =>
  Get('/api/short_video/get_item_video_detail', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

export const Get_query_video_comment = async (payload: any): Promise<ListResponse<any>> =>
  Get('/api/short_video/query_video_comment', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/** 新增/编辑视频关联商品信息 */
export const Save_Video_Item_Relation = async (payload: {
  video_id: string | undefined;
  shooting_date: string | undefined;
  model_ids?: (number | undefined)[];
  relation_list?: {
    project_id?: number;
    sn?: string;
  }[];
}): Promise<HttpResponse<undefined>> =>
  Post('/api/short_video/save_video_item_relation', {
    ...payload,
  });

/** 查询视频账号列表  */
export const Query_Video_Comment = async (
  pager: IGPageQuery,
  payload: any,
): Promise<ListResponse<VideoAccount[]>> =>
  Get('/api/short_video/query_video_comment', {
    params: ObjectFilterEmpty({
      ...pager,
      ...payload,
    }),
  });

/** 查询短视频数据导出  */
export const Export_Query_Video_Record = async (payload: {
  start_date?: string;
  end_date?: string;
  is_relation_product?: boolean;
  account_douyin_id?: number;
  video_title?: string;
}): Promise<HttpResponse<undefined>> =>
  Get('/api/short_video/export_query_video_record', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });
/** 隐藏视频数据 */
export const Update_Video_To_Private = async (payload: {
  video_id: string | undefined;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/short_video/update_video_to_private', {
    ...ObjectFilterEmpty({
      ...payload,
    }),
  });

/** 新增/编辑视频关联商品信息 */
export const query_product_multidimensional_statistics = async (payload: {
  project_id: number;
  second_cid: number;
  start_date: string;
  end_date: string;
  panel_config: {
    latitude_list: {
      latitude_type: number;
      property_id: number;
    }[];
    target_type: number;
  };
}): Promise<
  HttpResponse<{
    axle_data_list: any[][];
    row_data_list: any[][];
    row_name_list: string[];
  }>
> =>
  Post('/api/product_property/query_product_multidimensional_statistics', {
    ...payload,
  });

/**  查询项目时间段内的类目  */
export const query_project_second_list = async (payload: {
  start_date: string;
  end_date: string;
  project_id: number;
}): Promise<HttpResponse<undefined>> =>
  Get('/api/product_property/query_project_second_list', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

export interface StatisticsTemplate {
  id?: number;
  second_cid: number;
  template_name: string;
  template_config: {
    latitude_list: {
      latitude_type: number;
      property_id: number;
    }[];
    target_type: number;
  }[];
}
/**  查询纬度模板  */
export const query_multidimensional_statistics_template = async (payload: {
  second_cid: number;
}): Promise<HttpResponse<StatisticsTemplate[]>> =>
  Get('/api/product_property/query_multidimensional_statistics_template', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

/**  查询纬度模板  */
export const query_latitude_list = async (payload: {
  second_cid: number;
}): Promise<
  HttpResponse<
    {
      latitude_type: number;
      property_id: number;
      property_name: string;
    }[]
  >
> =>
  Get('/api/product_property/query_latitude_list', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

/**  删除模板  */
export const delete_multidimensional_statistics_template = async (
  id: number,
): Promise<HttpResponse<void>> =>
  Post('/api/product_property/delete_multidimensional_statistics_template', {
    id,
  });

/** 新增/保存纬度统计模板 */
export const save_update_multidimensional_statistics_template = async (payload: {
  id?: number;
  second_cid: number;
  template_name: string;
  is_enforcement?: number;
  template_config: {
    latitude_list: {
      latitude_type: number;
      property_id: number;
    }[];
    target_type: number;
  }[];
}): Promise<
  HttpResponse<{
    id: number;
    template_name: string;
  }>
> =>
  Post('/api/product_property/save_update_multidimensional_statistics_template', {
    ...ObjectFilterEmpty(payload),
  });

/**  查询搭配统计  */
export const query_combination_statistics = async (
  pager: IGPageQuery,
  payload: {
    product_id: number;
    end_date: string;
    start_date: string;
    project_id: string;
    product_sn: string;
    order_by: string;
  },
): Promise<
  ListResponse<{
    combination_id: number;
    combination_type: number;
    explain_count: number;
    gmv: number;
    sale_count: number;
    index: number;
    liking_index: string;
    item_list: {
      explain_count: string;
      image_url: string;
      product_id: string;
      product_name: string;
      product_sn: string;
    }[];
  }>
> =>
  Get('/api/combination/query_combination_statistics', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });

/**  查询直播详解列表  */
export const query_shop_live_product_explain_detail = async (
  pager: IGPageQuery,
  payload: {
    combination_id: number;
    product_id: string;
    project_id: string;
    product_sn: string;
    order_by: number;
    is_combination?: boolean;
  },
): Promise<
  ListResponse<{
    combination_id: number;
    combination_type: number;
    explain_count: number;
    gmv: number;
    sale_count: number;
    index: number;
    num_change: number;
    avg_online_person: number;
    incr_fans_cnt: number;
    comment_cnt: number;
    start_time: number;
    end_time: number;
    stream_screenshot: string;
    product_name: string;
    product_id: string;
    product_sn: string;
    image_url: string;
    stream_url: string;
    item_list: {
      explain_count: string;
      image_url: string;
      product_id: number;
      product_name: string;
      product_sn: string;
    }[];
    item_index: number;
  }>
> => {
  return Get('/api/combination/query_shop_live_product_explain_detail', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });
};

/**  查询直播详解列表  */
export const AutomaticInsertExplainCombination = async (
  payload: any,
): Promise<ListResponse<void>> =>
  Post('/api/combination/automatic_insert_explain_combination', {
    ...ObjectFilterEmpty({
      ...payload,
    }),
  });

/**  查询直播详解列表  */
export const save_or_update_explain_combination = async (payload: {
  combination_type: number;
  explain_id: string;
  product_sn_list: string[];
}): Promise<ListResponse<void>> =>
  Post('/api/combination/save_or_update_explain_combination', {
    ...ObjectFilterEmpty({
      ...payload,
    }),
  });

/** 根据商品款号，查询配置的搭配信息  */
export const GetGoodsCollocationDetailBySn = async (payload: {
  filter_search?: boolean;
  product_sn: string;
  project_id: string;
}): Promise<HttpResponse<any>> =>
  Get('/api/goods_train/get_goods_collocation_detail_by_sn', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

/** 查询粉丝画像  */
export const get_video_audience_data = async (payload: {
  video_id: number;
}): Promise<
  HttpResponse<{
    gender: { key: string; value: number; process: string }[];
    age: { key: string; value: number; process: string }[];
  }>
> =>
  Get('/api/short_video/get_video_audience_data', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

/** 查询商品跟进记录  */
export const get_project_product_follow_up_record = async (payload: {
  project_id?: number;
  product_sn?: string;
}): Promise<HttpResponse<any>> =>
  Get('/api/short_video/get_project_product_follow_up_record', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

/** 新增/编辑商品跟进记录  */
export const insert_or_update_project_product_follow_up_record = async (
  payload: UpdateFollowUpRecordParams,
): Promise<HttpResponse<any>> =>
  Post('/api/short_video/insert_or_update_project_product_follow_up_record', {
    ...ObjectFilterEmpty({
      ...payload,
    }),
  });

/** 查询颜色归类列表  */
export const query_item_color_classify_list = async (): Promise<
  HttpResponse<ItemColorClassifyModel[]>
> => Get('/api/product_property/query_item_color_classify_list');
/** 编辑颜色归类列表  */
export const edit_item_color_classify_list = async (payload: {
  color_classify_list: {
    after_classification_color: string;
    keyword: string;
  }[];
}): Promise<HttpResponse<any>> =>
  Post('/api/product_property/edit_item_color_classify_list', {
    ...ObjectFilterEmpty({
      ...payload,
    }),
  });

/**  新增下单数据  */
export const AddShopLiveDouyinItemPlaceOrder = async (payload: {
  file_url: string; // 文件URL
  order_num: number; // 下单量
  product_class: 1 | 2; // 商品类型；1-新品，2-老款翻单
  product_sn: string; // 商品款号
  project_id: number; // 项目ID
}): Promise<HttpResponse<any>> =>
  Post('/api/shop_live/add_shop_live_douyin_item_place_order', {
    ...ObjectFilterEmpty({
      ...payload,
    }),
  });

// 查询下单明细
export const QueryShopLiveDouyinItemPlaceOrderRecord = async (
  pager: IGPageQuery,
  payload: { project_id: string; product_sn: string },
): Promise<ListResponse<any>> =>
  Get('/api/shop_live/query_shop_live_douyin_item_place_order_record', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });

// 查询下单明细
export const QueryShopLiveDouyinItemPlaceOrderReport = async (
  pager: IGPageQuery,
  payload: { project_id: string; product_sn: string },
): Promise<ListResponse<any>> =>
  Get('/api/shop_live/query_shop_live_douyin_item_place_order_report', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });

/**  查询商品款式库存  */
export const QueryShopLiveDouyinItemPlaceOrderStyleStock = async (payload: {
  project_id: number;
  product_id: number;
}): Promise<HttpResponse<any>> => {
  return Get('/api/shop_live/query_shop_live_douyin_item_place_order_style_stock', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });
};

// 查询商品每日订单数据
export const QueryShopLiveDouyinItemPlaceOrderDailyStatistics = async (
  pager: IGPageQuery,
  payload: { project_id: string; product_sn: string },
): Promise<ListResponse<any>> =>
  Get('/api/shop_live/query_shop_live_douyin_item_place_order_daily_statistics', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });
