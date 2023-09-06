/*
 * @Author       : yunie
 * @Date         : 2022-07-15 11:19:13
 * @LastEditTime : 2022-07-26 13:45:18
 * @FilePath     : \src\modules\datacenter\shoplive\tabs\projectDetail\use\useData.tsx
 * @Description  :
 */
import { SetupContext, reactive, toRefs, h, ref } from '@vue/composition-api';
import moment from 'moment';
import { GetDouyinItemPieChart } from '@/services/datacenter/shoplive';
import {
  GetDouyinItemReport,
  GetProjectKolItemReport,
  GetProjectKolCategory,
} from '@/services/datacenter/shoplive';
import formatPriceForm from '@/utils/formatData';
import { GetSystemShopLiveCategory } from '@/services/datacenter/shoplive';
import { Message } from 'element-ui';
import { GetShopLiveQueryDouyinTiangeCategory } from '@/services/datacenter';
import emptyGoods from '@/assets/img/goods-empty.png';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

const { formatPriceFormYuan, formatEmpty, tranNumber } = formatPriceForm;
export interface chartParams {
  // 选择的项目
  project_id: string | undefined;
  // 选择的日期
  start_date?: string | undefined;
  end_date?: string | undefined;
}

export enum DisplayDataType {
  /** 场次 */
  sessions = 'sessions',
  /** 商品 */
  commodity = 'commodity',
  /** 开播主播 */
  launchnchor = 'launchnchor',
  /** 流量 */
  flow = 'flow',
  /** 粉丝 */
  fans = 'fans',
  // 投放 */
  launch = 'launch',
}
export enum DateRangeType {
  /** 年度 */
  date = 0,
  /** 季度 */
  week,
  /** 月度 */
  month,
}
type rangeDate = 'date' | 'week' | 'month';
export type dataT = {
  [key in rangeDate[number]]: {
    value: moment.Moment;
    format?: string;
    rule: string;
  };
};
export type seachTpye = {
  start_date: string;
  end_date: string;
  project_id: undefined | string;
  is_from_project?: boolean;
};

/*Data_list*/
export type Data_list = {
  date: string;
  gmv: number;
  order_num: number;
  single_uv: number;
  start_time: string;
  watch_ucnt: number;
};

/*数据概览接口*/
export type overviewT = {
  avg_watch_duration: number;
  avg_watch_duration_percent: number;
  data_list: Data_list[];
  gmv: number;
  gmv_percent: number;
  goal_gmv_percent: number;
  goal_gmv_percent_percent: number;
  max_online_cnt: number;
  max_online_cnt_percent: number;
  order_num: number;
  order_num_percent: number;
  project_id: string;
  shop_logo: string;
  single_uv: number;
  single_uv_percent: number;
  watch_ucnt: number;
  watch_ucnt_percent: number;
};

//开播场次
export type live_room_info = {
  end_time: string;
  exposure_ucnt: number;
  gmv: number;
  incr_fans_cnt: number;
  live_duration: number;
  live_room_id: string;
  pay_cnt: number;
  pay_order_cnt: number;
  pay_ucnt: number;
  product_nums: number;
  shop_id: number;
  start_time: string;
};

//主播明细or商品明细
export enum infoType {
  shop,
  launch,
}
export const useData = (ctx: SetupContext) => {
  const method = {};
  return {
    ...method,
  };
};

