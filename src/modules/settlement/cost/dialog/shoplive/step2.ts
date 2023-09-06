// /** 店播 成本结算 step2 */
// import { computed, defineComponent, inject, ref, SetupContext, watch } from '@vue/composition-api';
// import type { Ref } from '@vue/composition-api';
// import Step2Layout from '@/modules/settlement/component/step2.cost.layout.vue';
// import TgAdjustAccountForm from '@/modules/settlement/component/AdjustAccount.vue';
// import CardLayout from '@/modules/settlement/component/card.layout.vue';
// import {
//   AdjustInfo,
//   KolSalaryInfoForm,
//   SalaryType,
//   Settlement,
//   SettlementCostDataUnionParams,
//   SettlementStep,
//   ShopLiveCostSettlementForm,
// } from '@/types/tiange/finance/settlement';
// import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
// import { set, useDebounceFn, useIntersectionObserver } from '@vueuse/core';
// import { downloadFileFromBlob, parse, wait as AwaitFn } from '@/utils/func';
// import { saveSettlementCostDataService } from '@/services/finance/settlement';
// import { Decimal2String, formatAmountWithoutPrefix } from '@/utils/string';
// import {
//   calcBasicSalaryAddCommission,
//   calcHourlyPayment,
//   calcMaxBasicSalaryAndCommission,
//   calcShopLiveCostTotalAmount,
// } from './utils';
// import { LiveProject } from '@/types/tiange/live.project';
// import { ElForm } from 'element-ui/types/form';
// import { getToken } from '@/utils/token';
// import Decimal from 'decimal.js';

// /** 虚拟列表功能启动的最少需要数据量 */
// const VIRTUAL_LIST_MIN = 20;

// export const commonForm = (ctx: SetupContext) => {
//   /** 下载文件 */
//   const downloadFileHandler = (urlString: string) => {
//     fetch(urlString).then(async response => {
//       const result = response.clone();
//       try {
//         const data = await result.json();
//         ctx.root.$message.error(data.message);
//       } catch {
//         if (response.status === 200) {
//           const data = await response.blob();
//           const filename = 'kol_schedule.xlsx';
//           downloadFileFromBlob(data, filename);
//         } else {
//           ctx.root.$message.error('下载失败');
//         }
//       }
//     });
//   };
//   return { downloadFileHandler };
// };

// const getValidAdjustInfoList = (data: ShopLiveCostSettlementForm) => {
//   if (data.adjust_info && data.adjust_info?.length >= 1) {
//     const adjust_info_list = data.adjust_info.filter(el => el.adjust_reason || el.adjust_amount);
//     if (adjust_info_list.length > 0) {
//       return adjust_info_list;
//     }
//   }
//   return [];
// };

// const getPositiveRateNumber = (value: string) => {
//   return (/100(?:\.0{0,2})?|(?:[1-9]?\d)(?:\.\d{0,2})?/u.exec(
//     value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
//   ) ?? [''])[0];
// };

// const getPositivePriceNumber = (value: string) => {
//   const result = (/(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?/u.exec(
//     value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
//   ) ?? [''])[0];
//   return result;
// };

// export default defineComponent({
//   name: 'TgCostSettlementDataForm',
//   components: {
//     Step2Layout,
//     TgAdjustAccountForm,
//     CardLayout,
//   },
//   props: {},
//   setup(props, ctx) {
//     const saveLoading = ref(false);
//     const project =
//       inject<Ref<LiveProject | undefined>>('project') ?? ref<LiveProject | undefined>(undefined);

//     const { downloadFileHandler } = commonForm(ctx);

//     const SettlementTypeOptions = [
//       { label: '时薪', value: 1 },
//       { label: '底薪/提成(取高的)', value: 2 },
//       { label: '底薪+提成', value: 3 },
//     ];

//     const formRules = ref({
//       sale_amount: [{ required: true, message: '请输入净销额', trigger: 'change' }],
//       base_salary: [{ required: true, message: '请输入底薪', trigger: 'change' }],
//       commission_rate: [{ required: true, message: '请输入提成比例', trigger: 'change' }],
//       unit_price: [{ required: true, message: '请输入单价', trigger: 'change' }],
//       live_duration: [{ required: true, message: '请输入开播时长', trigger: 'change' }],
//     });

//     /** 表单引用 */
//     const formRef = ref<null | ElForm>(null);
//     const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);

//     const DataForm = ref<ShopLiveCostSettlementForm>({
//       adjust_info: [],
//       kol_salary_infos: [],
//     });

