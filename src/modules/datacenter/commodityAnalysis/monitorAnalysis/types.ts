export interface settingItemOpt {
  name: string;
  select: boolean;
}
export interface settingItem {
  children: settingItemOpt[];
  label: string;
}

export interface saleCountItemOpt {
  sale_count: number | null;
  week_number: number | string | null;
}

/** 商品监控 */
export interface monitorAnalysisItem {
  additional_order: string | null; // 追单
  color: string | null; // 颜色
  advice: string | null; // 商品建议策略
  avg_click_rate: number | null; // 平均点击率
  avg_pay_rate: number | null; //平均转化率
  avg_refund_gmv_rate: number | null; //平均退款率
  competitive_sku_info_list: any[];
  competitive_total_sale_count: number | null; //竞店累计销量
  create_time: string | null; //商品创建时间
  difference: string | null; //销量差异
  discount: string | null; //折扣
  first_cid: string | null; //一级类目id
  first_cname: string | null; // 一级类目名
  fourth_cid: string | null; //四级类目id
  fourth_cname: string | null; //四级类目名
  is_sample?: number | boolean | null; // 样衣有无
  has_sample: string | null; // 样衣有无
  health: string | null; //商品健康度/商品质量分
  image_url: string | null; //商品主图URL链接
  item_id: string | null; //商品编码
  item_sn: string | null; //商品款号
  last_4week_sale_info: saleCountItemOpt[]; //	近4周销售跟踪列表[...]
  last_4week_sale_info_line?: { x: number; y: number }[]; //周趋势
  last_week_sale_info: {
    click_rate: number | null; //点击率
    gmv: any; // 销额
    pay_rate: number | null; // 转化率
    refund_gmv_rate: number | null; // 退款率
    sale_count: number | null; // 销量
    stock_times: number | null; // 库存可销周数
    talk_times: number | null; // 讲解次数
    week_number: number | null; // 周数
  }; //上周销售跟踪{...}
  live_price: any; //昨日直播价
  live_price_range: string | null; //价格带(直播价)
  market_price: any; // 吊牌价
  market_price_range: string | null; //价格带(吊牌价)
  products_worth: number | null; // 货值
  prop_info_list: any[]; //	商品基本属性列表[...]
  sale_count_list: any[]; //	销量列表[...]
  sale_count_list_line?: { x: number; y: number }[]; //趋势图
  season: string | null; //季节
  second_cid: string | null; //二级类目id
  second_cname: string | null; //二级类目名
  section: string | null; // 款别
  skc: number | null; // SKC
  sku: number | null; // SKU
  stock: number | null; //  当前库存
  third_cid: string | null; // 三级类目id
  third_cname: string | null; //  三级类目名
  total_gmv: number | null; // 累计销额
  total_sale_count: number | null; //  累计销量
  total_talk_times: number | null; //  累计讲解次数
  year: string | number | null; //  年度
  spec_id: string | null; // 规格id
  potential_index: number | null; //  潜力指数
  popularity_index: number | null; // 受欢迎指数
}
