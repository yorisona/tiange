/**
 * 用户模块
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-25 17:23:53
 */
import { HttpResponse } from '@/types/base/http';
import type {
  LoginParams,
  SMSVerifyCodeParams,
  VerifyCodeResponse,
  UpdatePasswordParams,
} from '@/types/tiange/auth';
import { UserInfo } from '@/types/tiange/system';
import { ObjectFilterEmpty } from '@/utils/func';
import { Get, Post } from '@/utils/request';

/**
 * 获取部门
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-25 17:25:01
 */
export const GetDepartment = async (): Promise<HttpResponse<Record<string, string>>> =>
  Get('/api/auth/get_department');

/**
 * 获取图形验证码
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-04 09:50:10
 */
export const GetVerifyCode = async (): Promise<HttpResponse<VerifyCodeResponse>> =>
  Get('/api/auth/get_code');

/**
 * 登录
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-04 13:21:41
 */
export const Login = async (
  payload: LoginParams,
): Promise<HttpResponse<{ token: string; user_info: UserInfo }>> =>
  Post('/api/auth/login', {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 获取短信验证码
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-04 13:25:27
 */
export const GetSMSVerifyCode = async (
  payload: SMSVerifyCodeParams,
): Promise<HttpResponse<string>> =>
  Post('/api/auth/send_sms', {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 获取用户信息
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-12 10:44:56
 */
export const GetUserInfo = async (): Promise<HttpResponse<UserInfo>> => Get('/api/auth/getuser');

/**
 * 用户修改密码
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-12 14:37:25
 */
export const UpdatePassword = async (payload: UpdatePasswordParams): Promise<HttpResponse<null>> =>
  Post('/api/auth/change_password', {
    ...ObjectFilterEmpty(payload),
  });
