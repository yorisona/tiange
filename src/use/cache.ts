/**
 * 缓存相关
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-10 17:55:26
 */

import { ref } from '@vue/composition-api';

const isTargetProduction = process.env.VUE_APP_TARGET_ENV === 'production';

/**
 * 基于Map带id和时间戳的缓存数据
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-10 18:57:12
 */
export interface MapCacheRecord<T, K = number> {
  key: K;
  record: T;
  timestamp: number;
}

// * 生产环境 5.0分钟(300_000ms)
// * 其它环境 0.5分钟( 30_000ms)
/** 缓存失效时间默认值 */
const DEF_EXPIRATION = isTargetProduction ? 5 * 60 * 1000 : 0.5 * 60 * 1000;

/**
 * 基于Map的缓存
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-10 19:13:30
 * @param   {number} expiration 失效时间 默认 5分钟(生产环境) 0.5分钟(其它环境)
 */
export const useCache = <T, K = number>(expiration: number = DEF_EXPIRATION) => {
  const cache = ref(new Map<K, MapCacheRecord<T, K>>([]));

  /**
   * 获取缓存数据
   * ```
   * 数据不存在或者已经超过失效时间均返回 undefined
   * ```
   * @author  Jerry <superzcj_001@163.com>
   * @since   2020-12-10 19:08:02
   */
  const getCache = (key: K) => {
    const mapCacheRecord = cache.value.get(key);

    if (mapCacheRecord === undefined) {
      return undefined;
    } else {
      return mapCacheRecord.timestamp + expiration > Date.now() ? mapCacheRecord.record : undefined;
    }
  };

  /**
   * 设置缓存数据
   * @author  Jerry <superzcj_001@163.com>
   * @since   2020-12-10 19:00:07
   */
  const setCache = (key: K, record: T) => {
    const mapCacheRecord = {
      key,
      record,
      timestamp: Date.now(),
    };

    cache.value.set(key, mapCacheRecord);
  };

  /**
   * 删除某条Cache
   * @author  Jerry <jerry.hz.china@gmail.com>
   * @since   2021-06-10 00:01:58
   */
  const removeCache = (key: K) => cache.value.delete(key);

  /**
   * 清空Cache
   * @author  Jerry <jerry.hz.china@gmail.com>
   * @since   2021-06-10 00:02:43
   */
  const clearCache = () => {
    cache.value.clear();
  };

  return {
    getCache,
    setCache,
    removeCache,
    clearCache,
  };
};
