/*
 * @Author: 肖槿
 * @Date: 2022-01-06 14:58:46
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-03-30 13:39:52
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\competitor\use.ts
 */
import { SetupContext, reactive, toRefs, h, ref } from '@vue/composition-api';
import {
  competitorCategoryParams,
  categoryItem,
  summaryItem,
  dateAndCateDouyinCompetitiveParams,
} from './types';
import { TableColumn, TgTableColumn } from '@/types/vendor/column';
import {
  GetDouyinCompetitiveCategory,
  GetCompetitiveShops,
  GetDateCompetitiveItem,
  GetCategoryCompetitiveItem,
  GetCompetitiveTimeline,
} from '@/services/datacenter';
import formatPriceForm from '@/utils/formatData';
import { numberFormat } from '@/utils/formatMoney';
const { formatPriceFormYuan } = formatPriceForm;
import qs from 'query-string';
import { getToken } from '@/utils/token';
import moment from 'moment';
import emptyGoods from '@/assets/img/goods-empty.png';
import { CompeteShopStyle } from '@/const/datacenter';
import { get_limited_length_string } from '@/utils/string';
import { ObjectFilterEmpty } from '@/utils/func';
type Col = TgTableColumn<categoryItem>;
type SummaryCol = TableColumn<summaryItem>;
// 导出列表
export function ExportList(params: Record<string, any>, url: string) {
  const _paramsstr = qs.stringify(ObjectFilterEmpty(params));
  const token = getToken();
  window.open(`${process.env.VUE_APP_BASE_API}${url}?${_paramsstr}&Authorization=${token}`);
}

