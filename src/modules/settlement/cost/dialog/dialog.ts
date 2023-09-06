/**
 * 财务 - 项目发起成本结算
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-02 15:51:38
 */
import { computed, defineComponent, inject, provide, Ref, ref, watch } from '@vue/composition-api';
import { Settlement, SettlementType } from '@/types/tiange/finance/settlement';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import Step1 from './step1.vue';
import Step2Marketing from './marketing/step2.vue';
import Step3Marketing from './marketing/step3.vue';
import Step2ShopLiveBefore from './shoplive/step2.before.vue';
import Step2DouyinLiveBefore from './live_douyin/step2.before.vue';
import Step3DouyinShopLiveBefore from './live_douyin/step3.before.vue';
import Step3ShopLiveBefore from './shoplive/step3.before.vue';
import Step2ShopLiveAfter from './shoplive/step2.after.vue';
import Step2DouyinShopLiveAfter from './live_douyin/step2.after.vue';
import Step3ShopLiveAfter from './shoplive/step3.after.vue';
import Step3DouyinShopLiveAfter from './live_douyin/step3.after.vue';
import Step2MCNTaoBaoBefore from './mcn_taobao/step2.before.vue';
import Step3MCNTaoBaoBefore from './mcn_taobao/step3.before.vue';
import Step2MCNTaoBaoAfter from './mcn_taobao/step2.after.vue';
import Step3MCNTaoBaoAfter from './mcn_taobao/step3.after.vue';
import Step2MCNVTaskBefore from './mcn_vtask/step2.before.vue';
import Step3MCNVTaskBefore from './mcn_vtask/step3.before.vue';
import Step2MCNVTaskAfter from './mcn_vtask/step2.after.vue';
import Step3MCNVTaskAfter from './mcn_vtask/step3.after.vue';

import Step2DouyinBefore from './mcn_douyin/step2.before.vue';
import Step3DouyinBefore from './mcn_douyin/step3.before.vue';
import Step2DouyinAfter from './mcn_douyin/step2.after.vue';
import Step3DouyinAfter from './mcn_douyin/step3.after.vue';
import Step2S2b2bCost from './s2b2c/esimatedCost.vue'; // esimatedCostStep
import Step2S2b2bCostStep from './s2b2c/esimatedCostStep3.vue';

import Step2MXNTaobaoOtherBefore from './mcn_taobao_other/step2.before.vue';
import Step3MXNTaobaoOtherBefore from './mcn_taobao_other/step3.before.vue';
import Step2MXNTaobaoOtherAfter from './mcn_taobao_other/step2.after.vue';
import Step3MXNTaobaoOtherAfter from './mcn_taobao_other/step3.after.vue';

