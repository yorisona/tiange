import { defineComponent, ref, Ref, inject, computed, onMounted } from '@vue/composition-api';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import SettlementStep2Layout from '@/modules/settlement/component/step2.layout';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import TopCard from '@/modules/settlement/component/top.card.vue';
import {
  AdjustInfo,
  CompanyInfo,
  CompanyInfoForMCNDouyin,
  MCNDouuyinForm,
  Settlement,
  SettlementDataUnionParams,
  SettlementIncomeType,
  SettlementOneStepOperationEnum,
  SettlementStep,
} from '@/types/tiange/finance/settlement';
import { deepClone } from '@/utils/tools';
import Decimal from 'decimal.js';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import { formatAmount } from '@/utils/string';
import { downloadFileFromBlob } from '@/utils/func';
import { HttpRequestOptions } from 'element-ui/types/upload';
import { saveSettlementDataService, UploadKolCompanyFile } from '@/services/finance/settlement';
import { BusinessTypeEnum } from '@/types/tiange/common';
import IncomeDetail from '../../../component/incomeDetail/income.detail.vue';

const initCompanyData = (): CompanyInfoForMCNDouyin => {
  return {
    company_id: '',
    company_name: '',
    file: undefined,
    income_amount: '',
    type: undefined,
    company_list: [
      //   {
      //   company_id: undefined,
      //   company_name: undefined,
      //   income_amount: undefined,
      //   remark: undefined,
      // }
    ],
  };
};

