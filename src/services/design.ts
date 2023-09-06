import { Get, Post } from '@/utils/request';
import { HttpResponse, ListResponse } from '@/types/base/http';
import { ObjectFilterEmpty } from '@/utils/func';
import { IGPageQuery } from '@/types/tiange/general';
import moment, { Moment } from 'moment';

/** 发起预约单 */
export const Save_Reservation_Form = async (
  payload: M.design.Reservation,
): Promise<HttpResponse<M.design.Reservation[]>> =>
  Post(`/api/image_design/save_reservation_form`, ObjectFilterEmpty(payload));

/** 查询预约单 */
export const Query_Reservation_Form = async (
  pager: IGPageQuery,
  payload: any,
): Promise<ListResponse<M.design.Reservation[]>> => {
  const _payload = { ...pager, ...payload };
  if (_payload.appointment_date) {
    _payload.appointment_date = moment(_payload.appointment_date).format('YYYY-MM-DD');
  }
  return Get(`/api/image_design/query_reservation_form`, {
    params: ObjectFilterEmpty(_payload),
  });
};

/** 查询预约单 */
export const Query_Image_Design = async (
  pager: IGPageQuery,
  payload: any,
): Promise<ListResponse<M.design.ReservationQuery[]>> => {
  return Get(`/api/image_design/query_image_design`, {
    params: ObjectFilterEmpty({
      ...pager,
      ...payload,
    }),
  });
};

/** 查询预约单_日历模式  */
export const Query_Image_Design_Calendar = async (
  payload: any,
): Promise<ListResponse<M.design.ReservationQuery[]>> =>
  Get('/api/image_design/query_image_design_calendar', {
    params: ObjectFilterEmpty({
      ...payload,
    }),
  });

/** 查询预约单 */
export const Query_Images_By_Project_Name = async (payload: {
  project_id: number;
  project_name: string;
  selectedDate: string | Moment;
  start_time: string;
  end_time: string;
  image_design_id: string;
  business_type: E.project.BusinessType;
}): Promise<HttpResponse<Record<string, string[]>>> =>
  Get('/api/image_design/query_images_by_project_name', {
    params: ObjectFilterEmpty(payload),
  });

/** 查询形象图片 */
export const Query_Image_Designer = async (
  pager: IGPageQuery,
  payload: {
    username?: string;
    is_leave?: string;
  },
): Promise<ListResponse<{ real_name: string; username: string; id: number }>> =>
  Get('/api/image_design/query_image_designer', {
    params: ObjectFilterEmpty({
      ...pager,
      ...payload,
    }),
  });

/** 根据业务类型查询项目名列表 */
export const Query_Project_Name = async (
  pager: IGPageQuery,
  payload: {
    business_type: E.project.BusinessType;
    project_name: string;
    search_type: number;
  },
): Promise<ListResponse<{ project_name: string; project_id: number }>> =>
  Get('/api/image_design/query_project_name', {
    params: ObjectFilterEmpty({
      ...pager,
      ...payload,
    }),
  });
/** 校验预约单时间 */
export const Check_Reservation_Form_Date = async (
  appointment_date_list: string[],
): Promise<HttpResponse<(TG.OptionType & { message: string | undefined })[]>> =>
  Post(
    '/api/image_design/check_reservation_form_date',
    ObjectFilterEmpty({
      appointment_date_list,
    }),
  );

/** 修改预约单 */
export const Modify_Reservation_Form = async (payload: {
  id: number;
  // 操作类型 1: 接单, 2:退单, 3:撤单, 4:完成,5:未完成,6:上传; 7 评价; 8 调整妆造师
  operation_type: number;
  receiving_order_remark?: string;
  chargeback_remark?: string;
  finish_remark?: string;
  unfinished_remark?: string;
  effect_drawing?: string[];
  satisfaction?: string;
  satisfaction_evaluate?: string;
  // 妆造师ID，用于调整妆造师
  image_design_id?: number;
}): Promise<HttpResponse<TG.OptionType[]>> =>
  Post('/api/image_design/modify_reservation_form', ObjectFilterEmpty(payload));

/** 视觉设计 */
/** 部门设置 */
export const Save_Department_Setting_Form = async (
  payload: any,
): Promise<HttpResponse<TG.OptionType[]>> =>
  Post('/api/visual_design/setting/department', { ...ObjectFilterEmpty(payload) });

/** 查询视觉设计列表 */
export const Query_Setting_Design_Type_Form = async (payload: any): Promise<HttpResponse<any>> =>
  Get('/api/visual_design/setting/design_type', {
    params: ObjectFilterEmpty({
      ...payload,
    }),
  });

/** 设计类型可选择的字段设置列表 */
export const Query_Design_Type_Fields = async (): Promise<
  HttpResponse<{ id: number; name: string }[]>
