/*
 * @Brief: 抖系收入结算 - 第三步 - 拆分前
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-11-24 13:09:26
 */

import {
  SetlementIncomeTypeMap,
  Settlement,
  SettlementAmountInfo,
  SettlementIncomeType,
} from '@/types/tiange/finance/settlement';
import { defineComponent, ref, Ref, inject, h, computed } from '@vue/composition-api';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import SettlementStep3Layout from '@/modules/settlement/component/step2.layout';
import TopCard from '@/modules/settlement/component/top.card.vue';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { GetSubIncomeSettlement } from '@/services/finance/settlement';
import { formatAmountWithoutPrefix } from '@/utils/string';
import { commonForm } from '../../../cost/dialog/shoplive/utils';
// import { commonForm } from '../../cost/dialog/shoplive/utils';
import { pit_fee_detail_url } from '../../../component/use/uilts';

export default defineComponent({
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TopCard,
    CardLayout,
    SettlementStep3Layout,
  },
  setup(props, ctx) {
    const { downloadFileHandler } = commonForm(ctx);

    const incomeNameTypes = computed(() => {
      const names: { type: SettlementIncomeType; name: string }[] = [];
      SetlementIncomeTypeMap.forEach((value, key) => {
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
        const res = await GetSubIncomeSettlement({ settlement_id: settlement.value?.id });
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
      onDownloadDetail: (type: SettlementIncomeType, list: SettlementAmountInfo[]) => {
        const file = methods.amountDetail(type, list)?.file;
        if (file) {
          downloadFileHandler(file);
        }
      },
      onDownloadPitFeeDetail: (company: { company_id: string }) => {
        window.open(pit_fee_detail_url(settlement.value?.id, company.company_id));
      },
      formatAmountWithoutPrefix,
    };

    return {
      company_info,
      incomeNameTypes,
      saveLoading,
      settlement,
      ...methods,
    };
  },
});