export const getCategoryColumn = (showSort: boolean) => {
  const categoryColumn: Col[] = [
    {
      label: '竞品店铺风格',
      prop: 'style',
      width: 160,
      formatter: col => {
        switch (col.style) {
          case CompeteShopStyle.QuickFashion:
            return '快时尚';
          case CompeteShopStyle.LightLuxury:
            return '轻奢';
          case CompeteShopStyle.Sports:
            return '运动';
          case CompeteShopStyle.Other:
            return '其他';
          default:
            return '未知分类';
        }
      },
    },
    {
      label: '类目',
      prop: 'item_cat',
      minWidth: 220,
      formatter: col => {
        if (!col.item_cat || col.item_cat.length < 16) {
          return col.item_cat || '--';
        }
        const { folded_text } = get_limited_length_string(col.item_cat, 15);
        return h('el-popover', {
          props: {
            placement: 'top',
            trigger: 'hover',
            effect: 'light',
            content: col.item_cat,
          },
          scopedSlots: {
            reference: () => {
              return h('span', {}, folded_text);
            },
          },
        });
      },
    },
    {
      label: '销售额 (元)',
      prop: 'gmv',
      align: 'right',
      minWidth: 160,
      headerAlign: 'right',
      sortable: showSort ? 'custom' : false,
      formatter: col => {
        return col.gmv_str;
      },
    },
    {
      label: '销量',
      prop: 'sale_count',
      align: 'right',
      minWidth: 120,
      headerAlign: 'right',
      sortable: showSort ? 'custom' : false,
      formatter: col => {
        return col.sale_count_str;
      },
    },
    {
      label: '浏览量',
      prop: 'watch_count_str',
      align: 'right',
      minWidth: 120,
      headerAlign: 'right',
      sortable: showSort ? 'custom' : false,
      formatter: col => {
        return col.watch_count_str;
      },
    },
    {
      label: '转化率',
      prop: 'pay_rate_str',
      align: 'right',
      minWidth: 120,
      headerAlign: 'right',
      sortable: showSort ? 'custom' : false,
      // dataType: {
      //   suffix: '%',
      //   empty: false,
      // },
    },
  ];
  return categoryColumn;
};
export const getSummaryColumn = (showSort: boolean, click: (...args: any) => void) => {
  const summaryColumn: SummaryCol[] = [
    {
      label: '商品信息',
      minWidth: 280,
      formatter: col => {
        return h(
          'div',
          {
            class: 'competitor-goods-info',
          },
          [
            h(
              'el-image',
              {
                attrs: {
                  src: col.item_image,
                  fit: 'contain',
                },
                style: {
                  cursor: 'pointer',
                },
                on: {
                  click: function () {
                    window.open(
                      'https://haohuo.jinritemai.com/views/product/item2?id=' + col.item_id,
                    );
                  },
                },
                class: 'goods-image',
              },
              [
                h('img', {
                  slot: 'error',
                  attrs: {
                    style: 'width: 100%;height: 100%;',
                    src: emptyGoods,
                  },
                }),
              ],
            ),
            h(
              'div',
              {
                class: 'goods-info',
              },
              [
                h('p', undefined, col.item_id),
                h(
                  'el-tooltip',
                  {
                    attrs: {
                      effect: 'light',
                      content: col.item_title,
                      placement: 'top-start',
                    },
                  },
                  [
                    h(
                      'div',
                      {
                        attrs: {
                          title: col.item_title,
                        },
                        class: 'goods-name two-omit-item',
                      },
                      [
                        h(
                          'a',
                          {
                            attrs: {
                              target: '_blank',
                              href:
                                'https://haohuo.jinritemai.com/views/product/item2?id=' +
                                col.item_id,
                            },
                          },
                          col.item_title,
                        ),
                      ],
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
      label: '所属类目',
      prop: 'item_cat',
      minWidth: 134,
      align: 'center',
      headerAlign: 'center',
    },
    {
      label: '销量',
      minWidth: 134,
      align: 'right',
      headerAlign: 'right',
      sortable: showSort ? 'custom' : false,
      prop: 'sale_count',
      formatter(col) {
        return col.sale_count !== null ? numberFormat(Number(col.sale_count), 0, '.', ',') : '--';
      },
    },
    {
      label: '销售额 (元)',
      minWidth: 134,
      align: 'right',
      headerAlign: 'right',
      sortable: showSort ? 'custom' : false,
      prop: 'gmv',
      formatter(col) {
        return col.gmv !== null ? formatPriceFormYuan(col.gmv, 2, false) : '--';
      },
    },
    {
      label: '浏览量',
      minWidth: 134,
      align: 'right',
      headerAlign: 'right',
      prop: 'watch_count',
      sortable: showSort ? 'custom' : false,
      formatter(col) {
        return col.watch_count !== null ? numberFormat(Number(col.watch_count), 0, '.', ',') : '--';
      },
    },
    {
      label: '转化率',
      align: 'center',
      minWidth: 98,
      headerAlign: 'center',
      sortable: showSort ? 'custom' : false,
      prop: 'pay_rate',
      formatter(col) {
        return col.pay_rate !== null ? col.pay_rate + '%' : '--';
      },
    },
    {
      label: '吊牌价 (元)',
      align: 'right',
      minWidth: 110,
      headerAlign: 'right',
      sortable: showSort ? 'custom' : false,
      prop: 'market_price',
      formatter(col) {
        return col.market_price !== null ? formatPriceFormYuan(col.market_price, 2, false) : '--';
      },
    },
    {
      label: '销售价 (元)',
      align: 'right',
      minWidth: 110,
      headerAlign: 'right',
      sortable: showSort ? 'custom' : false,
      prop: 'discount_price',
      formatter(col) {
        return col.discount_price !== null
          ? formatPriceFormYuan(col.discount_price, 2, false)
          : '--';
      },
    },
    {
      label: '销售趋势',
      minWidth: 134,
      align: 'center',
      headerAlign: 'center',
      formatter(col): any {
        return h(
          'a',
          {
            class: 'trend',
            on: {
              click: () => click(col),
            },
          },
          '查看',
        );
      },
    },
  ];
  return summaryColumn;
};
export const summaryColumnByDate: SummaryCol[] = [
  {
    label: '商品信息',
    minWidth: 270,
    formatter: col => {
      return h(
        'div',
        {
          class: 'competitor-goods-info',
        },
        [
          h('el-image', {
            attrs: {
              src: col.item_image,
              fit: 'contain',
            },
            class: 'goods-image',
          }),
          h(
            'div',
            {
              class: 'goods-info',
            },
            [
              h('p', undefined, col.item_id),
              h(
                'el-tooltip',
                {
                  attrs: {
                    effect: 'light',
                    content: col.item_title,
                    placement: 'top-start',
                  },
                },
                [
                  h(
                    'div',
                    {
                      attrs: {
                        title: col.item_title,
                      },
                      class: 'goods-name two-omit-item',
                    },
                    col.item_title,
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
    label: '所属类目',
    prop: 'item_cat',
    minWidth: 134,
    align: 'center',
    headerAlign: 'center',
  },
  {
    label: '日期',
    minWidth: 134,
    prop: 'date',
    align: 'center',
    headerAlign: 'center',
  },
  {
    label: '销量',
    minWidth: 134,
    align: 'right',
    headerAlign: 'right',
    prop: 'sale_count',
    sortable: 'custom',
    formatter(col) {
      return col.sale_count !== null ? numberFormat(Number(col.sale_count), 0, '.', ',') : '--';
    },
  },
  {
    label: '销售额 (元)',
    minWidth: 134,
    align: 'right',
    headerAlign: 'right',
    prop: 'gmv',
    sortable: 'custom',
    formatter(col) {
      return col.gmv !== null ? formatPriceFormYuan(col.gmv, 2, false) : '--';
    },
  },
  {
    label: '浏览量',
    minWidth: 134,
    align: 'right',
    headerAlign: 'right',
    prop: 'watch_count',
    sortable: 'custom',
    formatter(col) {
      return col.watch_count !== null ? numberFormat(Number(col.watch_count), 0, '.', ',') : '--';
    },
  },
  {
    label: '转化率',
    align: 'center',
    minWidth: 88,
    headerAlign: 'center',
    sortable: 'custom',
    prop: 'pay_rate',
    formatter(col) {
      return col.pay_rate !== null ? col.pay_rate + '%' : '--';
    },
  },
  {
    label: '吊牌价 (元)',
    align: 'right',
    minWidth: 110,
    headerAlign: 'right',
    sortable: 'custom',
    prop: 'market_price',
    formatter(col) {
      return col.market_price !== null ? formatPriceFormYuan(col.market_price, 2, false) : '--';
    },
  },
  {
    label: '销售价 (元)',
    align: 'right',
    minWidth: 110,
    headerAlign: 'right',
    sortable: 'custom',
    prop: 'discount_price',
    formatter(col) {
      return col.discount_price !== null ? formatPriceFormYuan(col.discount_price, 2, false) : '--';
    },
  },
];
export const useSummary = (ctx: SetupContext) => {
  const paramsStruct = reactive<{
    loading: boolean;
    cummaryParams: dateAndCateDouyinCompetitiveParams;
    summaryData: summaryItem[];
    summaryTotal: number;
  }>({
    loading: false,
    cummaryParams: {
      shop_name: undefined,
      start_date: undefined,
      end_date: undefined,
      third_cat_id: undefined,
      page_num: 1,
      num: 10,
      sort: undefined,
    },
    summaryTotal: 0,
    summaryData: [],
  });
  const getData = async (payload: dateAndCateDouyinCompetitiveParams, type: number) => {
    const obj: dateAndCateDouyinCompetitiveParams = { ...payload };
    obj.shop_name = obj.shop_name === '全部' ? undefined : obj.shop_name;
    paramsStruct.loading = true;
    const func = type === 1 ? GetCategoryCompetitiveItem : GetDateCompetitiveItem;
    try {
      const {
        data: { data },
      } = await func(obj);
      paramsStruct.summaryData = data.list;
      paramsStruct.summaryTotal = data.total;
    } catch (error) {
      console.error(error);
      ctx.root.$message.error('查询失败');
    } finally {
      paramsStruct.loading = false;
    }
  };
  return {
    ...toRefs(paramsStruct),
    getData,
  };
};
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
    title.value = '抖音销量/浏览量趋势';
    charts.value = { data: [], series: [] };
    visible.value = true;
    loading.value = true;

    GetCompetitiveTimeline(params).then(res => {
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
            name: '浏览量',
            yAxisIndex: 1,
            data: res_data.map(it => it.watch_count),
          },
        ],
      };
      loading.value = false;
    });
  };

  return reactive({ loading, visible, charts, queryCategory, onClose, title });
};

export const useCategory = (ctx: SetupContext) => {
  const _start = moment().add(-30, 'days').format('YYYY-MM-DD');
  const _end = moment().format('YYYY-MM-DD');
  const paramsStruct = reactive<{
    loading: boolean;
    categoryParams: competitorCategoryParams;
    categoryData: categoryItem[];
    shopList: { shop_name: string; style: number }[];
    total_gmv: number;
    total_sale_count: number;
  }>({
    loading: false,
    categoryParams: {
      shop_name: undefined,
      start_date: _start,
      end_date: _end,
      style: undefined,
    },
    categoryData: [],
    shopList: [],
    total_gmv: 0,
    total_sale_count: 0,
  });
  const getData = async (payload: competitorCategoryParams) => {
    const obj: competitorCategoryParams = { ...payload };
    // obj.shop_name = obj.shop_name === '全部' ? undefined : obj.shop_name;
    paramsStruct.loading = true;
    try {
      const {
        data: { data },
      } = await GetDouyinCompetitiveCategory(obj);
      data.list.forEach((item: categoryItem) => {
        item.pay_rate_str = item.pay_rate !== null ? `${item.pay_rate}%` : '--';
        item.gmv_str =
          item.gmv !== undefined && item.gmv !== null
            ? formatPriceFormYuan(item.gmv, 2, false)
            : '--';
        item.sale_count_str =
          item.sale_count !== null ? numberFormat(Number(item.sale_count), 0, '.', ',') : '--';
        item.watch_count_str =
          item.watch_count !== null ? numberFormat(Number(item.watch_count), 0, '.', ',') : '--';
      });
      paramsStruct.total_gmv = data.total_gmv;
      paramsStruct.total_sale_count = data.total_sale_count;
      paramsStruct.categoryData = data.list;
    } catch (error) {
      ctx.root.$message.error('查询失败');
    } finally {
      paramsStruct.loading = false;
    }
  };
  const getShopData = async () => {
    try {
      const {
        data: { data },
      } = await GetCompetitiveShops();
      paramsStruct.shopList = [...data];
    } catch (error) {
      ctx.root.$message.error('查询失败');
    }
  };
  return {
    ...toRefs(paramsStruct),
    getData,
    getShopData,
  };
};
