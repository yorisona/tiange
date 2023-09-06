/** 店播 成本结算 step2 */
import {
  computed,
  defineComponent,
  inject,
  reactive,
  ref,
  SetupContext,
  watch,
} from '@vue/composition-api';
import type { Ref } from '@vue/composition-api';
import Step2Layout from '@/modules/settlement/component/step2.cost.layout.vue';
import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
import CardLayout from '@/modules/settlement/component/card.layout.vue';
import {
  AdjustInfo,
  KolSalaryInfoForm,
  SalaryType,
  Settlement,
  SettlementCostDataLiveParams,
  SettlementStep,
  ShopLiveCostSettlementBeforeForm,
  CompanyInfo,
  CompanyData,
  SettlementDetailQueryParams,
} from '@/types/tiange/finance/settlement';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import { set, useDebounceFn, useIntersectionObserver } from '@vueuse/core';
import { downloadFileFromBlob, wait as AwaitFn } from '@/utils/func';
import { Message } from 'element-ui';
import {
  GetSettlementDetail,
  ReloadKolCompanyRelationship,
  saveSettlementCostDataService,
} from '@/services/finance/settlement';
import { Decimal2String, formatAmountWithoutPrefix } from '@/utils/string';
import {
  calcBasicSalaryAddCommission,
  calcHourlyPayment,
  calcMaxBasicSalaryAndCommission,
  calcShopLiveCostTotalAmount,
} from './utils';
import { LiveProject } from '@/types/tiange/live.project';
import { ElForm } from 'element-ui/types/form';
import { getToken } from '@/utils/token';
import Decimal from 'decimal.js';
import TopCard from '@/modules/settlement/component/top.card.vue';
import { deepClone } from '@/utils/tools';
import { GetListSettlementCompanies } from '@/services/supplier';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

/** 虚拟列表功能启动的最少需要数据量 */
const VIRTUAL_LIST_MIN = 20;

export const commonForm = (ctx: SetupContext) => {
  /** 下载文件 */
  const downloadFileHandler = (urlString: string) => {
    fetch(urlString).then(async response => {
      const result = response.clone();
      try {
        const data = await result.json();
        ctx.root.$message.error(data.message);
      } catch {
        if (response.status === 200) {
          const data = await response.blob();
          const filename = 'kol_schedule.xlsx';
          downloadFileFromBlob(data, filename);
        } else {
          ctx.root.$message.error('下载失败');
        }
      }
    });
  };
  return { downloadFileHandler };
};

const getValidAdjustInfoList = (data: ShopLiveCostSettlementBeforeForm) => {
  if (data.adjust_info && data.adjust_info?.length >= 1) {
    const adjust_info_list = data.adjust_info.filter(el => el.adjust_reason || el.adjust_amount);
    if (adjust_info_list.length > 0) {
      return adjust_info_list;
    }
  }
  return [];
};

const getPositiveRateNumber = (value: string) => {
  return (/100(?:\.0{0,2})?|(?:[1-9]?\d)(?:\.\d{0,2})?/u.exec(
    value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
  ) ?? [''])[0];
};

const getPositivePriceNumber = (value: string, intNum = 8) => {
  const re = new RegExp(`(?:0|[1-9]\\d{0,${intNum - 1}})(?:\\.\\d{0,2})?`, 'u');
  const result = (re.exec(value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, '')) ?? [
    '',
  ])[0];
  return result;
};

