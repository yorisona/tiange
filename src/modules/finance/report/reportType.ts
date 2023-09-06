/*
 * @Author: 肖槿
 * @Date: 2021-12-15 14:07:32
 * @Description: 财务报表类
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-12-21 16:12:05
 * @FilePath: \goumee-star-frontend\src\modules\finance\report\reportType.ts
 */
import { OptionType } from '@/types/base/advanced';
import { PaginationParams } from '@/types/base/pagination';

export enum IncomeOrPaySearchType {
  /** 收款时间 */
  incomeDate = 1,
  /** 收款账期时间 */
  incomeAccountDetailDate,
  /** 付款时间 */
  payDate,
  /** 付款账期时间 */
  payAccountDetailDate,
}
export interface reportFilterParams extends PaginationParams {
  date?: string; // 日期
  account_detail_date?: string; // 账期日期
  settlement_date?: string; // 结算周期
  income_or_pay_search_type?: IncomeOrPaySearchType; // 收付款搜索类型
  income_or_pay_date?: string; // 收付款搜索时间
  business_type?: string; // 业务类型
  project_name?: string; // 项目id或项目名称

  /** 收款搜索类型. 表单用，不作为接口参数 */
  income_search_type?: IncomeOrPaySearchType;
  /** 收款搜索时间. 表单用，不作为接口参数 */
  income_date?: string;
  /** 付款搜索类型. 表单用，不作为接口参数 */
  pay_search_type?: IncomeOrPaySearchType;
  /** 付款搜索时间. 表单用，不作为接口参数 */
  pay_date?: string;
}

export const IncomeSearchTypeMap = new Map([
  [IncomeOrPaySearchType.incomeDate, '收款时间'],
  [IncomeOrPaySearchType.incomeAccountDetailDate, '账期时间'],
]);

export const IncomeSearchTypeOptions = (() => {
  const options: OptionType[] = [];
  IncomeSearchTypeMap.forEach((val, key) => {
    options.push({
      label: val,
      value: key,
    });
  });
  return options;
})();

export const PaySearchTypeMap = new Map([
  [IncomeOrPaySearchType.payDate, '付款时间'],
  [IncomeOrPaySearchType.payAccountDetailDate, '账期时间'],
]);

export const PaySearchTypeOptions = (() => {
  const options: OptionType[] = [];
  PaySearchTypeMap.forEach((val, key) => {
    options.push({
      label: val,
      value: key,
    });
  });
  return options;
})();

export const busType = new Map([
  [1, '营销业务'],
  [3, '抖音店播'],
  [2, '淘宝店播'],
  [4, '基地业务'],
  [5, '创新项目'],
  [6, '区域店播'],
  [7, '本地生活'],
  [8, '淘宝甄选'],
]);

export const platformType = new Map([
  [2, '淘宝'],
  [1, '抖音'],
]);
export const cooperationType = new Map([
  [1, '直播'],
  [2, '视频'],
  [3, '图文'],
]);
// 预收收款方式
export const gatherType = new Map([
  [1, 'V任务'],
  [2, '支付宝'],
  [3, '对公银行'],
  [4, '阿里妈妈'],
  [5, '巨量百应'],
]);
// 预付付款方式
export const gatherPreType = new Map([
  [1, '银行卡'],
  [2, 'V任务'],
  [3, '对公银行'],
  [4, '支付宝'],
]);
