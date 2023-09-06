/*
 * @Brief: 淘宝cps - 第二步 - 生成结算单之前
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-06-03 09:40:49
 */
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  Ref,
  inject,
  nextTick,
} from '@vue/composition-api';
import { formatAmount } from '@/utils/string';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import SettlementStep2Layout from '@/modules/settlement/component/step2.cost.layout.vue';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import {
  AdjustInfo,
  SettlementCostMcnDataForm,
  Settlement,
  SettlementCostMcnTaobaoBeforeSaveParams,
  SettlementStep,
  SettlementDetailQueryParams,
  CompanyInfo,
  SettlementOneStepOperationEnum,
} from '@/types/tiange/finance/settlement';
import { getToken } from '@/utils/token';
import { HttpRequestOptions } from 'element-ui/types/upload';
import {
  SaveSettlementCostStep2MCNTaobaoBefore,
  UploadKolCompanyFile,
  GetSettlementDetail,
  ReloadKolCompanyRelationship,
} from '@/services/finance/settlement';
import Decimal from 'decimal.js';
import { deepClone } from '@/utils/tools';
import { downloadFileFromBlob } from '@/utils/func';
import TopCard from '@/modules/settlement/component/top.card.vue';

export default defineComponent({
  name: 'Step2MCNTaoBaoBefore',
  components: {
    CardLayout,
    SettlementStep2Layout,
    TgAdjustAccountForm,
    TopCard,
  },
  setup(props, ctx) {
    const loading = ref<boolean>(false);
    const loadingText = ref<string>('');

    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);

    const cloneSettlement = computed(() => {
      const newSettlement = deepClone(settlement.value) as Settlement;
      return newSettlement;
    });

    const dataForm = ref<SettlementCostMcnDataForm>({
      adjustInfo: cloneSettlement.value?.adjust_info ? cloneSettlement.value?.adjust_info : [],

      companyData: cloneSettlement.value?.json_data ?? {
        company_info_list: [],
        nofind: [],
        no_approved: [],
      },
    });

    const originDataForm = ref<SettlementCostMcnDataForm>(
      deepClone(dataForm.value) as SettlementCostMcnDataForm,
    );

    const total_settlement_amount = computed(() => {
      let totalAmount: Decimal = new Decimal(0);
      dataForm.value.adjustInfo?.forEach(item => {
        let adjust_amount = item.adjust_amount ? item.adjust_amount : 0;
        adjust_amount = isNaN(Number(adjust_amount)) ? 0 : adjust_amount;
        totalAmount = new Decimal(adjust_amount).add(totalAmount);
      });
      dataForm.value.companyData?.company_info_list.forEach(item => {
        let zccb = item.zccb ? item.zccb : 0;
        zccb = isNaN(Number(zccb)) ? 0 : zccb;
        totalAmount = new Decimal(zccb).add(totalAmount);
      });
      return totalAmount.toFixed(2);
    });

    const kolCompanyMapUrl = computed(() => {
      return `/api/settlement/download_kol_company_file?kol_type=1&Authorization=${getToken()}`;
    });
    const companyOptions = computed(() => {
      return (
        dataForm.value.companyData?.company_info_list.map(item => {
          return {
            id: item.company_id,
            name: item.company_name,
          };
        }) ?? []
      );
    });

    const ShowAdjustInfo = ref(false);
    /**
     * 方法对象
     */
    const methods = {
      prev: () => {
        if (methods.isModified()) {
          methods.saveSettlementRequest(SettlementOneStepOperationEnum.prev);
        } else {
          ctx.emit('prev');
        }
      },
      next: () => {
        methods.saveSettlementRequest(SettlementOneStepOperationEnum.next);
      },
      //  设置加载状态和加载文案
      setLoadingAndText: (type: 'save' | 'upload' | 'detail' | 'reload' | 'none') => {
        switch (type) {
          case 'save':
            loading.value = true;
            loadingText.value = '正在保存，请稍候...';
            break;
          case 'upload':
            loading.value = true;
            loadingText.value = '正在上传，请稍候...';
            break;
          case 'detail':
            loading.value = true;
            loadingText.value = '正在获取详情，请稍候...';
            break;
          case 'reload':
            loading.value = true;
            loadingText.value = '正在刷新，请稍候...';
            break;
          case 'none':
            loading.value = false;
            loadingText.value = '';
            break;
        }
      },
      //  校验保存数据，返回true，校验成功；否则校验失败
      checkDataForSave: () => {
        if (!methods.checkIncomeFile()) {
          return false;
        }
        if (!cloneSettlement.value?.id) {
          return false;
        }
        if ((dataForm.value.companyData?.nofind ?? []).length) {
          ctx.root.$message.warning(
            `有${
              dataForm.value.companyData?.nofind?.length ?? 0
            }名主播没有对应机构，点击“查看明细”可以查看没有对应关系的主播列表`,
          );
          return false;
        }
        if ((dataForm.value.companyData?.no_approved ?? []).length) {
          ctx.root.$message.warning(
            `有${dataForm.value.companyData?.no_approved?.length ?? 0}名达人信息未通过审核无法结算`,
          );
          return false;
        }
        if (dataForm.value.adjustInfo?.find(item => isNaN(Number(item.adjust_amount)))) {
          ctx.root.$message.warning('请输入正确的调整金额');
          return false;
        }

        if (
          dataForm.value.adjustInfo?.find(
            item => Number(item.adjust_amount) === 0 && item.adjust_amount,
          )
        ) {
          ctx.root.$message.warning('调整金额不能为0');
          return false;
        }
        if (
          dataForm.value.adjustInfo?.find(
            item =>
              (item.adjust_amount || item.adjust_reason || item.company_name) &&
              (!item.adjust_amount || !item.adjust_reason || !item.company_name),
          )
        ) {
          ctx.root.$message.warning('请完善手工调账信息');
          return false;
        }
        if (Number(total_settlement_amount.value) <= 0) {
          ctx.root.$message.warning('总结算金额不能小于等于0');
          return false;
        }
        if (!methods.isModified()) {
          ctx.emit('next');
          return false;
        }
        return true;
      },
      //  提测比例输入
      commissionInput: (value: string, index: number) => {
        const newVal = methods.getPositiveRateNumber(value);
        const cost = dataForm.value.companyData?.company_info_list[index];
        if (cost) {
          cost.tcbl = newVal;
          cost.zccb = new Decimal(newVal ? newVal : 0)
            .mul(new Decimal(cost.yssr ? cost.yssr : 0))
            .div(new Decimal(100))
            .toFixed(2);
        }
      },
      //  检查收入文件
      checkIncomeFile: () => {
        if (!cloneSettlement.value?.income_file) {
          ctx.root.$message.warning('请先在收入结算中上传原始收入文件');
          return false;
        }
        return true;
      },
      //  主播数据下载地址
      kolDataUrl: (company: CompanyInfo) => {
        return `/api/settlement/download_settlement_kol_data?settlement_id=${
          cloneSettlement.value?.id
        }&company_name=${company.company_name}&Authorization=${getToken()}`;
      },
      isModified: () => {
        const originData = JSON.stringify(originDataForm.value);
        const newData = JSON.stringify(dataForm.value);
        if (originData !== newData) {
          return true;
        } else {
          return false;
        }
      },
      confirmBeforeClose: async () => {
        return methods.isModified();
      },
      saveBeforeClose: () => {
        return methods.saveSettlementRequest(SettlementOneStepOperationEnum.close);
      },
      fillForm: () => {
        ShowAdjustInfo.value = true;
      },
      onAdjustAccountDataChange: (adjustInfo: AdjustInfo[]) => {
        dataForm.value.adjustInfo = adjustInfo;
      },
      getPositiveRateNumber: (value: string) => {
        return (/100(?:\.0{0,2})?|(?:[1-9]?\d)(?:\.\d{0,2})?/u.exec(
          value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
        ) ?? [''])[0];
      },
      formatAmount: (amount: string | number) => {
        return formatAmount(amount, 'None');
      },
      uploadFileHandler: async (value: HttpRequestOptions) => {
        if (!methods.checkIncomeFile()) {
          return;
        }
        const formData = new FormData();
        const filename = value.file.name;
        formData.append('file', value.file, filename);

        formData.append('settlement_id', String(cloneSettlement.value?.id));

        methods.setLoadingAndText('upload');
        const res = await UploadKolCompanyFile(formData);
        methods.setLoadingAndText('none');
        if (res?.data.success) {
          // ctx.root.$message.success('上传成功');
          methods.getSettlementDetail();
        } else {
          ctx.root.$message.error(res?.data.message ?? '上传失败，稍后重试');
        }
      },
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
      downloadKolCompanyMapFile: () => {
        methods.downloadAPIFileHandler(kolCompanyMapUrl.value, '机构达人对应关系.xlsx');
      },
      downKolDataFile: (company: CompanyInfo) => {
        methods.downloadAPIFileHandler(
          methods.kolDataUrl(company),
          `${company.company_name}的主播详情 .xlsx`,
        );
      },
      //  获取结算详情，在上传主播机构对应关系成功后调用
      getSettlementDetail: async () => {
        if (!cloneSettlement.value?.id) {
          return;
        }
        const id: SettlementDetailQueryParams = { id: cloneSettlement.value.id };
        methods.setLoadingAndText('detail');
        const res = await GetSettlementDetail('common', id);
        methods.setLoadingAndText('none');
        if (res.data.success) {
          const newData = res.data.data;
          dataForm.value.companyData = newData?.json_data ?? {
            company_info_list: [],
            nofind: [],
            no_approved: [],
          };
        } else {
          ctx.root.$message.warning(res.data.message ?? '获取结算详情失败，请重新上传文件');
        }
      },
      //  保存结算数据
      saveSettlementRequest: async (option: SettlementOneStepOperationEnum) => {
        if (option === SettlementOneStepOperationEnum.next && !methods.checkDataForSave()) {
          return;
        }
        const params: SettlementCostMcnTaobaoBeforeSaveParams = {
          id: cloneSettlement.value.id,
          step:
            option === SettlementOneStepOperationEnum.next
              ? SettlementStep.step_three
              : SettlementStep.step_two,
          total_settle_amount: total_settlement_amount.value,
          adjust_info: dataForm.value.adjustInfo.filter(item => {
            return item.adjust_amount || item.adjust_reason;
          }),
          json_data: {
            nofind: dataForm.value.companyData?.nofind ?? [],
            no_approved: dataForm.value.companyData?.no_approved ?? [],
            company_info_list:
              (
                deepClone(dataForm.value) as SettlementCostMcnDataForm
              ).companyData?.company_info_list.map(item => {
                if (item.tcbl === '') {
                  item.tcbl = '0';
                }
                return item;
              }) ?? [],
          },
        };
        methods.setLoadingAndText('save');
        const res = await SaveSettlementCostStep2MCNTaobaoBefore(params);
        methods.setLoadingAndText('none');
        if (res.data.success) {
          switch (option) {
            case SettlementOneStepOperationEnum.prev:
              ctx.emit('prev', res.data.data);
              break;
            case SettlementOneStepOperationEnum.next:
              ctx.emit('next', res.data.data);
              ctx.root.$message.success(res.data.message ?? '保存成功');
              break;
            case SettlementOneStepOperationEnum.close:
              ctx.root.$message.success('保存成功');
              return true;
            default:
              break;
          }
        } else {
          ctx.root.$message.error(res.data.message ?? '保存失败');
        }
        return false;
      },
      reloadRelationClick: async () => {
        if (!settlement.value?.id) return;
        methods.setLoadingAndText('reload');
        const res = await ReloadKolCompanyRelationship(`${settlement.value.id}`);
        methods.setLoadingAndText('none');
        if (res.data.success) {
          await methods.getSettlementDetail();
        } else {
          ctx.root.$message.error(res?.data.message ?? '刷新失败，稍后重试');
        }
      },
    };

    onMounted(() => {
      originDataForm.value = deepClone(dataForm.value) as SettlementCostMcnDataForm;
      nextTick(() => {
        methods.checkIncomeFile();
      });
    });

    return {
      ShowAdjustInfo,
      total_settlement_amount,
      kolCompanyMapUrl,
      loading,
      loadingText,
      ...methods,
      dataForm,
      companyOptions,
    };
  },
});
