/*
 * @Author: 肖槿
 * @Date: 2022-02-18 14:09:25
 * @Description:商品大盘分析use
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-02-23 18:59:23
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\marketAnalysis\use.ts
 */
import { SetupContext, reactive, toRefs, h, ref } from '@vue/composition-api';
import {
  GetDouyinCompositeCategories,
  GetDouyinCategoryImage,
  GetDouyinCategoryImageDetail,
} from '@/services/datacenter';
// import { BusinessType } from '@/const/common';
import { getToken } from '@/utils/token';
import { TableColumn } from '@/types/vendor/column';
import qs from 'query-string';
import {
  douyinCategory,
  echartsAge,
  echartsPrice,
  echartsRegion,
} from '@/modules/datacenter/marketAnalysis/types';
import moment from 'moment';
import formatPriceForm from '@/utils/formatData';
import { numberFormat } from '@/utils/formatMoney';
// 导出列表
export function ExportList(params: Record<string, any>, url: string) {
  const _paramsstr = qs.stringify(params);
  const token = getToken();
  window.open(`${process.env.VUE_APP_BASE_API}${url}?${_paramsstr}&Authorization=${token}`);
}

const { formatPriceToThousand } = formatPriceForm;
interface category {
  cat_id: string;
  cat_name: string;
}
interface analysisData extends category {
  gmv: number | null;
  gmv_balance: number | null;
  last_week_gmv: number | null;
  last_week_sale_count: number | null;
  last_week_watch_count: number | null;
  sale_count: number | null;
  sale_count_balance: number | null;
  watch_count: number | null;
  watch_count_balance: number | null;
}

