/** 店播 成本结算 step3 */
import { computed, defineComponent, h, inject, Ref, ref, SetupContext } from '@vue/composition-api';
import SettlementStep3Layout from '@/modules/settlement/component/step2.cost.layout.vue';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import {
  CompanyInfo,
  Settlement,
  SettlementIncomeType,
  SettlementAmountInfo,
  SetlementLiveCostTypeMap,
} from '@/types/tiange/finance/settlement';
import { downloadFileFromBlob } from '@/utils/func';
import { Decimal2String, formatAmountWithoutPrefix } from '@/utils/string';
import { commonForm } from '../shoplive/utils';
import { GetSubCostSettlement } from '@/services/finance/settlement';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { getToken } from '@/utils/token';
import TopCard from '@/modules/settlement/component/top.card.vue';
import Decimal from 'decimal.js';
import {
  pit_fee_detail_url,
  default_put_company_name,
  put_yf_detail_url,
} from '@/modules/settlement/component/use/uilts';
import { useRouter } from '@/use/vue-router';

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
      if (settlement.value?.json_data && settlement.value?.json_data.company_info_list.length > 0) {
        const company: CompanyInfo = settlement.value?.json_data.company_info_list[0];
        const arr: any = [];
        if (company.type) {
          settlement.value?.json_data.company_info_list.map((item: any) => {
            if (item.company_list) {
              item.company_list.map((subItem: any) => {
                subItem.type = item.type;
                arr.push(subItem);
              });
            }
          });
          return arr;
        } else {
          const arr: any = [];
          settlement.value?.json_data.company_info_list.map((item: any) => {
            const subItem: any = JSON.parse(JSON.stringify(item));
            subItem.type = 9;
            arr.push(subItem);
          });
          return arr;
        }
        return [];
      }
      return [];
    });
    const adjust_data = computed(() => {
      if (settlement.value?.adjust_info) {
        return settlement.value.adjust_info;
      }
      return [];
    });
    //有数据
    const company_list = computed(() => {
      if (settlement.value?.json_data && settlement.value?.json_data.company_info_list.length > 0) {
        const company: CompanyInfo = settlement.value?.json_data.company_info_list[0];
        const arr: any = [];
        if (company.type) {
          settlement.value?.json_data.company_info_list.map((item: any) => {
            if (item.company_list) {
              item.company_list.map((subItem: any) => {
                const name: any = arr.find((one: any) => one === subItem.company_name);
                if (!name) {
                  arr.push(subItem.company_name);
                }
              });
            }
          });
          return arr;
        } else {
          const arr: any = [];
          settlement.value?.json_data.company_info_list.map((item: any) => {
            const name: any = arr.find((one: any) => one === item.company_name);
            if (!name) {
              arr.push(item.company_name);
            }
          });
          return arr;
        }
        return [];
      }
      return [];
    });
    const { downloadAPIFileHandler } = useForm(ctx);
    const { downloadFileHandler } = commonForm(ctx);

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
        ctx.emit('submit:success', res.data.data);
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
      let desc = `主播服务费 ${company.zbfwf} 元，机构服务费 ${company.fwf || '0'} 元`;
      if (company.fwfsqfs === '1') {
        desc = `${desc}(${company.fwfbfb || '0'}%)`;
      }
      return desc;
    };
    const feeNameTypes = computed(() => {
      const names: { type: SettlementIncomeType; name: string }[] = [];
      SetlementLiveCostTypeMap.forEach((value, key) => {
        names.push({
          type: key,
          name: value,
        });
      });
      return names;
    });
    const amountDetail = (type: SettlementIncomeType, list: any[]) => {
      return list.find(el => el.type === type);
    };
    const income_amount = (type: SettlementIncomeType, list: any[]) => {
      return formatAmountWithoutPrefix(amountDetail(type, list).income_amount ?? 0);
    };
    const onDownloadPutDetail = () => {
      const router = useRouter();
      const project_id: any = router.currentRoute.params.id;
      window.open(
        put_yf_detail_url(
          project_id,
          settlement.value?.start_date ?? 0,
          settlement.value?.end_date ?? 0,
        ),
      );
    };
    const onDownloadPitFeeDetail = (company: { company_id: string }) => {
      window.open(pit_fee_detail_url(settlement.value?.id, company.company_id, 2));
    };
    const isYuFengCompany = (company_name: string) => {
      return company_name === default_put_company_name;
    };
    const remark = (type: SettlementIncomeType, list: SettlementAmountInfo[]) => {
      return amountDetail(type, list)?.remark;
    };
    const getDetailByCompany = (name_str: any) => {
      return company_data.value.filter((el: any) => el.company_name === name_str);
    };
    const getAdjustByCompany = (name_str: any) => {
      return adjust_data.value.filter((el: any) => el.company_name === name_str);
    };
    const getAdjustAmountByCompany = (name_str: any) => {
      const adjust: any = adjust_data.value.filter((el: any) => el.company_name === name_str);
      let amount: any = 0;
      adjust.map((item: any) => {
        let adjust_amount = item.adjust_amount ? item.adjust_amount : '0';
        adjust_amount = isNaN(Number(adjust_amount)) ? '0' : adjust_amount;
        amount = Number(new Decimal(adjust_amount).add(amount));
      });
      return amount;
    };
    return {
      getAdjustAmountByCompany,
      getAdjustByCompany,
      getDetailByCompany,
      adjust_data,
      company_list,
      company_data,
      remark,
      feeNameTypes,
      onDownloadPutDetail,
      isYuFengCompany,
      onDownloadPitFeeDetail,
      amountDetail,
      income_amount,
      getKolScheduleFile,
      getKolCostFile,
      downloadKolAPIFile,
      settlement,
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
