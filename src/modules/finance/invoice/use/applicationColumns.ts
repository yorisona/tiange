import { computed, h } from '@vue/composition-api';
import { Decimal2String, get_limited_length_string } from '@/utils/string';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { max_length_of_column } from '@/utils/table';
import Decimal from 'decimal.js';
import { FinanceInvoiceUploadList } from '@/types/tiange/finance/invoice';
import type { TableColumn } from '@/types/vendor/column';
export type InvoiceCol = TableColumn<FinanceInvoiceUploadList>;

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
export const useColumns = (list: any) => {
  /** 审批编号渲染函数 */
  const approve_code_render = (row: any) => {
    return h(
      'div',
      {
        class: 'number-div',
      },
      [
        h(
          'span',
          {
            class: 'number-span',
          },
          row.approval_uid,
        ),
      ],
    );
  };
  /** 公司名称渲染函数 */
  const company_name_render = <T extends boolean>(row: any, text_only: T) => {
    return popoverFun(row, 'collecting_company', 14, text_only);
  };
  /** 公司名称最大宽度 */
  const company_name_max_length = max_length_of_column(list, '公司名称', company_name_render);

  /** 发票金额 */
  const invoice_amount_column_render = <T extends boolean>(row: any, text_only: T) => {
    const data = Decimal2String(new Decimal(row.approval_content.invoice_amount));
    return text_only ? data : (h('span', {}, [data]) as TableColumnRenderReturn<T>);
  };

  // 审批编号
  const approve_code_column = computed<InvoiceCol>(() => ({
    label: '审批编号',
    minWidth: 230,
    formatter: row => approve_code_render(row),
  }));

  // 公司名称
  const company_name_column = computed<InvoiceCol>(() => ({
    label: '公司名称',
    minWidth: company_name_max_length.value + 20,
    formatter: row => company_name_render(row, false),
  }));

  // 开票金额
  const invoice_amount_column = computed<InvoiceCol>(() => ({
    label: '开票金额 (元)',
    minWidth: 140,
    align: 'right',
    formatter: row => invoice_amount_column_render(row, false),
  }));

  // 发起人
  const username_column = computed<InvoiceCol>(() => ({
    label: '发起人',
    minWidth: 120,
    align: 'center',
    formatter: row => {
      return row.approval_content.username;
    },
  }));

  // 发起时间
  const start_time_column = computed<InvoiceCol>(() => ({
    label: '发起时间',
    property: 'start_time',
    align: 'center',
    minWidth: 120,
  }));

  // 审批状态
  const approval_status_column = computed<InvoiceCol>(() => ({
    label: '审批状态',
    minWidth: 120,
    align: 'center',
    formatter: row => {
      let text = '--';
      let className = '';
      switch (row.approval_status) {
        case 1:
          text = '审批中';
          className = 'waiting';
          break;
        case 2:
          text = '审批成功';
          className = 'success';
          break;
        case 3:
          text = '审批失败';
          className = 'failure';
          break;
        case 4:
          text = '已撤销';
          className = 'cancel';
          break;
      }

      return h('span', { class: 'status-box' }, [
        h('span', { class: `point ${className}` }),
        h('span', { class: 'text' }, text),
      ]);
    },
  }));

  // 开票状态
  const invoiced_column = computed<InvoiceCol>(() => ({
    label: '开票状态',
    minWidth: 120,
    align: 'center',
    formatter: row => {
      let text = '--';
      if (row.invoiced === 0) {
        text = '未开票';
      } else if (row.invoiced === 1) {
        text = '已开票';
      }
      return h(
        'span',
        {
          style: {
            color: row.invoiced === 0 ? '#f04b4b' : '#33ba5d',
          },
        },
        text,
      );
    },
  }));

  return {
    approve_code_column,
    company_name_column,
    invoice_amount_column,
    username_column,
    start_time_column,
    approval_status_column,
    invoiced_column,
  };
};
