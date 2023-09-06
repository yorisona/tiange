/**
 * 跟单
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-13 14:19:45
 */
import type { PaginationParams } from '@/types/base/pagination';

/**
 * AE
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-16 10:59:43
 */
export interface AE {
  /** AE ID */
  ae_id: number;
  /** AE名称 */
  ae_name: string;
  /** 预计跟单金额 */
  expect_amount: number;
  /** 是否允许修改 */
  is_allow_modify: number;
}

/**
 * 查询跟单AE参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-16 00:49:40
 */
export interface AEListQueryParmas {
  /** 合作ID */
  cooperation_id?: number;
}

/**
 * AE跟单商品
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-13 16:19:03
 */
export interface AEItem {
  /** 商品名称 */
  item_name: string;
  /** 商品链接 */
  item_url: string;
  /** 样品是否安排 */
  is_sample_arrange: number;
}

/**
 * AE跟单
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-16 22:23:19
 */
export interface AEOrder {
  add_by_id: number;
  /** AE ID */
  ae_id: number;
  /** 合作ID */
  cooperation_id: number;
  /** 成本金额(元) */
  cost_amount: number;
  /** 跟单表ID */
  documentary_id: number;
  flag: number;
  gmt_create: string;
  gmt_modified: string;
  /** 成本是否安排 0---否 1---是 */
  is_cost_arrange: number;
  /** 样品是否安排 0---否 1---是 */
  is_sample_arrange: number;
  /** KOL ID */
  kol_id: number;
  /** KOL名称 */
  kol_name: string;
  /** 直播日期 */
  live_date: string;
  modified_by_id: number;
  /** 备注?? */
  note: string;
  /** 格式化金额 */
  cost_amount_str: string;
  /** 商品列表 */
  item_list: AEItem[];
  /** 报价金额 */
  price_amount: number;
  /** 报价金额 */
  price_amount_str: string;
  /** 是否需要录入场次 */
  is_need_add_display: boolean;
  /** @deprecated 商品名称 */
  item_name: string;
  /** @deprecated 商品链接 */
  item_url: string;
}

/**
 * 跟单表查询参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-16 00:41:08
 */
export interface AEOrderQueryParams extends PaginationParams {
  /** 合作ID */
  cooperation_id?: number;
  /** AE ID */
  ae_id?: number;
  /** 查找需要添加场次的跟单 */
  is_need_add_display?: boolean;
}

/**
 * AE实际跟单金额和预计跟单金额查询参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-16 00:45:16
 */
export interface AeDocumentaryAmountQueryParams {
  cooperation_id?: number;
  ae_id?: number;
}

/**
 * AE实际跟单金额和预计跟单金额
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-16 00:45:40
 */
export interface AeDocumentaryAmount {
  /** 实际跟单金额 */
  act_documentary_amount: number;
  /** 预计跟单金额 */
  exp_documentary_amount: number;
}

/**
 * AE跟单
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-16 22:24:00
 */
export interface AEOrderForm {
  /** 跟单ID */
  documentary_id?: number;
  /** AE ID */
  ae_id?: number;
  /** KOL ID */
  kol_id: number | '';
  /** KOL 名称(不提交) */
  kol_name: string;
  /** 报价金额(元) */
  price_amount: string;
  /** 成本金额(元) */
  cost_amount: string;
  /** 直播日期 */
  live_date: string;
  /** 成本是否安排 */
  is_cost_arrange?: number;
  /** 样品是否安排 */
  is_sample_arrange?: number;
  /** 备注 */
  note: string;
  /** 商品列表 */
  item_list: AEItem[];
  /** @deprecated 商品名(废弃) */
  item_name?: string;
  /** @deprecated 商品链接(废弃) */
  item_url?: string;
}

/**
 * AE跟单保存参数
 * ```
 * 新增是批量的!
 * ```
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-16 22:24:00
 */
export interface AEOrderSaveParams {
  /** 跟单ID(编辑必填) */
  documentary_id?: number;
  /** AE ID */
  ae_id?: number;
  /** 合作ID */
  cooperation_id: number;
  /** KOL ID */
  kol_id: number;
  /** 成本金额(元) */
  cost_amount?: string;
  /** 直播日期 */
  live_date?: string;
  /** 成本是否安排 */
  is_cost_arrange?: number;
  /** 样品是否安排 */
  is_sample_arrange?: number;
  /** 备注 */
  note?: string;
  /** 报价金额(元) */
  price_amount?: string;
  /** 商品列表 */
  item_list: AEItem[];
  /** @deprecated 商品名(废弃) */
  item_name?: string;
  /** @deprecated 商品链接(废弃) */
  item_url?: string;
}

export interface ProjectFormAe {
  /** id */
  ae_id: string;
  /** ae名称 */
  ae_name: string;
  /** 预计跟单金额 */
  expect_amount: string;
}

export interface MarketingProjectAeForm {
  /** 合作ID (营销项目ID) */
  cooperation_id?: number;
  /** AE 列表 */
  ae_infos: ProjectFormAe[];
}

/**
 * 删除跟单参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-17 11:52:07
 */
export interface DeleteAEOrderParams {
  /** 跟单ID */
  documentary_id: number;
}
