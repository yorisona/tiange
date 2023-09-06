import { HttpResponse } from '@/types/base/http';
import { ObjectFilterEmpty } from '@/utils/func';
import { Get, Post } from '@/utils/request';

/**
 * 品牌中心/本地生活
 */

/**
 * 品牌中心飞书部门列表
 */
export const GetShopLiveProjectGroundList = async (
  params: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/query_operating_feishu_department_list', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });
/**
 * 品牌中心目标完成度
 */
export const GetShopLiveDepartMentGmvComletionRateGroundList = async (
  params: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/operating/query_department_gmv_completion_rate', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });

/**
 * 品牌中心gmv构成旭日图
 */
export const GetShopLiveDepartMentGmvSunburstGroundList = async (
  params: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/operating/query_department_gmv_sunburst', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });

/**
 *品牌中心gmv构成饼图
 */
export const GetShopLiveDepartMentGmvPieGroundList = async (
  params: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/operating/query_project_gmv_pie', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });

/**
 * 品牌中心gmv周趋势--部门或者项目
 */
export const GetShopLiveDepartMentProjectGmvGroundList = async (
  params: Record<string, any>,
  isDepartMent = true,
): Promise<HttpResponse<any>> => {
  if (isDepartMent) {
    return Get('/api/shop_live/operating/query_department_gmv_trend', {
      params: {
        ...ObjectFilterEmpty(params),
      },
    });
  }
  return Get('/api/shop_live/operating/query_project_gmv_trend', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });
};

/**
 *销售-周/月统计趋势图
 */
export const GetShopLiveSellStatisticsTrendsList = async (
  params: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/operating/query_department_project_gmv_trend', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });

/**
 * 销售-当前项目的目标完成率趋势图
 */
export const GetShopLiveSellGmvComletionRateDailyGroundList = async (
  params: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/operating/query_project_daily_gmv_trend', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });

/**
 * 销售-周/月统计看明细
 */
export const GetShopLiveSellStatisticsList = async (
  params: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/operating/query_department_project_gmv_detail', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });

/**
 * 销售-周/月统计漏斗图
 */
export const GetShopLiveSellProjectStatisticsList = async (
  params: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/operating/query_project_conversion_merge_funnel', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });

/**
 * 转化-周/月统计趋势图
 */
export const GetShopLiveChangeStatisticsTrendsList = async (
  params: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/operating/query_conversion_merge_statistics_trends', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });

/**
 * 转化-天统计趋势
 */
export const GetShopLiveChangeDayStatisticsTrendsList = async (
  params: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/operating/query_project_conversion_day_merge_statistics_trends', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });

/**
 * 转化-周/月统计看明细
 */
export const GetShopLiveChangeStatisticsList = async (
  params: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/operating/query_conversion_merge_statistics', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });

/**
 * 转化-周/月统计漏斗图
 */
export const GetShopLiveChangeProjectStatisticsList = async (
  params: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/operating/query_project_conversion_merge_funnel', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });

/**
 * 流量-周/月统计趋势图
 */
export const GetShopLiveFlowStatisticsTrendsList = async (
  params: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/operating/query_flow_merge_statistics_trends', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });

/**
 * 流量-天统计趋势
 */
export const GetShopLiveFlowDayStatisticsTrendsList = async (
  params: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (params.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/query_project_flow_day_merge_statistics_trends' + url, {
      params: {
        ...ObjectFilterEmpty(params),
      },
    });
  }
  return Get('/api/shop_live/operating/query_project_flow_day_merge_statistics_trends', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });
};

/**
 * 流量-周/月统计看明细
 */
export const GetShopLiveFlowStatisticsList = async (
  params: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/operating/query_flow_merge_statistics', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });

/**
 * 流量-周/月统计旭日图
 */
export const GetShopLiveFlowProjectSunburstList = async (
  params: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (params.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/query_project_flow_merge_percent_sunburst' + url, {
      params: {
        ...ObjectFilterEmpty(params),
      },
    });
  }
  return Get('/api/shop_live/operating/query_project_flow_merge_percent_sunburst', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });
};

/**
 * 项目详情/场次详情-、、、、流量-周/月统计明细数据
 */
export const GetShopLiveFlowProjectPercentSunbursDetail = async (
  params: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (params.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/query_project_flow_merge_percent_detail' + url, {
      params: {
        ...ObjectFilterEmpty(params),
      },
    });
  }
  return Get('/api/shop_live/operating/query_project_flow_merge_percent_detail', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });
};

/**
 * 项目详情/场次详情-、、、、流量-周/月统计明细数据
 */
export const GetShopLiveFlowProjectVideoList = async (
  params: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (params.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/query_project_flow_video_records' + url, {
      params: {
        ...ObjectFilterEmpty(params),
      },
    });
  }
  return Get('/api/shop_live/operating/query_project_flow_video_records', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });
};

/**
 * 投放-周/月统计趋势图
 */
export const GetShopLivePutStatisticsTrendsList = async (
  params: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/operating/query_launch_merge_statistics_trends', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });

/**
 * 投放-天统计趋势
 */
export const GetShopLivePutDayStatisticsTrendsList = async (
  params: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/operating/query_project_launch_day_merge_statistics_trends', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });

/**
 * 日报数据-编辑日历数据
 */
export const ShopLiveDailyReport = async (
  params: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Post('/api/shop_live/daily_report', {
    ...ObjectFilterEmpty(params),
  });

/**
 * 投放-周/月统计看明细
 */
export const GetShopLivePutStatisticsList = async (
  params: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/operating/query_launch_merge_statistics', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });

/**
 * 投放-周/月统计漏斗图
 */
export const GetShopLivePutProjectStatisticsList = async (
  params: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (params.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/query_project_launch_merge_funnel' + url, {
      params: {
        ...ObjectFilterEmpty(params),
      },
    });
  }
  return Get('/api/shop_live/operating/query_project_launch_merge_funnel', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });
};

/**
 * 人群-周/月统计趋势图
 */
export const GetShopLiveCrowdStatisticsTrendsList = async (
  params: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/operating/query_crowd_merge_statistics_trends', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });

/**
 * 人群-天统计趋势
 */
export const GetShopLiveCrowdDayStatisticsTrendsList = async (
  params: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (params.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get(
      '/api/shop_live/project_data/query_project_crowd_day_merge_statistics_trends' + url,
      {
        params: {
          ...ObjectFilterEmpty(params),
        },
      },
    );
  }
  return Get('/api/shop_live/operating/query_project_crowd_day_merge_statistics_trends', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });
};

/**
 * 人群-周/月统计看明细
 */
export const GetShopLiveCrowdStatisticsList = async (
  params: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (params.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/query_crowd_merge_statistics' + url, {
      params: {
        ...ObjectFilterEmpty(params),
      },
    });
  }
  return Get('/api/shop_live/operating/query_crowd_merge_statistics', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });
};

