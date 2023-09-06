import { Get, Post, Delete } from '@/utils/request';
import { ListResponse, HttpResponse } from '@/types/base/http';
import { isEmpty, ObjectFilterEmpty } from '@/utils/func';
import { IGPageQuery } from '@/types/tiange/general';
import { AppealStatus, ECYCLE_TYPE } from '@/const/performance';

/** 查询指标库 */
export const Query_Indicators_Library = async (
  pager: IGPageQuery,
  payload: NPerformance.IndicatorsParams | { indicators_id: number },
): Promise<ListResponse<NPerformance.Indicators>> =>
  Get(`/api/performance_management/query_indicators_library`, {
    params: {
      ...pager,
      ...ObjectFilterEmpty(payload),
    },
  });

/** 新增编辑指标库 */
export const Save_Indicator = async (
  payload: NPerformance.Indicators,
): Promise<ListResponse<NPerformance.Indicators[]>> =>
  Post(`/api/performance_management/save_or_modify_indicator`, ObjectFilterEmpty(payload));

/** 删除指标 */
export const Delete_Indicators = async (
  payload: number[],
): Promise<ListResponse<NPerformance.Indicators[]>> => {
  return Delete('/api/performance_management/delete_indicators', {
    data: {
      id_list: payload,
    },
  });
};

