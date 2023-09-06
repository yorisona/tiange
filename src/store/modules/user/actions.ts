/**
 * 用户
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-12 11:26:21
 */
import type { ActionContext } from 'vuex';
import type { UserState } from './state';
import type { UserInfo } from '@/types/tiange/system';

export const setUserInfo = (
  { commit }: ActionContext<UserState, Record<string, any>>,
  payload: UserInfo,
) => {
  commit('setUserinfo', payload);
};
