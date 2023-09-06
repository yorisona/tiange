import { defineComponent, inject, ref, Ref, computed, onMounted } from '@vue/composition-api';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import { HttpRequestOptions } from 'element-ui/types/upload';
import {
  AdjustInfo,
  SettlementStep,
  SettlementDataUnionParams,
  SettlementMCNDataForm,
  SettlementType,
  Settlement,
  IncomeExcelDataItem,
  SettlementOneStepOperationEnum,
  TaxAmountInfo,
} from '@/types/tiange/finance/settlement';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import {
  saveSettlementDataService,
  uploadMCNTaobaoIncomeFileService,
  uploadMCNDouyinIncomeFileService,
  uploadMCNVTaskIncomeFileService,
} from '@/services/finance/settlement';
import { BusinessTypeEnum } from '@/types/tiange/common';
import { formatAmount } from '@/utils/string';
import Decimal from 'decimal.js';
import { getToken } from '@/utils/token';
import { downloadFileFromBlob } from '@/utils/func';
import { deepClone } from '@/utils/tools';
import SettlementStep2Layout from '@/modules/settlement/component/step2.layout';
import TopCard from '@/modules/settlement/component/top.card.vue';

type SettlementMCNDataFormOmit = Omit<SettlementMCNDataForm, 'total_settle_amount'>;

