import {
  EASSESSMENT_STAGE,
  EASSESSMENT_STATUS,
  ECYCLE_TYPE,
  EEVALUATION_OPERATOR,
  EINDICATOR_TYPE,
} from '@/const/performance';

/**
 * 绩效考核大板块
 */
declare global {
  // 绩效管理
  namespace NPerformance {
    // ------------指标库相关-------------------------------
    // 指标
    interface Indicators {
      id: number;
      // 考核标准
      check_standard: string;
      // 指标名称
      name: string;
      indicator_type: EINDICATOR_TYPE;
      // 加分上线
      increase_limit: number;
      // 扣分上线
      decrease_limit: number;
      // 是否指定评分人
      is_assign_scorer: boolean;
      // 指定评分人
      assign_scorer_id: number;
      assign_scorer_username: string;
      // 是否开启结果值
      is_result: boolean;
      // 目标值
      target: string;
      // 是否开启目标值
      is_target: boolean;
      // 关联项目
      related_project_ids: string;
      //备注
      remark: string;
      // 评分方式
      scoring_method: number;
      // 权重
      weight: number;
      // 所属标签
      tag_id: number;
      /**compute_code ==="project_gmv" 计算GMV,绑定项目  */
      compute_code: string | null;
      // 是否支持删除-0:不能，1: 能
      is_can_delete: number;
    }
    // 查询指标库参数
    type IndicatorsParams = Pick<Indicators, 'name' | 'indicator_type' | 'tag_id'>;

    // 指标标签
    interface IndicatorsTag {
      count: number;
      name: string;
      tag_id: number;
    }

    // -----------------考评组相关-----------------------
    // 考评组
    interface IEvaluationGroup {
      id: number;
      name: string;
      confirmer_transfer_user_name?: string | undefined;
      confirmer_transfer_user_id?: number | undefined;
      confirmer_transfer_user_real_name?: string | undefined;
      // 周期类型
      cycle_type: ECYCLE_TYPE;
      // 被考核人员的id 列表
      by_evaluation_person: IEvaluationPerson[];
      // 执行人
      operator: EEVALUATION_OPERATOR;
      //目标确认开关
      is_target_confirmed: boolean;
      // 是否允许修改指标
      is_modify_indicator: boolean;
      // 是否允许转交
      is_transfer: boolean;
      // 确认人
      confirmer: EEVALUATION_OPERATOR;
      // 自评开关
      is_self_evaluation: boolean;
      // 评分人
      scorer: EEVALUATION_OPERATOR;
      // 自评评分权重
      weight: number;
      // 上级评分开关
      is_superior_rating: boolean;
      // 维度
      assessment_dimension_list: IEvaluationDimension[];
      // 上级评分人
      superior_rating: {
        // 上级评分权重
        weight: number;
        // 是否允许评分人转交
        is_transfer: boolean;
        // 评分人
        scorer: {
          is_manager?: boolean;
          is_designated_user?: boolean;
          manager?: number;
          user_id?: number;
          transfer_user_id?: number;
          transfer_user_name?: string;
          transfer_user_real_name?: string;
        };
      }[];
      // 发起考核次数
      assessment_count: number;
      remove_user_id_list?: number[];
      // 是否开启隔级主管校准
      is_superior_leader_rating: boolean;
      // 考核周期
      assessment_cycle: string;
    }
    // 考评维度
    interface IEvaluationDimension {
      id: number;
      // 维度名称
      name: string;
      // 指标类型
      dimension_type_list: EINDICATOR_TYPE[];
      // 是否允许员工编辑和删除指标
      is_modify_delete: boolean;
      // 指标列表
      indicator_list: Indicators[];
    }

    interface IEvaluationPerson {
      user_id: number;
      username: string;
      real_name: string;
    }

    // -----------------考核相关-----------------------
    /** 考核*/
    interface IAssessment {
      id: number;
      /**  考核名称*/
      name: string;
      // 考评组
      evaluation_group_id_list: number[];
      // 考核开始时间
      assessment_start_time: string;
      // 考核结束时间
      assessment_end_time: string;
      // 考核周期
      assessment_cycle: string;
      // 考核类型
      cycle_type: ECYCLE_TYPE;
      // 参与考核人员
      user_id_list: number[];
      // 参与人数
      user_count: number;
      // 考核完成度
      asssessment_completion: number;
      // 是否可以发起评分
      is_can_start_score: boolean;
    }

    // 考核详情
    interface IAssessmentDetail {
      assessment_management_name: string;
      improve_plan_status_cn: string;
      id: number;
      real_name: string;
      deadline: string;
      username: string;
      department_name: string;
      evaluation_group_id: number;
      result: number;
      present_person: {
        username: string;
        real_name: string;
      };
      present_stage?: number;
      level: string;
      evaluation_group_name: string;
      user_id: number;
      overdue_status: EASSESSMENT_STATUS;
      appeal_detail?: {
        appeal_status: number;
        appeal_reason: string;
        appeal_files: any[];
        revoke_reason: string;
        adjustment_reason: string;
      };
      launch_person:
        | {
            real_name: string;
            username: string;
          }
        | undefined;
    }

    // 单人考核
    interface IAssessmentPeople {
      id: number;
      assessment_management_id: number;
      assessment_management_name: string;
      department_name: string;
      assessment_cycle: string;
      is_leave: number; // 是否离职 1是 0否
      evaluation_group: {
        id: number;
        name: string;
      };
      present_stage: EASSESSMENT_STAGE;
      result: string;
      present_person: {
        name: string;
        real_name: string;
      };
      level: string;
      assessment_dimension_list: any[];
      superior_rating_link_list: {
        is_close: number;
        link: number;
      }[];
      result_remark: string;
      username: string;
      work_id: string;
      self_evaluation_summary: {
        summary_memo: string;
        summary_files: string[];
      };
      superior_assessment_summary: {
        summary_memo: string;
        summary_files: string[];
      };
      improve_plan_status: number;
    }
    // 逾期绩效
    interface IOverdueAssessmentDetail {
      assessment_detail_id: number;
      user_id: number;
      user_name: string;
    }

    // 关联项目
    interface RelationProjectItem {
      business_type: number;
      goal_value: number;
      project_id: number;
      project_manager_id: number;
      project_name: string;
      project_manager_name: string;
    }
  }

  // 飞书模板
  namespace Feishu {
    interface IUser {
      id: number;
      business_type: number[];
      department_id: number;
      feishu_user_id: number;
      real_name: string;
      username: string;
    }
    interface IDepartment {
      id: number;
      department_id: string;
      is_deleted: boolean;
      level: number;
      name: string;
      parent_department_id: string;
      member_count: number;
      sons?: IDepartment[];
    }
    interface IDepartmentAndUser extends IDepartment {
      user_list?: IUser[];
    }
  }
}
