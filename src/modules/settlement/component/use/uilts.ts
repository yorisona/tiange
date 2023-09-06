/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-11-29 15:10:45
 */

import { getToken } from '@/utils/token';
import { computed } from '@vue/composition-api';

export const default_put_company_name = '杭州煜丰电子商务有限公司';

export const appHost = computed(() => {
  let url = undefined;
  try {
    url = new URL(process.env.VUE_APP_BASE_API);
  } catch {
    console.log(`current url = ${url}`);
  }

  const urlProtocol = url?.protocol;
  const urlHostName = url?.hostname;
  return `${urlProtocol}//${urlHostName}`;
});

export const pit_fee_detail_url = (
  settlement_id: string | number | undefined,
  company_id: string | number | undefined = undefined,
  fee_type: 1 | 2 = 1,
) => {
  if (company_id && fee_type === 1) {
    return `${
      appHost.value
    }/api/shop_live/download_live_goods_detail?settlement_id=${settlement_id}&company_id=${company_id}&fee_type=${fee_type}&Authorization=${getToken()}`;
  } else {
    return `${
      appHost.value
    }/api/shop_live/download_live_goods_detail?settlement_id=${settlement_id}&fee_type=${fee_type}&Authorization=${getToken()}`;
  }
};

export const put_detail_url = (kol_ids: string, start_date: number, end_date: number) => {
  return `${
    appHost.value
  }/api/oceanengine/ad_plan/download_ad_cost?kol_ids=${kol_ids}&start_date=${start_date}&end_date=${end_date}&Authorization=${getToken()}`;
};

export const put_yf_detail_url = (project_id: string, start_date: number, end_date: number) => {
  return `${
    appHost.value
  }/api/oceanengine/ad_plan/download_ad_cost/yufeng?project_id=${project_id}&start_date=${start_date}&end_date=${end_date}&Authorization=${getToken()}`;
};
