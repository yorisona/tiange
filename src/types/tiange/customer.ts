/**
 * 客户相关
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 16:11:21
 */
import { BooleanType, GmtTimeFields } from '../base/advanced';
import { InvoiceFields } from './fields';
import { PaginationParams } from '../base/pagination';
import { ShopType } from './customer.enum';
import { BusinessTypeEnum } from './common';

/**
 * 店铺列表查询参数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 19:57:38
 */
export interface CustomerQueryParams extends PaginationParams {
  /** 关键词搜索 */
  shop_name?: string;
  /** 客户ID(拉取指定店铺详情用) */
  customer_id?: number;
  /** 店铺类目 */
  category?: number;
  /** 店铺类型 */
  shop_type?: ShopType;
  /** 客户类型(旧称公司类型) */
  company_type?: number;
  /** 客户分类 */
  customer_class?: number;
  /** 是否年框客户 */
  is_year_customer?: boolean;
  /** 业务类型 */
  business_type?: BusinessTypeEnum;
  /** 录入人 */
  add_by?: string;
  /** 店铺名称/公司名称/客户手机号(搜索关键词) */
  mult_args?: string;
  /** 客户阶段 @deprecated */
  level?: number;
  /** 客户经理 @deprecated */
  manager?: string;
}

/**
 * 店铺列表筛选项表单
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-05 11:32:41
 */
export interface CustomerQueryForm extends PaginationParams {
  /** 店铺类目 */
  category: number | '';
  /** 店铺类型 */
  shop_type: ShopType | '';
  /** 客户类型(旧称公司类型) */
  company_type: number | '';
  /** 客户分类 */
  customer_class: number | '';
  /** 是否年框客户 */
  is_year_customer: boolean;
  /** 业务类型 */
  business_type: BusinessTypeEnum | '';
  /** 录入人 */
  add_by: string;
  /** 店铺名称/公司名称/客户手机号(搜索关键词) */
  mult_args: string;
}

/**
 * @Author: 矢车
 * @Date: 2021-01-18 16:33:48
 * @Description: 品牌id和名称列表
 */

export interface BrandList {
  brand_name?: string;
}

/**
 * 客户(店铺)
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 20:07:07
 */
export interface CustomerShop extends InvoiceFields, GmtTimeFields {
  /** ID */
  shop_id: number;
  /** 录入人 */
  add_by: string;
  /** 录入人ID */
  add_by_id: number;
  /** 省 */
  addr_province: string;
  /** 市 */
  addr_town: string;
  /** 区 */
  addr_county: string;
  /** 详细地址 */
  addr_detail: string;
  /** 店铺类目 */
  category: number;
  /** 公司ID */
  company_id: number;
  /** 公司名称 */
  company_name: string;
  /** 公司名称 */
  companies: any[];
  /** 公司类型 */
  company_type: number;
  coop_ae: [];
  /** 客户姓名 */
  customer_name: string;
  /** 客户类型 */
  customer_class: number;
  /** (跟进人)所属部门 */
  department: number;
  /** 店铺品牌id */
  brand_id: number;
  /** 店铺品牌 */
  brand_name: string;
  /** 业务类型 */
  business_type: number[];
  /** 店铺品牌 */
  manager_infos: {
    /** 部门id */
    department_id: number;
    /** 部门名称 */
    department_name: string;
    /** 客户经理id */
    manager_id: number;
    /** 客户经理名称 */
    username: string;
  }[];
  /** ?? */
  flag: number;
  /** 客户意向 */
  intention: string;
  /** 财务信息见继承 */
  /** 客户阶段 */
  level: number;
  /** 客户经理 */
  manager: string;
  /** 客户经理ID */
  manager_id: number;
  /** @deprecated 客户经理 */
  manager_name: string;
  /** 手机号 */
  mobile: string;
  /** 更新操作人 */
  modified_by: string;
  /** 更新操作人ID */
  modified_by_id: number;
  /** 店铺名称 */
  shop_name: string;
  /** 店铺类型 */
  shop_type: ShopType;
  /** 微信 */
  wechat: string;
  /** ?? */
  total_coop_times: number;
  /** ?? */
  total_coop_amount: number;
  /** ?? */
  conversation_times: number;
  /** 是否年框客户 */
  is_year_customer: boolean;
  /** ?? */
  has_achievement_or_cost: boolean;
  xd_shop_id?: number;
}

/** 店铺基础信息 */
interface CustomerShopParamsShopBasicInfo {
  /** 店铺名称 */
  shop_name: string;
  /** 店铺类型 */
  shop_type: ShopType;
  /** 店铺类目 */
  category: number;
  /** 公司ID */
  company_id: number;
  /** 公司名称 */
  company_name: string;
}

/** 客户基础信息 */
interface CustomerShopParamsCustomerBasicInfo {
  /** 客户姓名 */
  customer_name: string;
  /** 省 */
  addr_province?: string;
  /** 市 */
  addr_town?: string;
  /** 区 */
  addr_county?: string;
  /** 详细地址 */
  addr_detail?: string;
  /** 客户类型 */
  company_type?: number;
  /** 微信 */
  wechat?: string;
  /** 手机 */
  mobile?: number;
}

/**
 * 客户(店铺) - 新建参数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-23 11:16:51
 * @extends CustomerShopParamsCustomerBasicInfo
 * @extends Partial<Invoice>
 */