> => Get('/api/visual_design/setting/design_type_fields');

/** 已设置的部门列表 */
export const Query_Design_Type_Department = async (): Promise<
  HttpResponse<{ id: number; name: string }[]>
> => Get('/api/visual_design/setting/department');

/** 交付格式列表 */
export const Query_Design_Type_File_Extension = async (): Promise<
  HttpResponse<{ id: number; name: string }[]>
> => Get('/api/visual_design/setting/file_extension');

/**新增设计类型接口 */
export const Save_Design_Type_Form = async (payload: any): Promise<HttpResponse<TG.OptionType[]>> =>
  Post('/api/visual_design/setting/design_type', { ...ObjectFilterEmpty(payload) });

/**新增视觉设计接口 */
export const Save_Design_Order_Form = async (
  payload: any,
): Promise<HttpResponse<TG.OptionType[]>> =>
  Post('/api/visual_design/design_order', { ...ObjectFilterEmpty(payload) });

/**新增视觉设计接口 */
export const Save_Design_Order_Form_Save = async (
  payload: any,
): Promise<HttpResponse<TG.OptionType[]>> =>
  Post('/api/visual_design/design_order_save', { ...ObjectFilterEmpty(payload) });

/** 色彩偏好列表 */
export const Query_Design_Type_Color_Preferences = async (): Promise<
  HttpResponse<{ id: number; name: string }[]>
> => Get('/api/visual_design/color_preferences');
/** 视觉设计订单删除接口 */
export const Post_Visual_Design_Order_Delete = async (
  order_id: number,
): Promise<HttpResponse<void>> => Post('/api/visual_design/design_order_delete', { order_id });

/** 风格偏好列表 */
export const Query_Design_Type_Style_Preferences = async (): Promise<
  HttpResponse<{ id: number; name: string }[]>
> => Get('/api/visual_design/style_preferences');

/** 查询设计项目级别 */
export const Query_Design_Order_Status = async (): Promise<
  HttpResponse<Record<string, string[]>>
> => Get('/api/visual_design/design_order/status');

/** 设计订单执行状态下拉选项 */
export const Query_Design_Level = async (): Promise<ListResponse<any>> =>
  Get('/api/visual_design/get_design_level');

/** 查询视觉设计列表接口 */
export const Query_Design_Order = async (
  pager: IGPageQuery,
  payload: any,
): Promise<ListResponse<M.design.Reservation>> => {
  const _payload = { ...pager, ...payload };
  // if (_payload.appointment_date) {
  //   _payload.appointment_date = moment(_payload.appointment_date).format('YYYY-MM-DD');
  // }

  return Get(`/api/visual_design/design_order`, {
    params: ObjectFilterEmpty(_payload),
  });
};
/**
 * 查询是否有未接单数据
 */
export const Query_Visual_Design_Assign_Order = async (): Promise<HttpResponse<boolean>> => {
  return Get('/api/visual_design/get_assign_order');
};
export const Query_Visual_Design_Workbench_Assign_Order = async (): Promise<
  HttpResponse<boolean>
> => {
  return Get('/api/visual_design/workbench/get_assign_order');
};

/** 工作台--查询视觉设计列表接口 */
export const Query_Design_Workbench_Order = async (
  pager: IGPageQuery,
  payload: any,
): Promise<ListResponse<M.design.Reservation>> => {
  const _payload = { ...pager, ...payload };
  // if (_payload.appointment_date) {
  //   _payload.appointment_date = moment(_payload.appointment_date).format('YYYY-MM-DD');
  // }

  return Get(`/api/visual_design/workbench/design_order`, {
    params: ObjectFilterEmpty(_payload),
  });
};

/** 查询项目类型 */
export const Query_Design_Type = async (
  team_id: number,
): Promise<HttpResponse<Record<string, string[]>>> =>
  Get('/api/visual_design/setting/design_type', {
    params: ObjectFilterEmpty({ team_id }),
  });

/** 查询设计订单详情 */
export const Query_Design_Order_Detail = async (
  order_id: string,
  isWorkbench?: boolean,
): Promise<HttpResponse<Record<string, string[]>>> => {
  if (isWorkbench) {
    return Get('/api/visual_design/design_order/workbench/' + order_id);
  } else {
    return Get('/api/visual_design/design_order/' + order_id);
  }
};

/** 查询设计订单详情 */
export const Set_Design_Order_distribution = async (payload: {
  order_id: string;
  delivery_time: string;
  executor: number;
  level: number;
}): Promise<HttpResponse<Record<string, string[]>>> =>
  Post('/api/visual_design/distribute', ObjectFilterEmpty(payload));

/** 设计订单拒绝 */
export const Set_Design_Order_refuse = async (payload: {
  order_id: string;
  refuse_comment: string;
}): Promise<HttpResponse<Record<string, string[]>>> =>
  Post('/api/visual_design/refuse', ObjectFilterEmpty(payload));

