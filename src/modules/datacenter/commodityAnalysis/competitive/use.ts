import { SetupContext, h, reactive, toRefs } from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';
import formatPriceForm from '@/utils/formatData';
import { numberFormat } from '@/utils/formatMoney';
const { formatPriceToThousand } = formatPriceForm;
import { GetCompetitiveAnalysis, GetCompetitiveAnalysisDetail } from '@/services/datacenter';
import {
  CompetitiveParams,
  CompetitiveAnalysisDetail,
} from '@/modules/datacenter/commodityAnalysis/types';

interface analysisItem {
  id: number;
  category_name: string;
  gmv: number | null;
  sale_count: number | null;
  sale_gmv_rate: number | null;
  gmv_analysis: number | null;
  sale_gmv_rate_analysis: number | null;
  sale_count_analysis: number | null;
  sale_count_rate: number | null;
  sale_count_rate_analysis: number | null;
  sale_count_rate_diff: number | null;
  sale_gmv_rate_diff: number | null;
  // 销售额对比
  gmv_contrast: number | null;
  // 销量对比
  sale_count_contrast: number | null;
}

export interface analysisTopItem {
  rank?: number | null; //排行
  discount_price: number | string | null; // 折扣价格/分
  item_id: number | string | null; //商品ID
  item_image: number | string | null; // 商品头图
  item_title: number | string | null; // 标题
  market_price: number | string | null; // 吊牌价/分
  pay_rate: number | string | null; // 转化率
  project_id: number | string | null; //项目ID
  shop_avg_price: number | string | null; // 店铺平均价/分
  shop_gmv: number | string | null; // 店铺销售额
  shop_sale_count: number | string | null; //店铺销量
  watch_count: number | string | null; //观看量
  year?: string | null;
  season?: string | null;
  refund_rate?: number | string | null; //退货率
}

interface analysisData extends analysisItem {
  children: analysisItem[];
}

type Col = TableColumn<analysisData> & { dataType?: any };

