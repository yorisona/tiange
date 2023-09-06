import {
  AdjustInfo,
  MCNIncomeFormForDouyinAfter,
  SetlementIncomeTypeMap,
  Settlement,
  SettlementIncomeType,
  SettlementOneStepOperationEnum,
  SettlementStep,
  TaxAmountInfo,
} from '@/types/tiange/finance/settlement';
import { Decimal2String, formatAmountWithoutPrefix } from '@/utils/string';
import { defineComponent, ref, Ref, computed, inject, onMounted } from '@vue/composition-api';
import Decimal from 'decimal.js';
import TopCard from '@/modules/settlement/component/top.card.vue';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import Step2Layout from '@/modules/settlement/component/step2.layout';
import { deepClone } from '@/utils/tools';
import {
  saveSettlementDataService,
  uploadMCNDouyinFileService,
} from '@/services/finance/settlement';
import { BusinessTypeEnum } from '@/types/tiange/common';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import { commonForm } from '@/modules/settlement/cost/dialog/shoplive/utils';
import { HttpRequestOptions } from 'element-ui/types/upload';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import { pit_fee_detail_url } from '../../../component/use/uilts';
import { getToken } from '@/utils/token';

export default defineComponent({
  components: {
    TopCard,
    CardLayout,
    Step2Layout,
    TgAdjustAccountForm,
  },
  setup(props, ctx) {
    const saveLoading = ref<boolean>(false);

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
    const uploadLoading = ref<boolean>(false);
    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);
    const unityData: any = ref({});
    const DataForm = ref<MCNIncomeFormForDouyinAfter>({
      adjust_info: settlement.value?.adjust_info ?? [],
      invoice_type: settlement.value?.invoice_type || undefined,
      tax_amount: settlement.value?.tax_amount ? `${settlement.value.tax_amount}` : '',
      tax_rate:
        settlement.value?.tax_rate === undefined || settlement.value?.tax_rate === null
          ? '0'
          : `${settlement.value.tax_rate}`,
      tax_included_amount: settlement.value?.tax_included_amount
        ? `${settlement.value.tax_included_amount}`
        : '',
      tax_excluded_amount: settlement.value?.tax_excluded_amount
        ? `${settlement.value.tax_excluded_amount}`
        : '',
      amount_info_list: settlement.value?.json_data?.amount_info_list ?? [],
    });

    const originDataForm = ref<MCNIncomeFormForDouyinAfter>(
      deepClone(DataForm.value) as MCNIncomeFormForDouyinAfter,
    );

    /** 总结算金额 */
    const total_amount = computed(() => {
      let totalAmount: Decimal = new Decimal(0);
      DataForm.value.adjust_info?.forEach(item => {
        let adjust_amount = item.adjust_amount ? item.adjust_amount : 0;
        adjust_amount = isNaN(Number(adjust_amount)) ? 0 : adjust_amount;
        totalAmount = new Decimal(adjust_amount).add(totalAmount);
      });
      DataForm.value.amount_info_list?.forEach(item => {
        let amount = item.amount ? item.amount : 0;
        amount = isNaN(Number(amount)) ? 0 : amount;
        totalAmount = new Decimal(amount).add(totalAmount);
      });
      return totalAmount.toFixed(2);
    });
    const total_amount_str = computed(() => Decimal2String(new Decimal(total_amount.value)));

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

    /**
     * 方法对象
     */
    const methods = {
      prev: () => {
        if (methods.isModified()) {
          methods.saveSettlementDataRequest(SettlementOneStepOperationEnum.prev);
        } else {
          ctx.emit('prev');
        }
      },
      next: () => {
        methods.saveSettlementDataRequest();
      },
      isTypeIn: () => {
        if (DataForm.value.adjust_info?.find(item => item.adjust_amount || item.adjust_reason)) {
          return true;
        }
        return false;
      },
      checkDataForSave: () => {
        // if (!methods.isTypeIn()) {
        //   ctx.root.$message.warning('至少填写一个结算项');
        //   return false;
        // }

        let income_ok = true;
        let income_error_message = '';
        DataForm.value.amount_info_list?.forEach(element => {
          switch (element.type) {
            case SettlementIncomeType.head_service_fee:
              if (!element.amount) {
                income_error_message = '团长服务费不能为0，请重新上传文件';
                income_ok = false;
              }
              break;
            case SettlementIncomeType.douyin_cps:
              if (!element.amount) {
                income_error_message = '抖音CPS收入不能为0，请重新上传文件';
                income_ok = false;
              }
              break;
            case SettlementIncomeType.xingtu:
              if (!element.amount) {
                income_error_message = '星图收入不能为0，请重新上传文件';
                income_ok = false;
              }
              break;
            case SettlementIncomeType.pit_fee:
            case SettlementIncomeType.shangguang:
            case SettlementIncomeType.other: {
              const not_complete =
                element.amount === undefined || element.amount === null || element.amount === ''
                  ? true
                  : false;
              if (not_complete) {
                income_ok = false;
                if (element.type === SettlementIncomeType.pit_fee) {
                  income_error_message = '请完善坑位费数据信息';
                } else if (element.type === SettlementIncomeType.shangguang) {
                  income_error_message = '请完善商广收入数据信息';
                } else if (element.type === SettlementIncomeType.other) {
                  income_error_message = '请完善其他收入数据信息';
                }
              }
              break;
            }
            default:
              break;
          }
          if (!income_ok) {
            return;
          }
        });
        if (!income_ok) {
          ctx.root.$message.warning(income_error_message);
          return false;
        }
        if (!(DataForm.value?.invoice_type || DataForm.value?.invoice_type === 0)) {
          ctx.root.$message.warning('请选择发票类型');
          return;
        }
        if (DataForm.value.adjust_info?.find(item => isNaN(Number(item.adjust_amount)))) {
          ctx.root.$message.warning('请输入正确的调整金额');
          return false;
        }

        if (
          DataForm.value.adjust_info?.find(
            item => Number(item.adjust_amount) === 0 && item.adjust_amount,
          )
        ) {
          ctx.root.$message.warning('调整金额不能为0');
          return false;
        }
        if (
          DataForm.value.adjust_info?.find(
            item =>
              (!item.adjust_amount && item.adjust_reason) ||
              (item.adjust_amount && !item.adjust_reason),
          )
        ) {
          ctx.root.$message.warning('请完善手工调账信息');
          return false;
        }
        if (Number(total_amount.value) < 0) {
          ctx.root.$message.warning('总结算金额不能小于0');
          return false;
        }
        // if (!methods.isModified()) {
        //   return false;
        // }
        return true;
      },
      taxRateChanged: (value: string) => {
        DataForm.value.tax_rate = value;
      },
      invoiceTypeChangedHandler: (val: number) => {
        DataForm.value.invoice_type = val;
        DataForm.value.tax_rate = val === 0 ? 0 : DataForm.value.tax_rate;
      },
      taxValueChangeHandler: (item: TaxAmountInfo) => {
        DataForm.value.invoice_type = item.invoice_type || DataForm.value.invoice_type;
        DataForm.value.tax_rate =
          item.invoice_type === 0 ? '0' : item.tax_rate + '' || DataForm.value.tax_rate;
        DataForm.value.tax_included_amount = item.tax_included_amount?.toString() ?? '';
        DataForm.value.tax_excluded_amount = item.tax_excluded_amount?.toString() ?? '';
        DataForm.value.tax_amount = item.tax_amount?.toString() ?? '';
      },
      onAdjustAccountDataChange: (adjust_info: AdjustInfo[]) => {
        DataForm.value.adjust_info = adjust_info;
      },
      isModified: () => {
        const originData = JSON.stringify(originDataForm.value);
        const newData = JSON.stringify(DataForm.value);

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
        return methods.saveSettlementDataRequest(SettlementOneStepOperationEnum.close);
      },
      saveSettlementDataRequest: async (
        operationEnum: SettlementOneStepOperationEnum = SettlementOneStepOperationEnum.next,
      ) => {
        if (!(DataForm.value?.invoice_type || DataForm.value?.invoice_type === 0)) {
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
        const params: any = {
          id: settlement.value?.id,
          step:
            operationEnum === SettlementOneStepOperationEnum.next
              ? SettlementStep.step_three
              : SettlementStep.step_two,
          total_settle_amount: total_amount.value,
          adjust_info: DataForm.value.adjust_info?.filter((item: AdjustInfo) => {
            return item.adjust_amount || item.adjust_reason;
          }),
          invoice_type: DataForm.value.invoice_type,
          tax_amount: DataForm.value.tax_amount,
          tax_rate: DataForm.value.tax_rate === '' ? '0' : DataForm.value.tax_rate ?? '0',
          tax_included_amount: DataForm.value.tax_included_amount,
          tax_excluded_amount: DataForm.value.tax_excluded_amount,
          json_data: {
            amount_info_list: DataForm.value.amount_info_list,
          },
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
      amountDetail: (type: SettlementIncomeType) => {
        return DataForm.value.amount_info_list.find(el => el.type === type);
      },
      downPitFeeDetail: () => {
        window.open(pit_fee_detail_url(settlement.value?.id, settlement.value?.company_id));
        // const url = methods.amountDetail(SettlementIncomeType.pit_fee)?.file;
        // if (url) {
        //   downloadFileHandler(url);
        // }
      },
      income_amount: (type: SettlementIncomeType) => {
        return methods.amountDetail(type)?.amount;
      },
      remark: (type: SettlementIncomeType) => {
        return methods.amountDetail(type)?.remark;
      },
      file: (type: SettlementIncomeType) => {
        return methods.amountDetail(type)?.file;
      },
      onIncomeAmountChanged: (val: string, type: SettlementIncomeType) => {
        const result = (/(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?/u.exec(
          val.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
        ) ?? [''])[0];
        const detail = methods.amountDetail(type);
        if (detail) {
          detail.amount = result;
        }
      },
      remarkChanged: (val: string, type: SettlementIncomeType) => {
        const detail = methods.amountDetail(type);
        if (detail) {
          detail.remark = val;
        }
      },
      downloadDataFile: (type: SettlementIncomeType) => {
        const file = methods.file(type);
        if (!file) {
          return;
        }
        downloadFileHandler(file);
      },
      downTempFile: (type: SettlementIncomeType) => {
        let url = '';
        switch (type) {
          case SettlementIncomeType.head_service_fee:
            url =
              'https://tiange-oss.oss-cn-hangzhou.aliyuncs.com/upload_template/group_template.xlsx';
            break;
          case SettlementIncomeType.xingtu:
            url =
              'https://tiange-oss.oss-cn-hangzhou.aliyuncs.com/upload_template/xingtu_template.xlsx';
            break;
          case SettlementIncomeType.douyin_cps:
            url = `${appHost.value}/template/settlement/douyin_cps_template.xlsx`;
            break;
        }
        decodeURI;
        window.open(url);
        // downloadFileHandler(url);
      },
      uploadFileHandler: async (value: HttpRequestOptions, income_type: SettlementIncomeType) => {
        const file = value.file;
        if (file.size > 30 * 1024 * 1024) {
          ctx.root.$message.error('上传文件大小不能超过 30MB!');
          return;
        }
        const formData = new FormData();
        const filename = value.file.name;
        formData.append('file', value.file, filename);

        let res = undefined;
        let type: 'douyin' | 'xingtu' | 'head_fee' = 'douyin';
        uploadLoading.value = true;
        try {
          switch (income_type) {
            case SettlementIncomeType.xingtu:
              type = 'xingtu';
              break;
            case SettlementIncomeType.douyin_cps:
              type = 'douyin';
              break;
            case SettlementIncomeType.head_service_fee:
              type = 'head_fee';
              break;
            default:
              break;
          }
          res = await uploadMCNDouyinFileService(formData, type);
        } catch (error) {
          uploadLoading.value = false;
          return;
        }
        uploadLoading.value = false;
        if (res?.data.success) {
          const detial = methods.amountDetail(income_type);
          if (detial) {
            detial.amount = `${res?.data.data.income_amount ?? 0}`;
            detial.file = res.data.data.income_file;
          }

          ctx.root.$message.success('上传成功');
        } else {
          ctx.root.$message.error(res?.data.message ?? '上传/解析失败，稍后重试');
        }
      },
      formatAmountWithoutPrefix,
    };
    const downloadUnityDataFile = (url: string) => {
      window.open(url + `?Authorization=${getToken()}`);
    };
    const refundRateHandler = (val: number) => {
      if (isNaN(val) || val * 1 <= 0) {
        unityData.value.refund_rate = '0';
        val = 0;
      }
      if (unityData.value.version === 2) {
        unityData.value.amount = (unityData.value.commission_amount * (1 - val / 100)).toFixed(2);
      } else {
        unityData.value.amount = (
          (unityData.value.total_gmv * (1 - val / 100) * unityData.value.commission_rate) /
          100
        ).toFixed(2);
      }
    };
    const fileLists = ref([]);
    onMounted(() => {
      originDataForm.value = deepClone(DataForm.value) as MCNIncomeFormForDouyinAfter;
      if (settlement.value) {
        unityData.value = settlement.value.json_data?.amount_info_list?.find(
          (item: any) => item.type === 10,
        );
        fileLists.value = unityData.value?.file?.split(',');
      }
    });

    return {
      pit_fee_url: pit_fee_detail_url(settlement.value?.id, settlement.value?.company_id),
      incomeNameTypes,
      DataForm,
      total_amount,
      refundRateHandler,
      downloadUnityDataFile,
      settlement,
      unityData,
      fileLists,
      total_amount_str,
      saveLoading,
      ...methods,
    };
  },
});
