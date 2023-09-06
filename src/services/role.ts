/**
 * 角色管理 service
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:45:42
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=58&itf=1478

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

import { HttpResponse, ListResponse } from '@/types/base/http';
import { Get, Post } from '@/utils/request';
import { ObjectFilterEmpty } from '@/utils/func';

import * as APIs from '@/apis/role';
import { Role, RoleForm, RoleQueryParams, SystemRole, SystemRoleForm } from '@/types/tiange/role';

/**
 * 角色列表
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:46:32
 */
export const GetRoleList = async (payload: RoleQueryParams): Promise<ListResponse<Role>> =>
  Get(APIs.ROLE_LIST_API, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 角色列表
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:49:32
 */
export const SaveRole = async (payload: RoleForm): Promise<HttpResponse<undefined>> =>
  Post(APIs.ROLE_SAVE_API, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 删除角色
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:50:32
 */
export const DeleteRole = async (id: number): Promise<HttpResponse<undefined>> =>
  Post(APIs.ROLE_DELETE_API.replace(':id', `${id}`));

/**
 * 系统角色 services
 * @author: wuyou <wuyou@goumee.com>
 * @since: 2020-12-25 13:38:09
 * @see: http://rap2.goumee.com/repository/editor?id=19&mod=58&itf=1482
 */

/**
 * 系统角色列表
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:49:32
 */
export const GetSystemRoleList = async (): Promise<ListResponse<SystemRole>> =>
  Get(APIs.SYSTEM_ROLE_LIST_API);

/**
 * 更新系统角色
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:49:32
 */
export const UpdateSystemRole = async (payload: SystemRoleForm): Promise<HttpResponse<undefined>> =>
  Post(APIs.SYSTEM_ROLE_UPDATE_API, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 查询管理岗位/查询执行岗位
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:49:32
 */
export const GetJobList = async (payload: {
  job_level: number | undefined;
  department_id: number | undefined;
  job_name: string | undefined;
}): Promise<HttpResponse<undefined>> =>
  Get(APIs.SYSTEM_ROLE_JOB_LIST_API, {
    params: { ...ObjectFilterEmpty(payload) },
  });