const listColumn = <Col[]>[
  {
    label: '类目',
    align: 'left',
    headerAlign: 'center',
    width: 180,
    formatter: (col: analysisData) => {
      return col.category_name;
    },
  },
  {
    label: '项目销售额 (元)',
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
                col.sale_gmv_rate === null || col.sale_gmv_rate > 0
                  ? 'red-mint label'
                  : 'green-mint label',
            },
            [
              h('tg-icon', {
                props: {
                  name:
                    col.sale_gmv_rate === null || col.sale_gmv_rate > 0
                      ? 'ico-icon_tongyong_shangsheng_16_red'
                      : 'ico-icon_tongyong_xiajiang_16_green',
                },
                style: 'margin-left: 13px;margin-right: 50px;',
              }),
              col.sale_gmv_rate ? (col.sale_gmv_rate + '%').replace('-', '') : '0%',
            ],
          ),
        ]);
      } else {
        return h('div', { style: 'text-align:center' }, '--');
      }
    },
  },
  {
    label: '竞品销售额 (元)',
    align: 'right',
    headerAlign: 'center',
    minWidth: 206,
    formatter: (col: analysisData) => {
      if (col.gmv_analysis !== null) {
        return h('div', undefined, [
          formatPriceToThousand(col.gmv_analysis, 2, false),
          h(
            'span',
            {
              class:
                col.sale_gmv_rate_analysis === null || col.sale_gmv_rate_analysis > 0
                  ? 'red-mint label'
                  : 'green-mint label',
            },
            [
              h('tg-icon', {
                props: {
                  name:
                    col.sale_gmv_rate_analysis === null || col.sale_gmv_rate_analysis > 0
                      ? 'ico-icon_tongyong_shangsheng_16_red'
                      : 'ico-icon_tongyong_xiajiang_16_green',
                },
                style: 'margin-left: 13px;margin-right: 50px;',
              }),
              col.sale_gmv_rate_analysis
                ? (col.sale_gmv_rate_analysis + '%').replace('-', '')
                : '0%',
            ],
          ),
        ]);
      } else {
        return h('div', { style: 'text-align:center' }, '--');
      }
    },
  },
  {
    renderHeader: () => {
      return h(
        'div',
        {
          style: ' display: flex',
        },
        [
          h('span', ['同竞品销售额对比']),
          h(
            'el-popover',
            {
              props: {
                placement: 'top',
                trigger: 'hover',
                content: '项目销售额对比竞品销售额涨幅',
              },
            },
            [
              h('span', { slot: 'reference' }, [
                h('tg-icon', {
                  props: {
                    name: 'ico-question',
                  },
                  style: 'color: #939393; font-size: 14px; margin-left: 2px;margin-top:3px;',
                }),
              ]),
            ],
          ),
        ],
      );
    },
    headerAlign: 'center',
    width: 160,
    formatter: (col: analysisData) => {
      if (col.gmv_contrast !== null) {
        return h('div', undefined, [
          h('span', [
            h(
              'span',
              {
                class: col.gmv_contrast === null || col.gmv_contrast >= 0 ? 'red' : 'green',
              },
              [col.gmv_contrast === null || col.gmv_contrast >= 0 ? '+' : '-'],
            ),
            col.gmv_contrast ? (col.gmv_contrast + '%').replace('-', '') : '0%',
          ]),
        ]);
      } else {
        return h('span', { style: 'margin-left: 32px;' }, ['--']);
      }
    },
  },
  {
    renderHeader: () => {
      return h(
        'div',
        {
          style: 'display: flex',
        },
        [
          h('span', ['同竞品涨幅对比']),
          h(
            'el-popover',
            {
              props: {
                placement: 'top',
                trigger: 'hover',
                content: '同竞品涨幅对比=项目销售额涨幅-竞品销售额涨幅',
              },
            },
            [
              h('span', { slot: 'reference' }, [
                h('tg-icon', {
                  props: {
                    name: 'ico-question',
                  },
                  style: 'color: #939393; font-size: 14px; margin-left: 2px;margin-top:3px;',
                }),
              ]),
            ],
          ),
        ],
      );
    },
    headerAlign: 'center',
    width: 140,
    formatter: (col: analysisData) => {
      if (col.sale_gmv_rate_diff !== null) {
        return h('div', undefined, [
          h('span', [
            h(
              'span',
              {
                class:
                  col.sale_count_rate_diff === null || col.sale_count_rate_diff >= 0
                    ? 'red'
                    : 'green',
              },
              [col.sale_count_rate_diff === null || col.sale_count_rate_diff >= 0 ? '+' : '-'],
            ),
            col.sale_gmv_rate_diff ? (col.sale_gmv_rate_diff + '%').replace('-', '') : '0%',
          ]),
        ]);
      } else {
        return h('span', { style: 'margin-left: 32px;' }, ['--']);
      }
    },
  },
  {
    label: '项目销量',
    align: 'right',
    headerAlign: 'center',
    minWidth: 170,
    formatter: (col: analysisData) => {
      if (col.sale_count !== null) {
        return h('div', undefined, [
          numberFormat(Number(col.sale_count), 0, '.', ',') + '',
          h(
            'span',
            {
              class:
                col.sale_count_rate === null || col.sale_count_rate > 0
                  ? 'red-mint label'
                  : 'green-mint label',
            },
            [
              h('tg-icon', {
                props: {
                  name:
                    col.sale_count_rate === null || col.sale_count_rate > 0
                      ? 'ico-icon_tongyong_shangsheng_16_red'
                      : 'ico-icon_tongyong_xiajiang_16_green',
                },
                style: 'margin-left: 13px;margin-right: 50px;',
              }),
              col.sale_count_rate ? (col.sale_count_rate + '%').replace('-', '') : '0%',
            ],
          ),
        ]);
      } else {
        return h('div', { style: 'text-align:center' }, '--');
      }
    },
  },
  {
    label: '竞品销量',
    align: 'right',
    headerAlign: 'center',
    minWidth: 206,
    formatter: (col: analysisData) => {
      if (col.sale_count_analysis !== null) {
        return h('div', undefined, [
          numberFormat(Number(col.sale_count_analysis), 0, '.', ',') + '',
          h(
            'span',
            {
              class:
                col.sale_count_rate_analysis === null || col.sale_count_rate_analysis > 0
                  ? 'red-mint label'
                  : 'green-mint label',
            },
            [
              h('tg-icon', {
                props: {
                  name:
                    col.sale_count_rate_analysis === null || col.sale_count_rate_analysis > 0
                      ? 'ico-icon_tongyong_shangsheng_16_red'
                      : 'ico-icon_tongyong_xiajiang_16_green',
                },
                style: 'margin-left: 13px;margin-right: 50px;',
              }),
              col.sale_count_rate_analysis
                ? (col.sale_count_rate_analysis + '%').replace('-', '')
                : '0%',
            ],
          ),
        ]);
      } else {
        return h('div', { style: 'text-align:center' }, '--');
      }
    },
  },
  {
    renderHeader: () => {
      return h(
        'div',
        {
          style: ' display: flex',
        },
        [
          h('span', ['同竞品销量对比']),
          h(
            'el-popover',
            {
              props: {
                placement: 'top',
                trigger: 'hover',
                content: '项目销量对比竞品销量涨幅',
              },
            },
            [
              h('span', { slot: 'reference' }, [
                h('tg-icon', {
                  props: {
                    name: 'ico-question',
                  },
                  style: 'color: #939393; font-size: 14px; margin-left: 2px;margin-top:3px;',
                }),
              ]),
            ],
          ),
        ],
      );
    },
    headerAlign: 'center',
    width: 160,
    formatter: (col: analysisData) => {
      if (col.sale_count_contrast !== null) {
        return h('div', undefined, [
          h('span', [
            h(
              'span',
              {
                class:
                  col.sale_count_contrast === null || col.sale_count_contrast >= 0
                    ? 'red'
                    : 'green',
              },
              [col.sale_count_contrast === null || col.sale_count_contrast >= 0 ? '+' : '-'],
            ),
            col.sale_count_contrast ? (col.sale_count_contrast + '%').replace('-', '') : '0%',
          ]),
        ]);
      } else {
        return h('span', { style: 'margin-left: 22px;' }, ['--']);
      }
    },
  },
  {
    renderHeader: () => {
      return h(
        'div',
        {
          style: ' display: flex',
        },
        [
          h('span', ['同竞品涨幅对比']),
          h(
            'el-popover',
            {
              props: {
                placement: 'top',
                trigger: 'hover',
                content: '同竞品涨幅对比=项目销量涨幅-竞品销量涨幅',
              },
            },
            [
              h('span', { slot: 'reference' }, [
                h('tg-icon', {
                  props: {
                    name: 'ico-question',
                  },
                  style: 'color: #939393; font-size: 14px; margin-left: 2px;margin-top:3px;',
                }),
              ]),
            ],
          ),
        ],
      );
    },
    headerAlign: 'center',
    width: 140,
    formatter: (col: analysisData) => {
      if (col.sale_count_rate_diff !== null) {
        return h('div', undefined, [
          h('span', [
            h(
              'span',
              {
                class:
                  col.sale_count_rate_diff === null || col.sale_count_rate_diff >= 0
                    ? 'red'
                    : 'green',
              },
              [col.sale_count_rate_diff === null || col.sale_count_rate_diff >= 0 ? '+' : '-'],
            ),
            col.sale_count_rate_diff ? (col.sale_count_rate_diff + '%').replace('-', '') : '0%',
          ]),
        ]);
      } else {
        return h('span', { style: 'margin-left: 22px;' }, ['--']);
      }
    },
  },
];

