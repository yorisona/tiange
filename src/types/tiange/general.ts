/**
 * 此文件存放一些常规的类型, 其他的扩展的请 继承次接口
 * **/

/**
 * 分页查询参数
 */
export interface IGPageQuery {
  // 页码
  page_num: number;
  // 每页数量
  num: number;
  // 每页数量
  page_size?: number;
}
