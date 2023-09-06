import { PaginationParams } from '../../base/pagination';
export interface CommodityQueryParams extends Required<PaginationParams> {
  project_name?: string;
  item_id?: string;
  item_sn?: string;
  year?: string;
  season?: number | '';
  add_by?: number | '';
}

export interface CommodityBase {
  id: number | '';
  project_id: number | '';
  project_name: string;
  item_id: string;
  item_sn: string;
  first_tiange_cat_id: number | '';
  first_tiange_cat_name: string;
  third_tiange_cat_id: number | '';
  third_tiange_cat_name: string;
  year: string;
  season: string;
  target_sale_count: string;
  is_key: 0 | 1;
}

export interface CommodityItem extends CommodityBase {
  add_by: string;
  gmt_created: string;
}
