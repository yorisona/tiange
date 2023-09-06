import { computed, defineComponent, h, inject, ref, Ref, watch } from '@vue/composition-api';
import achievement from '../../../dialog/cost.dialog.vue';
import invoicelist from '../../../dialog/invoice.list.vue';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { useRouter } from '@/use/vue-router';
import formatData from '@/utils/formatData';
import { usePermission } from '@/use/permission';
import { useUserInfo } from '@/use/vuex';
import applyDetail from '@/views/workbench/components/ApplyDetail.vue';
import refundDetail from '@/views/workbench/refund/refundDetail.vue';
import applicationDetail from '@/views/workbench/application/applicationDetail.vue';
import invoicesDetail from '@/views/workbench/invoices/invoicesDetail.vue';
import WriteOff from '@/components/BusinessComponents/WriteOff/index.vue';
import FirstStep from '@/modules/live/project/tabs/writeDialog/firstStep.vue';
import { numberMoneyFormat } from '@/utils/formatMoney';
import { TableColumn } from '@/types/vendor/column';
import { DELETE_SHOP_LIVE_COST, queryShopLivePayables } from '@/services/live.project';
import { Decimal2String } from '@/utils/string';
import Decimal from 'decimal.js';
import { LiveProjectPayables } from '@/types/tiange/live.project';
import { wait } from '@/utils/func';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { max_length_of_column } from '@/utils/table';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import PaymentDialog from '@/modules/marketing/project/dialog/payment/form.vue';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

