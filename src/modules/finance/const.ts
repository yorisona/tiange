/*
 * @Author: 肖槿
 * @Date: 2021-05-19 13:33:06
 * @Description: 常量
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-05-25 15:24:40
 * @FilePath: \goumee-star-frontend\src\modules\finance\const.ts
 */

/** @description */
export const SettlementType = [
  {
    label: '全部',
    value: undefined,
  },
  {
    label: '抖音店播',
    value: 2,
  },
  {
    label: '淘宝店播',
    value: 1,
  },
  {
    label: '营销',
    value: 3,
  },
  {
    label: '淘宝CPS',
    value: 4,
  },
  {
    label: '抖音CPS',
    value: 5,
  },
  {
    label: 'V任务',
    value: 6,
  },
  {
    label: '营销-V任务',
    value: 7,
  },
];

/** @deprecated */
export const SettlementStatus = [
  {
    label: '全部',
    value: undefined,
  },
  {
    label: '未提交',
    value: 0,
  },
  {
    label: '待确认',
    value: 1,
  },
  {
    label: '已确认',
    value: 2,
  },
  {
    label: '退回',
    value: 3,
  },
];
