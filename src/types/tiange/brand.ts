/**
 * 品牌管理
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 10:24:42
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=144&itf=1467
 */
import { GmtTimeFields } from '../base/advanced';
import { PaginationParams } from '../base/pagination';

export interface Brand extends GmtTimeFields {
  /** 创建人 */
  add_by: number;
  /** 品牌名称 */
  brand_name: string;
  /** 0 ==> 正常状态；1 ==> 删除状态 */
  flag: number;
  /** 品牌ID */
  id: number;
  /** 修改人 */
  modified_by: number;
  customer_info?: {
    company_id: number;
    company_name: string;
  }[];
}

export interface BrandForm {
  /** 品牌名称 */
  brand_name: string;
  /** 品牌ID */
  id?: number;
  customer_ids?: (number | undefined)[];
}

export interface BrandQueryParams extends Required<PaginationParams> {
  /** 品牌名称 */
  brand_name?: string;
}