export default defineComponent({
  name: 'TgCostSettlementDataForm',
  components: {
    Step2Layout,
    TgAdjustAccountForm,
    CardLayout,
    TopCard,
  },
  props: {},
  setup(props, ctx) {
    const saveLoading = ref(false);
    const relocationshipLoading = ref<boolean>(false);
    const project =
      inject<Ref<LiveProject | undefined>>('project') ?? ref<LiveProject | undefined>(undefined);

    const { downloadFileHandler } = commonForm(ctx);

    const SettlementTypeOptions = [
      { label: '时薪', value: 1 },
      { label: '底薪/提成(取高的)', value: 2 },
      { label: '底薪+提成', value: 3 },
    ];

    const formRules = ref({
      sale_amount: [{ required: true, message: '请输入净销额', trigger: 'change' }],
      base_salary: [{ required: true, message: '请输入底薪', trigger: 'change' }],
      commission_rate: [{ required: true, message: '请输入提成比例', trigger: 'change' }],
      unit_price: [{ required: true, message: '请输入单价', trigger: 'change' }],
      live_duration: [{ required: true, message: '请输入开播时长', trigger: 'change' }],
    });

    /** 表单引用 */
    const formRef = ref<null | ElForm>(null);
    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);

    const DataForm = ref<ShopLiveCostSettlementBeforeForm>({
      adjust_info: [],
      json_data: {
        company_info_list: [],
        nofind: [],
      },
    });

    const calcOneKolSalary = (kol_info: KolSalaryInfoForm) => {
      let calc_salary = '0';
      if (kol_info.salary_type === SalaryType.Hourly) {
        calc_salary = calcHourlyPayment(kol_info.unit_price, kol_info.live_duration);
      } else if (kol_info.salary_type === SalaryType.Basic_or_commision) {
        calc_salary = calcMaxBasicSalaryAndCommission(
          kol_info.base_salary,
          kol_info.sale_amount,
          kol_info.commission_rate,
        );
      } else if (kol_info.salary_type === SalaryType.Basic_and_commision) {
        calc_salary = calcBasicSalaryAddCommission(
          kol_info.base_salary,
          kol_info.sale_amount,
          kol_info.commission_rate,
        );
      }
      kol_info.salary = calc_salary;
      const salary_str = formatAmountWithoutPrefix(calc_salary) + ' 元';
      return { ...kol_info, salary: calc_salary, salary_str: salary_str };
    };

    const calcAccountAmountForCompany = (company: CompanyInfo) => {
      let amount = new Decimal('0');
      for (const kol of DataForm.value.adjust_info) {
        if (company.kol_salary_infos.find(el => el.kol_name === kol.kol_name)) {
          let adjust_amount = kol.adjust_amount;
          if (isNaN(Number(adjust_amount))) {
            adjust_amount = '0';
          }
          amount = amount.add(new Decimal(adjust_amount ? adjust_amount : '0'));
        }
      }
      return amount;
    };

    const calcOneCompanySalary = (company: CompanyInfo) => {
      const kol_salary_infos = company.kol_salary_infos.map(el => calcOneKolSalary(el));
      const calc_salary = kol_salary_infos.reduce(
        (sum, item) => new Decimal(item.salary ? item.salary : 0).add(sum),
        new Decimal('0'),
      );

      const kolAccountCost = calcAccountAmountForCompany(company);
      let jgfwf = new Decimal(company.fwf ? company.fwf : 0);

      if (`${company.fwfsqfs}` === '1') {
        // 抽成
        if (!isNaN(Number(company.fwfbfb))) {
          jgfwf = new Decimal(Number(company.fwfbfb))
            .div(new Decimal(100))
            .mul(calc_salary.add(kolAccountCost));

          company.fwf = jgfwf.toFixed(2);
        } else {
          jgfwf = new Decimal('0');
        }
      }

      company.jszje = kolAccountCost.add(calc_salary).add(jgfwf).toFixed(2);
      company.zbfwf = calc_salary.add(kolAccountCost).toFixed(2);

      // const tempZJSJE = calc_salary.add(company.fwf);
      // company.zbfwf = calcAccountAmountForCompany(company).add(tempZJSJE).toFixed(2);

      // company.jszje = tempZJSJE.toFixed(2);

      return { ...company, calc_kol_salary_infos: kol_salary_infos };
    };

    const ComputedCompanyData = computed(() =>
      DataForm.value.json_data.company_info_list
        ? DataForm.value.json_data.company_info_list.map(el => calcOneCompanySalary(el))
        : [],
    );

    /** 总结算金额 */
    const total_amount = computed(() => {
      const amount = calcShopLiveCostTotalAmount(
        ComputedCompanyData.value.map(el => el.jszje),
        // DataForm.value.adjust_info,
        undefined,
      );
      // const fwf = ComputedCompanyData.value.reduce(
      //   (sum, item) => (item.fwf ? new Decimal(item.fwf).add(sum) : sum),
      //   new Decimal('0'),
      // );

      return amount.toFixed(2);
    });
    const total_amount_str = computed(() => Decimal2String(new Decimal(total_amount.value)));

    // const getKolScheduleFile = (kol_id: string, settlement_id: string) => {
    //   const url = `/api/settlement/download_kol_schedule?settlement_id=${settlement_id}&kol_id=${kol_id}&Authorization=${getToken()}`;
    //   return url;
    // };

    /** 下载排班 */
    const downloadKolScheduleFile = (company_id: number | string) => {
      const url = `/api/settlement/download_kol_schedule?settlement_id=${
        settlement.value?.id
      }&company_id=${company_id}&Authorization=${getToken()}`;
      downloadFileHandler(url);
    };

    const fwRateInput = (value: string, companyIndex: number) => {
      const result = getPositiveRateNumber(value);
      DataForm.value.json_data.company_info_list[companyIndex].fwfbfb = result;
    };

    const fwfInput = (value: string, companyIndex: number) => {
      const result = getPositivePriceNumber(value, 6);
      DataForm.value.json_data.company_info_list[companyIndex].fwf = result;
    };

    const CommissionRateInput = (value: string, companyIndex: number, kol_index: number) => {
      const result = getPositiveRateNumber(value);
      DataForm.value.json_data.company_info_list[companyIndex].kol_salary_infos[
        kol_index
      ].commission_rate = result;
    };

    const UnitPriceInput = (value: string, companyIndex: number, kol_index: number) => {
      const result = getPositivePriceNumber(value);
      DataForm.value.json_data.company_info_list[companyIndex].kol_salary_infos[
        kol_index
      ].unit_price = result;
    };

    const BaseSalaryInput = (value: string, companyIndex: number, kol_index: number) => {
      const result = getPositivePriceNumber(value);
      DataForm.value.json_data.company_info_list[companyIndex].kol_salary_infos[
        kol_index
      ].base_salary = result;
    };

    const SaleAmountInput = (value: string, companyIndex: number, kol_index: number) => {
      const result = getPositivePriceNumber(value);
      DataForm.value.json_data.company_info_list[companyIndex].kol_salary_infos[
        kol_index
      ].sale_amount = result;
    };

    const LiveDurationInput = (value: string, companyIndex: number, kol_index: number) => {
      const result = (/(?:0|[1-9]\d{0,5})(?:\.[0-9]{0,1})?/u.exec(
        value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
      ) ?? [''])[0];

      DataForm.value.json_data.company_info_list[companyIndex].kol_salary_infos[
        kol_index
      ].live_duration = result;
    };

    const RawFillForm = ref<Settlement | undefined>(undefined);

    /** 初始化 */
    const RawDataForm = ref<ShopLiveCostSettlementBeforeForm>({
      adjust_info: [],
      json_data: {
        nofind: [],
        company_info_list: [],
      },
    });

    const hasDianBo = computed(() => {
      if (
        project.value?.business_type === 2 ||
        project.value?.business_type === 3 ||
        project.value?.business_type === 7 ||
        project.value?.business_type === 8 ||
        project.value?.business_type === 9
      ) {
        return true;
      } else {
        return false;
      }
    });

    const KolSelectOptions = computed(() =>
      DataForm.value.json_data.company_info_list
        ? DataForm.value.json_data.company_info_list
            .map(company => {
              const kol_list = company.kol_salary_infos.map(el => {
                if (hasDianBo.value && el.real_name) {
                  return {
                    id: el.kol_id,
                    name: el.kol_name,
                    real_name: `${el.kol_name}(${el.real_name})`,
                  };
                }
                return { id: el.kol_id, name: `${el.kol_name}` };
              });
              return kol_list;
            })
            .flat()
        : [],
    );

    ref<{ id: string; name: string }[]>([]);

    /** 填充进行时 */
    const fill_form_loading = ref(false);

    // const schedule_file_list = ref<{ name: string; url: string }[]>([]);

    const loadFormData = (data: Settlement) => {
      // const settlement_id = settlement.value ? settlement.value.id.toString() : '-1';

      // const kol_list = data.kol_salary_infos.map(el => {
      //   // schedule_file_list.value.push({
      //   //   name: el.kol_name ? el.kol_name.toString() : '--',
      //   //   url: getKolScheduleFile(el.kol_id.toString(), settlement_id),
      //   // });

      //   const salary_type = el.salary_type ? el.salary_type : SalaryType.Hourly;

      //   return {
      //     id: el.id.toString(),
      //     kol_id: el.kol_id.toString(),
      //     kol_name: el.kol_name,
      //     live_duration: el.live_duration.toString(),
      //     salary: el.salary.toString(),
      //     unit_price: el.unit_price.toString(),
      //     salary_type: salary_type,
      //     sale_amount: el.sale_amount.toString(),
      //     base_salary: el.base_salary.toString(),
      //     commission_rate: el.commission_rate.toString(),
      //   };
      // });

      // KolSelectOptions.value = kol_list.map(el => {
      //   return { id: el.kol_id, name: el.kol_name };
      // });

      DataForm.value.adjust_info = deepClone(data.adjust_info) as AdjustInfo[];
      DataForm.value.json_data = deepClone(data.json_data) as CompanyData;
      if (data.json_data?.company_info_list && data.json_data?.company_info_list.length > 0) {
        const company: any = data.json_data.company_info_list[0];
        if (company.type) {
          DataForm.value.settlement_info_list = JSON.parse(
            JSON.stringify(data.json_data.company_info_list),
          );
          DataForm.value.json_data = {
            company_info_list: company.company_list || [],
            nofind: data.json_data.nofind,
          };
        } else {
          DataForm.value.json_data = deepClone(data.json_data) as CompanyData;
        }
      }
      // DataForm.value.json_data = kol_list;
      RawDataForm.value.adjust_info = deepClone(data.adjust_info) as AdjustInfo[];
      RawDataForm.value.json_data = JSON.parse(JSON.stringify(DataForm.value.json_data));
      // RawDataForm.value.json_data = parse(kol_list);
      if (
        !DataForm.value.json_data.company_info_list ||
        DataForm.value.json_data.company_info_list.length === 0
      ) {
        reloadRelationship();
      }
    };

    /** 虚拟列表内元素引用 */
    const target = ref<Array<HTMLElement | null>>([]);
    /** 虚拟列表内元素是否可见 */
    // const targetIsVisible = ref<boolean[]>([]);
    /** 暂存的 stop 函数列表 */
    const stopList = ref<Array<() => void>>([]);

    /** 过滤出的可见元素的索引 */
    // const targetIsVisibleFiltered = computed(() =>
    //   targetIsVisible.value
    //     .map((visible, index) => ({ index, visible }))
    //     .filter(el => el.visible)
    //     .map(el => el.index),
    // );

    const intersectionObserverReadyList = ref<boolean[]>([]);

    watch(
      () => target.value,
      next => {
        // 先清除旧的
        stopList.value.forEach(stop => {
          stop();
        });

        if (next.length > VIRTUAL_LIST_MIN) {
          // * 初始化元素是否可见
          // * 初始的前3个元素均默认设为可见
          // targetIsVisible.value = new Array(DataForm.value.kol_salary_infos.length)
          //   .fill(false)
          //   .map((el, index) => (index <= 3 ? true : el));

          target.value.forEach((el, index) => {
            window.setTimeout(() => {
              const { stop } = useIntersectionObserver(
                computed(() => el),
                (_, _observerElement) => {
                  // set(targetIsVisible.value, index, isIntersecting);
                  intersectionObserverReadyList.value.push(true);
                },
              );
              stopList.value.push(stop);
            }, 17);
          });
        } else {
          set(fill_form_loading, false);
        }
      },
    );

    const loadingKolText = computed(
      () =>
        `正在加载主播数据(${intersectionObserverReadyList.value.length}/${target.value.length})`,
    );

    watch(
      () => intersectionObserverReadyList.value.length,
      next => {
        if (target.value.length === next) {
          set(fill_form_loading, false);
        }
      },
    );

    const ShowAdjustInfo = ref(false);
    /** 填充表单数据 */
    const fillForm = (data: Settlement) => {
      RawFillForm.value = data;

      ShowAdjustInfo.value = true;

      // 数据长度 超过10会有卡顿 使用setTimeout
      if (data.kol_salary_infos.length > 10) {
        set(fill_form_loading, true);
        setTimeout(() => {
          loadFormData(data);
          // set(fill_form_loading, false);
        }, 300);
      } else {
        loadFormData(data);
      }
    };

    /** 手工调账数据变更 */
    const onAdjustAccountDataChange = (adjust_info: AdjustInfo[]) => {
      DataForm.value.adjust_info = adjust_info;
    };

    const getSubmitData = (data: ShopLiveCostSettlementBeforeForm) => {
      const id = RawFillForm.value?.id ?? -1;
      const new_json_data: any = [
        {
          type: 9,
          company_list: DataForm.value.json_data.company_info_list,
        },
      ];
      const payload: SettlementCostDataLiveParams = {
        id: id,
        total_settle_amount: total_amount.value,
        adjust_info: data.adjust_info,
        json_data: { company_info_list: new_json_data },
      };
      return payload;
    };

    const checkFormData = (jump_next = true) => {
      if (
        DataForm.value.json_data.company_info_list.some(el =>
          el.kol_salary_infos.some(
            kol =>
              ![
                SalaryType.Hourly,
                SalaryType.Basic_or_commision,
                SalaryType.Basic_and_commision,
              ].includes(kol.salary_type),
          ),
        )
      ) {
        return '请选择结算方式';
      }

      const form_adjust_info_list = ref<AdjustInfo[]>([]);

      if (DataForm.value.adjust_info && DataForm.value.adjust_info?.length >= 1) {
        const adjust_info_list = DataForm.value.adjust_info.filter(
          el => el.kol_name || el.adjust_reason || el.adjust_amount,
        );
        if (adjust_info_list.some(el => /^(?:\+|-)?0?(?:\.0{0,2})?$/u.test(el.adjust_amount))) {
          return '请输入正确的调整金额';
        }
        if (adjust_info_list.some(el => el.adjust_amount === '0')) {
          ctx.root.$message.error('调整金额不能为0');
          return '调整金额不能为0';
        }
        if (
          !adjust_info_list.every(
            el =>
              el.kol_name &&
              el.kol_name !== '' &&
              el.adjust_amount &&
              el.adjust_amount !== '' &&
              el.adjust_amount !== '-' &&
              el.adjust_reason,
          )
        ) {
          return '请完善手工调账信息';
        }

        if (adjust_info_list.length > 0) {
          form_adjust_info_list.value = adjust_info_list;
        }
      }

      if (
        jump_next &&
        form_adjust_info_list.value &&
        form_adjust_info_list.value.length === 0 &&
        ['0', '0.0', '0.00'].includes(total_amount.value ?? '0')
      ) {
        return '至少填写一项结算项';
      }
      if (jump_next && new Decimal(total_amount.value).lte('0')) {
        return '总结算金额必须大于0';
      }
      return;
    };

    const clearValidate = () => {
      setTimeout(() => {
        formRef.value?.clearValidate?.();
      }, 100);
    };
    const { business_type } = useProjectBaseInfo();
    /** 提交数据 */
    const submit = async (jump_next = true, without_check = false) => {
      if (saveLoading.value) {
        return;
      }
      if (!project.value) {
        return;
      }
      const new_business_type =
        business_type.value ||
        project.value.business_type ||
        DataForm.value.business_type ||
        E.project.BusinessType.douyin;
      if (jump_next) {
        const result = await new Promise(resolve => {
          formRef.value?.validate(valid => resolve(valid));
        });
        if (!result) {
          return;
        }
        if (!without_check) {
          const err_msg = checkFormData(jump_next);
          if (err_msg) {
            ctx.root.$message.error(err_msg);
            return;
          }
        }
      }
      const payload = getSubmitData(DataForm.value);
      payload.step = jump_next ? SettlementStep.step_three : SettlementStep.step_two;
      payload.adjust_info = getValidAdjustInfoList(DataForm.value);
      saveLoading.value = true;
      const [{ data: response }] = await AwaitFn(
        500,
        saveSettlementCostDataService(payload, new_business_type),
      );
      saveLoading.value = false;

      if (response.success) {
        if (jump_next) {
          ctx.emit('next', response.data);
        }
        clearValidate();
      } else {
        ctx.root.$message.error(response.message ?? '保存失败');
      }
      return response;
    };

    /** 保存 */
    const onSaveHandler = useDebounceFn(submit, 200);

    const prev = async () => {
      if (isEditModeChanged.value) {
        const jump_next = false;
        const without_check = true; // 产品要求 第二步 返回上一步 不检查数据
        const response = await submit(jump_next, without_check);
        if (response) {
          if (response.success) {
            ctx.emit('prev', response.data);
          } else {
            ctx.root.$message.warning(response.message);
          }
        }
      } else {
        ctx.emit('prev');
      }
    };

    const next = () => {
      if ((DataForm.value.json_data?.nofind ?? []).length) {
        ctx.root.$message.warning(
          `有${
            DataForm.value.json_data?.nofind?.length ?? 0
          }名主播没有对应机构，点击“查看明细”可以查看没有对应关系的主播列表`,
        );
        return;
      }
      // if (isEditModeChanged.value) {
      onSaveHandler();
      /* } else {
        const jump_next = true;
        const err_msg = checkFormData(jump_next);
        if (err_msg) {
          ctx.root.$message.error(err_msg);
          return;
        } else {
          ctx.emit('next', RawFillForm.value);
        }
      }*/
    };

    /** 表单有数据变化 */
    const isEditModeChanged = computed(() => {
      return JSON.stringify(RawDataForm.value) !== JSON.stringify(DataForm.value);
    });

    const confirmBeforeClose = async () => {
      return isEditModeChanged.value;
    };

    const saveBeforeClose = async () => {
      const jump_next = false;
      const without_check = true; // 产品要求 第二步 返回上一步 不检查数据

      const response = await submit(jump_next, without_check);
      if (response) {
        return response.success;
      } else {
        return false;
      }
    };

    const skeletonItems = ref([
      { class: 'a1' },
      { class: 'b1' },
      { class: 'c1' },
      { class: 'c2' },
      { class: 'c3' },
      { class: 'd1' },
    ]);

    const diffJsonData = (oldData: CompanyData, newData: CompanyData | undefined) => {
      newData?.company_info_list.forEach(newCompany => {
        const findCompany = oldData.company_info_list.find(oldCompany => {
          return oldCompany.company_id === newCompany.company_id;
        });
        if (findCompany) {
          newCompany.kol_salary_infos.forEach((newKol: any) => {
            const findKol = findCompany.kol_salary_infos.find((oldKol: any) => {
              return newKol.kol_id === oldKol.kol_id;
            });
            if (findKol) {
              newKol.salary_type = findKol.salary_type;
              // newKol.live_duration = findKol.live_duration;
              newKol.unit_price = findKol.unit_price;
              newKol.salary = findKol.salary;
              newKol.base_salary = findKol.base_salary;
              newKol.sale_amount = findKol.sale_amount;
              newKol.commission_rate = findKol.commission_rate;
            }
          });
          newCompany.fwf = findCompany.fwf;
          newCompany.fwfbfb = findCompany.fwfbfb;
          newCompany.jszje = findCompany.jszje;
          newCompany.zbfwf = findCompany.zbfwf;
          newCompany.fwfsqfs = findCompany.fwfsqfs;
        }
      });
      return (
        newData ?? {
          company_info_list: [],
          nofind: [],
        }
      );
    };
    const { isFromLocalLife, isFromSupplyChain } = useProjectBaseInfo();
    //  获取结算详情，在上传主播机构对应关系成功后调用
    const getSettlementDetail = async () => {
      if (!settlement.value?.id) {
        return;
      }
      const id: SettlementDetailQueryParams = { id: settlement.value.id };
      // methods.setLoadingAndText('detail');
      relocationshipLoading.value = true;
      const res = await GetSettlementDetail(
        isFromSupplyChain.value ? 'supply_chain' : isFromLocalLife.value ? 'local_life' : 'live',
        id,
      );
      relocationshipLoading.value = false;
      // methods.setLoadingAndText('none');
      if (res.data.success) {
        const newData = res.data.data;
        DataForm.value.json_data = diffJsonData(DataForm.value.json_data, newData?.json_data);

        // DataForm.value.json_data = newData?.json_data ?? {
        //   company_info_list: [],
        //   nofind: [],
        // };
      } else {
        ctx.root.$message.warning(res.data.message ?? '获取结算详情失败，稍后重试');
      }
    };
    const reloadRelationship = async () => {
      if (!settlement.value?.id) return;
      relocationshipLoading.value = true;
      const res = await ReloadKolCompanyRelationship(`${settlement.value.id}`);
      relocationshipLoading.value = false;
      if (res.data.success) {
        // const json_data: any = res.data.data.json_data ?? undefined;
        // DataForm.value.json_data = json_data || DataForm.value.json_data;
        const newData = res.data.data;
        DataForm.value.json_data = diffJsonData(DataForm.value.json_data, newData?.json_data);
        // await getSettlementDetail();
      } else {
        ctx.root.$message.error(res?.data.message ?? '刷新失败，稍后重试');
      }
    };

    const dialogCompany = reactive({
      form: {} as { company: number },
      options: [] as any[],
      visible: false,
      company: {} as { company_name: string; company_id: number; kol_salary_infos: any[] },
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
        const searchCompanyList = DataForm.value.json_data.company_info_list.find(
          it => it.company_id === targetCompany.id,
        );

        // 如果ID没变则不处理
        if (targetCompany.id === dialogCompany.company.company_id) {
          dialogCompany.visible = false;
          return;
          // 如果发生了变化,那先把主播从结算公司中删除
        } else {
          dialogCompany.company.kol_salary_infos.splice(dialogCompany.salary_index, 1);
          // 如果删除后没有主播
          if (dialogCompany.company.kol_salary_infos.length === 0) {
            DataForm.value.json_data.company_info_list.splice(dialogCompany.companyIndex, 1);
          }
        }

        // 如果没有在列表中找到要更换的结算公司,说明要新增
        if (searchCompanyList === undefined) {
          const modifyCompany = { ...dialogCompany.company };
          modifyCompany.kol_salary_infos = [dialogCompany.salary_info];
          modifyCompany.company_id = targetCompany.id;
          modifyCompany.company_name = targetCompany.company_name;
          DataForm.value.json_data.company_info_list.splice(
            dialogCompany.companyIndex,
            0,
            modifyCompany as any,
          );
        } else {
          searchCompanyList.kol_salary_infos.push(dialogCompany.salary_info as any);
        }

        set(DataForm.value.json_data, 'company_info_list', [
          ...DataForm.value.json_data.company_info_list,
        ]);
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
    const popover: any = ref(null);
    const scrollTop: any = ref(0);
    const oldScrollTop: any = ref(0);
    const isShow: any = ref(false);
    const startShow = () => {
      isShow.value = true;
      window.addEventListener('scroll', handleScroll, true);
    };
    const endShow = () => {
      isShow.value = false;
      window.removeEventListener('scroll', handleScroll, true);
    };
    const handleScroll = (e: any) => {
      scrollTop.value = e.target.scrollTop || 0;
      if (isShow.value) {
        isShow.value = false;
        oldScrollTop.value = e.target.scrollTop || 0;
      }
      const scroll: number = Math.abs(Number(oldScrollTop.value) - Number(scrollTop.value));
      if (scroll > 50) {
        if (scroll > 50) {
          if (popover.value instanceof Array) {
            popover.value[0].showPopper = false;
          } else {
            popover.value.showPopper = false;
          }
          window.removeEventListener('scroll', handleScroll, true);
        }
      }
    };
    return {
      popover,
      startShow,
      endShow,
      getSettlementDetail,
      hasDianBo,
      project,
      dialogCompany,
      formRules,
      formRef,
      total_amount_str,
      ShowAdjustInfo,
      fwRateInput,
      downloadKolScheduleFile,
      skeletonItems,
      loadingKolText,
      target,
      KolSelectOptions,
      ComputedCompanyData,
      total_amount,
      LiveDurationInput,
      fwfInput,
      BaseSalaryInput,
      SaleAmountInput,
      CommissionRateInput,
      UnitPriceInput,
      SettlementTypeOptions,
      DataForm,
      saveLoading,
      fill_form_loading,
      onAdjustAccountDataChange,
      onSaveHandler,
      fillForm,
      prev,
      next,
      confirmBeforeClose,
      saveBeforeClose,
      reloadRelationship,
      relocationshipLoading,
      formatAmountWithoutPrefix,
    };
  },
});