const momey_format = (num: string | number) => `￥${Decimal2String(new Decimal(num))}`;
const price_format = (num: string | number) => `${Decimal2String(new Decimal(num))}`;
export default defineComponent({
  components: {
    achievement,
    invoicelist,
    applyDetail,
    refundDetail,
    applicationDetail,
    invoicesDetail,
    FirstStep,
    PaymentDialog,
  },
  setup(props, ctx) {
    const achievementRef = ref<{ show: (obj?: any) => void } | null>(null);
    const invoicelistRef = ref<{ show: (obj: any) => void } | null>(null);
    const applyDetailDialog = ref<{ show: (obj?: any) => void } | null>(null);
    const refundDetailDialog = ref<{ show: (obj?: any) => void } | null>(null);
    const applicationDetailDialog = ref<{ show: (obj?: any) => void } | null>(null);
    const invoicesDetailDialog = ref<{ show: (obj?: any) => void } | null>(null);
    const applyDetailDialogVisible = ref(false);
    const refundVisible = ref(false);
    const applicationVisible = ref(false);
    const invoicesVisible = ref(false);
    const firstStepRef = ref<{ show: (...args: any) => void } | undefined>(undefined);
    const paymentDialogVisible = ref(false);
    const isHideReversed = ref(true);
    const permission = usePermission();

    // # 列表逻辑
    const loading = ref(false);
    const data = ref<LiveProjectPayables[]>([]);
    let lastParams: any;
    const payable = ref(0);
    const write_off = ref(0);
    const not_write_off = ref(0);
    const total = ref(0);
    const { business_type } = useProjectBaseInfo();

    const query = async (params: any = {}) => {
      lastParams = { ...params, is_hide_reverse_data: isHideReversed.value ? 1 : undefined };

      loading.value = true;
      const [res] = await wait(500, queryShopLivePayables(lastParams, business_type.value));
      loading.value = false;

      if (res.data.success) {
        const info = res.data.data;
        data.value = info.data;
        payable.value = info.payable;
        write_off.value = info.write_off;
        not_write_off.value = info.not_write_off;
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };

    const reload = () => {
      query({ ...lastParams });
    };
    const Delete = (cost_id: number) => {
      DELETE_SHOP_LIVE_COST(cost_id + '').then(res => {
        if (res.data.success) {
          ctx.root.$message.success(res.data.message);
          reload();
        } else {
          ctx.root.$message.error(res.data.message);
        }
      });
    };

    const router = useRouter();
    const project_id = router.currentRoute.params.id;
    const deleteCollection = async (cost_id: any) => {
      const ok = await AsyncConfirm(ctx, '确认删除该成本？');
      if (ok) {
        Delete(cost_id);
      }
    };
    const project = inject<
      Ref<{
        business_type: number;
        project_name: string;
        id: number;
        brand_name: string;
        brand_id: number;
        cooperation_type: number;
      }>
    >('project');

    const paymentData = ref<any>({
      project_name: project?.value?.project_name,
      project_id: project?.value?.id,
      brand_name: project?.value?.brand_name,
      brand_id: project?.value?.brand_id,
      business_type: project?.value?.cooperation_type !== 2 ? project?.value?.business_type : 6,
    });
    watch(
      () => project?.value,
      () => {
        if (project?.value?.business_type === undefined) return;
        query({
          project_id,
          payable_type: project?.value.business_type,
        });
        paymentData.value = {
          project_name: project?.value?.project_name,
          project_id: project?.value?.id,
          brand_name: project?.value?.brand_name,
          brand_id: project?.value?.brand_id,
          business_type: project?.value?.cooperation_type !== 2 ? project?.value?.business_type : 6,
        };
      },
    );
    if (project?.value?.business_type !== undefined) {
      query({
        project_id,
        payable_type: project?.value.business_type,
      });
    }

    const userinfo = useUserInfo();

    /** 应付编号渲染函数 */
    const payable_uid_render = <T extends boolean>(row: LiveProjectPayables, text_only: T) => {
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
                (text_only || (row.reverse_id === null && row.reversed_id === null)) &&
                row.refunded_id === null &&
                row.refund_amount === 0
                  ? ''
                  : row.refund_amount > 0 && row.refund_amount !== row.payable_amount
                  ? 'reverse-orange'
                  : 'reverse-red'
              }`,
            },
            row.payable_uid,
          ),
        ],
      );
    };

    /** 应付金额渲染函数 */
    const payable_amount_render = <T extends boolean>(row: LiveProjectPayables, text_only: T) => {
      const data = price_format(row.payable_amount);

      return (text_only || (row.reverse_id === null && row.reversed_id === null)) &&
        row.refunded_id === null &&
        row.refund_amount === 0
        ? data
        : row.refund_amount > 0 && row.refund_amount !== row.payable_amount
        ? (h('span', { class: 'reverse-orange' }, [data]) as TableColumnRenderReturn<T>)
        : (h('span', { class: 'reverse-red' }, [data]) as TableColumnRenderReturn<T>);
    };

    /** 应付金额最大宽度 */
    const payable_amount_max_length = max_length_of_column(
      data,
      '应付金额 (元)',
      payable_amount_render,
    );

    /** 创建日期渲染函数 */
    const create_date_render = (row: LiveProjectPayables) =>
      row.create_date
        ? row.create_date.replace(/-/g, '.')
        : formatData.formatEmpty(row.create_date);

    /** 结算单渲染函数 */
    const settlement_uid_render = <T extends boolean>(row: LiveProjectPayables, text_only: T) => {
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
                (text_only || (row.reverse_id === null && row.reversed_id === null)) &&
                row.refunded_id === null &&
                row.refund_amount === 0
                  ? ''
                  : row.refund_amount > 0 && row.refund_amount !== row.payable_amount
                  ? 'reverse-orange'
                  : 'reverse-red'
              }`,
            },
            row.settlement_uid,
          ),
        ],
      );
    };

    /** 核销状态最大宽度 */
    const write_off_infos_fake_render = (row: LiveProjectPayables) =>
      row.write_off_status === 1 ? '状态：部分核销' : '状态：未核销';

    /** 核销状态最大宽度 */
    const write_off_infos_max_length = max_length_of_column(
      data,
      '核销状态',
      write_off_infos_fake_render,
    );
    /** 本地生活 */
    const { isFromLocalLife, isFromSupplyChain, isFromLiveDouyin } = useProjectBaseInfo();
    const columns = computed<TableColumn<LiveProjectPayables>[]>(() => [
      {
        label: '应付编号',
        fixed: 'left',
        minWidth: 160,
        formatter: row => payable_uid_render(row, false),
      },
      {
        label: '应付金额 (元)',
        align: 'right',
        fixed: 'left',
        minWidth: payable_amount_max_length.value,
        formatter: row => payable_amount_render(row, false),
      },
      {
        label: '创建日期',
        minWidth: 110,
        align: 'center',
        formatter: create_date_render,
      },
      {
        label: '结算单',
        minWidth: 160,
        formatter: row => settlement_uid_render(row, false),
      },
      {
        label: '核销状态',
        minWidth: write_off_infos_max_length.value,
        formatter: row => {
          const write_off_infos = (row.write_off_infos || []).map(item => [
            item.cost_id,
            item.write_off_amount,
            item.write_off_user,
            item.write_off_time,
          ]);
          (row.refund_write_off_info_items || []).forEach((item: any) => {
            write_off_infos.push([
              item.achievement_uid,
              (item.write_off_amount ?? 0) * -1,
              item.write_off_user,
              item.write_off_time,
            ]);
          });

          const write_off_header = ['单据编号', '核销金额 (元)', '核销人/账期时间'];

          return h(WriteOff, {
            attrs: {
              write_off_header,
              write_off_infos,
              write_off_status: row.write_off_status,
              is_reverse: row.reversed_id !== null,
            },
          });
        },
      },
      {
        label: '操作',
        fixed: 'right',
        align: 'center',
        formatter: row => {
          // 冲销记录不可再核销
          if (row.reverse_id || row.reversed_id || row.refunded_id) {
            return '';
          }
          const hasWriteOff = isFromSupplyChain.value
            ? permission.supply_write_off
            : isFromLocalLife.value
            ? permission.local_life_write_off_save
            : permission.live_write_off_save;
          const hasEdit = (row.write_off_status === 1 || row.write_off_status === 0) && hasWriteOff;

          return h('div', { class: 'operation-column' }, [
            hasEdit
              ? h(
                  'a',
                  {
                    on: {
                      click: () => {
                        // @firstStepRef 店铺代播/应付
                        firstStepRef.value?.show({
                          type: 'isPayable',
                          id: row.id,
                          amount: row.not_write_off_amount, // 可核销金额
                          leaf: isFromSupplyChain.value
                            ? 'supply_chain'
                            : isFromLocalLife.value
                            ? 'local_life'
                            : 'live', // 店铺代播
                          busType: row.payable_type,
                          receivable_uid: row.payable_uid, // 应收编号
                        });
                      },
                    },
                  },
                  ['核销'],
                )
              : '',
          ]);
        },
      },
    ]);

    const payable4s = computed(() => momey_format(payable.value));
    const write_off4s = computed(() => momey_format(write_off.value));
    const not_write_off4s = computed(() => momey_format(not_write_off.value));

    // 自适应表格高度部分
    const buttonLineHeight = 32;
    const paginationLineHeight = 0;
    const rectPadding = 36;
    const otherHeight = 31;

    const { onRectUpdate, ...tableHeightLogic } = useAutoTableHeightInCard({
      compensation: computed(
        () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      ),
      fixedBlockHeightRefs: [],
      tableMinHeight: 100,
    });
    const showPaymentDialog = () => {
      paymentDialogVisible.value = true;
    };
    return {
      isFromLocalLife,
      isFromLiveDouyin,
      isHideReversed,
      numberMoneyFormat,
      permission,
      achievementRef,
      invoicelistRef,
      applyDetailDialog,
      applyDetailDialogVisible,
      deleteCollection,
      userinfo,
      refundDetailDialog,
      applicationDetailDialog,
      invoicesDetailDialog,
      refundVisible,
      applicationVisible,
      invoicesVisible,
      paymentDialogVisible,
      showPaymentDialog,
      paymentData,
      firstStepRef,
      loading,
      data,
      reload,
      total,
      payable: payable4s,
      write_off: write_off4s,
      not_write_off: not_write_off4s,
      query,
      Delete,
      columns,
      ...tableHeightLogic,
      onRectUpdate,
    };
  },
  render(h) {
    return (
      <tg-card
        class="project-collection"
        on={{
          ['rect:update']: (rect: DOMRect) => {
            this.onRectUpdate(rect);
          },
        }}
        overflowInBody
        style={{
          height:
            this.isFromLocalLife || this.isFromLiveDouyin
              ? 'calc(100vh - 145px)'
              : 'calc(100vh - 190px)',
        }}
      >
        <div class="header">
          {/* <tg-button
            class="payment-btn"
            type="primary"
            icon="ico-btn-add"
            onClick={this.showPaymentDialog}
          >
            付款申请
          </tg-button> */}
          <span class="label">应付金额：</span>
          <span class="text">{this.payable}</span>
          <span class="label">已核销金额：</span>
          <span class="text">{this.write_off}</span>
          <span class="label">未核销金额：</span>
          <span class="text">{this.not_write_off}</span>
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
          data={this.data}
          height={this.tableProps.height}
          {...{
            directives: [
              {
                name: 'loading',
                value: this.loading,
              },
            ],
          }}
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
        <achievement ref="achievementRef" onadded={() => this.reload()} />
        <first-step ref="firstStepRef" onSubmit={() => this.reload()} />
        <invoicelist ref="invoicelistRef" />
        {this.applyDetailDialogVisible && (
          <applyDetail
            ref="applyDetailDialog"
            onclose={() => {
              this.applyDetailDialogVisible = false;
            }}
          />
        )}
        {this.refundVisible && (
          <refund-detail
            ref="refundDetailDialog"
            onclose={() => {
              this.refundVisible = false;
            }}
          />
        )}
        {this.applicationVisible && (
          <application-detail
            ref="applicationDetailDialog"
            onclose={() => {
              this.applicationVisible = false;
            }}
          />
        )}
        {this.invoicesVisible && (
          <invoices-detail
            ref="invoicesDetailDialog"
            onclose={() => {
              this.invoicesVisible = false;
            }}
          />
        )}
        {this.paymentDialogVisible && (
          <payment-dialog
            visible={this.paymentDialogVisible}
            data={this.paymentData}
            on={{
              'dialog:close': () => {
                this.paymentDialogVisible = false;
              },
            }}
          />
        )}
      </tg-card>
    );
  },
});
