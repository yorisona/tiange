import { defineComponent, ref, UnwrapRef, inject, watch, computed, h } from '@vue/composition-api';
import achievement from '@/modules/live/project/dialog/achievement.vue';
import invoicelist from '@/modules/live/project/dialog/invoice.list.vue';
import { AsyncConfirm } from '@/use/asyncConfirm';
import use from './use';
import { useRouter } from '@/use/vue-router';
import { usePermission } from '@/use/permission';
import { useUserInfo } from '@/use/vuex';
import moment from 'moment';
import { ContractType } from '@/types/tiange/contract';
import InvoiceDetail from '@/modules/workbench/initiate/invoice/detail.vue';
import { TgInvoiceDetail } from '@/modules/workbench/initiate/invoice/detail';
import FirstStep from '@/modules/live/project/tabs/writeDialog/firstStep.vue';
import WriteOff from '@/components/BusinessComponents/WriteOff/index.vue';
import reverseOrderDialog from '@/modules/settlement/component/reverseOrder.vue';
import { formatAmount } from '@/utils/string';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { max_length_of_column } from '@/utils/table';
import type { TableColumn } from '@/types/vendor/column';
import { AchievementReceivable } from '@/types/tiange/marketing/achievement';

export default defineComponent({
  components: { achievement, invoicelist, InvoiceDetail, FirstStep, reverseOrderDialog },
  setup(props, ctx) {
    const achievementRef = ref<UnwrapRef<{ show: (obj?: any) => void } | null>>(null);
    const invoicelistRef = ref<UnwrapRef<{ show: (obj?: any) => void } | null>>(null);
    /** 开票审批 弹窗 */
    const invoiceDialogRef = ref<TgInvoiceDetail | null>(null);
    const project = inject<UnwrapRef<any>>('project');
    const firstStepRef = ref<UnwrapRef<{ show: (...args: any) => void } | undefined>>(undefined);
    const permission = usePermission();
    const router = useRouter();
    const achievment = use.useShopLiveAchievment();
    const isHideReversed = ref(true);
    // const writeOffLoading = ref<boolean>(false);
    watch(
      () => project.value,
      () => {
        if (project.value !== null) {
          achievment.query({
            receivable_type: project.value.business_type,
            project_id: router.currentRoute.params.id,
            is_hide_reverse_data: isHideReversed.value ? 1 : undefined,
          });
        }
      },
    );
    if (project.value !== undefined && project.value !== null) {
      achievment.query({
        receivable_type: project.value.business_type,
        project_id: router.currentRoute.params.id,
        is_hide_reverse_data: isHideReversed.value ? 1 : undefined,
      });
    }

    const deleteCollection = async (achievement_id: number) => {
      const reuslt = await AsyncConfirm(ctx, '确认删除该业绩？');
      if (reuslt) {
        achievment.deleteShopLiveAchievement(achievement_id).then(() => {
          achievment.reload(isHideReversed.value ? 1 : undefined);
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

    // const reverseOrderDialogRef = ref<{
    //   open: (cb: (msg: string) => Promise<boolean>) => void;
    // } | null>(null);

    // /** 冲销动作 */
    // const onWriteOffConfirmResolve = async (row: any, msg: string) => {
    //   console.log({ row: { ...row }, msg });

    //   writeOffLoading.value = true;

    //   await sleep(3000);

    //   writeOffLoading.value = false;

    //   return true;
    // };

    // 自适应表格高度部分
    const buttonLineHeight = 32;
    const paginationLineHeight = 0;
    const rectPadding = 0;
    const otherHeight = 0;

    const topCardHeight = ref(138);
    // const onTopCardRectUpdate = (rect: DOMRect) => {
    //   topCardHeight.value = rect.height;
    // };

    const tableHeightLogic = useAutoTableHeightInCard({
      compensation: computed(
        () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      ),
      fixedBlockHeightRefs: [topCardHeight],
      tableMinHeight: 100,
    });
    /** 应收编号渲染函数 */
    const receivable_uid_render = (row: AchievementReceivable) => {
      return h(
        'div',
        {
          class: 'number-div',
        },
        [
          h(
            'span',
            {
              class: `number-span table_achievement ${
                row.reverse_id !== null ||
                row.reversed_id ||
                row.refunded_id ||
                (row.refund_amount > 0 && row.refund_amount === row.receivable_amount)
                  ? 'reverse-red'
                  : row.refund_amount > 0 && row.refund_amount !== row.receivable_amount
                  ? 'reverse-orange'
                  : ''
              }`,
            },
            row.receivable_uid,
          ),
        ],
      );
    };

    /** 应收金额渲染函数 */
    const receivable_amount_render = <T extends boolean>(
      row: AchievementReceivable,
      text_only: T,
    ) => {
      const reverseClass =
        row.reverse_id !== null ||
        row.reversed_id ||
        row.refunded_id ||
        (row.refund_amount > 0 && row.refund_amount === row.receivable_amount)
          ? 'reverse-red'
          : row.refund_amount > 0 && row.refund_amount !== row.receivable_amount
          ? 'reverse-orange'
          : '';
      return text_only
        ? row.receivable_uid
        : (h('div', { class: reverseClass }, [
            formatAmount(row.receivable_amount, ''),
          ]) as TableColumnRenderReturn<T>);
    };

    /** 结算单渲染函数 */
    const settlement_uid_render = (row: AchievementReceivable) => {
      return h(
        'div',
        {
          class: 'number-div',
        },
        [
          h(
            'span',
            {
              class: `number-span text ${
                row.reverse_id !== null ||
                row.reversed_id ||
                row.refunded_id ||
                (row.refund_amount > 0 && row.refund_amount === row.receivable_amount)
                  ? 'reverse-red'
                  : row.refund_amount > 0 && row.refund_amount !== row.receivable_amount
                  ? 'reverse-orange'
                  : ''
              }`,
            },
            row.settlement_uid,
          ),
        ],
      );
    };

    const columns = computed<TableColumn<AchievementReceivable>[]>(() => [
      {
        label: '应收编号',
        minWidth: 180,
        formatter: row => receivable_uid_render(row),
      },
      {
        label: '应收金额 (元)',
        headerAlign: 'right',
        align: 'right',
        minWidth: max_length_of_column(achievment.data, '应收金额 (元)', receivable_amount_render)
          .value,
        formatter: row => receivable_amount_render(row, false),
      },
      {
        label: '创建日期',
        minWidth: 154,
        align: 'center',
        formatter: row => moment(row.create_date).format('YYYY.MM.DD'),
      },
      {
        label: '结算单',
        minWidth: 180,
        formatter: row => settlement_uid_render(row),
      },
      {
        label: '核销状态',
        minWidth: 180,
        formatter: row => {
          const write_off_infos = (row.write_off_infos || []).map((item: any) => {
            return [
              item.receipt_uid,
              item.write_off_amount,
              item.write_off_user,
              item.write_off_time,
            ];
          });
          (row.refund_write_off_infos || []).forEach((item: any) => {
            write_off_infos.push([
              item.cost_id,
              (item.write_off_amount ?? 0) * -1,
              item.write_off_user,
              item.write_off_time,
            ]);
          });
          const write_off_header = ['单据编号', '核销金额 (元)', '核销人/账期时间'];

          return h(WriteOff, {
            attrs: {
              is_reverse: row.reversed_id,
              write_off_header,
              write_off_infos,
              write_off_status: row.write_off_status,
            },
          });
        },
      },
      {
        label: '操作',
        align: 'center',
        fixed: 'right',
        formatter: row => {
          const btns = [];
          const hasWriteOff = permission.common_business_write_off;
          if (row.write_off_status !== 2 && !row.reverse_id && !row.reversed_id && hasWriteOff) {
            btns.push(
              h(
                'a',
                {
                  on: {
                    click: () => {
                      firstStepRef.value?.show({
                        type: 'isReceivable',
                        id: row.id,
                        amount: row.not_write_off_amount, // 可核销金额
                        leaf: 'common_business', // 店铺代播
                        busType: row.receivable_type, // businessType
                        receivable_uid: row.receivable_uid || row.achievement_uid, // 应收编号
                      });
                    },
                  },
                },
                ['核销'],
              ),
            );
            // btns.push(
            //   <a
            //     onClick={() => {
            //       //@firstStepRef 通用业务应收
            //       firstStepRef.value?.show({
            //         type: 'isReceivable',
            //         id: row.id,
            //         amount: row.not_write_off_amount, // 可核销金额
            //         leaf: 'common_business', // 店铺代播
            //         busType: row.receivable_type, // businessType
            //         receivable_uid: row.receivable_uid || row.achievement_uid, // 应收编号
            //       });
            //     }}
            //   >
            //     核销
            //   </a>,
            // );
          }
          return h('div', { class: 'operation-column' }, btns);
        },
      },
    ]);

    return {
      isHideReversed,
      columns,
      invoiceDialogRef,
      getContractJumpLink,
      deleteCollection,
      ...achievment,
      achievementRef,
      invoicelistRef,
      permission,
      userinfo,
      // writeOffLoading,
      firstStepRef,
      ...tableHeightLogic,
      // reverseOrderDialogRef,
      // onWriteOffConfirmResolve,
    };
  },
  render() {
    // const rectUpdate = {
    //   on: {
    //     ['rect:update']: this.onRectUpdate,
    //   },
    //   style: {
    //     ...this.cardProps,
    //   },
    // };

    return (
      <tg-card
        class="project-collection flex-auto"
        // {...rectUpdate}
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
        <div class="header">
          <span class="label">应收金额：</span>
          <span class="text">{formatAmount(this.receivable)}</span>
          <span class="label">已核销金额：</span>
          <span class="text">{formatAmount(this.write_off)}</span>
          <span class="label">未核销金额：</span>
          <span class="text">{formatAmount(this.not_write_off)}</span>
          <div class="reverse-div">
            <el-checkbox
              on-change={() => {
                this.reload(this.isHideReversed ? 1 : undefined);
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
          // height={this.tableProps.height}
          height="100%"
          loading={this.loading}
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
        </el-table>
        <achievement
          ref="achievementRef"
          onOk={() => {
            this.reload(this.isHideReversed ? 1 : undefined);
          }}
        />
        <invoicelist ref="invoicelistRef" />
        <InvoiceDetail {...{ ref: 'invoiceDialogRef' }} />
        <first-step
          ref="firstStepRef"
          onSubmit={() => {
            this.reload(this.isHideReversed ? 1 : undefined);
          }}
        />
        {/* <reverseOrderDialog ref="reverseOrderDialogRef" />
        <tg-mask-loading visible={this.writeOffLoading} content="正在提交冲销，请稍候..." /> */}
      </tg-card>
    );
  },
});
