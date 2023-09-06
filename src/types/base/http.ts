/**
 * 经过整理的统一的 http/net/ajax/request/response 相关类型声明
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-07-28 19:04:11
 * @external Axios
 */
import { AxiosResponse } from 'axios';

// 基本类型
/**
 * HTTP 响应数据
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-07-28 19:07:07
 *
 * ``` typescript
 * // ResponseData
 * null
 *
 * // HttpResponseData<ResponseData>
 * {
 *	code: 0,
 *	msg: '获取数据成功',
 *	data: null,
 * }
 * ```
 *
 * @typeParam ResponseData 接口返回数据
 */
export interface HttpResponseData<ResponseData> {
  error_code: number;
  message: string;
  data: ResponseData;
  success: boolean;
}

/**
 * HTTP 响应
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-07-28 19:05:06
 *
 * ```
 * 对应原本 HttpResponse
 * 无extra
 * data必定存在
 * ```
 */
export type HttpResponse<ResponseData> = AxiosResponse<{
  error_code: number;
  message: string;
  data: ResponseData;
  success: boolean;
}>;

// 针对列表接口特化
/**
 * 列表接口的数据
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-07-28 20:09:22
 * @deprecated
 */
export interface LHttpResponseListData<RecordData> {
  total: number;
  data: RecordData[];
}

/**
 * 列表接口的 HTTP 响应体
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-07-28 20:14:10
 * @deprecated 请使用 ListResponseData
 */
export type LHttpResponseData<RecordData> = LHttpResponseListData<RecordData>;

/**
 * 列表接口的 HTTP 响应体
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-07-31 15:31:13
 */
export type ListResponseData<RecordData> = {
  total: number;
  data: RecordData[];
};

/**
 * 列表接口的 HTTP 响应
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-07-28 19:12:58
 * @deprecated 请使用 ListResponse
 */
export type LHttpResponse<RecordData> = HttpResponse<LHttpResponseData<RecordData>>;

/**
 * 列表接口的 HTTP 响应
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-07-31 15:34:48
 */
export type ListResponse<RecordData> = HttpResponse<{
  total: number;
  data: RecordData[];
}>;
