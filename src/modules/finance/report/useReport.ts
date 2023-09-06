/*
 * @Author: 肖槿
 * @Date: 2021-12-15 14:03:09
 * @Description: 财务明细逻辑
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-03-02 11:05:11
 * @FilePath: \goumee-star-frontend\src\modules\finance\report\useReport.ts
 */
import { SetupContext, reactive, toRefs } from '@vue/composition-api';
import {
  GetFinanceReport,
  GetFinancePreincome,
  GetFinancePrepay,
  GetFinanceReportSnapshot,
} from '@/services/finance/report';
import { getToken } from '@/utils/token';
import qs from 'query-string';
import { ObjectFilterEmpty } from '@/utils/func';
import { numberFormat } from '@/utils/formatMoney';
import { SettlementTypeMap } from '@/types/tiange/finance/settlement';
import { reportFilterParams, busType, platformType, IncomeOrPaySearchType } from './reportType';
import { GetFinanceInvoiceList } from '@/services/finance/invoice';
import { TableColumn } from '@/types/vendor/column';
import days from 'moment';
// import moment from 'moment';
type Col = TableColumn<any>;

export const useReport = (ctx: SetupContext) => {
  const reportData = reactive<{ params: reportFilterParams; loading: boolean; tableData: any }>({
    loading: false,
    params: {
      date: days(new Date()).subtract(1, 'months').startOf('month').format('YYYY-MM'),
      account_detail_date: days(new Date())
        .subtract(1, 'months')
        .startOf('month')
        .format('YYYY-MM'),
      business_type: undefined,
      project_name: '',
      income_search_type: IncomeOrPaySearchType.incomeDate,
      pay_search_type: IncomeOrPaySearchType.payDate,
      income_date: undefined,
      pay_date: undefined,
      settlement_date: undefined,
    },
    tableData: undefined,
  });
  const getData = async (params: reportFilterParams) => {
    reportData.loading = true;
    const { income_date, income_search_type, pay_date, pay_search_type, ...rest } = params;
    if (income_date) {
      rest.income_or_pay_search_type = income_search_type;
      rest.income_or_pay_date = income_date;
    } else if (pay_date) {
      rest.income_or_pay_search_type = pay_search_type;
      rest.income_or_pay_date = pay_date;
    } else {
      rest.income_or_pay_search_type = undefined;
      rest.income_or_pay_date = undefined;
    }
    // const {
    //   data: { data },
    // } = await GetFinanceReport(rest);
    const res = await GetFinanceReport(rest);
    const { data } = res.data;
    reportData.loading = false;
    reportData.tableData = data;
    if (!res.data.success) {
      ctx.root.$message.error(res.data.message);
    }
    return data;
  };
  return {
    ...toRefs(reportData),
    getData,
  };
};

export function exportReport(
  params: reportFilterParams,
  path = '/api/financial/export_financial_report',
): void {
  const _paramsstr = qs.stringify({ ...ObjectFilterEmpty(params) });
  const token = getToken();
  window.open(`${process.env.VUE_APP_BASE_API}${path}?${_paramsstr}&Authorization=${token}`);
}

