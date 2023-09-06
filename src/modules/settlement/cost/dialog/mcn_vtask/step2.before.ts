/*
 * @Brief: v任务- 第二步 - 生成结算单之前
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-06-03 09:40:49
 */
import {
  computed,
  defineComponent,
  inject,
  nextTick,
  onMounted,
  reactive,
  ref,
  Ref,
} from '@vue/composition-api';
import { formatAmount } from '@/utils/string';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import SettlementStep2Layout from '@/modules/settlement/component/step2.cost.layout.vue';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import {
  AdjustInfo,
  Settlement,
  SettlementCostMcnVtaskDataForm,
  SettlementDetailQueryParams,
  SettlementStep,
  SettlementCostMcnTaobaoBeforeSaveParams,
  CompanyInfo,
  SettlementOneStepOperationEnum,
  KOLInfo,
} from '@/types/tiange/finance/settlement';
import { HttpRequestOptions } from 'element-ui/types/upload';
import { deepClone } from '@/utils/tools';
import Decimal from 'decimal.js';
import { getToken } from '@/utils/token';
import {
  GetSettlementDetail,
  ReloadKolCompanyRelationship,
  SaveSettlementCostStep2MCNTaobaoBefore,
  UploadKolCompanyFile,
} from '@/services/finance/settlement';
import { downloadFileFromBlob, wait as AwaitFn } from '@/utils/func';
import TopCard from '@/modules/settlement/component/top.card.vue';
import { Message } from 'element-ui';
import { set } from '@vueuse/core';
import { GetListSettlementCompanies } from '@/services/supplier';
import { AsyncConfirm } from '@/use/asyncConfirm';

