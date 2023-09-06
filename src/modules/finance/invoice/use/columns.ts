// 财务管理 / 发票管理 列表
import type { TableColumn } from '@/types/vendor/column';

import { FinanceInvoice, InoviceWriteOffStatusMap } from '@/types/tiange/finance/invoice';
import { computed, h, Ref } from '@vue/composition-api';
import { Decimal2String } from '@/utils/string';
import Decimal from 'decimal.js';
import { getToken } from '@/utils/token';
import { showProDateFormat } from '@/utils/format';
import { max_length_of_column } from '@/utils/table';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { get_limited_length_string } from '@/utils/string';
import moment from 'moment';

const JWT_TOKEN = getToken();

export type FinanceInvoiceCol = TableColumn<FinanceInvoice>;

/** 发票管理列表的普通列 */
export const useColumns = (
  data: Ref<FinanceInvoice[]>,
  showPreviewViewer: (urllist: string[]) => void,
) => {
  /** 金额渲染函数 */
  const invoice_amount_column_render = <T extends boolean>(row: FinanceInvoice, text_only: T) => {
    const data = Decimal2String(new Decimal(row.total_amount ?? 0));
    return text_only
      ? data
      : (h('span', { class: row.invoice_status === 5 ? 'red' : '' }, [
          data,
        ]) as TableColumnRenderReturn<T>);
  };

  const invoice_not_amount_column_render = <T extends boolean>(
    row: FinanceInvoice,
    text_only: T,
  ) => {
    const data = Decimal2String(new Decimal(row.not_write_off_amount ?? 0));
    return text_only ? data : (h('span', {}, [data]) as TableColumnRenderReturn<T>);
  };

  const buyer_name_column_render = <T extends boolean>(row: FinanceInvoice, text_only: T) => {
    const data = row.buyer_name || '--';
    const { is_folded, folded_text } = get_limited_length_string(data, 16);
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
          [h('span', { slot: 'reference' }, [folded_text])],
        ) as TableColumnRenderReturn<T>);
  };
  const seller_name_column_render = <T extends boolean>(row: FinanceInvoice, text_only: T) => {
    const data = row.seller_name || '--';
    const { is_folded, folded_text } = get_limited_length_string(data, 16);
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
          [h('span', { slot: 'reference' }, [folded_text])],
        ) as TableColumnRenderReturn<T>);
  };
  // 税额
  const tax_amount_column_render = <T extends boolean>(row: FinanceInvoice, text_only: T) => {
    const data = Decimal2String(new Decimal(row.tax_amount));
    return text_only
      ? data
      : (h('span', { class: row.invoice_status === 5 ? 'red' : '' }, [
          data,
        ]) as TableColumnRenderReturn<T>);
  };

  const tax_excluded_amount_column_render = <T extends boolean>(
    row: FinanceInvoice,
    text_only: T,
  ) => {
    const data = Decimal2String(new Decimal(row.tax_excluded_amount));
    return text_only
      ? data
      : (h('span', { class: row.invoice_status === 5 ? 'red' : '' }, [
          data,
        ]) as TableColumnRenderReturn<T>);
  };

  // 购买方
  const buyer_name_column = computed<FinanceInvoiceCol>(() => ({
    label: '购买方',
    minWidth: max_length_of_column(data, '购买方', buyer_name_column_render).value + 0,
    formatter: row => buyer_name_column_render(row, false),
  }));

  // 销售方
  const seller_name_column = computed<FinanceInvoiceCol>(() => ({
    label: '销售方',
    minWidth: max_length_of_column(data, '销售方', seller_name_column_render).value + 0,
    formatter: row => seller_name_column_render(row, false),
  }));

  // 发票号码列
  const invoice_number_column = computed<FinanceInvoiceCol>(() => ({
    label: '发票号码',
    minWidth: 90,
    showOverflowTooltip: true,
    align: 'center',
    formatter: row => {
      return h('span', { class: row.invoice_status === 5 ? 'red' : '' }, row.invoice_number);
    },
  }));

  // 开票日期列
  const invoice_date_column = computed<FinanceInvoiceCol>(() => ({
    label: '发票日期',
    property: 'invoice_date',
    minWidth: 90,
    align: 'center',
    formatter: row => {
      return showProDateFormat(row.invoice_date * 1000, 'YYYY.MM.DD');
    },
  }));

  // 开票金额列
  const invoice_amount_column = computed<FinanceInvoiceCol>(() => ({
    label: '开票金额 (元)',
    property: 'total_amount',
    align: 'right',
    minWidth: max_length_of_column(data, '开票金额 (元)', invoice_amount_column_render).value,
    formatter: row => invoice_amount_column_render(row, false),
  }));

  // 未核销金额
  const invoice_not_amount_column = computed<FinanceInvoiceCol>(() => ({
    label: '未核销金额 (元)',
    property: 'not_write_off_amount',
    align: 'right',
    minWidth: max_length_of_column(data, '未核销金额 (元)', invoice_not_amount_column_render).value,
    formatter: row => invoice_not_amount_column_render(row, false),
  }));

  // 税率列
  const tax_rate_column = computed<FinanceInvoiceCol>(() => ({
    label: '税率',
    property: 'tax_rate',
    minWidth: 55,
    align: 'right',
    formatter: row => {
      return row.tax_rate + '%';
    },
  }));

  // 税额列
  const tax_amount_column = computed<FinanceInvoiceCol>(() => ({
    label: '税额 (元)',
    property: 'tax_amount',
    align: 'right',
    minWidth: max_length_of_column(data, '税额 (元)', tax_amount_column_render).value,
    formatter: row => tax_amount_column_render(row, false),
  }));

  // 不含税金额列
  const tax_excluded_amount_column = computed<FinanceInvoiceCol>(() => ({
    label: '不含税金额 (元)',
    property: 'tax_excluded_amount',
    align: 'right',
    minWidth: max_length_of_column(data, '不含税金额 (元)', tax_excluded_amount_column_render)
      .value,
    formatter: row => tax_excluded_amount_column_render(row, false),
  }));

  // 发票类型
  const invoice_type_column = computed<FinanceInvoiceCol>(() => ({
    label: '发票类型',
    property: 'invoice_type',
    align: 'center',
    minWidth: 80,
    formatter: row => {
      return row.invoice_type === 1 ? '销售发票' : '采购发票';
    },
  }));
  // 是否专票
  const invoice_Special_Ticket_column = computed<FinanceInvoiceCol>(() => ({
    label: '是否专票',
    property: 'is_special',
    align: 'center',
    minWidth: 80,
    formatter: row => {
      return row.is_special === 1 ? '是' : '否';
    },
  }));
  // 验真状态
  const invoice_real_type_column = computed<FinanceInvoiceCol>(() => ({
    label: '验真状态',
    property: 'is_verified',
    align: 'center',
    minWidth: 120,
    formatter: row => {
      const popoverItem = h(
        'el-popover',
        {
          props: {
            trigger: 'hover',
            placement: 'bottom-end',
            offset: 30,
            popperClass: 'finance-invoice-status-popper',
            openDelay: 300,
          },
        },
        [
          h('tg-icon', {
            style: 'font-size: 16px',
            props: { name: 'ico-a-yulaneye2x' },
            slot: 'reference',
          }),
          h('div', {}, [row.verified_desc || '']),
        ],
      );
      const bgcolor = new Map([
        [0, '#FF955F'],
        [1, '#33BA5D'],
        [-1, '#F04B4B'],
      ]).get(Number(row.is_verified));
      const titlestyle = 'padding: 0 5px; display: inline-block; ' + 'color:' + bgcolor;
      return h('div', { style: 'display: inline-block' }, [
        h('div', { style: titlestyle }, [
          row.is_verified === 1 ? '已验真' : row.is_verified === 0 ? '未验真' : '验真失败',
        ]),
        row.is_verified === -1 && row.verified_desc ? popoverItem : '',
      ]);
      /* return row.is_verified === 1 || row.is_verified === true
        ? '已验真'
        : row.is_verified === 0 || row.is_verified === false
        ? '未验真'
        : '验真失败';*/
    },
  }));

  const invoice_archive_column = computed<FinanceInvoiceCol>(() => ({
    label: '是否归档',
    property: 'invoice_status',
    align: 'center',
    minWidth: 80,
    formatter: row => {
      return row.archive_status ? '是' : '否';
    },
  }));

  const add_by_name_column = computed<FinanceInvoiceCol>(() => ({
    label: '上传人',
    property: 'add_by_name',
    align: 'center',
    'show-overflow-tooltip': true,
    minWidth: 80,
    formatter: row => {
      return row.add_by_name || '--';
    },
  }));

  // 发票状态
  const invoice_status_column = computed<FinanceInvoiceCol>(() => ({
    label: '发票状态',
    property: 'invoice_status',
    align: 'center',
    minWidth: 80,
    formatter: row => {
      let text = '--';
      switch (row.invoice_status) {
        case 1:
          text = '正常';
          break;
        case 2:
          text = '作废';
          break;
        case 3:
          text = '作废审批';
          break;
        case 4:
          text = '红冲审批';
          break;
        case 5:
          text = '红冲';
          break;
      }
      return text;
    },
  }));

  // 开票内容
  const invoice_content_column = computed<FinanceInvoiceCol>(() => ({
    label: '开票内容',
    property: 'invoice_content',
    align: 'center',
    minWidth: 120,
    formatter: row => {
      return row.raw_identify_data?.invoices[0]?.details.item_names?.split('*')[1] || '--';
    },
  }));

  // 核销状态
  const writeoff_status_column = computed<FinanceInvoiceCol>(() => ({
    label: '核销状态',
    property: 'write_off_status',
    align: 'center',
    minWidth: 124,
    formatter: row => {
      const status_str = InoviceWriteOffStatusMap.get(row.write_off_status);
      const bgcolor = new Map([
        [0, '#F04B4B'],
        [1, '#FF955F'],
        [2, '#33BA5D'],
      ]).get(row.write_off_status);

      const iconStyle = `display: inline-block; border-radius: 50%;margin-top:7px; width: 6px;height: 6px;background: ${bgcolor};`;

      const WriteOffRowList = [
        h('div', { class: 'finance-invoice-popper-header' }, [
          h('div', { style: 'width:180px' }, '结算单号'),
          h('div', { style: 'width:304px' }, '所属项目'),
          h(
            'div',
            {
              style: 'width:159px;',
            },
            '核销发票金额 (元)',
          ),
          h('div', { style: 'width: 110px; border-right: 1px solid #e3e8ec;' }, '发票账期时间'),
        ]),
      ];

      row.write_off_infos.forEach(info => {
        const item = h('div', { class: 'finance-invoice-popper-row' }, [
          h('div', { style: 'width:180px' }, info.settlement_uid),
          h('div', { style: 'width:304px', class: 'line-clamp-1' }, info.project_name),
          h('div', { style: 'width:159px; text-align:right' }, '' + info.write_off_amount),
          h(
            'div',
            { style: 'width: 110px; border-right: 1px solid #e3e8ec;', class: 'line-clamp-1' },
            info.account_detail_date
              ? `${moment(info.account_detail_date * 1000).format('yyyy.MM.DD')}`
              : '',
          ),
        ]);
        WriteOffRowList.push(item);
      });
      if (row.write_off_infos.length === 0) {
        WriteOffRowList.push(
          h(
            'div',
            { class: 'finance-invoice-popper-row', style: 'border-right: 1px solid #e3e8ec' },
            [h('div', { style: 'width: 493px;' }, ['暂无数据'])],
          ),
        );
      }

      const WriteOffListContainer = h('div', {}, WriteOffRowList);
      const popoverItem =
        row.write_off_infos.length === 0
          ? ''
          : h(
              'el-popover',
              {
                props: {
                  trigger: 'hover',
                  placement: 'bottom-end',
                  offset: 30,
                  popperClass: 'finance-invoice-status-popper',
                  openDelay: 300,
                },
              },
              [
                h('tg-icon', {
                  style: 'font-size: 16px',
                  props: { name: 'ico-a-yulaneye2x' },
                  slot: 'reference',
                }),
                h('div', {}, [WriteOffListContainer]),
              ],
            );

      return h('div', { style: 'display: flex;justify-content: center;' }, [
        h('div', {
          style: iconStyle,
        }),
        h('div', { style: 'padding: 0 5px; display: inline-block;width:60px;text-align:left' }, [
          status_str,
        ]),
        popoverItem || h('div', { style: 'padding: 0 5px; display: inline-block;width:16px;' }),
      ]);
    },
  }));

  // // 结算周期
  // const settlement_circle_column = computed<FinanceInvoiceCol>(() => ({
  //   label: '结算周期',
  //   property: 'invoice_pic_url',
  //   minWidth: 90,
  //   align: 'center',
  //   formatter: row => {
  //     return '2022.02.01';
  //   },
  // }));

  // // 账期时间
  // const billing_date_column = computed<FinanceInvoiceCol>(() => ({
  //   label: '账期时间',
  //   property: 'invoice_pic_url',
  //   minWidth: 90,
  //   align: 'center',
  //   formatter: row => {
  //     return '2022.02.11';
  //   },
  // }));

  // 发票
  const invoice_picture_column = computed<FinanceInvoiceCol>(() => ({
    label: '发票',
    property: 'invoice_pic_url',
    minWidth: 54,
    align: 'center',
    formatter: row => {
      const url = `${row.invoice_pic_url}?Authorization=${JWT_TOKEN}`;

      return h('tg-icon', {
        class: 'invoiceImageView',
        on: {
          click: () => {
            const hasPDF = /\.pdf\?.+$|\.pdf\??$/.test(url);
            if (hasPDF) {
              window.open(url);
            } else {
              showPreviewViewer([url]);
            }
          },
        },
        props: {
          name: 'ico-fapiao',
        },
      });
    },
  }));

  return {
    invoice_number_column,
    invoice_date_column,
    invoice_not_amount_column,
    invoice_amount_column,
    tax_rate_column,
    buyer_name_column,
    seller_name_column,
    tax_amount_column,
    tax_excluded_amount_column,
    invoice_type_column,
    invoice_real_type_column,
    invoice_Special_Ticket_column,
    add_by_name_column,
    invoice_status_column,
    invoice_content_column,
    invoice_archive_column,
    writeoff_status_column,
    // settlement_circle_column,
    // billing_date_column,
    invoice_picture_column,
  };
};
