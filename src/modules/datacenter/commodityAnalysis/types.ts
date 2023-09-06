import { Ref, ComputedRef } from '@vue/composition-api';
// import { Moment } from 'moment';
import { PaginationParams } from '@/types/base/pagination';
export interface ITabProps {
  // 选择的项目
  project_id: string | number | undefined;
  // 选择的日期
  start_date: string | undefined;
  end_date: string | undefined;
  date_type?: string | number | undefined;
  //从项目里面
  is_from_project?: boolean;
}

export interface chartParams {
  // 选择的项目
  project_id: string | number | undefined;
  // 选择的日期
  start_date?: string | undefined;
  end_date?: string | undefined;
  //从项目里面
  is_from_project?: boolean;
}
// 抖音项目商品销售列表参数
export interface ItemReportParams extends PaginationParams, chartParams {
  // 选择的项目
  cat_id?: string;
  title?: string;
  sort?: string;
  hot?: number;
  second_hot?: number;
  other?: number;
  second_tiange_cat_id?: number;
  third_tiange_cat_id?: number;
  tiange_cat_id?: number;
  room_id?: string; //场次
  //从项目里面
  is_from_project?: boolean;
}

export interface hotGoods {
  gmv: number; // 销售额
  gmv_part: number; // 销售额占比
  sale_count: number; // 销量
  sale_count_part: number; // 销量占比
  title?: string;
}

export interface hotGoodsInterface {
  top3: hotGoods;
  top10: hotGoods;
  top20: hotGoods;
  top30: hotGoods;
}

export interface YearAndSeasonBase {
  // 款数
  item_count: number;
  // 季节
  season: string | number;
  // 店铺销售额
  shop_gmv: number;
  // 店铺销量
  shop_sale_count: number;
  // 销售额占比
  shop_gmv_pie: number | null;
  // 年份
  year: string | number;
  // id
  id: number;
  shop_gmv_rate: number | null; //店铺销售额环比
  stock_num: number | null; //当前库存
  stock_products_worth: number | null; //库存货值
  stock_products_worth_pie: number | null; //货值占比
}
export interface YearAndSeasonList extends YearAndSeasonBase {
  children: YearAndSeasonBase[];
}

export interface CategoryReport extends ITabProps {
  sort?: string;
  category_id?: number;
}

export interface TimeLine extends ITabProps {
  tiange_cat_id: number;
}
export interface TimeLineData {
  competitive_gmv: number;
  competitive_gmv_increase: number;
  day: string;
  increase_balance: number;
  tiange_gmv: number;
  tiange_gmv_increase: number;
}

export interface CompetitiveParams extends ITabProps {
  shop_name?: string;
  shop_names?: string;
}

export interface CompetitiveAnalysisDetail extends CompetitiveParams {
  category_id?: number | string;
  first_tiange_category_id?: number | string;
}

export interface IWeekPopularParams {
  project_id: string | undefined | ComputedRef<string | undefined> | (string | null)[];
  project_name?: string | Ref<string> | (string | null)[];
  sort: string;
  start_date: string | ComputedRef<string | undefined> | undefined;
  end_date?: string | ComputedRef<string | undefined> | undefined;
  third_tiange_cat_id?: number | '';
  second_tiange_cat_id?: number | '';
  is_from_project?: boolean;
  business_type?: number | undefined;
}

export interface IThirdCategory {
  cat_name: string;
  // feigua_cat_id: string;
  gmt_create: string;
  gmt_modified: string;
  id: number;
  level: number;
  parent_cat_id: number;
}

export interface IHotEveryWeek {
  discount_price: number;
  first_tiange_cat: string;
  first_tiange_cat_id: number;
  image_url: string;
  item_id: number;
  project_id: number;
  last_week_rank: number;
  season: number;
  second_tiange_cat: string;
  second_tiange_cat_id: number;
  shop_gmv: number;
  shop_sale_count: number;
  third_tiange_cat: string;
  title: string;
  year: number | string;
  item_sn: string;
  shop_refund_status21_gmv: number;
  shop_refund_status21_gmv_rate: number;
}

/** 竞品对比 */
export interface competitiveItem {
  average_sale_price?: number | string | null;
  discount: number | string | null;
  gmv: number | string | null;
  gmv_percent?: number | string | null;
  sale_count: number | string | null;
  sku_count: number | string | null;
  shop_name: string | null;
  average_sale_count?: number | string | null;
  average_price?: number | string | null;
  gmv_ratio?: number | string | null;
}

export interface competitorTopItem {
  competitive: competitiveItem[];
  shop_live: competitiveItem;
  name: string | null;
}
export interface competitorSellItem {
  competitive: competitiveItem[];
  own: competitiveItem;
  name: string | null;
}

export interface competitorAnalysis {
  average_price: number | string | null;
  average_sale_count: number | string | null;
  category_id: number | string | null;
  category_name: number | string | null;
  gmv: number | string | null;
  gmv_ratio: number | string | null;
  sale_count: number | string | null;
  shop_id: number | string | null;
  shop_name: number | string | null;
  sku_count: number | string | null;
  competitive: any;
}
export interface competitorAnalysisItem {
  shop_live: competitiveItem;
  name: string | null;
  average_price: number | string | null;
  average_sale_count: number | string | null;
  category_id: number | string | null;
  category_name: number | string | null;
  hasChildren?: boolean;
  children: competitorAnalysis[];
  competitive: competitorAnalysis[];
  gmv: number | string | null;
  gmv_ratio: number | string | null;
  sale_count: number | string | null;
  shop_id: number | string | null;
  shop_name: number | string | null;
  sku_count: number | string | null;
}