export default defineComponent({
  name: 'Step2MCNVTaskBefore',
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
      const cloneSettlement = deepClone(settlement.value) as Settlement;
      return cloneSettlement;
    });
    const dataForm = ref<SettlementCostMcnVtaskDataForm>({
      adjustInfo: cloneSettlement.value?.adjust_info ? cloneSettlement.value?.adjust_info : [],

      companyData: {
        company_info_list: cloneSettlement.value.json_data?.company_info_list
          ? (deepClone(cloneSettlement.value.json_data?.company_info_list) as CompanyInfo[])
          : [],
        nofind: cloneSettlement.value.json_data?.nofind
          ? (deepClone(cloneSettlement.value.json_data?.nofind) as string[])
          : [],
        no_approved: cloneSettlement.value.json_data?.no_approved
          ? (deepClone(cloneSettlement.value.json_data?.no_approved) as string[])
          : [],
      },
    });

    const originDataForm = ref<SettlementCostMcnVtaskDataForm>(
      deepClone(dataForm.value) as SettlementCostMcnVtaskDataForm,
    );
    // 总结算金额 - 因为需要计算，所以单独了出来
    const total_settlement_amount = computed(() => {
      let totalAmount: Decimal = new Decimal(0);
      dataForm.value.adjustInfo?.forEach(item => {
        let adjust_amount = item.adjust_amount ? item.adjust_amount : 0;
        adjust_amount = isNaN(Number(adjust_amount)) ? 0 : adjust_amount;
        totalAmount = new Decimal(adjust_amount).add(totalAmount);
      });
      dataForm.value.companyData?.company_info_list?.forEach(item => {
        let zccb = item.zccb ? item.zccb : 0;
        zccb = isNaN(Number(zccb)) ? 0 : zccb;
        totalAmount = new Decimal(zccb).add(totalAmount);
      });
      return totalAmount.toFixed(2);
    });
    //  达人-机构对应关系下载地址
    const kolCompanyMapUrl = computed(() => {
      return `/api/settlement/download_kol_company_file?kol_type=2&Authorization=${getToken()}`;
    });
    //  手工调账机构选项
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
      //  上一步
      prev: () => {
        if (methods.isModified()) {
          saveSettlementRequest(SettlementOneStepOperationEnum.prev);
        } else {
          ctx.emit('prev');
        }
      },
      //  下一步
      next: () => {
        if ((dataForm.value.companyData?.nofind ?? []).length) {
          onShowNoFindCompanyClick();
        } else {
          saveSettlementRequest(SettlementOneStepOperationEnum.next);
        }
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
      //  保存数据之前的校验，YES：校验通过，否则不通过
      checkDataForSave: () => {
        if (!methods.checkIncomeFile()) {
          return false;
        }
        if (!cloneSettlement.value?.id) {
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
        /*  if ((dataForm.value.companyData?.nofind ?? []).length) {
          ctx.root.$message.warning(
            `有${
              dataForm.value.companyData?.nofind?.length ?? 0
            }名达人没有对应机构，点击“查看明细”可以查看没有对应关系的达人列表`,
          );
          return false;
        }*/
        return true;
      },
      //  检查是否有收入文件
      checkIncomeFile: () => {
        if (!cloneSettlement.value?.income_file) {
          ctx.root.$message.warning('请先在收入结算中上传原始收入文件');
          return false;
        }
        return true;
      },
      // 退款金额修改
      refundAmountInput: (value: string, company: CompanyInfo, kol: KOLInfo) => {
        const newVal = (/(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?/u.exec(
          value.replace(REG_REMOVE_PREFIX_ZERO, ''),
        ) ?? [''])[0];
        if (company && kol) {
          kol.tkje = newVal;
          // company.tkje = newVal;
          company.zccb = methods.companySpendAmount(company);
        }
      },
      // 机构扣点修改
      bucklePointInput: (value: string, company: CompanyInfo, kol: KOLInfo) => {
        const newVal = methods.getPositiveRateNumber(value);
        if (company && kol) {
          kol.jgkd = newVal;
          company.zccb = methods.companySpendAmount(company);
        }
      },
      // 税点修改
      taxPointInput: (value: string, company: CompanyInfo, kol: KOLInfo) => {
        const newVal = methods.getPositiveRateNumber(value);
        if (company && kol) {
          kol.sd = newVal;
          company.zccb = methods.companySpendAmount(company);
        }
      },
      // 支出成本
      companySpendAmount: (company: CompanyInfo) => {
        let amount = new Decimal(0);
        company.excel_data?.forEach(el => {
          const mulLeft = new Decimal(el.income_amount ? el.income_amount : 0)
            .sub(new Decimal(el.spend_amount ? el.spend_amount : 0))
            .sub(new Decimal(el.tkje ? el.tkje : 0));
          const mulRight = new Decimal(100)
            .sub(new Decimal(el.jgkd ? el.jgkd : 0))
            .add(el.sd ? el.sd : 0)
            .div(new Decimal(100));
          amount = amount.add(mulLeft.mul(mulRight).toFixed(2));
        });

        return amount.toFixed(2);
      },
      //  达人数据下载地址
      kolDataUrl: (company: CompanyInfo) => {
        return `/api/settlement/download_settlement_kol_data?settlement_id=${
          cloneSettlement.value?.id
        }&company_name=${company.company_name}&Authorization=${getToken()}`;
      },
      //  校验数据是否有修改
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
      saveBeforeClose: async () => {
        const response = await saveSettlementRequest(SettlementOneStepOperationEnum.close);
        return response;
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
        return formatAmount(amount ? amount : 0, 'None');
      },
      //  上传文件
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
      //  下载达人机构对应关系
      downloadKolCompanyMapFile: () => {
        methods.downloadAPIFileHandler(kolCompanyMapUrl.value, '机构达人对应关系.xlsx');
      },
      //  下载达人数据
      downKolDataFile: (company: CompanyInfo) => {
        methods.downloadAPIFileHandler(
          methods.kolDataUrl(company),
          `${company.company_name}的达人详情.xlsx`,
        );
      },
      //  获取结算数据详情 - 上传达人机构对应关系后调用
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
    //  保存结算数据
    const saveSettlementRequest = async (option: SettlementOneStepOperationEnum) => {
      if (option === SettlementOneStepOperationEnum.next && !methods.checkDataForSave()) {
        return;
      }
      if (option === SettlementOneStepOperationEnum.next) {
        const adjust = dataForm.value.adjustInfo.filter(item => {
          return item.adjust_amount || item.adjust_reason;
        });
        if (adjust.length > 0) {
          const isfirstfind = ref(true);
          adjust.map((item: any) => {
            let itemfind = false;
            dataForm.value.companyData.company_info_list.map((sub: any) => {
              if (sub.company_name === item.company_name) {
                itemfind = true;
              }
            });
            if (itemfind === false) {
              isfirstfind.value = false;
            }
          });
          if (isfirstfind.value === false) {
            const response = onDeleteBtnClick(option);
            return response;
          } else {
            const response = await submitNext(option);
            return response;
          }
        } else {
          const response = await submitNext(option);
          return response;
        }
      } else {
        const response = await submitNext(option);
        return response;
      }
    };
    const submitNext = async (option: SettlementOneStepOperationEnum, is_remove_adjust = false) => {
      if (option !== SettlementOneStepOperationEnum.next && !methods.isModified()) {
        return false;
      }
      const params: SettlementCostMcnTaobaoBeforeSaveParams = {
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
        json_data: {
          nofind: dataForm.value.companyData.nofind ?? [],
          no_approved: dataForm.value.companyData.no_approved ?? [],
          company_info_list:
            (
              deepClone(dataForm.value) as SettlementCostMcnVtaskDataForm
            ).companyData?.company_info_list.map(item => {
              if (item.tkje === '') {
                item.tkje = '0';
              }
              if (item.jgkd === '') {
                item.jgkd = '0';
              }
              if (item.sd === '') {
                item.sd = '0';
              }
              return item;
            }) ?? [],
        },
      };

      methods.setLoadingAndText('save');
      const [{ data: res }] = await AwaitFn(500, SaveSettlementCostStep2MCNTaobaoBefore(params));
      methods.setLoadingAndText('none');
      if (res.success) {
        switch (option) {
          case SettlementOneStepOperationEnum.prev:
            ctx.emit('prev', res.data);
            break;
          case SettlementOneStepOperationEnum.next:
            ctx.emit('next', res.data);
            ctx.root.$message.success(res.message ?? '保存成功');
            break;
          case SettlementOneStepOperationEnum.close:
            if (is_remove_adjust) {
              ctx.emit('setDialogVisible');
            }
            ctx.root.$message.success('保存成功');
            return true;
          default:
            break;
        }
      } else {
        ctx.root.$message.error(res.message ?? '保存失败');
      }
      return false;
    };
    onMounted(() => {
      originDataForm.value = deepClone(dataForm.value) as SettlementCostMcnVtaskDataForm;
      nextTick(() => {
        methods.checkIncomeFile();
      });
    });
    const dialogCompany = reactive({
      form: {} as { company: number },
      options: [] as any[],
      visible: false,
      company: {} as { company_name: string; company_id: number; excel_data: any[] },
      salary_info: {},
      companyIndex: 0,
      salary_index: 0,
      show(company: any, companyIndex: number, salary_info: any, salary_index: any) {
        dialogCompany.company = company;
        dialogCompany.companyIndex = companyIndex;
        dialogCompany.salary_index = salary_index;
        dialogCompany.salary_info = salary_info;
        dialogCompany.form = {
          company: company.company_id,
        };
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
        if (!form.company) {
          Message.error('请选择公司');
          return;
        }
        // 要设置的结算公司
        const targetCompany = dialogCompany.options.find(it => it.id === form.company);
        // 从所有结算公司列表中搜索要更新的结算公司
        const searchCompanyList = dataForm.value.companyData.company_info_list.find(
          it => it.company_id === targetCompany.id,
        );

        // 如果ID没变则不处理
        if (targetCompany.id === dialogCompany.company.company_id) {
          dialogCompany.visible = false;
          return;
          // 如果发生了变化,那先把达人从结算公司中删除
        } else {
          dialogCompany.company.excel_data.splice(dialogCompany.salary_index, 1);
          // 如果删除后没有达人
          if (dialogCompany.company.excel_data.length === 0) {
            dataForm.value.companyData.company_info_list.splice(dialogCompany.companyIndex, 1);
          }
        }

        // 如果没有在列表中找到要更换的结算公司,说明要新增
        if (searchCompanyList === undefined) {
          const modifyCompany = { ...dialogCompany.company };
          modifyCompany.excel_data = [dialogCompany.salary_info];
          modifyCompany.excel_data[0].company_id = targetCompany.id;
          modifyCompany.excel_data[0].company_name = targetCompany.company_name;
          modifyCompany.company_id = targetCompany.id;
          modifyCompany.company_name = targetCompany.company_name;
          dataForm.value.companyData?.company_info_list.splice(
            dialogCompany.companyIndex,
            0,
            modifyCompany as any,
          );
        } else {
          const excel_data: any = dialogCompany.salary_info || {};
          excel_data.company_id = targetCompany.id;
          excel_data.company_name = targetCompany.company_name;
          searchCompanyList.excel_data.push(excel_data);
        }
        set(dataForm.value.companyData, 'company_info_list', [
          ...dataForm.value.companyData.company_info_list,
        ]);
        // set(dialogCompany.company, 'company_id', targetCompany.id);
        // set(dialogCompany.company, 'company_name', targetCompany.company_name);
        dataForm.value.companyData.company_info_list.map((company: any) => {
          company.zccb = methods.companySpendAmount(company);
        });
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
    /** 校验手动调账 */
    const onShowNoFindCompanyClick = async (
      title = '部分达人尚未维护所属公司，继续将不结算其成本，请问是否继续？',
    ) => {
      const result = await AsyncConfirm(ctx, {
        title,
        content: '',
      });
      if (!result) {
        return false;
      }
      saveSettlementRequest(SettlementOneStepOperationEnum.next);
    };
    /** 校验手动调账 */
    const onDeleteBtnClick = async (
      option: any,
      title = '手工调账中部分公司没有对应结算数据，点击确定将自动删除进入下一步，是否继续？',
    ) => {
      const result = await AsyncConfirm(ctx, {
        title,
        content: '',
      });

      if (!result) {
        return false;
      }
      const adjust = dataForm.value.adjustInfo.filter(item => {
        return item.adjust_amount || item.adjust_reason;
      });
      let isfind = false;
      const new_adjust: any = [];
      adjust.map((item: any) => {
        dataForm.value.companyData.company_info_list.map((sub: any) => {
          if (sub.company_name === item.company_name) {
            isfind = true;
          }
        });
        if (isfind === true) {
          new_adjust.push(item);
          isfind = false;
        }
      });
      dataForm.value.adjustInfo = new_adjust;
      const response = submitNext(option, true);
      return response;
    };
    const deleteClick = async (company: any, kol: any, kol_index: number, companyIndex: number) => {
      /* const title = '确定删除' + kol.kol_name + '达人的结算信息吗';
      const result = await AsyncConfirm(ctx, {
        title,
        content: '',
      });

      if (!result) {
        return false;
      }*/
      company.excel_data.splice(kol_index, 1);
      // 如果删除后没有达人
      if (company.excel_data.length === 0) {
        dataForm.value.companyData.company_info_list.splice(companyIndex, 1);
      }
      set(dataForm.value.companyData, 'company_info_list', [
        ...dataForm.value.companyData.company_info_list,
      ]);
      // set(dialogCompany.company, 'company_id', targetCompany.id);
      // set(dialogCompany.company, 'company_name', targetCompany.company_name);
      dataForm.value.companyData.company_info_list.map((company: any) => {
        company.zccb = methods.companySpendAmount(company);
      });
    };
    return {
      deleteClick,
      onShowNoFindCompanyClick,
      onDeleteBtnClick,
      dialogCompany,
      ShowAdjustInfo,
      dataForm,
      loading,
      loadingText,
      kolCompanyMapUrl,
      total_settlement_amount,
      ...methods,
      companyOptions,
    };
  },
});
