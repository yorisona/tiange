/**
 * fetch 相关
 * 一些奇奇怪怪的 fetch / ajax 封装
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-08-08 18:30:40
 */
import { HttpResponse, ListResponse, ListResponseData } from '@/types/base/http';
import { PaginationParams } from '@/types/base/pagination';

/**
 * 根据给定请求参数列表和请求函数批量发起请求
 * ```
 * 请求数量过多可能会占用过多资源
 * 可参考使用 @see {@link Fetch.GroupFetch}
 * ```
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-08-09 05:41:56
 * @param {P[]} payloadArray 请求参数数组
 * @param {(payload: P) => Promise<HttpResponse<R>>} fn qingqiu
 * @return {Promise<HttpResponse<R>[]>}
 */
export const All = async <P extends Record<string, any>, R>(
  payloadArray: P[],
  fn: (payload: P) => Promise<HttpResponse<R>>,
): Promise<HttpResponse<R>[]> => Promise.all(payloadArray.map(payload => fn(payload)));

/**
 * 根据给定请求参数列表和请求函数批量发起请求
 * ```
 * 若尝试请求的数量过多会分组进行，防止占用过多资源
 * 单次过多没用，浏览器可能会hold住等待其它请求结束
 * 默认 8 次请求一组( why 8 ? 见下文)
 * 仅处理批量的请求，不对返回结果做更多处理
 * ```
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-08-09 20:28:20
 * @param {P[]} payloadArray 请求参数列表
 * @param {(payload: P) => Promise<HttpResponse<R>>} fn 请求函数
 * @param {number} size 每次批量请求数量，默认 8
 *
 * ```
 * 关于为什么默认值设为 8 可参考如下问答和博文
 * 简单来讲就是浏览器对同域名的并发请求资源数是存在限制的，目前看最大为 8
 * 设置数超过 8 是可行的，但是超过的部分在实际发起请求之前
 * 会有一段 stalled 时间
 * 最终效果跟设置为 8 是差不多的
 * 如果实际业务场景中确实有数量超过 8 的并发请求同时发起且对时间要求较高
 * 应该考虑对资源配置多个域名来避开同域名的请求数限制
 * @see {@link https://www.zhihu.com/question/20474326/answer/15696641|知乎问答}
 * @see {@link http://www.stevesouders.com/blog/2008/03/20/roundup-on-parallel-connections/|Roundup on Parallel Connections}
 * ```
 */
export const GroupFetch = async <P extends Record<string, any>, R>(
  payloadArray: P[],
  fn: (payload: P) => Promise<HttpResponse<R>>,
  size?: number,
) => {
  // 为保持一定的独立性，此处转换不依赖 getCleanObjFromVue
  const list: P[] = JSON.parse(JSON.stringify(payloadArray));
  const result = [];
  const _size = size ?? 8;

  for (let index = 0; index < list.length; index += _size) {
    const response = await All(list.slice(index, index + _size), fn);

    result.push(...response);
  }

  return result;
};

/**
 * 获取指定分页接口全部数据
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-08-06 15:26:58
 * @typeParam P 请求参数类型，必须继承分页参数接口
 * @typeParam Record 返回数据中的记录类型
 * @param {P} params 请求参数
 * @param {(payload: P) => Promise<ListResponse<Record>>} fn 列表请求方法
 * @param {number} size 分页大小，默认按200分片拉取数据
 * @return {Promise<ListResponseData<Record>>}
 */
export async function FetchAll<P extends PaginationParams, Record>(
  params: P,
  fn: (payload: P) => Promise<ListResponse<Record>>,
  size?: number,
): Promise<ListResponseData<Record>> {
  const _size = size ?? 200;
  const payload: P = {
    ...params,
    page_num: 1,
    num: _size,
  };

  const response = await fn(payload);

  const ret: { total: number; data: Record[] } = {
    total: 0,
    data: [],
  };

  if (response.data.error_code === 0) {
    ret.total = response.data.data.total;
    ret.data.push(...response.data.data.data);

    const leftTotal = Math.max(Math.ceil(ret.total / _size) - 1, 0);

    const payloads = new Array(leftTotal)
      .fill(0)
      .map((_, index: number) => ({ ...payload, page_num: 2 + index }));

    const leftRows = await GroupFetch(payloads, fn).then(response =>
      response.map(res => res.data.data.data).flat(),
    );

    ret.data.push(...leftRows);
  }

  return ret;
}
