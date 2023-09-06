/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-09-15 11:17:13
 */
import { computed, defineComponent, PropType, ref, watch } from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';
import { formatAmount } from '@/utils/string';
import { ProjectTypeEnum } from '@/types/tiange/common';
import {
  ReceivableForWriteOff,
  SavePayRefundWriteOffParams,
  SaveReceiveRefundWriteOffParams,
} from '@/types/tiange/live';
import {
  GetPayRefundForWriteOffList,
  GetReceivablesRefundForWriteOffList,
  SavePayRefundWriteOff,
  SaveReceiveRefundWriteOff,
} from '@/services/live';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import Decimal from 'decimal.js';

interface ReceivableForWriteOffData extends ReceivableForWriteOff {
  type_in_write_off_amount: string | undefined;
}

export default defineComponent({
  name: 'RefundWriteOff',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    invoiceId: {
      type: String,
    },
    /** 收款并且非店播时传 */
    costId: {
      type: Number,
    },
    /** 收款并且店播时传 */
    costSplitId: {
      type: Number,
    },
    type: {
      type: String as PropType<'receive' | 'pay'>,
      default: 'receive',
    },
    projectType: {
      type: Number as PropType<ProjectTypeEnum>,
      default: ProjectTypeEnum.live,
    },
    notWriteOffAmount: {
      type: Number,
    },
    //  pay时传
    refund_cost_id: {
      type: String,
    },
    achievement_id: {
      type: Number,
    },
  },
  setup(props, ctx) {
    const id = computed(() => props.invoiceId ?? '');
    const projectType = computed(() => props.projectType);
    const listLoading = ref<boolean>(false);
    const saveLoading = ref<boolean>(false);

    const selectedList = ref<ReceivableForWriteOffData[]>([]);

    const data = ref<ReceivableForWriteOffData[]>([]);

    const saveDisabled = computed(() => !selectedList.value.length);

    const columns = computed<TableColumn<ReceivableForWriteOffData>[]>(() => [
      {
        type: 'selection',
        width: 40,
      },
      {
        label: props.type === 'pay' ? '应付编号' : '应收编号',
        width: 174,
        property: 'receivable_uid',
        formatter: row => row.receivable_uid,
      },
      {
        label: props.type === 'pay' ? '原付款编号' : '原收款编号',
        width: 188,
        property: 'receipt_uid',
        formatter: row => row.receipt_uid,
      },
      {
        label: '原单核销金额',
        width: 152,
        align: 'right',
        property: 'write_off_amount',
        formatter: row => formatAmount(row.write_off_amount),
      },
      {
        label: '退款已核销金额',
        width: 140,
        align: 'right',
        property: 'refund_write_off_amount',
        formatter: row => formatAmount(row.refund_write_off_amount),
      },
    ]);

    const methods = {
      handleCloseAction: () => {
        ctx.emit('cancel');
        ctx.emit('update:visible', false);
      },
      handleSaveAction: () => {
        const typeInAmount = selectedList.value.reduce((pre, cur) => {
          return new Decimal(cur.type_in_write_off_amount ? cur.type_in_write_off_amount : 0).add(
            pre,
          );
        }, new Decimal(0));
        if (!typeInAmount.lessThanOrEqualTo(new Decimal(props.notWriteOffAmount ?? 0))) {
          ctx.root.$message.warning('所有记录的核销金额总和不能大于退款可核销金额');
          return;
        }
        const findZero = selectedList.value.find(
          el =>
            !el.type_in_write_off_amount ||
            el.type_in_write_off_amount === '' ||
            Number(el.type_in_write_off_amount) === 0,
        );
        if (findZero) {
          ctx.root.$message.warning('核销金额不能为0');
          return;
        }
        if (props.type === 'pay') {
          methods.savePayRefundWriteOffRequest();
        } else {
          methods.saveReceiveRefundWriteOffRequest();
        }
      },
      formatAmount,
      handleSelectionChange: (val: any) => {
        selectedList.value = val;
      },
      typeInInputDisabled: (row: ReceivableForWriteOffData) => {
        return selectedList.value.indexOf(row) === -1;
      },
      getPositivePriceNumber: (value: string, intNum = 8) => {
        const re = new RegExp(`(?:0|[1-9]\\d{0,${intNum - 1}})(?:\\.\\d{0,2})?`, 'u');
        const result = (re.exec(
          value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
        ) ?? [''])[0];
        return result;
      },
      typeInAmountChanged: (val: string, index: number) => {
        const row = data.value[index];
        const write_off_amount = row.write_off_amount ? row.write_off_amount : 0;
        const refund_write_off_amount = row.refund_write_off_amount
          ? row.refund_write_off_amount
          : 0;
        const amount = new Decimal(write_off_amount).sub(new Decimal(refund_write_off_amount));
        const newVal = methods.getPositivePriceNumber(val);
        if (new Decimal(newVal ? newVal : 0).lessThanOrEqualTo(amount)) {
          row.type_in_write_off_amount = newVal;
        }
      },
      //  request
      getReceivablesRefundForWriteOffList: async () => {
        listLoading.value = true;
        const res = await GetReceivablesRefundForWriteOffList(id.value, projectType.value);
        listLoading.value = false;
        if (res.data.success) {
          data.value = res.data.data.map(el => {
            return { ...el, type_in_write_off_amount: undefined };
          });
        } else {
          data.value = [];
        }
      },
      getPayRefundForWriteOffList: async () => {
        listLoading.value = true;
        const res = await GetPayRefundForWriteOffList(props.refund_cost_id ?? '');
        listLoading.value = false;
        if (res.data.success) {
          data.value = res.data.data.map(el => {
            return {
              id: el.id,
              receipt_uid: el.cost_uid,
              receivable_uid: el.payable_uid,
              write_off_amount: el.write_off_amount,
              refund_write_off_amount: el.refund_write_off_amount,
              type_in_write_off_amount: undefined,
            };
          });
        } else {
          data.value = [];
        }
      },
      savePayRefundWriteOffRequest: async () => {
        const params: SavePayRefundWriteOffParams = {
          achievement_id: props.achievement_id,
          write_off_list: selectedList.value.map(el => {
            return {
              pay_write_off_id: el.id,
              write_off_amount: el.type_in_write_off_amount ?? '',
            };
          }),
        };
        saveLoading.value = true;
        const res = await SavePayRefundWriteOff(params);
        saveLoading.value = false;
        if (res.data.success) {
          ctx.emit('save');
          ctx.root.$message.success(res.data.message ?? '保存成功');
        } else {
          ctx.root.$message.error(res.data.message ?? '保存失败');
        }
      },
      saveReceiveRefundWriteOffRequest: async () => {
        const params: SaveReceiveRefundWriteOffParams = {
          achievement_uid: id.value,
          cost_id: undefined,
          cost_split_id: undefined,
          write_off_list: selectedList.value.map(el => {
            return {
              id: el.id,
              write_off_amount: el.type_in_write_off_amount ?? '',
            };
          }),
        };

        if (props.costId) {
          params['cost_id'] = props.costId;
        } else if (props.costSplitId) {
          params['cost_split_id'] = props.costSplitId;
        }
        saveLoading.value = true;
        const res = await SaveReceiveRefundWriteOff(params);
        saveLoading.value = false;
        if (res.data.success) {
          ctx.emit('save');
          ctx.root.$message.success(res.data.message ?? '保存成功');
        } else {
          ctx.root.$message.error(res.data.message ?? '保存失败');
        }
      },
    };
    watch(
      [
        () => props.invoiceId,
        () => props.type,
        () => props.projectType,
        () => props.visible,
        () => props.refund_cost_id,
        () => props.costSplitId,
      ],
      ([newId, newType, _, newVisible, newRefundCostId]) => {
        if (newId || newRefundCostId) {
          if (newType === 'receive') {
            methods.getReceivablesRefundForWriteOffList();
          } else if (newType === 'pay') {
            methods.getPayRefundForWriteOffList();
          }
        } else {
          data.value = [];
        }
        if (!newVisible) {
          selectedList.value = [];
          data.value = [];
        }
      },
    );

    return {
      data,
      saveLoading,
      listLoading,
      columns,
      ...methods,
      selectedList,
      saveDisabled,
    };
  },
});
