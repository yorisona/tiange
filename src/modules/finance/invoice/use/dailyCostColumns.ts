/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-03-15 13:08:49
 */

import { DailyCostModel, FinaceSpendingTypeMap } from '@/types/tiange/finance/finance';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { TgTableColumn } from '@/types/vendor/column';
import { formatAmountWithoutPrefix, get_limited_length_string } from '@/utils/string';
import { max_length_of_column } from '@/utils/table';
import { computed, h, Ref } from '@vue/composition-api';

export type DailyCostCol = TgTableColumn<DailyCostModel>;

export const useColumns = (dailyData: Ref<DailyCostModel[]>) => {
  const render_popover = <T extends boolean>(data: string, text_only: T) => {
    const { is_folded, folded_text } = get_limited_length_string(data);
    return text_only || !is_folded
      ? folded_text
      : (h(
          'el-popover',
          {
            props: {
              placement: 'top',
              trigger: 'hover',
              content: data,
              width: 234,
              openDelay: 300,
            },
          },
          [h('span', { slot: 'reference' }, [folded_text])],
        ) as TableColumnRenderReturn<T>);
  };

  const pay_no_column_formater = <T extends boolean>(row: DailyCostModel, _: T) => {
    const data = row.form_code ? `${row.form_code}` : '--';
    return data;
  };
  // const pay_reason_column_formater = <T extends boolean>(row: DailyCostModel, text_only: T) => {
  //   const data = row.reimburse_name ? row.reimburse_name : '--';
  //   return render_popover(data, text_only);
  //   // const { is_folded, folded_text } = get_limited_length_string(data);
  //   // return text_only || !is_folded
  //   //   ? folded_text
  //   //   : (render_popover(data, folded_text) as TableColumnRenderReturn<T>);
  // };
  // const fee_department_column_formater = <T extends boolean>(row: DailyCostModel, text_only: T) => {
  //   const data = row.multistage_department_name ? row.multistage_department_name : '--';
  //   return render_popover(data, text_only);
  // };
  const apply_by_column_formatter = <T extends boolean>(row: DailyCostModel, text_only: T) => {
    const data = row.reim_employee_name ? row.reim_employee_name : '--';
    return render_popover(data, text_only);
  };
  // const account_name_column_formatter = <T extends boolean>(row: DailyCostModel, text_only: T) => {
  //   const data = row.bank_acct_name ? row.bank_acct_name : '--';
  //   return render_popover(data, text_only);
  // };

  // const account_column_formater = <T extends boolean>(row: DailyCostModel, text_only: T) => {
  //   const data = row.bank_acct_number ? row.bank_acct_number : '--';
  //   return render_popover(data, text_only);
  // };

  const exclude_tax_amount_column_formater = <T extends boolean>(row: DailyCostModel, _: T) => {
    const data = formatAmountWithoutPrefix(row.tax_excluded_amount ?? 0);
    return data;
  };
  const tax_amount_column_formater = <T extends boolean>(row: DailyCostModel, _: T) => {
    const data = formatAmountWithoutPrefix(row.tax_amount ?? 0);
    return data;
  };
  const ccountant_type_column_formatter = <T extends boolean>(row: DailyCostModel, _: T) => {
    const data = row.expense_category_name ? row.expense_category_name : '--';
    return data;
  };
  const spending_type_column_formatter = <T extends boolean>(row: DailyCostModel, _: T) => {
    const data = row.expense_type_name ? row.expense_type_name : '--';
    return data;
  };
  const need_pay_amount_column_formater = <T extends boolean>(row: DailyCostModel, _: T) => {
    const data = formatAmountWithoutPrefix(row.payment_amount ?? 0);
    return data;
  };
  const need_loan_write_off_column_formater = <T extends boolean>(row: any, _: T) => {
    const data = formatAmountWithoutPrefix(row.loan_write_off ?? 0);
    return data;
  };
  const pay_amount_amount_column_formater = <T extends boolean>(row: DailyCostModel, _: T) => {
    const data = formatAmountWithoutPrefix(row.approved_amount ?? 0);
    return data;
  };
  const remark_column_formatter = <T extends boolean>(row: DailyCostModel, text_only: T) => {
    const data = row.comment ? row.comment : '--';
    return render_popover(data, text_only);
  };

  const transform_way_column_formater = <T extends boolean>(row: DailyCostModel, _: T) => {
    const data = row.payer_bank_account_name ? row.payer_bank_account_name : '--';
    return data;
  };
  const project_column_formater = <T extends boolean>(row: DailyCostModel, _: T) => {
    const data = row.project_name ? row.project_name : '--';
    return data;
  };

  const columns = {
    pay_no_column: computed<DailyCostCol>(() => ({
      label: '付款编号',
      align: 'center',
      dataType: 'text',
      minWidth: max_length_of_column(dailyData, '付款编号', pay_no_column_formater).value,
      formatter: row => pay_no_column_formater(row, false),
    })),
    date_column: computed<DailyCostCol>(() => ({
      label: '日期',
      minWidth: 110,
      align: 'center',
      dataType: 'text',
      prop: 'settled_at',
    })),
    pay_reason_column: computed<DailyCostCol>(() => ({
      label: '付款事由',
      dataType: 'text',
      minWidth: 160,
      prop: 'reimburse_name',
      showOverflowTooltip: true,
      // minWidth: max_length_of_column(dailyData, '付款事由', pay_reason_column_formater).value,
      // formatter: row => pay_reason_column_formater(row, false),
    })),
    apply_by_column: computed<DailyCostCol>(() => ({
      label: '申请人',
      // minWidth: 140,
      align: 'center',
      dataType: 'text',
      // prop: 'reim_employee_name',
      minWidth: max_length_of_column(dailyData, '申请人', apply_by_column_formatter).value,
      formatter: row => apply_by_column_formatter(row, false),
    })),
    fee_department_column: computed<DailyCostCol>(() => ({
      label: '费用归属部门',
      dataType: 'text',
      minWidth: 200,
      prop: 'multistage_department_name',
      showOverflowTooltip: true,
      // minWidth: max_length_of_column(dailyData, '费用归属部门', fee_department_column_formater)
      //   .value,
      // formatter: row => fee_department_column_formater(row, false),
    })),
    account_name_column: computed<DailyCostCol>(() => ({
      label: '户名',
      // minWidth: max_length_of_column(dailyData, '户名', account_name_column_formatter).value,
      dataType: 'text',
      minWidth: 160,
      prop: 'bank_acct_name',
      showOverflowTooltip: true,
      // formatter: row => account_name_column_formatter(row, false),
    })),
    account_column: computed<DailyCostCol>(() => ({
      label: '账号',
      dataType: 'text',
      minWidth: 160,
      prop: 'bank_acct_number',
      showOverflowTooltip: true,
      // prop: 'bank_acct_number',
      // minWidth: max_length_of_column(dailyData, '账号', account_column_formater).value,
      // formatter: row => account_column_formater(row, false),
    })),
    cost_type_column: computed<DailyCostCol>(() => ({
      label: '支出类型',
      minWidth: 80,
      align: 'center',
      formatter: row => FinaceSpendingTypeMap.get(row.pay_type) ?? '--',
    })),
    exclude_tax_amount_column: computed<DailyCostCol>(() => ({
      label: '不含税金额 (元)',
      align: 'right',
      dataType: 'money',
      minWidth: 160,
      // minWidth: max_length_of_column(
      //   dailyData,
      //   '不含税金额 (元)',
      //   exclude_tax_amount_column_formater,
      // ).value,
      formatter: row => exclude_tax_amount_column_formater(row, false),
    })),
    tax_amount_column: computed<DailyCostCol>(() => ({
      label: '税额 (元)',
      align: 'right',
      dataType: 'money',
      minWidth: max_length_of_column(dailyData, '税额 (元)', tax_amount_column_formater).value,
      formatter: row => tax_amount_column_formater(row, false),
    })),
    need_pay_amount_column: computed<DailyCostCol>(() => ({
      label: '批准金额 (元)',
      align: 'right',
      dataType: 'money',
      minWidth: 140,
      // minWidth: max_length_of_column(dailyData, '应付金额 (元)', need_pay_amount_column_formater)
      //   .value,
      formatter: row => need_pay_amount_column_formater(row, false),
    })),
    loan_write_off: computed<DailyCostCol>(() => ({
      label: '借款核销 (元)',
      align: 'right',
      dataType: 'money',
      minWidth: max_length_of_column(
        dailyData,
        '借款核销 (元)',
        need_loan_write_off_column_formater,
      ).value,
      formatter: row => need_loan_write_off_column_formater(row, false),
    })),
    pay_amount_amount_column: computed<DailyCostCol>(() => ({
      label: '实付金额 (元)',
      align: 'right',
      dataType: 'money',
      minWidth: 140,
      // minWidth: max_length_of_column(dailyData, '实付金额 (元)', pay_amount_amount_column_formater)
      //   .value,
      formatter: row => pay_amount_amount_column_formater(row, false),
    })),
    invoice_column: computed<DailyCostCol>(() => ({
      label: '发票',
      minWidth: 60,
      align: 'center',
      formatter: row => (row.has_invoice ? '有' : '无'),
    })),
    ccountant_type_column: computed<DailyCostCol>(() => ({
      label: '会计科目',
      minWidth: max_length_of_column(dailyData, '会计科目', ccountant_type_column_formatter).value,
      align: 'center',
      dataType: 'text',
      prop: 'expense_category_name',
      formatter: row => ccountant_type_column_formatter(row, false),
    })),
    spending_type_column: computed<DailyCostCol>(() => ({
      label: '费用类别',
      minWidth: max_length_of_column(dailyData, '费用类别', spending_type_column_formatter).value,
      align: 'center',
      dataType: 'text',
      prop: 'expense_type_name',
      formatter: row => spending_type_column_formatter(row, false),
    })),
    subject_name_column: computed<DailyCostCol>(() => ({
      label: '管报科目',
      minWidth: 120,
      align: 'center',
      dataType: 'text',
      prop: 'subject_name',
    })),
    remark_column: computed<DailyCostCol>(() => ({
      label: '备注',
      minWidth: max_length_of_column(dailyData, '备注', remark_column_formatter).value,
      align: 'left',
      dataType: 'text',
      prop: 'comment',
      formatter: row => remark_column_formatter(row, false),
    })),
    transform_way_column: computed<DailyCostCol>(() => ({
      label: '转出路径',
      align: 'left',
      dataType: 'text',
      // prop: 'payer_bank_account_name',
      minWidth: max_length_of_column(dailyData, '转出路径', transform_way_column_formater).value,
      formatter: row => transform_way_column_formater(row, false),
    })),
    project_column: computed<DailyCostCol>(() => ({
      label: '项目',
      align: 'left',
      dataType: 'text',
      minWidth: max_length_of_column(dailyData, '项目', project_column_formater).value,
      formatter: row => project_column_formater(row, false),
    })),
  };

  return computed(() => Object.values(columns).map(el => el.value));
};
