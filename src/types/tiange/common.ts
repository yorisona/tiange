/**
 * 通用常量
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 10:24:42
 */

/**
 * 业务类型
 * ```
 * 1---营销业务
 * 2---淘宝店播
 * 3---抖音店播
 * 4---基地业务
 * 5---创新项目
 * ```
 */
export enum BusinessTypeEnum {
  /** 营销业务 */
  marketing = 1,
  /** 淘宝店播 */
  taobao = 2,
  /** 抖音店播 */
  douyin = 3,
  /** 基地业务 */
  base = 4,
  /** mcn业务 */
  mcn = 5,
  /** 区域电播*/
  area = 6,
  /** 本地生活 */
  locallife = 7,
  /** 淘宝甄选*/
  taobaopick = 8,
  /** 供应链 */
  supplyChain = 9,
}

/** 角色类型 */
export enum RoleTypeEnum {
  /** 普通角色 */
  common = 1,
  /** 系统角色 */
  system = 2,
}

export const BusinessTypeMap = new Map([
  [BusinessTypeEnum.marketing, '整合营销'],
  [BusinessTypeEnum.douyin, '抖音店播'],
  [BusinessTypeEnum.taobao, '淘宝店播'],
  [BusinessTypeEnum.base, '基地业务'],
  [BusinessTypeEnum.mcn, '创新项目'],
  [BusinessTypeEnum.area, '区域店播'],
  [BusinessTypeEnum.locallife, '本地生活'],
  [BusinessTypeEnum.taobaopick, '淘宝甄选'],
  [BusinessTypeEnum.supplyChain, '供应链'],
]);

export const BusinessTypeOptions = [
  { value: BusinessTypeEnum.marketing, label: '整合营销' },
  { value: BusinessTypeEnum.mcn, label: '创新项目' },
  { value: BusinessTypeEnum.douyin, label: '抖音店播' },
  { value: BusinessTypeEnum.taobao, label: '淘宝店播' },
  // { value: BusinessTypeEnum.base, label: '基地业务' },
  { value: BusinessTypeEnum.locallife, label: '本地生活' },
  { value: BusinessTypeEnum.taobaopick, label: '淘宝甄选' },
  { value: BusinessTypeEnum.supplyChain, label: '供应链' },
];
export const BusinessTypeAllOptions = [
  { value: BusinessTypeEnum.marketing, label: '整合营销' },
  { value: BusinessTypeEnum.mcn, label: '创新项目' },
  { value: BusinessTypeEnum.douyin, label: '抖音店播' },
  { value: BusinessTypeEnum.taobao, label: '淘宝店播' },
  { value: BusinessTypeEnum.base, label: '基地业务' },
  { value: BusinessTypeEnum.area, label: '区域店播' },
  { value: BusinessTypeEnum.locallife, label: '本地生活' },
  { value: BusinessTypeEnum.taobaopick, label: '淘宝甄选' },
  { value: BusinessTypeEnum.supplyChain, label: '供应链' },
];
/** 项目阶段
 * 1-项目创建
 * 2-项目试播
 * 3-项目执行
 * 4-区域执行
 * 5-项目完结
 */

export enum ProjectStatusEnum {
  /** 项目创建 */
  creation = 1,

  /** 项目试播 */
  tryLive = 2,

  /** 项目执行 */
  execution = 3,

  /** 区域执行 */
  regionExecution = 4,
  /** 项目完结 */
  finish = 5,
  /** 执行结束 */
  executionEnd = 6,
}

export const ProjectStatusMap = new Map([
  [ProjectStatusEnum.creation, '项目创建'],
  [ProjectStatusEnum.tryLive, '试播中'],
  [ProjectStatusEnum.execution, '项目执行中'],
  [ProjectStatusEnum.regionExecution, '区域执行中'],
  [ProjectStatusEnum.executionEnd, '执行结束'],
  [ProjectStatusEnum.finish, '已完结'],
]);

/** 合作类型 */
export enum CooperationTypeEnum {
  /** 区域 */
  region = 2,
  /** 自营 */
  selfSupport = 1,
}

export const CooperationTypeMap = new Map([
  [CooperationTypeEnum.region, '区域'],
  [CooperationTypeEnum.selfSupport, '自营'],
]);

/** 结算周期类型 */
export enum SettlementCycleTypeEnum {
  /** 月结 */
  month = 1,
  /** 季结 */
  quarter = 2,
  /** 半年 */
  halfAyear = 3,
}
export const SettlementCycleTypeMap = new Map([
  [SettlementCycleTypeEnum.month, '月结'],
  [SettlementCycleTypeEnum.quarter, '季结'],
  [SettlementCycleTypeEnum.halfAyear, '半年'],
]);

/** 店铺类目 */
export const CustomerCategoryMAP = new Map([
  [1, '美妆'],
  [2, '生活'],
  [3, '服饰'],
  [4, '美食'],
  [5, '母婴'],
  [6, '数码'],
  [7, '家装'],
  [8, '健康'],
  [9, '宠物'],
  [10, '时尚'],
  [11, '配饰'],
  [12, '家电'],
  [13, '测评'],
  [14, '旅行'],
  [15, '运动'],
  [16, '摄影'],
  [17, '情感'],
  [18, '汽车'],
  [19, '搞笑'],
  [20, '教育'],
  [21, '财经'],
  [22, '萌娃'],
  [23, '文化'],
  [24, '影视'],
  [25, '娱乐'],
  [26, '游戏'],
  [27, '海外'],
  [28, '才艺'],
  [29, '三农'],
  [30, '二次元'],
  [31, '高颜值'],
]);

export function newCategoryFormate(category: number) {
  if (category === 0) {
    return '无';
  } else {
    return CustomerCategoryMAP.get(category) ?? '无';
  }
}

export enum ProjectTypeEnum {
  /** 店播项目 */
  live = 1,
  /** 营销业务 */
  marketing = 2,
  /** 通用业务 */
  common_business = 3,
  /** 本地生活 */
  local_life = 4,
  /** 供应链 */
  supply_chain = 5,
}

export enum PartnerTypeEnum {
  /** 客户 */
  customer = 1,
  /** 供应商 */
  provider = 2,
}

export interface CommonDictionary {
  label: string;
  value: any;
}
