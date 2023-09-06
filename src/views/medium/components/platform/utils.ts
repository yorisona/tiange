import { getPositiveNumber } from '@/utils/string';

/**
 * 数据处理封装
 * 临时用下
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-26 16:59:32
 */
export const setPositiveNumber = <T, K extends keyof T>(event: KeyboardEvent, obj: T, key: K) => {
  const val = getPositiveNumber((event.target as HTMLInputElement).value.replace(/[^.\d]+/gu, ''));

  obj[key] = val as unknown as T[K];

  (event.target as HTMLInputElement).value = val;
};
