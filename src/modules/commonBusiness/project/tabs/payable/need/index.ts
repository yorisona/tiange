import {
  defineComponent,
  ref,
  computed,
  inject,
  Ref,
  watch,
  onMounted,
  UnwrapRef,
  h,
} from '@vue/composition-api';
import { formatAmount } from '@/utils/string';
import WriteListPop from '@/modules/finance/components/WriteListPop/index.vue';
import FirstStep from '@/modules/live/project/tabs/writeDialog/firstStep.vue';
import { useRouter } from '@/use/vue-router';
import { CommonBusinessProjectDetail, PayableList } from '@/types/tiange/commonBusiness/project';
import { GetCommonPayablesList } from '@/services/commonBusiness/project';
import { usePermission } from '@/use/permission';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import type { TableColumn } from '@/types/vendor/column';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { max_length_of_column } from '@/utils/table';
import { VNode } from 'vue/types/umd';
// import WriteOffConfirmDialog from '@/modules/settlement/component/reverseOrder.vue';
// import { sleep } from '@/utils/func';
import PaymentDialog from '@/modules/marketing/project/dialog/payment/form.vue';

export default defineComponent({
  name: 'TgMarketingProjectTabNeed',
  components: {
    WriteListPop,
    FirstStep,
    // WriteOffConfirmDialog,
    PaymentDialog,
  },
  setup: function (props, ctx) {
    const router = useRouter();
    const project_id = router.currentRoute.params.id;
    const project =
      inject<Ref<CommonBusinessProjectDetail>>('project') ?? ref<CommonBusinessProjectDetail>();
    // 4: 基地业务 5: 创新项目
    const currentProject = computed(() => project.value);
    const business_type = currentProject.value?.business_type;
    const paymentDialogVisible = ref(false);
    const isHideReversed = ref(true);
    /** 权限检查 */
    const Permission = usePermission();

    // const writeOffLoading = ref<boolean>(false);

    const firstStepRef = ref<UnwrapRef<{ show: (...args: any) => void } | undefined>>(undefined);

    const paymentData = ref({
      project_name: currentProject.value?.project_name,
      project_id: currentProject.value?.id,
      business_type: currentProject?.value?.business_type,
    });
    watch(
      () => {
        return project.value;
      },
      () => {
        if (currentProject.value?.business_type) {
          getList();
          paymentData.value = {
            project_name: currentProject.value?.project_name,
            project_id: currentProject.value?.id,
            business_type: currentProject?.value?.business_type,
          };
        }
      },
    );
    const loading = ref(false);
    const info = ref<any>({
      payable: 0,
      write_off: 0,
      not_write_off: 0,
    });
    const list = ref<PayableList[]>([]);

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

    // const handleReserve = (row: any) => {
    //   reverseOrderDialogRef.value?.open(msg => onWriteOffConfirmResolve(row, msg));
    // };

    const getList = async () => {
      loading.value = true;
      const payload = {
        project_id,
        payable_type: business_type,
        is_hide_reverse_data: isHideReversed.value ? 1 : undefined,
      };
      const res = await GetCommonPayablesList(payload);
      if (res.data.success) {
        const data = res.data.data;
        list.value = data.data;
        info.value = {
          payable: data.payable,
          write_off: data.write_off,
          not_write_off: data.not_write_off,
        };
        loading.value = false;
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };

    const handleWriteOff = (row: any) => {
      //@firstStepRef 通用业务应付
      firstStepRef.value?.show({
        type: 'isPayable',
        id: row.id,
        amount: row.not_write_off_amount, // 可核销金额
        leaf: 'common_business', // 店铺代播
        busType: row.receivable_type, // businessType
        receivable_uid: row.payable_uid,
      });
    };

    onMounted(() => {
      if (project_id && business_type) {
        getList();
      }
    });

    // 自适应表格高度部分
    const buttonLineHeight = 32;
    const paginationLineHeight = 0;
    const rectPadding = 0;
    const otherHeight = 0;

    const topCardHeight = ref(100);

    const tableHeightLogic = useAutoTableHeightInCard({
      compensation: computed(
        () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      ),
      fixedBlockHeightRefs: [topCardHeight],
      tableMinHeight: 100,
    });

    const payable_uid_render = (row: PayableList) => {
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
                row.reverse_id !== null ||
                row.reversed_id ||
                row.refunded_id ||
                (row.refund_amount > 0 && row.refund_amount === row.payable_amount)
                  ? 'reverse-red'
                  : row.refund_amount > 0 && row.refund_amount !== row.payable_amount
                  ? 'reverse-orange'
                  : ''
              }`,
            },
            row.payable_uid,
          ),
        ],
      );
    };

    const payable_amount_render = <T extends boolean>(row: PayableList, text_only: T) => {
      const textClass =
        row.reverse_id !== null ||
        row.reversed_id ||
        row.refunded_id ||
        (row.refund_amount > 0 && row.refund_amount === row.payable_amount)
          ? 'reverse-red'
          : row.refund_amount > 0 && row.refund_amount !== row.payable_amount
          ? 'reverse-orange'
          : '';
      const amount = String(formatAmount(row.payable_amount, ''));

      return text_only
        ? amount
        : (h('div', { class: textClass }, [amount]) as TableColumnRenderReturn<T>);
    };

    const settlement_uid_render = (row: PayableList) => {
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
                (row.refund_amount > 0 && row.refund_amount === row.payable_amount)
                  ? 'reverse-red'
                  : row.refund_amount > 0 && row.refund_amount !== row.payable_amount
                  ? 'reverse-orange'
                  : ''
              }`,
            },
            row.settlement_uid,
          ),
        ],
      );
    };

    const columns = computed<TableColumn<PayableList>[]>(() => [
      {
        label: '应付编号',
        minWidth: 180,
        formatter: row => payable_uid_render(row),
      },
      {
        label: '应付金额 (元)',
        headerAlign: 'right',
        align: 'right',
        minWidth: max_length_of_column(list, '应付金额 (元)', payable_amount_render).value,
        formatter: row => payable_amount_render(row, false),
      },
      {
        label: '创建日期',
        minWidth: 154,
        align: 'center',
        formatter: row => row.create_date,
      },
      {
        label: '结算单',
        minWidth: 180,
        formatter: row => settlement_uid_render(row),
      },
      {
        label: '核销状态',
        minWidth: 180,
        align: 'center',
        formatter: row => {
          const nodes: VNode[] = [];
          let statusNode: VNode | undefined = undefined;
          if (row.write_off_status === 2) {
            statusNode = h('p', { class: 'write-on', style: 'width: 60px' }, ['已核销']);
          } else if (row.write_off_status === 1) {
            statusNode = h('p', { class: 'write-off', style: 'width: 60px' }, ['部分核销']);
          } else {
            statusNode = h('p', { class: 'write-off', style: 'width: 60px' }, ['未核销']);
          }
          nodes.push(
            h(
              'div',
              {
                class: 'line-info',
                style: {
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                },
              },
              [h('p', { class: 'label-50' }, ['状态：']), statusNode],
            ),
          );
          if (row.write_off_infos.length > 0) {
            const write_off_infos = [...row.write_off_infos];
            row.refund_write_off_info_items.forEach((el: any) => {
              write_off_infos.push({
                cost_id: el.achievement_uid,
                cost_uid: el.achievement_uid,
                write_off_amount: (el.write_off_amount ?? 0) * -1,
                write_off_time: el.write_off_time,
                write_off_user: el.write_off_user,
              });
            });
            nodes.push(
              h(
                'div',
                {
                  class: 'line-info',
                  style: {
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    // paddingLeft: '10px',
                  },
                },
                [
                  h('p', { class: 'label-50' }, ['详情：']),
                  h(WriteListPop, {
                    class: 'label-70',
                    props: {
                      list: write_off_infos,
                      type: 'payable',
                      dateText: '账期时间',
                    },
                  }),
                ],
              ),
            );
          }
          return nodes;
        },
      },
      {
        label: '操作',
        align: 'center',
        fixed: 'right',
        formatter: row => {
          if (
            row.write_off_status !== 2 &&
            Permission.common_business_write_off &&
            !row.reverse_id &&
            !row.reversed_id &&
            !row.refunded_id
          ) {
            return h(
              'tg-button',
              {
                props: {
                  type: 'link',
                },
                on: {
                  click: () => handleWriteOff(row),
                },
              },
              ['核销'],
            );
          }
          return '';
        },
      },
    ]);
    const showPaymentDialog = () => {
      paymentDialogVisible.value = true;
    };
    /** 隐藏已冲销数据用*/
    const reload = () => {
      getList();
    };
    return {
      isHideReversed,
      reload,
      columns,
      loading,
      info,
      list,
      formatAmount,
      Permission,
      firstStepRef,
      handleWriteOff,
      getList,
      ...tableHeightLogic,
      // writeOffLoading,
      // handleReserve,
      // reverseOrderDialogRef,
      // onWriteOffConfirmResolve,
      paymentDialogVisible,
      showPaymentDialog,
      paymentData,
    };
  },
});
