import { h, ref, SetupContext } from '@vue/composition-api';
import { wait } from '@/utils/func';
import { GetHotCommodityList } from '@/services/datacenter';
import { TableColumn } from '@/types/vendor/column';
import { get_limited_length_string } from '@/utils/string';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { max_length_of_column } from '@/utils/table';
import formatPriceForm from '@/utils/formatData';
const { formatPriceFormYuan } = formatPriceForm;
import { numberFormat } from '@/utils/formatMoney';
import { IHotCommodityParams } from '@/types/tiange/datacenter';
import { formatSeconds } from '@/utils/format';
import emptyGoods from '@/assets/img/goods-empty.png';
import reXiaoImg from '@/assets/img/icon-rexiao.png';

export const useList = (ctx: SetupContext) => {
  const loading = ref(false);
  const total = ref(0);
  const list = ref<any[]>([]);
  const loadData = async (payload: IHotCommodityParams) => {
    loading.value = true;
    const [{ data: response }] = await wait(500, GetHotCommodityList(payload));
    loading.value = false;
    if (response.success) {
      list.value = response.data.data;
      total.value = response.data.total;
    } else {
      list.value = [];
      total.value = 0;
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };

  const popoverFun = <T extends boolean>(row: any, text: string, num: number, text_only: T) => {
    const data = row[text] || '--';
    const { is_folded, folded_text } = get_limited_length_string(data, num);
    return text_only || !is_folded
      ? folded_text
      : (h(
          'el-popover',
          {
            props: {
              placement: 'right',
              trigger: 'hover',
              content: data,
            },
          },
          [
            h('span', { slot: 'reference' }, [folded_text]),
            h('DefText', { props: { content: row[text] } }),
          ],
        ) as TableColumnRenderReturn<T>);
  };

  /** 项目名称渲染函数 */
  const live_account_render = <T extends boolean>(row: any, text_only: T) => {
    return popoverFun(row, 'anchor_account_name', 15, text_only);
  };
  /** 项目名称最大宽度 */
  const live_account_max_length = max_length_of_column(list, '项目名称', live_account_render);

  const columns = ref<TableColumn<any>[]>([
    {
      label: '商品信息',
      minWidth: 356,
      formatter: row => {
        const hFun = h(
          'p',
          {
            class: 'commodity-name',
            on: {
              click: function () {
                window.open(row.item_dy_url);
              },
            },
          },
          row.item_name,
        );

        return h('div', { class: 'shop-box' }, [
          h('div', { class: 'pic-box' }, [
            h(
              'el-image',
              {
                attrs: {
                  src: row.item_pic_url,
                  fit: 'contain',
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
            row.hot_flag === 1
              ? h('img', {
                  attrs: {
                    src: reXiaoImg,
                  },
                  class: 'hot-icon',
                })
              : null,
          ]),
          h('div', { class: 'info-box' }, [
            row.item_name.length > 60
              ? h(
                  'el-tooltip',
                  {
                    attrs: {
                      effect: 'light',
                      content: row.item_name,
                      placement: 'top-start',
                      popperClass: 'hot-sale-detail-popper-class',
                    },
                  },
                  [hFun],
                )
              : hFun,
            h('div', { class: 'price-line' }, [h('span', ['￥']), h('span', row.item_price_range)]),
          ]),
        ]);
      },
    },
    {
      label: '直播账号',
      minWidth: live_account_max_length.value + 160,
      formatter: row => live_account_render(row, false),
    },
    {
      label: '讲解次数',
      minWidth: 100,
      align: 'right',
      formatter: row => {
        return row.talk_times || row.talk_times === 0 ? row.talk_times : '--';
      },
    },
    {
      label: '讲解时长',
      minWidth: 100,
      align: 'right',
      formatter: row => {
        if (!row.talk_duration && row.talk_duration !== 0) return h('div', '--');
        if (row.talk_duration === 0) return h('div', formatSeconds(row.talk_duration));
        return h(
          'el-tooltip',
          {
            attrs: {
              effect: 'light',
              placement: 'right',
              popperClass: 'hot-sale-detail-talk-time',
            },
          },
          [
            h('div', { class: 'talk-time-box', slot: 'content' }, [
              h(
                'h3',
                { style: { fontSize: '12px', width: '100%', lineHeight: '8px' } },
                '讲解时长',
              ),
              ...row.talk_detail.map((item: string) => {
                return h('p', { class: 'talk-time-item' }, item);
              }),
            ]),
            h('div', { class: 'talk-time' }, formatSeconds(row.talk_duration)),
          ],
        );
      },
    },
    {
      label: '销量',
      minWidth: 110,
      align: 'right',
      formatter: row => {
        if (!row.sale_count && row.sale_count !== 0) return '--';
        return numberFormat(Number(row.sale_count), 0, '.', ',');
      },
    },
    {
      label: '销售额 (元)',
      minWidth: 110,
      align: 'right',
      formatter: row => {
        if (!row.sale_amount && row.sale_amount !== 0) return '--';
        return formatPriceFormYuan(row.sale_amount / 100, 2, false);
      },
    },
  ]);

  return {
    loading,
    total,
    list,
    loadData,
    columns,
  };
};
