/**
 * 岗位管理 service
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:44:42
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=58&itf=1476
 *
 *      ┌─┐       ┌─┐ + +
 *   ┌──┘ ┴───────┘ ┴──┐++
 *   │                 │
 *   │       ───       │++ + + +
 *   ███████───███████ │+
 *   │                 │+
 *   │       ─┴─       │
 *   │                 │
 *   └───┐         ┌───┘
 *       │         │
 *       │         │   + +
 *       │         │
 *       │         └──────────────┐
 *       │                        │
 *       │                        ├─┐
 *       │                        ┌─┘
 *       │                        │
 *       └─┐  ┐  ┌───────┬──┐  ┌──┘  + + + +
 *         │ ─┤ ─┤       │ ─┤ ─┤
 *         └──┴──┘       └──┴──┘  + + + +
 *                神兽保佑
 *               代码无BUG!
 */

import { Get, Post } from '@/utils/request';
import { ObjectFilterEmpty } from '@/utils/func';
import { HttpResponse, ListResponse } from '@/types/base/http';

import * as APIs from '@/apis/job';
import { JobForm, Job, JobQueryParams } from '@/types/tiange/job';

/**
 * 岗位列表
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:44:34
 */
export const GetJobList = async (payload: JobQueryParams): Promise<ListResponse<Job>> =>
  Get(APIs.JOB_LIST_API, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 保存岗位
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:44:34
 */
export const SaveJob = async (payload: JobForm): Promise<HttpResponse<undefined>> => {
  // 关联部门传空数组时表示删掉原关联数据
  // 拎出来防止被过滤
  const { related_dep_ids, ...rest } = payload;

  return Post(APIs.JOB_SAVE_API, {
    ...ObjectFilterEmpty(rest),
    related_dep_ids,
  });
};

/**
 * 删除岗位
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:45:42
 */
export const DeleteJob = async (id: number): Promise<HttpResponse<undefined>> =>
  Post(APIs.JOB_DELETE_API.replace(':id', `${id}`));