/** 添加审核意见 */
export const Set_Design_Order_add_comment = async (payload: {
  order_id: string;
  comment: string;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/visual_design/step/add_comment', ObjectFilterEmpty(payload));

/** 审核阶段-发起审核 */
export const Set_Design_Order_start_review = async (payload: {
  order_id: string;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/visual_design/step/start_review', ObjectFilterEmpty(payload));

/** 审核阶段-审核通过 */
export const Set_Design_Order_approved_review = async (payload: {
  order_id: string;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/visual_design/step/approved_review', ObjectFilterEmpty(payload));

/** 审核阶段-审核不通过 */
export const Set_Design_Order_failed_review = async (payload: {
  order_id: string;
  audit_comment: string;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/visual_design/step/failed_review', ObjectFilterEmpty(payload));

/** 审核阶段-新增附件 */
export const Set_Design_Order_add_attachment = async (payload: {
  order_id: string;
  attachment_url_list: string[];
}): Promise<HttpResponse<undefined>> =>
  Post('/api/visual_design/step/add_attachment', ObjectFilterEmpty(payload));

/** 审核阶段-删除附件 */
export const Set_Design_Order_del_attachment = async (payload: {
  order_id: string;
  attachment_url: string;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/visual_design/step/del_attachment', ObjectFilterEmpty(payload));

/** 查询审核评论 */
export const Set_Design_Order_Get_Comment = async (payload: {
  order_id: string;
}): Promise<HttpResponse<any>> =>
  Get('/api/visual_design/step/get_comment', {
    params: ObjectFilterEmpty({
      ...payload,
    }),
  });

/** 交付阶段-交付 */
export const Set_Design_delivery_delivery = async (payload: {
  order_id: string;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/visual_design/delivery', ObjectFilterEmpty(payload));

/** 取消订单 */
export const Set_Design_cancel = async (payload: {
  order_id: string;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/visual_design/cancel', ObjectFilterEmpty(payload));

/** 活动完成 */
export const Set_Design_order_confirm = async (payload: {
  order_id: string;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/visual_design/order_confirm', ObjectFilterEmpty(payload));

/** 交付阶段-新增附件  */
export const Set_Design_delivery_add_attachment = async (payload: {
  order_id: string;
  attachment_type?: number;
  attachment_url_list: string[];
  design_type_id?: number;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/visual_design/delivery/add_attachment', ObjectFilterEmpty(payload));

/** 交付阶段-删除附件 */
export const Set_Design_delivery_del_attachment = async (payload: {
  order_id: string;
  attachment_type?: number;
  attachment_url: string;
  design_type_id?: number;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/visual_design/delivery/del_attachment', ObjectFilterEmpty(payload));

/** 设置预约日期接口 */
export const Set_Appointment_Date = async (payload: {
  appointment_time_list: string[];
  appointment_date: string;
}): Promise<HttpResponse<undefined>> => Post('/api/image_design/set_appointment_date', payload);

/** 查询预约日期设置接口 */
export const Query_Appointment_Date = async (payload: {
  appointment_date: string;
}): Promise<HttpResponse<{ label: string; disabled: boolean }[]>> =>
  Get('/api/image_design/query_appointment_date', {
    params: ObjectFilterEmpty({
      ...payload,
    }),
  });

/** 形象设计预约-总览 */
export const Get_Reservation_Statistics = async (payload: {
  start_date: string;
  end_date: string;
}): Promise<HttpResponse<M.design.ReservationStatistics>> =>
  Get('/api/image_design/get_reservation_statistics', {
    params: ObjectFilterEmpty({
      ...payload,
    }),
  });

/** 形象设计预约-饼图 */
export const Get_Reservation_Statistics_Pie_Chart = async (payload: {
  start_date: string;
  end_date: string;
  pie_chart_type: E.design.PieChartType;
}): Promise<HttpResponse<M.design.ReservatioonStatisticsPieModel[]>> =>
  Get('/api/image_design/get_reservation_statistics_pie_chart', {
    params: ObjectFilterEmpty({
      ...payload,
    }),
  });

/** 形象设计-项目类型旭日图 */
export const Get_Reservation_Statistics_Business_Type_Sunburst = async (payload: {
  start_date: string;
  end_date: string;
}): Promise<HttpResponse<M.design.ReservatioonStatisticsSunburstModel[]>> =>
  Get('/api/image_design/get_reservation_statistics_business_type_sunburst', {
    params: ObjectFilterEmpty({
      ...payload,
    }),
  });

/** 形象设计-项目类型旭日图 */
export const Get_Visual_Design_Search_Brand = async (
  name: string,
): Promise<HttpResponse<{ name: string; id: number }[]>> =>
  Get('/api/shop_live/search_brand', {
    params: ObjectFilterEmpty({
      name,
    }),
  });

/** 形象设计-项目类型旭日图 */
export const Get_Studio = async (studio_name: string): Promise<ListResponse<any>> =>
  Get('/api/studio/query_studio', {
    params: ObjectFilterEmpty({
      studio_name,
    }),
  });

/** 设置项目级别 */
export const Post_Visual_Design_Set_Design_Level = async (
  payload: M.design.Reservation,
): Promise<HttpResponse<M.design.Reservation[]>> =>
  Post(`/api/visual_design/set_design_level`, ObjectFilterEmpty(payload));

/*------设计统计----------  */
/** 用户创建工时接口  */
export const save_user_man_hour = async (payload: any): Promise<HttpResponse<undefined>> =>
  Post('/api/visual_design/save_user_man_hour', ObjectFilterEmpty(payload));

/** 查询当前用户的工时日历数据 */
export const QueryUserManHourForCalendar = async (payload: {
  query_month: string;
}): Promise<HttpResponse<M.visualDesignStatistics.ManHour[]>> =>
  Get('/api/visual_design/query_user_man_hour_for_calendar', {
    params: ObjectFilterEmpty(payload),
  });

/** 查询当前用户的工时日历数据 */
export const GetDepartmentDesignerManHourForCalendar = async (payload: {
  query_month: string;
  user_id?: number;
  department_id?: number;
}): Promise<HttpResponse<M.visualDesignStatistics.ManHour[]>> =>
  Get('/api/visual_design/get_department_designer_man_hour_for_calendar', {
    params: ObjectFilterEmpty(payload),
  });

/** 下单统计 查询日历数据接口 */
export const GetOrderStatisticsQueryCalendar = async (payload: {
  query_month: string;
  user_id?: number;
  department_id?: number;
  project_id?: number;
}): Promise<HttpResponse<M.visualDesignStatistics.ManHour[]>> =>
  Get('/api/visual_design/get_design_order_count_for_canl', {
    params: ObjectFilterEmpty(payload),
  });

/** 用户删除工时接口 */
export const DeleteUserManHour = async (payload: {
  man_hour_id: number;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/visual_design/delete_user_man_hour', ObjectFilterEmpty(payload));

/** 查询当前用户的工时卡片数据 */
export const GetUserManHourCardData = async (payload: {
  query_month: string;
}): Promise<HttpResponse<M.visualDesignStatistics.UserManHourCardData>> =>
  Get('/api/visual_design/get_user_man_hour_card_data', {
    params: ObjectFilterEmpty(payload),
  });

/** 查询统计卡片数据 */
export const GetManHourCountData = async (payload: {
  query_month: string;
}): Promise<HttpResponse<M.visualDesignStatistics.ManHourCountData>> =>
  Get('/api/visual_design/query_man_hour_count_data', {
    params: ObjectFilterEmpty(payload),
  });

/** 查询统计卡片数据 */
export const GetDesignOrderCountForProjectRequirement = async (payload: {
  query_month: string;
  department_id?: number;
  user_id?: number;
  project_id?: number;
}): Promise<HttpResponse<M.visualDesignStatistics.StatisticalItemsAndDepartmentsUnderOrders>> =>
  Get('/api/visual_design/get_design_order_count_for_project_requirement', {
    params: ObjectFilterEmpty(payload),
  });

/** 查询统计卡片部门和设计师数据  */
export const GetDepartmentAndDesignerManHour = async (payload: {
  query_month: string;
}): Promise<HttpResponse<M.visualDesignStatistics.cardDepartmentsAndDesigners>> =>
  Get('/api/visual_design/query_department_and_designer_man_hour', {
    params: ObjectFilterEmpty(payload),
  });

/** 获取部门或个人统计数据  */
export const GetDepartmentDesignerManHourCardData = async (payload: {
  query_month: string;
  department_id?: number;
  user_id?: number;
}): Promise<HttpResponse<M.visualDesignStatistics.UserManHourCardData>> =>
  Get('/api/visual_design/get_department_designer_man_hour_card_data', {
    params: ObjectFilterEmpty(payload),
  });

/** 查询当前用户的工时日历数据 */
export const GetDepartmentManHourCount = async (payload: {
  query_month: string;
  user_id?: number;
  department_id?: number;
}): Promise<HttpResponse<M.visualDesignStatistics.DepartmentManHour[]>> =>
  Get('/api/visual_design/get_department_man_hour_count', {
    params: ObjectFilterEmpty(payload),
  });

/** 获取当前用户的所属二级部门 */
export const GetUserLevelTwoDepartment = async (
  payload: any,
): Promise<
  HttpResponse<{
    id: number;
    name: string;
  }>
> =>
  Get('/api/feishu/get_user_level_two_department', {
    params: ObjectFilterEmpty(payload),
  });