export interface CustomerShopCreateParams
  extends CustomerShopParamsShopBasicInfo,
    CustomerShopParamsCustomerBasicInfo,
    Partial<InvoiceFields> {
  /** 跟进人 - 客户经理 */
  manager?: string;
  /** 跟进人 - 所属部门 */
  department?: number;
  /** 客户分类 */
  customer_class?: number;
  /** 客户阶段 */
  level?: number;
  /** @deprecated 合作AE */
  coop_ae?: string[];
}

/**
 * 客户(店铺) - 编辑参数
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-23 13:50:17
 */
export interface CustomerShopEditParams extends CustomerShopCreateParams {
  id: number;
}

/**
 * 公司(基础款)
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-23 10:47:28
 */
export interface CompanyBase {
  settlement_type: any;
  /** 项目ID */
  id: number;
  /** 项目编号 */
  project_uid: number | string;
  /** 品牌名称 */
  brand_name: string;
  /** 直播间ID */
  studio_id: number;
  /* 客户名称 */
  company_name?: string;
  company_id?: number;
}

// 洽谈

/**
 * 洽谈
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-28 20:36:51
 * @prop {number} add_by_id 添加人ID
 * @prop {string} conversation_content 洽谈内容
 * @prop {string} conversation_date 洽谈时间
 * @prop {number} conversation_id ID
 * @prop {number} customer_id 客户ID
 * @prop {number} flag 标记
 * @prop {string} follower 跟进人
 * @prop {number} follower_id 跟进人ID
 * @prop {number} modified_by_id 更新人
 * @prop {string} note 备注
 */
export interface Conversation extends GmtTimeFields {
  /** 添加人ID */
  add_by_id: number;
  /** 洽谈内容 */
  conversation_content: string;
  /** 洽谈时间 */
  conversation_date: string;
  /** ID */
  conversation_id: number;
  /** 客户ID */
  customer_id: number;
  /** 标记 */
  flag: number;
  /** 跟进人 */
  follower: string;
  /** 跟进人ID */
  follower_id: number;
  /** 更新人 */
  modified_by_id: number;
  /** 备注 */
  note: string;
}

/**
 * 查询店铺所对应公司
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-25 16:25:10
 * @prop {number} id  ID
 * @prop {string} company_name  公司名称
 * @prop {string} shop_name  店铺名称
 */
export interface QueryShopAndCompanyRecord {
  /** ID */
  id: number;
  /** 公司名称 */
  company_name: string;
  /** 店铺名称 */
  shop_id?: number;
  shop_name: string;
  companies: CompanyBase[];
}

/**
 * 查询店铺所对应店铺和品牌
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-30 16:32:16
 * @prop {number} id  ID
 * @prop {string} brand_name  品牌名称
 * @prop {string} shop_name  店铺名称
 */
export interface QueryShopAndBrandRecord {
  /** ID */
  id: number;
  /** 品牌名称 */
  brand_name: string;
  /** 店铺名称 */
  shop_name: string;
  /** 品牌id */
  brand_id?: number;
  /** 店铺类目 */
  category: number;
}

export const BoardAccountTypeMap = new Map<'' | BooleanType, string>([
  ['', '全部'],
  [BooleanType.YES, '启用'],
  [BooleanType.NO, '禁用'],
]);

/**
 * 看板账户账号
 */
export interface BoardAccount {
  /** ID */
  id?: number;
  /** 账号 */
  account: string;
  /** 密码 */
  password?: string;
  /** 客户名称 */
  company_name: string;
  /** 直播账号数 */
  bind_account_count: number;
  /** 创建时间 */
  create_timestamp: number;
  /** 项目编号 */
  project_uid: string;
  /** 业务类型 */
  business_type: number;
  /** 账号详情 */
  bind_account_detail: {
    /** ID */
    id?: string;
    /** 昵称 */
    nickname: string;
  }[];
  /** 启用禁用状态 */
  status: BooleanType;
}

export interface BoardAccountForm {
  /** 账号名称 */
  account: string;
  project_id: number | string | undefined;
  brand_name?: string;
  password?: string;
  id?: any;
}

/**
 * 看板账号列表查询参数
 */
export interface BoardAccountQueryParams extends PaginationParams {
  /** 账号名称 */
  account?: string;
  /** 客户id */
  customer_id?: number;
  /** 客户名称 */
  customer_name?: string;
  /** 业务类型 */
  business_type?: BusinessTypeEnum;
  /** 账号状态 */
  status?: BooleanType;
}

/**
 * 看板账号列表筛选项表单
 */
export interface BoardAccountQueryForm extends PaginationParams {
  /** 账号名称 */
  account: string;
  /** 客户id */
  customer_id: number | '';
  /** 客户名称 */
  customer_name: string;
  /** 业务类型 */
  business_type: BusinessTypeEnum | '';
  /** 账号状态 */
  status: BooleanType | '';
}

/**
 *@description: 垫款申请查询垫款客户
 *@author: 棠棣
 *@since: 2021/8/18 11:55
 */
export interface AdvanceCustomerParams {
  keyword: string;
}

/**
 *@description: 垫款申请查询垫款客户
 *@author: 棠棣
 *@since: 2021/8/18 11:55
 */
export interface ProjectAchievementParams {
  achievement_uid: string;
  business_type: number;
  project_id: number;
}
/**
 *@description: 省市范围所有银行信息
 *@author: 棠棣
 *@since: 2021/9/23 14:55
 */
export interface BankListParams {
  province?: string;
  city?: string;
}
