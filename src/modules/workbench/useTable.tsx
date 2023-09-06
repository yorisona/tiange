/**
 * 表格部分
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-18 13:52:42
 */

import { h, ref, computed } from '@vue/composition-api';
import { ApprovalListQueryParams, ApprovalRecord } from '@/types/tiange/workbench';
import { TableColumn } from '@/types/vendor/column';
import { GetApprovalList } from '@/services/workbentch';
import { fillEmptyStr, get_limited_length_string } from '@/utils/string';
import { approvalType2Text, approvalType2AmountText } from './funcs';
import { sleep } from '@/utils/func';
import { numberMoneyFormat } from '@/utils/formatMoney';
import { APPROVAL_TYPE } from '@/types/tiange/workbench.enum';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { max_length_of_column } from '@/utils/table';

type Col = TableColumn<ApprovalRecord>;

const approvalAmount = (row: any) => {
  const content = row.approval_content;
  let amount = null;
  switch (row.approval_type) {
    case 1:
      amount = content.transfer_amount;
      break;
    case 2:
      amount = content.refund_amount;
      break;
    case 3:
      amount = content.borrowing_amount;
      break;
    case 4:
      amount = content.invoice_amount;
      break;
    case 9:
      amount = content.contract_amount;
      break;
    case 10:
      amount = content.contract_amount;
      break;
    case 11:
      amount = content.invoice_amount;
      break;
    case 12:
      amount = content.invoice_amount;
      break;
    case 13:
      amount = content.amount_involved;
      break;
  }
  if (amount !== null) {
    return numberMoneyFormat(amount, 2);
  } else {
    return '--';
  }
};

const data = ref<ApprovalRecord[]>([]);
const project_name_render = <T extends boolean>(row: ApprovalRecord, text_only: T) => {
  let originText = row.project_name || '--';
  if (row.approval_type === APPROVAL_TYPE.use_seal) {
    originText = row.approval_detail?.file_name || '--';
  }
  // const data = row.project_name || '--';

  const { is_folded, folded_text } = get_limited_length_string(originText, 12);

  return text_only || !is_folded
    ? folded_text
    : (h(
        'el-popover',
        {
          props: {
            placement: 'right',
            trigger: 'hover',
            content: originText,
          },
        },
        [h('span', { slot: 'reference' }, [folded_text])],
      ) as TableColumnRenderReturn<T>);
};
const project_name_max_length = max_length_of_column(data, '项目/文件', project_name_render);
// TODO: 工作台我发起的表格
export const useTable = () => {
  const columns = computed<Col[]>(() => {
    return [
      {
        label: '项目/文件',
        // prop: 'project_name',
        align: 'left',
        headerAlign: 'left',
        minWidth: project_name_max_length.value,
        formatter: row => project_name_render(row, false),
        // formatter: row => {
        //   if (row.approval_type === APPROVAL_TYPE.use_seal) {
        //     return row.approval_detail?.file_name || '--';
        //   }
        //   return row.project_name || '--';
        // },
      },
      {
        label: '审批类型',
        prop: 'approval_type',
        align: 'left',
        headerAlign: 'left',
        width: 112,
        formatter: ({ approval_type }) => {
          return approvalType2Text(approval_type);
        },
      },
      {
        label: '审批编号',
        prop: 'approval_uid',
        align: 'left',
        headerAlign: 'left',
        width: 212,
      },
      {
        label: '审批金额',
        prop: 'approval_content',
        className: 'col-approval-content',
        labelClassName: 'col-approval-content',
        align: 'right',
        headerAlign: 'right',
        minWidth: 205,
        formatter: row => approvalAmount(row),
      },
      {
        label: '审批内容',
        prop: 'approval_content',
        className: 'col-approval-content',
        labelClassName: 'col-approval-content',
        align: 'right',
        headerAlign: 'right',
        width: 150,
        formatter: row => {
          const inTheThirdLevel = [12, 13];
          const inTheApprovalType = [APPROVAL_TYPE.customer, APPROVAL_TYPE.supplier];
          if (
            inTheApprovalType.includes(row.approval_type) &&
            inTheThirdLevel.includes(row.level_three_types)
          ) {
            return '结算单用印';
          } else {
            if (row.approval_type === APPROVAL_TYPE.asset_scrapped) {
              return row.level_two_types === 2 ? '资产领用' : '资产报废';
            }
            return approvalType2AmountText(row.approval_type);
          }
        },
      },
      {
        label: '发起时间',
        prop: 'start_time',
        align: 'left',
        headerAlign: 'left',
        minWidth: 141,
        formatter: ({ start_time }) => fillEmptyStr(start_time.replace(/-/g, '.')),
      },
      {
        label: '结束时间',
        prop: 'end_time',
        align: 'left',
        headerAlign: 'left',
        minWidth: 141,
        formatter: ({ end_time }) => fillEmptyStr(end_time.replace(/-/g, '.')),
      },
      {
        label: '审批状态',
        prop: 'approval_status',
        align: 'left',
        headerAlign: 'left',
        minWidth: 119,
        formatter: (row, column, val) => {
          if (val === 1) {
            // return h('span', { class: 'fg-waiting' }, '审批中');
            return h('span', { class: 'status-box' }, [
              h('span', { class: 'point waiting' }),
              h('span', { class: 'text' }, '审批中'),
            ]);
          } else if (val === 2) {
            // return h('span', { class: 'fg-success' }, '审批成功');
            return h('span', { class: 'status-box' }, [
              h('span', { class: 'point success' }),
              h('span', { class: 'text' }, '审批成功'),
            ]);
          } else if (val === 3) {
            // return h('span', { class: 'fg-failure' }, '审批失败');
            return h('span', { class: 'status-box' }, [
              h('span', { class: 'point failure' }),
              h('span', { class: 'text' }, '审批失败'),
            ]);
          } else if (val === 4) {
            // return h('span', { class: 'fg-cancel' }, '已撤销');
            return h('span', { class: 'status-box' }, [
              h('span', { class: 'point cancel' }),
              h('span', { class: 'text' }, '已撤销'),
            ]);
          }
        },
      },
      {
        label: '详情',
        align: 'left',
        headerAlign: 'left',
        minWidth: 77,
        formatter: (row: any) => {
          return h(
            'el-button',
            {
              attrs: { type: 'text', style: 'padding: 0; color: var(--theme-color);' },
            },
            '查看',
          );
        },
      },
    ];
  });

  const total = ref(0);

  const loading = ref(false);

  const loadData = async (payload: ApprovalListQueryParams) => {
    loading.value = true;
    // 此处 sleep 400ms 防止请求返回过快造成页面加载中效果一闪而过
    const [{ data: response }, _] = await Promise.all([
      await GetApprovalList(payload),
      await sleep(400),
    ]);
    loading.value = false;

    data.value.splice(0, data.value.length);
    if (response.success) {
      data.value.push(...response.data.data);
      total.value = response.data.total;
    } else {
      total.value = 0;
    }
  };

  return {
    columns,
    data,
    total,
    loading,
    loadData,
  };
};
