/*
 * @Author: 肖槿
 * @Date: 2021-04-22 14:08:16
 * @Description: 标签管理类型声明
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-05-11 14:42:16
 * @FilePath: \goumee-star-frontend\src\types\tiange\tag.ts
 */
import { PaginationParams } from '../base/pagination';
export interface TagGroup extends Required<TagGroupGenerate> {
  creator_id: number;
  creator_name: string;
  gmt_created: string;
  name: string;
  tags_count: number;
}

export interface TagGroupGenerate {
  name: string;
  roles: number[];
  tags?: Tag[];
  id: number;
}

export interface TagQueryParams extends Required<PaginationParams> {
  /** 品牌名称 */
  keyword?: string;
}
export interface Tag {
  /** ID */
  id: number;
  name: string;
}

export interface TagRole {
  name: string;
  value: number;
}
