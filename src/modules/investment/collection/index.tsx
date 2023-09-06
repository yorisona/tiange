import { defineComponent, ref, UnwrapRef, computed, h, provide } from '@vue/composition-api';
import invoicelist from '@/modules/live/project/dialog/invoice.list.vue';
import { AsyncConfirm } from '@/use/asyncConfirm';
import achievement from '@/modules/live/project/dialog/achievement.vue';
import use from './use';
import { gatherTypeOptions, gatherWayOptions } from '@/const/options';
import invoice from '@/modules/live/project/dialog/invoice';
import formatData from '@/utils/formatData';
import { usePermission } from '@/use/permission';
// import { MoneyUnit } from '@/utils/money';
import { useUserInfo } from '@/use/vuex';
import moment from 'moment';
import { ContractType } from '@/types/tiange/contract';
import InvoiceDetail from '@/modules/workbench/initiate/invoice/detail.vue';
import { TgInvoiceDetail } from '@/modules/workbench/initiate/invoice/detail';
import FirstStep from '@/modules/live/project/tabs/writeDialog/firstStep.vue';
import WriteOff from '@/components/BusinessComponents/WriteOff/index.vue';
import reverseOrderDialog from '@/modules/settlement/component/reverseOrder.vue';
import { FinancialReverseParams, ReverseType } from '@/types/tiange/finance/settlement';
import { FinancialReverse, FinancialReverseAgain } from '@/services/finance';
import { Decimal2String, get_length_of_string } from '@/utils/string';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { LiveProjectAchievement } from '@/types/tiange/live.project';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { max_length_of_column } from '@/utils/table';
import Decimal from 'decimal.js';
import { TableColumn } from '@/types/vendor/column';
import { fixFileToken } from '@/utils/http';
import refundDialog from '@/modules/marketing/project/dialog/refund/form.vue';
import RefundWriteOff from '@/modules/live/project/dialog/refundWriteOff.vue';
import { CommonBusinessProjectDetail } from '@/types/tiange/commonBusiness/project';
import { GetCommonBusinessProjectDetail } from '@/services/commonBusiness/project';

