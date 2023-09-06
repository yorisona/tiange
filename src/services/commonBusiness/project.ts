/**
 * 通用业务 / 项目管理 services
 * @author  wuyou <wuyou@goumee.com>
 * @since   2021-05-06 14:43:5345
 */

import { HttpResponse, ListResponse } from '@/types/base/http';
import {
  CommonBusinessProject,
  CommonBusinessProjectDetail,
  CommonBusinessProjectForm,
  CommonBusinessProjectQueryParams,
  CommonBusinessPayableParams,
  PayableListTotal,
  CommonBusinessPayableActual,
  S2B2CDouyinDailyReport,
  DisplayDailyDataList,
} from '@/types/tiange/commonBusiness/project';

import * as APIs from '@/apis/commonBusiness/project';
import { ObjectFilterEmpty } from '@/utils/func';
import { Get, Post, Put } from '@/utils/request';
import { LiveProjectDailydata } from '@/types/tiange/live.project';
import {
  AchievementReceivableQueryParams,
  AchievementReceivableResponse,
} from '@/types/tiange/marketing/achievement';
import { ProjectMcnShopLiveParams } from '@/types/tiange/commonBusiness/project';
import { ProjectTeamMemberParams, ShopLiveProfitStatData } from '@/types/tiange/live';

/** 通用业务 项目列表 */
export const GetCommonBusinessProjectList = async (
  payload: CommonBusinessProjectQueryParams,
): Promise<ListResponse<CommonBusinessProject>> =>
  Get(APIs.COMMON_BUSINESS_PROJECT_LIST_API, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 通用业务 项目详情 */
export const GetCommonBusinessProjectDetail = async (
  id: string,
): Promise<HttpResponse<CommonBusinessProjectDetail>> =>
  Get(APIs.COMMON_BUSINESS_PROJECT_DETAIL_API.replace(':id', id));

/**
 * 通用业务 项目管理-应收
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-14 11:43:23
 */
export const GetReceivableCommonReceivables = async (
  payload: AchievementReceivableQueryParams,
): Promise<AchievementReceivableResponse> =>
  Get('/api/receivable/query_common_receivables', {
    params: {
      ...ObjectFilterEmpty({
        page_num: 1,
        num: 1000,
        ...payload,
      }),
    },
  });

/** 通用业务 新增/编辑项目 */
export const SaveCommonBusinessProject = async (
  payload: CommonBusinessProjectForm,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.COMMON_BUSINESS_PROJECT_SAVE_API, {
    ...ObjectFilterEmpty(payload),
  });

/** 日报数据日历列表 */
export const GetDailyReport = (
  begin_time: number,
  end_time: number,
  project_id: string,
  business_type: number,
): Promise<HttpResponse<LiveProjectDailydata[]>> =>
  Get('/api/common_business/query_daily_report', {
    params: {
      begin_time,
      end_time,
      project_id,
      business_type,
    },
  });

/** 日报数据保存 */
export const PostSaveDailyReport = (data: LiveProjectDailydata) =>
  Post('/api/common_business/save_daily_report', ObjectFilterEmpty(data));

/** 通用业务 项目付款 应付列表 */
export const GetCommonPayablesList = async (
  payload: CommonBusinessPayableParams,
): Promise<HttpResponse<PayableListTotal>> =>
  Get(APIs.COMMON_BUSINESS_QUERY_COMMON_PAYABLES, {
    params: payload,
  });

/** 通用业务 项目付款 实付列表 登记成本 */
export const CommonBusinessSaveCostAction = (data: CommonBusinessPayableActual) =>
  Post(APIs.COMMON_BUSINESS_SAVE_COST, ObjectFilterEmpty(data));

/** 通用业务 项目付款 实付列表 */
export const GetCommonPayableActualList = async (
  project_id: any,
  is_hide_reverse_data: number | undefined = undefined,
): Promise<HttpResponse<any>> =>
  Get(APIs.COMMON_BUSINESS_QUERY_COST, {
    params: {
      ...ObjectFilterEmpty({
        project_id,
        is_hide_reverse_data,
      }),
    },
  });

/** 通用业务 项目付款 实付列表 删除 */
export const CommonBusinessPayableActualDelCost = (cost_id: number) =>
  Post(APIs.COMMON_BUSINESS_DEL_COST, { cost_id });

/** 查项目排期列表 */
export const QueryProjectMcnShopLive = async (
  payload: ProjectMcnShopLiveParams,
): Promise<ListResponse<undefined>> =>
  Get(APIs.QUERY_MCN_SHOP_LIVE, {
    params: {
      ...ObjectFilterEmpty(payload ?? ''),
    },
  });

/** 保存店播项目团队成员 */
export const UpdateShopMcnTeamMembers = async (
  project_id: number | string,
  teamMember: ProjectTeamMemberParams,
): Promise<HttpResponse<undefined>> =>
  Put(`${APIs.UPDATE_SHOP_LIVE_COMMON_PROJECT_TEAM_MEMBERS}/${project_id}/`, {
    ...teamMember,
  });

/** 获取场次商品列表 */
export const GetLiveMerchantGoods = async (payload: any): Promise<ListResponse<any>> =>
  Get(APIs.GET_LIVE_GOODS, {
    params: {
      ...ObjectFilterEmpty(payload ?? ''),
    },
  });

/** 项目详情 盈收统计数据 */
export const QueryProfitStatData = async (
  project_id: string,
): Promise<HttpResponse<ShopLiveProfitStatData>> =>
  Get(`${APIs.GET_SHOP_LIVE_COMMON_PROJECT_PROFIT_STAT_DATA}/${project_id}/`);

/** 项目详情 s2b2c抖音平台日报查询 */
export const QueryS2B2CDouyinDailyReport = async (payload: {
  begin_time: string;
  end_time: string;
  project_id: string | number | undefined;
}): Promise<HttpResponse<S2B2CDouyinDailyReport>> =>
  Get(APIs.QUERY_S2B2C_DOUYIN_DAILY_REPORT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/** 项目详情 s2b2c抖音平台场次查询 */
export const QueryS2B2CDouyinSessionReport = async (payload: {
  begin_time: string;
  end_time: string;
  project_id?: string | number;
  group: string;
}): Promise<HttpResponse<DisplayDailyDataList>> =>
  Get(APIs.QUERY_S2B2C_DOUYIN_SESSION_REPORT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 保存s2b2c抖音项目目标 */
export const SaveProjectDouyinGoalInfo = (payload: {
  project_id: number | string | undefined;
  year: number;
  month: number;
  goal_value: string | undefined;
}): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_PROJECT_DOUYIN_GOAL_INFO, ObjectFilterEmpty(payload));
