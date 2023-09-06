/**
 * 列设置相关
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-03 15:49:06
 */
import { computed, ref, h } from '@vue/composition-api';
import { Ref } from '@vue/composition-api';
import {
  SettlementTypeMap,
  SettlementStatusMap,
  SettlementStatus,
  SettlementScanStatusMap,
  // SettlementType,
} from '@/types/tiange/finance/settlement';
import { Settlement } from '@/types/tiange/finance/settlement';
import { TableColumn } from '@/types/vendor/column';
import Decimal from 'decimal.js';
import { Decimal2String, fillEmptyStr, get_limited_length_string } from '@/utils/string';
import moment from 'moment';
import {
  get_reversed_classname,
  is_reversed_order as is_reversed_settlement,
  is_refunded_order,
} from '@/use/finance';
import { ReverseStatus, ReverseStatusMap } from '@/types/tiange/finance/finance';
import { max_length_of_column } from '@/utils/table';
import { TableColumnRenderReturn } from '@/types/tiange/utils';

/** 结算供应商渲染函数 */
const settlement_supplier_render = (row: Settlement) => {
  // const { settlement_type } = row;
  // if (
  //   settlement_type === SettlementType.live_taobao ||
  //   settlement_type === SettlementType.live_douyin
  // ) {
  //   // return '主播工资';
  //   return row.company_name || '--';
  // } else if (
  //   [
  //     SettlementType.common_mcn_taobao_cps,
  //     SettlementType.common_mcn_douyin_cps,
  //     SettlementType.common_mcn_vtask,
  //     SettlementType.s2b2c_douyin_cps,
  //   ].includes(settlement_type)
  // ) {
  //   return row.company_name || '--';
  // } else if (
  //   [SettlementType.marketing_marketing, SettlementType.marketing_vtask].includes(settlement_type)
  // ) {
  return row.company_name || '--';
  // } else {
  //   return '--';
  // }
};

const dateFormat = (timestamp: number) =>
  timestamp === 0 ? '--' : moment(timestamp * 1000).format('YYYY.MM.DD');

export type SettlementCol = TableColumn<Settlement>;

