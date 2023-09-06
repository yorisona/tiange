/** 通用业务项目管理
 *      ┌─┐       ┌─┐ + +
 *   ┌──┘ ┴───────┘ ┴──┐++
 *   │                 │
 *   │       ───       │++ + + +
 *   ███████───███████ │+
 *   │                 │+
 *   │       ─┴─       │
 *   │                 │
 *   └───┐         ┌───┘
 *       │         │
 *       │         │   + +
 *       │         │
 *       │         └──────────────┐
 *       │                        │
 *       │                        ├─┐
 *       │                        ┌─┘
 *       │                        │
 *       └─┐  ┐  ┌───────┬──┐  ┌──┘  + + + +
 *         │ ─┤ ─┤       │ ─┤ ─┤
 *         └──┴──┘       └──┴──┘  + + + +
 *                神兽保佑
 *               代码无BUG!
 */

import type { PaginationParams } from '@/types/base/pagination';
import { BusinessTypeEnum } from '../common';
import { WriteOffFields } from '../fields';
import { ReverseFields } from '../finance/finance';

export interface CommonBusinessBaseProject {
  /** ID */
  id?: number;
  /** 项目名称 */
  project_name?: string;
}

export interface CommonBusinessProject extends CommonBusinessBaseProject {
  /** 业务类型 */
  business_type: number;
  /** 项目UID */
  project_uid?: string;
  /** 店铺名称 */
  shop_name: string;
  /** 业务平台 */
  platform_type: number;
  /** 项目类型 */
  mcn_project_type: number;
  /** 公司名称 */
  customer_company_name: string;
  /** 创建人 */
  add_by_username: string;
  /** 创建时间 */
  gmt_create: string;
  /** 项目经理 */
  project_manager: string;
  /** 项目阶段 */
  project_status: number;
  feishu_department_name?: string;
  kol_manage?: any[];
}

export interface ProjectMcnShopLiveParams {
  page_num: number;
  num: number;
  project_id: number;
  live_start_date: string;
  live_end_date: string;
}

export interface CommonBusinessProjectDetail {
  start_date?: string;
  kol_id?: number | string;
  qianchuan_uid?: number | string;
  baiying_id?: number | string;
  kol_name?: string;
  is_relate_kol?: boolean;
  project__type?: 'common';
  /** ID */
  id?: number;
  /** 项目名称 */
  project_name?: string;
  /** 项目UID */
  project_uid: string;
  /** 项目状态 */
  project_status?: number;
  /** 项目执行结果 */
  end_type?: number;
  end_detail?: any;
  end_date: string;
  /** 客户经理 */
  customer_manager?: string;
  /** 客户经理 */
  manager_name?: string;
  /** 项目类型 抖音：1-达人项目，2-明星项目，3-美妆项目，4-团长项目，淘宝：5-淘宝CPS、6-V任务' */
  mcn_project_type?: number;
  /** 平台类型 1-抖音，2-淘宝'*/
  platform_type: number;
  /** 项目经理id */
  project_manager_id?: number;
  /** 项目经理 */
  project_manager?: string;
  /** 团队成员 */
  team_members: { id: number; name: string }[];
  /** 店铺类目 */
  category: number;
  /** 店铺品牌id */
  brand_id: number;
  /** 店铺品牌 */
  brand_name: string;
  /** 客户类型 */
  customer_class: number;
  /** 店铺名称 */
  shop_name: string;
  /** 公司名称 */
  customer_company_name: string;
  /** 业务类型 */
  business_type: BusinessTypeEnum;
  /** 创建人 */
  add_by_username: string;
  /** 创建人id */
  add_by: number;
  /** 创建时间 */
  gmt_create: string;
  /** 备注 */
  remark: string;
  /** 客户类型 1个人客户    2 公司客户 */
  customer_type: number;
  /** 客户ID (店铺) */
  customer_id: number | string;
  /** 公司ID */
  customer_company_id?: number;
  /** 项目所属部门id */
  feishu_department_id: number | undefined;
  /** 项目所属部门 */
  feishu_department_name: string | undefined;
  cooperation_type?: string;
  feishu_department_level: number;
  kol_infos: { kol_id: number; baiying_id: string; qianchuan_uid: string; Kols: any[] }[];
  /** 归属主体 **/
  company_subject?: number;
}