/**
 * 人群-成交人数vs未成交人数
 */
export const GetShopLiveCrowdProjectStatisticsList = async (
  params: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (params.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/query_project_crowd_merge_statistics_details' + url, {
      params: {
        ...ObjectFilterEmpty(params),
      },
    });
  }
  return Get('/api/shop_live/operating/query_project_crowd_merge_statistics_details', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });
};

/**
 * 项目的数据概览
 */
export const GetProjectOverview = async (
  params: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (params.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/query_project_overview' + url, {
      params: {
        ...ObjectFilterEmpty(params),
      },
    });
  }
  return Get('/api/shop_live/operating/query_project_overview', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });
};

/**
 * 当前项目直播间的数据概览
 */
export const GetLiveRoomOverview = async (
  params: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (params.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/query_project_live_room_overview' + url, {
      params: {
        ...ObjectFilterEmpty(params),
      },
    });
  }
  return Get('/api/shop_live/operating/query_project_live_room_overview', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });
};

/**
 * 当前项目直播间的数据概览
 */
export const GetLiveRoomInfo = async (
  params: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (params.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/query_project_live_room_info' + url, {
      params: {
        ...ObjectFilterEmpty(params),
      },
    });
  }
  return Get('/api/shop_live/operating/query_project_live_room_info', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });
};
/**
 *场次详情大屏数据
 */