const toFixedSimple = (num: number) => {
  return (num.toFixed(2) as any) - 0;
};
// 价格带销售分析饼图
export const useItemPieChart = (ctx: SetupContext) => {
  const dataStruct = reactive({
    loading: false,
    gmvPieData: [],
    salePieData: [],
    priceGoodsColumn: [
      {
        label: '价格带',
        prop: 'name',
        align: 'center',
        headerAlign: 'center',
      },
      {
        label: '销量',
        prop: 'value',
        align: 'center',
        headerAlign: 'center',
      },
      {
        label: '占比',
        prop: 'ratio',
        align: 'center',
        width: 90,
        headerAlign: 'center',
      },
    ],
    priceGoodsGmvColumn: [
      {
        label: '价格带',
        prop: 'name',
        align: 'center',
        headerAlign: 'center',
      },
      {
        label: '销售额',
        prop: 'value',
        align: 'center',
        headerAlign: 'center',
      },
      {
        label: '占比',
        prop: 'ratio',
        align: 'center',
        width: 90,
        headerAlign: 'center',
      },
    ],
  });
  const { business_type } = useProjectBaseInfo();
  const getData = async (payload: chartParams) => {
    dataStruct.loading = true;
    try {
      const {
        data: {
          data: { pie_chart },
        },
      } = await GetDouyinItemPieChart(payload, business_type.value);
      const gmvTotal = pie_chart.reduce(
        (total: number, item: any) => (total = item.gmv + total),
        0,
      );
      const saleTotal = pie_chart.reduce(
        (total: number, item: any) => (total = item.sale_count + total),
        0,
      );
      // idx === pie_chart.length && item.max_price === 0 ? :
      dataStruct.gmvPieData = pie_chart.map((item: any, idx: number) => {
        const obj = {
          name: '',
          value: toFixedSimple(item.gmv / 100),
          ratio: gmvTotal > 0 ? ((item.gmv / gmvTotal) * 100).toFixed(2) + '%' : '0',
        };
        if (idx <= 0 && item.min_price === 0) {
          obj.name = toFixedSimple(item.max_price / 100) + '以下';
        } else if (idx === pie_chart.length - 1 && !item.max_price) {
          obj.name = toFixedSimple(item.min_price / 100) + '以上';
        } else {
          obj.name =
            '￥' +
            toFixedSimple(item.min_price / 100) +
            '-' +
            '￥' +
            toFixedSimple(item.max_price / 100);
        }
        return obj;
      });
      dataStruct.salePieData = pie_chart.map((item: any, idx: number) => {
        const obj = {
          name: '',
          value: item.sale_count,
          ratio: saleTotal > 0 ? ((item.sale_count / saleTotal) * 100).toFixed(2) + '%' : '0',
        };
        if (idx <= 0 && item.min_price === 0) {
          obj.name = toFixedSimple(item.max_price / 100) + '以下';
        } else if (idx === pie_chart.length - 1 && !item.max_price) {
          obj.name = toFixedSimple(item.min_price / 100) + '以上';
        } else {
          obj.name =
            '￥' +
            toFixedSimple(item.min_price / 100) +
            '-' +
            '￥' +
            toFixedSimple(item.max_price / 100);
        }
        return obj;
      });
    } catch (error) {
      ctx.root.$message.error('查询失败');
    } finally {
      dataStruct.loading = false;
    }
  };
  return {
    ...toRefs(dataStruct),
    getData,
  };
};