//     const calcOneKolSalary = (kol_info: KolSalaryInfoForm) => {
//       let calc_salary = '0';
//       if (kol_info.salary_type === SalaryType.Hourly) {
//         calc_salary = calcHourlyPayment(kol_info.unit_price, kol_info.live_duration);
//       } else if (kol_info.salary_type === SalaryType.Basic_or_commision) {
//         calc_salary = calcMaxBasicSalaryAndCommission(
//           kol_info.base_salary,
//           kol_info.sale_amount,
//           kol_info.commission_rate,
//         );
//       } else if (kol_info.salary_type === SalaryType.Basic_and_commision) {
//         calc_salary = calcBasicSalaryAddCommission(
//           kol_info.base_salary,
//           kol_info.sale_amount,
//           kol_info.commission_rate,
//         );
//       }

//       const salary_str = formatAmountWithoutPrefix(calc_salary) + ' 元';
//       return { ...kol_info, salary: calc_salary, salary_str: salary_str };
//     };

//     const ComputedKolData = computed(() => {
//       return DataForm.value.kol_salary_infos.map(el => calcOneKolSalary(el));
//     });

//     /** 总结算金额 */
//     const total_amount = computed(() =>
//       calcShopLiveCostTotalAmount(
//         ComputedKolData.value.map(el => el.salary),
//         DataForm.value.adjust_info,
//       ),
//     );
//     const total_amount_str = computed(() => Decimal2String(new Decimal(total_amount.value)));

//     const getKolScheduleFile = (kol_id: string, settlement_id: string) => {
//       const url = `/api/settlement/download_kol_schedule?settlement_id=${settlement_id}&kol_id=${kol_id}&Authorization=${getToken()}`;
//       return url;
//     };

//     /** 下载排班 */
//     const downloadKolScheduleFile = (url: string) => {
//       downloadFileHandler(url);
//     };

//     const CommissionRateInput = (value: string, index: number) => {
//       const result = getPositiveRateNumber(value);
//       DataForm.value.kol_salary_infos[index].commission_rate = result;
//     };

//     const UnitPriceInput = (value: string, index: number) => {
//       const result = getPositivePriceNumber(value);
//       DataForm.value.kol_salary_infos[index].unit_price = result;
//     };

//     const BaseSalaryInput = (value: string, index: number) => {
//       const result = getPositivePriceNumber(value);
//       DataForm.value.kol_salary_infos[index].base_salary = result;
//     };

//     const SaleAmountInput = (value: string, index: number) => {
//       const result = getPositivePriceNumber(value);
//       DataForm.value.kol_salary_infos[index].sale_amount = result;
//     };

//     const LiveDurationInput = (value: string, index: number) => {
//       const result = (/(?:0|[1-9]\d{0,5})(?:\.[05]{0,1})?/u.exec(
//         value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
//       ) ?? [''])[0];

//       DataForm.value.kol_salary_infos[index].live_duration = result;
//     };

//     const RawFillForm = ref<Settlement | undefined>(undefined);

//     /** 初始化 */
//     const RawDataForm = ref<ShopLiveCostSettlementForm>({
//       adjust_info: [],
//       kol_salary_infos: [],
//     });

//     const KolSelectOptions = ref<{ id: string; name: string }[]>([]);

//     /** 填充进行时 */
//     const fill_form_loading = ref(false);

//     const schedule_file_list = ref<{ name: string; url: string }[]>([]);

//     const loadFormData = (data: Settlement) => {
//       const settlement_id = settlement.value ? settlement.value.id.toString() : '-1';

//       const kol_list = data.kol_salary_infos.map(el => {
//         schedule_file_list.value.push({
//           name: el.kol_name ? el.kol_name.toString() : '--',
//           url: getKolScheduleFile(el.kol_id.toString(), settlement_id),
//         });

//         const salary_type = el.salary_type ? el.salary_type : SalaryType.Hourly;

//         return {
//           id: el.id.toString(),
//           kol_id: el.kol_id.toString(),
//           kol_name: el.kol_name,
//           live_duration: el.live_duration.toString(),
//           salary: el.salary.toString(),
//           unit_price: el.unit_price.toString(),
//           salary_type: salary_type,
//           sale_amount: el.sale_amount.toString(),
//           base_salary: el.base_salary.toString(),
//           commission_rate: el.commission_rate.toString(),
//         };
//       });

//       KolSelectOptions.value = kol_list.map(el => {
//         return { id: el.kol_id, name: el.kol_name };
//       });

//       DataForm.value.adjust_info = data.adjust_info;
//       DataForm.value.kol_salary_infos = kol_list;

//       RawDataForm.value.adjust_info = data.adjust_info;
//       RawDataForm.value.kol_salary_infos = parse(kol_list);
//     };

//     /** 虚拟列表内元素引用 */
//     const target = ref<Array<HTMLElement | null>>([]);
//     /** 虚拟列表内元素是否可见 */
//     const targetIsVisible = ref<boolean[]>([]);
//     /** 暂存的 stop 函数列表 */
//     const stopList = ref<Array<() => void>>([]);

