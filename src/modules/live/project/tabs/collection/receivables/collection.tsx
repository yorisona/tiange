import {
  defineComponent,
  h,
  ref,
  inject,
  watch,
  computed,
  onMounted,
  Ref,
} from '@vue/composition-api';
import achievement from '../../../dialog/achievement.vue';
import invoicelist from '../../../dialog/invoice.list.vue';
import { AsyncConfirm } from '@/use/asyncConfirm';
import formatData from '@/utils/formatData';
import { usePermission } from '@/use/permission';
import { MoneyUnit } from '@/utils/money';
import { useUserInfo } from '@/use/vuex';
import moment from 'moment';
import { ContractType } from '@/types/tiange/contract';
import InvoiceDetail from '@/modules/workbench/initiate/invoice/detail.vue';
import { TgInvoiceDetail } from '@/modules/workbench/initiate/invoice/detail';
import FirstStep from '../../writeDialog/firstStep.vue';
import WriteOff from '@/components/BusinessComponents/WriteOff/index.vue';
import { TableColumn } from '@/types/vendor/column';
import {
  AchievementReceivable,
  AchievementReceivableQueryParams,
} from '@/types/tiange/marketing/achievement';
import { GetShopAchievementListReceivables } from '@/services/marketing/achievement';
import { DeleteShopLiveAchievement } from '@/services/live.project';
import { Decimal2String } from '@/utils/string';
import Decimal from 'decimal.js';
import { LiveProject } from '@/types/tiange/live.project';
import { wait } from '@/utils/func';
import { max_length_of_column } from '@/utils/table';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export default defineComponent({
  components: { achievement, invoicelist, InvoiceDetail, FirstStep },
  setup(props, ctx) {
    const achievementRef = ref<{ show: (obj?: any) => void } | null>(null);
    const invoicelistRef = ref<{ show: (obj?: any) => void } | null>(null);
    /** 开票审批 弹窗 */
    const invoiceDialogRef = ref<TgInvoiceDetail | null>(null);
    const project = inject<Ref<LiveProject | undefined>>('project') ?? ref(undefined);
    const firstStepRef = ref<{ show: (...args: any) => void } | undefined>(undefined);
    const permission = usePermission();

    const init = ref(false);
    const loading = ref(false);
    const isHideReversed = ref(true);
    const data = ref<AchievementReceivable[]>([]);
    const not_write_off = ref(0);
    const receivable = ref(0);
    const write_off = ref(0);
    let lastQuery: any;

    const query = async (params: AchievementReceivableQueryParams): Promise<void> => {
      lastQuery = {
        ...params,
        is_hide_reverse_data: isHideReversed.value ? 1 : undefined,
        page_num: 1,
        num: 1000,
      };
      loading.value = true;
      const [{ data: response }] = await wait(
        500,
        GetShopAchievementListReceivables(lastQuery, business_type.value),
      );
      const resData = response.data;
      loading.value = false;

      init.value = true;
      if (response.success) {
        data.value = response.data.data;
        not_write_off.value = resData.not_write_off;
        receivable.value = resData.receivable;
        write_off.value = resData.write_off;
      } else {
        data.value = [];
        console.warn('未获取到数据');
      }
    };

    const reload = () => {
      query({ ...lastQuery });
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

    watch(
      () => project.value,
      () => {
        if (project.value !== null) {
          query({
            receivable_type: project.value?.business_type,
            project_id: project.value?.id,
          });
        }
      },
    );

    onMounted(() => {
      if (project.value !== undefined && project.value !== null) {
        query({
          receivable_type: project.value.business_type,
          project_id: project.value?.id,
        });
      }
    });

    const deleteCollection = async (achievement_id: number) => {
      const reuslt = await AsyncConfirm(ctx, '确认删除该业绩？');
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

    const header_money = computed(() => {
      return {
        receivable: formatData.formatPrice(receivable.value, MoneyUnit.Yuan, true),
        write_off: formatData.formatPrice(write_off.value, MoneyUnit.Yuan, true),
        not_write_off: formatData.formatPrice(not_write_off.value, MoneyUnit.Yuan, true),
      };
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
              class: `number-span ${
                row.reverse_id !== null ||
                row.reversed_id !== null ||
                row.refunded_id !== null ||
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
      const data = `${Decimal2String(new Decimal(row.receivable_amount))}`;
      return text_only
        ? data
        : (h(
            'div',
            {
              class:
                row.reverse_id !== null ||
                row.reversed_id !== null ||
                row.refunded_id !== null ||
                (row.refund_amount > 0 && row.refund_amount === row.receivable_amount)
                  ? 'reverse-red'
                  : row.refund_amount > 0 && row.refund_amount !== row.receivable_amount
                  ? 'reverse-orange'
                  : '',
            },
            [data],
          ) as TableColumnRenderReturn<T>);
    };

    /** 应收金额最大宽度 */
    const receivable_amount_max_length = max_length_of_column(
      data,
      '应收金额 (元)',
      receivable_amount_render,
    );

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
                row.reversed_id !== null ||
                row.refunded_id !== null ||
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

    /** 核销状态最大宽度 */
    const write_off_infos_fake_render = (row: AchievementReceivable) =>
      row.write_off_status === 1 ? '状态：部分核销' : '状态：未核销';

    /** 核销状态最大宽度 */
    const write_off_infos_max_length = max_length_of_column(
      data,
      '核销状态',
      write_off_infos_fake_render,
    );
    /** 本地生活 */
    const { isFromLocalLife, isFromLiveDouyin, isFromSupplyChain, business_type } =
      useProjectBaseInfo();
    const columns = computed<TableColumn<AchievementReceivable>[]>(() => [
      {
        label: '应收编号',
        fixed: 'left',
        minWidth: 160,
        formatter: row => receivable_uid_render(row),
      },
      {
        label: '应收金额 (元)',
        align: 'right',
        fixed: 'left',
        minWidth: receivable_amount_max_length.value,
        formatter: row => receivable_amount_render(row, false),
      },
      {
        label: '创建日期',
        minWidth: 110,
        align: 'center',
        formatter: row => moment(row.create_date).format('YYYY.MM.DD'),
      },

      {
        label: '结算单',
        minWidth: 160,
        formatter: row => settlement_uid_render(row),
      },
      {
        label: '核销状态',
        minWidth: write_off_infos_max_length.value,
        formatter: row => {
          const write_off_infos = (row.write_off_infos || []).map(item => {
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

          const btns = [];
          const hasWriteOff = isFromSupplyChain.value
            ? permission.supply_write_off
            : isFromLocalLife.value
            ? permission.local_life_write_off_save
            : permission.live_write_off_save;

          if ((row.write_off_status === 1 || row.write_off_status === 0) && hasWriteOff) {
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
                        leaf: isFromSupplyChain.value
                          ? 'supply_chain'
                          : isFromLocalLife.value
                          ? 'local_life'
                          : 'live', // 店铺代播
                        busType: row.receivable_type, // businessType
                        receivable_uid: row.receivable_uid || row.achievement_uid, // 应收编号
                      });
                    },
                  },
                },
                ['核销'],
              ),
            );
          }

          return h('div', { class: 'operation' }, btns);
        },
      },
    ]);

    // 自适应表格高度部分
    const buttonLineHeight = 32;
    const paginationLineHeight = 0;
    const rectPadding = 36;
    const otherHeight = 20;

    const tableHeightLogic = useAutoTableHeightInCard({
      compensation: computed(
        () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      ),
      fixedBlockHeightRefs: [],
      tableMinHeight: 100,
    });
    return {
      isFromLocalLife,
      isFromLiveDouyin,
      isHideReversed,
      invoiceDialogRef,
      getContractJumpLink,
      deleteCollection,
      achievementRef,
      invoicelistRef,
      permission,
      userinfo,
      firstStepRef,
      header_money,
      columns,
      reload,
      data,
      loading,
      ...tableHeightLogic,
    };
  },
});
