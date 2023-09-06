import {
  defineComponent,
  ref,
  inject,
  Ref,
  computed,
  onMounted,
  reactive,
} from '@vue/composition-api';
import SettlementStep2Layout from '@/modules/settlement/component/step2.cost.layout';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import { GetListSettlementCompanies } from '@/services/supplier';
import {
  AdjustInfo,
  MCNCostFormForDouyinAfter,
  SetlementCostTypeMap,
  Settlement,
  SettlementIncomeType,
  SettlementOneStepOperationEnum,
  SettlementStep,
  TaxAmountInfo,
} from '@/types/tiange/finance/settlement';
import { deepClone } from '@/utils/tools';
import Decimal from 'decimal.js';
import { Decimal2String, formatAmountWithoutPrefix } from '@/utils/string';
import { saveSettlementCostDataService } from '@/services/finance/settlement';
import { default_put_company_name } from '@/modules/settlement/component/use/uilts';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
// import { commonForm } from '@/modules/settlement/cost/dialog/shoplive/utils';
import { BusinessTypeEnum } from '@/types/tiange/common';
import TopCard from '@/modules/settlement/component/top.card.vue';
import { getToken } from '@/utils/token';
import { Message } from 'element-ui';

export default defineComponent({
  components: {
    SettlementStep2Layout,
    TgAdjustAccountForm,
    CardLayout,
    TopCard,
  },
  setup(props, ctx) {
    // const { downloadFileHandler } = commonForm(ctx);

    const saveLoading = ref<boolean>(false);
    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);

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

    const DataForm = ref<MCNCostFormForDouyinAfter>({
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
    const dataJson: any = computed(() => DataForm.value.amount_info_list[0]);
    const fileName: any = computed(() => {
      const _url = dataJson.value.file;
      return _url.split('/').pop();
    });
    const originDataForm = ref<MCNCostFormForDouyinAfter>(
      deepClone(DataForm.value) as MCNCostFormForDouyinAfter,
    );

    const total_amount_str = computed(() => Decimal2String(new Decimal(total_amount.value)));

    const isYuFengCompany = computed(
      () => settlement.value?.company_name === default_put_company_name,
    );

    const adjustmentAmount = computed(() => {
      // 如果达人有开税率大于0的发票，计算公式为：调整金额 = （达人收入 - 扣除项 + 手工调整）-（达人收入 - 扣除项 + 手工调整）/1.06*（1+达人开票税率）
      // 如果达人有开税率等于0的发票或者未灵活用工平台，显示发票税率0%，计算公式为：调整金额 = （达人收入 - 扣除项 + 手工调整）-（达人收入 - 扣除项 + 手工调整）/1.06
      // 如果是公司代扣代缴，显示发票税率0%（公司代缴个税），调整金额 =（达人收入 - 扣除项 + 手工调整）- （达人收入 - 扣除项 + 手工调整）/1.06*（1-0.25）
      // 结算金额 =（达人收入 - 扣除项 + 手工调整）- 扣税调整

      // dataJson.value.invoice_enable  能开发票
      const deduct = dataJson.value.kol_cost_share.map((item: any) => item.amount * 1);
      const deductCount = deduct.reduce((curr: number, next: number) => curr + next, 0); // 扣除项金额
      const adjust_info = DataForm.value.adjust_info.map((item: any) => item.adjust_amount * 1);
      const adjustAmount = adjust_info.reduce((curr: number, next: number) => curr + next, 0); // 手工调账
      const fee = dataJson.value.commission_amount * 1 + dataJson.value.other_income_amount * 1; // 达人佣金 + 其他收入
      const allFee = fee - deductCount + adjustAmount; // （达人收入 - 扣除项 + 手工调整）
      if (dataJson.value.invoice_enable) {
        // 有费率
        return (
          Math.round(
            (allFee -
              (allFee / 1.06) * (1 + dataJson.value.invoice_tax_rate / 100) +
              Number.EPSILON) *
              100,
          ) / 100
        );
      } else {
        //invoice_platform：2是公司代缴；1是灵活用工
        if (dataJson.value.invoice_platform === 1) {
          // 灵活用工
          return Math.round((allFee - allFee / 1.06 + Number.EPSILON) * 100) / 100;
        } else if (dataJson.value.invoice_platform === 2) {
          //是公司代缴
          return Math.round((allFee - (allFee / 1.06) * (1 - 0.25) + Number.EPSILON) * 100) / 100;
        }
      }
      return 0;
    });
    /** 总结算金额 */
    const total_amount = computed(() => {
      const deduct = dataJson.value.kol_cost_share.map((item: any) => item.amount * 1);
      const deductCount = deduct.reduce((curr: number, next: number) => curr + next, 0); // 扣除项金额
      const adjust_info = DataForm.value.adjust_info.map((item: any) => item.adjust_amount * 1);
      const adjustAmount = adjust_info.reduce((curr: number, next: number) => curr + next, 0); // 手工调账
      const fee = dataJson.value.commission_amount * 1 + dataJson.value.other_income_amount * 1; // 达人佣金 + 其他收入
      const allFee = fee - deductCount + adjustAmount; // （达人收入 - 扣除项 + 手工调整）
      return Math.round((allFee - adjustmentAmount.value + Number.EPSILON) * 100) / 100;
    });
    const _getAdjustInputNumber = (value: string) => {
      return (/-?(?:(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?)?/u.exec(
        value.replace(/[^-.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
      ) ?? [''])[0];
    };
    const getAdjustAmountNumber = (value: string, index: number) => {
      const result = _getAdjustInputNumber(value);
      const jsData: any = DataForm.value.amount_info_list[0];
      jsData.kol_cost_share[index].amount = result;
    };
    const getIncomeAmountNumber = (val: string) => {
      const result = _getAdjustInputNumber(val);
      const jsData: any = DataForm.value.amount_info_list[0];
      jsData.other_income_amount = result;
    };
    const dialogCompany = reactive({
      form: {} as { company: number },
      options: [] as any[],
      visible: false,
      company: {} as { company_name: string; company_id: number; kol_salary_infos: any[] },
      salary_info: {},
      companyIndex: 0,
      salary_index: 0,
      show() {
        const company = {
          company_name: dataJson.value.company_name,
          company_id: dataJson.value.company_id,
          kol_salary_infos: [],
        };
        dialogCompany.company = company;

        dialogCompany.options = [
          {
            id: company.company_id,
            company_name: company.company_name,
          },
        ];
        dialogCompany.visible = true;
      },
      submit() {
        const form = dialogCompany.form;
        const targetCompany = dialogCompany.options.find(it => it.id === form.company);
        (DataForm.value.amount_info_list[0] as any).company_name = targetCompany.company_name;
        (DataForm.value.amount_info_list[0] as any).company_id = targetCompany.company;
        // const form = dialogCompany.form;
        // if (!form.company) {
        //   ctx.root.$message.error('请选择公司');
        //   return;
        // }
        // // 要设置的结算公司
        // const targetCompany = dialogCompany.options.find(it => it.id === form.company);
        // // 从所有结算公司列表中搜索要更新的结算公司
        // const searchCompanyList = DataForm.value.json_data.company_info_list.find(
        //   (it: any) => it.company_id === targetCompany.id,
        // );

        // // 如果ID没变则不处理
        // if (targetCompany.id === dialogCompany.company.company_id) {
        //   dialogCompany.visible = false;
        //   return;
        //   // 如果发生了变化,那先把主播从结算公司中删除
        // } else {
        //   dialogCompany.company.kol_salary_infos.splice(dialogCompany.salary_index, 1);
        //   // 如果删除后没有主播
        //   if (dialogCompany.company.kol_salary_infos.length === 0) {
        //     DataForm.value.json_data.company_info_list.splice(dialogCompany.companyIndex, 1);
        //   }
        // }

        // // 如果没有在列表中找到要更换的结算公司,说明要新增
        // if (searchCompanyList === undefined) {
        //   const modifyCompany = { ...dialogCompany.company };
        //   modifyCompany.kol_salary_infos = [dialogCompany.salary_info];
        //   modifyCompany.company_id = targetCompany.id;
        //   modifyCompany.company_name = targetCompany.company_name;
        //   DataForm.value.json_data.company_info_list.splice(
        //     dialogCompany.companyIndex,
        //     0,
        //     modifyCompany as any,
        //   );
        // } else {
        //   searchCompanyList.kol_salary_infos.push(dialogCompany.salary_info as any);
        // }

        // set(DataForm.value.json_data, 'company_info_list', [
        //   ...DataForm.value.json_data.company_info_list,
        // ]);
        // set(dialogCompany.company, 'company_id', targetCompany.id);
        // set(dialogCompany.company, 'company_name', targetCompany.company_name);
        dialogCompany.visible = false;
      },
      close: () => {
        dialogCompany.visible = false;
      },
      remoteMethod: (query: string) => {
        if (query !== '') {
          GetListSettlementCompanies(query, 1).then((res: any) => {
            dialogCompany.options = res;
          });
        } else {
          dialogCompany.options = [];
        }
      },
    });
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
          const not_complete = !element.amount;
          if (not_complete) {
            income_ok = false;
            switch (element.type) {
              case SettlementIncomeType.put:
                income_error_message = '请完善投放成本数据信息';
                break;
              case SettlementIncomeType.talent_cost: {
                income_error_message = '请完善达人成本数据信息';
                break;
              }
              case SettlementIncomeType.pit_fee:
                income_error_message = '请完善坑位费数据信息';
                break;
              case SettlementIncomeType.shangguang:
                income_error_message = '请完善商广成本数据信息';
                break;
              case SettlementIncomeType.xingtu:
                income_error_message = '请完善星图成本数据信息';
                break;
              case SettlementIncomeType.other:
                income_error_message = '请完善其他成本数据信息';
                break;
              default:
                break;
            }
          }
          if (!income_ok) {
            return;
          }
        });
        if (!income_ok) {
          ctx.root.$message.warning(income_error_message);
          return false;
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
        if (Number(total_amount.value) <= 0) {
          ctx.root.$message.warning('总结算金额不能小于等于0');
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
        DataForm.value.tax_rate = val !== 2 ? 0 : DataForm.value.tax_rate;
      },
      taxValueChangeHandler: (item: TaxAmountInfo) => {
        DataForm.value.tax_included_amount = item.tax_included_amount?.toString() ?? '';
        DataForm.value.tax_excluded_amount = item.tax_excluded_amount?.toString() ?? '';
        DataForm.value.tax_amount = item.tax_amount?.toString() ?? '';
        DataForm.value.invoice_type = item.invoice_type;
        DataForm.value.tax_rate =
          item.invoice_type !== 2 ? '0' : item.tax_rate || DataForm.value.tax_rate;
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
        DataForm.value.amount_info_list[0].tax_balance = adjustmentAmount.value;

        if (!(DataForm.value?.invoice_type || DataForm.value?.invoice_type === 0)) {
          ctx.root.$message.warning('请选择发票类型');
          return;
        }
        if (operationEnum === SettlementOneStepOperationEnum.next) {
          if (!methods.isModified()) {
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
          tax_amount: DataForm.value.tax_amount, // 税额
          tax_rate: DataForm.value.tax_rate === '' ? '0' : DataForm.value.tax_rate ?? '0',
          tax_included_amount: DataForm.value.tax_included_amount, // 含税金额
          tax_excluded_amount: DataForm.value.tax_excluded_amount, // 不含税金额
          json_data: {
            amount_info_list: DataForm.value.amount_info_list,
          },
        };
        if (params.tax_included_amount < 0) {
          Message.error('总结算金额不能小于0');
          return;
        }
        saveLoading.value = true;
        const res = await saveSettlementCostDataService(params, BusinessTypeEnum.mcn);
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
      formatAmountWithoutPrefix,
      getAdjustAmountNumber,
    };
    const downFile = (url: string) => {
      window.open(url + `?Authorization=${getToken()}`);
    };

    onMounted(() => {
      originDataForm.value = deepClone(DataForm.value) as MCNCostFormForDouyinAfter;
    });
    return {
      feeNameTypes,
      saveLoading,
      DataForm,
      dataJson,
      fileName,
      downFile,
      getIncomeAmountNumber,
      adjustmentAmount,
      dialogCompany,
      total_amount,
      settlement,
      total_amount_str,
      isYuFengCompany,
      ...methods,
    };
  },
});
