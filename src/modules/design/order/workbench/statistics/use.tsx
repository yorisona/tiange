import { GetUserManHourCardData } from '@/services/design';
import { useRequest } from '@gm/hooks/ahooks';

export enum TypesOfWorkingHoursColor {
  project = '#3F8EF6',
  design = '#984DFF',
  other = '#09ce98',
  overtime = '#fe365c',
}
/* 工时类型 */
export const workingHoursColorMap = new Map([
  [0, TypesOfWorkingHoursColor.project],
  [1, TypesOfWorkingHoursColor.design],
  [2, TypesOfWorkingHoursColor.other],
  [3, TypesOfWorkingHoursColor.overtime],
]);

/* 设计师类型 */
export const designerType = new Map([
  // ['创意设计师', '#F4EDFF'],
  // ['空间设计师', 'rgba(254, 54, 92, 0.1)'],
  // ['平面设计师', '#FFF5E8'],
  // ['体验设计师', '#F4F8FF'],
  // ['视觉设计部经理', 'rgb(255 243 222)'],
  ['g91f1e471dddf7c7', '#F4EDFF'], //空间设计组
  ['4fcg712f29499482', 'rgba(254, 54, 92, 0.1)'], //平面设计组
  ['ba9d4799b5gad788', '#FFF5E8'], //创意设计组
]);

/* 工时方 */
export enum workingHoursDirection {
  /** 项目方 */
  project = 0,
  /** 需求方 */
  demandSide = 1,
}

/* 接口类型 */
export enum interfaceType {
  /** 工作台-设计统计 */
  workbench = 0,
  /** 视觉设计统计-管理者 */
  manager = 1,
}

export const workingHoursDirectionMap = new Map([
  [0, '项目方'],
  [1, '需求方'],
]);

/* 新增工时类型 */
type ManHourBelong = 0 | 1;
type ManHourType = 0 | 1 | 2 | 3;

export interface AddWork {
  content: string;
  end_time: string;
  man_hour_belong: ManHourBelong;
  man_hour_date: string;
  man_hour_id: number;
  man_hour_type: ManHourType;
  remark?: string;
  start_time: string;
  target_id: number;
}

export const useConfig = () => {
  const getUserManHourCardData = useRequest(GetUserManHourCardData, {
    manual: true,
  });

  return {
    getUserManHourCardData,
  };
};
