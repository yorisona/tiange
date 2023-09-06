/**
 * 直播间管理
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 10:06:56
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=145&itf=1470
 */
import { GmtTimeFields } from '../base/advanced';
import { PaginationParams } from '../base/pagination';
import { BusinessTypeEnum } from './common';

export interface Studio extends GmtTimeFields {
  /** ID */
  id: number;
  /** 创建人ID */
  add_by: number;
  /** 直播间名称 */
  studio_name: string;
  /** 直播间地址 */
  studio_address?: string;
  /** 业务类型 1---营销业务, 2---淘宝店播 */
  business_type: BusinessTypeEnum[];
  /** 0---正常状态；1---删除状态 */
  flag: 0;
  /** 修改人ID */
  modified_by: number;
}

export interface StudioForm {
  /** ID */
  id?: number;
  /** 直播间名称 */
  studio_name: string;
  /** 直播间地址 */
  studio_address?: string;
  /** 业务类型 1---营销业务, 2---淘宝店播 */
  business_type: number[];
}

export interface StudioQueryParams extends Required<PaginationParams> {
  /** 直播间名称 */
  studio_name?: string;
  /** 业务类型 1---营销业务, 2---淘宝店播 */
  business_type?: string;

  /** 选择的 业务类型 */
  select_business_type?: number;
}