export enum CommonBusinessProjectSearchType {
  /** 公司名称 */
  company_name = 7,
  /** 项目名称 */
  project_name = 6,
  /** 客户名称 */
  shop_name = 2,
  /** 项目编号 */
  cooperation_uid = 3,
  /** 客户经理 */
  customer_manager_name = 4,
  /** ae名称 */
  ae_name = 5,
}

export enum CommonBusinessType {
  /** 基地业务 */
  base = 4,
  /** 创新项目 */
  mcn = 5,
}

export interface CommonBusinessProjectQueryParams extends PaginationParams {
  search_type?: number;
  search_value?: string;
  business_type?: CommonBusinessType;
  /** 通用业务固定传 2 */
  data_type: number;
  end_date?: string;
}

export interface CommonBusinessProjectQueryForm extends PaginationParams {
  search_type: number | '';
  search_value: string;
  mcn_project_type: number | '';
  platform_type: number | '';
  project_status: number | '';
  /** 通用业务固定传 2 */
  data_type: number;
}

export interface CommonBusinessProjectForm extends CommonBusinessBaseProject {
  /** 客户类型 1个人客户    2 公司客户 */
  customer_type: number;
  /** 备注 */
  remark?: string;
  /** 客户ID (店铺) */
  customer_id: number | string;
  /** 业务平台 */
  platform_type: number | string;
  /** 团队成员 */
  team_members?: number[];
  /** 项目类型 */
  mcn_project_type?: number | string;
  /** 项目经理 */
  project_manager_id: number | string;
  /** 项目所属部门id */
  feishu_department_id: number | undefined;
  feishu_department_name: string | undefined;
  kol_id?: number | string;
  baiying_id?: number | string;
  qianchuan_uid?: number | string;
  start_date: string;
  end_date: string;
  kol_infos: { kol_id: number; baiying_id: string; qianchuan_uid: string; Kols: any[] }[];
  /** 归属主体 **/
  company_subject?: number;
}

export interface CommonBusinessProjectMCN {
  /** GMV */
  gmv: string;
  /** 运营费用 */
  operating_amount: string;
  /** 直播场次 */
  live_count: string;
  /** 开播时长 */
  live_duration: string;
  /** 开播主播数 */
  anchor_count: string;
}

export interface CommonBusinessProjectMarket {
  /** 到账金额 */
  income_amount: string;
}

export interface CommonBusinessProjectBase {
  /** 直播时长 */
  live_duration: string;
  /** 直播增粉数 */
  new_fans_count: string;
  /** 同时最高在线人数 */
  max_uv: string;
  /** 用户停留时长 */
  avg_stay: string;
  /** GMV */
  gmv: string;
  /** 净销比例 */
  net_sales_rate: string;
  /** 预估当日净销额 */
  net_sales_amount: string;
  /** 投放金额 */
  promote_amount: string;
  /** 定向投放ROI（倍数） */
  roi: string;
  /** 佣金比例 */
  commission_rate: string;
  /** 预估当日佣金 */
  commission_amount: string;
  /** 每日到账金额 */
  income_amount: string;
}

export interface CommonBusinessPayableActualReceiver {
  /** 收款方名字 */
  name: string;
}

export interface CommonBusinessPayableActual {
  /** 打款金额 */
  pay_amount: string | number;
  /** 用款日期 */
  transfer_date: string;
  /** 付款事由 */
  pay_reason: string;
  /** 付款方式 */
  pay_way: number;
  /** 收款方 */
  pay_way_detail: CommonBusinessPayableActualReceiver;
  /** 收款ID */
  cost_id?: number;
}

export interface CommonBusinessPayableParams {
  /** 项目id */
  project_id: string | number | undefined;
  /** 业务类型 */
  payable_type: string | number | undefined;
  /**  隐藏已冲销数据*/
  is_hide_reverse_data?: number | undefined;
}

