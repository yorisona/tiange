/**
 * 店铺代播 / 项目管理 services
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-30 11:11:26
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=146&itf=1494
 */

import { HttpResponse, ListResponse } from '@/types/base/http';
import {
  LiveProject,
  LiveProjectAchievement,
  LiveProjectForm,
  LiveProjectQueryParams,
  LiveProjectDailydata,
  LiveProjectPayables,
} from '@/types/tiange/live.project';
import { ObjectFilterEmpty } from '@/utils/func';
import { Get, Post } from '@/utils/request';
import * as APIs from '@/apis/live.project';
import { LiveAchivement } from '@/types/tiange/live';

/** 店铺代播 项目收款列表 */
export const GetLiveProjectList = async (
  payload: LiveProjectQueryParams,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<ListResponse<LiveProject>> =>
  Get(
    business_type === E.project.BusinessType.supplyChain
      ? APIs.SUPPLY_CHAIN_PROJECT_LIST_API
      : business_type === E.project.BusinessType.locallife
      ? APIs.LOCAL_LIFE_PROJECT_LIST_API
      : APIs.LIVE_PROJECT_LIST_API,
    {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    },
  );

/** 店铺代播、本地生活 保存项目 */
export const SaveLiveProject = async (
  payload: LiveProjectForm,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<undefined>> =>
  Post(
    business_type === E.project.BusinessType.supplyChain
      ? APIs.SUPPLY_CHAIN_PROJECT_SAVE_API
      : business_type === E.project.BusinessType.locallife
      ? APIs.LOCAL_LIFE_PROJECT_SAVE_API
      : APIs.LIVE_PROJECT_SAVE_API,
    {
      ...ObjectFilterEmpty(payload),
    },
  );
/** 店铺代播 供应链列表 */
export const GetquerySupplyChainProject = async (
  payload: LiveProjectQueryParams,
): Promise<ListResponse<LiveProject>> =>
  Get(`/api/shop_live/query_supply_chain_project`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/** 店铺代播- 立项审批 保存项目 */
export const ShopLiveProjectApproval = async (
  payload: LiveProjectForm,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<undefined>> =>
  Post(
    business_type === E.project.BusinessType.supplyChain
      ? '/api/shop_live/supply_chain_project_approval'
      : business_type === E.project.BusinessType.locallife
      ? '/api/shop_live/local_life_project_approval'
      : '/api/shop_live/shop_live_project_approval',
    {
      ...ObjectFilterEmpty(payload),
    },
  );

/** 店铺代播 项目收款列表 */
export const queryShopLiveCost = async (
  payload: LiveProjectQueryParams,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<
  HttpResponse<{
    data: LiveAchivement[];
    /**   */
    stat_info: {
      /** 已付款 */
      paid_amount: number;
      /** 等级付款 */
      total_pay_amount: number;
      /** 待付款 */
      wait_pay_amount: number;
      /** 未核销金额 */
      not_write_off_amount: number;
      /** 已核销金额 */
      write_off_amount: number;
    };
    /** 数据总量 */
    total: number;
  }>
> =>
  Get(
    business_type === E.project.BusinessType.supplyChain
      ? '/api/shop_live/query_supply_chain_cost'
      : business_type === E.project.BusinessType.locallife
      ? '/api/shop_live/query_local_life_cost'
      : '/api/shop_live/query_shop_live_cost',
    {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    },
  );

/** 店铺代播 项目应付列表 */
export const queryShopLivePayables = async (
  payload: LiveProjectQueryParams,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<
  HttpResponse<{
    data: LiveProjectPayables[];
    total: number;
    payable: number;
    write_off: number;
    not_write_off: number;
  }>
> =>
  Get(
    business_type === E.project.BusinessType.supplyChain
      ? '/api/payable/query_supply_chain_payables'
      : business_type === E.project.BusinessType.locallife
      ? '/api/payable/query_local_life_payables'
      : '/api/payable/query_shop_live_payables',
    {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    },
  );

/** 店铺代播 项目详情 */
export const GetLiveProjectDetail = async (
  id: string,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<LiveProject>> => {
  return business_type === E.project.BusinessType.supplyChain
    ? Get(APIs.SUPPLY_CHAIN_PROJECT_DETAIL_API.replace(':id', id))
    : business_type === E.project.BusinessType.locallife
    ? Get(APIs.LOCAL_LIFE_PROJECT_DETAIL_API.replace(':id', id))
    : Get(APIs.LIVE_PROJECT_DETAIL_API.replace(':id', id));
};

/** 获取业绩列表 **/
export const GetShopLiveAchievement = async (
  project_id: number,
  business_type: number | undefined = E.project.BusinessType.douyin,
  is_hide_reverse_data: number | undefined = undefined,
): Promise<
  HttpResponse<{
    data: LiveProjectAchievement[];
    stat_info: {
      // 确认收款金额
      confirmed_gather_amount: number;
      // 登记收款金额
      total_gather_amount: number;
      // 等待确认金额
      wait_gather_amount: number;
      write_off_amount: number;
      not_write_off_amount: number;
    };
  }>
> =>
  Get(
    business_type === E.project.BusinessType.supplyChain
      ? APIs.QUERY_SUPPLY_CHAIN_ACHIEVEMENT
      : business_type === E.project.BusinessType.locallife
      ? APIs.QUERY_LOCAL_LIFE_ACHIEVEMENT
      : APIs.QUERY_SHOP_LIVE_ACHIEVEMENT,
    {
      params: {
        ...ObjectFilterEmpty({ project_id, is_hide_reverse_data, page_num: 1, num: 1000 }),
      },
    },
  );

/** 获取通用业绩列表 **/
export const GetCommonAchievement = async (
  project_id: number,
  is_hide_reverse_data: number | undefined,
  page_num?: number,
  num?: number,
): Promise<
  HttpResponse<{
    data: LiveProjectAchievement[];
    stat_info: {
      // 确认收款金额
      confirmed_gather_amount: number;
      // 登记收款金额
      total_gather_amount: number;
      // 等待确认金额
      wait_gather_amount: number;
      write_off_amount: number;
      not_write_off_amount: number;
    };
    total: number;
  }>
> =>
  Get(APIs.QUERY_ACHIEVEMENT, {
    params: {
      ...ObjectFilterEmpty({
        project_id,
        is_hide_reverse_data,
        page_num,
        num,
      }),
    },
  });

export const GetMerchantAchievement = async (
  project_id: number,
  page_num?: number,
  num?: number,
): Promise<
  HttpResponse<{
    data: LiveProjectAchievement[];
    stat_info: {
      // 确认收款金额
      confirmed_gather_amount: number;
      // 登记收款金额
      total_gather_amount: number;
      // 等待确认金额
      wait_gather_amount: number;
      write_off_amount: number;
      not_write_off_amount: number;
    };
    total: number;
  }>
> =>
  Get(APIs.QUERY_MERCHANT_ACHIEVEMENT, {
    params: {
      project_id,
      page_num,
      num,
    },
  });

export const DeleteShopLiveAchievement = async (
  achievement_id: string,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.DEL_SHOP_LIVE_ACHIEVEMENT.replace('{achievement_id}', achievement_id));

export const DeleteShopLiveAchievementCommon = async (
  achievement_id: string,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.DEL_SHOP_LIVE_ACHIEVEMENT_COMMON.replace('{achievement_id}', achievement_id));

// 删除店铺代播成本
export const DELETE_SHOP_LIVE_COST = async (cost_id: string): Promise<HttpResponse<undefined>> =>
  Post('/api/shop_live/del_shop_live_cost/{cost_id}/'.replace('{cost_id}', cost_id));
/**
 * 保存店铺项目业绩
 * @param data
 * @constructor
 */
export const SAVE_SHOP_LIVE_ACHIEVEMENT = async (
  data: any,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<undefined>> =>
  Post(
    business_type === E.project.BusinessType.supplyChain
      ? APIs.SAVE_SUPPLY_CHAIN_ACHIEVEMENT
      : business_type === E.project.BusinessType.locallife
      ? APIs.SAVE_LOCAL_LIFE_ACHIEVEMENT
      : APIs.SAVE_SHOP_LIVE_ACHIEVEMENT,
    ObjectFilterEmpty(data),
  );

/** 通用业务保存业绩 **/
export const SAVE_SHOP_LIVE_ACHIEVEMENT_COMMON = async (
  data: any,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_SHOP_LIVE_ACHIEVEMENT_COMMON, ObjectFilterEmpty(data));

/** 招商结算收款保存 **/
export const SAVE_SHOP_LIVE_MERCHANT_ACHIEVEMENT = async (
  data: any,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_SHOP_LIVE_MERCHANT_ACHIEVEMENT, ObjectFilterEmpty(data));

export const SAVE_COOP_LIVE_ACHIEVEMENT_COMMON = async (
  data: any,
): Promise<HttpResponse<undefined>> => Post('/api/coop/save_achievement', ObjectFilterEmpty(data));

/** 店铺代播 - 保存成本 **/
export const SAVE_SHOP_LIVE_COST = async (data: any): Promise<HttpResponse<undefined>> =>
  Post('/api/shop_live/save_shop_live_cost', data);

/** 店铺代播 - 日历列表 **/
export const GetShopLiveDailyReport = (
  begin_time: number | undefined | string,
  end_time: number | undefined | string,
  project_id: string,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/daily_report', {
    params: {
      begin_time,
      end_time,
      project_id,
    },
  });

/** 店铺代播 - 日历保存 **/
export const PostSaveShopLiveProject = (
  data: LiveProjectDailydata | { gmv: string; project_id: number | string; date: number | string },
) => Post('/api/shop_live/daily_report', ObjectFilterEmpty(data));

/** 本地生活 - 日历保存 **/
export const PostSaveLocalLifeDailyReportProject = (
  data:
    | LiveProjectDailydata
    | { gmv: string; goal_gmv: string; project_id: number | string; date: number | string },
) => Post('/api/shop_live/daily_report', ObjectFilterEmpty(data));

/** 营销业务 - 日历列表 **/
export const GetCoopDailyReport = (
  begin_time: number,
  end_time: number,
  project_id: string,
): Promise<HttpResponse<LiveProjectDailydata[]>> =>
  Get('/api/coop/daily_report', {
    params: {
      begin_time,
      end_time,
      project_id,
    },
  });

/** 营销业务 - 日历保存 **/
export const PostSaveCoopDailyProject = (data: LiveProjectDailydata) =>
  Post('/api/coop/daily_report', ObjectFilterEmpty(data));

/** 预设佣金比例 **/
export const PostSaveCommissionRate = (data: {
  project_id: string;
  month: string;
  net_sales_rate: string;
}) => Post('/api/shop_live/save_net_sales_rate', ObjectFilterEmpty(data));

/** 店铺代播 - 获取目标配置 **/
export const GetShopLiveTargetList = (
  year: number | undefined,
  project_id: string,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<any>> => {
  return Get(
    '/api/shop_live/query_project_goal_settings' +
      (business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : ''),
    {
      params: {
        year,
        project_id,
      },
    },
  );
};

/** 店铺代播 保存目标店铺配置 **/
export const PostSaveLiveShopTarget = (data: any) =>
  Post('/api/shop_live/save_project_shop_month_goal_approval', data);
/** 店铺代播 保存年目标店铺配置 **/
export const PostSaveLiveShopTargetYear = (data: any) =>
  Post('/api/shop_live/save_project_shop_year_goal_approval', data);
/** 店铺代播 保存日目标店铺配置 **/
export const PostSaveLiveShopTargetDay = (data: any) =>
  Post(
    '/api/shop_live/save_project_shop_daily_goal_approval' +
      (data.business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : data.business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : ''),
    data,
  );
/** 店铺代播 保存目标主播配置 **/
export const PostSaveLiveAnchorTarget = (data: any) =>
  Post('/api/shop_live/save_project_anchor_goal_settings', data);

/** 店铺代播 获取设置配置 **/
export const GetShopLiveSettingList = (project_id: string): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/get_project_settlement_setting', {
    params: {
      project_id,
    },
  });

/** 店铺代播 保存设置配置 **/
export const PostSaveLiveSetting = (data: {
  project_id: string;
  settlement_day: number;
  commission_rate: string;
  service_amount: number;
  is_enable: string;
}) => Post('/api/shop_live/save_project_settlement_setting', ObjectFilterEmpty(data));

/** 库存监控设置保存 **/
export const Save_Monitor_Product_Stock_Setting = (data: {
  project_id: string;
  max_increase_stock: number;
  receiver_list: string[];
  is_enable: string;
}) => Post('/api/shop_live/monitor_product_stock_setting', ObjectFilterEmpty(data));
/** 库存监控设置保存 **/
export const GET_Monitor_Product_Stock_Setting = (data: { project_id: string }) =>
  Get('/api/shop_live/monitor_product_stock_setting', {
    params: ObjectFilterEmpty(data),
  });

/** 店铺代播 - 查询店铺代播项目授权状态*/
export const GetShopLiveAuthStatus = (project_id: string): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/get_project_auth_status/' + project_id + '/');
/** 店铺代播 获取设置配置 **/

export const GetSearchExpenseType = (keyword: string): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/search_expense_type', {
    params: {
      keyword,
    },
  });
export const PostSaveS2b2cSetting = (data: any) =>
  Post('/api/shop_live/save_s2b2c_settlement_setting', ObjectFilterEmpty(data));

export const GetS2b2cSettlementSetting = (project_id: string): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/get_s2b2c_settlement_setting', {
    params: {
      project_id,
    },
  });
