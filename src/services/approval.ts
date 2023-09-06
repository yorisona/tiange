/**
 * Approval
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-28 13:57:34
 */
import { Get } from '@/utils/request';
import { HttpResponse } from '../types/base/http';

export interface IResSchedule {
  id: number;
  studio_name: string;
  // 开始时间
  start_time: number;
  // 结束时间
  end_time: number;
  shop_live_id: number;
  project_name: string;
}
export default {
  /** 中控台-我的排版 **/
  QUERY_OPERATOR_SCHEDULE: (): Promise<
    HttpResponse<
      {
        date_str: string;
        data_list: IResSchedule[];
      }[]
    >
  > => Get('/api/approval/query_operator_schedule'),

  /** 我的代办 **/
  WAITING_SCHEDULES: (): Promise<HttpResponse<any>> => Get('/api/approval/waiting_schedules'),
};
