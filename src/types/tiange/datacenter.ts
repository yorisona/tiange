/*
 * @Author: 肖槿
 * @Date: 2021-07-07 10:16:51
 * @Description: 数据中心types
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-05-20 11:48:51
 * @FilePath: \goumee-star-frontend\src\types\tiange\datacenter.ts
 */

import { PaginationParams } from '@/types/base/pagination';
import { Model } from '@/types/tiange/supplier';

// 表格接口参数类
export interface DataCenterTableParams {
  business_type?: number; // 业务类型
  the_date: string; // 日期数字或年份数字: 202105或者2021
  project_id?: string | number; // 项目id
  dateType?: number;
  platform_type?: number;
}

// 图表接口参数类
export interface DataCenterChartParams {
  business_type?: number; // 业务类型
  the_date: string; // 日期或年份数字
  chart_type: number; // 图表类型
}

// 继续目标
export interface ISeasonRules {
  year: number;
  season: number;
  date: string;
}

// 全网热销监控项目列表
export interface IHotProjectSearchParams extends PaginationParams {
  project_name: string;
}

// 全网热销商品列表
export interface IHotCommodityParams extends PaginationParams {
  project_id: number;
  date: string;
}

// 飞瓜监控账号管理列
export interface IMonitorConfig {
  hot_sale_count: string | number;
  hot_sale_time: string | number;
  monitor_accounts: string[];
  project_id: string | number;
  receiver_list: { user_id: string; name: string }[];
}

// 班次信息
export interface ShiftInfo {
  shift_name: string | undefined;
  shift_id: number | undefined;
  shift_start_time: string | undefined;
  shift_end_time: string | undefined;
}

export enum CtrLiveChangeTip {
  /** 硬装 */
  hardcover = 1,
  /** 灯光 */
  lighting,
  /** 机位 **/
  seat,
  /** 陈列 **/
  display,
  /** 贴片 **/
  patch,
  /** 调色 **/
  tint,
}

// ctr查询参数
export interface CtrQueryParams extends PaginationParams {
  project_id: number | string | undefined;
  start_date: string | undefined;
  end_date: string | undefined;
  shift_id: number | undefined;
}

// ctr列表数据模型
export interface CtrListModel {
  // 罗盘场次ID
  compass_shop_live_room_id: number | undefined;
  // 进入率（人次）
  exposure_watch_times_ratio: number | undefined;
  // 进入率（人数）
  exposure_watch_ucnt_ratio: number | undefined;
  // 场次ID
  id: number | undefined;
  // 场次结束时间
  live_end_time: number | undefined;
  // 直播画面ID
  live_screenshot_id: number | undefined;
  // 直播画面链接
  live_screenshot_url: string | undefined;
  // 场次开始时间
  live_start_time: number | undefined;
  // 场次状态
  live_status: number | undefined;
  // 直播场次标题
  live_title: string | undefined;
  // 项目id
  project_id: number | undefined;
  // 项目名称
  project_name: string | undefined;
  // 直播间曝光次数
  room_exposure_times: number | undefined;
  // 直播间曝光人数
  room_exposure_ucnt: number | undefined;
  // 直播间观看次数
  room_watch_times: number | undefined;
  // 直播间观看人数
  room_watch_ucnt: number | undefined;
  // 班次ID
  shift_id: number | undefined;
  // 班次名称
  shift_name: string | undefined;
  // 直播间id
  studio_id: number | undefined;
  change_tips: change_tips[] | undefined;
  // 实际成交额
  actual_gmv: number | undefined;
}

export interface CTRProject {
  project_id: number;
  project_name: string | undefined;
}

export interface ShiftGroupCtrShopLive {
  shift_id: number | undefined;
  shift_name: string | undefined;
  shop_live_list: CtrListModel[] | undefined;
}

export interface ShopLiveStatisticalTrendsParam {
  project_ids: string | undefined;
  start_date: string | undefined;
  end_date: string | undefined;
  /** 趋势周期：1-按天统计，2- 按周统计，3-按月统计 */
  statistics_cycle: number | undefined;
}

interface change_tips {
  change_tip: number;
  username: string;
}

export interface ShopLiveStatisticalTrendsDataListModel {
  /** 变更标记，1-硬装，2-灯光，3-机位，4-陈列，5-贴片，6-调色 */
  change_tips: change_tips[] | undefined;
  /** 统计数据结束时间 */
  end_date: string | undefined;
  /** 平局进入率（人数） */
  exposure_watch_times_ratio: number | undefined;
  /** 平均进入率（人次） */
  exposure_watch_ucnt_ratio: number | undefined;

  /** 统计区间内，最后一场直播场次ID */
  shop_live_id: number | undefined;
  /** 统计数据开始时间 **/
  start_date: string | undefined;
  /** 趋势周期：1-按天统计，2- 按周统计，3-按月统计 */
  statistics_cycle: number | undefined;
  live_screenshot: string | undefined;
  sum_gmv: number | undefined;
}
export interface ShopLiveStatisticalTrendsModel {
  end_date: number | undefined;
  project_id: number | string | undefined;
  project_name: string | undefined;
  start_date: number | undefined;
  data_list: ShopLiveStatisticalTrendsDataListModel[] | undefined;
}

