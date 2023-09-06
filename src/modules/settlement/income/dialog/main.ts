import { computed, defineComponent, inject, provide, Ref, ref, watch } from '@vue/composition-api';
import { Settlement, SettlementType } from '@/types/tiange/finance/settlement';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import Step1 from './step1.vue';
import Step2MarketingVTask from './marketing/vtask/step2.marketing.vue';
import Step3MarketingVTask from './marketing/vtask/step3.marketing.vue';

import Step2MarketingBefore from './marketing/marketing/step2.before.vue';
import Step3MarketingBefore from './marketing/marketing/step3.before.vue';
import Step2MarketingAfter from './marketing/marketing/step2.after.vue';
import Step3MarketingAfter from './marketing/marketing/step3.after.vue';

import Step2MCN from './mcn/step2.mcn.vue';
import Step3MCN from './mcn/step3.mcn.vue';

import Step2MCNDouyinBefore from './mcn_douyin/step2.before.vue';
import Step3MCNDouyinBefore from './mcn_douyin/step3.before.vue';
import Step2MCNDouyinAfter from './mcn_douyin/step2.after.vue';
import Step3MCNDouyinAfter from './mcn_douyin/step3.after.vue';

import Step2ShopLiveTaobao from './shoplive/step2.taobao.vue';
import Step2ShopLiveDouyin from './shoplive/step2.douyin.vue';
import Step2ShopLiveBeforeDouyin from './shoplive/step2.douyin.before.vue';
import Step3ShopLive from './shoplive/step3.live.vue';
import Step3ShopBeforeLive from './shoplive/step3.live.before.vue';
import Step2MXNTaobaoOtherBefore from './mcn_taobao_other/step2.before.vue';
import Step3MXNTaobaoOtherBefore from './mcn_taobao_other/step3.before.vue';
import Step2MXNTaobaoOtherAfter from './mcn_taobao_other/step2.after.vue';
import Step3MXNTaobaoOtherAfter from './mcn_taobao_other/step3.after.vue';

import { AsyncConfirm } from '@/use/asyncConfirm';
import { BusinessTypeEnum } from '@/types/tiange/common';
import type { CommonBusinessProjectDetail } from '@/types/tiange/commonBusiness/project';
import type { LiveProject } from '@/types/tiange/live.project';
import type { MarketingProjectDetail } from '@/types/tiange/marketing/project';
import { and, or } from '@vueuse/shared';
import { BooleanType } from '@/types/base/advanced';

export interface SettlementDialog {
  /** 设置数据并打开 */
  open: (data?: Settlement, is_estimate?: number) => void;
  /** 重置数据并关闭 */
  close: () => void;
}

