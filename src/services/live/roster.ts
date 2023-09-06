/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-05-26 17:46:53
 */
/**
 * 店铺代播 - 排班查询
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-19 13:43:24
 */
import { Get } from '@/utils/request';
import { ObjectFilterEmpty } from '@/utils/func';
import type { HttpResponse } from '@/types/base/http';
import type { ProjectSchedule, ProjectScheduleQueryParams } from '@/types/tiange/live/roster';

/**
 * 店铺代播 - 排班查询 - 查询项目排班
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-19 13:45:12
 */
export const ProjectScheduleQuery = async (
  payload: ProjectScheduleQueryParams,
): Promise<HttpResponse<ProjectSchedule[]>> =>
  Get('/api/shop_live/query_schedule_detail_by_project', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
