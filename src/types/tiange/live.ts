/**
 * 店铺代播相关
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-28 11:55:48
 */

import { BooleanType, DateStr, GmtTimeFields, RecordOperatorFields } from '../base/advanced';
import { PaginationParams } from '../base/pagination';
import { BusinessTypeEnum, CooperationTypeEnum } from '@/types/tiange/common';
import { Achievement } from './marketing/achievement';

/**
 * 排班查询参数
 * kol---主播
 * operator---运营助理
 * studio---直播间
 * project---项目排班
 */
export type RosterQueryType = 'kol' | 'operator' | 'studio' | 'project';

/**
 * 排班查询参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-28 11:56:27
 */
export interface RosterQueryParams {
  /** 查询类别 */
  // type: RosterQueryType;
  /** 开始日期 */
  start_date: DateStr;
  /** 结束日期 */
  end_date: DateStr;
  /** 主播id */
  kol_id?: number;
  /** 直播间ID */
  studio_id?: number;
  /** 业务类型 */
  business_type?: BusinessTypeEnum;
  /** 主播花名 */
  kol_name?: string;
  /** 项目名称 */
  project_name?: string;
}

/**
 * 排班查询表单
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-28 11:56:27
 */
export interface RosterQueryForm {
  /** 日期 */
  date: string[];
  /** 主播名称 */
  kol_id?: number;
  /** 直播间ID */
  studio_id?: number;
  /** 业务类型 */
  business_type?: BusinessTypeEnum;
}

/**
 * 跟踪事项查询参数
 * @author  tingzhu <tingzhu@goumee.com>
 * @since   2020-12-28 11:56:27
 */
export interface TrackMasterQueryParams {
  /** 数据量 */
  num: number;
  /** 页码 */
  page_num: number;
  /** 项目id */
  project_id: number;
}

/**
 * 跟踪事项列表
 * @author  tingzhu <tingzhu@goumee.com>
 * @since   2020-12-28 11:56:27
 */
export interface TrackMatter {
  /** 事项id */
  id: number | undefined;
  /** 跟踪事项 */
  track_matter: string;
  /** 预计完成日期 */
  expect_complete_date: string;
  /** 是否完成,0-否，1-是 */
  is_complete: BooleanType;
  /** 完成日期 */
  complete_date: string;
  /** 项目id */
  project_id: number;
}

/**
 * 跟踪事项表单
 * @author  tingzhu <tingzhu@goumee.com>
 * @since   2020-12-28 11:56:27
 */
export interface TrackMatterForm {
  /** 事项id */
  id: number | undefined;
  /** 跟踪事项 */
  track_matter: string;
  /** 预计完成日期 */
  expect_complete_date: string;
  /** 是否完成,0-否，1-是 */
  is_complete: boolean;
  /** 完成日期 */
  complete_date: string;
  /** 项目id */
  project_id: number | undefined;
}

/**
 * 直播状态
 * @prop {number} waitingSchedule 1---待排班
 * @prop {number} waitingLive 2---待直播
 * @prop {number} waitingTypeIn 3---待录入
 * @prop {number} lived 4---已直播
 */
export enum LiveDisplayStatus {
  /** 待排班 */
  waitingSchedule = 1,
  /** 待直播 */
  waitingLive,
  /** 待录入 */
  waitingTypeIn,
  /** 已直播 */
  lived,
}

export const LiveDisplayStatusMap = new Map([
  [LiveDisplayStatus.waitingSchedule, '待排班'],
  [LiveDisplayStatus.waitingLive, '待直播'],
  [LiveDisplayStatus.waitingTypeIn, '待录入'],
  [LiveDisplayStatus.lived, '已直播'],
]);

/**
 * 直播状态对应文字前景色
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-11 16:11:40
 */
