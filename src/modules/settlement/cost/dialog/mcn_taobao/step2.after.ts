/*
 * @Brief: 淘宝cps - 第二步 - 生成结算单之后
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-06-03 09:40:49
 */
import { computed, defineComponent, inject, onMounted, ref, Ref } from '@vue/composition-api';
import { formatAmount } from '@/utils/string';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import SettlementStep2Layout from '@/modules/settlement/component/step2.cost.layout.vue';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import {
  AdjustInfo,
  Settlement,
  SettlementCostMcnTaobaoAfterSaveParams,
  SettlementCostMcnTaobaoAfterDataForm,
  SettlementStep,
  SettlementOneStepOperationEnum,
  TaxAmountInfo,
} from '@/types/tiange/finance/settlement';
import { deepClone } from '@/utils/tools';
import Decimal from 'decimal.js';
import { SaveSettlementCostStep2MCNTaobaoAfter } from '@/services/finance/settlement';
import { getToken } from '@/utils/token';
import { downloadFileFromBlob } from '@/utils/func';
import TopCard from '@/modules/settlement/component/top.card.vue';

export default defineComponent({
  name: 'Step2MCNTaoBaoAfter',
  components: {
    CardLayout,
    SettlementStep2Layout,
    TgAdjustAccountForm,
    TopCard,
  },
  setup(props, ctx) {
    const saveLoading = ref<boolean>(false);

    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);

    const cloneSettlement = computed(() => {
      const newSettlement = deepClone(settlement.value) as Settlement;
      return newSettlement;
    });
    const dataForm = ref<SettlementCostMcnTaobaoAfterDataForm>({
      adjustInfo: cloneSettlement.value?.adjust_info ? cloneSettlement.value?.adjust_info : [],
      companyInfo: {
        company_id: cloneSettlement.value?.company_id
          ? String(cloneSettlement.value?.company_id)
          : '',
        company_name: cloneSettlement.value?.company_name
          ? String(cloneSettlement.value?.company_name)
          : '',
        tcbl: cloneSettlement ? String(cloneSettlement.value?.commission_rate) : '',
        zccb: cloneSettlement ? String(cloneSettlement.value?.commission) : '0',
        yssr: cloneSettlement.value?.original_income_amount
          ? String(cloneSettlement.value?.original_income_amount)
          : '0',
      },
      invoice_type: undefined,
      tax_amount: '',
      tax_rate: '',
      tax_included_amount: '',
      tax_excluded_amount: '',
    });

    const originDataForm = ref<SettlementCostMcnTaobaoAfterDataForm>(
      deepClone(dataForm.value) as SettlementCostMcnTaobaoAfterDataForm,
    );

    const total_settlement_amount = computed(() => {
      let totalAmount: Decimal = new Decimal(0);
      dataForm.value.adjustInfo?.forEach(item => {
        let adjust_amount = item.adjust_amount ? item.adjust_amount : 0;
        adjust_amount = isNaN(Number(adjust_amount)) ? 0 : adjust_amount;
        totalAmount = new Decimal(adjust_amount).add(totalAmount);
      });

      totalAmount = new Decimal(
        dataForm.value.companyInfo.zccb ? dataForm.value.companyInfo.zccb : 0,
      ).add(totalAmount);
      return totalAmount.toFixed(2);
    });
    const getDefaultEmptyString = (value: string | number | undefined) => {
      if (value === '0' || value === 0) {
        return '0.00';
      } else if (!value || value === '') {
        return '';
      } else {
        return new Decimal(value?.toString()).toFixed(2).toString();
      }
    };

    const kolDataUrl = computed(() => {
      return `/api/settlement/download_settlement_kol_data?settlement_id=${
        cloneSettlement.value?.id
      }&company_name=${cloneSettlement.value?.company_name}&Authorization=${getToken()}`;
    });

    const ShowAdjustInfo = ref(false);
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
      isModified: () => {
        const originData = JSON.stringify(originDataForm.value);
        const newData = JSON.stringify(dataForm.value);
        if (originData !== newData) {
          return true;
        } else {
          return false;
        }
      },
      commissionInput: (value: string) => {
        const newVal = methods.getPositiveRateNumber(value);
        dataForm.value.companyInfo.tcbl = newVal;
        dataForm.value.companyInfo.zccb = new Decimal(newVal ? newVal : 0)
          .mul(new Decimal(dataForm.value.companyInfo.yssr ? dataForm.value.companyInfo.yssr : 0))
          .div(new Decimal(100))
          .toFixed(2);
      },
      checkDataForSave: () => {
        if (!cloneSettlement.value?.id) {
          return false;
        }
        if (!(dataForm.value?.invoice_type || dataForm.value?.invoice_type === 0)) {
          ctx.root.$message.warning('请选择发票类型');
          return;
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
              (item.adjust_amount || item.adjust_reason) &&
              (!item.adjust_amount || !item.adjust_reason),
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
      confirmBeforeClose: async () => {
        return methods.isModified();
      },
      saveBeforeClose: () => {
        return methods.saveSettlementRequest(SettlementOneStepOperationEnum.close);
      },
      fillForm: (data: Settlement) => {
        ShowAdjustInfo.value = true;
        dataForm.value.tax_amount = getDefaultEmptyString(data.tax_amount ?? '');
        dataForm.value.tax_rate = data.tax_rate ? data.tax_rate?.toString() : '0';
        dataForm.value.tax_excluded_amount = getDefaultEmptyString(data.tax_excluded_amount ?? '');
        dataForm.value.tax_included_amount = getDefaultEmptyString(data.tax_included_amount ?? '');

        originDataForm.value.tax_amount = getDefaultEmptyString(data.tax_amount ?? '');
        originDataForm.value.tax_rate = data.tax_rate ? data.tax_rate?.toString() : '0';
        originDataForm.value.tax_excluded_amount = getDefaultEmptyString(
          data.tax_excluded_amount ?? '',
        );
        originDataForm.value.tax_included_amount = getDefaultEmptyString(
          data.tax_included_amount ?? '',
        );
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
      downKolDataFile: () => {
        methods.downloadAPIFileHandler(
          kolDataUrl.value,
          `${cloneSettlement.value?.company_name}的主播详情.xlsx`,
        );
      },
      saveSettlementRequest: async (option: SettlementOneStepOperationEnum) => {
        if (option === SettlementOneStepOperationEnum.next && !methods.checkDataForSave()) {
          return;
        }

        const params: SettlementCostMcnTaobaoAfterSaveParams = {
          id: cloneSettlement.value.id,
          step:
            option === SettlementOneStepOperationEnum.next
              ? SettlementStep.step_three
              : SettlementStep.step_two,
          /** 总结算金额 */
          total_settle_amount: total_settlement_amount.value,
          adjust_info: dataForm.value.adjustInfo.filter(item => {
            return item.adjust_amount || item.adjust_reason;
          }),
          commission: dataForm.value.companyInfo.zccb,
          commission_rate:
            dataForm.value.companyInfo.tcbl !== '' ? dataForm.value.companyInfo.tcbl : '0',
          invoice_type: dataForm.value.invoice_type,
          tax_amount: dataForm.value.tax_amount,
          tax_rate: dataForm.value.tax_rate === '' ? '0' : dataForm.value.tax_rate ?? '0',
          tax_included_amount: dataForm.value.tax_included_amount,
          tax_excluded_amount: dataForm.value.tax_excluded_amount,
        };
        saveLoading.value = true;
        const res = await SaveSettlementCostStep2MCNTaobaoAfter(params);
        saveLoading.value = false;
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
    };

    onMounted(() => {
      originDataForm.value = deepClone(dataForm.value) as SettlementCostMcnTaobaoAfterDataForm;
    });

    const invoiceTypeChangedHandler = (val: number) => {
      dataForm.value.invoice_type = val;
      dataForm.value.tax_rate = val !== 2 ? '0' : dataForm.value.tax_rate;
    };
    const taxValueChangeHandler = (item: TaxAmountInfo) => {
      dataForm.value.tax_included_amount = item.tax_included_amount?.toString() ?? '';
      dataForm.value.tax_excluded_amount = item.tax_excluded_amount?.toString() ?? '';
      dataForm.value.tax_amount = item.tax_amount?.toString() ?? '';
      dataForm.value.invoice_type = item.invoice_type;
      dataForm.value.tax_rate =
        item.invoice_type !== 2 ? '0' : item.tax_rate || dataForm.value.tax_rate;
    };
    const taxRateChanged = (value: string) => {
      dataForm.value.tax_rate = value;
    };

    return {
      taxRateChanged,
      invoiceTypeChangedHandler,
      taxValueChangeHandler,
      ShowAdjustInfo,
      total_settlement_amount,
      saveLoading,
      ...methods,
      dataForm,
      cloneSettlement,
      kolDataUrl,
    };
  },
});
