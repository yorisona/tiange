/*
 * @Author: 肖槿
 * @Date: 2021-12-01 13:46:32
 * @Description: ——
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-03-01 16:10:00
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\commodityAnalysis\use.tsx
 */
import { inject, watch, Ref, SetupContext, reactive, toRefs, ref, h } from '@vue/composition-api';
import { ITabProps, ItemReportParams, chartParams, hotGoods } from './types';
import {
  GetDouyinCategoryPieChart,
  GetDouyinOldCategoryPieChart,
  GetDouyinCategoryReport,
  GetDouyinCategoryTimeline,
  GetDouyinItemPieChart,
  GetDouyinItemReport,
  GetDouyinHotItemReport,
  GetDouyinItemTimeline,
} from '@/services/datacenter';
import { GetDouyinItemRoomReport, GetSystemShopLiveCategory } from '@/services/datacenter/shoplive';
import { TableColumn } from '@/types/vendor/column';
import hotImg from '@/assets/img/hot_goods.png';
import subHotImg from '@/assets/img/sub_hot_goods.png';
import { formatAmount } from '@/utils/string';
import emptyGoods from '@/assets/img/goods-empty.png';
type Col = TableColumn<hotGoods>;
import formatPriceForm from '@/utils/formatData';
import { useDialog } from '@/use/dialog';
import ImageView from '@/modules/datacenter/commodityAnalysis/detail/imageView/index.vue';
import { Message } from 'element-ui';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

const dialog = useDialog({
  component: ImageView,
  width: '700px',
  footer: false,
});
const { formatPriceFormYuan, formatEmpty, tranNumber } = formatPriceForm;

export const useSearch = (fn: (data: ITabProps) => void) => {
  const searchParams = inject<Ref<ITabProps>>('searchParams') as Ref<ITabProps>;

  const dispatchChange = (value: ITabProps) => {
    if (value.project_id !== undefined && value.start_date !== undefined) {
      fn(value);
    }
  };

  watch(
    () => searchParams.value,
    data => {
      if (data === undefined) return;
      dispatchChange(data);
    },
    { deep: true },
  );
  dispatchChange(searchParams.value);
};