export const LiveDisplayStatusColorMap = new Map([
  [LiveDisplayStatus.waitingSchedule, 'yellow'],
  [LiveDisplayStatus.waitingLive, 'green'],
  [LiveDisplayStatus.waitingTypeIn, 'yellow'],
  [LiveDisplayStatus.lived, 'gray'],
]);

/**
 * 直播场次搜索类型
 */
export enum LiveDisplaySearchType {
  /** 品牌名称 */
  brand_name = 1,
  /** 直播间名称 */
  studio_name,
  /** 客户名称 */
  shop_name,
  /** 项目编号 */
  project_uid,
  /** 直播标题 */
  live_title,
  /** 主播 */
  kol_name,
  /** 运营助理 */
  operation_assistant_name,
  /** 项目名称 */
  project_name,
}

/**
 * 直播场次列表查询参数
 * @author  tingzhu <tingzhu@goumee.com>
 * @since   2020-12-28 11:56:27
 */
export interface LiveDisplayQueryParams extends PaginationParams {
  /** 搜索值 */
  search_type?: LiveDisplaySearchType;
  /** 搜索关键词 */
  search_value?: string;
  /** 项目id */
  project_id?: number;
  /** 直播状态 */
  live_status?: LiveDisplayStatus;
  /** 直播开始时间 */
  live_start_date?: DateStr;
  /** 业务类型 */
  business_type: undefined | number;
}

export interface LiveDisplayBaseGoal {
  /** 目标销售额 */
  target_sale_amount?: string | number;
  /** 预计投放 */
  expect_throw_amount?: string | number;
  /** 目标增粉 */
  target_add_fans?: string | number;
}

export interface LiveDisplaySelectionGoalDetail {
  /** 计划销量 */
  plan_sale_count?: string | number;
  /** 计划销售额 */
  plan_sale_amount?: string | number;
  /** 计划直播商品数 */
  plan_live_goods?: string | number;
  /** 预估单价 */
  pre_unit_price?: string | number;
  /** 预估单品销量 */
  pre_unit_sales?: string | number;
}

export interface LiveDisplaySelectionGoal {
  /** 福利款 */
  fuli?: LiveDisplaySelectionGoalDetail;
  /** 引流款 */
  yinliu?: LiveDisplaySelectionGoalDetail;
  /** 日常款 */
  richang?: LiveDisplaySelectionGoalDetail;
  /** 形象款 */
  xingxiang?: LiveDisplaySelectionGoalDetail;
}

/**
 * 直播场次
 * @author  tingzhu <tingzhu@goumee.com>
 * @since   2020-12-28 11:56:27
 */
export interface LiveDisplay {
  /** 场次id */
  id: number;
  add_by_username: string;
  add_create_time: string;
  /** 品牌名称 */
  brand_name: string;
  /** 直播开始时间 */
  live_start_time: string;
  /** 直播结束时间 */
  live_end_time: string;
  /** 直播状态 */
  live_status: LiveDisplayStatus;
  /** 直播标题 */
  live_title: string;
  /** 项目id */
  project_id: number;
  /** 项目编号 */
  project_uid: string;
  /** 项目名称 */
  project_name: string;
  /** 直播间id */
  studio_id: number;
  /** 直播间名称 */
  studio_name: string;
  /** 业务类型 */
  business_type: number;
  /** 备注 */
  remark: string;
  /** 基础目标 */
  base_goal: LiveDisplayBaseGoal | undefined;
  /** 选品目标 */
  selection_goal: LiveDisplaySelectionGoal | undefined;
  live_type: number;
  expect_gmv: number | string;
  /** 非空自动获取 空是手动添加 */
  compass_shop_live_room_id: number | undefined;
  /** true表示可编辑主播排班；false表示不可编辑主播排班 */
  allow_update_kol_schedule: boolean | undefined;
}

/**
 * 直播场次表单
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-08 00:21:03
 */