//     /** 过滤出的可见元素的索引 */
//     const targetIsVisibleFiltered = computed(() =>
//       targetIsVisible.value
//         .map((visible, index) => ({ index, visible }))
//         .filter(el => el.visible)
//         .map(el => el.index),
//     );

//     const intersectionObserverReadyList = ref<boolean[]>([]);

//     watch(
//       () => target.value,
//       next => {
//         // 先清除旧的
//         stopList.value.forEach(stop => {
//           stop();
//         });

//         if (next.length > VIRTUAL_LIST_MIN) {
//           // * 初始化元素是否可见
//           // * 初始的前3个元素均默认设为可见
//           targetIsVisible.value = new Array(DataForm.value.kol_salary_infos.length)
//             .fill(false)
//             .map((el, index) => (index <= 3 ? true : el));

//           target.value.forEach((el, index) => {
//             window.setTimeout(() => {
//               const { stop } = useIntersectionObserver(
//                 computed(() => el),
//                 ([{ isIntersecting }], _observerElement) => {
//                   set(targetIsVisible.value, index, isIntersecting);
//                   intersectionObserverReadyList.value.push(true);
//                 },
//               );
//               stopList.value.push(stop);
//             }, 17);
//           });
//         } else {
//           set(fill_form_loading, false);
//         }
//       },
//     );

//     const loadingKolText = computed(
//       () =>
//         `正在加载主播数据(${intersectionObserverReadyList.value.length}/${target.value.length})`,
//     );

//     watch(
//       () => intersectionObserverReadyList.value.length,
//       next => {
//         if (target.value.length === next) {
//           set(fill_form_loading, false);
//         }
//       },
//     );

//     /**
//      * 临近元素开启预渲染，差不多控制在10条左右
//      */
//     const CanItemPreview = (index: number) => {
//       const [first] = targetIsVisibleFiltered.value;
//       const last = targetIsVisibleFiltered.value[targetIsVisibleFiltered.value.length - 1];

//       return (first - 4 <= index && index < first) || (last < index && index <= last + 4);
//     };

//     /**
//      * 虚拟列表内元素是否需要渲染
//      * ```
//      * 数据量不超过 VIRTUAL_LIST_MIN 时全部渲染
//      * 或在可视返回内必须渲染
//      * 或属于临近元素，预渲染
//      * ```
//      */
//     const CanItemShow = (index: number) =>
//       DataForm.value.kol_salary_infos.length <= VIRTUAL_LIST_MIN ||
//       targetIsVisible.value[index] ||
//       CanItemPreview(index);

//     const ShowAdjustInfo = ref(false);
//     /** 填充表单数据 */
//     const fillForm = (data: Settlement) => {
//       RawFillForm.value = data;

//       ShowAdjustInfo.value = true;

//       // 数据长度 超过10会有卡顿 使用setTimeout
//       if (data.kol_salary_infos.length > 10) {
//         set(fill_form_loading, true);
//         setTimeout(() => {
//           loadFormData(data);
//           // set(fill_form_loading, false);
//         }, 300);
//       } else {
//         loadFormData(data);
//       }
//     };

//     /** 手工调账数据变更 */
//     const onAdjustAccountDataChange = (adjust_info: AdjustInfo[]) => {
//       DataForm.value.adjust_info = adjust_info;
//     };

//     const getSubmitData = (data: ShopLiveCostSettlementForm) => {
//       const id = RawFillForm.value?.id ?? -1;
//       const payload: SettlementCostDataUnionParams = {
//         id: id,
//         total_settle_amount: total_amount.value,
//         kol_adjust_infos: data.adjust_info,
//         kol_salary_infos: ComputedKolData.value,
//       };

//       return payload;
//     };

//     const checkFormData = (jump_next = true) => {
//       if (
//         ComputedKolData.value.some(
//           el =>
//             ![
//               SalaryType.Hourly,
//               SalaryType.Basic_or_commision,
//               SalaryType.Basic_and_commision,
//             ].includes(el.salary_type),
//         )
//       ) {
//         return '请选择结算方式';
//       }

//       const form_adjust_info_list = ref<AdjustInfo[]>([]);

//       if (DataForm.value.adjust_info && DataForm.value.adjust_info?.length >= 1) {
//         const adjust_info_list = DataForm.value.adjust_info.filter(
//           el => el.kol_name || el.adjust_reason || el.adjust_amount,
//         );
//         if (adjust_info_list.some(el => /^(?:\+|-)?0?(?:\.0{0,2})?$/u.test(el.adjust_amount))) {
//           return '请输入正确的调整金额';
//         }
//         if (adjust_info_list.some(el => el.adjust_amount === '0')) {
//           ctx.root.$message.error('调整金额不能为0');
//           return '调整金额不能为0';
//         }
//         if (
//           !adjust_info_list.every(
//             el =>
//               el.kol_name &&
//               el.kol_name !== '' &&
//               el.adjust_amount &&
//               el.adjust_amount !== '' &&
//               el.adjust_amount !== '-' &&
//               el.adjust_reason,
//           )
//         ) {
//           return '请完善手工调账信息';
//         }

