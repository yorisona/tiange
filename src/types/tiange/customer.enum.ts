/*
 * @Author: 肖槿
 * @Date: 2021-11-08 10:20:27
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-04-21 16:50:42
 * @FilePath: \goumee-star-frontend\src\types\tiange\customer.enum.ts
 */
/**
 * 客户列表相关枚举
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-28 14:01:29
 */

/**
 * 店铺类型
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-28 14:02:18
 * @prop {number} taobao 1---淘宝店
 * @prop {number} tmall 2---天猫店
 */
export enum ShopType {
  /** 淘宝店 */
  Taobao = 1,
  /** 天猫店 */
  Tmall = 2,
  /** 抖音 */
  Douyin = 3,
  /** 抖音 */
  wechat_video = 4,
}

/**
 * 店铺类型Map
 */
export const ShopTypeMap = new Map([
  [0, '--'],
  [ShopType.Taobao, '淘宝店'],
  [ShopType.Tmall, '天猫店'],
  [ShopType.Douyin, '抖音店'],
  [ShopType.wechat_video, '微信视频号'],
]);

/**
 * 店铺类型选项
 */
export const ShopTypeOptions = [
  { value: ShopType.Taobao, label: '淘宝店' },
  { value: ShopType.Tmall, label: '天猫店' },
  { value: ShopType.Douyin, label: '抖音店' },
  { value: ShopType.wechat_video, label: '微信视频号' },
];

/**
 * 公司类型
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-29 00:18:05
 */
export const CompanyTypeOptions = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '同行机构',
    value: 1,
  },
  {
    label: '广告公司',
    value: 2,
  },
  {
    label: '品牌TP',
    value: 3,
  },
  {
    label: '直客',
    value: 4,
  },
];

/**
 * 客户分类列表
 */
export const CustomerClassOptions = [
  {
    label: '全部客户分类',
    value: 0,
  },
  {
    label: '普通客户',
    value: 1,
  },
  {
    label: '重点客户',
    value: 2,
  },
  {
    label: '战略客户',
    value: 3,
  },
  {
    label: 'KA客户',
    value: 4,
  },
];
