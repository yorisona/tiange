/** 店播 成本结算 step3 */
import { computed, defineComponent, h, inject, Ref, ref, SetupContext } from '@vue/composition-api';
import SettlementStep3Layout from '@/modules/settlement/component/step2.cost.layout.vue';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import {
  CompanyInfo,
  Settlement,
  ShopLiveCostSettlementForm,
} from '@/types/tiange/finance/settlement';
import { downloadFileFromBlob } from '@/utils/func';
import { Decimal2String, formatAmountWithoutPrefix } from '@/utils/string';
import { commonForm } from './utils';
import { GetSubCostSettlement } from '@/services/finance/settlement';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { getToken } from '@/utils/token';
import TopCard from '@/modules/settlement/component/top.card.vue';
import Decimal from 'decimal.js';

export const useForm = (ctx: SetupContext) => {
  /** 下载文件 */
  const downloadAPIFileHandler = (urlString: string, filename: string) => {
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
  };
  return { downloadAPIFileHandler };
};

export default defineComponent({
  name: 'TgShopLiveCostSettlementSubmitForm',
  components: {
    SettlementStep3Layout,
    TgAdjustAccountForm,
    CardLayout,
    TopCard,
  },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const saveLoading = ref(false);
    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);
    const company_data = computed(() => {
      if (settlement.value?.json_data) {
        if (
          settlement.value?.json_data?.company_info_list &&
          settlement.value?.json_data?.company_info_list.length > 0
        ) {
          const company: CompanyInfo = settlement.value?.json_data.company_info_list[0];
          if (company.type) {
            return company.company_list;
          }
          return settlement.value.json_data.company_info_list;
        }
      }
      return [];
    });

    const { downloadAPIFileHandler } = useForm(ctx);
    const { downloadFileHandler } = commonForm(ctx);

    const DataForm = ref<ShopLiveCostSettlementForm>({
      detail_file: '',
      adjust_info: [],
      kol_salary_infos: [],
      settlement_files: [],
    });

    const schedule_file_list = ref<{ name: string; url: string }[]>([]);

    const uploadedFileList = ref<
      { icon: string; type: string; size?: number; name: string; path: string }[]
    >([]);

    /** 下载排班 */
    const getKolScheduleFile = (company_id: string, company_name: string) => {
      const url = `/api/settlement/download_kol_schedule?settlement_id=${
        settlement.value?.id
      }&company_id=${company_id}&Authorization=${getToken()}`;
      downloadKolAPIFile(url, `${company_name}的主播排班明细`);
    };

    const getKolCostFile = (company_id: string, company_name: string) => {
      const url = `/api/settlement/download_company_salary?settlement_id=${
        settlement.value?.id
      }&company_id=${company_id}&Authorization=${getToken()}`;
      downloadKolAPIFile(url, `${company_name}的主播费用清单`);
    };

    /** 下载排班和工资明细 */
    const downloadKolAPIFile = (url: string, filename: string) => {
      downloadAPIFileHandler(url, filename);
    };

    const prev = async () => {
      ctx.emit('prev');
    };

    const next = async () => {
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
      getSubCostSettlement();
    };

    const saveBeforeClose = async () => {
      return false;
    };
    const confirmBeforeClose = async () => {
      return false;
    };

    //  发送 生成结算单 请求
    const getSubCostSettlement = async () => {
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
    };

    const getTagName = (type: string) => {
      const new_type = `${type}`;
      if (new_type === '1') {
        return '抽成服务费';
      } else if (new_type === '2') {
        return '固定服务费';
      }
      return '';
    };

    const cost_desc = (company: CompanyInfo) => {
      let desc = `主播服务费 ${company.zbfwf || ''} 元，机构服务费 ${company.fwf || '0'} 元`;
      if (company.fwfsqfs === '1') {
        desc = `${desc}(${company.fwfbfb || '0'}%)`;
      }
      return desc;
    };

    return {
      company_data,
      getKolScheduleFile,
      getKolCostFile,
      downloadKolAPIFile,
      settlement,
      DataForm,
      saveLoading,
      schedule_file_list,
      uploadedFileList,
      formatAmountWithoutPrefix,
      downloadFileHandler,
      prev,
      next,
      getTagName,
      cost_desc,
      saveBeforeClose,
      confirmBeforeClose,
      Decimal2String,
      Decimal,
    };
  },
});