/** 结算列表的普通列 */
export const useColumns = (data: Ref<Settlement[]>) => {
  /** 结算编号渲染函数 */
  const settlement_uid_render = <T extends boolean>(
    row: Settlement,
    text_only: T,
  ): TableColumnRenderReturn<T> => {
    return h(
      'div',
      {
        class: 'number-div',
      },
      [
        h(
          'span',
          {
            class: `number-span ${
              text_only || row.reversed_id !== null || row.reverse_id !== null
                ? 'reverse-red'
                : // : row.refunded_id !== null
                row.refunded_id !== null
                ? 'reverse-red'
                : (row.refund_amount !== 0 && row.refund_amount !== row.tax_included_amount) ||
                  (row.reverse_amount !== 0 && row.reverse_amount !== row.tax_included_amount)
                ? 'reverse-orange'
                : (row.refund_amount !== 0 && row.refund_amount === row.tax_included_amount) ||
                  (row.reverse_amount !== 0 && row.reverse_amount !== row.tax_included_amount)
                ? 'reverse-red'
                : ''
              // : ''
            }`,
            // style: {
            //   color:
            //     row.refund_amount !== 0 && row.refund_amount !== row.tax_included_amount
            //       ? '#fb8500!important'
            //       : // : row.write_off_status === 1 && row.reverse_id
            //         // ? '#fb8500'
            //         '',
            // },
          },
          row.settlement_uid,
        ),
      ],
    ) as TableColumnRenderReturn<T>;
  };
  /** 对应收入结算渲染函数 */
  const income_settlement_uid_render = <T extends boolean>(
    row: Settlement,
  ): TableColumnRenderReturn<T> => {
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
          row.related_income_settlement_uid || '--',
        ),
      ],
    ) as TableColumnRenderReturn<T>;
  };
  const settlement_company_render = <T extends boolean>(row: Settlement, text_only: T) => {
    const data = row.company_name || '--';
    const { is_folded, folded_text } = get_limited_length_string(data, 15);
    if (text_only) {
      return folded_text;
    }

    return is_folded
      ? (h(
          'el-popover',
          {
            props: {
              placement: 'bottom',
              trigger: 'hover',
              content: data,
            },
          },
          [h('span', { slot: 'reference' }, [folded_text])],
        ) as TableColumnRenderReturn<T>)
      : folded_text;
  };

  /** 结算金额渲染函数 */
  const total_settle_amount_render = <T extends boolean>(row: Settlement, text_only: T) => {
    const data = Decimal2String(new Decimal(row.tax_included_amount ?? 0));
    return text_only
      ? data
      : (h('span', get_reversed_classname(row), [data]) as TableColumnRenderReturn<T>);
  };

  /** 结算金额最大宽度 */
  const total_settle_amount_max_length = max_length_of_column(
    data,
    '含税结算金额 (元)',
    total_settle_amount_render,
  );

  /** 税额渲染函数 */
  const tax_amount_render = <T extends boolean>(row: Settlement, text_only: T) => {
    let data = '--';
    if (row.tax_amount === undefined || isNaN(Number(`${row.tax_amount}`))) {
      return data;
    }
    data = Decimal2String(new Decimal(row.tax_amount));
    return text_only
      ? data
      : (h('span', get_reversed_classname(row), [data]) as TableColumnRenderReturn<T>);
  };
  /** 税额最大宽度 */
  const tax_amount_max_length = max_length_of_column(data, '税额 (元)', tax_amount_render);

  /** 不含税金额渲染函数 */
  const no_tax_amount_render = <T extends boolean>(row: Settlement, text_only: T) => {
    let data = '--';
    if (row.tax_excluded_amount === undefined || isNaN(Number(`${row.tax_excluded_amount}`))) {
      return data;
    }
    data = Decimal2String(new Decimal(row.tax_excluded_amount));
    return text_only
      ? data
      : (h('span', get_reversed_classname(row), [data]) as TableColumnRenderReturn<T>);
  };

  /** 不含税金额最大宽度 */
  const no_tax_amount_max_length = max_length_of_column(
    data,
    '不含税金额 (元)',
    no_tax_amount_render,
  );

  /** 已付金额渲染函数 */
  const paid_amount_render = <T extends boolean>(row: Settlement, text_only: T) => {
    let data = '--';
    if (row.paid_amount === undefined || isNaN(Number(`${row.paid_amount}`))) {
      return data;
    }
    data = Decimal2String(new Decimal(row.paid_amount));
    return text_only
      ? data
      : (h('span', get_reversed_classname(row), [data]) as TableColumnRenderReturn<T>);
  };

  /** 已付金额最大宽度 */
  const paid_amount_max_length = max_length_of_column(data, '已付金额 (元)', paid_amount_render);

  /** 未付金额渲染函数 */
  const not_paid_amount_render = <T extends boolean>(row: Settlement, text_only: T) => {
    let data = '--';
    if (row.pending_amount === undefined || isNaN(Number(`${row.pending_amount}`))) {
      return data;
    }
    data = Decimal2String(new Decimal(row.pending_amount));
    return text_only
      ? data
      : (h('span', get_reversed_classname(row), [data]) as TableColumnRenderReturn<T>);
  };

  /** 未付金额最大宽度 */
  const not_paid_amount_max_length = max_length_of_column(
    data,
    '未付金额 (元)',
    not_paid_amount_render,
  );

  /** 项目名称渲染函数 */
  const project_name_render = <T extends boolean>(
    row: Settlement,
    text_only: T,
  ): TableColumnRenderReturn<T> => {
    const data = row.project_name || '--';
    const { is_folded, folded_text } = get_limited_length_string(data);

    if (text_only) {
      return folded_text;
    }

    return is_folded
      ? (h(
          'el-popover',
          {
            props: {
              placement: 'bottom',
              trigger: 'hover',
              content: data,
            },
          },
          [h('span', { slot: 'reference' }, [folded_text])],
        ) as TableColumnRenderReturn<T>)
      : folded_text;
  };

  /** 项目名称渲染函数 */
  const feishu_department_name_render = <T extends boolean>(
    row: Settlement,
    text_only: T,
  ): TableColumnRenderReturn<T> => {
    const data = row.feishu_department_name || '--';
    const { is_folded, folded_text } = get_limited_length_string(data);

    if (text_only) {
      return folded_text;
    }

    return is_folded
      ? (h(
          'el-popover',
          {
            props: {
              placement: 'bottom',
              trigger: 'hover',
              content: data,
            },
          },
          [h('span', { slot: 'reference' }, [folded_text])],
        ) as TableColumnRenderReturn<T>)
      : folded_text;
  };
  /** 项目名称最大宽度 */
  const project_name_max_length = max_length_of_column(data, '项目名称', project_name_render);

  const feishu_department_name_max_length = max_length_of_column(
    data,
    '所属部门',
    feishu_department_name_render,
  );

  /** 结算类型渲染函数 */
  const settlement_type_render = <T>(row: Settlement, _text_only: T) =>
    SettlementTypeMap.get(row.settlement_type) ?? '--';

  /** 结算类型最大宽度 */
  const settlement_type_max_length = max_length_of_column(data, '结算类型', settlement_type_render);

  /** 结算供应商最大宽度 */
  const settlement_supplier_max_length = max_length_of_column(
    data,
    '结算供应商',
    settlement_supplier_render,
  );

  const settlement_number_column = computed<SettlementCol>(() => ({
    label: '结算编号',
    property: 'settlement_uid',
    fixed: 'left',
    minWidth: 165,
    formatter: row => settlement_uid_render(row, false),
  }));

  const settlement_company_column = computed<SettlementCol>(() => ({
    label: '结算客户',
    property: 'company_name',
    align: 'left',
    minWidth: max_length_of_column(data, '结算公司', settlement_company_render).value,
    formatter: row => settlement_company_render(row, false),
    showOverflowTooltip: true,
  }));
  const settlement_income_type_column = computed<SettlementCol>(() => ({
    label: '收入类型',
    property: 'income_type_str',
    align: 'center',
    minWidth: 110,
    formatter: row => {
      return row.income_type_str || '--'; // row.settlement_type || '--';
    },
  }));
  const settlement_cost_type_column = computed<SettlementCol>(() => ({
    label: '成本类型',
    property: 'cost_type_str',
    align: 'center',
    minWidth: 110,
    formatter: row => {
      return row.cost_type_str || '--'; // row.settlement_type || '--';
    },
  }));

  const settlement_cycle_column = ref<SettlementCol>({
    label: '结算周期',
    property: 'start_date',
    width: 170,
    align: 'center',
    formatter: row =>
      [row.start_date, row.end_date].map(el => moment(el * 1000).format('YYYY.MM.DD')).join(' ~ '),
  });

  const bill_period_column = ref<SettlementCol>({
    label: '账期时间',
    property: 'start_date',
    minWidth: 100,
    align: 'center',
    formatter: row =>
      row.account_detail_date ? moment(row.account_detail_date * 1000).format('YYYY.MM') : '--',
  });

  const settlement_money_column = computed<SettlementCol>(() => ({
    label: '含税结算金额 (元)',
    property: 'tax_included_amount',
    align: 'right',
    headerAlign: 'right',
    minWidth: total_settle_amount_max_length.value,
    formatter: row => total_settle_amount_render(row, false),
  }));

  const settlement_tax_rate_column = computed<SettlementCol>(() => ({
    label: '税率',
    property: 'tax_rate',
    align: 'right',
    headerAlign: 'right',
    minWidth: 68,
    formatter: row => {
      return !isNaN(Number(`${row.tax_rate}`)) ? `${row.tax_rate}%` : '--';
    },
  }));
  const settlement_tax_amount_column = computed<SettlementCol>(() => ({
    label: '税额 (元)',
    property: 'tax_amount',
    align: 'right',
    headerAlign: 'right',
    minWidth: tax_amount_max_length.value,
    formatter: row => tax_amount_render(row, false),
  }));
  const settlement_no_tax_amount_column = computed<SettlementCol>(() => ({
    label: '不含税金额 (元)',
    property: 'tax_excluded_amount',
    align: 'right',
    headerAlign: 'right',
    minWidth: no_tax_amount_max_length.value,
    formatter: row => no_tax_amount_render(row, false),
  }));
  const paid_amount_column = computed<SettlementCol>(() => ({
    label: '已付金额 (元)',
    property: 'tax_excluded_amount',
    align: 'right',
    headerAlign: 'right',
    minWidth: paid_amount_max_length.value,
    formatter: row => paid_amount_render(row, false),
  }));
  const not_paid_amount_column = computed<SettlementCol>(() => ({
    label: '待付金额 (元)',
    property: 'tax_excluded_amount',
    align: 'right',
    headerAlign: 'right',
    minWidth: not_paid_amount_max_length.value,
    formatter: row => not_paid_amount_render(row, false),
  }));

  const settlement_status_column = ref<SettlementCol>({
    label: '结算状态',
    property: 'status',
    width: 120,
    align: 'center',
    formatter: row => {
      const statusBGColorMaps = new Map([
        [0, 'rgba(60,82,105,0.60);'],
        [1, '#FF955F'],
        [2, '#33BA5D'],
        [3, '#F04B4B'],
        [4, '#FF955F'],
        [5, '#F04B4B'],
      ]);
      if (is_reversed_settlement(row)) {
        return h('div', { style: 'display: flex;justify-content: center' }, '--');
      } else if (is_refunded_order(row)) {
        const { refund_status = 0 } = row;
        const bgColor = statusBGColorMaps.get(refund_status);
        const iconStyle = `display: inline-block; border-radius: 50%; width: 6px;height: 6px;margin-top:7px;background: ${bgColor};`;
        const status_str = SettlementStatusMap.get(refund_status) ?? '--';
        return h('div', { style: 'display: flex;justify-content: center;padding-left:22px' }, [
          h('div', {
            style: iconStyle,
          }),
          h(
            'div',
            { style: 'padding: 0 0 0 5px; width:70px;  display: inline-block;text-align:left' },
            [status_str],
          ),
        ]);
      } else {
        const { status } = row;
        const bgColor = statusBGColorMaps.get(row.status);
        const iconStyle = `display: inline-block; border-radius: 50%; width: 6px;margin-top:7px;height: 6px;background: ${bgColor};`;
        const status_str = SettlementStatusMap.get(status) ?? '--';
        return h('div', { style: 'display: flex;justify-content: center;padding-left:22px' }, [
          h('div', {
            style: iconStyle,
          }),
          h(
            'div',
            { style: 'padding:0 0 0 5px;width:70px; display: inline-block;text-align:left' },
            [status_str],
          ),
        ]);
      }
    },
  });

  const write_off_status_column = ref<SettlementCol>({
    label: '冲销状态',
    property: 'status',
    align: 'center',
    minWidth: 78,
    formatter: row => {
      if (is_reversed_settlement(row)) {
        const { reverse_status } = row;

        const className =
          ReverseStatus.wait_confirm === reverse_status
            ? 'fg-waiting'
            : reverse_status === ReverseStatus.refused
            ? 'fg-failure'
            : 'fg-success';

        return h('span', { class: className }, ReverseStatusMap.get(reverse_status) ?? '--');
      } else {
        return '--';
      }
    },
  });

  const settlement_person_column = ref<SettlementCol>({
    label: '结算人',
    property: 'submit_username',
    minWidth: 80,
    align: 'center',
    formatter: row => fillEmptyStr(row.submit_username),
  });

  const submit_date_column = ref<SettlementCol>({
    label: '提交日期',
    property: 'submit_time',
    minWidth: 92,
    align: 'center',
    formatter: row => dateFormat(row.submit_time),
  });

  const confirm_person_column = ref<SettlementCol>({
    label: '确认人',
    minWidth: 80,
    align: 'center',
    property: 'confirmed_username',
    formatter: row =>
      row.status === SettlementStatus.confirmed ? fillEmptyStr(row.confirmed_username) : '--',
  });

  const confirm_date_column = ref<SettlementCol>({
    label: '确认日期',
    align: 'center',
    property: 'confirmed_time',
    minWidth: 92,
    formatter: row =>
      row.status === SettlementStatus.confirmed ? dateFormat(row.confirmed_time) : '--',
  });

  // 以下财务-成本结算独有

  const income_settlement_column = ref<SettlementCol>({
    label: '对应收入结算',
    fixed: 'left',
    minWidth: 160,
    formatter: row => income_settlement_uid_render(row),
  });

  /** 项目名称列(财务) */
  const project_name_colume = computed<SettlementCol>(() => ({
    label: '项目名称',
    property: 'project_name',
    minWidth: project_name_max_length.value,
    fixed: 'left',
    formatter: row => project_name_render(row, false),
  }));
  const department_name_colume = computed<SettlementCol>(() => ({
    label: '所属部门',
    property: 'feishu_department_name',
    align: 'center',
    minWidth: feishu_department_name_max_length.value + 10,
    formatter: row => feishu_department_name_render(row, false),
  }));

  /** 结算类型列(财务) */
  const settlement_type_column = computed<SettlementCol>(() => ({
    label: '结算类型',
    property: 'settlement_type',
    align: 'center',
    minWidth: settlement_type_max_length.value,
    formatter: row => settlement_type_render(row, false),
  }));

  const settlement_supplier_column = computed<SettlementCol>(() => ({
    label: '结算供应商',
    minWidth: settlement_supplier_max_length.value,
    formatter: settlement_supplier_render,
    showOverflowTooltip: true,
  }));

  const settlement_bill_column = ref<SettlementCol>({
    label: '结算单',
    align: 'center',
    formatter: row => (row.settlement_files.length ? '已上传' : '--'),
  });
  const scan_file_status_column = ref<SettlementCol>({
    label: '扫描件归档',
    property: 'settlement_scan_status',
    width: 98,
    align: 'center',
    formatter: row => {
      const statusBGColorMaps = new Map([
        [0, 'rgba(60,82,105,0.60);'],
        [1, '#FF955F'],
        [2, '#33BA5D'],
        [3, '#F04B4B'],
      ]);
      const status = row.settlement_scan_status || 0;
      /** 冲销订单，退款订单,暂估订单,完全退款*/
      if (
        is_reversed_settlement(row) ||
        is_refunded_order(row) ||
        row.is_estimate === 1 ||
        (row.refund_amount !== 0 && row.refund_amount === row.tax_included_amount && status === 0)
      ) {
        return h('div', { style: 'display: flex;justify-content: center' }, '--');
      } else {
        /** 已确认结算 */
        if (row.status === 2) {
          const bgColor = statusBGColorMaps.get(status);
          const iconStyle = `display: inline-block; border-radius: 50%; width: 6px;height: 6px;margin-top:7px;background: ${bgColor};`;
          const status_str = SettlementScanStatusMap.get(status) ?? '--';
          return h('div', { style: 'display: flex;justify-content: center;padding-left:15px' }, [
            h('div', {
              style: iconStyle,
            }),
            h(
              'div',
              { style: 'padding: 0 0 0 5px; width:60px;  display: inline-block;text-align:left' },
              [status_str],
            ),
          ]);
        } else {
          return h('div', { style: 'display: flex;justify-content: center' }, '--');
        }
      }
    },
  });
  return {
    settlement_cost_type_column,
    settlement_income_type_column,
    scan_file_status_column,
    settlement_number_column,
    settlement_company_column,
    settlement_cycle_column,
    bill_period_column,
    settlement_money_column,
    settlement_tax_rate_column,
    settlement_tax_amount_column,
    settlement_no_tax_amount_column,
    paid_amount_column,
    not_paid_amount_column,
    settlement_status_column,
    write_off_status_column,
    settlement_person_column,
    submit_date_column,
    confirm_person_column,
    confirm_date_column,
    income_settlement_column,
    project_name_colume,
    department_name_colume,
    settlement_type_column,
    settlement_supplier_column,
    settlement_bill_column,
  };
};
