/**
 * 用款申请
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-17 10:30:42
 */
import {
  computed,
  defineComponent,
  nextTick,
  PropType,
  ref,
  UnwrapRef,
} from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { ApprovalInfo, LoanParams } from '@/types/tiange/workbench';
import { RadioOption } from '@/types/vendor/radio';
import { ValidateCallback } from '@/types/vendor/form';
import { SaveTransferApply } from '@/services/workbentch';
import { LiveDisplayProjectIdListNoDefault } from '@/services/live';
import { ElInput } from 'element-ui/types/input';

/** 10万 */
const ONE_MILLION = 100_000;
/** 50万 */
const FIVE_MILLION = 500_000;

// * 输入字符限制 - 中英文数字
// * 备用
// const __RegCharCnOrEn =
//   /^(?:[a-zA-Z\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/u;

export default defineComponent({
  name: 'TgWorkbenchLoanCreateModal',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    approval: {
      type: Object as PropType<ApprovalInfo>,
    },
  },
  methods: {
    // 显示
    show(approvalInfo?: ApprovalInfo) {
      this.resetForm();
      this.$nextTick(() => {
        (this.$refs.loanFormRef as ElForm).clearValidate();
      });

      if (approvalInfo === undefined || JSON.stringify(approvalInfo) === '{}') {
        nextTick(() => {
          this.autoFocuseRef?.focus();
        });
        return;
      }

      const {
        level_three_types,
        transfer_amount_str,
        transfer_date,
        bank_card_number,
        bank_of_deposit,
        collecting_company,
        collecting_shop_name,
        approval_stream,
        remark,
        pay_reason,
        // 对公银行
        // 支付宝
        collecting_person,
        alipay_account,
        cost_type,
        cost,
        ...rest
      } = approvalInfo;

      this.loanForm.level_three_types = level_three_types;
      this.loanForm.transfer_amount = transfer_amount_str;
      this.loanForm.transfer_date = transfer_date;
      this.loanForm.bank_card_number = bank_card_number;
      this.loanForm.bank_of_deposit = bank_of_deposit;
      this.loanForm.collecting_company = collecting_company;
      this.loanForm.collecting_shop_name = collecting_shop_name;
      this.loanForm.collecting_person = collecting_person;
      this.loanForm.alipay_account = alipay_account;
      this.loanForm.pay_reason = pay_reason;
      this.loanForm.remark = remark;
      this.loanForm.approval_stream = [];
      if (cost !== null && cost !== undefined && cost.length > 0) {
        // @ts-ignore
        this.loanForm.cost = [...cost];
      }

      if (cost_type !== null) {
        // @ts-ignore
        this.loanForm.cost_type = cost_type;
      }

      // @ts-ignore
      this.loanForm.business_type = rest.business_type;

      if (cost && cost.length > 0) {
        this.project_options = cost.map((item: any) => {
          return {
            id: item.project_id,
            project_uid: item.project_uid,
          };
        });
      }
    },
    // 弹窗确认操作
    async handledialogSubmit() {
      const result = await new Promise(resolve =>
        (this.$refs.loanFormRef as ElForm).validate(result => resolve(result)),
      );

      if (!result) {
        return;
      }

      this.saveLoading = true;
      const saveParams: any = { ...this.loanForm };

      if (saveParams.business_type === 1) {
        delete saveParams.cost_type;
        delete saveParams.cost;
      } else if (
        saveParams.cost_type !== 2 &&
        saveParams.cost_type !== 3 &&
        saveParams.cost_type !== 5
      ) {
        delete saveParams.cost;
      }

      const { data: response } = await SaveTransferApply(saveParams);
      this.saveLoading = false;

      if (response.success) {
        this.$message.success('保存成功');
        this.emitClose(true);
        this.$emit('reload:loan');
      } else {
        this.$message.error(response.message ?? '保存失败');
      }
    },
    // 关闭弹窗
    handledialogCancel() {
      this.resetForm();
      this.loanForm.remark = '';
      this.emitClose();
    },
  },
  setup(props, ctx) {
    const saveLoading = ref(false);
    const rootDomRef = ref<UnwrapRef<{ scrollTop: number } | null>>(null);
    const autoFocuseRef = ref<ElInput | undefined>(undefined);

    const paymentRadioOptions = ref<RadioOption[]>([
      {
        value: 3,
        label: '对公银行',
      },
      {
        value: 4,
        label: '对公支付宝',
      },
    ]);
    const businessTypeRadioOptions = ref<RadioOption[]>([
      { label: '营销业务', value: 1 },
      { label: '抖音店播', value: 3 },
      { label: '淘宝店播', value: 2 },
    ]);
    const costTypeRadioOptions = ref<RadioOption[]>([
      { label: '主播服务费', value: 2 },
      { label: '固定资产采购', value: 3 },
      { label: '装修', value: 5 },
      // 临时封印 by 当归
      // @date 2021-04-12
      // { label: '水电', value: 4 },
      // { label: '房租', value: 6 },
    ]);

    /** 表单 */
    const loanForm = ref<LoanParams>({
      approval_type: 1,
      level_two_types: 1,
      level_three_types: 3,
      transfer_amount: '',
      transfer_date: new Date().toLocaleDateString().replace('/', '-').replace('/', '-'),
      bank_card_number: '',
      bank_of_deposit: '',
      collecting_company: '',
      remark: '',
      collecting_shop_name: '',
      approval_stream: [],
      pay_reason: '',
      collecting_person: '',
      alipay_account: '',
      business_type: 1,
      cost_type: 2,
      cost: [{ price: '', project_id: '' }],
    });
    const addCost = () => {
      loanForm.value.cost.push({ project_id: '', price: '' });
    };
    const deleteCost = (index: number) => {
      loanForm.value.cost.splice(index, 1);
    };
    const resetForm = () => {
      loanForm.value.approval_type = 1;
      loanForm.value.level_two_types = 1;
      loanForm.value.level_three_types = 3;
      loanForm.value.transfer_amount = '';
      loanForm.value.transfer_date = new Date()
        .toLocaleDateString()
        .replace('/', '-')
        .replace('/', '-');
      loanForm.value.bank_card_number = '';
      loanForm.value.bank_of_deposit = '';
      loanForm.value.collecting_company = '';
      loanForm.value.remark = '';
      loanForm.value.collecting_shop_name = '';
      loanForm.value.approval_stream = [];
      loanForm.value.pay_reason = '';
      loanForm.value.collecting_person = '';
      loanForm.value.alipay_account = '';
      loanForm.value.business_type = 1;
      loanForm.value.cost_type = 2;
      loanForm.value.cost = [{ price: '', project_id: '' }];
    };

    /** 从表单转化请求参数 */
    const getPayloadFromForm = (): LoanParams => {
      const {
        approval_id,
        level_three_types,
        // 对公银行
        bank_card_number,
        collecting_company,
        bank_of_deposit,
        // 支付宝
        collecting_person,
        alipay_account,
        // 审批流程 - 废弃天鸽采用OA数据，不再提交
        approval_stream,
        ...rest
      } = loanForm.value;

      return level_three_types === 3
        ? {
            level_three_types,
            bank_card_number,
            collecting_company,
            bank_of_deposit,
            approval_stream: [],
            ...rest,
          }
        : {
            level_three_types,
            collecting_person,
            alipay_account,
            approval_stream: [],
            ...rest,
          };
    };

    // 验证规则
    const loanFormRules = ref({
      level_two_types: [{ required: true, message: '请选择用款类型', trigger: 'change' }],
      collecting_shop_name: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
      transfer_amount: [
        {
          required: true,
          message: '请输入用款总额',
          trigger: 'blur',
        },
        {
          validator: (rule: any, value: string, callback: ValidateCallback) => {
            if (Number(value) <= 0) {
              callback(new Error('用款总额必须大于0'));
            }
            callback();
          },
          trigger: 'change',
        },
      ],
      transfer_date: [{ required: true, message: '请输入用款日期', trigger: 'blur' }],
      level_three_types: [{ required: true, message: '请选择收款方式', trigger: 'change' }],
      // 对公银行
      bank_card_number: [{ required: true, message: '请输入银行卡号', trigger: 'blur' }],
      collecting_company: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
      bank_of_deposit: [{ required: true, message: '请输入开户行', trigger: 'blur' }],
      // 对公支付宝
      collecting_person: [
        {
          required: true,
          message: '请输入收款人姓名',
          trigger: 'blur',
        },
        {
          validator: (rule: any, value: string, callback: ValidateCallback) => {
            if (value.trim() === '') {
              callback(new Error('请输入收款人姓名'));
            } else {
              callback();
            }
          },
          trigger: 'blur',
        },
      ],
      alipay_account: [
        {
          required: true,
          message: '请输入支付宝账号',
          trigger: 'blur',
        },
        {
          required: true,
          validator: (rule: any, value: string, callback: ValidateCallback) => {
            const RegEmail = /^([\w\-.])+@([\w_\-.])+\.([A-Za-z]{2,4})$/u;
            if (/^1\d{10}$/gu.test(value)) {
              callback();
            } else if (RegEmail.test(value)) {
              callback();
            } else {
              callback(new Error('请输入正确的支付宝账号'));
            }
          },
          trigger: 'blur',
        },
      ],
      pay_reason: [{ required: true, message: '请输入付款事由', trigger: 'blur' }],
      cost_project: [
        { required: true, message: '请输入项目编号', trigger: 'blur' },
        {
          validator: (rule: any, value: string, callback: ValidateCallback) => {
            if (value === '' || value === null || value === undefined) {
              callback(new Error('请输入项目编号'));
              return;
            }
            callback();
          },
          trigger: 'change',
        },
      ],
      cost_price: [
        { required: true, message: '请输入项目分摊金额', trigger: 'blur' },
        {
          validator: (rule: any, value: string, callback: ValidateCallback) => {
            if (Number(value) <= 0) {
              callback(new Error('金额必须大于0'));
            }
            callback();
          },
          trigger: 'change',
        },
      ],
    });

    const inputLoanAmount = (value: string) => {
      const val = value.replace(/[^\d.]+/gu, '').replace(/^0+(?=\d)/gu, '') ?? '';
      const result = /\d+(?:\.\d{0,2})?/gu.exec(val) ?? [''];

      loanForm.value.transfer_amount = result[0];
    };
    const inputLoanAmountCost = (index: number, value: string) => {
      const val = value.replace(/[^\d.]+/gu, '').replace(/^0+(?=\d)/gu, '') ?? '';
      const result = /\d+(?:\.\d{0,2})?/gu.exec(val) ?? [''];
      loanForm.value.cost[index].price = result[0];
    };

    const input_bank_card_number = (value: string) => {
      const val = value.replace(/\D+/gu, '') ?? '';
      loanForm.value.bank_card_number = val;
    };

    /** 用款总额是否低于 10 万 */
    const isLessThanOneMillion = computed(
      () => Number(loanForm.value.transfer_amount) < ONE_MILLION,
    );

    /** 用款总额是否大于等于 50 万 */
    const isMoreThanFiveMillion = computed(
      () => Number(loanForm.value.transfer_amount) >= FIVE_MILLION,
    );

    // 抛出关闭事件
    const emitClose = (success = false) => ctx.emit('dialog:close', success);
    const project_options = ref<UnwrapRef<any[]>>([]);
    const onProjectChange = () => {
      //
    };
    const getCustmerByContractNo = (search: string) => {
      LiveDisplayProjectIdListNoDefault({
        project_uid: search,
        business_type: loanForm.value.business_type,
      }).then(res => {
        project_options.value = res.data.data;
      });
    };

    const businessTypeChange = (val: any) => {
      if (loanForm.value.cost) {
        const newCost = loanForm.value;
        newCost.cost = newCost.cost.map(item => {
          item.project_id = '';
          return item;
        });
        loanForm.value = newCost;
        project_options.value = [];
        if (rootDomRef.value) {
          rootDomRef.value.scrollTop = 10000;
        }
      }
    };

    return {
      autoFocuseRef,
      rootDomRef,
      businessTypeChange,
      project_options,
      onProjectChange,
      getCustmerByContractNo,
      saveLoading,
      paymentRadioOptions,
      businessTypeRadioOptions,
      costTypeRadioOptions,
      loanForm,
      resetForm,
      getPayloadFromForm,
      loanFormRules,
      inputLoanAmount,
      inputLoanAmountCost,
      input_bank_card_number,
      isLessThanOneMillion,
      isMoreThanFiveMillion,
      emitClose,
      addCost,
      deleteCost,
    };
  },
  watch: {
    visible(val, oldVal) {
      if (val && val !== oldVal) {
        this.show(this.approval);
      }
    },
  },
});