export interface DouyinCompetitiveItems {
  /** 天鸽一级类目 */
  first_tiange_cat: string;
  /** 天鸽一级类目ID */
  first_tiange_cat_id: number;
  /** 天鸽二级类目 */
  second_tiange_cat: string;
  /** 天鸽二级类目ID */
  second_tiange_cat_id: number;
  /** 天鸽三级类目 */
  third_tiange_cat: string;
  /** 天鸽三级类目id */
  third_tiange_cat_id: number;
  item_cat: string;
  /** 每月环比详情列表 */
  months: {
    /** 平均件单价/分 */
    average_sale_price: number;
    /** 销售额 */
    gmv: number;
    /** 月份 */
    month: number;
    /** 销量 */
    sale: number;
  }[];
}

export interface DouyinCompetitiveTop10Item {
  /** 平均件单价/分 */
  average_sale_price: number;
  /** 销售额 */
  gmv: number;
  /** 排行 */
  index: number;
  /** 商品编码 */
  item_id: number;
  /** 商品主图 */
  item_image: string;
  /** 商品名称 */
  item_title: string;
  /** 销量 */
  sale: number;
  url?: string;
}

export interface VideoRecordGoodsItem {
  /** 品牌ID */
  brand_id: number;
  /** 品牌名称 */
  brand_name: string;
  /** 点击率 */
  click_rate: number;
  /** 商品首次上架时间 */
  first_sale_date: string;
  /** 销售额 */
  gmv: number;
  /** 商品图片 */
  image_url: string;
  /** 是否存在商品数据 */
  is_exist: boolean;
  /** 商品排名等级 */
  item_rank: number;
  /** 转化率 */
  pay_rate: number;
  /** 项目ID */
  project_id: number;
  /** 项目名称 */
  project_name: string;
  /** 销量 */
  sale_count: number;
  /** 二级类目ID */
  second_cid: number;
  /** 二级类目名称 */
  second_cname: string;
  /** 款号 */
  sn: string;
  /** 讲解次数 */
  talk_times: number;
  /** 商品标题 */
  title: string;
  /** 关联视频数 */
  video_count: number;
  /** 商品排名等级 */
  video_ids: string[];
}

export interface VideoRecordItem {
  /** 评论量 */
  comment_count: number;
  /** 评论率 **/
  play_comment_ratio: number;
  /** 视频上架时间 */
  create_datetime: string;
  /** 点赞量 */
  digg_count: number;
  /** 点赞率 **/
  play_digg_ratio: number;
  /** 抖音账号ID */
  douyin_id: number;
  douyin_name: string;
  /** 关联商品数量 */
  item_count: number;
  /** 新增粉丝量 */
  new_fans_count: number;
  /** 均播时长 */
  play_avg_time: number;
  /** 播放量 */
  play_count: number;
  effective_play_ratio: number;
  /** 完播率 */
  play_finish_ratio: number;
  /** 分享量 */
  share_count: number;
  /** 分享率 **/
  play_share_ratio: number;
  /** 视频ID */
  video_id: string;
  /** 视频缩略图连接 */
  video_img_url: string;
  /** 视频播放连接 */
  video_play_url: string;
  /** 视频标题 */
  video_title: string;
  /** 视频跳转连接 */
  video_url: string;
  video_duration: number;
  /** 拍摄时间 */
  shooting_date?: string;
  item_list?: VideoRecordGoodsItem[];
  model_list?: Model[];
  /** 短视频测款指数 **/
  index_num: number;
  effective_play_count: number;
}

export interface VideoItemDetail {
  cat_list: {
    second_cat_id: number;
    second_cat_name: string;
    third_cat_list: {
      third_cat_id: number;
      third_cat_name: string;
    }[];
  }[];
  item_list: [];
}

export interface VideoAccount {
  /** 抖音账号ID */
  douyin_id: string;
  /** 抖音账号名称 */
  douyin_name: string;
  lately_login_datetime: string;
  /** 登陆状态（1->登陆中；0->已离线） */
  login_status: number;
  phone: string;
}

export interface UpdateFollowUpRecordParams {
  project_id?: number;
  product_sn?: string;
  /** 是否已直播 **/
  is_live?: number;
  /** 是否已跟进 **/
  is_follow_up?: number;
  /** 是否已反馈 **/
  is_feedback?: number;
  /** 跟进人id **/
  follow_up_user_id?: number;
  /** 跟进日期 **/
  follow_up_date?: string;
  /** 跟进备注 **/
  follow_up_comment?: string;
  /** 反馈人id **/
  feedback_user_id?: number;
  /** 反馈日期 **/
  feedback_date?: string;
  /** 反馈备注 **/
  feedback_comment?: string;
}

export interface ItemColorClassifyModel {
  /** 关键词 **/
  keyword?: string;
  /** 颜色分类 **/
  after_classification_color?: string;
}
