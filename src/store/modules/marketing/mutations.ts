import type { MarketingState } from './state';
import * as Types from './types';
import type { AE } from '@/types/tiange/marketing/ae';

const mutations = {
  setProjectInfo(state: MarketingState, detailPageNeedReload: number) {
    state.detailPageNeedReload = state.detailPageNeedReload * detailPageNeedReload;
  },
  [Types.SET_AE_LIST]: (state: MarketingState, payload: AE[]) => {
    state.aeList = payload;
  },
};

export default mutations;