export const GetShopLivePerfromanceScreen = async (
  params: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (params.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/shop_live_detail/get_shop_live_screen' + url, {
      params: {
        ...ObjectFilterEmpty(params),
      },
    });
  }
  return Get('/api/shop_live/shop_live_detail/get_shop_live_screen', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });
};

//  场次详情---场次趋势-每分钟打点数据趋势
export const GetShopLivePerfromanceTrendList = async (
  payload: {
    shop_live_id?: string | number | undefined;
    is_from_project?: boolean | undefined;
  },
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (payload.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get(
      '/api/shop_live/project_data/shop_live_detail/query_shop_live_trend_analysis' + url,
      {
        params: {
          ...ObjectFilterEmpty(payload),
        },
      },
    );
  }
  return Get('/api/shop_live/shop_live_detail/query_shop_live_trend_analysis', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

//  场次详情---场次趋势-商品详情
export const GetShopLivePerfromanceProductDetail = async (
  payload: {
    shop_live_id?: string | number | undefined;
    product_id?: string | number | undefined;
    product_start_time?: string | number | undefined;
    is_from_project?: boolean;
  },
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (payload.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/shop_live_detail/get_shop_live_product_detail' + url, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/shop_live_detail/get_shop_live_product_detail', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

//  场次详情---场次趋势-商品详情
export const GetShopLivePerfromanceKoiDetail = async (
  payload: {
    shop_live_id?: string | number | undefined;
    live_start_time?: string | number | undefined;
    is_from_project?: boolean;
  },
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (payload.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/shop_live_detail/get_shop_live_screen_kol' + url, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/shop_live_detail/get_shop_live_screen_kol', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

/**
 * 投放-单项目/场次-日/周/月统计明细
 */
export const GetShopLivePutMergeStatistics = async (
  params: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (params.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/get_launch_merge_statistics' + url, {
      params: {
        ...ObjectFilterEmpty(params),
      },
    });
  }
  return Get('/api/shop_live/operating/get_launch_merge_statistics', {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });
};

// 品牌中心项目项目每日明细
export const QueryProjectStatisticsDetailList = async (
  payload: {
    project_id?: string | number | undefined;
    start_date: string;
    end_date: string;
    is_from_project?: boolean;
  },
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (payload.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/project_statistics_detail' + url, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/operating/project_statistics_detail', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

//  粉丝---人群-分布数据
export const QueryProjectCrowdDistributeDetail = async (
  payload: {
    project_id?: string | number | undefined;
    start_date?: string;
    end_date?: string;
    shop_live_id?: string | number | undefined;
    is_from_project?: boolean;
  },
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (payload.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/query_project_crowd_distribute' + url, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/operating/query_project_crowd_distribute', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 系统类目分析副本
export const GetSystemCategoryReport = async (
  payload: Record<string, any>,
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
  return Get('/api/shop_live/operating/douyin_tiange_category_report', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 每日/周/月爆款对比
export const GetHotStyleRegion = async (
  payload: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (payload.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/data_center/project_data/hot_style_in_region' + url, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/data_center/operating/hot_style_in_region', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 成套销售排行
export const GetProjectCombinationSuit = async (
  payload: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (payload.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/query_project_combination_suit' + url, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/operating/query_project_combination_suit', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 单款连带排行
export const GetProjectItemTopRelation = async (
  payload: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (payload.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/query_project_item_top_n_relation' + url, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/operating/query_project_item_top_n_relation', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 抖音项目商品销售列表
export const GetDouyinItemReport = async (
  payload: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (payload.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    //是否是从场次跳转
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
  return Get('/api/shop_live/operating/douyin_item_report', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 项目中主播销售商品统计报告
export const GetProjectKolItemReport = async (
  payload: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (payload.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/project_kol_item_report' + url, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/operating/project_kol_item_report', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 项目中主播统计报告
export const GetProjectKolScheduleReport = async (
  payload: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (payload.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/project_kol_schedule_report' + url, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/operating/project_kol_schedule_report', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 项目中主播销售商品类目
export const GetProjectKolCategory = async (
  payload: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (payload.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/project_kol_item_report_category' + url, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/operating/project_kol_item_report_category', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 品牌中心数据更新时间
export const GetLastUpdateTime = async (
  payload: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (payload.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/get_last_update_time' + url, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/operating/get_last_update_time', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 项目看板-子页面统计预览数据
export const GetTabOverview = async (
  payload: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (payload.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/query_project_live_room_tab_overview' + url, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/operating/query_project_live_room_tab_overview', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 获取直播项目的批注
export const GetPerfromanceComments = async (
  payload: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (payload.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/query_live_room_comments' + url, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/operating/query_live_room_comments', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 新增直播项目的批注
export const AddPerfromanceComment = async (
  payload: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Post('/api/shop_live/project_data/add_live_room_comment', {
    ...ObjectFilterEmpty(payload),
  });

// 删除直播项目的批注
export const DeletePerfromanceComment = async (
  payload: Record<string, any>,
): Promise<HttpResponse<any>> =>
  Post('/api/shop_live/project_data/del_live_room_comment/' + payload.comment_id + '/');

// 品类销售分析
export const GetPerfromanceShopList = async (
  payload: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  if (payload.is_from_project) {
    const url =
      business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : '';
    return Get('/api/shop_live/project_data/douyin_tiange_category_report_by_room' + url, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/operating/douyin_tiange_category_report_by_room', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 场次详情：系统类目分析-一级类目
export const GetSystemShopLiveCategory = async (
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
    if ((payload.room_id && payload.room_id !== '') || payload.merge_shop_live_id) {
      return Get('/api/shop_live/project_data/query_douyin_tiange_category_by_room' + url, {
        params: {
          ...ObjectFilterEmpty(payload),
        },
      });
    }
    return Get('/api/shop_live/query_douyin_tiange_category' + url, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  if (payload.room_id && payload.room_id !== '') {
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
// 价格带
export const GetSystemShopLivePieChart = async (
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
    if (payload.room_id && payload.room_id !== '') {
      return Get('/api/shop_live/project_data/douyin_item_pie_chart_by_room' + url, {
        params: {
          ...ObjectFilterEmpty(payload),
        },
      });
    }
    return Get('/api/shop_live/project_data/douyin_item_pie_chart' + url, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  if (payload.room_id && payload.room_id !== '') {
    return Get('/api/shop_live/operating/douyin_item_pie_chart_by_room', {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/operating/douyin_item_pie_chart', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 商品分析：抖音项目商品销售列表
export const GetDouyinItemRoomReport = async (
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
    if ((payload.room_id && payload.room_id !== '') || payload.merge_shop_live_id) {
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
  if (payload.room_id && payload.room_id !== '') {
    return Get('/api/shop_live/operating/douyin_item_report_by_room', {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/operating/douyin_item_report', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 商品分析：查询商品分析详情-类目下拉框
export const GetShopLiveQueryDouyinTiangeRoomCategory = async (
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
    return Get('/api/shop_live/project_data/douyin_item_report_by_room_category' + url, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/operating/douyin_item_report_by_room_category', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 商品分析：抖音商品价格分布饼图
export const GetDouyinItemPieChart = async (
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
    return Get('/api/shop_live/project_data/douyin_item_pie_chart' + url, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/shop_live/operating/douyin_item_pie_chart', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

// 商品分析：抖音项目商品销售列表
export const GetDouyinItemShopReport = async (
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
    //是否是从场次跳转
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
