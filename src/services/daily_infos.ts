import { HttpResponse, ListResponse } from '@/types/base/http';
import { IGPageQuery } from '@/types/tiange/general';
import { ObjectFilterEmpty } from '@/utils/func';
import { Get, Post } from '@/utils/request';

/** 查询每日资讯列表  **/
export const Query_Daily_Infos_News = (
  pager: IGPageQuery,
  params: {
    grab_time?: string;
    source?: string;
    title?: string;
    news_time?: string;
  },
): Promise<
  ListResponse<{
    content: string;
    flag: number;
    gmt_create: string;
    gmt_modified: string;
    grab_time: string;
    id: number;
    news_time: string;
    origin_url: string;
    source: string;
    source_url: string;
    title: string;
  }>
> => {
  return Get('/api/strategic_infos/query_daily_infos_news', {
    params: ObjectFilterEmpty({
      ...pager,
      ...params,
    }),
  });
};
/** 推送每日资讯  **/
export const Hand_Push_News = (payload: {
  grab_time?: string;
  receive_user_ids?: string[];
}): Promise<HttpResponse<{}>> => {
  return Post('/api/strategic_infos/hand_push_news', ObjectFilterEmpty(payload));
};

/** 人员查询  **/
export const Query_User_V2 = (
  payload: string,
): Promise<
  ListResponse<{
    username: string;
    id: number;
  }>
> => {
  return Get('/api/auth/query_user_v2', {
    params: ObjectFilterEmpty({
      search_type: 2,
      is_checked: 1,
      search_value: payload,
    }),
  });
};

export interface IDailyInfo {
  grab_keywords: string;
  grab_time: string;
  is_auto_push: number;
  push_time: string;
  receive_user_ids: string[];
  receive_user_infos: {
    id: number;
    username: string;
  }[];
  push_user_infos: {
    id: number;
    username: string;
  }[];
}

/** 保存每日资讯设置  **/
export const Save_Daily_Infos_Set = (payload: IDailyInfo): Promise<HttpResponse<{}>> => {
  return Post('/api/strategic_infos/save_daily_infos_set', ObjectFilterEmpty(payload));
};
/** 查询每日资讯设置  **/
export const Query_Daily_Infos_Set = (): Promise<HttpResponse<IDailyInfo>> => {
  return Get('/api/strategic_infos/query_daily_infos_set');
};
/** 查询每日资讯设置  **/
export const Delete_Daily_News = (ids: number[]): Promise<HttpResponse<void>> => {
  return Post('/api/strategic_infos/delete_daily_news', { ids });
};
/** 查询发布的资讯  **/
export const Query_Daily_Infos_News_NoAuth = (params: any): Promise<ListResponse<void>> => {
  return Get('/api/strategic_infos/query_daily_infos_news_noauth', { params });
};
