export interface IWeekMonthTargetCompleteRow {
  gmv: number; // 销售额达成
  gmv_percent: number; // 销售额达成率
  goal_gmv: number; //销售额目标
  goal_net_gmv: number; // 浄销额目标
  name: string; // 维度值, 22年10月时, 月维度下则为10
  net_gmv: number; // 浄销额达成
  net_gmv_percent: number; // 浄销额达成率
  schedule: number | string; // 时间进度
  title_name?: string;
}

export interface IWeekMonthTopStockRow {
  average_market_price: number; //平均吊牌价/分
  average_sale: number; // 款均销量
  average_sale_price: number; //平均件单价/分
  discount: number; // 折扣率
  gmv: number; //销售额
  gmv_percent: number; // 销售额占比
  name: string; // 排名分类, like `TOP 1-5`
  sale: number; // 销量
  sku_number: number; //款数
  stock: number; // 现有库存
  stock_percent: number; // 库存占比
  stock_times: number; // 库存可销
}

export interface IWeekMonthPriceRow {
  gmv: number; // 销售额
  gmv_percent: number; // 销售额占比
  max_price: number; // 截止价格/分
  min_price: number; // 起始价格/分
  sale: number; //  销量
  average_sale?: number; //款均销量
  sale_percent: number; //  销量占比
  sku_number: number; //  款数
  sku_number_percent: number; // 款数占比
  average_sale_price?: number; //平均件单价
  stock?: number; //库存
  stock_times?: number; //库存可销周
  stock_timesstock?: number; //现有库存
  stock_percent?: number; //库存占比
  average_market_price?: number; //平均吊牌价 (元)
  discount?: number; //折扣率
}

export interface IWeekMonthNewShopRow {
  click_ucnt: number; //商品点击人数
  date: string; // 日期
  discount_price: number; // 折扣价/分
  first_cid: string; // 抖店一级类目
  first_cname: string; //抖店一级类目ID
  gmv: number; // 销售额
  image_url: string; // 头图URL链接
  item_id: number; // 商品ID
  market_price: number; //吊牌价/分
  sale_count: number; //销量
  second_cid: string; //抖店二级类目
  second_cname: string; // 抖店二级类目ID
  sn: string; //款号
  talk_times: number; // 讲解次数
  title: string; // 标题
  watch_ucnt: number; // 商品曝光人数
  new_sku_sales_ratio?: number; // 总动销率
}
