import { Post, Get } from '@/utils/request';
import { ObjectFilterEmpty } from '@/utils/func';
import { HttpResponse, ListResponse } from '@/types/base/http';
import { IGPageQuery } from '@/types/tiange/general';

export interface Save_Opponent_Company_Params {
  /** 团队情况 **/
  team_info: string;
  remark: string;
  /** 公司名称 **/
  name: string;
  /** 公司简介 **/
  introduction: string;
  /** 头部达人  **/
  head_person: string;
  /** 合作品牌信息列表 **/
  cooperative_brand_infos: {
    /** 抖音号 **/
    douyin_num: string;
    /** 合作结束时间 **/
    end_date: string;
    /** 品牌名称 **/
    name: string;
    /** 合作开始时间 **/
    start_date: string;
  }[];
}

/** 保存竞对公司 */
export const Save_Opponent_Company = async (
  payload: Save_Opponent_Company_Params,
): Promise<HttpResponse<any>> =>
  Post(
    '/api/strategic_infos/save_opponent_company',
    ObjectFilterEmpty({
      ...payload,
    }),
  );
/** 保存竞对公司 */
export const Check_Opponent_Company = async (
  payload: Save_Opponent_Company_Params,
): Promise<HttpResponse<any>> =>
  Post(
    '/api/strategic_infos/check_opponent_company',
    ObjectFilterEmpty({
      ...payload,
    }),
  );

/** 查询竞对公司 */
export const Query_Opponent_Company = async (
  pager: IGPageQuery,
  payload: { name: string },
): Promise<ListResponse<Save_Opponent_Company_Params & { id: number }>> =>
  Get('/api/strategic_infos/query_opponent_company', {
    params: ObjectFilterEmpty({
      ...pager,
      ...payload,
    }),
  });

/** 删除竞对公司 */
export const Delete_Opponent_Company = async (payload: number): Promise<HttpResponse<any>> =>
  Post('/api/strategic_infos/delete_opponent_company', {
    ids: [payload],
  });

/** 查询竞对公司 */
export const Query_Opponent_Data = async (
  pager: IGPageQuery,
  payload: { name?: string; search_year?: string; brand_name?: string },
): Promise<
  ListResponse<{
    id: number;
    name: string;
    remark: string;
    team_info: string;
    total: { [key: string]: number };
    introduction: string;
    head_person: string;
    year: string;
    cooperative_brand_data: {
      douyin_num: string;
      name: string;
      total: number;
      [key: string]: unknown;
    }[];
  }>
> =>
  Get('/api/strategic_infos/query_opponent_data', {
    params: ObjectFilterEmpty({
      ...pager,
      ...payload,
    }),
  });
/** 查询竞对公司 */
export const Get_Have_Data_Year = async (): Promise<ListResponse<number>> =>
  Get('/api/strategic_infos/get_have_data_year');

/** 查询竞对公司 */
export const Query_Living_Stream = async (payload: {
  business_type?: string;
}): Promise<
  HttpResponse<
    {
      fans_num: number;
      is_living: string;
      live_duration: string;
      shop_id: string;
      shop_logo: string;
      shop_name: string;
      stream_flv: string;
      stream_screenshot: string;
    }[]
  >
> => Get('/api/strategic_infos/query_living_stream', { params: payload });
// /api/strategic_infos/query_living_stream
// /api/screen_kanban/query_shop_live_stream