export interface LiveDisplayForm {
  /** 场次id */
  id?: number;
  /** 项目id */
  project_id: number | '';
  /** 直播标题 */
  live_title: string;
  /** 直播时间 */
  // live_time: string[];
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  /** 直播间id */
  studio_id: string | number | undefined;
  /** 直播间名称 */
  studio_name: string;
  /** 备注 */
  remark: string;
  /** 基础目标 */
  base_goal?: LiveDisplayBaseGoal;
  /** 选品目标 */
  selection_goal?: LiveDisplaySelectionGoal;
  /** 场次类型   */
  live_type?: string | number;
  /** 预计GMV**/
  expect_gmv?: string | number;
}

/**
 * 直播场次 - 新建参数
 */
export interface LiveDisplayCreateParams {
  /** 项目id */
  project_id: number;
  /** 直播标题 */
  live_title: string;
  /** 直播开始时间 */
  live_start_time: DateStr;
  /** 直播结束时间 */
  live_end_time: DateStr;
  /** 直播间id */
  studio_id: number | undefined;
  /** 备注 */
  remark?: string;
  /** 基础目标 */
  base_goal?: LiveDisplayBaseGoal;
  /** 选品目标 */
  selection_goal?: LiveDisplaySelectionGoal;
  kol_schedule_infos: KolScheduleInfo[];
  operator_schedule_infos: OperatorScheduleInfo[];
}

/**
 * 直播场次 - 编辑参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-08 00:42:58
 */
export interface LiveDisplayEditParams extends LiveDisplayCreateParams {
  /** 场次ID */
  id: number;
}

/**
 * 直播间
 * @author  tingzhu <tingzhu@goumee.com>
 * @since   2020-12-28 11:56:27
 */
export interface Studio {
  id: number;
  studio_name: string;
}

export interface ProjectIDInfo {
  /** 项目ID */
  id: number;
  /** 项目UID */
  project_uid: string;
  /** 品牌名称(有用，接口缺) */
  brand_name: string;
  studio_id: number | undefined;
  studio_name: string;
  business_type: number;
}

/**
 * 直播场次 - 项目编号
 */
export interface LiveDisplayProjectIdListParams {
  project_uid: string;
  cooperation_type?: CooperationTypeEnum;
  business_type?: number;
}

/**
 * 项目排期视图类型
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-09 15:21:51
 */
export enum ScheduleType {
  /** 月排期 */
  Month = 1,
  /** 周排期 */
  Week = 2,
}

/**
 * 项目排期查询参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-09 15:20:15
 */
export interface ProjectScheduleQueryParams {
  /** 项目ID */
  project_id: number;
  /** 开始日期 */
  start_date: DateStr;
  /** 结束日期 */
  end_date: DateStr;
  /** 项目排期视图类型 */
  schedule_type: ScheduleType;
}

/** KOL(主播)排期列表 */
export interface KolSchedule extends GmtTimeFields, RecordOperatorFields {
  /** ID */
  id: number;
  /** KOL ID */
  kol_id: number;
  /** KOL 名称 */
  kol_name: string;
  /** 真实姓名 */
  real_name?: string;
  /** 直播间ID */
  studio_id: number;
  /** 直播间名称 */
  studio_name: string;
  /** 直播间标题 */
  live_title: string;
  /** 直播ID */
  shop_live_id: number;
  /** 持续时间 */
  duration: number;
  /** 开始时间 */
  start_time: DateStr;
  /** 结束时间 */
  end_time: DateStr;
  /** flag */
  flag: number;
  project_id: number;
  project_name: string;
  /** 项目编码 */
  project_uid: string;
  /** 业务类型1-营销业务，2-淘宝店播，3-抖音店播 */
  business_type: BusinessTypeEnum;
}

/** 运营排期列表 */
export interface OperatorSchedule extends GmtTimeFields {
  /** ID */
  id: number;
  user_id: number;
  /** 运营 ID */
  operator_id: number;
  /** 运营 名称 */
  operator_name: string;
  shop_live_id: number;
  modified_by: number;
  add_by: number;
  duration: number;
  start_time: DateStr;
  end_time: DateStr;
  flag: number;
}

