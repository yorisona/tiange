import { h } from '@vue/composition-api';
import emptyGoods from '@/assets/img/goods-empty.png';
import moment from 'moment';
import formatPriceForm, { FD } from '@/utils/formatData';
const { formatPriceFormYuan } = formatPriceForm;
import { numberFormat } from '@/utils/formatMoney';
import { UpDataCommodityMonitorAnalysis } from '@/services/datacenter';
import { sleep } from '@/utils/func';
import { Message } from 'element-ui';
import { monitorAnalysisItem } from './types';
const renderHeader = (h: any, { column }: { column: any }) => {
  const header = column.label.split(' ');
  return [h('p', [h('p', { class: 'title-p' }, header[0]), h('span', {}, header[1])])];
};
export const shopBaseColumns = () => {
  return [
    {
      label: '商品主图',
      prop: 'image_url',
      width: 104,
      align: 'center',
      fixed: 'left',
      formatter: (col: monitorAnalysisItem) => {
        return h(
          'div',
          {
            class: 'competitor-goods-info',
          },
          [
            h(
              'el-image',
              {
                props: {
                  src: col.image_url,
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
                h(
                  'div',
                  {
                    slot: 'placeholder',
                  },
                  [
                    h('img', {
                      style: { height: '80px', width: '80px' },
                      domProps: {
                        src: emptyGoods,
                      },
                      on: {
                        click: function () {
                          window.open(
                            'https://haohuo.jinritemai.com/views/product/item2?id=' + col.item_id,
                          );
                        },
                      },
                    }),
                  ],
                ),
                h(
                  'div',
                  {
                    slot: 'error',
                  },
                  [
                    h('img', {
                      style: { height: '80px', width: '80px' },
                      domProps: {
                        src: emptyGoods,
                      },
                      on: {
                        click: function () {
                          window.open(
                            'https://haohuo.jinritemai.com/views/product/item2?id=' + col.item_id,
                          );
                        },
                      },
                    }),
                  ],
                ),
              ],
            ),
          ],
        );
      },
    },
    {
      label: '商品编码',
      prop: 'item_id',
      minWidth: 100,
      fixed: 'left',
      formatter: (col: monitorAnalysisItem) => {
        return col.item_id || '--';
      },
    },
    {
      label: '商品款号',
      prop: 'item_sn',
      minWidth: 104,
      fixed: 'left',
      formatter: (col: monitorAnalysisItem) => {
        return col.item_sn || '--';
      },
    },
    {
      label: '颜色',
      prop: 'color',
      minWidth: 104,
      fixed: 'left',
      align: 'left',
      formatter: (col: monitorAnalysisItem) => {
        return col.color || '--';
      },
    },
    {
      label: '官方类目',
      prop: 'image_url',
      minWidth: 104,
      align: 'center',
      formatter: (col: monitorAnalysisItem) => {
        const { first_cname = '', second_cname = '', third_cname = '' } = col;
        return (
          <span class="goods_code">
            {first_cname && first_cname + '-'}
            {second_cname && second_cname}
            {third_cname && '-' + third_cname}
          </span>
        );
      },
    },
    {
      label: '年度季节',
      prop: 'image_url',
      minWidth: 104,
      align: 'center',
      formatter: (col: monitorAnalysisItem) => {
        return col.year !== null && col.season !== null ? col.year + '/' + col.season : '--';
      },
    },
    {
      label: 'SKU',
      prop: 'sku',
      minWidth: 60,
      align: 'center',
    },
    {
      label: 'SKC',
      prop: 'skc',
      minWidth: 60,
      fixed: 'left',
      align: 'center',
    },
    {
      label: '潜力指数',
      prop: 'potential_index',
      minWidth: 72,
      fixed: 'left',
      align: 'center',
      formatter: (row: monitorAnalysisItem) => {
        return FD.formatEmpty(row.potential_index);
      },
    },
    {
      label: '受欢迎指数',
      prop: 'popularity_index',
      minWidth: 92,
      fixed: 'left',
      align: 'center',
      formatter: (row: monitorAnalysisItem) => {
        return FD.formatEmpty(row.popularity_index);
      },
    },
  ];
};
const SampleDressTypeMap = [
  { value: 1, label: '有' },
  { value: 0, label: '无' },
];

export const shopSaleColumns = () => {
  return [
    {
      label: '款别',
      prop: 'section',
      minWidth: 80,
      formatter: (col: monitorAnalysisItem) => {
        return col.section || '--';
      },
    },
    {
      label: '样衣有无 （手动维护）',
      prop: 'is_sample',
      'render-header': renderHeader,
      width: 98,
      formatter: (col: monitorAnalysisItem) => {
        return [
          <el-select
            class="el-select--mini"
            value={col.is_sample}
            placeholder="请选择"
            on-change={async (val: any) => {
              const [{ data: response }, _] = await Promise.all([
                await UpDataCommodityMonitorAnalysis({
                  data: {
                    has_sample: val,
                    additional_order: col.additional_order,
                    advice: col.advice,
                    health: col.health,
                  },
                  item_id: col.item_id,
                  spec_id: col.spec_id,
                }),
                await sleep(200),
              ]);
              if (response.success) {
                Message.success(response.message || '保存成功');
                col.is_sample = val;
                col.has_sample = val === 1 ? '有' : val === 0 ? '无' : null;
              } else {
                Message.error(response.message || '保存失败');
              }
            }}
          >
            {SampleDressTypeMap.map((item: any, i: Number) => {
              return <el-option key={i} label={item.label} value={item.value}></el-option>;
            })}
          </el-select>,
        ];
      },
    },
    {
      label: '商品创建时间',
      prop: 'create_time',
      width: 124,
      align: 'center',
      formatter: (col: monitorAnalysisItem) => {
        return moment(col.create_time).format('YYYY.MM.DD HH:mm');
      },
    },
    {
      label: '吊牌价',
      prop: 'image_url',
      width: 88,
      align: 'right',
      formatter: (col: monitorAnalysisItem) => {
        return col.market_price !== null
          ? formatPriceFormYuan((col.market_price || 0) / 100, 2, true)
          : '--';
      },
    },
    {
      label: '昨日直播价',
      prop: 'image_url',
      width: 98,
      align: 'right',
      formatter: (col: monitorAnalysisItem) => {
        return col.live_price !== null
          ? formatPriceFormYuan((col.live_price || 0) / 100, 2, true)
          : '--';
      },
    },
    {
      label: '折扣',
      prop: 'discount',
      minWidth: 80,
      align: 'right',
      formatter: (col: monitorAnalysisItem) => {
        return col.discount !== null ? col.discount + '%' : '--';
      },
    },
    {
      label: '价格带(吊牌价)',
      prop: 'market_price_range',
      width: 120,
      formatter: (col: monitorAnalysisItem) => {
        return col.market_price_range || '--';
      },
    },
    {
      label: '价格带(直播价)',
      prop: 'live_price_range',
      width: 120,
      formatter: (col: monitorAnalysisItem) => {
        return col.live_price_range || '--';
      },
    },
  ];
};

export const shopLastSaleColumns = (week_num: string | number | null) => {
  const week = week_num || Number(moment().add(-1, 'week').format('ww'));
  return [
    {
      label: '第' + week + '周销量',
      prop: 'sale_count',
      minWidth: 108,
      align: 'right',
      formatter: (col: monitorAnalysisItem) => {
        return col.last_week_sale_info && col.last_week_sale_info.sale_count !== null
          ? numberFormat(Number(col.last_week_sale_info.sale_count || 0), 0, '.', ',')
          : '--';
      },
    },
    {
      label: '第' + week + '周销额',
      prop: 'gmv',
      align: 'right',
      minWidth: 108,
      formatter: (col: monitorAnalysisItem) => {
        return col.last_week_sale_info && col.last_week_sale_info.gmv !== null
          ? formatPriceFormYuan((col.last_week_sale_info.gmv || 0) / 100, 2, true)
          : '--';
      },
    },
    {
      label: '库存可销周数',
      prop: 'week_number',
      minWidth: 112,
      align: 'right',
      formatter: (col: monitorAnalysisItem) => {
        return col.last_week_sale_info && col.last_week_sale_info.stock_times !== null
          ? Number(col.last_week_sale_info.stock_times || 0)
          : '--';
      },
    },
    {
      label: '第' + week + '周讲解次数',
      prop: 'talk_times',
      minWidth: 112,
      align: 'right',
      formatter: (col: monitorAnalysisItem) => {
        return col.last_week_sale_info && col.last_week_sale_info.talk_times !== null
          ? Number(col.last_week_sale_info.talk_times || 0)
          : '--';
      },
    },
    {
      label: '第' + week + '周点击率',
      prop: 'click_rate',
      minWidth: 108,
      align: 'right',
      formatter: (col: monitorAnalysisItem) => {
        return col.last_week_sale_info && col.last_week_sale_info.click_rate !== null
          ? col.last_week_sale_info.click_rate + '%'
          : '--';
      },
    },
    {
      label: '第' + week + '周转化率',
      prop: 'pay_rate',
      minWidth: 108,
      align: 'right',
      formatter: (col: monitorAnalysisItem) => {
        return col.last_week_sale_info && col.last_week_sale_info.pay_rate !== null
          ? col.last_week_sale_info.pay_rate + '%'
          : '--';
      },
    },
    {
      label: '第' + week + '周退款率',
      prop: 'refund_gmv_rate',
      minWidth: 108,
      align: 'right',
      formatter: (col: monitorAnalysisItem) => {
        return col.last_week_sale_info && col.last_week_sale_info.refund_gmv_rate !== null
          ? col.last_week_sale_info.refund_gmv_rate + '%'
          : '--';
      },
    },
  ];
};

export const shopWeekSaleColumns = (isSelf = true, index = 0, weekArr: any) => {
  const getWeekSaleCount = (subIndex = 0, last_4week_sale_info = []) => {
    const week = Number(moment().add(-subIndex, 'week').format('ww'));
    const find: any = (last_4week_sale_info || []).find(
      (item: { week_number: number; sale_count: number }) => {
        return week === item.week_number;
      },
    );
    return find && find.sale_count !== null
      ? numberFormat(Number(find.sale_count || 0), 0, '.', ',')
      : '--';
  };
  return [
    {
      label:
        '第' +
        (weekArr.length > 0
          ? weekArr[0].week_number
          : Number(moment().add(-4, 'week').format('ww'))) +
        '周销量',
      minWidth: 98,
      align: 'right',
      formatter: (col: monitorAnalysisItem) => {
        return getWeekSaleCount(
          4,
          isSelf
            ? col.last_4week_sale_info
            : col.competitive_sku_info_list[index].last_4week_sale_info,
        );
      },
    },
    {
      label:
        '第' +
        (weekArr.length > 1
          ? weekArr[1].week_number
          : Number(moment().add(-3, 'week').format('ww'))) +
        '周销量',
      minWidth: 98,
      align: 'right',
      formatter: (col: monitorAnalysisItem) => {
        return getWeekSaleCount(
          3,
          isSelf
            ? col.last_4week_sale_info
            : col.competitive_sku_info_list[index].last_4week_sale_info,
        );
      },
    },
    {
      label:
        '第' +
        (weekArr.length > 2
          ? weekArr[2].week_number
          : Number(moment().add(-2, 'week').format('ww'))) +
        '周销量',
      minWidth: 98,
      align: 'right',
      formatter: (col: monitorAnalysisItem) => {
        return getWeekSaleCount(
          2,
          isSelf
            ? col.last_4week_sale_info
            : col.competitive_sku_info_list[index].last_4week_sale_info,
        );
      },
    },
    {
      label:
        '第' +
        (weekArr.length > 3
          ? weekArr[3].week_number
          : Number(moment().add(-1, 'week').format('ww'))) +
        '周销量',
      minWidth: 98,
      align: 'right',
      formatter: (col: monitorAnalysisItem) => {
        return getWeekSaleCount(
          1,
          isSelf
            ? col.last_4week_sale_info
            : col.competitive_sku_info_list[index].last_4week_sale_info,
        );
      },
    },
  ];
};

export const shopAllSaleColumns = () => {
  return [
    {
      label: '累计销量',
      minWidth: 100,
      align: 'right',
      formatter: (col: monitorAnalysisItem) => {
        return col.total_sale_count !== null
          ? numberFormat(Number(col.total_sale_count || 0), 0, '.', ',')
          : '--';
      },
    },
    {
      label: '累计销额',
      minWidth: 100,
      align: 'right',
      formatter: (col: monitorAnalysisItem) => {
        return col.total_gmv !== null
          ? formatPriceFormYuan((col.total_gmv || 0) / 100, 2, true)
          : '--';
      },
    },
    {
      label: '累计讲解次数',
      minWidth: 100,
      align: 'right',
      formatter: (col: monitorAnalysisItem) => {
        return col.total_talk_times !== null
          ? numberFormat(Number(col.total_talk_times || 0), 0, '.', ',')
          : '--';
      },
    },
    {
      label: '平均点击率',
      minWidth: 100,
      align: 'right',
      formatter: (col: monitorAnalysisItem) => {
        return col.avg_click_rate !== null ? col.avg_click_rate + '%' : '--';
      },
    },
    {
      label: '平均转化率',
      minWidth: 100,
      align: 'right',
      formatter: (col: monitorAnalysisItem) => {
        return col.avg_pay_rate !== null ? col.avg_pay_rate + '%' : '--';
      },
    },
    {
      label: '平均退款率',
      minWidth: 100,
      align: 'right',
      formatter: (col: monitorAnalysisItem) => {
        return col.avg_refund_gmv_rate !== null ? col.avg_refund_gmv_rate + '%' : '--';
      },
    },
  ];
};

export const shopAllBaseColumns = () => {
  const getBaseValue = (str = '', prop_info_list: any[]) => {
    const find: any = (prop_info_list || []).find((item: { value: string; name: string }) => {
      return str === item.name;
    });
    return find && find.value !== null ? find.value : '--';
  };
  return [
    {
      label: '图案',
      minWidth: 100,
      formatter: (col: monitorAnalysisItem) => {
        return getBaseValue('图案', col.prop_info_list);
      },
    },
    {
      label: '材质',
      minWidth: 100,
      formatter: (col: monitorAnalysisItem) => {
        return getBaseValue('材质', col.prop_info_list);
      },
    },
    {
      label: '工艺',
      minWidth: 100,
      formatter: (col: monitorAnalysisItem) => {
        return getBaseValue('工艺', col.prop_info_list);
      },
    },
    {
      label: '衣长',
      minWidth: 100,
      formatter: (col: monitorAnalysisItem) => {
        return getBaseValue('衣长', col.prop_info_list);
      },
    },
    {
      label: '袖型',
      minWidth: 100,
      formatter: (col: monitorAnalysisItem) => {
        return getBaseValue('袖型', col.prop_info_list);
      },
    },
    {
      label: '袖长',
      minWidth: 100,
      formatter: (col: monitorAnalysisItem) => {
        return getBaseValue('袖长', col.prop_info_list);
      },
    },
    {
      label: '领型',
      minWidth: 100,
      formatter: (col: monitorAnalysisItem) => {
        return getBaseValue('领型', col.prop_info_list);
      },
    },
    {
      label: '裤型',
      minWidth: 100,
      formatter: (col: monitorAnalysisItem) => {
        return getBaseValue('裤型', col.prop_info_list);
      },
    },
    {
      label: '裤长',
      minWidth: 100,
      formatter: (col: monitorAnalysisItem) => {
        return getBaseValue('裤长', col.prop_info_list);
      },
    },
    {
      label: '廓形',
      minWidth: 100,
      formatter: (col: monitorAnalysisItem) => {
        return getBaseValue('廓形', col.prop_info_list);
      },
    },
    {
      label: '裙长',
      minWidth: 100,
      formatter: (col: monitorAnalysisItem) => {
        return getBaseValue('裙长', col.prop_info_list);
      },
    },
  ];
};

export const getLineArr = (sale_count_list: any[]) => {
  if (sale_count_list && sale_count_list.length < 1) {
    return [];
  }
  const new_sale_count_list: any = JSON.parse(JSON.stringify(sale_count_list));
  new_sale_count_list.sort(function (
    a: { date: string; sale_count: number },
    b: { date: string; sale_count: number },
  ) {
    return (a.sale_count || 0) - (b.sale_count || 0);
  });
  const arr: { x: number; y: number }[] = [];
  (sale_count_list || []).map((sub: { date: string; sale_count: number }, index: number) => {
    const count =
      new_sale_count_list[new_sale_count_list.length - 1].sale_count -
      new_sale_count_list[0].sale_count;
    arr.push({
      x: (100 * (index + 0.5)) / sale_count_list.length,
      y: sub.sale_count
        ? (100 * (sub.sale_count - new_sale_count_list[0].sale_count)) / (count || 100)
        : 0,
    });
  });
  return arr;
};
