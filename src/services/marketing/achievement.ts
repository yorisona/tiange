/**
 * 营销业务 - 项目 - 业绩
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-14 11:41:07
 */
import { Get, Post } from '@/utils/request';
import type {
  Achievement,
  AchievementDeleteParams,
  AchievementQueryParams,
  AchievementResponse,
  AchievementSaveParams,
  AchievementReceivableResponse,
  AchievementReceivableQueryParams,
  payableIns,
} from '@/types/tiange/marketing/achievement';
import type { HttpResponse } from '@/types/base/http';
import { ObjectFilterEmpty } from '@/utils/func';

/**
 * 获取业绩列表
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-14 11:43:23
 */
export const GetAchievementList = async (
  payload: AchievementQueryParams,
): Promise<AchievementResponse> =>
  Get('/api/coop/query_cooperation_achievement', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 获取项目收款-应收
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-14 11:43:23
 */
export const GetAchievementListReceivables = async (
  payload: AchievementReceivableQueryParams,
): Promise<AchievementReceivableResponse> =>
  Get('/api/receivable/query_marketing_receivables', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 品牌中心--收入--应收列表
export const GetShopAchievementListReceivables = async (
  payload: AchievementReceivableQueryParams,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<AchievementReceivableResponse> =>
  Get(
    business_type === E.project.BusinessType.supplyChain
      ? '/api/receivable/query_supply_chain_receivables'
      : business_type === E.project.BusinessType.locallife
      ? '/api/receivable/query_local_life_receivables'
      : '/api/receivable/query_shop_live_receivables',
    {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    },
  );

/**
 * 删除业绩
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-14 15:31:04
 */
export const DeleteAchievement = async (
  payload: AchievementDeleteParams,
): Promise<HttpResponse<null>> =>
  Post('/api/coop/del_achievement', {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 保存业绩
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-14 22:18:30
 */
export const SaveAchievement = async (
  payload: AchievementSaveParams,
): Promise<HttpResponse<Achievement>> =>
  Post('/api/coop/save_achievement', {
    ...ObjectFilterEmpty(payload),
  });

// 店铺代播应收tab列表的同项目是收单
export const GetQueryShopLiveForWriteOff = async (payload: string): Promise<AchievementResponse> =>
  Get('/api/receivable/query_shop_live_achievements_for_write_off', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 店铺代播应收tab列表的同项目是收单
export const GetQueryLocalLifeAchievementsForWriteOff = async (
  payload: string,
): Promise<AchievementResponse> =>
  Get('/api/receivable/query_shop_live_achievements_for_write_off', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 店铺代播实收tab列表的同项目是收单
export const GetQueryShopLiveForWriteOff2 = async (payload: string): Promise<AchievementResponse> =>
  Get('/api/receivable/query_shop_live_receivables_for_write_off', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 店铺代播实收tab列表的同项目是收单
export const GetQueryLocalLifeForWriteOff = async (payload: string): Promise<AchievementResponse> =>
  Get('/api/receivable/query_shop_live_receivables_for_write_off', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 营销业务应收tab列表的同项目是收单
export const GetQueryMarketForWriteOff = async (payload: any): Promise<AchievementResponse> =>
  Get('/api/receivable/query_marketing_achievements_for_write_off', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 营销业务实收tab列表的同项目是收单
export const GetQueryMarketForWriteOff2 = async (payload: any): Promise<AchievementResponse> =>
  Get('/api/receivable/query_marketing_receivables_for_write_off', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 应收tab核销单查询
export const GetSearchAchievement = async (payload: any): Promise<AchievementResponse> =>
  Get('/api/receivable/search_achievement_for_write_off', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 实收tab核销单查询
export const GetSearchReceivable = async (payload: any): Promise<AchievementResponse> =>
  Get('/api/receivable/search_receivable_for_write_off', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 店铺代播应收或实收tab下核销提交
export const SaveShopLiveWriteOff = async (
  payload: AchievementSaveParams,
): Promise<HttpResponse<Achievement>> =>
  Post('/api/receivable/shop_live/write_off', {
    ...ObjectFilterEmpty(payload),
  });

// 店铺代播应收或实收tab下核销提交
export const SaveLocalLifeWriteOff = async (
  payload: AchievementSaveParams,
): Promise<HttpResponse<Achievement>> =>
  Post('/api/receivable/local_life/write_off', {
    ...ObjectFilterEmpty(payload),
  });

export const SaveSupplyChainWriteOff = async (
  payload: AchievementSaveParams,
): Promise<HttpResponse<Achievement>> =>
  Post('/api/receivable/supply_chain/write_off', {
    ...ObjectFilterEmpty(payload),
  });
// 营销业务应收或实收tab下核销提交
export const SaveMarketWriteOff = async (
  payload: AchievementSaveParams,
): Promise<HttpResponse<Achievement>> =>
  Post('/api/receivable/marketing/write_off', {
    ...ObjectFilterEmpty(payload),
  });

// 店铺代播实付tab同项目列表
export const GetSearchPayable = async (payload: any): Promise<AchievementResponse> =>
  Get('/api/payable/query_payables_for_write_off/' + payload.project_type, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
// 店铺代播应付tab同项目列表
export const GetSearchCostPayable = async (payload: any): Promise<AchievementResponse> =>
  Get('/api/payable/query_costs_for_write_off/' + payload.project_type, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
// 店铺代播实付tab核销单查询
export const GetSearchPayableForWrite = async (payload: any): Promise<AchievementResponse> =>
  Get('/api/payable/search_payable_for_write_off', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

export const SavePayableWriteOff = async (
  payload: payableIns,
): Promise<HttpResponse<Achievement>> =>
  Post('/api/payable/write_off/' + payload.project_type, {
    ...ObjectFilterEmpty(payload),
  });