const areaColumn = <any>[
  {
    label: '名称',
    align: 'left',
    headerAlign: 'left',
    formatter(col: any) {
      return col.name;
    },
  },
  {
    label: '占比',
    align: 'center',
    headerAlign: 'center',
    width: 200,
    formatter(col: any) {
      return col.ratio + '%';
    },
  },
];
export const useMarket = (ctx: SetupContext) => {
  const preWeek = moment().weekday(-7).format('YYYY-MM-DD');
  const dateType = ref(1);
  type Col = TableColumn<analysisData> & { dataType?: any };
  const categoryColumn = <Col[]>[
    {
      label: '类目',
      align: 'left',
      headerAlign: 'center',
      minWidth: 160,
      formatter: (col: analysisData, column: any, cellValue: any, idx: number) => {
        if (idx === 0) {
          return h('div', undefined, [
            h('tg-icon', {
              props: { name: 'ico-menu-arrow-down' },
              style: 'margin-right: 4px;',
            }),
            col.cat_name,
          ]);
        }
        return col.cat_name;
      },
    },
    {
      label: '销售额 (元)',
      align: 'right',
      headerAlign: 'center',
      minWidth: 206,
      formatter: (col: analysisData) => {
        if (col.gmv !== null) {
          return h('div', undefined, [
            formatPriceToThousand(col.gmv, 2, false),
            h(
              'span',
              {
                class:
                  col.gmv_balance === null || col.gmv_balance > 0
                    ? 'red-mint label'
                    : 'green-mint label',
              },
              [
                h('tg-icon', {
                  props: {
                    name:
                      col.gmv_balance === null || col.gmv_balance > 0
                        ? 'ico-icon_tongyong_shangsheng_16_red'
                        : 'ico-icon_tongyong_xiajiang_16_green',
                  },
                  style: 'margin-left: 13px;margin-right: 50px;',
                }),
                col.gmv_balance ? (col.gmv_balance + '%').replace('-', '') : '0%',
              ],
            ),
          ]);
        } else {
          return '--';
        }
      },
    },
    {
      label: '销售量',
      align: 'right',
      headerAlign: 'center',
      minWidth: 206,
      formatter: (col: analysisData) => {
        if (col.sale_count !== null) {
          return h('div', undefined, [
            numberFormat(Number(col.sale_count), 0, '.', ',') + '',
            h(
              'span',
              {
                class:
                  col.sale_count_balance === null || col.sale_count_balance > 0
                    ? 'red-mint label'
                    : 'green-mint label',
              },
              [
                h('tg-icon', {
                  props: {
                    name:
                      col.sale_count_balance === null || col.sale_count_balance > 0
                        ? 'ico-icon_tongyong_shangsheng_16_red'
                        : 'ico-icon_tongyong_xiajiang_16_green',
                  },
                  style: 'margin-left: 13px;margin-right: 50px;',
                }),
                col.sale_count_balance ? (col.sale_count_balance + '%').replace('-', '') : '0%',
              ],
            ),
          ]);
        } else {
          return '--';
        }
      },
    },
    {
      label: '浏览量',
      align: 'right',
      headerAlign: 'center',
      minWidth: 206,
      formatter: (col: analysisData) => {
        if (col.watch_count !== null) {
          return h('div', undefined, [
            numberFormat(Number(col.watch_count), 0, '.', ',') + '',
            h(
              'span',
              {
                class:
                  col.watch_count_balance === null || col.watch_count_balance > 0
                    ? 'red-mint label'
                    : 'green-mint label',
              },
              [
                h('tg-icon', {
                  props: {
                    name:
                      col.watch_count_balance === null || col.watch_count_balance > 0
                        ? 'ico-icon_tongyong_shangsheng_16_red'
                        : 'ico-icon_tongyong_xiajiang_16_green',
                  },
                  style: 'margin-left: 13px;margin-right: 50px;',
                }),
                col.watch_count_balance ? (col.watch_count_balance + '%').replace('-', '') : '0%',
              ],
            ),
          ]);
        } else {
          return '--';
        }
      },
    },
    {
      renderHeader: () => {
        return dateType.value === 1 ? '上周销售额 (元)' : '上月销售额 (元)';
      },
      align: 'right',
      headerAlign: 'center',
      minWidth: 140,
      formatter: (col: analysisData) => {
        return h(
          'div',
          {
            style: 'margin-right: 30px;',
          },
          col.last_week_gmv !== null ? formatPriceToThousand(col.last_week_gmv, 2, false) : '--',
        );
      },
    },
    {
      renderHeader: () => {
        return dateType.value === 1 ? '上周销售量' : '上月销售量';
      },
      align: 'right',
      headerAlign: 'center',
      minWidth: 140,
      formatter(col) {
        return h(
          'div',
          {
            style: 'margin-right: 30px;',
          },
          col.last_week_sale_count !== null
            ? String(numberFormat(Number(col.last_week_sale_count), 0, '.', ','))
            : '--',
        );
      },
    },
    {
      renderHeader: () => {
        return dateType.value === 1 ? '上周浏览量' : '上月浏览量';
      },
      align: 'right',
      headerAlign: 'center',
      minWidth: 140,
      formatter(col) {
        return h(
          'div',
          {
            style: 'margin-right: 24px;',
          },
          col.last_week_watch_count !== null
            ? String(numberFormat(Number(col.last_week_watch_count), 0, '.', ','))
            : '--',
        );
      },
    },
  ];
  const paramsStruct = reactive<{
    loading: boolean;
    echartsLoading: boolean;
    categoryParams: douyinCategory;
    categoryList: category[];
    analysisData: analysisData[];
    echartsAgeList: echartsAge[];
    echartsPriceList: echartsPrice[];
    echartsRegionList: echartsRegion[];
    baseOptions: any;
  }>({
    loading: false,
    echartsLoading: false,
    categoryParams: {
      cat_id: '20005',
      date: preWeek,
      search_type: 1,
    },
    categoryList: [],
    analysisData: [],
    echartsAgeList: [],
    echartsPriceList: [],
    echartsRegionList: [],
    baseOptions: {
      xAxis: {
        type: 'category',
        data: [],
        axisLine: {
          lineStyle: {
            color: '#a4b2c2',
          },
        },
        axisLabel: {
          color: '#627b92',
        },
      },
      yAxis: {
        type: 'value',
        name: '年龄占比(%)',
        nameTextStyle: {
          color: '#6a7b92',
        },
        splitLine: {
          show: false,
          lineStyle: {
            type: 'dashed',
            color: '#6a7b92',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#a4b2c2',
          },
        },
        axisLabel: {
          color: '#627b92',
        },
      },
      series: [
        {
          data: [],
          type: 'bar',
          showBackground: true,
          barWidth: 28,
          itemStyle: {
            color: '#FBCE63',
          },
          backgroundStyle: {
            color: 'rgba(251, 206, 99, 0.1)',
          },
          label: {
            show: true,
            position: 'top',
            color: 'var(--text-color)',
            formatter: (item: any) => item.value + '%',
          },
        },
      ],
      grid: {
        left: '30',
        right: '30',
        bottom: '23',
        top: '40',
        containLabel: true,
      },
    },
  });
  const getCategory = async () => {
    try {
      const {
        data: { data },
      } = await GetDouyinCompositeCategories();
      paramsStruct.categoryList = data;
    } catch (error) {
      ctx.root.$message.error('查询类目失败');
    }
  };
  const getTableData = async (payload: douyinCategory) => {
    dateType.value = payload.search_type ? payload.search_type : 1;
    paramsStruct.loading = true;
    try {
      const {
        data: { data },
      } = await GetDouyinCategoryImage(payload);
      paramsStruct.analysisData = data;
    } catch (error) {
      ctx.root.$message.error('查询类目失败');
    } finally {
      paramsStruct.loading = false;
    }
  };
  const getEchartsData = async (payload: douyinCategory) => {
    // GetDouyinCategoryImageDetail
    paramsStruct.echartsLoading = true;
    try {
      const {
        data: { data },
      } = await GetDouyinCategoryImageDetail(payload);
      const maxPrice = Math.max(...data.price.map((item: echartsPrice) => item.ratio));
      paramsStruct.echartsAgeList = data.age;
      paramsStruct.echartsPriceList = data.price.map((item: echartsPrice) => ({
        ratio: item.ratio,
        value: (item.ratio / maxPrice) * 100,
        interval: item.interval,
      }));
      paramsStruct.echartsRegionList = data.region;
      paramsStruct.baseOptions.xAxis.data = data.age.map((item: echartsAge) => item.name);
      paramsStruct.baseOptions.series[0].data = data.age.map((item: echartsAge) => item.ratio);
    } catch (error) {
      ctx.root.$message.error('查询类目失败');
    } finally {
      paramsStruct.echartsLoading = false;
    }
    return Promise.resolve();
  };
  return {
    ...toRefs(paramsStruct),
    getCategory,
    getTableData,
    getEchartsData,
    categoryColumn,
    areaColumn,
  };
};
