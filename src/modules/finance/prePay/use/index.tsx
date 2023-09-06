import { formatAmount } from '@/utils/string';
import WriteOff from '@/modules/components/perPayProject/dialog/WriteOff/index.vue';
import { h } from '@vue/composition-api';
import { usePermission } from '@/use/permission';
import { GetContractListByType } from '@/services/contract';
import { useRouter } from '@/use/vue-router';
import { RouterLegal } from '@/const/router';
import { useExternal } from '@/router/routeGuard';
import moment from 'moment';

const permission = usePermission();
// const contractLoading = ref(false);
const router = useRouter();
const { externalQuery } = useExternal();
export const onContractClick = (row: any) => {
  // const contract_id = row.contract_ids[0];
  const contract_id = row.contract_id;
  if (!contract_id) return;
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

const renderRedColor = (label = 'uid', row: any) => {
  if (row.status === 6) {
    return <span style="color: var(--error-color)">{row[label]}</span>;
  }
  return row[label] || '--';
};
const renderRedColorNumber = (val: string | number, row: any) => {
  if (row.status === 6) {
    return (
      <span style="color: var(--error-color)">{formatAmount(Number(val || 0) / 100, 'None')}</span>
    );
  }
  return formatAmount(Number(val || 0) / 100, 'None') || '--';
};

export const columns = (ctx: {
  rowClick: (row: prepayModel, type: number) => void;
}): {
  label: string;
  align: string;
  dataType?: string;
  minWidth: string;
  fixed?: string;
  'show-overflow-tooltip'?: boolean;
  formatter?: (row: prepayModel, ...rest: any) => any;
}[] => {
  return [
    {
      label: '预收编号',
      align: 'left',
      dataType: 'text',
      minWidth: '140',
      fixed: 'left',
      'show-overflow-tooltip': true,
      formatter: (row: any, column: any) => {
        return renderRedColor('uid', row);
      },
    },
    {
      label: '项目名称',
      align: 'left',
      dataType: 'text',
      minWidth: '160',
      fixed: 'left',
      'show-overflow-tooltip': true,
      formatter: (row, column) => {
        return row.project_name || '--';
      },
    },
    {
      label: '业务类型',
      align: 'center',
      dataType: 'text',
      minWidth: '100',
      'show-overflow-tooltip': true,
      formatter: row => {
        return row.business_type_name || '--';
      },
    },
    {
      label: '客户名称',
      align: 'left',
      dataType: 'text',
      minWidth: '180',
      'show-overflow-tooltip': true,
      formatter: row => {
        return row.supplier_company_name || '--';
      },
    },
    {
      label: '登记金额 (元)',
      align: 'right',
      dataType: 'text',
      minWidth: '130',
      formatter: row => {
        return renderRedColorNumber(row.register_amount, row);
      },
    },
    {
      label: '关联合同',
      align: 'left',
      dataType: 'text',
      minWidth: '160',
      'show-overflow-tooltip': true,
      formatter: row => {
        return (
          <div
            style={
              row.contract_id && {
                color: 'var(--theme-color)',
                cursor: 'pointer',
              }
            }
            onClick={() => {
              if (!row.contract_id) return;
              onContractClick(row);
            }}
          >
            {row.contract_uid || '--'}
          </div>
        );
      },
    },
    {
      label: '收款说明',
      align: 'left',
      dataType: 'text',
      minWidth: '140',
      'show-overflow-tooltip': true,
      formatter: row => {
        return row.remark || '--';
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
            formatAmount(item.amount / 100) || '--',
          ];
        });
        const write_off_header = ['到账日期', '收款账户', '收款金额'];
        return h(WriteOff, {
          attrs: {
            is_reverse: row.status === 6,
            write_off_header,
            write_off_infos: arrived_amount_data || [],
            btnTitle: formatAmount(row.income_amount / 100, 'None') || '--',
          },
        });
      },
    },
    // {
    //   label: '到账日期',
    //   align: 'center',
    //   dataType: 'text',
    //   minWidth: '160',
    //   formatter: row => {
    //     return row.arrived_amount_data && row.arrived_amount_data.length > 0
    //       ? row.arrived_amount_data[0].gmt_datetime
    //       : '--';
    //   },
    // },
    {
      label: '未到账金额 (元)',
      align: 'right',
      dataType: 'text',
      minWidth: '130',
      formatter: (row: any) => {
        return renderRedColorNumber(row.un_income_amount, row);
      },
    },
    {
      label: '已核销金额 (元)',
      align: 'right',
      dataType: 'text',
      minWidth: '130',
      formatter: (row: any) => {
        const write_off_header = ['结算编号', '实收编号', '核销金额', '核销人/日期'];
        return h(WriteOff, {
          attrs: {
            is_reverse: row.status === 6,
            write_off_header,
            write_off_infos: row.write_off_data?.map((item: any) => {
              return [
                item.settlement_uid,
                item.achievement_uid,
                formatAmount(item.amount / 100),
                item.add_by_name,
                moment(item.gmt_datetime?.split(' ')[0]).format('YYYY.MM.DD'),
              ];
            }),
            // write_off_status: 2,
            btnTitle: formatAmount(row.write_off_amount / 100, 'None'),
          },
        });
      },
    },
    {
      label: '未核销金额 (元)',
      align: 'right',
      dataType: 'text',
      minWidth: '130',
      formatter: (row: any) => {
        return renderRedColorNumber(row.un_write_off_amount, row);
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
            formatAmount(item.amount / 100) || '--',
            item.add_by_name,
            moment(item.gmt_datetime?.split(' ')[0]).format('YYYY.MM.DD'),
          ];
        });
        const write_off_header = ['审批编号', '退款金额 (元)', '核销人/日期'];
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
      minWidth: '100',
      formatter: (row: any) => {
        return row.status_name || '--';
      },
    },
    {
      label: '录入人',
      align: 'center',
      dataType: 'text',
      minWidth: '80',
      formatter: (row: any) => {
        return row.add_by_name || '--';
      },
    },
    {
      label: '录入日期',
      align: 'center',
      dataType: 'text',
      minWidth: '140',
      formatter: (row: any) => {
        return row.gmt_create ? moment(row.gmt_create).format('YYYY.MM.DD HH:mm') : '--';
      },
    },
    {
      label: '审核人',
      align: 'center',
      dataType: 'text',
      minWidth: '80',
      formatter: (row: any) => {
        return row.audit_by_name || '--';
      },
    },
    {
      label: '审核日期',
      align: 'center',
      dataType: 'text',
      minWidth: '140',
      formatter: (row: any) => {
        // return row.audit_time || '--';
        return row.audit_time ? moment(row.audit_time).format('YYYY.MM.DD HH:mm') : '--';
      },
    },
    {
      label: '操作',
      align: 'center',
      minWidth: '140',
      fixed: 'right',
      formatter: (row: any) => {
        const that = ctx;
        return (
          <div class="information-div">
            <tg-button
              v-show={row.status === 2 || row.status === 7}
              type="link"
              onClick={() => {
                that.rowClick(row, 1);
              }}
            >
              查看
            </tg-button>
            <tg-button
              v-show={row.status === 1 && permission.advance_payment_audit}
              type="link"
              onClick={() => {
                that.rowClick(row, 2);
              }}
            >
              审核
            </tg-button>
            <tg-button
              v-show={row.status === 5 && permission.advance_payment_audit}
              type="link"
              class="red-btn"
              onClick={() => {
                that.rowClick(row, 3);
              }}
            >
              冲销确认
            </tg-button>
          </div>
        );
      },
    },
  ];
};
interface verificationModel {
  achievement_uid: string;
  add_by_name: string;
  business_type: number;
  business_type_name: string;
  contract_uid: string;
  deposit_received_uid: string;
  settlement_uid: string;
  deposit_write_off_status_name: string;
  gather_amount: number;
  gather_confirm_by_name: string;
  gather_confirm_date: string;
  gmt_create: string;
  project_name: string;
  status_name: string;
  supplier_company_name: string;
  is_gather: number;
  gather_confirm_by: string;
  reverse_status: number;
  gmt_modified: string;
  reverse_id: number;
}

