import { AE } from '@/types/tiange/marketing/ae';
import type { ActionContext } from 'vuex';
import * as Types from './types';

export const setProjectInfo = (
  { commit }: ActionContext<any, Record<string, any>>,
  payload: number,
) => {
  commit('setProjectInfo', payload);
};

/**
 * 保存AE列表
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-16 11:21:56
 */
export const setAEList = (
  action: ActionContext<StaticRange, Record<string, any>>,
  payload: AE[],
) => {
  action.commit(Types.SET_AE_LIST, payload);
};