/** 查询指标库标签 */
export const Query_Indicator_Tag = async (
  payload: NPerformance.IndicatorsParams,
): Promise<HttpResponse<NPerformance.IndicatorsTag[]>> =>
  Get(`/api/performance_management/query_indicator_tag`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 新增编辑指标库 */
export const Modify_Move_Indicator_Tag = async (
  payload: {
    indicator_id: number;
    tag_id: number;
    old_tag_id: number;
  }[],
): Promise<ListResponse<NPerformance.Indicators[]>> =>
  Post(`/api/performance_management/modify_move_indicator_tag`, {
    indicator_tag_list: payload,
  });

/** 新增编辑指标标签 */
export const Save_Indicator_Tag = async (payload: {
  name: string;
  id?: string;
}): Promise<ListResponse<NPerformance.Indicators[]>> =>
  Post(`/api/performance_management/save_or_modify_indicator_tag`, payload);

/** 新增编辑指标标签 */
export const Delete_Indicators_Tag = async (payload: number): Promise<HttpResponse<void>> =>
  Delete(`/api/performance_management/delete_indicators_tag/${payload}`);

/** 查询指标库标签 */
export const Feishu_Department_and_User_List = async (): Promise<
  HttpResponse<{
    count: number;
    data: Feishu.IDepartmentAndUser[];
  }>
> => Get(`/api/feishu/feishu_department_and_user_list`);

/** 保存考评组 */
export const Save_or_Modify_Evaluation_Group = async (
  payload: NPerformance.IEvaluationGroup,
): Promise<ListResponse<NPerformance.Indicators[]>> =>
  Post('/api/performance_management/save_or_modify_evaluation_group', payload);

/** 查询考评组 */
export const Query_Evaluation_Group = async (
  pager: IGPageQuery,
  payload: {
    name?: string;
    cycle_type: ECYCLE_TYPE;
  },
): Promise<ListResponse<NPerformance.IEvaluationGroup>> =>
  Get('/api/performance_management/query_evaluation_group', {
    params: ObjectFilterEmpty({
      ...pager,
      ...payload,
    }),
  });

/** 查询考评组 */
export const Query_Evaluation_Group_Name = async (
  pager: IGPageQuery,
  payload: {
    name?: string;
    cycle_type?: ECYCLE_TYPE;
    search_type?: number;
  },
): Promise<ListResponse<NPerformance.IEvaluationGroup[]>> =>
  Get('/api/performance_management/query_evaluation_group_name', {
    params: ObjectFilterEmpty({
      ...pager,
      ...payload,
    }),
  });

/** 删除考评组 */
export const Delete_Evaluation_Group = async (payload: number): Promise<HttpResponse<void>> =>
  Delete(`/api/performance_management/delete_evaluation_group/${payload}`);

/** 查询考核类表 */
export const Query_Assessment = async (
  pager: IGPageQuery,
  payload: {
    name?: string;
    cycle_type?: ECYCLE_TYPE;
  },
): Promise<ListResponse<NPerformance.IAssessment[]>> =>
  Get('/api/performance_management/query_assessment', {
    params: ObjectFilterEmpty({
      ...pager,
      ...payload,
    }),
  });

/** 保存考评组 */
export const Check_Launch_Assessment = async (payload: any): Promise<HttpResponse<any>> =>
  Post('/api/performance_management/check_launch_assessment_user_ids', payload);

/** 保存考评组 */
export const Save_Assessment = async (payload: any): Promise<ListResponse<void>> =>
  Post('/api/performance_management/save_assessment', payload);

export interface ParamsSaveAssessmentLevelConfig {
  entry_method: 1;
  config_list: {
    name: string;
    lte_score: number | string;
    gt_score: number | string;
  }[];
}

/** 新增或修改考核等级设置 */
export const Save_Assessment_Level_Config = async (
  payload: ParamsSaveAssessmentLevelConfig,
): Promise<ListResponse<void>> =>
  Post('/api/performance_management/save_assessment_level_config', payload);

/** 查询考核等级设置 */
export const Query_Assessment_Level_Config = async (): Promise<
  HttpResponse<ParamsSaveAssessmentLevelConfig[]>
> => Get('/api/performance_management/query_assessment_level_config');

/** 查询考核详情列表 */
interface ParamsQueryAssessmentDetail {
  assessment_management_id?: number;
  username?: string;
  user_id?: string | number;
  assessment_detail_id?: number;
  evaluation_group_id?: number;
  cycle_type?: ECYCLE_TYPE;
  is_finish?: number;
  // 搜索类型，1是我的绩效，2是与我相关，3是下级考核
  search_type?: number;
}

export const Query_Assessment_Detail = async (
  pager: IGPageQuery,
  payload: ParamsQueryAssessmentDetail,
): Promise<ListResponse<any>> =>
  Get('/api/performance_management/query_assessment_detail', {
    params: ObjectFilterEmpty({
      ...pager,
      ...payload,
    }),
  });
export const Query_Assessment_Detail_My_Performance = async (
  pager: IGPageQuery,
  payload: ParamsQueryAssessmentDetail,
): Promise<ListResponse<any>> =>
  Get('/api/performance_management/query_assessment_detail_my_performance', {
    params: ObjectFilterEmpty({
      ...pager,
      ...payload,
    }),
  });
// 我的绩效/与我相关详情/下级考核
export const Get_Assessment_Detail_By_My_Performance = async (
  payload: ParamsQueryAssessmentDetail & { search_type: number },
): Promise<HttpResponse<any>> =>
  Get('/api/performance_management/get_assessment_detail_by_my_performance', {
    params: ObjectFilterEmpty(payload),
  });

// 考核结果分析详情
export const Query_Assessment_Detail_By_Analysis = async (
  pager: IGPageQuery,
  payload: ParamsQueryAssessmentDetail,
): Promise<ListResponse<any>> =>
  Get('/api/performance_management/query_assessment_detail_by_analysis', {
    params: ObjectFilterEmpty({
      ...pager,
      ...payload,
    }),
  });
// 员工绩效档案详情
export const Query_Assessment_Detail_By_Performance_Record = async (
  pager: IGPageQuery,
  payload: ParamsQueryAssessmentDetail,
): Promise<ListResponse<any>> =>
  Get('/api/performance_management/query_assessment_detail_by_performance_record', {
    params: ObjectFilterEmpty({
      ...pager,
      ...payload,
    }),
  });

export interface IParamsModifyStartScore {
  assessment_management_id: number;
  evaluation_group_id_list?: number[];
  user_id_list?: number[];
  //  自评截止时间
  self_evaluation_deadline: string;
  //  上级评分截止时间
  superior_rating_deadline: string;
  //  签字确认截止时间
  sign_confirm_deadline: string;
}

/** 新增或修改考核等级设置 */
export const Modify_Start_Score = async (
  payload: IParamsModifyStartScore,
): Promise<ListResponse<void>> => Post('/api/performance_management/modify_start_score', payload);

/** 查询考评组详情列表*/
export const Query_Evaluation_Group_Detail = async (
  payload: number[],
): Promise<HttpResponse<NPerformance.IEvaluationGroup[]>> =>
  Post('/api/performance_management/query_evaluation_group_detail', {
    evaluation_group_id_list: payload,
  });

/** 修改考核结果 */
export const Modify_Assessment_Result = async (payload: {
  assessment_detail_id: number;
  score: number;
  level: string;
  remark: string;
}): Promise<HttpResponse<NPerformance.IEvaluationGroup[]>> =>
  Post('/api/performance_management/modify_assessment_result', payload);

/** 修改考核结果 */
export const batch_modify_performance_process_transmit = async (payload: {
  assessment_detail_ids: number[];
  operate_type_list: number[];
  transfer_user_id: number | undefined;
}): Promise<HttpResponse<void>> =>
  Post('/api/performance_management/batch_modify_performance_process_transmit', payload);

/** 申诉修改考核结果 */
export const TEST__SSXG = async (payload: {
  assessment_detail_id: number;
  appeal_status: AppealStatus;
  revoke_reason?: string;
  adjustment_reason?: string;
  result?: number;
}): Promise<HttpResponse<void>> => {
  console.log('发送数据', payload);
  return Promise.resolve({ data: { success: true } } as any);
};

/** 查询我的绩效列表 */
export const Query_My_Performance = async (
  pager: IGPageQuery,
  payload: {
    assessment_management_id?: number;
    evaluation_group_id?: number;
    stage?: number;
  },
): Promise<ListResponse<NPerformance.IAssessmentPeople>> =>
  Get('/api/performance_management/query_my_performance', {
    params: ObjectFilterEmpty({
      ...pager,
      ...payload,
    }),
  });

/** 查询考核下的人员和考核组详情列表 **/
export const Query_Assessment_By_Id = async (
  payload: number,
): Promise<
  HttpResponse<{
    evaluation_group_list: NPerformance.IEvaluationGroup[];
  }>
> =>
  Get('/api/performance_management/query_assessment_by_id', {
    params: {
      assessment_management_id: payload,
    },
  });

/** 流程审批接口 */
export const Modify_Performance_Process = async (payload: {
  assessment_detail_id: number;
  assessment_dimension_list?: any[];
  signature_url?: string;
  reject_remark?: string;
  reject_stage?: string;
  modify_type?: string;
  confirmer_id?: string;
  operate_type?: number;
  superior_rating_id?: any;
  self_evaluation_summary?: any;
  superior_assessment_summary?: any;
  result?: any;
  transfer_user_id?: number;
  appeal_status?: number;
  is_synchronization_subordinate?: number;
  adjustment_reason?: any;
  revoke_reason?: any;
}): Promise<HttpResponse<NPerformance.IEvaluationGroup[]>> => {
  const { assessment_dimension_list } = payload;
  if (assessment_dimension_list && assessment_dimension_list.length > 0) {
    assessment_dimension_list.forEach(item => {
      if (item.indicator_list) {
        item.indicator_list?.forEach((item: any) => {
          ['self_assessment_score', 'weight', 'superior_assessment_score'].forEach((key: any) => {
            if (isEmpty(item[key])) {
              item[key] = null;
            }
          });
        });
      }
    });
  }
  return Post('/api/performance_management/modify_performance_process', ObjectFilterEmpty(payload));
};
/** 流程审批接口 */
export const Modify_Performance_Process_Appeal = async (
  payload: TG.ParameterFirst<typeof Modify_Performance_Process>,
): Promise<HttpResponse<NPerformance.IEvaluationGroup[]>> => {
  return Post(
    '/api/performance_management/modify_performance_process_appeal',
    ObjectFilterEmpty(payload),
  );
};

/** 考核管理跳过功能新接口地址 */
export const Modify_Performance_Process_Skip = async (
  payload: TG.ParameterFirst<typeof Modify_Performance_Process>,
): Promise<HttpResponse<NPerformance.IEvaluationGroup[]>> => {
  return Post(
    '/api/performance_management/modify_performance_process_skip',
    ObjectFilterEmpty(payload),
  );
};

/** 考核管理转交新接口地址 */
export const Modify_Performance_Process_Transmit = async (
  payload: TG.ParameterFirst<typeof Modify_Performance_Process>,
): Promise<HttpResponse<NPerformance.IEvaluationGroup[]>> => {
  return Post(
    '/api/performance_management/modify_performance_process_transmit',
    ObjectFilterEmpty(payload),
  );
};

/** 查询员工绩效档案**/
export const Query_User_Performance_Record = async (
  pager: IGPageQuery,
  payload: any,
): Promise<
  ListResponse<{
    evaluation_group_list: NPerformance.IEvaluationGroup[];
  }>
> =>
  Get('/api/performance_management/query_user_performance_record', {
    params: ObjectFilterEmpty({
      ...payload,
      ...pager,
    }),
  });

/** 查询员工绩效档案**/
export const Query_User_Performance_Detail_Record = async (
  pager: IGPageQuery,
  payload: any,
): Promise<
  ListResponse<{
    evaluation_group_list: NPerformance.IEvaluationGroup[];
  }>
> =>
  Get('/api/performance_management/query_user_performance_detail_record', {
    params: ObjectFilterEmpty({
      ...pager,
      ...payload,
    }),
  });

/** 查询考核结果分析
 **/
export const Query_Performance_Analysis = async (
  pager: IGPageQuery,
  payload: any,
): Promise<
  ListResponse<{
    evaluation_group_list: NPerformance.IEvaluationGroup[];
  }>
> =>
  Get('/api/performance_management/query_performance_analysis', {
    params: ObjectFilterEmpty({
      ...pager,
      ...payload,
    }),
  });

/** 查询考核结果分析
 **/
export const Query_Finish_Assessment = async (): Promise<HttpResponse<any[]>> =>
  Get('/api/performance_management/query_finish_assessment', {
    // params: {
    //   cycle_type: 1, //只查询月度
    // },
  });

/** 查询与我相关列表 **/
export const Query_With_Me_Performance = async (
  pager: IGPageQuery,
  payload: any,
): Promise<ListResponse<any[]>> =>
  Get('/api/performance_management/query_with_me_performance', {
    params: ObjectFilterEmpty({
      ...pager,
      ...payload,
    }),
  });

/** 查询下级考核列表 **/
export const Query_Subordinate_Performance = async (
  pager: IGPageQuery,
  payload: any,
): Promise<ListResponse<any>> =>
  Get('/api/performance_management/query_subordinate_performance', {
    params: ObjectFilterEmpty({
      ...pager,
      ...payload,
    }),
  });

/** 流程审批接口 */
export const Check_Evaluation_Group_User_Ids = async (payload: {
  user_id_list: number[];
  cycle_type: number;
  evaluation_group_id?: number;
}): Promise<
  HttpResponse<{
    data: {
      username: string;
      user_id: number;
    }[];
  }>
> => Post('/api/performance_management/check_evaluation_group_user_ids', payload);

/** 重置考核流程*/
export const Modify_Reset_Process = async (payload: {
  stage: number;
  assessment_detail_id: number;
  remark?: string;
}): Promise<HttpResponse<NPerformance.IEvaluationGroup[]>> =>
  Post('/api/performance_management/modify_reset_process', ObjectFilterEmpty(payload));

/** 批量重置绩效*/
export const BulkResetAssessmentPresentStage = async (payload: {
  stage: number;
  assessment_detail_ids: number[];
  remark?: string;
}): Promise<HttpResponse<NPerformance.IEvaluationGroup[]>> =>
  Post(
    '/api/performance_management/bulk_reset_assessment_present_stage',
    ObjectFilterEmpty(payload),
  );

/** 根据用户ID和考核ID查询另一个*/
export const Query_Assessment_And_User = async (payload: {
  user_id?: number;
  assessment_management_id?: number;
}): Promise<HttpResponse<NPerformance.IEvaluationGroup[]>> =>
  Get('/api/performance_management/query_assessment_and_user', {
    params: payload,
  });

/** 根据用户ID和考核ID查询另一个 -- 结果分析使用*/
export const Query_Assessment_And_User_By_Analysis = async (payload: {
  user_id?: number;
  assessment_management_id?: number;
}): Promise<HttpResponse<NPerformance.IEvaluationGroup[]>> =>
  Get('/api/performance_management/query_assessment_and_user_by_analysis', {
    params: payload,
  });

/** 根据用户ID和考核ID查询另一个 -- 绩效档案使用*/
export const Query_Assessment_And_User_By_Performance_Record = async (payload: {
  user_id?: number;
  assessment_management_id?: number;
}): Promise<HttpResponse<NPerformance.IEvaluationGroup[]>> =>
  Get('/api/performance_management/query_assessment_and_user_by_performance_record', {
    params: payload,
  });

/** 无权限/查询考核名称*/
export const Query_Assessment_Name = async (
  pager: IGPageQuery,
  payload?: {
    user_id?: number;
    assessment_management_id?: number;
    is_my_assessment?: number;
    search_type?: number;
  },
): Promise<ListResponse<NPerformance.IEvaluationGroup>> =>
  Get('/api/performance_management/query_assessment_name', {
    params: ObjectFilterEmpty({
      ...pager,
      ...payload,
    }),
  });

/** 查询角色职位/leader*/
export const Getuser_Leader_By_Subordinate_Id = async (
  user_id: number | string,
): Promise<
  HttpResponse<{
    job_title: string;
    leaders: [{ real_name: string; username: string; id?: number; level: number }];
  }>
> =>
  Get('/api/auth/getuser_leader_by_subordinate_id', {
    params: {
      user_id,
    },
  });

/** 查询另外一个列表,在我的绩效中 */
export const Query_Assessment_And_User_By_My_Performance = async (payload: {
  user_id?: string | number;
  assessment_management_id?: string | number;
  search_type: string | number;
}): Promise<HttpResponse<NPerformance.IEvaluationGroup[]>> =>
  Get('/api/performance_management/query_assessment_and_user_by_my_performance', {
    params: ObjectFilterEmpty(payload),
  });

/** 推送公式结果至飞书 */
export const PublicifyAssessmentResult = async (payload: {
  assessment_management_id: string | number;
  user_avatar_datas?: any[];
}): Promise<HttpResponse<undefined>> =>
  Post('/api/performance_management/publicity_assessment_results', ObjectFilterEmpty(payload));

/** 导出考核详情 */
export const ExportAssessmentResult = async (payload: {
  assessment_detail_id?: string | number;
}): Promise<HttpResponse<{ url: string }>> =>
  Get('/api/performance_management/export_assessment_results', {
    params: ObjectFilterEmpty(payload),
  });

/** 删除指定考核详情-支持批量删除 */
export const DeleteAssessmentDetail = async (payload: {
  id_list: (string | number)[];
}): Promise<HttpResponse<undefined>> =>
  Delete('/api/performance_management/delete_assessment_detail', {
    data: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 批量上传指标 */
export const Export_Indicator_File = async (payload: string): Promise<HttpResponse<void>> =>
  Post(
    '/api/performance_management/export_indicator_file',
    ObjectFilterEmpty({
      file_path: payload,
    }),
  );

/** 查询逾期绩效 */
export const QueryOverdueAssessmentDetail = async (payload?: {
  user_id?: string | number;
  assessment_management_id?: number;
}): Promise<HttpResponse<NPerformance.IOverdueAssessmentDetail[]>> =>
  Get('/api/performance_management/query_overdue_assessment_detail', {
    params: ObjectFilterEmpty(payload || {}),
  });

/** 逾期重启 */
export const RestartOverdueAssessmentDetail = async (payload: {
  assessment_detail_ids: number[];
}): Promise<HttpResponse<undefined>> =>
  Post('/api/performance_management/restart_overdue_assessment_detail', ObjectFilterEmpty(payload));

/** 查询历史绩效指标 */
export const QueryHistoryAssessmentIndicators = async (payload: {
  dimension_type_list: number[];
  assessment_detail_id: number;
  current_assessment_detail_id?: number | undefined;
}): Promise<HttpResponse<NPerformance.Indicators[]>> => {
  const { dimension_type_list, ...res } = payload;
  return Get('/api/performance_management/query_history_assessment_indicators', {
    params: ObjectFilterEmpty({
      dimension_type_list: dimension_type_list.join(','),
      ...res,
    }),
  });
};

/** 获取考核周期和考评组  */
export const QueryAssessment_and_evaluation_group = async (): Promise<HttpResponse<any>> =>
  Get('/api/performance_management/query_assessment_and_evaluation_group');

/** 根据考评周期、考评组获取该周期内的所有绩效为C、D的员工 */
export const QueryNeedImproveUser = async (payload?: {
  assessment_management_id?: number;
  evaluation_group_id?: string | number;
}): Promise<HttpResponse<any>> =>
  Get('/api/performance_management/query_need_improve_user', {
    params: ObjectFilterEmpty(payload || {}),
  });

/** 发起绩效改进计划接口  */
export const StartAssessmentImprovePlan = async (payload: {
  assessed_ids: number[];
  assessment_management_id: number;
  plan_review_deadline: string;
  plan_submit_deadline: string;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/performance_management/start_assessment_improve_plan', ObjectFilterEmpty(payload));

/** 查询绩效改进计划接口  */
export const QueryAssessmentImprovePlan = async (payload?: {
  assessment_detail_id: string | number;
}): Promise<HttpResponse<any>> =>
  Get('/api/performance_management/query_assessment_improve_plan', {
    params: ObjectFilterEmpty(payload || {}),
  });

/** 保存/调整绩效改进计划接口  */
export const SaveAssessmentImprovePlan = async (payload: {
  assessment_improve: {
    assessment_target_formulate: string;
    convention_reach_date: string;
    existing_problems: string;
    number: number;
    real_completion: string;
  };
  assessment_improve_plan_id: number;
  convention_solution: string;
  plan_submit_deadline: string;
  department_communication_record: string;
  hrbp_communication_record: string;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/performance_management/save_assessment_improve_plan', ObjectFilterEmpty(payload));

/** 提交绩效改进计划接口  */
export const SubmitAssessmentImprovePlan = async (payload: {
  assessment_improve: {
    assessment_target_formulate: string;
    convention_reach_date: string;
    existing_problems: string;
    number: number;
    real_completion: string;
  };
  assessment_improve_plan_id: number;
  convention_solution: string;
  plan_submit_deadline: string;
  department_communication_record: string;
  hrbp_communication_record: string;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/performance_management/submit_assessment_improve_plan', ObjectFilterEmpty(payload));

/** 更新绩效改进计划接口  */
export const UpdateAssessmentImprovePlan = async (payload: {
  assessment_improve: {
    assessment_target_formulate: string;
    convention_reach_date: string;
    existing_problems: string;
    number: number;
    real_completion: string;
  };
  assessment_improve_plan_id: number;
  convention_solution: string;
  plan_submit_deadline: string;
  department_communication_record: string;
  hrbp_communication_record: string;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/performance_management/update_assessment_improve_plan', ObjectFilterEmpty(payload));

/** 审批绩效改进计划接口  */
export const ApproveAssessmentImprovePlan = async (payload: {
  assessment_improve_plan_id: number;
  reject_reason?: string;
  status: number; //审批状态 2-通过 3-驳回
}): Promise<HttpResponse<undefined>> =>
  Post('/api/performance_management/approve_assessment_improve_plan', ObjectFilterEmpty(payload));

/** 撤回绩效改进计划接口  */
export const RepealAssessmentImprovePlan = async (payload: {
  assessment_detail_id: number;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/performance_management/repeal_assessment_improve_plan', ObjectFilterEmpty(payload));

/** 获取所有没有头像的公示员工数据  */
export const QueryPublicityResultsNotAvatar = async (payload?: {
  assessment_management_id: string | number;
}): Promise<HttpResponse<any>> =>
  Get('/api/performance_management/query_publicity_results_not_avatar', {
    params: ObjectFilterEmpty(payload || {}),
  });

/** 更新用户头像  */
export const UpdateUserAvatar = async (payload: {
  user_id: number;
  avatar: string;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/performance_management/update_user_avatar', ObjectFilterEmpty(payload));

/** 提交多个用户头像  */
export const BulkUpdateUserAvatar = async (payload: {
  user_avatar_datas: any[];
  assessment_management_id: number;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/performance_management/bulk_update_user_avatar', ObjectFilterEmpty(payload));

/** 通过Excel批量导入用户绩效奖金  */
export const ExportPerformanceBonus = async (payload: {
  assessment_management_id: number;
  file_path: string;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/performance_management/export_performance_bonus', ObjectFilterEmpty(payload));

/** 检查指定绩效表可重置的节点状态  */
export const CheckResetAssessmentPresentStage = async (payload: {
  assessment_detail_ids: number[];
}): Promise<HttpResponse<any>> =>
  Post(
    '/api/performance_management/check_reset_assessment_present_stage',
    ObjectFilterEmpty(payload),
  );

/** 获取所有需要公示的考核数据  */
export const QueryNowYearPerformanceBonus = async (): Promise<HttpResponse<any>> =>
  Get('/api/performance_management/query_now_year_performance_bonus');

/** 查询实施流程监控数据  */
export const QueryAssessmentStatisticsData = async (payload?: {
  assessment_management_id: string | number;
  department_ids: number[];
}): Promise<HttpResponse<any>> =>
  Post(
    '/api/performance_management/query_assessment_statistics_data',
    ObjectFilterEmpty(payload || {}),
  );
/**
 * 述职
 */
/** 查询述职管理 **/
export const query_report_management = async (
  pager: IGPageQuery,
  payload?: {
    name?: string;
  },
): Promise<ListResponse<any>> =>
  Get('/api/report_management/query_report_management', {
    params: {
      ...pager,
      ...ObjectFilterEmpty(payload || {}),
    },
  });
/** 查询述职清单接口 **/
export const query_report_management_details = async (
  pager: IGPageQuery,
  payload: {
    department_ids?: number[];
    id: number | string;
    user_id?: number;
  },
): Promise<ListResponse<any>> =>
  Get('/api/report_management/query_report_management_details', {
    params: {
      ...pager,
      ...ObjectFilterEmpty(
        {
          id: payload.id,
          user_id: payload.user_id,
          department_ids: payload.department_ids?.join(','),
        } || {},
      ),
    },
  });
/** 查询我的/下级述职列表接口 **/
export const query_report_details = async (
  pager: IGPageQuery,
  payload: {
    is_sub: boolean;
    user_id?: number;
  },
): Promise<ListResponse<any>> =>
  Get('/api/report_management/query_report_details', {
    params: {
      ...pager,
      ...ObjectFilterEmpty(payload),
    },
  });
/** 查询述职详情  **/
export const get_report_detail = async (payload: { id: number }): Promise<HttpResponse<any>> =>
  Get('/api/report_management/get_report_detail', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/** 删除述职记录 */
export const delete_report_management = async (payload: {
  id: number;
}): Promise<HttpResponse<void>> =>
  Post('/api/report_management/delete_report_management', ObjectFilterEmpty(payload || {}));
/** 新增述职结果  */
export const add_report_management = async (payload: {
  name?: string;
  file_path?: string;
}): Promise<HttpResponse<any>> =>
  Post('/api/report_management/add_report_management', ObjectFilterEmpty(payload || {}));

/**
 * 获取关联项目
 */
export const GetRelatedProjectsList = async (payload: {
  business_type?: string | undefined;
  project_manager_name?: string | undefined;
  project_id?: number | undefined;
  project_name?: string | undefined;
  assessment_detail_id: number | undefined;
  num?: number | undefined;
  page_num?: number | undefined;
}): Promise<HttpResponse<any>> =>
  Get('/api/performance_management/query_assessment_related_project', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