// 商品分析-数据
export const useCommodityGoodsData = (ctx: SetupContext, fn?: any) => {
  // 抖音项目类目销售列表
  const category_report = ref<any>([]);
  const project = ref<any>();
  // 项目列表
  const project_report = ref<any>([]);
  // 项目列表分页
  const pagination = reactive({
    total: 0,
    page_num: 0,
  });

  const fixed = (num: number, noDecimal = false) => {
    if (num === null || num === undefined) return '--';
    return formatAmount(num, '', noDecimal);
  };
  // 查询类目
  const category_report_query = (props: any) => {
    const params = { ...props };
    params.start_date = props.start_date;
    params.end_date = props.end_date;
    return GetDouyinCategoryReport(params).then(res => {
      category_report.value = res.data.data.categories;
      project.value = res.data.data.project;
    });
  };
  const { business_type } = useProjectBaseInfo();
  // 查询项目
  const query_project = (params: ItemReportParams) => {
    return GetDouyinItemReport({ ...params, num: 20 }, business_type.value).then(res => {
      res.data.data.items = res.data.data.items.map((item: any) => {
        item.stock_num = item.stock_num === null ? '--' : `${fixed(item.stock_num, true)}`;
        item.watch_ucnt = item.watch_ucnt === null ? '--' : `${fixed(item.watch_ucnt, true)}`;
        item.total_sale_count =
          item.total_sale_count === null ? '--' : `${fixed(item.total_sale_count, true)}`;
        item.last_week_sale_count =
          item.last_week_sale_count === null ? '--' : `${fixed(item.last_week_sale_count, true)}`;
        item.shop_sale_count =
          item.shop_sale_count === null ? '--' : `${fixed(item.shop_sale_count, true)}`;
        item.sale_count = item.sale_count === null ? '--' : `${fixed(item.sale_count, true)}`;
        item.market_price = item.market_price === null ? '--' : `${fixed(item.market_price / 100)}`;
        item.shop_gmv = item.shop_gmv === null ? '--' : `${fixed(item.shop_gmv / 100)}`;
        item.shop_price = `${fixed(item.shop_price)}`;
        item.discount_price = `${fixed(item.discount_price / 100)}`;
        item.gmv = `${fixed(item.gmv / 100)}`;
        item.last_week_gmv = `${fixed(item.last_week_gmv / 100)}`;
        item.pay_rate = item.pay_rate === null ? '--' : `${item.pay_rate}%`;
        item.click_rate = item.click_rate === null ? '--' : `${item.click_rate}%`;
        return item;
      });
      pagination.total = res.data.data.total;
      pagination.page_num = params.page_num as number;
      execColumns(res.data.data.items);
    });
  };

  const columns = ref<TableColumn<any>[]>([]);

  // 计算列
  const execColumns = (list: any[]) => {
    const _data: any[] = [];
    if (list.length > 0 && list.length < 20) {
      const fill = new Array(20 - list.length).fill(1).map(() => ({ empty: true }));
      list.push(...fill);
    }
    const _columns: TableColumn<any>[] = new Array(list.length + 1).fill(1).map((_, colIndex) => {
      const config: TableColumn<any> = {
        label: `key_${colIndex}`,
        align: 'center',
        minWidth: 164,
        formatter(row, column, _, index) {
          const label = column.label as string;
          if (label === 'key_0') {
            return <span class="firstcolumn">{row[label]}</span>;
          }
          if (index === 0) {
            if (row[label] === undefined) return '';
            const rate = list[colIndex - 1].click_rate?.replace('%', '') * 1;
            const hot = h('img', {
              class: 'hot-img',
              attrs: {
                src: hotImg,
              },
            });
            const subHot = h('img', {
              class: 'hot-img',
              attrs: {
                src: subHotImg,
              },
            });
            return (
              <div class="goods-descript">
                <img
                  class="first-row-img"
                  src={row[label]}
                  onclick={() => {
                    dialog.show(row[label]);
                  }}
                />
                {rate >= 15 ? hot : rate >= 12 ? subHot : ''}
              </div>
            );
          } else if (index === 18) {
            if (row[label] === true) return '';
            return (
              <a
                onclick={() => {
                  fn && fn(list[colIndex - 1]);
                }}
              >
                查看
              </a>
            );
          } else if (index === 1) {
            return <span class="goods_code">{row[label]}</span>;
          } else if (index === 2) {
            return (
              <span class="goods_name" title={row[label]}>
                {row[label]}
              </span>
            );
          }
          return row[label];
        },
      };
      if (colIndex === 0) {
        delete config.minWidth;
        config.width = 130;
        config.fixed = 'left';
      }
      return config;
    });

    const titleKey = [
      ['商品主图', 'image_url'],
      ['商品编码', 'item_id'],
      ['商品名称', 'title'],
      ['商品类目', 'second_cname'],
      ['吊牌价 (元)', 'market_price'],
      ['平均销售价 (元)', 'shop_price'],
      ['讲解次数', 'talk_times'],
      ['直播销量', 'sale_count'],
      ['直播销售额 (元)', 'gmv'],
      ['店铺销量', 'shop_sale_count'],
      ['店铺销售额 (元)', 'shop_gmv'],
      ['曝光人数', 'watch_ucnt'],
      ['点击率', 'click_rate'],
      ['转化率', 'pay_rate'],
      ['上周销量', 'last_week_sale_count'],
      ['上周销售额 (元)', 'last_week_gmv'],
      ['累计销量', 'total_sale_count'],
      ['今日店铺库存', 'stock_num'],
      ['销售趋势', 'empty'],
    ];
    titleKey.forEach((it, idx) => {
      const tmp: any = {};
      tmp['key_0'] = it[0];
      const dataKey = it[1];
      if (idx === 17) {
        tmp['key_0'] = h('div', undefined, [
          '今日店铺库存',
          h(
            'el-tooltip',
            {
              class: 'item',
              attrs: {
                effect: 'light',
                content: '截止到今日凌晨库存',
                placement: 'top-start',
              },
            },
            [
              h('tg-icon', {
                attrs: {
                  name: 'ico-question',
                },
              }),
            ],
          ),
        ]);
      }
      list.forEach((it2, key) => {
        tmp[`key_${key + 1}`] = it2[dataKey] === null ? '--' : it2[dataKey];
      });
      _data.push(tmp);
    });

    columns.value = _columns;
    project_report.value = _data;
  };
  execColumns([]);

  return reactive({
    project,
    category_report,
    category_report_query,
    project_report,
    query_project,
    columns,
    pagination,
  });
};

