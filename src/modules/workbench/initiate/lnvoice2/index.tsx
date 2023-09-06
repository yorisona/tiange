/*
 * @Description: 新开票申请
 */
import {
  defineComponent,
  ref,
  computed,
  PropType,
  reactive,
  nextTick,
  watch,
} from '@vue/composition-api';
import FormValidation from '@/modules/supplier/playerManager/common/FormValidation';
import { ElForm } from 'element-ui/types/form';
import { Settlement } from '@/types/tiange/finance/settlement';
import { Company } from '@/types/tiange/company';
import { getPositiveNumber } from '@/utils/string';
import { deepClone } from '@/utils/tools';
import { FeeDetail } from '@/types/tiange/workbench';
import Decimal from 'decimal.js';
import moment from 'moment';
import { formatAmount } from '@/utils/string';
import { useDialog } from '@/use/dialog';
import DialogQuickAdd from './dialogQuickAdd/index.vue';
import { useInvoice } from './use';
import {
  SettlementGetSettlementByShopId,
  SettlementQuerySettlementsLastAchievement,
} from '@/services/company';
import { Message } from 'element-ui';
import { sleep } from '@/utils/func';
import { QuerySettlementInvoiceAmount } from '@/services/finance/settlement';
import { ContractSettlement } from '@/types/tiange/contract';
import { GetContractUid } from '@/services/contract';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import invoiceFiledImage from '@/assets/img/finance/icon-invoice-content-tip.jpg';

