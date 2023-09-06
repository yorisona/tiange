/** 主播招募 */
declare global {
  namespace M.anchorRecruitment {
    interface AnchorRecruitmentQueryParams {
      start_date?: string;
      end_date?: string;
      /** 招募状态 */
      recruit_status?: E.anchorrecruitment.RecruitmentStatus;
      project_id?: number;
      /** 主播ID */
      anchor_id?: string;
      /** 推荐人ID */
      referrer_id?: string;
    }
    interface AnchorRecruitmentModel {
      /** 主播花名 */
      anchor_flower_name: string | undefined;
      /** 主播ID */
      anchor_id: number | undefined;
      /** 主播真名 */
      anchor_real_name: string | undefined;
      /** 商务费用 */
      business_cost: number | undefined;
      /** 其他说明 */
      comment: string | undefined;
      /** 合作内容 */
      cooperation_class: number | undefined;
      /** 合作费用（文字描述） */
      cooperation_cost_describe: string | undefined;
      /** 合作情况 */
      cooperation_mode: number | undefined;
      /** 创建日期 */
      create_date: string | undefined;
      /** 负责人ID */
      project_counterpart_id: number | undefined;
      /** 项目负责人花名 */
      project_counterpart_name: string | undefined;
      /** 项目ID */
      project_id: number | undefined;
      /** 项目名称 */
      project_name: string | undefined;
      /** 招募记录ID */
      recruit_id: number | undefined;
      /** 满意度 */
      recruit_satisfaction: number | undefined;
      /** 招募状态 */
      recruit_status: number | undefined;
      /** 推荐人ID */
      referrer_id: number | undefined;
      /** 推荐人花名 */
      referrer_name: string | undefined;
      business_type: number;
    }

    interface AddAnchorRecruitmentRecordParams {
      /** 主播ID */
      anchor_id: number | undefined;
      /** 商务费用 */
      business_cost: number | undefined;
      /** 其他说明 */
      comment: string | undefined;
      /** 合作内容 */
      cooperation_class: number | undefined;
      /** 合作费用（文字描述） */
      cooperation_cost_describe: string | undefined;
      /** 合作情况 */
      cooperation_mode: number | undefined;
      /** 负责人ID */
      project_counterpart_id: number | undefined;
      /** 项目ID */
      project_id: number | undefined;
      /** 招募记录ID */
      recruit_id: number | undefined;
    }
  }
}
export default {};
