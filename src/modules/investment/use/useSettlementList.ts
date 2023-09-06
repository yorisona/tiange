import { computed, h, ref, SetupContext } from '@vue/composition-api';
import { Settlement, SettlementStatus } from '@/types/tiange/finance/settlement';
import { SettlementCol, useColumns } from '@/modules/settlement/use/columns';
// import { MerchantsQueryParams } from '@/types/tiange/investment';
import { sleep } from '@/utils/func';
import { QuerySettlementList } from '@/services/investment';
import { is_reversed_order, is_refunded_order } from '@/use/finance';
import { ReverseStatus } from '@/types/tiange/finance/finance';
import Decimal from 'decimal.js';
import { Decimal2String, get_limited_length_string } from '@/utils/string';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { max_length_of_column } from '@/utils/table';

import { usePermission } from '@/use/permission';

export enum ItemType {
  /** 编辑 */
  edit = 0,
  /** 删除 */
  delete,
  /** 查看 */
  check,
  /** 查看原因 */
  checkReason,
  /** 财务确认 */
  financeComfirm,
  /** 冲销 */
  writeOff,
  /** 重新冲销 */
  writeOffAgain,
  /** 冲销 */
  writeOffConfirm,
  /** 收款 */
  collection,
  /** 开票申请 */
  billing,
  // 退款查看
  refundedCheck,
  // 退款查看退回原因
  refundedCheckResaon,
}

