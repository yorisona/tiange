/**
 * @Author: 肖槿
 * @Date: 2020-04-30 09:29:32
 * @Description: 过滤器
 * @LastEditors: 肖槿
 * @LastEditTime: 2020-04-30 10:49:21
 * @FilePath: \goumee-star-frontend\src\utils\filter.js
 */
// @2ts-nocheck
import { redioType } from '@/const/options';
import { areaType } from '@/const/kolConst';
import { FeiShuDepartment } from '@/types/tiange/live';

export const valueToText = (value: undefined, typeList: any[]) => {
  if (value !== undefined && typeList.length) {
    const result = typeList.filter(val => {
      return val.value === value;
    })[0];
    return (result && result.text) || '';
  } else {
    return value;
  }
};

export const douyinType = (val: string | number) => {
  const hasT = redioType.find(item => item.value === Number(val));
  return hasT ? hasT.label : '--';
};

export const yesOrno = (val?: string | number) => {
  const _val = String(val);
  switch (_val) {
    case '1':
      return '是';
    case '0':
      return '否';
    default:
      return '--';
  }
};

/**
 * 根据 key 值获取擅长领域名称
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-21 01:34:42
 * @param   {string|number} val
 */
export const areaStr = (val: string | number) =>
  areaType.find(area => area.key === Number(val))?.value ?? '--';

export const departmentFilterDisabled = (
  list: FeiShuDepartment[],
  isDisabled = true,
  level = 2,
) => {
  for (let i = 0; i < list.length; i++) {
    const curItem = list[i];
    curItem.disabled = isDisabled;
    curItem.sons.forEach((item: FeiShuDepartment) => {
      if (level === 2) {
        item.sons = [];
      } else {
        item.sons.forEach(item2 => {
          item2.sons = [];
        });
      }

      // const map = (list: FeiShuDepartment[]) => {
      //   list.forEach((child: FeiShuDepartment) => {
      //     child.disabled = true;
      //     map(child.sons);
      //   });
      // };
      // map(item.sons);
    });
  }
};
