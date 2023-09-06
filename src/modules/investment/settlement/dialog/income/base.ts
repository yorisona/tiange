/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-01-21 09:58:39
 */
import { computed, defineComponent, provide, ref, watch } from '@vue/composition-api';
import type { Settlement } from '@/types/tiange/finance/settlement';
import Step1 from './step1.vue';
import Step2 from './step2.vue';
import Step3 from './step3.vue';
import { AsyncConfirm } from '@/use/asyncConfirm';

import { and, or } from '@vueuse/shared';
import { BooleanType } from '@/types/base/advanced';
import { Merchants } from '@/types/tiange/investment';

export interface SettlementDialogType {
  /** 设置数据并打开 */
  open: (data?: Settlement, merchant_goods?: Merchants, is_estimate?: number) => void;
  /** 重置数据并关闭 */
  close: () => void;
}

export default defineComponent({
  name: 'TgInvestmentSettlementDialog',
  components: {
    Step1,
    Step2,
    Step3,
  },
  setup(props, ctx) {
    /** 对话框是否可见 */
    const dialogVisible = ref(false);

    /** 已存在的结算详情, 新建未提交的不存在 */
    const settlement = ref<Settlement | undefined>(undefined);
    const merchantGoods = ref<Merchants | undefined>(undefined);

    provide('settlement', settlement);
    provide('merchant_goods', merchantGoods);

    /** 新建模式计数器 - 用于变动引发填充数据 */
    const createModeCount = ref(0);

    /** 编辑模式计数器 - 用于变动引发填充数据 */
    const editModeCount = ref(0);

    // 是否暂估
    const is_estimate_mode = ref(0);

    /** 各步骤组件引用 */
    const stepCompRef = ref<{
      /** 关闭前是否需要二次确认 */
      confirmBeforeClose: () => Promise<boolean>;
      /** 关闭前保存(非提交)操作 */
      saveBeforeClose: () => Promise<boolean>;
      /** 填充数据 */
      fillForm?: (data?: Settlement, is_estimate?: number) => void;
    } | null>(null);

    watch(
      () => createModeCount.value,
      (next, prev) => {
        if (next !== prev) {
          ctx.root.$nextTick(() => {
            stepCompRef.value?.fillForm?.(settlement.value, is_estimate_mode.value);
          });
        }
      },
    );

    watch(
      () => editModeCount.value,
      (next, prev) => {
        if (next !== prev) {
          ctx.root.$nextTick(() => {
            stepCompRef.value?.fillForm?.(settlement.value);
          });
        }
      },
    );

    /** 是否拆分前的结算单 */
    const is_virtual_receipt = or(
      and(
        or(
          computed(() => settlement.value === undefined),
          computed(() => settlement.value?.is_tmp === BooleanType.YES),
        ),
      ),
    );

    /** 步骤 */
    const steps = computed(() => {
      return [
        { title: '基本信息' },
        { title: '结算数据' },
        is_virtual_receipt.value ? { title: '生成结算单' } : { title: '提交' },
      ];
    });

    /** 当前步骤索引 */
    const activeNumber = ref(0);

    /** 对话框宽度 */
    const dialogWidth = computed(() => {
      return '942px';
      // }
    });
    const formComponent = computed(() => {
      if (activeNumber.value === 0) {
        return 'Step1';
      } else if (activeNumber.value === 1) {
        return 'Step2';
      } else if (activeNumber.value === 2) {
        return 'Step3';
      } else {
        return '';
      }
    });

    const methods = {
      /** 设置对话框是否可见 */
      setDialogVisible: (visible = false) => {
        dialogVisible.value = visible;
        if (!visible) {
          // 关闭弹框时重置子组件
          setTimeout(() => {
            activeNumber.value = -1;
          }, 300);
        }
      },
      /** 切换对话框是否可见 */
      toggleDialogVisible: () => {
        methods.setDialogVisible(!dialogVisible.value);
      },
      /** 重置数据 */
      resetData: () => {
        methods.setData();
      },
      /** 设置数据 */
      setData: (data?: Settlement) => {
        activeNumber.value = 0;
        if (data === undefined) {
          settlement.value = undefined;
        } else {
          settlement.value = { ...data };
        }
      },
      /** 设置数据并打开 */
      open: (data?: Settlement, merchant_goods?: Merchants, is_estimate?: number) => {
        merchantGoods.value = merchant_goods;
        methods.setData(data);
        methods.setDialogVisible(true);
        is_estimate_mode.value = is_estimate === 1 ? 1 : 0;

        ctx.root.$nextTick(() => {
          if (data === undefined) {
            activeNumber.value = 0;
            createModeCount.value++;
          } else {
            activeNumber.value = data.step;
            editModeCount.value++;
          }
        });
      },
      /** 重置数据并关闭 */
      close: () => {
        ctx.emit('close');
        methods.resetData();
        methods.setDialogVisible();
      },
      /** 退出前二次确认是否保存 */
      beforeClose: async (done: (cancel?: boolean) => void) => {
        if (settlement.value === undefined) {
          done();
          return;
        }

        const needConfirm = await stepCompRef.value?.confirmBeforeClose();
        if (needConfirm === false) {
          done();
          return;
        }

        const result = await AsyncConfirm(ctx, {
          title: '退出前需要保存吗？',
          content: '选择不保存将丢失当前的改动',
          confirmText: '保存并退出',
          cancelText: '不保存，直接退出',
        });
        if (result) {
          const saveResult = await stepCompRef.value?.saveBeforeClose();

          if (!saveResult) {
            return;
          }
        }
        done();
      },
      prev: async (data?: Settlement) => {
        if (data !== undefined) {
          settlement.value = {
            ...data,
          };
        }

        activeNumber.value = Math.max(activeNumber.value - 1, 0);

        ctx.root.$nextTick(() => {
          stepCompRef.value?.fillForm?.(settlement.value);
        });
      },

      next: async (data?: Settlement) => {
        if (data !== undefined) {
          settlement.value = {
            ...data,
          };
        }

        activeNumber.value = Math.min(activeNumber.value + 1, 2);

        ctx.root.$nextTick(() => {
          stepCompRef.value?.fillForm?.(settlement.value);
        });
      },

      onSubmitSuccess: () => {
        methods.close();
      },
    };

    return {
      is_virtual_receipt,
      dialogWidth,
      dialogVisible,
      stepCompRef,
      settlement,
      merchantGoods,
      steps,
      activeNumber,
      formComponent,
      ...methods,
    };
  },
});