/** 应付气泡 */
export interface PayableWriteOffInfos {
  settlement_uid?: string;
  /** 收款编号 */
  cost_uid: string;
  cost_id?: number;
  receipt_uid?: string;
  receivable_uid?: string;
  /** 核销金额 */
  write_off_amount: number;
  /** 核销人 */
  write_off_user: string;
  /** 核销时间 */
  write_off_time: string;
}

/** 应付列表 */
export interface PayableList extends WriteOffFields, ReverseFields {
  /** 创建日期 */
  create_date: string;
  /** id */
  id: number;
  /** 项目名称 */
  project_name: string;
  /** 项目编号 */
  project_uid: string;
  /** 应付金额 */
  payable_amount: number | string;
  /** 应付编号 */
  payable_uid: string;
  /** 结算单编号 */
  settlement_uid: string;
  /** 项目id */
  project_id: number;
  /** 业务类型 */
  payable_type: number;
  refund_write_off_info_items: any;
  // 退款金额
  refund_amount: number;
}

export interface PayableListTotal {
  /** 总条数 */
  total: number;
  /** 总应付 */
  payable: number;
  /** 总实付（核销） */
  write_off: number;
  /** 总未核销(可核销)金额 */
  not_write_off: number;
  data: PayableList[];
}

/** 新增/编辑 招商商品 */
export interface MerchantsGoods {
  /** 店铺id */
  shop_id: number;
  /** 品牌id */
  brand_id: number;
  /** 公司id */
  company_id: number;
  /** 商品编码 */
  product_code: string;
  /** 商品名字 */
  product_name: string;
  /** 场次id */
  project_id?: number | string;
}
/** 新增/编辑 招商商品 */
export interface LiveGoods {
  /** 收入坑位费 */
  income_pit_fee: number;
  /** 支出坑位费 */
  expend_pit_fee: number;
  /** 公司id */
  product_id: number;
  /** 场次id */
  live_id: number | string;
  /** 项目id */
  project_id: number | string;
  /** 有无坑位费 */
  has_pit_fee: number;
  /** 商品id */
  id?: number;
}

export enum ProjectTypeEnum {
  /** 服装项目 */
  clothing = 1,
  /** 标品项目 */
  label,
  /** 美妆项目 */
  makeups,
  /** 团长项目 */
  head,
  /** 淘宝cps */
  taobao_cps,
  /** v任务 */
  v_task,
}

export const ProjectTypeEnumMap = new Map([
  [ProjectTypeEnum.clothing, '服装项目'],
  [ProjectTypeEnum.label, '标品项目'],
  [ProjectTypeEnum.makeups, '美妆项目'],
  [ProjectTypeEnum.head, '团长项目'],
  [ProjectTypeEnum.taobao_cps, '淘宝CPS'],
  [ProjectTypeEnum.v_task, 'V任务'],
]);

export interface S2B2CDouyinDailyReportDateInfo {
  date: string | undefined;
  estimated_institution_commission: number | undefined;
  gmv: number | undefined;
  gmv_rate: number | undefined;
  live_duration: number | undefined;
  live_duration_str: string | undefined;
}

export interface S2B2CDouyinDailyReportTotalInfo {
  gmv_goal: string | undefined;
  estimated_institution_commission: number | undefined;
  gmv: number | undefined;
  gmv_rate: number | undefined;
  live_duration: number | string | undefined;
  live_duration_str: string | undefined;
}
export interface S2B2CDouyinDailyReport {
  date_list: S2B2CDouyinDailyReportDateInfo[];
  total: S2B2CDouyinDailyReportTotalInfo[];
  /** 时间戳 */
  update_time: number | undefined;
}

