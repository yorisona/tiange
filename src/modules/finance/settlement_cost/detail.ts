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
// import { AsyncConfirm } from '@/use/asyncConfirm';
import {
  ApproveCostSettlement,
  QueryAccountPeriod,
  RefuseCostSettlement,
} from '@/services/finance';
import { wait } from '@/utils/func';
import { and, set, whenever } from '@vueuse/core';
import DataMarketing from '@/modules/settlement/cost/dialog/marketing/step3.vue';
import DataLive from '@/modules/settlement/cost/dialog/shoplive/step3.after.vue';
import DataDoyinLive from '@/modules/settlement/cost/dialog/live_douyin/step3.after.vue';
import DataMCNTaobao from '@/modules/settlement/cost/dialog/mcn_taobao/step3.after.vue';
import DataMCNDouyin from '@/modules/settlement/cost/dialog/mcn_douyin/step3.after.vue';
import DataMCNVtask from '@/modules/settlement/cost/dialog/mcn_vtask/step3.after.vue';
import RefuseDialog from '@/modules/finance/settlement_cost/refuse.dialog.vue';
import Step2S2b2bCostStep from '@/modules/settlement/cost/dialog/s2b2c/esimatedCostStep3.vue';
import McnTaobaoOther from '@/modules/settlement/cost/dialog/mcn_taobao_other/step3.after.vue';
import { usePermission } from '@/use/permission';
import billPeriod from '@/modules/finance/settlement_income/components/billPeriod/index.vue';
import moment from 'moment';
import { AsyncConfirm } from '@/use/asyncConfirm';

/** 结算明细对话框引用 */
export interface SettlementDetailDialogRef {
  open: (data: Settlement) => void;
}

const SettlementDetailDialog = defineComponent({
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    DataMarketing,
    DataLive,
    DataDoyinLive,
    DataMCNTaobao,
    DataMCNDouyin,
    DataMCNVtask,
    Step2S2b2bCostStep,
    RefuseDialog,
    billPeriod,
    McnTaobaoOther,
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
      queryAccountPeriod();
      settlement.value = data;
      isareashow.value = false;
      const { settlement_type, cooperation_type } = data;
      if (
        SettlementType.marketing_vtask === settlement_type ||
        SettlementType.marketing_marketing === settlement_type
      ) {
        set(data_component, 'DataMarketing');
      } else if (
        SettlementType.live_douyin === settlement_type ||
        SettlementType.live_taobao === settlement_type ||
        SettlementType.live_taobao_pick === settlement_type ||
        SettlementType.local_life === settlement_type ||
        SettlementType.supply_chain === settlement_type
      ) {
        if (cooperation_type === 2) {
          isareashow.value = true;
          set(data_component, 'DataMarketing');
        } else {
          isareashow.value = false;
          if (
            SettlementType.live_douyin === settlement_type ||
            settlement_type === SettlementType.live_taobao_pick ||
            settlement_type === SettlementType.local_life ||
            settlement_type === SettlementType.supply_chain
          ) {
            set(data_component, 'DataDoyinLive');
          } else {
            set(data_component, 'DataLive');
          }
        }
      } else if (SettlementType.common_mcn_taobao_cps === settlement_type) {
        set(data_component, 'DataMCNTaobao');
      } else if (SettlementType.common_mcn_vtask === settlement_type) {
        set(data_component, 'DataMCNVtask');
      } else if (SettlementType.common_mcn_douyin_cps === settlement_type) {
        set(data_component, 'DataMCNDouyin');
      } else if (SettlementType.s2b2c_taobao_other === settlement_type) {
        set(data_component, 'McnTaobaoOther');
      } else {
        set(data_component, 'Step2S2b2bCostStep');
      }
      set(shouldFillForm, true);
      accountDate.value = undefined;
      setDialogVisible(true);
    };

    whenever(and(shouldFillForm, stepCompRef.value !== undefined), () => {
      nextTick(() => {
        if (settlement.value !== undefined) {
          stepCompRef.value?.fillForm(settlement.value);
        }
      });
    });

    /** 重置数据并关闭 */
    const close = () => {
      set(shouldFillForm, false);

      ctx.emit('close');
      setDialogVisible();
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
        RefuseCostSettlement({
          id: settlement.value.id,
          refuse_reason: reason,
        }),
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
      if (!accountDate.value) {
        ctx.root.$message.error('请选择账期');
        return;
      }
      const result = await AsyncConfirm(ctx, '确定通过这条结算吗？');
      if (!result) {
        return;
      }

      confirmLoading.value = true;
      const [{ data: response }] = await wait(
        500,
        ApproveCostSettlement(settlement.value.id, {
          account_detail_date: accountDate.value,
        }),
      );
      confirmLoading.value = false;

      if (response.success) {
        ctx.root.$message.success(response.message ?? '确认结算成功');
        ctx.emit('success:confirm', settlement.value.id);
        close();
      } else {
        ctx.root.$message.error(response.message ?? '确认结算失败');
      }
    };

    const CanIEdit = computed(() => usePermission().settlement_cost_update);
    const is_unity_settlement = computed(
      () => settlement.value?.settlement_type === 5 && settlement.value?.unity_settlement_id,
    );
    const accountDate = ref<string | undefined>(undefined);
    const disabledMonth = ref<number[] | undefined>(undefined);
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

    const pickerOptions = {
      disabledDate(time: any) {
        const minMoment = moment('2021-01');
        const maxMoment = moment();
        const date = moment(time);
        if (date.isBefore(minMoment, 'month') || date.isAfter(maxMoment, 'month')) {
          return true;
        }
        return disabledMonth.value?.find(el => {
          if (el) {
            return moment(el * 1000).isSame(date, 'month');
          }
        });
      },
    };

    const accountFieldClass = computed(() => {
      if (!settlement.value) {
        return '';
      }
      const { settlement_type, cooperation_type } = settlement.value;
      switch (settlement_type) {
        case SettlementType.live_taobao:
          return cooperation_type === 2 ? 'marketing-marketing' : 'live-taobao';
        case SettlementType.live_douyin:
        case SettlementType.live_taobao_pick:
        case SettlementType.local_life:
        case SettlementType.supply_chain:
          return cooperation_type === 2 ? 'marketing-marketing' : 'live-douyin';
        case SettlementType.marketing_marketing:
          return 'marketing-marketing';
        case SettlementType.common_mcn_taobao_cps:
          return 'common-mcn-taobao-cps';
        case SettlementType.common_mcn_douyin_cps:
          return 'common-mcn-douyin-cps';
        case SettlementType.common_mcn_vtask:
          return 'common-mcn-vtask';
        case SettlementType.marketing_vtask:
          return 'marketing-vtask';
        case SettlementType.s2b2c_douyin_cps:
          return 's2b2c-douyin-cps';
        case SettlementType.s2b2c_taobao_other:
          return 's2b2c-taobao-other';
        default:
          return '';
      }
    });

    return {
      dialogVisible,
      toggleDialogVisible,
      is_unity_settlement,
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
      accountDate,
      pickerOptions,
      accountFieldClass,
    };
  },
});

export default SettlementDetailDialog;
