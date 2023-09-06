/*
 * @Author: 肖槿
 * @Date: 2021-05-19 16:57:16
 * @Description: 业务结算
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-02-14 15:45:30
 * @FilePath: \goumee-star-frontend\src\modules\finance\Settlement\components\BuessinessSettlement\index.tsx
 */
import { defineComponent, ref, computed, nextTick, provide } from '@vue/composition-api';
import SettlementDetail from '../SettlementDetail/index.vue';
import SettlementDialog from '../SettlementDialog/index.vue';
import { RIGHT_CODE } from '@/const/rightCode';
import { HasPermission } from '@/use/permission';

// import { AsyncConfirm } from '@/use/asyncConfirm';
import { RefuseSettlement, ApproveSettlement, QueryAccountPeriod } from '@/services/finance';
import { Settlement } from '@/types/tiange/finance/settlement';
import MerchantSettlement from '@/modules/investment/settlement/dialog/income/step3.vue';
import {
  ApproveMerchantSettlementFinancial,
  RefuseMerchantSettlementFinacial,
} from '@/services/investment';
import billPeriod from '@/modules/finance/settlement_income/components/billPeriod/index.vue';
import { BillingPeriodType } from '../billPeriod';
// import moment from 'moment';
import { AsyncConfirm } from '@/use/asyncConfirm';

export default defineComponent({
  name: 'BuessinessSettlement',
  components: {
    SettlementDetail,
    SettlementDialog,
    MerchantSettlement,
    billPeriod,
  },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const confirmLoading = ref<boolean>(false);
    const billPeriodRef = ref<BillingPeriodType | undefined>(undefined);
    const currentcolumn: any = ref({});
    const disabledMonth = ref<number[] | undefined>(undefined);
    const accountDate = ref<string | undefined>(undefined);

    provide('settlement', currentcolumn);

    const settlementVisible = ref<boolean>(false);
    const top = ref('');

    const isMerchantSettlement = computed(() => {
      return currentcolumn.value?.shop_live_live_goods_id;
    });
    const show = (column: Settlement) => {
      queryAccountPeriod();
      currentcolumn.value = column;
      accountDate.value = undefined;
      settlementVisible.value = true;
      nextTick(() => {
        const bh = document.body.clientHeight;
        const dh = document.querySelectorAll('.settlement-dialog-a > .el-dialog')[0].clientHeight;
        top.value = (bh - dh) / 2 + 'px';
      });
    };
    const Permission = computed(() => {
      const canUpdate = HasPermission(RIGHT_CODE.settlement_income_update);
      return { canUpdate };
    });
    const closeHandler = () => {
      settlementVisible.value = false;
      (ctx.refs.settlementDialog as unknown as { closeAction: () => void }).closeAction();
    };
    const unpassHandler = () => {
      (ctx.refs.settlementDialog as unknown as { show: () => void }).show();
      // closeHandler();
    };
    const passHandler = async () => {
      // billPeriodRef.value?.show();
      if (!accountDate.value) {
        ctx.root.$message.error('请选择账期');
        return;
      }
      const confirm = await AsyncConfirm(ctx, '确定通过这条结算吗？');
      if (confirm) {
        confirmLoading.value = true;
        const { data } = isMerchantSettlement.value
          ? await ApproveMerchantSettlementFinancial(currentcolumn.value.id)
          : await ApproveSettlement(currentcolumn.value.id, {
              account_detail_date: accountDate.value,
            });
        confirmLoading.value = false;
        if (!data.success) {
          ctx.root.$message({
            type: 'warning',
            message: data.message ?? '提交失败，稍后重试',
            duration: 2000,
            showClose: true,
          });
        } else {
          ctx.root.$message({
            type: 'success',
            message: '提交成功',
            duration: 2000,
            showClose: true,
          });
          closeHandler();
          billPeriodRef.value?.close();
          ctx.emit('success');
        }
      }
    };
    const unpassReasonHandler = async (reason: string) => {
      confirmLoading.value = true;
      const { data } = isMerchantSettlement.value
        ? await RefuseMerchantSettlementFinacial({
            id: currentcolumn.value.id,
            refuse_reason: reason,
          })
        : await RefuseSettlement({
            id: currentcolumn.value.id,
            refuse_reason: reason,
          });
      confirmLoading.value = false;
      if (!data.data) {
        ctx.root.$message({
          type: 'warning',
          message: data.message ?? '提交失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      } else {
        ctx.root.$message({
          type: 'success',
          message: '提交成功',
          duration: 2000,
          showClose: true,
        });
        closeHandler();
        ctx.emit('success');
      }
    };
    const is_unity_settlement = computed(
      () => currentcolumn.value?.settlement_type === 5 && currentcolumn.value?.unity_settlement_id,
    );
    const onBillPeriodHaandler = async (date: string) => {
      // const confirm = await AsyncConfirm(ctx, '确定通过这条结算吗？');
      // if (confirm) {
      confirmLoading.value = true;
      const { data } = isMerchantSettlement.value
        ? await ApproveMerchantSettlementFinancial(currentcolumn.value.id)
        : await ApproveSettlement(currentcolumn.value.id, {
            account_detail_date: date,
          });
      confirmLoading.value = false;
      if (!data.success) {
        ctx.root.$message({
          type: 'warning',
          message: data.message ?? '提交失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      } else {
        ctx.root.$message({
          type: 'success',
          message: '提交成功',
          duration: 2000,
          showClose: true,
        });
        closeHandler();
        billPeriodRef.value?.close();
        ctx.emit('success');
      }
      // }
    };

    const queryAccountPeriod = async () => {
      const res = await QueryAccountPeriod({
        num: 1000,
        page_num: 1,
        account_month: undefined,
        effective_month: '2021-01',
        // effective_month: moment().subtract(1, 'year').format('yyyy-MM'),
      });
      if (res.data.success) {
        disabledMonth.value =
          res.data.data.data.map(el => {
            return el.period_date_start || 0;
          }) || [];
      }
    };

    const onAccountDateChange = (date: string) => {
      accountDate.value = date;
    };

    const operatorAbled = computed(() => {
      return (
        currentcolumn.value.status !== 2 &&
        Permission.value.canUpdate &&
        !props.readonly &&
        !is_unity_settlement.value
      );
    });

    return {
      unpassHandler,
      show,
      top,
      is_unity_settlement,
      passHandler,
      currentcolumn,
      closeHandler,
      settlementVisible,
      Permission,
      unpassReasonHandler,
      isMerchantSettlement,
      onBillPeriodHaandler,
      billPeriodRef,
      disabledMonth,
      onAccountDateChange,
      operatorAbled,
      confirmLoading,
    };
  },
});
