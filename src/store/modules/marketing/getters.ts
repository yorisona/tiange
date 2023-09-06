import { MarketingState } from './state';

export function getProjectStateInfo(state: MarketingState) {
  return state.detailPageNeedReload;
}

/**
 * AE列表
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-16 11:23:33
 */
export const aeList = (state: MarketingState) => state.aeList;