const InvoiceSendType = [
  {
    label: '快递寄送',
    value: 1,
  },
  {
    label: '自行送达',
    value: 2,
  },
];
const IsReceived = [
  {
    label: '否',
    value: 0,
  },
  {
    label: '是',
    value: 1,
  },
];
const InvoiceTypeMap = [
  {
    label: '增值税专用发票',
    value: 2,
  },
  {
    label: '增值税普通发票',
    value: 1,
  },
  {
    label: '电子普票',
    value: 3,
  },
  {
    label: '收据',
    value: 4,
  },
];
export default defineComponent({
  props: {
    confirm: {
      type: Function as PropType<(...args: any) => void>,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object as any,
      default: () => {
        return {};
      },
    },
    reload: {
      type: Boolean,
      default: false,
    },
    isFromPrePay: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '开票申请',
    },
  },
  setup(prop, ctx) {
    const invoiceLogic = useInvoice(ctx);
    const visible = ref(false);
    const projectForm: any = ref({
      invoice_amount: 0,
      invoice_type: 2,
      invoice_send_type: 1,
      is_received: 0,
      received_date: undefined,
      achievement_uid: '',
      contract_id: undefined,
      department_id: undefined,
      record_id: undefined,
      project_id: undefined,
    });
    const department_name = computed(() => {
      return ctx.root.$store.getters['user/getUserInfo'].department_name;
    });
    const rules = {
      invoice_type: [{ required: true, message: '请选择发票类型', trigger: 'change' }],
      invoice_send_type: [{ required: true, message: '请选择寄送方式', trigger: 'change' }],
      is_received: [{ required: true, message: '请选择是否收到款项', trigger: 'change' }],
      achievement_uid: [{ required: true, message: '请输入预收编号', trigger: 'blur' }],
      received_date: [{ required: true, message: '请选择收款日期', trigger: 'change' }],
    };
    const companyRequiredRef = computed(() =>
      projectForm.value.invoice_type === 1 ? false : true,
    );
    const companyRules = computed(() => ({
      seller: [{ required: true, message: '请选择销售方', trigger: 'change' }],
      collecting_company: [{ required: true, message: '请选择公司', trigger: 'change' }],
      tax_number: [
        {
          required: companyRequiredRef.value,
          message: '请至客户管理功能完善信息',
          trigger: 'blur',
        },
      ],
      phone: [
        {
          required: companyRequiredRef.value,
          message: '请至客户管理功能完善信息',
          trigger: 'blur',
        },
      ],
      bank_of_deposit: [
        {
          required: companyRequiredRef.value,
          message: '请至客户管理功能完善信息',
          trigger: 'blur',
        },
      ],
      bank_card_number: [
        {
          required: companyRequiredRef.value,
          message: '请至客户管理功能完善信息',
          trigger: 'blur',
        },
      ],
      address: [
        {
          required: companyRequiredRef.value,
          message: '请至客户管理功能完善信息',
          trigger: 'blur',
        },
      ],
      content_type: [{ required: true, message: '请选择开票内容', trigger: 'change' }],
      content_type_other: [{ required: true, message: '请输入开票内容', trigger: 'blur' }],
    }));
    const _basicColumn = ref([
      {
        component: 'el-select',
        prop: 'invoice_type',
        label: '发票类型：',
        children: {
          key: 'invoice_type',
          attrs: {
            placeholder: '请选择发票类型',
          },
        },
        selectOptions: {
          data: InvoiceTypeMap,
          key: 'label',
          val: 'value',
          className: 'send-type-option',
        },
      },
      {
        component: 'el-select',
        prop: 'invoice_send_type',
        label: '寄送方式：',
        children: {
          key: 'invoice_send_type',
          attrs: {
            placeholder: '请选择寄送方式',
          },
        },
        selectOptions: {
          data: InvoiceSendType,
          key: 'label',
          val: 'value',
          className: 'send-type-option',
        },
      },
    ]);
    const _basecReicve = ref([
      {
        component: 'el-select',
        prop: 'is_received',
        label: '收到款项：',
        children: {
          key: 'is_received',
          attrs: {
            placeholder: '请选择是否收到款项',
            disabled: projectForm.value.record_id ? true : false,
          },
        },
        on: {
          change: function (val: number) {
            _basicColumn.value[3] &&
              (_basicColumn.value[3].label = val === 1 ? '收款时间：' : '预计收款时间：');
          },
        },
        selectOptions: {
          data: IsReceived,
          key: 'label',
          val: 'value',
          className: 'send-type-option',
        },
      },
      {
        component: 'el-input',
        prop: 'achievement_uid',
        label: '预收编号：',
        children: {
          key: 'achievement_uid',
          attrs: {
            disabled: true,
          },
        },
      },
      {
        component: 'el-date-picker',
        prop: 'received_date',
        label: '预计收款日期：',
        children: {
          key: 'received_date',
          type: 'date',
        },
      },
    ]);

    const basicColumn = computed(() => {
      const value = [..._basicColumn.value];
      if (openBillType.value !== 1) {
        value.push(...(_basecReicve.value as any));
      }
      return value;
    });
    const companyColumn = ref([
      {
        component: 'el-select-sale',
        prop: 'seller',
        label: '销售方：',
        children: {
          key: 'seller',
          attrs: {
            placeholder: '请选择销售方',
            debounce: 500,
          },
        },
      },
      {
        component: 'el-autocomplete',
        prop: 'collecting_company',
        label: '公司名称：',
        children: {
          key: 'collecting_company',
          attrs: {
            placeholder: '请输入并选择公司名称',
            debounce: 500,
          },
        },
        on: {
          select: (item: Company) => {
            const {
              id,
              company_name,
              // bank_account,
              address,
              // bank_sub_name,
              cw_info_contact_phone,
              tax_id,
              company_account,
            } = item;
            const account_arr = company_account
              ? company_account.filter(item => item.bank_sub_name) || []
              : [];
            const account = account_arr.length > 0 ? account_arr[0] : undefined;
            invoiceLogic.companyQueryParams.value.company_name = company_name;
            invoiceLogic.companyForm.value.company_id = id;
            invoiceLogic.companyForm.value.tax_number = tax_id;
            invoiceLogic.companyForm.value.address = address;
            invoiceLogic.companyForm.value.phone = cw_info_contact_phone;
            invoiceLogic.companyForm.value.bank_of_deposit = account ? account.bank_sub_name : '';
            invoiceLogic.companyForm.value.bank_card_number = account ? account.account_code : '';
            invoiceLogic.companyForm.value.email_address = item?.email;
            validateCompany();
          },
        },
      },
      {
        component: 'el-input',
        prop: 'tax_number',
        label: '纳税人识别号：',
        children: {
          key: 'tax_number',
          attrs: {
            placeholder: '请输入纳税人识别号',
            disabled: true,
          },
        },
      },
      {
        component: 'el-input',
        prop: 'phone',
        label: '电话：',
        children: {
          key: 'phone',
          attrs: {
            placeholder: '请输入电话',
            disabled: true,
          },
        },
      },
      {
        component: 'el-input',
        prop: 'bank_of_deposit',
        label: '开户支行：',
        children: {
          key: 'bank_of_deposit',
          attrs: {
            placeholder: '请输入开户支行',
            disabled: true,
          },
        },
      },
      {
        component: 'el-input',
        prop: 'bank_card_number',
        label: '账号：',
        children: {
          key: 'bank_card_number',
          attrs: {
            placeholder: '请输入账号',
            disabled: true,
          },
        },
      },
      {
        component: 'el-input',
        prop: 'address',
        label: '地址：',
        children: {
          key: 'address',
          attrs: {
            placeholder: '请输入地址',
            disabled: true,
          },
        },
      },
      {
        component: 'el-select-invoice',
        prop: 'content_type',
        label: '开票内容：',
        children: {
          key: 'content_type',
          attrs: {
            placeholder: '请选择开票内容',
            debounce: 500,
          },
        },
        on: {
          select: (item: { value: number; label: string }) => {
            console.log('----', item);
          },
        },
      },
    ]);

    const chargeTableData = ref({
      head: [
        {
          text: '项目',
          required: true,
        },
        {
          text: '结算单编号',
          required: true,
        },
        {
          text: '结算金额',
        },
        {
          text: '开票金额',
          required: true,
        },
      ],
      body: [
        {
          project_id: '',
          project_name: '',
          settlement_no: '',
          settlement_id: undefined as number | undefined,
          settlement_amount: '',
          invoice_amount: '',
          invoice_max_amount: '',
          write_off_amount: '0',
          business_type: 0,
          settlement_no_disabled: true,
        },
      ],
    });

    // 代表是否是 抖音CPS 还是老的; 1:抖音CPS, 其他:老的
    const openBillType = ref<number>(1);
    const set_content_type = () => {
      /*if (finder?.invoice_content) {
        invoiceLogic.companyForm.value.content_type = finder?.invoice_content.includes('信息服务')
          ? 1
          : finder?.invoice_content.includes('信息技术服务')
          ? 2
          : 3;
        if (invoiceLogic.companyForm.value.content_type === 3) {
          invoiceLogic.companyForm.value.content_type_other = finder?.invoice_content;
        }
      } else {
        invoiceLogic.companyForm.value.content_type = undefined;
        invoiceLogic.companyForm.value.content_type_other = '';
      }*/
      nextTick(() => {
        (ctx.refs.contractFormRef as ElForm)?.clearValidate();
      });
    };

    const show = (settlement: Settlement | any | undefined = undefined, openType = 0) => {
      openBillType.value = openType;
      if (prop.isFromPrePay) {
        invoiceLogic.companyForm.value.company_id = settlement.company_id;
        invoiceLogic.companyForm.value.collecting_company = settlement.comapny_name;
        invoiceLogic.companyForm.value.seller = settlement.seller;
        projectForm.value.invoice_amount = formatAmount(
          (settlement.un_invoiced_amount || 0) / 100,
          'None',
        );
        projectForm.value.invoice_type = settlement.level_two_types || 2;
        projectForm.value.invoice_send_type = settlement.invoice_send_type || 1;
        projectForm.value.is_received = settlement.is_received;
        projectForm.value.received_date = settlement.received_date;
        projectForm.value.achievement_uid = settlement.uid;
        projectForm.value.record_id = settlement.id;
        projectForm.value.contract_id = settlement.contract_id || undefined;
        projectForm.value.company_name = settlement.company_name || undefined;
        projectForm.value.company_id = settlement.company_id || undefined;
        invoiceLogic.companyForm.value.collecting_company = settlement.company_name || undefined;
        invoiceLogic.companyForm.value.seller = settlement.seller || undefined;
        invoiceLogic.companyForm.value.company_id = settlement.company_id || undefined;
        invoiceLogic.loadCompany(
          invoiceLogic.companyForm.value.collecting_company,
          (companyList: any[]) => {
            const finder = companyList?.find(
              el => String(el.id) === String(invoiceLogic.companyForm.value.company_id),
            );
            const account = (finder?.company_account || [])?.[0];
            invoiceLogic.companyForm.value.bank_of_deposit = account ? account.bank_sub_name : '';
            invoiceLogic.companyForm.value.bank_card_number = account ? account.account_code : '';
            invoiceLogic.companyForm.value.tax_number = finder?.tax_id || '';
            invoiceLogic.companyForm.value.address = finder?.address || '';
            invoiceLogic.companyForm.value.phone = finder?.cw_info_contact_phone || '';
            invoiceLogic.companyForm.value.email_address = finder?.email || '';
          },
        );
        getContract(settlement.contract_company_name || projectForm.value.company_name);
        visible.value = true;
        nextTick(() => {
          (ctx.refs.formRef as ElForm).clearValidate();
          (ctx.refs.projectFormRef as ElForm).clearValidate();
          (ctx.refs.contractFormRef as ElForm)?.clearValidate();
        });
        return;
      }
      console.log('------', settlement);
      if (settlement) {
        if (openType !== 1) {
          const firstItem = chargeTableData.value.body[0];
          firstItem.project_id = settlement.project_id + '';
          firstItem.project_name = settlement.project_name;
          firstItem.settlement_no = settlement.settlement_uid;
          firstItem.settlement_id = settlement.id || undefined;
          firstItem.settlement_amount = settlement.tax_included_amount
            ? settlement.tax_included_amount + ''
            : '0';
          if (settlement.has_refund_settlement === 1) {
            firstItem.settlement_amount = String(
              (settlement.tax_included_amount as any) - settlement.refund_amount,
            );
          }
          firstItem.write_off_amount = settlement.write_off_amount
            ? settlement.write_off_amount + ''
            : '0';
          firstItem.invoice_amount = new Decimal(firstItem.settlement_amount)
            .sub(new Decimal(firstItem.write_off_amount))
            .toString();
          firstItem.business_type = settlement.business_type;
          firstItem.settlement_no_disabled = false;
          QuerySettlementInvoiceAmount({
            settlement_no: settlement.settlement_uid,
          }).then(res => {
            if (res.data.success) {
              firstItem.invoice_amount = String(res.data.data.surplus_invoice_amount);
              firstItem.invoice_max_amount = String(res.data.data.surplus_invoice_amount);
              projectForm.value.invoice_amount = firstItem.invoice_amount;
              reset_invoice_amount();
            }
          });
        }

        invoiceLogic.companyForm.value.company_id = settlement?.company_id;
        if (openType !== 1) {
          invoiceLogic.companyForm.value.collecting_company =
            settlement?.company_detail?.company_name;
        }
        invoiceLogic.companyForm.value.seller = settlement?.seller;
        invoiceLogic.companyForm.value.content_type =
          settlement?.company_detail?.content_type_other === '信息技术服务费'
            ? 2
            : settlement?.company_detail?.content_type_other === '信息服务费'
            ? 1
            : settlement?.company_detail?.content_type || undefined;

        invoiceLogic.companyForm.value.content_type_other =
          settlement?.company_detail?.content_type_other || '';
        invoiceLogic.companyForm.value.tax_number = settlement?.company_detail?.tax_id;
        invoiceLogic.companyForm.value.address = settlement?.company_detail?.address;
        invoiceLogic.companyForm.value.phone = settlement?.company_detail?.cw_info_contact_phone;
        invoiceLogic.companyForm.value.email_address = settlement?.company_detail?.email;
        // invoiceLogic.companyForm.value.bank_of_deposit = settlement?.company_detail?.bank_sub_name;
        // invoiceLogic.companyForm.value.bank_card_number = settlement?.company_detail?.bank_account;
        invoiceLogic.companyForm.value.remark = undefined;
        invoiceLogic.companyForm.value.attachment = [];
        if (openType !== 1) {
          SettlementQuerySettlementsLastAchievement({
            settlement_ids: settlement.id,
          }).then(res => {
            if (res.data.success) {
              const data = res.data.data;
              if (data.achievement_uid === undefined) {
                projectForm.value.is_received = 0;
                projectForm.value.received_date = null;
              } else {
                projectForm.value.is_received = 1;
                projectForm.value.received_date = data.write_off_time;
                projectForm.value.achievement_uid = data.achievement_uid;
              }
            }
          });
        }
      } else if (prop.edit && prop.data) {
        chargeTableData.value.body = [];
        projectForm.value.invoice_amount = prop.data.invoice_amount;
        projectForm.value.invoice_type = prop.data.level_two_types;
        projectForm.value.invoice_send_type = prop.data.invoice_send_type;
        projectForm.value.is_received = prop.data.is_received;
        projectForm.value.received_date = prop.data.received_date;
        projectForm.value.record_id = prop.data.approval_detail.deposit_received_id || undefined;
        projectForm.value.achievement_uid =
          prop.data.achievement_uid || prop.data.approval_detail.deposit_received_uid;
        projectForm.value.department_id = prop.data.department_id || undefined;
        projectForm.value.department_name = prop.data.department_name || undefined;
        projectForm.value.contract_id = prop.data.approval_detail.contract_id || undefined;
        projectForm.value.project_id = prop.data.project_id || undefined;
        getContract(prop.data.contract_company_name || projectForm.value.company_name || '');

        for (let index = 0; index < prop.data.details.length; index++) {
          const oneDetail = prop.data.details[index];
          const newData = {
            project_id: oneDetail.project_id,
            project_name: oneDetail.project_name,
            settlement_id: oneDetail.settlement_id,
            settlement_no: oneDetail.settlement_no,
            settlement_amount: oneDetail.settlement_amount,
            invoice_amount: oneDetail.invoice_amount,
            invoice_max_amount: '',
            write_off_amount: oneDetail.write_off_amount,
            business_type: oneDetail.business_type,
            settlement_no_disabled: true,
          };
          chargeTableData.value.body.push(newData);
          invoiceLogic.loadSettlementData(oneDetail.project_id, true, (data: any) => {
            const finder = data.find((el: any) => el.id === oneDetail.settlement_id);
            if (finder) {
              newData.settlement_amount = finder.tax_included_amount;
              newData.write_off_amount = finder.write_off_amount;
              newData.invoice_amount = new Decimal(
                newData.settlement_amount ? newData.settlement_amount : 0,
              )
                .sub(new Decimal(newData.write_off_amount ? newData.write_off_amount : 0))
                .toString();
              reset_invoice_amount();
              QuerySettlementInvoiceAmount({
                settlement_no: finder.settlement_uid,
              }).then(res => {
                if (res.data.success) {
                  newData.invoice_amount = String(res.data.data.surplus_invoice_amount);
                  newData.invoice_max_amount = String(res.data.data.surplus_invoice_amount);
                  projectForm.value.invoice_amount = newData.invoice_amount;
                  reset_invoice_amount();
                }
              });
            }
          });
        }

        invoiceLogic.companyForm.value.company_id = prop.data.company_id;
        invoiceLogic.companyForm.value.collecting_company = prop.data.collecting_company;
        invoiceLogic.companyForm.value.seller = prop.data.approval_detail.seller;
        invoiceLogic.companyForm.value.invoice_remark = prop.data.approval_detail.invoice_remark;
        invoiceLogic.companyForm.value.content_type = prop.data.approval_detail.content_type || 3;
        invoiceLogic.companyForm.value.content_type =
          prop.data.approval_detail.content_type_other === '信息技术服务费'
            ? 2
            : prop.data.approval_detail.content_type_other === '信息服务费'
            ? 1
            : settlement?.company_detail?.content_type || 3;
        invoiceLogic.companyForm.value.content_type_other =
          prop.data.approval_detail.content_type_other || '';
        invoiceLogic.companyForm.value.tax_number = prop.data.tax_number;
        invoiceLogic.companyForm.value.address = prop.data.address;
        invoiceLogic.companyForm.value.phone = prop.data.phone;
        invoiceLogic.companyForm.value.email_address = prop.data.approval_detail?.email_address;
        // invoiceLogic.companyForm.value.bank_of_deposit = prop.data.bank_of_deposit;
        // invoiceLogic.companyForm.value.bank_card_number = prop.data.bank_card_number;
        invoiceLogic.companyForm.value.approval_type = prop.data.approval_type;
        invoiceLogic.companyForm.value.remark = prop.data.remark;
        invoiceLogic.companyForm.value.attachment = prop.data.attachment;
      }
      visible.value = true;
      reset_invoice_amount();
      invoiceLogic.loadCompany(
        invoiceLogic.companyForm.value.collecting_company,
        (companyList: any[]) => {
          const finder = companyList?.find(
            el => String(el.id) === String(invoiceLogic.companyForm.value.company_id),
          );
          const account = (finder?.company_account || [])?.[0];
          invoiceLogic.companyForm.value.bank_of_deposit = account ? account.bank_sub_name : '';
          invoiceLogic.companyForm.value.bank_card_number = account ? account.account_code : '';
        },
      );
      nextTick(() => {
        (ctx.refs.formRef as ElForm).clearValidate();
        (ctx.refs.projectFormRef as ElForm).clearValidate();
        (ctx.refs.contractFormRef as ElForm)?.clearValidate();
      });
    };
    const hide = () => {
      // prop.confirm!();
      visible.value = false;
      // 费用明细清空
      chargeTableData.value.body = [
        {
          project_id: '',
          project_name: '',
          settlement_id: undefined,
          settlement_no: '',
          settlement_amount: '',
          invoice_amount: '',
          invoice_max_amount: '',
          write_off_amount: '0',
          business_type: 0,
          settlement_no_disabled: true,
        },
      ];
      // 基本信息清空
      projectForm.value.invoice_amount = 0;
      projectForm.value.invoice_type = 2;
      projectForm.value.invoice_send_type = 1;
      projectForm.value.is_received = 0;
      projectForm.value.received_date = undefined;
      projectForm.value.achievement_uid = '';
      projectForm.value.contract_id = undefined;
      // 开票信息清空
      invoiceLogic.companyForm.value.collecting_company = '';
      invoiceLogic.companyForm.value.seller = '';
      invoiceLogic.companyForm.value.content_type = undefined;
      invoiceLogic.companyForm.value.content_type_other = '';
      invoiceLogic.companyForm.value.tax_number = '';
      invoiceLogic.companyForm.value.address = '';
      invoiceLogic.companyForm.value.phone = '';
      invoiceLogic.companyForm.value.email_address = '';
      invoiceLogic.companyForm.value.bank_of_deposit = '';
      invoiceLogic.companyForm.value.bank_card_number = '';
      invoiceLogic.companyForm.value.approval_type = 4;
      invoiceLogic.companyForm.value.remark = '';
      invoiceLogic.companyForm.value.attachment = [];
      (ctx.refs.projectFormRef as ElForm).resetFields();
      (ctx.refs.formRef as ElForm).resetFields();
    };
    const handleBrandDelete = (key: number) => {
      if (chargeTableData.value.body.length <= 1) return;
      // const price = chargeTableData.value.body[key].invoice_amount;
      chargeTableData.value.body.splice(key, 1);
      // projectForm.value.invoice_amount -= Number(price);
      reset_invoice_amount();
    };
    const handleBrandAdd = () => {
      chargeTableData.value.body.unshift({
        project_id: '',
        project_name: '',
        settlement_id: undefined,
        settlement_no: '',
        settlement_amount: '',
        invoice_amount: '',
        invoice_max_amount: '',
        write_off_amount: '0',
        business_type: 0,
        settlement_no_disabled: true,
      });
    };
    const projectChange = (val: number, key: number, business_type: number) => {
      if (val) {
        chargeTableData.value.body[key].settlement_no_disabled = false;
        invoiceLogic.loadSettlementData(val);
        chargeTableData.value.body[key].settlement_id = undefined;
        chargeTableData.value.body[key].settlement_no = '';
        chargeTableData.value.body[key].settlement_amount = '';
        chargeTableData.value.body[key].invoice_amount = '';
        chargeTableData.value.body[key].write_off_amount = '0';
        chargeTableData.value.body[key].project_id = val + '';
        chargeTableData.value.body[key].business_type = business_type;
      } else {
        invoiceLogic.settlementList.value = [];
        chargeTableData.value.body[key].settlement_no_disabled = true;
      }
    };
    const validateDetail = () => {
      if (!chargeTableData.value.body.length) return Promise.reject();
      const amounts = chargeTableData.value.body.filter(item => item.invoice_amount);
      if (amounts.length === chargeTableData.value.body.length) {
        const details: any = deepClone(chargeTableData.value.body);
        const detailArr = details.map((item: FeeDetail): FeeDetail => {
          const { invoice_amount, project_id, settlement_no, business_type, shop_id } = item;
          return {
            invoice_amount,
            project_id,
            business_type,
            settlement_no,
            shop_id,
          };
        });
        return Promise.resolve(detailArr);
      } else {
        // return Promise.reject(new Error('请完善费用明细'));
        return Promise.reject('请完善费用明细');
      }
    };
    const validateCompany = async () => {
      try {
        await (ctx.refs.projectFormRef as ElForm).validate();
        return Promise.resolve();
      } catch (error: any) {
        return invoiceLogic.companyForm.content_type
          ? invoiceLogic.companyForm.content_type === 3
            ? Promise.reject('请输入开票内容')
            : Promise.reject('请至客户管理功能完善信息')
          : Promise.reject('请选择开票内容');
      }
    };
    const saveForm = async () => {
      try {
        await (ctx.refs.formRef as ElForm).validate();

        await validateCompany();

        projectForm.value.achievement_uid =
          projectForm.value.is_received === 0 && projectForm.value.record_id === undefined
            ? ''
            : projectForm.value.achievement_uid;
        const obj: any = deepClone(projectForm.value);
        if (projectForm.value.record_id === undefined) {
          const details = await validateDetail();
          obj.details = details;
        }
        Object.assign(obj, invoiceLogic.companyForm.value);
        obj.company_id = invoiceLogic.companyForm.value.company_id.toString();
        obj.attachment = invoiceLogic.companyForm.value.attachment.toString();
        if (openBillType.value === 1) {
          obj.is_received = undefined;
          obj.received_date = undefined;
        }
        obj.invoice_amount = String(obj.invoice_amount || '0').replace(/,/g, '');
        await invoiceLogic.submit(obj);
        Promise.resolve()
          .then(() => {
            if (prop.edit) {
              prop.confirm!();
            }
          })
          .then(() => {
            hide();
          })
          .then(() => {
            // 往外部抛出一个成功更新事件
            if (prop.reload) {
              ctx.emit('success');
            }
          });
      } catch (error: any) {
        if (error && error.received_date) {
          const message = error && error.received_date ? error.received_date[0] : '请完善表单信息';
          ctx.root.$message.warning(message);
        } else if (error === '请完善费用明细' || error === '请至客户管理功能完善信息') {
          ctx.root.$message.warning(error);
        }
      }
    };

    const settlementInfoLabelStr = (row: any) => {
      const start_date = moment((row.start_date ?? 0) * 1000).format('YYYY.MM.DD');
      const end_date = moment((row.end_date ?? 0) * 1000).format('YYYY.MM.DD');
      const amount = formatAmount(row.tax_included_amount);
      return `${row.settlement_uid} (${start_date} ~ ${end_date} ${amount})`;
    };

    const reset_invoice_amount = () => {
      const total = chargeTableData.value.body.reduce(
        (total, next: any) =>
          total.add(new Decimal(next.invoice_amount ? next.invoice_amount : '0')),
        new Decimal(0),
      );
      projectForm.value.invoice_amount = total.toString();
      // ((total * 100).toFixed(0) as any) / 100;
    };

    // 快速添加
    const dialogQuickAdd = useDialog({
      title: '快速添加',
      component: DialogQuickAdd,
      class: 'quick-add-dialog',
      width: '879px',
      okText: '确认',
      on: {
        select(row: any[]) {
          let item: any;
          row.forEach((curItem: any) => {
            item = {
              project_id: '',
              project_name: '',
              settlement_no: '',
              settlement_id: '',
              settlement_amount: '',
              invoice_amount: '',
              write_off_amount: '0',
              business_type: 0,
              settlement_no_disabled: true,
              ...curItem,
            };
            item.settlement_amount = curItem?.tax_included_amount;
            item.write_off_amount = curItem?.write_off_amount;
            item.settlement_no = curItem.settlement_uid;
            item.settlement_id = curItem.id;
            if (curItem && curItem.has_refund_settlement === 1) {
              item.settlement_amount = ((curItem.tax_included_amount as any) -
                curItem.refund_amount) as any;
            }
            item.invoice_amount = new Decimal(item.settlement_amount ? item.settlement_amount : '0')
              .sub(new Decimal(item.write_off_amount ? item.write_off_amount : '0'))
              .toString();
            const find = chargeTableData.value.body.find(
              it => it.settlement_no === item.settlement_no,
            );
            if (find) return;
            chargeTableData.value.body.unshift(item);
          });
          chargeTableData.value.body = chargeTableData.value.body.filter(it => it.settlement_no);
          reset_invoice_amount();
        },
      },
    });
    const onQuickAdd = () => {
      dialogQuickAdd.show(invoiceLogic.companyForm.value.company_id);
    };
    // 匹配
    const openBillData = reactive({
      cycle: [],
      shop_id: '',
      match: async () => {
        if (!(openBillData.cycle && openBillData.cycle.length > 1)) return;
        const start_month = moment(openBillData.cycle[0]).format('YYYY-MM');
        const end_month = moment(openBillData.cycle[1]).format('YYYY-MM');
        const shop_id = openBillData.shop_id;
        const res = await SettlementGetSettlementByShopId({
          start_month,
          end_month,
          shop_id,
        });
        if (!res.data.success) return;

        const list: any[] = res.data.data;
        if (list.length === 0) {
          Message.success('未匹配到记录');
          return;
        }
        let item: any;
        list.forEach((curItem: any) => {
          item = {
            project_id: '',
            project_name: '',
            settlement_no: '',
            settlement_id: undefined,
            settlement_amount: '',
            invoice_amount: '',
            write_off_amount: '0',
            business_type: 0,
            settlement_no_disabled: true,
            ...curItem,
          };
          item.settlement_id = curItem.id;
          item.settlement_no = curItem.settlement_uid;
          item.settlement_amount = curItem.amount;
          item.write_off_amount = curItem.invoice_amount;
          item.invoice_amount = curItem.not_invoice_amount;
          const find = chargeTableData.value.body.find(
            (it: any) => it.settlement_no === item.settlement_no && it.shop_id === item.shop_id,
          );
          if (find) return;
          chargeTableData.value.body.unshift(item);
        });
        chargeTableData.value.body = chargeTableData.value.body.filter(it => it.settlement_no);
        reset_invoice_amount();
        openBillData.cycle = [];
        openBillData.shop_id = '';
        Message.success('匹配成功');
      },
    });
    const getSurplusInvoiceAmount = async (settlement_no: string) => {
      const [_, { data: response }] = await Promise.all([
        await sleep(500),
        await QuerySettlementInvoiceAmount({ settlement_no }),
      ]);
      return response;
    };
    const contract_id_list = ref<ContractSettlement[]>([]);
    // 关联客户合同输入值获取
    const { project_id } = useProjectBaseInfo();
    const oldParams = ref<any>({});
    const getContract = async (kw?: string) => {
      const project_list = chargeTableData.value.body.filter(it => it.project_id) || [];
      const params = {
        company_name: kw,
        only_main: 0,
        cooperation_id:
          project_list[0]?.business_type === 1
            ? project_list.length > 0
              ? project_list[0].project_id
              : project_id.value || projectForm.value.project_id
            : undefined,
        project_id:
          project_list[0]?.business_type === 1
            ? undefined
            : project_list.length > 0
            ? project_list[0].project_id
            : project_id.value || projectForm.value.project_id,
        contract_status: 2,
        partner_type: 1,
        settlement_ids:
          project_list.length > 0 && [2, 3, 8].includes(project_list[0].business_type)
            ? (project_list.filter(it => it.settlement_no) || [])
                .map(it => it.settlement_id || '')
                .join(',')
            : undefined,
      };
      if (JSON.stringify(oldParams.value) === JSON.stringify(params)) {
        return;
      }
      const res = await GetContractUid(params);
      oldParams.value = params;
      if (res.data.success) {
        contract_id_list.value = res.data.data.data || [];
        /** 判断已选合同是否存在 */
        const find = contract_id_list.value.find(
          it => it.contract_id === projectForm.value.contract_id,
        );
        projectForm.value.contract_id = find ? projectForm.value.contract_id : undefined;
        set_content_type();
        (ctx.refs.contractFormRef as ElForm)?.clearValidate();
      } else {
        contract_id_list.value = [];
        projectForm.value.contract_id = undefined;
      }
    };
    const iTime = ref<any>(null);
    watch(
      () => chargeTableData.value.body,
      () => {
        if (chargeTableData.value.body.length < 1) {
          oldParams.value = {};
          contract_id_list.value = [];
          projectForm.value.contract_id = undefined;
        } else {
          /** 防止频繁触发 */
          if (iTime.value) {
            clearTimeout(iTime.value);
          }
          iTime.value = setTimeout(function () {
            getContract('');
            console.log(new Date().toString());
          }, 1000);
        }
      },
      {
        deep: true,
      },
    );
    const disabledContent = computed(() => {
      const find = contract_id_list.value.find(
        it => it.contract_id === projectForm.value.contract_id,
      );
      return find?.invoice_content ? true : false;
    });

    return {
      invoiceFiledImage,
      getContract,
      contract_id_list,
      onQuickAdd,
      show,
      hide,
      rules,
      visible,
      saveForm,
      projectForm,
      basicColumn,
      companyRules,
      projectChange,
      companyColumn,
      handleBrandAdd,
      department_name,
      chargeTableData,
      ...invoiceLogic,
      handleBrandDelete,
      settlementInfoLabelStr,
      reset_invoice_amount,
      openBillType,
      openBillData,
      getSurplusInvoiceAmount,
      disabledContent,
      set_content_type,
    };
  },
  render() {
    const baseInfo = (
      <el-form
        attrs={{ model: this.projectForm }}
        rules={this.rules}
        ref="formRef"
        size="mini"
        inline={true}
        label-width="96px"
      >
        <el-form-item
          label="部门名称："
          rules={[{ required: true, trigger: 'change', message: '请选择部门名称' }]}
          prop={'department_id'}
          class="common-input"
        >
          {/*<feishu_department_select
            v-model={this.projectForm.department_id}
            placeholder="请选择员工部门"
            checkStrictly={true}
            multiple={false}
          />*/}
          <department-select
            clearable
            defaultExpandedKeys={
              this.projectForm.department_id ? [this.projectForm.department_id] : []
            }
            v-model={this.projectForm.department_id}
          />
        </el-form-item>
        <el-form-item
          label="开票金额："
          rules={[{ required: true, trigger: 'change' }]}
          class="common-input"
        >
          <el-input disabled v-model={this.projectForm.invoice_amount} />
        </el-form-item>
        {this.basicColumn.map((item: any) => {
          if (
            item.component === 'el-input' &&
            ((this.projectForm.record_id === undefined && item.label !== '预收编号：') ||
              (this.projectForm.record_id !== undefined && item.label === '预收编号：'))
          ) {
            const { label, className = '', prop, children } = item;
            return (
              <el-form-item label={label} class={'common-input ' + className} prop={prop}>
                <el-input
                  disabled={this.projectForm.record_id && item.label === '预收编号：'}
                  v-model={this.projectForm[children.key]}
                  {...children}
                />
              </el-form-item>
            );
          } else if (item.component === 'el-select') {
            const { label, className = '', prop, children, selectOptions, on } = item;
            return (
              <el-form-item label={label} class={'common-select ' + className} prop={prop}>
                <el-select
                  popper-class="el-select-popper-mini"
                  v-model={this.projectForm[children.key]}
                  attrs={{ ...children.attrs }}
                  on={{ ...on }}
                  disabled={
                    this.projectForm.record_id && item.label === '收到款项：' ? true : false
                  }
                >
                  {selectOptions.data.map((item: any) => {
                    return (
                      <el-option
                        class={selectOptions.className}
                        key={item[selectOptions.key]}
                        label={item[selectOptions.key]}
                        value={item[selectOptions.val]}
                      />
                    );
                  })}
                </el-select>
              </el-form-item>
            );
          } else if (
            item.component === 'el-date-picker' &&
            ((this.projectForm.record_id && this.projectForm.is_received === 0) ||
              this.projectForm.record_id === undefined)
          ) {
            const { label, className = '', prop, children } = item;
            return (
              <el-form-item
                label={label}
                class={'common-date-picker ' + className}
                prop={prop}
                style={{
                  width:
                    this.projectForm.record_id !== undefined
                      ? '266px !important'
                      : '286px !important',
                  marginRight: '0px',
                }}
              >
                <el-date-picker
                  placeholder="请选择日期"
                  value-format="yyyy-MM-dd"
                  format="yyyy.MM.dd"
                  v-model={this.projectForm[children.key]}
                  {...children}
                />
              </el-form-item>
            );
          }
        })}
        {this.projectForm.is_received === 1 && this.projectForm.record_id === undefined && (
          <el-form-item
            label="收款编号："
            prop="achievement_uid"
            rules={[{ required: true, message: '请输入收款编号', trigger: 'blur' }]}
            class="common-input"
            style="margin-right: 18px;"
          >
            <el-input v-model={this.projectForm.achievement_uid} placeholder="请输入收款编号" />
          </el-form-item>
        )}
        {/*{this.isFromPrePay === true && (
          <el-form-item
            label="预收编号："
            prop="achievement_uid"
            rules={[{ required: true, message: '请输入预收编号', trigger: 'blur' }]}
            class="common-input"
            style="margin-right: 18px;"
          >
            <el-input v-model={this.projectForm.achievement_uid} placeholder="请输入预收编号" />
          </el-form-item>
        )}*/}
      </el-form>
    );

    const billingInfo = (
      <div class="charge-company">
        <div class="title">开票信息</div>
        <el-form
          attrs={{ model: this.companyForm }}
          rules={this.companyRules}
          ref="projectFormRef"
          size="mini"
          inline={true}
          label-width="96px"
        >
          {this.companyColumn.map((item: any) => {
            if (item.component === 'el-select-sale') {
              const { label, className = '', prop, children, on } = item;
              return (
                <el-form-item label={label} class={'common-select ' + className} prop={prop}>
                  <el-select
                    popper-class="el-select-popper-mini"
                    v-model={this.companyForm[children.key]}
                    attrs={{ ...children.attrs }}
                    on={{ ...on }}
                  >
                    {(E.project.ProprietorTypeOption || []).map((item: any) => {
                      return <el-option key={item.value} label={item.label} value={item.label} />;
                    })}
                  </el-select>
                </el-form-item>
              );
            } else if (item.component === 'el-input') {
              const { label, className = '', prop, children } = item;
              return (
                <el-form-item label={label} class={'common-input ' + className} prop={prop}>
                  <el-input
                    v-model={this.companyForm[children.key]}
                    {...children}
                    attrs={{ ...children.attrs }}
                  />
                </el-form-item>
              );
            } else if (item.component === 'el-autocomplete') {
              const { label, className = '', prop, children, on } = item;
              return (
                <el-form-item label={label} class={'common-select ' + className} prop={prop}>
                  <el-autocomplete
                    popper-class="qnmlgb-sss el-select-popper-mini"
                    vModel_trim={this.companyForm[children.key]}
                    fetch-suggestions={this.loadCompany}
                    value-key="company_name"
                    attrs={{ ...children.attrs }}
                    on={{ ...on }}
                  />
                </el-form-item>
              );
            } else if (item.component === 'el-select-invoice') {
              const { label, className = '', prop, children, on } = item;
              return (
                /**  disabled={this.disabledContent} */
                <el-form-item label={label} class={'common-select ' + className} prop={prop}>
                  <el-select
                    popper-class="el-select-popper-mini"
                    v-model={this.companyForm[children.key]}
                    attrs={{ ...children.attrs }}
                    on={{ ...on }}
                  >
                    {[
                      { label: '信息服务费', value: 1 },
                      { label: '信息技术服务费', value: 2 },
                      { label: '其它', value: 3 },
                    ].map((item: any) => {
                      return <el-option key={item.value} label={item.label} value={item.value} />;
                    })}
                  </el-select>
                </el-form-item>
              );
            }
          })}
          {this.companyForm.content_type && this.companyForm.content_type === 3 && (
            <el-form-item
              label="开票内容："
              class={'common-input-billing'}
              prop="content_type_other"
            >
              <div style="display: inline-block">
                <div class="contract-type-div">
                  <el-input
                    style="width: 170px"
                    v-model={this.companyForm.content_type_other}
                    placeholder="请输入一级税目*二级税目"
                  ></el-input>
                  <span class="contract-type-explain">
                    <el-popover
                      popper-class="explain-pover"
                      placement="top-start"
                      width="620"
                      trigger="hover"
                    >
                      <div class="date-box-content">
                        <img
                          style="height: 360px; width: 600px; border: 1px solid var(--border-line-color); "
                          src={this.invoiceFiledImage}
                        />
                      </div>
                      <el-button slot="reference">
                        <tg-icon
                          name="ico-icon_explain"
                          style="font-size: 14px; color: var(--icon-color)"
                        ></tg-icon>
                      </el-button>
                    </el-popover>
                  </span>
                </div>
              </div>
            </el-form-item>
          )}
          <el-form-item
            label="发票备注："
            class="common-input-textarea"
            style="display:block;width:860px !important"
          >
            <el-input
              type="textarea"
              style="width: 484px"
              placeholder="发票如需备注信息，请在此输入"
              maxlength="100"
              show-word-limit
              v-model={this.companyForm.invoice_remark}
            />
          </el-form-item>
          {this.projectForm.invoice_type === 3 && (
            <el-form-item
              label="电子邮箱："
              class={'common-input-billing'}
              prop="email_address"
              rules={[
                {
                  required: true,
                  message: '请输入电子邮箱',
                  trigger: ['blur'],
                },
              ]}
            >
              <el-input
                style="width:170px"
                v-model={this.companyForm.email_address}
                key="email_address"
                placeholder="请输入电子邮箱"
                // maxlength={20}
              />
            </el-form-item>
          )}
        </el-form>
      </div>
    );

    return (
      <el-dialog
        class="tg-dialog-classic tg-dialog-vcenter-new tg-invoice-dialog"
        width="888px"
        visible={this.visible}
        close-on-click-modal={false}
        close-on-press-escape={false}
        wrapperClosable={false}
        onClose={this.hide}
      >
        <template slot="title">{this.title || '开票申请'}</template>
        <div class="new-initiate-invoice">
          <div class="basic-info">
            <div class="title">基本信息</div>
            {baseInfo}
            {billingInfo}
            {this.projectForm.record_id === undefined && (
              <div class="charge-details">
                <div class="title">
                  费用明细
                  {this.companyForm.company_id && this.openBillType !== 1 && (
                    <tg-button type="link" style="font-size:12px" onClick={this.onQuickAdd}>
                      快速添加
                    </tg-button>
                  )}
                </div>
                <div>
                  {this.openBillType === 1 && (
                    <div class="charge-tools">
                      <div>开票结算周期：</div>
                      <div>
                        <el-date-picker
                          range-separator="~"
                          size="small"
                          type="monthrange"
                          style="width:100%"
                          v-model={this.openBillData.cycle}
                        />
                      </div>
                      <div>开票商家ID：</div>
                      <div>
                        <el-input
                          size="small"
                          style="width:100%"
                          v-model={this.openBillData.shop_id}
                        />
                      </div>
                      <div>
                        <tg-button
                          type="primary"
                          style="width:100%"
                          onClick={this.openBillData.match}
                        >
                          匹配
                        </tg-button>
                      </div>
                    </div>
                  )}
                </div>
                <div class="charge-table">
                  <div class="charge-table-head">
                    <div class="charge-table-tr">
                      {this.chargeTableData.head.map((item: any) => {
                        if (item.text === '结算单编号') {
                          return (
                            <div class="charge-table-td">
                              {this.chargeTableData.body.some(item => {
                                return item.business_type === 5;
                              }) ? (
                                ''
                              ) : (
                                <span class="required">*</span>
                              )}
                              <span class="label">{item.text}</span>
                            </div>
                          );
                        } else {
                          return (
                            <div class="charge-table-td">
                              <span class="required">*</span>
                              <span class="label">{item.text}</span>
                            </div>
                          );
                        }
                      })}
                      <div class="charge-table-td delete">
                        <span class="label">操作</span>
                      </div>
                    </div>
                  </div>
                  <div class="charge-table-body">
                    {this.chargeTableData.body.map((item: any, key: number) => {
                      return (
                        <div class="charge-table-tr">
                          <div class="charge-table-td">
                            <el-autocomplete
                              popper-class="el-select-popper-mini"
                              size="mini"
                              vModel_trim={item.project_name}
                              fetch-suggestions={(queryString: string, cb: any) => {
                                this.loadCooperation(queryString, cb);
                                if (!(queryString + ''.trim())) {
                                  this.chargeTableData.body[key].settlement_no = '';
                                  this.chargeTableData.body[key].settlement_id = undefined;
                                  this.chargeTableData.body[key].settlement_amount = '';
                                  this.chargeTableData.body[key].invoice_amount = '';
                                  this.chargeTableData.body[key].business_type = 0;
                                  this.chargeTableData.body[key].write_off_amount = '0';
                                  this.settlementList = [];
                                }
                              }}
                              value-key="project_name"
                              placeholder="请输入并选择项目"
                              onSelect={(pitem: any) => {
                                this.projectChange(pitem.id, key, pitem.business_type);
                              }}
                            />
                          </div>
                          <div class="charge-table-td">
                            <el-select
                              popper-class="el-select-popper-mini"
                              v-model={item.settlement_no}
                              placeholder="请选择结算编号"
                              disabled={item.settlement_no_disabled}
                              size="mini"
                              onChange={async (uid: string[]) => {
                                const response = await this.getSurplusInvoiceAmount(
                                  item.settlement_no,
                                );
                                const curItem = this.settlementList.find(curSettItem =>
                                  uid.includes(curSettItem.settlement_uid),
                                );
                                item.settlement_id = curItem?.id;
                                item.settlement_amount = curItem?.tax_included_amount;
                                item.write_off_amount = curItem?.write_off_amount;
                                if (curItem && curItem.has_refund_settlement === 1) {
                                  item.settlement_amount =
                                    (curItem.tax_included_amount as any) - curItem.refund_amount;
                                }
                                if (response.success && response.data) {
                                  item.invoice_amount = response.data.surplus_invoice_amount;
                                  item.invoice_max_amount = response.data.surplus_invoice_amount;
                                } else {
                                  item.invoice_amount = new Decimal(
                                    item.settlement_amount ? item.settlement_amount : '0',
                                  )
                                    .sub(
                                      new Decimal(
                                        item.write_off_amount ? item.write_off_amount : '0',
                                      ),
                                    )
                                    .toString();
                                }

                                this.reset_invoice_amount();
                              }}
                            >
                              {this.settlementList.map((item: any) => {
                                const uids = this.chargeTableData.body.map(
                                  uitems => uitems.settlement_no,
                                );
                                return (
                                  <el-option
                                    class="send-type-option"
                                    disabled={uids.includes(item.settlement_uid)}
                                    key={item.settlement_uid}
                                    label={this.settlementInfoLabelStr(item)}
                                    value={item.settlement_uid}
                                  />
                                );
                              })}
                            </el-select>
                          </div>
                          <div class="charge-table-td">
                            <el-input
                              disabled
                              placeholder="请输入结算金额"
                              size="mini"
                              v-model={item.settlement_amount}
                            />
                          </div>
                          <div class="charge-table-td">
                            <el-input
                              placeholder="请输入开票金额"
                              size="mini"
                              value={item.invoice_amount}
                              onInput={(val: string) => {
                                if (!Number(val)) {
                                  item.invoice_amount = '';
                                  this.reset_invoice_amount();
                                  return false;
                                }
                                let nowNum = new Decimal(
                                  item.settlement_amount ? item.settlement_amount : 0,
                                ).sub(
                                  new Decimal(item.write_off_amount ? item.write_off_amount : 0),
                                );
                                if (item.invoice_max_amount) {
                                  nowNum = new Decimal(item.invoice_max_amount);
                                }

                                if (new Decimal(val ? val : '0').greaterThan(nowNum)) {
                                  this.$message.warning(`开票金额最多是${nowNum.toNumber()}`);
                                  item.invoice_amount = nowNum.toString();
                                }
                                // if (item.business_type === 5) {
                                //   item.invoice_amount = getPositiveNumber(val);
                                // } else {
                                item.invoice_amount = new Decimal(
                                  val ? val : 0,
                                ).greaterThanOrEqualTo(new Decimal(nowNum ? nowNum : 0))
                                  ? nowNum.toNumber()
                                  : getPositiveNumber(val);
                                // }
                                // const total = this.chargeTableData.body.reduce(
                                //   (total, next: any) => total + next.invoice_amount * 1,
                                //   0,
                                // );
                                // this.projectForm.invoice_amount =
                                //   ((total * 100).toFixed(0) as any) / 100;
                                this.reset_invoice_amount();
                              }}
                            />
                          </div>
                          <div class="charge-table-td delete">
                            <tg-icon
                              disabled={this.chargeTableData.body.length <= 1}
                              class="ico-btn"
                              name="ico-btn-delete"
                              onClick={() => {
                                this.handleBrandDelete(key);
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div class="charge-table-btn">
                    <el-button
                      disabled={this.chargeTableData.body.length >= 7}
                      size="mini"
                      type="text"
                      icon="el-icon-plus"
                      onClick={() => {
                        this.handleBrandAdd();
                      }}
                    >
                      添加明细
                    </el-button>
                  </div>
                </div>
              </div>
            )}
            {this.projectForm.record_id && <div class="title">其他信息</div>}
            <div class="charge-company" style="margin-top:18px">
              <el-form
                size="mini"
                ref="contractFormRef"
                inline={true}
                label-width="96px"
                attrs={{ model: this.projectForm }}
              >
                <el-form-item
                  prop="contract_id"
                  label="关联合同："
                  rules={[
                    {
                      required: this.projectForm.is_received === 0 && this.projectForm.record_id,
                      message: '请选择关联合同',
                      trigger: ['change', 'blur'],
                    },
                  ]}
                >
                  <div style="display: flex; align-items: center">
                    <el-select
                      style="width: 484px"
                      popper-class="el-select-popper-mini"
                      filterable
                      remote
                      clearable
                      v-model={this.projectForm.contract_id}
                      remote-method={this.getContract}
                      onChange={(val: any) => {
                        /*const find = this.contract_id_list.find(
                          (it: any) => it.contract_id === val,
                        );*/
                        this.set_content_type();
                      }}
                    >
                      {this.contract_id_list.map((item: any) => {
                        return (
                          <el-option
                            key={item.contract_id}
                            label={
                              item.company_name +
                              '  (' +
                              item.sign_type_name +
                              ')  ' +
                              item.coop_start_date +
                              '-' +
                              item.coop_end_date
                            }
                            value={item.contract_id}
                          />
                        );
                      })}
                    </el-select>
                  </div>
                </el-form-item>
                <el-form-item
                  label="申请说明："
                  class="common-input-textarea"
                  style="display:block;width:860px !important"
                >
                  <el-input
                    type="textarea"
                    style="width: 484px"
                    placeholder="请输入内容"
                    maxlength="50"
                    show-word-limit
                    v-model={this.companyForm.remark}
                  />
                </el-form-item>
                <el-form-item
                  label="附件："
                  style="margin-right:0;display:block;width:860px !important"
                >
                  <tg-upload
                    action="/api/approval/upload_approval_attachment"
                    show-file-list={false}
                    disabled={this.companyForm.attachment.length >= 5}
                    beforeUpload={FormValidation.ValidationFileUpload({
                      file: true,
                      image: true,
                      excel: true,
                      fileSize: 30,
                    })}
                    success={(res: { data: { source: string } }) => {
                      this.companyForm.attachment.push(res.data.source);
                    }}
                  >
                    <tg-button
                      disabled={this.companyForm.attachment.length >= 5}
                      name="ico-upload"
                      icon="ico-btn-upload"
                      size="small"
                    >
                      上传附件
                    </tg-button>
                    <span class="file-tips">
                      支持扩展名：.docx .doc .xls .xlsx .jpg .png；
                      最多上传5个文件（单个文件大小不超过30M）
                    </span>
                  </tg-upload>

                  <upload-file-list
                    class="invoice-upload-list"
                    v-model={this.companyForm.attachment}
                    inline
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <template slot="footer">
          <tg-button onClick={this.hide}>取消</tg-button>
          <tg-button type="primary" onClick={this.saveForm} v-loading={this.saveLoading}>
            保存
          </tg-button>
        </template>
      </el-dialog>
    );
  },
});