// 趋势图 类目/商品
export const useTimeline = () => {
  const loading = ref(false);
  const visible = ref(false);
  const charts = ref<{
    data: any[];
    series: any[];
  }>({ data: [], series: [] });
  const title = ref('');
  const onClose = () => {
    visible.value = false;
  };
  // 查询分类趋势
  const queryCategory = (params: any) => {
    title.value = '类目近7天销售趋势';
    charts.value = { data: [], series: [] };
    visible.value = true;
    loading.value = true;

    GetDouyinCategoryTimeline(params).then(res => {
      const res_data: any[] = res.data.data;
      const date = res_data.map(it => it.date);
      charts.value = {
        data: date,
        series: [
          {
            smooth: true,
            showSymbol: true,
            type: 'line',
            name: '销量',
            data: res_data.map(it => it.sale_count),
          },
          {
            smooth: true,
            showSymbol: true,
            type: 'line',
            name: '点击率',
            yAxisIndex: 1,
            data: res_data.map(it => it.click_rate),
          },
          {
            smooth: true,
            showSymbol: true,
            type: 'line',
            name: '转化率',
            data: res_data.map(it => it.pay_rate),
          },
        ],
      };
      loading.value = false;
    });
  };
  const queryGoods = (params: any) => {
    title.value = '单品近7天销售趋势';
    charts.value = { data: [], series: [] };
    visible.value = true;
    loading.value = true;
    GetDouyinItemTimeline(params).then(res => {
      const res_data: any[] = res.data.data;
      const date = res_data.map(it => it.date);
      charts.value = {
        data: date,
        series: [
          {
            smooth: true,
            showSymbol: true,
            type: 'line',
            name: '销量',
            data: res_data.map(it => it.sale_count),
          },
          {
            smooth: true,
            showSymbol: true,
            type: 'line',
            name: '点击率',
            yAxisIndex: 1,
            data: res_data.map(it => it.click_rate),
          },
          {
            smooth: true,
            showSymbol: true,
            type: 'line',
            name: '转化率',
            data: res_data.map(it => it.pay_rate),
          },
        ],
      };
      loading.value = false;
    });
  };

  return reactive({ loading, visible, charts, queryCategory, onClose, queryGoods, title });
};

