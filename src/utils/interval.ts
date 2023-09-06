/**
 * 区间
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-13 13:56:36
 */
import { PointInterval } from '@/types/base/advanced';

/**
 * 判断给定区间集合是否全覆盖了指定区间
 * ```
 * ! 给定区间集合需要均落在指定区间内且互不重叠
 * ```
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-13 16:23:48
 */
export const isCoverAll = (target: PointInterval, intervals: PointInterval[]) => {
  const intervalsLengthAll = intervals.map(el => el[1] - el[0]).reduce((acc, cur) => acc + cur, 0);

  return intervalsLengthAll === target[1] - target[0];
};

/**
 * 将给定区间集合中相邻区间合并
 * ```
 * 相邻区间即两个区间存在重合的端点
 * ```
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-13 16:27:09
 */
export const mergePoint = (intervals: PointInterval[]) => {
  const ret: PointInterval[] = [];
  intervals
    .sort((pointA, pointB) => pointA[0] - pointB[0])
    .forEach(([currentPointBegin, currentPointEnd], index) => {
      if (index === 0) {
        ret.push([currentPointBegin, currentPointEnd]);
      } else {
        const [pointBegin, pointEnd] = ret[ret.length - 1];
        if (pointEnd >= currentPointBegin && pointEnd <= currentPointEnd) {
          ret[ret.length - 1] = [pointBegin, currentPointEnd];
        } else if (pointEnd > currentPointEnd) {
          ret[ret.length - 1] = [pointBegin, pointEnd];
        } else {
          ret.push([currentPointBegin, currentPointEnd]);
        }
      }
    });

  return ret;
};

/**
 * 分割区间
 * ```
 * 使用给定区间集合(`intervals`)将指定区间(`target`)分割成一个新的区间集合
 * 新的区间集合范围不超过指定区间(`target`)
 * ```
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-13 16:32:40
 */
export const intervalSplit = (target: PointInterval, intervals: PointInterval[]) => {
  const intervalsPoints = intervals.flat().filter(el => el >= target[0] && el <= target[1]);

  const points = Array.from(new Set([...intervalsPoints, ...target])).sort();

  return points
    .map((el, index) => (index > 0 ? [points[index - 1], el] : undefined))
    .filter(el => el !== undefined);
};

/**
 * ```
 * 获取指定区间(`target`)中未被定区间集合(`intervals`)覆盖的部分
 * 返回值是一个范围不超过指定区间(`target`)的区间集合
 * ```
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-13 16:38:46
 */
export const intervalFilter = (target: PointInterval, intervals: PointInterval[]) => {
  const mergedPoints = mergePoint(intervals);

  return intervalSplit(target, mergedPoints).filter(
    el => !mergedPoints.map(_el => JSON.stringify(_el)).includes(JSON.stringify(el)),
  ) as PointInterval[];
};
