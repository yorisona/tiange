/**
 * 结算情况
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-30 11:50:43
 */
import { defineComponent, h, inject, Ref, computed } from '@vue/composition-api';
import { SettlementDetail, SettleWay, SettleWayMap } from '@/types/tiange/contract';
import { formatAmount } from '@/utils/string';
import { DefText } from '@/components/DefText/dt';
import { MoneyAlign } from '@/use/money.align';

const moneyAlign = MoneyAlign.getColSetting();

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, ctx) {
    const details = inject<Ref<SettlementDetail[]>>('details');

    const columns = computed(() => {
      // 新增合同类型文字变更
      // 默认显示老的,供货商
      //@ts-ignore
      return [
        {
          label: '序号',
          type: 'index',
          align: 'center',
          headerAlign: 'center',
          formatter: (_: any, __: any, ___: any, index: any) => index + 1,
        },
        {
          label: '结算金额',
          property: 'settle_amount',
          ...moneyAlign,
          width: 130,
          formatter: (_: any, __: any, value: any) => formatAmount(value),
        },
        {
          label: '结算方式',
          align: 'left',
          headerAlign: 'left',
          formatter: (row: any) => {
            if (row.settlement_way === SettleWay.VTask) {
              const style = { lineHeight: '18px' };
              return h(
                'el-popover',
                {
                  props: {
                    popperClass: 'settlement-detail-dialog-popper',
                    trigger: 'hover',
                    placement: 'right',
                  },
                },
                [
                  h(
                    'div',
                    { style: { paddingTop: '4px', paddingBottom: '4px' }, slot: 'reference' },
                    [
                      h('div', { style }, [SettleWayMap.get(row.settlement_way)]),
                      h('div', { style: { ...style, color: 'var(--text-des-color)' } }, [
                        row.shop_name,
                      ]),
                      h('div', { style: { ...style, color: 'var(--text-des-color)' } }, [
                        row.wangwang_num,
                      ]),
                    ],
                  ),
                  h('div', [
                    h('div', [
                      h('div', { class: 'lbl' }, ['结算方式：']),
                      h('span', SettleWayMap.get(row.settlement_way)),
                    ]),
                    h('div', [
                      h('div', { class: 'lbl' }, ['店铺名称：']),
                      h('span', row.shop_name),
                    ]),
                    h('div', [
                      h('div', { class: 'lbl' }, ['旺旺号：']),
                      h('span', row.wangwang_num),
                    ]),
                  ]),
                ],
              );
            } else {
              return SettleWayMap.get(row.settlement_way) ?? DefText();
            }
          },
        },
        {
          label: '开始日期',
          align: 'center',
          headerAlign: 'center',
          formatter: (row: any) => row.start_date,
        },
        {
          label: '结束日期',
          align: 'center',
          headerAlign: 'center',
          formatter: (row: any) => row.end_date,
        },
        {
          label: '备注',
          align: 'center',
          headerAlign: 'center',
          width: 130,
          formatter: (row: any) => h('div', { class: 'line-clamp-2' }, [row.comment || row.remark]),
        },
      ];
    });

    const emitClose = () => {
      ctx.emit('dialog:clsoe');
    };

    return {
      columns,
      details,
      emitClose,
    };
  },
});
