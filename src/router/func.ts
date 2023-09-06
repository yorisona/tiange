/**
 * 路由专属函数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-25 10:31:03
 */
import { Route } from 'vue-router';
import { ObjectMap } from '@/utils/func';
import { REG_ONLY_DIGITAL } from '@/const/regexp';

/**
 * 路由参数转换成组件Props
 * ```
 * 基本只有两种类型 number / string
 * 现在只对纯数字字符串 /^\d+$/u 进行转为 int 的处理
 * ```
 * @param {Route} route 当前路由
 * @see {@link src/const/regexp.ts#REG_ONLY_DIGITAL}
 */
export const routeParams2Props = (route: Route) =>
  ObjectMap({ ...route.params }, ([key, val]) =>
    REG_ONLY_DIGITAL.test(val) ? [key, parseInt(val, 10)] : [key, val],
  );

/**
 * props 转路由参数
 * ```
 * 主要是将 number 转 string
 * ```
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-26 14:28:10
 */
export const props2RouteParams = (props: Record<string, string | number | undefined>) =>
  ObjectMap({ ...props }, ([key, val]) => [key, typeof val === 'number' ? `${val}` : val]);
