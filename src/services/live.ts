/**
 * 店铺代播
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-28 13:57:34
 */
import { Get, Post, Put } from '@/utils/request';
import {
  RosterQueryParams,
  TrackMasterQueryParams,
  TrackMatter,
  TrackMatterForm,
  LiveDisplayQueryParams,
  LiveDisplay,
  Studio,
  ProjectIDInfo,
  LiveDisplayCreateParams,
  LiveDisplayEditParams,
  LiveDisplayProjectIdListParams,
  ProjectScheduleQueryParams,
  ProjectSchedule,
  KolData,
  Kol,
  KolSchedule,
  OperatorSchedule,
  KolDataParams,
  DisplayLiveDataForm,
  StudioScheduleDetail,
  OperatorScheduleDetail,
  OperatorScheduleInfoWaitingCheck,
  ConflictOperatorResponse,
  ConflictKolResponse,
  TaobaoLiveInfo,
  FeiShuDepartment,
  ReceivableForWriteOff,
  PayRefundParams,
  PayRefundForWriteOff,
  SavePayRefundWriteOffParams,
  SaveReceiveRefundWriteOffParams,
  QueryProjectScheduleCalendarParams,
  ProjectScheduleCalendarData,
  ProjectShopLiveParams,
  ProjectShopLive,
  ShopLiveProfitStatData,
  ProjectTeamMemberParams,
  ShopLiveProjectLiveQueryParams,
  ShopLiveRecordData,
  ShopLiveRecordDataForm,
  TodaySchedule,
  ShopLiveStatistic,
  QueryShopProductParams,
} from '@/types/tiange/live';
import { ObjectFilterEmpty } from '@/utils/func';
import { ListResponse } from '@/types/base/http';
import {
  KOL_SCHEDULE_QUERY,
  OPERATOR_SCHEDULE_QUERY,
  STUDIO_SCHEDULE_QUERY,
  TRACK_MASTER_QUERY,
  TRACK_MASTER_SAVE,
  QUERY_SHOP_LIVE,
  SHOP_LIVE_SAVE,
  SHOP_LIVE_PROJECT_ID_LIST,
  STUDIO_LIST,
  DISPLAY_DETAIL,
  DISPLAY_DELETE,
  DISPLAY_DELETE_MCN,
  DISPLAY_CLOSE,
  DISPLAY_CLOSE_MCN,
  QUERY_PROJECT_SCHEDULE_DETAIL,
  KOL_DATA_QUERY,
  KOL_QUERY,
  LIVE_SCHEDULE_QUERY,
  KOL_DATA_SAVE,
  DISPLAY_LIVE_DATA_SAVE_API,
  TAOBAO_SHOP_LIVE_API,
  QUERY_FEISHU_DEPARTMENT_LIST,
  QUERY_SHOP_LIVE_RECEIVABLES_REFUND_FOR_WRITE_OFF,
  QUERY_MARKETING_RECEIVABLES_REFUND_FOR_WRITE_OFF,
  QUERY_COMMON_RECEIVABLES_REFUND_FOR_WRITE_OFF,
  CREATE_PAY_REFUND,
  QUERY_PAY_REFUND_WRITEOFF_PAYABLE_LIST,
  SAVE_RECEIVABLES_REFUND_FOR_WRITE_OFF,
  SAVE_PAY_REFUND_FOR_WRITE_OFF,
  QUERY_PROJECT_SCHEDULE_CALENDAR,
  QUERY_PROJECT_SCHEDULE_CALENDAR_MCN,
  SCHEDULE_SET_REST,
  QUERY_PROJECT_SHOP_LIVE,
  SHOP_LIVE_PROFIT_STAT_DATA,
  UPDATE_SHOP_LIVE_TEAM_MEMBERS,
  COPY_SHOP_LIVE_SCHEDULE_API,
  SHOP_LIVE_RECORD_DATA_LIST_API,
  SHOP_LIVE_RECORD_DATA_EDIT_API,
  SHOP_LIVE_SAVE_KOL_SCHEDULE_DATA_API,
  SHOP_LIVE_SAVE_OPERATOR_SCHEDULE_DATA_API,
  QUERY_TODAY_LIVE_SCHEDULE_DETAIL,
  SHOP_LIVE_RECORD_DATA_DELETE_API,
  SCHEDULE_CANCEL_REST,
  IN_PROJECT_TEAM,
  QUERY_USER_NAMES,
  EDIT_SHOP_LIVE_DISPLAY_DATA_API,
  EDIT_SHOP_LIVE_DISPLAY_DATA_API_MCN,
  QUERY_PROJECT_SHOP_LIVE_MCN,
  DISPLAY_DETAIL_MCN,
  SET_LIVE_DISPLAY_NOT_LIVED,
  SET_MCN_LIVE_DISPLAY_NOT_LIVED,
  GET_SHOP_LIVE_STATISTIC,
  QUERY_PROJECT_DAILY_GOAL_SETTINGS,
  SAVE_PROJECT_SHOP_DAILY_GOAL_SETTINGS,
  QUERY_TODAY_LIVE_SCHEDULE_WARNING_DETAIL,
  SCHEDULE_SET_REST_SHOPLIVE,
  SCHEDULE_CANCEL_REST_SHOPLIVE,
  KOL_SCHEDULE_EXPORT,
  QUERY_SHOP_LIVE_LOCAL_LIFE,
  EDIT_SHOP_LIVE_LOCAL_LIFE_DISPLAY_DATA_API,
  LOCAL_LIFE_SCHEDULE_QUERY,
  LOCAL_LIFE_DISPLAY_DETAIL,
  LOCAL_LIFE_DISPLAY_DELETE,
  LOCAL_LIFE_DISPLAY_CLOSE,
  SHOP_LIVE_LOCAL_LIFE_RECORD_DATA_DELETE_API,
  TAOBAO_LOCAL_LIFE_API,
  LOCAL_LIFE_IN_PROJECT_TEAM,
  QUERY_PROJECT_SCHEDULE_CALENDAR_LOCAL_LIFE,
  QUERY_PROJECT_SHOP_LIVE_LOCAL_LIFE,
  QUERY_PROJECT_SHOP_LIVE_SUPPLY_CHAIN,
  COPY_SHOP_LIVE_SCHEDULE_API_LOCAL_LIFE,
  QUERY_PROJECT_SCHEDULE_DETAIL_LOCAL_LIFE,
  LOCAL_LIFE_RECORD_DATA_LIST_API,
  GET_LOCAL_LIFE_STATISTIC,
  LOCAL_LIFE_SAVE_KOL_SCHEDULE_DATA_API,
  SCHEDULE_SET_REST_LOCAL_LIFE,
  SCHEDULE_CANCEL_REST_LOCAL_LIFE,
  UPDATE_LOCAL_LIFE_TEAM_MEMBERS,
  SHOP_LIVE_LOCAL_LIFE_RECORD_DATA_EDIT_API,
  SET_LOCAL_LIFE_LIVE_DISPLAY_NOT_LIVED,
  QUERY_SHOP_LIVE_SUPPLY_CHAIN,
  SUPPLY_CHAIN_DISPLAY_DETAIL,
  SUPPLY_CHAIN_DISPLAY_CLOSE,
  SUPPLY_CHAIN_DISPLAY_DELETE,
  QUERY_PROJECT_SCHEDULE_DETAIL_SUPPLY_CHAIN,
  SUPPLY_CHAIN_SCHEDULE_QUERY,
  TAOBAO_SUPPLY_CHAIN_API,
  QUERY_PROJECT_SCHEDULE_CALENDAR_SUPPLY_CHAIN,
  SCHEDULE_SET_REST_SUPPLY_CHAIN,
  UPDATE_SUPPLY_CHAIN_TEAM_MEMBERS,
  COPY_SHOP_LIVE_SCHEDULE_API_SUPPLY_CHAIN,
  SUPPLY_CHAIN_RECORD_DATA_LIST_API,
  SHOP_LIVE_SUPPLY_CHAIN_RECORD_DATA_EDIT_API,
  SHOP_LIVE_SUPPLY_CHAIN_RECORD_DATA_DELETE_API,
  SUPPLY_CHAIN_SAVE_KOL_SCHEDULE_DATA_API,
  SUPPLY_CHAIN_IN_PROJECT_TEAM,
  EDIT_SHOP_LIVE_SUPPLY_CHAIN_DISPLAY_DATA_API,
  SET_SUPPLY_CHAIN_LIVE_DISPLAY_NOT_LIVED,
  SCHEDULE_CANCEL_REST_SUPPLY_CHAIN,
  GET_SUPPLY_CHAIN_STATISTIC,
} from '@/apis/live';
import { HttpResponse } from '../types/base/http';
import { CooperationTypeEnum, ProjectStatusEnum, ProjectTypeEnum } from '@/types/tiange/common';
import {
  CHANGE_COMMON_PROJECT_STATUS,
  CHANGE_COOPERATION_STATUS,
  CHANGE_SHOP_LIVE_PROJECT_STATUS,
} from '@/apis/live.project';
import { IGPageQuery } from '@/types/tiange/general';