export const verificationColumns = (ctx: {
  rowClick: (row: verificationModel) => void;
  onReverseAuditBtnClick: (row: verificationModel) => void;
}): {
  label: string;
  align: string;
  dataType?: string;
  minWidth: string;
  fixed?: string;
  'show-overflow-tooltip'?: boolean;
  formatter?: (row: verificationModel) => any;
}[] => {
  return [
    {
      label: '项目名称',
      align: 'left',
      dataType: 'text',
      minWidth: '160',
      fixed: 'left',
      'show-overflow-tooltip': true,
      formatter: row => {
        return row.project_name || '--';
      },
    },
    {
      label: '业务类型',
      align: 'center',
      dataType: 'text',
      minWidth: '100',
      'show-overflow-tooltip': true,
      formatter: row => {
        return row.business_type_name || '--';
      },
    },
    {
      label: '客户名称',
      align: 'left',
      dataType: 'text',
      minWidth: '180',
      'show-overflow-tooltip': true,
      formatter: row => {
        return row.supplier_company_name || '--';
      },
    },
    {
      label: '实收编号',
      align: 'left',
      dataType: 'text',
      minWidth: '180',
      formatter: row => {
        if (row.reverse_status === 1 || row.reverse_status === 2 || row.reverse_id) {
          return <span style="color: var(--error-color)">{row.achievement_uid}</span>;
        }
        return row.achievement_uid || '--';
      },
    },
    {
      label: '结算编号',
      align: 'left',
      dataType: 'text',
      minWidth: '160',
      formatter: row => {
        return row.settlement_uid || '--';
      },
    },
    {
      label: '已核销金额 (元)',
      align: 'right',
      dataType: 'text',
      minWidth: '130',
      formatter: row => {
        // 已经是元了
        if (row.reverse_status === 1 || row.reverse_status === 2 || row.reverse_id) {
          return (
            <span style="color: var(--error-color)">
              {formatAmount(Number(row.gather_amount || 0), 'None')}
            </span>
          );
        }
        return formatAmount(Number(row.gather_amount || 0), 'None') || '--';
      },
    },
    {
      label: '预收编号',
      align: 'left',
      dataType: 'text',
      minWidth: '130',
      formatter: row => {
        return row.deposit_received_uid || '--';
      },
    },
    {
      label: '状态',
      align: 'center',
      dataType: 'text',
      minWidth: '100',
      formatter: row => {
        return row.deposit_write_off_status_name || '--';
      },
    },
    {
      label: '冲销状态',
      align: 'center',
      dataType: 'text',
      minWidth: '100',
      formatter: (row: any) => {
        return row.reverse_status === 1
          ? '审核中'
          : row.reverse_status === 2
          ? '已冲销'
          : row.reverse_status === 3
          ? '已退回'
          : '--';
      },
    },
    {
      label: '录入人',
      align: 'center',
      dataType: 'text',
      minWidth: '80',
      formatter: row => {
        return row.add_by_name || '--';
      },
    },
    {
      label: '录入日期',
      align: 'center',
      dataType: 'text',
      minWidth: '140',
      formatter: row => {
        return row.gmt_create ? moment(row.gmt_create).format('YYYY.MM.DD HH:mm') : '--';
      },
    },
    {
      label: '审核人',
      align: 'center',
      dataType: 'text',
      minWidth: '80',
      formatter: row => {
        return row.gather_confirm_by_name || '--';
      },
    },
    {
      label: '审核日期',
      align: 'center',
      dataType: 'text',
      minWidth: '140',
      formatter: row => {
        return row.gather_confirm_date
          ? moment(row.gather_confirm_date).format('YYYY.MM.DD')
          : '--';
      },
    },
    {
      label: '操作',
      align: 'center',
      minWidth: '100',
      fixed: 'right',
      formatter: row => {
        return (
          <tempalte>
            <tg-button
              type="link"
              v-show={
                row.is_gather === 0 && !row.gather_confirm_by && permission.advance_payment_audit
              }
              onClick={() => {
                ctx.rowClick(row);
              }}
            >
              审核
            </tg-button>
            <tg-button
              type="link"
              v-show={row.reverse_status === 1 && permission.advance_payment_audit}
              onClick={() => {
                ctx.onReverseAuditBtnClick(row);
              }}
            >
              冲销确认
            </tg-button>
          </tempalte>
        );
      },
    },
  ];
};
export interface prepayModel {
  business_type: number | null;
  business_type_name: string | null;
  write_off_infos: any[];
  refund_write_off_infos: any[];
  write_off_status: number;
  reverse_reason: string;
  uid: string;
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
  gather_amount: number;
  audit_by: string;
  audit_time: string;
  add_by: string | null;
  add_by_name: string | null;
  is_received: number;
  arrived_amount_data: any[];
  contract_uid: string;
  contract_id: number;
  reverse_status: number;
}
export interface prepayQueryForm {
  business_type?: string | number | undefined;
  audit_status?: string | number | undefined;
  project_name?: string | undefined;
  page_num?: number;
  num?: number;
  deposit_received_status?: number | undefined;
  is_hide_reverse_data?: number | undefined;
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
export const statusVerificationOption = [
  {
    label: '待审核',
    value: 2,
  },
  {
    label: '不通过',
    value: 0,
  },
  {
    label: '审核通过',
    value: 1,
  },
];