/**
 * 项目排期
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-09 15:41:07
 */
export interface ProjectSchedule extends GmtTimeFields {
  /** 项目排期 ID */
  id: number;
  /** 直播间ID */
  studio_id: number;
  /** 项目 ID */
  project_id: number;
  /** 创建人 */
  add_by: number;
  /**  */
  data_screenshot: string;
  /**  */
  duration_screenshot: string;
  /**  */
  is_entry_kol_data: number;
  /**  */
  is_entry_live_data: number;
  /**  */
  is_kol_scheduled: number;
  /**  */
  is_operator_scheduled: number;
  /** 场次开始时间 */
  live_start_time: DateStr;
  /** 场次结束时间 */
  live_end_time: DateStr;
  /** 直播状态 */
  live_status: LiveDisplayStatus;
  /** 直播标题 */
  live_title: string;
  /** 直播地址 */
  live_url: string;
  /** KOL(主播)排期列表 */
  kol_schedule_list: KolSchedule[];
  /** 运营排期列表 */
  operator_schedule_list: OperatorSchedule[];
  /** 修改人 */
  modified_by: number;
  /** 实际开始时间 */
  real_start_time: DateStr | null;
  /** 实际结束时间 */
  real_end_time: DateStr | null;
  /** 实际持续时间 */
  real_duration: number | null;
  /** 备注 */
  remark: string;
  /**  */
  flag: number;
}

/**
 * 直播场次 - 场次详情
 */

/**
 * 直播场次 - 场次详情 - 主播数据
 */
export interface KolData {
  /* 开始时间 */
  real_start_time: string;
  /* 结束时间 */
  real_end_time: string;
  /* 时长 */
  real_duration: number;
  /* 场次id */
  shop_live_id: number;
  /* 主播名称 */
  kol_name: string;
  /* 主播id */
  kol_id: number;
}

export interface KolDataForm {
  live_start_date: string;
  live_start_time: string;
  live_end_date: string;
  live_end_time: string;
  // live_time: string[];
  /* 时长 */
  real_duration: number | string | undefined;
  /* 主播id */
  kol_id: number | undefined;
  /* 主播名称 */
  kol_name: string;
}

export interface KolDataParams {
  /* 主播id */
  shop_live_id: number;
  kol_data_infos: {
    real_start_time: string;
    real_end_time: string;
    real_duration: number | string | undefined;
    kol_id: number | undefined;
  }[];
}

/**
 * 直播场次 - 场次详情 - 主播数据
 * 主播
 */
export interface Kol {
  /* 主播id */
  kol_id: number;
  /* 主播名称 */
  kol_name: string;
  /* 主播公司ID */
  kol_company_id: number;
  /* 主播公司名称 */
  kol_company_name: string;
  real_name?: string;
}

/*
 * 场次详情 直播数据
 */
export interface DisplayLiveData {
  /** 实际直播开始时间 */
  real_start_time: string;

  /** 实际直播结束时间 */
  real_end_time: string;

  /** 实际直播时长 */
  real_duration: string;

  /** 直播链接 */
  live_url?: string;

  /** 直播时长截图 */
  duration_screenshot?: string;

  /** 直播数据截图 */
  data_screenshot?: string;
}

export interface DisplayLiveDataForm extends DisplayLiveData {
  /** 场次ID */
  id: number;
}

/**
 * 场次详情
 */