export interface DisplayDailyUserData {
  fans_distribution: {
    // 粉丝占比
    fans: number | undefined;
    // 非粉丝占比
    un_fans: number | undefined;
  };
  gender_distribution: {
    // 男性占比
    male: number | undefined;
    // 女性占比
    female: number | undefined;
  };
  // 年龄层 key: 18-23
  // 年龄层 key: 24-30
  // 年龄层 key: 31-40
  // 年龄层 key: 41-50
  age_distribution: any;
  // TOP1省份
  // 占比
  province_distribution_sorted: any[];
}
export interface DisplayDailySellerScoreData {
  score: {
    // 带货分
    value: number;
  };
}

export interface DisplayDailyData {
  /** 基础信息 */
  // 开播时间
  live_room_start_time: string | undefined;
  // 结束时间
  live_room_end_time: string | undefined;
  //  直播时长
  live_duration: number | undefined;
  live_duration_str: string | number | undefined;
  // 是否有效直播
  is_valid_live_room: boolean | undefined;

  /** 数据大屏 */
  //
  // 直播间成交金额
  gmv: number | undefined;
  // 曝光-观看率
  watch_cnt_show_ratio: number | undefined;
  //
  // 人均看播时长
  // avg_watch_duration: number | undefined;
  //
  // 分钟评论次数
  comment_num_minute: number | undefined;
  // 千次观看转化
  gpm: number | undefined;
  // 观看-成交转化率
  watch_pay_ucnt_ratio: number | undefined;
  // 成交老粉占比
  old_fans_pay_ucnt_ratio: number | undefined;
  // 退款金额占比
  real_refund_amt_ratio: number | undefined;
  // 成交人数
  pay_ucnt: number | undefined;

  /** 流量指标 */
  // 平均在线人数
  avg_online_person: number | undefined;
  // 最高在线人数
  max_online_person: number | undefined;
  // 累计观看人数
  cumulative_watch_person: number | undefined;
  // 直播间浏览量
  room_user_views: number | undefined;
  // 直播间爆光人数
  room_watch_person: number | undefined;
  // 直播间爆光次数
  room_watch_times: number | undefined;

  /** 互动指标 */
  // 新增粉丝数
  incr_new_fans_num: number | undefined;
  // 转粉率
  new_fans_rate: number | undefined;
  // 人均观看时长
  avg_watch_duration: number | undefined;
  // 新加团人数
  incr_new_add_group_person: number | undefined;
  // 加团率
  add_group_rate: number | undefined;
  // 评论次数
  comment_num: number | undefined;
  // 点赞次数
  thumb_num: number | undefined;
  // 分享次数
  share_num: number | undefined;

  /** 商品指标 */
  // 带货商品数
  product_nums: number | undefined;
  // 商品爆光人数
  product_watch_person: number | undefined;
  // 商品点击人数
  product_click_person: number | undefined;
  // 商品点击率（次数）
  product_click_nums_rate: number | undefined;
  // 商品点击率（人数）
  product_click_person_rate: number | undefined;

  /** 交易指标 */
  // 客单价
  per_customer_price: number | undefined;
  // 看播成交转化率（人数）
  watch_convert_to_trade_rate: number | undefined;
  // 直播间成交人数
  trade_person: number | undefined;
  // 点击成交转化率（人数）
  click_to_trade_person_rate: number | undefined;
  // 点击成交转化率（次数）
  click_to_trade_num_rate: number | undefined;
  // 看播成交转化率（次数）
  watch_to_trade_num_rate: number | undefined;

  /** 用户画像-看播用户 */
  watch_user: DisplayDailyUserData | undefined;

  /** 用户画像-成交用户 */
  pay_user: DisplayDailyUserData | undefined;

  /** 带货分 */
  // 带货口碑分
  seller_score: DisplayDailySellerScoreData | undefined;
  valid_live_room_count?: number | string | undefined;
  weeK_str?: string | undefined;
  day_str?: string | undefined;
  month_str?: string | undefined;
  estimated_institution_commission?: number | undefined;
  settled_rate?: number | undefined;
}

export interface DisplayDailyDataList {
  date_list: DisplayDailyData[];
  last?: any;
  current?: any;
  link_ratio?: any;
  /** 时间戳 */
  update_time: number | undefined;
}
