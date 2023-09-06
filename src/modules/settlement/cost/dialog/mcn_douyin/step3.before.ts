import { defineComponent, computed, ref, Ref, inject, h } from '@vue/composition-api';
// import { commonForm } from '@/modules/settlement/cost/dialog/shoplive/utils';
import {
  SetlementCostTypeMap,
  Settlement,
  SettlementAmountInfo,
  SettlementIncomeType,
} from '@/types/tiange/finance/settlement';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { GetSubCostSettlement } from '@/services/finance/settlement';
import { formatAmountWithoutPrefix } from '@/utils/string';
import {
  default_put_company_name,
  pit_fee_detail_url,
  put_detail_url,
} from '@/modules/settlement/component/use/uilts';
import SettlementStep2Layout from '@/modules/settlement/component/step2.cost.layout.vue';
import TopCard from '@/modules/settlement/component/top.card.vue';

export default defineComponent({
  components: {
    SettlementStep2Layout,
    TopCard,
  },
  setup(props, ctx) {
    // const { downloadFileHandler } = commonForm(ctx);

    const feeNameTypes = computed(() => {
      const names: { type: SettlementIncomeType; name: string }[] = [];
      SetlementCostTypeMap.forEach((value, key) => {
        names.push({
          type: key,
          name: value,
        });
      });
      return names;
    });
    const saveLoading = ref(false);
    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);

    const company_info = computed(() => settlement.value?.company_info_json ?? []);

    /**
     * 方法对象
     */
    const methods = {
      prev: async () => {
        ctx.emit('prev');
      },

      next: async () => {
        const result = await AsyncConfirm(ctx, {
          title: '确定生成结算单吗?',
          content: () =>
            h('div', [h('div', '将对本次结算生成对应的结算单'), h('div', '是否需要生成？')]),
          confirmText: '确定',
          cancelText: '取消',
        });
        if (!result) {
          return;
        }
        methods.getSubCostSettlement();
      },

      saveBeforeClose: async () => {
        return false;
      },
      confirmBeforeClose: async () => {
        return false;
      },
      //  发送 生成结算单 请求
      getSubCostSettlement: async () => {
        if (!settlement.value?.id) {
          return;
        }
        saveLoading.value = true;
        const res = await GetSubCostSettlement({ settlement_id: settlement.value?.id });
        saveLoading.value = false;
        if (res.data.success) {
          ctx.root.$message.success(res.data.message ?? '生成结算单成功');
          ctx.emit('submit:success');
        } else {
          ctx.root.$message.error(res.data.message ?? '生成结算单失败');
        }
      },
      amountDetail: (type: SettlementIncomeType, list: SettlementAmountInfo[]) => {
        return list.find(el => el.type === type);
      },
      income_amount: (type: SettlementIncomeType, list: SettlementAmountInfo[]) => {
        return formatAmountWithoutPrefix(methods.amountDetail(type, list)?.amount ?? 0);
      },
      remark: (type: SettlementIncomeType, list: SettlementAmountInfo[]) => {
        return methods.amountDetail(type, list)?.remark;
      },
      onDownloadPutDetail: (type: SettlementIncomeType, list: SettlementAmountInfo[]) => {
        const detail = methods.amountDetail(type, list);
        // if (file) {
        //   downloadFileHandler(file);
        // }
        const ids_str = (detail?.kol_ids ?? []).join(',');
        window.open(
          put_detail_url(
            ids_str,
            settlement.value?.start_date ?? 0,
            settlement.value?.end_date ?? 0,
          ),
        );
      },
      onDownloadPitFeeDetail: (company: { company_id: string }) => {
        window.open(pit_fee_detail_url(settlement.value?.id, company.company_id, 2));
      },
      isYuFengCompany: (company_name: string) => {
        return company_name === default_put_company_name;
      },
      formatAmountWithoutPrefix,
    };

    return {
      company_info,
      feeNameTypes,
      saveLoading,
      settlement,
      ...methods,
    };
  },
});