export interface LiveDisplayDetail {
  /** 场次ID */
  id: number;
  /** 录入直播数据 录入时间 */
  gmt_modified?: string;
  /** 录入直播数据 录入人 */
  modified_by_username?: string;
  /** 直播链接 */
  live_url?: string;
  /* 开始时间 */
  real_start_time: string;
  /* 结束时间 */
  real_end_time: string;
  /** 直播时长截图 */
  duration_screenshot?: string;
  /** 直播详情url */
  detail_file?: string;
  /** 直播数据截图 */
  data_screenshot?: string;
  /** 实际直播时长 */
  real_duration?: string;
  /** 业务类型 */
  business_type: number;
  /** 直播状态 */
  live_status?: LiveDisplayStatus;
  live_data_add_by_username?: string;
  live_data_time?: string;
}

/**
 * 排班查询内的运营排班信息
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-20 14:14:30
 */
export interface OperatorScheduleInQuery extends GmtTimeFields, RecordOperatorFields {
  /** ID */
  id: number;
  /** 运营助理id */
  user_id: number;
  /** 开始时间 */
  start_time: DateStr;
  /** 结束时间 */
  end_time: DateStr;
  /** 直播间名称 */
  studio_name: string;
  /** shop_live_id */
  shop_live_id: number;
  project_id: number;
  project_name: string;
  /** flag */
  flag: number;
}

/**
 * 排班查询 - 运营助理
 */
export interface OperatorScheduleDetail {
  /** 运营助理id */
  user_id: number;
  /** 运营助理名称 */
  username: string;
  /** 排班信息 */
  operator_schedule_list: OperatorScheduleInQuery[];
}

/**
 * 排班查询 - 直播间
 */
export interface StudioScheduleDetail extends GmtTimeFields {
  add_by: number;
  data_screenshot: string;
  duration_screenshot: string;
  /** 结束时间 */
  end_time: string;
  flag: number;
  id: number;
  is_entry_kol_data: number;
  is_entry_live_data: number;
  is_kol_scheduled: number;
  is_operator_scheduled: number;
  live_end_time: number;
  live_start_time: number;
  live_status: number;
  live_title: string;
  live_url: string;
  modified_by: number;
  project_id: number;
  real_duration: number;
  real_end_time: string;
  real_start_time: string;
  remark: string;
  /** 开始时间 */
  start_time: string;
  /** 直播间id */
  studio_id: number;
  /** 直播间id */
  studio_name: string;
  /** 项目名称 */
  project_name: string;
}

/**
 * 运营助理排班数据(冲突检查用)
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-02-04 11:23:18
 */
export interface OperatorScheduleInfo {
  /** 开始时间 */
  start_time: DateStr;
  /** 结束时间 */
  end_time: DateStr;
  /** 运营助理ID */
  operator_ids: number[];
  pickerOptions?: any;
}

/**
 * 运营助理排班冲突检查参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-02-04 11:23:18
 */
export interface OperatorScheduleInfoWaitingCheck {
  shop_live_id: number;
  check_operator_schedule_infos: OperatorScheduleInfo[];
}

/**
 * 运营助理排班冲突检查结果
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-02-04 11:37:14
 */
export interface ConflictOperatorResponse {
  conflict_operator_items: {
    /** 冲突开始时间 */
    start_time: DateStr;
    /** 冲突结束时间 */
    end_time: DateStr;
    /** 运营人员ID */
    operator_id: number;
    /** 直播间名称 */
    studio_name: string;
    /** ??提交数据索引 */
    date_index: number;
    /** ??提交数据索引 */
    operator_index: number;
  }[];
  /** 排班开始时间 */
  start_time: DateStr;
  /** 排班结束时间 */
  end_time: DateStr;
}

/**
 * 主播排班数据(冲突检查用)
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-02-04 11:23:18
 */
export interface KolScheduleInfo {
  /** 开始时间 */
  start_time: DateStr;
  /** 结束时间 */
  end_time: DateStr;
  /** 主播ID */
  kol_ids: number[];
  pickerOptions?: any;
}

/**
 * 主播排班冲突检查参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-02-04 11:23:18
 */
export interface KolScheduleInfoWaitingCheck {
  shop_live_id: number;
  check_kol_schedule_infos: KolScheduleInfo[];
}

