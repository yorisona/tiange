import WriteOff from '@/modules/components/perPayProject/dialog/WriteOff/index.vue';
import { h } from '@vue/composition-api';
// import { usePermission } from '@/use/permission';
import { GetContractListByType } from '@/services/contract';
import { useRouter } from '@/use/vue-router';
import { RouterLegal } from '@/const/router';
import { useExternal } from '@/router/routeGuard';
import moment from 'moment';
import { SignTypeMap } from '@/types/tiange/contract';
import { removeZeroKolCommission } from '@/modules/customer/contract/list/collection';
import { Decimal2String, formatAmount } from '@/utils/string';
import Decimal from 'decimal.js';

// const permission = usePermission();
// const contractLoading = ref(false);
const router = useRouter();
const { externalQuery } = useExternal();
export const onContractClick = (row: any) => {
  // const contract_id = row.contract_ids[0];
  const contract_id = row.contract_info.id;
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

export const dataConversion = (res: any) => {
  return res.data.map((item: any) => {
    const template_info = item.template_info;
    if (template_info) {
      const pay_condition = template_info.pay_condition;
      if (pay_condition) {
        pay_condition.filter((subItem: any) => {
          if (subItem.key === '收费类型') {
            item.getMoneytype = subItem.value;
            item.contractMoney = '';
            item.contractCommission = '';
            item.contractOtherMoney = '';
            if (!subItem.value) {
              item.getMoneytype = '其它';
            }
          }
          // if (item.getMoneytype === '纯佣金') {
          //   if (subItem.key === '佣金') {
          //     item.contractCommission = subItem.value ? subItem.value + '%' : '--';
          //   }
          //   if (subItem.key === '构美佣金' && Number(subItem.value) !== 0) {
          //     const value = subItem.value ? subItem.value + '%(构美)' : '';
          //     item.contractCommission = value;
          //   }
          //   if (subItem.key === '主播佣金') {
          //     const value = subItem.value ? subItem.value + '%(主播)' : '';
          //     item.contractCommission = item.contractCommission
          //       ? value + '+' + item.contractCommission
          //       : value;
          //   }
          // }
          // if (item.getMoneytype === '服务费+佣金' || item.getMoneytype === '固定服务费+佣金') {
          //   item.getMoneytype = '服务费+佣金';
          //   if (subItem.key === '固定服务费') {
          //     item.contractMoney =
          //       subItem.value || Number(subItem.value) === 0
          //         ? '￥' + Decimal2String(new Decimal(subItem.value))
          //         : '';
          //   }
          //   if (subItem.key === '构美佣金' && Number(subItem.value) !== 0) {
          //     const value = subItem.value ? subItem.value + '%(构美)' : '';
          //     item.contractCommission = value;
          //   }
          //   if (subItem.key === '主播佣金') {
          //     const value = subItem.value ? subItem.value + '%(主播)' : '';
          //     item.contractCommission = item.contractCommission
          //       ? value + '+' + item.contractCommission
          //       : value;
          //   }
          //   if (subItem.key === '佣金') {
          //     const value = subItem.value ? subItem.value + '%' : '';
          //     item.contractCommission = value;
          //   }
          // }
          console.log(item, 'tittt-----');

          if (item.getMoneytype === '固定服务费') {
            if (subItem.key === '固定服务费') {
              item.contractMoney =
                subItem.value || Number(subItem.value) === 0
                  ? '￥' + Decimal2String(new Decimal(subItem.value))
                  : '';
            }
          }
          // if (item.getMoneytype === '其它') {
          //   if (subItem.key === '其它') {
          //     item.contractOtherMoney = '--';
          //   }
          // }
        });
      } else {
        // const contract_info = item.contract_info;
        // if (contract_info.contract_type === 7) {
        //   const cooperation_content = template_info.cooperation_content;
        //   if (cooperation_content) {
        //     cooperation_content.filter((subItem: any) => {
        //       if (subItem.key === '计算方式') {
        //         const computeWayRecords = [
        //           { value: 1, label: '小时服务费' },
        //           { value: 9, label: '保底服务费' },
        //           { value: 4, label: '小时服务费或提点' },
        //           { value: 2, label: '保底服务费或提点' },
        //           { value: 5, label: '小时服务费或阶梯式提点' },
        //           { value: 6, label: '保底服务费或阶梯式提点' },
        //           { value: 7, label: '保底服务费A或保底服务费B+提点' },
        //           { value: 8, label: '小时服务费或保底服务费+提点' },
        //         ];
        //         const index = subItem.value;
        //         let str = '--';
        //         computeWayRecords.map((item: any) => {
        //           if (String(item.value) === String(index)) {
        //             str = item.label;
        //           }
        //         });
        //         item.getMoneytype = str || '--';
        //         item.contractOtherMoney = '--';
        //       }
        //       if (item.getMoneytype === '保底服务费') {
        //         if (subItem.key === '保底服务费') {
        //           item.contractOtherMoney =
        //             subItem.value || Number(subItem.value) === 0
        //               ? '￥' + Decimal2String(new Decimal(subItem.value))
        //               : '';
        //         }
        //       }
        //       if (item.getMoneytype === '小时服务费') {
        //         if (subItem.key === '小时服务费') {
        //           item.contractOtherMoney =
        //             subItem.value || Number(subItem.value) === 0
        //               ? '￥' + Decimal2String(new Decimal(subItem.value)) + '元/小时'
        //               : '';
        //         }
        //       }
        //     });
        //   }
        // } else {
        //   item.getMoneytype = '--';
        //   item.contractOtherMoney =
        //     item.contract_detail.contract_amount || item.contract_detail.contract_amount === 0
        //       ? '￥' + Decimal2String(new Decimal(item.contract_detail.contract_amount))
        //       : '--';
        // }
      }
    } else {
      item.getMoneytype = '--';
      item.contractOtherMoney =
        item.contract_detail.contract_amount || item.contract_detail.contract_amount === 0
          ? '￥' + Decimal2String(new Decimal(item.contract_detail.contract_amount))
          : '--';
    }
    return item;
  });
};

export const columns = (ctx: {
  rowClick: (row: RootObjectChild) => void;
}): {
  label: string;
  align: string;
  dataType?: string;
  minWidth: string;
  fixed?: string;
  'show-overflow-tooltip'?: boolean;
  formatter?: (row: RootObjectChild, ...rest: any) => any;
}[] => {
  return [
    {
      label: '合同编号',
      align: 'left',
      dataType: 'text',
      minWidth: '160',
      fixed: 'left',
      'show-overflow-tooltip': true,
      formatter: row => {
        return (
          <div
            style={
              row.contract_info.id && {
                color: 'var(--theme-color)',
                cursor: 'pointer',
                'white-space': 'nowrap' /* 避免换行 */,
                overflow: 'hidden',
                'text-overflow': 'ellipsis',
              }
            }
            onClick={() => {
              if (!row.contract_info.id) return;
              onContractClick(row);
            }}
          >
            {row.contract_info.contract_uid || '--'}
          </div>
        );
      },
    },
    {
      label: '所属税目',
      align: 'center',
      dataType: 'text',
      minWidth: '140',
      'show-overflow-tooltip': true,
      formatter: (row: any, column: any) => {
        return (
          <div
            on-dblclick={() => {
              ctx.rowClick(row);
            }}
            style={{
              cursor: 'pointer',
              color: row.contract_info.tax_subject_type_name ? 'var(--text-color)' : '#c1c1c1',
            }}
          >
            {row.contract_info.tax_subject_type_name || '双击输入'}
            {/* <tg-icon
              onClick={() => {
                ctx.rowClick(row);
              }}
              name="ico-edit"
              style="margin-left:5px;"
            ></tg-icon> */}
          </div>
        );
      },
    },
    {
      label: '印花税',
      dataType: 'text',
      align: 'right',
      minWidth: '130',
      'show-overflow-tooltip': true,
      formatter: (row, column) => {
        return formatAmount(row.stamp_duty, 'None') || '--';
      },
    },
    {
      label: '项目名称',
      align: 'left',
      dataType: 'text',
      minWidth: '180',
      'show-overflow-tooltip': true,
      formatter: row => {
        return row.project_infos[0]?.project_name || '--';
      },
    },
    {
      label: '业务类型',
      align: 'center',
      dataType: 'text',
      minWidth: '100',
      'show-overflow-tooltip': true,
      formatter: row => {
        return E.project.BusinessTypeMap.get(row.contract_info.business_type) || '--';
      },
    },
    {
      label: '签约类型',
      align: 'center',
      dataType: 'text',
      minWidth: '100',
      formatter: row => {
        return SignTypeMap.get(row?.contract_info?.sign_type) || '--';
      },
    },
    {
      label: '合同金额',
      align: 'left',
      minWidth: '200',
      dataType: 'text',
      'show-overflow-tooltip': true,
      formatter: (row: any) => {
        const arr = [];
        if (row.contractMoney) {
          arr.push(
            h('div', [
              h(
                'span',
                {
                  style: {
                    color: 'var(--text-third-color)',
                  },
                },
                [row.contractCommission ? '服务费：' : '固定服务费：'],
              ),
              h(
                'span',
                {
                  style: {
                    color: 'var(--text-color)',
                  },
                },
                [row.contractMoney ?? '--'],
              ),
            ]),
          );
        }
        if (row.contractCommission) {
          arr.push(
            h('div', [
              h(
                'span',
                {
                  style: {
                    color: 'var(--text-third-color)',
                  },
                },
                ['佣金：'],
              ),
              h(
                'span',
                {
                  style: {
                    color: 'var(--text-color)',
                  },
                },

                [removeZeroKolCommission(row.contractCommission) || '--'],
              ),
            ]),
          );
        }
        if (row.contractOtherMoney) {
          arr.push(
            h('div', [
              h(
                'span',
                {
                  style: {
                    color: 'var(--text-color)',
                  },
                },
                [row.contractOtherMoney ?? '--'],
              ),
            ]),
          );
        }
        return arr.length > 0 ? arr : '--';
      },
    },
    {
      label: '已付金额 (元)',
      align: 'right',
      dataType: 'text',
      minWidth: '130',
      formatter: row => {
        const arrived_amount_data = (row.pay_infos || []).map((item: any) => {
          return [
            item.settlement_uid,
            item.pay_rece_uid,
            formatAmount(item.amount) || '--',
            item.confirmed_by_name,
            moment(item.confirmed_time).format('YYYY.MM.DD'),
          ];
        });
        const write_off_header = ['结算单编号', '应付编号', '金额 (元)', '发起人/日期'];
        return h(WriteOff, {
          attrs: {
            is_reverse: false,
            write_off_header,
            write_off_infos: arrived_amount_data || [],
            btnTitle: formatAmount(row.paid_amount, 'None') || '--',
          },
        });
      },
    },
    {
      label: '待付金额 (元)',
      align: 'right',
      dataType: 'text',
      minWidth: '130',
      formatter: (row: any) => {
        return formatAmount(row.pending_amount, 'None') || '--';
      },
    },
    {
      label: '审批中金额 (元)',
      align: 'right',
      dataType: 'text',
      minWidth: '130',
      formatter: (row: any) => {
        return formatAmount(row.approving_amount, 'None') || '--';
      },
    },
    {
      label: '未付金额 (元)',
      align: 'right',
      dataType: 'text',
      minWidth: '130',
      formatter: (row: any) => {
        return formatAmount(row.unpay_amount, 'None') || '--';
      },
    },
    {
      label: '已到票金额 (元)',
      align: 'right',
      dataType: 'text',
      minWidth: '130',
      formatter: (row: any) => {
        return formatAmount(row.invoice_amount, 'None') || '--';
      },
    },
    {
      label: '未到票金额 (元)',
      align: 'right',
      dataType: 'text',
      minWidth: '130',
      formatter: (row: any) => {
        return formatAmount(row.uninvoice_amount, 'None') || '--';
      },
    },
    {
      label: '往来单位',
      align: 'left',
      dataType: 'text',
      minWidth: '180',
      'show-overflow-tooltip': true,
      formatter: (row: any) => {
        return row.contract_info?.company_name || '--';
      },
    },
    {
      label: '发起人',
      align: 'center',
      dataType: 'text',
      minWidth: '80',
      formatter: (row: any) => {
        return row.contract_info.add_by_name || '--';
      },
    },
    {
      label: '发起日期',
      align: 'center',
      dataType: 'text',
      minWidth: '140',
      formatter: (row: any) => {
        // return row.audit_time || '--';
        return row.contract_info?.gmt_create
          ? moment(row.contract_info?.gmt_create).format('YYYY.MM.DD HH:mm')
          : '--';
      },
    },
    {
      label: '归属部门',
      align: 'center',
      dataType: 'text',
      minWidth: '120',
      formatter: (row: any) => {
        return row?.belong_department_name || '--';
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

export const customerColumns = (ctx: {
  rowClick: (row: verificationModel) => void;
}): {
  label: string;
  align: string;
  dataType?: string;
  minWidth: string;
  fixed?: string;
  'show-overflow-tooltip'?: boolean;
  formatter?: (row: any, ...rest: any) => any;
}[] => {
  return [
    {
      label: '合同编号',
      align: 'left',
      dataType: 'text',
      minWidth: '160',
      fixed: 'left',
      'show-overflow-tooltip': true,
      formatter: row => {
        return (
          <div
            style={
              row.contract_info.id && {
                color: 'var(--theme-color)',
                cursor: 'pointer',
                'white-space': 'nowrap' /* 避免换行 */,
                overflow: 'hidden',
                'text-overflow': 'ellipsis',
              }
            }
            onClick={() => {
              if (!row.contract_info.id) return;
              onContractClick(row);
            }}
          >
            {row.contract_info.contract_uid || '--'}
          </div>
        );
      },
    },
    {
      label: '所属税目',
      align: 'center',
      dataType: 'text',
      minWidth: '140',
      'show-overflow-tooltip': true,
      formatter: (row: any, column: any) => {
        return (
          <div
            on-dblclick={() => {
              ctx.rowClick(row);
            }}
            style={{
              cursor: 'pointer',
              color: row.contract_info.tax_subject_type_name ? 'var(--text-color)' : '#c1c1c1',
            }}
          >
            {row.contract_info.tax_subject_type_name || '双击输入'}
          </div>
        );
      },
    },
    {
      label: '印花税',
      dataType: 'text',
      align: 'right',
      minWidth: '130',
      'show-overflow-tooltip': true,
      formatter: (row, column) => {
        return formatAmount(row.stamp_duty, 'None') || '--';
      },
    },
    {
      label: '项目名称',
      align: 'left',
      dataType: 'text',
      minWidth: '180',
      'show-overflow-tooltip': true,
      formatter: row => {
        return row.project_infos[0]?.project_name || '--';
      },
    },
    {
      label: '业务类型',
      align: 'center',
      dataType: 'text',
      minWidth: '100',
      'show-overflow-tooltip': true,
      formatter: row => {
        return E.project.BusinessTypeMap.get(row.contract_info.business_type) || '--';
      },
    },
    {
      label: '签约类型',
      align: 'center',
      dataType: 'text',
      minWidth: '100',
      'show-overflow-tooltip': true,
      formatter: row => {
        return SignTypeMap.get(row?.contract_info?.sign_type) || '--';
      },
    },
    {
      label: '合同金额',
      align: 'left',
      minWidth: '200',
      dataType: 'text',
      'show-overflow-tooltip': true,
      formatter: row => {
        const arr = [];
        if (row.contractMoney) {
          arr.push(
            h('div', [
              h(
                'span',
                {
                  style: {
                    color: 'var(--text-third-color)',
                  },
                },
                [row.contractCommission ? '服务费：' : '固定服务费：'],
              ),
              h(
                'span',
                {
                  style: {
                    color: 'var(--text-color)',
                  },
                },
                [row.contractMoney ?? '--'],
              ),
            ]),
          );
        }
        if (row.contractCommission) {
          arr.push(
            h('div', [
              h(
                'span',
                {
                  style: {
                    color: 'var(--text-third-color)',
                  },
                },
                ['佣金：'],
              ),
              h(
                'span',
                {
                  style: {
                    color: 'var(--text-color)',
                  },
                },

                [removeZeroKolCommission(row.contractCommission) || '--'],
              ),
            ]),
          );
        }
        if (row.contractOtherMoney) {
          arr.push(
            h('div', [
              h(
                'span',
                {
                  style: {
                    color: 'var(--text-color)',
                  },
                },
                [row.contractOtherMoney ?? '--'],
              ),
            ]),
          );
        }
        return arr.length > 0 ? arr : '--';
      },
    },
    {
      label: '已收款金额 (元)',
      align: 'right',
      dataType: 'text',
      minWidth: '130',
      formatter: row => {
        const arrived_amount_data = (row.rece_infos || []).map((item: any) => {
          return [
            item.settlement_uid,
            item.pay_rece_uid,
            formatAmount(item.amount) || '--',
            item.confirmed_by_name,
            moment(item.confirmed_time).format('YYYY.MM.DD'),
          ];
        });
        const write_off_header = ['结算单编号', '应付编号', '金额 (元)', '发起人/日期'];
        return h(WriteOff, {
          attrs: {
            is_reverse: false,
            write_off_header,
            write_off_infos: arrived_amount_data || [],
            btnTitle: formatAmount(row.received_amount, 'None') || '--',
          },
        });
      },
    },
    {
      label: '未收款金额 (元)',
      align: 'right',
      dataType: 'text',
      minWidth: '130',
      formatter: (row: any) => {
        return formatAmount(row.unreceived_amount, 'None') || '--';
      },
    },
    {
      label: '客户公司', //待定
      align: 'left',
      dataType: 'text',
      minWidth: '180',
      'show-overflow-tooltip': true,
      formatter: (row: any) => {
        return row.contract_info?.company_name || '--';
      },
    },
    {
      label: '发起人',
      align: 'center',
      dataType: 'text',
      minWidth: '80',
      formatter: (row: any) => {
        return row.contract_info.add_by_name || '--';
      },
    },
    {
      label: '发起日期',
      align: 'center',
      dataType: 'text',
      minWidth: '140',
      formatter: (row: any) => {
        // return row.audit_time || '--';
        return row.contract_info?.gmt_create
          ? moment(row.contract_info?.gmt_create).format('YYYY.MM.DD HH:mm')
          : '--';
      },
    },
    {
      label: '归属部门',
      align: 'center',
      dataType: 'text',
      minWidth: '120',
      formatter: (row: any) => {
        return row?.belong_department_name || '--';
      },
    },
  ];
};
// 供应商合同查询字段
export type RootObject = RootObjectChild[];
export interface RootObjectChildContract_detailAttachment_url_list {
  file_name: string;
  url: string;
}
export interface RootObjectChildContract_detail {
  add_by: number;
  anchor_commission_rate: number;
  attachment_url: string;
  attachment_url_list: RootObjectChildContract_detailAttachment_url_list[];
  contract_amount: string;
  contract_commission_rate: number;
  contract_scan_urls: any[];
  flag: number;
  gmt_create: string;
  gmt_modified: string;
  modified_by: number;
  ourself_commission_rate: number;
}
export interface RootObjectChildContract_info {
  add_by: number;
  add_by_name: string;
  anchor_id?: any;
  approval_department_id?: any;
  approval_department_name?: any;
  approval_time?: any;
  approve_time: number;
  approver_id?: any;
  business_type: number;
  company_id: number;
  company_name: string;
  contract_scan_add_by: number;
  contract_scan_message?: any;
  contract_scan_status: number;
  contract_scan_urls: string;
  contract_status: number;
  contract_status_str: string;
  contract_todo_str: string;
  contract_type: number;
  contract_type_str: string;
  contract_uid: string;
  coop_end_date?: any;
  coop_start_date: string;
  cooperation_id?: any;
  cooperative_sign_type?: any;
  create_time_str: string;
  feishu_request_id: string;
  feishu_serial_number: number;
  flag: number;
  frame_contract_id?: any;
  gmt_create: string;
  gmt_modified: string;
  id: number;
  invoice_content: string;
  is_recycled: number;
  last_annex_status: number;
  modified_by: number;
  oa_request_id?: any;
  partner_id: number;
  pay_type: number;
  project_id: number;
  release_status: number;
  remark: string;
  sale_chance: any[];
  settlement_type?: any;
  shop_id?: any;
  sign_type: number;
  tax_subject_rate: number;
  tax_subject_type?: any;
}
export interface RootObjectChildPartner_info {
  id: number;
  partner_name: string;
  shop_name: string;
}
export interface RootObjectChildProject_infos {
  project_contract_relation_type: number;
  project_id: number;
  project_name: string;
  project_uid: string;
}
export interface RootObjectChildTemplate_infoContract_detail {
  key: string;
  value: number;
}
export interface RootObjectChildTemplate_infoCooperation_duration {
  key: string;
  value: string;
}
export interface RootObjectChildTemplate_infoFrontend_data {
  approval_department_id: number;
  cashdeposit_need_type: number;
  contract_status: number;
  contract_xieyi_yifang_type: boolean;
  contract_xieyi_yuangao_type: boolean;
  cooperation_contract_long_type: boolean;
  cooperation_contract_type: number;
  cooperation_zhubo_real_end_time: string;
  cooperation_zhubo_real_last_time: string;
  cooperation_zhubo_real_start_time: string;
  file_url_list: string[];
  mybusiness_type: number;
  myprojectId: string;
  myproject_type: number;
  other_remark: string;
  other_stamp_count: string;
  other_stamp_send_type: number;
  other_stamp_time: string;
  other_stamp_type: number;
  own_contract_type: number;
  own_name: string;
  own_tel: string;
  payee_ROI_type: number;
  payee_execute_type: number;
  payee_request_card_type: number;
  payee_request_opencard_shuilv: string;
  payee_request_opencard_type: number;
  payee_request_type: number;
  payee_type: number;
  payee_yongjinlv_four: string;
  payee_yongjinlv_three: string;
}
export interface baseOption {
  key: string;
  value: number;
}
export interface RootObjectChildTemplate_info {
  add_by: number;
  anchor_info?: any;
  company_info?: any;
  contract_category: number;
  contract_detail: RootObjectChildTemplate_infoContract_detail[];
  contract_uid: string;
  cooperation_content?: any;
  cooperation_duration: RootObjectChildTemplate_infoCooperation_duration[];
  feishu_request_id?: any;
  flag: number;
  floor_monthly_wage?: any;
  frontend_data: RootObjectChildTemplate_infoFrontend_data;
  gmt_create: string;
  gmt_modified: string;
  hourly_wage?: any;
  id: number;
  main_contract_uid?: any;
  margin: baseOption[];
  modified_by: number;
  others: baseOption[];
  our_info: baseOption[];
  pay_condition: baseOption[];
  settlement_type?: any;
}
export interface RootObjectChild {
  associate_contract_count: number;
  associate_contracts: any[];
  contract_annex_info: any[];
  contract_annex_work_infos: any[];
  contract_detail: RootObjectChildContract_detail;
  contract_info: RootObjectChildContract_info;
  contract_statements_list: any[];
  contract_work_infos: any[];
  partner_info: RootObjectChildPartner_info;
  pay_infos?: any;
  project_contract_relation_type?: any;
  project_infos: RootObjectChildProject_infos[];
  rece_infos?: any;
  settlement_info: any;
  template_info: RootObjectChildTemplate_info;
  is_pin_fee: boolean;
  paid_amount: number;
  stamp_duty: number;
}

export interface prepayQueryForm {
  contract_uid?: string | undefined;
  tax_subject_type?: string | number | undefined;
  business_type?: string | number | undefined;
  sign_type?: string | number | undefined;
  project_name?: string | undefined;
  page_num?: number;
  num?: number;
  receipt_status?: number | undefined;
}
