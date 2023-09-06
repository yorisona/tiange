import { computed, defineComponent, h, ref, UnwrapRef } from '@vue/composition-api';
import achievement from '../../dialog/achievement.vue';
import invoicelist from '../../dialog/invoice.list.vue';
import { AsyncConfirm } from '@/use/asyncConfirm';
import use from './use';
import { useRouter } from '@/use/vue-router';
import { gatherTypeOptions, gatherWayOptions } from '@/const/options';
import invoice from '../../dialog/invoice';
import { getToken } from '@/utils/token';
import formatData from '@/utils/formatData';
import { usePermission } from '@/use/permission';
import { MoneyUnit } from '@/utils/money';
import { useUserInfo } from '@/use/vuex';
import moment from 'moment';
import { ContractType } from '@/types/tiange/contract';
import InvoiceDetail from '@/modules/workbench/initiate/invoice/detail.vue';
import { TgInvoiceDetail } from '@/modules/workbench/initiate/invoice/detail';
import FirstStep from '../writeDialog/firstStep.vue';
import WriteOff from '@/components/BusinessComponents/WriteOff/index.vue';
import reverseOrderDialog from '@/modules/settlement/component/reverseOrder.vue';
import { ReverseType } from '@/types/tiange/finance/settlement';
import { FinancialReverse, FinancialReverseAgain } from '@/services/finance';
import useVisible from '@/use/visible';
import { wait } from '@/utils/func';
import { ReverseOrderDialog } from '@/modules/settlement/component/reverseOrder';
import { TableColumn } from '@/types/vendor/column';
import { LiveProjectAchievement } from '@/types/tiange/live.project';
import { DeleteShopLiveAchievement, GetShopLiveAchievement } from '@/services/live.project';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { Decimal2String, get_length_of_string } from '@/utils/string';
import { max_length_of_column } from '@/utils/table';
import Decimal from 'decimal.js';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import refundDialog from '@/modules/marketing/project/dialog/refund/form.vue';
import RefundWriteOff from '../../dialog/refundWriteOff.vue';
import { BusinessTypeEnum } from '@/types/tiange/common';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export default defineComponent({
  components: {
    achievement,
    invoicelist,
    InvoiceDetail,
    FirstStep,
    reverseOrderDialog,
    refundDialog,
    RefundWriteOff,
  },
  setup(props, ctx) {
    /** 本地生活 */
    const { isFromLocalLife, isFromLiveDouyin, business_type, isFromSupplyChain } =
      useProjectBaseInfo();
    const achievementRef = ref<
      { show: (obj?: any, btype?: any, liveDouyin?: boolean) => void } | undefined
    >(undefined);
    const invoicelistRef = ref<UnwrapRef<{ show: (obj?: any) => void } | null>>(null);
    /** 开票审批 弹窗 */
    const invoiceDialogRef = ref<TgInvoiceDetail | null>(null);
    const firstStepRef = ref<UnwrapRef<{ show: (...args: any) => void } | undefined>>(undefined);
    const refundWriteOffVisible = ref<boolean>(false);

    const permission = usePermission();
    const router = useRouter();
    const achievment = use.useShopLiveAchievment(
      business_type.value || E.project.BusinessType.douyin,
    );

    const refundWriteOffId = ref<string | number | undefined>(undefined);
    const refundWriteOffAchievementId = ref<number | undefined>(undefined);
    const refundWriteOffAmount = ref<number | undefined>(undefined);

    // # 列表部分逻辑
    const init = ref(false);
    const loading = ref(false);
    const isHideReversed = ref(true);
    const data = ref<LiveProjectAchievement[]>([]);
    const confirmed_gather_amount = ref(0);
    const total_gather_amount = ref(0);
    const wait_gather_amount = ref(0);
    const not_write_off_amount = ref(0);
    const write_off_amount = ref(0);
    let lastQuery: any;

    const refundDialogVisible = ref(false);
    const refundRow = ref<any>({
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

    const query = async (id: any): Promise<void> => {
      if (id === undefined) return;
      lastQuery = id;

      loading.value = true;
      const [res] = await wait(
        500,
        GetShopLiveAchievement(
          id,
          business_type.value || E.project.BusinessType.douyin,
          isHideReversed.value ? 1 : undefined,
        ),
      );
      loading.value = false;

      const resData = res.data.data;
      const stat_info = resData.stat_info;
      data.value = resData.data;
      init.value = true;
      confirmed_gather_amount.value = stat_info.confirmed_gather_amount;
      total_gather_amount.value = stat_info.total_gather_amount;
      wait_gather_amount.value = stat_info.wait_gather_amount;
      write_off_amount.value = stat_info.write_off_amount;
      not_write_off_amount.value = stat_info.not_write_off_amount;
    };

    const reload = () => {
      query(lastQuery);
    };

    const deleteShopLiveAchievement = (achievement_id: number) => {
      return DeleteShopLiveAchievement(achievement_id + '').then(res => {
        if (res.data.success) {
          ctx.root.$message.success(res.data.message);
          reload();
        } else {
          ctx.root.$message.error(res.data.message);
        }
      });
    };
    // # 列表部分逻辑结束

    query(router.currentRoute.params.id);
    const deleteCollection = async (achievement_id: number, msg: string) => {
      const reuslt = await AsyncConfirm(ctx, msg);
      if (reuslt) {
        deleteShopLiveAchievement(achievement_id).then(() => {
          reload();
        });
      }
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

    const reasonDialogVisible = ref(false);
    const reason = ref('');
    const reasonDialogTitle = ref('');

    const onReasonDialogClose = () => {
      reason.value = '';
      reasonDialogVisible.value = false;
    };

    const onReverseReasonViewBtnClick = (reverse_reason: string) => {
      reasonDialogTitle.value = '冲销原因';
      reason.value = reverse_reason;
      reasonDialogVisible.value = true;
    };

    const onReverseBackReasonViewBtnClick = (reverse_back_reason: string) => {
      reasonDialogTitle.value = '退回原因';
      reason.value = reverse_back_reason;
      reasonDialogVisible.value = true;
    };

    const reverseOrderDialogRef = ref<ReverseOrderDialog | null>(null);

    /** 冲销动作 */
    const onWriteOffConfirmResolve = async (reverse_id: number, reverse_reason: string) => {
      const payload = {
        id: reverse_id,
        /** 冲销类型 */
        reverse_type: ReverseType.receive,
        /** 冲销原因 */
        reverse_reason: reverse_reason,
      };

      const { data: resp } = await FinancialReverse(payload);
      if (resp.success) {
        ctx.root.$message.success('提交成功');
        reload();
      } else {
        ctx.root.$message.error(resp.message);
      }

      return resp.success;
    };

    const isReversedRow = (row: { reversed_id: number | null }) => {
      return row.reversed_id !== null && row.reversed_id !== 0;
    };
    const { visible: reverseAgainLoading, toggleVisible: toggleReverseAgainLoading } = useVisible();

    /** 重新提交冲销 */
    const reverseAgain = async (reverse_id: number, reverse_reason: string) => {
      toggleReverseAgainLoading();
      const [{ data: response }] = await wait(
        500,
        FinancialReverseAgain({
          id: reverse_id,
          reverse_type: ReverseType.receive,
          reverse_reason,
        }),
      );
      toggleReverseAgainLoading();

      if (response.success) {
        ctx.root.$message.success(response.message ?? '重新提交成功');
        reload();
      } else {
        ctx.root.$message.error(response.message ?? '重新提交失败');
      }

      return response.success;
    };
    /** 结算单编号 */
    // const settlement_uid_render = <T extends boolean>(
    //   row: LiveProjectAchievement,
    //   text_only: T,
    // ) => {
    //   if (text_only) {
    //     return get_length_of_string(row.achievement_uid) >
    //       get_length_of_string(row.achievement_name)
    //       ? row.achievement_uid
    //       : row.achievement_name;
    //   } else {
    //     return h('div', [
    //       h('div', { class: row.reversed_id !== null ? 'reverse-red' : '' }, [row.achievement_uid]),
    //       h('div', { class: 'text' }, [row.achievement_name]),
    //     ]) as TableColumnRenderReturn<T>;
    //   }
    // };

    /** 收款编号/名称最大宽度 */
    // const settlement_uid_max_length = max_length_of_column(
    //   data,
    //   '结算单编号',
    //   settlement_uid_render,
    // );

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
        return h('div', [
          h(
            'div',
            { class: row.reversed_id !== null || row.reverse_id !== null ? 'reverse-red' : '' },
            [row.achievement_uid],
          ),
          h('div', { class: 'text' }, [row.achievement_name]),
        ]) as TableColumnRenderReturn<T>;
      }
    };

    /** 收款编号/名称最大宽度 */
    const achievement_uid_max_length = max_length_of_column(
      data,
      '收款编号/名称',
      achievement_uid_render,
    );

    /** 收款类型渲染函数 */
    const gather_type_render = (row: LiveProjectAchievement) => {
      const is_reverse = row.reversed_id !== null || row.reverse_id !== null;
      const data = is_reverse
        ? '冲销'
        : gatherTypeOptions.find(val => val.value === row.gather_type)?.label;

      return h('span', is_reverse ? { class: 'reverse-red' } : undefined, [data]);
    };

    /** 收款金额渲染函数 */
    const gather_amount_render = <T extends boolean>(row: LiveProjectAchievement, text_only: T) => {
      const data = `${Decimal2String(new Decimal(row.gather_amount))}`;

      return text_only || (row.reversed_id === null && row.reverse_id === null)
        ? data
        : (h('span', { class: 'reverse-red' }, [data]) as TableColumnRenderReturn<T>);
    };

    /** 收款金额最大宽度 */
    const gather_amount_max_length = max_length_of_column(
      data,
      '收款金额 (元)',
      gather_amount_render,
    );

    const columns = computed<TableColumn<LiveProjectAchievement>[]>(() => [
      // {
      //   label: '结算单编号',
      //   fixed: 'left',
      //   minWidth: settlement_uid_max_length.value,
      //   formatter: row => settlement_uid_render(row, false),
      // },
      {
        label: '收款编号/名称',
        fixed: 'left',
        minWidth: achievement_uid_max_length.value,
        formatter: row => achievement_uid_render(row, false),
      },
      {
        label: '收款类型',
        minWidth: 80,
        prop: 'gather_type',
        align: 'center',
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
        width: 120,
        align: 'center',
        formatter: row => {
          const type = gatherWayOptions.find(opt => opt.value === row.gather_way)?.label;
          return h(
            'div',
            {
              class: 'column-cell',
              style: {
                width: '100%',
                textAlign: 'center',
                paddingLeft: '10px',
              },
            },
            [
              h(
                'div',
                {
                  class: 'column-cell-line',
                  style: {
                    width: '100px',
                    textAlign: 'left',
                  },
                },
                [h('span', { class: 'label' }, ['方式：']), h('span', { class: 'text' }, [type])],
              ),
              h(
                'div',
                {
                  class: 'column-cell-line',
                  style: {
                    width: '100px',
                    textAlign: 'left',
                  },
                },
                [
                  h('span', { class: 'label' }, ['详情：']),
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
                      ...(row.gather_way === 6
                        ? [
                            h('div', { class: 'pop-row' }, [
                              h('span', { class: 'label' }, ['预收编号：']),
                              h('span', { class: 'text' }, [
                                row.gather_way_detail.deposit_received_uid,
                              ]),
                            ]),
                          ]
                        : []),
                    ]),
                    h('a', { slot: 'reference' }, ['查看']),
                  ]),
                ],
              ),
            ],
          );
        },
      },
      // {
      //   label: '收款凭证',
      //   minWidth: 80,
      //   formatter: row => {
      //     if (!row.gather_certificate_pic) return '--';
      //     return h(
      //       'button',
      //       {
      //         class: 'tg-button',
      //         on: {
      //           click: () => {
      //             invoice.showDetail(fixFileToken(row.gather_certificate_pic));
      //           },
      //         },
      //       },
      //       ['查看'],
      //     );
      //   },
      // },
    ]);

    // 自适应表格高度部分
    const buttonLineHeight = 32;
    const paginationLineHeight = 0;
    const rectPadding = 36;
    const otherHeight = 20;

    const { tableProps, onRectUpdate, ...tableHeightLogic } = useAutoTableHeightInCard({
      compensation: computed(
        () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      ),
      fixedBlockHeightRefs: [],
      tableMinHeight: 100,
    });

    return {
      isFromLocalLife,
      isFromLiveDouyin,
      isFromSupplyChain,
      isHideReversed,
      reverseAgainLoading,
      refundWriteOffVisible,
      reverseAgain,
      reason,
      onReasonDialogClose,
      onReverseBackReasonViewBtnClick,
      reasonDialogTitle,
      reasonDialogVisible,
      isReversedRow,
      onReverseReasonViewBtnClick,
      reverseOrderDialogRef,
      onWriteOffConfirmResolve,
      invoiceDialogRef,
      getContractJumpLink,
      deleteCollection,
      achievment,
      achievementRef,
      invoicelistRef,
      permission,
      userinfo,
      firstStepRef,
      columns,
      loading,
      data,
      reload,
      ...tableHeightLogic,
      tableProps,
      onRectUpdate,
      onRefundViewBtnClick,
      refundRow,
      refundDialogVisible,
      onRefundDialogClose,
      total_gather_amount,
      wait_gather_amount,
      not_write_off_amount,
      write_off_amount,
      confirmed_gather_amount,
      refundWriteOffId,
      refundWriteOffAchievementId,
      refundWriteOffAmount,
    };
  },
  render() {
    const isReversedRow = this.isReversedRow;

    const props = {
      class: 'project-collection',
      props: {
        overflowInBody: true,
      },
      on: {
        ['rect:update']: (rect: DOMRect) => {
          this.onRectUpdate(rect);
        },
      },
      style: {
        height:
          this.isFromLocalLife || this.isFromLiveDouyin
            ? 'calc(100vh - 145px)'
            : 'calc(100vh - 190px)',
      },
    };

    return (
      <tg-card {...props}>
        <div class="header">
          <span class="label">登记收款：</span>
          <span class="text">
            {formatData.formatPrice(this.total_gather_amount, MoneyUnit.Yuan, true)}
          </span>
          <span class="label">确认收款：</span>
          <span class="text">
            {formatData.formatPrice(this.confirmed_gather_amount, MoneyUnit.Yuan, true)}
          </span>
          <span class="label">等待确认：</span>
          <span class="text">
            {formatData.formatPrice(this.wait_gather_amount, MoneyUnit.Yuan, true)}
          </span>
          <span class="label">已核销金额：</span>
          <span class="text">
            {formatData.formatPrice(this.write_off_amount, MoneyUnit.Yuan, true)}
          </span>
          <span class="label">未核销金额：</span>
          <span class="text">
            {formatData.formatPrice(this.not_write_off_amount, MoneyUnit.Yuan, true)}
          </span>
          <div class="reverse-div">
            <el-checkbox
              on-change={() => {
                this.reload();
              }}
              v-model={this.isHideReversed}
              size="small"
            >
              <span>隐藏已冲销数据</span>
            </el-checkbox>
          </div>
        </div>
        <el-table
          stripe
          border
          loading={this.loading}
          height={this.tableProps.height}
          {...{
            directives: [
              {
                name: 'loading',
                value: this.loading,
              },
            ],
          }}
          data={this.data}
          scopedSlots={{
            empty: () => {
              return (
                <div style="position: static;">
                  <empty-common detail-text="暂无数据"></empty-common>
                </div>
              );
            },
          }}
        >
          {this.columns.map((col, colIndex) => (
            <el-table-column props={{ ...col }} key={colIndex} />
          ))}
          <el-table-column
            label="收款凭证"
            min-width={80}
            align="center"
            scopedSlots={{
              default: ({ row }: any) => {
                if (!row.gather_certificate_pic) return '--';
                return (
                  <button
                    class="tg-button"
                    style="margin-right:0px"
                    onClick={() => {
                      invoice.showDetail(
                        row.gather_certificate_pic + '?Authorization=' + getToken(),
                      );
                    }}
                  >
                    查看
                  </button>
                );
              },
            }}
          />
          {/* <el-table-column
            label="是否开票"
            min-width={110}
            align="center"
            scopedSlots={{
              default: ({ row }: any) => {
                return (
                  <div
                    class="column-cell"
                    style="padding-left:18px;text-align:center;width:100%;dispaly:inline-block"
                  >
                    <div
                      class="column-cell-line"
                      style="width:80px;text-align:left;dispaly:inline-block"
                    >
                      <span class="label">开票：</span>
                      <span class="text">{row.is_invoice === 1 ? '是' : '否'}</span>
                    </div>
                    <div
                      class="column-cell-line"
                      style="width:80px;text-align:left;dispaly:inline-block"
                    >
                      <span class="label">详情：</span>
                      {row.is_invoice === 1 && row.invoice_info.length > 0 && (
                        <button
                          slot="reference"
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
                      {(row.is_invoice !== 1 || row.invoice_info.length === 0) && '--'}
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
                        class="hover-link"
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
                      <span class="label">打款时间：</span>
                      <span class="text">
                        {formatData.formatEmpty(
                          row.gather_confirm_detail ? row.gather_confirm_detail.order_date : '',
                        )}
                      </span>
                    </div>
                    {notVTask && (
                      <div class="column-cell-line">
                        <span class="label">详情：</span>
                        <el-popover trigger="click" placement="left">
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
                              查看
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
                  write_off_infos = (row.refund_write_off_info_items || []).map((item: any) => {
                    return [
                      item.settlement_uid,
                      item.payable_uid,
                      item.write_off_amount * -1,
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
                  '核销人/账期时间',
                ];
                return (
                  <WriteOff
                    {...{
                      attrs: {
                        write_off_header,
                        write_off_infos,
                        write_off_status:
                          row.gather_type === 5
                            ? row.refund_write_off_status
                            : row.write_off_status,
                        is_reverse: row.reversed_id !== null,
                      },
                    }}
                  />
                );
              },
            }}
          />
          <el-table-column
            label="冲销状态"
            align="center"
            min-width={80}
            scopedSlots={{
              default: ({ row }: any) => {
                if (row.reverse_status === 1) {
                  return <div style="color: #ff7a36">待确认</div>;
                } else if (row.reverse_status === 2) {
                  return <div style="color: var(--success-color)">已确认</div>;
                } else if (row.reverse_status === 3) {
                  return <div style="color: var(--error-color)">退回</div>;
                } else {
                  return '--';
                }
              },
            }}
          />
          <el-table-column
            label="录入人/日期"
            min-width={100}
            align="center"
            scopedSlots={{
              default: ({ row }: any) => {
                return (
                  <div
                    class="table_achievement"
                    style="width:100%;text-align:center;padding-left:10px"
                  >
                    <div style="width:80px;text-align:left;">{row.add_by ?? '--'}</div>
                    <div style="width:80px;text-align:left" class="text">
                      {moment(row.gmt_create).format('YYYY.MM.DD')}
                    </div>
                  </div>
                );
              },
            }}
          />
          <el-table-column
            fixed="right"
            label="操作"
            minWidth={160}
            scopedSlots={{
              default: ({ row }: any) => {
                const is_btn_refund =
                  row.not_refund_amount > 0 &&
                  row.is_gather === 1 &&
                  !row.reverse_id &&
                  (row.gather_type === 1 || row.gather_type === 2 || row.gather_type === 3);
                const refundBtn = (
                  <button
                    onclick={() => {
                      this.onRefundViewBtnClick(row);
                    }}
                    class="tg-button"
                  >
                    退款
                  </button>
                );

                const live_write_off_save = this.isFromSupplyChain
                  ? this.permission.supply_write_off
                  : this.isFromLocalLife
                  ? this.permission.local_life_write_off_save
                  : this.permission.live_write_off_save;
                const is_refund_write_off_visible =
                  row.is_gather === 1 &&
                  row.gather_type === 5 &&
                  !row.reverse_id &&
                  !row.reversed_id &&
                  live_write_off_save &&
                  row.refund_write_off_status !== 2;
                const refundWriteOffBtn = (
                  <tg-button
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
                if (isReversedRow(row)) {
                  // 冲销的记录行
                  const viewBtn = [
                    <div class="operation-column">
                      <button
                        class="tg-button"
                        onclick={() => {
                          this.onReverseReasonViewBtnClick(row.reverse_reason);
                        }}
                      >
                        查看
                      </button>
                      {is_btn_refund && refundBtn}
                    </div>,
                  ];

                  const buttonGroup = [
                    <div class="operation-column">
                      {row.gather_type !== 5 && (
                        <button
                          class="tg-button"
                          onclick={() =>
                            this.deleteCollection(row.achievement_id, '是否删除该冲销单')
                          }
                        >
                          删除
                        </button>
                      )}
                      <button
                        class="tg-button"
                        onclick={() => {
                          this.reverseOrderDialogRef?.open(
                            msg => this.reverseAgain(row.achievement_id, msg),
                            row.reverse_reason,
                          );
                        }}
                      >
                        重新提交
                      </button>
                      <button
                        class="tg-button"
                        onclick={() => {
                          this.onReverseBackReasonViewBtnClick(row.reverse_back_reason);
                        }}
                      >
                        退回原因
                      </button>
                      {is_btn_refund && refundBtn}
                    </div>,
                  ];
                  // 冲销记录被退回 才可以编辑
                  // 冲销状态，1-待确认, 2-已确认, 3-退回
                  if (row.reverse_status === 3) {
                    if (is_refund_write_off_visible) {
                      buttonGroup.push(refundWriteOffBtn);
                    }
                    return buttonGroup;
                  } else {
                    if (is_refund_write_off_visible) {
                      viewBtn.push(refundWriteOffBtn);
                    }
                    return viewBtn;
                  }
                } else {
                  const hasSelf = row.add_by_id === this.userinfo.id;
                  const noGather = row.is_gather === 0;
                  const hasEdit = this.isFromSupplyChain
                    ? this.permission.supply_edit_project_status
                    : this.isFromLocalLife
                    ? this.permission.local_life_project_status_edit
                    : this.permission.live_project_status_edit;
                  const hasWriteOff = this.isFromSupplyChain
                    ? this.permission.supply_write_off
                    : this.isFromLocalLife
                    ? this.permission.local_life_write_off_save
                    : this.permission.live_write_off_save;
                  let btnShenhe = undefined;
                  let btnChongxiao = undefined;
                  if (
                    (row.write_off_status === 0 || row.write_off_status === 1) &&
                    hasWriteOff &&
                    row.gather_type !== 5
                  ) {
                    if (row.is_gather === 1 && row.reverse_id === null) {
                      btnShenhe = (
                        <button
                          class="tg-button"
                          onclick={() => {
                            this.firstStepRef?.show({
                              type: 'isActualIncome',
                              id: row.achievement_id,
                              amount: row.not_write_off_amount, // 可核销金额
                              leaf: this.isFromSupplyChain
                                ? 'supply_chain'
                                : this.isFromLocalLife
                                ? 'local_life'
                                : 'live', // 店铺代播
                              busType: row.business_type, // businessType
                              receivable_uid: row.receivable_uid || row.achievement_uid, // 应收编号
                            });
                          }}
                        >
                          核销
                        </button>
                      );
                    }
                  }
                  // 财务已确认才有冲销按钮
                  if (
                    row.is_gather === 1 &&
                    row.reverse_id === null &&
                    row.gather_type !== 5 &&
                    !row.has_refund
                  ) {
                    // 没有冲销记录的数据才能发起冲销
                    btnChongxiao = (
                      <button
                        class="tg-button"
                        onclick={() => {
                          this.reverseOrderDialogRef?.open(msg =>
                            this.onWriteOffConfirmResolve(row.achievement_id, msg),
                          );
                        }}
                        style="color: var(--error-color)"
                      >
                        冲销
                      </button>
                    );
                  }

                  return (
                    <div class="operation-column">
                      {btnChongxiao}
                      {btnShenhe}
                      {row.gather_type !== 5 && hasSelf && noGather && hasEdit && (
                        <button
                          class="tg-button"
                          onclick={() => {
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
                              revenue_flow_id: row.revenue_flow_id,
                              company_id: row.customer_company_id,
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
                            const isMcn = this.$route.name === 'CommonBusinessProjectDetail'; // 创新项目
                            const isBrand = this.$route.name === 'SSLiveProjectDetail'; // 品牌中心业务
                            const isMarketing = this.$route.name === 'MarketingProjectDetail'; // 整合营销业务
                            this.achievementRef?.show(
                              data,
                              { isMcn, isBrand, isMarketing, isLocalLife: this.isFromLocalLife },
                              row.business_type === BusinessTypeEnum.douyin ||
                                row.business_type === BusinessTypeEnum.locallife ||
                                row.business_type === BusinessTypeEnum.supplyChain,
                            );
                          }}
                        >
                          编辑
                        </button>
                      )}
                      {/* {
                        row.is_gather !== 1 && (
                          <button
                            onclick={() => {
                              const isMcn = this.$route.name === 'CommonBusinessProjectDetail'; // 创新项目
                              const isBrand = this.$route.name === 'SSLiveProjectDetail'; // 品牌中心业务
                              const isMarketing = this.$route.name === 'MarketingProjectDetail'; // 整合营销业务
                              this.achievementRef?.show(row, { isMcn, isBrand, isMarketing });
                            }
                            }
                            class="tg-button"
                          >
                            编辑
                          </button>
                        )
                      } */}
                      {hasSelf && noGather && hasEdit && row.gather_type !== 5 && (
                        <button
                          onclick={() =>
                            this.deleteCollection(row.achievement_id, '确认删除该业绩？')
                          }
                          class="tg-button"
                        >
                          删除
                        </button>
                      )}
                      {is_btn_refund && refundBtn}
                      {is_refund_write_off_visible && refundWriteOffBtn}
                    </div>
                  );
                }
              },
            }}
          />
        </el-table>
        <achievement
          ref="achievementRef"
          onOk={() => {
            this.reload();
          }}
        />
        <invoicelist ref="invoicelistRef" />
        <InvoiceDetail {...{ ref: 'invoiceDialogRef' }} />
        <first-step
          ref="firstStepRef"
          onSubmit={() => {
            this.reload();
          }}
        />
        <reverseOrderDialog ref="reverseOrderDialogRef" />
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
        <tg-mask-loading visible={this.writeOffLoading} content="正在提交冲销，请稍候..." />
        <tg-mask-loading visible={this.reverseAgainLoading} content="正在提交冲销，请稍候..." />
        <el-dialog
          class="tg-dialog-classic tg-dialog-vcenter-new"
          visible={this.reasonDialogVisible}
          width="440px"
          onClose={() => {
            this.onReasonDialogClose();
          }}
        >
          <div slot="title">{this.reasonDialogTitle}</div>
          <div class="reason-dialog-content">{this.reason}</div>
        </el-dialog>
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
      </tg-card>
    );
  },
});
