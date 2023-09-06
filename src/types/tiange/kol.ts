/**
 * Kol 相关类型
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-20 20:23:28
 */

/**
 * 销售机会平台
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-24 00:33:30
 * @prop {number} 1---小红书
 * @prop {number} 2---微信公众号
 * @prop {number} 3---新浪微博
 * @prop {number} 4---抖音
 * @prop {number} 5---快手
 * @prop {number} 6---哔哩哔哩
 * @prop {number} 7---淘宝直播
 * @prop {number} 8---一直播
 * @prop {number} 9---淘宝图文
 * @prop {number} 10---淘宝短视频
 * @prop {number} 11---线下场地搭建
 * @prop {number} 12---线下视觉设计
 * @prop {number} 13---活动策划执行
 */
export type PlatformCodes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

/**
 * 平台基本信息
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-20 20:55:01
 */
export interface PlatformBaseInfo {
  /** 标签名 */
  label?: string;
  /** 标签值对应字段 */
  key: string;
  /** 名称?? */
  name?: boolean;
  /** 类型?? */
  type?: string;
  /** 在首部展示标签名字的 */
  showLabel?: string;
}

/** 媒介类型信息 */
export interface MediumTypeInfo {
  /** 媒介名称 */
  mediumName: string;
  /** 媒介信息 */
  info: {
    /** 名称 */
    label: string;
    /** 字段 */
    key: string;
    /** 单位 */
    unit?: string;
  }[];
  /** 其它信息 */
  otherInfo?: {
    /** 名称 */
    label: string;
    /** 字段 */
    key: string;
    /** 出现的条件 */
    showCondition: string;
    /** 数字对应的字典 */
    dictionary?: string;
  }[];
}

/**
 * 平台数据
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-20 20:54:52
 */
export interface Platform {
  /** 平台名称字段 */
  platformKey: string;
  /** 平台名称 */
  platformName: string;
  /** 平台?? */
  platSelected: boolean;
  /** ?? */
  detailKey: string;
  /** ?? */
  key_avatar: string;
  /** 基础信息 */
  baseInfo: PlatformBaseInfo[];
  /** 媒介类型信息 */
  mediumTypeInfo: MediumTypeInfo[];
}

/** KolTag */
export interface KolTag {
  value: string;
  key: number;
}

/** AreaType 业务类型 */
export interface BusinessType {
  /** 领域名称 */
  value: string;
  /** 字段值 */
  key: number | '';
}

/**
 * AreaType 擅长领域
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-21 01:32:29
 */
export interface AreaType {
  /** 领域名称 */
  value: string;
  /** 字段值 */
  key: number | '';
}

/**
 * KOL查询参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-17 01:03:24
 */
export interface KOLQueryParams {
  /**
   * 平台
   * ```
   * tb---淘宝
   * douyin---抖音
   * kuaishou---快手
   * weibo---新浪微博
   * wechat---微信公众号
   * bili---哔哩哔哩
   * xhs---小红书
   * yizhibo---一直播
   * ```
   */
  platform?: string;
  /**
   * 领域
   * ```
   *	1---美妆
   *	2---个护
   *	3---服饰
   *	4---美食
   *	5---母婴
   *	6---数码
   *	7---家居
   *	8---保健
   *	9---萌宠
   *	10---箱包
   *	11---配饰
   * ```
   */
  area?: number;
  /** 是否可以专票 0---否, 1---是 */
  special_ticket?: number;
  /** KOL名称 */
  kol_name?: string;
  /** KOL ID */
  kol_id?: string;
  /** 最大粉丝数(万) */
  max_fans_num?: number;
  /** 最小粉丝数(万) */
  min_fans_num?: number;
  /** 是否合作 0---未合作 1---已合作 */
  is_coop?: '';
  /** 合作品牌 */
  cooperation_brand?: string;
  /** 媒介类型 live---直播 video---短视频 photo---图文 */
  platform_type?: string;
  /** KOL标签 1---主播 2---红人 3---明星 */
  kol_tag?: number;
  /** 业务类型 1---营销业务 2---淘宝电波 */
  business_type?: number;
  /** 录入人 */
  add_by?: string;
  /** 场均销售额 */
  sales?: string;
  /** 当前页 */
  page?: number;
  /** 页长 */
  num?: number;
}

// 擅长类型
export interface category {
  code: number;
  name: string;
}

export interface Kol {
  kol_name: string; // kol名字
  kol_tag: number | string; // kol标签
  avg_sales_amount: string; // 场均销售额
  special_ticket: number | undefined; // 是否专票
  business_type: number[]; // 业务类型
  areas: string; // 擅长领域
  cooperation_brand?: string[];
  case?: string; // kol案例
}

export interface taobaoKol {
  id?: number;
  star_id?: number;
  star_name?: string;
  fans_number?: string;
  star_special_cost?: number; // 淘宝直播专场成本
  star_special_price?: number; // 淘宝直播专场刊例价(报价)
  star_mix_cost?: number; // 淘宝直播混播成本
  star_mix_price?: number; // 淘宝直播混播刊例价(报价)
  pv_average?: number; // 平均观看pv
  star_mobile?: number; // 主播电话
  star_wechat?: string; // 主播微信
  responsivity?: number; // 配合度
  sales_price_period?: number; // 客单价范围（0 => 0 ~ 100; 1 => 100 ~ 200; 2 => 200以上）
  wangwang_name?: string; // 淘客昵称
  is_cooperation?: number; // 0：不合作；1：已合作
  company_id?: number; // 公司（机构）id
  video_price?: number; // 视频成本价（元/条）
  photo_price?: number; // 图文成本价（元/篇）
  video_publish_price?: number; // 视频刊例价（元/条）
  photo_publish_price?: number; // 图文刊例价（元/篇）
  live_price_per_hour?: number; // 直播小时价
}

/**
 * KolVerifyStatus 达人审批状态
 */
export interface KolVerifyStatus {
  /** 状态名称 */
  label: string;
  /** 字段值 */
  value: number | '';
}
