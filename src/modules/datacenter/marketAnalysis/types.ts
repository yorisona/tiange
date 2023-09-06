/*
 * @Author: 肖槿
 * @Date: 2022-02-18 15:08:29
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-02-19 11:32:38
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\marketAnalysis\types.ts
 */
export type douyinCategory = {
  cat_id: string;
  date: string;
  search_type?: number;
};
export type echartsAge = {
  name: string;
  ratio: number;
};

export type echartsPrice = {
  gmv: number;
  interval: string;
  level: number;
  ratio: number;
  sale_count: number;
};
export type echartsRegion = {
  name: string;
  ratio: number;
};