// 商品信息列表-品牌中心
export const useSaleGoodsShopLiveTop = (ctx: SetupContext) => {
  const dataStruct = reactive({
    loading: false,
    saleData: [],
    total: 0,
    hotGoodsColumn: [
      {
        label: '商品信息',
        width: 228,
        align: 'left',
        fixed: true,
        headerAlign: 'left',
        formatter: (row: any) => {
          return h(
            'div',
            {
              class: 'goods-info',
            },
            [
              h('img', {
                attrs: {
                  src: row.image_url || emptyGoods,
                },
                style: {
                  cursor: 'pointer',
                },
                on: {
                  click: function () {
                    window.open(
                      'https://haohuo.jinritemai.com/views/product/item2?id=' + row.item_id,
                    );
                  },
                },
              }),
              h(
                'div',
                {
                  class: 'info-row',
                },
                [
                  h(
                    'el-tooltip',
                    {
                      props: {
                        content: row.title,
                      },
                    },
                    [
                      h(
                        'div',
                        {
                          class: 'goods-title',
                          style: {
                            cursor: 'pointer',
                          },
                          on: {
                            click: function () {
                              window.open(
                                'https://haohuo.jinritemai.com/views/product/item2?id=' +
                                  row.item_id,
                              );
                            },
                          },
                        },
                        row.title,
                      ),
                    ],
                  ),
                  h(
                    'div',
                    {
                      class: 'goods-price',
                    },
                    [
                      h('span', undefined, '直播价：'),
                      h(
                        'span',
                        undefined,
                        formatPriceFormYuan((row.discount_price / 100).toFixed(2), 2, false),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          );
        },
      },
      {
        label: '商品编号',
        width: 164,
        align: 'center',
        headerAlign: 'center',
        formatter: (row: any) => formatEmpty(row.item_id),
      },
      {
        label: '类目',
        minWidth: 120,
        align: 'left',
        headerAlign: 'left',
        formatter: (row: any) => formatEmpty(row.second_cname),
      },
      {
        label: '讲解次数',
        minWidth: 95,
        align: 'right',
        sortable: 'custom',
        prop: 'talk_times',
        headerAlign: 'right',
        formatter: (row: any) => tranNumber(row.talk_times),
      },
      {
        label: '曝光人数',
        minWidth: 95,
        align: 'right',
        sortable: 'custom',
        prop: 'watch_ucnt',
        headerAlign: 'right',
        formatter: (row: any) => tranNumber(row.watch_ucnt),
      },
      {
        label: '点击人数',
        minWidth: 95,
        align: 'right',
        sortable: 'custom',
        prop: 'click_ucnt',
        headerAlign: 'right',
        formatter: (row: any) => tranNumber(row.click_ucnt),
      },
      {
        label: '点击率',
        minWidth: 85,
        align: 'right',
        sortable: 'custom',
        prop: 'click_rate',
        headerAlign: 'right',
        formatter: (row: any) => formatEmpty(row.click_rate, '%'),
      },
      {
        label: '订单数',
        minWidth: 85,
        align: 'right',
        sortable: 'custom',
        prop: 'order_cnt',
        headerAlign: 'right',
        formatter: (row: any) => tranNumber(row.order_cnt),
      },
      {
        label: '销量',
        minWidth: 85,
        align: 'right',
        sortable: 'custom',
        prop: 'sale_count',
        headerAlign: 'right',
        formatter: (row: any) => tranNumber(row.sale_count),
      },
      {
        label: '销售额 (元)',
        minWidth: 106,
        align: 'right',
        sortable: 'custom',
        prop: 'gmv',
        headerAlign: 'right',
        formatter: (row: any) => formatPriceFormYuan((row.gmv / 100).toFixed(2), 2, false),
      },
      {
        label: '销售额占比',
        minWidth: 104,
        align: 'right',
        sortable: 'custom',
        prop: 'gmv_part',
        headerAlign: 'right',
        formatter: (row: any) => formatEmpty(row.gmv_part, '%'),
      },
      // {
      //   label: '讲解次数',
      //   width: 122,
      //   sortable: 'custom',
      //   prop: 'talk_times',
      //   align: 'right',
      //   headerAlign: 'right',
      //   formatter: (row: any) => formatEmpty(row.talk_times),
      // },
      // {
      //   label: '曝光人数',
      //   width: 122,
      //   align: 'right',
      //   sortable: 'custom',
      //   prop: 'watch_ucnt',
      //   headerAlign: 'right',
      //   formatter: (row: any) => tranNumber(row.watch_ucnt),
      // },
      // {
      //   label: '点击人数',
      //   minWidth: 122,
      //   align: 'right',
      //   sortable: 'custom',
      //   prop: 'click_ucnt',
      //   headerAlign: 'right',
      //   formatter: (row: any) => tranNumber(row.click_ucnt),
      // },
      // {
      //   label: '点击率',
      //   minWidth: 126,
      //   align: 'right',
      //   sortable: 'custom',
      //   prop: 'click_rate',
      //   headerAlign: 'right',
      //   formatter: (row: any) => formatEmpty(row.click_rate, '%'),
      // },
      /*{
        label: '订单数',
        minWidth: 122,
        sortable: 'custom',
        prop: 'order_cnt',
        align: 'right',
        headerAlign: 'right',
        formatter: (row: any) => tranNumber(row.order_cnt),
      },*/

      {
        label: '成交转化率',
        minWidth: 104,
        align: 'right',
        sortable: 'custom',
        prop: 'pay_rate',
        headerAlign: 'right',
        formatter: (row: any) => formatEmpty(row.pay_rate, '%'),
      },
      // {
      //   label: '退款人数 ',
      //   minWidth: 134,
      //   sortable: 'custom',
      //   prop: 'refund_ucnt',
      //   align: 'right',
      //   headerAlign: 'right',
      //   formatter: (row: any) => tranNumber(row.refund_ucnt),
      // },
      // {
      //   label: '发货前退款金额 (元)',
      //   minWidth: 164,
      //   align: 'right',
      //   sortable: 'custom',
      //   prop: 'refund_gmv',
      //   headerAlign: 'right',
      //   formatter: (row: any) => formatPriceFormYuan((row.refund_gmv / 100).toFixed(2), 2, false),
      // },
      // {
      //   label: '发货前退款比例',
      //   minWidth: 164,
      //   align: 'right',
      //   sortable: 'custom',
      //   prop: 'refund_rate',
      //   headerAlign: 'right',
      //   formatter: (row: any) => formatEmpty(row.refund_rate, '%'),
      // },
      // {
      //   label: '总退款金额 (元)',
      //   minWidth: 134,
      //   align: 'right',
      //   sortable: 'custom',
      //   prop: 'refund_gmv',
      //   headerAlign: 'right',
      //   formatter: (row: any) => formatPriceFormYuan((row.refund_gmv / 100).toFixed(2), 2, false),
      // },
      // {
      //   label: '总退款比例',
      //   minWidth: 134,
      //   align: 'right',
      //   sortable: 'custom',
      //   prop: 'refund_rate',
      //   headerAlign: 'right',
      //   formatter: (row: any) => formatEmpty(row.refund_rate, '%'),
      // },
      /* {
        label: '实际销售额 (元)',
        minWidth: 144,
        sortable: 'custom',
        prop: 'gmv',
        align: 'right',
        headerAlign: 'right',
        formatter: (row: any) => formatPriceFormYuan((row.gmv / 100).toFixed(2), 2, false),
      },*/
    ],
    shopDetailColumns: [
      {
        label: '商品信息',
        width: 228,
        align: 'left',
        fixed: true,
        headerAlign: 'left',
        formatter: (row: any) => {
          return h(
            'div',
            {
              class: 'goods-info',
            },
            [
              h('img', {
                attrs: {
                  src: row.image_url || emptyGoods,
                },
                style: {
                  cursor: 'pointer',
                },
                on: {
                  click: function () {
                    window.open(
                      'https://haohuo.jinritemai.com/views/product/item2?id=' + row.item_id,
                    );
                  },
                },
              }),
              h(
                'div',
                {
                  class: 'info-row',
                },
                [
                  h(
                    'el-tooltip',
                    {
                      props: {
                        content: row.title,
                      },
                    },
                    [
                      h(
                        'div',
                        {
                          class: 'goods-title',
                          style: {
                            cursor: 'pointer',
                          },
                          on: {
                            click: function () {
                              window.open(
                                'https://haohuo.jinritemai.com/views/product/item2?id=' +
                                  row.item_id,
                              );
                            },
                          },
                        },
                        row.title,
                      ),
                    ],
                  ),
                  h(
                    'div',
                    {
                      class: 'goods-price',
                    },
                    [
                      h('span', undefined, '直播价：'),
                      h(
                        'span',
                        undefined,
                        formatPriceFormYuan((row.discount_price / 100).toFixed(2), 2, false),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          );
        },
      },
      {
        label: '类目',
        minWidth: 130,
        align: 'left',
        headerAlign: 'left',
        formatter: (row: any) => formatEmpty(row.second_cname),
      },
      {
        label: '销售额 (元)',
        minWidth: 126,
        align: 'right',
        sortable: 'custom',
        prop: 'gmv',
        headerAlign: 'right',
        formatter: (row: any) => formatPriceFormYuan((row.gmv / 100).toFixed(2), 2, false),
      },
      {
        label: '销售额占比',
        minWidth: 144,
        align: 'right',
        sortable: 'custom',
        prop: 'gmv_part',
        headerAlign: 'right',
        formatter: (row: any) => formatEmpty(row.gmv_part, '%'),
      },
      {
        label: '销量',
        minWidth: 105,
        align: 'right',
        sortable: 'custom',
        prop: 'sale_count',
        headerAlign: 'right',
        formatter: (row: any) => tranNumber(row.sale_count),
      },
      {
        label: '平均售价 (元)',
        minWidth: 126,
        align: 'right',
        sortable: 'custom',
        prop: 'avg_price',
        headerAlign: 'right',
        formatter: (row: any) => formatPriceFormYuan((row.avg_price / 100).toFixed(2), 2, false),
      },
      {
        label: '平均折扣率',
        minWidth: 135,
        align: 'right',
        sortable: 'custom',
        prop: 'discount_rate',
        headerAlign: 'right',
        formatter: (row: any) => formatEmpty(row.discount_rate, '%'),
      },
      {
        label: '讲解次数',
        minWidth: 105,
        align: 'right',
        sortable: 'custom',
        prop: 'talk_times',
        headerAlign: 'right',
        formatter: (row: any) => tranNumber(row.talk_times),
      },
      // {
      //   label: '曝光人数',
      //   minWidth: 105,
      //   align: 'right',
      //   sortable: 'custom',
      //   prop: 'watch_ucnt',
      //   headerAlign: 'right',
      //   formatter: (row: any) => tranNumber(row.watch_ucnt),
      // },
      // {
      //   label: '点击人数',
      //   minWidth: 105,
      //   align: 'right',
      //   sortable: 'custom',
      //   prop: 'click_ucnt',
      //   headerAlign: 'right',
      //   formatter: (row: any) => tranNumber(row.click_ucnt),
      // },
      // {
      //   label: '点击率',
      //   minWidth: 135,
      //   align: 'right',
      //   sortable: 'custom',
      //   prop: 'click_rate',
      //   headerAlign: 'right',
      //   formatter: (row: any) => formatEmpty(row.click_rate, '%'),
      // },
      // {
      //   label: '成交转化率',
      //   minWidth: 144,
      //   align: 'right',
      //   sortable: 'custom',
      //   prop: 'pay_rate',
      //   headerAlign: 'right',
      //   formatter: (row: any) => formatEmpty(row.pay_rate, '%'),
      // },
      // {
      //   label: '退款人数 ',
      //   minWidth: 134,
      //   sortable: 'custom',
      //   prop: 'refund_ucnt',
      //   align: 'right',
      //   headerAlign: 'right',
      //   formatter: (row: any) => tranNumber(row.refund_ucnt),
      // },
      {
        label: '发货前退款金额 (元)',
        minWidth: 164,
        align: 'right',
        sortable: 'custom',
        prop: 'refund_status21_gmv',
        headerAlign: 'right',
        formatter: (row: any) =>
          formatPriceFormYuan((row.refund_status21_gmv / 100).toFixed(2), 2, false),
      },
      {
        label: '发货前退款比例',
        minWidth: 164,
        align: 'right',
        sortable: 'custom',
        prop: 'refund_status21_rate',
        headerAlign: 'right',
        formatter: (row: any) => formatEmpty(row.refund_status21_rate, '%'),
      },
      {
        label: '总退款金额 (元)',
        minWidth: 134,
        align: 'right',
        sortable: 'custom',
        prop: 'refund_gmv',
        headerAlign: 'right',
        formatter: (row: any) => formatPriceFormYuan((row.refund_gmv / 100).toFixed(2), 2, false),
      },
      {
        label: '总退款比例',
        minWidth: 134,
        align: 'right',
        sortable: 'custom',
        prop: 'refund_rate',
        headerAlign: 'right',
        formatter: (row: any) => formatEmpty(row.refund_rate, '%'),
      },
      /* {
        label: '实际销售额 (元)',
        minWidth: 144,
        sortable: 'custom',
        prop: 'gmv',
        align: 'right',
        headerAlign: 'right',
        formatter: (row: any) => formatPriceFormYuan((row.gmv / 100).toFixed(2), 2, false),
      },*/
    ],
  });
  const getData = async (payload: any) => {
    dataStruct.loading = true;
    try {
      const res: any = await GetDouyinItemReport(payload, business_type.value);
      dataStruct.saleData = res.data.data.items || [];
      dataStruct.total = res.data.data.total || 0;
    } catch (error) {
      ctx.root.$message.error('查询失败');
    } finally {
      dataStruct.loading = false;
    }
  };
  const category_1 = ref<any[]>([]);
  const category_2 = ref([]);
  const category_3 = ref([]);

  const { business_type } = useProjectBaseInfo();
  // 分类-1级类目
  const getCategory_1 = async (
    payload: any,
    // category_id: any,
    // second_tiange_cat_id: number,
  ) => {
    // GetShopLiveQueryDouyinTiangeCategory
    const res = await GetSystemShopLiveCategory(
      {
        ...payload,
      } as any,
      business_type.value,
    );
    if (!res.data.success) {
      Message.error(res.data.message);
      return;
    }
    category_1.value = res.data.data.map((item: any) => {
      return {
        label: item.cat_name,
        value: item.id,
      };
    });
  };
  const getCategory_2 = async (payload: any) => {
    // GetShopLiveQueryDouyinTiangeCategory
    const res = await GetShopLiveQueryDouyinTiangeCategory(
      {
        ...payload,
        is_from_project: payload.is_from_project || false,
      } as any,
      business_type.value,
    );
    if (!res.data.success) {
      Message.error(res.data.message);
      return;
    }
    category_2.value = res.data.data.map((item: any) => {
      return {
        label: item.cat_name,
        value: item.id,
      };
    });
  };
  const getCategory_3 = async (payload: any) => {
    // GetShopLiveQueryDouyinTiangeCategory
    const res = await GetShopLiveQueryDouyinTiangeCategory(
      {
        ...payload,
        is_from_project: payload.is_from_project || false,
      } as any,
      business_type.value,
    );
    if (!res.data.success) {
      Message.error(res.data.message);
      return;
    }
    category_3.value = res.data.data.map((item: any) => {
      return {
        label: item.cat_name,
        value: item.id,
      };
    });
  };
  return {
    ...toRefs(dataStruct),
    getData,
    getCategory_1,
    getCategory_2,
    getCategory_3,
    category_1,
    category_2,
    category_3,
  };
};

// 商品信息列表-主播商品明细
export const useProjectKolItemReport = (ctx: SetupContext) => {
  const dataStruct = reactive({
    loading: false,
    saleData: [],
    total: 0,
    hotGoodsColumn: [
      {
        label: '商品信息',
        width: 228,
        align: 'left',
        fixed: true,
        headerAlign: 'left',
        formatter: (row: any) => {
          return h(
            'div',
            {
              class: 'goods-info',
            },
            [
              h('img', {
                attrs: {
                  src: row.image_url || emptyGoods,
                },
                style: {
                  cursor: 'pointer',
                },
                on: {
                  click: function () {
                    window.open(
                      'https://haohuo.jinritemai.com/views/product/item2?id=' + row.item_id,
                    );
                  },
                },
              }),
              h(
                'div',
                {
                  class: 'info-row',
                },
                [
                  h(
                    'el-tooltip',
                    {
                      props: {
                        content: row.title,
                      },
                    },
                    [
                      h(
                        'div',
                        {
                          class: 'goods-title',
                          style: {
                            cursor: 'pointer',
                          },
                          on: {
                            click: function () {
                              window.open(
                                'https://haohuo.jinritemai.com/views/product/item2?id=' +
                                  row.item_id,
                              );
                            },
                          },
                        },
                        row.title,
                      ),
                    ],
                  ),
                  h(
                    'div',
                    {
                      class: 'goods-price',
                    },
                    [
                      h('span', undefined, '吊牌价：'),
                      h(
                        'span',
                        undefined,
                        formatPriceFormYuan((row.market_price / 100).toFixed(2), 2, false),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          );
        },
      },
      {
        label: '类目',
        minWidth: 120,
        align: 'left',
        headerAlign: 'left',
        formatter: (row: any) => formatEmpty(row.second_cname),
      },
      {
        label: '销售额 (元)',
        minWidth: 106,
        align: 'right',
        sortable: 'custom',
        prop: 'gmv',
        headerAlign: 'right',
        formatter: (row: any) => formatPriceFormYuan((row.gmv / 100).toFixed(2), 2, false),
      },
      {
        label: '销售额占比',
        minWidth: 100,
        align: 'right',
        // sortable: 'custom',
        prop: 'gmv_part',
        headerAlign: 'right',
        formatter: (row: any) => formatEmpty(row.gmv_part, '%'),
      },
      {
        label: '销量',
        minWidth: 85,
        align: 'right',
        sortable: 'custom',
        prop: 'sale_count',
        headerAlign: 'right',
        formatter: (row: any) => tranNumber(row.sale_count),
      },
      {
        label: '平均售价 (元)',
        minWidth: 105,
        align: 'right',
        // sortable: 'custom',
        prop: 'avg_price',
        headerAlign: 'right',
        formatter: (row: any) => formatPriceFormYuan((row.avg_price / 100).toFixed(2), 2, false),
      },
      {
        label: '平均折扣率',
        minWidth: 95,
        align: 'right',
        // sortable: 'custom',
        prop: 'discount_rate',
        headerAlign: 'right',
        formatter: (row: any) => formatEmpty(row.discount_rate, '%'),
      },
      {
        label: '讲解次数',
        minWidth: 95,
        align: 'right',
        sortable: 'custom',
        prop: 'talk_times',
        headerAlign: 'right',
        formatter: (row: any) => tranNumber(row.talk_times),
      },
      // {
      //   label: '曝光人数',
      //   minWidth: 105,
      //   align: 'right',
      //   sortable: 'custom',
      //   prop: 'watch_ucnt',
      //   headerAlign: 'right',
      //   formatter: (row: any) => tranNumber(row.watch_ucnt),
      // },
      // {
      //   label: '点击人数',
      //   minWidth: 105,
      //   align: 'right',
      //   sortable: 'custom',
      //   prop: 'click_ucnt',
      //   headerAlign: 'right',
      //   formatter: (row: any) => tranNumber(row.click_ucnt),
      // },
      // {
      //   label: '点击率',
      //   minWidth: 135,
      //   align: 'right',
      //   sortable: 'custom',
      //   prop: 'click_rate',
      //   headerAlign: 'right',
      //   formatter: (row: any) => formatEmpty(row.click_rate, '%'),
      // },
      // {
      //   label: '成交转化率',
      //   minWidth: 144,
      //   align: 'right',
      //   sortable: 'custom',
      //   prop: 'pay_rate',
      //   headerAlign: 'right',
      //   formatter: (row: any) => formatEmpty(row.pay_rate, '%'),
      // },
      // {
      //   label: '退款人数 ',
      //   minWidth: 134,
      //   sortable: 'custom',
      //   prop: 'refund_ucnt',
      //   align: 'right',
      //   headerAlign: 'right',
      //   formatter: (row: any) => tranNumber(row.refund_ucnt),
      // },
      {
        label: '发货前退款金额 (元)',
        minWidth: 164,
        align: 'right',
        sortable: 'custom',
        prop: 'refund_status21_gmv',
        headerAlign: 'right',
        formatter: (row: any) =>
          formatPriceFormYuan((row.refund_status21_gmv / 100).toFixed(2), 2, false),
      },
      {
        label: '发货前退款比例',
        minWidth: 130,
        align: 'right',
        // sortable: 'custom',
        prop: 'refund_status21_rate',
        headerAlign: 'right',
        formatter: (row: any) => formatEmpty(row.refund_status21_rate, '%'),
      },
      {
        label: '总退款金额 (元)',
        minWidth: 130,
        align: 'right',
        sortable: 'custom',
        prop: 'refund_gmv',
        headerAlign: 'right',
        formatter: (row: any) => formatPriceFormYuan((row.refund_gmv / 100).toFixed(2), 2, false),
      },
      {
        label: '总退款比例',
        minWidth: 100,
        align: 'right',
        // sortable: 'custom',
        prop: 'refund_rate',
        headerAlign: 'right',
        formatter: (row: any) => formatEmpty(row.refund_rate, '%'),
      },
      /* {
        label: '实际销售额 (元)',
        minWidth: 144,
        sortable: 'custom',
        prop: 'gmv',
        align: 'right',
        headerAlign: 'right',
        formatter: (row: any) => formatPriceFormYuan((row.gmv / 100).toFixed(2), 2, false),
      },*/
    ],
  });
  const getData = async (payload: any) => {
    dataStruct.loading = true;
    try {
      const res: any = await GetProjectKolItemReport(payload, business_type.value);
      dataStruct.saleData = res.data.data.data || [];
      dataStruct.total = res.data.data.total || 0;
    } catch (error) {
      ctx.root.$message.error('查询失败');
    } finally {
      dataStruct.loading = false;
    }
  };
  const category_1 = ref<any[]>([]);
  const category_2 = ref([]);
  const category_3 = ref([]);
  const { business_type } = useProjectBaseInfo();
  // 分类-1级类目
  const getCategory_1 = async (
    payload: any,
    // category_id: any,
    // second_tiange_cat_id: number,
  ) => {
    // GetShopLiveQueryDouyinTiangeCategory
    const res = await GetProjectKolCategory(
      {
        ...payload,
      } as any,
      business_type.value,
    );
    if (!res.data.success) {
      Message.error(res.data.message);
      return;
    }
    category_1.value = res.data.data.map((item: any) => {
      return {
        label: item.cat_name,
        value: item.cat_id || item.id,
      };
    });
  };
  const getCategory_2 = async (payload: any) => {
    // GetShopLiveQueryDouyinTiangeCategory
    const res = await GetProjectKolCategory(
      {
        ...payload,
        is_from_project: payload.is_from_project || false,
      } as any,
      business_type.value,
    );
    if (!res.data.success) {
      Message.error(res.data.message);
      return;
    }
    category_2.value = res.data.data.map((item: any) => {
      return {
        label: item.cat_name,
        value: item.cat_id || item.id,
      };
    });
  };
  const getCategory_3 = async (payload: any) => {
    // GetShopLiveQueryDouyinTiangeCategory
    const res = await GetProjectKolCategory(
      {
        ...payload,
        is_from_project: payload.is_from_project || false,
      } as any,
      business_type.value,
    );
    if (!res.data.success) {
      Message.error(res.data.message);
      return;
    }
    category_3.value = res.data.data.map((item: any) => {
      return {
        label: item.cat_name,
        value: item.cat_id || item.id,
      };
    });
  };
  return {
    ...toRefs(dataStruct),
    getData,
    getCategory_1,
    getCategory_2,
    getCategory_3,
    category_1,
    category_2,
    category_3,
  };
};
