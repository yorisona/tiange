/**
 * 财务 - 成本结算 - 结算明细对话框(带审核操作)
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-09 17:29:58
 */
import { computed, defineComponent, nextTick, provide, ref } from '@vue/composition-api';
import {
  Settlement,
  SettlementStatus,
  SettlementType,
  SettlementTypeMap,
} from '@/types/tiange/finance/settlement';
import { BusinessTypeEnum } from '@/types/tiange/common';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { wait } from '@/utils/func';
import MerchantSettlement from '@/modules/investment/settlement/dialog/income/step3.vue';
import { and, set, whenever } from '@vueuse/core';
import RefuseDialog from '@/modules/finance/settlement_cost/refuse.dialog.vue';
import { usePermission } from '@/use/permission';
import {
  PassMerchantSettlement,
  RefuseMerchantSettlement,
  PassUnitySettlement,
} from '@/services/investment';

/** 结算明细对话框引用 */
export interface ProjectConfirmDialogRef {
  open: (data: Settlement) => void;
}

const ProjectConfirmDialog = defineComponent({
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    RefuseDialog,
    MerchantSettlement,
  },
  setup(props, ctx) {
    /** 对话框是否可见 */
    const dialogVisible = ref(false);

    /** 设置对话框是否可见 */
    const setDialogVisible = (visible = false) => {
      dialogVisible.value = visible;
    };
    /** 切换对话框是否可见 */
    const toggleDialogVisible = () => {
      setDialogVisible(!dialogVisible.value);
    };

    /** 结算单详情 */
    const settlement = ref<Settlement | undefined>(undefined);

    const is_confirmed = computed(() => settlement.value?.status === SettlementStatus.confirmed);
    const is_unity_settlement = computed(
      () => settlement.value?.settlement_type === 5 && settlement.value?.unity_settlement_id,
    );
    provide('settlement', settlement);

    /** 数据展示组件名称  */
    const data_component = ref('');

    /** 各显示组件引用 */
    const stepCompRef = ref<{
      /** 填充数据 */
      fillForm: (data: Settlement) => void;
    } | null>(null);

    /** 应该准备填充数据了 */
    const shouldFillForm = ref(false);
    const isareashow = ref(false);
    /** 打开 */
    const open = (data: Settlement) => {
      settlement.value = data;
      set(data_component, 'MerchantSettlement');
      set(shouldFillForm, true);
      setDialogVisible(true);
    };

    whenever(and(shouldFillForm, stepCompRef.value !== undefined), () => {
      nextTick(() => {
        if (settlement.value !== undefined) {
          //    stepCompRef.value?.fillForm(settlement.value);
        }
      });
    });

    /** 重置数据并关闭 */
    const close = () => {
      set(shouldFillForm, false);

      ctx.emit('close');
      setDialogVisible();
      setTimeout(() => {
        set(data_component, undefined);
      }, 300);
    };

    /** 是否营销的步骤二、步骤三(需要单独设置宽度) */
    const isMarketing = computed(
      () => settlement.value?.business_type === BusinessTypeEnum.marketing,
    );

    const dialogClass = computed(() =>
      isMarketing.value ? 'settlement-dialog' : 'settlement-cost-dialog',
    );

    /** 对话框宽度 */
    const dialogWidth = computed(() =>
      isMarketing.value || isareashow.value ? '942px' : '1100px',
    );

    const 结算类型 = computed(
      () =>
        SettlementTypeMap.get(settlement.value?.settlement_type ?? SettlementType.live_taobao) ??
        '--',
    );

    const refustDialogRef = ref<{ open: () => void } | null>(null);

    const confirmRefuseReason = () => {
      refustDialogRef.value?.open();
    };

    const refuseLoading = ref(false);

    const refuse = async (reason: string) => {
      if (settlement.value === undefined) {
        return;
      }

      set(refuseLoading, true);
      const [{ data: response }] = await wait(
        500,
        RefuseMerchantSettlement(settlement.value.id, reason),
      );
      set(refuseLoading, false);

      if (response.data) {
        ctx.root.$message.success(response.message ?? '提交成功');
        ctx.emit('success:refuse');
        close();
      } else {
        ctx.root.$message.error(response.message ?? '提交失败');
      }
    };

    const confirmLoading = ref(false);

    /** 通过结算 */
    const confirm = async () => {
      if (settlement.value === undefined) {
        return;
      }
      const result = await AsyncConfirm(ctx, '确定通过这条结算吗？');
      if (!result) {
        return;
      }
      let fn: any = PassMerchantSettlement;
      if (settlement.value?.settlement_type === 8) {
        fn = PassUnitySettlement;
      }
      confirmLoading.value = true;
      const [{ data: response }] = (await wait(500, fn(settlement.value.id))) as any;
      confirmLoading.value = false;
      if (response.data) {
        ctx.root.$message.success(response.message ?? '确认结算成功');
        ctx.emit('success:confirm', settlement.value.id);
        close();
      } else {
        ctx.root.$message.error(response.message ?? '确认结算失败');
      }
    };

    const CanIEdit = computed(() => usePermission().project_confirmation);

    return {
      dialogVisible,
      toggleDialogVisible,
      open,
      close,
      stepCompRef,
      data_component,
      dialogClass,
      dialogWidth,
      settlement,
      结算类型,
      refustDialogRef,
      confirmRefuseReason,
      refuseLoading,
      refuse,
      confirm,
      confirmLoading,
      CanIEdit,
      is_confirmed,
      is_unity_settlement,
    };
  },
});

export default ProjectConfirmDialog;
