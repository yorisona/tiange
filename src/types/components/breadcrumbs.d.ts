/**
 * 面包屑相关
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-28 16:04:30
 */

/**
 * 面包屑组件使用的路由简单配置
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-28 16:05:40
 * @prop {string} path 路由地址
 * @prop {string} title 路由名称
 */
export interface BreadcrumbsRoutes {
  /** @deprecated 路由地址 */
  path?: string;
  /** 路由名称 */
  name?: string;
  /** 路由名称(显示用) */
  title: string;
  params?: object;
  query?: object;
}