/**
 * 主播排班冲突检查结果
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-02-04 11:37:14
 */
export interface ConflictKolResponse {
  conflict_kol_items: {
    /** 冲突开始时间 */
    start_time: DateStr;
    /** 冲突结束时间 */
    end_time: DateStr;
    /** 主播ID */
    kol_id: number;
    /** 直播间名称 */
    studio_name: string;
    /** ??提交数据索引 */
    date_index: number;
    /** ??提交数据索引 */
    kol_index: number;
  }[];
  /** 排班开始时间 */
  start_time: DateStr;
  /** 排班结束时间 */
  end_time: DateStr;
}

/**
 * 直播场次详情 淘宝插件场次列表
 * @author  Wuyou <wuyou@goumee.com>
 * @since   2021-04-09 10:43:14
 */
export interface TaobaoLiveInfo {
  /** ID */
  id: number;

  /** 标题 */
  title: string;

  /** 淘宝插件场次ID */
  tb_live_id: number;

  /** 开始时间 */
  start_time: DateStr;
}

/**
 * 店播实付
 * ```
 * 类型先简单继承自 Achievement(营销业务的业绩登记表即实付)
 * ```
 * @extends Achievement
 */
export interface LiveAchivement extends Achievement {
  /** 店播实付的UID */
  uid: string;
  /** 关联审批ID */
  approval_id: number;
  /** 审批类型?(接口文档无) */
  approval_type: number;
  /** 付款类型 */
  pay_type: number;
  /** 成本类型 */
  new_cost_type: number;
  /** 打款金额 */
  pay_amount: number;
  /** 用款日期 */
  transfer_date: DateStr;
  /** 付款详情 */
  pay_way_detail: any;
  /** 付款途径 */
  pay_way: number;
  /** 付款事由 */
  pay_reason: string;
  /** 备注 */
  note: string;
  /** 税点金额 */
  tax_point: null | number;
  /** 供应商 */
  cost_company_name: string;
  pay_date: string;
  pay_certificate_pic: string;
  refund_write_off_infos: [];
  is_pay: number;
}

// 飞书部门
export interface FeiShuDepartment {
  department_id: string;
  id: number;
  is_deleted: boolean;
  leader_user_id: string;
  member_count: number;
  name: string;
  open_department_id: string;
  order: number;
  parent_department_id: string;
  sons: FeiShuDepartment[];
  disabled?: boolean;
  level: number;
}

// 收款退款核销的应收单列表
export interface ReceivableForWriteOff {
  /** 核销记录id */
  id: number;
  /** 应收编号 */
  receipt_uid: string;
  /** 原收款收款编号 */
  receivable_uid: string;
  /** 已退款核销金额 */
  refund_write_off_amount: number;
  /** 原单核销金额 */
  write_off_amount: number;
}

// 付款退款核销的应收单列表
export interface PayRefundForWriteOff {
  /** 核销记录id */
  id: number;
  /** 应付编号 */
  payable_uid: string;
  /** 原付款编号 */
  cost_uid: string;
  /** 已退款核销金额 */
  refund_write_off_amount: number;
  /** 原单核销金额 */
  write_off_amount: number;
}

//  付款退款核销参数
export interface SavePayRefundWriteOffParams {
  /** 收款编号,列表的receipt_id */
  achievement_id: number | undefined;
  write_off_list: {
    /** 付款核销id */
    pay_write_off_id: number;
    /** 核销金额 */
    write_off_amount: number | string;
  }[];
}

//  收款退款核销参数
export interface SaveReceiveRefundWriteOffParams {
  /** 业绩uid */
  achievement_uid: string;
  /** 成本id */
  cost_id?: number;
  cost_split_id?: number;
  write_off_list: {
    /** 核销记录的id,列表的id */
    id: number;
    /** 核销金额 */
    write_off_amount: number | string;
  }[];
}