export default defineComponent({
  props: {},
  components: {
    TopCard,
    TgAdjustAccountForm,
    CardLayout,
    SettlementStep2Layout,
    IncomeDetail,
  },
  setup(props, ctx) {
    const loading = ref<boolean>(false);
    const loadingText = ref<string>('');

    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);

    const cloneSettlement = computed(() => {
      const newSettlement = deepClone(settlement.value) as Settlement;
      return newSettlement;
    });

    const dataForm = ref<MCNDouuyinForm>({
      adjustInfo: cloneSettlement.value?.adjust_info ?? [],
      company_info_list: cloneSettlement.value.json_data?.company_info_list ?? [initCompanyData()],
    });

    const selectedIncomeTypeList = computed(
      () => dataForm.value.company_info_list?.map(info => info.type) ?? [],
    );
    const selectedCompanyList = computed(() => {
      const list: { id: any; name: string }[] = [];

      const isIncluded = (name: string) => {
        return list.find(el => el.name === name) ? true : false;
      };
      dataForm.value.company_info_list?.forEach(el => {
        if (el.company_name && !isIncluded(el.company_name)) {
          list.push({
            id: el.company_id,
            name: el.company_name,
          });
        }
        el.company_list?.forEach(inEl => {
          if (inEl.company_name && !isIncluded(inEl.company_name)) {
            list.push({
              id: inEl.company_id,
              name: inEl.company_name,
            });
          }
        });
      });
      return list;
    });

    const originDataForm = ref<MCNDouuyinForm>(deepClone(dataForm.value) as MCNDouuyinForm);

    const total_settlement_amount = computed(() => {
      let totalAmount: Decimal = new Decimal(0);
      dataForm.value.adjustInfo?.forEach(item => {
        let adjust_amount = item.adjust_amount ? item.adjust_amount : 0;
        adjust_amount = isNaN(Number(adjust_amount)) ? 0 : adjust_amount;
        totalAmount = new Decimal(adjust_amount).add(totalAmount);
      });
      dataForm.value.company_info_list?.forEach(el => {
        let income_amount = el.income_amount ? el.income_amount : '0';
        income_amount = isNaN(Number(income_amount)) ? '0' : income_amount;
        totalAmount = new Decimal(income_amount).add(totalAmount);
        el.company_list?.forEach(inEl => {
          let in_income_amount = inEl.income_amount ? inEl.income_amount : '0';
          in_income_amount = isNaN(Number(in_income_amount)) ? '0' : in_income_amount;
          totalAmount = new Decimal(in_income_amount).add(totalAmount);
        });
      });
      return totalAmount.toFixed(2);
    });
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
        if (!cloneSettlement.value?.id) {
          return false;
        }
        /**  */
        let income_ok = true;
        let income_error_message = '';
        dataForm.value.company_info_list?.forEach(element => {
          switch (element.type) {
            case SettlementIncomeType.head_service_fee:
              if (!element.income_amount) {
                income_error_message = '团长服务费不能为0，请重新上传文件';
                income_ok = false;
              }
              break;
            case SettlementIncomeType.douyin_cps:
              if (!element.income_amount) {
                income_error_message = '抖音CPS收入不能为0，请重新上传文件';
                income_ok = false;
              }
              break;
            case SettlementIncomeType.xingtu:
              if (!element.income_amount) {
                income_error_message = '星图收入不能为0，请重新上传文件';
                income_ok = false;
              }
              break;
            case SettlementIncomeType.pit_fee:
            case SettlementIncomeType.shangguang:
            case SettlementIncomeType.other: {
              const not_complete = element.company_list?.find(
                el =>
                  (!el.company_name && el.income_amount) ||
                  (el.company_name && !el.income_amount) ||
                  (!el.company_name && !el.income_amount),
              );
              if (
                not_complete ||
                (element.type === SettlementIncomeType.pit_fee &&
                  (element.company_list ?? []).length === 0)
              ) {
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
        if (!methods.settlementDetailToAdjustCompanyValidate()) {
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
      // fillForm: () => {
      //     ShowAdjustInfo.value = true;
      // },
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
        const formData = new FormData();
        const filename = value.file.name;
        formData.append('file', value.file, filename);

        formData.append('settlement_id', String(cloneSettlement.value?.id));

        methods.setLoadingAndText('upload');
        const res = await UploadKolCompanyFile(formData);
        methods.setLoadingAndText('none');
        if (res?.data.success) {
          ctx.root.$message.success('上传成功');
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
      //  保存结算数据
      saveSettlementRequest: async (option: SettlementOneStepOperationEnum) => {
        if (option === SettlementOneStepOperationEnum.next && !methods.checkDataForSave()) {
          return;
        }
        const params: SettlementDataUnionParams = {
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
            company_info_list: ((dataForm.value.company_info_list as CompanyInfo[]) ?? []).filter(
              item => {
                return (
                  item.type &&
                  (item.type !== SettlementIncomeType.pit_fee ||
                    (item.type === SettlementIncomeType.pit_fee &&
                      (item.company_list ?? []).length > 0))
                );
              },
            ),
            nofind: [],
          },
        };
        methods.setLoadingAndText('save');
        const res = await saveSettlementDataService(params, BusinessTypeEnum.mcn);
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
      addSettlementDetail: () => {
        dataForm.value.company_info_list?.unshift(initCompanyData());
      },
      delSettlementDetail: (index: number) => {
        dataForm.value.company_info_list?.splice(index, 1);
      },

      settlementDetailToAdjustCompanyValidate: () => {
        // 1. 首先找到当前要删除的 结算明细 所包含的公司在手工调整中有选择的 公司
        let filterCompanies = dataForm.value.adjustInfo
          .map(el => el.company_name)
          .filter(el => el !== undefined && el !== '');
        if (filterCompanies.length) {
          filterCompanies = Array.from(new Set(filterCompanies));
          let count = 0;
          filterCompanies.forEach((company_name, index) => {
            dataForm.value.company_info_list?.forEach(settlementDetailEl => {
              if (count === index) {
                if (settlementDetailEl.company_name) {
                  if (company_name === settlementDetailEl.company_name) {
                    count += 1;
                  }
                } else {
                  const finder = settlementDetailEl.company_list?.find(el => {
                    return el.company_name === company_name;
                  });
                  if (finder) {
                    count += 1;
                  }
                }
              }
            });
          });
          if (count !== filterCompanies.length) {
            // 请先删除商广/其他收入下面公司关联的手工调账，再删除商广/其他收入~
            // switch (settlementDetail.type) {
            //   case SettlementIncomeType.shangguang:
            //     ctx.root.$message.error('请先删除商广收入下面公司关联的手工调账，再删除商广收入~');
            //     break;
            //   case SettlementIncomeType.other:
            //     ctx.root.$message.error('请先删除其他收入下面公司关联的手工调账，再删除其他收入~');
            //     break;
            //   case SettlementIncomeType.pit_fee:
            //     ctx.root.$message.error('请先删除坑位费下面公司关联的手工调账，再删除坑位费~');
            //     break;
            //   default:
            //     ctx.root.$message.error('请先删除该公司手工调账，再删除公司结算信息~');
            //     break;
            // }
            // 手工调账中部分公司在左边没有对应结算数据，请删除后再进行下一步操作。
            ctx.root.$message.warning(
              '手工调账中部分公司在左边没有对应结算数据，请删除后再进行下一步操作',
            );
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      },
    };

    onMounted(() => {
      originDataForm.value = deepClone(dataForm.value) as MCNDouuyinForm;
    });

    return {
      selectedCompanyList,
      total_settlement_amount,
      loading,
      loadingText,
      dataForm,
      selectedIncomeTypeList,
      ...methods,
    };
  },
});
