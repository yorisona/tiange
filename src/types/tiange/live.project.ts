/**
 * 店铺代播 / 项目管理
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-30 10:56:32
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=146&itf=1494
 */

import { GatherTypes } from '@/const/options';
import { GmtTimeFields } from '../base/advanced';
import { PaginationParams } from '../base/pagination';
import { BusinessTypeEnum, CooperationTypeEnum } from './common';
import { PayableList } from './commonBusiness/project';
import { ReverseFields } from './finance/finance';

export interface BaseLiveProject {
  /** ID */
  id?: number;
  /** 项目名称 */
  project_name?: string;
  /** 公司ID */
  company_id: string | number;
  /** 店铺ID */
  // company_shop_id?: string | number;
  /** 合作类型, 1-自营，2-区域 */
  cooperation_type: CooperationTypeEnum;
  /** 直播间ID */
  studio_id?: string;
  /** 开始日期 */
  start_date: string;
  /** 结束时间 */
  end_date: string;
  /** 佣金比例 */
  commission_rate: string;
  /** 客户经理ID */
  customer_manager_id: number | '';
  /** 每月场次 */
  live_num_per_month?: string;
  /** 月度时长 */
  month_duration?: string;
  /** 其他要求 */
  other_requirement: string;
  /** 备注 */
  remark: string;
  /** 结算周期类型  1-月结，2-季结，3-半年  */
  settlement_cycle_type: number;
  /** 小时报价 */
  price_per_hour?: string;
  /*服务费*/
  service_amount?: number | string;
  /** 项目经理ID */
  project_manager_id: number | '';
  /** 每场时长 */
  duration_per_live?: string;
  /** 项目所属部门id */
  feishu_department_id: number | undefined;
  /** 项目所属部门 */
  feishu_department_name: string | undefined;
  /**商家授权*/
  is_shop_auth?: number;
  /**商家授权地址*/
  shop_auth_url?: string;
}

export interface LiveProject extends BaseLiveProject, GmtTimeFields {
  /** 项目所属业务类型 */
  project__type?: 'live' | 'local_life' | 'supply_chain';
  /** 创建人ID */
  add_by: number;
  /** 店铺类目 */
  category?: number;
  /** 项目名称 */
  project_name?: string;
  /** 品牌名称 */
  brand_id?: number;
  /** 品牌名称 */
  brand_name?: string;
  /** 客户名称 */
  company_name: string;
  /** 店铺 */
  customer_id: string;
  /** 客户经理 */
  customer_manager: string;
  /** 客户经理 */
  manager_name?: string;
  /** 业务类型 */
  business_type: BusinessTypeEnum;
  /** 执行结果详情 */
  end_detail: {
    /** 意外终止类型：1-退款，2-其他 */
    end_handle_type: number;
    /** 意外终止详情 */
    end_handle_detail: string;
  };
  /** 执行结果,1-正常结束，2-意外终止 */
  end_type: number;
  /** 0 ==> 正常状态；1 ==> 删除状态 */
  flag: 0;
  /** ID */
  id: number;
  /** 修改人ID */
  modified_by: number;
  /** 项目经理 */
  project_manager: string;
  /** 项目阶段
   * 1-项目创建
   * 2-项目试播
   * 3-项目执行
   * 4-区域执行
   * 5-项目完结
   */
  project_status: number;
  /** 项目UID */
  project_uid: string;
  /** 客户名称 */
  shop_name: string;
  /** 直播间名称 */
  studio_name: string;
  /** 区域合作公司id(供应商公司) */
  supplier_company_id?: number;
  /** 累计直播时长 */
  total_duration?: number;
  /** 累计直播场数 */
  total_live_num?: number;
  /** 试播结束时间 */
  try_live_end_date: string;
  /** 开始日期 */
  start_date_str: string;
  /** 结束日期 */
  end_date_str: string;
  /** 试播结束时间 */
  try_live_end_date_str: string;
  /** 公司名称 */
  customer_company_name: string;
  /** 供应商(公司)名称 */
  supplier_company_name: string | null;
  /** 淘宝直播账号 */
  live_account_ids?: string;
  /** 合同信息 */
  contract_stat: {
    /** 客户合同 */
    customer: number;
    /** 供应商合同 */
    supplier: number;
  };
  team_members: { id: number; name: string }[];
  /** 结束时间 */
  end_time: number;
  feishu_department_level?: number;
  /** gmvshi否是全店订单 */
  is_all_shop_orders?: boolean;
  add_by_username?: string;
  /** 归属主体 **/
  company_subject: number;
}

export interface LiveProjectQueryParams extends Required<PaginationParams> {
  search_type?: number;
  search_value?: string;
  project_status?: number;
  cooperation_type?: number;
  business_type?: number;
  not_business_types?: string;
  end_date?: string;
}

export interface LiveProjectForm extends BaseLiveProject {
  /** 业务类型 */
  business_type: BusinessTypeEnum | '';
  /** 淘宝直播账号 */
  live_account_ids?: string[];
  /** 店铺名称 */
  // shop_name?: string;
  brand_id: number | undefined;
  /** 店铺名称 */
  company_name?: string;
  feishu_department_level?: number;
  /** GMV统计方式 **/
  gmv_way?: number | undefined;
  /** gmvshi否是全店订单 */
  is_all_shop_orders?: boolean;
  /** 归属主体 **/
  company_subject?: number;
}

export interface LiveProjectAchievement extends ReverseFields {
  /** 收款编号 */
  achievement_id: number;
  /** 业绩编号 */
  achievement_uid: string;
  /** 业绩名称 */
  achievement_name: string;
  /** 收款类型 */
  gather_type: GatherTypes | null;
  /** 收款金额 */
  gather_amount: number;
  gather_way: any;
  gather_way_detail: any;
  gather_certificate_pic: string;
  project_id: number | undefined;
  settlement_id: number | undefined;
}

export interface LiveProjectDailydata {
  /** 格式 20210505 */
  date: number;
  live_duration: number;
  max_uv: number;
  new_fans_count: number;
  avg_stay: number;
  gmv: number | string;
  goal_gmv: number | string | null;
  gmv_percent: number | string | null;
  net_sales_rate: number;
  net_sales_amount: number;
  promote_amount: number;
  roi: number;
  commission_rate: number;
  commission_amount: number;
  income_amount: number;
  /** 状态是否填写 */
  status: number;
  business_type: number | string | undefined;
  project_id: number | string | undefined;
}
// 应收时候弹框传参
export interface achievementType {
  id: number;
  /** isReceivable： 实收；isActualIncome：应收 */
  type: string;
  /** coop： 营销业务；live：店铺代播 common_business:通用业务 */
  leaf: string;
  /** 应收单可核销金额 */
  amount: number;
  /** 1：营销业务；2：淘宝点播；3：抖音店播 */
  busType: number;
  /** 应收编号 */
  receivable_uid: string;
  cost_split_id?: number;
}

/** 营销业务下应收tab同项目时候单表column */
export interface yxywIsActualIncomeType {
  /** 实收金额 */
  gather_amount: number;
  id: number;
  /** 未核销金额 */
  not_write_off_amount: number;
  /** 项目名称 */
  project_name: string;
  uid: string;
  write_off_amount?: string;
  search_type?: number;
}

/** 店播应付 */
export type LiveProjectPayables = PayableList;
