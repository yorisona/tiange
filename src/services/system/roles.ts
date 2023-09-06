/**
 * 系统 - 角色相关
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-20 13:51:06
 */
import { Get } from '@/utils/request';
import { CUSTOMER_AUTH_GET_USER_BY_ROLE } from '@/apis/system';
import type { HttpResponse } from '@/types/base/http';
import type { SimpleRole } from '@/types/tiange/system/role';

/**
 * 获取项目经理
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-20 13:52:09
 */
export const GetProjectManagerList = async (): Promise<HttpResponse<SimpleRole[]>> =>
  Get(CUSTOMER_AUTH_GET_USER_BY_ROLE, {
    params: {
      roles: 1003,
    },
  });

/**
 * 获取项目经理
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-20 13:52:09
 */
export const GetCustomerManagerList = async (): Promise<HttpResponse<SimpleRole[]>> =>
  Get(CUSTOMER_AUTH_GET_USER_BY_ROLE, {
    params: {
      roles: 1008,
    },
  });
