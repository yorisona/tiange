/*
 * @Brief: 淘宝cps - 第三步 - 生成结算单之前
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-06-03 09:40:49
 */
import { defineComponent, ref, h, inject, Ref } from '@vue/composition-api';
import { formatAmount } from '@/utils/string';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import SettlementStep2Layout from '@/modules/settlement/component/step2.cost.layout.vue';
import { getToken } from '@/utils/token';
import { downloadFileFromBlob } from '@/utils/func';
import { Settlement, AdjustInfo } from '@/types/tiange/finance/settlement';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { GetSubCostSettlement } from '@/services/finance/settlement';
import TopCard from '@/modules/settlement/component/top.card.vue';
import utils from '@/utils';

const fileTypeIconMap = new Map([
  ['image/jpeg', 'picture'],
  ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'excel'],
  ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'word'],
  ['application/msword', 'word'],
  ['application/pdf', 'pdf'],
  ['xlsx', 'excel'],
  ['docx', 'word'],
  ['doc', 'word'],
  ['pdf', 'pdf'],
  ['jpeg', 'picture'],
]);

export default defineComponent({
  name: 'Step3MCNTaoBaoBefore',
  components: {
    CardLayout,
    SettlementStep2Layout,
    TgAdjustAccountForm,
    TopCard,
  },
  setup(props, ctx) {
    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);

    const saveLoading = ref<boolean>(false);

    const methods = {
      prev: () => {
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
      confirmBeforeClose: async () => {
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
      formatAmount: (amount: string | number) => {
        return formatAmount(amount, 'None');
      },
      getFileName: (fileUrl: string) => {
        if (fileUrl && fileUrl.length) {
          const urlArr = fileUrl.split('/');
          return urlArr[urlArr.length - 1] ?? '--';
        }
        return '--';
      },
      getFileIcon: (fileUrl: string) => {
        const fileSpliceList = fileUrl.split('.');
        const filename_suffix = fileSpliceList[fileSpliceList.length - 1];
        const fileType = fileTypeIconMap.get(filename_suffix) ?? 'picture';
        return `ico-${fileType}`;
      },
      downloadFile: (url: string) => {
        const requestOptions = {
          headers: {
            Authorization: getToken() ?? '',
          },
        };
        fetch(url, requestOptions).then(async response => {
          const result = response.clone();
          try {
            const data = await result.json();
            ctx.root.$message.error(data.message);
          } catch {
            if (response.status === 200) {
              const data = await response.blob();
              const filename = decodeURIComponent(url.split('/')[url.split('/').length - 1]);
              downloadFileFromBlob(data, filename);
            } else {
              ctx.root.$message.error('下载失败');
            }
          }
        });
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
    const basename = (item: string) => {
      return utils.basename(item);
    };
    return {
      basename,
      settlement,
      saveLoading,
      ...methods,
    };
  },
});