//         if (adjust_info_list.length > 0) {
//           form_adjust_info_list.value = adjust_info_list;
//         }
//       }

//       if (
//         jump_next &&
//         form_adjust_info_list.value &&
//         form_adjust_info_list.value.length === 0 &&
//         ['0', '0.0', '0.00'].includes(total_amount.value ?? '0')
//       ) {
//         return '至少填写一项结算项';
//       }
//       if (jump_next && new Decimal(total_amount.value ?? '0').lte('0')) {
//         return '总结算金额必须大于0';
//       }
//       return;
//     };

//     const clearValidate = () => {
//       setTimeout(() => {
//         formRef.value?.clearValidate?.();
//       }, 100);
//     };

//     /** 提交数据 */
//     const submit = async (jump_next = true, without_check = false) => {
//       if (saveLoading.value) {
//         return;
//       }
//       if (!project.value) {
//         return;
//       }
//       const business_type = project.value.business_type;
//       const result = await new Promise(resolve => {
//         formRef.value?.validate(valid => resolve(valid));
//       });

//       if (!result) {
//         return;
//       }

//       if (!without_check) {
//         const err_msg = checkFormData(jump_next);
//         if (err_msg) {
//           ctx.root.$message.error(err_msg);
//           return;
//         }
//       }

//       const payload = getSubmitData(DataForm.value);
//       payload.step = jump_next ? SettlementStep.step_three : SettlementStep.step_two;
//       payload.kol_adjust_infos = getValidAdjustInfoList(DataForm.value);

//       saveLoading.value = true;
//       const [{ data: response }] = await AwaitFn(
//         500,
//         saveSettlementCostDataService(payload, business_type),
//       );
//       saveLoading.value = false;

//       if (response.success) {
//         if (jump_next) {
//           ctx.emit('next', response.data);
//         }
//         clearValidate();
//       } else {
//         ctx.root.$message.error(response.message ?? '保存失败');
//       }
//       return response;
//     };

//     /** 保存 */
//     const onSaveHandler = useDebounceFn(submit, 200);

//     const prev = async () => {
//       if (isEditModeChanged.value) {
//         const jump_next = false;
//         const without_check = true; // 产品要求 第二步 返回上一步 不检查数据
//         const response = await submit(jump_next, without_check);
//         if (response) {
//           if (response.success) {
//             ctx.emit('prev', response.data);
//           } else {
//             ctx.root.$message.warning(response.message);
//           }
//         }
//       } else {
//         ctx.emit('prev');
//       }
//     };

//     const next = () => {
//       if (isEditModeChanged.value) {
//         onSaveHandler();
//       } else {
//         const jump_next = true;
//         const err_msg = checkFormData(jump_next);
//         if (err_msg) {
//           ctx.root.$message.error(err_msg);
//           return;
//         } else {
//           ctx.emit('next', RawFillForm.value);
//         }
//       }
//     };

//     /** 表单有数据变化 */
//     const isEditModeChanged = computed(() => {
//       return JSON.stringify(RawDataForm.value) !== JSON.stringify(DataForm.value);
//     });

//     const confirmBeforeClose = async () => {
//       return isEditModeChanged.value;
//     };

//     const saveBeforeClose = async () => {
//       const jump_next = false;
//       const without_check = true; // 产品要求 第二步 返回上一步 不检查数据

//       const response = await submit(jump_next, without_check);
//       if (response) {
//         return response.success;
//       } else {
//         return false;
//       }
//     };

//     const skeletonItems = ref([
//       { class: 'a1' },
//       { class: 'b1' },
//       { class: 'c1' },
//       { class: 'c2' },
//       { class: 'c3' },
//       { class: 'd1' },
//     ]);

//     return {
//       formRules,
//       formRef,
//       schedule_file_list,
//       total_amount_str,
//       ShowAdjustInfo,

//       downloadKolScheduleFile,
//       skeletonItems,
//       loadingKolText,
//       target,
//       targetIsVisible,
//       CanItemShow,
//       CanItemPreview,
//       KolSelectOptions,
//       ComputedKolData,
//       total_amount,
//       LiveDurationInput,
//       BaseSalaryInput,
//       SaleAmountInput,
//       CommissionRateInput,
//       UnitPriceInput,
//       SettlementTypeOptions,
//       DataForm,
//       saveLoading,
//       fill_form_loading,
//       onAdjustAccountDataChange,
//       onSaveHandler,
//       fillForm,
//       prev,
//       next,
//       confirmBeforeClose,
//       saveBeforeClose,
//     };
//   },
// });