export const useData = (ctx: SetupContext) => {
  const paramsStruct = reactive<{
    loading: boolean;
    listData: analysisData[];
    echartsLoading: boolean;
    LineDate: string[];
    salesAmountLineList: any[];
    saleCountLineList: any[];
    watchLineList: any[];
    turnLineList: any[];
  }>({
    loading: false,
    listData: [],
    echartsLoading: false,
    LineDate: [],
    salesAmountLineList: [],
    saleCountLineList: [],
    watchLineList: [],
    turnLineList: [],
  });

  const getListData = async (payload: CompetitiveParams) => {
    paramsStruct.loading = true;
    const { data } = await GetCompetitiveAnalysis(payload);
    if (data.success) {
      const list = [].concat(...data.data.result);
      list.map((item: any) => {
        if (item.id === 0) {
          item.children = [];
        }
      });
      paramsStruct.listData = list;
    } else {
      ctx.root.$message.error(data.message);
    }
    paramsStruct.loading = false;
  };

  const getEchartsData = async (payload: CompetitiveAnalysisDetail) => {
    paramsStruct.echartsLoading = true;
    const { data } = await GetCompetitiveAnalysisDetail(payload);
    paramsStruct.echartsLoading = false;
    if (data.success) {
      const list = data.data;
      const lineDate = list.map((it: any) => {
        return it.date.replace(/-/g, '.').substring(5, 10);
      });

      const gmv = list.map((it: any) => {
        return (it.shop_live.gmv || 0) / 100;
      });
      const cGmv: any[] = [];

      const saleCount = list.map((it: any) => {
        return it.shop_live.sale_count;
      });
      const cSaleCount: any[] = [];

      const watchCount = list.map((it: any) => {
        return it.shop_live.watch_count;
      });
      const cWatchCount: any[] = [];

      const conversionRate = list.map((it: any) => {
        return it.shop_live.conversion_rate;
      });
      const cConversionRate: any[] = [];
      list.map((it: any) => {
        it.competitive.map((sub: any, sub_index: number) => {
          const shop_name = cGmv.length > sub_index ? cGmv[sub_index].shop_name : sub.shop_name;
          const gmv_arr = cGmv.length > sub_index ? cGmv[sub_index].values : [];
          const sale_arr = cSaleCount.length > sub_index ? cSaleCount[sub_index].values : [];
          const watch_arr = cWatchCount.length > sub_index ? cWatchCount[sub_index].values : [];
          const rate_arr =
            cConversionRate.length > sub_index ? cConversionRate[sub_index].values : [];
          gmv_arr.push((sub.gmv || 0) / 100);
          sale_arr.push(sub.sale_count);
          watch_arr.push(sub.watch_count);
          rate_arr.push(sub.conversion_rate);
          if (cWatchCount.length > sub_index) {
            cGmv[sub_index].values = gmv_arr;
            cSaleCount[sub_index].values = sale_arr;
            cWatchCount[sub_index].values = watch_arr;
            cConversionRate[sub_index].values = rate_arr;
          } else {
            cGmv.push({
              project_name: shop_name + '销售额',
              values: gmv_arr,
            });
            cSaleCount.push({
              project_name: shop_name + '销量',
              values: sale_arr,
            });
            cWatchCount.push({
              project_name: shop_name + '浏览量',
              values: watch_arr,
            });
            cConversionRate.push({
              project_name: shop_name + '转化率',
              values: rate_arr,
            });
          }
        });
      });
      const salesAmountList = [
        {
          project_name: '项目销售额',
          values: gmv,
        },
        ...cGmv,
      ];
      const saleCountList = [
        {
          project_name: '项目销量',
          values: saleCount,
        },
        ...cSaleCount,
      ];
      const watchList = [
        {
          project_name: '项目浏览量',
          values: watchCount,
        },
        ...cWatchCount,
      ];
      const turnList = [
        {
          project_name: '项目转化率',
          values: conversionRate,
        },
        ...cConversionRate,
      ];
      paramsStruct.LineDate = lineDate;
      paramsStruct.salesAmountLineList = salesAmountList.map((item: any) => {
        return {
          smooth: true,
          showSymbol: true,
          type: 'line',
          name: item.project_name,
          data: item.values,
        };
      });

      paramsStruct.saleCountLineList = saleCountList.map((item: any) => {
        return {
          smooth: true,
          showSymbol: true,
          type: 'line',
          name: item.project_name,
          data: item.values,
        };
      });

      paramsStruct.watchLineList = watchList.map((item: any) => {
        return {
          smooth: true,
          showSymbol: true,
          type: 'line',
          name: item.project_name,
          data: item.values,
        };
      });
      paramsStruct.turnLineList = turnList.map((item: any) => {
        return {
          smooth: true,
          showSymbol: true,
          type: 'line',
          name: item.project_name,
          data: item.values,
        };
      });
    }
  };

  return { ...toRefs(paramsStruct), listColumn, getEchartsData, getListData };
};