export default defineComponent({
  name: 'Step2MCN',
  components: {
    TgAdjustAccountForm,
    SettlementStep2Layout,
    CardLayout,
    TopCard,
  },

  setup(props, ctx) {
    const saveLoading = ref<boolean>(false);
    const uploadLoading = ref<boolean>(false);

    const specialExcelData = ['技术服务费', '专项服务费', '服务费', '其他费用'];

    const injectSettlement =
      inject<Ref<Settlement | undefined>>('settlement') ?? ref<Settlement | undefined>(undefined);

    const excelData = ref<IncomeExcelDataItem[]>(injectSettlement.value?.excel_data ?? []);

    const dataForm = ref<SettlementMCNDataFormOmit>({
      id: injectSettlement.value?.id ?? -1,
      settlement_type:
        injectSettlement.value?.settlement_type ?? SettlementType.common_mcn_taobao_cps,
      income_amount: injectSettlement.value?.income_amount ?? 0,
      // total_settle_amount: injectSettlement.value?.total_settle_amount ?? 0,
      income_file: injectSettlement.value?.income_file ?? '',
      adjust_info: injectSettlement.value?.adjust_info ?? [],
      invoice_type: undefined,
      tax_amount: '',
      tax_rate: '',
      tax_included_amount: '',
      tax_excluded_amount: '',
    });

    const originDataForm = ref<SettlementMCNDataFormOmit>(
      deepClone(dataForm.value) as SettlementMCNDataFormOmit,
    );

    const total_settle_amount = computed(() => {
      let totalAmount: Decimal = new Decimal(
        dataForm.value.income_amount ? dataForm.value.income_amount : 0,
      );
      dataForm.value.adjust_info?.forEach(item => {
        let adjust_amount = item.adjust_amount ? item.adjust_amount : 0;
        adjust_amount = isNaN(Number(adjust_amount)) ? 0 : adjust_amount;
        totalAmount = new Decimal(adjust_amount).add(totalAmount);
      });
      return totalAmount.toString();
    });

    const appHost = computed(() => {
      let url = undefined;
      try {
        url = new URL(process.env.VUE_APP_BASE_API);
      } catch {
        console.log(`current url = ${url}`);
      }

      const urlProtocol = url?.protocol;
      const urlHostName = url?.hostname;
      return `${urlProtocol}//${urlHostName}`;
    });

    const incomeFileDownload = computed(() => {
      return `${dataForm.value.income_file}?Authorization=${getToken()}`;
    });

    const incomeTemplateFile = computed(() => {
      switch (dataForm.value.settlement_type) {
        case SettlementType.common_mcn_douyin_cps:
          return `${appHost.value}/template/settlement/douyin_cps_template.xlsx`;
          break;
        case SettlementType.common_mcn_taobao_cps:
          return `${appHost.value}/template/settlement/taobao_cps_template.xlsx`;
          break;
        case SettlementType.common_mcn_vtask:
          return `${appHost.value}/template/settlement/v_task_template.xlsx`;
          break;
        default:
          return '';
          break;
      }
    });

    const ShowAdjustInfo = ref(false);
    /**
     * 方法对象
     */
    const methods = {
      prev: () => {
        // ctx.emit('prev');
        if (methods.isModified()) {
          methods.saveSettlementDataRequest(SettlementOneStepOperationEnum.prev);
        } else {
          ctx.emit('prev');
        }
      },
      next: () => {
        // ctx.emit('next');
        methods.saveSettlementDataRequest();
      },
      checkDataForSave: () => {
        if (!methods.isTypeIn()) {
          ctx.root.$message.warning('至少填写一个结算项');
          return false;
        }
        if (dataForm.value.adjust_info?.find(item => isNaN(Number(item.adjust_amount)))) {
          ctx.root.$message.warning('请输入正确的调整金额');
          return false;
        }

        if (
          dataForm.value.adjust_info?.find(
            item => Number(item.adjust_amount) === 0 && item.adjust_amount,
          )
        ) {
          ctx.root.$message.warning('调整金额不能为0');
          return false;
        }
        if (
          dataForm.value.adjust_info?.find(
            item =>
              (!item.adjust_amount && item.adjust_reason) ||
              (item.adjust_amount && !item.adjust_reason),
          )
        ) {
          ctx.root.$message.warning('请完善手工调账信息');
          return false;
        }
        if (Number(total_settle_amount.value) <= 0) {
          ctx.root.$message.warning('总结算金额不能小于等于0');
          return false;
        }
        // if (!methods.isModified()) {
        //   return false;
        // }
        return true;
      },
      formatAmount,
      isTypeIn: () => {
        if (dataForm.value.income_file) {
          return true;
        }
        if (dataForm.value.adjust_info?.find(item => item.adjust_amount || item.adjust_reason)) {
          return true;
        }
        return false;
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
      isSpecialIncomeData: (item: IncomeExcelDataItem) => {
        const findItem = specialExcelData.find(name => name === item.name);
        if (findItem) {
          return true;
        }
        return false;
      },
      isLastSpecialIncomeData: (item: IncomeExcelDataItem, index: number) => {
        const findItem = specialExcelData.find(name => name === item.name);
        const nextItem = excelData.value[index + 1];
        const nextFindItem = specialExcelData.find(name => name === nextItem?.name);
        if (findItem && !nextFindItem) {
          return true;
        }
        return false;
      },
      /** 手工调账数据变更 */
      onAdjustAccountDataChange: (adjust_account: AdjustInfo[]) => {
        dataForm.value.adjust_info = adjust_account;
      },
      uploadFileHandler: async (value: HttpRequestOptions) => {
        const file = value.file;
        if (file.size > 30 * 1024 * 1024) {
          ctx.root.$message.error('上传文件大小不能超过 30MB!');
          return;
        }
        const formData = new FormData();
        const filename = value.file.name;
        formData.append('file', value.file, filename);

        formData.append('id', String(dataForm.value.id));

        let res = undefined;
        uploadLoading.value = true;
        try {
          switch (dataForm.value.settlement_type) {
            case SettlementType.common_mcn_taobao_cps:
              res = await uploadMCNTaobaoIncomeFileService(formData);
              break;
            case SettlementType.common_mcn_douyin_cps:
              res = await uploadMCNDouyinIncomeFileService(formData);
              break;
            case SettlementType.common_mcn_vtask:
              res = await uploadMCNVTaskIncomeFileService(formData);
              break;
            default:
              break;
          }
        } catch (error) {
          uploadLoading.value = false;
          return;
        }
        uploadLoading.value = false;
        if (res?.data.success) {
          dataForm.value.income_amount = res?.data.data.income_amount;
          dataForm.value.income_file = res.data.data.income_file;
          excelData.value = res.data.data.excel_data ?? [];
          ctx.root.$message.success('上传成功');
        } else {
          ctx.root.$message.error(res?.data.message ?? '上传/解析失败，稍后重试');
        }
      },
      downloadFile: (url: string) => {
        if (!url) {
          return;
        }
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
      confirmBeforeClose: async () => {
        return methods.isModified();
      },
      saveBeforeClose: () => {
        return methods.saveSettlementDataRequest(SettlementOneStepOperationEnum.close);
      },
      fillForm: (data?: Settlement) => {
        ShowAdjustInfo.value = true;
        if (data) {
          const fill_tax_rate = data.tax_rate?.toString() ? data.tax_rate?.toString() : '0';
          dataForm.value.id = data?.id ?? -1;
          dataForm.value.settlement_type =
            data?.settlement_type ?? SettlementType.common_mcn_taobao_cps;
          dataForm.value.income_amount = data?.income_amount ?? 0;
          // dataForm.value.total_settle_amount = data?.total_settle_amount ?? 0;
          dataForm.value.income_file = data?.income_file ?? '';
          dataForm.value.adjust_info = data?.adjust_info ?? [];
          excelData.value = data.excel_data ?? [];
          dataForm.value.invoice_type = data.invoice_type;
          dataForm.value.tax_amount = data.tax_amount?.toString();
          dataForm.value.tax_rate = fill_tax_rate;
          dataForm.value.tax_included_amount = data.tax_included_amount?.toString();
          dataForm.value.tax_excluded_amount = data.tax_excluded_amount?.toString();
          originDataForm.value.invoice_type = data.invoice_type;
        }
      },
      saveSettlementDataRequest: async (
        operationEnum: SettlementOneStepOperationEnum = SettlementOneStepOperationEnum.next,
      ) => {
        if (!(dataForm.value?.invoice_type || dataForm.value?.invoice_type === 0)) {
          ctx.root.$message.warning('请选择发票类型');
          return;
        }
        if (operationEnum === SettlementOneStepOperationEnum.next) {
          if (!methods.checkDataForSave()) {
            return;
          } else if (!methods.isModified()) {
            ctx.emit('next');
            return;
          }
        }
        // if (!methods.checkDataForSave()) {
        //   if (operationEnum === SettlementOneStepOperationEnum.next) {
        //     ctx.emit('next');
        //   }
        //   return;
        // }
        const params: SettlementDataUnionParams = {
          id: dataForm.value.id,
          step:
            operationEnum === SettlementOneStepOperationEnum.next
              ? SettlementStep.step_three
              : SettlementStep.step_two,
          total_settle_amount: total_settle_amount.value,
          income_amount: dataForm.value.income_amount,
          income_file: dataForm.value.income_file,
          adjust_info: dataForm.value.adjust_info?.filter(item => {
            return item.adjust_amount || item.adjust_reason;
          }),
          invoice_type: dataForm.value.invoice_type,
          tax_amount: dataForm.value.tax_amount,
          tax_rate: dataForm.value.tax_rate === '' ? '0' : dataForm.value.tax_rate ?? '0',
          tax_included_amount: dataForm.value.tax_included_amount,
          tax_excluded_amount: dataForm.value.tax_excluded_amount,
        };
        saveLoading.value = true;
        const res = await saveSettlementDataService(params, BusinessTypeEnum.mcn);
        saveLoading.value = false;
        if (res.data.success) {
          switch (operationEnum) {
            case SettlementOneStepOperationEnum.next:
              ctx.emit('next', res.data.data);
              ctx.root.$message.success('保存成功');
              break;
            case SettlementOneStepOperationEnum.prev:
              ctx.emit('prev', res.data.data);
              break;
            default:
              ctx.root.$message.success('保存成功');
              break;
          }
          return true;
        } else {
          ctx.root.$message.error(res.data.message ?? '保存失败');
          return false;
        }
      },
    };

    onMounted(() => {
      originDataForm.value = deepClone(dataForm.value) as SettlementMCNDataFormOmit;
    });

    const invoiceTypeChangedHandler = (val: number) => {
      dataForm.value.invoice_type = val;
      dataForm.value.tax_rate = val === 0 ? '0' : dataForm.value.tax_rate;
    };

    const taxRateChanged = (val: any) => {
      // const value = (/100(?:\.0{0,2})?|(?:[1-9]?\d)(?:\.\d{0,2})?/u.exec(
      //   val.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
      // ) ?? [''])[0];
      dataForm.value.tax_rate = val;
    };

    const taxValueChangeHandler = (item: TaxAmountInfo) => {
      dataForm.value.tax_rate = item.tax_rate?.toString() ?? '';
      dataForm.value.tax_included_amount = item.tax_included_amount?.toString() ?? '';
      dataForm.value.tax_excluded_amount = item.tax_excluded_amount?.toString() ?? '';
      dataForm.value.tax_amount = item.tax_amount?.toString() ?? '';
      dataForm.value.invoice_type = item.invoice_type || dataForm.value.invoice_type;
      dataForm.value.tax_rate =
        item.invoice_type === 0 ? '0' : item.tax_rate + '' || dataForm.value.tax_rate;
    };

    return {
      invoiceTypeChangedHandler,
      taxRateChanged,
      taxValueChangeHandler,
      ShowAdjustInfo,
      total_settle_amount,
      excelData,
      saveLoading,
      uploadLoading,
      dataForm,
      incomeFileDownload,
      incomeTemplateFile,
      ...methods,
    };
  },
});
