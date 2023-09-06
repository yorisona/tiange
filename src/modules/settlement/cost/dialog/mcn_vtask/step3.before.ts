/*
 * @Brief: v任务- 第三步 - 生成结算单之前
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-06-03 09:40:49
 */
import { defineComponent, ref, Ref, h, inject } from '@vue/composition-api';
import { formatAmount } from '@/utils/string';
import { AdjustInfo, Settlement, CompanyInfo } from '@/types/tiange/finance/settlement';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import SettlementStep2Layout from '@/modules/settlement/component/step2.cost.layout.vue';
import { getToken } from '@/utils/token';
import { downloadFileFromBlob } from '@/utils/func';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { GetSubCostSettlement } from '@/services/finance/settlement';
import Decimal from 'decimal.js';
import TopCard from '@/modules/settlement/component/top.card.vue';

export default defineComponent({
  name: 'Step3MCNVTaskBefore',
  components: {
    CardLayout,
    SettlementStep2Layout,
    TgAdjustAccountForm,
    TopCard,
  },
  setup(props, ctx) {
    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);

    const saveLoading = ref<boolean>(false);
    /**
     * 方法对象
     */
    const methods = {
      //  上一步
      prev: () => {
        ctx.emit('prev');
      },
      //  下一步
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
      confirmBeforeClose: async () => {
        // return methods.isModified();
        return false;
      },
      saveBeforeClose: () => {
        return false;
      },
      fillForm: () => {
        // console.log(data);
      },
      adjustInfo: (company_name: string) => {
        return (
          settlement.value?.adjust_info.filter(
            (item: AdjustInfo) => item.company_name === company_name,
          ) ?? []
        );
      },
      //  结算金额
      settlementAmount: (company: CompanyInfo) => {
        let amount = new Decimal(company.zccb);
        const adjustInfo = methods.adjustInfo(company.company_name);
        adjustInfo.forEach((item: AdjustInfo) => {
          amount = new Decimal(item.adjust_amount).add(amount);
        });
        return amount.toFixed(2);
      },
      formatAmount: (amount: string | number) => {
        return formatAmount(amount, 'None');
      },
      //  主播数据下载地址
      kolDataUrl: (company: CompanyInfo) => {
        return `/api/settlement/download_settlement_kol_data?settlement_id=${
          settlement.value?.id
        }&company_name=${company.company_name}&Authorization=${getToken()}`;
      },
      //  下传文件
      downloadAPIFileHandler: (urlString: string, filename: string) => {
        fetch(urlString).then(async response => {
          const result = response.clone();
          try {
            const data = await result.json();
            ctx.root.$message.error(data.message);
          } catch {
            if (response.status === 200) {
              const data = await response.blob();
              downloadFileFromBlob(data, filename);
            } else {
              ctx.root.$message.error('下载失败');
            }
          }
        });
      },
      //  下载达人数据
      downKolDataFile: (company: CompanyInfo) => {
        methods.downloadAPIFileHandler(
          methods.kolDataUrl(company),
          `${company.company_name}的达人详情.xlsx`,
        );
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
          ctx.root.$message.success((await res).data.message ?? '生成结算单成功');
          ctx.emit('submit:success');
        } else {
          ctx.root.$message.error((await res).data.message ?? '生成结算单失败');
        }
      },
    };
    return {
      saveLoading,
      settlement,
      ...methods,
    };
  },
});