//  付款退款
export interface PayRefundParams {
  /** 成本id */
  raw_cost_id: number | undefined;
  /** 退款金额 */
  refund_amount: number | string | undefined;
  /** 收款时间 */
  gather_date: string;
  /** 收款账户，2-支付宝 ，3-对公银行 */
  gather_way: number;
  /** 1手动登记(煜丰账户收款) 2认领流水(构美账户收款)*/
  register_way: number;
  /** 银行卡号 */
  bank_card_number: string;
  /** 开户行 */
  bank_of_deposit: string;
  /** 公司名称 */
  company_name: string;
  /** 收款人 */
  name: string;
  /** 支付宝账号 */
  account: string;
  /** 退款原因 */
  refund_reason: string;
  /** 凭证 */
  certificate_file: string;
  /** 流水id */
  capital_revenue_flow_id: string;
}

/** 店铺代播项目排期日历查询参数 */
export interface QueryProjectScheduleCalendarParams {
  /** 项目id */
  project_id: string;
  /** 开始时间 */
  start_date: string;
  /** 结束时间 */
  end_date: string;
}

/** 店铺代播项目排期日历数据排期数组 */
export interface ProjectScheduleLiveData {
  /** 场次id */
  id: number;
  /** 主播数据1表示已填0表示未填*/
  // is_entry_kol_data: number;
  /** 场次数据 */
  is_entry_live_data: number;
  /** 主播排班 */
  is_kol_scheduled: number;
  /** 时间 */
  time_str: string;
  /** 是否休息1休息0否 */
  is_rest_day: string;
  /** 是否关联场次，1表示无异常，0表示异常 */
  is_relation_plugin: number;
  /** 是否运营排班，1表示无异常，0表示异常 */
  is_operator_scheduled: number;
  // 是否归档
  live_status: number;
}

/** 店铺代播项目排期日历数据 */
export interface ProjectScheduleCalendarData {
  /** 日期 */
  date: string;
  /** 开始时间 */
  shop_live_list: ProjectScheduleLiveData[];
}

/**
 * 项目排期列表参数
 */
export interface ProjectShopLiveParams {
  /** 项目id */
  project_id: string;
  /** 开始时间 */
  live_start_date: string;
  /** 结束时间 */
  live_end_date: string;
  /** 0: 非休息，1: 休息 */
  is_rest_day: number;
  num: number;
  page_num: number;
}

/**
 * 项目排期列表数据
 */
export interface ProjectShopLive {
  /** 场次id */
  id: number;
  /** 场次标题 */
  live_title: string;
  /** 开始时间 */
  live_start_time: string;
  /** 结束时间 */
  live_end_time: string;
  /** 是否录入主播数据 */
  is_entry_kol_data: number;
  /** 是否录入数据 */
  is_entry_live_data: number;
  /** 是否关联场次 */
  is_relation_plugin: number;
  /** 主播是否排班 */
  is_kol_scheduled: number;
  /** 运营是否排班 */
  is_operator_scheduled: number;
  /** 直播状态,1-待排班，2-待直播，3-待录入，4-已直播 */
  live_status: LiveDisplayStatus;
  /** 场次类型 **/
  live_type: number;
  /** 预估GMV **/
  expect_gmv: number;
  /** 实际GMV **/
  actual_gmv: number;
  /** 招商商品数 **/
  merchant_goods_count: number;
}

export interface ShopLiveProfitStatData {
  /** 收入结算金额 */
  income_settlement_amount: string;
  /** 成本结算金额 */
  cost_settlement_amount: string;
  /** 实收金额 */
  real_income_amount: string;
  /** 实付金额 */
  real_paid_amount: string;
  /** 未收金额 */
  unreceived_amount: string;
  /** 未付金额 */
  unpaid_amount: string;
  /** 已开发票 */
  paid_invoice_amount: string;
  /** 已收发票 */
  received_invoice_amount: string;
}

