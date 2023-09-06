export interface ManagementDashboardMonth {
  /** 投放成本 */
  ad_cost?: number;
  /** 主播成本 */
  anchor_cost?: number;
  /** 佣金 */
  commission?: number;
  /** 成本 */
  cost?: number;
  gmv?: number;
  /** GMV预算进度 */
  gmv_complete_rate?: number;
  /** GMV目标 */
  goal_gmv?: number;
  /** 营收目标 */
  goal_income?: number;
  /** 营收 */
  income?: number;
  /** 营收预算进度 */
  income_complete_rate?: number;
  /** 人力成本 */
  labor_cost?: number;
  /** 未到账 */
  not_received_income?: number;
  /** 其它成本 */
  other_cost?: number;
  /** 其它收入 */
  other_income?: number;
  /** 商广/营销 */
  promote_amount?: number;
  /** 营销成本 */
  promote_cost?: number;
  /** 实际结算率 */
  real_settled_rate?: number;
  /** 已到账 */
  received_income?: number;
  /** 回款率 */
  received_rate?: number;
  /** 净利润 */
  revenue_amount?: number;
  /** 净利率 */
  revenue_rate?: number;
  /** 服务费 */
  service_amount?: number;
}

export interface ManagementDashboardData {
  /** 佣金比例 */
  commission_rate?: number;
  /** 预估净销率 */
  estimate_settled_rate?: number;
  /** 月度数据列表) */
  month?: Array<ManagementDashboardMonth>;
  /** 所属部门 */
  project_department?: string;
  project_id?: number;
  /** 项目名称 */
  project_name?: string;
  /** 项目类型 */
  project_type_name?: string;
  /** 季度数据列表 */
  season?: Array<ManagementDashboardMonth>;
  /** 年度数据列表 */
  year?: Array<ManagementDashboardMonth>;
}

export interface ManagementDashboardStatistics {
  /** 数据统计 */
  statistics?: {
    month?: Array<ManagementDashboardMonth>;
    season?: Array<ManagementDashboardMonth>;
    year?: Array<ManagementDashboardMonth>;
  };
}
