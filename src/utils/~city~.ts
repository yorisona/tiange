/**
 * 新的city处理
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-28 10:11:55
 */

import { City } from '@/types/tiange/city';

/**
 * 获取省市区数据
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-28 10:16:37
 */
export const fetchCities = async (): Promise<City[]> =>
  await fetch('/city.json').then(res => res.json());

// 扁平化处理
function cityFlat(city: City) {
  const { id, name, children } = city;
  return [{ id, name }, ...(children ?? [])];
}

/**
 * 将树状省市区数据转成扁平数组
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-28 10:49:36
 */
export const getFlatCities = (cities: City[]) => {
  return cities.flatMap(cityFlat).flatMap(cityFlat);
};

/**
 * 根据接口返回的省市区名称获取其id
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-28 10:51:20
 */
export const cityName2id = (names: string[], cityData: City[]) =>
  names.map(name => cityData.find(city => city.name === name)?.id ?? '');

/**
 * 根据省市区id获取名称
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-28 13:33:24
 */
export const cityId2name = (ids: string[], cityData: City[]) =>
  ids.map(name => cityData.find(city => city.id === name)?.name ?? '');
