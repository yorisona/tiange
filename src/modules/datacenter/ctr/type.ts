/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-05-20 17:54:54
 */

export type TrendCycleType = 'day' | 'week' | 'month';
export interface CTRDetailQueryForm {
  project_id: number | string | undefined;
  dates: string[];
  shift_id: number | undefined;
}

export type CTRDetailRefFunction = (queryForm: CTRDetailQueryForm) => void;

export interface CTRDetailRefType {
  reload: CTRDetailRefFunction;
}

export interface CTRQueryForm {
  project_ids: number[] | undefined;
  trend_cycle: TrendCycleType;
  dates: string[];
}