export const useList = (
  ctx: SetupContext,
  clickAction: (itemType: ItemType, settlement: Settlement) => void,
) => {
  const loading = ref(false);
  const total = ref(0);
  const data = ref<Settlement[]>([]);

  const loadData = async (payload: any) => {
    loading.value = true;
    const [_, { data: response }] = await Promise.all([
      await sleep(500),
      await QuerySettlementList(payload),
    ]);

    loading.value = false;
    if (response.success) {
      data.value = response.data.data;
      total.value = response.data.total;
    } else {
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };

  const {
    settlement_number_column,
    settlement_company_column,
    settlement_cycle_column,
    settlement_money_column,
    settlement_tax_rate_column,
    settlement_tax_amount_column,
    settlement_no_tax_amount_column,
    settlement_status_column,
    write_off_status_column,
    settlement_person_column,
    submit_date_column,
    confirm_person_column,
    confirm_date_column,
    settlement_bill_column,
  } = useColumns(data);

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

  /** 项目名称最大宽度 */
  const project_name_max_length = max_length_of_column(data, '项目名称', project_name_render);

  const permission = usePermission();

  const columns = computed<SettlementCol[]>(() => [
    settlement_number_column.value,
    settlement_cycle_column.value,
    settlement_company_column.value,
    settlement_money_column.value,
    settlement_tax_rate_column.value,
    settlement_tax_amount_column.value,
    settlement_no_tax_amount_column.value,
    {
      label: '相关项目',
      property: 'project_name',
      minWidth: project_name_max_length.value,
      formatter: row => project_name_render(row, false),
    },
    {
      label: '招商收入 (元)',
      minWidth: 120,
      align: 'right',
      formatter: row => {
        const data = Decimal2String(new Decimal(row.merchant_income_amount ?? 0));
        return data;
      },
    },
    {
      label: '项目收入 (元)',
      minWidth: 120,
      align: 'right',
      formatter: row => {
        const data = Decimal2String(new Decimal(row.project_income_amount ?? 0));
        return data;
      },
    },
    settlement_status_column.value,
    write_off_status_column.value,
    settlement_person_column.value,
    submit_date_column.value,
    confirm_person_column.value,
    confirm_date_column.value,
    settlement_bill_column.value,
    {
      label: '操作',
      minWidth: 200,
      fixed: 'right',
      formatter: row => {
        const btns = [];

        const editBtn = h(
          'a',
          {
            on: {
              click: (event: MouseEvent) => {
                // onEditBtnClick(row);
                clickAction(ItemType.edit, row);
                event.stopPropagation();
              },
            },
            class: 'line-clamp-1',
          },
          ['编辑'],
        );
        const delBtn = permission.merchant_settlement_del
          ? h(
              'a',
              {
                on: {
                  click: (event: MouseEvent) => {
                    // onEditBtnClick(row);
                    clickAction(ItemType.delete, row);
                    event.stopPropagation();
                  },
                },
                class: 'line-clamp-1',
              },
              ['删除'],
            )
          : undefined;
        const checkBtn = h(
          'a',
          {
            on: {
              click: (event: MouseEvent) => {
                // onEditBtnClick(row);
                clickAction(ItemType.check, row);
                event.stopPropagation();
              },
            },
            class: 'line-clamp-1',
          },
          ['查看'],
        );
        const checkReasonBtn = h(
          'a',
          {
            on: {
              click: (event: MouseEvent) => {
                // onEditBtnClick(row);
                clickAction(ItemType.checkReason, row);
                event.stopPropagation();
              },
            },
            class: 'line-clamp-1',
          },
          ['查看原因'],
        );
        const financeConfirmBtn = permission.merchant_settlement_confirmed
          ? h(
              'a',
              {
                on: {
                  click: (event: MouseEvent) => {
                    // onEditBtnClick(row);
                    clickAction(ItemType.financeComfirm, row);
                    event.stopPropagation();
                  },
                },
                class: 'line-clamp-1',
              },
              ['财务确认'],
            )
          : undefined;
        const cxBtn = h(
          'a',
          {
            on: {
              click: (event: MouseEvent) => {
                // onEditBtnClick(row);
                clickAction(ItemType.writeOff, row);
                event.stopPropagation();
              },
            },
            class: 'line-clamp-1',
            style: { color: 'var(--error-color)' },
          },
          ['冲销'],
        );
        const receiveAmountBtn = permission.merchant_settlement_collection
          ? h(
              'tg-button',
              {
                props: {
                  type: 'link',
                  disabled: (row.settlement_no_register_amount ?? 0) <= 0 ? true : false,
                },
                on: {
                  click: (event: MouseEvent) => {
                    // onEditBtnClick(row);
                    if (
                      row.settlement_no_register_amount &&
                      row.settlement_no_register_amount > 0
                    ) {
                      clickAction(ItemType.collection, row);
                    }
                    event.stopPropagation();
                  },
                },
                class: 'line-clamp-1',
              },
              ['收款'],
            )
          : undefined;
        const kpBtn = permission.merchant_settlement_invoice
          ? h(
              'a',
              {
                on: {
                  click: (event: MouseEvent) => {
                    // onEditBtnClick(row);
                    clickAction(ItemType.billing, row);
                    event.stopPropagation();
                  },
                },
                class: 'line-clamp-1',
              },
              ['开票申请'],
            )
          : undefined;
        const financialReverseAgainBtn = h(
          'a',
          {
            on: {
              click: (event: MouseEvent) => {
                // onEditBtnClick(row);
                clickAction(ItemType.writeOffAgain, row);
                event.stopPropagation();
              },
            },
            class: 'line-clamp-1',
          },
          ['重新提交'],
        );
        const writeOffConfirmBtn = h(
          'a',
          {
            on: {
              click: (event: MouseEvent) => {
                // onEditBtnClick(row);
                clickAction(ItemType.writeOffConfirm, row);
                event.stopPropagation();
              },
            },
            class: 'line-clamp-1',
          },
          ['冲销确认'],
        );
        const checkRefundedBtn = h(
          'a',
          {
            on: {
              click: (event: MouseEvent) => {
                // onEditBtnClick(row);
                clickAction(ItemType.refundedCheck, row);
                event.stopPropagation();
              },
            },
            class: 'line-clamp-1',
          },
          ['查看'],
        );
        const checkRefundedResaonBtn = h(
          'a',
          {
            on: {
              click: (event: MouseEvent) => {
                // onEditBtnClick(row);
                clickAction(ItemType.refundedCheckResaon, row);
                event.stopPropagation();
              },
            },
            class: 'line-clamp-1',
          },
          ['查看原因'],
        );
        if (is_refunded_order(row)) {
          const { refund_status = 1 } = row;
          switch (refund_status) {
            case 1: {
              break;
            }
            case 2: {
              btns.push(checkRefundedBtn);
              break;
            }
            case 3: {
              btns.push(checkRefundedResaonBtn);
              btns.push(delBtn);
              break;
            }
            default: {
              break;
            }
          }
        } else if (is_reversed_order(row)) {
          switch (row.reverse_status) {
            case ReverseStatus.refused: {
              btns.push(delBtn);
              btns.push(financialReverseAgainBtn);
              btns.push(checkReasonBtn);
              break;
            }
            case ReverseStatus.wait_confirm: {
              btns.push(writeOffConfirmBtn);
              break;
            }
            default: {
              btns.push(checkBtn);
              break;
            }
          }
        } else {
          switch (row.status) {
            case SettlementStatus.unsubmit: {
              btns.push(editBtn);
              btns.push(delBtn);
              break;
            }
            case SettlementStatus.wait_confirm: {
              btns.push(checkBtn);
              btns.push(financeConfirmBtn);
              break;
            }
            case SettlementStatus.refused: {
              btns.push(checkReasonBtn);
              btns.push(editBtn);
              btns.push(delBtn);
              break;
            }
            case SettlementStatus.confirmed: {
              btns.push(checkBtn);
              if (!row.reverse_id) {
                if (row.has_refund_settlement !== 1) {
                  btns.push(cxBtn);
                }
                if (row.settlement_no_write_off_amount) {
                  btns.push(receiveAmountBtn);
                }
                const write_off_amount = row.write_off_amount ? `${row.write_off_amount}` : '0';
                const tax_included_amount = row.tax_included_amount
                  ? `${row.tax_included_amount}`
                  : '0';
                if (write_off_amount !== tax_included_amount) {
                  btns.push(kpBtn);
                }
              }
              break;
            }
            case SettlementStatus.wait_project_confirm: {
              btns.push(checkBtn);
              break;
            }
            case SettlementStatus.nopass_project_confirm: {
              btns.push(checkReasonBtn);
              btns.push(editBtn);
              btns.push(delBtn);
              break;
            }
            default:
              break;
          }
        }

        return h(
          'div',
          {
            class: 'operation',
          },
          btns,
        );
      },
    },
  ]);
  return {
    loadData,
    loading,
    total,
    data,
    columns,
  };
};
