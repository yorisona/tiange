/**
 * 部门管理 service
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:37:42
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=58&itf=1473
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
import { HttpResponse } from '@/types/base/http';

import * as APIs from '@/apis/department';
import { DepartmentForm, DepartmentTree } from '@/types/tiange/department';

/**
 * 部门树
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:38:34
 */
export const GetDepartmentList = async (): Promise<HttpResponse<DepartmentTree[]>> =>
  Get(APIs.DEPARTMENT_TREE_API);

/**
 * 保存部门
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:38:34
 */
export const SaveDepartment = async (payload: DepartmentForm): Promise<HttpResponse<undefined>> =>
  Post(APIs.DEPARTMENT_SAVE_API, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 删除部门
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:39:42
 */
export const DeleteDEPARTMENT = async (id: number): Promise<HttpResponse<undefined>> =>
  Post(APIs.DEPARTMENT_DELETE_API.replace(':id', `${id}`));
