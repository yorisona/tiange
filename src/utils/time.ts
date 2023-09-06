import moment from 'moment';
/**
 * 时间工具函数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-11 14:18:35
 */
import { MILLIONSECONDS_OF_DAY, MILLIONSECONDS_OF_MINUTE } from '@/const/time';

/**
 * 获取时间(Date对象)
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-11 14:20:19
 */
export const getDate = (timestamp: Date | number = Date.now()) =>
  typeof timestamp === 'number' ? new Date(timestamp) : timestamp;

/**
 * 获取时间戳
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-11 14:20:31
 */
export const getTimestamp = (date?: Date) => date?.getTime() ?? Date.now();

/**
 * 获取本周第一天
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-11 14:26:20
 */
export const getFirstDayOfWeek = (timestamp: Date | number = Date.now()) => {
  const date = getDate(timestamp);

  const startTimestamp = date.getTime() - (date.getDay() - 1) * MILLIONSECONDS_OF_DAY;

  const startDate = new Date(
    startTimestamp -
      ((startTimestamp % MILLIONSECONDS_OF_DAY) -
        new Date().getTimezoneOffset() * MILLIONSECONDS_OF_MINUTE),
  );

  return startDate;
};

/**
 * 获取本周最后一天
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-11 15:12:38
 */
export const getLastDayOfWeek = (timestamp: Date | number = Date.now()) => {
  const date = getDate(timestamp);
  const end_date = new Date(date.getTime() + (7 - date.getDay()) * MILLIONSECONDS_OF_DAY);

  return new Date(end_date);
};

/**
 * 获取本周第一天和最后一天
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-11 15:34:40
 */
export const getWeekDateRange = (timestamp: Date | number = Date.now()) => [
  getFirstDayOfWeek(timestamp),
  getLastDayOfWeek(timestamp),
];

/**
 * 格式化
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-11 15:39:10
 */
export const format = (time: Date | number, fmt = 'YYYY-mm-dd HH:ii:ss') => {
  const date = typeof time === 'number' ? moment(time).toDate() : time;
  // new Date(time) : time;
  const options = {
    /** 年 */
    'Y+': date.getFullYear().toString(),
    /** 月 */
    'm+': (date.getMonth() + 1).toString(),
    /** 日 */
    'd+': date.getDate().toString(),
    /** 时 */
    'H+': date.getHours().toString(),
    /** 分 */
    'i+': date.getMinutes().toString(),
    /** 秒 */
    's+': date.getSeconds().toString(),
  };

  let ret = fmt;

  Object.entries(options).forEach(([key, val]) => {
    const [_, str] = new RegExp('(' + key + ')').exec(fmt) ?? ['', ret];
    if (_ !== '') {
      ret = ret.replace(str, str.length === 1 ? val : val.padStart(str.length, '0'));
    }
  });

  return ret;
};

/**
 * 根据基准时间戳获取上个月首日时间戳
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-11 15:52:47
 */
export const getDayOfPrevMonth = (timestamp: Date | number = Date.now()) => {
  const _date = getDate(timestamp);

  const month = (_date.getMonth() + 11) % 12;
  const year = _date.getFullYear() - (month === 11 ? 1 : 0);
  const monthStr = `${month + 1}`.padStart(2, '0');

  return new Date(`${year}-${monthStr}-01T00:00:00`);
};

/**
 * 根据基准时间戳获取下个月首日时间戳
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-11 15:53:27
 */
export const getDayOfNextMonth = (timestamp: Date | number = Date.now()) => {
  const _date = getDate(timestamp);

  const month = (_date.getMonth() + 1) % 12;
  const year = _date.getFullYear() + (month === 0 ? 1 : 0);
  const monthStr = `${month + 1}`.padStart(2, '0');

  return new Date(`${year}-${monthStr}-01T00:00:00`);
};

/** 获取一天结束时间点格式化字符串 */
export const getEndOfDay = (timestamp: Date | number = Date.now()) =>
  format(getDate(timestamp), 'YYYY-mm-dd 23:59:59');

/** 获取一天开始时间点格式化字符串 */
export const getStartOfDay = (timestamp: Date | number = Date.now()) =>
  format(getDate(timestamp), 'YYYY-mm-dd 00:00:00');

/** 获取一天开始时间点时间戳 */
export const getStartOfDayTimestamp = (timestamp: Date | number = Date.now()) =>
  moment(getStartOfDay(timestamp)).valueOf();

/**
 * 判断闰年
 * ```
 * 注：现行全球通用的公历(格里高利历)从1582年起使用，具体可查阅下方参考链接
 * ```
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-14 16:32:01
 * @see {@link https://zh.wikipedia.org/wiki/%E6%A0%BC%E9%87%8C%E6%9B%86}
 * @see {@link https://baike.baidu.com/item/%E5%85%AC%E5%85%83/17855}
 */
export const isLeap = (year: number) => year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);

const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * 获取某年某月天数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-14 17:19:48
 */
export const getDaysInMonth = (year: number, month: number) =>
  daysInMonth[month] + (isLeap(year) && month === 1 ? 1 : 0);

export class DateHelper {
  /**
   * 获取最近的7天开始到接触
   */
  static getRecent7Days() {
    const nowDate = new Date();
    const start = format(nowDate, 'YYYY-mm-dd');
    const end = format(nowDate.getTime() + 6 * 24 * 60 * 60 * 1000, 'YYYY-mm-dd');
    return [start, end];
  }
}