export default defineComponent({
  name: 'TgSettlementDialog',
  components: {
    Step1,
    Step2MarketingVTask,
    Step3MarketingVTask,
    Step2MarketingBefore,
    Step3MarketingBefore,
    Step2MarketingAfter,
    Step3MarketingAfter,
    Step2MCN,
    Step3MCN,
    Step2ShopLiveTaobao,
    Step2ShopLiveDouyin,
    Step2ShopLiveBeforeDouyin,
    Step3ShopLive,
    Step3ShopBeforeLive,
    Step2MCNDouyinBefore,
    Step3MCNDouyinBefore,
    Step2MCNDouyinAfter,
    Step3MCNDouyinAfter,
    Step2MXNTaobaoOtherBefore,
    Step3MXNTaobaoOtherBefore,
    Step2MXNTaobaoOtherAfter,
    Step3MXNTaobaoOtherAfter,
  },
  setup(props, ctx) {
    const project =
      inject<Ref<MarketingProjectDetail | LiveProject | CommonBusinessProjectDetail | undefined>>(
        'project3in1',
      ) ?? ref(undefined);

    const {
      project_id,
      isFromMarketing,
      isFromLive,
      isFromLocalLife,
      isFromLiveDouyin,
      isFromCommon,
      isFromSupplyChain,
    } = useProjectBaseInfo();

    const mcn_platform_type = computed(() => {
      if (project.value?.project__type === 'common') {
        return project.value?.platform_type;
      }
      return undefined;
    });

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

    /** 已存在的结算详情, 新建未提交的不存在 */
    const settlement = ref<Settlement | undefined>(undefined);

    provide('settlement', settlement);

    /** 重置数据 */
    const resetData = () => {
      setData();
    };

    /** 新建模式计数器 - 用于变动引发填充数据 */
    const createModeCount = ref(0);

    /** 编辑模式计数器 - 用于变动引发填充数据 */
    const editModeCount = ref(0);

    // 是否暂估
    const is_estimate_mode = ref(0);

    /** 设置数据并打开 */
    const open = (data?: Settlement, is_estimate?: number) => {
      setData(data);
      setDialogVisible(true);
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
    };

    /** 重置数据并关闭 */
    const close = () => {
      if (settlement.value !== undefined) {
        ctx.emit('close');
      }

      resetData();
      setDialogVisible();
    };

    /** 各步骤组件引用 */
    const stepCompRef = ref<{
      /** 关闭前是否需要二次确认 */
      confirmBeforeClose: () => Promise<boolean>;
      /** 关闭前保存(非提交)操作 */
      saveBeforeClose: () => Promise<boolean>;
      /** 填充数据 */
      fillForm?: (data?: Settlement, is_estimate?: number) => void;
    } | null>(null);

    /** 设置数据 */
    const setData = (data?: Settlement) => {
      activeNumber.value = 0;
      if (data === undefined) {
        settlement.value = undefined;
      } else {
        settlement.value = { ...data };
      }
    };

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

    /** 退出前二次确认是否保存 */
    const beforeClose = async (done: (cancel?: boolean) => void) => {
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
    };

    /** 是否拆分前的结算单(目前仅通用MCN存在该情况) */
    const is_virtual_receipt = or(
      and(
        isFromCommon,
        or(
          computed(() => settlement.value === undefined),
          computed(() => settlement.value?.is_tmp === BooleanType.YES),
        ),
      ),
      and(
        isFromLive || isFromLiveDouyin,
        or(
          computed(() => settlement.value === undefined),
          computed(() => settlement.value?.is_tmp === BooleanType.YES),
        ),
      ),
      and(
        isFromLocalLife,
        or(
          computed(() => settlement.value === undefined),
          computed(() => settlement.value?.is_tmp === BooleanType.YES),
        ),
      ),
      and(
        isFromSupplyChain,
        or(
          computed(() => settlement.value === undefined),
          computed(() => settlement.value?.is_tmp === BooleanType.YES),
        ),
      ),
      and(
        isFromMarketing,
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

    // /** 步骤 */
    // const steps = computed(() => {
    //   return [{ title: '基本信息' }, { title: '结算数据' }, { title: '提交' }];
    // });

    /** 当前步骤索引 */
    const activeNumber = ref(0);

    const prev = async (data?: Settlement) => {
      if (data !== undefined) {
        settlement.value = {
          ...data,
        };
      }

      activeNumber.value = Math.max(activeNumber.value - 1, 0);

      ctx.root.$nextTick(() => {
        stepCompRef.value?.fillForm?.(settlement.value);
      });
    };

    const next = async (data?: Settlement) => {
      if (data !== undefined) {
        settlement.value = {
          ...data,
        };
      }

      activeNumber.value = Math.min(activeNumber.value + 1, 2);

      ctx.root.$nextTick(() => {
        stepCompRef.value?.fillForm?.(settlement.value);
      });
    };

    const onSubmitSuccess = (data?: Settlement) => {
      if (
        activeNumber.value === 2 &&
        settlement.value?.is_tmp &&
        (isFromLive.value ||
          isFromLiveDouyin.value ||
          isFromLocalLife.value ||
          isFromSupplyChain) &&
        settlement.value?.business_type !== BusinessTypeEnum.taobao &&
        data
      ) {
        open(data);
      } else {
        close();
      }
    };
    /** 对话框宽度 */
    const dialogWidth = computed(() => {
      return '964px';
    });
    const formComponent = computed(() => {
      if (activeNumber.value === 0) {
        return 'Step1';
      } else if (activeNumber.value === 1) {
        if (isFromMarketing.value) {
          // return settlement.value?.settlement_type === SettlementType.marketing_marketing
          return settlement.value?.is_tmp ? 'Step2MarketingBefore' : 'Step2MarketingAfter';
          // : 'Step2MarketingVTask';
        } else if (
          isFromLive.value ||
          isFromLiveDouyin.value ||
          isFromLocalLife.value ||
          isFromSupplyChain.value
        ) {
          if (settlement.value?.business_type === BusinessTypeEnum.taobao) {
            return 'Step2ShopLiveTaobao';
          } else if (settlement.value?.is_tmp) {
            //抖音、本地生活
            return 'Step2ShopLiveBeforeDouyin';
          } else {
            //抖音、本地生活、淘宝甄选
            return 'Step2ShopLiveDouyin';
          }
        } else if (isFromCommon.value) {
          if (mcn_platform_type.value === 1) {
            if (settlement.value?.is_tmp) {
              return 'Step2MCNDouyinBefore';
              // return 'Step2MCNDouyinAfter';
            } else {
              return 'Step2MCNDouyinAfter';
            }
          } else {
            return settlement.value?.settlement_type === SettlementType.s2b2c_taobao_other
              ? settlement.value.is_tmp
                ? 'Step2MXNTaobaoOtherBefore'
                : 'Step2MXNTaobaoOtherAfter'
              : 'Step2MCN';
          }
          // return 'Step2MCN';
        } else {
          return '';
        }
      } else if (activeNumber.value === 2) {
        if (isFromMarketing.value) {
          // return settlement.value?.settlement_type === SettlementType.marketing_marketing
          return settlement.value?.is_tmp ? 'Step3MarketingBefore' : 'Step3MarketingAfter';
          // : 'Step3MarketingVTask';
        } else if (
          isFromLive.value ||
          isFromLiveDouyin.value ||
          isFromLocalLife.value ||
          isFromSupplyChain.value
        ) {
          return settlement.value?.is_tmp ? 'Step3ShopBeforeLive' : 'Step3ShopLive';
        } else if (isFromCommon.value) {
          if (mcn_platform_type.value === 1) {
            if (settlement.value?.is_tmp) {
              return 'Step3MCNDouyinBefore';
            } else {
              return 'Step3MCNDouyinAfter';
            }
          } else {
            return settlement.value?.settlement_type === SettlementType.s2b2c_taobao_other
              ? settlement.value.is_tmp
                ? 'Step3MXNTaobaoOtherBefore'
                : 'Step3MXNTaobaoOtherAfter'
              : 'Step3MCN';
          }
          // return 'Step3MCN';
        } else {
          return '';
        }
      } else {
        return '';
      }
    });

    return {
      isFromLocalLife,
      isFromLiveDouyin,
      isFromSupplyChain,
      is_virtual_receipt,
      dialogWidth,
      dialogVisible,
      toggleDialogVisible,
      open,
      close,
      beforeClose,
      stepCompRef,
      project_id,
      settlement,
      steps,
      activeNumber,
      formComponent,
      project,
      prev,
      next,
      onSubmitSuccess,
    };
  },
});
