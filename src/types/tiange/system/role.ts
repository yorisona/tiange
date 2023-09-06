/**
 * 系统 - 角色
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-20 13:59:16
 */

/**
 * 通过角色吗获取的(系统内置)用户信息
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-20 14:00:56
 */
export interface SimpleRole {
  /** ID */
  id: number;
  /** 用户名(花名) */
  username: string;
  /** 部门 */
  department_name: string;
}
