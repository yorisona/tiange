/**
 * 营销业务
 * @author  wuyou <wuyou@goumee.com>
 * @since   2021-04-16 10:23:03
 */
import type { AE } from '@/types/tiange/marketing/ae';

export interface MarketingState {
  detailPageNeedReload: number;
  aeList: AE[];
}

const state: MarketingState = {
  detailPageNeedReload: -1,
  aeList: [],
};

export default state;
