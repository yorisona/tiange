/**
 * 功能角色管理api
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 15:44:42
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=58&itf=1478
 */

// 角色列表
export const ROLE_LIST_API = '/api/auth/query_role_v2';

// 保存角色
export const ROLE_SAVE_API = '/api/auth/save_role';

// 删除角色
export const ROLE_DELETE_API = '/api/auth/del_role/:id/';

/**
 * 系统角色
 * @author: wuyou <wuyou@goumee.com>
 * @since: 2020-12-25 13:38:09
 * @see: http://rap2.goumee.com/repository/editor?id=19&mod=58&itf=1482
 */

// 系统角色列表
export const SYSTEM_ROLE_LIST_API = '/api/auth/query_system_role';

// 更新系统角色
export const SYSTEM_ROLE_UPDATE_API = '/api/auth/update_system_role';

// 编辑系统角色-查询管理岗位/查询执行岗位
export const SYSTEM_ROLE_JOB_LIST_API = '/api/auth/get_job_list';
