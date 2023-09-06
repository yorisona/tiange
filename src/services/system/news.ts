/*
 * @Author: 肖槿
 * @Date: 2022-01-22 14:57:30
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-02-23 16:00:48
 * @FilePath: \goumee-star-frontend\src\services\system\news.ts
 */
import { HttpResponse, ListResponse } from '@/types/base/http';
import { Get, Post } from '@/utils/request';
import * as APIs from '@/apis/news';
import { ObjectFilterEmpty } from '@/utils/func';

/**
 * 消息列表
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:49:32
 */
export const GetSystemNewsList = async (): Promise<ListResponse<any>> =>
  Get(APIs.SYSTEM_NEWS_LIST_API);

/**
 * 消息列表-已配置人员
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:49:32
 */
export const GetSystemSettingDetail = async (payload: any): Promise<ListResponse<any>> =>
  Get(APIs.SYSTEM_NEWS_SETTING_USER_API + '?config_id=' + payload);

/**
 * 飞书用户列表
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:49:32
 */
export const GetSystemUsersList = async (name: string): Promise<ListResponse<any>> =>
  Get(APIs.SYSTEM_FEISHU_USER_LIST_API + '?name=' + name);

export const GetFeishuGroup = async (event_type: number): Promise<ListResponse<any>> =>
  Get('/api/feishu/feishu_bot_groups?event_type=' + event_type);
/**
 * 上传消息设置
 */
export const PostNewsSettingReceiver = async (payload: any): Promise<HttpResponse<undefined>> =>
  Post(APIs.SYSTEM_NEWS_USER_RECEIVER_LIST_API, {
    ...ObjectFilterEmpty(payload),
  });

export const PostUpdateCheckedFeishuBotGroups = async (
  payload: any,
): Promise<HttpResponse<undefined>> =>
  Post('/api/feishu/update_checked_feishu_bot_groups', {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 消息推送管理 状态变更(启用/停用
 */
export const PostNewsSetStatus = async (payload: any): Promise<HttpResponse<undefined>> =>
  Post(APIs.SYSTEM_NEWS_SET_STATUS_API, {
    ...ObjectFilterEmpty(payload),
  });
