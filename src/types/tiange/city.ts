/**
 * City
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-28 10:14:27
 */

/**
 * 省市区数据
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-28 10:15:27
 */
export interface City {
  /** 行政区编码 */
  id: string;
  /** 行政区名称 */
  name: string;
  /** 下属行政区列表 */
  children?: City[];
}