export default defineComponent({
  components: {
    invoicelist,
    InvoiceDetail,
    FirstStep,
    reverseOrderDialog,
    refundDialog,
    RefundWriteOff,
    achievement,
  },
  setup(props, ctx) {
    const achievementRef = ref<{ show: (obj?: any, btype?: any) => void } | undefined>(undefined);
    const invoicelistRef = ref<UnwrapRef<{ show: (obj?: any) => void } | null>>(null);

    const projectLoading = ref<boolean>(false);

    const project = ref<CommonBusinessProjectDetail | undefined>(undefined);
    provide('project', project);

    /** 开票审批 弹窗 */
    const invoiceDialogRef = ref<TgInvoiceDetail | null>(null);
    const firstStepRef = ref<UnwrapRef<{ show: (...args: any) => void } | undefined>>(undefined);
    const writeOffLoading = ref<boolean>(false);
    const reason = ref<string>('');
    const reasonDialogTitle = ref<string>('');
    const reasonDialogVisible = ref<boolean>(false);
    const refundWriteOffVisible = ref<boolean>(false);
    const refundWriteOffId = ref<string | number | undefined>(undefined);
    const refundWriteOffAchievementId = ref<number | undefined>(undefined);
    const refundWriteOffAmount = ref<number | undefined>(undefined);
    const permission = usePermission();
    const achievment = use.useShopLiveAchievment();
    achievment.query();
    const deleteCollection = async (achievement_id: number, title: string) => {
      const reuslt = await AsyncConfirm(ctx, title);
      if (reuslt) {
        achievment.deleteShopLiveAchievement(achievement_id).then(() => {
          achievment.reload();
        });
      }
    };

    const refundDialogVisible = ref(false);
    const refundRow = ref({
      achievement_id: '',
      achievement_uid: '',
      project_name: '',
      gather_amount: 0,
      project_id: '',
      business_type: '',
    });

    const onRefundViewBtnClick = (row: any) => {
      refundRow.value.achievement_id = row.achievement_id;
      refundRow.value.achievement_uid = row.achievement_uid;
      refundRow.value.project_name = row.project_name;
      refundRow.value.gather_amount = row.gather_amount;
      refundRow.value.project_id = row.project_id;
      refundRow.value.business_type = row.business_type;
      refundDialogVisible.value = true;
    };

    const onRefundDialogClose = () => {
      refundRow.value.achievement_id = '';
      refundRow.value.achievement_uid = '';
      refundRow.value.project_name = '';
      refundRow.value.gather_amount = 0;
      refundRow.value.project_id = '';
      refundRow.value.business_type = '';
      refundDialogVisible.value = false;
    };

    const userinfo = useUserInfo();

    const getContractJumpLink = (contract_type: number, contract_id: number) => {
      if ([ContractType.Sales, ContractType.Framework].includes(contract_type)) {
        return '/legal/contract/customer/' + contract_id.toString();
      } else if ([ContractType.ServiceContract].includes(contract_type)) {
        return '/legal/contract/customerTemplate/' + contract_id.toString();
      } else if ([ContractType.Purchase, ContractType.SupplierFramework].includes(contract_type)) {
        return (
          '/legal/contract/supplier/' +
          contract_id.toString() +
          '?contract_type=' +
          contract_type.toString()
        );
      } else if ([ContractType.SupplierContract].includes(contract_type)) {
        return (
          '/legal/contract/supplierTemplate/' +
          contract_id.toString() +
          '?contract_type=' +
          contract_type.toString()
        );
      } else if ([ContractType.AnchorContract].includes(contract_type)) {
        return (
          '/legal/contract/anchorTemplate/' +
          contract_id.toString() +
          '?contract_type=' +
          contract_type.toString()
        );
      } else {
        return '';
      }
    };
    const reverseOrderDialogRef = ref<{
      open: (cb: (msg: string) => Promise<boolean>, reverse_reason?: string) => void;
    } | null>(null);

    /** 冲销动作 */
    const onWriteOffConfirmResolve = async (row: any, msg: string, again: boolean) => {
      const params: FinancialReverseParams = {
        id: row.achievement_id,
        reverse_reason: msg,
        reverse_type: ReverseType.receive,
      };
      writeOffLoading.value = true;
      let res;
      if (again) {
        res = await FinancialReverseAgain(params);
      } else {
        res = await FinancialReverse(params);
      }
      writeOffLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success(res.data.message ?? '冲销成功');
        achievment.reload();
      } else {
        ctx.root.$message.error(res.data.message ?? '冲销失败');
      }
      return res.data.success;
    };

    const onViewReverseReason = (row: any) => {
      reason.value = row.reverse_reason;
      reasonDialogVisible.value = true;
      reasonDialogTitle.value = '冲销原因';
    };

    const onViewReverseBackReason = (row: any) => {
      reason.value = row.reverse_back_reason;
      reasonDialogVisible.value = true;
      reasonDialogTitle.value = '冲销退回原因';
    };

    const onReasonDialogClose = () => {
      reason.value = '';
      reasonDialogVisible.value = false;
    };

    const getProjectReq = async (project_id: string, successAction: () => void) => {
      projectLoading.value = true;
      const res = await GetCommonBusinessProjectDetail(project_id);
      projectLoading.value = false;
      if (res.data.success) {
        project.value = res.data.data;
        successAction?.();
      } else {
        ctx.root.$message.error(res.data.message ?? '获取项目详情失败');
      }
    };

    const editAction = (row: any) => {
      getProjectReq(row.project_id?.toString(), () => {
        const data: any = {
          achievement_name: row.achievement_name,
          gather_type: row.gather_type,
          gather_amount: row.gather_amount,
          gather_way: row.gather_way,
          contract_id: row.contract_id,
          is_invoice: row.is_invoice,
          invoice_apply_id: row.invoice_apply_id,
          achievement_id: row.achievement_id,
          id: row.settlement_id,
          company_name: row.customer_company_name,
        };
        const detail = row.gather_way_detail;
        if (detail) {
          data.order_date = detail.order_date;
          data.order_wangwang_id = detail.order_wangwang_id;
          data.task_id = detail.task_id;
          data.pay_company_name = detail.pay_company_name;
        }
        if (row.gather_certificate_pic) {
          const reg = new RegExp('\\/([^\\/]+)$');
          const match = reg.exec(row.gather_certificate_pic);
          let name;
          if (match) {
            name = match[1];
          }
          data.gather_certificate_pic = {
            name: name,
            value: row.gather_certificate_pic,
          };
        }
        if (row.contract_id && row.contract_info) {
          data.search_contract_list_value = [
            {
              label:
                row.contract_info.company_name +
                '  (' +
                row.contract_info.sign_type_name +
                ')  ' +
                row.contract_info.coop_start_date +
                '-' +
                row.contract_info.coop_end_date,
              value: row.contract_id,
            },
          ];
        }
        if (row.invoice_apply_id) {
          data.search_invoice_apply_value = [
            {
              label: row.approval_uid,
              value: row.invoice_apply_id,
            },
          ];
        }
        // const isMcn = ctx.root.$route.name === 'CommonBusinessProjectDetail'; // 创新项目
        // const isBrand = ctx.root.$route.name === 'SSLiveProjectDetail'; // 品牌中心业务
        // const isMarketing = ctx.root.$route.name === 'MarketingProjectDetail'; // 整合营销业务
        achievementRef.value?.show(data, {
          isMcn: true,
          isBrand: false,
          isMarketing: false,
          isMerchant: true,
        });
      });
    };

    // 自适应表格高度部分
    const buttonLineHeight = 32;
    const paginationLineHeight = 0;
    const rectPadding = 0;
    const otherHeight = 0;

    const topCardHeight = ref(164);

    const tableHeightLogic = useAutoTableHeightInCard({
      compensation: computed(
        () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      ),
      fixedBlockHeightRefs: [topCardHeight],
      tableMinHeight: 100,
    });

    /** 收款编号/名称渲染函数 */
    const achievement_uid_render = <T extends boolean>(
      row: LiveProjectAchievement,
      text_only: T,
    ) => {
      if (text_only) {
        return get_length_of_string(row.achievement_uid) >
          get_length_of_string(row.achievement_name)
          ? row.achievement_uid
          : row.achievement_name;
      } else {
        const uidClass = row.reversed_id ? 'reverse-red' : undefined;
        return h('div', { class: 'table_achievement' }, [
          h('div', { class: uidClass }, [row.achievement_uid]),
          h('div', { class: 'text' }, [row.achievement_name]),
        ]) as TableColumnRenderReturn<T>;
      }
    };

    /** 收款编号/名称最大宽度 */
    const achievement_uid_max_length = max_length_of_column(
      achievment.data,
      '收款编号/名称',
      achievement_uid_render,
      30,
    );

    /** 收款类型渲染函数 */
    const gather_type_render = (row: LiveProjectAchievement) => {
      const is_reverse = row.reversed_id !== null;
      const data = is_reverse
        ? '冲销'
        : gatherTypeOptions.find(val => val.value === row.gather_type)?.label;

      return h('span', is_reverse ? { class: 'reverse-red' } : undefined, [data]);
    };

    /** 收款金额渲染函数 */
    const gather_amount_render = <T extends boolean>(row: LiveProjectAchievement, text_only: T) => {
      const data = `${Decimal2String(new Decimal(row.gather_amount))}`;

      return text_only || row.reversed_id === null
        ? data
        : (h('span', { class: 'reverse-red' }, [data]) as TableColumnRenderReturn<T>);
    };

    /** 收款金额最大宽度 */
    const gather_amount_max_length = max_length_of_column(
      achievment.data,
      '收款金额 （元）',
      gather_amount_render,
    );

    const columns = computed<TableColumn<LiveProjectAchievement>[]>(() => [
      {
        label: '收款编号/名称',
        fixed: 'left',
        minWidth: achievement_uid_max_length.value,
        formatter: row => achievement_uid_render(row, false),
      },
      {
        label: '收款类型',
        minWidth: 80,
        align: 'center',
        prop: 'gather_type',
        formatter: gather_type_render,
      },
      {
        label: '收款金额 (元)',
        prop: 'gather_amount',
        align: 'right',
        minWidth: gather_amount_max_length.value,
        formatter: row => gather_amount_render(row, false),
      },
      {
        label: '收款账户',
        minWidth: 130,
        align: 'center',
        formatter: row => {
          const type = gatherWayOptions.find(opt => opt.value === row.gather_way)?.label;
          return h(
            'div',
            {
              class: 'column-cell',
              style: {
                paddingLeft: '5px',
              },
            },
            [
              h(
                'div',
                {
                  class: 'column-cell-line',
                  style: {
                    justifyContent: 'center',
                  },
                },
                [
                  h(
                    'div',
                    {
                      class: 'label',
                      style: {
                        width: '40px',
                        textAlign: 'right',
                      },
                    },
                    ['方式：'],
                  ),
                  h(
                    'div',
                    {
                      class: 'text',
                      style: {
                        width: '60px',
                        textAlign: 'left',
                        display: 'inline-block',
                      },
                    },
                    [type],
                  ),
                ],
              ),
              h(
                'div',
                {
                  class: 'column-cell-line',
                  style: {
                    justifyContent: 'center',
                  },
                },
                [
                  h(
                    'div',
                    {
                      class: 'label',
                      style: {
                        width: '40px',
                        textAlign: 'right',
                      },
                    },
                    ['详情：'],
                  ),
                  h('el-popover', { props: { trigger: 'hover', placement: 'left' } }, [
                    h('div', { class: 'pop-container pop-finance' }, [
                      h('div', { class: 'pop-header' }, ['收款账户']),
                      h('div', { class: 'pop-row' }, [
                        h('span', { class: 'label' }, ['收款方式：']),
                        h('span', { class: 'text' }, [type]),
                      ]),
                      ...(row.gather_way === 1
                        ? [
                            h('div', { class: 'pop-row' }, [
                              h('span', { class: 'label' }, ['旺旺号']),
                              h('span', { class: 'text' }, [
                                row.gather_way_detail.order_wangwang_id,
                              ]),
                            ]),
                            h('div', { class: 'pop-row' }, [
                              h('span', { class: 'label' }, ['V任务ID：']),
                              h('span', { class: 'text' }, [row.gather_way_detail.task_id]),
                            ]),
                            h('div', { class: 'pop-row' }, [
                              h('span', { class: 'label' }, ['接单时间：']),
                              h('span', { class: 'text' }, [row.gather_way_detail.order_date]),
                            ]),
                          ]
                        : []),
                      ...(row.gather_way === 2 || row.gather_way === 3
                        ? [
                            h('div', { class: 'pop-row' }, [
                              h('span', { class: 'label' }, ['打款公司：']),
                              h('span', { class: 'text' }, [
                                row.gather_way_detail.pay_company_name,
                              ]),
                            ]),
                          ]
                        : []),
                    ]),
                    h(
                      'a',
                      {
                        slot: 'reference',
                        style: {
                          width: '60px',
                          textAlign: 'left',
                          display: 'inline-block',
                        },
                      },
                      ['查看'],
                    ),
                  ]),
                ],
              ),
            ],
          );
        },
      },
      {
        label: '收款凭证',
        minWidth: 80,
        align: 'center',
        formatter: row => {
          if (!row.gather_certificate_pic) return '--';
          return h(
            'button',
            {
              class: 'tg-button',
              on: {
                click: () => {
                  invoice.showDetail(fixFileToken(row.gather_certificate_pic, false));
                },
              },
            },
            ['查看'],
          );
        },
      },
    ]);

    return {
      columns,
      invoiceDialogRef,
      getContractJumpLink,
      deleteCollection,
      ...achievment,
      invoicelistRef,
      permission,
      userinfo,
      firstStepRef,
      writeOffLoading,
      reverseOrderDialogRef,
      onWriteOffConfirmResolve,
      onViewReverseReason,
      reasonDialogTitle,
      onViewReverseBackReason,
      onReasonDialogClose,
      reason,
      reasonDialogVisible,
      ...tableHeightLogic,
      onRefundViewBtnClick,
      refundRow,
      refundDialogVisible,
      onRefundDialogClose,
      refundWriteOffId,
      refundWriteOffAchievementId,
      refundWriteOffAmount,
      refundWriteOffVisible,
      achievementRef,
      editAction,
      projectLoading,
    };
  },
  render() {
    const rectUpdate = {
      on: {
        ['rect:update']: this.onRectUpdate,
      },
      style: {
        ...this.cardProps,
      },
    };
    return (
      <tg-card
        class="project-collection flex-auto tg-mcn-collection"
        padding={[18, 18, 0, 18]}
        {...rectUpdate}
        loading={this.loading}
        {...{
          directives: [
            {
              name: 'loading',
              value: this.loading,
            },
          ],
        }}
      >
        <el-table
          stripe
          border
          class="collection-table"
          height={this.tableProps.height}
          loading={this.loading}
          data={this.data}
          scopedSlots={{
            empty: () => {
              return (
                <div style="position: static;">
                  <empty-common></empty-common>
                </div>
              );
            },
          }}
        >
          {this.columns.map((col, colIndex) => (
            <el-table-column props={{ ...col }} key={colIndex} />
          ))}
          {/* <el-table-column
            label="是否开票"
            min-width={94}
            align="center"
            scopedSlots={{
              default: ({ row }: any) => {
                return (
                  <div class="column-cell">
                    <div class="column-cell-line" style="justify-content: center;">
                      <span class="label" style="width:50px;text-align:right">
                        开票：
                      </span>
                      <span class="text" style="width:30px;text-align:left">
                        {row.is_invoice === 1 ? '是' : '否'}
                      </span>
                    </div>
                    <div class="column-cell-line" style="justify-content: center;">
                      <span class="label" style="width:50px;text-align:right">
                        发票：
                      </span>
                      {row.is_invoice === 1 && row.invoice_info.length > 0 && (
                        <button
                          slot="reference"
                          style="width:30px;text-align:left"
                          class="tg-button"
                          onClick={() => {
                            this.invoicelistRef?.show({
                              title: '发票详情',
                              list: row.invoice_info.map((it: any) => {
                                it.info = [
                                  {
                                    label: '发票号码',
                                    value: formatData.formatEmpty(it.invoice_num),
                                  },
                                  {
                                    label: '开票时间',
                                    value: formatData.formatTime(it.invoice_date),
                                  },
                                  {
                                    label: '开票金额',
                                    value: formatData.formatPrice(it.amount, MoneyUnit.Yuan),
                                  },
                                  {
                                    label: '开票公司',
                                    value: formatData.formatEmpty(it.institution),
                                  },
                                ];
                                return it;
                              }),
                              type: 0,
                            });
                          }}
                        >
                          查看
                        </button>
                      )}
                      {(row.is_invoice !== 1 || row.invoice_info.length === 0) && (
                        <span style="width:30px;text-align:left">--</span>
                      )}
                    </div>
                  </div>
                );
              },
            }}
          /> */}
          <el-table-column
            label="关联单据"
            min-width={238}
            scopedSlots={{
              default: ({ row }: any) => {
                const showlinkStyle = row.contract_id ? true : false;
                return (
                  <div class="column-cell column-cell-start">
                    <div class="column-cell-line">
                      <span class="label">关联合同：</span>
                      {showlinkStyle ? (
                        <span
                          class="text"
                          style="color: var(--theme-color); cursor: pointer"
                          onclick={() => {
                            const jumpLink = this.getContractJumpLink(
                              row.contract_type,
                              row.contract_id,
                            );
                            if (jumpLink) {
                              window.open(jumpLink);
                            }
                          }}
                        >
                          {formatData.formatEmpty(row.contract_uid)}
                        </span>
                      ) : (
                        <span class="text">--</span>
                      )}
                    </div>
                    <div class="column-cell-line">
                      <span class="label">开票审批：</span>
                      <span
                        class={row.approval_uid ? 'hover-link' : ''}
                        on={{
                          click: () => {
                            row.invoice_apply_id
                              ? this.invoiceDialogRef?.open(row.invoice_apply_id)
                              : void 0;
                          },
                        }}
                      >
                        {row.approval_uid ?? '--'}
                      </span>
                    </div>
                  </div>
                );
              },
            }}
          />
          <el-table-column
            label="财务确认信息"
            min-width={150}
            scopedSlots={{
              default({ row }: any) {
                const isShowView = row.is_gather === 1;
                const notVTask = row.gather_way !== 1;
                if (row.is_gather !== 1) return <span style={{ color: '#FF7A36' }}>待确认</span>;
                return (
                  <div class="column-cell">
                    <div class="column-cell-line">
                      <span class="label">状态：</span>
                      <span class="text">{row.is_gather === 1 ? '已确认' : '未确认'}</span>
                    </div>
                    <div class="column-cell-line">
                      <span class="label">收款时间：</span>
                      <span class="text">
                        {formatData.formatEmpty(
                          row.gather_confirm_detail ? row.gather_confirm_detail.order_date : '',
                        )}
                      </span>
                    </div>
                    {notVTask && (
                      <div class="column-cell-line">
                        <span class="label">详情：</span>
                        <el-popover trigger="hover" placement="left">
                          <div class="pop-container pop-finance">
                            <div class="pop-header">财务确认信息</div>
                            <div class="pop-row">
                              <span class="label">收款时间：</span>
                              <span class="text">
                                {formatData.formatEmpty(
                                  row.gather_confirm_detail
                                    ? row.gather_confirm_detail.order_date
                                    : '',
                                )}
                              </span>
                            </div>
                            <div class="pop-row">
                              <span class="label">名称：</span>
                              <span class="text">
                                {formatData.formatEmpty(
                                  row.gather_confirm_detail
                                    ? row.gather_confirm_detail.pay_company_name
                                    : '',
                                )}
                              </span>
                            </div>
                            <div class="pop-row">
                              <span class="label">账号：</span>
                              <span class="text">
                                {formatData.formatEmpty(
                                  row.gather_confirm_detail
                                    ? row.gather_confirm_detail.account
                                    : '',
                                )}
                              </span>
                            </div>
                            {row.gather_way === 3 && (
                              <div class="pop-row">
                                <span class="label">开户行：</span>
                                <span class="text">
                                  {formatData.formatEmpty(
                                    row.gather_confirm_detail
                                      ? row.gather_confirm_detail.bank_of_deposit
                                      : '',
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                          {isShowView ? (
                            <button slot="reference" class="tg-button">
                              预览
                            </button>
                          ) : (
                            <span slot="reference">--</span>
                          )}
                        </el-popover>
                      </div>
                    )}
                  </div>
                );
              },
            }}
          />
          <el-table-column
            label="核销状态"
            min-width={120}
            scopedSlots={{
              default({ row }: any) {
                let write_off_infos = [];
                if (row.gather_type === 5) {
                  //  付款退款核销
                  write_off_infos = (row.refund_write_off_info_items || []).map((item: any) => {
                    return [
                      item.settlement_uid,
                      item.payable_uid,
                      (item.write_off_amount ?? 0) * -1,
                      item.write_off_user,
                      item.write_off_time,
                    ];
                  });
                } else {
                  write_off_infos = (row.write_off_infos || []).map((item: any) => {
                    return [
                      item.settlement_uid,
                      item.receivable_uid,
                      item.write_off_amount,
                      item.write_off_user,
                      item.write_off_time,
                    ];
                  });
                }
                const write_off_header = [
                  '结算单编号',
                  row.gather_type === 5 ? '应付编号' : '应收编号',
                  '核销金额 (元)',
                  '核销人/日期',
                ];

                return (
                  <WriteOff
                    {...{
                      attrs: {
                        is_reverse: !!row.reversed_id,
                        write_off_header,
                        write_off_infos,
                        write_off_status:
                          row.gather_type === 5
                            ? row.refund_write_off_status
                            : row.write_off_status,
                      },
                    }}
                  />
                );
              },
            }}
          />
          <el-table-column
            label="冲销状态"
            min-width={80}
            align="center"
            scopedSlots={{
              default({ row }: any) {
                let status = undefined;
                if (row.reverse_status === 1) {
                  //  待确认
                  status = <div style="color: #ff7a36">待确认</div>;
                } else if (row.reverse_status === 2) {
                  //  已确认
                  status = <div style="color: var(--success-color)">已确认</div>;
                } else if (row.reverse_status === 3) {
                  //  退回
                  status = <div style="color: var(--error-color)">退回</div>;
                }
                return status ?? '--';
              },
            }}
          />
          <el-table-column
            label="录入人/日期"
            min-width={102}
            scopedSlots={{
              default: ({ row }: any) => {
                return (
                  <div class="table_achievement">
                    <div>{row.add_by ?? '--'}</div>
                    <div class="text">{moment(row.gmt_create).format('YYYY.MM.DD')}</div>
                  </div>
                );
              },
            }}
          />
          <el-table-column
            label="操作"
            width={160}
            scopedSlots={{
              default: ({ row }: any) => {
                const hasSelf = row.add_by_id === this.userinfo.id;
                const noGather = row.is_gather === 0;
                // const hasEdit = this.permission.live_project_status_edit;
                const hasWriteOff = this.permission.merchant_settlement_write_off;
                let btnShenhe = undefined;
                let btnChongxiao = undefined;
                const is_btn_refund =
                  row.not_refund_amount > 0 &&
                  row.is_gather === 1 &&
                  !row.reverse_id &&
                  (row.gather_type === 1 || row.gather_type === 2 || row.gather_type === 3);

                const is_refund_write_off_visible =
                  row.is_gather === 1 &&
                  row.gather_type === 5 &&
                  !row.reverse_id &&
                  !row.reversed_id &&
                  row.refund_write_off_status !== 2;
                const refundWriteOffBtn = (
                  <tg-button
                    class="mgr-12"
                    type="link"
                    onclick={() => {
                      this.refundWriteOffAmount = new Decimal(
                        row.gather_amount ? row.gather_amount : 0,
                      )
                        .sub(
                          new Decimal(
                            row.refund_write_off_amount ? row.refund_write_off_amount : 0,
                          ),
                        )
                        .toNumber();
                      this.refundWriteOffId = row.refund_cost_id;
                      this.refundWriteOffAchievementId = row.achievement_id;
                      this.refundWriteOffVisible = true;
                    }}
                  >
                    核销
                  </tg-button>
                );

                if (row.reversed_id) {
                  //  冲销单
                  if (row.reverse_status !== 3) {
                    //  已确认和待确认
                    btnChongxiao = (
                      <a
                        onclick={() => {
                          this.onViewReverseReason(row);
                        }}
                      >
                        查看
                      </a>
                    );
                  } else {
                    //  退回
                    btnChongxiao = (
                      <div>
                        <a
                          onclick={() => {
                            this.deleteCollection(row.achievement_id, '是否删除该冲销单');
                          }}
                          class="mgr-12"
                        >
                          删除
                        </a>
                        <a
                          onclick={() => {
                            this.reverseOrderDialogRef?.open(
                              msg => this.onWriteOffConfirmResolve(row, msg, true),
                              row.reverse_reason,
                            );
                          }}
                          class="mgr-12"
                        >
                          重新提交
                        </a>
                        <a
                          onclick={() => {
                            this.onViewReverseBackReason(row);
                          }}
                        >
                          退回原因
                        </a>
                      </div>
                    );
                  }
                } else {
                  //  非冲销单
                  if (!row.reverse_id) {
                    // if (row.write_off_status === 0 || row.write_off_status === 1) {
                    if ((row.write_off_status === 0 || row.write_off_status === 1) && hasWriteOff) {
                      if (row.is_gather === 1 && row.business_type !== 4 && row.gather_type !== 5) {
                        btnShenhe = (
                          <a
                            class="mgr-12"
                            onclick={() => {
                              //@firstStepRef 通用业务实收
                              this.firstStepRef?.show({
                                type: 'isActualIncome',
                                id: row.achievement_id,
                                amount: row.not_write_off_amount, // 可核销金额
                                leaf: 'common_business', // 店铺代播
                                busType: row.business_type, // businessType
                                receivable_uid: row.receivable_uid || row.achievement_uid, // 应收编号
                              });
                            }}
                          >
                            核销
                          </a>
                        );
                      }
                    }
                    if (row.is_gather === 1 && row.gather_type !== 5 && !row.has_refund) {
                      btnChongxiao = (
                        <a
                          onclick={() => {
                            this.reverseOrderDialogRef?.open(msg =>
                              this.onWriteOffConfirmResolve(row, msg, false),
                            );
                          }}
                          class="reverse-red mgr-12"
                        >
                          冲销
                        </a>
                      );
                    }
                  }
                }

                return (
                  <div class="operation-column">
                    {btnChongxiao}
                    {btnShenhe}
                    {hasSelf && noGather && (
                      <button
                        class="tg-button"
                        onclick={() => {
                          this.editAction(row);
                        }}
                      >
                        编辑
                      </button>
                    )}
                    {hasSelf && noGather && (
                      // {hasSelf && noGather && hasEdit && (
                      <button
                        onclick={() =>
                          this.deleteCollection(row.achievement_id, '确认删除该业绩？')
                        }
                        class="tg-button"
                      >
                        删除
                      </button>
                    )}
                    {is_btn_refund && (
                      <button
                        onclick={() => this.onRefundViewBtnClick(row)}
                        class="tg-button mgr-12"
                      >
                        退款
                      </button>
                    )}
                    {is_refund_write_off_visible && refundWriteOffBtn}
                  </div>
                );
              },
            }}
          />
        </el-table>
        {this.queryForm.total > 0 && (
          <el-pagination
            current-page={this.queryForm.page_num}
            page-sizes={[10, 20, 50, 100, 200]}
            pageSize={this.queryForm.num}
            total={this.queryForm.total}
            oncurrent-change={(page_num: number) => {
              this.query(page_num, this.queryForm.num);
            }}
            onsize-change={(num: number) => {
              this.queryForm.num = num;
              this.query(this.queryForm.page_num, this.queryForm.num);
            }}
            layout="total, prev, pager, next, sizes, jumper"
          />
        )}

        <invoicelist ref="invoicelistRef" />
        <InvoiceDetail {...{ ref: 'invoiceDialogRef' }} />
        <first-step
          ref="firstStepRef"
          onSubmit={() => {
            this.reload();
          }}
        />
        <el-dialog
          class="tg-dialog-classic tg-dialog-vcenter"
          visible={this.reasonDialogVisible}
          width="440px"
          onClose={() => {
            this.onReasonDialogClose();
          }}
          title={this.reasonDialogTitle}
        >
          <div class="reason-dialog-content">{this.reason}</div>
        </el-dialog>
        <refund-write-off
          type="pay"
          notWriteOffAmount={this.refundWriteOffAmount}
          refund_cost_id={this.refundWriteOffId}
          achievement_id={this.refundWriteOffAchievementId}
          visible={this.refundWriteOffVisible}
          onCancel={() => (this.refundWriteOffVisible = false)}
          onSave={() => {
            this.refundWriteOffVisible = false;
            this.reload();
          }}
        ></refund-write-off>
        <reverseOrderDialog ref="reverseOrderDialogRef" />
        <achievement
          type={1}
          ref="achievementRef"
          onOk={() => {
            this.reload();
          }}
        />
        {this.refundDialogVisible ? (
          <refundDialog
            visible={this.refundDialogVisible}
            row={this.refundRow}
            on={{
              'dialog:close': () => {
                this.refundDialogVisible = false;
                this.reload();
              },
            }}
          />
        ) : (
          ''
        )}
        <tg-mask-loading visible={this.writeOffLoading} content="正在提交冲销，请稍候..." />
        <tg-mask-loading visible={this.projectLoading} content="" />
      </tg-card>
    );
  },
});
