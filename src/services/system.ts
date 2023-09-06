/**
 * 系统设置
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-29 22:15:04
 */
import { Get, Post } from '@/utils/request';
import type { RightTreeOriginal, UserInfo } from '@/types/tiange/system';
import type { HttpResponse, ListResponse } from '@/types/base/http';
import { QUERY_USER_V2 } from '@/apis/system';
import { ObjectFilterEmpty } from '@/utils/func';
import type { UserListQueryParams } from '@/types/tiange/system/user';

/**
 * 获取所有权限
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-29 23:47:25
 */
export const GetRights = async (): Promise<HttpResponse<RightTreeOriginal[]>> =>
  Get('/api/auth/get_right_tree');

/**
 * 获取用户列表v2
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-28 16:00:27
 */
export const GetUser = (payload: UserListQueryParams): Promise<ListResponse<UserInfo>> =>
  Get(QUERY_USER_V2, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 获取用户列表v2
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-28 16:00:27
 */
export const GetUsers = (payload: UserListQueryParams): Promise<ListResponse<UserInfo>> =>
  Get('/api/auth/query_subordinate_users', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/**
 * 批量授权
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-29 23:47:25
 */
export const SaveUserRights = async (params: any): Promise<HttpResponse<Record<string, any>>> =>
  Post('/api/auth/batch/save_user_rights', ObjectFilterEmpty(params));

/**
 * 用户权限编辑（包含密码修改）
 */
export const SaveUserRight = async (params: any): Promise<HttpResponse<Record<string, any>>> =>
  Post('/api/auth/save_user_rights', params);