// 类目销售分析饼图
export const useCategoryPieChart = (ctx: SetupContext) => {
  const hasNewProject = inject('hasNewProject') as Ref<number>;
  const dataStruct = reactive({
    loading: false,
    gmvPieData: [],
    salePieData: [],
  });
  const getData = async (payload: chartParams) => {
    dataStruct.loading = true;
    try {
      const {
        data: {
          data: { gmv_pie_chart, sale_count_pie_chart },
        },
      } = await (hasNewProject.value === 1
        ? GetDouyinCategoryPieChart(payload)
        : GetDouyinOldCategoryPieChart(payload));

      // dataStruct.pieData = data;
      dataStruct.gmvPieData = gmv_pie_chart.map((item: any) => ({
        name: item.cat_name,
        value: (item.gmv / 100).toFixed(2),
      }));
      dataStruct.salePieData = sale_count_pie_chart.map((item: any) => ({
        name: item.cat_name,
        value: item.sale_count,
      }));
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
  const getData = async (payload: chartParams) => {
    dataStruct.loading = true;
    try {
      const {
        data: {
          data: { pie_chart },
        },
      } = await GetDouyinItemPieChart(payload);
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

// 商品信息列表
export const useSaleGoodsTop = (ctx: SetupContext) => {
  const dataStruct = reactive({
    loading: false,
    saleData: [],
    total: 0,
    hotGoodsColumn: [
      {
        label: '商品信息',
        width: 268,
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
              }),
              h(
                'div',
                {
                  class: 'info-row',
                },
                [
                  h(
                    'div',
                    {
                      class: 'goods-title',
                    },
                    row.title,
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
        width: 204,
        align: 'center',
        headerAlign: 'center',
        formatter: (row: any) => formatEmpty(row.item_id),
      },
      {
        label: '类目',
        minWidth: 174,
        align: 'left',
        headerAlign: 'left',
        formatter: (row: any) => formatEmpty(row.second_cname),
      },
      {
        label: '讲解次数',
        width: 122,
        sortable: 'custom',
        prop: 'talk_times',
        align: 'right',
        headerAlign: 'right',
        formatter: (row: any) => formatEmpty(row.talk_times),
      },
      {
        label: '曝光人数',
        width: 122,
        align: 'right',
        sortable: 'custom',
        prop: 'watch_ucnt',
        headerAlign: 'right',
        formatter: (row: any) => tranNumber(row.watch_ucnt),
      },
      {
        label: '点击人数',
        minWidth: 122,
        align: 'right',
        sortable: 'custom',
        prop: 'click_ucnt',
        headerAlign: 'right',
        formatter: (row: any) => tranNumber(row.click_ucnt),
      },
      {
        label: '点击率',
        minWidth: 126,
        align: 'right',
        sortable: 'custom',
        prop: 'click_rate',
        headerAlign: 'right',
        formatter: (row: any) => formatEmpty(row.click_rate, '%'),
      },
      {
        label: '订单数',
        minWidth: 122,
        sortable: 'custom',
        prop: 'order_cnt',
        align: 'right',
        headerAlign: 'right',
        formatter: (row: any) => tranNumber(row.order_cnt),
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
        prop: 'gmv',
        headerAlign: 'right',
        formatter: (row: any) => formatEmpty(row.gmv_part, '%'),
      },
      {
        label: '成交转化率',
        minWidth: 144,
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
      //   label: '退款金额',
      //   minWidth: 134,
      //   align: 'right',
      //   sortable: 'custom',
      //   prop: 'refund_gmv',
      //   headerAlign: 'right',
      //   formatter: (row: any) => formatPriceFormYuan((row.refund_gmv / 100).toFixed(2),2,false),
      // },
      {
        label: '实际销售额 (元)',
        minWidth: 144,
        sortable: 'custom',
        prop: 'gmv',
        align: 'right',
        headerAlign: 'right',
        formatter: (row: any) => formatPriceFormYuan((row.gmv / 100).toFixed(2), 2, false),
      },
      // {
      //   label: '退款率',
      //   minWidth: 126,
      //   align: 'right',
      //   sortable: 'custom',
      //   prop: 'refund_rate',
      //   headerAlign: 'right',
      //   formatter: (row: any) => formatEmpty(row.refund_rate, '%'),
      // },
    ],
  });
  const { business_type } = useProjectBaseInfo();
  const getData = async (payload: ItemReportParams) => {
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
  return {
    ...toRefs(dataStruct),
    getData,
  };
};

// 商品信息列表-品牌中心
export const useSaleGoodsShopLiveTop = () => {
  const dataStruct = reactive({
    loading: false,
    saleData: [],
    total: 0,
    hotGoodsColumn: [
      {
        label: '商品信息',
        width: 268,
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
                    'div',
                    {
                      class: 'goods-title',
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
                    },
                    row.title,
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
      /* {
        label: '商品编号',
        width: 204,
        align: 'center',
        headerAlign: 'center',
        formatter: (row: any) => formatEmpty(row.item_id),
      },*/
      {
        label: '类目',
        minWidth: 134,
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
        minWidth: 124,
        align: 'right',
        sortable: 'custom',
        prop: 'gmv',
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
        minWidth: 135,
        align: 'right',
        sortable: 'custom',
        prop: 'shop_sale_price_avg',
        headerAlign: 'right',
        formatter: (row: any) =>
          formatPriceFormYuan((row.shop_sale_price_avg / 100).toFixed(2), 2, false),
      },
      {
        label: '平均折扣率 ',
        minWidth: 135,
        align: 'right',
        sortable: 'custom',
        prop: 'shop_sale_price_avg_rate',
        headerAlign: 'right',
        formatter: (row: any) => formatEmpty(row.shop_sale_price_avg_rate, '%'),
      },
      {
        label: '讲解次数',
        width: 102,
        sortable: 'custom',
        prop: 'talk_times',
        align: 'right',
        headerAlign: 'right',
        formatter: (row: any) => formatEmpty(row.talk_times),
      },
      {
        label: '发货前退款金额 (元)',
        minWidth: 164,
        align: 'right',
        sortable: 'custom',
        prop: 'shop_refund_status21_gmv',
        headerAlign: 'right',
        formatter: (row: any) =>
          formatPriceFormYuan((row.shop_refund_status21_gmv / 100).toFixed(2), 2, false),
      },
      {
        label: '发货前退款比例',
        minWidth: 164,
        align: 'right',
        sortable: 'custom',
        prop: 'shop_refund_status21_gmv_rate',
        headerAlign: 'right',
        formatter: (row: any) => formatEmpty(row.shop_refund_status21_gmv_rate, '%'),
      },
      {
        label: '总退款金额 (元)',
        minWidth: 134,
        align: 'right',
        sortable: 'custom',
        prop: 'shop_refund_gmv',
        headerAlign: 'right',
        formatter: (row: any) =>
          formatPriceFormYuan((row.shop_refund_gmv / 100).toFixed(2), 2, false),
      },
      {
        label: '总退款比例',
        minWidth: 124,
        align: 'right',
        sortable: 'custom',
        prop: 'shop_refund_gmv_rate',
        headerAlign: 'right',
        formatter: (row: any) => formatEmpty(row.shop_refund_gmv_rate, '%'),
      },
    ],
  });
  const { business_type } = useProjectBaseInfo();

  const getData = async (payload: any) => {
    dataStruct.loading = true;
    const res: any = await GetDouyinItemRoomReport(payload, business_type.value);
    dataStruct.loading = false;
    if (res.data.success) {
      dataStruct.saleData = res.data.data.items || [];
      dataStruct.total = res.data.data.total || 0;
    }
  };
  const category_2 = ref([]);
  const category_3 = ref([]);
  const getCategory_2 = async (payload: any) => {
    // GetShopLiveQueryDouyinTiangeCategory
    const res = await GetSystemShopLiveCategory(
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
    const res = await GetSystemShopLiveCategory(
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
    getCategory_3,
    getCategory_2,
    category_2,
    category_3,
  };
};
// 价格带销售分析饼图
export const useHotItemReport = (ctx: SetupContext) => {
  const dataStruct = reactive({
    loading: false,
    saleData: [] as hotGoods[],
    hotGoodsColumn: [
      {
        label: '爆款商品',
        minWidth: 128,
        align: 'left',
        headerAlign: 'left',
        prop: 'title',
      },
      {
        label: '销售额 (元)',
        minWidth: 98,
        align: 'right',
        headerAlign: 'right',
        formatter: (row: hotGoods) => formatPriceFormYuan((row.gmv / 100).toFixed(2), 2, false),
      },
      {
        label: '销售额占比',
        minWidth: 94,
        align: 'right',
        headerAlign: 'right',
        formatter: (row: hotGoods) => row.gmv_part + '%',
      },
      {
        label: '销量',
        minWidth: 79,
        align: 'right',
        headerAlign: 'right',
        formatter: (row: hotGoods) => formatPriceFormYuan(row.sale_count, 2, false),
      },
      {
        label: '销量占比',
        minWidth: 80,
        align: 'center',
        headerAlign: 'center',
        formatter: (row: hotGoods) => row.sale_count_part + '%',
      },
    ] as Col[],
  });
  const getData = async (payload: any) => {
    dataStruct.loading = true;
    try {
      const {
        data: { data },
      } = await GetDouyinHotItemReport(payload);
      dataStruct.saleData = [];
      data.top3 && dataStruct.saleData.push({ ...data.top3, title: '前3款爆款商品' });
      data.top10 && dataStruct.saleData.push({ ...data.top10, title: '前10款爆款商品' });
      data.top20 && dataStruct.saleData.push({ ...data.top20, title: '前20款爆款商品' });
      data.top30 && dataStruct.saleData.push({ ...data.top30, title: '前30款爆款商品' });
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
