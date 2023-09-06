/**
 * 权限通用方法
 * @author  wuyou <wuyou@goumee.com>
 * @since   2021-01-22 16:41:32
 */

import store from '@/store';
import { UserInfo } from '@/types/tiange/system';
import { RIGHT_CODE } from '@/const/rightCode';

/**
 * 权限检查
 * 请使用 usePermission
 * @deprecated
 *  * */
export const HasPermission = (right_code: number) => {
  const currentUserInfo: UserInfo = store.getters['user/getUserInfo'];

  return (currentUserInfo?.user_rights ?? []).includes(right_code);
};

/** 用户业务类型列表 */
export const GetUserBusinessTypes = () => {
  const currentUserInfo: UserInfo = store.getters['user/getUserInfo'];

  return currentUserInfo.business_type;
};

type PartialPermission<T> = {
  [p in keyof T]: boolean;
};

/**
 * 获取当前用户权限状态
 * 在Vue中直接使用, 数据变更会自动更新视图
 * const permission = usePermission()
 * {permission.gathering_view}
 */
export const usePermission = (): PartialPermission<typeof RIGHT_CODE> => {
  return new Proxy({} as any, {
    get(target, name: string) {
      const code: number = (RIGHT_CODE as any)[name];
      const userInfo = store.getters['user/getUserInfo'] || [];
      return userInfo.user_rights?.includes(code);
    },
  });
};

/** 是否为当前用户 */
export const IsCurrentUser = (user_id: number) => {
  const currentUserInfo: UserInfo = store.getters['user/getUserInfo'];
  return currentUserInfo.id === user_id;
};