export interface ProjectTeamMemberProps {
  /** 其他成员 */
  team_members: { id: number; name: string }[];
  /** 客户经理 */
  customer_manager_id: number | undefined;
  /** 项目经理 */
  project_manager_id: number | undefined;
  /** 项目经理 */
  project_manager_name?: string | undefined;
  /** 客户经理 */
  customer_manager_name?: string | undefined;
}

export interface ProjectTeamMemberParams {
  /** 其他成员 */
  team_members: number[];
  /** 客户经理 */
  customer_manager_id?: number | undefined;
  /** 项目经理 */
  project_manager_id: number | undefined;
  /** 项目经理 */
  project_manager_name?: string | undefined;
  /** 客户经理 */
  customer_manager_name?: string | undefined;
}

export interface ShopLiveProjectLiveQueryParams {
  /** 项目id */
  project_id: number | string;
  /** 开始时间 */
  live_start_date: string;
  /** 结束时间 */
  live_end_date: string;
  num: number;
  page_num: number;
  live_title?: string;
  has_settlement?: number;
}

/** 直播留档列表 */
export interface ShopLiveRecordData {
  /** id */
  id: number | string;

  // 直播数据截图
  data_screenshot: string;

  // 直播时长截图
  duration_screenshot: string;

  // 录入人
  live_data_add_by_username: string;

  // 直播时长
  real_duration: number;

  // 直播开始时间
  real_start_time: number;

  // 直播结束时间
  real_end_time: number;

  // 直播链接
  live_url: string;

  // gmt_create
  gmt_create: string;
  detail_file: string;
}

// 直播留档 新增编辑
export interface ShopLiveRecordDataForm {
  /** id */
  id?: number | string;

  // 场次id
  shop_live_id?: number | string;

  // 直播数据截图
  data_screenshot?: string;

  // 直播时长截图
  duration_screenshot?: string;

  // 直播时长
  real_duration?: number | string;

  // 直播开始时间
  real_start_time: number | string;

  // 直播结束时间
  real_end_time: number | string;

  // 直播链接
  live_url?: string;
  detail_file?: string;
}

export interface ShopLiveDouyinDataForm {
  /** id */
  id?: number | string;

  // 场次id
  shop_live_id?: number | string;

  // 直播数据截图
  // data_screenshot?: string;

  // 直播时长截图
  duration_screenshot?: string;
  // 直播时长
  real_duration?: number | string;

  // 直播开始时间
  real_start_time: number | string;

  // 直播结束时间
  real_end_time: number | string;

  detail_file: string[];
}

// 今日排班 - 排班数据
export interface PersonnelSchedule {
  /** 排班时间 */
  time_str: string;
  /** 名称数组 */
  names: string[];
}

/** 今日排班数据 */
export interface TodaySchedule {
  is_rest_day: number;
  /** 主播排班 */
  kol_schedule_list: PersonnelSchedule[];
  /** 运助排班 */
  operator_schedule_list: PersonnelSchedule[];
}

export interface ShopLiveStatistic {
  /** 分钟评论次数 */
  avg_min_comment_cnt: number;
  /** 人均观看时长 */
  avg_watch_duration: number;
  /** GMV */
  gmv: number;
  /** 千次观看成交金额 */
  gpm: number;
  /** 成交老粉占比 */
  old_fans_pay_ucnt_ratio: number;
  /** 直播间成交人数 */
  pay_ucnt: number;
  /** 曝光-进入率 */
  watch_cnt_show_ratio: number;
  /** 观看-成交率(人数) */
  watch_pay_ucnt_ratio: number;
}

export interface QueryShopProductParams {
  /** 三级类目id **/
  third_cid?: number;
  /** 商品id **/
  product_id?: number;
  /** 商品款号 **/
  sn?: string;
  order_by_type?: E.project.LiveToolGoodsSortType;
  project_id?: number | string;
  /** 一级类目id **/
  first_cid?: number;
}
