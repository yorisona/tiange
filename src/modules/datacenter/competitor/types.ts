/*
 * @Author: 肖槿
 * @Date: 2022-01-06 15:06:24
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-01-08 09:52:25
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\competitor\types.ts
 */
import type { PaginationParams } from '@/types/base/pagination';
export interface competitorCategoryParams {
  shop_name?: string;
  shop_names?: string;
  start_date?: string;
  end_date?: string;
  sort?: string;
  style?: string;
  project_id?: number | string | undefined;
}

export interface categoryItem {
  gmv: number;
  gmv_str: string;
  item_cat: string;
  pay_rate: number | string | null;
  sale_count: number | string | null;
  watch_count: number | string | null;
  pay_rate_str: number | string | null;
  sale_count_str: number | string | null;
  watch_count_str: number | string | null;
  style?: number;
}

export interface dateAndCateDouyinCompetitiveParams
  extends PaginationParams,
    competitorCategoryParams {
  third_cat_id?: number;
  sort?: string;
}

export interface summaryItem {
  date?: string;
  discount_price?: number;
  gmv?: number;
  item_cat?: string;
  item_id?: string;
  item_image?: string;
  item_title?: string;
  market_price?: number;
  pay_rate?: number;
  sale_count?: number;
  watch_count?: number;
}