/**
 * 项目管理
 * @author  tingzhu <tingzhu@goumee.com>
 * @since   2020-12-28 13:59:18
 */
export const TrackMasterQuery = async (
  payload: TrackMasterQueryParams,
): Promise<ListResponse<TrackMatter>> =>
  Get(TRACK_MASTER_QUERY, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

export const TrackMasterSave = async (payload: TrackMatterForm): Promise<HttpResponse<undefined>> =>
  Post(TRACK_MASTER_SAVE, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 直播场次
 * @author  tingzhu <tingzhu@goumee.com>
 * @since   2020-12-28 13:59:18
 */
export const LiveDisplayQuery = async (
  payload: LiveDisplayQueryParams,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<ListResponse<LiveDisplay>> =>
  Get(
    business_type === E.project.BusinessType.supplyChain
      ? QUERY_SHOP_LIVE_SUPPLY_CHAIN
      : business_type === E.project.BusinessType.locallife
      ? QUERY_SHOP_LIVE_LOCAL_LIFE
      : QUERY_SHOP_LIVE,
    {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    },
  );

// 新建直播场次
export const CreateLiveDisplay = async (
  payload: LiveDisplayCreateParams,
): Promise<HttpResponse<undefined>> =>
  Post(SHOP_LIVE_SAVE, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 编辑直播场次
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-08 00:46:19
 */
export const EditLiveDisplay = async (
  payload: LiveDisplayEditParams,
): Promise<HttpResponse<undefined>> =>
  Post(SHOP_LIVE_SAVE, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 场次详情-主播数据列表
 * @author  tingzhu <tingzhu@goumee.com>
 * @since   2021-01-08 00:46:19
 */
export const KolDataQuery = async (payload: number | string): Promise<HttpResponse<KolData[]>> =>
  Get(KOL_DATA_QUERY, {
    params: {
      shop_live_id: payload,
    },
  });

// 项目编号搜索，合作类型默认自营，可以不传
export const LiveDisplayProjectIdList = async (
  payload: LiveDisplayProjectIdListParams,
): Promise<HttpResponse<ProjectIDInfo[]>> =>
  Get(SHOP_LIVE_PROJECT_ID_LIST, {
    params: {
      project_uid: payload.project_uid,
      cooperation_type: payload.cooperation_type ?? CooperationTypeEnum.selfSupport,
    },
  });
// 这里拷贝上面项目编号搜搜---上面部分请求时必有 cooperation_type, 现在有需求不传递 cooperation_type
export const LiveDisplayProjectIdListNoDefault = async (
  payload: LiveDisplayProjectIdListParams,
): Promise<HttpResponse<ProjectIDInfo[]>> =>
  Get(SHOP_LIVE_PROJECT_ID_LIST, {
    params: ObjectFilterEmpty({
      project_uid: payload.project_uid,
      cooperation_type: payload.cooperation_type,
      business_type: payload.business_type,
    }),
  });

// 直播间搜索
export const StudioList = async (
  studio_name: string | undefined,
  business_type?: number | undefined,
): Promise<HttpResponse<Studio[]>> =>
  Get(STUDIO_LIST, {
    params: {
      studio_name: studio_name,
      business_type: business_type,
    },
  });

// 场次详情
export const DisplayDetail = async (
  payload: string | number,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<LiveDisplay>> =>
  Get(
    business_type === E.project.BusinessType.supplyChain
      ? `${SUPPLY_CHAIN_DISPLAY_DETAIL}/${payload}/`
      : business_type === E.project.BusinessType.locallife
      ? `${LOCAL_LIFE_DISPLAY_DETAIL}/${payload}/`
      : `${DISPLAY_DETAIL}/${payload}/`,
  );

// 场次详情MCN
export const DisplayDetailMcn = async (
  payload: string | number,
): Promise<HttpResponse<LiveDisplay>> => Get(`${DISPLAY_DETAIL_MCN}/${payload}/`);

// 关闭场次
export const DisplayClose = async (
  payload: string | number,
  actual_gmv?: string,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<undefined>> =>
  Post(
    business_type === E.project.BusinessType.supplyChain
      ? `${SUPPLY_CHAIN_DISPLAY_CLOSE}/${payload}/`
      : business_type === E.project.BusinessType.locallife
      ? `${LOCAL_LIFE_DISPLAY_CLOSE}/${payload}/`
      : `${DISPLAY_CLOSE}/${payload}/`,
    ObjectFilterEmpty({ actual_gmv }),
  );
// MCN关闭场次
export const DisplayCloseMcn = async (
  payload: string | number,
  actual_gmv?: string,
): Promise<HttpResponse<undefined>> =>
  Post(`${DISPLAY_CLOSE_MCN}/${payload}/`, ObjectFilterEmpty({ actual_gmv }));

// 删除场次
export const DisplayDelete = async (
  payload: string | number,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<undefined>> =>
  Post(
    business_type === E.project.BusinessType.supplyChain
      ? `${SUPPLY_CHAIN_DISPLAY_DELETE}/${payload}/`
      : business_type === E.project.BusinessType.locallife
      ? `${LOCAL_LIFE_DISPLAY_DELETE}/${payload}/`
      : `${DISPLAY_DELETE}/${payload}/`,
  );
export const DisplayDeleteMcn = async (
  payload: string | number,
): Promise<HttpResponse<undefined>> => Post(`${DISPLAY_DELETE_MCN}/${payload}/`);

/**
 * 查询排班
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-28 13:59:18
 */
// 主播排班查询
export const KolScheduleQuery = async (
  pager: IGPageQuery,
  payload: RosterQueryParams,
): Promise<ListResponse<KolSchedule>> =>
  Get(KOL_SCHEDULE_QUERY, {
    params: {
      ...pager,
      ...ObjectFilterEmpty(payload),
    },
  });

// 导出主播排班
export const KolScheduleExport = async (
  payload: RosterQueryParams,
): Promise<ListResponse<KolSchedule>> =>
  Get(KOL_SCHEDULE_EXPORT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 运营助理排班查询
export const OperatorScheduleQuery = async (
  payload: Pick<RosterQueryParams, 'start_date' | 'end_date'>,
): Promise<HttpResponse<OperatorScheduleDetail[]>> =>
  Get(OPERATOR_SCHEDULE_QUERY, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 直播间排班查询
export const StudioScheduleQuery = async (
  payload: Omit<RosterQueryParams, 'kol_id'>,
): Promise<HttpResponse<StudioScheduleDetail[]>> =>
  Get(STUDIO_SCHEDULE_QUERY, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
// export const RosterQuery = async (
//   payload: RosterQueryParams,
// ): Promise<ListResponse<Record<string, any>>> =>
//   Get(ROSTER_QUERY, {
//     params: {
//       ...ObjectFilterEmpty(payload),
//     },
//   });

/**
 * 查询项目排期
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-09 15:19:01
 */
export const GetProjectScheduleDetail = (
  payload: ProjectScheduleQueryParams,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<ProjectSchedule[]>> =>
  Get(
    business_type === E.project.BusinessType.supplyChain
      ? QUERY_PROJECT_SCHEDULE_DETAIL_SUPPLY_CHAIN
      : business_type === E.project.BusinessType.locallife
      ? QUERY_PROJECT_SCHEDULE_DETAIL_LOCAL_LIFE
      : QUERY_PROJECT_SCHEDULE_DETAIL,
    {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    },
  );

/**
 * 所取所有KOL
 * @author  tingzhu <tingzhu@goumee.com>
 * @since   2020-12-28 13:59:18
 */
export const KolQuery = async (payload?: {
  platform?: string;
  kol_name?: string;
  /** 是否审核通过 */
  is_verify_approved?: number;
}): Promise<HttpResponse<Kol[]>> =>
  Get(KOL_QUERY, {
    params: {
      ...ObjectFilterEmpty(payload ?? ''),
    },
  });

/**
 * 场次排期查询
 * @author  tingzhu <tingzhu@goumee.com>
 * @since   2020-12-28 13:59:18
 */
export const LiveScheduleQuery = async (
  shop_live_id: number | string,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<
  HttpResponse<{
    kol_schedule_list: KolSchedule[];
    operator_schedule_list: OperatorSchedule[];
  }>
> =>
  Get(
    business_type === E.project.BusinessType.supplyChain
      ? SUPPLY_CHAIN_SCHEDULE_QUERY
      : business_type === E.project.BusinessType.locallife
      ? LOCAL_LIFE_SCHEDULE_QUERY
      : LIVE_SCHEDULE_QUERY,
    {
      params: {
        shop_live_id,
      },
    },
  );

/**
 * 主播数据录入
 * @author  tingzhu <tingzhu@goumee.com>
 * @since   2020-12-28 13:59:18
 */
export const KolDataSave = async (payload: KolDataParams): Promise<HttpResponse<undefined>> =>
  Post(KOL_DATA_SAVE, {
    ...ObjectFilterEmpty(payload),
  });

/** 场次详情 直播数据录入 */
export const DisplayLiveDataSave = async (
  payload: DisplayLiveDataForm,
): Promise<HttpResponse<undefined>> =>
  Post(DISPLAY_LIVE_DATA_SAVE_API, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 检查运营助理排期是否有冲突
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-02-04 14:12:30
 */
export const CheckOperator = async (
  payload: OperatorScheduleInfoWaitingCheck,
): Promise<HttpResponse<ConflictOperatorResponse[]>> =>
  Post('/api/shop_live/check_operator_schedule', {
    ...ObjectFilterEmpty(payload),
  });

// 运营助理排班 - 点击保存
export const SaveOperator = async (data: Record<string, any>) =>
  Post('/api/shop_live/save_operator_schedule', data);

/**
 * 检查主播排期是否有冲突
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-02-04 14:15:11
 */
export const CheckKol = async (
  payload: Record<string, any>,
): Promise<HttpResponse<ConflictKolResponse[]>> =>
  Post('/api/shop_live/check_kol_schedule', {
    ...ObjectFilterEmpty(payload),
  });

// 主播排班 - 点击保存
export const SaveKol = async (
  data: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
) =>
  Post(
    business_type === E.project.BusinessType.supplyChain
      ? '/api/shop_live/supply_chain/save_kol_schedule'
      : business_type === E.project.BusinessType.locallife
      ? '/api/shop_live/local_life/save_kol_schedule'
      : '/api/shop_live/save_kol_schedule',
    data,
  );

export interface IRES_QUERY_REAL_STUDIO {
  /** 1直播 0 空闲 */
  status: number;
  /** 直播间ID */
  studio_id: string;
  /** 直播间名称 */
  studio_name: string;
}

/** 获取直播间 **/
export const QUERY_REAL_STUDIO = async (payload: {
  business_type?: string;
}): Promise<
  HttpResponse<{
    // 空闲数量
    number_of_free: number;
    // 直播数量
    number_of_living: number;
    // 直播列表
    studio_info: IRES_QUERY_REAL_STUDIO[];
  }>
> =>
  Get('/api/shop_live/query_real_studio', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 直播场次详情 淘宝插件场次列表 */
export const GetTaobaoLiveInfo = async (
  payload: number | string,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<TaobaoLiveInfo[]>> =>
  Get(
    business_type === E.project.BusinessType.supplyChain
      ? TAOBAO_SUPPLY_CHAIN_API
      : business_type === E.project.BusinessType.locallife
      ? TAOBAO_LOCAL_LIFE_API
      : TAOBAO_SHOP_LIVE_API,
    {
      params: {
        shop_live_id: payload,
      },
    },
  );

/** 获取项目部门*/
export const GetFeishuDepartmentList = async (
  payload?: any,
): Promise<HttpResponse<{ data: FeiShuDepartment[] }>> =>
  Get(QUERY_FEISHU_DEPARTMENT_LIST, { params: payload ? { ...payload } : {} });

/** 获取项目部门新*/
export const GetFeishuDepartmentListNew = async (
  payload?: any,
): Promise<HttpResponse<{ data: FeiShuDepartment[] }>> =>
  Get('/api/auth/get_feishu_department_tree', {
    params: payload ? { ...payload } : {},
  });

/** 获取考核详情部门*/
export const GetAssessment_management_department_list = async (payload?: {
  assessment_management_id: string | number;
}): Promise<HttpResponse<{ data: FeiShuDepartment[] }>> =>
  Get('/api/performance_management/query_assessment_management_department_list', {
    params: payload ? { ...payload } : {},
  });

/** 直播场次详情 淘宝插件场次列表 */
export const GetReceivablesRefundForWriteOffList = async (
  achievement_uid: string,
  type: ProjectTypeEnum,
): Promise<HttpResponse<ReceivableForWriteOff[]>> => {
  let urlStr = '';
  switch (type) {
    case ProjectTypeEnum.live:
      urlStr = QUERY_SHOP_LIVE_RECEIVABLES_REFUND_FOR_WRITE_OFF;
      break;
    case ProjectTypeEnum.marketing:
      urlStr = QUERY_MARKETING_RECEIVABLES_REFUND_FOR_WRITE_OFF;
      break;
    case ProjectTypeEnum.common_business:
      urlStr = QUERY_COMMON_RECEIVABLES_REFUND_FOR_WRITE_OFF;
      break;
    default:
      break;
  }
  return Get(urlStr, {
    params: {
      achievement_uid,
    },
  });
};

/** 直播场次详情 淘宝插件场次列表 */
export const GetPayRefundForWriteOffList = async (
  refund_cost_id: string,
): Promise<HttpResponse<PayRefundForWriteOff[]>> => {
  return Get(QUERY_PAY_REFUND_WRITEOFF_PAYABLE_LIST, {
    params: {
      refund_cost_id,
    },
  });
};

/** 创建付款退款 */
export const CreatePayRefund = async (payload: PayRefundParams): Promise<HttpResponse<undefined>> =>
  Post(CREATE_PAY_REFUND, payload);

/** 收款退款核销 */
export const SaveReceiveRefundWriteOff = async (
  payload: SaveReceiveRefundWriteOffParams,
): Promise<HttpResponse<undefined>> => Post(SAVE_RECEIVABLES_REFUND_FOR_WRITE_OFF, payload);

/** 付退款核销 */
export const SavePayRefundWriteOff = async (
  payload: SavePayRefundWriteOffParams,
): Promise<HttpResponse<undefined>> => Post(SAVE_PAY_REFUND_FOR_WRITE_OFF, payload);

/** 查询排期日期数据 */
export const QueryProjectScheduleCalendar = async (
  payload: QueryProjectScheduleCalendarParams,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<ProjectScheduleCalendarData[]>> =>
  Get(
    business_type === E.project.BusinessType.supplyChain
      ? QUERY_PROJECT_SCHEDULE_CALENDAR_SUPPLY_CHAIN
      : business_type === E.project.BusinessType.locallife
      ? QUERY_PROJECT_SCHEDULE_CALENDAR_LOCAL_LIFE
      : QUERY_PROJECT_SCHEDULE_CALENDAR,
    {
      params: {
        ...ObjectFilterEmpty(payload ?? ''),
      },
    },
  );

/** 查询MCN排期日期数据 */
export const QueryProjectScheduleCalendarMcn = async (
  payload: QueryProjectScheduleCalendarParams,
): Promise<HttpResponse<ProjectScheduleCalendarData[]>> =>
  Get(QUERY_PROJECT_SCHEDULE_CALENDAR_MCN, {
    params: {
      ...ObjectFilterEmpty(payload ?? ''),
    },
  });
/** 设置休息日 */
export const ScheduleSetRest = async (
  project_id: number | string,
  date: string,
): Promise<HttpResponse<undefined>> =>
  Post(SCHEDULE_SET_REST, {
    project_id,
    date,
  });

/** 取消休息日 */
export const ScheduleCancelRest = async (id: number | string): Promise<HttpResponse<undefined>> =>
  Post(SCHEDULE_CANCEL_REST, {
    id,
  });
/** 设置休息日 */
export const ScheduleSetRestShopLive = async (
  project_id: number | string,
  date: string,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<undefined>> =>
  Post(
    business_type === E.project.BusinessType.supplyChain
      ? SCHEDULE_SET_REST_SUPPLY_CHAIN
      : business_type === E.project.BusinessType.locallife
      ? SCHEDULE_SET_REST_LOCAL_LIFE
      : SCHEDULE_SET_REST_SHOPLIVE,
    {
      project_id,
      date,
    },
  );

/** 取消休息日 */
export const ScheduleCancelRestShopLive = async (
  id: number | string,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<undefined>> =>
  Post(
    business_type === E.project.BusinessType.supplyChain
      ? SCHEDULE_CANCEL_REST_SUPPLY_CHAIN
      : business_type === E.project.BusinessType.locallife
      ? SCHEDULE_CANCEL_REST_LOCAL_LIFE
      : SCHEDULE_CANCEL_REST_SHOPLIVE,
    {
      id,
    },
  );

/** 查项目排期列表 */
export const QueryProjectShopLive = async (
  payload: ProjectShopLiveParams,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<ListResponse<ProjectShopLive>> =>
  Get(
    business_type === E.project.BusinessType.supplyChain
      ? QUERY_PROJECT_SHOP_LIVE_SUPPLY_CHAIN
      : business_type === E.project.BusinessType.locallife
      ? QUERY_PROJECT_SHOP_LIVE_LOCAL_LIFE
      : QUERY_PROJECT_SHOP_LIVE,
    {
      params: {
        ...ObjectFilterEmpty(payload ?? ''),
      },
    },
  );

/** 店铺项目详情 盈收统计数据 */
export const QueryShopLiveProfitStatData = async (
  project_id: string,
): Promise<HttpResponse<ShopLiveProfitStatData>> =>
  Get(`${SHOP_LIVE_PROFIT_STAT_DATA}/${project_id}/`);

/** 保存店播项目团队成员 */
export const UpdateShopLiveTeamMembers = async (
  project_id: number | string,
  teamMember: ProjectTeamMemberParams,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<undefined>> =>
  Put(
    business_type === E.project.BusinessType.supplyChain
      ? `${UPDATE_SUPPLY_CHAIN_TEAM_MEMBERS}/${project_id}/`
      : business_type === E.project.BusinessType.locallife
      ? `${UPDATE_LOCAL_LIFE_TEAM_MEMBERS}/${project_id}/`
      : `${UPDATE_SHOP_LIVE_TEAM_MEMBERS}/${project_id}/`,
    {
      ...teamMember,
    },
  );

/** 店播项目 详情 直播场次列表 */
export const QueryShopLiveProjectLiveList = async (
  payload: ShopLiveProjectLiveQueryParams,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<ListResponse<ProjectShopLive>> =>
  Get(
    business_type === E.project.BusinessType.supplyChain
      ? QUERY_PROJECT_SHOP_LIVE_SUPPLY_CHAIN
      : business_type === E.project.BusinessType.locallife
      ? QUERY_PROJECT_SHOP_LIVE_LOCAL_LIFE
      : QUERY_PROJECT_SHOP_LIVE,
    {
      params: {
        ...ObjectFilterEmpty(payload ?? ''),
      },
    },
  );

/** 店播项目 详情 直播场次列表 */
export const QueryShopLiveProjectLiveListMcn = async (
  payload: ShopLiveProjectLiveQueryParams,
): Promise<ListResponse<ProjectShopLive>> =>
  Get(QUERY_PROJECT_SHOP_LIVE_MCN, {
    params: {
      ...ObjectFilterEmpty(payload ?? ''),
    },
  });

/** 店播项目 详情 直播场次列表 */
export const QueryShopLiveMerchantgoods = async (payload: any): Promise<ListResponse<any>> =>
  Get('/api/shop_live/get_live_goods', {
    params: {
      ...ObjectFilterEmpty(payload ?? ''),
    },
  });

/** 复制排期 */
export const CopShopLiveScheduleService = async (
  project_id: number | string,
  c_start_date: string,
  c_end_date: string,
  v_start_date: string,
  need_continue: number,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<undefined>> =>
  Post(
    business_type === E.project.BusinessType.supplyChain
      ? COPY_SHOP_LIVE_SCHEDULE_API_SUPPLY_CHAIN
      : business_type === E.project.BusinessType.locallife
      ? COPY_SHOP_LIVE_SCHEDULE_API_LOCAL_LIFE
      : COPY_SHOP_LIVE_SCHEDULE_API,
    {
      project_id,
      c_start_date,
      c_end_date,
      v_start_date,
      need_continue,
    },
  );

/** 店播项目详情 直播留档 列表 */
export const QueryShopLiveRecordDataList = async (
  shop_live_id: number | string,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<ShopLiveRecordData[]>> =>
  Get(
    business_type === E.project.BusinessType.supplyChain
      ? SUPPLY_CHAIN_RECORD_DATA_LIST_API
      : business_type === E.project.BusinessType.locallife
      ? LOCAL_LIFE_RECORD_DATA_LIST_API
      : SHOP_LIVE_RECORD_DATA_LIST_API,
    {
      params: {
        shop_live_id: shop_live_id,
      },
    },
  );

/** 新增/编辑 直播留档 */
export const UpdateShopLiveRecordDataService = async (
  payload: ShopLiveRecordDataForm,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<undefined>> =>
  Post(
    business_type === E.project.BusinessType.supplyChain
      ? SHOP_LIVE_SUPPLY_CHAIN_RECORD_DATA_EDIT_API
      : business_type === E.project.BusinessType.locallife
      ? SHOP_LIVE_LOCAL_LIFE_RECORD_DATA_EDIT_API
      : SHOP_LIVE_RECORD_DATA_EDIT_API,
    {
      ...ObjectFilterEmpty(payload),
    },
  );

/** 删除 直播留档 */
export const RemoveShopLiveRecordDataService = async (
  id: number,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<undefined>> =>
  Post(
    business_type === E.project.BusinessType.supplyChain
      ? SHOP_LIVE_SUPPLY_CHAIN_RECORD_DATA_DELETE_API
      : business_type === E.project.BusinessType.locallife
      ? SHOP_LIVE_LOCAL_LIFE_RECORD_DATA_DELETE_API
      : SHOP_LIVE_RECORD_DATA_DELETE_API,
    {
      ...ObjectFilterEmpty({ id: id }),
    },
  );

/** 主播 排班 */
export const SaveShopLiveKOLScheduleDataService = async (
  payload: {
    shop_live_id: number | string;
    kol_schedule_infos: { start_time: string; end_time: string; kol_ids: number[] }[];
  },
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<undefined>> =>
  Post(
    business_type === E.project.BusinessType.supplyChain
      ? SUPPLY_CHAIN_SAVE_KOL_SCHEDULE_DATA_API
      : business_type === E.project.BusinessType.locallife
      ? LOCAL_LIFE_SAVE_KOL_SCHEDULE_DATA_API
      : SHOP_LIVE_SAVE_KOL_SCHEDULE_DATA_API,
    {
      ...ObjectFilterEmpty(payload),
    },
  );

/** 运营 排班 */
export const SaveShopLiveOperatorScheduleDataService = async (payload: {
  shop_live_id: string;
  operator_schedule_infos: { start_time: string; end_time: string; operator_ids: number[] }[];
}): Promise<HttpResponse<undefined>> =>
  Post(SHOP_LIVE_SAVE_OPERATOR_SCHEDULE_DATA_API, {
    ...ObjectFilterEmpty(payload),
  });

/** 今日排班接口 */
export const QueryTodayLiveScheduleDetail = async (
  project_id: string,
): Promise<HttpResponse<TodaySchedule>> =>
  Get(QUERY_TODAY_LIVE_SCHEDULE_DETAIL, {
    params: {
      project_id,
    },
  });

/** 排班预警接口 */
export const QueryTodayLiveScheduleWarningDetail = async (
  project_id: string,
): Promise<HttpResponse<any>> =>
  Get(QUERY_TODAY_LIVE_SCHEDULE_WARNING_DETAIL, {
    params: {
      project_id,
    },
  });
/** 排班预警接口供应链 */
export const querySupplyChainScheduledWarning = async (
  project_id: string,
): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/query_supply_chain_scheduled_warning', {
    params: {
      project_id,
    },
  });
/** 查询是否在项目成员中 */
export const QueryInProjectTeam = async (
  project_id: string,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<{ in_project: number }>> =>
  Get(
    business_type === E.project.BusinessType.supplyChain
      ? SUPPLY_CHAIN_IN_PROJECT_TEAM
      : business_type === E.project.BusinessType.locallife
      ? LOCAL_LIFE_IN_PROJECT_TEAM
      : IN_PROJECT_TEAM,
    {
      params: {
        ...ObjectFilterEmpty({
          project_id,
          business_type,
        }),
      },
    },
  );

/** 查询用户名 */
export const QueryUserNames = async (
  username: string,
): Promise<HttpResponse<{ user_data: { id: number; username: string }[] }>> =>
  Get(QUERY_USER_NAMES, {
    params: {
      username,
    },
  });

/** 新增/编辑场次 V2 */
export const EditShopLiveDisplayServiceV2 = async (
  payload: {
    id?: number | string;
    project_id: string;
    live_title: string;
    live_end_time: string;
    live_start_time: string;
    studio_id?: string;
    kol_schedule_infos?: { start_time: string; end_time: string; kol_ids: number[] }[];
    operator_schedule_infos?: { start_time: string; end_time: string; operator_ids: number[] }[];
  },
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<undefined>> =>
  Post(
    business_type === E.project.BusinessType.supplyChain
      ? EDIT_SHOP_LIVE_SUPPLY_CHAIN_DISPLAY_DATA_API
      : business_type === E.project.BusinessType.locallife
      ? EDIT_SHOP_LIVE_LOCAL_LIFE_DISPLAY_DATA_API
      : EDIT_SHOP_LIVE_DISPLAY_DATA_API,
    {
      ...payload,
    },
  );

/** 新增/编辑场次 V2 */
export const EditShopLiveDisplayServiceV2Mcn = async (payload: {
  id?: number | string;
  project_id: string;
  live_title: string;
  live_end_time: string;
  live_start_time: string;
  studio_id?: string;
  kol_schedule_infos?: { start_time: string; end_time: string; kol_ids: number[] }[];
  operator_schedule_infos?: { start_time: string; end_time: string; operator_ids: number[] }[];
}): Promise<HttpResponse<undefined>> =>
  Post(EDIT_SHOP_LIVE_DISPLAY_DATA_API_MCN, {
    ...ObjectFilterEmpty(payload),
  });

/** 设置店播场次为未归档 */
export const SetLiveDisplayNotLived = async (
  payload: {
    shop_live_id: string;
  },
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<undefined>> =>
  Post(
    business_type === E.project.BusinessType.supplyChain
      ? `${SET_SUPPLY_CHAIN_LIVE_DISPLAY_NOT_LIVED}/${payload.shop_live_id}/`
      : business_type === E.project.BusinessType.locallife
      ? `${SET_LOCAL_LIFE_LIVE_DISPLAY_NOT_LIVED}/${payload.shop_live_id}/`
      : `${SET_LIVE_DISPLAY_NOT_LIVED}/${payload.shop_live_id}/`,
  );

/** 设置MCN场次为未归档 */
export const SetMCNLiveDisplayNotLived = async (payload: {
  shop_live_id: string;
}): Promise<HttpResponse<undefined>> =>
  Post(`${SET_MCN_LIVE_DISPLAY_NOT_LIVED}/${payload.shop_live_id}/`);

/** 修改已完结项目状态 */
export const ChangeProjectStatus = async (payload: {
  id: string | number | undefined;
  status: ProjectStatusEnum | undefined;
  project_type: ProjectTypeEnum | undefined;
}): Promise<HttpResponse<undefined>> => {
  switch (payload.project_type) {
    case ProjectTypeEnum.live:
      return Post(CHANGE_SHOP_LIVE_PROJECT_STATUS, {
        id: payload.id,
        status: payload.status,
      });
    case ProjectTypeEnum.common_business:
      return Post(CHANGE_COMMON_PROJECT_STATUS, {
        id: payload.id,
        status: payload.status,
      });
    case ProjectTypeEnum.marketing:
      return Post(CHANGE_COOPERATION_STATUS, {
        id: payload.id,
        status: payload.status,
      });
    default:
      return Post(CHANGE_SHOP_LIVE_PROJECT_STATUS, {
        id: payload.id,
        status: payload.status,
      });
  }
};
// 场次详情-直播数据
export const GetShopLiveStatistic = async (
  shop_live_id: string | number,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<ShopLiveStatistic>> =>
  Get(
    business_type === E.project.BusinessType.supplyChain
      ? GET_SUPPLY_CHAIN_STATISTIC
      : business_type === E.project.BusinessType.locallife
      ? GET_LOCAL_LIFE_STATISTIC
      : GET_SHOP_LIVE_STATISTIC,
    {
      params: {
        shop_live_id,
      },
    },
  );

// 项目日目标列表
export const QueryProjectDailyGoalSettings = async (payload: {
  year: string | number;
  project_id: number | string;
  month: number | string;
  business_type: number | undefined;
}): Promise<HttpResponse<any>> =>
  Get(
    QUERY_PROJECT_DAILY_GOAL_SETTINGS +
      (payload.business_type === E.project.BusinessType.supplyChain
        ? '/supply_chain'
        : payload.business_type === E.project.BusinessType.locallife
        ? '/local_life'
        : ''),
    {
      params: {
        ...payload,
      },
    },
  );

/** 设置MCN场次为未归档 */
export const SaveProjectShopDailyGoalSetting = async (payload: {
  project_id: string;
  year: number;
  month: number;
  is_enforcement: number;
  goals: {
    anchor_id: number;
    days: {
      goal_value: string | number | undefined;
      goal_day: string | number | undefined;
    }[];
  }[];
}): Promise<HttpResponse<undefined>> =>
  Post(SAVE_PROJECT_SHOP_DAILY_GOAL_SETTINGS, {
    ...ObjectFilterEmpty(payload),
  });

/** 项目完结更新结算周期 */
export const update_end_project = async (
  id: number | undefined,
  payload: {
    cycle_day?: number | string;
  },
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<HttpResponse<undefined>> =>
  Post(
    business_type === E.project.BusinessType.supplyChain
      ? `/api/shop_live/update_end_project/supply_chain/${id}`
      : business_type === E.project.BusinessType.locallife
      ? `/api/shop_live/update_end_project/local_life/${id}`
      : business_type === E.project.BusinessType.s2b2c
      ? `/api/shop_live/update_end_project/end_common_project/${id}`
      : `/api/shop_live/update_end_project/${id}`,
    {
      ...ObjectFilterEmpty(payload),
    },
  );

/** 查询本地生活项目提醒 */
export const QueryInProjectReminds = async (
  project_id: string,
  business_type?: number,
): Promise<HttpResponse<{ in_project: number }>> =>
  Get('/api/shop_live/shop_live_project_reminds', {
    params: {
      project_id,
      business_type,
    },
  });

/** 查询小店商品列表 */
export const query_shop_product = async (
  pager: IGPageQuery,
  payload: QueryShopProductParams,
): Promise<ListResponse<any>> =>
  Get('/api/shop_live/query_shop_product', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });

/** 查询插件商品库列表 */
export const query_store_product = async (
  pager: IGPageQuery,
  payload: QueryShopProductParams,
): Promise<ListResponse<any>> =>
  Get('/api/shop_live/query_store_product', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });

/** 查询项目的所有一级类目和三级类目数据 */
export const query_project_tiange_category = async (payload: {
  project_id?: number | string;
  level?: number;
  /** 天鸽类目ID **/
  tiange_category_id?: number;
}): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/analysis/query_project_tiange_category', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

/** 添加商品到商品库 */
export const add_store_product = async (payload: {
  product_id?: number | string;
  project_id?: number | string;
  amount?: number | string;
  sell_point?: number | string;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/shop_live/add_store_product', {
    ...ObjectFilterEmpty(payload),
  });

/** 移出商品库 */
export const delete_store_product = async (payload: {
  product_id?: number | string;
  project_id?: number | string;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/shop_live/delete_store_product', {
    ...ObjectFilterEmpty(payload),
  });

/** 修改商品 */
export const modify_store_product = async (payload: {
  amount?: number | string;
  id?: number | string;
  listed_index?: number | string;
  sell_point?: string;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/shop_live/modify_store_product', {
    ...ObjectFilterEmpty(payload),
  });
/** 通过excel导入商品 */
export const import_store_product = async (payload: {
  file_path?: string;
  project_id?: number | string;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/shop_live/import_store_product', {
    ...ObjectFilterEmpty(payload),
  });
/** 查询近七天场次数据 */
export const query_project_live_room_info = async (payload: {
  project_id?: number | string;
  start_date?: string;
  end_date?: string;
}): Promise<HttpResponse<any>> =>
  Get('/api/shop_live/smart_store/query_project_live_room_info', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });

/** 智能选品库预览接口 */
export const preview_smart_select_product = async (payload: {
  project_id?: number | string;
  select_type?: E.project.LiveToolGoodsSelectType;
  shop_live_id?: number;
  smart_select_num?: number | string;
  custom_select_data?: any[];
}): Promise<HttpResponse<any>> =>
  Post('/api/shop_live/smart_store/preview_smart_select_product', {
    ...ObjectFilterEmpty(payload),
  });

/** 智能选品库提交接口 */
export const submit_smart_select_product = async (payload: {
  project_id?: number | string;
  add_type?: E.project.SmartSelectionLibAddWay;
  datas?: {
    amount: number;
    product_id: string;
    sell_point: string;
  }[];
}): Promise<HttpResponse<undefined>> =>
  Post('/api/shop_live/smart_store/submit_smart_select_product', {
    ...ObjectFilterEmpty(payload),
  });

/** --------- 运营数据 电商业务 */

//查询场次查询
export const query_shop_live_define_record = async (
  payload: {
    project_id: number | string;
  },
  business_type?: number | string,
): Promise<HttpResponse<any>> => {
  let defaultApi = '/api/shop_live/project_data/query_shop_live_define_record';
  if (business_type === E.project.BusinessType.supplyChain) {
    defaultApi = '/api/shop_live/project_data/query_shop_live_define_record/supply_chain';
  }
  return Get(defaultApi, {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });
};

//查询合并后场次统计数据
export const query_merge_shop_live_list = async (
  payload: {
    project_id: number | string;
    start_date: string;
    end_date: string;
  },
  business_type?: number | string,
): Promise<HttpResponse<any>> => {
  let defaultApi = '/api/shop_live/project_data/query_merge_shop_live_list';
  if (business_type === E.project.BusinessType.supplyChain) {
    defaultApi = '/api/shop_live/project_data/query_merge_shop_live_list/supply_chain';
  }
  return Get(defaultApi, {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });
};

//新增/编辑场次设置
export const insert_or_update_shop_live_define_record = async (
  payload: {
    project_id: number | string;
    define_list: {
      define_name: number;
      end_time: string;
      start_time: string;
    }[];
  },
  business_type?: number | string,
): Promise<HttpResponse<undefined>> => {
  let defaultApi = '/api/shop_live/project_data/insert_or_update_shop_live_define_record';
  if (business_type === E.project.BusinessType.supplyChain) {
    defaultApi =
      '/api/shop_live/project_data/insert_or_update_shop_live_define_record/supply_chain';
  }
  return Post(defaultApi, {
    ...ObjectFilterEmpty({
      ...payload,
    }),
  });
};

//添加任务同步场次数据
export const sync_compass_live_room = async (payload: {
  project_id: number | string;
  define_list: {
    define_name: number;
    end_time: string;
    start_time: string;
  }[];
}): Promise<HttpResponse<undefined>> =>
  Post('/api/shop_live/sync_compass_live_room', {
    ...ObjectFilterEmpty(payload),
  });

//修改合并场次的目标GMV
export const update_merge_shop_live_goal_gmv = async (
  payload: {
    merge_live_id: number | string;
    goal_gmv: number | string;
  },
  business_type?: number | string,
): Promise<HttpResponse<undefined>> => {
  let defaultApi = '/api/shop_live/project_data/update_merge_shop_live_goal_gmv';
  if (business_type === E.project.BusinessType.supplyChain) {
    defaultApi = '/api/shop_live/project_data/update_merge_shop_live_goal_gmv/supply_chain';
  }
  return Post(defaultApi, {
    ...ObjectFilterEmpty({
      ...payload,
    }),
  });
};

//修改合并场次
export const merge_multiple_shop_live = async (
  payload: {
    merge_shop_live_ids: number[];
    project_id: number | string;
  },
  business_type?: number | string,
): Promise<HttpResponse<undefined>> => {
  let defaultApi = '/api/shop_live/project_data/merge_multiple_shop_live';
  if (business_type === E.project.BusinessType.supplyChain) {
    defaultApi = '/api/shop_live/project_data/merge_multiple_shop_live/supply_chain';
  }
  return Post(defaultApi, {
    ...ObjectFilterEmpty({
      ...payload,
    }),
  });
};

//场次拆分
export const merge_shop_live_split = async (
  payload: {
    merge_live_id: number;
  },
  business_type?: number | string,
): Promise<HttpResponse<undefined>> => {
  let defaultApi = '/api/shop_live/project_data/merge_shop_live_split';
  if (business_type === E.project.BusinessType.supplyChain) {
    defaultApi = '/api/shop_live/project_data/merge_shop_live_split/supply_chain';
  }
  return Post(defaultApi, {
    ...ObjectFilterEmpty({
      ...payload,
    }),
  });
};

//查询合并场次统计数据详情页
export const get_merge_shop_live_detail = async (
  payload: {
    merge_live_id: number | string;
    comparison_label: 1 | 2;
  },
  business_type?: number | string,
): Promise<HttpResponse<any>> => {
  let defaultApi = '/api/shop_live/project_data/get_merge_shop_live_detail';
  if (business_type === E.project.BusinessType.supplyChain) {
    defaultApi = '/api/shop_live/project_data/get_merge_shop_live_detail/supply_chain';
  }
  return Get(defaultApi, {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
      }),
    },
  });
};

/** 保存场次复盘数据 */
export const save_review_record_detail = async (payload: {
  merge_live_id: number | string;
  review_record_detail: any;
}): Promise<HttpResponse<any>> =>
  Post('/api/shop_live/operating/save_review_record_detail', {
    ...ObjectFilterEmpty({
      ...payload,
    }),
  });