import { AsyncConfirm } from '@/use/asyncConfirm';
import { and, or } from '@vueuse/core';
import { BooleanType } from '@/types/base/advanced';
import type { MarketingProjectDetail } from '@/types/tiange/marketing/project';
import type { LiveProject } from '@/types/tiange/live.project';
import type { CommonBusinessProjectDetail } from '@/types/tiange/commonBusiness/project';
import { GetSettlementDetail } from '@/services/finance/settlement';
import { BusinessTypeEnum } from '@/types/tiange/common';

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
    Step2Marketing,
    Step3Marketing,
    Step2ShopLiveBefore,
    Step3ShopLiveBefore,
    Step2ShopLiveAfter,
    Step3ShopLiveAfter,
    Step2MCNTaoBaoBefore,
    Step3MCNTaoBaoBefore,
    Step2MCNVTaskBefore,
    Step3MCNVTaskBefore,
    Step2MCNTaoBaoAfter,
    Step3MCNTaoBaoAfter,
    Step2MCNVTaskAfter,
    Step3MCNVTaskAfter,
    Step2DouyinBefore,
    Step3DouyinBefore,
    Step2DouyinAfter,
    Step2S2b2bCost,
    Step2S2b2bCostStep,
    Step3DouyinAfter,
    Step2DouyinLiveBefore,
    Step3DouyinShopLiveBefore,
    Step2DouyinShopLiveAfter,
    Step3DouyinShopLiveAfter,
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

    const { project_type } = useProjectBaseInfo();

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

    const {
      project_id,
      isFromMarketing,
      isFromLive,
      isFromLocalLife,
      isFromLiveDouyin,
      isFromCommon,
      isFromSupplyChain,
    } = useProjectBaseInfo();

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

    /** 设置数据并打开 */
    const open = (data?: Settlement, is_estimate?: number) => {
      isAreaCost = data?.cooperation_type ? data.cooperation_type === 2 : isAreaCost;
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
    const close = (update = false) => {
      ctx.emit('close');
      if (settlement.value !== undefined) {
        if (update) {
          ctx.emit('update', settlement.value);
        }
      }

      resetData();
      setDialogVisible();
    };

    /** 是否暂估 */
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
        } else {
          // * 通知父组件结算单数据已经过期需要强制更新
          ctx.emit('outdated', settlement.value.id);
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
    let isAreaCost = false;
    if (
      isFromLive.value ||
      isFromLiveDouyin.value ||
      isFromLocalLife.value ||
      isFromSupplyChain.value
    ) {
      const newProject = JSON.stringify(inject('project3in1', { cooperation_type: 0 }));
      const jsonProject = JSON.parse(newProject);
      isAreaCost =
        jsonProject.value?.cooperation_type === 2 ||
        inject('cooperation_type', {
          value: 1,
        }).value === 2 ||
        false;
    }
    const dialogClass = computed(() =>
      isFromMarketing.value || isAreaCost
        ? 'settlement-dialog settlement-marketing-cost-dialog'
        : 'settlement-cost-dialog',
    );

    /** 对话框宽度 */
    const dialogWidth = computed(() => {
      if (
        isAreaCost &&
        (isFromLive.value ||
          isFromLiveDouyin.value ||
          isFromLocalLife.value ||
          isFromSupplyChain.value)
      ) {
        //区域淘宝,抖音
        return '942px';
      } else if (isFromMarketing.value) {
        return '942px';
      }
      return '1100px';
    });

    const prev = async (data?: Settlement) => {
      if (data !== undefined) {
        settlement.value = {
          ...data,
        };

        ctx.emit('update', data);
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

        ctx.emit('update', data);
      }

      activeNumber.value = Math.min(activeNumber.value + 1, 2);

      ctx.root.$nextTick(() => {
        stepCompRef.value?.fillForm?.(settlement.value);
      });
    };

    const onSubmitSuccess = async (data?: Settlement) => {
      if (
        activeNumber.value === 2 &&
        settlement.value?.is_tmp &&
        (isFromLive.value ||
          isFromLiveDouyin.value ||
          isFromLocalLife.value ||
          isFromSupplyChain.value) &&
        settlement.value?.business_type !== BusinessTypeEnum.taobao &&
        data
      ) {
        open(data);
      } else {
        if (settlement.value !== undefined) {
          const { data: response } = await GetSettlementDetail(project_type.value, {
            id: settlement.value?.id,
          });
          settlement.value = response.data;
        }
        close(true);
      }
    };
    const formComponent = computed(() => {
      if (activeNumber.value === 0) {
        return 'Step1';
      } else if (activeNumber.value === 1) {
        const _type: any = settlement.value?.json_data?.amount_info_list?.[0]?.type;
        if (
          isAreaCost &&
          (isFromLive.value ||
            isFromLiveDouyin.value ||
            isFromLocalLife.value ||
            isFromSupplyChain.value)
        ) {
          return 'Step2Marketing';
        } else if (isFromMarketing.value) {
          return 'Step2Marketing';
        } else if (
          isFromLive.value ||
          isFromLiveDouyin.value ||
          isFromLocalLife.value ||
          isFromSupplyChain.value
        ) {
          if (settlement.value?.settlement_type === SettlementType.live_taobao) {
            return settlement.value?.is_tmp === BooleanType.NO
              ? 'Step2ShopLiveAfter'
              : 'Step2ShopLiveBefore';
          } else if (
            settlement.value?.settlement_type === SettlementType.live_douyin ||
            settlement.value?.settlement_type === SettlementType.live_taobao_pick ||
            settlement.value?.settlement_type === SettlementType.local_life ||
            settlement.value?.settlement_type === SettlementType.supply_chain
          ) {
            return settlement.value?.is_tmp === BooleanType.NO
              ? 'Step2DouyinShopLiveAfter'
              : 'Step2DouyinLiveBefore';
          }
        } else if (isFromCommon.value) {
          if (settlement.value?.settlement_type === SettlementType.common_mcn_taobao_cps) {
            return settlement.value.is_tmp === BooleanType.NO
              ? 'Step2MCNTaoBaoAfter'
              : 'Step2MCNTaoBaoBefore';
          } else if (settlement.value?.settlement_type === SettlementType.common_mcn_vtask) {
            return settlement.value.is_tmp === BooleanType.NO
              ? 'Step2MCNVTaskAfter'
              : 'Step2MCNVTaskBefore';
          } else if (settlement.value?.settlement_type === SettlementType.common_mcn_douyin_cps) {
            return settlement.value.is_tmp === BooleanType.NO
              ? 'Step2DouyinAfter'
              : 'Step2DouyinBefore';
          } else if (settlement.value?.settlement_type === SettlementType.s2b2c_taobao_other) {
            return settlement.value.is_tmp === BooleanType.NO
              ? 'Step2MXNTaobaoOtherAfter'
              : 'Step2MXNTaobaoOtherBefore';
          } else if (_type === 14) {
            return 'Step2S2b2bCost';
          }
        }
      } else if (activeNumber.value === 2) {
        if (
          isAreaCost &&
          (isFromLive.value ||
            isFromLiveDouyin.value ||
            isFromLocalLife.value ||
            isFromSupplyChain.value)
        ) {
          return 'Step3Marketing';
        } else if (isFromMarketing.value) {
          return 'Step3Marketing';
        } else if (
          isFromLive.value ||
          isFromLiveDouyin.value ||
          isFromLocalLife.value ||
          isFromSupplyChain.value
        ) {
          if (settlement.value?.settlement_type === SettlementType.live_taobao) {
            return settlement.value?.is_tmp === BooleanType.NO
              ? 'Step3ShopLiveAfter'
              : 'Step3ShopLiveBefore';
          } else if (
            settlement.value?.settlement_type === SettlementType.live_douyin ||
            settlement.value?.settlement_type === SettlementType.live_taobao_pick ||
            settlement.value?.settlement_type === SettlementType.local_life ||
            settlement.value?.settlement_type === SettlementType.supply_chain
          ) {
            return settlement.value?.is_tmp === BooleanType.NO
              ? 'Step3DouyinShopLiveAfter'
              : 'Step3DouyinShopLiveBefore';
          }
        } else if (isFromCommon.value) {
          if (settlement.value?.settlement_type === SettlementType.common_mcn_taobao_cps) {
            return settlement.value?.super_settlement_id
              ? 'Step3MCNTaoBaoAfter'
              : 'Step3MCNTaoBaoBefore';
          } else if (settlement.value?.settlement_type === SettlementType.common_mcn_vtask) {
            return settlement.value?.super_settlement_id
              ? 'Step3MCNVTaskAfter'
              : 'Step3MCNVTaskBefore';
          } else if (settlement.value?.settlement_type === SettlementType.common_mcn_douyin_cps) {
            return settlement.value.is_tmp === BooleanType.NO
              ? 'Step3DouyinAfter'
              : 'Step3DouyinBefore';
          } else if (settlement.value?.settlement_type === SettlementType.s2b2c_taobao_other) {
            return settlement.value.is_tmp === BooleanType.NO
              ? 'Step3MXNTaobaoOtherAfter'
              : 'Step3MXNTaobaoOtherBefore';
          } else if (settlement.value?.settlement_type === SettlementType.s2b2c_douyin_cps) {
            return 'Step2S2b2bCostStep';
          }
        }
      }
      return '';
    });

    return {
      isFromSupplyChain,
      isFromLocalLife,
      isFromLiveDouyin,
      setDialogVisible,
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
      dialogClass,
      dialogWidth,
      is_virtual_receipt,
    };
  },
});
