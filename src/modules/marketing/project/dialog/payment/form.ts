import {
  computed,
  defineComponent,
  onBeforeMount,
  ref,
  toRefs,
  watch,
  PropType,
  onMounted,
} from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import { getToken } from '@/utils/token';
import { GetSupplierList } from '@/services/company';
import { GetBorrowList, GetPaymentAchievementList } from '@/services/customers';
import {
  QuerySettlementForPayment,
  SavePaymentApplyDialog,
  // QuerySettlementContractForPayment,
} from '@/services/marketing.project';
import { GetContractUid } from '@/services/contract';
import { sleep } from '@/utils/func';
import { Decimal } from 'decimal.js-light';
import { SettlementForPayment } from '@/types/tiange/marketing/project';
import { Settlement } from '@/types/tiange/finance/settlement';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import InvoiceUpload from '@/modules/finance/invoice/dialog/invoice.upload.vue';
import { FinanceInvoiceForPayment } from '@/types/tiange/marketing/project';
import { deepClone } from '@/utils/tools';
import moment from 'moment';
import { InoviceWriteOffStatusEnums } from '@/types/tiange/finance/invoice';
import { BusinessTypeAllOptions, ProjectTypeEnum } from '@/types/tiange/common';
import { usePermission } from '@/use/permission';

import { useBreadcrumb } from '@/modules/live/project/use/breadcrumb';
import { FeiShuDepartment } from '@/types/tiange/live';
import { GetFeishuDepartmentList } from '@/services/live';
import { ElTree } from 'element-ui/types/tree';
interface InvoiceData {
  invoice_image: string;
  invoice_amount_detail: string;
  invoice_date: string;
  invoice_no: string;
  tax_amount: number | string;
  invoice_type: number;
  no_tax: number;
  tax: number | string;
  tax_point: number | string;
  disabled?: boolean;
}

const company_id_str = (id: number) => `company${id}`;

