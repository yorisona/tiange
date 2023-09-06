import { h } from '@vue/composition-api';
import WriteOff from '@/modules/components/perPayProject/dialog/WriteOff/index.vue';
import { formatAmount } from '@/utils/string';
import { useRouter } from '@/use/vue-router';
import { useExternal } from '@/router/routeGuard';
import { GetContractListByType } from '@/services/contract';
import { RouterLegal } from '@/const/router';
import moment from 'moment';
const router = useRouter();
const { externalQuery } = useExternal();
export const onContractClick = (row: any) => {
  // const contract_id = row.contract_ids[0];
  const contract_id = row.contract_id;
  const payload: any = { id: contract_id };
  let routeUrl: any = undefined;
  // contractLoading.value = true;
  GetContractListByType(payload, undefined, true).then(
    (res: any) => {
      // contractLoading.value = false;
      const data = res.data.data.data;
      if (data.length) {
        const contract_info = data[0].contract_info;
        const template_info = data[0].template_info;
        if (
          contract_info.contract_type === 1 ||
          contract_info.contract_type === 2 ||
          contract_info.contract_type === 5
        ) {
          routeUrl = router.resolve({
            name: template_info
              ? RouterLegal.contracts.customer.detailTemplate
              : RouterLegal.contracts.customer.detail,
            params: { id: `${contract_info.id}` },
            query: { ...externalQuery },
          });
          // 客户合同
          // ctx.root.$router.push({
          // name: row.template_info
          //   ? RouterLegal.contracts.customer.detailTemplate
          //   : RouterLegal.contracts.customer.detail,
          // params: { id: `${row.contract_info.id}` },
          // });
        } else if (
          contract_info.contract_type === 3 ||
          contract_info.contract_type === 4 ||
          contract_info.contract_type === 6
        ) {
          routeUrl = router.resolve({
            name: template_info
              ? RouterLegal.contracts.supplier.detailTemplate
              : RouterLegal.contracts.supplier.detail,
            params: { id: `${contract_info.id}` },
            query: {
              contract_type: `${contract_info.contract_type}`,
              ...externalQuery,
            },
          });
          // 供应商
          // ctx.root.$router.push({
          // name: row.template_info
          //   ? RouterLegal.contracts.supplier.detailTemplate
          //   : RouterLegal.contracts.supplier.detail,
          // params: { id: `${row.contract_info.id}` },
          // query: {
          //   contract_type: `${row.contract_info.contract_type}`,
          // },
          // });
        } else {
          routeUrl = router.resolve({
            name: RouterLegal.contracts.anchor.detailTemplate,
            params: { id: `${contract_info.id}` },
            query: {
              contract_type: `${contract_info.contract_type}`,
              ...externalQuery,
            },
          });
          // 主播
          // ctx.root.$router.push({
          // name: RouterLegal.contracts.anchor.detailTemplate,
          // params: { id: `${row.contract_info.id}` },
          // query: {
          //   contract_type: `${row.contract_info.contract_type}`,
          // },
          // });
        }
      }
      window.open(routeUrl.href, '_blank');
    },
    () => {
      // contractLoading.value = false;
    },
  );
};
export const columns = [
  {
    label: '预收编号',
    align: 'left',
    dataType: 'text',
    minWidth: '138',
    fixed: 'left',
    prop: 'uid',
    'show-overflow-tooltip': true,
    formatter: (row: prepayModel) => {
      return h(
        'div',
        {
          style: {
            color: row.status === 6 ? 'var(--error-color)' : '',
          },
        },
        String(row.uid || '--'),
      );
    },
  },
  {
    label: '客户名称',
    align: 'left',
    dataType: 'text',
    minWidth: '130',
    prop: 'supplier_company_name',
    'show-overflow-tooltip': true,
    formatter: (row: prepayModel) => {
      return row.supplier_company_name || row.company_name || '--';
    },
  },
  {
    label: '关联合同',
    align: 'center',
    dataType: 'text',
    minWidth: '150',
    prop: 'contract_uid',
    'show-overflow-tooltip': true,
    formatter: (row: prepayModel) => {
      return row.contract_uid
        ? h(
            'div',
            {
              style: {
                color: 'var(--theme-color)',
                cursor: 'pointer',
              },
              on: {
                click: (e: any) => {
                  e.stopPropagation();
                  onContractClick(row);
                },
              },
            },
            row.contract_uid,
          )
        : '--';
    },
  },
  {
    label: '收款说明',
    align: 'left',
    dataType: 'text',
    minWidth: '120',
    prop: 'remark',
    'show-overflow-tooltip': true,
    formatter: (row: prepayModel) => {
      return row.remark || '--';
    },
  },
  {
    label: '登记金额 (元)',
    align: 'right',
    dataType: 'text',
    minWidth: '130',
    formatter: (row: prepayModel) => {
      return h(
        'div',
        {
          style: {
            color: row.status === 6 ? 'var(--error-color)' : '',
          },
        },
        String(formatAmount(row.register_amount / 100, 'None') || '--'),
      );
    },
  },
  {
    label: '到账金额 (元)',
    align: 'right',
    dataType: 'text',
    minWidth: '130',
    formatter: (row: prepayModel) => {
      const arrived_amount_data = (row.arrived_amount_data || []).map((item: any) => {
        return [
          moment(item.gmt_datetime).format('YYYY.MM.DD'),
          item.bank_name,
          formatAmount(item.amount / 100, 'None') || '--',
        ];
      });
      const write_off_header = ['到账日期', '收款账户', '收款金额 (元)'];
      return h(WriteOff, {
        attrs: {
          is_reverse: row.status === 6,
          write_off_header,
          write_off_infos: arrived_amount_data,
          btnTitle: formatAmount(row.income_amount / 100, 'None') || '--',
        },
      });
    },
  },
  {
    label: '未到账金额 (元)',
    align: 'right',
    dataType: 'text',
    minWidth: '130',
    formatter: (row: prepayModel) => {
      return h(
        'div',
        {
          style: {
            color: row.status === 6 ? 'var(--error-color)' : '',
          },
        },
        String(formatAmount(row.un_income_amount / 100, 'None') || '--'),
      );
    },
  },
  {
    label: '已核销金额 (元)',
    align: 'right',
    dataType: 'text',
    minWidth: '130',
    formatter: (row: prepayModel) => {
      const write_off_data = (row.write_off_data || []).map((item: any) => {
        return [
          item.settlement_uid,
          item.achievement_uid,
          formatAmount(item.amount / 100, 'None') || '--',
          item.add_by_name,
          moment(item.gmt_datetime).format('YYYY.MM.DD'),
        ];
      });
      const write_off_header = ['结算编号', '实收编号', '核销金额 (元)', '核销人/日期'];
      return h(WriteOff, {
        attrs: {
          is_reverse: row.status === 6,
          write_off_header,
          write_off_infos: write_off_data,
          write_off_status: 1,
          btnTitle: formatAmount(row.write_off_amount / 100, 'None') || '--',
        },
      });
    },
  },
  {
    label: '未核销金额 (元)',
    align: 'right',
    dataType: 'text',
    minWidth: '130',
    formatter: (row: prepayModel) => {
      return h(
        'div',
        {
          style: {
            color: row.status === 6 ? 'var(--error-color)' : '',
          },
        },
        String(formatAmount(row.un_write_off_amount / 100, 'None') || '--'),
      );
    },
  },
  {
    label: '退款金额 (元)',
    align: 'right',
    dataType: 'text',
    minWidth: '130',
    formatter: (row: prepayModel) => {
      const refund_amount_data = (row.refund_amount_data || []).map((item: any) => {
        return [
          item.approval_uid,
          formatAmount(item.amount / 100, 'None') || '--',
          item.add_by_name,
          moment(item.gmt_datetime).format('YYYY.MM.DD'),
        ];
      });
      const write_off_header = ['审批编号', '退款金额 (元)', '发起人/日期'];
      return h(WriteOff, {
        attrs: {
          is_reverse: row.status === 6,
          write_off_header,
          write_off_infos: refund_amount_data,
          btnTitle: formatAmount(row.refund_amount / 100, 'None') || '--',
        },
      });
    },
  },
  {
    label: '状态',
    align: 'center',
    dataType: 'text',
    minWidth: '90',
    formatter: (row: prepayModel) => {
      return statusTypeOptionMap.get(row.status) || row.status_name || '--';
    },
  },
  {
    label: '录入人',
    align: 'center',
    dataType: 'text',
    minWidth: '82',
    'show-overflow-tooltip': true,
    formatter: (row: any) => {
      return row.add_by_name || '--';
    },
  },
  {
    label: '录入日期',
    align: 'center',
    dataType: 'text',
    minWidth: '130',
    'show-overflow-tooltip': true,
    formatter: (row: any) => {
      return row.gmt_create ? moment(row.gmt_create).format('YYYY.MM.DD HH:mm') : '--';
    },
  },
  {
    label: '审核人',
    align: 'center',
    dataType: 'text',
    minWidth: '82',
    'show-overflow-tooltip': true,
    formatter: (row: any) => {
      return row.audit_by_name || '--';
    },
  },
  {
    label: '审核日期',
    align: 'center',
    dataType: 'text',
    minWidth: '130',
    'show-overflow-tooltip': true,
    formatter: (row: any) => {
      return row.audit_time ? moment(row.audit_time).format('YYYY.MM.DD HH:mm') : '--';
    },
  },
];
export interface prepayModel {
  business_type: number | null;
  business_type_name: string | null;
  write_off_infos: any[];
  refund_write_off_infos: any[];
  write_off_status: number;
  reverse_reason: string;
  uid: number | string;
  supplier_company_name: string;
  register_amount: number;
  income_amount: number;
  refund_amount: number;
  un_income_amount: number;
  un_write_off_amount: number;
  write_off_amount: number;
  write_off_data: any[];
  status_name: string;
  status: number;
  reverse_id: number;
  reverse_audit_reason: string;
  remark: string;
  refund_amount_data: any[];
  project_uid: number | string;
  project_name: string | null;
  project_id: number | null | string;
  id: number;
  audit_by: string;
  audit_by_name: string;
  audit_time: string;
  add_by: string | null;
  add_by_name: string | null;
  is_received: number;
  arrived_amount_data: any[];
  contract_uid: string;
  contract_id: number;
  audit_reason: string;
  un_invoiced_amount: number;
  contract_company_name: string;
  company_name: string;
  company_id: number;
}
export interface prepayQueryForm {
  business_type?: string | number | undefined;
  company_name?: string | undefined;
  page_num?: number;
  num?: number;
  audit_status?: number | undefined;
}
export const statusTypeOption = [
  {
    label: '待审核',
    value: 1,
  },
  {
    label: '不通过',
    value: 2,
  },
  {
    label: '审核通过',
    value: 4,
  },
  {
    label: '冲销审核中',
    value: 5,
  },
  {
    label: '已冲销',
    value: 6,
  },
];
export const statusTypeOptionMap = new Map([
  [1, '待审核'],
  [2, '不通过'],
  [3, '已删除'],
  [4, '审核通过'],
  [5, '冲销审核中'],
  [6, '已冲销'],
]);
