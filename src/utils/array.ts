/**
 * 数组函数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-09 00:59:44
 */

export function groupBy<T extends Record<string, any>, K extends keyof T>(array: T[], key: K) {
  const groups: Partial<Record<K, T[]>> = {};
  array.forEach(obj => {
    groups[obj[key]] = groups[key] ?? [];
    groups[obj[key]]?.push(obj);
  });

  return groups;
}
