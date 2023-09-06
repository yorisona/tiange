/**
 * 日历相关
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-11 13:30:51
 */

/**
 * 日安排
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-11 13:58:20
 */
export interface DaySchedule {
  /** 场次ID */
  id: number;
  /** 标题 */
  title: string;
  /** 内容 */
  content: string;
  /** 内容颜色 */
  color?: string;
}

/**
 * 分组的日程安排
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-11 16:13:50
 */
export interface ScheduleGroup<T> {
  id: number;
  /** the day of the week */
  day: number;
  /** 本月第几天 */
  date: number;
  /** 标题 */
  title: string;
  /** 内容 */
  content: string;
  /** 颜色 */
  color: string;
  /** 原始数据 */
  original: T;
}

/**
 * 时间线中人员排期信息
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-11 21:57:58
 */
export interface UserTimelineSchedule {
  /** 开始时间 */
  start_time: string;
  /** 结束时间 */
  end_time: string;
  /** 人员名字 */
  name: string;
  /** 持续时间 */
  duration: number;
}

/**
 * 排期信息按时间段聚合版本
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-13 10:17:21
 */
export interface ScheduleInMap {
  /** 开始时间 */
  start_time: string;
  /** 结束时间 */
  end_time: string;
  /** 人员名字 */
  name: Array<string | null>;
  /** 持续时间 */
  duration: number;
}

/**
 * 用户时间线中的日程安排
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-11 21:54:23
 */
export interface TimelineSchedule<T> {
  /** ID */
  id: number;
  /** the day of the week */
  day: number;
  /** 开始时间 */
  start_time: string;
  /** 结束时间 */
  end_time: string;
  /** KOL(主播)排班 */
  kol: UserTimelineSchedule[];
  /** 运营排班 */
  operator: UserTimelineSchedule[];
  /** 原始数据 */
  original: T;
}

/**
 * 排班+时间线 排班数据
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-19 14:50:45
 */
export interface RosterTimelineSchedule {
  /** ID */
  id: number;
  project_id: number;
  /** 开始时间 */
  start_time: number;
  /** 结束时间 */
  end_time: number;
  /** 名称 */
  name: string;
  /** 内容 */
  content: string;
}

export type TimeLineHeight = 84 | 62 | 40;