export function exportQuick(params: reportFilterParams): void {
  const _paramsstr = qs.stringify({ ...ObjectFilterEmpty(params) });
  const token = getToken();
  window.open(
    `${process.env.VUE_APP_BASE_API}/api/financial/export_financial_report_snapshot?${_paramsstr}&Authorization=${token}`,
  );
}
export const usePrecharge = (ctx: SetupContext) => {
  const reportData = reactive<{
    params: reportFilterParams;
    loading: boolean;
    tableData: any;
    total: number;
  }>({
    loading: false,
    params: {
      business_type: undefined,
      project_name: '',
      num: 30,
      page_num: 1,
    },
    total: 0,
    tableData: [],
  });
  const getData = async (params: reportFilterParams) => {
    reportData.loading = true;
    const res: any = await GetFinancePreincome(params);
    reportData.loading = false;
    reportData.tableData = res.data.data.list;
    reportData.total = res.data.data.total;
    return res.data.data;
  };
  return {
    ...toRefs(reportData),
    getData,
  };
};
export const usePrepay = (ctx: SetupContext) => {
  const reportData = reactive<{
    params: reportFilterParams;
    loading: boolean;
    tableData: any;
    total: number;
  }>({
    loading: false,
    params: {
      business_type: undefined,
      project_name: '',
      num: 30,
      page_num: 1,
    },
    total: 0,
    tableData: [],
  });
  const getData = async (params: reportFilterParams) => {
    reportData.loading = true;
    const res: any = await GetFinancePrepay(params);
    reportData.loading = false;
    reportData.tableData = res.data.data.list;
    reportData.total = res.data.data.total;
    return res.data.data;
  };
  return {
    ...toRefs(reportData),
    getData,
  };
};
export const useQuick = (ctx: SetupContext) => {
  const reportData = reactive<{ params: reportFilterParams; loading: boolean; tableData: any }>({
    loading: false,
    params: {
      date: '2021-11',
      business_type: undefined,
      project_name: '',
    },
    tableData: [],
  });
  const getData = async (params: reportFilterParams) => {
    reportData.loading = true;
    const {
      data: { data },
    } = await GetFinanceReportSnapshot(params);
    reportData.loading = false;
    reportData.tableData = data;
    return data;
  };
  return {
    ...toRefs(reportData),
    getData,
  };
};
export const useUnWriteOff = (ctx: SetupContext) => {
  const reportData = reactive<{ params: any; loading: boolean; tableData: any; total: number }>({
    loading: false,
    params: {
      page_num: 1,
      num: 30,
      buyer_name: '',
      seller_name: '',
      invoice_number: '',
      invoice_type: '',
      is_special: '',
      invoice_status: '1',
      not_full_write_off: '1',
    },
    tableData: [],
    total: 0,
  });
  const getData = async (params: any) => {
    reportData.loading = true;
    const {
      data: { data },
    } = await GetFinanceInvoiceList(params);
    reportData.tableData = data.data;
    reportData.total = data.total;
    reportData.loading = false;
    return data;
  };
  return {
    ...toRefs(reportData),
    getData,
  };
};
export const isSpecialTicket = new Map([
  [1, '是'],
  [0, '否'],
]);
export const financialInvoiceType = new Map([
  [1, '销售发票'],
  [2, '采购发票'],
]);
// export const payType = new Map([
//   [1, '银行卡'],
//   [2, 'v任务'],
//   [3, '对公银行'],
//   [4, '支付宝'],
// ]);
export const projectColumn: Col[] = [
  {
    label: '账期时间',
    property: 'date',
    align: 'center',
    headerAlign: 'center',
    width: 100,
    fixed: 'left',
    className: 'project-info-head',
  },
  {
    label: '项目名称',
    property: 'project_name',
    align: 'left',
    headerAlign: 'center',
    width: 150,
    fixed: 'left',
    className: 'project-info-head',
  },
  {
    label: '项目编号',
    property: 'project_uid',
    align: 'center',
    headerAlign: 'center',
    width: 150,
    className: 'project-info-head',
  },
  {
    label: '业务类型',
    align: 'center',
    headerAlign: 'center',
    width: 90,
    className: 'project-info-head',
    formatter: ({ row }) => {
      return busType.get(row.business_type);
    },
  },
  {
    label: '所属平台',
    align: 'center',
    headerAlign: 'center',
    width: 80,
    className: 'project-info-head',
    formatter: ({ row }) => platformType.get(row.platform),
  },
  {
    label: '合作类型',
    property: 'cooperation_type',
    align: 'center',
    headerAlign: 'center',
    width: 80,
    className: 'project-info-head',
  },
  {
    label: '部门',
    property: 'department',
    align: 'center',
    headerAlign: 'center',
    width: 100,
    className: 'project-info-head',
  },
  {
    label: '项目经理',
    property: 'project_manager',
    align: 'center',
    headerAlign: 'center',
    width: 80,
    className: 'project-info-head',
  },
  {
    label: '客户经理',
    property: 'customer_manager',
    align: 'center',
    headerAlign: 'center',
    width: 80,
    className: 'project-info-head',
  },
];
export const sumColumn: Col[] = [
  {
    label: '收入 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 90,
    property: 'total_income',
    className: 'project-sum-head',
    formatter: ({ row }) => numberFormat(row.total_income, 2, '.', ',', 100),
  },
  {
    label: '实收 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 90,
    property: 'total_receive',
    className: 'project-sum-head',
    formatter: ({ row }) => numberFormat(row.total_receive, 2, '.', ',', 100),
  },
  {
    label: '销售发票 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 110,
    property: 'total_sales_invoice',
    className: 'project-sum-head',
    formatter: ({ row }) => numberFormat(row.total_sales_invoice, 2, '.', ',', 100),
  },
  {
    label: '成本 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 90,
    property: 'total_cost',
    className: 'project-sum-head',
    formatter: ({ row }) => numberFormat(row.total_cost, 2, '.', ',', 100),
  },
  {
    label: '实付 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 90,
    property: 'total_pay',
    className: 'project-sum-head',
    formatter: ({ row }) => numberFormat(row.total_pay, 2, '.', ',', 100),
  },
  {
    label: '采购发票 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 110,
    property: 'total_purchase_invoice',
    className: 'project-sum-head',
    formatter: ({ row }) => numberFormat(row.total_purchase_invoice, 2, '.', ',', 100),
  },
];
export const incomeColumn: Col[] = [
  {
    label: '结算单号',
    property: 'income_settlement_uid',
    align: 'left',
    headerAlign: 'center',
    width: 150,
    className: 'project-income-head',
  },
  {
    label: '结算类型',
    align: 'center',
    headerAlign: 'center',
    width: 100,
    className: 'project-income-head',
    formatter: ({ row }) => SettlementTypeMap.get(row.income_settlement_type),
  },
  {
    label: '客户公司',
    property: 'income_settlement_company',
    align: 'left',
    headerAlign: 'center',
    width: 184,
    className: 'project-income-head',
  },
  // {
  //   label: '店铺',
  //   property: 'income_settlement_shop',
  //   align: 'center',
  //   headerAlign: 'center',
  //   width: 164,
  //   className: 'project-income-head',
  // },
  {
    label: '品牌',
    property: 'income_settlement_brand',
    align: 'center',
    headerAlign: 'center',
    width: 116,
    className: 'project-income-head',
  },
  {
    label: '结算周期',
    property: 'income_settlement_cycle',
    align: 'center',
    headerAlign: 'center',
    width: 180,
    className: 'project-income-head',
  },
  {
    label: '含税结算金额 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 148,
    property: 'income_settlement_amount_include_tax',
    className: 'project-income-head',
    formatter: ({ row }) =>
      numberFormat(row.income_settlement_amount_include_tax, 2, '.', ',', 100),
  },
  {
    label: '不含税金额 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 120,
    property: 'income_settlement_amount_exclude_tax',
    className: 'project-income-head',
    formatter: ({ row }) =>
      numberFormat(row.income_settlement_amount_exclude_tax, 2, '.', ',', 100),
  },
  {
    label: '税率',
    align: 'center',
    headerAlign: 'center',
    width: 50,
    property: 'income_settlement_tax_rate',
    className: 'project-income-head',
    formatter: ({ row }) =>
      row.income_settlement_tax_rate ? row.income_settlement_tax_rate + '%' : '',
  },
  {
    label: '税额 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 80,
    property: 'income_settlement_tax_amount',
    className: 'project-income-head',
    formatter: ({ row }) => numberFormat(row.income_settlement_tax_amount, 2, '.', ',', 100),
  },
  {
    label: '结算人',
    property: 'income_settlement_settlement_by',
    align: 'center',
    headerAlign: 'center',
    width: 70,
    className: 'project-income-head',
  },
  {
    label: '确认人',
    property: 'income_settlement_confirm_by',
    align: 'center',
    headerAlign: 'center',
    width: 70,
    className: 'project-income-head',
  },
  {
    label: '确认时间',
    property: 'income_settlement_confirm_date',
    align: 'center',
    headerAlign: 'center',
    width: 90,
    className: 'project-income-head',
  },
  {
    label: '已收金额 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 110,
    property: 'income_settlement_received_amount',
    className: 'project-income-head',
    formatter: ({ row }) => numberFormat(row.income_settlement_received_amount, 2, '.', ',', 100),
  },
  {
    label: '未收金额 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 110,
    property: 'income_settlement_not_received_amount',
    className: 'project-income-head',
    formatter: ({ row }) =>
      numberFormat(row.income_settlement_not_received_amount, 2, '.', ',', 100),
  },
  {
    label: '已开票金额 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 130,
    property: 'income_settlement_invoice_amount',
    className: 'project-income-head',
    formatter: ({ row }) => numberFormat(row.income_settlement_invoice_amount, 2, '.', ',', 100),
  },
  {
    label: '未开票金额  (元)',
    align: 'right',
    headerAlign: 'center',
    width: 130,
    property: 'income_settlement_not_invoice_amount',
    className: 'project-income-head',
    formatter: ({ row }) =>
      numberFormat(row.income_settlement_not_invoice_amount, 2, '.', ',', 100),
  },
];
export const receivePaymentColumn: Col[] = [
  {
    label: '单据编号',
    property: 'income_achievement_uid',
    align: 'left',
    headerAlign: 'center',
    width: 160,
    className: 'project-receive-head',
  },
  {
    label: '业绩名称',
    property: 'income_achievement_name',
    align: 'left',
    headerAlign: 'center',
    width: 120,
    className: 'project-receive-head',
  },
  {
    label: '收款金额  (元)',
    align: 'right',
    headerAlign: 'center',
    width: 120,
    property: 'income_achievement_amount',
    className: 'project-receive-head',
    formatter: ({ row }) => numberFormat(row.income_achievement_amount, 2, '.', ',', 100),
  },
  {
    label: '收款方式',
    align: 'left',
    property: 'income_achievement_gather_way',
    headerAlign: 'center',
    width: 150,
    className: 'project-receive-head',
  },
  {
    label: '收款时间',
    property: 'income_achievement_gather_date',
    align: 'center',
    headerAlign: 'center',
    width: 100,
    className: 'project-receive-head',
  },
  {
    label: '账期时间',
    property: 'income_achievement_account_detail_date',
    align: 'center',
    headerAlign: 'center',
    width: 100,
    className: 'project-receive-head',
    // formatter: ({ row }) => {
    //   return row.income_achievement_account_detail_date
    //     ? moment(row.income_achievement_account_detail_date * 1000).format('YYYY.MM.DD')
    //     : '';
    // },
  },
  {
    label: '确认人',
    property: 'income_achievement_confirm_by',
    align: 'center',
    headerAlign: 'center',
    width: 80,
    className: 'project-receive-head',
  },
];
export const salesReceiptColumn: Col[] = [
  {
    label: '是否专票',
    align: 'center',
    headerAlign: 'center',
    width: 90,
    className: 'project-receipt-head',
    formatter: ({ row }) => isSpecialTicket.get(row.sales_invoice_is_special),
  },
  {
    label: '购买方',
    property: 'sales_invoice_buyer_name',
    align: 'center',
    headerAlign: 'center',
    width: 164,
    className: 'project-receipt-head',
  },
  {
    label: '销售方',
    property: 'sales_invoice_seller_name',
    align: 'center',
    headerAlign: 'center',
    width: 164,
    className: 'project-receipt-head',
  },
  {
    label: '发票类型',
    align: 'center',
    headerAlign: 'center',
    width: 90,
    className: 'project-receipt-head',
    formatter: ({ row }) => financialInvoiceType.get(row.sales_invoice_type),
  },
  {
    label: '发票号码',
    property: 'sales_invoice_number',
    align: 'center',
    headerAlign: 'center',
    width: 130,
    className: 'project-receipt-head',
  },
  {
    label: '发票日期',
    property: 'sales_invoice_date',
    align: 'center',
    headerAlign: 'center',
    width: 120,
    className: 'project-receipt-head',
  },
  {
    label: '开票金额 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 120,
    property: 'sales_invoice_total_amount',
    className: 'project-receipt-head',
    formatter: ({ row }) => numberFormat(row.sales_invoice_total_amount, 2, '.', ',', 100),
  },
  {
    label: '税率',
    align: 'center',
    headerAlign: 'center',
    width: 50,
    property: 'sales_invoice_tax_rate',
    className: 'project-receipt-head',
    formatter: ({ row }) => (row.sales_invoice_tax_rate ? row.sales_invoice_tax_rate + '%' : ''),
  },
  {
    label: '税额 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 80,
    property: 'sales_invoice_tax_amount',
    className: 'project-receipt-head',
    formatter: ({ row }) => numberFormat(row.sales_invoice_tax_amount, 2, '.', ',', 100),
  },
  {
    label: '不含税金额 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 120,
    property: 'sales_invoice_tax_excluded_amount',
    className: 'project-receipt-head',
    formatter: ({ row }) => numberFormat(row.sales_invoice_tax_excluded_amount, 2, '.', ',', 100),
  },
];
export const costColumn: Col[] = [
  {
    label: '结算单号',
    property: 'cost_settlement_uid',
    align: 'left',
    headerAlign: 'center',
    width: 150,
    className: 'project-cost-head',
  },
  {
    label: '供应商',
    property: 'cost_settlement_company',
    align: 'left',
    headerAlign: 'center',
    width: 164,
    className: 'project-cost-head',
  },
  {
    label: '结算周期',
    property: 'cost_settlement_cycle',
    align: 'center',
    headerAlign: 'center',
    width: 180,
    className: 'project-cost-head',
  },
  {
    label: '含税结算金额 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 148,
    property: 'cost_settlement_amount_include_tax',
    className: 'project-cost-head',
    formatter: ({ row }) => numberFormat(row.cost_settlement_amount_include_tax, 2, '.', ',', 100),
  },
  {
    label: '不含税金额 (元)',
    property: 'cost_settlement_amount_exclude_tax',
    align: 'right',
    headerAlign: 'center',
    width: 120,
    className: 'project-cost-head',
    formatter: ({ row }) => numberFormat(row.cost_settlement_amount_exclude_tax, 2, '.', ',', 100),
  },
  {
    label: '税率',
    align: 'center',
    headerAlign: 'center',
    width: 50,
    property: 'cost_settlement_tax_rate',
    className: 'project-cost-head',
    formatter: ({ row }) =>
      row.cost_settlement_tax_rate ? row.cost_settlement_tax_rate + '%' : '',
  },
  {
    label: '税额 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 80,
    property: 'cost_settlement_tax_amount',
    className: 'project-cost-head',
    formatter: ({ row }) => numberFormat(row.cost_settlement_tax_amount, 2, '.', ',', 100),
  },
  {
    label: '结算人',
    property: 'cost_settlement_settlement_by',
    align: 'center',
    headerAlign: 'center',
    width: 70,
    className: 'project-cost-head',
  },
  {
    label: '确认人',
    property: 'cost_settlement_confirm_by',
    align: 'center',
    headerAlign: 'center',
    width: 70,
    className: 'project-cost-head',
  },
  {
    label: '确认时间',
    property: 'cost_settlement_confirm_date',
    align: 'center',
    headerAlign: 'center',
    width: 90,
    className: 'project-cost-head',
  },
  {
    label: '已付金额 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 110,
    property: 'cost_settlement_paid_amount',
    className: 'project-cost-head',
    formatter: ({ row }) => numberFormat(row.cost_settlement_paid_amount, 2, '.', ',', 100),
  },
  {
    label: '未付金额 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 110,
    property: 'cost_settlement_not_paid_amount',
    className: 'project-cost-head',
    formatter: ({ row }) => numberFormat(row.cost_settlement_not_paid_amount, 2, '.', ',', 100),
  },
  {
    label: '已开票金额 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 130,
    property: 'cost_settlement_invoice_amount',
    className: 'project-cost-head',
    formatter: ({ row }) => numberFormat(row.cost_settlement_invoice_amount, 2, '.', ',', 100),
  },
  {
    label: '未开票金额  (元)',
    align: 'right',
    headerAlign: 'center',
    width: 130,
    property: 'cost_settlement_not_invoice_amount',
    className: 'project-cost-head',
    formatter: ({ row }) => numberFormat(row.cost_settlement_not_invoice_amount, 2, '.', ',', 100),
  },
];
export const paymentColumn: Col[] = [
  {
    label: '单据编号',
    property: 'cost_id',
    align: 'center',
    headerAlign: 'center',
    width: 100,
    className: 'project-payment-head',
  },
  {
    label: '付款金额  (元)',
    align: 'right',
    headerAlign: 'center',
    width: 120,
    property: 'cost_amount',
    className: 'project-payment-head',
    formatter: ({ row }) => numberFormat(row.cost_amount, 2, '.', ',', 100),
  },
  {
    label: '付款方式',
    align: 'left',
    property: 'cost_pay_to_bank',
    headerAlign: 'center',
    width: 150,
    className: 'project-payment-head',
  },
  {
    label: '付款时间',
    property: 'cost_pay_date',
    align: 'center',
    headerAlign: 'center',
    width: 100,
    className: 'project-payment-head',
  },
  {
    label: '账期时间',
    property: 'cost_account_detail_date',
    align: 'center',
    headerAlign: 'center',
    width: 100,
    className: 'project-payment-head',
    // formatter: ({ row }) => {
    //   return row.cost_account_detail_date
    //     ? moment(row.cost_account_detail_date * 1000).format('YYYY.MM.DD')
    //     : '';
    // },
  },
  {
    label: '确认人',
    property: 'cost_confirm_by',
    align: 'center',
    headerAlign: 'center',
    width: 70,
    className: 'project-payment-head',
  },
];
export const purchaseColumn: Col[] = [
  {
    label: '是否专票',
    align: 'center',
    headerAlign: 'center',
    width: 90,
    className: 'project-purchase-head',
    formatter: ({ row }) => isSpecialTicket.get(row.purchase_invoice_is_special),
  },
  {
    label: '购买方',
    property: 'purchase_invoice_buyer_name',
    align: 'center',
    headerAlign: 'center',
    width: 164,
    className: 'project-purchase-head',
  },
  {
    label: '销售方',
    property: 'purchase_invoice_seller_name',
    align: 'center',
    headerAlign: 'center',
    width: 164,
    className: 'project-purchase-head',
  },
  {
    label: '发票类型',
    align: 'center',
    headerAlign: 'center',
    width: 90,
    className: 'project-purchase-head',
    formatter: ({ row }) => financialInvoiceType.get(row.purchase_invoice_type),
  },
  {
    label: '发票号码',
    property: 'purchase_invoice_number',
    align: 'center',
    headerAlign: 'center',
    width: 90,
    className: 'project-purchase-head',
  },
  {
    label: '发票日期',
    property: 'purchase_invoice_date',
    align: 'center',
    headerAlign: 'center',
    width: 120,
    className: 'project-purchase-head',
  },
  {
    label: '开票金额 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 120,
    property: 'purchase_invoice_total_amount',
    className: 'project-purchase-head',
    formatter: ({ row }) => numberFormat(row.purchase_invoice_total_amount, 2, '.', ',', 100),
  },
  {
    label: '税率',
    align: 'center',
    headerAlign: 'center',
    width: 50,
    property: 'purchase_invoice_tax_rate',
    className: 'project-purchase-head',
    formatter: ({ row }) =>
      row.purchase_invoice_tax_rate ? row.purchase_invoice_tax_rate + '%' : '',
  },
  {
    label: '税额 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 80,
    property: 'purchase_invoice_tax_amount',
    className: 'project-purchase-head',
    formatter: ({ row }) => numberFormat(row.purchase_invoice_tax_amount, 2, '.', ',', 100),
  },
  {
    label: '不含税金额 (元)',
    align: 'right',
    headerAlign: 'center',
    width: 120,
    property: 'purchase_invoice_tax_excluded_amount',
    className: 'project-purchase-head',
    formatter: ({ row }) =>
      numberFormat(row.purchase_invoice_tax_excluded_amount, 2, '.', ',', 100),
  },
];