export default defineComponent({
  name: 'paymentDialog',
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: true,
    },
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    projectType: {
      type: Number as PropType<ProjectTypeEnum>,
      required: false,
    },
    edit: {
      type: Boolean,
      required: false,
      default: false,
    },
    info: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
    settlement: {
      type: Object as PropType<Settlement>,
      required: false,
    },
    customerManager: {
      type: String,
      required: false,
    },
  },
  components: {
    InvoiceUpload,
  },
  setup(props, ctx) {
    const queryContractLoading = ref<boolean>(false);
    const saveLoading = ref(false);
    const Auth = computed(() => getToken());
    // const department_name = computed(() => {
    //   return ctx.root.$store.getters['user/getUserInfo'].department_name;
    // });
    const settlementList = ref<SettlementForPayment[]>([]);

    const paymentFormRef = ref<ElForm | undefined>(undefined);

    const InvoiceUploadRef = ref<{ show(): void } | null>(null);

    const permission = usePermission();

    const canIUse = computed(() => {
      let uploadInvoiceBtn = false;

      switch (props.projectType) {
        case ProjectTypeEnum.live:
          uploadInvoiceBtn = permission.shop_live_upload_invoice;
          break;
        case ProjectTypeEnum.local_life:
          uploadInvoiceBtn = permission.local_life_upload_invoice;
          break;
        case ProjectTypeEnum.supply_chain:
          uploadInvoiceBtn = permission.supply_upload_invoice;
          break;
        case ProjectTypeEnum.marketing:
          uploadInvoiceBtn = permission.coop_upload_invoice;
          break;
        case ProjectTypeEnum.common_business:
          uploadInvoiceBtn = permission.common_upload_invoice;
          break;
      }
      return {
        uploadInvoiceBtn,
      };
    });

    const initSettlememt = (dataInit = false): SettlementForPayment => {
      if (!dataInit) {
        return {
          settlement_id: undefined,
          settlement_uid: '',
          settlement_amount: undefined,
          paid_amount: undefined,
          pending_amount: undefined,
          project_name: '',
          company_name: '',
          pay_amount: undefined,
          write_off_amount: 0,
          invoice_info_list: [],
        };
      }
      return {
        settlement_id: props.settlement?.id,
        settlement_uid: props.settlement?.settlement_uid ?? '',
        settlement_amount: props.settlement?.tax_included_amount ?? undefined,
        paid_amount: props.settlement?.paid_amount ?? undefined,
        pending_amount: props.settlement?.pending_amount ?? undefined,
        project_name: props.settlement?.project_name ?? '',
        write_off_amount: props.settlement?.write_off_amount ?? 0,
        pay_amount: undefined,
        company_name: props.settlement?.company_name ?? '',
        invoice_info_list: [],
      };
    };

    const initPaymentForm = () => {
      return {
        expense_type_biz_code: '',
        // department: department_name,
        business_type: '',
        // project_name: '',
        // brand_name: '',
        transfer_amount: '',
        fare_way: '',
        is_back: '',
        achievement_uid: '',
        supplier_id: props.settlement?.company_id
          ? company_id_str(props.settlement.company_id)
          : '',
        collecting_company: '',
        receive_way: 3,
        bank_account: '',
        bank: '',
        name: null,
        alipay_account: null,
        pay_reason: '',
        borrowing_id: '',
        is_contract_signed: '',
        remark: '',
        fileList: [],
        contractList: [],
        invoice_list: [
          {
            invoice_image: '',
            invoice_type: '',
            invoice_no: '',
            invoice_date: '',
            invoice_amount_detail: '',
            tax_amount: '',
            tax_point: '',
            no_tax: '',
            tax: '',
            is_upload: true,
          },
        ],
        contract_uid: '',
        project_feishu_department_id: props.settlement?.project_feishu_department_id,
        project_feishu_department_name: props.settlement?.project_feishu_department_name,
        settlements: [initSettlememt(true)],
        ...toRefs(props.data),
      };
    };

    const paymentForm = ref<any>(initPaymentForm());

    /** 合同列表 */
    const contractList = ref<any>([]);

    /** 项目业绩列表 */
    const achievementList = ref<any>([]);

    /** 所有供应商 */
    const allSupplierName = ref<any>([]);

    /** 管理审批单列表 */
    const borrowList = ref<any>([]);

    // const selectSettlements = ref<SettlementForPayment[]>([]);
    const associateInvoices = computed(() => {
      let invoices: FinanceInvoiceForPayment[] = [];
      paymentForm.value.settlements?.forEach((settlement: SettlementForPayment) => {
        const finder = settlementList.value.find(
          el => el.settlement_id === settlement.settlement_id,
        );
        if (finder?.invoice_info_list?.length) {
          invoices = invoices.concat(finder.invoice_info_list);
        }
      });
      return invoices;
    });
    watch(
      () => paymentForm.value.settlements,
      newVal => {
        paymentForm.value.fileList =
          (newVal || [])
            .filter((el: any) => el.settlement_files)
            .map((el: any) => el.settlement_files)
            ?.flat() || [];
      },
    );
    // watch(
    //   () => paymentForm.value.settlements,
    //   async () => {
    //     console.log('====');
    //     const arr: number[] = [];
    //     paymentForm.value.settlements?.forEach((settlement: SettlementForPayment) => {
    //       const finder = settlementList.value.find(
    //         el => el.settlement_id === settlement.settlement_id,
    //       );
    //       if (finder) {
    //         arr.push(Number(finder.settlement_id));
    //       }
    //     });
    //     console.log(arr);
    //     paymentForm.value.contractList.map((id: string) => {
    //       const index = paymentForm.value.fileList.indexOf(id);
    //       if (index > -1) {
    //         paymentForm.value.fileList.splice(index, 1);
    //       }
    //     });
    //     paymentForm.value.contractList = [];
    //     if (arr.length > 0) {
    //       const res = await QuerySettlementContractForPayment({ settlement_ids: arr.join(',') });
    //       if (res.data.success) {
    //         (res.data.data || []).map((item: { attachment_url_list: any[] | undefined }) => {
    //           (item.attachment_url_list || []).map((sub: { url: string }) => {
    //             paymentForm.value.contractList.push(sub.url);
    //           });
    //         });
    //         paymentForm.value.fileList.push(...paymentForm.value.contractList);
    //       }
    //     }

    //     //  paymentForm.value.fileList.push(res.data.source);
    //   },
    //   {
    //     deep: true,
    //   },
    // );
    const blur = (e: any) => {
      paymentForm.value.invoice_num = e.target.value;
    };

    const getBorrowList = async () => {
      const { data: response } = await GetBorrowList();
      if (response && response.success) {
        borrowList.value = response.data;
      } else {
        ctx.root.$message.error(response.message ?? '请求失败');
      }
    };

    const resetForm = () => {
      paymentForm.value = initPaymentForm();
      achievementList.value = [];
      settlementList.value = [];
      contractList.value = [];

      allSupplierName.value = [];
      borrowList.value = [];
    };

    const paymentFormRules = ref({
      business_type: [{ required: true, message: '请选择业务类型', trigger: ['blur', 'change'] }],
      is_contract_signed: [
        { required: true, message: '请选择是否已签合同', trigger: ['blur', 'change'] },
      ],
      transfer_amount: [
        { required: true, message: '请输入付款金额', trigger: ['blur', 'change'] },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (value === '0') {
              callback(new Error('付款金额必须大于0'));
            } else {
              callback();
            }
          },
          trigger: ['blur', 'change'],
        },
      ],
      fare_way: [{ required: true, message: '请选择票款方式', trigger: ['blur', 'change'] }],
      is_back: [{ required: true, message: '请选择是否已回款', trigger: ['blur', 'change'] }],
      receive_way: [{ required: true, message: '请选择收款方式', trigger: ['blur', 'change'] }],
      supplier_id: [{ required: true, message: '请输入并选择供应商', trigger: ['blur', 'change'] }],
      bank_account: [{ required: true, message: '请至选择银行账号', trigger: ['blur', 'change'] }],
      bank: [
        { required: true, message: '请至供应商管理功能完善信息', trigger: ['blur', 'change'] },
      ],
      name: [
        { required: true, message: '请至供应商管理功能完善信息', trigger: ['blur', 'change'] },
      ],
      alipay_account: [
        { required: true, message: '请至选择支付宝账号', trigger: ['blur', 'change'] },
      ],
      pay_reason: [{ required: true, message: '请输入付款事由', trigger: ['blur', 'change'] }],
    });

    // 搜索获取项目业绩列表
    const getAchievementList = async (keyword: string) => {
      const params = {
        project_id: paymentForm.value.project_id,
        business_type: paymentForm.value.business_type,
        achievement_uid: keyword,
      };
      const { data: response } = await GetPaymentAchievementList(params);
      achievementList.value = response.success ? response.data : [];
    };

    // 搜索获取供应商列表
    const getAllSupplierName = async (keyword: string) => {
      const { data: response } = await GetSupplierList({ keyword, verify_status: 1 });
      allSupplierName.value = response.success ? response.data : [];
      // if (props.edit) {
      //   onSupplierIdChange(props.info.company_id);
      // } else if (props.settlement?.company_id) {
      //   onSupplierIdChange(company_id_str(props.settlement.company_id));
      // }
    };

    const bankAccount = ref<any>([]);
    const alipay = ref<any>([]);

    // 选择具体供应商
    const onSupplierIdChange = (supplier_id: string) => {
      if (!supplier_id) return;
      paymentForm.value.supplier_id = supplier_id;
      const items = allSupplierName.value.filter((item: any) => {
        if (item.id === supplier_id) {
          return item;
        }
      });
      // 获取供应商下的账号信息 && 支付宝信息
      paymentForm.value.bank = '';
      paymentForm.value.bank_account = '';
      paymentForm.value.alipay_account = '';
      paymentForm.value.name = '';
      paymentForm.value.name = items[0] ? items[0].name : '';
      if (items[0] && items[0].gather_account_list && items[0].gather_account_list.length > 0) {
        const accountList = items[0].gather_account_list;
        if (accountList.length === 1 && accountList[0].bank_card_number) {
          paymentForm.value.bank_account = accountList[0].bank_card_number;
          paymentForm.value.bank = accountList[0].bank_of_deposit;
        }
        const bankList = [];
        const aliList = [];
        for (let i = 0; i < accountList.length; i++) {
          if (accountList[i].account_type === 1) {
            bankList.push(accountList[i]);
          } else {
            aliList.push(accountList[i]);
          }
        }
        bankAccount.value = bankList;
        alipay.value = aliList;
      } else {
        bankAccount.value = [];
        alipay.value = [];
      }
    };
    const chooseBankAccount = (bank_card_number: string) => {
      const one = bankAccount.value.filter((item: any) => {
        if (item.bank_card_number === bank_card_number) {
          return item;
        }
      });
      paymentForm.value.bank = one[0].bank_of_deposit;
    };

    const beforeInvoiceUpload = (config: any) =>
      ValidationFileUpload({ image: true, fileSize: 5 })(config);

    const computedTransferAmount = () => {
      let transfer_amount = new Decimal(0);
      for (let num = 0; num < paymentForm.value.settlements.length; num++) {
        if (paymentForm.value.settlements[num].pay_amount !== '') {
          transfer_amount = transfer_amount.add(
            new Decimal(
              paymentForm.value.settlements[num].pay_amount
                ? paymentForm.value.settlements[num].pay_amount
                : 0,
            ),
          );
        }
      }
      paymentForm.value.transfer_amount = transfer_amount.toFixed(2);
    };

    const inputInvoiceNum = (value: string, type: string, index?: number) => {
      const val = value.replace(/[^\d.]+/gu, '').replace(/^0+(?=\d)/gu, '') ?? '';
      const result = /\d+(?:\.\d{0,2})?/gu.exec(val) ?? [''];
      if (type === 'tax_amount' && (index || index === 0)) {
        paymentForm.value.invoice_list[index].tax_amount = result[0];
      } else if (type === 'transfer_amount') {
        paymentForm.value.transfer_amount = result[0];
      }
    };
    /** 发票总额 */
    const invoiceTotalAmount = computed(() => {
      let transfer_amount = 0;
      for (let num = 0; num < paymentForm.value.invoice_list.length; num++) {
        if (paymentForm.value.invoice_list[num].tax_amount !== '') {
          transfer_amount += Number(paymentForm.value.invoice_list[num].tax_amount);
        }
      }
      return transfer_amount;
    });

    const computedTax = (item: InvoiceData, index: number) => {
      if (item.tax_point === '') {
        return false;
      }
      if (item.tax_amount === '') {
        paymentForm.value.invoice_list[index].no_tax = '';
        paymentForm.value.invoice_list[index].tax = '';
        return false;
      }

      const taxRateDecimal = new Decimal(item.tax_point).dividedBy(100);
      const add = taxRateDecimal.plus(1);
      const valueDecimal = new Decimal(item.tax_amount);
      const noTaxDecimal = valueDecimal.dividedBy(add);
      const taxAmountDecimal = noTaxDecimal.times(taxRateDecimal);
      paymentForm.value.invoice_list[index].no_tax = noTaxDecimal.toFixed(2);
      paymentForm.value.invoice_list[index].tax = taxAmountDecimal.toFixed(2);
    };

    const beforeUpload = (config: any) =>
      ValidationFileUpload({ excel: true, file: true, image: true, fileSize: 30 })(config);

    const successHandle = (res: { data: { source: string } }) => {
      paymentForm.value.fileList.push(res.data.source);
    };

    // 抛出关闭事件
    const emitClose = (success = false) => {
      paymentForm.value.project_feishu_department_id = undefined;
      paymentForm.value.project_feishu_department_name = '';
      cb_department_tree.value?.setCheckedKeys([]);
      ctx.emit('update:visible', false);
      ctx.emit('dialog:close', success);
    };

    // 提交form
    const handleDialogSubmit = async () => {
      const result = await new Promise(resolve =>
        (ctx.refs.paymentFormRef as ElForm).validate(result => resolve(result)),
      );

      if (!result) {
        return;
      }

      let pay_amount_error = false;
      paymentForm.value.settlements.forEach((el: SettlementForPayment) => {
        const zeroDecical = new Decimal(0);
        const pay_amount_decimal = new Decimal(el.pay_amount ? el.pay_amount : 0); // 支付金额
        const pending_amount_decimal = new Decimal(el.pending_amount ? el.pending_amount : 0); // 待付金额
        // if (!props.mcn) {
        if (
          pay_amount_decimal.lessThanOrEqualTo(zeroDecical) || // 小于或等于0
          pay_amount_decimal.greaterThan(pending_amount_decimal) // 大于待付金额
        ) {
          pay_amount_error = true;
          return;
        }
        // }
      });
      if (pay_amount_error) {
        ctx.root.$message.warning('本次支付金额需大于0，小于待支付金额');
        return;
      }

      // if (paymentForm.value.fare_way === 1) {
      //   let transfer_amount = paymentForm.value.transfer_amount;
      //   transfer_amount = transfer_amount === '' ? 0 : Number(transfer_amount);
      //   if (transfer_amount !== invoiceTotalAmount.value) {
      //     ctx.root.$message.warning('发票金额和结算单总金额需要一致');
      //     return;
      //   }
      // }

      const payload: any = {
        transfer_amount: paymentForm.value.transfer_amount + '',
        company_id: paymentForm.value.supplier_id,
        collecting_company: paymentForm.value.name,
        bank_of_deposit: paymentForm.value.receive_way === 3 ? paymentForm.value.bank : '',
        bank_card_number: paymentForm.value.receive_way === 3 ? paymentForm.value.bank_account : '',
        remark: paymentForm.value.remark,
        level_three_types: paymentForm.value.receive_way,
        level_two_types: 1,
        collecting_person: paymentForm.value.receive_way === 4 ? paymentForm.value.name : '',
        alipay_account: paymentForm.value.receive_way === 4 ? paymentForm.value.alipay_account : '',
        pay_reason: paymentForm.value.pay_reason,
        approval_type: 1,
        project_id: paymentForm.value.project_id,
        business_type: paymentForm.value.business_type,
        pay_invoice_type: paymentForm.value.fare_way,
        is_contract_signed: paymentForm.value.is_contract_signed,
        borrowing_id: paymentForm.value.is_back ? '' : paymentForm.value.borrowing_id,
        is_back: paymentForm.value.is_back,
        achievement_uid: paymentForm.value.is_back ? paymentForm.value.achievement_uid : '',
        expense_type_biz_code: paymentForm.value.expense_type_biz_code + '',
        pay_invoices: undefined,
        attachment: paymentForm.value.fileList,
        contract_uid: paymentForm.value.contract_uid,
        allocated_department_id: paymentForm.value.project_feishu_department_id,
        settlements: paymentForm.value.settlements.map((el: SettlementForPayment) => {
          return {
            settlement_uid: el.settlement_uid,
            pay_amount: el.pay_amount,
          };
        }),
      };
      // payload.pay_invoices.forEach((v: any) => {
      //   v.invoice_date = v.invoice_date.replace(/\./gi, '-');
      // });
      // if (props.mcn) delete payload.settlements;
      saveLoading.value = true;
      const [{ data: response }, _] = await Promise.all([
        await SavePaymentApplyDialog(payload),
        await sleep(200),
      ]);
      saveLoading.value = false;
      if (response.success) {
        ctx.root.$message.success(response.message);
        ctx.emit('save');
        emitClose();
        if (props.edit) {
          ctx.emit('dialog:reClose');
        }
      } else {
        ctx.root.$message.error(response.message ?? '保存失败');
      }
    };

    const breadcrumb = useBreadcrumb();

    const queryContractRequest = async (kw?: string) => {
      queryContractLoading.value = true;
      let project_type = 1;
      if (
        breadcrumb.isLiveDetail ||
        breadcrumb.isLocalLifeDetail ||
        breadcrumb.isSupplyChainDetail ||
        breadcrumb.isCommonBusinessDetail
      ) {
        project_type = 1;
      } else if (breadcrumb.isCoopDetail) {
        project_type = 2;
      }
      const res = await GetContractUid({
        search: kw,
        only_main: 0,
        project_id: kw || project_type === 2 ? undefined : paymentForm.value.project_id,
        cooperation_id: kw || project_type === 1 ? undefined : paymentForm.value.project_id,
        business_type: kw ? undefined : paymentForm.value.business_type,
        partner_type: 2,
        contract_status: 2,
      });
      queryContractLoading.value = false;
      if (res.data.success) {
        contractList.value = res.data.data.data;
      } else {
        contractList.value = [];
      }
    };

    const resetSettlement = () => {
      const temp_settlements: any[] = [];
      paymentForm.value.settlements.forEach((el: any) => {
        const finder = settlementList.value.find(
          settlement => settlement.settlement_id === el.settlement_id,
        );
        if (finder) {
          temp_settlements.push({
            ...deepClone(finder),
            pay_amount: el.pay_amount,
          });
        }
      });
      paymentForm.value.settlements = temp_settlements;
    };

    const querySettlementForPayment = async () => {
      const res = await QuerySettlementForPayment({
        settlement_id: props.settlement?.id,
        settlement_uid: props.settlement?.settlement_uid ?? '',
        business_type: props.settlement?.business_type ?? '',
      });
      if (res.data.success) {
        settlementList.value = res.data.data;
        resetSettlement();
      }
    };

    const onDeleteSettlement = (index: number) => {
      paymentForm.value.settlements.splice(index, 1);
      computedTransferAmount();
    };
    let isClearDepartment = false;
    const onAddSettlement = () => {
      paymentForm.value.settlements.push(initSettlememt());
      /**  添加多个结算单后清除默认填充的“承担部门”，显示占位符“请选择部门” */
      if (paymentForm.value.settlements.length > 1 && !isClearDepartment) {
        isClearDepartment = true;
        paymentForm.value.project_feishu_department_id = undefined;
        paymentForm.value.project_feishu_department_name = undefined;
      }
    };
    const onSettlementUidChanged = (val: string, index: number) => {
      const findSettlement = settlementList.value.find(el => el.settlement_uid === val);
      paymentForm.value.settlements.splice(index, 1, {
        ...deepClone(findSettlement),
        pay_amount: undefined,
      });
      // settlement.paid_amount = findSettlement?.paid_amount;
      // settlement.pending_amount = findSettlement?.pending_amount;
      // settlement.settlement_amount = findSettlement?.settlement_amount;
      // settlement.pay_amount = findSettlement?.pending_amount;
      computedTransferAmount();
    };

    const settlementUidOptionDisabled = (settlementUid: string, index: number) => {
      let disabled = false;
      paymentForm.value.settlements.forEach((el: SettlementForPayment, elIndex: number) => {
        if (el.settlement_uid === settlementUid) {
          if (index !== elIndex) {
            disabled = true;
            return;
          }
        }
      });
      return disabled;
    };

    const payAmountChanged = (val: string, index: number) => {
      const settlement = paymentForm.value.settlements[index];
      const newVal = (/(?:0|[1-9]\d{0,20})(?:\.\d{0,2})?/u.exec(
        val.replace(REG_REMOVE_PREFIX_ZERO, ''),
      ) ?? [''])[0];
      settlement.pay_amount = newVal;
      computedTransferAmount();
    };

    onBeforeMount(() => {
      if (props.edit) {
        getBorrowList();
        queryContractRequest();
        querySettlementForPayment();
        getAllSupplierName(props.info.collecting_company);
        paymentForm.value.transfer_amount = props.info.transfer_amount;
        paymentForm.value.is_contract_signed = props.info.is_contract_signed;
        paymentForm.value.fare_way = props.info.pay_invoice_type;
        paymentForm.value.is_back = props.info.is_back;
        paymentForm.value.achievement_uid = props.info.achievement_uid;
        paymentForm.value.expense_type_biz_code =
          props.info.expense_type_biz_code ||
          props.info.approval_detail.expense_type_biz_code ||
          '';
        paymentForm.value.supplier_id = props.info.company_id;
        paymentForm.value.receive_way = props.info.level_three_types;
        paymentForm.value.bank_account = props.info.bank_card_number || '';
        paymentForm.value.bank = props.info.bank_of_deposit || '';
        // paymentForm.value.name = props.info.collecting_person;
        paymentForm.value.name = props.info.collecting_company;
        paymentForm.value.alipay_account = props.info.alipay_account;
        paymentForm.value.pay_reason = props.info.pay_reason;
        paymentForm.value.borrowing_id = props.info.borrowing_id;
        paymentForm.value.invoice_list = props.info.invoices;
        paymentForm.value.remark = props.info.remark;
        paymentForm.value.fileList = [...(props.info.attachment || [])];
        paymentForm.value.contractList = [];
        paymentForm.value.contract_uid = props.info.contract_uid;
        paymentForm.value.settlements = props.info.settlements ?? [];
        paymentForm.value.project_id = props.info.project_id;
        paymentForm.value.invoice_list.forEach((el: InvoiceData, index: number) => {
          computedTax(el, index);
        });
        // if (!props.mcn) {
        computedTransferAmount();
        // } else {
        //   paymentForm.value.transfer_amount = props.info.transfer_amount.toFixed(2);
        // }
      }
    });

    watch([() => props.visible, () => props.settlement], ([newVisible, newSettlement]) => {
      if (!newVisible) {
        resetForm();
        setTimeout(() => {
          paymentFormRef.value?.clearValidate();
        }, 300);
      } else {
        getBorrowList();
        queryContractRequest();
        querySettlementForPayment();
        resetForm();
        const tempSettlement = newSettlement as Settlement;
        // if (tempSettlement.company_id && tempSettlement.company_name) {
        getAllSupplierName(tempSettlement.company_name).then(() => {
          const hasFind = allSupplierName.value.some(
            (it: any) => it.id === paymentForm.value.supplier_id,
          );
          if (!hasFind) {
            paymentForm.value.supplier_id = '';
          } else {
            onSupplierIdChange(paymentForm.value.supplier_id);
          }
        });
        paymentForm.value.fileList = [...(newSettlement?.settlement_files || [])];
        // onSupplierIdChange(`company${tempSettlement.company_id}`)
        // }
      }
      computedTransferAmount();
    });
    watch(
      () => paymentForm.value.invoice_list,
      () => {
        if (paymentForm.value.fare_way === 1) {
          paymentForm.value.transfer_amount = invoiceTotalAmount.value.toFixed(2);
        }
      },
      {
        deep: true,
      },
    );

    watch(
      () => paymentForm.value.is_back,
      val => {
        if (val === 0) {
          paymentForm.value.achievement_uid = '';
        }
      },
    );

    watch(
      () => paymentForm.value.is_contract_signed,
      val => {
        if (val === 0) {
          paymentForm.value.contract_uid = '';
        }
      },
    );

    const onInvoiceUpload = (settlement: SettlementForPayment) => {
      if (
        paymentForm.value.fare_way === 1 &&
        canIUse.value.uploadInvoiceBtn &&
        (settlement.write_off_status === InoviceWriteOffStatusEnums.write_off_none ||
          settlement.write_off_status === InoviceWriteOffStatusEnums.write_off_part)
      ) {
        console.log(settlement, props, 'settlement');

        (InvoiceUploadRef.value as any).show(
          {
            id: settlement.settlement_id,
            company: settlement.company_name,
            business_type: props.data.business_type,
          },
          2,
          props.projectType,
        );
      }
    };

    const invoice_date = (date: number) => {
      return moment(date * 1000).format('yyyy.MM.DD');
    };

    const pay_amount_check = (_: any, value: string, callback: any, index: number) => {
      const settlement = paymentForm.value.settlements[index];

      const pending_amount_deciaml = new Decimal(
        settlement.pending_amount ? settlement.pending_amount : 0,
      );
      const write_off_amount_decimal = new Decimal(
        settlement.write_off_amount ? settlement.write_off_amount : 0,
      );

      let min_amount_decimal = undefined;
      if (paymentForm.value.fare_way === 1) {
        min_amount_decimal = pending_amount_deciaml.greaterThan(write_off_amount_decimal)
          ? write_off_amount_decimal
          : pending_amount_deciaml;
      } else {
        min_amount_decimal = pending_amount_deciaml;
      }

      const pay_amount_deciaml = new Decimal(value ? value : 0);
      if (value === '' || value === undefined || value === null) {
        return callback(new Error('请输入本次支付金额'));
      } else if (value === '0') {
        return callback(new Error('本次支付金额需大于0'));
      } else if (pay_amount_deciaml.greaterThan(min_amount_decimal)) {
        return callback(new Error(`本次最多支付${min_amount_decimal.toString()}元`));
      }
      return callback();
    };

    const onInvoiceUploadSuccess = () => {
      querySettlementForPayment();
    };
    const business_type_new = computed(() => {
      const type: any = paymentForm.value.business_type || 0;
      return type;
    });

    const cb_department_tree = ref<ElTree<number, FeiShuDepartment> | undefined>(undefined);
    const feishuDepartmentList = ref<FeiShuDepartment[]>([]);
    const getFeishuDepartmentList = async () => {
      const res = await GetFeishuDepartmentList({
        num: 1000,
        page_num: 1,
      });
      const list = res.data.data.data;
      //设置一级选项不让选择
      feishuDepartmentList.value = list;
    };

    const handleCheckChange = (data: FeiShuDepartment) => {
      // console.log('🚀 ~ file: form.ts ~ line 778 ~ handleCheckChange ~ data', data);
      cb_department_tree.value?.setCheckedKeys([]);
      if (paymentForm.value.project_feishu_department_id === data.id) {
        paymentForm.value.project_feishu_department_id = undefined;
        paymentForm.value.project_feishu_department_name = '';
        // is_three_department.value = false;
      } else {
        paymentForm.value.project_feishu_department_id = data.id;
        // is_three_department.value = data.level === 3;
        paymentForm.value.project_feishu_department_name = data.name;
        cb_department_tree.value?.setCheckedKeys([data.id]);
      }
    };

    const default_checked_department_ids = computed(() => {
      return paymentForm.value.project_feishu_department_id
        ? [paymentForm.value.project_feishu_department_id]
        : [];
    });
    const treeProps = {
      label: 'name',
      children: 'sons',
    };

    onMounted(() => {
      getFeishuDepartmentList();
    });

    return {
      expenseTypeList: [
        {
          label: '主播成本',
          value: '999997',
        },
        {
          label: '投放成本',
          value: '999996',
        },
        {
          label: '营销/商广',
          value: '999995',
        },
        {
          label: '其它成本',
          value: '999994',
        },
      ],
      BusinessTypeAllOptions,
      treeProps,
      business_type_new,
      saveLoading,
      emitClose,
      handleDialogSubmit,
      paymentForm,
      paymentFormRules,
      resetForm,
      achievementList,
      getAchievementList,
      borrowList,
      allSupplierName,
      getAllSupplierName,
      onSupplierIdChange,
      beforeUpload,
      successHandle,
      beforeInvoiceUpload,
      Auth,
      blur,
      computedTax,
      inputInvoiceNum,
      queryContractLoading,
      contractList,
      queryContractRequest,
      settlementList,
      onDeleteSettlement,
      onAddSettlement,
      onSettlementUidChanged,
      payAmountChanged,
      paymentFormRef,
      settlementUidOptionDisabled,
      bankAccount,
      chooseBankAccount,
      alipay,
      onInvoiceUpload,
      InvoiceUploadRef,
      associateInvoices,
      invoice_date,
      pay_amount_check,
      onInvoiceUploadSuccess,
      InoviceWriteOffStatusEnums,
      canIUse,
      feishuDepartmentList,
      cb_department_tree,
      handleCheckChange,
      default_checked_department_ids,
    };
  },
});
