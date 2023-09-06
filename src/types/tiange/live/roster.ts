/**
 * 类型 - 店铺代播 - 排班查询
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-19 14:00:12
 */
import { BusinessTypeEnum } from '@/types/tiange/common';

/**
 * 项目排班搜索类型
 * ```
 * project_name---项目名称
 * project_uid---项目编号
 * ```
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-19 16:06:47
 */
export enum ProjectScheduleQuerySearchType {
  /** 项目名称 */
  ProjectName = 1,
  /** 项目编号 */
  ProjectUid,
}

export const ProjectScheduleQuerySearchTypeOptions = [
  { value: ProjectScheduleQuerySearchType.ProjectName, label: '项目名称' },
  { value: ProjectScheduleQuerySearchType.ProjectUid, label: '项目编号' },
];

/**
 * 项目排班查询表单
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-19 15:16:00
 */
export interface ProjectScheduleQueryForm {
  /** 日期范围 */
  date: string[];
  /** 业务类型 */
  business_type: BusinessTypeEnum | '';
  /** 项目经理ID */
  project_manager_id: number | '';
  /** 搜索类型 */
  search_type: ProjectScheduleQuerySearchType;
  /** 搜索关键词 */
  search_value: string;
}

/**
 * 项目排班查询参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-19 13:59:26
 */
export interface ProjectScheduleQueryParams {
  /** 开始日期 */
  start_date?: string;
  /** 结束日期 */
  end_date?: string;
  /** 业务类型 1---营销业务, 2---淘宝电波, 3---抖音店播 */
  business_type?: BusinessTypeEnum;
  /** 项目经理ID */
  project_manager_id?: number;
  /**
   * 搜索类型
   * ```
   * 1. project_name---项目名称
   * 2. project_uid---项目编号
   * ```
   * ! 需配合 `search_value` 参数
   */
  search_type?: ProjectScheduleQuerySearchType;
  /**
   * 搜索关键词
   * ```
   * ```
   * ! 需配合 `search_type` 参数
   */
  search_value?: string;
}

/**
 * 运营助理/主播数据
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-19 17:31:49
 */
export interface ProjectScheduleLiveRoomUser {
  /** 人员列表 */
  names: string[];
  /** 开始时间 */
  start_time: string;
  /** 结束时间 */
  end_time: string;
  /**
   * @deprecated 时间范围
   */
  time: string;
}

/**
 * 项目排班 - 排班数据 - 直播间数据
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-19 14:08:09
 */
export interface ProjectScheduleLiveRoomData {
  /** 直播间名称 */
  name: string;
  project_id: number;
  /** 场次ID */
  studio_id: number;
  /** 开始时间 */
  start_time: string;
  /** 结束时间 */
  end_time: string;
  /** 运营助理数据 */
  operator: ProjectScheduleLiveRoomUser[];
  /** 主播数据 */
  star: ProjectScheduleLiveRoomUser[];
}

/**
 * 项目排班 - 排班数据
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-19 14:06:28
 */
export interface ProjectScheduleData {
  /** 日期 */
  date: string;
  /** 直播间数据 */
  live_room: ProjectScheduleLiveRoomData[];
}

/**
 * 项目排班
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-19 14:02:24
 */
export interface ProjectSchedule {
  /** 项目名称 */
  project_name: string | null;
  /** 项目编号 */
  project_uid: string;
  /** 排班数据 */
  schedule_list: ProjectScheduleData[];
}
